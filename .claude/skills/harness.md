# Skills — almost everything here is a PROMPT, and it is checked as one

**ALWAYS treat a file under this tree as a PROMPT** — text a model reads to ACT — **UNLESS it sits
under a `docs/` directory**, which holds RECORDS: research, references, measured runs, prior art. A
record influences through its FACTS and carries no authoring standard; a prompt influences through its
WORDING and carries all of it.

**WHEN you cannot tell which one you are editing ⟶ apply the REWRITE TEST.** Hold every fact constant
and reword the passage. If BEHAVIOUR could change, it is a PROMPT. If only the prose changed, it is a
RECORD.

**ALWAYS apply that test per SECTION, never per file.** A prompt file legitimately contains sections
that are not instructions — the evidence behind a rule, a worked example, the incident that earned it.
**NEVER force an opener onto one of those.** A measurement written as `ALWAYS the count was 258` is
nonsense, and a checker that demands it will teach you to write nonsense to satisfy it.

## CHECK — answer these before you finish the edit, not after

**BEFORE you report this edit done ⟶ answer all five out loud.** They are past tense on purpose: each
names an omission the rule alone has already failed to prevent in this repo.

1. **Did every clause I added open with ALWAYS / NEVER / BEFORE / WHEN — or CHECK?** A bolded sentence
   with no opener is prose, and the reader owes prose nothing. This is the exact defect the CEO caught
   in `grimorio.prompt-reading/SKILL.md` on 2026-08-09: a file about how rules bind, written without any.
2. **Did every conditional carry `⟶`?** `WHEN <trigger> ⟶ <action>`, never a colon, never `→`.
3. **Did I remove, supersede or relocate something — or is this diff pure ADDITION?** A file that only
   grows is a file nobody is maintaining.
4. **Does every path I wrote carry its `relation:store/path` prefix?** A bare path cannot say whether
   it is a dependency, a pointer, or proof.
5. **Did I state the same fact twice?** Two copies drift, and only one of them gets corrected.

**WHEN this file passes ~500 lines ⟶ split it by TOPIC, trim it, or state IN the file why it earns its
size.** All three are legitimate; leaving it flagged is not.

-> The craft and the audit lenses: import:skill/grimorio.prompt-writing-quality
-> What each construct obliges a READER: import:skill/grimorio.prompt-reading
