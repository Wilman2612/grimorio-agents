#!/usr/bin/env node
// scripts/check-phase-fingerprint.mjs — D8 fingerprint gate: verifies a filled phase-deliverable instance
// carries real content for every FINGERPRINT field its phase declares against a mandatory `import:` target.
// Usage: node scripts/check-phase-fingerprint.mjs <phase-file.md> <deliverable-instance.txt> [agent]

import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

function usageError(msg) {
  console.error(`USAGE ERROR: ${msg}`);
  console.error('node scripts/check-phase-fingerprint.mjs <phase-file.md> <deliverable-instance.txt> [agent]');
  process.exit(2);
}

const [, , phasePath, deliverablePath, agent] = process.argv;
const agentName = agent || 'unknown';
if (!phasePath || !deliverablePath) usageError('both <phase-file.md> and <deliverable-instance.txt> are required');
if (!existsSync(phasePath)) usageError(`phase file not found: ${phasePath}`);
if (!existsSync(deliverablePath)) usageError(`deliverable instance not found: ${deliverablePath}`);

const phaseText = readFileSync(phasePath, 'utf8');
const deliverableText = readFileSync(deliverablePath, 'utf8');

// 1. Extract the "## LOAD (JIT)" section (from that heading to the next "##" heading, or end of file).
const loadMatch = phaseText.match(/^##\s*LOAD[^\r\n]*[\r\n]+([\s\S]*?)(?=[\r\n]+##|(?![\s\S]))/m);
if (!loadMatch) usageError(`no "## LOAD" section found in ${phasePath}`);
const loadSection = loadMatch[1];

// 2. Walk every top-level "- " bullet in that section (a bullet's own block runs until the next top-level
//    "- " bullet or the section ends), and for each bullet whose first line contains a real import:skill/ or import:repo/ reference, look for a
//    "FINGERPRINT: <NAME> field(s) below" annotation anywhere inside that same bullet's block.
const bulletRe = /^- (.+(?:[\r\n](?!- ).*)*)/gm;
let bullet;
const fingerprintFields = [];
const missingFingerprintImports = [];
while ((bullet = bulletRe.exec(loadSection))) {
  const block = bullet[1];
  const firstLine = block.split('\n')[0];
  if (!/import:(skill|repo)\//.test(firstLine)) continue; // only a real import:skill/ or import:repo/ reference is in scope for D8 — a bare "import:" substring inside backticked prose (e.g. "no mandatory `import:` target") must NOT match
  const fpMatch = block.match(/FINGERPRINT:\s*([A-Z][A-Z0-9 +/()-]*?)\s+fields?\s+below/);
  if (fpMatch) {
    fingerprintFields.push(fpMatch[1].trim());
  } else {
    missingFingerprintImports.push(firstLine.trim());
  }
}

// 3. Parse the deliverable instance into FIELD NAME -> value. A field line looks like
//    "FIELD NAME:   value..." (value may continue on following indented lines until the next field line).
const fieldRe = /^([A-Z][A-Z0-9 +/()-]*?):\s*(.*(?:\n(?!\s*[A-Z][A-Z0-9 +/()-]*?:).*)*)/gm;
const deliverableFields = {};
let fm;
while ((fm = fieldRe.exec(deliverableText))) {
  deliverableFields[fm[1].trim().toUpperCase()] = fm[2].trim();
}

// 4. Check each declared FINGERPRINT field (a FINGERPRINT may name more than one field joined by "+", e.g.
//    "OBJECTIVE + EXIT CONDITION" — check each independently) is present, non-empty, and not the literal
//    unfilled placeholder `<...>`.
const failures = [];
for (const rawName of fingerprintFields) {
  const names = rawName.split('+').map((s) => s.trim()).filter(Boolean);
  for (const name of names) {
    const upper = name.toUpperCase();
    const key = Object.keys(deliverableFields).find((k) => k === upper || k.startsWith(upper));
    if (!key) {
      failures.push(`MISSING FIELD: "${name}" is declared as a FINGERPRINT but no matching field was found in the deliverable instance`);
      continue;
    }
    const value = deliverableFields[key];
    if (!value || value.length === 0) {
      failures.push(`EMPTY: "${key}" carries no value`);
      continue;
    }
    if (/^<[\s\S]*>$/.test(value.trim())) {
      failures.push(`UNFILLED TEMPLATE PLACEHOLDER: "${key}" still reads "${value.trim()}"`);
    }
  }
}

if (missingFingerprintImports.length > 0) {
  console.log(`NOTE: ${missingFingerprintImports.length} mandatory import(s) in ${phasePath} declare no FINGERPRINT annotation: ${missingFingerprintImports.join('; ')}`);
}

function logGateResult(verdict) {
  try {
    const cacheDir = '.claude/.cache';
    mkdirSync(cacheDir, { recursive: true });
    const logEntry = {
      ts: new Date().toISOString(),
      phase: basename(phasePath, '.md'),
      agent: agentName,
      verdict: verdict,
      deliverable: deliverablePath,
    };
    appendFileSync('.claude/.cache/fingerprint-gate-log.jsonl', JSON.stringify(logEntry) + '\n', 'utf8');
  } catch (_) {
    /* never let logging break the gate's own result */
  }
}

if (failures.length > 0) {
  logGateResult('FAIL');
  console.log(`FAIL — ${failures.length} fingerprint check(s) failed for ${deliverablePath} against ${phasePath}:`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

logGateResult('PASS');
console.log(`PASS — all ${fingerprintFields.length} declared FINGERPRINT field(s) carry real content in ${deliverablePath}.`);
process.exit(0);
