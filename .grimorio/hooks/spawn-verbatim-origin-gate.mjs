// spawn-verbatim-origin-gate.mjs (H11) — IMPLEMENTATION. A PreToolUse:Agent hook's real logic, MAIN-LOOP-ONLY,
// that DENIES a top-level spawn whose own prompt text (or a named cleaned-extract file) does not carry
// ELEMENT 1/1b/2/3/4. This file holds: the two-layer scoping check, the ELEMENT dispatch
// (computeMissingElements), and the deny/allow envelope construction. What each ELEMENT actually computes
// lives in its own sibling module: spawn-verbatim-origin-gate-text-checks.mjs (ELEMENT 1/1b/2 — does the
// prompt/file carry the right SHAPE), spawn-verbatim-origin-gate-log-checks.mjs (ELEMENT 3/4 — does the log
// carry the right PROVENANCE), spawn-verbatim-origin-gate-deny-messages.mjs (constructs the DENY/remediation
// text). The thin dispatcher wired into `.claude/settings.json` lives at
// `.claude/hooks/spawn-verbatim-origin-gate.cjs`; it reads stdin, dynamically imports this file, and writes
// whatever `run()` below returns — no business logic of its own.
//
// THE FAIL-OPEN INVARIANT, the same one spawn-grimorio-conduct-gate.cjs's header states and binds every hook in
// `.claude/hooks/`: a bug anywhere in this file or its siblings must never be the reason a spawn breaks
// project-wide. `run()`'s only intentional non-empty return is the deny() envelope inside its content check
// below — every other path, including a thrown error (which propagates up through the dispatcher's own
// dynamic `import()`/call, caught by ITS OWN catch-all), resolves to no output at all.
//
// Full WHY, every element's own design history, every CEO quote, the four-file layout:
// ref:skill/grimorio.hooks/spawn-gates.md -> H11. This file states only current, executable behavior,
// never the story of how it got here. @keep-comment
import { tryFileBasedElementOneOneB, hasElementOne, hasAnchoredUserAgentLabels, hasElementTwo } from "./spawn-verbatim-origin-gate-text-checks.mjs";
import { hasElementThree, hasElementFour } from "./spawn-verbatim-origin-gate-log-checks.mjs";
import { denyMessage } from "./spawn-verbatim-origin-gate-deny-messages.mjs";
import { loadInstallationConfig } from "./installation-config.mjs";

// @keep-comment TIER ONE — the grimorio./project.-prefix scope (see ref:skill/grimorio.hooks/spawn-gates.md
// -> H11 for the full justification). Checked with String.prototype.startsWith, never a regex, so a near-miss
// like "grimoriox.scout" does not match. EXPORTED: spawn-verbatim-origin-gate-log-checks.mjs's own
// findConsumingRow imports this exact function rather than carrying a third copy — see that file's own
// header comment on findConsumingRow for why a non-grimorio top-level row must never count as a "consuming"
// row in the first place: a non-grimorio agent's own spawn stays completely easy to get past, and grimorio's
// own gates bind only grimorio's own agents, never a stranger's.
// spawn-grimorio-conduct-gate.mjs still carries its own independent copy of this identical predicate — a
// PRE-EXISTING duplication this fix does not resolve, because that file is someone else's in-flight edit on
// this same branch right now; consolidating the two is a named follow-on, not this fix's own scope. @keep-comment
//
// @keep-comment THE PREFIX LIST ITSELF comes from installation-config.mjs's own `grimorioOwnedPrefixes` key
// (`.claude/grimorio-config.json`, shallow-merged with an optional local override) — CONFIGURATION, never a
// literal re-check here. `FALLBACK_OWNED_PREFIXES` below is a safe hardcoded fallback, used ONLY when the
// config fails to load at all (a missing/corrupt committed file) — this file's own FAIL-OPEN INVARIANT
// (header comment) must never let a config-loading bug turn every single grimorio spawn's own gating
// decision into a crash or a silent always-allow. @keep-comment
const FALLBACK_OWNED_PREFIXES = ["grimorio.", "project."];

function ownedPrefixes() {
  try {
    const cfg = loadInstallationConfig();
    if (Array.isArray(cfg.grimorioOwnedPrefixes) && cfg.grimorioOwnedPrefixes.length > 0) {
      return cfg.grimorioOwnedPrefixes;
    }
  } catch (_) {
    // Falls through to the hardcoded fallback below — never a crash over a config-loading failure.
  }
  return FALLBACK_OWNED_PREFIXES;
}

export function isGrimorioOwnedType(subagentType) {
  return typeof subagentType === "string" && ownedPrefixes().some((prefix) => subagentType.startsWith(prefix));
}

// The same manually maintained EXEMPT_TYPES snapshot spawn-grimorio-conduct-gate.cjs carries — a second-tier
// exemption, checked only once TIER ONE above is survived, for a `grimorio.`-prefixed target that still
// carries no `Skill` tool to act on any of this with: neither `grimorio.experimenter`, `grimorio.extract-cleaner`,
// nor `grimorio.board-writer` carries one (re-verify against a shell that has since changed before trusting
// this set). NEVER state this Set's size as a bare count — name the members; a count alone has already gone
// stale here once. Full history of this Set's own membership: ref:skill/grimorio.hooks/spawn-gates.md -> H11. @keep-comment
const EXEMPT_TYPES = new Set(["grimorio.experimenter", "grimorio.extract-cleaner", "grimorio.board-writer"]);

function deny(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
}

// ALLOW-path reminder — fires ONLY once ELEMENT 1, ELEMENT 1b, AND ELEMENT 2 are all
// present, i.e. immediately before this hook would otherwise return nothing to write. Nests correctly inside
// hookSpecificOutput (ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does's
// own "THE ENVELOPE" — a field returned at the top level parses fine and is silently ignored, no error
// anywhere), mirroring harness-lookup.cjs's own additionalContext shape in this same directory rather than
// inventing a new envelope. Per ref:repo/.grimorio/GRIMORIO-CHAIN.md#2-what-crosses-the-boundary-beyond-claudemd's
// own "Box G": a PreToolUse:Agent hook's additionalContext fires in the CALLER's own turn, before the child about to be
// spawned even exists — so this reminds the MAIN LOOP itself, on its own very next turn, never the child. Two
// reminders, both naming a rule this hook's own shape-only check structurally cannot verify was actually
// followed (main-loop-only.md rules 13 part 4 and 14) — a REMINDER, never a gate: this closes those rules'
// own "written, never observed firing" gap only as far as MECHANICAL DELIVERY, never as verification that
// either rule was actually followed this time. @keep-comment
function allow() {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext:
        "spawn-verbatim-origin-gate.cjs (H11) ALLOWED this spawn — its prompt carries a shaped verbatim " +
        "pseudo-spec (ELEMENT 1 + 1b), a coverage/viability-check instruction (ELEMENT 2), AND independent " +
        "log-based proof a grimorio.extract-cleaner dispatch ran in this session and has not since been " +
        "consumed by a later main-loop spawn (ELEMENT 3). " +
        "Two reminders before you dispatch, per main-loop-only.md rules 13-14 — this hook cannot verify " +
        "either was actually done, only remind you to confirm it:\n" +
        "1. Was the assistant-turn cleaning in this pseudo-spec actually done by a separate Haiku-tier " +
        "agent:grimorio.scout pass (rule 13 part 4) — never hand-compressed inline under pressure?\n" +
        "2. Did an independent agent:grimorio.scout coverage check already run against this drafted brief " +
        "(rule 14) — unless rule 14's own carve-out (a) or (b) applies?",
    },
  };
}

// TIER ONE — see ref:skill/grimorio.hooks/spawn-gates.md -> H11's own "TIER ONE" section. Checked
// FIRST in run(), before shouldSkipGate's own subagent-caller exemption below and before EXEMPT_TYPES or any
// ELEMENT check ever run. Its own named helper, mirroring shouldSkipGate's own shape/naming convention
// immediately below, keeps run() under skill/grimorio.javascript's 20-line function cap. @keep-comment
function shouldSkipTierOne(t) {
  return !isGrimorioOwnedType(t.subagent_type);
}

// WHEN the CALLER (not the child about to be spawned) carries `agent_type` or `agent_id` on this hook's own
// stdin ⟶ the caller is a subagent, not the top-level main loop — this hook has no effect on a subagent's own
// spawns, full stop, before EXEMPT_TYPES or either content check ever runs. See
// ref:skill/grimorio.hooks/spawn-gates.md -> H11's own "The mechanism" and "The honest limitation"
// sections for the mechanism, its live grounding, and the honest limitation it carries. This function is the
// SECOND scoping layer, called only once TIER ONE (shouldSkipTierOne, immediately above) has already let a
// grimorio./project.-prefixed target through. @keep-comment
//
// Split by BUSINESS RESPONSIBILITY into small named helpers (mirroring shouldSkipTierOne and denyMessage()'s
// own helpers in spawn-verbatim-origin-gate-deny-messages.mjs) so run() stays a short orchestrator, under
// skill/grimorio.javascript's 20-line function cap. @keep-comment
function shouldSkipGate(input, t) {
  if (input.agent_type || input.agent_id) return true;
  const subagentType = t.subagent_type;
  return typeof subagentType === "string" && EXEMPT_TYPES.has(subagentType);
}

// Computed ONCE and shared: ELEMENT 1b anchors to the SAME span ELEMENT 1 matched,
// never re-derives its own independent notion of where the quote is. ELEMENT 3 only ever evaluates once 1/1b/2
// already pass — see hasElementThree's own header comment (spawn-verbatim-origin-gate-log-checks.mjs) for why a
// crash inside it can never regress an already-correct deny into a silent allow. @keep-comment
//
// ELEMENT 1/1b — the file-based attempt ALWAYS runs first (see spawn-verbatim-origin-gate-text-checks.mjs's own
// "THE FILE-BASED ELEMENT 1/1b PATH" comment, or ref:skill/grimorio.hooks/spawn-gates.md -> H11 for the
// full design). WHEN it is satisfied ⟶ ELEMENT 1 and ELEMENT 1b both read satisfied via the file, and the
// inline prompt-text checks below (hasElementOne/hasAnchoredUserAgentLabels) never even run for this spawn.
// WHEN it is not ⟶ the inline checks run on the prompt text directly, so a prompt that never names a
// cleaned-extract path is gated on ELEMENT 1/1b exactly as if the file-based path did not exist. @keep-comment
function computeMissingElements(prompt, input) {
  const fileAttempt = tryFileBasedElementOneOneB(prompt, input);
  let missingOne;
  let missingOneB;
  if (fileAttempt.satisfied) {
    missingOne = false;
    missingOneB = false;
  } else {
    const elementOneSpan = hasElementOne(prompt);
    missingOne = !elementOneSpan;
    missingOneB = !elementOneSpan || !hasAnchoredUserAgentLabels(prompt, elementOneSpan);
  }
  const missingTwo = !hasElementTwo(prompt);
  let elementThree = null;
  let missingThree = false;
  let missingFour = false;
  if (!missingOne && !missingOneB && !missingTwo) {
    elementThree = hasElementThree(input);
    missingThree = !elementThree.satisfied;
    if (!missingThree) {
      missingFour = !hasElementFour(prompt, input, elementThree.cleanerMs, fileAttempt).satisfied;
    }
  }
  return { missingOne, missingOneB, missingTwo, missingThree, missingFour, elementThree, fileAttempt };
}

// The exported entry point the thin `.claude/hooks/spawn-verbatim-origin-gate.cjs` dispatcher calls with the
// parsed stdin payload. Returns the envelope object to write to stdout, or `null`/`undefined` when nothing
// should be written at all (a non-Agent tool call, a scoping exemption) — the dispatcher itself performs the
// actual `process.stdout.write`/exit, never this function. @keep-comment
export function run(input) {
  if (!input || !input.tool_name || input.tool_name !== "Agent") {
    return null;
  }
  const t = input.tool_input || {};
  // TIER ONE — see shouldSkipTierOne's own comment above. Checked first, before shouldSkipGate's own
  // subagent-caller exemption and before EXEMPT_TYPES or any ELEMENT check ever run.
  if (shouldSkipTierOne(t)) {
    return null;
  }
  if (shouldSkipGate(input, t)) {
    return null;
  }
  const prompt = String(t.prompt || "");
  const { missingOne, missingOneB, missingTwo, missingThree, missingFour, elementThree, fileAttempt } =
    computeMissingElements(prompt, input);
  if (!missingOne && !missingOneB && !missingTwo && !missingThree && !missingFour) {
    return allow();
  }
  if (missingFour && !missingOne && !missingOneB && !missingTwo && !missingThree) {
    return deny(
      [
        "spawn-verbatim-origin-gate.cjs BLOCKED this spawn: rule 14 own independent coverage check has not run against this drafted brief (ELEMENT 4).",
        "",
        "MISSING ELEMENT 4 — the brief you are about to send was drafted by YOU, choosing what to keep and what to drop from the CEO own multi-turn request. Nothing has checked that it covers every clause. Raise agent:grimorio.scout FIRST, with the word coverage in its description, handing it (a) the pseudo-spec above and (b) this drafted brief, and asking which clauses read UNCOVERED. Rewrite the brief for every uncovered clause, then send it.",
        "",
        "This gate does NOT judge coverage — that judgement needs a reader, which is the scout. It checks only that the reader RAN, the same way ELEMENT 3 checks the synthesizer ran.",
        "",
        "Carve-outs, both mechanical and already applied: a pseudo-spec whose whole clause-window (every user: turn's own body, read from the cleaned-extract file when one is named, never from compressing turns into one hand-typed user: block) reduces to a single clause has no correction chain to lose, and a grimorio.delegate target is gated by flow-delegation own pre-flight.",
        "",
        "IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, DELETE IT — do not work around it. Remove hasElementFour own call in computeMissingElements and this branch.",
      ].join(String.fromCharCode(10)),
    );
  }
  return deny(denyMessage(missingOne, missingOneB, missingTwo, missingThree, elementThree, fileAttempt));
}
