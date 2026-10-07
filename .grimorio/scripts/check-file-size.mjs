// Reports tracked files past the ~500-line smell (grimorio-conduct rule 23), which nothing enforced.
// Usage: node .grimorio/scripts/check-file-size.mjs [--limit N] [--json] [path ...]
import { execFileSync } from "child_process";
import { readFileSync, existsSync } from "fs";

// A "--limit" token must consume its own following value token here, or that value falls through into
// `paths` below and silently becomes a git-ls-files PATHSPEC — scanning nothing rather than the whole repo.
// Walk argv explicitly rather than filtering on "doesn't start with --".
const args = process.argv.slice(2);
const asJson = args.includes("--json");
let limit = 500;
const paths = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--limit=")) {
    limit = Number(a.slice("--limit=".length));
  } else if (a === "--limit") {
    limit = Number(args[++i]);
  } else if (!a.startsWith("--")) {
    paths.push(a);
  }
}

const EXCLUDE = [
  /node_modules/,
  /[\\/]testdata[\\/]/,
  /[\\/]fixtures?[\\/]/,
  /[\\/]dev-assets[\\/]/,
  /\.min\.(js|css)$/,
  /package-lock\.json$/,
  /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|pdf|zip|webm|mp4)$/i,
  /\.lock$/,
  /^pnpm-lock\.yaml$/,
  /[\/]__fixtures__[\/]/,
  /[\/]openapi[\/].*\.json$/,
  /^recycle[\/]/,
];

// A file earns its size by saying so in its own first forty lines. The phrase is fixed so the exemption
// is a declaration, not a coincidence of wording.
const EXEMPT = /@size-exempt(?::\s*(.+))?/;

function tracked() {
  const out = execFileSync("git", ["ls-files", ...(paths.length ? paths : [])], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return out.split("\n").filter(Boolean);
}

const rows = [];
for (const f of tracked()) {
  if (EXCLUDE.some((re) => re.test(f))) continue;
  if (!existsSync(f)) continue;
  let text;
  try {
    text = readFileSync(f, "utf8");
  } catch (_) {
    continue;
  }
  if (text.includes("\0")) continue;
  const lines = text.split(/\r?\n/);
  if (lines.length <= limit) continue;
  const head = lines.slice(0, 40).join("\n");
  const m = EXEMPT.exec(head);
  rows.push({ file: f, lines: lines.length, exempt: Boolean(m), reason: m && m[1] ? m[1].trim() : null });
}

rows.sort((a, b) => b.lines - a.lines);
const over = rows.filter((r) => !r.exempt);

if (asJson) {
  console.log(JSON.stringify({ limit, total: rows.length, over: over.length, rows }, null, 2));
} else {
  for (const r of over) console.log(`OVER ${r.lines}\t${r.file}`);
  for (const r of rows.filter((x) => x.exempt)) console.log(`exempt ${r.lines}\t${r.file}${r.reason ? ` — ${r.reason}` : ""}`);
  console.log("");
  console.log(`limit ${limit}: ${over.length} file(s) over, ${rows.length - over.length} exempt by declaration.`);
}
process.exit(over.length === 0 ? 0 : 1);
