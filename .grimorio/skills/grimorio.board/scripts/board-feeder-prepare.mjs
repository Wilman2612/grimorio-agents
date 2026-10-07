// Builds the ONE bundle grimorio.board-feeder reasons over: the CEO's user: turns from a cleaned extract, plus
// the compact index of every non-Done item on the board (askId · title). The model never reads the board.
// Usage: node board-feeder-prepare.mjs <cleaned-extract-path>
// Prints: USER-TURNS=<n> OPEN-ITEMS=<n> BUNDLE=<path>
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { BoardError, loadConfig, loadIndex } from "./board-lib.mjs";

function main() {
  const src = process.argv[2];
  if (!src) throw new BoardError("BAD_ARGS", "cleaned-extract path is required");
  if (!existsSync(src)) throw new BoardError("EXTRACT_MISSING", `no file at ${src}`);
  const text = readFileSync(src, "utf8");
  const turns = [];
  let cur = null;
  for (const line of text.split(/\r?\n/)) {
    if (/^user:\s/.test(line)) {
      cur = { text: line.replace(/^user:\s*/, "") };
      turns.push(cur);
    } else if (/^agent:\s/.test(line)) {
      cur = null;
    } else if (cur && line.trim()) {
      cur.text += "\n" + line;
    }
  }
  if (turns.length === 0) throw new BoardError("NO_USER_TURNS", `${src} carries no user: turns`);

  const cfg = loadConfig();
  // FORCED, never cached: the feeder's whole judgment is "is this ask already there", and an index minutes
  // stale makes it duplicate whatever was written in between. One item-list per feeder run is the cost.
  const open = loadIndex(cfg, { force: true }).filter((i) => String(i.state || "").toLowerCase() !== "done");

  const out = [];
  out.push("# USER TURNS -- extract every direct request, instruction or correction from these; nothing else is an ask");
  turns.forEach((t, i) => out.push(`\n[user turn ${i + 1}]\n${t.text}`));
  out.push("\n\n# OPEN BOARD ITEMS -- an ask already represented here is NOT new; judge by meaning, never by exact words");
  for (const i of open) out.push(`- ${i.askId || "(no askId)"} · ${i.title}`);

  const dir = path.join(process.env.CLAUDE_PROJECT_DIR || ".", "tmp/board-feeder");
  mkdirSync(dir, { recursive: true });
  const bundle = path.join(dir, `bundle-${Date.now()}.md`);
  writeFileSync(bundle, out.join("\n") + "\n");
  console.log(`USER-TURNS=${turns.length} OPEN-ITEMS=${open.length} BUNDLE=${bundle.replace(/\\/g, "/")}`);
}

try {
  main();
} catch (e) {
  console.error(e instanceof BoardError ? e.message : `Error [UNEXPECTED]: ${e.message}`);
  process.exit(1);
}
