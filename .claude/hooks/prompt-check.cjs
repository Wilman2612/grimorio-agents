#!/usr/bin/env node
// PostToolUse. Asserts a NEGATIVE, because that is the one thing a hook can do that memory cannot fake:
// asked to "comply with the standard" a reader recites it from memory and invents what it lacks; told
// it probably broke the standard, it has to go and look. It parses nothing and never denies.

const fs = require("fs");
const path = require("path");

function isPromptSurface(p) {
  const f = p.replace(/\\/g, "/");
  if (/\/\.claude\/skills\/[^/]+\/docs\//.test(f)) return false; // records, not prompts
  return (
    /(^|\/)CLAUDE\.md$/.test(f) ||
    /\/\.claude\/agents\/.+\.md$/.test(f) ||
    /\/\.claude\/skills\/.+\.md$/.test(f) ||
    /(^|\/)harness\.md$/.test(f) ||
    /\/objectives\/.+\.md$/.test(f)
  );
}

const WROTE = (name) =>
  `${name} is a PROMPT, and it probably does not follow prompt-writing-quality.\n` +
  `Open the skill and check it against what you just wrote — every lens, not the parts you remember. ` +
  `Show what you found, then fix it.`;

const SPAWNED =
  "That agent probably wrote something that does not follow the standard, and its report is a claim, " +
  "not evidence. Open what it actually wrote before you accept it.";

function emit(body) {
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: body } }),
  );
}

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch (_) {
    return;
  }
  const tool = input.tool_name || "";

  if (tool === "Agent") return emit(SPAWNED);
  if (!/^(Write|Edit|MultiEdit)$/.test(tool)) return;

  const target = (input.tool_input && (input.tool_input.file_path || input.tool_input.path)) || "";
  if (!target || !isPromptSurface(path.resolve(target))) return;
  emit(WROTE(path.basename(target)));
}

main();
