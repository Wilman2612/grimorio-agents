const fs = require("fs");

const APPLY = process.argv.includes("--apply");
// @keep-comment — a harness-invariant note, not a changelog: the applier writes via fs, so it never goes
// through any Edit/Write/MultiEdit hook at all (the governance hook that once gated those tools is deleted,
// so nothing gates them now); the isGovernance() skip below is
// the ONLY thing standing between this script and a governance file for any caller that omits this flag.
// CLAUDE.md rule 20 makes grimorio.system-keeper the one charter allowed to place content there directly, so
// this flag exists for that one caller to invoke deliberately — never as the default.
const GOVERNANCE_FLAG = process.argv.includes("--governance");
const OUT = process.argv[2];
// One declaration, shared with pin-cites.cjs. It was duplicated; the copy that drifted wrote a HELD file.
const { isGovernance, posix } = require("./governance.cjs");
// @keep-comment — a cross-tool contract note, same class as resolve.cjs's own header: this used to
// re-implement resolve.cjs's ref->path split locally, mis-resolving `ref:skill/x` to the bare directory
// (EISDIR on readFileSync) and reporting real headings as FABRICATED. See grimorio-defects.md.
const R = require("./resolve.cjs");
const { exists, slug, toPath, headingsOf } = R;

const decisions = JSON.parse(fs.readFileSync(OUT, "utf8")).result.chosen || [];

const skipped = { governance: [], noTarget: [], fabricated: [], notOnLine: [] };
const byFile = new Map();

for (const d of decisions) {
  const from = posix(d.from);
  if (isGovernance(from) && !GOVERNANCE_FLAG) { skipped.governance.push(d); continue; }
  const target = toPath(d.ref);
  if (!target || !exists(d.ref)) { skipped.noTarget.push(d); continue; }
  // The workflow's own note: every anchor is a CLAIM. A fabricated one resolves to nothing and reads
  // as precision, which is worse than the missing anchor it replaced.
  const hit = (headingsOf(d.ref) || []).find((h) => slug(h) === slug(d.anchor));
  if (!hit) { skipped.fabricated.push(d); continue; }
  byFile.set(from, [...(byFile.get(from) ?? []), { ...d, target, slug: slug(hit) }]);
}

let applied = 0;
for (const [f, ds] of byFile) {
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  let touched = 0;
  for (const d of ds) {
    const i = d.line - 1;
    // The trailing period of a sentence is not part of the reference. Anchor goes before it.
    const bare = d.ref.replace(/[.,;:]+$/, "");
    if (i < 0 || i >= lines.length || !lines[i].includes(bare)) { skipped.notOnLine.push(d); continue; }
    if (lines[i].includes(bare + "#")) continue;                      // already anchored
    lines[i] = lines[i].replace(bare, bare + "#" + d.slug);
    touched++; applied++;
  }
  if (touched && APPLY) fs.writeFileSync(f, lines.join("\n"));
}

console.log((APPLY ? "APPLIED" : "DRY RUN") + ": " + applied + " anchors written across " + byFile.size + " files");
console.log("  decisions returned          " + decisions.length);
console.log("  SKIPPED governance file     " + skipped.governance.length + "   (hand to grimorio.system-keeper)");
console.log("  SKIPPED target gone         " + skipped.noTarget.length);
console.log("  SKIPPED anchor FABRICATED   " + skipped.fabricated.length);
console.log("  SKIPPED ref not on that line " + skipped.notOnLine.length);
for (const d of skipped.fabricated) console.log("    FABRICATED  " + posix(d.from) + ":" + d.line + "  #" + d.anchor);
for (const d of skipped.governance) console.log("    GOVERNANCE  " + posix(d.from) + ":" + d.line + "  " + d.ref + "#" + d.anchor);
