# HOW TO WRITE `CLAUDE.md` — it is a prompt that is paid for on EVERY turn (HARD RULE, CEO, 2026-07-30)

This is a companion to import:skill/grimorio.agent-writing#the-split-principle--the-agent-is-who-it-is-the-skill-is-what-it-does. Read it before adding, editing, or auditing any entry in `CLAUDE.md`.

## The POINTER is the part everyone writes wrong (CEO, 2026-07-30, translated)

His diagnosis, about the whole file rather than one rule: *"CLAUDE.md is full of clauses. There's a bunch of
clauses that tell you 'read this skill'. You clearly haven't written them well."* Measurable: `CLAUDE.md`
carried **24 pointers**, all the same shape:

```
-> <a description of what lives over there>: **`skill`**.
```

**That is a BIBLIOGRAPHY ENTRY, not an instruction** — it answers *"where can I read more?"* instead of *"what
must I do before acting?"* Three properties, each independently sufficient to guarantee it is never read:

| Property | Why it fails |
|---|---|
| It describes CONTENT, not a PRECONDITION | a citation is consulted, never obeyed |
| It sits at the END of its section | by the time you reach it you have the gist and you move on |
| All 24 look identical | uniformity destroys salience — if everything is an arrow, nothing is mandatory |

**The rule: separate MUST-LOAD from may-consult, and write them in different shapes.**

- **MUST-LOAD** — the skill is a PRECONDITION for the action. Write it as an imperative, with the tool call
  named, at the TOP of the section, and say what goes wrong without it:
  `**Skill(x) — run it, read it, THEN do Y.** Without it you pick by habit. <the measured failure>.`
- **may-consult** — depth for someone already doing the thing. Keep the arrow, keep it at the end. This is the
  right form for MOST of them; the defect was never that arrows exist, it is that everything was one.

**The test, and it is mechanical:** if the clause were deleted, would the reader still do the right thing?
- Yes → it is depth. Arrow, at the end.
- No → it is a PRECONDITION. Imperative, at the top, and **it needs a mechanism, not a firmer sentence.**

Prose alone cannot enforce a precondition: the ref:skill/grimorio.agent-selection#hard-rules-of-invocation-mirrored-as-triggers-in-claudemd--agent-selection rule was stated in `CLAUDE.md` AND
injected on every single spawn, and was still never loaded — only a mechanism that actually REFUSED the
violating spawn changed the behaviour. That mechanism was later retired, and the rule reverted to prose
alone — measured unenforced again once it was gone. When the answer to the test is "no", ask immediately what
refuses the action; if nothing can, say so plainly rather than escalating the wording, and do not treat "add a
hook" as the default answer — a hook is the CEO's last-resort call, not this skill's. **A rule that has been
re-worded twice and still is not followed is not under-written; it is unenforced.**

`CLAUDE.md` is not documentation. **It is a prompt, prepended to every single turn, and it reaches the parent and
every child identically.** So its cost is paid constantly and its audience is everyone — which fixes its form
completely.

## The shape of an entry: TRIGGER, REASON, POINTER. Three lines, not thirty.

```
## <When this fires> (HARD RULE, who, date)
<The instruction, one or two sentences.> <The one-line reason it exists.>
-> Read **`<skill>`** → "<section>" before acting. <What lives there.>
```

That is the whole form. **Everything else belongs behind the pointer** — the routing table, why the wrong choice feels right, the incident, the worked example, the failure count — matters only to someone about to do that specific thing, read *once, then*, instead of on every turn forever.

## The test, and it is mechanical

**"Who reads this line, and when?"** Read by everyone, needed to decide *whether to act* → it stays. Needed only *while doing* the thing → **behind the pointer.** Needed only if you are the CHILD → **the agent's own identity**, never here — this file reaches parent and child identically, so "if you are the child…" is dead text for one of them.

## The failure, measured

Inlined depth is paid on every turn, by everyone, forever. A routing table, a "why the wrong pick feels right" set of explanations, and an identity clause once landed inline here instead of pointed at ref:skill/grimorio.agent-selection#before-you-route-anything-read-the-capabilities-ledger, which already owned that content — trimming to a pointer lost nothing (the depth was still one hop away) and stopped the per-turn cost. **The rule was already in this file's own header** — *"it holds the TRIGGERS; the DEPTH lives in the named skill"* — and was violated by the person who had just read it: the header alone isn't enough, which is why the FORM is written down here.

## Retroactively, too

Applies to what is already written, not only the next entry. When you touch a `CLAUDE.md` section for any reason, check it against the form — if it explains, enumerates, or narrates an incident, that content has an owning skill and belongs there. **Do not do a whole-file rewrite as a task** — trim the section you are already in.

## Same rule, other files

The four-level split (ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code) is this same principle: the spawn hook may carry only what must be decided BEFORE the agent exists; an agent's behavior file holds behavior, its skill holds knowledge. **Every one of these is the same question — who reads this, and when — and each was broken at least once in a single session by inlining depth into the always-loaded layer.**
