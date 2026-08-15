const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const posix = (s) => s.split("\\").join("/");
const exists = (p) => { try { fs.statSync(p); return true; } catch { return false; } };

// Originally copied from a governance hook that has since been deleted. scripts/refobl/governance.cjs is the
// CANONICAL declaration (scripts/audit-chain.mjs carries a third copy). Kept in sync by hand deliberately: a script that
// imported it would still be a second place the list lives, and this one has to fail CLOSED.
const GOVERNANCE = [
  /^CLAUDE\.md$/,
  /^\.claude\/agents\/.*\.md$/,
  /^\.claude\/hooks\/.*\.(cjs|js)$/,
  /^\.claude\/settings(\.local)?\.json$/,
  /^\.claude\/skills\/[^/]+\/SKILL\.md$/,
  /^\.claude\/skills\/.*behavior.*\.md$/i,
  /^objectives\/harness\.md$/,
];

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d)) {
    if (e === "node_modules" || e === "worktrees" || e === ".git") continue;
    const p = d + "/" + e;
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
};

const PATH_SHAPE = /(?:\.{1,2}\/)?(?:\.?[A-Za-z0-9][A-Za-z0-9._-]*\/)+[A-Za-z0-9._-]+\.[a-z]{2,5}|\b[a-z0-9][a-z0-9._-]*\.(?:md|mjs|cjs|jsx?|tsx?|json|sh|ya?ml|toml)\b/g;
const ALREADY = /\b(?:import|ref|cite|cold):[a-z]/;

// The store is mechanical: where the file actually lives decides it. The RELATION is not, so every
// conversion here uses `ref` -- the weakest claim the grammar has. Calling something an import that is
// not one lies about the load chain; calling an import a ref merely understates it, and the reader can
// upgrade it. A blind migration must fail in the direction that cannot mislead.
const SKILLS = ".claude/skills/";
// Never slice by a hand-counted offset. `.slice(16)` for a 15-character prefix ate the first letter of
// every path under it -- `po-memory` became `o-memory` in 119 files before the diff was read.
const store = (p) => (p.startsWith(SKILLS) ? "skill/" + p.slice(SKILLS.length) : "repo/" + p);

const classify = (tok, fromFile) => {
  const beside = path.posix.normalize(path.posix.join(posix(fromFile), "..", tok));
  if (tok.startsWith("tmp/") && exists(tok)) return "tmp/" + tok.slice(4);
  if (exists(path.posix.join(SKILLS, tok))) return "skill/" + tok;
  if (exists(tok)) return store(tok);
  if (exists(beside)) return store(beside);
  return null;
};

const files = [...walk(".claude/skills"), ...walk(".claude/agents"), "CLAUDE.md"];
let changed = 0, converted = 0, skippedNoResolve = 0;
const broken = [];
const perFile = new Map();

for (const f of files) {
  const rel = posix(f);
  // The governance set. It once also lived in a PreToolUse hook that gated the Edit and Write TOOLS; that
  // hook is deleted, and a node script writing through fs never reached it anyway. Bypassing a guard because
  // the mechanism happens not to see you is the same violation as bypassing it deliberately.
  if (GOVERNANCE.some((re) => re.test(rel))) continue;
  if (rel === ".claude/skills/prompt-writing-quality/format-guide.md") continue;   // the syntax being taught
  if (rel === ".claude/skills/agent-writing/cold-store.md") continue;              // a table of raw targets
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split(/\r?\n/);
  let fenced = false, touched = 0;

  const out = lines.map((line) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return line; }
    if (fenced) return line;
    if (/^\s*(VERIFY|Usage|usage):/.test(line)) return line;
    // NEVER rewrite inside a HEADING. A heading is not prose -- it is an anchor TARGET, and its text is
    // the identifier every `#anchor` pointing at it is derived from. Prefixing a path inside one silently
    // changes the slug and kills every reference to that section: 7 headings were rewritten this way and
    // 2 of them broke live anchors into a COLD file, where nobody would ever have noticed.
    if (/^\s{0,3}#{1,6}\s/.test(line)) return line;
    const exportable = /\/SKILL\.md$/.test(rel);

    return line.replace(/`([^`\n]+)`(.?)/g, (whole, inner, next) => {
      // Backticks were the token's own delimiter. Removing them lets it fuse with whatever follows:
      // `po-memory/vision.md`/ref:skill/... became one 40-character reference resolving to nothing.
      if (next === "/" || next === ":" || next === "#") return whole;
      // Only inside backticks. A path in running prose is ambiguous -- it may be an example, a
      // filename being discussed, or a sentence fragment -- and a blind rewrite there damages text
      // it cannot read. Backticks are the writer's own signal that the token is a literal.
      if (ALREADY.test(inner)) return whole;
      const m = inner.match(PATH_SHAPE);
      if (!m || m[0] !== inner.trim()) return whole;   // the WHOLE span must be the path
      const tok = inner.trim();
      if (exportable && tok.startsWith("./")) return whole;
      const target = classify(tok, rel);
      if (!target) { skippedNoResolve++; return whole; }
      // Round-trip the reference back to a path and require it to exist. A migration that produces a
      // reference nobody can resolve is worse than the bare path it replaced: it looks migrated.
      const back = target.startsWith("skill/") ? SKILLS + target.slice(6)
        : target.startsWith("tmp/") ? "tmp/" + target.slice(4)
        : target.slice(5);
      if (!exists(back)) { broken.push(rel + ": `" + tok + "` -> ref:" + target); return whole; }
      touched++;
      return "ref:" + target + next;
    });
  });

  if (touched) {
    perFile.set(rel, touched);
    converted += touched;
    changed++;
    if (APPLY) fs.writeFileSync(f, out.join("\n"));
  }
}

console.log((APPLY ? "APPLIED" : "DRY RUN") + ": " + converted + " backticked paths -> ref:store/path across " + changed + " files");
console.log("left alone because they resolve nowhere: " + skippedNoResolve);
console.log("REFUSED because the produced reference would not resolve: " + broken.length);
for (const b of broken.slice(0, 10)) console.log("    " + b);
for (const [f, n] of [...perFile].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log("  " + String(n).padStart(3) + "  " + f);
