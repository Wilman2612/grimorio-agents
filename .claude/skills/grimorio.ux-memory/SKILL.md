---
name: grimorio.ux-memory
description: "Semantic memory for the adversarial UX critic. SKILL.md (general) = universal UX principles, the design canon (Norman, the Laws of UX, Refactoring UI, WCAG) with checkable thresholds, and the Nielsen heuristics evaluation framework, used to tear down rendered UI. For this project's design system and conventions (project/code) read ./project.md and ./project.design-context.md."
---

# UX Memory — General: Universal UX Principles

> In grimorio the `ux` agent is an **adversarial critic**: it does not author specs — it tears down the UI already rendered in Storybook. This skill gives it the evaluation framework. The `ux-review.md` output format lives in ./behavior.md → `## OUTPUT`.

## Principles (project-agnostic)

- **Named states are test targets**: every screen state must have a name. An unnamed state cannot be evaluated — if the brief named `loading/empty/error/happy`, each must exist as a Story.
- **State completeness over happy path**: `empty` must look distinct from `loading`; `error` must offer a way out; the happy state must be real (not skeleton-forever). The error/empty states are where design breaks most.
- **No decorative complexity**: no modal where a page works, no wizard where one form works. Every element on screen must earn its place.
- **Consistency over novelty**: new screens match the existing visual and interaction patterns. A pattern absent from the codebase AND violating platform convention is a failure, not a feature.
- **Reuse over reinvention**: before flagging a component as new, assume an equivalent already exists. Inventing a new visual pattern when one exists is a finding.

---

## Design Canon — the authorities that ground a verdict (not taste)

A finding must cite a **principle**, not a preference — the same role the architecture canon plays for the
architect. Use these to turn "this feels off" into "this violates X".

**Foundational interaction design — Norman, *The Design of Everyday Things***
- **Affordance / signifier**: a control must LOOK like what it does — a button looks pressable, a link
  clickable, a draggable node draggable. A clickable thing with no signifier (no hover, no cursor change, flat) is a defect.
- **Mapping**: the control↔effect relationship should be natural (a value slider raises going up/right).
- **Feedback**: every action gets immediate, visible feedback. Silence after a click is a defect.
- **Constraints**: make the wrong action hard/impossible (disable, don't merely warn).
- **Conceptual model**: the UI must teach a correct mental model of what is happening.

**The Laws of UX — the quantitative, checkable laws** (these turn design into engineering):
- **Fitts's Law**: acquisition time grows with distance, shrinks with size → primary actions large and near
  the likely cursor path; **click/touch targets ≥ 44×44 px**; never tiny/crowded hit areas.
- **Hick's Law**: decision time grows with the log of the number of choices → cap visible options; segment /
  group / progressively disclose. A wall of >7 equal choices is a finding.
- **Miller's Law**: ~7±2 items in working memory → chunk long lists/forms into labeled groups.
- **Jakob's Law**: users expect it to work like the other apps they use → honor convention; novelty without a reason is a finding.
- **Doherty Threshold**: keep response under ~400 ms or show progress — feedback latency is a UX defect, not just perf.
- **Aesthetic–Usability Effect**: polished UI is perceived as more usable → visual craft changes perceived function; it is not optional gloss.
- **Tesler / Peak-End / Serial-Position**: inherent complexity must live somewhere — don't push it onto the
  user; users judge an experience by its peak and its end; first/last items are remembered best.

**Visual craft — *Refactoring UI* (Wathan & Schoger) + Gestalt** — checkable fundamentals:
- **Hierarchy by weight/size/color, not position alone** — the most important thing is visually loudest;
  de-emphasize secondary content (lighter, smaller) instead of shouting everything.
- **A spacing SYSTEM** (a consistent 4/8-px scale), not ad-hoc margins; whitespace groups and separates
  (Gestalt: proximity, common region, similarity).
- **A type SCALE** (a few deliberate sizes/weights), generous body line-height, line length ~45–75 chars.
- **A restrained palette** with one accent; semantic colors (success/warn/danger) distinct from the accent; never state-by-color-alone.
- **Fewer borders** — separate with spacing, background, or shadow before drawing a line.

**Accessibility — WCAG 2.x (pass/fail thresholds, not opinions):** body-text contrast **≥ 4.5:1** (large ≥ 3:1);
a **visible focus state** on every interactive element; full keyboard operability; state never conveyed by color alone; targets ≥ 44 px.

**Usability — Krug, *Don't Make Me Think***: the UI must be self-evident and scannable; a user should never stop to decode what a control is or where they are.

**Responsive & mobile-first:** design the **smallest viewport first** (content priority, single column,
thumb-reachable primary actions), then progressively enhance upward — never desktop-first-then-crammed. Fluid
layouts (flex/grid, %, min/max, relative units); **breakpoints driven by where the CONTENT breaks**, not device
names. No **hover-only** affordances (must work on touch); wide content (tables, canvases, code) scrolls inside
its own `overflow-x` container so the page body never scrolls sideways. The mobile layout is a **first-class
named state**, not an afterthought — evaluate it explicitly.

-> GROUND every finding: "the run button is a 20 px flat text link — Fitts + missing affordance: too small, no
   pressable signifier", NOT "the button feels weak". A finding without a cited principle is taste. This canon
   is also what the **agent:grimorio.ui-developer builds TO** (via ref:skill/grimorio.frontend-development) — build to it, don't just critique against it.

-> deeper: **./project.component-reference.md** — the technified COMPONENT & systems canon (primary-sourced,
   entropy-reviewed): the required-state matrix + focus geometry, target-size numbers, the M3 motion
   duration/easing table, design-token tiers, APCA + dark-mode rules, Atomic Design. Load it when reviewing or
   building a specific component (button/input/modal/…), motion, tokens, or dark mode. It tags each WCAG
   criterion `[AA-floor]` (a real defect) vs `[AAA-aspire]` (a goal, never a defect).

-> deeper: **./project.premium-aesthetics.md** — the POC→PREMIUM criteria that survived adversarial
   verification (systematic HSL color, de-emphasize-to-emphasize hierarchy, one unified design system,
   leaderboard viewer-row-pin) + the EMPIRICAL/computable ones (Rosenholtz clutter metrics, CIELAB two-color
   harmony, NIMA aesthetic scoring, 50 ms first-impression) + debunked myths (golden ratio). Honest: "premium"
   is ~20% these criteria + ~80% committed craft/identity (Esports-premium, see ./project.design-context.md).

---

## Nielsen Heuristics — the evaluation framework

Apply as reasoning tools, not a checkbox list. A design that satisfies one heuristic but violates another is still a bad design.

| # | Heuristic | What to attack |
|---|---|---|
| H1 | Visibility of System Status | Does every async operation show feedback (loading, progress, confirmation)? |
| H2 | Match System to Real World | Labels in the user's language? No jargon, no raw internal IDs? |
| H3 | User Control and Freedom | Can the user undo/cancel/go back from every screen? No dead ends? |
| H4 | Consistency and Standards | Do new screens match existing patterns and platform conventions? |
| H5 | Error Prevention | Are destructive actions behind a confirmation? Inputs validated before submit? |
| H6 | Recognition over Recall | Is context visible on screen, or must the user remember it from a prior screen? |
| H7 | Flexibility and Efficiency | Works for both first-time and experienced users? |
| H8 | Aesthetic and Minimalist Design | Is every element necessary? Does noise compete with primary content? |
| H9 | Help Users Recover from Errors | Plain-language messages with a suggested action — no raw error codes? |
| H10 | Help and Documentation | Self-explanatory UI, or inline help where it isn't? |

**Priority**: H1, H3, H4, H5, H9 are almost always relevant. H7, H10 are lowest unless the feature is complex.

**Interaction-state rule** (from H4 + H6 + H8): feedback for any state (loading, recording, streaming, error) must appear at the **same spatial level** as the element that owns it. Adding a status element elsewhere to describe the state of an element here fails multiple heuristics at once.

**Anti-patterns**: running heuristics as a rubber-stamp checklist (each is a genuine question); letting a failing heuristic survive because another passes (all 10 must pass or be N/A with a reason).

---

## Component Inventory Lens (for the critic)

When reviewing new UI, check whether new visual patterns were invented where existing ones existed. Two components are the same unless they differ in **layout behavior**, not just styling — a styling variant is not a new component. If more than half of the new UI looks net-new, the codebase probably wasn't searched. Flag invented duplicates as findings.

-> This project's design system (component names, tokens, patterns): read ./project.md and ./project.design-context.md
-> The `ux-review.md` output format: ./behavior.md → `## OUTPUT`
