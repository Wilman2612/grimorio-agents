#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/sequence.mjs — correct-by-construction generator + semantic validator for a UML SEQUENCE
 * DIAGRAM (mermaid `sequenceDiagram`). Third entry in the diagram-kit series, same shape as usecase.mjs and
 * statemachine.mjs: generate() emits a diagram that cannot be a bastardization; validate-model scores the
 * typed object against the reference's hard rules; lint backstops legacy/hand-authored mermaid. Rules
 * grounded in .grimorio/skills-store/grimorio.system-design/diagram-references/sequence-diagram.md (Larman ch.10 SSD,
 * Fowler UML Distilled ch.4, OMG UML 2.5.1 interactions chapter).
 *
 * TWO modes, one shared rule-set, selected by `model.kind`:
 *   'ssd'    — Larman's black-box System Sequence Diagram: exactly ONE `role:"system"` lifeline (the
 *              anonymous `:System` object), any number of `role:"actor"` lifelines (primary + secondary).
 *   'design' — a normal design-level interaction diagram: any number of lifelines of either role.
 *
 * MODEL: { kind:'ssd'|'design', title?, autonumber?=true,
 *          participants:[{id, name?, role?}],           role: 'actor' | 'system' | 'object' (default)
 *          items:[ MessageItem | FragmentItem | NoteItem ] }
 *   MessageItem:  {kind:'message', from, to, text, type?:'sync'|'async'|'reply' (default 'sync'),
 *                  activate?, deactivate?}
 *   FragmentItem: {kind:'fragment', fragment:'alt'|'opt'|'loop', branches:[{label?, items:[...]}]}
 *   NoteItem:     {kind:'note', text, position?:'over'|'left of'|'right of' (default 'over'), participants:[id...]}
 */
import fs from 'node:fs';

// ── The rule-set (Section A of the reference, mechanized) ──────────────────────────────────────────

// item 3: a message must name an OPERATION (Fowler ch.4: "messages ... represent an operation call"),
// never narrated prose describing what happens. Same shape as statemachine.mjs's PROSE_SEQUENCE_RE.
const MESSAGE_PROSE_RE = /\b(then|next|after that|afterwards|and then|finally|stuff|things|etc\.?|basically|somehow|whatever|and so on)\b/i;
const ARTICLE_FIRST_RE = /^(the|a|an)\s/i;

function isOperationText(t) {
  const s = (t || '').trim();
  if (!s) return false;
  if (MESSAGE_PROSE_RE.test(s)) return false;
  if (ARTICLE_FIRST_RE.test(s)) return false;
  return true;
}

// ── validateSequenceModel — the full check on the typed object ─────────────────────────────────────

function validateSequenceModel(model) {
  const v = [];
  const kind = model.kind === 'ssd' ? 'ssd' : 'design';
  const participants = model.participants || [];
  const ids = new Set(participants.map((p) => p.id));

  // item 2: an SSD is black-box — exactly one lifeline may render as a box (Larman ch.10). Key off what
  // generateSequenceMermaid renders as a box (`role !== 'actor'`, its `kw` calc), never a bare
  // `role === 'system'`: a role:'object' (or missing role) participant still leaks a second box lifeline.
  if (kind === 'ssd') {
    const boxes = participants.filter((p) => p.role !== 'actor');
    if (boxes.length === 0) v.push({ item: 2, rule: 'SSD declares no system lifeline (role:"system")', detail: '(participants)' });
    else if (boxes.length > 1) v.push({ item: 2, rule: 'SSD has 2+ internal system objects — no longer black-box', detail: boxes.map((p) => p.id).join(', ') });
    else if (boxes[0].role !== 'system') v.push({ item: 2, rule: `SSD's sole internal lifeline must have role:"system" (got role:"${boxes[0].role || '(none)'}")`, detail: boxes[0].id });
  }

  function checkEndpoint(id, role, path) {
    if (!ids.has(id)) v.push({ item: 1, rule: `message ${role} is not a declared participant/lifeline`, detail: `${id} (${path})` });
  }

  function checkMessage(m, path) {
    checkEndpoint(m.from, 'sender', path);
    checkEndpoint(m.to, 'receiver', path);
    if (!isOperationText(m.text)) v.push({ item: 3, rule: `message does not name an operation, reads as narrated prose ("${(m.text || '').trim()}")`, detail: path });
  }

  function checkNote(n, path) {
    for (const pid of n.participants || []) {
      if (!ids.has(pid)) v.push({ item: 1, rule: 'note references an undeclared participant/lifeline', detail: `${pid} (${path})` });
    }
  }

  // item 5: a reply corresponds to an unmatched prior call between the same pair (OMG 2.5.1: a reply
  // occurs on the execution occurrence its call produced). Branches of a fragment are mutually exclusive
  // at runtime, so each branch validates against a CLONE of the pending state, never leaking into siblings
  // or back into the outer scope.
  function walk(items, pending, path) {
    (items || []).forEach((it, i) => {
      const p = `${path}[${i}]`;
      if (it.kind === 'message') {
        checkMessage(it, p);
        const type = it.type || 'sync';
        if (type === 'reply') {
          const key = `${it.to}>${it.from}`;
          const n = pending.get(key) || 0;
          if (n > 0) pending.set(key, n - 1);
          else v.push({ item: 5, rule: `return message has no matching prior call (${it.from}-->>${it.to})`, detail: p });
        } else {
          const key = `${it.from}>${it.to}`;
          pending.set(key, (pending.get(key) || 0) + 1);
        }
      } else if (it.kind === 'fragment') {
        const type = it.fragment;
        const branches = it.branches || [];
        if (!['alt', 'opt', 'loop'].includes(type)) v.push({ item: 4, rule: `unknown fragment type "${type}"`, detail: p });
        else if (type === 'alt' && branches.length < 1) v.push({ item: 4, rule: 'alt has no operand (needs >=1 branch)', detail: p });
        else if ((type === 'opt' || type === 'loop') && branches.length !== 1) v.push({ item: 4, rule: `"${type}" must have exactly one operand`, detail: p });
        branches.forEach((b, bi) => walk(b.items, new Map(pending), `${p}.branch${bi}`));
      } else if (it.kind === 'note') {
        checkNote(it, p);
      } else {
        v.push({ item: 4, rule: `unknown item kind "${it.kind}"`, detail: p });
      }
    });
  }
  walk(model.items, new Map(), 'items');

  return { pass: v.length === 0, violations: v };
}

// ── generateSequenceMermaid — correct by construction ───────────────────────────────────────────────

// message/note TEXT: a bare `;` is a mermaid statement separator (truncates the line, breaks parse); emit
// `;`->#59; and `"`->#quot; so both compile AND render. Order: `;` first, before `#quot;` adds one.
function esc(s) {
  return String(s)
    .replace(/;/g, '#59;')
    .replace(/"/g, '#quot;')
    .replace(/\n/g, '<br/>');
}

// A participant ALIAS is bare text after `as` — mermaid's sequence parser has no quoting for it and
// breaks on `[ ] ( ) { } : ;` (and literal quotes). esc() is wrong here (it keeps them); strip them and
// collapse whitespace so any model-supplied name renders instead of failing the whole diagram to parse.
function escAlias(s) {
  return String(s).replace(/["[\](){}:;]/g, ' ').replace(/\s+/g, ' ').trim();
}

function arrowSymbol(type) {
  if (type === 'reply') return '-->>';
  if (type === 'async') return '-)';
  return '->>';
}

function renderMessage(m, indent) {
  const sym = arrowSymbol(m.type || 'sync');
  const mod = m.activate ? '+' : m.deactivate ? '-' : '';
  return `${indent}${m.from}${sym}${mod}${m.to}: ${esc(m.text)}`;
}

function renderNote(n, indent) {
  const pos = n.position || 'over';
  return `${indent}Note ${pos} ${(n.participants || []).join(',')}: ${esc(n.text)}`;
}

function renderItems(items, indent) {
  const L = [];
  for (const it of items || []) {
    if (it.kind === 'message') L.push(renderMessage(it, indent));
    else if (it.kind === 'note') L.push(renderNote(it, indent));
    else if (it.kind === 'fragment') L.push(...renderFragment(it, indent));
  }
  return L;
}

function renderFragment(f, indent) {
  const L = [];
  const branches = f.branches || [];
  if (f.fragment === 'alt') {
    branches.forEach((b, i) => {
      L.push(`${indent}${i === 0 ? 'alt' : 'else'}${b.label ? ' ' + b.label : ''}`);
      L.push(...renderItems(b.items, indent + '  '));
    });
  } else {
    const b = branches[0] || { items: [] };
    L.push(`${indent}${f.fragment}${b.label ? ' ' + b.label : ''}`);
    L.push(...renderItems(b.items, indent + '  '));
  }
  L.push(`${indent}end`);
  return L;
}

function generateSequenceMermaid(model) {
  const check = validateSequenceModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a sequence diagram from an invalid model:\n${msg}`);
  }
  const L = ['sequenceDiagram'];
  if (model.autonumber !== false) L.push('  autonumber');
  for (const p of model.participants || []) {
    const kw = p.role === 'actor' ? 'actor' : 'participant';
    L.push(p.name ? `  ${kw} ${p.id} as ${escAlias(p.name)}` : `  ${kw} ${p.id}`);
  }
  L.push(...renderItems(model.items, '  '));
  return L.join('\n');
}

// ── lintSequenceMermaid — heuristic backstop for hand-authored / legacy mermaid ─────────────────────

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

// A different diagram type entirely (flowchart/stateDiagram/classDiagram/...) — not ours to judge.
function isSequenceDiagramBlock(text) {
  return /^\s*sequenceDiagram\b/m.test(text);
}

function scanDeclarations(lines) {
  const declared = new Map(); // id -> {lineIdx, isActor, name}
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(/^(participant|actor)\s+(\w+)(?:\s+as\s+(.+))?$/i);
    if (m) declared.set(m[2], { lineIdx: i, isActor: /^actor$/i.test(m[1]), name: (m[3] || '').trim().replace(/^"(.*)"$/, '$1') });
  }
  return declared;
}

// Recursive-descent parse of alt/opt/loop/else/end into a tree, so return-matching and lifeline checks
// can validate each mutually-exclusive branch against its OWN clone of state (never leaking across
// branches — the same discipline validateSequenceModel applies to the typed object).
function parseFragmentTree(lines, violations) {
  let pos = 0;
  function parseSeq() {
    const items = [];
    while (pos < lines.length) {
      const line = lines[pos].trim();
      if (/^end\b/i.test(line) || /^else\b/i.test(line)) return items;
      const fm = line.match(/^(alt|opt|loop)\b\s*(.*)$/i);
      if (fm) {
        const kind = fm[1].toLowerCase();
        const startLine = pos;
        pos++;
        const branches = [];
        let label = fm[2].trim();
        for (;;) {
          const body = parseSeq();
          if (pos >= lines.length) {
            violations.push({ item: 4, line: startLine + 1, rule: `unclosed "${kind}" fragment (missing end)` });
            branches.push({ label, items: body });
            break;
          }
          const ctrl = lines[pos].trim();
          if (/^else\b/i.test(ctrl)) {
            if (kind !== 'alt') violations.push({ item: 4, line: pos + 1, rule: `"else" used inside "${kind}" (only "alt" may branch)` });
            branches.push({ label, items: body });
            label = ctrl.replace(/^else\b/i, '').trim();
            pos++;
            continue;
          }
          branches.push({ label, items: body });
          pos++; // consume "end"
          break;
        }
        if (kind === 'alt' && branches.length < 1) violations.push({ item: 4, line: startLine + 1, rule: 'alt has no operand' });
        if ((kind === 'opt' || kind === 'loop') && branches.length !== 1) violations.push({ item: 4, line: startLine + 1, rule: `"${kind}" must have exactly one operand` });
        items.push({ t: 'frag', kind, branches });
        continue;
      }
      items.push({ t: 'line', raw: lines[pos], idx: pos });
      pos++;
    }
    return items;
  }
  const tree = parseSeq();
  if (pos < lines.length) violations.push({ item: 4, line: pos + 1, rule: `stray "${lines[pos].trim().split(/\s+/)[0]}" with no matching opening fragment` });
  return tree;
}

const MSG_LINE_RE = /^(\w+)\s*(-{1,2}[)x]|-{1,2}>>?)\s*([+-])?\s*(\w+)\s*:\s*(.*)$/;
const NOTE_LINE_RE = /^Note\s+(over|left of|right of)\s+([\w, ]+?)\s*:\s*(.*)$/i;

function walkLintTree(items, pending, declared, violations) {
  for (const node of items) {
    if (node.t === 'frag') {
      for (const b of node.branches) walkLintTree(b.items, new Map(pending), declared, violations);
      continue;
    }
    const line = node.raw.trim();
    const noteM = line.match(NOTE_LINE_RE);
    if (noteM) {
      for (const pid of noteM[2].split(',').map((s) => s.trim())) {
        if (!declared.has(pid)) violations.push({ item: 1, line: node.idx + 1, rule: `note references an undeclared lifeline "${pid}"` });
      }
      continue;
    }
    const m = line.match(MSG_LINE_RE);
    if (!m) continue; // participant/actor/autonumber/other directive — not a message
    const [, from, arrow, , to, text] = m;
    for (const [role, id] of [['sender', from], ['receiver', to]]) {
      const d = declared.get(id);
      if (!d) violations.push({ item: 1, line: node.idx + 1, rule: `message ${role} "${id}" is not a declared lifeline` });
      else if (d.lineIdx > node.idx) violations.push({ item: 6, line: node.idx + 1, rule: `lifeline "${id}" used before its declaration (line ${d.lineIdx + 1})` });
    }
    if (!isOperationText(text)) violations.push({ item: 3, line: node.idx + 1, rule: `message does not name an operation, reads as narrated prose ("${text.trim()}")` });
    const isReply = arrow.startsWith('--');
    if (isReply) {
      const key = `${to}>${from}`;
      const n = pending.get(key) || 0;
      if (n > 0) pending.set(key, n - 1);
      else violations.push({ item: 5, line: node.idx + 1, rule: `return message has no matching prior call (${from}${arrow}${to})` });
    } else {
      const key = `${from}>${to}`;
      pending.set(key, (pending.get(key) || 0) + 1);
    }
  }
}

// item 2 for the lint: Larman's own anonymous-object notation names the system lifeline `:System` — a
// block is "SSD-flavored" iff some declared lifeline's display name starts with `:`. Inside such a block,
// 2+ `participant`-keyword (non-actor) lifelines means 2+ internal objects — no longer black-box.
function checkSsdFlavor(declared, violations) {
  // the display name may be `":System"` (quoted) followed by unquoted trailing prose — so an optional
  // leading quote is allowed before the `:` that marks Larman's anonymous system-object notation.
  const flavored = [...declared.values()].some((d) => /^"?:/.test(d.name));
  if (!flavored) return;
  const systemish = [...declared.entries()].filter(([, d]) => !d.isActor);
  if (systemish.length > 1) violations.push({ item: 2, line: systemish[systemish.length - 1][1].lineIdx + 1, rule: `SSD has 2+ internal system objects (${systemish.map(([id]) => id).join(', ')}) — no longer black-box` });
}

function lintSequenceBlock(text) {
  const violations = [];
  const lines = text.split(/\r?\n/);
  const declared = scanDeclarations(lines);
  checkSsdFlavor(declared, violations);
  const tree = parseFragmentTree(lines, violations);
  walkLintTree(tree, new Map(), declared, violations);
  return violations;
}

function lintSequenceMermaid(md) {
  const blocks = extractBlocks(md);
  const out = [];
  let skipped = 0;
  for (const b of blocks) {
    if (!isSequenceDiagramBlock(b.text)) { skipped++; continue; }
    for (const x of lintSequenceBlock(b.text)) out.push({ ...x, blockStart: b.start, absLine: b.start + x.line - 1 });
  }
  return { pass: out.length === 0, violations: out, blocks: blocks.length, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {
    const model = JSON.parse(fs.readFileSync(arg, 'utf8'));
    process.stdout.write(generateSequenceMermaid(model) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {
    const model = JSON.parse(fs.readFileSync(arg, 'utf8'));
    const r = validateSequenceModel(model);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {
    const md = fs.readFileSync(arg, 'utf8');
    const r = lintSequenceMermaid(md);
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: sequence.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateSequenceMermaid, validateSequenceModel, lintSequenceMermaid, lintSequenceBlock };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
