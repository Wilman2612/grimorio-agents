// @keep-comment — a cross-tool contract note: this module is the ONLY place a reference becomes a path.
// `skill/<name>` is a DIRECTORY, `skill/<name>/<file>` is a FILE, under the same prefix. Three tools
// re-implemented that split and all three got it wrong. Import this; never resolve a reference yourself.

const fs = require("fs");
const path = require("path");

const SKILLS = ".claude/skills/";
const AGENTS = ".claude/agents/";

/** Split a reference into its parts, or null when it is not one. */
function parse(ref) {
  const two = String(ref).match(/^(import|ref|cite):(skill|repo|tmp|ext)\/(.+?)(@[0-9a-f]{7,40})?(#[^\s]+)?[.,;:]*$/);
  if (two) return { kind: "two-axis", relation: two[1], store: two[2], path: two[3], rev: two[4] || "", anchor: two[5] || "" };
  const agent = String(ref).match(/^agent:(grimorio\.[a-z-]+)$/);
  if (agent) return { kind: "agent", name: agent[1] };
  const cold = String(ref).match(/^cold:([a-z0-9][a-z0-9-]*)(#[^\s]+)?$/);
  if (cold) return { kind: "cold", handle: cold[1], anchor: cold[2] || "" };
  return null;
}

/** The path a reference points at; null when nothing local can resolve it. */
function toPath(ref) {
  const p = parse(ref);
  if (!p) return null;
  if (p.kind === "agent") return AGENTS + p.name + ".md";
  if (p.kind !== "two-axis" || p.store === "ext") return null;
  const clean = p.path.replace(/[.,;:]+$/, "");
  return p.store === "tmp" ? "tmp/" + clean : p.store === "skill" ? SKILLS + clean : clean;
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

module.exports = { parse, toPath, toContentPath, headingsOf, slug, exists, SKILLS, AGENTS };
