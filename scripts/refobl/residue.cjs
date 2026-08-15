// @keep-comment — regenerates the residue record from the LIVE corpus, never from a frozen list. The
// previous record was written against a criterion that has since been retired, and a stale residue file
// reads exactly like a current one. Run it after any anchoring pass: `node scripts/refobl/residue.cjs`.
const fs = require("fs");
const { execFileSync } = require("child_process");
const R = require("./resolve.cjs");
const { isGovernance, posix } = require("./governance.cjs");

const OUT = "objectives/grimorio/refobl-evidence/RESIDUE.md";
const key = (f, l, r) => posix(f) + "|" + l + "|" + String(r).replace(/[.,;:]+$/, "");

const refusedBy = new Map();
for (let i = 0; i < 12; i++) {
  let d;
  try { d = JSON.parse(fs.readFileSync(`tmp/reference-audit/decisions/g${i}.json`, "utf8")).result; } catch { continue; }
  for (const x of d.refused || []) if (String(x.why || "").trim().length > 8) refusedBy.set(key(x.from, x.line, x.ref), x.why.trim());
}
// Hand judgements live in the repo beside the record, never inside a scratchpad script: a reason that
// exists only in a script that ran once is a reason nobody can find, which already happened on this branch.
try {
  for (const h of JSON.parse(fs.readFileSync("objectives/grimorio/refobl-evidence/hand-judged.json", "utf8")))
    refusedBy.set(key(h.from, h.line, h.ref), h.why + "  _(judged by hand)_");
} catch { /* the file is optional; its absence is not an error, only fewer reasons */ }

execFileSync("node", ["scripts/refobl/anchorwork.cjs", "1"], { stdio: "ignore" });
const open = JSON.parse(fs.readFileSync("tmp/reference-audit/anchor-work.json", "utf8")).flatMap((b) => b.refs);
const wholeSkill = (ref) => { const p = R.parse(ref); return p && p.relation === "import" && p.store === "skill" && !p.path.includes("/"); };

const gov = [], judged = [], unjudged = [];
for (const o of open) {
  if (wholeSkill(o.ref)) continue;
  const why = refusedBy.get(key(o.from, o.line, o.ref));
  if (isGovernance(o.from)) { gov.push({ ...o, why }); continue; }
  (why ? judged : unjudged).push({ ...o, why });
}

const row = (r) => `- \`${posix(r.from)}:${r.line}\` — \`${r.ref}\` → ${r.target} (${r.targetLines} lines)` + (r.why ? `\n  - ${r.why}` : "");

fs.writeFileSync(OUT,
`# RESIDUE — every reference still without an anchor, and why

Regenerated from the live corpus by \`cite:repo/scripts/refobl/residue.cjs\`. Do not hand-edit: a residue record
written against a retired criterion reads exactly like a current one, which is how the previous version of this
file outlived the rule it was measuring.

**The criterion is the READER'S cost, not the citing sentence.** An anchor is a read instruction:
\`scripts/refobl/read.cjs\` extracts from the named heading to the next of the same or shallower depth. A
reference into a long file without one bills whoever follows it for the entire document. Three exemptions, and
only three:

1. **\`import:skill/<name>\` with no file** — a whole-skill dependency declaration. \`audit-chain.mjs\` excludes
   these mechanically, so they never reach this file.
2. **An INDEX ROW** — the line's whole purpose is *"here is that document"*.
3. **The path is the SUBJECT of the sentence**, not a destination — *"features-status.md drifts from shipped
   code"*. Nobody follows that to read anything.

**${gov.length + judged.length + unjudged.length} rows: ${gov.length} in behaviour-defining files, ${judged.length} judged, ${unjudged.length} never judged.**

## In a BEHAVIOUR-DEFINING file — \`grimorio.system-keeper\`'s to write, not the main loop's

CLAUDE.md rule 20. Each carries the same obligation; the charter differs.

${gov.map(row).join("\n") || "_none_"}

## JUDGED — left bare deliberately, with the reason on record

${judged.map(row).join("\n") || "_none_"}
${unjudged.length ? `
## NEVER JUDGED — the real open queue

${unjudged.map(row).join("\n")}
` : ""}`);

console.log(`${OUT}`);
console.log(`  governance     ${gov.length}`);
console.log(`  judged         ${judged.length}`);
console.log(`  NEVER judged   ${unjudged.length}`);
