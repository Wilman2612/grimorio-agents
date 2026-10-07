// @keep-comment POPULATION CONTRACT, never a description of behaviour: this counts Skill-TOOL loads
// only, from the log mark-skill-loaded.cjs writes. A skill whose text arrives any other way -- a shell
// Knowledge block, a compaction summary, an injected hook context -- is NOT in the population, and this
// script must never be read as counting those. Why it exists: its own introducing commit.
//
// Usage: node .grimorio/scripts/skill-load-census.mjs [<session-id>] [--skill <substring>]

import { readFileSync } from "fs";
import path from "path";
import { cachePath } from "./refobl/cache-paths.mjs";

const root = process.env.CLAUDE_PROJECT_DIR || ".";
const LOG = cachePath("skill-load-debug.log", root);

// The hook records a spawned agent's type; the main loop has none. That absence IS the main-loop signal,
// the same one `.claude/hooks/turn-open.mjs` already keys on -- never re-derived from a branch or a path.
const NA = new Set(["-", "main", ""]);
const isMainLoop = (r) => !r.agent_type || NA.has(r.agent_type);

function load() {
  let text;
  try {
    text = readFileSync(LOG, "utf8");
  } catch (_) {
    console.error(`no skill-load log at ${LOG} -- nothing to census`);
    process.exit(1);
  }
  return text.trim().split(/\r?\n/).flatMap((l) => {
    try {
      return [JSON.parse(l)];
    } catch (_) {
      return [];
    }
  });
}

function tally(rows) {
  const by = {};
  for (const r of rows) by[r.skill] = (by[r.skill] || 0) + 1;
  return Object.entries(by).sort((a, b) => b[1] - a[1]);
}

const argv = process.argv.slice(2);
const skillFilter = argv.includes("--skill") ? argv[argv.indexOf("--skill") + 1] : null;
const sessionArg = argv.find((a) => !a.startsWith("--") && a !== skillFilter);

const all = load();
const session = sessionArg || all.at(-1)?.session_id;
const rows = all.filter((r) => r.session_id === session);
if (rows.length === 0) {
  console.error(`no rows for session ${session}`);
  process.exit(1);
}

const main = rows.filter(isMainLoop);
const kids = rows.filter((r) => !isMainLoop(r));

console.log(`session    ${session}`);
console.log(`population ${rows.length} Skill-tool loads`);
console.log(`main loop  ${main.length}   last: ${main.at(-1)?.ts || "never"}`);
console.log(`subagents  ${kids.length}`);

if (skillFilter) {
  const m = main.filter((r) => r.skill.includes(skillFilter));
  const k = kids.filter((r) => r.skill.includes(skillFilter));
  console.log(`\n"${skillFilter}"  main ${m.length}  (last: ${m.at(-1)?.ts || "never"})   subagents ${k.length}`);
} else {
  console.log("\nmain loop, every load:");
  for (const [s, n] of tally(main)) console.log(`  ${String(n).padStart(5)}  ${s}`);
  console.log("\nsubagents, top 10:");
  for (const [s, n] of tally(kids).slice(0, 10)) console.log(`  ${String(n).padStart(5)}  ${s}`);
}
