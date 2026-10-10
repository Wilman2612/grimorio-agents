#!/usr/bin/env node
// @keep-comment WHICH HALF OF A MEMORY STORE TRAVELS. Section 9 says the `project.` prefix marks ownership,
// so unprefixed is grimorio's; section 6 says `memory/` IS the project level, so the tree is excluded by
// position. Inside a store the two rules disagree, and this decides it STRUCTURALLY -- never by a list of
// files, which goes quiet when it falls behind.
//
//   node .grimorio/scripts/export/memory-split.mjs [--list|--count]
import { execFileSync } from "node:child_process";

const MEMORY = ".grimorio/memory/";
// @keep-comment The board's own store travels NOTHING. Its files are the board's content and its ledgers,
// and the board ITSELF is the declaration of truth (CEO, 2026-10-09: the defects are discarded, the backlog
// belongs on the board, and whatever is missing should be in the GitHub project). Publishing a file of it
// would ship a frozen copy of a record whose live form is somewhere else.
const NO_HALF_TRAVELS = ["grimorio.board-memory"];

export function classifyMemory(files) {
  const travels = [], stays = [];
  for (const f of files) {
    if (!f.startsWith(MEMORY)) continue;
    const rest = f.slice(MEMORY.length);
    const parts = rest.split("/");
    const store = parts[0];
    const prefixed = parts.some((s) => s.startsWith("project."));
    // THREE conditions, each structural: grimorio's by prefix, at the store's ROOT rather than in one of its
    // subfolders (`designs/`, `design-archive/`, `docs/`, `features/` hold project records and archives),
    // and not in a store whose whole content belongs to a live system elsewhere.
    const atRoot = parts.length === 2;
    (!prefixed && atRoot && !NO_HALF_TRAVELS.includes(store) ? travels : stays).push(f);
  }
  return { travels, stays };
}

if (process.argv[1] && process.argv[1].endsWith("memory-split.mjs")) {
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
  const files = execFileSync("git", ["-C", root, "ls-files", MEMORY], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  const { travels, stays } = classifyMemory(files);
  if (process.argv.includes("--list")) {
    for (const f of travels) console.log(`travels ${f}`);
    if (process.argv.includes("--all")) for (const f of stays) console.log(`stays   ${f}`);
  }
  console.log(`travels ${travels.length}`);
  if (!process.argv.includes("--count")) console.log(`stays   ${stays.length}`);
}
