#!/usr/bin/env node
// .grimorio/skills/grimorio.phase-splitting/scripts/check-phase-fingerprint.mjs — D8 fingerprint gate: verifies a
// filled phase-deliverable instance carries real content for every FINGERPRINT field its phase declares against
// a mandatory `import:` target. Lives beside the phase-splitting mechanism it gates, not in the repo-wide
// scripts/ pool, because it is scoped to that one mechanism's own files rather than the whole tree.
// Usage: node .grimorio/skills/grimorio.phase-splitting/scripts/check-phase-fingerprint.mjs <phase-file.md> <deliverable-instance.txt> [agent]

import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { cacheDir, cachePath } from "../../../../.grimorio/scripts/refobl/cache-paths.mjs";

function usageError(msg) {
  console.error(`USAGE ERROR: ${msg}`);
  console.error('node .grimorio/skills/grimorio.phase-splitting/scripts/check-phase-fingerprint.mjs <phase-file.md> <deliverable-instance.txt> [agent]');
  process.exit(2);
}

const [, , phasePath, deliverablePath, agent] = process.argv;
const agentName = agent || 'unknown';
if (!phasePath || !deliverablePath) usageError('both <phase-file.md> and <deliverable-instance.txt> are required');
if (!existsSync(phasePath)) usageError(`phase file not found: ${phasePath}`);
if (!existsSync(deliverablePath)) usageError(`deliverable instance not found: ${deliverablePath}`);

const phaseText = readFileSync(phasePath, 'utf8');
const deliverableText = readFileSync(deliverablePath, 'utf8');

// 1. The fingerprints come from the phase's chain manifest entry when the manifest declares them
//    (`fingerprints: { "<load>": "FIELD" }`), otherwise from the phase file's own "## LOAD" section.
const fingerprintFields = [];
const missingFingerprintImports = [];
const manifestPath = join(dirname(phasePath), 'chain.json');
const manifestEntry = existsSync(manifestPath)
  ? (JSON.parse(readFileSync(manifestPath, 'utf8')).phases || []).find((p) => basename(p.file) === basename(phasePath))
  : null;
if (manifestEntry && manifestEntry.fingerprints) {
  for (const load of manifestEntry.loads || []) {
    const field = manifestEntry.fingerprints[load];
    if (field) fingerprintFields.push(...field.split('+').map((f) => f.trim()));
    else missingFingerprintImports.push(load);
  }
} else {
  const loadMatch = phaseText.match(/^##\s*LOAD[^\r\n]*[\r\n]+([\s\S]*?)(?=[\r\n]+##|(?![\s\S]))/m);
  if (!loadMatch) usageError(`no "## LOAD" section in ${phasePath}, and no fingerprints in ${manifestPath}`);
  const bulletRe = /^- (.+(?:[\r\n](?!- ).*)*)/gm;
  let bullet;
  while ((bullet = bulletRe.exec(loadMatch[1]))) {
    const block = bullet[1];
    const firstLine = block.split('\n')[0];
    if (!/import:(skill|repo)\//.test(firstLine)) continue;
    const fpMatch = block.match(/FINGERPRINT:\s*([A-Z][A-Z0-9 +/()-]*?)\s+fields?\s+below/);
    if (fpMatch) fingerprintFields.push(fpMatch[1].trim());
    else missingFingerprintImports.push(firstLine.trim());
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
    mkdirSync(cacheDir(), { recursive: true });
    const logEntry = {
      ts: new Date().toISOString(),
      phase: basename(phasePath, '.md'),
      agent: agentName,
      verdict: verdict,
      deliverable: deliverablePath,
    };
    appendFileSync(cachePath('fingerprint-gate-log.jsonl'), JSON.stringify(logEntry) + '\n', 'utf8');
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
