// Checks the SHAPE of a prompt file -- what a line count cannot see: the frontmatter description (a trigger,
// never doctrine), a behavior file's required sections, and the file's own weight in words and estimated
// tokens. A prompt, by construction: an agent shell, any file of a general skill, a store skill's SKILL.md
// or behavior file. Usage: node check-prompt-shape.mjs [--json] [--strict] [--added-only] [path ...]  (no paths: every prompt)
// --added-only also checks the lines this commit ADDS (git diff --cached) for a path reference with no relation
// prefix -- new debt blocks, old debt never does.
import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { createRequire } from "module";

// @keep-comment -- a cross-file contract note: the containers come from
// .grimorio/scripts/refobl/skill-roots.json, the ONE declaration, never from a literal list here. A
// hand-copied container list in a GATE does not go noisy when it falls behind -- it goes QUIET.
// Measured 2026-10-04: a `memory` store existed for 13 real skills and this check could not see a
// single one of their SKILL.md or behavior files.
const { CORPUS_ROOTS, SKILL_ROOTS, STORES } = createRequire(import.meta.url)("../../../../.grimorio/scripts/refobl/resolve.cjs");

const DESCRIPTION_MAX_WORDS = 30;
const DOCTRINE_RE = /\b(ALWAYS|NEVER|BEFORE|WHEN|UNLESS)\b|\b20\d\d-\d\d-\d\d\b|\bCEO\b/;
// A behavior file takes one of two shapes, and the corpus uses both legitimately: FLAT (the agent's whole
// method in one file) or PHASE-ENTRY (a Phase 0 that hands off to a chain). Each owes its own three parts;
// demanding the flat set from a phase entry point would be demanding the wrong file.
const BEHAVIOR_SHAPES = {
  flat: [["core rules"], ["protocol", "steps"], ["completion", "output"]],
  "phase-entry": [["state machine", "the chain"], ["transitions", "script-driven"], ["hand-off", "handoff"]],
};
const WEIGHT = { shell: 300, behavior: 1200, skill: 2500 };
const TOKENS_PER_WORD = 1.35;

const args = process.argv.slice(2);
const asJson = args.includes("--json");
// --select prints, of the paths given, only those this check considers PROMPTS, and exits 0. It
// exists so .grimorio/scripts/pre-commit.sh selects its own staged prompt files THROUGH this module instead
// of re-deriving the same container pattern in bash -- a second copy of a gate's own classifier is
// how one of them falls behind the other.
const selectOnly = args.includes("--select");
const strict = args.includes("--strict");
const addedOnly = args.includes("--added-only");
const paths = args.filter((a) => !a.startsWith("--"));

// `skills/` is shallow and curated (a SKILL.md, a behavior file, rare companions), so matching ANY
// `.md` one level deep is safe. Every OTHER container -- `skills-store/`, and each single-rooted
// store -- is a large reference/memory collection where that same match would sweep in non-prompt
// records, so only SKILL.md and a behavior file count there. Both groups are derived from the
// shared declaration, so a new store joins the right group by construction. @keep-comment
const seg = (root) => root.replace(/^\.(claude|grimorio)\//, "").replace(/\/$/, "");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SHALLOW = [...new Set(SKILL_ROOTS.map(seg).filter((s) => s === "skills"))];
const DEEP = [...new Set([...SKILL_ROOTS.map(seg).filter((s) => s !== "skills"), ...Object.values(STORES).map(seg)])];
const PROMPT_RE = new RegExp(
  "^(?:\\.claude|\\.grimorio)\\/(agents\\/(?!harness\\.md)[^/]+\\.md"
  + (SHALLOW.length ? "|(?:" + SHALLOW.map(esc).join("|") + ")\\/[^/]+\\/[^/]+\\.md" : "")
  + (DEEP.length ? "|(?:" + DEEP.map(esc).join("|") + ")\\/[^/]+\\/(SKILL|[a-z-]*behavior)\\.md" : "")
  + ")$",
);
export { PROMPT_RE };

function allPrompts() {
  // Both roots: the real SKILL/behavior content this check validates lives under `.grimorio/` today;
  // only the discovery adapters and the agent shells stay under `.claude/`.
  const out = execFileSync("git", ["ls-files", ".claude", ".grimorio"], { encoding: "utf8" });
  return out.split("\n").filter((f) => PROMPT_RE.test(f));
}

if (selectOnly) {
  for (const p of paths) if (PROMPT_RE.test(p.replace(/\\/g, "/"))) console.log(p);
  process.exit(0);
}

function kindOf(file) {
  if (/^\.claude\/agents\//.test(file)) return "shell";
  if (/behavior\.md$/.test(file)) return "behavior";
  return "skill";
}

function description(text) {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!fm) return null;
  const m = /^description:\s*"?([\s\S]*?)"?\s*$/m.exec(fm[1]);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

function words(s) {
  return s.split(/\s+/).filter(Boolean).length;
}

const RELATION_RE = /(?:import|ref|cite|cold|agent|repo|skill):[\w./-]*$/;
// THE PIPELINE'S PER-TASK ARTIFACTS, read from the ONE place that declares them: the fenced block under
// `grimorio.feature-workflow`'s "Artifact Directory Structure". Exempt for the same reason `CLAUDE.md` is
// below -- their home is `tmp/features/{slug}/`, a placeholder that can never resolve in any installation,
// so naming one is NAMING it, never pointing at it. A `relation:` on one is dead by construction.
const PER_TASK_ARTIFACTS = (() => {
  try {
    const d = readFileSync(".grimorio/skills/grimorio.feature-workflow/SKILL.md", "utf8");
    const block = d.split("## Artifact Directory Structure")[1].split("```")[1];
    const names = block.split(String.fromCharCode(10)).map((l) => l.trim().replace(/\r$/, "")).filter((l) => /^[a-z0-9-]+[.]md$/.test(l));
    return names.length ? new Set(names) : null;
  } catch (_) {
    return null;
  }
})();
// RUNTIME STATE AND HOST WIRING are locations, not documents. The cache root is read from the ONE
// declaration that owns it, and the host's wiring file is named beside it: nothing under either is a
// document a reader resolves -- one is written by the system as it runs, the other is the installation's
// own. A `relation:` on one is a reference that cannot resolve in a fresh clone, by construction.
const LOCATION_RE = (() => {
  try {
    const d = JSON.parse(readFileSync(".grimorio/scripts/refobl/skill-roots.json", "utf8"));
    const cache = (d.cacheRoot || "").replace(/[/]$/, "");
    if (!cache) return null;
    const esc2 = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("^(?:" + esc2(cache) + "/|[.]claude/(?:settings|settings[.]local|grimorio-config|grimorio-config[.]local|board-config)[.]json$)");
  } catch (_) {
    return null;
  }
})();
const FILE_TOKEN_RE = /(?<![\w:/@-])(?:\.{1,2}\/)?(?:[\w.-]+\/)*[\w.-]+\.(?:md|mjs|cjs|js|ts|json|sh|ya?ml)(?:#[\w-]+)?(?![\w-])/g;

// A single-path `-- file` diff strands a rename's OLD side outside the comparison, so a pure rename
// reads as brand-new content. Run `-M` once over the whole staged diff and slice per file instead.
let _fullDiffSections = null;
function fullDiffSections() {
  if (_fullDiffSections) return _fullDiffSections;
  let diff;
  try {
    diff = execFileSync("git", ["diff", "--cached", "-M", "-U0"], { encoding: "utf8" });
  } catch (_) {
    diff = "";
  }
  const sections = new Map();
  let current = null;
  for (const line of diff.split(/\r?\n/)) {
    const m = /^diff --git a\/.*? b\/(.*)$/.exec(line);
    if (m) {
      current = m[1];
      sections.set(current, []);
      continue;
    }
    if (current) sections.get(current).push(line);
  }
  _fullDiffSections = sections;
  return sections;
}

function bareReferencesAdded(file) {
  const diff = (fullDiffSections().get(file) || []).join("\n");
  // Fences are read from the FILE, never from the diff: a -U0 hunk never carries the opening ```, so
  // tracking fence state across diff lines alone marks every fenced command as prose.
  const fencedLines = new Set();
  let inFence = false;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence && line.trim()) fencedLines.add(line.trim());
  }
  // Positional pairing, per hunk: -U0 shows a modified block as its whole "-" run followed by its
  // whole "+" run, not interleaved 1:1 -- a 6-line table edit pairs row i of the minus run with row i
  // of the plus run, never "the line immediately above". WHEN a hunk's minus/plus run lengths match
  // ⟶ pair them by index; a length mismatch means real insertion/deletion happened and nothing pairs.
  const diffLines = diff.split(/\r?\n/);
  const pairedMinusFor = new Map(); // "+" line index -> its paired "-" line text
  let minusRun = [];
  let plusRun = [];
  let plusStart = -1;
  function flushRun() {
    if (minusRun.length === plusRun.length) {
      for (let k = 0; k < plusRun.length; k++) pairedMinusFor.set(plusStart + k, minusRun[k]);
    }
    minusRun = [];
    plusRun = [];
    plusStart = -1;
  }
  for (let i = 0; i < diffLines.length; i++) {
    const raw = diffLines[i];
    if (raw.startsWith("---") || raw.startsWith("+++")) { flushRun(); continue; }
    if (raw.startsWith("@@")) { flushRun(); continue; }
    if (raw.startsWith("-")) {
      if (plusRun.length) flushRun();
      minusRun.push(raw.slice(1));
    } else if (raw.startsWith("+")) {
      if (plusStart === -1) plusStart = i;
      plusRun.push(raw.slice(1));
    } else {
      flushRun();
    }
  }
  flushRun();

  // Counts the bare (no relation prefix) file-token matches on ONE line, in order -- the same
  // exclusions bareness itself uses below, minus the pairing check (there is nothing to pair a "-"
  // line against). Used only to ask "was the Nth bare reference on this line ALREADY bare before?".
  function bareMatchCount(line) {
    let n = 0;
    for (const m of line.matchAll(FILE_TOKEN_RE)) {
      const before = line.slice(0, m.index);
      if (RELATION_RE.test(before)) continue;
      if (/\{[\w-]*$/.test(before)) continue;
      if (m[0] === "CLAUDE.md") continue;
      // A per-task pipeline artifact, same justification: its home is a placeholder, so there is
      // nothing to resolve. A null list means the declaration was unreadable -- then nothing is
      // exempted, because a detector that cannot read its declaration must not quietly widen.
      if (PER_TASK_ARTIFACTS && PER_TASK_ARTIFACTS.has(m[0])) continue;
      // A runtime log or the host's wiring file: a location, never a document.
      if (LOCATION_RE && LOCATION_RE.test(m[0])) continue;
      // This corpus's own LOST: marker, which NAMES a target that no longer exists. Giving it a relation
      // would assert a reference to something gone -- the marker exists precisely to say it is not there.
      if (/LOST:\s*$/.test(before)) continue;
      if (/^\s+(?:[\w-]+\s+)?--/.test(line.slice(m.index + m[0].length))) continue;
      n++;
    }
    return n;
  }

  const out = [];
  for (let i = 0; i < diffLines.length; i++) {
    const raw = diffLines[i];
    if (!raw.startsWith("+") || raw.startsWith("+++")) continue;
    const line = raw.slice(1);
    if (/^\s*```/.test(line)) continue;
    if (fencedLines.has(line.trim()) || /^\s*(node|bash|sh|python|git)\s/.test(line)) continue;
    // WHEN the paired "-" line ALREADY carried a bare reference at the SAME ordinal position (the Nth
    // bare-looking token on the line, counting only bare ones, never by character offset -- an earlier
    // substitution on the same line shifts every later offset without moving anything semantically) ⟶
    // only the filename token changed (a mechanical rename's own citation fix) -- old debt, never new.
    const pairedMinus = pairedMinusFor.has(i) ? pairedMinusFor.get(i) : null;
    const minusBareCount = pairedMinus !== null ? bareMatchCount(pairedMinus) : 0;
    let bareOrdinal = 0;
    for (const m of line.matchAll(FILE_TOKEN_RE)) {
      const before = line.slice(0, m.index);
      if (RELATION_RE.test(before)) continue;
      if (/\{[\w-]*$/.test(before)) continue;
      // The root instruction file is NAMED, not pointed at: it sits at the repo root by definition, every
      // agent already holds it, and no reader ever has to resolve a path to reach it.
      if (m[0] === "CLAUDE.md") continue;
      // A per-task pipeline artifact, same justification: its home is a placeholder, so there is
      // nothing to resolve. A null list means the declaration was unreadable -- then nothing is
      // exempted, because a detector that cannot read its declaration must not quietly widen.
      if (PER_TASK_ARTIFACTS && PER_TASK_ARTIFACTS.has(m[0])) continue;
      // A runtime log or the host's wiring file: a location, never a document.
      if (LOCATION_RE && LOCATION_RE.test(m[0])) continue;
      // This corpus's own LOST: marker, which NAMES a target that no longer exists. Giving it a relation
      // would assert a reference to something gone -- the marker exists precisely to say it is not there.
      if (/LOST:\s*$/.test(before)) continue;
      // A script named with a subcommand or a flag after it is being INVOKED, not referenced.
      if (/^\s+(?:[\w-]+\s+)?--/.test(line.slice(m.index + m[0].length))) continue;
      bareOrdinal++;
      if (bareOrdinal <= minusBareCount) continue;
      out.push(m[0]);
    }
  }
  return out;
}

const rows = [];
for (const file of paths.length ? paths : allPrompts()) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (_) {
    continue;
  }
  const kind = kindOf(file);
  const findings = [];
  const desc = description(text);
  const carriesDescription = kind === "shell" || /\/SKILL\.md$/.test(file);
  if (carriesDescription) {
    if (desc === null) findings.push({ code: "NO_DESCRIPTION", fail: true });
    else {
      const n = words(desc);
      if (n > DESCRIPTION_MAX_WORDS) findings.push({ code: "DESCRIPTION_LONG", fail: true, detail: `${n} words, max ${DESCRIPTION_MAX_WORDS}` });
      if (DOCTRINE_RE.test(desc)) findings.push({ code: "DESCRIPTION_IS_DOCTRINE", fail: true, detail: "carries an opener, a date or a ruling; a description is a trigger" });
    }
  }
  // A THIRD legitimate behavior shape: a superseded redirect stub, kept only so old pointers still land
  // somewhere -- its own H1 says so explicitly. Neither flat nor phase-entry sections apply to a file
  // that carries no behavior of its own any more.
  const isSupersededStub = /^#[^\n]*\(superseded\b/im.test(text);
  if (kind === "behavior" && !isSupersededStub) {
    const heads = [...text.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1].toLowerCase());
    const missingBy = {};
    for (const [shape, parts] of Object.entries(BEHAVIOR_SHAPES)) {
      missingBy[shape] = parts.filter((names) => !names.some((n) => heads.some((h) => h.includes(n))));
    }
    // The file is judged against whichever shape it is CLOSEST to, so the report names what that shape is
    // still missing rather than what the other shape would have wanted.
    const best = Object.keys(missingBy).sort((a, b) => missingBy[a].length - missingBy[b].length)[0];
    for (const names of missingBy[best]) {
      findings.push({ code: "BEHAVIOR_SECTION_MISSING", fail: true, detail: `${best} shape wants a "${names[0]}" section` });
    }
  }
  if (addedOnly) {
    const bare = bareReferencesAdded(file);
    if (bare.length) findings.push({ code: "BARE_REFERENCE_ADDED", fail: true, detail: `${bare.slice(0, 3).join(", ")}${bare.length > 3 ? ", ..." : ""} -- give each its relation (rule 24)` });
    // @keep-comment
    // LOADING a file from the temp folder is forbidden. The temp folder is working memory: nothing that
    // must survive lives there, so a tracked prompt that CITES one of its files is citing something whose
    // disappearance nobody controls. An agent may be told to WRITE there; a read relation to it is what
    // this refuses. CEO, 2026-10-04: "esas 140 referencias son totalmente invalidas ... nadie deberia
    // estar referenciando la carpeta temporal. No en documentos de Git, al menos."
    // WHY THE PARSER STILL KNOWS `tmp` AS A STORE, rather than the simpler fix of deleting it from the
    // store list: an unparsed `ref:tmp/x` stops being a reference at all, so audit-chain stops COUNTING
    // it and the problem goes INVISIBLE instead of refused. The measurement that settled it: of 75
    // distinct `tmp/` targets cited across 53 tracked files, 71 no longer existed -- 95% already dead,
    // and every gate had passed them.
    const tmpAdded = (fullDiffSections().get(file) || [])
      .filter((l) => l.startsWith("+"))
      .flatMap((l) => l.match(/(?:import|ref|cite):tmp\/[^\s)`,;]+/g) || []);
    if (tmpAdded.length) {
      findings.push({
        code: "TMP_REFERENCE_ADDED",
        fail: true,
        detail: `${tmpAdded.slice(0, 3).join(", ")}${tmpAdded.length > 3 ? ", ..." : ""} -- the temp folder is WRITE-only: say to write there, never load from it`,
      });
    }
  }
  const w = words(text);
  const tokens = Math.round(w * TOKENS_PER_WORD);
  if (w > WEIGHT[kind]) findings.push({ code: "HEAVY", fail: strict, detail: `${w} words (~${tokens} tokens), ${kind} budget ${WEIGHT[kind]}` });
  rows.push({ file, kind, words: w, tokens, descriptionWords: desc === null ? null : words(desc), findings });
}

const failing = rows.filter((r) => r.findings.some((f) => f.fail));
if (asJson) {
  console.log(JSON.stringify({ rows, failing: failing.length }, null, 2));
} else {
  for (const r of rows) {
    for (const f of r.findings) console.log(`${f.fail ? "FAIL" : "note"} ${f.code}\t${r.file}${f.detail ? ` — ${f.detail}` : ""}`);
  }
  const total = rows.reduce((a, r) => a + r.words, 0);
  console.log("");
  console.log(`${rows.length} prompt(s): ${total} words (~${Math.round(total * TOKENS_PER_WORD)} tokens); ${failing.length} failing.`);
}
process.exit(failing.length === 0 ? 0 : 1);
