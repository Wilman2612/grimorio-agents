// @keep-comment — builds the anchor work list. Resolution comes from resolve.cjs and is never re-derived
// here: this generator already carried the directory blindness once, after the counter beside it was fixed.
const fs = require("fs");
const R = require("./resolve.cjs");

const LONG = 200;

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d)) {
    if (e === "node_modules" || e === "worktrees" || e === ".git") continue;
    const p = d + "/" + e;
    fs.statSync(p).isDirectory() ? walk(p, out) : e.endsWith(".md") && out.push(p);
  }
  return out;
};

const REF = /\b(?:import|ref|cite):(?:skill|repo|tmp|ext)\/[A-Za-z0-9._/-]+(?:@[0-9a-f]{7,40})?(?:#[A-Za-z0-9._-]+)?/g;
const files = [...walk(".claude/skills"), ...walk(".claude/agents"), "CLAUDE.md"];

const work = [];
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  let fenced = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return; }
    if (fenced) return;
    for (const m of line.matchAll(REF)) {
      const p = R.parse(m[0]);
      if (!p || p.anchor || p.store === "ext" || p.relation === "cite") continue;
      if (!R.exists(m[0])) continue;
      const content = R.toContentPath(m[0]);
      if (!content || !content.endsWith(".md")) continue;
      let n = 0;
      try { n = fs.readFileSync(content, "utf8").split(/\r?\n/).length; } catch { continue; }
      if (n <= LONG) continue;
      work.push({
        from: f.split("\\").join("/"),
        line: i + 1,
        ref: m[0],
        target: content,
        targetLines: n,
        context: lines.slice(Math.max(0, i - 1), i + 2).join(" ").replace(/\s+/g, " ").slice(0, 300),
      });
    }
  });
}

const byTarget = new Map();
for (const w of work) byTarget.set(w.target, [...(byTarget.get(w.target) ?? []), w]);
const batches = [...byTarget].map(([t, ws], i) => ({ id: i, target: t, headings: R.headingsOf("ref:repo/" + t) || [], refs: ws }));

fs.mkdirSync("tmp/reference-audit", { recursive: true });
fs.writeFileSync("tmp/reference-audit/anchor-work.json", JSON.stringify(batches, null, 1));

const G = Number(process.argv[2] || 10);
const groups = Array.from({ length: G }, () => ({ ids: [], refs: 0 }));
for (const b of [...batches].sort((a, c) => c.refs.length - a.refs.length)) {
  const g = groups.reduce((a, c) => (c.refs < a.refs ? c : a));
  g.ids.push(b.id); g.refs += b.refs.length;
}
fs.writeFileSync("tmp/reference-audit/anchor-groups.json", JSON.stringify(groups, null, 1));

const noHead = batches.filter((b) => b.headings.length <= 1);
console.log(`anchorless refs: ${work.length}   targets: ${batches.length}`);
console.log(`groups: ${G}   refs per group: ${groups.map((g) => g.refs).join(" ")}`);
console.log(`targets with <=1 heading (an anchor is impossible there): ${noHead.length}`);
for (const b of noHead.slice(0, 5)) console.log(`   ${b.refs.length} refs -> ${b.target}`);
