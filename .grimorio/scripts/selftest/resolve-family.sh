#!/usr/bin/env bash
# The probe for the ONE resolver. Every case here is a bug that actually shipped on 2026-08-05, in three
# different tools, from three separate re-implementations of the same resolution.
#
# See it FAIL before trusting it: `git stash` the resolver's directory branch and this must go red.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

node -e '
const R = require("./.grimorio/scripts/refobl/resolve.cjs");
let fail = 0;
const t = (label, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}\n        got=${got}\n        want=${want}`);
};

// The bug that shipped THREE times: a bare skill name addresses a DIRECTORY, and its content is SKILL.md.
t("bare skill -> directory",
  R.toPath("import:skill/grimorio.agent-writing"), ".grimorio/skills/grimorio.agent-writing");
t("bare skill CONTENT -> its SKILL.md",
  R.toContentPath("import:skill/grimorio.agent-writing"), ".grimorio/skills/grimorio.agent-writing/SKILL.md");
t("skill file -> that file",
  R.toContentPath("ref:skill/grimorio.prompt-writing-quality/format-guide.md"), ".grimorio/skills/grimorio.prompt-writing-quality/format-guide.md");

// A directory reference MUST yield headings. Returning none is what condemned 44 real anchors as fabricated.
const h = R.headingsOf("import:skill/grimorio.agent-writing");
t("bare skill yields headings", h && h.length > 0, true);

// The other stores, and the two forms that are deliberately not local.
t("repo store", R.toPath("ref:repo/.grimorio/scripts/audit-chain.mjs"), ".grimorio/scripts/audit-chain.mjs");
t("tmp store", R.toPath("ref:tmp/features/x.md"), "tmp/features/x.md");
t("ext is never local", R.toPath("cite:ext/project@0146bd0#a/b.go"), "null");
t("agent -> its shell", R.toPath("agent:grimorio.po"), ".claude/agents/grimorio.po.md");

// The two SINGLE-ROOTED stores. Each exists because `skill` continuing to mean "any grimorio container"
// is the lying-name defect the `project.` prefix work had just removed, one axis over. They are declared
// in .grimorio/scripts/refobl/skill-roots.json`s own `stores` and spliced into the parse regex from there, so a
// store the resolver resolves but the parser rejects cannot happen -- these cases hold both halves.
t("memory store -> its one root",
  R.toPath("ref:memory/grimorio.po-memory/project.md"), ".grimorio/memory/grimorio.po-memory/project.md");
t("memory store PARSES as a store, never as a path",
  R.parse("ref:memory/grimorio.po-memory/project.md").store, "memory");
t("agent store -> its one root",
  R.toPath("ref:agent/grimorio.entropy/behavior.md"), ".grimorio/agents/grimorio.entropy/behavior.md");
t("agent store is NOT the flat agent: relation",
  R.parse("ref:agent/grimorio.entropy/behavior.md").kind, "two-axis");
t("agent: relation still parses as itself",
  R.parse("agent:grimorio.entropy").kind, "agent");
// A single-rooted store never walks and never heals: a reference naming a file that is not there is DEAD
// against that one root, reported as written, never silently redirected to some other container.
t("a missing memory target reports dead against its OWN root",
  R.toPath("ref:memory/grimorio.nope/x.md"), ".grimorio/memory/grimorio.nope/x.md");

// A trailing sentence period is not part of the path — 17 false "dead" reports came from this.
t("trailing period stripped",
  R.toPath("ref:skill/grimorio.prompt-writing-quality/format-guide.md."), ".grimorio/skills/grimorio.prompt-writing-quality/format-guide.md");

// GitHub slug: punctuation deleted, each space its own hyphen, runs NEVER collapsed.
t("slug keeps double hyphen from an em-dash gap",
  R.slug("commit at every coherent step — measured"), "commit-at-every-coherent-step--measured");

console.log("");
if (fail) { console.log(`resolve-family: ${fail} FAILED`); process.exit(1); }
console.log("resolve-family: OK — the resolution every tool shares behaves the same for all of them.");
'
