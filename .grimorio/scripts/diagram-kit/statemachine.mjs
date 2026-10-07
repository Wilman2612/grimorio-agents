#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/statemachine.mjs — correct-by-construction generator + semantic validator for a UML STATE
 * MACHINE (mermaid stateDiagram-v2). Second entry in the diagram-kit series, same shape as usecase.mjs:
 * generate() emits a diagram that cannot be a bastardization; validate-model scores the typed object against
 * the reference's hard rules; lint backstops legacy mermaid. Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/state-machine-diagram.md (OMG UML 2.5.1, Wiegers,
 * Ambler). Unlike a use-case diagram this is a STRUCTURAL type — mostly graphics, minimal text.
 *
 * MODEL: { name, states:[{id,name,kind?}], initial:<id>, finals:[<id>...],
 *          transitions:[{from,to,event?,guard?,action?}] }  (kind ∈ normal|choice|junction, default normal)
 */
import fs from 'node:fs';

// A state names a SITUATION (noun / adjective / -ing), never an action verb phrase (reference A.3 rule 7).
// Heuristic: a name that STARTS with a bare imperative action verb and is not an -ing form is an action.
const ACTION_VERB_RE = /^(settle|meter|refuse|authorize|authorise|reclaim|reverse|mint|fund|spend|admit|clamp|debit|credit|create|delete|update|send|issue|compute|write|read|check|verify)\b/i;
const isSituationName = (n) => {
  const t = String(n || '').trim();
  if (!t) return false;
  if (/\w+ing\b/i.test(t)) return true; // "Settling", "Awaiting settle"
  return !ACTION_VERB_RE.test(t); // reject bare action-verb-first names
};

// A transition label a legacy diagram must not carry: bare sequence prose with no event/guard/action shape.
const PROSE_SEQUENCE_RE = /\b(then|next|after that|afterwards|and then|finally)\b/i;

function validateStateMachineModel(model) {
  const v = [];
  const ids = new Set((model.states || []).map((s) => s.id));
  const kindOf = new Map((model.states || []).map((s) => [s.id, s.kind || 'normal']));

  for (const s of model.states || []) {
    if (kindOf.get(s.id) === 'normal' && !isSituationName(s.name))
      v.push({ item: 3, rule: 'state names an ACTION, not a situation', detail: s.name });
  }
  // Item 2: exactly one initial, naming a real state.
  if (!model.initial) v.push({ item: 2, rule: 'no initial state declared', detail: '(model.initial)' });
  else if (!ids.has(model.initial)) v.push({ item: 2, rule: 'initial names an unknown state', detail: model.initial });

  const finals = new Set(model.finals || []);
  for (const f of finals) if (!ids.has(f)) v.push({ item: 5, rule: 'final names an unknown state', detail: f });

  for (const t of model.transitions || []) {
    if (!ids.has(t.from)) v.push({ item: 4, rule: 'transition from unknown state', detail: `${t.from}→${t.to}` });
    if (!ids.has(t.to)) v.push({ item: 4, rule: 'transition to unknown state', detail: `${t.from}→${t.to}` });
  }
  // Build outgoing map.
  const out = new Map([...ids].map((id) => [id, []]));
  for (const t of model.transitions || []) if (out.has(t.from)) out.get(t.from).push(t);

  // Item 5 (no dead end): a non-final state with no outgoing transition.
  for (const id of ids) {
    if (!finals.has(id) && (out.get(id) || []).length === 0)
      v.push({ item: 5, rule: 'non-final state is a DEAD END (no outgoing transition)', detail: id });
  }
  // Item 6 (reachability): BFS from initial.
  if (model.initial && ids.has(model.initial)) {
    const seen = new Set([model.initial]);
    const q = [model.initial];
    while (q.length) {
      const cur = q.shift();
      for (const t of out.get(cur) || []) if (ids.has(t.to) && !seen.has(t.to)) { seen.add(t.to); q.push(t.to); }
    }
    for (const id of ids) if (!seen.has(id)) v.push({ item: 6, rule: 'state UNREACHABLE from the initial', detail: id });
  }
  // Item 8 (determinism): two transitions from the same state on the same event without distinguishing guards.
  for (const id of ids) {
    const byEvent = new Map();
    for (const t of out.get(id) || []) {
      const key = (t.event || '').trim() || '<completion>';
      if (!byEvent.has(key)) byEvent.set(key, []);
      byEvent.get(key).push(t);
    }
    for (const [ev, ts] of byEvent) {
      if (ts.length > 1 && ts.some((t) => !(t.guard || '').trim()))
        v.push({ item: 8, rule: `non-deterministic: 2+ transitions on event "${ev}" from ${id} without exclusive guards`, detail: id });
    }
  }
  const warnings = [];
  // Item 7 (choice exhaustiveness): a choice with outgoing guards but no [else] / total coverage — WARN.
  for (const s of model.states || []) {
    if ((s.kind || 'normal') === 'choice') {
      const outs = out.get(s.id) || [];
      const hasElse = outs.some((t) => /^\s*(else|otherwise)\s*$/i.test((t.guard || '')));
      if (outs.length > 0 && !hasElse) warnings.push({ rule: 'choice has no [else] branch — verify its guards are exhaustive', detail: s.id });
    }
  }
  return { pass: v.length === 0, violations: v, warnings };
}

function label(t) {
  const ev = (t.event || '').trim();
  const g = (t.guard || '').trim();
  const a = (t.action || '').trim();
  let s = ev;
  if (g) s += (s ? ' ' : '') + `[${g}]`;
  if (a) s += ` / ${a}`;
  return s;
}

function generateStateMachineMermaid(model) {
  const check = validateStateMachineModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a state machine from an invalid model:\n${msg}`);
  }
  const L = ['stateDiagram-v2'];
  for (const s of model.states || []) {
    if ((s.kind || 'normal') === 'choice') L.push(`  state ${s.id} <<choice>>`);
    else if (s.name && s.name !== s.id) L.push(`  ${s.id} : ${s.name}`);
  }
  L.push(`  [*] --> ${model.initial}`);
  for (const t of model.transitions || []) {
    const lab = label(t);
    L.push(`  ${t.from} --> ${t.to}${lab ? ' : ' + lab : ''}`);
  }
  for (const f of model.finals || []) L.push(`  ${f} --> [*]`);
  return L.join('\n');
}

// ── lint (legacy mermaid backstop) ──────────────────────────────────────────────────────────────────

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

function isStateMachineBlock(text) {
  return /^\s*stateDiagram(-v2)?\b/m.test(text);
}

function lintStateMachineBlock(text) {
  const v = [];
  const lines = text.split(/\r?\n/);
  const states = new Set(), out = new Map(), incoming = new Set();
  let initials = 0;
  const addOut = (from, to) => { if (!out.has(from)) out.set(from, []); out.get(from).push(to); };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const m = line.match(/^(\[\*\]|\w+)\s*-->\s*(\[\*\]|\w+)\s*(?::\s*(.*))?$/);
    if (m) {
      const [, from, to, lab] = m;
      if (from === '[*]') initials++;
      else { states.add(from); addOut(from, to); }
      if (to !== '[*]') { states.add(to); incoming.add(to); }
      if (lab && PROSE_SEQUENCE_RE.test(lab))
        v.push({ item: 4, line: i + 1, rule: `transition label is sequence prose, not event [guard] / action ("${lab.trim()}")` });
      continue;
    }
    // state declaration `S : name`
    const d = line.match(/^(\w+)\s*:\s*(.+)$/);
    if (d) { states.add(d[1]); if (!isSituationName(d[2])) v.push({ item: 3, line: i + 1, rule: `state names an ACTION, not a situation ("${d[2].trim()}")` }); }
  }
  if (initials === 0) v.push({ item: 2, line: 1, rule: 'no initial pseudostate ([*] -->) in the region' });
  if (initials > 1) v.push({ item: 2, line: 1, rule: `${initials} initial pseudostates in one region (at most one allowed)` });
  return v;
}

function lintStateMachineMermaid(md) {
  const out = [];
  let skipped = 0;
  for (const b of extractBlocks(md)) {
    if (!isStateMachineBlock(b.text)) { skipped++; continue; }
    for (const x of lintStateMachineBlock(b.text)) out.push({ ...x, absLine: b.start + x.line - 1 });
  }
  return { pass: out.length === 0, violations: out, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {
    process.stdout.write(generateStateMachineMermaid(JSON.parse(fs.readFileSync(arg, 'utf8'))) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {
    const r = validateStateMachineModel(JSON.parse(fs.readFileSync(arg, 'utf8')));
    for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {
    const r = lintStateMachineMermaid(fs.readFileSync(arg, 'utf8'));
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: statemachine.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateStateMachineMermaid, validateStateMachineModel, lintStateMachineMermaid };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
