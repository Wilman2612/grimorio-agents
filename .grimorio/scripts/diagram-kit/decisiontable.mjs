#!/usr/bin/env node
/* @keep-comment
 * diagram-kit/decisiontable.mjs — correct-by-construction generator + STRUCTURAL validator for an OMG DMN
 * DECISION TABLE. Third entry in the diagram-kit series, adapted shape from statemachine.mjs/usecase.mjs, but
 * the SHAPE EXCEPTION: a decision table is not a mermaid diagram — "compiles via mermaid.parse" does not
 * apply to the table itself. The core check is structural: COMPLETENESS (every input-condition combination is
 * covered, or an explicit default/else rule exists), CONSISTENCY (no two rules conflict under the declared HIT
 * POLICY), and HIT-POLICY-DECLARED. Rules grounded in
 * .grimorio/skills-store/grimorio.system-design/diagram-references/decision-table-diagram.md (OMG DMN 1.4 ch.8 hit
 * policies, Vanthienen's decision-table verification, Calvanese et al.'s DMN overlap/gap analysis).
 * generate() MAY also emit a decision-tree mermaid flowchart when the model has no wildcard ("-"/"else")
 * conditions — a nice-to-have companion, never the core check.
 *
 * MODEL: { name, hitPolicy:"U"|"A"|"P"|"F"|"C"|"C+"|"C<"|"C>"|"C#"|"R"|"O",
 *          inputs:[{name, values:[...]}], outputs:[{name}],
 *          rules:[{when:{inputName:value|"-"|"else"}, then:{outputName:value}}] }
 */
import fs from 'node:fs';

const HIT_POLICY_RE = /^(U|A|P|F|C[+<>#]?|R|O)$/;
const HIT_POLICY_LABEL = {
  U: 'Unique', A: 'Any', P: 'Priority', F: 'First',
  C: 'Collect', 'C+': 'Collect (SUM)', 'C<': 'Collect (MIN)', 'C>': 'Collect (MAX)', 'C#': 'Collect (COUNT)',
  R: 'Rule order', O: 'Output order',
};

// ── shared matching primitives (item 1-5 of the reference's hard constraints) ──────────────────────

function valueMatches(ruleVal, actualVal) {
  const v = ruleVal === undefined ? '-' : ruleVal;
  return v === '-' || v === 'else' || v === actualVal;
}

function ruleMatchesCombo(rule, combo, inputNames) {
  return inputNames.every((k) => valueMatches(rule.when ? rule.when[k] : undefined, combo[k]));
}

function rulesOverlap(a, b, inputNames) {
  return inputNames.every((k) => {
    const av = a.when && a.when[k] !== undefined ? a.when[k] : '-';
    const bv = b.when && b.when[k] !== undefined ? b.when[k] : '-';
    return av === '-' || av === 'else' || bv === '-' || bv === 'else' || av === bv;
  });
}

function sameOutput(a, b, outputNames) {
  return outputNames.every((k) => (a.then ? a.then[k] : undefined) === (b.then ? b.then[k] : undefined));
}

// a is SUBSUMED by b: every combo a matches, b also matches (b is at least as general on every input).
function isSubsetOf(a, b, inputNames) {
  return inputNames.every((k) => {
    const bv = b.when && b.when[k] !== undefined ? b.when[k] : '-';
    if (bv === '-' || bv === 'else') return true;
    const av = a.when && a.when[k] !== undefined ? a.when[k] : '-';
    return av === bv;
  });
}

function* cartesian(inputs) {
  if (inputs.length === 0) { yield {}; return; }
  const [first, ...rest] = inputs;
  for (const v of first.values) for (const r of cartesian(rest)) yield { [first.name]: v, ...r };
}

// ── validateModel — the core structural check ───────────────────────────────────────────────────────

function checkShape(model, v) {
  if (!Array.isArray(model.inputs) || model.inputs.length === 0) v.push({ item: 2, rule: 'no input conditions declared', detail: '(model.inputs)' });
  if (!Array.isArray(model.outputs) || model.outputs.length === 0) v.push({ item: 2, rule: 'no output actions declared', detail: '(model.outputs)' });
  if (!Array.isArray(model.rules) || model.rules.length === 0) v.push({ item: 2, rule: 'no rules declared', detail: '(model.rules)' });
  for (const inp of model.inputs || []) {
    if (!Array.isArray(inp.values) || inp.values.length === 0)
      v.push({ item: 2, rule: `input "${inp.name}" declares no finite domain`, detail: inp.name });
  }
}

function checkSchema(model, v, inputNames, outputNames) {
  (model.rules || []).forEach((r, i) => {
    for (const k of Object.keys(r.when || {})) if (!inputNames.includes(k))
      v.push({ item: 2, rule: `rule ${i + 1} references unknown input`, detail: k });
    for (const k of Object.keys(r.then || {})) if (!outputNames.includes(k))
      v.push({ item: 2, rule: `rule ${i + 1} references unknown output`, detail: k });
  });
}

function checkCompleteness(model, v, warnings, inputNames) {
  const total = (model.inputs || []).reduce((n, i) => n * i.values.length, 1);
  if (total > 5000) {
    // item 10 is ADVISORY (reference §A.3 rule 10, §C.4) — a large-but-complete table is still VALID, so this
    // goes to warnings like checkRedundancy's item 9, never into `v` (which drives `pass`). The early return
    // (skip exhaustive gap enumeration on a huge table) stays; only the severity classification changed.
    warnings.push({ rule: `exploding table: ${total} input combinations — split the table (reference C.4)`, detail: `${total} combos` });
    return;
  }
  let gaps = 0;
  for (const combo of cartesian(model.inputs || [])) {
    const hit = (model.rules || []).some((r) => ruleMatchesCombo(r, combo, inputNames));
    if (!hit && gaps < 10) { v.push({ item: 3, rule: 'no rule (and no default/else) covers this input combination', detail: JSON.stringify(combo) }); gaps++; }
  }
}

function checkConsistency(model, v, inputNames, outputNames) {
  const hp = model.hitPolicy;
  const rules = model.rules || [];
  for (let i = 0; i < rules.length; i++) {
    for (let j = i + 1; j < rules.length; j++) {
      if (!rulesOverlap(rules[i], rules[j], inputNames)) continue;
      if (hp === 'U')
        v.push({ item: 4, rule: `rules ${i + 1} and ${j + 1} overlap — forbidden under Unique hit policy`, detail: `rule ${i + 1} vs rule ${j + 1}` });
      else if (hp === 'A' && !sameOutput(rules[i], rules[j], outputNames))
        v.push({ item: 4, rule: `rules ${i + 1} and ${j + 1} overlap with DIFFERENT outputs — forbidden under Any hit policy`, detail: `rule ${i + 1} vs rule ${j + 1}` });
    }
  }
}

function checkRedundancy(model, warnings, inputNames, outputNames) {
  const rules = model.rules || [];
  for (let i = 0; i < rules.length; i++) {
    for (let j = 0; j < rules.length; j++) {
      if (i === j) continue;
      if (isSubsetOf(rules[i], rules[j], inputNames) && sameOutput(rules[i], rules[j], outputNames))
        warnings.push({ rule: `rule ${i + 1} is redundant — fully subsumed by rule ${j + 1} with the same output`, detail: `rule ${i + 1} ⊆ rule ${j + 1}` });
    }
  }
}

function validateModel(model) {
  const v = [];
  const warnings = [];
  if (!HIT_POLICY_RE.test(model.hitPolicy || ''))
    v.push({ item: 1, rule: 'hit policy is undeclared or not a recognized DMN token (U/A/P/F/C[+<>#]/R/O)', detail: String(model.hitPolicy) });
  checkShape(model, v);
  if (v.length) return { pass: false, violations: v, warnings };
  const inputNames = model.inputs.map((i) => i.name);
  const outputNames = model.outputs.map((o) => o.name);
  checkSchema(model, v, inputNames, outputNames);
  if (v.some((x) => x.item === 2)) return { pass: false, violations: v, warnings };
  checkCompleteness(model, v, warnings, inputNames);
  checkConsistency(model, v, inputNames, outputNames);
  checkRedundancy(model, warnings, inputNames, outputNames);
  return { pass: v.length === 0, violations: v, warnings };
}

// ── generate — correct by construction ──────────────────────────────────────────────────────────────

function cell(v) { return v === undefined ? '' : String(v); }

function renderTable(model) {
  const inputs = model.inputs.map((i) => i.name);
  const outputs = model.outputs.map((o) => o.name);
  const L = [`### Decision Table: ${model.name || 'unnamed'}`, '',
    `**Hit Policy:** ${model.hitPolicy} — ${HIT_POLICY_LABEL[model.hitPolicy]}`,
    `**Conditions:** ${model.inputs.map((i) => `${i.name}:{${i.values.join(',')}}`).join(', ')}`,
    `**Actions:** ${outputs.join(', ')}`, '',
    `| # | ${inputs.join(' | ')} | ${outputs.join(' | ')} |`,
    `|---|${inputs.map(() => '---|').join('')}${outputs.map(() => '---|').join('')}`];
  model.rules.forEach((r, i) => {
    const ins = inputs.map((k) => cell(r.when ? r.when[k] : undefined) || '-').join(' | ');
    const outs = outputs.map((k) => cell(r.then ? r.then[k] : undefined)).join(' | ');
    L.push(`| ${i + 1} | ${ins} | ${outs} |`);
  });
  return L.join('\n');
}

// Optional decision-tree companion: only well-defined when no rule uses a wildcard ("-"/"else") — a
// wildcarded model does not map to one unambiguous branch per leaf, so the tree is silently omitted.
function hasWildcard(model) {
  return model.rules.some((r) => model.inputs.some((i) => {
    const v = r.when ? r.when[i.name] : undefined;
    return v === undefined || v === '-' || v === 'else';
  }));
}

function leafLabel(rule, outputs) {
  return outputs.map((k) => `${k}=${cell(rule.then ? rule.then[k] : undefined)}`).join(', ');
}

function buildTreeLines(model, inputs, outputs, prefix, depth, idPrefix, L) {
  if (depth === inputs.length) {
    const match = model.rules.find((r) => inputs.every((k) => r.when[k] === prefix[k]));
    L.push(`  ${idPrefix}(["${leafLabel(match, outputs)}"])`);
    return;
  }
  const name = inputs[depth];
  for (const val of model.inputs[depth].values) {
    const childId = `${idPrefix}_${val}`.replace(/[^A-Za-z0-9_]/g, '_');
    L.push(`  ${idPrefix}{"${name}?"} -->|${val}| ${childId}`);
    buildTreeLines(model, inputs, outputs, { ...prefix, [name]: val }, depth + 1, childId, L);
  }
}

function generateDecisionTree(model) {
  if (hasWildcard(model)) return null;
  const inputs = model.inputs.map((i) => i.name);
  const outputs = model.outputs.map((o) => o.name);
  const L = ['flowchart TD', `  root{"${inputs[0]}?"}`];
  const first = model.inputs[0];
  for (const val of first.values) {
    const childId = `root_${val}`.replace(/[^A-Za-z0-9_]/g, '_');
    L.push(`  root -->|${val}| ${childId}`);
    buildTreeLines(model, inputs, outputs, { [inputs[0]]: val }, 1, childId, L);
  }
  return L.join('\n');
}

function generate(model) {
  const check = validateModel(model);
  if (!check.pass) {
    const msg = check.violations.map((x) => `  item ${x.item}: ${x.rule} (${x.detail})`).join('\n');
    throw new Error(`refusing to generate a decision table from an invalid model:\n${msg}`);
  }
  const table = renderTable(model);
  const tree = generateDecisionTree(model);
  return tree ? `${table}\n\n#### Decision tree (companion)\n\`\`\`mermaid\n${tree}\n\`\`\`` : table;
}

// ── lint (legacy markdown backstop) ─────────────────────────────────────────────────────────────────

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

function isSeparatorRow(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
}

function extractTables(md) {
  const lines = md.split(/\r?\n/);
  const tables = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!/^\s*\|.*\|\s*$/.test(lines[i]) || !isSeparatorRow(lines[i + 1])) continue;
    const header = splitRow(lines[i]);
    const rows = [];
    let j = i + 2;
    while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) { rows.push(splitRow(lines[j])); j++; }
    tables.push({ startLine: i + 1, header, rows, context: lines.slice(Math.max(0, i - 10), i).join('\n') });
    i = j - 1;
  }
  return tables;
}

// The robust "is this a decision table" convention (reference D checklist item 1): a rule-numbered first
// column ("#"/"Rule"), OR a nearby "Hit Policy" mention. DECISIONTABLE_FORCE_ALL is the mutation switch the
// selftest uses to PROVE the skip is load-bearing (force every table to be treated as a candidate).
function isCandidateDecisionTable(table) {
  if (process.env.DECISIONTABLE_FORCE_ALL) return true;
  const first = (table.header[0] || '').trim();
  return /^#$/.test(first) || /^rule\s*#?$/i.test(first) || /hit\s*policy/i.test(table.context);
}

function extractHitPolicy(table) {
  const m = table.context.match(/hit\s*policy[^A-Za-z0-9]{0,10}([UAPFCRO][+<>#]?)\b/i);
  return m ? m[1].toUpperCase() : null;
}

function extractConditionDomains(table) {
  const line = table.context.match(/\*\*Conditions:\*\*\s*(.+)/i);
  const domains = {};
  if (!line) return domains;
  for (const m of line[1].matchAll(/([A-Za-z0-9_]+)\s*:\s*\{([^}]*)\}/g))
    domains[m[1]] = m[2].split(',').map((s) => s.trim()).filter(Boolean);
  return domains;
}

function normHeader(s) { return s.replace(/[`*]/g, '').replace(/\(.*\)/, '').trim().toLowerCase(); }

function buildModelFromTable(table, hitPolicy, domains) {
  const condNames = Object.keys(domains).filter((name) => table.header.some((h) => normHeader(h) === name.toLowerCase()));
  const inputs = condNames.map((name) => ({ name, values: domains[name] }));
  const outCols = table.header.map((h, idx) => idx).filter((idx) => idx > 0 && !condNames.some((n) => normHeader(table.header[idx]) === n.toLowerCase()));
  const outputs = outCols.map((idx) => ({ name: table.header[idx] }));
  const rules = table.rows.map((row) => {
    const when = {}, then = {};
    for (const name of condNames) {
      const colIdx = table.header.findIndex((h) => normHeader(h) === name.toLowerCase());
      when[name] = row[colIdx] ? row[colIdx].replace(/[`*]/g, '').trim() : '-';
    }
    for (const idx of outCols) then[table.header[idx]] = row[idx];
    return { when, then };
  });
  return { hitPolicy, inputs, outputs, rules };
}

function lintTable(table, out, skippedRef) {
  if (!isCandidateDecisionTable(table)) { skippedRef.n++; return; }
  const hitPolicy = extractHitPolicy(table);
  if (!hitPolicy) { out.push({ item: 1, line: table.startLine, rule: 'decision table declares no HIT POLICY (U/A/P/F/C/R/O)' }); return; }
  const domains = extractConditionDomains(table);
  if (Object.keys(domains).length === 0) return; // hit-policy OK; no declared domains — honest skip, not a fabricated verdict
  const model = buildModelFromTable(table, hitPolicy, domains);
  if (!model.inputs.length) return;
  const r = validateModel(model);
  for (const v of r.violations) out.push({ ...v, line: table.startLine });
}

function lintDecisionTables(md) {
  const out = [];
  const skippedRef = { n: 0 };
  for (const t of extractTables(md)) lintTable(t, out, skippedRef);
  return { pass: out.length === 0, violations: out, skipped: skippedRef.n };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────

function runValidate(arg) {
  const r = validateModel(JSON.parse(fs.readFileSync(arg, 'utf8')));
  for (const w of r.warnings) console.log(`WARN  item -  ${w.rule}  (${w.detail})`);
  for (const x of r.violations) console.log(`FAIL  item ${x.item}  ${x.rule}  (${x.detail})`);
  console.log(r.pass ? '--- model VALID ---' : `--- model INVALID: ${r.violations.length} violation(s) ---`);
  return r.pass ? 0 : 1;
}

function runLint(arg) {
  const r = lintDecisionTables(fs.readFileSync(arg, 'utf8'));
  for (const x of r.violations) console.log(`FAIL  ${arg}:${x.line}  item ${x.item}  ${x.rule}`);
  console.log(`(${r.skipped} non-decision table(s) skipped)`);
  console.log(r.pass ? '--- lint CLEAN (no gross tells; not a proof of correctness) ---' : `--- lint: ${r.violations.length} violation(s) ---`);
  return r.pass ? 0 : 1;
}

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === 'generate') { process.stdout.write(generate(JSON.parse(fs.readFileSync(arg, 'utf8'))) + '\n'); return 0; }
  if (cmd === 'validate-model') return runValidate(arg);
  if (cmd === 'lint') return runLint(arg);
  console.error('usage: decisiontable.mjs <generate|validate-model|lint> <file>');
  return 2;
}

export { validateModel, generate, lintDecisionTables as lint, generateDecisionTree };

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
