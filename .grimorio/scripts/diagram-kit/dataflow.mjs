#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/dataflow.mjs — correct-by-construction generator + semantic validator for a DATA-FLOW DIAGRAM
 * (Gane-Sarson / Yourdon-DeMarco structured-analysis notation), mermaid `flowchart` dialect. Third entry in the
 * diagram-kit series, same shape as usecase.mjs / statemachine.mjs: generate() emits a diagram that cannot be a
 * bastardization; validateModel scores the typed object against the reference's hard rules; lint backstops
 * legacy/hand-authored mermaid. Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/data-flow-diagram.md (Gane & Sarson, Yourdon,
 * DeMarco — see that file's Sourcing summary for exactly which claim came from which secondary source).
 *
 * MODEL: { name, entities:[{id,name}], processes:[{id,number?,name}], stores:[{id,number?,name}],
 *          flows:[{from,to,label}] }  — kind of an id (entity|process|store) is derived from which array it's
 * declared in, never guessed from its name.
 *
 * THE ONE RULE-SET, SHARED between validateModel (typed object) and lint (parsed legacy text): a data flow's
 * legality and a process's black-hole/miracle status depend only on (a) each endpoint's KIND and (b) in/out
 * counts per process — `evaluateFlowRules` is that shared core so the two paths can never silently diverge.
 */
import fs from 'node:fs';

// A data flow must be labelled with the DATA it carries (reference A.5 rule 4) — an id/whitespace-only string
// does not count.
const hasLabel = (s) => Boolean(String(s || '').trim());

// A process is NUMBERED per Gane-Sarson/Yourdon-DeMarco (reference A.1); this recognizes a process-numbering
// tell in free text (an id like `P1`, or a label/number starting `1.0`/`3.2` etc.) — used by isDataFlowBlock
// and collectNodeKinds below to recover a process's kind from unlabelled legacy shapes.
const PROCESS_NUMBER_RE = /(^|\s)P\d+(\.\d+)*\b|^\s*\d+(\.\d+)*\s+\S/;

function esc(s) {
  return String(s).replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
}

// ── evaluateFlowRules — the shared rule core (reference Section A hard constraints + Section D items) ─────

function evaluateFlowRules({ kindOf, processIds, flows }) {
  const v = [];
  const inCount = new Map([...processIds].map((id) => [id, 0]));
  const outCount = new Map([...processIds].map((id) => [id, 0]));
  for (const f of flows) {
    const fromKind = kindOf.get(f.from);
    const toKind = kindOf.get(f.to);
    if (!fromKind) v.push({ item: 1, rule: 'flow source is not a declared element', detail: f.from, line: f.line });
    if (!toKind) v.push({ item: 1, rule: 'flow target is not a declared element', detail: f.to, line: f.line });
    if (!hasLabel(f.label)) v.push({ item: 6, rule: 'data flow is not labelled with the data it carries', detail: `${f.from}->${f.to}`, line: f.line });
    v.push(...illegalDirectFlow(fromKind, toKind, f));
    if (outCount.has(f.from)) outCount.set(f.from, outCount.get(f.from) + 1);
    if (inCount.has(f.to)) inCount.set(f.to, inCount.get(f.to) + 1);
  }
  for (const [id, inN] of inCount) v.push(...blackHoleOrMiracle(id, inN, outCount.get(id) || 0));
  return v;
}

function illegalDirectFlow(fromKind, toKind, f) {
  if (!fromKind || !toKind) return [];
  const tag = `${f.from}->${f.to}`;
  if (fromKind === 'entity' && toKind === 'entity')
    return [{ item: 3, rule: 'illegal direct flow: external entity to external entity (must pass through a process)', detail: tag, line: f.line }];
  if ((fromKind === 'entity' && toKind === 'store') || (fromKind === 'store' && toKind === 'entity'))
    return [{ item: 4, rule: 'illegal direct flow: entity<->data store (must pass through a process)', detail: tag, line: f.line }];
  if (fromKind === 'store' && toKind === 'store')
    return [{ item: 5, rule: 'illegal direct flow: data store to data store (must pass through a process)', detail: tag, line: f.line }];
  return [];
}

function blackHoleOrMiracle(id, inN, outN) {
  if (inN > 0 && outN === 0) return [{ item: 2, rule: 'BLACK HOLE: process has input but no output', detail: id }];
  if (outN > 0 && inN === 0) return [{ item: 2, rule: 'MIRACLE: process has output but no input', detail: id }];
  if (inN === 0 && outN === 0) return [{ item: 2, rule: 'process is disconnected (no input and no output)', detail: id }];
  return [];
}

// ── validateModel — the full check on the typed object ─────────────────────────────────────────────────────

function validateModel(model) {
  const entities = model.entities || [], processes = model.processes || [], stores = model.stores || [];
  const kindOf = new Map();
  for (const e of entities) kindOf.set(e.id, kindOf.has(e.id) ? 'DUP' : 'entity');
  for (const p of processes) kindOf.set(p.id, kindOf.has(p.id) ? 'DUP' : 'process');
  for (const s of stores) kindOf.set(s.id, kindOf.has(s.id) ? 'DUP' : 'store');
  const v = [...kindOf].filter(([, k]) => k === 'DUP').map(([id]) => ({ item: 0, rule: 'id reused across element kinds', detail: id }));

  const processIds = new Set(processes.map((p) => p.id));
  const flows = (model.flows || []).map((f) => ({ ...f }));
  v.push(...evaluateFlowRules({ kindOf, processIds, flows }));

  const warnings = [];
  for (const p of processes) if (!hasLabel(p.number)) warnings.push({ rule: 'process has no number — Gane-Sarson/Yourdon-DeMarco number every process', detail: p.id });
  return { pass: v.length === 0, violations: v, warnings };
}

// ── generate — correct by construction ──────────────────────────────────────────────────────────────────────

function generate(model, { direction = 'TD' } = {}) {
  const check = validateModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a data-flow diagram from an invalid model:\n${msg}`);
  }
  const L = [`flowchart ${direction}`];
  for (const e of model.entities || []) L.push(`  ${e.id}["${esc(e.name)}"]`);
  for (const p of model.processes || []) L.push(`  ${p.id}(("${esc(hasLabel(p.number) ? `${p.number} ${p.name}` : p.name)}"))`);
  for (const s of model.stores || []) L.push(`  ${s.id}[("${esc(hasLabel(s.number) ? `${s.number} ${s.name}` : s.name)}")]`);
  for (const f of model.flows || []) L.push(`  ${f.from} -->|"${esc(f.label)}"| ${f.to}`);
  return L.join('\n');
}

// ── lint — heuristic backstop for legacy / hand-authored mermaid ───────────────────────────────────────────

function extractBlocks(md) {
  const blocks = [];
  const lines = md.split(/\r?\n/);
  let open = null, buf = [], start = 0;
  for (let i = 0; i < lines.length; i++) {
    if (open === null && /^\s*```mermaid\s*$/.test(lines[i])) { open = i; buf = []; start = i + 2; continue; }
    if (open !== null && /^\s*```\s*$/.test(lines[i])) { blocks.push({ start, text: buf.join('\n') }); open = null; continue; }
    if (open !== null) buf.push(lines[i]);
  }
  return blocks;
}

// Only a genuine DFD is ours to judge: a `flowchart` block (never stateDiagram-v2/classDiagram) carrying the
// one load-bearing tell that separates a Gane-Sarson/Yourdon-DeMarco DFD from a generic flowchart or a
// zones-and-boxes diagram: at least one NUMBERED process (reference A.1). No numbered process ⟶ a flowchart
// wearing the DFD label at best — not ours to judge, so we skip it rather than guess.
function isDataFlowBlock(text) {
  if (!/^\s*flowchart\b/im.test(text)) return false;
  if (/[«»]|&laquo;|&raquo;/.test(text) || /subgraph\s+\w+\[["']?Subject:/i.test(text)) return false; // use-case tell
  if (/%%\s*type:\s*(?!data-?flow)/i.test(text)) return false;
  return PROCESS_NUMBER_RE.test(text);
}

// Recover node declarations from raw mermaid text, wherever they appear (own line or inline on an edge) —
// hand-authored diagrams (the real instance) mix both. Shape decides the kind; a rectangle whose id/label
// carries the process-numbering tell is a process (Gane-Sarson draws processes as rounded rectangles too),
// everything else shaped as a rectangle is an entity.
function collectNodeKinds(text) {
  const kindOf = new Map();
  const set = (id, kind) => { if (!kindOf.has(id) || kindOf.get(id) === kind) kindOf.set(id, kind); else kindOf.set(id, 'AMBIGUOUS'); };
  for (const m of text.matchAll(/(\w+)\(\(\s*"?([^")]*)"?\s*\)\)/g)) set(m[1], 'process');
  for (const m of text.matchAll(/(\w+)\[\(\s*"?([^")\]]*)"?\s*\)\]/g)) set(m[1], 'store');
  for (const m of text.matchAll(/(\w+)\(\[\s*"?([^"\])]*)"?\s*\]\)/g)) set(m[1], 'entity'); // stadium
  for (const m of text.matchAll(/(\w+)\[(?!\()\s*"?([^"\]]*)"?\s*\]/g)) {
    if (kindOf.has(m[1])) continue; // a cylinder/stadium match already classified this id — do not overwrite
    set(m[1], PROCESS_NUMBER_RE.test(m[2]) || PROCESS_NUMBER_RE.test(m[1]) ? 'process' : 'entity');
  }
  return kindOf;
}

// Recover edges: `SRC <shape?> -->|"label"| DST <shape?>` (and `-.->`, `==>` variants) — bare ids only, any
// inline shape decoration on the edge line itself is stripped, since collectNodeKinds already read it.
function collectFlows(text) {
  const flows = [];
  const lines = text.split(/\r?\n/);
  const EDGE_RE = /(\w+)(?:\[\(.*?\)\]|\(\(.*?\)\)|\(\[.*?\]\)|\[.*?\])?\s*(?:--|-\.|==)[->]{0,2}>\s*(?:\|"?([^"|]*)"?\|\s*)?(\w+)(?:\[\(.*?\)\]|\(\(.*?\)\)|\(\[.*?\]\)|\[.*?\])?/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(EDGE_RE);
    if (m) flows.push({ from: m[1], to: m[3], label: m[2] || '', line: i + 1 });
  }
  return flows;
}

function lintBlock(text) {
  const kindOf = collectNodeKinds(text);
  for (const [id, k] of kindOf) if (k === 'AMBIGUOUS') kindOf.delete(id); // conflicting shapes for one id — skip, not ours to guess
  const processIds = new Set([...kindOf].filter(([, k]) => k === 'process').map(([id]) => id));
  return evaluateFlowRules({ kindOf, processIds, flows: collectFlows(text) }).filter((x) => x.item !== 1); // item 1 needs the full model; too noisy from partial text parses
}

function lintMermaid(md) {
  const out = [];
  let skipped = 0;
  for (const b of extractBlocks(md)) {
    if (!isDataFlowBlock(b.text)) { skipped++; continue; }
    for (const x of lintBlock(b.text)) out.push({ ...x, absLine: x.line ? b.start + x.line - 1 : b.start });
  }
  return { pass: out.length === 0, violations: out, blocks: extractBlocks(md).length, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────

function reportModel(r) {
  for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
  for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
  console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
  return r.pass ? 0 : 1;
}

function reportLint(arg, r) {
  for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
  const tail = `${r.blocks} block(s), ${r.skipped} skipped (non-DFD)`;
  console.log(r.pass
    ? `--- lint CLEAN (no gross tells; not a proof of correctness) — ${tail} ---`
    : `--- lint: ${r.violations.length} violation(s) — ${tail} ---`);
  return r.pass ? 0 : 1;
}

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') { process.stdout.write(generate(JSON.parse(fs.readFileSync(arg, 'utf8'))) + '\n'); return 0; }
  if (cmd === 'validate-model') return reportModel(validateModel(JSON.parse(fs.readFileSync(arg, 'utf8'))));
  if (cmd === 'lint') return reportLint(arg, lintMermaid(fs.readFileSync(arg, 'utf8')));
  console.error('usage: dataflow.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generate, validateModel, lintMermaid, isDataFlowBlock, evaluateFlowRules };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
