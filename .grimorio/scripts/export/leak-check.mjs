#!/usr/bin/env node
// @keep-comment
// PROVES, BEFORE A PUBLISH, THAT NOTHING OF THE ADOPTER'S IS IN THE EXPORT SET. Three rules, each one
// measurable, and the third is the only one a prefix cannot enforce. Run it with no arguments; it exits 1
// and names every violation. Its marker list and its reviewed occurrences are DECLARED in
// scripts/export/project.export-markers.json -- the adopter's own file, by its prefix -- and this script
// hardcodes neither.
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import path from "node:path";

const SPEC = "scripts/export/project.export-markers.json";
const spec = JSON.parse(readFileSync(SPEC, "utf8"));
const MARKERS = spec.markers.map((m) => m.toLowerCase());
const REVIEWED = spec.reviewed || {};

// RULE 1 -- `.grimorio/memory/` never exports. ARCHITECTURE.md section 5: "Project and code come OUT of the
// agent, into memory/, so all memory is manageable in one place." The DIRECTORY is the ownership signal;
// a `project.` prefix inside it is the convention working twice, not the thing that keeps it out.
const EXCLUDED_TREES = [".grimorio/memory/"];
// RULE 2 -- the prefix marks OWNERSHIP, never position, so it excludes a FILE or a FOLDER anywhere.
const isPrefixed = (p) => p.split("/").some((seg) => seg.startsWith("project."));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === ".git" || e === "node_modules" || e === "tmp" || e === ".cache" || e.startsWith(".next")) continue;
    const p = path.posix.join(dir, e);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const all = existsSync(".grimorio") ? walk(".grimorio") : [];
const memoryTravels = new Set(classifyMemory(all).travels);
// @keep-comment The memory tree is no longer excluded WHOLLY: its GENERIC half travels, so it must be
// SCANNED like everything else. A file the exporter sends and the gate skips leaves unchecked.
const exportSet = all.filter((p) => (!EXCLUDED_TREES.some((t) => p.startsWith(t)) || memoryTravels.has(p)) && !isPrefixed(p));

import { SURFACES, ROOT_EXTRAS } from "./export-surface.mjs";
import { classifyMemory } from "./memory-split.mjs";
const surfaces = SURFACES.map((s) => {
  const files = existsSync(s.dir) ? walk(s.dir) : [];
  const allowed = (p) => s.allow.some((re) => re.test(p));
  return { dir: s.dir, exports: files.filter(allowed), held: files.filter((p) => !allowed(p)) };
});
const claudeExports = surfaces.flatMap((s) => s.exports);
const claudeHeld = surfaces.flatMap((s) => s.held);
// settings.json is the one file that must REACH an adopter and must never be COPIED: it wires the hooks, so
// the export ADAPTS it. A byte-identical copy means the adopter got this installation's own wiring.
const settingsCopied = (() => {
  const a = ".claude/settings.json";
  const b = process.env.EXPORT_TARGET ? path.posix.join(process.env.EXPORT_TARGET, a) : null;
  if (!b || !existsSync(a) || !existsSync(b)) return false;
  return readFileSync(a, "utf8") === readFileSync(b, "utf8");
})();

// @keep-comment RULES 6-8 -- credentials, personal data, and credential-bearing file types. Each pattern must
// be shown to MATCH somewhere in the repo before its zero counts: a pattern that cannot go red proves nothing,
// and this corpus has already paid twice for a silent zero. An UNPROVEN pattern is reported, never ignored.
const secretRes = (spec.secretPatterns || []).map((r) => [r, new RegExp(r)]);
const personalRes = (spec.personalPatterns || []).map((r) => [r, new RegExp(r)]);
const fileShapeRes = (spec.credentialFileShapes || []).map((r) => [r, new RegExp(r)]);
const allPats = [...secretRes, ...personalRes];
const readSafe = (f) => { try { return readFileSync(f, "utf8"); } catch { return ""; } };
// ONE pass per file, every pattern tested against it -- re-reading the tree once per pattern made this
// unusable on a repo this size. `inExport` is the leak; `anywhere` is what proves the pattern can go red.
const inExport = new Map(), anywhere = new Set();
// The ROOT files the exporter ships outside both container walks. A file the exporter sends and the gate
// never reads is a file that leaves UNCHECKED -- the same gate/exporter divergence the shared allowlist
// above exists to prevent, one directory out.
const rootExtras = ROOT_EXTRAS.map((e) => e.from).filter(existsSync);
const exportAll = new Set([...exportSet, ...claudeExports, ...rootExtras]);
for (const f of walk(".")) {
  const text = readSafe(f);
  if (!text) continue;
  for (const [src, re] of allPats) {
    if (!re.test(text)) continue;
    anywhere.add(src);
    if (exportAll.has(f)) { if (!inExport.has(src)) inExport.set(src, []); inExport.get(src).push(f); }
  }
}
const secretHits = [...inExport].map(([src, files]) => ({ src, files }));
const unproven = allPats.map(([src]) => src).filter((src) => !anywhere.has(src));
const fileHits = [...exportAll].filter((f) => fileShapeRes.some(([, re]) => re.test(f)));

const viol = [];
for (const p of exportSet) {
  // RULE 3 -- a marker in the export set must be a REVIEWED occurrence. An unreviewed one is either a leak
  // or a judgement nobody has made yet, and the gate cannot tell those apart -- which is exactly why it
  // refuses instead of guessing. The marker only NARROWS; the verdict is always a human's, recorded.
  let text;
  try { text = readFileSync(p, "utf8").toLowerCase(); } catch { continue; }
  const hit = MARKERS.filter((m) => text.includes(m));
  if (hit.length && !REVIEWED[p]) viol.push({ p, hit });
}

const staleReviews = Object.keys(REVIEWED).filter((p) => !exportSet.includes(p));

console.log(`export set: ${exportSet.length} file(s) of ${all.length} under .grimorio/`);
console.log(`  excluded: ${all.length - exportSet.length} (memory tree + project.-prefixed)`);
for (const s of surfaces) console.log(`${s.dir}/: ${s.exports.length} publication-surface file(s) export, ${s.held.length} held back`);
console.log(`root: ${rootExtras.length} file(s) outside both container walks: ${rootExtras.join(", ")}`);
// @keep-comment NAME every held file in the three published trees, hooks included. The first spelling
// listed agents and skills only, so a held-back HOOK was reported as a number and nothing else -- which
// is how four `.mjs` hook files were silently dropped from an export whose gate read PASS.
for (const p of claudeHeld.filter((x) => /\/(agents|skills|hooks)\//.test(x))) {
  console.log(`  held: ${p}`);
}
if (settingsCopied) console.log(`LEAK  .claude/settings.json is BYTE-IDENTICAL in the target -- it must be ADAPTED, never copied`);
for (const h of secretHits) console.log(`SECRET  /${h.src}/ matches ${h.files.length} exported file(s): ${h.files.slice(0, 3).join(", ")}`);
for (const f of fileHits) console.log(`SECRET  ${f} is a credential-bearing file shape and is in the export set`);
// NOT a pass and NOT a leak: a pattern nobody can make go red. Reported so the zero is never mistaken for proof.
for (const u of unproven) console.log(`UNPROVEN  /${u}/ matches nothing anywhere in this repo -- its zero proves nothing`);
console.log(`secret scan: ${secretRes.length} credential pattern(s), ${personalRes.length} personal/machine pattern(s), ${fileShapeRes.length} file shape(s)`);
for (const v of viol) console.log(`LEAK  ${v.p} -- names ${v.hit.join(", ")} and is not a reviewed occurrence`);
// A review that no longer matches anything is DEBT, not a pass: it means the file moved, was renamed, or
// stopped naming the adopter, and the recorded verdict now vouches for nothing.
for (const p of staleReviews) console.log(`STALE-REVIEW  ${p} -- reviewed, but not in the export set any more`);
if (viol.length || staleReviews.length || settingsCopied || secretHits.length || fileHits.length) {
  console.log(
    `
FAIL: ${viol.length} unreviewed marker(s), ${staleReviews.length} stale review(s), ` +
      `${secretHits.length} secret/personal pattern(s) in the export set, ${fileHits.length} credential-bearing file(s)` +
      (settingsCopied ? ", and settings.json was copied verbatim" : "") + ".",
  );
  process.exit(1);
}
console.log(`\nPASS: every marker occurrence in the export set is a reviewed one, and every review still applies.`);
