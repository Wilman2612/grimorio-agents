#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/activity.mjs — correct-by-construction generator + semantic validator for a UML ACTIVITY
 * diagram (mermaid `flowchart`). Fourth entry in the diagram-kit series, same shape as
 * statemachine.mjs (CLOSEST — same reachability/dead-end/initial logic, INVERTED action-vs-situation
 * rule) and usecase.mjs (the flowchart+subgraph rendering pattern). Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/activity-diagram.md (OMG UML 2.5.1 via
 * uml-diagrams.org, Ambler/agilemodeling.com, Fowler's bliki) — Section D is this file's spec.
 *
 * MODEL: { name, partitions:[{id,name}]?, nodes:[{id,name,kind?,partition?}], initial:<id>,
 *          finals:[<id>...], edges:[{from,to,guard?}] }  (kind ∈ action|decision|merge|fork|join,
 *          default action). `initial` and each `finals` entry are their OWN control markers — NOT
 *          entries in `nodes` — exactly like a state machine's `[*]`, because a flowchart has no
 *          native pseudostate and needs its own dedicated initial/final node shapes (A.1).
 *
 * checkDecisionGuards/checkMergeShape/checkForkJoinBalance/checkDeadEndsAndReachability are pure over
 * a generic {out, kindOf, inDeg} graph — built once from the typed MODEL for validate-model, and AGAIN
 * from regex-parsed legacy mermaid for lint, so the one rule implementation backs both entry points.
 */
import fs from 'node:fs';

// An action node names an ACTIVE VERB PHRASE — the INVERSE of statemachine.mjs's situation rule
// (reference D4): a state is a situation ("Settling"); an activity node is the verb ("Settle the
// match"). Here the verb-first tell is REQUIRED, and a leading gerund/status word or a nominalized
// noun ("Authorization") is the smell — deliberately permissive, gross tells only.
const STATUS_NOUN_RE = /^(pending|idle|draft|active|done|ready|open|closed|failed|blocked|approved|rejected|awaiting|waiting|settled|complete|completed|in[- ]progress)\b/i;
const NOMINALIZED_NOUN_RE = /^\w+(tion|sion|ment|ness|ity|ance|ence)\b/i;
const isActionName = (n) => {
  const t = String(n || '').trim();
  if (!t) return false;
  if (/^\w+ing\b/i.test(t)) return false; // "Awaiting settle" — a gerund/situation, not an action
  if (STATUS_NOUN_RE.test(t)) return false; // "Pending approval" — a status/situation noun phrase
  if (NOMINALIZED_NOUN_RE.test(t)) return false; // "Authorization" — a nominalized noun, not a verb
  return /\s/.test(t); // a single bare word ("Draft") is a status noun, not a verb PHRASE
};

// ── generic graph rule checks — shared by validateActivityModel (typed) and lintActivityBlock (text) ─

function reachableSet(startId, out) {
  const seen = new Set([startId]);
  const q = [startId];
  while (q.length) {
    const cur = q.shift();
    for (const e of out.get(cur) || []) if (!seen.has(e.to)) { seen.add(e.to); q.push(e.to); }
  }
  return seen;
}

function forkConvergence(forkId, out) {
  const branches = (out.get(forkId) || []).map((e) => reachableSet(e.to, out));
  if (branches.length < 2) return null;
  let common = branches[0];
  for (const b of branches.slice(1)) common = new Set([...common].filter((x) => b.has(x)));
  return { branchCount: branches.length, common };
}

function checkDecisionGuards(out, kindOf) {
  const v = [];
  for (const [id, kind] of kindOf) {
    if (kind !== 'decision') continue;
    const edges = out.get(id) || [];
    const missing = edges.filter((e) => !(e.guard || '').trim());
    if (missing.length) v.push({ item: 5, rule: 'decision node has an unguarded outgoing edge', detail: id });
    const elseCount = edges.filter((e) => /^\s*else\s*$/i.test(e.guard || '')).length;
    if (elseCount >= 2)
      v.push({ item: 5, rule: 'decision node has more than one [else] outgoing edge (at most one allowed, Ambler)', detail: id });
  }
  return v;
}

function checkMergeShape(out, kindOf, inDeg) {
  const v = [];
  for (const [id, kind] of kindOf) {
    if (kind !== 'merge') continue;
    if ((inDeg.get(id) || 0) < 2) v.push({ item: 6, rule: 'merge node has fewer than 2 incoming edges', detail: id });
    if ((out.get(id) || []).length !== 1) v.push({ item: 6, rule: 'merge node must have exactly 1 outgoing edge', detail: id });
  }
  return v;
}

function checkForkJoinBalance(out, kindOf, inDeg) {
  const v = [];
  const matchedJoins = new Set();
  for (const [id, kind] of kindOf) {
    if (kind !== 'fork') continue;
    const outs = out.get(id) || [];
    if (outs.length < 2) { v.push({ item: 7, rule: 'fork has fewer than 2 outgoing branches', detail: id }); continue; }
    const conv = forkConvergence(id, out);
    const joinCandidate = conv && [...conv.common].find((n) => kindOf.get(n) === 'join');
    if (!joinCandidate) { v.push({ item: 7, rule: 'fork with no matching join (unbalanced fork/join — "Miracle" thread)', detail: id }); continue; }
    if ((inDeg.get(joinCandidate) || 0) !== conv.branchCount)
      v.push({ item: 7, rule: 'fork/join thread-count mismatch (unbalanced fork/join)', detail: `${id}→${joinCandidate}` });
    matchedJoins.add(joinCandidate);
  }
  for (const [id, kind] of kindOf) {
    if (kind === 'join' && !matchedJoins.has(id))
      v.push({ item: 7, rule: 'join with nothing forked (unbalanced fork/join)', detail: id });
  }
  return v;
}

function checkDeadEndsAndReachability(initial, out, ids, finals) {
  const v = [];
  for (const id of ids) {
    if (!finals.has(id) && (out.get(id) || []).length === 0)
      v.push({ item: 8, rule: 'node is a dead end ("Black Hole" activity — no outgoing edge, Ambler)', detail: id });
  }
  const seen = reachableSet(initial, out);
  for (const id of ids) if (!seen.has(id)) v.push({ item: 9, rule: 'node UNREACHABLE from the initial', detail: id });
  for (const f of finals) if (!seen.has(f)) v.push({ item: 3, rule: 'declared activity-final is UNREACHABLE from the initial', detail: f });
  return v;
}

// ── validateActivityModel — the full check on the typed object ─────────────────────────────────────

function buildGraph(model) {
  const ids = new Set((model.nodes || []).map((n) => n.id));
  const kindOf = new Map((model.nodes || []).map((n) => [n.id, n.kind || 'action']));
  const out = new Map([...ids, model.initial].filter(Boolean).map((id) => [id, []]));
  for (const e of model.edges || []) if (out.has(e.from)) out.get(e.from).push(e);
  const inDeg = new Map();
  for (const e of model.edges || []) inDeg.set(e.to, (inDeg.get(e.to) || 0) + 1);
  return { ids, kindOf, out, inDeg };
}

function checkIdIntegrity(model, ids, finals) {
  const v = [];
  if (model.initial && ids.has(model.initial)) v.push({ item: 1, rule: 'the initial id collides with a node id — initial is its own control marker', detail: model.initial });
  for (const f of finals) if (ids.has(f)) v.push({ item: 1, rule: 'a final id collides with a node id — finals are their own control markers', detail: f });
  for (const e of model.edges || []) {
    if (e.from !== model.initial && !ids.has(e.from)) v.push({ item: 1, rule: 'edge from unknown node', detail: `${e.from}→${e.to}` });
    if (!finals.has(e.to) && !ids.has(e.to)) v.push({ item: 1, rule: 'edge to unknown node', detail: `${e.from}→${e.to}` });
  }
  return v;
}

function validateActivityModel(model) {
  const finals = new Set(model.finals || []);
  const { ids, kindOf, out, inDeg } = buildGraph(model);
  const v = [...checkIdIntegrity(model, ids, finals)];

  for (const n of model.nodes || []) {
    if ((n.kind || 'action') === 'action' && !isActionName(n.name))
      v.push({ item: 4, rule: 'action node does not name a VERB PHRASE (looks like a situation/noun)', detail: n.name });
  }
  if (!model.initial) v.push({ item: 2, rule: 'no initial node declared', detail: '(model.initial)' });
  if (!finals.size) v.push({ item: 3, rule: 'no activity-final declared', detail: '(model.finals)' });

  v.push(...checkDecisionGuards(out, kindOf));
  v.push(...checkMergeShape(out, kindOf, inDeg));
  v.push(...checkForkJoinBalance(out, kindOf, inDeg));
  if (model.initial) v.push(...checkDeadEndsAndReachability(model.initial, out, ids, finals));
  v.push(...checkPartitions(model));

  const warnings = [];
  for (const [id, kind] of kindOf) {
    if (kind !== 'decision') continue;
    const hasElse = (out.get(id) || []).some((e) => /^\s*else\s*$/i.test(e.guard || ''));
    if (!hasElse) warnings.push({ rule: 'decision has no [else] branch — verify guards are complete (Ambler)', detail: id });
  }
  return { pass: v.length === 0, violations: v, warnings };
}

function checkPartitions(model) {
  const v = [];
  if (!(model.partitions || []).length) return v;
  const pids = new Set(model.partitions.map((p) => p.id));
  for (const n of model.nodes || []) {
    if ((n.kind || 'action') !== 'action') continue; // A.7/D.10/A.8 rule 10 scopes this to actions only
    if (!n.partition) v.push({ item: 10, rule: 'action has no partition (partitions are declared on this model)', detail: n.id });
    else if (!pids.has(n.partition)) v.push({ item: 10, rule: 'action assigned to unknown partition', detail: `${n.id}→${n.partition}` });
  }
  return v;
}

// ── generateActivityMermaid — correct by construction ───────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
}

const SHAPE = {
  decision: (id, n) => `${id}{"${esc(n)}"}`,
  merge: (id, n) => `${id}{"${esc(n)}"}`,
  fork: (id, n) => `${id}[["${esc(n || 'fork')}"]]`,
  join: (id, n) => `${id}[["${esc(n || 'join')}"]]`,
  action: (id, n) => `${id}("${esc(n)}")`,
};

function nodeLine(n) {
  return `  ${SHAPE[n.kind || 'action'](n.id, n.name)}`;
}

function edgeLine(e) {
  const g = (e.guard || '').trim();
  const arrow = g ? `-->|"[${esc(g)}]"|` : '-->';
  return `  ${e.from} ${arrow} ${e.to}`;
}

function generateActivityMermaid(model, { direction = 'TD' } = {}) {
  const check = validateActivityModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate an activity diagram from an invalid model:\n${msg}`);
  }
  const L = [`flowchart ${direction}`, `  ${model.initial}(("&#9679;"))`];
  const inPartition = new Set();
  for (const p of model.partitions || []) {
    L.push(`  subgraph ${p.id}["${esc(p.name)}"]`, '    direction TB');
    for (const n of (model.nodes || []).filter((x) => x.partition === p.id)) { L.push(nodeLine(n)); inPartition.add(n.id); }
    L.push('  end');
  }
  for (const n of model.nodes || []) if (!inPartition.has(n.id)) L.push(nodeLine(n));
  for (const f of model.finals || []) L.push(`  ${f}(((&#9679;)))`);
  for (const e of model.edges || []) L.push(edgeLine(e));
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

// A `flowchart` block that is genuinely OURS — not a stateDiagram-v2 (a different type entirely, header
// check) and not a sibling flowchart-based kit's own type (use-case's «include»/«extend»/Subject-boundary
// convention, misuse-case's «threatens»/«mitigates»/«detects»).
function isActivityBlock(text) {
  if (!/^\s*flowchart\b/m.test(text)) return false;
  if (/[«»]|&laquo;|&raquo;/.test(text) && /\b(include|extend|threatens|mitigates|detects|generalize)\b/i.test(text)) return false;
  if (/subgraph\s+\w+\["?Subject:/i.test(text)) return false;
  return true;
}

// Hand-authored mermaid chains a declaration into its own edge on ONE line ("START([\"x\"]) --> EST[..]",
// the real style the design-doc instances use), not the generator's one-per-line convention. So parsing
// scans the WHOLE block text with unanchored per-shape tokens instead of per-line anchors — a declaration
// is found wherever it sits, standalone or fused to an edge.
const SHAPE_TOKEN_SRC = '(?:\\(\\(\\(.*?\\)\\)\\)|\\(\\(.*?\\)\\)|\\[\\[.*?\\]\\]|\\{.*?\\}|\\(\\[.*?\\]\\)|\\(.*?\\)|\\[.*?\\])';
const DECL_RE = new RegExp(`(\\w+)\\s*(${SHAPE_TOKEN_SRC})`, 'g');

// Shape TOKEN → kind, by bracket delimiters (uml-diagrams.org's shape vocabulary, A.1): `(((x)))` final,
// `((x))` initial, `[[x]]` fork/join bar, `{x}` decision/merge diamond, `([x])` a stadium terminator
// (real-world convention for BOTH start and early exits, resolved by degree — resolveAmbiguousKinds). A
// plain `(x)` or bare `[x]` are both 'action' — lint stays lenient on shape, still checks the name (D4).
function classifyShapeToken(tok) {
  if (/^\(\(\(.*\)\)\)$/.test(tok)) return 'final';
  if (/^\(\(.*\)\)$/.test(tok)) return 'initial';
  if (/^\[\[.*\]\]$/.test(tok)) return 'bar';
  if (/^\{.*\}$/.test(tok)) return 'diamond';
  if (/^\(\[.*\]\)$/.test(tok)) return 'terminal';
  if (/^\(.*\)$/.test(tok)) return 'action';
  if (/^\[.*\]$/.test(tok)) return 'action';
  return null;
}

function shapeInner(tok, kind) {
  const strip = { final: 3, initial: 2, bar: 2, terminal: 2 }[kind] ?? 1;
  return tok.slice(strip, -strip).replace(/^"|"$/g, '').trim();
}

function parseNodeShapes(text) {
  const kindOf = new Map(), names = new Map();
  for (const m of text.matchAll(DECL_RE)) {
    const kind = classifyShapeToken(m[2]);
    if (!kind) continue;
    kindOf.set(m[1], kind);
    names.set(m[1], shapeInner(m[2], kind));
  }
  return { kindOf, names };
}

// Edge extraction, same whole-text scan. `arrowTok` carries mermaid's THREE label spellings: a plain
// `-->`, a solid embedded label `-- text -->`, or a dashed embedded label `-. text .->`; a pipe label
// `-->|"text"|` is captured separately. Only a `[bracketed]` label counts as a GUARD (D5/Ambler) — plain
// text ("yes"/"no"/"THROWS") is a real, common gap this surfaces, not a parser miss.
const EDGE_RE = new RegExp(`(\\w+)(?:${SHAPE_TOKEN_SRC})?\\s*(-->|--.*?-->|-\\..*?\\.->)\\s*(?:\\|"?(.*?)"?\\|\\s*)?(\\w+)`, 'g');

function extractEmbeddedLabel(arrowTok) {
  const m = arrowTok.match(/^--\s*(.*?)\s*-->$/) || arrowTok.match(/^-\.\s*(.*?)\s*\.->$/);
  return m ? m[1] : '';
}

function parseEdges(text) {
  const edges = [], out = new Map(), inDeg = new Map();
  for (const m of text.matchAll(EDGE_RE)) {
    const [, from, arrowTok, pipeLabel, to] = m;
    const rawLabel = pipeLabel || extractEmbeddedLabel(arrowTok);
    const guardMatch = rawLabel.match(/\[(.*)\]/);
    const e = { from, to, guard: guardMatch ? guardMatch[1] : undefined };
    edges.push(e);
    if (!out.has(from)) out.set(from, []);
    out.get(from).push(e);
    inDeg.set(to, (inDeg.get(to) || 0) + 1);
  }
  return { edges, out, inDeg };
}

// Diamond/bar/stadium are ambiguous shapes (uml-diagrams.org: decision and merge share ONE glyph, so
// do fork and join) — resolved by DEGREE, same as the real notation is read by a human.
function resolveAmbiguousKinds(shapeKind, out, inDeg) {
  const kindOf = new Map();
  for (const [id, k] of shapeKind) {
    if (k === 'diamond') kindOf.set(id, (out.get(id) || []).length >= 2 ? 'decision' : 'merge');
    else if (k === 'bar') kindOf.set(id, (out.get(id) || []).length >= 2 ? 'fork' : 'join');
    else if (k === 'terminal') kindOf.set(id, (inDeg.get(id) || 0) === 0 ? 'initial' : 'final');
    else kindOf.set(id, k);
  }
  return kindOf;
}

// An edge LABEL's quoted text ("yes (would cross)") can end in a parenthetical DECL_RE misreads as a
// fused `word(shape)` declaration — a real tell (`-- "yes (would cross)" -->` produced a phantom node
// "yes" against instance-04). Blank ONLY quoted spans in a label position before the declaration scan;
// parseEdges still runs on the untouched text — it needs that quoted text for guard extraction.
function blankEdgeLabelQuotes(text) {
  const blank = (m, a, q, b) => a + ' '.repeat(q.length + 2) + b;
  return text
    .replace(/(--\s*)"([^"]*)"(\s*-->)/g, blank)
    .replace(/(\|)"([^"]*)"(\|)/g, blank)
    .replace(/(-\.\s*)"([^"]*)"(\s*\.->)/g, blank);
}

function lintActivityBlock(text) {
  // `subgraph ID["Partition name"]` (D10's own partition boundary) LOOKS like an id+rectangle-shape
  // declaration to the unanchored scan above — strip it first so a partition title is never mistaken
  // for an action node.
  const body = text.split(/\r?\n/).filter((l) => !/^\s*subgraph\b/i.test(l)).join('\n');
  const { kindOf: shapeKind, names } = parseNodeShapes(blankEdgeLabelQuotes(body));
  const { out, inDeg } = parseEdges(body);
  const kindOf = resolveAmbiguousKinds(shapeKind, out, inDeg);
  const initials = [...kindOf].filter(([, k]) => k === 'initial').map(([id]) => id);
  const finals = new Set([...kindOf].filter(([, k]) => k === 'final').map(([id]) => id));

  const v = [];
  if (initials.length === 0) v.push({ item: 2, line: 1, rule: 'no initial node found in the block' });
  if (initials.length > 1) v.push({ item: 2, line: 1, rule: `${initials.length} initial nodes found (at most one, this kit's scope)` });
  if (finals.size === 0) v.push({ item: 3, line: 1, rule: 'no activity-final node found in the block' });
  for (const [id, k] of kindOf) if (k === 'action' && !isActionName(names.get(id)))
    v.push({ item: 4, line: 1, rule: `action node does not name a VERB PHRASE ("${names.get(id)}")` });
  v.push(...checkDecisionGuards(out, kindOf).map((x) => ({ ...x, line: 1 })));
  v.push(...checkMergeShape(out, kindOf, inDeg).map((x) => ({ ...x, line: 1 })));
  v.push(...checkForkJoinBalance(out, kindOf, inDeg).map((x) => ({ ...x, line: 1 })));
  if (initials.length === 1) v.push(...checkDeadEndsAndReachability(initials[0], out, new Set(kindOf.keys()), finals).map((x) => ({ ...x, line: 1 })));
  return v;
}

function lintActivityMermaid(md) {
  const out = [];
  let skipped = 0;
  for (const b of extractBlocks(md)) {
    if (!isActivityBlock(b.text)) { skipped++; continue; }
    for (const x of lintActivityBlock(b.text)) out.push({ ...x, absLine: b.start + x.line - 1 });
  }
  return { pass: out.length === 0, violations: out, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {
    process.stdout.write(generateActivityMermaid(JSON.parse(fs.readFileSync(arg, 'utf8'))) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {
    const r = validateActivityModel(JSON.parse(fs.readFileSync(arg, 'utf8')));
    for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {
    const r = lintActivityMermaid(fs.readFileSync(arg, 'utf8'));
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: activity.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateActivityMermaid, validateActivityModel, lintActivityMermaid, isActionName };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
