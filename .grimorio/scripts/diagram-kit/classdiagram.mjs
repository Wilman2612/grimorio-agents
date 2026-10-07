#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/classdiagram.mjs — correct-by-construction generator + semantic validator for a UML CLASS
 * diagram (mermaid `classDiagram`). Third entry in the diagram-kit series, same shape as usecase.mjs /
 * statemachine.mjs: generate() emits a diagram that cannot be a bastardization; validate-model scores the
 * typed object against the reference's hard rules; lint backstops legacy mermaid. Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/class-diagram.md (Larman ch.9 domain model,
 * Fowler UML Distilled ch.3 + the three perspectives, OMG UML 2.5.1 classifier/association chapter).
 * Supports BOTH the domain/conceptual perspective (nouns, associations, multiplicity, no operations) and
 * the design perspective (attributes/operations/visibility) via model.perspective.
 *
 * MODEL: { name, perspective?: 'conceptual'|'design' (default 'design'),
 *   classes:[{id, name?, stereotype?, attributes?:[{name,type?,visibility?}],
 *             operations?:[{name,params?,returnType?,visibility?}]}],
 *   relationships:[{kind: association|aggregation|composition|generalization|dependency,
 *                   from, to, fromMult?, toMult?, label?}] }
 * For generalization: `from` = child (specific), `to` = parent (general) — mirrors mermaid's
 * `Parent <|-- Child` (arrowhead points to the general classifier); the generator swaps the order itself.
 * For aggregation/composition: `from` = whole/container, `to` = part (diamond sits at `from`).
 * For dependency: `from` = client, `to` = supplier (arrow points from client to supplier).
 */
import fs from 'node:fs';

// A class name is a NOUN (a classifier), never a verb-phrase — reference A.3 rule 2. Heuristic:
// flags a verb-first COMPOUND (the function-name tell: "mintRunCapability", "ProcessPayment"), but
// exempts names ending in a strong noun-forming suffix (Request/Response/Handler/Schema/Claim/Result)
// so ordinary DTO/role names like SettleRequestSchema are never mistaken for verb phrases.
const ACTION_VERBS = ['mint', 'require', 'process', 'create', 'update', 'delete', 'settle', 'verify', 'compute', 'fetch', 'send', 'issue', 'generate', 'validate', 'authorize', 'authorise', 'clamp', 'debit', 'credit', 'produce', 'sign', 'bind', 'admit', 'reclaim', 'reverse', 'meter', 'spend', 'refuse', 'manage', 'handle', 'perform', 'execute', 'build', 'construct', 'check', 'write', 'calculate', 'register', 'assign', 'notify', 'dispatch', 'schedule', 'resolve', 'apply', 'enforce', 'grant', 'revoke', 'unlock', 'remove', 'insert', 'extract', 'parse', 'render', 'emit', 'persist', 'cache', 'invoke', 'trigger'];
const NOUN_FORMING_SUFFIXES = ['Request', 'Response', 'Handler', 'Schema', 'Claim', 'Result'];
function startsWithActionVerbCompound(name) {
  const t = String(name || '').trim();
  if (!t) return false;
  if (NOUN_FORMING_SUFFIXES.some((suf) => t.endsWith(suf))) return false; // strong noun-forming suffix wins
  const lower = t.toLowerCase();
  for (const verb of ACTION_VERBS) {
    if (!lower.startsWith(verb)) continue;
    const rest = t.slice(verb.length);
    if (rest === '') continue; // bare verb-only name — too ambiguous alone, not a tell
    if (/^[A-Z]/.test(rest)) return true; // camelCase compound
    if (/^[\s_-]\S/.test(rest)) return true; // "Settle Match" / "settle_match" style compound
  }
  return false;
}
const isNounClassName = (n) => !startsWithActionVerbCompound(n);

// A relationship's label semantics vs its arrow kind (reference A.3 rule 6 / C.2). Generalization must
// read IS-A; association/aggregation/composition/dependency must never read IS-A.
const ISA_LABEL_RE = /\b(is a kind of|is a|specializes|specialises|extends|subtype of|subclass of)\b/i;
const ACTION_LABEL_RE = /\b(uses|calls|invokes|reads|writes|binds|verifies|produces|signs|consumes|creates|updates|debits|credits|owns|contains|records|reports|settles|mints|sizes)\b/i;

const MULT_RE = /^(\d+|\*)(\.\.(\d+|\*))?$/;
function isWellFormedMultiplicity(m) {
  const t = String(m ?? '').trim();
  if (!t) return true; // absent multiplicity is legal (rule 4 only judges a PRESENT one)
  if (!MULT_RE.test(t)) return false;
  const parts = t.split('..');
  if (parts.length === 2 && parts[0] !== '*' && parts[1] !== '*') {
    if (Number(parts[0]) > Number(parts[1])) return false; // n..m needs n <= m
  }
  return true;
}

const RELKINDS = new Set(['association', 'aggregation', 'composition', 'generalization', 'dependency']);

// Item 5, shared by validateModel and lint: generalization must form a DAG. `parentsOf` maps
// childId -> [parentId...]; returns [{ path }] one entry per distinct cycle found (path = the cycle's
// own node sequence, for the caller to render into its own violation shape).
function detectInheritanceCycles(parentsOf, allIds) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  const reported = new Set();
  const found = [];
  const dfs = (id, path) => {
    color.set(id, GRAY);
    for (const parent of parentsOf.get(id) || []) {
      const st = color.get(parent) ?? WHITE;
      if (st === GRAY) {
        const key = [...path, parent].sort().join(',');
        if (!reported.has(key)) { reported.add(key); found.push({ path: [...path, id, parent] }); }
      } else if (st === WHITE) dfs(parent, [...path, id]);
    }
    color.set(id, BLACK);
  };
  for (const id of allIds) if ((color.get(id) ?? WHITE) === WHITE) dfs(id, []);
  return found;
}

// Item 6, shared: does this relationship's own label contradict its kind? Returns a message or null.
function labelKindMismatch(kind, label) {
  if (!label) return null;
  const isaSaid = ISA_LABEL_RE.test(label);
  const actionSaid = ACTION_LABEL_RE.test(label);
  if (kind === 'generalization') {
    if (actionSaid && !isaSaid) return `generalization arrow used for a non-IS-A relationship (label reads as an action: "${label}")`;
  } else if (isaSaid && !actionSaid) {
    return `${kind} label asserts IS-A — use generalization instead ("${label}")`;
  }
  return null;
}

function validateClassDiagramModel(model) {
  const v = [];
  const classes = model.classes || [];
  const ids = new Set();
  for (const c of classes) {
    if (ids.has(c.id)) v.push({ item: 1, rule: 'class id declared more than once', detail: c.id });
    ids.add(c.id);
    if (!isNounClassName(c.name || c.id))
      v.push({ item: 2, rule: 'class name is a VERB PHRASE, not a noun classifier', detail: c.name || c.id });
  }
  const rels = model.relationships || [];
  const parentsOf = new Map(); // childId -> [parentId...], for the cycle check below
  for (const r of rels) {
    if (!RELKINDS.has(r.kind)) v.push({ item: 6, rule: 'relationship kind is not one of the five legal kinds', detail: r.kind });
    if (!ids.has(r.from)) v.push({ item: 3, rule: 'relationship endpoint references an undeclared class (from)', detail: `${r.from}→${r.to}` });
    if (!ids.has(r.to)) v.push({ item: 3, rule: 'relationship endpoint references an undeclared class (to)', detail: `${r.from}→${r.to}` });
    if (r.kind === 'generalization') {
      if (r.fromMult || r.toMult) v.push({ item: 6, rule: 'generalization carries a multiplicity (multiplicity applies only to association/aggregation/composition)', detail: `${r.from}→${r.to}` });
      if (!parentsOf.has(r.from)) parentsOf.set(r.from, []);
      parentsOf.get(r.from).push(r.to);
    }
    const mismatch = labelKindMismatch(r.kind, r.label);
    if (mismatch) v.push({ item: 6, rule: mismatch, detail: `${r.from}→${r.to}` });
    if (r.kind === 'association' || r.kind === 'aggregation' || r.kind === 'composition' || r.kind === 'dependency') {
      if (!isWellFormedMultiplicity(r.fromMult)) v.push({ item: 4, rule: 'malformed multiplicity (from)', detail: `${r.from} "${r.fromMult}"` });
      if (!isWellFormedMultiplicity(r.toMult)) v.push({ item: 4, rule: 'malformed multiplicity (to)', detail: `${r.to} "${r.toMult}"` });
    }
  }
  for (const cyc of detectInheritanceCycles(parentsOf, ids))
    v.push({ item: 5, rule: 'inheritance CYCLE in generalization graph', detail: cyc.path.join(' -> ') });

  const warnings = [];
  // Item 7 (domain perspective): a conceptual class carries operations — WARN, not a hard fail (Larman/
  // Fowler treat this as a modeling guideline, not an OMG structural constraint).
  if (model.perspective === 'conceptual') {
    for (const c of classes) {
      if ((c.operations || []).length > 0)
        warnings.push({ rule: 'conceptual class carries operations — the domain perspective names no methods', detail: c.id });
    }
  }
  return { pass: v.length === 0, violations: v, warnings };
}

// ── generate — correct by construction ──────────────────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/"/g, '&quot;');
}

const ARROW = { association: '-->', aggregation: 'o--', composition: '*--', dependency: '..>' };

function memberLine(prefix, m) {
  const vis = m.visibility || '+';
  if (prefix === 'op') {
    const params = (m.params || []).join(', ');
    const ret = m.returnType ? ` ${m.returnType}` : '';
    return `    ${vis}${m.name}(${params})${ret}`;
  }
  const type = m.type ? ` : ${m.type}` : '';
  return `    ${vis}${m.name}${type}`;
}

function classBlock(c) {
  const hasBody = c.stereotype || (c.attributes || []).length || (c.operations || []).length;
  const head = c.name && c.name !== c.id ? `class ${c.id}["${esc(c.name)}"]` : `class ${c.id}`;
  if (!hasBody) return `  ${head}`;
  const L = [`  ${head} {`];
  if (c.stereotype) L.push(`    <<${c.stereotype}>>`);
  for (const a of c.attributes || []) L.push(memberLine('attr', a));
  for (const o of c.operations || []) L.push(memberLine('op', o));
  L.push('  }');
  return L.join('\n');
}

function relLine(r) {
  const fm = r.fromMult ? `"${r.fromMult}" ` : '';
  const tm = r.toMult ? `"${r.toMult}" ` : '';
  const lab = r.label ? ` : ${r.label}` : '';
  if (r.kind === 'generalization') return `  ${r.to} <|-- ${r.from}${lab}`;
  return `  ${r.from} ${fm}${ARROW[r.kind]} ${tm}${r.to}${lab}`;
}

function generateClassDiagramMermaid(model) {
  const check = validateClassDiagramModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a class diagram from an invalid model:\n${msg}`);
  }
  const L = ['classDiagram'];
  for (const c of model.classes || []) L.push(classBlock(c));
  for (const r of model.relationships || []) L.push(relLine(r));
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

function isClassDiagramBlock(text) {
  return /^\s*classDiagram\b/m.test(text);
}

// Longest/most-specific token first: `<|--` and `..>` and `*--`/`o--`/`-->` before the plain `--`.
const REL_LINE_RE = /^(\w+)\s*(?:"([^"]*)")?\s*(<\|--|\.\.>|\*--|o--|-->|--)\s*(?:"([^"]*)")?\s*(\w+)\s*(?::\s*(.*))?$/;
const CLASS_LINE_RE = /^class\s+(\w+)(?:\["([^"]*)"\])?\s*\{?\s*$/;
const ATTR_LINE_RE = /^[+\-#~]?(\w+)\s*:\s*(.+)$/;

function lintClassDiagramBlock(text) {
  const v = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const d = lines[i].trim().match(CLASS_LINE_RE);
    if (!d) continue;
    const dispName = d[2] || d[1];
    if (!isNounClassName(dispName))
      v.push({ item: 2, line: i + 1, rule: `class name is a VERB PHRASE, not a noun classifier ("${dispName}")` });
  }
  const parentsOf = new Map();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === '}' || line.startsWith('<<') || ATTR_LINE_RE.test(line) || CLASS_LINE_RE.test(line)) continue;
    const m = line.match(REL_LINE_RE);
    if (!m) continue;
    const [, left, leftMult, arrow, rightMult, right, label] = m;
    if (leftMult && !isWellFormedMultiplicity(leftMult)) v.push({ item: 4, line: i + 1, rule: `malformed multiplicity "${leftMult}"` });
    if (rightMult && !isWellFormedMultiplicity(rightMult)) v.push({ item: 4, line: i + 1, rule: `malformed multiplicity "${rightMult}"` });
    const kind = arrow === '<|--' ? 'generalization' : arrow === '*--' ? 'composition' : arrow === 'o--' ? 'aggregation' : arrow === '..>' ? 'dependency' : 'association';
    if (kind === 'generalization') {
      // Parent <|-- Child : arrowhead points to the general classifier (left = parent, right = child).
      if (!parentsOf.has(right)) parentsOf.set(right, []);
      parentsOf.get(right).push(left);
      if (leftMult || rightMult) v.push({ item: 6, line: i + 1, rule: 'generalization carries a multiplicity (applies only to association/aggregation/composition)' });
    }
    const mismatch = labelKindMismatch(kind, label);
    if (mismatch) v.push({ item: 6, line: i + 1, rule: mismatch });
  }
  // Item 5: inheritance cycle over the block's own generalization edges (any referenced id counts —
  // mermaid auto-declares nodes, so a text-level cycle check does not require an explicit `class` line).
  const allGenIds = new Set([...parentsOf.keys(), ...[...parentsOf.values()].flat()]);
  for (const cyc of detectInheritanceCycles(parentsOf, allGenIds))
    v.push({ item: 5, line: 1, rule: `inheritance CYCLE in generalization graph (${cyc.path.join(' -> ')})` });
  return v;
}

function lintClassDiagramMermaid(md) {
  const out = [];
  let skipped = 0;
  for (const b of extractBlocks(md)) {
    if (!isClassDiagramBlock(b.text)) { skipped++; continue; }
    for (const x of lintClassDiagramBlock(b.text)) out.push({ ...x, absLine: b.start + x.line - 1 });
  }
  return { pass: out.length === 0, violations: out, skipped };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') {
    process.stdout.write(generateClassDiagramMermaid(JSON.parse(fs.readFileSync(arg, 'utf8'))) + '\n');
    return 0;
  }
  if (cmd === 'validate-model') {
    const r = validateClassDiagramModel(JSON.parse(fs.readFileSync(arg, 'utf8')));
    for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
    for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
    console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  if (cmd === 'lint') {
    const r = lintClassDiagramMermaid(fs.readFileSync(arg, 'utf8'));
    for (const x of r.violations) console.log(`FAIL  ${arg}:${x.absLine}  item ${x.item}  ${x.rule}`);
    console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
    return r.pass ? 0 : 1;
  }
  console.error('usage: classdiagram.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { generateClassDiagramMermaid, validateClassDiagramModel, lintClassDiagramMermaid };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
