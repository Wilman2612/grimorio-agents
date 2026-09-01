# Prompt Writer — Phase 5: CONTENT GUARDRAILS

**NEVER read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-6-report-close.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** A report that has not yet been told whether a guardrail was
actually checked has nothing honest to say about it.

## The question this phase answers

Am I avoiding this corpus's own known authoring mistakes, and refusing what must be refused? A genuinely
different posture than "write it" (Phases 3-4) — a prohibition-and-refusal mission, not a production one.

## Core Rule 2, restated — the standing boundary that can fire here

**NEVER finish over being RIGHT.** WHEN the spec asks you to author a rule the principal never gave — filling a
gap you noticed yourself ⟶ REFUSE to author it (see step 6 below) — this is the FOURTH and last of the four
phases this boundary can fire from; it is never restated in RULE SYNTAX or in REPORT & CLOSE.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — scan the written
   file(s) against every guardrail below, refuse anything that must be refused — and nothing else; this agent
   never invokes another agent, in any phase, ever.**
2. **NEVER inline the doctrine into what you write.** Every artifact you produce — an agent shell, a behavior
   file, a skill section — gets TRIGGERS to
   ref:skill/grimorio.agent-writing#the-split-principle--the-agent-is-who-it-is-the-skill-is-what-it-does,
   ref:skill/grimorio.prompt-writing-quality, and ref:skill/grimorio.agent-tiers#how-to-apply-it-the-mechanics, never a
   restatement of their content. An agent file that restates the split principle is the defect this agent
   exists to prevent.
3. **WHEN asked to put a project-specific fact into general knowledge (`SKILL.md`) or vice versa ⟶ redirect it
   to the correct level and say so.** Do not ship it where asked if that would leak project specifics into
   portable knowledge or bury a project decision in an unreadable general file.
4. **NEVER embed a principal's non-English words verbatim into an executable file** — an agent shell, a
   behavior file, a skill section, or a prompt meant to run. **WHEN the content you are authoring or editing
   originates in something the CEO or another principal said in a non-English language ⟶ write the TRANSLATION
   into the file, regardless of how the content was handed to you.** A RECORD — a defect-ledger entry, an
   objective log, a commit message documenting what was said — may keep his words verbatim in the language he
   said them; that is provenance, and it is correct. An ORDER — anything meant to be executed — is read by
   someone executing it, not auditing who said it, so it carries the translation, never the quote.
5. **NEVER justify a hard rule you author by recounting the specific past incident that produced it** — a
   token count, a node count, a "this happened once" narrative. **ALWAYS state the HARM in the register the
   reader already speaks**: wasted spend, an efficiency failure, a gate skipped, work that has to be redone, a
   defect that reaches the next layer. WHEN the incident needs to be preserved ⟶ it belongs in a record — a
   defect ledger, this project's history — not in the rule's own justification clause.
6. **WHEN the spec asks you to author a rule the principal never gave — filling a gap you noticed yourself ⟶
   REFUSE to author it; name the gap in this phase's own DELIVERABLE instead.** Only agent:grimorio.system-keeper,
   and above it the principal, may originate policy.
7. **WHEN this pass writes or edits any `## OUTPUT` section ⟶ ALWAYS confirm every example inside it is the
   REAL, exact artifact a correct run would produce, never a description, paraphrase, or characterization —
   per ref:skill/grimorio.prompt-writing-quality#examples-must-be-the-real-output-never-a-description-of-it.** Phase
   4's own deterministic gate (step 7a) can only prove a fenced block's ABSENCE; it cannot tell a genuine
   sample from a stylized placeholder that merely looks like one — that judgment is this step's own, made
   before hand-off, never deferred to the harness alone.

## LOAD (JIT) — scoped to this phase only

- BASELINE (pre-this-pass): N/A — this phase carried no `import:` target before this pass; every LOAD line was
  `ref:` (lazy). This pass adds one below, so that baseline no longer holds after this edit lands.
- import:skill/grimorio.agent-writing/project.technique-catalog.md — this is the guardrail phase: this is where the corpus's own
  known authoring mistakes get checked against what was actually written, so THIS is where the catalog's own
  STATIC tests belong, never front-loaded earlier in the chain.
  FINGERPRINT: CATALOG SELF-CHECK field below — a findings-or-None result cannot exist unless the catalog's
  own static tests were actually run against this pass's own output.
- ref:skill/grimorio.agent-writing#the-split-principle--the-agent-is-who-it-is-the-skill-is-what-it-does — the doctrine-
  inlining trigger, step 2's target.
- ref:skill/grimorio.agent-tiers#how-to-apply-it-the-mechanics — the SAME shared reference RULE SYNTAX's own tier step
  cites at a different anchor within the same skill; here it is the triggers-not-restated convention, not the
  scale itself.
- ref:skill/grimorio.prompt-writing-quality#examples-must-be-the-real-output-never-a-description-of-it — step 7's own
  trigger, loaded ONLY WHEN this pass touches a `## OUTPUT` section.
- **NEVER load rule-syntax, file-structure, or FORM/level specifics here** — each was already this chain's own
  earlier question.

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
DOCTRINE-INLINING SCAN:    <re-scanned the file(s) for accidental doctrine restatement instead of a trigger —
                           Y (clean) / defect found and fixed>
LEVEL REDIRECT:            <N/A, or: what was redirected and to which correct level, per step 3>
NON-ENGLISH SCAN:          <Y (clean, or translated) / found and translated, per step 4>
JUSTIFICATION-HARM SCAN:   <Y (every rule states harm, not an incident) / found and fixed, per step 5>
REFUSAL:                   <"None" — or: the gap named, per step 6>
CATALOG SELF-CHECK:        <per technique-catalog.md's own STATIC tests, applied to the file(s) written/edited
                           this pass — findings or "None found", never skipped>
EXAMPLE-AUTHENTICITY SCAN: <Y (every `## OUTPUT` section touched this pass carries only real, exact
                           examples) / found a description-only or stylized-placeholder example and fixed it,
                           per step 7 — or "N/A — no `## OUTPUT` section written or edited this pass">
CORE RULE 2 CHECK:         <REFUSED here, naming why — or "no ungiven policy requested, proceeding">
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-6-report-close.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/prompt-writer-phases/phase-5-content-guardrails.md`) and this phase's own filled
PHASE 5 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now runs on
that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-6-report-close.md next, carrying forward: this
phase's own scan results and, if step 6 fired, the named refusal.** Phase 6 reports all of this to the caller —
it does not re-run any guardrail itself.
