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
import { join, isAbsolute } from "node:path";
import { homedir } from "node:os";
import { execFileSync, execSync } from "node:child_process";

// The clause vocabulary, from .claude/skills/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md
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
// .claude/skills/grimorio.prompt-writing-quality/project.format-guide.md

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

// DIAGRAM-PRIMACY: audit whether a file's prose is supported by diagrams or tables.
// Tracks: fenced blocks (particularly mermaid), exempt sections (headings matching certain patterns),
// and counts mermaid blocks/lines, table lines, prose, exempt prose, primacy prose, etc.

// Helper: decide if a heading opens/closes an exempt section
function updateExemptSection(headingText, depth, inExemptSection, exemptDepth) {
  if (/^(negative scope|out of scope|boundaries)\b/i.test(headingText)) {
    return { inExemptSection: true, exemptDepth: depth };
  }
  if (inExemptSection && depth <= exemptDepth) {
    return { inExemptSection: false, exemptDepth: 0 };
  }
  return { inExemptSection, exemptDepth };
}

// Helper: handle fence toggle (open/close), return new state
function handleFenceToggle(fenced, fenceLang, inMermaid, inExemptSection, c) {
  if (!fenced) {
    const isMermaid = fenceLang === "mermaid";
    if (isMermaid) {
      c.mermaidBlocks++;
      c.mermaidLines++;
    } else {
      c.primacyProse++;
      if (inExemptSection) c.exemptProse++;
    }
    return { fenced: true, inMermaid: isMermaid };
  } else {
    if (inMermaid) c.mermaidLines++;
    else {
      c.primacyProse++;
      if (inExemptSection) c.exemptProse++;
    }
    return { fenced: false, inMermaid: false };
  }
}

// Helper: handle lines inside a fence
function handleFencedLine(inMermaid, inExemptSection, c) {
  c.code++;
  if (inMermaid) c.mermaidLines++;
  else {
    c.primacyProse++;
    if (inExemptSection) c.exemptProse++;
  }
}

function handleNonFencedLine(line, inExemptSection, exemptDepth, c) {
  if (!line.trim()) { c.blank++; return { inExemptSection, exemptDepth }; }
  const h = line.match(/^(#{1,6})\s+(.*)$/);
  if (h) { c.heading++; return updateExemptSection(h[2].replace(/[*`]/g, "").trim(), h[1].length, inExemptSection, exemptDepth); }
  if (/^\s*\|/.test(line)) { c.table++; return { inExemptSection, exemptDepth }; }
  if (/^\s*([-*+]|\d+[.)])\s/.test(line)) { c.list++; c.primacyProse++; if (inExemptSection) c.exemptProse++; return { inExemptSection, exemptDepth }; }
  c.prose++; c.primacyProse++; if (inExemptSection) c.exemptProse++; return { inExemptSection, exemptDepth };
}

// SCAFFOLDING-LEAK: a fixed, high-signal vocabulary list naming gate/method-process disposition language that
// must never appear in a reader-facing design view -- it belongs ONLY in a PROVENANCE companion file
// (isExemptCompanion already exempts one). Case-insensitive substring match against each line's own text
// (headings included, since the actual incident was a heading: "## Artifact types considered and SCOPED OUT").
const SCAFFOLDING_MARKERS = [
  "scoped out",
  "kruchten 4+1",
  "ddd aggregate",
  "completeness gate",
  "omit-with-reason",
  "against the catalog",
  "phase 4 disposition",
];
function scaffoldingLeakShape(file) {
  const raw = readFileSync(file, "utf8").split("\n");
  const hits = [];
  raw.forEach((line, i) => {
    const lower = line.toLowerCase();
    for (const marker of SCAFFOLDING_MARKERS) {
      if (lower.includes(marker)) hits.push({ line: i + 1, marker, text: line.trim() });
    }
  });
  return hits;
}

// AS-IS-VOICE: WHEN a family carries the literal AS-IS-ONLY marker, none of its non-exempt files may carry
// build-relative reuse/change framing -- that framing presupposes a build plan an AS-IS-ONLY design has none
// of. "Family" = every scanned file sharing the same parent directory.
const AS_IS_ONLY_MARKER = "AS-IS-ONLY — dependencies-as-they-are voice; reuse/build framing FORBIDDEN.";
const REUSE_VOCAB_MARKERS = ["reused unchanged", "reuse vs new", "reused vs new", "reused-vs-new", "reuse-vs-new", "newly designed", "newly built", "retired in favor of"];
function asIsVoiceShape(file) {
  const raw = readFileSync(file, "utf8").split("\n");
  const hits = [];
  raw.forEach((line, i) => {
    const lower = line.toLowerCase();
    for (const marker of REUSE_VOCAB_MARKERS) {
      if (lower.includes(marker)) hits.push({ line: i + 1, marker, text: line.trim() });
    }
  });
  return hits;
}

// DIAGRAM-CLASSES: pure inventory -- which mermaid diagram TYPES exist in this file, and does it carry a
// matrix/decision-shaped table. Never judges sufficiency -- that is Phase 6 CHECK 1's own agent-based job,
// cross-referencing this inventory against scope-completeness-method.md's own Gate 7.
function diagramClassesShape(file) {
  const raw = readFileSync(file, "utf8").split("\n");
  const types = [];
  let fenced = false, fenceLang = "", awaitingType = false;
  let underMatrixHeading = false, matrixTableSeen = false;
  for (const line of raw) {
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      underMatrixHeading = /matrix|decision|credential|auth/i.test(h[2].replace(/[*`]/g, "").trim());
      continue;
    }
    if (/^\s*```/.test(line)) {
      const m = line.match(/^\s*```(\w*)/);
      fenceLang = (m ? m[1] : "").toLowerCase();
      if (!fenced && fenceLang === "mermaid") { fenced = true; awaitingType = true; continue; }
      if (fenced) { fenced = false; awaitingType = false; continue; }
      fenced = true;
      continue;
    }
    if (fenced && awaitingType) {
      const t = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)/);
      if (t) types.push(t[1]);
      awaitingType = false;
      continue;
    }
    if (!fenced && underMatrixHeading && /^\s*\|/.test(line)) matrixTableSeen = true;
  }
  return { types, matrixTableSeen };
}

function diagramPrimacyShape(file) {
  const raw = readFileSync(file, "utf8").split("\n");
  const c = { lines: raw.length, mermaidBlocks: 0, mermaidLines: 0, table: 0, prose: 0, exemptProse: 0, primacyProse: 0, heading: 0, list: 0, blank: 0, code: 0 };
  let fenced = false, fenceLang = "", inMermaid = false, inExemptSection = false, exemptDepth = 0;
  for (const line of raw) {
    if (/^\s*```/.test(line)) {
      const match = line.match(/^\s*```(\w*)/);
      fenceLang = (match ? match[1] : "").toLowerCase();
      const r = handleFenceToggle(fenced, fenceLang, inMermaid, inExemptSection, c);
      fenced = r.fenced; inMermaid = r.inMermaid; c.code++;
      continue;
    }
    if (fenced) { handleFencedLine(inMermaid, inExemptSection, c); continue; }
    const s = handleNonFencedLine(line, inExemptSection, exemptDepth, c);
    inExemptSection = s.inExemptSection; exemptDepth = s.exemptDepth;
  }
  return c;
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
// file load". `skill:name` is the unambiguous form (spec: grimorio.prompt-writing-quality/project.format-guide.md). This counts both,
// so the migration has a queue and a finish line instead of a feeling.
const SKILL_NAMES = (() => {
  try { return readdirSync(".claude/skills").filter((d) => statSync(join(".claude/skills", d)).isDirectory()); }
  catch { return []; }
})();
// Skill names now carry a literal "." (the grimorio.<name> convention) -- unescaped, that "." is a regex
// metacharacter (matches any char) once spliced into OLD_FORM/OLD_FRAGMENT below, silently over-matching.
// Escaped here once, at the source, rather than trusting every future splice site to remember to.
const escapeReLiteral = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// TWO AXES, because one prefix could only say WHERE a thing lives, never what relation the writer has
// with it: RELATION (import loads it, ref points at it, cite offers it as proof) x STORE (skill/repo/tmp).
// `@rev` pins a citation to a MOMENT. A resolving path is not a live citation -- the file gets rewritten
// underneath and the cite stays green (Klein et al. 2014, "reference rot"). Only `cite:` needs it.
// `ext` = another project's tree. Never resolved locally, so it must carry @rev.
const TWO_AXIS = /\b(import|ref|cite):(skill|repo|tmp|ext)\/([A-Za-z0-9._/-]+)(@[0-9a-f]{7,40})?(#[A-Za-z0-9._/-]+)?/g;
const NEW_FORM = /skill:([a-z][a-z0-9-]*)((?:\/[A-Za-z0-9._-]+)*)(#[A-Za-z0-9._-]+)?/g;
// A backticked name is only a LOAD reference when it names a real skill directory; `foo.ts` never is.
const SKILL_NAMES_RE = SKILL_NAMES.map(escapeReLiteral).join("|");
const OLD_FORM = new RegExp("`(" + SKILL_NAMES_RE + ")`", "g");
// The old fragment form: a backticked skill directory followed by a path. This is the migration's next queue.
const OLD_FRAGMENT = new RegExp("`(" + SKILL_NAMES_RE + ")(/[A-Za-z0-9._/-]+)`", "g");

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

// COLD: a flat handle, unopenable by construction. Spec: grimorio.agent-writing/project.cold-store.md
const COLD = /\bcold:([a-z0-9][a-z0-9-]*)(#[A-Za-z0-9._-]+)?/g;
const COLD_MANIFEST = ".claude/skills/grimorio.agent-writing/project.cold-store.md";
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
// The vocabulary of what agents PRODUCE, from grimorio.feature-workflow/SKILL.md, plus the four-level KIND names
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

// GENERAL -> PROJECT/CODE CITATION BOUNDARY (CEO ruling 2026-08-14/15; see the commit message and
// grimorio.agent-writing/SKILL.md for the full ruling and the incident it closes). Hand-maintained pattern list,
// same style as GOVERNANCE_OWNED above: extend by evidence (a real leak found), never by guessing ahead.
const PROJECT_OR_CODE = [
  /^\.claude\/current-objective\.md$/,
  /^\.claude\/ceo-corrections\.md$/,
  /^\.claude\/grimorio-defects(-narrative)?\.md$/,
  /^\.claude\/GRIMORIO-CHAIN\.md$/,
  /^\.claude\/\.cache\//,
  /^\.claude\/skills\/[^/]+\/project\.md$/,
  /^\.claude\/skills\/[^/]+\/[a-z0-9-]*vision(-pointers)?\.md$/,
  /^\.claude\/skills\/[^/]+\/features-status\.md$/,
  /^apps\//,
  /^services\//,
  /^packages\//,
  /^objectives\//,
];
const isProjectOrCode = (rel) => PROJECT_OR_CODE.some((re) => re.test(rel.replace(/\\/g, "/").replace(/^\.\//, "")));
// SOURCE = general-level. Only SKILL.md exports (the same `exportable` test the relative-path rule above
// already applies) -- a behavior/project/code file is EXPECTED to cite project/code state, so only the
// general file is checked here.
const generalFiles = files.filter((f) => /[\\/]SKILL\.md$/.test(f));
// Any mention starting with one of the five project-tree roots, prefixed (`ref:repo/apps/...`) or bare
// (`` `apps/web` ``, `.claude/current-objective.md` in prose) -- a broad candidate net, narrowed by
// isProjectOrCode() below, not by the shape of how it was written.
const LEVEL_CANDIDATE = /(?:\.claude\/[A-Za-z0-9._/-]+|apps\/[A-Za-z0-9._/-]*|services\/[A-Za-z0-9._/-]*|packages\/[A-Za-z0-9._/-]*|objectives\/[A-Za-z0-9._/-]*)/g;
const levelViolations = generalFiles.flatMap((f) => {
  const rel = f.replace(/\\/g, "/");
  const seen = new Map(); // target -> first line it appeared on
  let fenced = false;
  readFileSync(f, "utf8").split(/\r?\n/).forEach((line, i) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return; }
    if (fenced) return;
    for (const m of line.matchAll(LEVEL_CANDIDATE)) {
      const tok = m[0].replace(/[.,;:)]+$/, "");
      if (!seen.has(tok)) seen.set(tok, i + 1);
    }
  });
  return [...seen].filter(([tok]) => isProjectOrCode(tok)).map(([target, line]) => ({ file: rel, line, target }));
});

// PORTABILITY MARKER SCAN (mechanical PROXY only -- see the commit message and grimorio.agent-writing/SKILL.md
// Portability standard / grimorio.prompt-writing-quality/SKILL.md L8 for the real semantic test this can never
// replace). Hand-maintained list, same style as PROJECT_OR_CODE above: extend by evidence, never by
// guessing ahead. Any project.* shells are EXEMPT -- project-specific by nature.
//
// ADOPTERS: this list is YOURS to own. The entries below are generic stack/tech names kept as worked
// examples of the right grain. Add your own product name, service names, and top-level source directories
// -- those are the markers that actually catch a portability leak in YOUR corpus.
const PROJECT_MARKERS = [
  /\bFastAPI\b/,
  /\bPhaser(?:\s*3)?\b/,
  /\bPixiJS\b/,
  /\bTiled\b/,
  /\bNeon\b/,
  /\bClerk\b/,
  /\bPrisma\b/,
  /\bNext\.js\b/,
  /\bapps\/web\b/,
  /\bpackages\/(shared|workflow-engine)\b/,
  // Added 2026-09-01, evidenced by the js-developer-memory/behavior.md leak (see commit message).
  /\bapplication\/\*\*/,
  /\binfrastructure\/\*\*/,
  /\bdomain\/\*\*/,
  /\bFake\/Real[- ]adapter\b/i,
];
const isProjectMarker = (line) => PROJECT_MARKERS.find((re) => re.test(line));
const agentShellFiles = files.filter((f) => /[\\/]agents[\\/][A-Za-z0-9._-]+\.md$/.test(f) && !/[\\/]agents[\\/]project\./.test(f));
// Added 2026-09-01: widens the scan past the THIN agent shell to the behavior/SKILL/phase files where the
// actual prose (and the js-developer-memory leak above) actually lives. Same `project.*` exemption as above.
const portableSkillFiles = files.filter((f) => {
  const rel = f.replace(/\\/g, "/");
  const m = rel.match(/^\.claude\/skills\/(grimorio\.[^/]+)\/(.+)$/);
  if (!m) return false;
  const restPath = m[2]; // path INSIDE the skill folder, e.g. "behavior.md" or "prompt-writer-phases/phase-1-search-first.md"
  const base = restPath.split("/").pop();
  if (/^project\./.test(base)) return false;
  // DIRECT child only -- behavior.md/SKILL.md/*-behavior.md; excludes nested docs/*-behavior.md research
  // archives (documentation-memory's own domain, not this scan's).
  if (!restPath.includes("/")) return /^(behavior|SKILL)\.md$/.test(base) || /^[a-z0-9-]+-behavior\.md$/.test(base);
  // ONE level inside a "*-phases" folder -- the phase-chain files (phase-1-*.md, phase-2-*.md, ...).
  const phaseDirMatch = restPath.match(/^[a-z0-9.-]+-phases\/([^/]+)$/);
  if (phaseDirMatch) return /^phase-\d+-.*\.md$/.test(phaseDirMatch[1]);
  return false;
});
const portabilityScanFiles = [...agentShellFiles, ...portableSkillFiles];
const portabilityViolations = portabilityScanFiles.flatMap((f) => {
  const rel = f.replace(/\\/g, "/");
  let fenced = false;
  let fenceLang = "";
  const out = [];
  readFileSync(f, "utf8").split(/\r?\n/).forEach((line, i) => {
    const fenceMatch = line.match(/^\s*```\s*([A-Za-z0-9_-]*)/);
    if (fenceMatch) {
      if (!fenced) { fenced = true; fenceLang = fenceMatch[1] || ""; }
      else { fenced = false; fenceLang = ""; }
      return;
    }
    // Added 2026-09-01: an UNLABELED fence (prose formatted as code, e.g. an ASCII scope-boundary block)
    // stays SCANNED; a LANGUAGE-TAGGED fence stays SKIPPED as a genuine code/diagram example (see commit msg).
    if (fenced && fenceLang) return;
    const hit = isProjectMarker(line);
    if (hit) out.push({ file: rel, line: i + 1, marker: hit.source });
  });
  return out;
});

// @keep-comment — DEPENDENCY-DIRECTION (CEO ruling 2026-08-28, grimorio.agent-writing/SKILL.md Part 3): scope is
// the file's OWN first path segment (skill folder / agent shell filename), not its basename -- a
// `project.*` companion file inside a `grimorio.` folder stays in scope. See the commit that added this
// for the full ruling.
//
// EXEMPTION WIDENED 2026-08-28, same-day fix authorized by grimorio.system-keeper (own spec bug, not a
// new CEO-vision question): the original exemption covered only the literal bare token `project.md`
// (no preceding `/`) -- written before the corpus restructure that turned EVERY reference-depth
// companion file into a `project.<name>.md`. Against the real corpus this flagged 917 rows, all but a
// handful of which were well-formed `ref:`/`import:`/`agent:`/`cite:` pointers into a companion file --
// exactly the reference-depth pattern agent-writing's own "don't hyper-compress" section requires, never
// an inlined project-specific FACT (the actual thing this rule exists to catch). The exemption now
// mirrors --levels' own precedent (an expected-to-cite file class is exempt, not merely one filename):
// a `project.<x>` token is exempt when it is the tail of a WELL-FORMED, resolvable reference --
// `ref:`/`import:`/`cite:` into `skill/…`, `repo/…`, `tmp/…`, or `ext/…`; `agent:project.<name>`; or a
// relative `./project.<x>` pointer -- never a bare `project.<x>` string sitting in prose outside any of
// those forms. The original bare-`project.md`-self-reference exemption is kept as its own, narrower
// case: unlike the others it carries NO relation prefix at all, so it cannot be captured by widening the
// reference envelope alone. @keep-comment
const directionScopeFiles = files.filter((f) => {
  const rel = f.replace(/\\/g, "/");
  const skillSeg = rel.match(/^\.claude\/skills\/([^/]+)\//);
  if (skillSeg) return skillSeg[1].startsWith("grimorio.");
  const agentSeg = rel.match(/^\.claude\/agents\/([^/]+)$/);
  if (agentSeg) return agentSeg[1].startsWith("grimorio.");
  return false;
});
const DIRECTION_TOKEN = /\bproject\.[A-Za-z0-9_-]+/g;
// A "well-formed reference envelope" -- a project.<x> token found INSIDE one of these spans is a
// pointer, not a citation. Each alternative's own path/name segment already allows the token as its
// tail, so a single pass finds the whole reference, not just the project. fragment inside it.
const REFERENCE_ENVELOPE = /\b(?:ref|import|cite):(?:skill|repo|tmp|ext)\/[A-Za-z0-9._/-]*project\.[A-Za-z0-9_-]+|\bagent:project\.[A-Za-z0-9_-]+|\.\/project\.[A-Za-z0-9_-]+/g;
const directionViolations = directionScopeFiles.flatMap((f) => {
  const rel = f.replace(/\\/g, "/");
  let fenced = false;
  const out = [];
  readFileSync(f, "utf8").split(/\r?\n/).forEach((line, i) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return; }
    if (fenced) return;
    const envelopes = [...line.matchAll(REFERENCE_ENVELOPE)].map((e) => [e.index, e.index + e[0].length]);
    for (const m of line.matchAll(DIRECTION_TOKEN)) {
      const tok = m[0];
      const bareSelfRef = tok === "project.md" && line[m.index - 1] !== "/";
      if (bareSelfRef) continue;
      const wellFormed = envelopes.some(([s, e]) => m.index >= s && m.index + tok.length <= e);
      if (wellFormed) continue;
      out.push({ file: rel, line: i + 1, token: tok, context: line.trim() });
    }
  });
  return out;
});

// GRAPH-FIRST: mechanizes prompt-writer's own Phase 4 step 3
// (grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md step 3), which today performs this check BY
// EYE. Checks only where phrasing is unambiguous: the corpus's own two established phrasings ("state ... own
// graph", "state ... graph") are the patterns matched, nothing invented.

// HEADING-SECTION SLICING, shared by this gate and --examples below: reuses the same fenced-tracking heading
// walk outline()/shape() already do above, generalized to also cut out ONE section's body (heading to the
// next heading of equal-or-higher level, or EOF) instead of the whole file.
function headingSections(text, matches) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let fenced = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) { fenced = !fenced; continue; }
    if (fenced) continue;
    const h = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (!h || !matches(h[2].replace(/[*`]/g, "").trim(), h[1].length)) continue;
    const level = h[1].length;
    let end = lines.length;
    let f2 = false;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^\s*```/.test(lines[j])) { f2 = !f2; continue; }
      if (f2) continue;
      const hh = lines[j].match(/^(#{1,6})\s/);
      if (hh && hh[1].length <= level) { end = j; break; }
    }
    out.push({ headingLine: i + 1, body: lines.slice(i + 1, end) });
  }
  return out;
}

// The FIRST rule/list-item after a heading, continuation lines joined -- same wrap rule logicalLines() above
// already applies to a `**KIND**` rule, generalized to any numbered/bulleted item so a graph-definition step
// phrased across two physical lines is not missed just because the matched phrase sits on line 2.
function firstItemText(body) {
  const start = body.findIndex((l) => /^\s*(?:[-*+]|\d+[.)])\s/.test(l));
  if (start === -1) return null;
  let joined = body[start];
  for (let j = start + 1; j < body.length; j++) {
    const nxt = body[j];
    if (!nxt.trim() || /^\s*(?:[-*+]|\d+[.)])\s/.test(nxt) || /^\s{0,3}#/.test(nxt) || /^\s*\|/.test(nxt)) break;
    if (!/^\s{2,}\S/.test(nxt)) break; // continuation lines are indented, same test logicalLines() uses
    joined += " " + nxt.trim();
  }
  return joined;
}

const GRAPH_FIRST_RE = /\bown graph\b|\bstate.*graph\b/i;
const stepsScan = files.map((f) => ({
  file: f.replace(/\\/g, "/"),
  sections: headingSections(readFileSync(f, "utf8"), (t, lvl) => (lvl === 2 || lvl === 3) && /^Steps$/.test(t)),
}));
const stepsHeadingsTotal = stepsScan.reduce((n, s) => n + s.sections.length, 0);
const graphFirstViolations = stepsScan.flatMap((s) =>
  s.sections.flatMap((sec) => {
    const first = firstItemText(sec.body);
    if (first && GRAPH_FIRST_RE.test(first)) return [];
    return [{
      file: s.file,
      line: sec.headingLine,
      first: first ? first.replace(/\*\*/g, "").trim().slice(0, 90) : "(no rule/list item found under this heading)",
    }];
  }));

// @keep-comment EXAMPLES: a narrow, HONESTLY-SCOPED deterministic proxy for "no real example was shown" in
// an output contract -- same discipline as --inert's own comment above about what it can and cannot see. This
// can only prove ABSENCE: an Output section with ZERO fenced code blocks carries no example artifact at all,
// a strong unambiguous signal. It deliberately CANNOT and does NOT verify that a fenced block, once present,
// is genuinely EXACT/real rather than a stylized placeholder -- that judgment stays human/prompt-writer's,
// never this script's.
const outputScan = files.map((f) => ({
  file: f.replace(/\\/g, "/"),
  sections: headingSections(readFileSync(f, "utf8"), (t) => /^output$/i.test(t)),
}));
const outputHeadingsTotal = outputScan.reduce((n, s) => n + s.sections.length, 0);
const examplesViolations = outputScan.flatMap((s) =>
  s.sections.flatMap((sec) =>
    sec.body.some((l) => /^\s*```/.test(l)) ? [] : [{ file: s.file, line: sec.headingLine }]));

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

// DIAGRAM-PRIMACY companion: exempt file classifier
const isExemptCompanion = (file) => {
  const basename = file.replace(/\\/g, "/").split("/").pop().toLowerCase();
  if (/^(boundaries|coverage|provenance)\.md$/.test(basename)) return true;
  const text = readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    const h = line.match(/^#{1,6}\s+(.*)$/);
    if (h) {
      const headingText = h[1].replace(/[*`]/g, "").trim();
      if (/^(negative scope|out of scope|boundaries|coverage|provenance)\b/i.test(headingText)) {
        return true;
      }
      break;
    }
  }
  return false;
};

// Precompute diagram primacy results for all files (mirrors pattern of graphFirstViolations, etc.)
const diagramPrimacyResults = files.map((f) => {
  const shape = diagramPrimacyShape(f);
  const relPath = f.replace(/\\/g, "/");

  if (isExemptCompanion(f)) {
    return { file: relPath, status: "EXEMPT", reason: "whole-file companion" };
  }

  const nonExemptProse = shape.primacyProse - shape.exemptProse;
  const diagramPlusTable = shape.mermaidLines + shape.table;

  const reasons = [];
  if (shape.mermaidBlocks === 0 && shape.table === 0) {
    reasons.push("zero diagram, zero table");
  }
  if (nonExemptProse > diagramPlusTable) {
    reasons.push(`prose (${nonExemptProse}) exceeds diagram+table (${diagramPlusTable})`);
  }

  if (reasons.length === 0) {
    return { file: relPath, status: "PASS", diagram: shape.mermaidBlocks, mermaidLines: shape.mermaidLines, table: shape.table, primacyProse: shape.primacyProse };
  } else {
    return { file: relPath, status: "FAIL", reason: reasons.join("; "), diagram: shape.mermaidBlocks, mermaidLines: shape.mermaidLines, table: shape.table, primacyProse: shape.primacyProse };
  }
});

// Precompute scaffolding-leak results (defect a mechanism, Gate: reader path vs PROVENANCE companion).
const scaffoldingLeakResults = files.map((f) => {
  const relPath = f.replace(/\\/g, "/");
  if (isExemptCompanion(f)) return { file: relPath, status: "EXEMPT", reason: "whole-file companion" };
  const hits = scaffoldingLeakShape(f);
  if (hits.length === 0) return { file: relPath, status: "PASS" };
  return { file: relPath, status: "FAIL", hits };
});

// Precompute AS-IS-voice results (defect b mechanism), grouped by directory family.
const asIsVoiceByDir = new Map();
for (const f of files) {
  const dir = f.replace(/\\/g, "/").split("/").slice(0, -1).join("/");
  if (!asIsVoiceByDir.has(dir)) asIsVoiceByDir.set(dir, []);
  asIsVoiceByDir.get(dir).push(f);
}
const asIsVoiceResults = files.map((f) => {
  const relPath = f.replace(/\\/g, "/");
  const dir = relPath.split("/").slice(0, -1).join("/");
  const dirFiles = asIsVoiceByDir.get(dir) || [f];
  const markerPresent = dirFiles.some((df) => readFileSync(df, "utf8").includes(AS_IS_ONLY_MARKER));
  if (!markerPresent) return { file: relPath, status: "PASS", reason: "no AS-IS-ONLY marker in this family" };
  if (isExemptCompanion(f)) return { file: relPath, status: "EXEMPT", reason: "whole-file companion" };
  const hits = asIsVoiceShape(f);
  if (hits.length === 0) return { file: relPath, status: "PASS" };
  return { file: relPath, status: "FAIL", hits };
});

// Precompute diagram-classes inventory (defect c mechanism) -- never gates, reporting only.
const diagramClassesResults = files.map((f) => {
  const relPath = f.replace(/\\/g, "/");
  const shape = diagramClassesShape(f);
  return { file: relPath, types: shape.types, matrixTableSeen: shape.matrixTableSeen };
});

// Lazy enumeration-coverage results computation (Empirical Domain Enumeration section validation)
function computeEnumerationCoverageResults() {
  return files
    .filter((f) => f.replace(/\\/g, "/").endsWith("provenance.md"))
    .map((f) => {
      const relPath = f.replace(/\\/g, "/");
      const text = readFileSync(f, "utf8");

      // Check if section exists: exactly "## Empirical Domain Enumeration"
      const sectionRegex = /^## Empirical Domain Enumeration\s*$/m;
      if (!sectionRegex.test(text)) {
        return { file: relPath, status: "SKIP", reason: "no Empirical Domain Enumeration section" };
      }

      // Find section boundaries
      const lines = text.split(/\r?\n/);
      let sectionStart = -1, sectionEnd = lines.length;
      for (let i = 0; i < lines.length; i++) {
        if (/^## Empirical Domain Enumeration\s*$/.test(lines[i])) {
          sectionStart = i;
        } else if (sectionStart >= 0 && /^#+\s/.test(lines[i])) {
          sectionEnd = i;
          break;
        }
      }

      if (sectionStart < 0) {
        return { file: relPath, status: "SKIP", reason: "no Empirical Domain Enumeration section" };
      }

      const sectionText = lines.slice(sectionStart + 1, sectionEnd).join("\n");

      // Extract sweep command from backticks
      const sweepMatch = sectionText.match(/Sweep command:\s*`([^`]+)`/i);
      if (!sweepMatch) {
        return { file: relPath, status: "FAIL", reason: "no Sweep command found in Empirical Domain Enumeration section" };
      }
      const sweepCmd = sweepMatch[1];

      // Extract table with Entry Point and Disposition columns
      const tableLines = sectionText.split("\n").filter((l) => /^\s*\|/.test(l));
      if (tableLines.length < 3) { // need header, separator, at least 1 data row
        return { file: relPath, status: "FAIL", reason: "no Entry Point/Disposition table found" };
      }

      // Parse header to find column indices
      const headerLine = tableLines[0];
      const headerCells = headerLine.split("|").slice(1, -1).map((c) => c.trim().toLowerCase());
      const epIndex = headerCells.findIndex((c) => c === "entry point");
      const dispIndex = headerCells.findIndex((c) => c === "disposition");
      const reasonIndex = headerCells.findIndex((c) => c === "reason" || c === "locator");

      if (epIndex < 0 || dispIndex < 0) {
        return { file: relPath, status: "FAIL", reason: "no Entry Point/Disposition table found" };
      }

      // Parse data rows
      const tableRows = [];
      for (let i = 2; i < tableLines.length; i++) {
        const cells = tableLines[i].split("|").slice(1, -1);
        if (cells.length > Math.max(epIndex, dispIndex)) {
          const ep = cells[epIndex].replace(/[`\s]/g, "").trim();
          const disp = cells[dispIndex].trim();
          const reason = reasonIndex >= 0 ? cells[reasonIndex].trim() : disp;
          if (ep) tableRows.push({ ep, disp, reason });
        }
      }

      // Run sweep command
      const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
      let sweepOutput = [];
      try {
        const output = execSync(sweepCmd, { cwd: repoRoot, shell: true, encoding: "utf8" });
        sweepOutput = output.split("\n").map((l) => l.trim()).filter(Boolean);
      } catch (e) {
        return { file: relPath, status: "FAIL", reason: `sweep command failed to execute: ${sweepCmd}` };
      }

      // Normalize paths for comparison
      const normalizePath = (p) => {
        const normalized = p.replace(/\\/g, "/");
        const resolved = isAbsolute(normalized) ? normalized : join(repoRoot, normalized);
        return join(resolved).split(/[\\\/]/).join("/");
      };

      const normalizedSweep = sweepOutput.map((p) => {
        const normalized = normalizePath(p);
        const repoPrefix = repoRoot.replace(/\\/g, "/");
        return normalized.startsWith(repoPrefix) ? normalized.slice(repoPrefix.length + 1) : normalized;
      });

      const tableEPs = new Set(tableRows.map((r) => {
        const normalized = normalizePath(r.ep);
        const repoPrefix = repoRoot.replace(/\\/g, "/");
        return normalized.startsWith(repoPrefix) ? normalized.slice(repoPrefix.length + 1) : normalized;
      }));

      // Check for missing entry points
      const missing = normalizedSweep.filter((p) => !tableEPs.has(p));
      if (missing.length > 0) {
        return { file: relPath, status: "FAIL", reason: `${missing.length} entry point(s) found by the live sweep with no row in the enumeration table: ${missing.join(", ")}` };
      }

      // Check for empty disposition/reason
      const undispositioned = tableRows.filter((r) => !r.disp || (reasonIndex >= 0 && !r.reason));
      if (undispositioned.length > 0) {
        return { file: relPath, status: "FAIL", reason: `${undispositioned.length} row(s) in the enumeration table carry no disposition/reason: ${undispositioned.map((r) => r.ep).join(", ")}` };
      }

      return { file: relPath, status: "PASS" };
    });
}

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
  const guide = ".claude/skills/grimorio.prompt-writing-quality/project.format-guide.md";
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
} else if (args.includes("--levels")) {
  const filter = args.find((a) => !a.startsWith("--"));
  const rows = filter ? levelViolations.filter((v) => v.file.includes(filter)) : levelViolations;
  for (const v of rows) console.log(`${v.file}:${v.line}  cites PROJECT/CODE state  ${v.target}`);
  console.log(`\ngeneral-level files scanned (SKILL.md)   ${generalFiles.length}`);
  console.log(`GENERAL -> PROJECT/CODE citations         ${rows.length}   POPULATION: every SKILL.md file, no other level checked`);
  process.exit(rows.length ? 1 : 0);
} else if (args.includes("--portability")) {
  const filter = args.find((a) => !a.startsWith("--"));
  const rows = filter ? portabilityViolations.filter((v) => v.file.includes(filter)) : portabilityViolations;
  for (const v of rows) console.log(`${v.file}:${v.line}  project-marker in a portable file  ${v.marker}`);
  console.log(`\nagent shells scanned (excluding project.*)              ${agentShellFiles.length}`);
  console.log(`portable skill files scanned (behavior.md/SKILL.md/phase-*.md, excluding project.*)   ${portableSkillFiles.length}`);
  console.log(`PROJECT-MARKER matches in portable files      ${rows.length}   PROXY ONLY -- the real test is the three portability questions (grimorio.agent-writing/SKILL.md, grimorio.prompt-writing-quality/SKILL.md L8), never this word list alone.`);
  process.exit(rows.length ? 1 : 0);
} else if (args.includes("--direction")) {
  const filter = args.find((a) => !a.startsWith("--"));
  const rows = filter ? directionViolations.filter((v) => v.file.includes(filter)) : directionViolations;
  for (const v of rows) console.log(`${v.file}:${v.line}  grimorio.-prefixed file cites project.-level content  ${v.token}   (${v.context})`);
  console.log(`\ngrimorio.-prefixed files scanned   ${directionScopeFiles.length}`);
  console.log(`GRIMORIO -> PROJECT citations       ${rows.length}   POPULATION: every file whose own path starts with grimorio. (skill folder or agent shell), excluding a bare project.md self-reference`);
  process.exit(rows.length ? 1 : 0);
} else if (args.includes("--graph-first")) {
  const filter = args.find((a) => !a.startsWith("--"));
  // A COUNT NEEDS ITS POPULATION: `rows` (violations) and the printed "scanned" total must both be scoped to
  // the SAME population -- files whose path matches `filter` -- or a non-matching filter (typo, renamed file,
  // overly-narrow substring) can print a plausible non-zero "scanned" total and exit 0, indistinguishable
  // from a genuine clean pass on a real, matched file.
  const matchedFiles = filter ? stepsScan.filter((s) => s.file.includes(filter)) : stepsScan;
  if (filter && !matchedFiles.length) {
    console.log(`\nfilter "${filter}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }
  const scopedTotal = matchedFiles.reduce((n, s) => n + s.sections.length, 0);
  const rows = filter ? graphFirstViolations.filter((v) => v.file.includes(filter)) : graphFirstViolations;
  for (const v of rows) console.log(`${v.file}:${v.line}  Steps heading's first item is not a graph-definition step  ${v.first}`);
  // It printed NOTHING AT ALL when the count was zero -- --anchors' own fix applies here too: a blank
  // screen is indistinguishable from a probe that never ran. State the total and the reach every time.
  console.log(`\nSteps headings scanned ${scopedTotal}   NOT opening with a graph-definition step  ${rows.length}`);
  process.exit(rows.length ? 1 : 0);
} else if (args.includes("--examples")) {
  const filter = args.find((a) => !a.startsWith("--"));
  // Same population fix as --graph-first above -- see that branch's comment for the full rationale.
  const matchedFiles = filter ? outputScan.filter((s) => s.file.includes(filter)) : outputScan;
  if (filter && !matchedFiles.length) {
    console.log(`\nfilter "${filter}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }
  const scopedTotal = matchedFiles.reduce((n, s) => n + s.sections.length, 0);
  const rows = filter ? examplesViolations.filter((v) => v.file.includes(filter)) : examplesViolations;
  for (const v of rows) console.log(`${v.file}:${v.line}  Output section has ZERO fenced code blocks`);
  console.log(`\nOutput headings scanned ${scopedTotal}   with NO fenced example  ${rows.length}`);
  process.exit(rows.length ? 1 : 0);
} else if (args.includes("--diagram-primacy")) {
  const target = args.find((a) => !a.startsWith("--"));
  const rows = target ? diagramPrimacyResults.filter((r) => r.file.includes(target)) : diagramPrimacyResults;
  if (target && !rows.length) {
    console.log(`\nfilter "${target}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }

  if (!target) {
    console.log("NOTE: unfiltered run -- scanning the WHOLE base population (.claude/agents + .claude/skills), not a GATE 6 verdict for any specific design family. GATE 6 only governs a design-family's own concern files; pass a [filter] narrowing to those files for a real gate check.\n");
  }

  let passed = 0, failed = 0, exempt = 0;
  for (const r of rows) {
    if (r.status === "PASS") {
      passed++;
      console.log(`PASS  ${r.file}  (diagram: ${r.diagram} block/${r.mermaidLines} line, table: ${r.table} line, prose: ${r.primacyProse} line)`);
    } else if (r.status === "FAIL") {
      failed++;
      console.log(`FAIL  ${r.file}  ${r.reason}  (diagram: ${r.diagram} block/${r.mermaidLines} line, table: ${r.table} line, prose: ${r.primacyProse} line)`);
    } else if (r.status === "EXEMPT") {
      exempt++;
      console.log(`EXEMPT  ${r.file}  (whole-file companion)`);
    }
  }

  console.log(`--- ${rows.length} file(s), ${passed} passed, ${failed} failed, ${exempt} exempt ---`);
  process.exit(failed === 0 ? 0 : 1);
} else if (args.includes("--no-scaffolding-leak")) {
  const target = args.find((a) => !a.startsWith("--"));
  const rows = target ? scaffoldingLeakResults.filter((r) => r.file.includes(target)) : scaffoldingLeakResults;
  if (target && !rows.length) {
    console.log(`\nfilter "${target}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }
  if (!target) {
    console.log("NOTE: unfiltered run -- scanning the WHOLE base population, not a verdict for any specific design family. This check only governs a design-family's own produced files (under designs/); a doctrine/methodology file legitimately DISCUSSING the scaffolding vocabulary (this very corpus) will FAIL here without meaning anything -- pass a [filter] narrowing to a designs/<family> path for a real gate check.\n");
  }
  let passed = 0, failed = 0, exempt = 0;
  for (const r of rows) {
    if (r.status === "PASS") { passed++; console.log(`PASS  ${r.file}`); }
    else if (r.status === "EXEMPT") { exempt++; console.log(`EXEMPT  ${r.file}  (whole-file companion)`); }
    else {
      failed++;
      const detail = r.hits.map((h) => `${r.file}:${h.line} "${h.marker}"`).join("; ");
      console.log(`FAIL  ${r.file}  scaffolding vocabulary present: ${detail}`);
    }
  }
  console.log(`--- ${rows.length} file(s), ${passed} passed, ${failed} failed, ${exempt} exempt ---`);
  console.log("NARROW SIGNAL ONLY -- a fixed substring matcher; FAIL is real evidence, PASS is NOT proof of absence. A by-hand semantic check is still required, per phase-6 CHECK 1.");
  process.exit(failed === 0 ? 0 : 1);
} else if (args.includes("--as-is-voice")) {
  const target = args.find((a) => !a.startsWith("--"));
  const rows = target ? asIsVoiceResults.filter((r) => r.file.includes(target)) : asIsVoiceResults;
  if (target && !rows.length) {
    console.log(`\nfilter "${target}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }
  if (!target) {
    console.log("NOTE: unfiltered run -- scanning the WHOLE base population, not a verdict for any specific design family. \"Family\" here means every file sharing one parent directory; pass a [filter] narrowing to a designs/<family> path for a real gate check.\n");
  }
  let passed = 0, failed = 0, exempt = 0;
  for (const r of rows) {
    if (r.status === "PASS") { passed++; console.log(`PASS  ${r.file}`); }
    else if (r.status === "EXEMPT") { exempt++; console.log(`EXEMPT  ${r.file}  (whole-file companion)`); }
    else {
      failed++;
      const detail = r.hits.map((h) => `${r.file}:${h.line} "${h.marker}"`).join("; ");
      console.log(`FAIL  ${r.file}  build-relative vocabulary present under an AS-IS-ONLY marker: ${detail}`);
    }
  }
  console.log(`--- ${rows.length} file(s), ${passed} passed, ${failed} failed, ${exempt} exempt ---`);
  console.log("NARROW SIGNAL ONLY -- a fixed substring matcher; FAIL is real evidence, PASS is NOT proof of absence. A by-hand semantic check is still required, per phase-6 CHECK 1.");
  process.exit(failed === 0 ? 0 : 1);
} else if (args.includes("--diagram-classes")) {
  const target = args.find((a) => !a.startsWith("--"));
  const rows = target ? diagramClassesResults.filter((r) => r.file.includes(target)) : diagramClassesResults;
  if (target && !rows.length) {
    console.log(`\nfilter "${target}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }
  if (!target) {
    console.log("NOTE: unfiltered run -- scanning the WHOLE base population, not one design family's own inventory. Pass a [filter] narrowing to a designs/<family> path before cross-referencing against Gate 7.\n");
  }
  console.log("INVENTORY ONLY -- this flag never gates; cross-reference against Gate 7's own required class set per problem TYPE, per phase-6 CHECK 1.\n");
  for (const r of rows) {
    const typesStr = r.types.length ? r.types.join(", ") : "(none)";
    console.log(`${r.file}  types: ${typesStr}  matrix-table: ${r.matrixTableSeen ? "yes" : "no"}`);
  }
  console.log(`\n${rows.length} file(s) scanned`);
  process.exit(0);
} else if (args.includes("--enumeration-coverage")) {
  const target = args.find((a) => !a.startsWith("--"));
  const rows = target ? computeEnumerationCoverageResults().filter((r) => r.file.includes(target)) : computeEnumerationCoverageResults();
  if (target && !rows.length) {
    console.log(`\nfilter "${target}" matched ZERO files -- nothing was scanned. This is NOT a clean pass; fix the filter.`);
    process.exit(2);
  }
  if (!target) {
    console.log("NOTE: unfiltered run -- scanning the WHOLE base population of provenance.md files, not a verdict for any specific design family. Pass a [filter] narrowing to a designs/<family> path for a real gate check.\n");
  }
  let passed = 0, failed = 0, skipped = 0;
  for (const r of rows) {
    if (r.status === "PASS") { passed++; console.log(`PASS  ${r.file}`); }
    else if (r.status === "SKIP") { skipped++; console.log(`SKIP  ${r.file}  (${r.reason})`); }
    else {
      failed++;
      console.log(`FAIL  ${r.file}  ${r.reason}`);
    }
  }
  console.log(`--- ${rows.length} file(s), ${passed} passed, ${failed} failed, ${skipped} skipped ---`);
  console.log("NARROW SIGNAL ONLY -- this tool proves a MISSING row or an undispositioned row when its own sweep command actually finds one; it CANNOT prove the recorded sweep command itself is honest/complete. A by-hand semantic check is still required, per phase-6 CHECK 1.");
  process.exit(failed === 0 ? 0 : 1);
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
  console.log(`GENERAL -> PROJECT/CODE citations ${levelViolations.length}   in ${new Set(levelViolations.map((v) => v.file)).size} of ${generalFiles.length} SKILL.md files   (--levels)`);
  console.log(`PROJECT-MARKER matches in portable files    ${portabilityViolations.length}   in ${new Set(portabilityViolations.map((v) => v.file)).size} of ${portabilityScanFiles.length} portable files (${agentShellFiles.length} agent shells + ${portableSkillFiles.length} behavior.md/SKILL.md/phase-*.md, excluding project.*)   (--portability, PROXY ONLY)`);
  console.log(`GRIMORIO -> PROJECT citations              ${directionViolations.length}   in ${new Set(directionViolations.map((v) => v.file)).size} of ${directionScopeFiles.length} grimorio.-prefixed files   (--direction [filter])`);
  console.log(`Steps headings opening with a graph-definition step  ${stepsHeadingsTotal - graphFirstViolations.length} / ${stepsHeadingsTotal}   (--graph-first [filter])`);
  console.log(`Output headings carrying >=1 fenced example          ${outputHeadingsTotal - examplesViolations.length} / ${outputHeadingsTotal}   (--examples [filter])`);
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
  console.log(`  --dupes --fragments --loads --selfrefs --inert --malformed --kinds --json --levels [filter] --portability [filter]`);
  console.log(`  --graph-first [filter] --examples [filter] --direction [filter] --diagram-primacy [filter]`);
  console.log(`  --no-scaffolding-leak [filter] --as-is-voice [filter] --diagram-classes [filter] --enumeration-coverage [filter]`);
}
