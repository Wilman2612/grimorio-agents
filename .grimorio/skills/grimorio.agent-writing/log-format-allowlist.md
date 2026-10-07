# Log-Format Allowlist — the Currency mechanization, in full

This is a companion to import:skill/grimorio.agent-writing#quality-standards-for-agents → "Currency (write the
FINAL state, never interleave the superseded)". Currency states the PRINCIPLE — this file states the MECHANISM:
what the enforcing check detects, and the one narrow population exempt from it.

## Why this exists — CEO-authorized, PREVENT + DETECT + ALLOWLIST

Relayed, per grimorio-conduct rule 11 (not independently re-quotable beyond this): stop changelog-style prose (a
statement narrating what changed, what it supersedes, or why an earlier version was wrong) from living in files
that are supposed to state current truth, DETECT it cheaply at diff-time, and declare an EXPLICIT LEDGER
ALLOWLIST for the narrow set of files where history genuinely is the job — reaching every file in the project:
the code, the prompts, the texts, everywhere.

## Where this is enforced

`agent:grimorio.code-reviewer`'s own Hunt list applies the detection below as a first-pass MECHANICAL candidate
flag against a diff's added lines outside the allowlist, then reads the flagged span before ranking it as a
finding — never a mechanical hit alone. This is what closes the false-positive class a blind regex cannot: a
faithful quotation of these exact phrases (a transcript, a discussion of this very rule) reads as data to a
reader, never as changelog-style assertion in a governed file. A reviewer reading the diff, rather than a hook
keyed to a specific tool, also closes the enforceability gap a tool-matcher can always be routed around.

This is reached automatically wherever a review already gates the diff before it ships — ref:repo/.grimorio/scripts/pre-push.sh's
own GUARDED-path requirement (`.claude/`, `scripts/`, `objectives/`, `CLAUDE.md`), and the ordinary REWORK-cycle
gate every feature diff already passes through before SHIP — never a mechanism of its own.

A second, independent lane — reviewer judgment only, no mechanical pass, no date requirement — is stated below
("A second, independent detection") and enforced by the SAME Hunt item 12, as its own separate sub-clause.

## Detection

Kept in a fenced block so this file does not itself read as a live violation under `grimorio.code-reviewer`'s
own Hunt item 12:

```
marker: [LOG-NOTE]

phrases (co-occurring within a bounded window with a date or an attribution pattern nearby):
"no longer valid", "superseded by", "superseded,", "this corrects", "this modification invalidates",
"got it wrong", "an earlier version", "previously claimed", "previously stated", "corrected ("
```

**WHEN you need to reference the marker or a phrase above literally, anywhere in your own output ⟶ ALWAYS quote
it inside a fenced code block, never in live prose** — a fenced or quoted span reads as DATA under
`grimorio.code-reviewer`'s own ASSERT-vs-QUOTE/DESCRIBE test (Hunt item 12), never as this file's own live
assertion, and that reading is what actually avoids triggering a future review; nothing here mechanically
strips fenced code the way the old hook's `stripFenced()` did — it is the reviewer's own judgment call, not a
deterministic filter.

## A second, independent detection — reviewer judgment, no keyword or date needed

The detection above only fires when one of its ten phrases sits inside its own bounded window of a date or an
attribution pattern. That window is exactly why it never catches a sentence narrating decision history in
language the list never anticipated, with no date anywhere near it — and no fixed phrase list ever will
anticipate every way that narration gets phrased. Left uncaught, this class of sediment ships past review
completely undetected: the only mechanism reaching this file's own claims today is the one this gap exempts it
from by construction.

**WHEN a sentence, anywhere in a file OUTSIDE the SAME EXPLICIT LEDGER ALLOWLIST below, narrates what a prior
design, a prior ruling, or whoever relayed a ruling judged, decided, or got wrong — regardless of its exact
wording, and regardless of whether a date or an attribution sits anywhere near it ⟶ treat it as ledger content,
not something to leave where it sits.** **NEVER treat this as a mechanical candidate pass** — no phrase list is
proposed or implied for this class, because a fixed list can never anticipate every future phrasing of "the
prior design was wrong about X." Apply it by reading the sentence and judging what it is doing, never by
matching it against anything.

**ALWAYS move flagged content to the file's own ledger destination — the SAME named allowlist below, never a
second list — IN FULL.** **NEVER leave a rephrased, generalized, or anonymized trace of it behind in the
non-ledger file, not even as a negative example.** This is stricter than the detection above's own logic, which
tolerates a QUOTE/DESCRIBE reading surviving in place (a transcript, a discussion of the rule itself, read as
DATA under `grimorio.code-reviewer`'s own ASSERT-vs-QUOTE/DESCRIBE test): this class tolerates none of that
inside the non-ledger file — the content moves, whole, or it does not survive review.

-> Enforced at `agent:grimorio.code-reviewer`'s own Hunt item 12, as a second, independent lane alongside the
mechanical pass above: ref:agent/grimorio.code-reviewer/behavior.md#hunt-for-these-specifically (item 12).

## The EXPLICIT LEDGER ALLOWLIST — a NAMED LIST, never inferred from a file's own content or apparent purpose

Chosen over in-file self-declaration because it mirrors this repo's own existing
ref:repo/.grimorio/scripts/refobl/governance.cjs precedent (a hardcoded, fail-closed pattern set) and stays cheap and
deterministic:

```
.claude/ceo-requests.md
.grimorio/memory/grimorio.board-memory/grimorio-defects.md
.grimorio/memory/grimorio.board-memory/grimorio-backlog.md
BACKLOG.md
.grimorio/memory/grimorio.po-memory/project.features-status.md
objectives/**  — the WHOLE FILE, anywhere under objectives/, not scoped to only its ## Log section: a branch
objective file's own ## Log section is the PRIMARY reason the exemption exists (the historical record), but the
code exempts the directory whole, because directory-level exemption is cheaper and simpler than section-level
parsing, and an objective file is a working/process document throughout, not only in its Log section — this
also covers objectives/measurements/
**/provenance.md  — a per-design-family pattern, not a single path
**/*quasi-software-view*.md  — a per-agent design-family pattern, not a single path — the trailing `*` before
`.md` is deliberate, not `**/*quasi-software-view.md`: it also covers an OPTIONAL Layer-3/INTERNAL companion
file of the same family (e.g. `*-quasi-software-view-internal.md`), never only the exact base name. Sanctioned
as a ledger destination by ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-5-content-guardrails.md's
own step 5b, so a quasi-software-view's own decision-history layer (its KNOWN-ERRORS/review-history record) is
exempt wherever the file actually lives
.grimorio/skills/grimorio.hooks/project.*.md  — matches exactly the five WHY/history companion files
`grimorio.hooks/SKILL.md` charters as the sole destination for what is ULTERIOR to the code — CEO rulings,
measured incidents, retired designs — never `SKILL.md` itself, which does not start with `project.`.
Sanctioned as a ledger destination by ref:skill/grimorio.hooks/SKILL.md's own placement-test/companion-file
section, so each companion's own decision-history content is exempt wherever it lives — the same justification
pattern as the `**/*quasi-software-view*.md` entry above, not a self-declaration this list accepts on faith
.claude/.cache/*.log and *.jsonl  — machine logs
```

## Maintenance — this list is `grimorio.system-keeper`'s own to keep current

The only agent permitted to edit a governed file per grimorio-conduct rule 20. **WHEN `grimorio.code-reviewer`'s
own Hunt item wrongly flags a genuinely new, self-declared ledger file ⟶ that flag IS the signal this list has
gone stale — route the addition through `grimorio.system-keeper` rather than arguing around the finding in
review.**
