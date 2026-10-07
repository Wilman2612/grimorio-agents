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
const CLAUDE_ALLOWED = [
  /^\.claude\/agents\/grimorio\.[a-z0-9.-]+\.md$/,
  /^\.claude\/skills\/grimorio\.[a-z0-9.-]+\/SKILL\.md$/,
  /^\.claude\/hooks\/[a-z0-9.-]+\.cjs$/,
  /^\.claude\/(agents|skills|hooks)\/harness\.md$/,
];
const grimorio = walk(".grimorio").filter((p) => !p.startsWith(".grimorio/memory/") && !p.split("/").some((s) => s.startsWith("project.")));
const claude = walk(".claude").filter((p) => CLAUDE_ALLOWED.some((re) => re.test(p)));
const set = [...grimorio, ...claude];

// THE LEAK GATE IS A PRECONDITION, not a follow-up: an export that runs first and checks second has already
// written the thing it was supposed to prevent.
try { execFileSync(process.execPath, [".grimorio/scripts/export/leak-check.mjs"], { stdio: "pipe" }); }
catch { console.error("REFUSED: .grimorio/scripts/export/leak-check.mjs does not pass. Nothing was written."); process.exit(2); }

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

// The target's OLD corpus goes first: an export that only adds leaves whatever the previous layout had, and
// the previous layout here was everything under .claude/ with no .grimorio/ at all.
const stale = [".grimorio", ".claude/agents", ".claude/skills", ".claude/hooks", "scripts"]
  .map((d) => path.join(target, d))
  .filter(existsSync);
if (apply) for (const d of stale) rmSync(d, { recursive: true, force: true });

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
if (apply) {
  const td = path.join(target, "scripts/export");
  mkdirSync(td, { recursive: true });
  writeFileSync(path.join(td, "project.export-markers.json"), JSON.stringify(TEMPLATE, null, 2) + String.fromCharCode(10));
}

console.log(`${apply ? "WROTE" : "DRY RUN"}: ${written} file(s) -> ${target}`);
console.log(`  .grimorio/: ${grimorio.length}   .claude/ publication surface: ${claude.length}`);
console.log(`  scrub: ${subCount} generalization(s), ${transCount} translation(s)`);
console.log(`  cleared first: ${stale.length} stale tree(s) in the target`);
if (!apply) console.log(`\nNothing was written. Re-run with --apply.`);
