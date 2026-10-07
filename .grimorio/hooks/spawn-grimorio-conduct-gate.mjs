/* @keep-comment
 * spawn-grimorio-conduct-gate.cjs — refuses an `Agent` spawn whose own prompt text does not carry the
 * instruction that compels the child to load `skill/grimorio.conduct` (or, failing that, `CLAUDE.md`, which
 * self-documents that same requirement as its own load-chain instruction).
 *
 * WHY THIS EXISTS. The CEO approved a refusing hook here in his own words (translated): "the first thing
 * you do when you spawn an agent is that the hook blocks you, if you haven't told it to load, or follow
 * CLAUDE.md's instruction to read grimorio.conduct." [RENAMED 2026-08-11, by CEO order (translated): CLAUDE.md
 * now names `grimorio-conduct` (itself renamed to `grimorio.conduct` in the 2026-08-28 corpus restructure) as
 * the one skill every agent loads first, and `grimorio.conduct` itself, as its
 * own first step, compels loading `grimorio.prompt-reading` in turn. This file was renamed from
 * `spawn-prompt-reading-gate.cjs` and its checked skill switched to match — see
 * `ref:skill/grimorio.conduct#the-delivery-chain-that-puts-this-file-in-front-of-you--honestly-not-oversold`
 * for the current 3-link chain this hook is link 1 of.] harness.md (this directory) requires three things be
 * established before any hook ships, and grimorio.system-keeper established them by measurement, not
 * assumption, before handing this file to be written originally:
 *   1. The rule REACHES the agent it governs — CLAUDE.md prohibition 25 (grimorio.prompt-writing-quality before
 *      writing steering text) is measured to FIRE 4/4 across both tiers and both directions when the task
 *      genuinely needs it (objectives/grimorio-loop-graph-findings.md, F10). Prohibition 9 (fan-out
 *      naming) has no matching measurement in that file; its reachability is not claimed here.
 *   2. An agent that RECEIVED the rule ignored it anyway: measured and reported in this session's own
 *      task framing — the main loop itself wrote roughly fifteen subagent briefs and ran three fan-outs
 *      breaking rules 9 and 25 on every one, with the full file in context, the same night this hook was
 *      proposed — but that claim is not yet written to objectives/grimorio-loop-graph-findings.md as a
 *      separate finding, so treat it as this task's stated justification, not independently documented
 *      evidence.
 *   3. No existing rule already forces this mechanically — nothing before this hook checked a spawn's
 *      prompt content before dispatch.
 *
 * A DELIBERATE DEVIATION FROM THIS DIRECTORY'S OWN STANDING CONVENTION — grimorio.system-keeper's own
 * decision, not the CEO's, and recorded here so a future reader sees it was considered, not missed.
 * harness.md's rule is: "WHEN a hook would BLOCK ⟶ key it on `agent_type` being PRESENT, so it binds
 * subagents and lets the main loop through" — because the main loop answers the CEO turn by turn and
 * already has a refusal, so a block on top of that is friction. That premise does not hold here: the
 * measured offender in precondition 2 above IS the main loop itself, and nobody refuses the main loop's
 * own spawns today. So this hook fires regardless of whether `input.agent_type` is present or absent —
 * it binds the top-level session's own `Agent` calls exactly as it binds a subagent's.
 *
 * A TWO-TIER SCOPE, changed 2026-09-08 (CEO ruling, relayed via grimorio.system-keeper — not independently
 * quotable by this file's author, per grimorio.conduct rule 11). Read every trace below of "EXEMPT_TYPES is
 * the only escape from an otherwise-universal gate" as SUPERSEDED, not as a second, still-current view standing
 * beside this one — that criterion answered "does this type carry the `Skill` tool," a different question than
 * "is this one of grimorio's own agents," and left a real, verified defect open: a user's own foreign agent, or
 * this session's own built-in types (`Explore`, `general-purpose`, `claude`, `Plan`), all carry the `Skill` tool
 * and were never on the old list, so a bare spawn of any of them was DENIED and told to load doctrine
 * meaningless to it — verified live pre-fix, `subagent_type: "Explore"`, bare prompt, DENIED. The CEO's own
 * framing, relayed: the gate should bind only a spawn that says "grimorio" or "project," never a stranger's own
 * agent that has nothing to do with grimorio. @keep-comment
 *
 * TIER ONE — THE PREFIX SCOPE, checked FIRST in main(), before EXEMPT_TYPES or the content-pattern check ever
 * run. WHEN a spawn's own `subagent_type` does not START WITH the literal prefix `grimorio.` or `project.` —
 * including when it is absent, undefined, or non-string entirely (an omitted-type spawn) — this hook has
 * NOTHING TO SAY about it: exit 0 immediately. Checked with `String.prototype.startsWith`, never a regex, so a
 * near-miss like `grimoriox.scout` does not match. This is the corpus's own already-real, already-enforced
 * naming convention — `grimorio.<name>` a portable role, `project.<name>` a project-tied one, per
 * `ref:skill/grimorio.agent-writing/SKILL.md`'s own "general/project boundary is also legible in NAMES" section
 * (CEO ruling 2026-08-28) — used here to decide "is this one of grimorio's own agents," not invented for this
 * hook. Grounded in an existing, already-shipped precedent for exactly this shape, not a new pattern:
 * `ref:repo/.grimorio/scripts/audit-chain.mjs` line 746 (`skillSeg.split("/")[0].startsWith("grimorio.")`). @keep-comment
 *
 * TIER TWO — EXEMPT_TYPES, checked SECOND, only once a spawn has already survived Tier One's prefix scope. A
 * NARROWER exemption, inside that scope, for a `grimorio.`-prefixed agent that still cannot act on this gate's
 * own demand — it carries no `Skill` tool at all (the ORIGINAL criterion this Set was built on, before Tier One
 * existed). SHRUNK from seven names to two, 2026-09-08: `cv-ats-screener`, `cv-recruiter`, `cv-reviser`,
 * `statusline-setup`, `claude-code-guide` are REMOVED — not because any of them gained the `Skill` tool, but
 * because none of them is `grimorio.`/`project.`-prefixed, so Tier One's prefix check now exempts all five on
 * its own; carrying them here too would be dead weight left ADDED with nothing DEAD or OUT OF ORDER judged
 * against it (grimorio.conduct rule 15). The two that remain, `grimorio.experimenter` and
 * `grimorio.extract-cleaner`, both survive Tier One (both are `grimorio.`-prefixed) but still need this
 * second-tier exemption for the original no-Skill-tool reason — verified 2026-08-11/2026-08-25 respectively by
 * grepping each shell's own `tools:` frontmatter; re-verify before trusting this pair against a shell that has
 * since changed. @keep-comment
 *
 * THE GAMEABILITY OBJECTION, answered in one line: the check is satisfied only by the compelling
 * instruction actually being present in the CHILD's own prompt text — the one channel measured to compel
 * obedience for this exact clause (objectives/grimorio-loop-graph-findings.md, F7/F12/F13); ambient
 * CLAUDE.md context alone is measured NOT to (F5/F8). So passing this gate IS the child having received a
 * working instruction, not a token pasted around one.
 *
 * THE FAIL-OPEN INVARIANT, the same one worktree-create-from-develop.cjs's header states and binds every
 * hook in this directory: a bug in this file must never be the reason a spawn breaks project-wide. This
 * file's only intentional non-zero-cost action is the deny() call inside main()'s content check below —
 * every other path, including any internal error, allows silently.
 */

// TIER TWO exemption (see header's own TIER ONE / TIER TWO section) — the two grimorio.-prefixed types
// measured to carry no `Skill` tool at all, so gating them would only ever deny, never compel. Checked in
// main() AFTER the Tier One prefix scope and BEFORE the content-pattern check. Named explicitly rather than
// left at seven: a name that is not grimorio./project.-prefixed auto-exempts via Tier One instead, per the
// header's own dead-weight note, so only the genuinely grimorio-owned, tool-less types need a second,
// explicit exemption here. @keep-comment
const EXEMPT_TYPES = new Set(["grimorio.experimenter", "grimorio.extract-cleaner", "grimorio.board-writer"]);

// TIER ONE — the grimorio./project.-prefix scope, see header. Checked with String.prototype.startsWith,
// never a regex, so a near-miss like "grimoriox.scout" does not match. @keep-comment
function isGrimorioOwnedType(subagentType) {
  return (
    typeof subagentType === "string" &&
    (subagentType.startsWith("grimorio.") || subagentType.startsWith("project."))
  );
}

// Pattern A — a direct instruction naming grimorio.conduct with a directive verb: the literal
// `import:skill/grimorio.conduct`; `Skill(` (either quote style) immediately followed by `grimorio.conduct`;
// or the word `grimorio.conduct` within ~60 characters of a directive verb, same sentence (no
// period/newline between them). The verb list is intentionally wide — any phrasing that genuinely
// instructs the child to engage with the skill, not just the six original imperatives. @keep-comment
//
// The "." in "grimorio.conduct" is a LIVE regex metacharacter (matches any char) unless escaped —
// spliced unescaped into this source string, it would silently over-match ("grimorioXconduct" etc.)
// instead of the literal name. Escaped at every occurrence below, not just one branch. @keep-comment
const PATTERN_A = new RegExp(
  "import:skill/grimorio\\.conduct" +
    "|Skill\\(\\s*['\"]?grimorio\\.conduct" +
    "|(?:read|load|call|invoke|follow|open|consult|review|study|apply|use|check|reference)" +
    "(?:(?![.\\n]).){0,60}grimorio\\.conduct" +
    "|grimorio\\.conduct(?:(?![.\\n]).){0,60}" +
    "(?:read|load|call|invoke|follow|open|consult|review|study|apply|use|check|reference)",
  "is",
);

// Pattern B — a fallback instruction to read/follow CLAUDE.md itself, which self-documents the
// grimorio.conduct requirement as its own load-chain instruction: a directive verb within ~60 characters
// of the literal `CLAUDE.md`, same sentence.
const PATTERN_B = new RegExp(
  "(?:read|follow|obey|reread|re-read)(?:(?![.\\n]).){0,60}CLAUDE\\.md" +
    "|CLAUDE\\.md(?:(?![.\\n]).){0,60}(?:read|follow|obey|reread|re-read)",
  "is",
);

function deny(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
}

function denyMessage() {
  return (
    "spawn-grimorio-conduct-gate.cjs BLOCKED this spawn: its prompt text carries no instruction telling the " +
    "child to load `skill/grimorio.conduct` (or, failing that, to read `CLAUDE.md`, which self-documents the " +
    "same requirement as its own load-chain instruction).\n\n" +
    "Add one line to the spawn prompt, for example:\n" +
    '  "BEFORE you act on anything in this brief ⟶ call Skill(grimorio.conduct) and read it in full — it is ' +
    'the first thing every grimorio agent does, and its own first step then compels loading grimorio.prompt-reading in ' +
    'turn."\n\n' +
    "WHY THE PROMPT AND NOT CLAUDE.md ALONE: the caller's own spawn-prompt text is the one channel measured " +
    "to compel obedience for this exact clause (objectives/grimorio-loop-graph-findings.md F7/F12/F13); " +
    "ambient CLAUDE.md context alone is measured NOT to (F5/F8).\n\n" +
    "REMEMBER WHAT THIS GATE DOES NOT CHECK: the child owes its own behavior file AND `grimorio.conduct` " +
    "before anything else — this gate can only verify the grimorio.conduct instruction mechanically; the " +
    "own-behavior-file half is carried by the child's own agent shell, not by this regex.\n\n" +
    "IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, DELETE IT -- do not work around it. Remove the " +
    '"PreToolUse" -> "Agent" entry pointing at spawn-grimorio-conduct-gate.cjs from .claude/settings.json and ' +
    "delete this file. Retiring this deliberately is legitimate; bypassing it is not."
  );
}

export function run(input) {
  if (!input || !input.tool_name || input.tool_name !== "Agent") {
    return null;
  }

  const t = input.tool_input || {};
  const subagentType = t.subagent_type;

  // TIER ONE — see header. This hook has nothing to say about a spawn whose own target type is not
  // grimorio's own naming convention; exit BEFORE EXEMPT_TYPES or the content check ever run.
  if (!isGrimorioOwnedType(subagentType)) {
    return null;
  }

  // TIER TWO — see header and EXEMPT_TYPES' own comment above.
  if (EXEMPT_TYPES.has(subagentType)) {
    return null;
  }

  const prompt = String(t.prompt || "");
  if (PATTERN_A.test(prompt) || PATTERN_B.test(prompt)) {
    return null;
  }

  return deny(denyMessage());
}
