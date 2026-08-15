#!/usr/bin/env node
// Refuses an agent whose frontmatter disallows Agent while at an orchestrator-tier model
// (opus/fable), or that declares no model: at all. Fails CLOSED (pre-commit gate, not a hook).
// -> .claude/skills/agent-tiers/SKILL.md
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ORCHESTRATOR_MODELS = new Set(["opus", "fable"]);
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const agentsDir = path.join(root, ".claude", "agents");

function stripQuotes(value) {
  return value.replace(/^["'[]+|["'\]]+$/g, "").trim();
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const block = m[1];
  const modelRaw = block.match(/^model:\s*(.+?)\s*$/m)?.[1];
  const toolsRaw = block.match(/^disallowedTools:\s*(.+?)\s*$/m)?.[1];
  return {
    model: modelRaw ? stripQuotes(modelRaw) : undefined,
    disallowed: toolsRaw ? stripQuotes(toolsRaw) : undefined,
  };
}

function hasAgentToken(value) {
  if (!value) return false;
  return value.split(/[,\s]+/).filter(Boolean).includes("Agent");
}

function checkFile(file) {
  const fm = parseFrontmatter(readFileSync(file, "utf8"));
  if (!fm) {
    return { file, reason: "unparsable frontmatter (no closing --- block)", model: "(unparsable)", disallowed: "(unparsable)" };
  }
  if (!fm.model) {
    return { file, reason: "no model: key declared", model: "(missing)", disallowed: fm.disallowed ?? "(none)" };
  }
  if (ORCHESTRATOR_MODELS.has(fm.model) && hasAgentToken(fm.disallowed)) {
    return { file, reason: "orchestrator-tier model with disallowedTools: Agent", model: fm.model, disallowed: fm.disallowed };
  }
  return null;
}

let files;
try {
  // `harness.md` sits here to govern EDITS to this tree; it defines no agent and declares no tier.
  files = readdirSync(agentsDir).filter((f) => f.endsWith(".md") && f !== "harness.md");
} catch (err) {
  console.error(`REFUSED: cannot read agents directory ${agentsDir}: ${err.message}`);
  process.exit(1);
}

const violations = files.map((f) => checkFile(path.join(agentsDir, f))).filter(Boolean);

if (violations.length) {
  for (const v of violations) {
    console.error(`  ${path.relative(root, v.file)}: ${v.reason} — model: ${v.model}, disallowedTools: ${v.disallowed}`);
  }
  console.error(`
REFUSED: ${violations.length} of ${files.length} agent file(s) violate the tier doctrine.

An agent whose frontmatter disallows the Agent tool cannot spawn, therefore cannot orchestrate, therefore
must not sit at an orchestrator tier (opus/fable). Every agent must also declare model: explicitly — an
undeclared model silently reintroduces caller-inherited model, which is the failure the doctrine exists
to close.`);
  process.exit(1);
}

console.log(`OK: ${files.length} agent file(s) in ${path.relative(root, agentsDir)} conform to the tier doctrine.`);
process.exit(0);
