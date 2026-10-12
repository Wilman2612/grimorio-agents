#!/usr/bin/env node
// Static lint of a phase chain manifest: run it after writing or editing a chain.json.
//   node check-chain.mjs --chain <agent> | --manifest <path>    exit 0 clean · 1 a check failed · 2 usage
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join, relative } from "node:path";
import { REPO_ROOT, resolveManifestPath } from "./phase-store.mjs";

const require = createRequire(import.meta.url);
const R = require(join(REPO_ROOT, ".grimorio/scripts/refobl/resolve.cjs"));

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
if (!flag("chain") && !flag("manifest")) {
  console.error("usage: check-chain.mjs --chain <agent> | --manifest <path>");
  process.exit(2);
}
const manifestPath = resolveManifestPath(flag("chain") || "", flag("manifest"));
const m = JSON.parse(readFileSync(manifestPath, "utf8"));
const fails = [];
const fail = (s) => fails.push(s);

if (!m.agent || !m.entry || !Array.isArray(m.phases)) fail("manifest lacks agent, entry or phases");
const ids = new Set((m.phases || []).map((p) => p.id));
if (!ids.has(m.entry)) fail(`entry ${m.entry} is not a phase`);

for (const p of m.phases || []) {
  if (!p.file || !existsSync(join(REPO_ROOT, p.file))) fail(`phase ${p.id}: file ${p.file} does not exist`);
  for (const [on, to] of Object.entries(p.next || {})) {
    if (to !== "END" && !ids.has(to)) fail(`phase ${p.id}: condition ${on} goes to unknown phase ${to}`);
  }
  for (const load of p.loads || []) {
    if (!R.exists(`import:${load}`)) fail(`phase ${p.id}: load ${load} does not resolve`);
  }
  const fp = p.fingerprints || {};
  for (const load of Object.keys(fp)) if (!(p.loads || []).includes(load)) fail(`phase ${p.id}: fingerprint for ${load}, which it does not load`);
  if (Object.keys(fp).length && !(p.produces || []).includes("deliverable")) fail(`phase ${p.id}: declares fingerprints but does not produce "deliverable"`);
  for (const ex of p["produces-exempt"] || []) if (!(ex in (p.next || {}))) fail(`phase ${p.id}: produces-exempt names ${ex}, which is not one of its conditions`);
}

const dir = dirname(manifestPath);
const listed = new Set((m.phases || []).map((p) => basename(p.file || "")));
for (const f of readdirSync(dir)) {
  if (/^phase-\d+.*\.md$/.test(f) && !listed.has(f)) fail(`${f} sits in the chain folder but no phase lists it`);
}

const reached = new Set([m.entry]);
for (let changed = true; changed; ) {
  changed = false;
  for (const p of m.phases || []) {
    if (!reached.has(p.id)) continue;
    for (const to of Object.values(p.next || {})) if (to !== "END" && !reached.has(to)) { reached.add(to); changed = true; }
  }
}
for (const id of ids) if (!reached.has(id)) fail(`phase ${id} is unreachable from entry ${m.entry}`);

for (const f of fails) console.log(`FAIL ${f}`);
console.log(fails.length ? `${fails.length} check(s) failed in ${relative(REPO_ROOT, manifestPath)}` : `CHAIN OK ${relative(REPO_ROOT, manifestPath)} — ${ids.size} phases`);
process.exit(fails.length ? 1 : 0);
