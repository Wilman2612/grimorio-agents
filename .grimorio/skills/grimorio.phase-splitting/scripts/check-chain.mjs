#!/usr/bin/env node
// Static lint of a phase chain manifest: run it after writing or editing a chain.json.
//   node check-chain.mjs --chain <agent> | --manifest <path> [--walk]    exit 0 clean · 1 a check failed · 2 usage
//   --walk takes every condition of every phase through the real engine, with a filled deliverable.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
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
    const path = load.split("#")[0];
    // An agent's memory is optional: a load into it resolves while the agent folder exists.
    const mem = /^agent\/([^/]+)\/memory(\/|$)/.exec(path);
    const ok = R.exists(`import:${path}`) || (mem && existsSync(join(REPO_ROOT, ".grimorio/agents", mem[1])));
    if (!ok) fail(`phase ${p.id}: load ${load} does not resolve`);
    const anchor = load.split("#")[1];
    const heads = anchor && R.exists(`import:${path}`) ? R.headingsOf(`import:${path}`) : null;
    if (heads && !heads.some((h) => R.slug(h) === anchor)) fail(`phase ${p.id}: load ${load} names no heading in its target`);
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

if (args.includes("--walk") && !fails.length) {
  const engine = join(REPO_ROOT, ".grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs");
  const tmp = join(REPO_ROOT, ".grimorio/tmp", `check-chain-walk-${process.pid}`);
  mkdirSync(tmp, { recursive: true });
  const mf = ["--manifest", relative(REPO_ROOT, manifestPath)];
  const eng = (a) => spawnSync(process.execPath, [engine, ...a, ...mf], { cwd: REPO_ROOT, encoding: "utf8" });
  for (const p of m.phases) {
    for (const on of Object.keys(p.next || {})) {
      const st = eng(["start", "--chain", m.agent, "--at", p.id]);
      const run = (st.stdout.split("\n")[0] || "").replace("RUN ", "").trim();
      if (st.status !== 0) { fail(`walk: start --at ${p.id} refused: ${st.stderr.trim()}`); continue; }
      if ((p.produces || []).includes("deliverable")) {
        const fields = [...new Set(Object.values(p.fingerprints || {}).flatMap((f) => f.split("+").map((x) => x.trim())))];
        const file = join(tmp, `${run}.md`);
        writeFileSync(file, fields.map((f) => `${f}:   walked`).join("\n") + "\n");
        eng(["record", "--run", run, "deliverable", relative(REPO_ROOT, file)]);
      }
      const nx = eng(["next", "--run", run, "--on", on]);
      if (nx.status !== 0) fail(`walk: phase ${p.id} --on ${on} refused: ${(nx.stderr || nx.stdout).trim().split("\n").pop()}`);
    }
  }
  rmSync(tmp, { recursive: true, force: true });
}

for (const f of fails) console.log(`FAIL ${f}`);
console.log(fails.length ? `${fails.length} check(s) failed in ${relative(REPO_ROOT, manifestPath)}` : `CHAIN OK ${relative(REPO_ROOT, manifestPath)} — ${ids.size} phases`);
process.exit(fails.length ? 1 : 0);
