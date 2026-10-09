# Component & Systems Canon (technified) — general reference for ref:memory/grimorio.ux-memory

_Companion to import:memory/grimorio.ux-memory. It EXTENDS the principles-level Design Canon (Norman, Laws of UX,
Refactoring UI, WCAG, Nielsen) with component- and systems-level specifics. Every spec is grounded in a PRIMARY
source and survived 3-vote adversarial verification across two research passes (forms/tokens/color;
states/buttons/motion/atomic) plus an entropy pass. The critic CITES these; the `ui-developer` BUILDS to them.
**NET-NEW** specificity is marked; where a line only restates the principles canon it says "cross-reference,
don't restate". Contested and un-sourceable points are flagged, not hidden. The raw sourced research lives in
LOST: documentation-memory (deleted 2026-10-04, recoverable at f942b355) (design-systems reference)._

---

## 0. Conformance target — read FIRST (fixes the AA/AAA ambiguity)

**The project targets WCAG 2.2 level AA as the pass/fail FLOOR.** A critic files a defect only against an
`[AA-floor]` criterion; `[AAA-aspire]` criteria are goals, not gates — cite them as "nice-to-have", never as a
"must". Below, every WCAG success criterion is tagged. (So: the 480 px² focus-area math is `[AAA-aspire]` — do
NOT flag a control as broken for missing it; a visible focus ring that meets `[AA-floor]` 2.4.7 + 1.4.11 is
conformant.)

## 1. Component interactive states — the required-state matrix (NET-NEW)

Every interactive component must implement its full set of states; a missing state is a defect, not a nicety.
Material 3 defines states as "visual indicators used to communicate the status of a component" (m3.material.io/
foundations/interaction/states). The required set a critic checks and a builder ships:

**default · hover · focus-visible · active/pressed · disabled · loading · error · selected** (as applicable).

**This IS the Storybook-named-states checklist.** Each applicable state above must exist as a named Story — the
project's "a state without a name can't be evaluated" rule and this state matrix are the same discipline.

**State precedence when states combine** (decide it, don't leave it to chance — Material 3 / Carbon):
**disabled overrides ALL interactive states** (a disabled control shows no hover/active/focus response);
**error + focus** both render (error styling persists, focus ring on top); **loading** blocks re-trigger (acts
disabled-for-input while showing progress). A component that shows hover on a disabled control is a defect.

- **focus-visible is standards-MANDATED, not optional** (this is where states become pass/fail):
  - **WCAG 2.4.7 Focus Visible `[AA-floor]`** — a visible keyboard-focus indicator must exist.
  - **WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum) `[AA-floor]`** — a focused component must not be *entirely*
    hidden by author content (sticky headers/footers are the usual violators). _(w3.org new-in-22)_
  - **WCAG 2.2 SC 2.4.13 Focus Appearance `[AAA-aspire]`** — quantifies the indicator: area ≥ a **2 CSS-px-thick
    perimeter** of the component, AND **≥3:1 change-of-contrast** between the same pixels focused vs unfocused
    (distinct from adjacent-contrast 1.4.11). Area formulas: rectangle `4h+4w`, circle `4πr`, rounded-rect
    `4h+4w−(16−4π)r`; worked example — a 90×30 px control needs **≥480 px²** of indicator. Aspire to it; do NOT
    gate on it. _(w3.org/TR/WCAG22 + Understanding/focus-appearance)_
  - **Reference implementation (primary):** GOV.UK's focus state = yellow background + thick black bottom border,
    which meets **SC 1.4.11 Non-text Contrast `[AA-floor]`** on any of its backgrounds. _(design-system.service.gov.uk)_
- **disabled**: clearly non-interactive. **WCAG 1.4.3 EXPLICITLY EXEMPTS inactive/disabled components from the
  4.5:1 contrast requirement** — do NOT chase 4.5:1 on a disabled control, and do NOT file a finding for a
  low-contrast disabled state. Convention: reduced opacity / muted token, visibly "off", no interactive feedback.
- **loading**: show progress at the right threshold (Nielsen's response limits) — **<0.1 s** feels instant (no
  indicator); **<1 s** keep flow (subtle/none); **≥1 s** show a determinate/indeterminate indicator; **≥10 s**
  give an escape + ETA. Ties to the canon's Doherty <400 ms + Nielsen H1.
- **error** must live at the **same spatial level** as the field it describes (the canon's interaction-state rule).
- OPEN ITEM (not verified): the exact **M3 state-layer opacity values** (commonly cited hover 8% / focus 10% /
  pressed 10% / dragged 16%) were NOT independently primary-sourced — treat as indicative, verify against
  m3.material.io before quoting a number.

## 2. Target size — the contested 24 vs 44 vs 48, resolved (NET-NEW numbers; overlaps the canon's Fitts ≥44)

The authorities differ because they answer different questions — state the source with the number:
- **WCAG 2.2 SC 2.5.8 Target Size (Minimum) `[AA-floor]` = 24×24 CSS px** — measured by fitting a solid 24×24
  square wholly inside the target. Five exceptions: **Spacing** (a 24px-diameter circle on each target doesn't
  intersect another), **Equivalent** (an adequate-size alternative exists), **Inline** (within text flow),
  **User-Agent** (browser-sized), **Essential**. _(w3.org WCAG22 Understanding/target-size-minimum)_
- **WCAG 2.1 SC 2.5.5 Target Size (Enhanced) `[AAA-aspire]` = 44×44 CSS px.**
- **Platform HIG:** Apple **44×44 pt**, Material **48×48 dp** minimum touch target.
- **THE ONE CHECKABLE RULE (use this):** *interactive targets ≥44×44 px (build target, = the canon's Fitts
  rule); 24×24 px is the absolute AA floor never to cross — below 44 only with a 2.5.8 exception (adequate
  spacing, an equivalent control, or inline-in-text).* `[AA-floor: 24]` · `[build-target: 44]`. This REFINES,
  not duplicates, the existing "≥44×44 px" canon line.

## 3. Buttons — hierarchy + label + destructive

- **Hierarchy tiers** (Material 3 / Apple converge): filled/primary · tonal · outlined/secondary · text/ghost ·
  (elevated). **One primary action per view** (ties to Refactoring UI hierarchy + Hick's Law in the canon).
- **Labels:** verb-first, action-naming ("Publish", "Start match"), sentence case as the modern default.
  Contested: uppercase (older Material) vs sentence case — DEFAULT sentence case (legibility), flag as a taste axis.
- **Destructive actions** = a distinct danger/error color role + confirmation for irreversible actions (ties to
  Norman "constraints" + Nielsen H5). This IS a documented design-system pattern: **Shopify Polaris `critical`
  variant** and **IBM Carbon `danger` button** both codify it. _(An "Apple destructive role + confirmation dialog"
  phrasing was forum-only and refuted — cite Polaris/Carbon, not Apple forums.)_

## 4. Forms & inputs — measured tradeoffs (NET-NEW, from Luke W + NN/g + Polaris)

- **Label placement:** top-aligned = fastest (a single eye fixation captures label+field) → use for familiar data
  (name/address/payment). Left-aligned = slowest (more fixations) but useful to force deliberation on
  optional/unfamiliar fields. _(lukew.com, Penzo eye-tracking)_
- **Labels are mandatory; never placeholder-as-label** _(Shopify Polaris)_.
- **Inline validation timing: validate ON-BLUR** (after leaving a field, not while typing) — ~7-10 s faster than
  validate-while-typing; once a field is in error, re-validate on-type to clear it. _(Polaris + NN/g)_
- **Inline vs submit-and-refresh** (the number that justifies the work): **+22% success, −22% errors, +31%
  satisfaction, −42% completion time, −47% eye fixations.** _(Luke W / Baymard-style study)_
- Single-column beats multi-column for linear forms; touch inputs sized to §2.

## 5. Motion — the M3 duration/easing table + a11y (NET-NEW numbers)

Motion is timed, not vibes. **Material 3 duration tokens** (four tiers × four values, ms):
| Tier | Values (ms) | Use |
|---|---|---|
| Short | 50 / 100 / 150 / 200 | small utility (state layers, selection) |
| Medium | 250 / 300 / 350 / 400 | standard transitions |
| Long | 450 / 500 / 550 / 600 | larger/expressive |
| Extra-long | 700 / 800 / 900 / 1000 | full-screen/complex |

- **Easing:** standard `cubic-bezier(0.2, 0, 0, 1)` (on-screen utility); emphasized-decelerate
  `cubic-bezier(0.05, 0.7, 0.1, 1)` (elements *entering*). Direction-asymmetric: Container Transform in 300 / out
  250 ms; Fade in 150 / out 75 ms. _(m3.material.io/styles/motion; corroborated by material-components-android)_
- Ties to the existing canon's Doherty <400 ms — most UI transitions live in Short/Medium; anything ≥Long needs a
  reason.
- **Accessibility (pass/fail):** honor **`prefers-reduced-motion`**; **WCAG 2.3.3 Animation from Interactions
  `[AAA-aspire]`** — interaction-triggered motion must be disableable unless essential; **WCAG 2.2.2
  Pause/Stop/Hide `[AA-floor]`** for auto-playing motion >5 s. Vestibular-disorder rationale (large parallax/zoom
  is the risk). _(w3.org)_
- Micro-interaction model (Saffer): **trigger → rules → feedback → loops & modes** — a frame for any small
  interactive moment. _(Saffer, "Microinteractions")_

## 6. Design tokens — the engineering layer (NET-NEW)

- **Three-tier taxonomy:** **primitive/global** (raw values, `blue-600 = #2563EB`) → **semantic/alias**
  (`color-action = {blue-600}`) → **component** (`button-bg = {color-action}`). Names build from
  Base/Modifier/Object/Namespace levels _(EightShapes / Nathan Curtis)_.
- **W3C Design Tokens (DTCG) format** reached its first **stable version (2025.10, Oct 2025)**: tokens are JSON
  objects with a required `$value` + `$type` (color, dimension, duration, cubicBezier, + composites shadow/border/
  typography), aliases via `{group.token}` / JSON-Pointer `$ref` with mandatory cycle detection. ⚠️ **Status: a
  DTCG *Community Group Report*, NOT a W3C Recommendation** — an emerging interchange format, not a ratified
  standard. _(w3.org DTCG)_
- Spacing = 8-pt grid (+4-pt sub-grid) — already in the principles canon; tokens are how it's *codified*.
- **RIGHT-SIZING for THIS product (one-platform, Tailwind):** the three-tier *thinking* (primitive→semantic→
  component) is the durable value — apply it as **Tailwind theme tokens + semantic CSS variables**, which IS our
  token layer. A full DTCG JSON pipeline / Style-Dictionary build is **over-engineering** until we ship a second
  platform or a shared library. Adopt the taxonomy, not the tooling.

## 7. Color & contrast — WCAG 2.2 floor, APCA on the horizon (extends the canon)

- **Keep WCAG 2.2 as the pass/fail floor** (body ≥4.5:1, large ≥3:1, non-text ≥3:1) — it's ratified; the canon
  already has it.
- **APCA** (Accessible Perceptual Contrast Algorithm, candidate for WCAG 3 / SACAM — **in-progress, NOT
  ratified**) replaces the single ratio with a perceptually-uniform signed **Lc** scale (0 to ±~106) and
  font-size/weight-tiered minimums (Lc 90/75/60/45…). Motivation: **WCAG 2.x overstates contrast near black — a
  real dark-mode failure mode.** DEFAULT: comply with WCAG 2.2; sanity-check dark-mode text with APCA. Flag as
  contested/moving.
- **Dark mode is a first-class named state with its OWN rules (NET-NEW — the stack ships dark mode):**
  - **Don't invert to pure black/white.** Use an off-black surface (Material's reference is **#121212**) and
    off-white text; pure `#000`/`#FFF` maximizes halation/eye-strain and reads harsh.
  - **Elevation stops working via shadow in the dark** (a shadow on a dark surface is invisible). Convey
    elevation with **lighter surface overlays** — higher surfaces get a subtly lighter tint, not a bigger shadow.
  - **Desaturate accents** — a saturated accent that works on light vibrates on a dark ground; lower its
    saturation for the dark theme. Re-check every semantic color's contrast against the dark surface (a token
    that passes on light can fail on dark, and vice-versa).

## 8. Component-library methodology (NET-NEW framing)

- **Atomic Design (Brad Frost):** **atoms** (irreducible HTML — button, input, label) → **molecules** (small
  groups, e.g. label+input+button) → **organisms** (sections) → **templates** (skeleton/guardrails, no real
  content) → **pages** (real content, resilience-tested). A **non-linear, concurrent mental model**, not a
  waterfall. _(atomicdesign.bradfrost.com)_
- Published systems converge on a **per-component doc structure**: anatomy · states · behavior · accessibility ·
  do's-and-don'ts (Material 3, Carbon, Polaris, Spectrum, Atlassian, GOV.UK). Our Storybook-per-named-state IS
  this discipline applied — the named states ARE the state matrix from §1.
- **RIGHT-SIZING:** Atomic Design is a **mental model**, not a mandated folder taxonomy — do NOT restructure the
  repo into atoms/molecules/organisms dirs. The value is the *irreducible-atom* thinking (a Button is an atom;
  compose upward) and templates-vs-pages (skeleton vs real-content resilience). Our existing `components/` +
  Storybook already embody it.

---

## What is NET-NEW vs the principles canon (so we don't duplicate)
- NET-NEW: the state matrix + focus geometry (2.4.11/2.4.13 area/contrast), the 24-vs-44-vs-48 numbers with
  sources + exceptions, the M3 motion duration/easing table, the design-token three-tier taxonomy + DTCG, APCA +
  dark-mode rules, Atomic Design stages, the form measured-tradeoff numbers.
- ALREADY IN CANON (cross-reference, do NOT restate): Fitts ≥44 px, Doherty <400 ms, WCAG 4.5:1, focus-visible as
  a principle, 8-pt spacing, one-accent palette, hierarchy by weight, Nielsen H1/H3/H5.

## Un-sourceable / open (honesty)
- M3 state-layer opacity numbers (8/10/10/16%) — NOT verified; verify before quoting.
- Destructive-action "role + confirmation" — codified in Polaris/Carbon (use those); it was NOT sourceable via
  Apple docs (forum claims refuted).
