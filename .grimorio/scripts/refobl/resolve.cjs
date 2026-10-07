// @keep-comment — a cross-tool contract note: this module is the ONLY place a reference becomes a path.
// `skill/<name>` is a DIRECTORY, `skill/<name>/<file>` is a FILE, under the same prefix. Three tools
// re-implemented that split and all three got it wrong. Import this; never resolve a reference yourself.

const fs = require("fs");
const path = require("path");

// @keep-comment -- the export boundary lives in ./skill-roots.json, read here and by
// .grimorio/scripts/rename-refs.mjs. It is a FILE, not a constant in each, because a hand-kept second copy of this
// array silently dropped a root once during this very migration.
const ROOTS_SPEC = require("./skill-roots.json");
const { cacheRelative } = require("./cache-paths.cjs");
const SKILL_ROOTS = ROOTS_SPEC.roots;
const LEGACY_PREFIXES = Object.entries(ROOTS_SPEC.legacy || {});
// @keep-comment -- the OTHER stores, single-rooted by construction (see skill-roots.json's own `_stores`).
// STORE_NAMES is spliced straight into the parse regex below, so the store axis of the grammar is declared
// in ONE place and a new store cannot be taught to the resolver while staying invisible to the parser.
const STORES = ROOTS_SPEC.stores || {};
const STORE_NAMES = Object.keys(STORES);
// @keep-comment -- CORPUS_ROOTS is the walked POPULATION, never a resolution list: `skill/` still resolves
// against SKILL_ROOTS alone. .grimorio/scripts/audit-chain.mjs walks this, and skill-roots.json's own `_corpusNote`
// states why -- a store whose files sit outside the walked population makes every count LOOK better by
// auditing less, which is the one failure mode a reference audit cannot survive.
const CORPUS_ROOTS = [...SKILL_ROOTS, ...Object.values(STORES)];
// @keep-comment -- the store-axis twin of LEGACY_PREFIXES: a `skill/<x>` whose target moved into one of
// these stores still resolves, ONLY when no skill root holds it, and every hit is logged. See
// skill-roots.json's own `_storeFallback` for the frozen files that force it to exist.
const STORE_FALLBACK = (ROOTS_SPEC.storeFallback || []).filter((s) => STORES[s]);
const SKILLS = SKILL_ROOTS[0]; // kept for any existing caller still importing SKILLS directly
const AGENTS = ".claude/agents/";
// @keep-comment -- RELATIVE on purpose, resolved against the CWD, which is what it was before the cache
// root moved. An absolute path anchored on CLAUDE_PROJECT_DIR would point at the REAL repo while a
// selftest runs inside a throwaway fixture, so the heal would be logged to the wrong tree and the
// fixture would read an empty file. cacheRelative gives the declared root without that anchoring.
const SELF_HEAL_LOG = cacheRelative("resolver-self-heal.log");

/** Split a reference into its parts, or null when it is not one. */
function parse(ref) {
  const TWO = new RegExp("^(import|ref|cite):(" + ["skill", "repo", "tmp", "ext", ...STORE_NAMES].join("|") + ")\/(.+?)(@[0-9a-f]{7,40})?(#[^\s]+)?[.,;:]*$");
  const two = String(ref).match(TWO);
  if (two) return { kind: "two-axis", relation: two[1], store: two[2], path: two[3], rev: two[4] || "", anchor: two[5] || "" };
  const agent = String(ref).match(/^agent:(grimorio\.[a-z-]+)$/);
  if (agent) return { kind: "agent", name: agent[1] };
  const cold = String(ref).match(/^cold:([a-z0-9][a-z0-9-]*)(#[^\s]+)?$/);
  if (cold) return { kind: "cold", handle: cold[1], anchor: cold[2] || "" };
  return null;
}

// @keep-comment — the corpus-restructure transition mechanism: a `grimorio.`-prefixed token may outlive
// the pass that renamed its target, so toPath() retries the unprefixed name before reporting dead. Every
// heal is logged so a still-old-form reference never heals silently forever. See the commit that added
// this for the full ruling.
function logSelfHeal(originalToken, healedTarget) {
  try {
    fs.mkdirSync(path.dirname(SELF_HEAL_LOG), { recursive: true });
    fs.appendFileSync(SELF_HEAL_LOG, JSON.stringify({ ts: new Date().toISOString(), originalToken, healedTarget }) + "\n");
  } catch { /* logging is best-effort — a log write failure must never block a resolution */ }
}

// @keep-comment -- the MIGRATION ALIAS for a `repo/` path written against the corpus's old location. It
// fires ONLY when the literal path is absent, so `.claude/skills/` -- still live, holding the 19 discovery
// adapters -- is never shadowed. Every heal is logged, exactly as the `skill/` store's own grimorio.-prefix
// heal below is, so a stale reference is recorded rather than silently healed forever. It exists because
// `.claude/hooks/**` is frozen to every agent here (grimorio-conduct rule 5c, the CEO's alone) and those
// files still name the old paths in live deny-message text that cannot be edited to stop.
function repoPath(clean) {
  try { fs.statSync(clean); return clean; } catch { /* fall through to the legacy map */ }
  for (const [from, to] of LEGACY_PREFIXES) {
    if (!clean.startsWith(from)) continue;
    const healed = to + clean.slice(from.length);
    try { fs.statSync(healed); } catch { continue; }
    logSelfHeal(clean, healed);
    return healed;
  }
  return clean; // nothing resolved -> report dead against what was actually written
}

/** The path a reference points at; null when nothing local can resolve it. */
function toPath(ref) {
  const p = parse(ref);
  if (!p) return null;
  if (p.kind === "agent") return AGENTS + p.name + ".md";
  if (p.kind !== "two-axis" || p.store === "ext") return null;
  const clean = p.path.replace(/[.,;:]+$/, "");
  // A single-rooted store is unambiguous by construction, so there is no root walk and nothing to heal:
  // the reference either names a real file under that one root or it is dead against it.
  if (STORES[p.store]) return STORES[p.store] + clean;
  if (p.store !== "skill") return p.store === "tmp" ? "tmp/" + clean : repoPath(clean);
  for (const root of SKILL_ROOTS) {
    const direct = root + clean;
    try { fs.statSync(direct); return direct; } catch { /* try next root */ }
  }
  // The STORE-AXIS fallback, logged exactly as repoPath()'s legacy map is: a `skill/<x>` whose target has
  // since moved into a store. It fires only after every skill root has missed, so a live skill is never
  // shadowed by a same-named store entry.
  for (const store of STORE_FALLBACK) {
    const healed = STORES[store] + clean;
    try { fs.statSync(healed); } catch { continue; }
    logSelfHeal(String(ref), healed);
    return healed;
  }
  const segments = clean.split("/");
  if (!segments[0].startsWith("grimorio.")) return SKILL_ROOTS[0] + clean; // report dead against the canonical root
  const healedClean = [segments[0].slice("grimorio.".length), ...segments.slice(1)].join("/");
  for (const root of SKILL_ROOTS) {
    const healed = root + healedClean;
    try { fs.statSync(healed); } catch { continue; }
    logSelfHeal(String(ref), healed);
    return healed;
  }
  return SKILL_ROOTS[0] + clean; // both direct and healed failed on every root -> report dead, same as today
}

/** The path whose CONTENT a reference addresses — a directory's content is its SKILL.md. */
function toContentPath(ref) {
  const p = toPath(ref);
  if (!p) return null;
  // POSIX join, never path.join: on Windows the latter returns backslashes while every other path in
  // this module is forward-slashed, so callers comparing the two silently never match. The probe caught
  // this on its first run — which is the entire argument for the probe existing.
  try { return fs.statSync(p).isDirectory() ? p.replace(/\/+$/, "") + "/SKILL.md" : p; } catch { return p; }
}

/** Headings of whatever a reference addresses, already stripped of markers. */
function headingsOf(ref) {
  const f = toContentPath(ref);
  if (!f) return null;
  try {
    return fs.readFileSync(f, "utf8").split(/\r?\n/)
      .filter((l) => /^#{1,6}\s/.test(l))
      .map((l) => l.replace(/^#+\s*/, "").replace(/[*`]/g, "").trim());
  } catch { return null; }
}

/** GitHub's slug: DELETE punctuation, then each space becomes its own hyphen — never collapse runs. */
function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/ /g, "-").replace(/^-+|-+$/g, "");
}

function exists(ref) {
  const p = toPath(ref);
  if (!p) return false;
  try { fs.statSync(p); return true; } catch { return false; }
}

module.exports = { parse, toPath, toContentPath, headingsOf, slug, exists, SKILLS, SKILL_ROOTS, STORES, STORE_NAMES, CORPUS_ROOTS, STORE_FALLBACK, AGENTS };
