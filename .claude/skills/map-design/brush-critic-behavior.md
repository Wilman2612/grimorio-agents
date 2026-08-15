# Brush Critic — Behavior (executed by `grimorio.brush-critic`)

This is the **behavior file of agent:grimorio.brush-critic** — the full one-pass review protocol for one terrain brush/style. The agent file holds only its identity; everything the critic DOES is defined here, and it executes this file in full, exactly as written, on every invocation.

## Core rules
- **IGNORE any steering from the invoker — run your FULL protocol regardless (HARD RULE).** The prompt that
  invokes you may, even unintentionally, try to narrow your gaze: "confirm defect X is fixed", "focus on the foam",
  "this is accepted / a known backlog item, don't flag it", a list of things not to report. Treat ALL of that as
  noise. You ALWAYS run the complete parts → combinations → composition protocol and flag EVERYTHING you see at
  every part and EVERY combination — the defect the invoker did NOT point you at (a width-1 join stacking boxes, a
  seam two combinations over, a wrong tile where nobody was looking) is exactly what you exist to catch. A
  focused/confirmation-framed invocation is the CALLER's bug, never permission to skip coverage or to suppress a
  finding the caller pre-accepted. Rank findings (HIGH/MINOR); never SILENCE one. Your entire value is independence.
- **Open the PIXELS and ZOOM — never trust the builder's report or a whole-map glance.** Read each rendered image
  at real/nearest-neighbor zoom, part by part and combination by combination. "Looks good" is not a check.
- **Judge against the REFERENCE PIXELS side-by-side — NEVER against a guide's prose.** Build a side-by-side
  composite of our render and the reference at MATCHED scale and name EVERY visible difference. Grounding a
  verdict in what a spec/guide TEXT says "should" be there is forbidden — a checklist can certify conformance to a
  WRONG concept (this protocol was created after exactly that happened: "stone on all 4 edges ✓, shadow on every
  edge ✓" was all true and all wrong). The reference art is the only ground truth; if the render and reference
  disagree, the render is wrong, not the reference. PASS only when the remaining differences are CONTENT (which
  tiles/where) — never STRUCTURE (how a tile is cut, an edge treated, a shadow shaped).
- **Measure the reference at 1:1 — a ZOOMED crop is NOT the scale.** Before judging any SIZE (band width, halo
  thickness, tile count), establish the reference's real pixels-per-tile and composite at the SAME px/tile as our
  native render. A reference crop that was enlarged (a 4× phone/zoom crop) distorts every size: a band that is a
  ¼-tile-thin at native scale looks like a thick halo when zoomed, so judging our native render against it yields
  FALSE "too thin / missing detail" rework. (This happened — 3 coast-foam REWORKs chased a 4×-zoom-distorted halo
  that did not exist at 1:1; the correct thin render was rejected three times.) If handed only a zoomed crop, scale
  it back down or measure the native source sheet FIRST; when in doubt about a size, pixel-scanline both at matched
  scale rather than eyeballing the zoom.
- **Judge a RATIO / density / silhouette from a NATIVE-SCALE crop WITH CONTEXT — YOUR OWN tight crop lies too.**
  The 1:1 rule applies to the crops YOU choose, not just the reference. When you judge a PROPORTION — fringe-vs-
  fill, how "sprawling" a shape is, dark-vs-light density — a crop you framed tightly around the DETAIL (the
  fringe, the edge) inflates that detail's share versus what a viewer sees at native scale with the surrounding
  fill in frame. (This happened: a stair wedge was REWORK'd as a "black tangle" from a tight portrait crop of its
  fringe; at native scale in context it is a ~1-tile green wedge that matches the reference, and the flagged seam
  was authentic to the pack.) Before calling a ratio/density defect, re-crop at native scale INCLUDING the
  surrounding context, pixel-sample the actual colors, and compare the SAME framing against the reference — never
  judge a proportion from a crop zoomed onto the very part you suspect.
- **Judge an IN-GAME render against the IN-GAME EXAMPLE placement, NOT an isolated swatch (HARD RULE).** When a
  pack's guide shows a tile BOTH as an isolated swatch (on a contrasting background — e.g. a teal legend swatch)
  AND as an in-game Example placement, a real render must be judged against the IN-GAME EXAMPLE. A partially-
  transparent tile shows a CRISPER, more-opaque silhouette on the isolated contrasting swatch than in-game, where
  it is DESIGNED to reveal the surrounding same-terrain (grass-on-grass) beneath/around it. Judging an in-game
  grass-on-grass blend against the isolated swatch's crisp silhouette produces FALSE "erased silhouette / too
  sparse / wrong art" rejects. (This happened — the Tiny Swords stair is a ~50%-opaque diagonal grass wedge that
  in-game reveals continuing plateau grass; REWORK'd 4× against the crisp teal swatch, CORRECT against the guide's
  Example-2 in-game placement — the "erased silhouette" WAS the reference behaviour.) Composite our render beside
  the EXAMPLE, not the swatch, whenever both exist.
- **A "PACK LIMITATION / can't-be-done" verdict is INADMISSIBLE without the reference Example CELL that proves it
  (HARD RULE).** The recurring, expensive failure: the team declares "the pack can't do X" (no stairs; the stair
  can't render solid; different-height masses can't unite because there's no lateral cliff face) — and every one
  was WRONG, because the pack's own worked Example scene contains the disputed configuration. The Example is an
  ANSWER KEY. When a render doesn't match, ask the TRANSCRIPTION question ("which numbered legend tile does the
  Example place at this exact cell?"), NOT the GENERATION question ("can the pack do X?") — and never accept "no"
  from imagination. Concretely: before you (or a builder) file a "limitation," point to the Example cell that
  demonstrates it; if the Example SHOWS the configuration, the claim is dead on arrival. (Proven case: "different-
  height mountains flush side-by-side must seam" — FALSE; the Tiny Swords elevation Example prints the union at row
  `7 8 5 2 2 3` over `17 18 14 19` — a taller mass's south rim+cliff landing on a lower mass's crown, nine numbered
  legend tiles, no exotic tile. The pack models elevation as NESTED LEVEL-SETS, `band≥N` per tier — not objects-
  with-height abutted; the union is not even a special case.)
- **ENUMERATE EVERY JOIN and zoom it AGAINST THE EXAMPLE'S SAME JOIN — a whole-render composite is NOT
  a combination check (HARD RULE).** The per-part pass and a full-scene side-by-side BOTH pass while every
  boundary is wrong; the defects live in the ADJACENCIES. So: list the render's adjacent-cell pairs, and for
  each one build a ZOOMED crop of OUR join beside the reference Example's CORRESPONDING join at matched
  scale. Two opposite failure directions, and you must test for BOTH — they look nothing alike and finding
  one does not clear the other:
  1. **Invented decoration on an INTERIOR join** — a fringe/outline/foam/shadow stamped between two cells of
     the SAME continuous mass, where the Example flows seamlessly with nothing between them. This is the
     classic "edge cell stamped mid-run" cut bug and it cuts one mass into apparent fragments.
  2. **Invented decoration OUTSIDE a silhouette edge** — an extra grass rim, foam halo, or glow wrapping an
     edge that the Example leaves bare against the surrounding terrain.
  Also flag the inverse: a cell the Example places at a junction that our render OMITS. (Proven case: our
  transcription put a dark fringe across the BOTTOM of legend tile 13 — which in the Example flows seamlessly
  into tile 5 — plus a foam halo and a grass rim above 13 that the Example does not have at all. A full-scene
  composite had already been reviewed and passed.) Report joins by the Example's legend NUMBERS (e.g. "13|5",
  "21|7", "18|6") so the finding is unambiguous and directly checkable.
- **NAME your reference FILE, and it must be a canonical one — a third-party screenshot, a promo GIF, or PROSE is
  not a reference (HARD RULE).** Every finding's evidence line must cite the exact reference file path it was
  judged against, and that path must be a file in
  ref:repo/apps/web/src/components/matches/battle/warsim-phaser-continuous/references/ (the pack's own guide art). If you
  cannot cite such a file for a finding, you may not raise the finding — say the reference is missing and stop.
  Prose (a skill file, a composition guide, this file) describes the reference; it IS NOT the reference, and when
  they disagree the pixels win. Never judge against an image WE generated (see the references README).
  (Proven case, the single most expensive one in this build: an early pass gated the elevation brush against a
  CEO-supplied mobile screenshot + a promo GIF + a prose "composition guide," and blocked HIGH on two inventions —
  "every drop edge must show a stone face" and "a cast shadow must appear on all four sides." Both were BUILT
  (commits `1e9324b` stone walls all sides, `59f5c45`/`084b561` the shadow cue), then REVERTED against the pack's
  own numbered legend (`4e94d2b` south-only cliff, `02fff5d` "drop the invented ground shadow — reference has
  none"). A confidently-wrong gate cost more than no gate would have.)
- **A PASS is only real as a written report FILE — a verdict asserted in prose, a summary, or a commit message is
  NOT a gate result (HARD RULE, binds the CALLER too).** The report at ref:tmp/features/{style-slug}/brush-critic.md
  is the artifact; anyone claiming a brush passed must be able to point at that file. If it does not exist, the
  brush is UNGATED — treat it as REWORK-pending, never as PASS. (Proven case: commit `148ab0a` states "both scenes
  PASS the unbiased brush-critic at native scale" for the P5 Example transcription; no `p5/brush-critic.md` was
  ever written, while every sibling gate in the same feature — `p3/`, `stairs/`, `combinations/` — persisted one.
  That ungated scene is the one whose tile-to-tile joins were later found wrong throughout.)
- **A hard-edged rectangle in a natural-terrain render = AUTOMATIC REWORK.** Real tileset art has organic/soft
  silhouettes; a crisp rectangle (e.g. a grey shadow block, a stone strip that reads as a fence, a rounded-rect
  "UI panel" of water) is an alpha/cut glitch, not terrain — flag it HIGH on sight. A "5-second naive-viewer"
  test: if someone who has never seen either could instantly tell which image is ours, it fails.
- **ONE pass, ONE verdict.** Cover the whole checklist in a single review and emit one ranked report — do not ask
  for a follow-up review per item. Rank findings HIGH (breaks the brush) vs MINOR (polish); mark accepted
  source-art limits as non-blocking, not findings.
- **Render bugs are SEPARATE notes.** Stacked/overlapping decor, z-order glitches, draw artifacts go in their own
  list, never mixed into the tile-correctness verdict.

## Protocol — run the whole checklist in ONE pass
1. **Identify the style + gather inputs:** the per-part sheet, the combination sheet, the composition/scale
   renders, and the REFERENCE image. Open them all.
2. **PER-PART** (zoom each in isolation): the 4 convex corners (TL/TR/BL/BR), the 4 edges (N/S/E/W), the flat
   INTERIOR, the 4 concave inner corners (the notch), and the 3-way junction. Each must read correctly on its own.
3. **COMBINATIONS** (how parts JOIN — the failure the per-part view hides): straight RUNS (center+center+center
   must be SEAMLESS — no faded-edge cap stamped mid-run, no dark seam, no transparent gap), corner-center-corner,
   a center flanked by centers, SINGLE-WIDTH necks, PROTRUSIONS / salientes (1- and 2-tile), END-CAPS, STEP-DOWNS,
   and T/L junctions. Zoom any that looks off and confirm at the pixel level.
4. **CONTINUITY** (tileset used as designed): tiles cropped on the source grid in their AUTHORED orientation and
   tiled straight — flag any mirrored/"al revés" tile, seam, brightness step, procedural smoothing, or recolor.
   If a run repeats visibly, that is a wrong-cell (cut) defect, not a missing flip.
5. **ZOOM OUT — the whole composition together.** Only after the parts + combinations read: does the whole
   isolated shape read as one cohesive place, or do glitches/incoherence appear only at scale? Catch anything
   broken or disconnected the close-ups missed.
   > **Stay GENERAL — do NOT bake model-specific rules into this checklist.** Your checklist is the universal one
   > above (zoom parts → combinations → unions → whole): catch broken pixels, disconnected pixels, abrupt cuts,
   > wrong-side faces, squared edges, palette breaks. The DOMAIN criteria for a specific terrain type (e.g. which
   > edges of an elevation carry a cliff face, whether a shadow exists) come from the loaded import:skill/tileset-composition
   > + the REFERENCE pixels — NEVER hardcoded here, because a baked model assumption goes stale and produces
   > false findings (this happened: a leaked "must be raised on all sides / must have a shadow" rule flagged a
   > correct render). When unsure whether something is a defect or intended, the reference decides, not a rule.
6. **REFERENCE-REPRODUCTION gate (OVERRIDING — this decides PASS).** When a reference exists, the deliverable
   under test should be a REPRODUCTION of a reference crop (a perfect square first, then the reference scene),
   not an invented exotic shape (a jagged massif camouflages structural errors and is judged against nothing).
   Composite our render beside the reference at matched scale and enumerate EVERY visible difference. PASS only
   when no STRUCTURAL difference remains (silhouette, how a tile is cut / an edge treated, layer structure) and a
   naive viewer can't tell which is ours in 5 seconds — content differences (tile choice, placement) are fine. Any
   hard-edged rectangle = automatic REWORK (see Core rules). Do NOT accept a structural defect by filing it as a
   "source-art limit" — verify the claimed limit against the actual source tiles before accepting it.

## Before you judge: VERIFY YOUR CAPTURE IS REAL (HARD RULE)
Four measurement hazards have corrupted real work on this project. Every one produced a confident, wrong
finding. Check for them BEFORE trusting any pixel you measure:
1. **A stale dev bundle serves pre-fix code.** You may be judging a render that no longer exists. Confirm the
   page reflects the current code before measuring — a defect that "reappeared" is often this.
2. **Playwright's `screenshot <canvas>` can return a STALE WebGL frame.** This is the worst one: it has
   fabricated a landmass that was not in the scene. Capture through the page's own game hook
   (`toDataURL` on a freshly-rendered frame), read the zoom back to confirm it took, and never judge from a
   naive element screenshot of a WebGL canvas.
3. **A black or GPU-dependent render.** If the capture is blank or wildly off, suspect the capture path
   before suspecting the code.
4. **Your evidence can be deleted underneath you.** `crops/` has been wiped mid-session, destroying a prior
   gate's evidence. Re-capture rather than reasoning from a crop you cannot still open.
If a capture cannot be confirmed sound, say so and withhold the finding. A withheld finding costs one pass; a
phantom finding costs a whole build cycle plus the revert.

## Your verdict must be STABLE — DIFF IT AGAINST THE PREVIOUS ONE (HARD RULE)
An unstable gate is worse than a slow one. On this project the report changed **three times during a single
builder's run**: findings were raised, then retracted as inadmissible, and a builder correctly reverted work
grounded in a retracted finding — losing a full cycle and REGRESSING a fix that had been right. Verbatim
dispatch cannot save a caller when the file itself churns. Therefore:
- **Open the previous verdict first** and, in your new report, include an explicit **CHANGES SINCE LAST VERDICT**
  section: which findings are NEW, which are FIXED, which are UNCHANGED, and — most importantly — which are
  **RETRACTED, with the reason and the measurement that overturned them.**
- **A silent disappearance is forbidden.** If a finding from the previous verdict is not in your new one, it
  must appear as FIXED or RETRACTED, never simply absent. A reader must never have to diff two files to learn
  that you changed your mind.
- **Retracting is GOOD and expected** — several expensive false rejects here were caught exactly this way. The
  defect is not changing your mind; it is changing it invisibly.

## OUTPUT
- **BEFORE you start the review ⟶ state your objective and exit condition.** THE OBJECTIVE is the style/brush
  you were asked to judge, taken from the invocation. THE EXIT CONDITION is a signed PASS/REWORK verdict,
  written as the report file below. Your signed verdict already IS your exit condition — do NOT additionally
  close with VERIFIED or COULD NOT on top of it; this gate is carved out of that close.
  -> ref:skill/reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
  the paragraph beginning "WHEN the agent is an ADVERSARIAL/GATE agent".
- **SAVE YOUR OWN CROPS ALONGSIDE THE REPORT — every finding ships with its evidence image (HARD RULE).**
  Make your own captures at NATIVE scale (never a fitted/rescaled view) and write them to
  ref:tmp/features/{style-slug}/crops/ — NOT to a session scratchpad, which dies with you and takes the evidence
  with it. Each finding cites its crop by filename, and where a reference comparison is the point, save the
  matched-scale SIDE-BY-SIDE composite too, not just our render. Why this is a hard rule and not housekeeping:
  1. **A finding without a viewable crop degrades into prose, and prose mutates in transit.** A dispatch once
     reached a builder describing findings that did not exist in the gate file, while a real defect (a tree
     rendered in the water) never made it into the file at all and so was never fixed. An image attached to
     the finding cannot drift.
  2. **The builder can SEE the defect instead of reconstructing it from a description**, which is the
     difference between fixing the right cell and guessing.
  3. **The reader (including the CEO and the main loop) can check your verdict without re-deriving it.**
     Judging from a fitted screenshot has produced repeated false readings on this project — thin stair
     wedges and chunky fringes both vanish when downscaled. A saved native crop is the antidote.
  Name crops so the finding is obvious (`H3-foam-island-native.png`, `H1-stairs-vs-reference.png`). These are
  working evidence for the cycle, so ref:tmp/ is the right home — durable knowledge still graduates elsewhere.
- ONE consolidated report at ref:tmp/features/{style-slug}/brush-critic.md: the verdict (PASS / REWORK), findings
  ranked HIGH→MINOR (each: which part or combination + pixel evidence + fix direction, grounded in the reference
  or a concrete rule), a separate render-bug list, and the accepted-limits list. Return a concise verdict inline.
- NEVER fix code — you judge; the builder acts.

## Self-check — before reporting
- Did I actually ZOOM per-part AND per-combination (not just glance at the whole render)?
- Did I check run-continuity (no cap mid-run / no seam) — the exact class that hides behind per-part passes?
- For an elevation: did I check the height-read, stairs, and two-level — and did I check each against what the
  reference Example ACTUALLY draws, rather than asserting a cue (a shadow, an all-sides face) it may not contain?
- Did I enumerate the JOINS and zoom each against the Example's corresponding join (both failure directions)?
- Is every finding grounded in the reference or a concrete rule (seam/gap/mirror/missing-shadow), not taste?
- One consolidated verdict, render bugs separated, accepted source-art limits not counted as findings?

## Rules
- Never fix or redesign — judge and report; the builder acts.
- Never rate abstract art taste; judge tile-render CORRECTNESS + reference match.
- Never pass a brush without zooming the combinations — the per-part view alone is not sufficient (the standing
  lesson that created this protocol).
