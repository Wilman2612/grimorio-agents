// @keep-comment — resolves a reference and prints ONLY what it addresses. An anchor is a read
// instruction, not a bookmark: with one, this extracts from that heading to the next of the same or
// higher level; without one, it prints the file's index so the reader can pick before loading anything.
const fs = require("fs");
const R = require("./resolve.cjs");

const ref = process.argv[2];
if (!ref) {
  console.error("usage: node scripts/refobl/read.cjs '<reference>'   e.g. 'ref:skill/agent-writing#the-levels-behavior--general--project--code'");
  process.exit(2);
}

const p = R.parse(ref);
if (!p) { console.error(`not a reference: ${ref}`); process.exit(2); }

const file = R.toContentPath(ref);
if (!file) { console.error(`nothing local resolves ${ref} (ext and cold are deliberate)`); process.exit(2); }

let lines;
try { lines = fs.readFileSync(file, "utf8").split(/\r?\n/); }
catch { console.error(`target missing: ${file}`); process.exit(1); }

const heads = lines
  .map((l, i) => ({ i, m: l.match(/^(#{1,6})\s+(.*)$/) }))
  .filter((x) => x.m)
  .map((x) => ({ line: x.i, depth: x.m[1].length, text: x.m[2].replace(/[*`]/g, "").trim() }));

// No anchor: print the map, not the file. This is the cheap answer to "which section did they mean".
if (!p.anchor) {
  console.log(`${file} — ${lines.length} lines, ${heads.length} headings. NO ANCHOR, so here is the index:\n`);
  for (const h of heads) console.log(`  ${"  ".repeat(h.depth - 1)}${String(h.line + 1).padStart(5)}  ${h.text}`);
  console.log(`\nRe-run with an anchor to get one section: '${ref}#${heads.length ? R.slug(heads[Math.min(1, heads.length - 1)].text) : "..."}'`);
  process.exit(0);
}

const want = R.slug(p.anchor.slice(1));
const start = heads.find((h) => R.slug(h.text) === want) || heads.find((h) => R.slug(h.text).includes(want));
if (!start) {
  console.error(`no heading in ${file} matches #${want}. The file has ${heads.length}; run without the anchor to list them.`);
  process.exit(1);
}

// To the next heading of the SAME or SHALLOWER depth — a subsection belongs to its parent.
const after = heads.find((h) => h.line > start.line && h.depth <= start.depth);
const end = after ? after.line : lines.length;
const body = lines.slice(start.line, end);

console.error(`${file}: ${body.length} of ${lines.length} lines (${Math.round((body.length / lines.length) * 100)}%)`);
console.log(body.join("\n"));
