#!/usr/bin/env node
// Refuses an agent at an orchestrator tier (opus/fable) that disallows Agent, or declaring no model:,
// or a .grimorio/AGENT-TIERS.md whose table has drifted from the shells. --write regenerates that table.
// -> .grimorio/skills/grimorio.agent-tiers/SKILL.md -> .grimorio/AGENT-TIERS.md
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ORCHESTRATOR_MODELS = new Set(["opus", "fable"]);
const BEGIN = "<!-- BEGIN AGENT-TIER-TABLE (generated: node .grimorio/scripts/check-agent-tiers.mjs --write) -->";
const END = "<!-- END AGENT-TIER-TABLE -->";
const REGISTER_REL = ".grimorio/AGENT-TIERS.md";
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const agentsDir = path.join(root, ".claude", "agents");

function stripQuotes(value) {
  return value.replace(/^["'[]+|["'\]]+$/g, "").trim();
}

function frontmatterBlock(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return m ? m[1] : null;
}

function parseFrontmatter(text) {
  const block = frontmatterBlock(text);
  if (block === null) return null;
  const modelRaw = block.match(/^model:\s*(.+?)\s*$/m)?.[1];
  const disallowedRaw = block.match(/^disallowedTools:\s*(.+?)\s*$/m)?.[1];
  const toolsRaw = block.match(/^tools:\s*(.+?)\s*$/m)?.[1];
  return {
    model: modelRaw ? stripQuotes(modelRaw) : undefined,
    disallowed: disallowedRaw ? stripQuotes(disallowedRaw) : undefined,
    tools: toolsRaw === undefined ? undefined : stripQuotes(toolsRaw),
  };
}

function hasAgentToken(value) {
  if (!value) return false;
  return value.split(/[,\s]+/).filter(Boolean).includes("Agent");
}

// Two independent ways a shell says "I cannot spawn", and the register reports which one, because the
// tier floor this gate enforces turns on exactly that answer.
function spawnColumn(fm) {
  if (hasAgentToken(fm?.disallowed)) return "no (disallowedTools)";
  if (fm?.tools !== undefined && !hasAgentToken(fm.tools)) return "no (tools allow-list)";
  return "yes";
}

// The register's table is DERIVED, never hand-kept: one row per shell, sorted by filename, so two runs
// over the same tree always produce byte-identical text and any difference is real drift, never format.
function renderTable(dir, fileNames) {
  const rows = [...fileNames].sort().map((f) => {
    const fm = parseFrontmatter(readFileSync(path.join(dir, f), "utf8"));
    const name = f.replace(/\.md$/, "");
    return "| `" + name + "` | " + (fm?.model ?? "(missing)") + " | " + spawnColumn(fm) + " |";
  });
  return [BEGIN, "| Agent | Tier | Can it spawn? |", "|---|---|---|", ...rows, END].join("\n");
}

// A tree that never declared a register is not this gate's business -- fixtures and sandboxes build a
// .claude/agents/ without one. A tree whose HEAD carries the register and whose working copy no longer
// does IS: that is the register being deleted out from under its readers, and it must be refused.
function registerIsTracked() {
  const r = spawnSync("git", ["cat-file", "-e", "HEAD:" + REGISTER_REL], { cwd: root });
  return r.status === 0;
}

function inspectRegister(wantTable) {
  const abs = path.join(root, REGISTER_REL);
  if (!existsSync(abs)) {
    if (!registerIsTracked()) return { abs, absent: true };
    return { abs, fail: REGISTER_REL + " is committed in HEAD but gone from the working tree. It is the only place a user is told what every agent declares, and this gate refuses to let it be removed silently." };
  }
  const text = readFileSync(abs, "utf8");
  const b = text.indexOf(BEGIN);
  const e = text.indexOf(END);
  if (b === -1 || e === -1 || e < b) {
    return { abs, text, fail: REGISTER_REL + " carries no generated table block. Expected the exact BEGIN/END AGENT-TIER-TABLE marker lines around it." };
  }
  const current = text.slice(b, e + END.length).replace(/\r\n/g, "\n");
  if (current !== wantTable) {
    return { abs, text, b, e, fail: REGISTER_REL + " has drifted from .claude/agents/: its table no longer reports what the shells actually declare. Regenerate it: node .grimorio/scripts/check-agent-tiers.mjs --write" };
  }
  return { abs, text, b, e };
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

const wantTable = renderTable(agentsDir, files);
const register = inspectRegister(wantTable);

if (process.argv.includes("--write")) {
  if (register.b !== undefined) {
    writeFileSync(register.abs, register.text.slice(0, register.b) + wantTable + register.text.slice(register.e + END.length));
  } else {
    writeFileSync(register.abs, "# Agent Tiers\n\n## THE TABLE\n\n" + wantTable + "\n");
  }
  console.log(`WROTE: ${REGISTER_REL} table regenerated from ${files.length} agent file(s).`);
  process.exit(0);
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

if (register.fail) {
  console.error(`
REFUSED: ${register.fail}`);
  process.exit(1);
}

console.log(`OK: ${files.length} agent file(s) in ${path.relative(root, agentsDir)} conform to the tier doctrine, and ${REGISTER_REL} reports them exactly.`);
process.exit(0);
