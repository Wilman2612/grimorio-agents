#!/usr/bin/env node
// Audits grimorio's rule corpus WITHOUT an LLM. Three agents fabricated their
// findings on 2026-08-03; this exists so the same questions get answered by a
// script that cannot invent a row.
//
// It answers, per rule: what KIND it is, its CONDITION, its IMPERATIVE, its file:line.
// And per file: who READS it and what it LOADS, from frontmatter.
//
// Usage:  node scripts/audit-chain.mjs [--json] [--malformed] [--dupes]

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";

// The clause vocabulary, from .claude/skills/prompt-writing-quality/control-flow-vocabulary.md
// plus the four openers. Each kind declares whether it REQUIRES a condition.
const KINDS = {
  ALWAYS: { needsCondition: false },
  NEVER: { needsCondition: false },
  BEFORE: { needsCondition: true },
  WHEN: { needsCondition: true },
  UNLESS: { needsCondition: true },
  UNTIL: { needsCondition: true },
  FALLBACK: { needsCondition: true },
  ENSURE: { needsCondition: false },
  VERIFY: { needsCondition: false },
  GIVEN: { needsCondition: true },
  PRIORITIZE: { needsCondition: false },
  FAVOR: { needsCondition: false },
  IGNORE: { needsCondition: false },
  EXCLUDE: { needsCondition: false },
  CHECK: { needsCondition: false },
};

const OPENERS = Object.keys(KINDS).join("|");
const RULE = new RegExp(`^\\s*[-*0-9.)\\s]*\\*\\*(${OPENERS})\\b([^*]*)`);
const ARROW = "⟶"; // U+27F6. NOT "→": that is the POINTER separator and appears 1197 times in
// the corpus, so reusing it makes a pointer and a rule indistinguishable. "→→" was rejected because it
// CONTAINS "→" as a substring, so a pointer search would false-positive on every rule. Spec:
// .claude/skills/prompt-writing-quality/format-guide.md

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === "worktrees" || e === ".git") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return fm;
}

// A rule may WRAP across lines. Joining only the physical line under-reports every
// wrapped rule -- measured: the first version missed a rule whose condition sat on
// its continuation line. A rule ends at a blank line, at the next rule, or at a
// heading; everything between is one logical rule.
function logicalLines(text) {
  const raw = text.split("\n");
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    if (!RULE.test(raw[i])) continue;
    let joined = raw[i];
    for (let j = i + 1; j < raw.length; j++) {
      const nxt = raw[j];
      if (!nxt.trim() || RULE.test(nxt) || /^\s{0,3}#/.test(nxt) || /^\s*\|/.test(nxt)) break;
      if (!/^\s{2,}\S/.test(nxt)) break; // continuation lines are indented
      joined += " " + nxt.trim();
    }
    out.push({ text: joined, line: i + 1 });
  }
  return out;
}

function scan(file) {
  const text = readFileSync(file, "utf8");
  const fm = frontmatter(text);
  const rules = [];
  for (const { text: line, line: lineNo } of logicalLines(text)) {
    const m = line.match(RULE);
    if (!m) continue;
    const kind = m[1];
    // strip bold markers so a wrapped rule's ** does not truncate the body
    const rest = line.slice(line.indexOf(kind) + kind.length).replace(/\*\*/g, "").trim();
    const hasArrow = rest.includes(ARROW);
    const [cond, imp] = hasArrow ? rest.split(ARROW).map((s) => s.trim()) : [null, rest];
    rules.push({
      file,
      line: lineNo,
      kind,
      condition: cond,
      imperative: imp,
      malformed: KINDS[kind].needsCondition && !hasArrow,
    });
  }
  return { file, reader: fm.reader ?? null, loads: fm.loads ?? null, rules };
}

const roots = [".claude/agents", ".claude/skills"];
const files = roots.flatMap((r) => { try { return walk(r); } catch { return []; } });
// SINGLE FILES, not directories -- walk() calls readdirSync, which throws ENOTDIR on a file and the catch
// above would silently drop it. Pushed directly instead; see commit message for why the ledger pair joined
// CLAUDE.md here 2026-08-08 (previously-unaudited cross-file anchors).
for (const f of ["CLAUDE.md", ".claude/grimorio-defects.md", ".claude/grimorio-defects-narrative.md"]) {
  try { statSync(f); files.push(f); } catch {}
}

// SHAPE: what a file CONTAINS, so its composition is readable without reading its 500 lines. Every
// non-blank line is exactly one of these, so the counts sum to the file and cannot quietly disagree.
function shape(file) {
  const raw = readFileSync(file, "utf8").split("\n");
  const c = { heading: 0, rule: 0, table: 0, code: 0, list: 0, prose: 0, blank: 0 };
  let fenced = false;
  let depth = { h1: 0, h2: 0, h3: 0 };
  for (const line of raw) {
    if (/^\s*```/.test(line)) { fenced = !fenced; c.code++; continue; }
    if (fenced) { c.code++; continue; }
    if (!line.trim()) { c.blank++; continue; }
    const h = line.match(/^(#{1,6})\s/);
    if (h) { c.heading++; if (h[1].length <= 3) depth["h" + h[1].length]++; continue; }
    if (RULE.test(line)) { c.rule++; continue; }
    if (/^\s*\|/.test(line)) { c.table++; continue; }
    if (/^\s*([-*+]|\d+[.)])\s/.test(line)) { c.list++; continue; }
    c.prose++;
  }
  return { file, lines: raw.length, ...c, ...depth };
}

// OUTLINE: the file compressed to what it SAYS, not how much of it there is. Headings are the skeleton
// (a heading is already a short description), rules keep their opener and enough words to identify them,
// prose collapses to a count. A 700-line skill becomes one screen.
function outline(file) {
  // \r is stripped, not tolerated: this repo checks out CRLF, and a `$`-anchored match silently fails
  // against a trailing \r because JS `.` will not cross a line terminator. Every heading was invisible.
  const raw = readFileSync(file, "utf8").split(/\r?\n/);
  const out = [];
  let fenced = false;
  let pending = { prose: 0, table: 0, list: 0 };
  const flush = () => {
    const bits = Object.entries(pending).filter(([, n]) => n).map(([k, n]) => `${k} x${n}`);
    if (bits.length) out.push({ kind: "fill", text: bits.join(", ") });
    pending = { prose: 0, table: 0, list: 0 };
  };
  for (const line of raw) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced || !line.trim()) continue;
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flush(); out.push({ kind: "head", depth: h[1].length, text: h[2].replace(/[*`]/g, "").trim() }); continue; }
    const r = line.match(RULE);
    if (r) {
      flush();
      const body = line.slice(line.indexOf(r[1]) + r[1].length).replace(/\*\*/g, "").replace(/^[\s—-]+/, "");
      const [cond, imp] = body.includes(ARROW) ? body.split(ARROW) : [null, body];
      out.push({ kind: "rule", opener: r[1], cond: cond && words(cond, 8), imp: words(imp, 10) });
      continue;
    }
    // A reference is STRUCTURE, not prose: it is the file's edge to another file, and an outline that
    // hides it shows a shape with no connections. Rendered in the CURRENT grammar -- this used to print
    // a `loads:` footer in the retired single-axis `skill:` form and showed no repo/tmp/agent/cold edge.
    const refs = [
      ...[...line.matchAll(TWO_AXIS)].map((m) => m[0]),
      ...[...line.matchAll(AGENT_REF)].map((m) => m[0]),
      ...[...line.matchAll(COLD)].map((m) => m[0]),
    ];
    if (refs.length) { flush(); out.push({ kind: "ref", refs: [...new Set(refs)] }); }

    if (/^\s*\|/.test(line)) pending.table++;
    else if (/^\s*([-*+]|\d+[.)])\s/.test(line)) pending.list++;
    else pending.prose++;
  }
  flush();
  return out;
}
const words = (s, n) => {
  const w = s.replace(/[`*]/g, "").trim().split(/\s+/);
  return w.slice(0, n).join(" ") + (w.length > n ? "…" : "");
};

const scanned = files.map(scan);
const rules = scanned.flatMap((s) => s.rules);
const malformed = rules.filter((r) => r.malformed);
const withCondition = rules.filter((r) => r.condition);
const declaredReader = scanned.filter((s) => s.reader);

// THE LOAD CHAIN. A skill is referenced four different ways in this corpus, and the dominant one -- a bare
// backticked name -- is indistinguishable from a code identifier, so no script can answer "what does this
// file load". `skill:name` is the unambiguous form (spec: prompt-writing-quality/format-guide.md). This counts both,
// so the migration has a queue and a finish line instead of a feeling.
const SKILL_NAMES = (() => {
  try { return readdirSync(".claude/skills").filter((d) => statSync(join(".claude/skills", d)).isDirectory()); }
  catch { return []; }
})();
// TWO AXES, because one prefix could only say WHERE a thing lives, never what relation the writer has
// with it: RELATION (import loads it, ref points at it, cite offers it as proof) x STORE (skill/repo/tmp).
// `@rev` pins a citation to a MOMENT. A resolving path is not a live citation -- the file gets rewritten
// underneath and the cite stays green (Klein et al. 2014, "reference rot"). Only `cite:` needs it.
// `ext` = another project's tree. Never resolved locally, so it must carry @rev.
const TWO_AXIS = /\b(import|ref|cite):(skill|repo|tmp|ext)\/([A-Za-z0-9._/-]+)(@[0-9a-f]{7,40})?(#[A-Za-z0-9._/-]+)?/g;
const NEW_FORM = /skill:([a-z][a-z0-9-]*)((?:\/[A-Za-z0-9._-]+)*)(#[A-Za-z0-9._-]+)?/g;
// A backticked name is only a LOAD reference when it names a real skill directory; `foo.ts` never is.
const OLD_FORM = new RegExp("`(" + SKILL_NAMES.join("|") + ")`", "g");
// The old fragment form: a backticked skill directory followed by a path. This is the migration's next queue.
const OLD_FRAGMENT = new RegExp("`(" + SKILL_NAMES.join("|") + ")(/[A-Za-z0-9._/-]+)`", "g");

// A relative ref does not explain itself: `./project.md` is fourteen different files depending on who
// wrote it, so the string alone cannot build the map. Absolute everywhere. This counts the offenders.
const SELF_REF = /\.\/[A-Za-z0-9._/-]+/g;
// The load universe is bigger than skills: repo source, objectives, scripts -- and tmp, kept SEPARATE
// because CLAUDE.md 24 forbids citing it as a signed source and nothing could check that until now.
const REPO_NEW = /\brepo:[A-Za-z0-9._/-]+/g;
const TMP_NEW = /\btmp:[A-Za-z0-9._/-]+/g;
const REPO_OLD = /`(?:objectives|scripts|services|apps|packages)\/[A-Za-z0-9._/-]+`/g;
const TMP_OLD = /`tmp\/[A-Za-z0-9._/-]+`/g;
const owningSkill = (f) => (f.replace(/\\/g, "/").match(/\.claude\/skills\/([^/]+)\//) || [])[1] ?? null;

// An agent is the one referent that is not a document: you RAISE it. Flat, resolves to .claude/agents/.
const AGENT_REF = /\bagent:(grimorio\.[a-z-]+)/g;
const AGENT_NAMES = (() => { try { return new Set(readdirSync(".claude/agents").filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))); } catch { return new Set(); } })();

// COLD: a flat handle, unopenable by construction. Spec: agent-writing/cold-store.md
const COLD = /\bcold:([a-z0-9][a-z0-9-]*)(#[A-Za-z0-9._-]+)?/g;
const COLD_MANIFEST = ".claude/skills/agent-writing/cold-store.md";
// handle | target | why. A target is a live path, or `git:<sha>:<path>` once the file has left the tree.
const coldManifest = (() => {
  const m = new Map();
  try {
    for (const line of readFileSync(COLD_MANIFEST, "utf8").split(/\r?\n/)) {
      const c = line.match(/^\|\s*`?([a-z0-9][a-z0-9-]*)`?\s*\|\s*`?([^|`]+)`?\s*\|/);
      if (c && c[1] !== "handle") m.set(c[1], c[2].trim());
    }
  } catch {}
  return m;
})();

const loadRefs = files.map((f) => {
  const text = readFileSync(f, "utf8");
  const own = owningSkill(f);
  const neu = [...text.matchAll(NEW_FORM)]
    .filter((m) => m[1] !== "name")
    .map((m) => ({ skill: m[1], path: m[2] || "", anchor: m[3] || "" }));
  const old = [...text.matchAll(OLD_FORM)].map((m) => m[1]);
  const oldFrag = [...text.matchAll(OLD_FRAGMENT)].map((m) => m[1] + m[2]);
  // The CEO's export boundary (2026-08-04): only SKILL.md exports, so a relative intra-skill ref there is
  // CORRECT per agentskills.io. Anywhere else it is still debt. One count could not say which.
  const exportable = /[\\/]SKILL\.md$/.test(f);
  const selfRel = [...text.matchAll(SELF_REF)].map((m) => m[0]).filter(() => !exportable);
  const selfRelOk = exportable ? [...text.matchAll(SELF_REF)].length : 0;
  const absSelf = neu.filter((r) => own && r.skill === own && r.path).map((r) => r.skill + r.path);
  const repoNew = [...text.matchAll(REPO_NEW)].map((m) => m[0]).filter((s) => s !== "repo:path");
  const repoOld = [...text.matchAll(REPO_OLD)].map((m) => m[0]);
  const tmpNew = [...text.matchAll(TMP_NEW)].map((m) => m[0]).filter((s) => s !== "tmp:path");
  const tmpOld = [...text.matchAll(TMP_OLD)].map((m) => m[0]);
  const two = [...text.matchAll(TWO_AXIS)]
    .filter((m) => m[3] !== "path" && m[3] !== "name")
    .map((m) => ({ rel: m[1], store: m[2], path: m[3], rev: m[4] || "", anchor: m[5] || "", raw: m[0] }));
  return { file: f, new: neu, old, oldFrag, selfRel, selfRelOk, absSelf, repoNew, repoOld, tmpNew, tmpOld, two };
});
// The combinations the scheme makes IMPOSSIBLE rather than merely forbidden. cite:tmp is CLAUDE.md 24:
// proof must outlive the claim, and tmp is gitignored scratch. import:tmp is depending on scratch.
const INVALID = loadRefs.flatMap((r) =>
  r.two.filter((x) => x.store === "tmp" && (x.rel === "cite" || x.rel === "import"))
    .map((x) => ({ file: r.file, ref: x.raw, why: x.rel === "cite" ? "CLAUDE.md 24: proof cannot be scratch" : "cannot depend on scratch" })));
// A reference in the scheme is RESOLVABLE, so a dead one is now findable. Without this the tmp: prefix
// only made the citations greppable; the audit that found 32 vanished targets stayed a one-off snapshot.
const exists = (p) => { try { statSync(p); return true; } catch { return false; } };

// @keep-comment A bare basename can still be a REAL pointer. Resolving only against root/sibling/skills
// filed 848 tokens as "not a reference", among them `close-branch.sh` and `features-status.md` -- both
// named in CLAUDE.md's own prohibitions. The index is built from `git ls-files`, so it answers a question
// about the CORPUS, not about whichever machine is running the audit.
const BASENAMES = (() => {
  const m = new Map();
  for (const f of execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter(Boolean)) {
    const b = f.slice(f.lastIndexOf("/") + 1);
    m.set(b, [...(m.get(b) ?? []), f]);
  }
  return m;
})();
// The vocabulary of what agents PRODUCE, from feature-workflow/SKILL.md, plus the four-level KIND names
// format-guide already exempts. EXPLICIT because it was previously inferred from path shape, and the
// inference swept 529 real references in with it. A name here is set aside on purpose, not by accident.
const ARTIFACT = new Set([
  "po-brief.md", "arch-decision.md", "dev-notes.md", "ui-dev-note.md", "qa-report.md",
  "code-review.md", "ux-review.md", "verification-report.md", "entropy-review.md",
  "project.md", "behavior.md", "SKILL.md", "harness.md", "design.md",
]);
// tmp:foo resolves to tmp/foo -- the prefix REPLACES the directory, it does not drop it. Dropping it
// reported 121 of 121 dead, which was too clean to be true and was: the resolver, not the corpus.
const targetOf = (ref) =>
  ref.startsWith("tmp:") ? "tmp/" + ref.slice(4).replace(/[.,;:]+$/, "")
  : ref.startsWith("repo:") ? ref.slice(5).replace(/[.,;:]+$/, "")
  : null;
// The trailing period of a sentence is not part of the path. targetOf strips it; this did not, so every
// reference that ended a sentence read as dead -- 17 false positives, none of them the corpus's fault.
const twoAxisTarget = (x) => {
  const p = x.path.replace(/[.,;:]+$/, "");
  return x.store === "tmp" ? "tmp/" + p : x.store === "skill" ? ".claude/skills/" + p : p;
};
// `skill:` only ever resolved locally -- a correctly-written GLOBAL skill ref (`~/.claude/skills/`, e.g.
// `playwright-cli`, sanctioned by agent-writing's own local-first rule) always read dead. Fall back to the
// user's global skills dir; this only widens what resolves, so it cannot hide a real dead reference.
const existsTwoAxis = (x) => {
  if (exists(twoAxisTarget(x))) return true;
  if (x.store !== "skill") return false;
  const p = x.path.replace(/[.,;:]+$/, "");
  return exists(join(homedir(), ".claude", "skills", p));
};
// An anchor was PARSED and then dropped, so a reference to a heading deleted last week resolved green.
// Prior art treats a bad fragment as its own class, not as a dead link (MkDocs, lychee, W3C checklink).
// GitHub's slug: DELETE punctuation, then each space becomes its own hyphen (never collapse runs).
const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/ /g, "-").replace(/^-+|-+$/g, "");
// `rev`, given, reads the anchor at that PINNED commit, not the live tree -- same idea as the whole-file
// pin `--dead`/`--pins` already use. Without it, a heading a governance drain removed from the live file
// can never be pinned honestly: the pin proves the FILE existed, the anchor check still reads today's file.
const anchorLives = (target, anchor, rev) => {
  const a = anchor.slice(1);
  try {
    // A directory's anchor addresses its SKILL.md; a numeric anchor is a LINE, not a heading; and a
    // non-markdown file has no headings to check. Getting these wrong made 3 of 8 hits my bug, not rot.
    // `statSync(target)` only answers "is this a live directory" -- for a PINNED reference the live path is
    // routinely gone (that is the whole reason it needed a pin), so a throw here means "assume file, not
    // directory" rather than "the reference is dead" -- the directory question is answered by the pinned
    // tree when it matters, not by this probe.
    let isDir = false;
    try { isDir = statSync(target).isDirectory(); } catch { isDir = false; }
    const f = isDir ? join(target, "SKILL.md") : target;
    const text = rev ? execFileSync("git", ["show", `${rev}:${f}`], { encoding: "utf8" }) : readFileSync(f, "utf8");
    if (/^\d+$/.test(a)) return text.split(/\r?\n/).length >= Number(a);
    if (!f.endsWith(".md")) return true;
    return text.split(/\r?\n/).filter((l) => /^#{1,6}\s/.test(l))
      .some((h) => slug(h.replace(/^#+\s*/, "")).includes(slug(a)));
  } catch { return false; }
};
// A PIN is cold-store logic applied to a citation: the bytes left the tree, history is the store.
// VERIFIED against git, never trusted -- an unverifiable pin fabricates the provenance it exists to
// guarantee. Proved 2026-08-05: before this, pinning moved `--dead` by zero. Declared here, ABOVE
// `deadAnchors`, because the anchor-pin support below calls it -- module-top-level `const` is not hoisted
// usably, so declaration order is real execution order here, not just reading order.
const pinCache = new Map();
const pinResolves = (path, rev) => {
  const key = `${rev}:${path}`;
  if (pinCache.has(key)) return pinCache.get(key);
  let ok = false;
  try {
    execFileSync("git", ["cat-file", "-e", key], { stdio: "ignore" });
    ok = true;
  } catch { ok = false; }
  pinCache.set(key, ok);
  return ok;
};
const deadAnchors = loadRefs.flatMap((r) =>
  r.two.filter((x) => x.anchor)
    .map((x) => ({ file: r.file, ref: x.raw, target: twoAxisTarget(x), anchor: x.anchor, rev: x.rev ? x.rev.replace(/^@/, "") : "" }))
    .filter((x) => (x.rev ? pinResolves(x.target, x.rev) : exists(x.target)) && !anchorLives(x.target, x.anchor, x.rev)));
// The denominator `--anchors` reports: a dead count with no reach behind it is not a measurement.
const anchoredRefs = loadRefs.reduce((n, r) => n + r.two.filter((x) => x.anchor).length, 0);

// `tmp/` is GITIGNORED, so a pin there can never verify -- the bytes were never committed and
// `--diff-filter=D` finds nothing. Those references are de-referenced (costume stripped, name kept),
// never pinned. Keeping the two forms distinguishable is the whole point.
const twoAxisPinned = (x) => x.rev && x.store === "repo" && pinResolves(x.path.replace(/[.,;:]+$/, ""), x.rev.replace(/^@/, ""));
const fabricatedPins = loadRefs.flatMap((r) =>
  r.two.filter((x) => x.rev && x.store === "repo")
    .map((x) => ({ file: r.file, ref: x.raw, target: twoAxisTarget(x), rev: x.rev.replace(/^@/, "") }))
    .filter((x) => !exists(x.target) && !pinResolves(x.target, x.rev)));

const deadRefs = [
  ...loadRefs.flatMap((r) =>
    [...r.tmpNew, ...r.repoNew]
      .map((ref) => ({ file: r.file, ref, target: targetOf(ref) }))
      .filter((x) => x.target && !exists(x.target))),
  ...loadRefs.flatMap((r) =>
    r.two.filter((x) => x.store !== "ext")   // nothing here can resolve another project's tree
      .map((x) => ({ file: r.file, ref: x.raw, target: twoAxisTarget(x), pinned: twoAxisPinned(x), live: existsTwoAxis(x) }))
      .filter((x) => !x.live && !x.pinned)),
];
// An unpinned ext reference is unrecoverable, not merely rotting: there is no local copy to fall back on.
const extUnpinned = loadRefs.flatMap((r) =>
  r.two.filter((x) => x.store === "ext" && !x.rev && x.path !== "project")
    .map((x) => ({ file: r.file, ref: x.raw })));

// SUBTRACTIVE by necessity: strip every well-formed reference, then read the remainder. Searching for
// offenders directly re-matches the inside of correct references -- that blinded --inert on 2026-08-05.
// A leading dot belongs to the path; a leading hyphen does not (`{agent}-memory/x.md`).
const PATH_SHAPE = /(?:\.{1,2}\/)?(?:\.?[A-Za-z0-9][A-Za-z0-9._-]*\/)+[A-Za-z0-9._-]+\.[a-z]{2,5}|\b[a-z0-9][a-z0-9._-]*\.(?:md|mjs|cjs|jsx?|tsx?|json|sh|ya?ml|toml)\b/g;
const stripPrefixed = (line) =>
  line
    .replace(TWO_AXIS, " ")
    .replace(COLD, " ")
    .replace(/\b(?:import|ref|cite):(?:skill|repo|tmp)\/\S*/g, " ")
    .replace(/\bskill:[a-z][a-z0-9-]*\S*/g, " ")
    .replace(/\b(?:repo|tmp):[A-Za-z0-9._/-]+/g, " ")
    .replace(/https?:\/\/\S+/g, " ");

// WHO MAY WRITE A FILE, as a rule rather than a list of filenames. Copied from the pattern set in
// scripts/refobl/governance.cjs -- the governance patterns once also lived in a PreToolUse hook that gated
// the Edit and Write TOOLS. That hook is deleted, so a script writing
// through fs never reaches it, and an audit that could not see the ownership boundary reported a number
// nobody was able to act on.
const GOVERNANCE_OWNED = [
  /^CLAUDE\.md$/,
  /^\.claude\/agents\/.*\.md$/,
  /^\.claude\/hooks\/.*\.(cjs|js)$/,
  /^\.claude\/settings(\.local)?\.json$/,
  /^\.claude\/skills\/[^/]+\/SKILL\.md$/,
  /^\.claude\/skills\/.*behavior.*\.md$/i,
  /^objectives\/harness\.md$/,
];
const isGovernance = (rel) => GOVERNANCE_OWNED.some((re) => re.test(rel.replace(/\\/g, "/")));

const unprefixed = files.flatMap((f) => {
  const rel = f.replace(/\\/g, "/");
  // The manifest is a TABLE OF TARGETS: every row is a bare path by design, and flagging them would
  // demand the cold store reference itself in the form it exists to replace.
  if (rel === COLD_MANIFEST) return [];
  const exportable = /\/SKILL\.md$/.test(rel);
  const out = [];
  let fenced = false;
  readFileSync(f, "utf8").split(/\r?\n/).forEach((raw, i) => {
    if (/^\s*```/.test(raw)) { fenced = !fenced; return; }
    if (fenced) return;                       // a code block is code, not a reference
    if (/^\s*(VERIFY|Usage|usage):/.test(raw)) return;   // a runnable command names its own file
    for (const m of stripPrefixed(raw).matchAll(PATH_SHAPE)) {
      const tok = m[0];
      // The CEO's export boundary: `./x.md` inside a SKILL.md is CORRECT -- it is what lets the skill
      // travel. Everywhere else it is the debt this rule exists to name.
      if (exportable && tok.startsWith("./")) continue;
      const resolves = [tok, join(rel, "..", tok), join(".claude/skills", tok)].some(exists);
      // A bare filename that resolves NOWHERE -- not at root, not beside its referrer, not under
      // skills/ -- is a NAME, not a pointer: `po-brief.md`, `dev-notes.md`, `project.md` are the
      // vocabulary of what agents PRODUCE. Demanding a prefix on those teaches that the rule is
      // nonsense, and the 1977 of them were burying the 359 references that are really unprefixed.
      // Set aside ONLY a declared artifact name. A bare token that names exactly one tracked file is a
      // real reference the writer wrote without a prefix -- reported as `bare`, never silently dropped.
      const hits = tok.includes("/") ? [] : (BASENAMES.get(tok) ?? []);
      const bare = !tok.includes("/") && !resolves && !ARTIFACT.has(tok) && hits.length === 1;
      const kind = !tok.includes("/") && !resolves && !bare;
      out.push({ file: rel, line: i + 1, token: tok, kind, bare, resolves, target: bare ? hits[0] : null, inTable: /^\s*\|/.test(raw) });
    }
  });
  return out;
});

// A reference into a long file with no anchor makes the reader scan it, which is the cost an anchor
// exists to remove. 200 lines is the point past which "go read that file" stops being an instruction.
const ANCHOR_THRESHOLD = 200;
const linesIn = (p) => { try { return readFileSync(p, "utf8").split(/\r?\n/).length; } catch { return 0; } };
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };
// `import:skill/<name>` with no file declares a WHOLE-SKILL dependency; an anchor would change what the
// line says, not narrow a read. `ref:skill/<name>` is NOT exempt -- that one is a pointer.
const wholeSkillLoad = (x) => x.rel === "import" && x.store === "skill" && !x.path.includes("/");
const anchorless = loadRefs.flatMap((r) =>
  r.two.filter((x) => !x.anchor && x.store !== "ext" && x.rel !== "cite" && !wholeSkillLoad(x))
    // A DIRECTORY target addresses its SKILL.md -- exactly as anchorLives() already resolves it. Without
    // this, every bare `import:skill/<name>` pointing at a 400-line SKILL.md was invisible to this counter:
    // the C6 falsification probe removed a real anchor and the gate stayed green, which is blind, not clean.
    .map((x) => { const t = twoAxisTarget(x); return { file: r.file.replace(/\\/g, "/"), ref: x.raw, target: isDir(t) ? join(t, "SKILL.md") : t }; })
    // .md only: a reference to a source module points at the module, and there the file IS the unit.
    // A document is the case where the reader has to scan, which is the cost the anchor removes.
    .filter((x) => x.target.endsWith(".md") && exists(x.target) && linesIn(x.target) > ANCHOR_THRESHOLD)
    .map((x) => ({ ...x, lines: linesIn(x.target) })));

const agentRefs = files.flatMap((f) =>
  [...readFileSync(f, "utf8").matchAll(AGENT_REF)]
    .map((m) => ({ file: f.split(String.fromCharCode(92)).join("/"), agent: m[1] })));
const agentRefsDead = agentRefs.filter((a) => !AGENT_NAMES.has(a.agent));

const coldRefs = files.flatMap((f) =>
  [...readFileSync(f, "utf8").matchAll(COLD)]
    // `cold:handle` in the format guide is the SYNTAX being taught, not a reference -- the same
    // placeholder convention the two-axis matcher already applies to `path` and `name`.
    .map((m) => ({ file: f.replace(/\\/g, "/"), handle: m[1], anchor: m[2] || "" }))
    .filter((c) => c.handle !== "handle"));
const coldUnknown = coldRefs.filter((c) => !coldManifest.has(c.handle));
// A handle resolving to a file whose heading was deleted is the same rot as any other dead anchor, and
// it is the one that hides best: nobody opens a cold file to notice.
const coldDeadAnchor = coldRefs.filter((c) => {
  if (!c.anchor || !coldManifest.has(c.handle)) return false;
  const t = coldManifest.get(c.handle);
  return !t.startsWith("git:") && exists(t) && !anchorLives(t, c.anchor);
});
const coldDead = [...coldManifest.entries()]
  .filter(([, t]) => !t.startsWith("git:") && !exists(t))
  .map(([handle, target]) => ({ handle, target }));
const coldOrphan = [...coldManifest.keys()].filter((h) => !coldRefs.some((c) => c.handle === h));

const totalNew = loadRefs.reduce((n, r) => n + r.new.length, 0);
const totalOld = loadRefs.reduce((n, r) => n + r.old.length, 0);
const newFragments = loadRefs.reduce((n, r) => n + r.new.filter((x) => x.path).length, 0);
const oldFragments = loadRefs.reduce((n, r) => n + r.oldFrag.length, 0);
const selfRelative = loadRefs.reduce((n, r) => n + r.selfRel.length, 0);
const absSelfRefs = loadRefs.flatMap((r) => r.absSelf.map((s) => ({ file: r.file, ref: s })));
const sum = (k) => loadRefs.reduce((n, r) => n + r[k].length, 0);

const args = process.argv.slice(2);

if (args.includes("--json")) {
  console.log(JSON.stringify({ scanned, rules }, null, 2));
} else if (args.includes("--malformed")) {
  for (const r of malformed) console.log(`${r.file}:${r.line}  ${r.kind}  ${r.imperative.slice(0, 70)}`);
} else if (args.includes("--outline")) {
  // Takes a skill name or a path fragment. Prints every matching file compressed to its skeleton.
  const target = args.find((a) => !a.startsWith("--") && !["md", "html"].includes(a));
  const render = args.includes("--render") ? (args.includes("html") ? "html" : "md") : null;
  const hit = files.filter((f) => !target || f.replace(/\\/g, "/").includes(target));
  if (!hit.length) console.log(`no file matches "${target}"`);

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const doc = [];
  const emit = (s) => (render ? doc.push(s) : console.log(s));

  if (render === "html") emit(`<style>body{font:14px/1.55 ui-monospace,Menlo,Consolas,monospace;max-width:70rem;margin:2rem auto;padding:0 1rem}h2{border-top:1px solid #8884;padding-top:1rem;font-size:1rem}.r{color:#0a7}.f{color:#8888}.x{color:#c60}details{margin:.2rem 0}</style>`);

  for (const f of hit) {
    const o = outline(f);
    const lines = readFileSync(f, "utf8").split("\n").length;
    const head = `${f.replace(/\\/g, "/")}   ${lines} lines -> ${o.length}`;
    if (render === "html") emit(`<h2>${esc(head)}</h2>`);
    else if (render === "md") emit(`\n## ${head}\n`);
    else emit(`\n${"=".repeat(90)}\n${head}`);

    for (const e of o) {
      let text, cls;
      if (e.kind === "head") { text = `${"  ".repeat(e.depth - 1)}${"#".repeat(e.depth)} ${e.text}`; cls = "h"; }
      else if (e.kind === "rule") { text = `     ${e.opener.padEnd(10)} ${e.cond ? e.cond + " " + ARROW + " " : ""}${e.imp}`; cls = "r"; }
      else if (e.kind === "ref") { text = `     → ${e.refs.join("  ")}`; cls = "x"; }
      else { text = `     · ${e.text}`; cls = "f"; }
      if (render === "html") emit(`<div class="${cls}">${esc(text).replace(/^ +/, (m) => "&nbsp;".repeat(m.length))}</div>`);
      else if (render === "md") emit("    " + text.trimEnd());
      else emit(text);
    }
  }
  if (render) process.stdout.write(doc.join("\n") + "\n");
} else if (args.includes("--shape")) {
  // One line per file: what it is made of. A file that is 95% prose and carries 2 rules is a REFERENCE;
  // one that is 40% rules is a PROTOCOL. The mix tells you which without opening it.
  const target = args.find((a) => !a.startsWith("--"));
  const rows = files.filter((f) => !target || f.includes(target)).map(shape)
    .sort((a, b) => b.lines - a.lines);
  console.log("lines  head  rule  tabl  list  prose   h1/h2/h3   file");
  for (const s of rows) {
    const body = s.heading + s.rule + s.table + s.list + s.prose;
    const pct = (n) => (body ? Math.round((n / body) * 100) : 0);
    console.log(
      `${String(s.lines).padStart(5)} ${String(s.heading).padStart(5)} ${String(s.rule).padStart(5)} ` +
      `${String(s.table).padStart(5)} ${String(s.list).padStart(5)} ${String(s.prose).padStart(5)}` +
      `${String(pct(s.prose) + "%").padStart(5)}  ${s.h1}/${s.h2}/${s.h3}`.padEnd(14) + `  ${s.file}`);
  }
} else if (args.includes("--invalid")) {
  for (const i of INVALID) console.log(`${i.file}  ->  ${i.ref}   ${i.why}`);
} else if (args.includes("--inert")) {
  // A rule that mandates a capability the receiving agent structurally LACKS. This is the machine-checkable
  // slice of "which rules contradict which agents" -- frontmatter says what a tool it can never call.
  // A rule ALREADY GUARDED by the capability is correct, not inert -- so a guard suppresses the hit. Without
  // this the detector reported 27->0 when rules 7-9 gained "WHEN you can spawn": it had gone BLIND, not green.
  const GUARDED = /\b(WHEN|UNLESS|IF) [^⟶\n]*\b(you can spawn|can spawn|able to spawn)\b/i;
  // An agent may lack a tool by disallowedTools OR by a tools: allowlist that omits it. Checking only the
  // first missed grimorio.experimenter, so the real count was 10, not the 9 I reported.
  const lacksTool = (t, tool) =>
    new RegExp(`disallowedTools:.*\\b${tool}\\b`).test(t) ||
    (/^tools:/m.test(t) && !new RegExp(`^tools:.*\\b${tool}\\b`, "m").test(t) && !/^tools:\s*\*/m.test(t));
  const CAPS = [
    // The ACT, never the mention: "never write a subagent prompt" binds a writer that cannot spawn, and
    // matching the word alone made 2 of every 5 hits noise -- a detector nobody would trust twice.
    { cap: "spawn", lacks: (t) => lacksTool(t, "Agent"),
      rule: /\b(spawn|raise a delegate|fan (it |the )?out)\b/i },
    { cap: "edit",  lacks: (t) => lacksTool(t, "Edit") || lacksTool(t, "Write"), rule: /\b(edit|write) (the|a) file\b/i },
  ];
  for (const a of files.filter((f) => /\.claude[\\/]agents[\\/]/.test(f))) {
    const text = readFileSync(a, "utf8");
    for (const c of CAPS) {
      if (!c.lacks(text)) continue;
      const hits = readFileSync("CLAUDE.md", "utf8").split(/\r?\n/)
        .map((l, i) => ({ l, i: i + 1 }))
        .filter(({ l }) => RULE.test(l) && c.rule.test(l) && !GUARDED.test(l));
      for (const h of hits)
        console.log(`${a.split(/[\\/]/).pop()}  lacks ${c.cap}  <-  CLAUDE.md:${h.i}  ${h.l.replace(/\*\*/g, "").trim().slice(0, 72)}`);
    }
  }
} else if (args.includes("--map")) {
  // WHAT EACH AGENT ACTUALLY RECEIVES. CLAUDE.md reaches every agent at birth, so it is charged to all of
  // them; the rest is each agent's own import: edges, followed transitively through the skills it loads.
  const linesOf = (f) => { try { return readFileSync(f, "utf8").split(/\r?\n/).length; } catch { return 0; } };
  const importsOf = (f) => (loadRefs.find((r) => r.file === f)?.two ?? [])
    .filter((x) => x.rel === "import" && x.store === "skill")
    .map((x) => ".claude/skills/" + x.path.replace(/[.,;:]+$/, ""))
    .map((p) => (p.endsWith(".md") ? p : join(p, "SKILL.md")));
  const closure = (start) => {
    const seen = new Set(), queue = [...start];
    while (queue.length) {
      const f = queue.shift();
      if (seen.has(f) || !exists(f)) continue;
      seen.add(f);
      queue.push(...importsOf(f));
    }
    return seen;
  };
  const rootLines = linesOf("CLAUDE.md");
  const rootClosure = closure(importsOf("CLAUDE.md"));
  const agents = files.filter((f) => /\.claude[\\/]agents[\\/]/.test(f));
  const rows = agents.map((a) => {
    const own = closure(importsOf(a));
    const all = new Set([...rootClosure, ...own]);
    const lines = [...all].reduce((n, f) => n + linesOf(f), 0) + rootLines + linesOf(a);
    return { agent: a.split(/[\\/]/).pop().replace(/\.md$/, ""), files: all.size, lines, own: own.size };
  }).sort((x, y) => y.lines - x.lines);
  console.log(`CLAUDE.md is ${rootLines} lines and reaches EVERY agent. It pulls in ${rootClosure.size} skill files, charged to all ${agents.length}.`);
  console.log("");
  console.log("  lines  files  own  agent");
  for (const r of rows)
    console.log(`${String(r.lines).padStart(7)} ${String(r.files).padStart(6)} ${String(r.own).padStart(4)}  ${r.agent}`);
} else if (args.includes("--unprefixed")) {
  const filter = args.find((a) => !a.startsWith("--"));
  const base = args.includes("--kinds") ? unprefixed : unprefixed.filter((u) => !u.kind);
  const rows = filter ? base.filter((u) => u.file.includes(filter)) : base;
  const byFile = new Map();
  for (const u of rows) byFile.set(u.file, [...(byFile.get(u.file) ?? []), u]);
  for (const [f, us] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
    const t = us.filter((u) => u.inTable).length;
    console.log(`${String(us.length).padStart(4)}  ${f}${t ? `   (${t} in tables)` : ""}`);
    if (filter) for (const u of us) console.log(`        :${u.line}  ${u.token}`);
  }
  console.log("");
  // Three-way on purpose: PREFIX (resolves) / DE-FORMAT (never a reference, keep the name) / FLAG (unsure).
  // The old name framed the repair as ADD A PREFIX, which on a non-resolving token asserts a file exists.
  console.log(`file-shaped tokens carrying NO relation   ${rows.length}   in ${byFile.size} files`);
  const res = rows.filter((u) => u.resolves);
  console.log(`  RESOLVE to a real file  -> PREFIX  ${res.length}`);
  // OWNERSHIP, not an exclusion. A behaviour-defining file may only be written by grimorio.system-keeper
  // (CLAUDE.md 20), so a delegate cannot clear these and reporting them merged says the corpus is dirtier
  // than the delegate can fix. Excluding them instead would HIDE 242 references behind a rule -- the exact
  // failure this counter exists to catch. The number stays visible and says who owes it.
  console.log(`    mine to fix                 ${res.filter((u) => !isGovernance(u.file)).length}`);
  console.log(`    GOVERNANCE-owned            ${res.filter((u) => isGovernance(u.file)).length}   grimorio.system-keeper's`);
  console.log(`  do NOT resolve  -> DE-FORMAT or FLAG, never PREFIX   ${rows.filter((u) => !u.resolves).length}`);
  console.log(`    mine to fix                 ${rows.filter((u) => !u.resolves && !isGovernance(u.file)).length}`);
  console.log(`    GOVERNANCE-owned            ${rows.filter((u) => !u.resolves && isGovernance(u.file)).length}`);
  console.log(`  of those, inside a table row          ${rows.filter((u) => u.inTable).length}`);
} else if (args.includes("--coverage")) {
  // A file with zero references and a file nobody read return the same thing, so coverage is asserted
  // against the PLAN, never against the row count. 8 files read as clean this way on 2026-08-05.
  const plan = "tmp/reference-audit/shards.json";
  const tsv = "tmp/reference-audit/references.tsv";
  if (!exists(plan) || !exists(tsv)) {
    console.log(`NO DATA: ${!exists(plan) ? plan : tsv} is missing — coverage is unknown, not clean.`);
    process.exit(1);
  }
  const planned = JSON.parse(readFileSync(plan, "utf8")).flat().map((f) => f.replace(/\\/g, "/"));
  const covered = new Set(readFileSync(tsv, "utf8").trim().split(/\r?\n/).map((l) => l.split("|")[0]));
  const gaps = planned.filter((f) => !covered.has(f));
  for (const g of gaps) console.log(`  NO ROW  ${g}`);
  console.log(`extraction plan ${planned.length} files · covered ${planned.length - gaps.length} · GAPS ${gaps.length}`);
  process.exit(gaps.length ? 1 : 0);
} else if (args.includes('--anchorless')) {
  const byTarget = new Map();
  for (const a of anchorless) byTarget.set(a.target, [...(byTarget.get(a.target) ?? []), a]);
  for (const [t, as] of [...byTarget].sort((x, y) => y[1].length - x[1].length))
    console.log(`${String(as.length).padStart(4)} refs -> ${t}  (${as[0].lines} lines)`);
  console.log("");
  console.log(`refs into a >${ANCHOR_THRESHOLD}-line file with NO anchor  ${anchorless.length}  across ${byTarget.size} targets`);
} else if (args.includes('--cold')) {
  console.log(`cold: handles written        ${coldRefs.length}   (${new Set(coldRefs.map((c) => c.handle)).size} distinct)`);
  console.log(`manifest entries             ${coldManifest.size}   ${COLD_MANIFEST}`);
  console.log(`  UNRESOLVABLE (no manifest row)  ${coldUnknown.length}`);
  console.log(`  target GONE and not git-backed  ${coldDead.length}`);
  console.log(`  manifest rows nobody references ${coldOrphan.length}`);
  console.log(`  anchor gone in the cold target  ${coldDeadAnchor.length}`);
  for (const c of coldUnknown) console.log(`  ${c.file}  ->  cold:${c.handle}   NOT IN MANIFEST`);
  for (const c of coldDeadAnchor) console.log(`  ${c.file}  ->  cold:${c.handle}${c.anchor}   NO SUCH HEADING`);
  for (const d of coldDead) console.log(`  manifest  ${d.handle}  ->  ${d.target}   TARGET GONE`);
  for (const h of coldOrphan) console.log(`  manifest  ${h}   orphan: no reference points here`);
} else if (args.includes("--grammar-doc")) {
  // A grammar the guide does not document is a grammar only this script knows, and the writers are the
  // ones who have to obey it. This asserts the two are the same artifact.
  const guide = ".claude/skills/prompt-writing-quality/format-guide.md";
  let text = "";
  try { text = readFileSync(guide, "utf8"); } catch { console.log(`MISSING  ${guide}`); process.exit(1); }
  const need = [
    ["cold: is documented", /\bcold:/],
    ["the flat-handle shape is stated", /no slash|sin barra|flat handle|handle/i],
    ["the manifest is named", /cold-store\.md/],
    ["the prefix rule is stated", /NEVER write a path without a relation prefix/],
    ["ext is documented as never resolved locally", /STORE=ext is never resolved locally/],
    ["agent: is documented", /agent:<name>/],
    ["the bare-agent prohibition is stated", /NEVER write a bare .grimorio/],
  ];
  let bad = 0;
  for (const [what, re] of need) {
    const ok = re.test(text);
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "MISS"}  ${what}`);
  }
  process.exit(bad ? 1 : 0);
} else if (args.includes("--bare")) {
  const bares = unprefixed.filter((u) => u.bare);
  const byTok = new Map();
  for (const u of bares) byTok.set(u.token, [...(byTok.get(u.token) ?? []), u]);
  for (const [t, us] of [...byTok].sort((a, b) => b[1].length - a[1].length))
    console.log(`${String(us.length).padStart(4)}x  ${t}  ->  ${us[0].target}`);
  console.log(`\nbare basenames naming ONE tracked file  ${bares.length}   in ${new Set(bares.map((u) => u.file)).size} files`);
} else if (args.includes("--anchors")) {
  for (const a of deadAnchors) console.log(`${a.file}  ->  ${a.ref}   NO SUCH HEADING in ${a.target}`);
  // It printed NOTHING AT ALL when the count was zero — a blank screen is indistinguishable from a
  // probe that never ran, and this is C4's VERIFY command. State the total and the reach every time.
  console.log(`\nanchors checked ${anchoredRefs}   dead ${deadAnchors.length}`);
  process.exit(deadAnchors.length ? 1 : 0);
} else if (args.includes("--dead")) {
  for (const d of deadRefs) console.log(`${d.file}  ->  ${d.ref}   TARGET GONE`);
  // GATE-IS-VACUOUS, found 2026-08-12: this branch printed findings but never called process.exit, so it
  // always returned 0 -- every caller chaining `--dead && --anchors` (close-branch.sh's C7 among them) was
  // gated ONLY by --anchors the whole time, with 59 real dead references never once blocking anything. Same
  // shape as C4's own fix above (a blank screen is not the same claim as a probe that ran and found zero).
  console.log(`\ndead refs  ${deadRefs.length}`);
  process.exit(deadRefs.length ? 1 : 0);
} else if (args.includes("--pins")) {
  // A pin that does not verify is the one failure mode worse than the rot it replaced.
  for (const p of fabricatedPins) console.log(`${p.file}  ->  ${p.ref}   PIN DOES NOT RESOLVE AT ${p.rev}`);
  console.log(`\nunverifiable pins  ${fabricatedPins.length}`);
} else if (args.includes("--selfrefs")) {
  for (const r of absSelfRefs) console.log(`${r.file}  ->  skill:${r.ref}`);
} else if (args.includes("--fragments")) {
  // The fragment queue: declarations naming a FILE inside a skill, still in the old backticked form.
  for (const r of loadRefs.filter((r) => r.oldFrag.length).sort((a, b) => b.oldFrag.length - a.oldFrag.length))
    console.log(`${String(r.oldFrag.length).padStart(3)}  ${r.file}\n     ${[...new Set(r.oldFrag)].join("\n     ")}`);
} else if (args.includes("--loads")) {
  // The migration queue, worst file first: how many old-form references each file still carries.
  for (const r of loadRefs.filter((r) => r.old.length).sort((a, b) => b.old.length - a.old.length))
    console.log(`${String(r.old.length).padStart(3)} old  ${String(r.new.length).padStart(2)} new  ${r.file}\n         ${[...new Set(r.old)].join(", ")}`);
} else if (args.includes("--dupes")) {
  const byImp = new Map();
  for (const r of rules) {
    const k = r.imperative.toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).slice(0, 8).join(" ");
    if (!k) continue;
    byImp.set(k, [...(byImp.get(k) ?? []), r]);
  }
  for (const [k, rs] of [...byImp].filter(([, rs]) => rs.length > 1).sort((a, b) => b[1].length - a[1].length))
    console.log(`${String(rs.length).padStart(3)}x  ${k}\n      ${rs.map((r) => `${r.file}:${r.line}`).join("\n      ")}`);
} else {
  console.log(`files scanned                 ${scanned.length}`);
  console.log(`rules a script can SEE        ${rules.length}`);
  console.log(`  with an explicit condition  ${withCondition.length}`);
  console.log(`  MALFORMED (needs a condition, has none)  ${malformed.length}`);
  console.log(`files DECLARING their reader  ${declaredReader.length} / ${scanned.length}`);
  console.log(`load refs in the \`skill:\` form ${totalNew} / ${totalNew + totalOld}   (--loads for the queue)`);
  console.log(`  of those, FRAGMENTS (skill:name/path)  ${newFragments} / ${newFragments + oldFragments}`);
  const realRefs = unprefixed.filter((u) => !u.kind && !u.bare);
  console.log(`file-shaped tokens, NO relation ${realRefs.length}   (--unprefixed [filter]: PREFIX / DE-FORMAT / FLAG)`);
  const bares = unprefixed.filter((u) => u.bare);
  console.log(`  plus BARE basenames naming ONE tracked file  ${bares.length}   (--bare) prefix-less REAL references`);
  console.log(`  plus declared artifact NAMES            ${unprefixed.length - realRefs.length - bares.length}   set aside on purpose (ARTIFACT vocabulary)`);
  console.log(`  ext refs with no @rev (unrecoverable)   ${extUnpinned.length}`);
  console.log(`  of those, inside a table    ${unprefixed.filter((u) => u.inTable).length}`);
  console.log(`agent: refs                   ${agentRefs.length}   naming a missing agent ${agentRefsDead.length}`);
  console.log(`cold: handles                 ${coldRefs.length}   unresolvable ${coldUnknown.length}   (--cold)`);
  console.log(`refs into a long file, NO anchor  ${anchorless.length}   (--anchorless)`);
  const two = loadRefs.flatMap((r) => r.two);
  const byRel = (k) => two.filter((x) => x.rel === k).length;
  const legacy = totalNew + totalOld + sum("repoNew") + sum("repoOld") + sum("tmpNew") + sum("tmpOld") + selfRelative;
  console.log(`TWO-AXIS refs (relation x store)  ${two.length} / ${two.length + legacy}`);
  console.log(`  import ${byRel("import")}   ref ${byRel("ref")}   cite ${byRel("cite")}`);
  console.log(`  IMPOSSIBLE combinations  ${INVALID.length}   (--invalid to list)`);
  console.log(`repo refs in the \`repo:\` form  ${sum("repoNew")} / ${sum("repoNew") + sum("repoOld")}`);
  console.log(`tmp refs in the \`tmp:\` form   ${sum("tmpNew")} / ${sum("tmpNew") + sum("tmpOld")}   (CLAUDE.md 24 is checkable once this lands)`);
  console.log(`  of the converted ones, TARGET GONE  ${deadRefs.length}   (--dead to list)`);
  console.log(`  ANCHOR not found in a live target  ${deadAnchors.length}   (--anchors to list)`);
  console.log(`  pins that DO NOT verify against git  ${fabricatedPins.length}   (--pins to list)`);
  const cites = loadRefs.flatMap((r) => r.two).filter((x) => x.rel === "cite");
  const pinned = cites.filter((x) => x.rev).length;
  console.log(`cite refs PINNED to a revision  ${pinned} / ${cites.length}   (an unpinned cite rots silently)`);
  console.log(`relative intra-skill refs in SKILL.md (CORRECT, exportable)  ${loadRefs.reduce((n, r) => n + r.selfRelOk, 0)}`);
  console.log(`RELATIVE refs still to make absolute  ${selfRelative}`);
  console.log(`  skill:self/... inside itself  ${absSelfRefs.length}   (--selfrefs to list)`);
  const shapes = files.map(shape);
  const tot = (k) => shapes.reduce((n, s) => n + s[k], 0);
  const body = tot("heading") + tot("rule") + tot("table") + tot("list") + tot("prose");
  console.log("");
  console.log(`SHAPE of the corpus (--shape [filter] per file)`);
  console.log(`  ${tot("lines")} lines: ${tot("heading")} headings · ${tot("rule")} rules · ${tot("table")} table · ${tot("list")} list · ${tot("prose")} prose (${Math.round((tot("prose") / body) * 100)}%)`);
  console.log(`  files with ZERO rules  ${shapes.filter((s) => !s.rule).length} / ${shapes.length}`);
  console.log("");
  console.log("by kind:");
  const byKind = {};
  for (const r of rules) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
  for (const [k, n] of Object.entries(byKind).sort((a, b) => b[1] - a[1]))
    console.log(`  ${k.padEnd(12)} ${String(n).padStart(4)}`);

  console.log(`\nLENSES — this summary answers "is it broken". These answer "what is in there".`);
  console.log(`  --outline [filter]   headings + rules rendered, prose collapsed to a counter. Read a file without loading it.`);
  console.log(`  --shape [filter]     per file: how much is heading / rule / table / list / PROSE.`);
  console.log(`  --map                the reference graph.`);
  console.log(`GATES — each answers one question and exits non-zero when it fails.`);
  console.log(`  --anchors --anchorless --dead --pins --cold --invalid --unprefixed --bare --grammar-doc --coverage`);
  console.log(`  --dupes --fragments --loads --selfrefs --inert --malformed --kinds --json`);
}
