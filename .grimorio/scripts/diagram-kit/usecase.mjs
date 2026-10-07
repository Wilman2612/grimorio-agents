#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/usecase.mjs — the CORRECT-BY-CONSTRUCTION generator + the semantic validator for a UML
 * use-case diagram. It exists because the diagram-primacy gate proved only that "a diagram exists",
 * never that "it is a CORRECT use-case diagram" — and a hand-authored super-graphic passed it while
 * being, in Cockburn's words, a flowchart wearing the use-case label (directed associations, a
 * «precede» stereotype that does not exist, actor→actor "on behalf" edges, and invented "NO ACTOR"
 * placeholder nodes). See .grimorio/skills-store/grimorio.system-design/diagram-references/use-case-diagram.md for the grounded formal rules (OMG UML
 * 2.5.1, Fowler, Cockburn) this file mechanizes — Section D's 11-point checklist is its spec.
 *
 * TWO ENTRY POINTS, one shared rule-set:
 *   generateUseCaseMermaid(model)  — emits mermaid that CANNOT be a bastardization: associations are
 *                                    undirected (`---`), «include»/«extend» carry the correct opposite
 *                                    directions, generalization is its own style, and the schema has no
 *                                    field in which a "finding node" or an actor→actor flow edge could
 *                                    even be expressed. Correctness by construction, not by review.
 *   lintUseCaseMermaid(text)       — heuristic backstop for LEGACY / hand-authored mermaid: catches the
 *                                    gross, textual bastardizations (invalid stereotype, flow/sequence
 *                                    edge labels, actor→actor "on behalf", placeholder finding-nodes,
 *                                    directed associations). It is a LINT, not a proof — a clean lint
 *                                    does not certify a diagram correct, only that the gross tells are
 *                                    absent. The generator is the certified path.
 *
 * validateUseCaseModel(model) runs the reliable half of Section D against the TYPED object before it is
 * drawn — the only place all 11 items can be checked without guessing a node's role from its text.
 */
import fs from 'node:fs';

// ── The rule-set (Section D of the reference, mechanized) ──────────────────────────────────────────

// A use-case goal must read as an active verb phrase naming a goal, never a noun / UI action / CRUD op
// standing alone (C.4, the "go to lunch" / elementary-business-process test). Heuristic, deliberately
// permissive: it rejects the obvious button/CRUD tells, not every borderline phrasing.
const UI_ACTION_RE = /^(click|press|tap|open|close|the |a |an )?\s*(button|page|screen|field|form|row|record|table)\b/i;
const BARE_CRUD_RE = /^(create|read|update|delete|insert|edit|save|load|get|set|fetch)\s+\w+$/i;

// A node whose only job is to stand in for an absent actor or a finding — forbidden (A.9 / item 8).
const PLACEHOLDER_RE = /\b(no actor|not served|out of boundary|the finding|placeholder|n\/a actor|tbd)\b/i;

// The ONLY stereotypes legal between use cases (A.6/A.7/A.8). Anything else (e.g. «precede») is invented.
const LEGAL_STEREOTYPES = new Set(['include', 'extend', 'generalize', 'generalizes', 'generalization']);

// Edge labels that assert sequence / control flow / data flow / delegation — none of which a use-case
// diagram may carry (A.5/A.9/C.1/C.3/C.5). "on behalf" is the actor→actor delegation tell (C.5).
const FLOW_LABEL_RE = /\b(precede|precedes|then|next|after|before|on behalf|two settles|flows? to|sends? to|calls?|invokes?|triggers?)\b/i;

// ── validateUseCaseModel — the full check on the typed object ───────────────────────────────────────

function validateUseCaseModel(model) {
  const v = [];
  const actorIds = new Set((model.actors || []).map((a) => a.id));
  const ucIds = new Set((model.useCases || []).map((u) => u.id));

  for (const id of actorIds) {
    if (ucIds.has(id)) v.push({ item: 2, rule: 'id used as both actor and use case', detail: id });
  }
  for (const a of model.actors || []) {
    if (PLACEHOLDER_RE.test(a.name || '')) v.push({ item: 8, rule: 'placeholder actor node', detail: a.name });
  }
  for (const u of model.useCases || []) {
    const g = (u.goal || '').trim();
    if (PLACEHOLDER_RE.test(g)) v.push({ item: 8, rule: 'placeholder use-case node', detail: g });
    if (!g || !g.includes(' ')) v.push({ item: 10, rule: 'goal is not a verb+object phrase', detail: g || u.id });
    else if (UI_ACTION_RE.test(g) || BARE_CRUD_RE.test(g))
      v.push({ item: 10, rule: 'goal is a UI/CRUD action, not a user goal', detail: g });
  }
  // Item 3 + item 7: an association may only connect an actor to a use case — never actor→actor, uc→uc.
  for (const as of model.associations || []) {
    const aIsActor = actorIds.has(as.actor);
    const ucIsUc = ucIds.has(as.useCase);
    if (!aIsActor) v.push({ item: 3, rule: 'association endpoint is not a known actor', detail: as.actor });
    if (!ucIsUc) v.push({ item: 3, rule: 'association endpoint is not a known use case', detail: as.useCase });
    if (actorIds.has(as.useCase)) v.push({ item: 7, rule: 'association connects two actors (use generalization)', detail: `${as.actor}↔${as.useCase}` });
  }
  for (const inc of model.includes || []) {
    if (!ucIds.has(inc.base) || !ucIds.has(inc.included))
      v.push({ item: 4, rule: 'include must connect two use cases', detail: `${inc.base}→${inc.included}` });
  }
  for (const ex of model.extends || []) {
    if (!ucIds.has(ex.extending) || !ucIds.has(ex.base))
      v.push({ item: 5, rule: 'extend must connect two use cases', detail: `${ex.extending}→${ex.base}` });
  }
  for (const gen of model.usecaseGeneralizations || []) {
    if (!ucIds.has(gen.child) || !ucIds.has(gen.parent))
      v.push({ item: 6, rule: 'use-case generalization must connect two use cases', detail: `${gen.child}→${gen.parent}` });
  }
  for (const gen of model.actorGeneralizations || []) {
    if (!actorIds.has(gen.child) || !actorIds.has(gen.parent))
      v.push({ item: 6, rule: 'actor generalization must connect two actors', detail: `${gen.child}→${gen.parent}` });
  }
  // Content WARNING (not an error): a use case no actor associates with (Cockburn: still name the
  // stakeholder who cares it runs — but that is a CONTENT fix, not a diagram-legality failure).
  const warnings = [];
  const associated = new Set((model.associations || []).map((a) => a.useCase));
  for (const u of model.useCases || []) {
    if (!associated.has(u.id)) warnings.push({ rule: 'use case has no actor association — name the stakeholder who cares it runs', detail: u.id });
  }
  return { pass: v.length === 0, violations: v, warnings };
}

// ── generateUseCaseMermaid — correct by construction ────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
}

function generateUseCaseMermaid(model, { direction = 'TD' } = {}) {
  const check = validateUseCaseModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a use-case diagram from an invalid model:\n${msg}`);
  }
  const L = [`flowchart ${direction}`];
  // Actors outside the subject.
  for (const a of model.actors || []) L.push(`  ${a.id}["${esc(a.name)}"]`);
  // Actor generalizations (child --> parent, solid directed, its own «generalize» style).
  for (const g of model.actorGeneralizations || []) L.push(`  ${g.child} -->|"&laquo;generalize&raquo;"| ${g.parent}`);
  // The subject boundary with its use cases as ellipses.
  L.push(`  subgraph SUBJECT["Subject: ${esc(model.subject || 'system')}"]`);
  L.push('    direction TB');
  for (const u of model.useCases || []) L.push(`    ${u.id}(["${esc(u.goal)}"])`);
  L.push('  end');
  // Associations: UNDIRECTED, no arrowhead, no label (item 3/9).
  for (const as of model.associations || []) L.push(`  ${as.actor} --- ${as.useCase}`);
  // Includes: dashed, base -> included.
  for (const inc of model.includes || []) L.push(`  ${inc.base} -.->|"&laquo;include&raquo;"| ${inc.included}`);
  // Extends: dashed, extending -> base (opposite direction from include).
  for (const ex of model.extends || []) L.push(`  ${ex.extending} -.->|"&laquo;extend&raquo;"| ${ex.base}`);
  // Use-case generalizations: solid directed, child -> parent.
  for (const g of model.usecaseGeneralizations || []) L.push(`  ${g.child} -->|"&laquo;generalize&raquo;"| ${g.parent}`);
  return L.join('\n');
}

// ── lintUseCaseMermaid — heuristic backstop for hand-authored / legacy mermaid ──────────────────────

function extractMermaidBlocks(md) {
  const blocks = [];
  const lines = md.split(/\r?\n/);
  let open = null;
  let buf = [];
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    if (open === null && /^\s*```mermaid\s*$/.test(lines[i])) { open = i; buf = []; start = i + 2; continue; }
    if (open !== null && /^\s*```\s*$/.test(lines[i])) { blocks.push({ start, text: buf.join('\n') }); open = null; continue; }
    if (open !== null) buf.push(lines[i]);
  }
  return blocks;
}

// Pull EVERY candidate edge label off one line, across mermaid's label syntaxes — pipe `|"lbl"|`,
// dashed-dot `-. "lbl" .->`, and thick `-- lbl -->`. Missing the dashed-dot form was the gap that let
// «precede»/«extend»/"two settles"/"on behalf" through.
function edgeLabels(line) {
  const out = [];
  const push = (s) => { const t = (s || '').trim(); if (t) out.push(t); };
  for (const m of line.matchAll(/\|\s*"?([^"|]+?)"?\s*\|/g)) push(m[1]);
  for (const m of line.matchAll(/-\.\s*"?([^"\n]*?)"?\s*\.-{1,2}>?/g)) push(m[1]);
  for (const m of line.matchAll(/(?:^|[A-Za-z0-9_)\]])\s*--\s*"?([^"\n<>|]+?)"?\s*--+>?/g)) push(m[1]);
  return out;
}

// Lint ONE mermaid block's text. Returns violations with the reference item they map to.
function lintUseCaseBlock(text) {
  const v = [];
  const lines = text.split(/\r?\n/);
  const guillemet = /[«»]|&laquo;|&raquo;/;
  const stripStereo = (s) => s.replace(/[«»]|&laquo;|&raquo;/g, '').trim().toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Placeholder / finding node (item 8): a node whose label is a stand-in for "no actor".
    if (PLACEHOLDER_RE.test(line) && /[\[(]/.test(line)) v.push({ item: 8, line: i + 1, rule: 'placeholder/finding node stands in for an absent actor', detail: line.trim() });
    const isEdge = /-(-|\.|=)?-?>|---/.test(line) && /\w[^\n]*-[.=-]*[->][^\n]*\w/.test(line);
    const labels = edgeLabels(line);
    for (const label of labels) {
      // Invalid stereotype (item 3/4): a «...» that is not include/extend/generalize.
      if (guillemet.test(label)) {
        const stereo = stripStereo(label).split(/\s+/)[0];
        if (!LEGAL_STEREOTYPES.has(stereo))
          v.push({ item: 3, line: i + 1, rule: `invalid use-case stereotype «${stripStereo(label)}» (only include/extend/generalize exist)`, detail: line.trim() });
      }
      // Flow / sequence / delegation label (item 9 / C.5): forbidden on any use-case-diagram edge.
      else if (FLOW_LABEL_RE.test(label))
        v.push({ item: 9, line: i + 1, rule: `edge label asserts sequence/flow/delegation ("${label}")`, detail: line.trim() });
    }
    // Directed solid association (item 3): a `-->` whose label is NOT a stereotype/generalization is a
    // directed association or a flow arrow — associations must be undirected `---`.
    if (/[^.=]-->/.test(line) && isEdge) {
      const stereo = labels.length ? stripStereo(labels[0]).split(/\s+/)[0] : '';
      if (!LEGAL_STEREOTYPES.has(stereo))
        v.push({ item: 3, line: i + 1, rule: 'directed solid arrow used as an association (associations are undirected `---`)', detail: line.trim() });
    }
  }
  return v;
}

// Is this block a use-case diagram, or a DIFFERENT type this linter must not judge? A misuse-case
// diagram legitimately carries «threatens»/«mitigates» (Sindre & Opdahl) — its own type, its own rules.
function isNotUseCaseType(text) {
  return /[«»]?\s*(threatens|mitigates|aggravates)\s*[«»]?/i.test(text) || /%%\s*type:\s*(?!use-?case)/i.test(text);
}

function lintUseCaseMermaid(md) {
  const blocks = extractMermaidBlocks(md);
  const out = [];
  let skipped = 0;
  for (const b of blocks) {
    if (isNotUseCaseType(b.text)) { skipped++; continue; } // a misuse-case / other type — not ours to judge
    const vs = lintUseCaseBlock(b.text);
    for (const x of vs) out.push({ ...x, blockStart: b.start, absLine: b.start + x.line - 1 });
  }
  return { pass: out.length === 0, violations: out, blocks: blocks.length, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {

    const model = JSON.parse(fs.readFileSync(arg, 'utf8'));
    process.stdout.write(generateUseCaseMermaid(model) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {

    const model = JSON.parse(fs.readFileSync(arg, 'utf8'));
    const r = validateUseCaseModel(model);
    for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {

    const md = fs.readFileSync(arg, 'utf8');
    const r = lintUseCaseMermaid(md);
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: usecase.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateUseCaseMermaid, validateUseCaseModel, lintUseCaseMermaid, lintUseCaseBlock };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
