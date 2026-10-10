#!/usr/bin/env node
// @keep-comment
// THE EXPORT, AS A SCRIPT. The last scrub was a hand pass over 152 files; this one is repeatable, and its
// judgement -- what is the adopter's, what gets generalized, what gets translated -- is DATA in
// project.export-markers.json, never decided here. Usage:
//   node .grimorio/scripts/export/publish.mjs --target <path> [--apply]
// It REFUSES unless .grimorio/scripts/export/leak-check.mjs passes first, and it refuses a dirty target.
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const target = args[args.indexOf("--target") + 1];
if (!target || !existsSync(target)) { console.error("REFUSED: --target <path> must name an existing clone"); process.exit(2); }

const spec = JSON.parse(readFileSync("scripts/export/project.export-markers.json", "utf8"));
const SUBS = spec.scrubSubstitutions || [];
const TRANS = spec.scrubTranslations || [];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (["\.git", "node_modules", "tmp", ".cache"].includes(e) || e === ".git" || e.startsWith(".next")) continue;
    const p = path.posix.join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
// A SECOND walker, because the two walks answer different questions. `walk` above skips what must never
// be EXPORTED -- `.cache/`, `tmp/`, `node_modules` -- while the reconcile below must see everything already
// SITTING IN THE TARGET, including a published run log that got there when the rules were looser. Reusing
// the export walker here left the `.cache` rule unable to fire at all, which is a branch that proves nothing.
function walkAll(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === ".git" || e === "node_modules") continue;
    const p = path.posix.join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walkAll(p, out); else out.push(p);
  }
  return out;
}

import { SURFACES, ROOT_EXTRAS } from "./export-surface.mjs";
import { classifyMemory } from "./memory-split.mjs";
import { collectAdopterSlots, renderTemplate } from "./adopter-templates.mjs";
const grimorioAll = walk(".grimorio");
const memoryTravels = new Set(classifyMemory(grimorioAll).travels);
const grimorio = grimorioAll.filter((p) => (!p.startsWith(".grimorio/memory/") || memoryTravels.has(p))
  && !p.split("/").some((s) => s.startsWith("project.")));
const claude = SURFACES.flatMap((s) => (existsSync(s.dir) ? walk(s.dir) : []).filter((p) => s.allow.some((re) => re.test(p))));
const set = [...grimorio, ...claude];

// THE LEAK GATE IS A PRECONDITION, not a follow-up: an export that runs first and checks second has already
// written the thing it was supposed to prevent.
try { execFileSync(process.execPath, [".grimorio/scripts/export/leak-check.mjs"], { stdio: "pipe" }); }
catch { console.error("REFUSED: .grimorio/scripts/export/leak-check.mjs does not pass. Nothing was written."); process.exit(2); }

// The leak gate above answers "is anything of the ADOPTER'S in here". This answers the INVERSE, which no
// gate asked until a clone failed: is anything of GRIMORIO'S left out. Both are preconditions, because an
// export that discovers a missing surface afterwards has already published the installation without it.
try { execFileSync(process.execPath, [".grimorio/scripts/export/surface-coverage.mjs"], { stdio: "pipe" }); }
catch { console.error("REFUSED: a publication surface is undeclared. Run .grimorio/scripts/export/surface-coverage.mjs."); process.exit(2); }

const dirty = execFileSync("git", ["-C", target, "status", "--porcelain"], { encoding: "utf8" }).trim();
if (dirty && apply) { console.error(`REFUSED: target has ${dirty.split("\n").length} uncommitted change(s)`); process.exit(2); }

let subCount = 0, transCount = 0, written = 0;
function scrub(text) {
  // A BLOCK substitution must match across line endings: the source is CRLF and the declaration is LF, so a
  // literal compare silently matched nothing. The pair is built from CHAR CODES, never an escape sequence --
  // this file was corrupted twice writing it the other way, which is the same defect as the gate pattern.
  const CRLF = String.fromCharCode(13, 10);
  const LF = String.fromCharCode(10);
  const wasCrlf = text.includes(CRLF);
  if (wasCrlf) text = text.split(CRLF).join(LF);
  for (const [from, to] of TRANS) {
    if (text.includes(from)) { text = text.split(from).join(to); transCount++; }
  }
  for (const [from, to] of SUBS) {
    const n = text.split(from).length - 1;
    if (n) { subCount += n; text = text.split(from).join(to); }
  }
  return wasCrlf ? text.split(LF).join(CRLF) : text;
}

// @keep-comment RECONCILE BY OWNERSHIP, never by wiping a folder. `.claude/agents`, `.claude/skills` and
// `scripts/` are where ARCHITECTURE.md section 2 says the ADOPTER'S own work lives, so only `.grimorio/`
// may be cleared WHOLLY -- there, POSITION already proves nothing of theirs is inside.

// Everywhere else the question is per file: is THIS file grimorio's? Three ways it can be, and nothing
// else is touched -- not an unprefixed agent, not their skill folder, not their own root scripts.
const ownedByGrimorio = (rel) => {
  const parts = rel.split("/");
  // THE PREFIX IS THE FIRST TEST, EVERYWHERE. A `project.` file is the adopter's whatever container it sits
  // in -- including `.grimorio/memory/`, which section 6 defines AS the project and code levels.
  if (parts.some((s) => s.startsWith("project."))) return false;
  // `.grimorio/` is grimorio's by POSITION, minus what the line above already removed.
  if (rel.startsWith(".grimorio/")) return true;
  const base = parts[parts.length - 1];
  return SURFACES.some((s) => rel.startsWith(s.dir + "/") && s.allow.some((re) => re.test(rel)))
    || base.startsWith("grimorio.") || base.startsWith("GRIMORIO-")
    || parts.includes(".cache");          // runtime state: never a source file, never theirs
};
const writes = new Set([...set, ...ROOT_EXTRAS.map((e) => e.to)]);
const sweepable = [".grimorio", ...SURFACES.map((s) => s.dir), "scripts"];
const superseded = [];
for (const dir of sweepable) {
  const abs = path.join(target, dir);
  if (!existsSync(abs)) continue;
  for (const f of walkAll(abs.split(path.sep).join("/"))) {
    const rel = path.posix.relative(target.split(path.sep).join("/"), f);
    if (!writes.has(rel) && ownedByGrimorio(rel)) superseded.push(rel);
  }
}
if (apply) for (const rel of superseded) rmSync(path.join(target, rel), { force: true });

for (const f of set) {
  const out = path.join(target, f);
  const text = scrub(readFileSync(f, "utf8"));
  if (apply) { mkdirSync(path.dirname(out), { recursive: true }); writeFileSync(out, text); }
  written++;
}

// @keep-comment A fresh clone has no adopter vocabulary, and audit-chain then announces that its scan
// proves nothing. The CONTENT is the adopter's, so what ships is an empty TEMPLATE naming what goes in it --
// never this installation's own markers, which the leak gate holds back.
const TEMPLATE = {
  _: "THE ADOPTER'S OWN VOCABULARY. Fill these with the words that identify YOUR product: its service names, its libraries, its paths. grimorio's portability scan and its export leak gate both read this file, and both announce that they prove nothing while it is empty.",
  markers: [],
  reviewed: {},
  secretPatterns: [],
  personalPatterns: [],
  credentialFileShapes: ["[.](env|key|pem|p12|pfx)$"],
  portabilityMarkers: [],
};
let extrasWritten = 0, extrasKept = 0;
for (const e of ROOT_EXTRAS) {
  const out = path.join(target, e.to);
  if (!existsSync(e.from)) { console.error(`REFUSED: ${e.from} is missing -- a clone would be unable to run its own suite`); process.exit(2); }
  if (!e.overwrite && existsSync(out)) { extrasKept++; continue; }
  if (apply) { mkdirSync(path.dirname(out), { recursive: true }); writeFileSync(out, scrub(readFileSync(e.from, "utf8"))); }
  extrasWritten++; written++;
}

if (apply) {
  const td = path.join(target, "scripts/export");
  mkdirSync(td, { recursive: true });
  writeFileSync(path.join(td, "project.export-markers.json"), JSON.stringify(TEMPLATE, null, 2) + String.fromCharCode(10));
}

console.log(`${apply ? "WROTE" : "DRY RUN"}: ${written} file(s) -> ${target}`);
console.log(`  .grimorio/: ${grimorio.length}   .claude/ publication surface: ${claude.length}`);
console.log(`  scrub: ${subCount} generalization(s), ${transCount} translation(s)`);
console.log(`  reconcile: removes ${superseded.length} superseded file(s)`);
for (const rel of superseded) console.log(`    superseded: ${rel}`);
console.log(`  root files: ${extrasWritten} written, ${extrasKept} left as the adopter's own`);
// @keep-comment WHAT THE ADOPTER IS EXPECTED TO WRITE. A travelling prompt declaring `import:` on a
// `project.` path puts an EAGER obligation on a file only they can write, and nothing told them it was
// expected: a clone had 42 such loads across 19 paths. NEVER over an existing file -- these are their
// project records, and overwriting one costs written work rather than a re-run.
let slotsWritten = 0, slotsKept = 0;
// @keep-comment `slot`, never `target`: the first spelling shadowed the destination path with the loop
// variable and mkdir built one inside the other.
for (const [slot, info] of collectAdopterSlots(".", classifyMemory)) {
  const out = path.join(target, slot);
  if (existsSync(out)) { slotsKept++; continue; }
  if (apply) { mkdirSync(path.dirname(out), { recursive: true }); writeFileSync(out, scrub(renderTemplate(slot, info))); }
  slotsWritten++; written++;
}
console.log(`  adopter slots: ${slotsWritten} seeded, ${slotsKept} already written`);

if (!apply) console.log(`\nNothing was written. Re-run with --apply.`);
