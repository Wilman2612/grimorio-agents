// Reports decision-history narration inside code comments, where the ban is currently blind.
// Usage: node .grimorio/scripts/check-comment-history.mjs [path ...]   (default: .claude/hooks scripts)
// Reports only, never edits. Exit 1 when any block is flagged.
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";

const SIGNALS = [
  [/\b(REWORK|FINDING-\d|cycle\s*[12345]\b|review cycle)/i, "names a past review cycle or finding id"],
  [/\b(CORRECTED|corrected|superseded|SUPERSEDES|retired|replaced by|used to|previously|formerly|no longer)\b/, "narrates what the code used to be"],
  [/\b(20\d\d-\d\d-\d\d)\b/, "carries a date, which only a record needs"],
  [/\b(this pass|a prior pass|an earlier pass|the previous version|the old version)\b/i, "refers to a pass rather than to the code"],
  [/\b(measured|MEASURED)\b.*\b(20\d\d|incident|failure)\b/, "reports a measurement a record should hold"],
];

function collect(target, out) {
  let st;
  try {
    st = statSync(target);
  } catch (_) {
    return out;
  }
  if (st.isDirectory()) {
    for (const e of readdirSync(target)) collect(path.join(target, e), out);
    return out;
  }
  if (/\.(cjs|mjs|js|ts|go)$/.test(target)) out.push(target);
  return out;
}

const targets = process.argv.slice(2);
const files = (targets.length ? targets : [".claude/hooks", "scripts"]).reduce((a, t) => collect(t, a), []);

let offending = 0;
let lines = 0;
const rows = [];

for (const f of files) {
  let text;
  try {
    text = readFileSync(f, "utf8");
  } catch (_) {
    continue;
  }
  const src = text.split(/\r?\n/);
  let block = null;
  const flush = () => {
    if (!block) return;
    const body = block.lines.join("\n");
    // Deliberately NARROWER than check-comment-blocks.mjs's own `@keep-comment` (which matches
    // anywhere in the block): here it must be on the block's FIRST line, so a marker kept for the
    // length gate on some OTHER paragraph of a long comment does not silently exempt narration
    // anywhere else in the same block from THIS, separate check.
    if (block.lines[0] && block.lines[0].includes("@keep-comment")) { block = null; return; }
    const hits = SIGNALS.filter(([re]) => re.test(body));
    // One signal in a short block is ordinary technical prose; the ban is about NARRATION, so a block
    // earns a finding on two independent signals, or on one across five lines or more.
    if (hits.length >= 2 || (hits.length === 1 && block.lines.length >= 5)) {
      offending++;
      lines += block.lines.length;
      rows.push({ file: f, start: block.start, n: block.lines.length, why: hits.map(([, w]) => w) });
    }
    block = null;
  };
  src.forEach((raw, i) => {
    const l = raw.trim();
    const isComment = l.startsWith("//") || l.startsWith("/*") || l.startsWith("*") || l.startsWith("#");
    if (isComment) {
      if (!block) block = { start: i + 1, lines: [] };
      block.lines.push(l.replace(/^(\/\/+|\/\*+|\*+|#)\s?/, ""));
    } else {
      flush();
    }
  });
  flush();
}

rows.sort((a, b) => b.n - a.n);
for (const r of rows) {
  console.log(`HISTORY ${r.file}:${r.start} — ${r.n} comment lines — ${r.why.join("; ")}`);
}
console.log("");
console.log(`${files.length} file(s) scanned, ${offending} comment block(s) narrating history, ${lines} lines.`);
process.exit(offending === 0 ? 0 : 1);
