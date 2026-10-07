#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/c4container.mjs — correct-by-construction generator + semantic validator for a C4 model
 * (Simon Brown, c4model.com) CONTAINER diagram — level 2: zooms into ONE software system and shows the
 * containers (apps, data stores, services) inside its boundary, plus the people/external systems it
 * talks to. Same shape as usecase.mjs/statemachine.mjs: generate() emits mermaid that cannot be a
 * bastardization; validate-model scores the typed object against the reference's hard rules; lint
 * backstops legacy/hand-authored mermaid, SKIPPING blocks of other diagram types (classDiagram,
 * flowchart, stateDiagram-v2, ...). Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/c4-container-diagram.md (c4model.com's own
 * container-diagram + notation pages, mirrored by mermaid.js.org/syntax/c4.html's C4Container dialect).
 * mermaid's C4 support is EXPERIMENTAL — keep generated syntax to what is verified to parse.
 *
 * MODEL: { name?, people:[{id,name,descr?,ext?}], externalSystems:[{id,name,descr?}],
 *          systemBoundary:{id,name}, containers:[{id,name,techn,descr?,kind?,boundary?}],
 *          rels:[{from,to,label,techn?}] }  (kind ∈ container|db|queue, default container;
 *          a container's `boundary` is normally omitted — it is implicitly the one systemBoundary;
 *          setting it to a DIFFERENT id is how a bad-model fixture expresses "outside the boundary")
 */
import fs from 'node:fs';

// ── validateC4ContainerModel — the hard rules on the TYPED object (reference Section A.3 / D) ─────────

function validateC4ContainerModel(model) {
  const v = [];
  const warnings = [];
  const boundary = model.systemBoundary;
  if (!boundary || !boundary.id) v.push({ item: 1, rule: 'no System_Boundary declared', detail: '(model.systemBoundary)' });
  const boundaryId = boundary && boundary.id;

  const peopleIds = new Set((model.people || []).map((p) => p.id));
  const extIds = new Set((model.externalSystems || []).map((s) => s.id));
  const containerIds = new Set((model.containers || []).map((c) => c.id));
  const allIds = new Set([...peopleIds, ...extIds, ...containerIds, ...(boundaryId ? [boundaryId] : [])]);

  for (const c of model.containers || []) {
    if (boundaryId && c.boundary && c.boundary !== boundaryId)
      v.push({ item: 1, rule: 'container declared OUTSIDE the system boundary', detail: `${c.id} (boundary=${c.boundary})` });
    if (!(c.techn || '').trim()) v.push({ item: 5, rule: 'container has no technology descriptor', detail: c.id });
  }
  const touched = new Set();
  for (const r of model.rels || []) { touched.add(r.from); touched.add(r.to); }
  for (const id of containerIds) if (!touched.has(id)) v.push({ item: 6, rule: 'orphan container — no relationship in or out', detail: id });

  for (const r of model.rels || []) {
    if (!allIds.has(r.from)) v.push({ item: 2, rule: 'relationship FROM references an undeclared element', detail: `${r.from}→${r.to}` });
    if (!allIds.has(r.to)) v.push({ item: 2, rule: 'relationship TO references an undeclared element', detail: `${r.from}→${r.to}` });
    if (!(r.label || '').trim()) v.push({ item: 3, rule: 'relationship has no label', detail: `${r.from}→${r.to}` });
    if (containerIds.has(r.from) && containerIds.has(r.to) && !(r.techn || '').trim())
      warnings.push({ item: 4, rule: 'container-to-container relationship has no technology/protocol — C4 convention recommends one', detail: `${r.from}→${r.to}` });
  }
  return { pass: v.length === 0, violations: v, warnings };
}

// ── generateC4ContainerMermaid — correct by construction ───────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
}

function containerFn(kind) {
  if (kind === 'db') return 'ContainerDb';
  if (kind === 'queue') return 'ContainerQueue';
  return 'Container';
}

function generateC4ContainerMermaid(model) {
  const check = validateC4ContainerModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a C4 container diagram from an invalid model:\n${msg}`);
  }
  const L = ['C4Container'];
  for (const p of model.people || [])
    L.push(`  ${p.ext ? 'Person_Ext' : 'Person'}(${p.id}, "${esc(p.name)}"${p.descr ? `, "${esc(p.descr)}"` : ''})`);
  for (const s of model.externalSystems || [])
    L.push(`  System_Ext(${s.id}, "${esc(s.name)}"${s.descr ? `, "${esc(s.descr)}"` : ''})`);
  const b = model.systemBoundary;
  L.push(`  System_Boundary(${b.id}, "${esc(b.name)}") {`);
  for (const c of model.containers || [])
    L.push(`    ${containerFn(c.kind)}(${c.id}, "${esc(c.name)}", "${esc(c.techn)}"${c.descr ? `, "${esc(c.descr)}"` : ''})`);
  L.push('  }');
  for (const r of model.rels || [])
    L.push(`  Rel(${r.from}, ${r.to}, "${esc(r.label)}"${r.techn ? `, "${esc(r.techn)}"` : ''})`);
  return L.join('\n');
}

// ── lint (legacy/hand-authored mermaid backstop) ─────────────────────────────────────────────────────

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

// Is this block a C4Container diagram, or a DIFFERENT type (classDiagram, flowchart, stateDiagram-v2,
// C4Context/C4Component/...) this linter must not judge? Checked on the first non-blank line only, so a
// C4Context/C4Component/C4Dynamic block (a different C4 LEVEL, its own rules) is also correctly skipped.
function isC4ContainerBlock(text) {
  const first = text.split(/\r?\n/).find((l) => l.trim());
  return !!first && /^C4Container\b/.test(first.trim());
}

// Split a mermaid C4 function-call argument list on top-level commas (quote-aware), then unquote each.
function splitArgs(s) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"' && s[i - 1] !== '\\') { inQ = !inQ; cur += ch; continue; }
    if (ch === ',' && !inQ) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.map((t) => (t.startsWith('"') && t.endsWith('"') ? t.slice(1, -1).replace(/\\"/g, '"') : t));
}

const ELEM_RE = /^(Person_Ext|Person|System_Ext|System|ContainerDb_Ext|ContainerQueue_Ext|Container_Ext|ContainerDb|ContainerQueue|Container)\s*\(([\s\S]*)\)\s*$/;
const BOUNDARY_OPEN_RE = /^(System_Boundary|Enterprise_Boundary|Container_Boundary)\s*\(([\s\S]*?)\)\s*\{\s*$/;
const REL_RE = /^(BiRel|Rel)(_U|_Up|_D|_Down|_L|_Left|_R|_Right|_Back)?\s*\(([\s\S]*)\)\s*$/;

// Parse one C4Container block's lines into its elements/relationships (a single linear pass; no nested
// boundary re-entry needed since C4Container nests at most one System_Boundary in practice).
function parseC4ContainerBlock(lines) {
  const boundaryStack = [];
  let boundaryCount = 0;
  const containers = new Map();
  const rels = [];
  const allIds = new Set();
  const peopleInsideBoundary = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^\}\s*$/.test(line)) { boundaryStack.pop(); continue; }
    let m = line.match(BOUNDARY_OPEN_RE);
    if (m) { const id = splitArgs(m[2])[0]; allIds.add(id); if (m[1] === 'System_Boundary') boundaryCount++; boundaryStack.push(id); continue; }
    m = line.match(REL_RE);
    if (m) { const a = splitArgs(m[3]); rels.push({ from: a[0], to: a[1], label: a[2] || '', techn: a[3] || '', line: i + 1 }); continue; }
    m = line.match(ELEM_RE);
    if (!m) continue;
    const kind = m[1];
    const a = splitArgs(m[2]);
    const id = a[0];
    allIds.add(id);
    const inside = boundaryStack.length > 0;
    if (/^Container/.test(kind)) containers.set(id, { techn: a[2] || '', insideBoundary: inside, line: i + 1 });
    else if (inside && (kind === 'Person' || kind === 'Person_Ext' || kind === 'System_Ext'))
      peopleInsideBoundary.push({ kind, id, line: i + 1 });
  }
  return { boundaryCount, containers, rels, allIds, peopleInsideBoundary };
}

function lintC4ContainerBlock(text) {
  const { boundaryCount, containers, rels, allIds, peopleInsideBoundary } = parseC4ContainerBlock(text.split(/\r?\n/));
  const v = [];
  if (boundaryCount === 0) v.push({ item: 1, line: 1, rule: 'no System_Boundary declared' });
  if (boundaryCount > 1) v.push({ item: 1, line: 1, rule: `${boundaryCount} System_Boundary declared (must be exactly one)` });
  for (const p of peopleInsideBoundary)
    v.push({ item: 7, line: p.line, rule: `${p.kind} declared INSIDE a System_Boundary (context elements sit outside)`, detail: p.id });
  for (const [id, c] of containers) {
    if (!c.insideBoundary) v.push({ item: 1, line: c.line, rule: 'container declared OUTSIDE any System_Boundary', detail: id });
    if (!c.techn.trim()) v.push({ item: 5, line: c.line, rule: 'container has no technology descriptor', detail: id });
    if (!rels.some((r) => r.from === id || r.to === id)) v.push({ item: 6, line: c.line, rule: 'orphan container — no relationship in or out', detail: id });
  }
  for (const r of rels) {
    if (!allIds.has(r.from)) v.push({ item: 2, line: r.line, rule: 'relationship FROM references an undeclared element', detail: r.from });
    if (!allIds.has(r.to)) v.push({ item: 2, line: r.line, rule: 'relationship TO references an undeclared element', detail: r.to });
    if (!r.label.trim()) v.push({ item: 3, line: r.line, rule: 'relationship has no label', detail: `${r.from}→${r.to}` });
    if (containers.has(r.from) && containers.has(r.to) && !r.techn.trim())
      v.push({ item: 4, line: r.line, warn: true, rule: 'container-to-container relationship has no technology/protocol (C4 convention)', detail: `${r.from}→${r.to}` });
  }
  return v;
}

function lintC4ContainerMermaid(md) {
  const out = [];
  let skipped = 0;
  for (const b of extractBlocks(md)) {
    if (!isC4ContainerBlock(b.text)) { skipped++; continue; }
    for (const x of lintC4ContainerBlock(b.text)) out.push({ ...x, absLine: b.start + x.line - 1 });
  }
  const violations = out.filter((x) => !x.warn);
  const warnings = out.filter((x) => x.warn);
  return { pass: violations.length === 0, violations, warnings, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {
    process.stdout.write(generateC4ContainerMermaid(JSON.parse(fs.readFileSync(arg, 'utf8'))) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {
    const r = validateC4ContainerModel(JSON.parse(fs.readFileSync(arg, 'utf8')));
    for (const w of r.warnings) console.log(`WARN  item ${w.item}  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {
    const r = lintC4ContainerMermaid(fs.readFileSync(arg, 'utf8'));
    for (const w of r.warnings) console.log(`WARN  ${arg}:${w.absLine}  item ${w.item}  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}  (${x.detail || ''})`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: c4container.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateC4ContainerMermaid, validateC4ContainerModel, lintC4ContainerMermaid };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
