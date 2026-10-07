#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/misusecase.mjs — correct-by-construction generator + semantic validator for a MISUSE-CASE
 * diagram (Sindre & Opdahl's security extension of the UML use-case diagram). Third entry in the
 * diagram-kit series, same shape as usecase.mjs/statemachine.mjs. Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/misuse-case-diagram.md (Sindre & Opdahl,
 * "Capturing Security Requirements through Misuse Cases", TOOLS Pacific 2000; "Eliciting security
 * requirements with misuse cases", Requirements Engineering 10(1), 2005) — Section D is this file's spec.
 *
 * MODEL: { subject, actors:[{id,name}], useCases:[{id,goal}], misusers:[{id,name}],
 *          misuseCases:[{id,goal}], associations:[{actor,useCase}], misuserLinks:[{misuser,misuseCase}],
 *          threatens:[{misuseCase,useCase}], mitigates:[{useCase,misuseCase}], detects:[{useCase,misuseCase}] }
 * Ordinary use-case internal legality (include/extend/generalize) is usecase.mjs's own job — this kit
 * validates only the misuse-specific additions: misusers, misuse cases, threatens/mitigates/detects.
 */
import fs from 'node:fs';

// A misuse case's goal is the misuser's OWN active-verb goal (Sindre&Opdahl reuse Cockburn's goal-phrase
// convention) — never a bare category noun standing alone.
const BARE_NOUN_RE = /^(attack|threat|risk|vulnerability|misuse|exploit|hack|breach)$/i;

// The ONLY legal misuse-case-diagram stereotypes (reference D3/D4/D5). Anything else is invented.
const LEGAL_STEREOTYPES = new Set(['threatens', 'mitigates', 'detects']);

// ── validateMisuseCaseModel — the full check on the typed object ───────────────────────────────────

function validateMisuseCaseModel(model) {
  const v = [];
  const actorIds = new Set((model.actors || []).map((a) => a.id));
  const ucIds = new Set((model.useCases || []).map((u) => u.id));
  const misuserIds = new Set((model.misusers || []).map((m) => m.id));
  const mcIds = new Set((model.misuseCases || []).map((m) => m.id));

  // Global id uniqueness across all FOUR namespaces this kit owns — a bare pairwise check (e.g. only
  // misuseCase<->useCase) misses an id reused across an unchecked pair (e.g. actor<->misuseCase), which
  // would then let the generator emit that id declared twice under two conflicting node shapes.
  const namespaces = [['actor', actorIds], ['misuser', misuserIds], ['use case', ucIds], ['misuse case', mcIds]];
  const owners = new Map();
  for (const [label, ids] of namespaces) {
    for (const id of ids) {
      if (!owners.has(id)) owners.set(id, []);
      owners.get(id).push(label);
    }
  }
  for (const [id, labels] of owners) {
    if (labels.length > 1) v.push({ item: 1, rule: `id reused across namespaces (${labels.join(', ')})`, detail: id });
  }

  for (const t of model.threatens || []) {
    if (!mcIds.has(t.misuseCase)) v.push({ item: 3, rule: 'threatens must be sourced from a known misuse case (never an actor/misuser)', detail: `${t.misuseCase}→${t.useCase}` });
    if (!ucIds.has(t.useCase)) v.push({ item: 3, rule: 'threatens must target a known use case (never a misuse case)', detail: `${t.misuseCase}→${t.useCase}` });
  }
  for (const m of model.mitigates || []) {
    if (!ucIds.has(m.useCase)) v.push({ item: 4, rule: 'mitigates must be sourced from a known use case', detail: `${m.useCase}→${m.misuseCase}` });
    if (!mcIds.has(m.misuseCase)) v.push({ item: 4, rule: 'mitigates must target a known misuse case', detail: `${m.useCase}→${m.misuseCase}` });
  }
  for (const d of model.detects || []) {
    if (!ucIds.has(d.useCase)) v.push({ item: 4, rule: 'detects must be sourced from a known use case', detail: `${d.useCase}→${d.misuseCase}` });
    if (!mcIds.has(d.misuseCase)) v.push({ item: 4, rule: 'detects must target a known misuse case', detail: `${d.useCase}→${d.misuseCase}` });
  }
  for (const l of model.misuserLinks || []) {
    if (!misuserIds.has(l.misuser)) v.push({ item: 2, rule: 'misuser link endpoint is not a known misuser', detail: l.misuser });
    if (!mcIds.has(l.misuseCase)) v.push({ item: 2, rule: 'misuser link endpoint is not a known misuse case', detail: l.misuseCase });
  }
  for (const m of model.misuseCases || []) {
    const g = (m.goal || '').trim();
    if (!g || !g.includes(' ')) v.push({ item: 8, rule: 'misuse-case goal is not a verb+object phrase', detail: g || m.id });
    else if (BARE_NOUN_RE.test(g)) v.push({ item: 8, rule: 'misuse-case goal is a bare category noun, not the misuser\'s own goal', detail: g });
  }

  const warnings = [];
  const threatenedFrom = new Set((model.threatens || []).map((t) => t.misuseCase));
  const linkedFrom = new Set((model.misuserLinks || []).map((l) => l.misuseCase));
  for (const m of model.misuseCases || []) {
    if (!threatenedFrom.has(m.id)) warnings.push({ rule: 'misuse case threatens no use case — name what it endangers', detail: m.id });
    if (!linkedFrom.has(m.id)) warnings.push({ rule: 'misuse case has no misuser — name who could accomplish it', detail: m.id });
  }
  return { pass: v.length === 0, violations: v, warnings };
}

// ── generateMisuseCaseMermaid — correct by construction ─────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
}

function generateMisuseCaseMermaid(model, { direction = 'TD' } = {}) {
  const check = validateMisuseCaseModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a misuse-case diagram from an invalid model:\n${msg}`);
  }
  const L = [`flowchart ${direction}`];
  for (const a of model.actors || []) L.push(`  ${a.id}["${esc(a.name)}"]`);
  for (const m of model.misusers || []) L.push(`  ${m.id}["${esc(m.name)}"]`);
  if ((model.useCases || []).length) {
    L.push(`  subgraph SUBJECT["Subject: ${esc(model.subject || 'system')}"]`);
    L.push('    direction TB');
    for (const u of model.useCases || []) L.push(`    ${u.id}(["${esc(u.goal)}"])`);
    L.push('  end');
  }
  if ((model.misuseCases || []).length) {
    L.push('  subgraph MISUSE["misuse goals"]');
    L.push('    direction TB');
    for (const m of model.misuseCases || []) L.push(`    ${m.id}[["${esc(m.goal)}"]]`);
    L.push('  end');
  }
  for (const as of model.associations || []) L.push(`  ${as.actor} --- ${as.useCase}`);
  for (const l of model.misuserLinks || []) L.push(`  ${l.misuser} --- ${l.misuseCase}`);
  for (const t of model.threatens || []) L.push(`  ${t.misuseCase} -->|"&laquo;threatens&raquo;"| ${t.useCase}`);
  for (const m of model.mitigates || []) L.push(`  ${m.useCase} -.->|"&laquo;mitigates&raquo;"| ${m.misuseCase}`);
  for (const d of model.detects || []) L.push(`  ${d.useCase} -.->|"&laquo;detects&raquo;"| ${d.misuseCase}`);
  return L.join('\n');
}

// ── lintMisuseCaseMermaid — heuristic backstop for hand-authored / legacy mermaid ──────────────────

function extractMermaidBlocks(md) {
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

// A block is OURS only if it carries a misuse-case stereotype — a plain use-case/state-machine/DFD
// block must be skipped, never false-flagged (mirrors usecase.mjs's own type-boundary discipline).
function isMisuseCaseType(text) {
  return /[«»]?\s*(threatens|mitigates|detects)\s*[«»]?/i.test(text) || /%%\s*type:\s*misuse-?case/i.test(text);
}

// Node-shape map: bracket `id["..."]` = actor/misuser, stadium `id(["..."])` = use case,
// subroutine `id[["..."]]` = misuse case (D7's mermaid stand-in for Sindre&Opdahl's inverted fill).
function shapesOf(text) {
  const shapes = new Map();
  for (const m of text.matchAll(/(\w+)\[\["/g)) shapes.set(m[1], 'misusecase');
  for (const m of text.matchAll(/(\w+)\(\["/g)) shapes.set(m[1], 'usecase');
  for (const m of text.matchAll(/(\w+)\["/g)) if (!shapes.has(m[1])) shapes.set(m[1], 'actor');
  return shapes;
}

function edgeLabel(line) {
  const m1 = line.match(/\|\s*"?([^"|]+?)"?\s*\|/);
  if (m1) return m1[1].trim();
  const m2 = line.match(/-\.\s*"?([^"\n]*?)"?\s*\.-{1,2}>?/);
  if (m2) return m2[1].trim();
  return '';
}

function stereoOf(label) {
  return label.replace(/[«»]|&laquo;|&raquo;/g, '').trim().toLowerCase().split(/\s+/)[0];
}

// Strip inline pipe-labels and quoted content first, so the arrow's from/to survive any label
// syntax (pipe `|"x"|` or dashed-dot `-. "x" .->`) sitting between the two node ids.
function edgeEndpoints(line) {
  const stripped = line.replace(/\|[^|]*\|/g, ' ').replace(/"[^"\n]*"/g, ' ');
  const m = stripped.match(/^\s*(\w+)\s*[-.=>\s]+(\w+)\s*$/);
  return m ? [m[1], m[2]] : null;
}

function lintMisuseCaseBlock(text) {
  const v = [];
  const shapes = shapesOf(text);
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = edgeEndpoints(line);
    if (!m) continue;
    const [from, to] = m;
    const fromShape = shapes.get(from), toShape = shapes.get(to);
    if (fromShape === undefined || toShape === undefined) continue;
    const label = edgeLabel(line);
    const guillemet = /[«»]|&laquo;|&raquo;/.test(label);
    const stereo = guillemet ? stereoOf(label) : '';

    if (fromShape === 'actor' && toShape === 'misusecase') {
      if (label) v.push({ item: 2, line: i + 1, rule: 'misuser↔misuse-case link must be a plain, undirected association, never labeled/stereotyped', detail: line.trim() });
      continue;
    }
    if (fromShape === 'misusecase' && toShape === 'usecase') {
      if (!guillemet) { if (label) v.push({ item: 6, line: i + 1, rule: 'edge between misuse case and use case carries free prose, not a legal stereotype (threatens/mitigates/detects)', detail: line.trim() }); continue; }
      if (stereo !== 'threatens') v.push({ item: 3, line: i + 1, rule: `misuse-case→use-case edge must be «threatens», found «${stereo}»`, detail: line.trim() });
      continue;
    }
    if (fromShape === 'usecase' && toShape === 'misusecase') {
      if (!guillemet) { if (label) v.push({ item: 6, line: i + 1, rule: 'edge between use case and misuse case carries free prose, not a legal stereotype (mitigates/detects)', detail: line.trim() }); continue; }
      if (!LEGAL_STEREOTYPES.has(stereo) || stereo === 'threatens') v.push({ item: 4, line: i + 1, rule: `use-case→misuse-case edge must be «mitigates» or «detects», found «${stereo}»`, detail: line.trim() });
      continue;
    }
    if (guillemet && stereo === 'threatens' && fromShape !== 'misusecase') {
      v.push({ item: 3, line: i + 1, rule: 'a «threatens» edge must be sourced from a misuse case, never an actor/misuser', detail: line.trim() });
    }
  }
  return v;
}

function lintMisuseCaseMermaid(md) {
  const blocks = extractMermaidBlocks(md);
  const out = [];
  let skipped = 0;
  for (const b of blocks) {
    if (!isMisuseCaseType(b.text)) { skipped++; continue; }
    for (const x of lintMisuseCaseBlock(b.text)) out.push({ ...x, blockStart: b.start, absLine: b.start + x.line - 1 });
  }
  return { pass: out.length === 0, violations: out, blocks: blocks.length, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {
    const model = JSON.parse(fs.readFileSync(arg, 'utf8'));
    process.stdout.write(generateMisuseCaseMermaid(model) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {
    const model = JSON.parse(fs.readFileSync(arg, 'utf8'));
    const r = validateMisuseCaseModel(model);
    for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {
    const md = fs.readFileSync(arg, 'utf8');
    const r = lintMisuseCaseMermaid(md);
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: misusecase.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateMisuseCaseMermaid, validateMisuseCaseModel, lintMisuseCaseMermaid, lintMisuseCaseBlock };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
