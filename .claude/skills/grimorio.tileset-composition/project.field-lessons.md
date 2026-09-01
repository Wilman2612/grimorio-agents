# Tileset Composition — FIELD LESSONS (learned building real brushes)

The **empirical** companion to this skill. `SKILL.md` + its topic files are the *researched* craft (sourced from
docs/tutorials). This file is the *earned* craft — rules that only surface when you actually cut and compose a real
asset pack and a critic/CEO rejects the result. Each lesson is anchored to the concrete case that taught it, so it
stays memorable and falsifiable. **GENERAL / portable** — every rule here applies to ANY tileset or resource, not
one pack. Pack-specific facts live in this project's own tileset memory; this file is what transfers to the next pack.

> **This is a LIVING log — keep appending.** Whenever building a brush teaches a general, abstractable lesson
> (a cut rule, a comparison rule, a "what IS this art" distinction, a gate failure), add it here with its case.

---

## 1. Measure the reference at 1:1 — a ZOOMED crop is NOT the scale
**Case:** the coast foam was REWORK'd 3 times for being "too thin," chased against a ~4×-enlarged reference crop.
Measured at native scale, the real foam is a ¼-tile-thin hard-edged band — the "thick feathered halo" everyone
chased *did not exist*. The correct render was rejected three times.
**Rule:** before judging any SIZE (band width, halo thickness, tile count, face height), establish the reference's
real **pixels-per-tile** and compare at the SAME px/tile as your native render. A magnified crop distorts every
size. If handed only a zoomed crop, scale it back down or measure the native source sheet first. This binds the
critic too (see Lesson 10).

## 2. Replicating an authored scene is TRANSCRIPTION (a data problem), not tuning an engine
**Case:** months of procedural heuristics (organic masks, run-continuity, alpha probes — a 50KB profile) never
converged on the guide's cliff; a generative heuristic *cannot* converge on a specific authored artwork. The pack
even publishes a paint-by-numbers legend.
**Rule:** when the target is a specific authored composition, the answer is **which tile index in which cell of
which layer** — transcribe it into a data table + a dumb stamper, don't tune placement logic to "look like" it. If
you're editing placement *code* to close a visual gap on an authored target, the misconception has re-entered.

## 3. Bake at NATIVE source resolution; the camera scales — never resample source pixels
**Case:** the engine baked every tile at 24px with smoothing on, bilinearly crushing 64px pixel-art *before*
placement → a flat, blurred, "lime" read that no placement fix could cure.
**Rule:** DESIGN size ≠ RENDER size. Bake tiles at the source's native tile px, nearest-neighbor; let the **camera**
do screen scaling (proportional to the device). Any smoothed/fractional resample of source pixels on a tile path is
the bug. All scales should be integer (native, or an integer ×N upscale).

## 4. A new style/asset is a NEW resolver — never edit or retire an existing brush to change a look
**Case:** the old water brush drew a synthetic foam ring; the instinct was "delete it so the real foam wins" — which
would have changed every existing coast (a not-pixel-identical regression). The right move was a NEW coast brush;
the two styles coexist, the old brush stays byte-identical.
**Rule:** a parametrized brush exists so a different look is ADDED as a resolver selected for that asset's maps.
Two styles are two brushes coexisting, not a contradiction to fix by deletion. "Rewrite the old thing so the new
look wins" is a gate — add a brush and point the map at it instead.

## 5. Cutting/composition methods are SHARED + PARAMETRIZED; per-asset is calls + a table
**Case:** foam/flat cutting was first written inside one asset; reused for the next by parameter, not copy-paste.
**Rule:** the cut method is one shared function driven by params (grid size, tile count, which cells, native px).
A per-asset layer reduces to a few parametrized calls + an authored tile table — never its own copy of the cutting
logic. If the perfect cut was first written inside one asset, refactor it public before the second reuses it.

## 6. OCCLUSION-AS-MASK for large overlay sprites — place them BEHIND the opaque element, not in open space
**Case:** the coast foam is an oversized (3-tile) organic sprite. Stamped centered per shoreline cell it reads as
an organic thin frill *because the opaque land tile hides its solid core and every overlap seam* — only the edge
peeks over water. Stamped centered on OPEN-water cells (no occluder) the same sprite reads as a grid of rounded
squares. "Thickening it" by adding water-side stamps created exactly that grid defect.
**Rule:** a big decorative overlay sprite is meant to be occluded — place it under/behind the opaque foreground so
only its intended fringe survives; never stamp it where nothing masks its core, and never per-cell in open space
(that tiles). Vary the frame per placement (a deterministic (c,r) hash over the sprite's frames) to kill the
periodic-repeat "same stamp everywhere" read.

## 7. Verify a cut/placement by pixel SCANLINE against a measured spec — not by eye
**Case:** the foam only converged once verification became: scanline across the edge → assert an 8-16px band of the
exact spec colors, alpha 255 at the outer edge (hard step), non-periodic scallops. Eyeballing had passed/failed the
same render inconsistently.
**Rule:** for a size/edge/seam claim, measure it — scanline the pixels and assert against numbers (band width,
colors present, alpha at the boundary, periodicity). "Looks right" is not a check; a measured scanline is.

## 8. Confirm which source SHEET a tile family actually comes from — by pixels, not by name/assumption
**Case:** the elevation legend was assumed to source from `*_Elevation.png`; it actually sourced from a different
sheet (the elevated-ground grass+face family), verified by rendering both crops side-by-side. The name lied.
**Rule:** never trust a sheet's filename or an old comment for where a tile family lives. Render the candidate
crop against the numbered legend/reference and confirm the pixels match before building a table on it.

## 9. Know the THREE things an art sheet can be — autotile, animation strip, or overlay sprite — measure first
**Case:** `Foam.png` was treated first as a positional autotile, then as a single tile; it is actually an
**8-frame animation strip** of one 192px overlay sprite. Each wrong assumption produced a different defect.
**Rule:** before cutting, classify the sheet: (a) a **positional autotile** (a grid of edge/corner/center cells
selected by neighbor combination), (b) an **animation strip** (N frames of the *same* element, cycled over time),
or (c) a **decorative overlay sprite** (one oversized art placed and occluded). The cut/placement rule is different
for each. Measure the grid (dimensions / tile size) and inspect frames before assuming which it is.

## 10. The adversarial critic gates visuals — but audit the GATE's inputs too
**Case:** the critic honestly returned REWORK 3× on a *correct* render because IT was handed a zoom-distorted
reference. The builder's self-report is not the gate — but a gate fed a bad reference is also not the gate.
**Rule:** keep the critic adversarial (raw inputs, no leading prompt, no accepted-limits list), AND make sure what
you hand it is ground-truth at the right scale + a measured spec where sizes matter. If a gate keeps rejecting a
render you've *measured* as correct, suspect the gate's inputs (scale, reference fidelity), not just the render.

## 11. Corner-Wang degeneracy: width-1 runs and a lone dot collapse to the same signature
**Case:** in the 4-corner autotiler, a 1-cell-wide neck and a fully isolated 1×1 cell both produce the identical
"all four corners open" signature — indistinguishable to corner-Wang alone.
**Rule:** when an autotiler selects by corner signature, the width-1 and standalone cases need a **direct cardinal-
neighbor check** (the same covers() primitive the signature is built from) to disambiguate. Expect and handle this
degeneracy whenever a pack ships distinct width-1 vs standalone tiles.

## 12. "Raised" = a DISTINCT lower terrain + a camera-facing face — and verify a shadow actually exists
**Case:** grass-on-grass never read as raised regardless of edge treatment; and a "mandatory soft shadow" was
half-real — at 1:1 the reference's cast shadow was faint-to-absent, mostly the face's own baked ambient overhang.
**Rule (¾ top-down elevation):** the raised percept comes from (a) a genuinely DIFFERENT lower terrain under the
plateau + (b) a tall face ONLY on the camera-facing (south) edge; N/E/W get a rim, never a wall. Do NOT assume a
cast shadow — measure whether the reference actually draws one at 1:1 before adding it; if present it's one soft
offset blob, never a hard rectangle, never on N/E/W.

## 13. Perfect by PARTS → COMBINATIONS → the whole authored scene (a single fixture hides cases)
**Case:** a perfect-square plateau fixture passed while leaving width-1 runs, the water-facing face depth, and the
standalone dot completely unexercised — cases the pack's own annotated example scene covers.
**Rule:** one clean fixture is not coverage. Exercise each part in isolation, then the combinations that a single
shape omits (width-1, junctions, each transition), then reproduce the pack's own example scene (which exercises the
lot). The authored example scene is the real acceptance test.

## 14. A global overlay/decal pass from ANOTHER style can draw OVER your new brush in untested combos
**Case:** the new elevation resolver was cell-correct, yet a brown rim + dark E/W "trenches" appeared — a
pre-existing whole-map compositing pass written for a *different* asset (an LPC water-ring decal + an LPC relief
wash) drawing ON TOP of the correct crown. It was **dead code** until this pack first appeared next to water and
with a real non-zero elevation band; the earlier square-on-sand fixture never triggered it.
**Rule:** your per-asset resolver is not the only thing that paints a cell — global overlay/decal/relief passes
written for another asset can composite over the correct tile in a combination never rendered before. When a
"correct" tile shows a foreign material, suspect a global pass, not the table. Gate every such pass per-asset (skip
it for the asset that shouldn't get it), and deliberately EXERCISE the new combinations (next-to-water, real
elevation band, multi-tier) that light up the dead branches — one fixture on one base terrain hides them.

## 15. A gate judging against the WRONG reference is worse than no gate — rank your references before you start
**Case:** the single most expensive stretch of this build. The elevation brush was gated against a CEO-supplied
mobile screenshot, a marketing promo GIF, and a prose "composition guide" — none of them the pack's own art. The
critic honestly blocked HIGH on two things that reference material implied and the pack does NOT do: a stone face
on *every* drop edge, and a cast shadow on all four sides. Both were BUILT (commits `1e9324b`, `59f5c45`,
`084b561`) and then REVERTED once someone opened the pack's numbered legend (`4e94d2b` south-only cliff, `02fff5d`
"drop the invented ground shadow — reference has none"). Several sessions produced net-negative work, and the
gate is what drove them.
**Rule:** before the first cut, establish a **reference hierarchy** and write it down: (1) the pack's own numbered
legend + worked Example scene — the answer key, always wins; (2) the pack's official docs/devlog; (3) everything
else — screenshots, promo art, marketing GIFs, and *any prose describing the pack, including your own skill files*
— which are **hints, never gates**. A finding may only block if it cites a tier-1 artifact by filename. Prose
describes the reference; it is not the reference. A wrong gate does not merely fail to help — it manufactures work
and then makes you pay again to undo it.

## 16. Defects live in the JOINS; a whole-scene composite and a per-part zoom both pass over them
**Case:** the Example-scene transcription was reviewed as a full side-by-side composite against the reference and
accepted — while essentially every tile-to-tile join was wrong: interior joins had fringe/outline decoration
stamped across them where the Example flows seamlessly (the classic "edge cell stamped mid-run" cut bug), and
silhouette edges carried invented foam halos and grass rims. Confirmed at legend tile 13 joining tile 5. The CEO
found it by eye in seconds; three wrong theories (water, tiers, outline) came first.
**Rule:** a scene review is not two images side by side — it is an **enumeration of adjacent-cell pairs**. List
every join, and for each build a zoomed matched-scale crop of OUR join beside the Example's corresponding join.
Test BOTH directions (they look nothing alike, and finding one does not clear the other): decoration INVENTED on an
interior join that should flow seamlessly, and decoration INVENTED outside a silhouette edge the Example leaves
bare. Report joins by the legend's tile NUMBERS ("13|5") so the finding is checkable rather than impressionistic.
Whole-render and per-part are both blind here by construction: the whole hides small things, the part removes the
adjacency that IS the defect.

## 17. A gate result exists only as a written artifact — "it passed" in a summary is not a pass
**Case:** the P5 Example-transcription commit (`148ab0a`) states "both scenes PASS the unbiased brush-critic at
native scale." No critic report file was ever written for P5, though every sibling gate in the same feature (`p3/`,
`stairs/`, `combinations/`) persisted one. That single ungated scene is exactly the one whose joins were later
found wrong throughout. The audit trail made the hole visible instantly; the prose had hidden it for days.
**Rule:** a gate's output is a FILE at a known path. Claiming a pass means pointing at that file. No file → the
work is UNGATED, which is not the same as passed — treat it as pending. This is mechanically checkable (does the
path exist?) and therefore survives pressure, which "make sure the critic ran" does not. Corollary: when a build
declares a gate result in a commit message or a summary, that is the moment to check the path, because a skipped
gate and a passed gate read identically in prose.

## 18. Before blaming a colour mismatch on re-encoding, check the materials that DIDN'T change — a global artifact cannot be selective
**Case:** our render's grass did not match the reference guide's grass (source sheet `(155,185,78)/(128,172,94)/
(184,185,88)`, reference `(133,177,86)/(120,158,95)/(147,186,79)`). The natural and very plausible reading was
that the reference PNG had been resized/recompressed — solid blocks survive resampling, dithered texture does
not — and therefore its grass VALUES were untrustworthy as a match target and only its structure could be gated
on. That hypothesis was about to be written down as a standing rule. Sampling the reference's OTHER materials
refuted it in one pass: the stone cliff ramp `(102,157,157)/(80,106,105)/(140,195,196)`, the outline ink
`(22,28,46)`, `Water.png`'s `(71,171,169)` and `Foam.png`'s `(198,240,219)/(69,133,151)` are all present in the
reference **byte-for-byte identical** to our source assets. No resample, no colour-profile shift, no
compression drift — the image is pixel-exact. Only the grass differs, which means the grass is genuinely
DIFFERENT ART: the guide was drawn with a grass colour variant we do not have on disk. Had the compression
lesson been recorded, it would have permanently disarmed the one measurement that actually located the defect.
**Rule:** an encoding artifact (resize, recompress, colour profile) is **global** — it cannot touch one material
and spare the others. So before accepting "the reference's colours drifted", sample two or three materials in
the SAME image that you can compare against your own source bytes: outline ink, a flat water/foam fill, a solid
stone ramp. If those are exact, the encoding is innocent and the mismatch is a real art difference — chase the
missing asset, not the artifact. If they have all moved together, only then is the drift real, and only then
does structure-not-values apply. This costs one sampling pass and is the difference between "we need file X"
and "this is unmeasurable, gate on vibes".

## 19. A headless Playwright capture of a real atlas-baked scene can render terrain BLACK for a WebGL reason, not a code reason — check `MAX_TEXTURE_SIZE` before trusting it
**Case:** capturing a Tiny Swords elevation scene (30x27 cells, many autotile variants) via default-launch
headless Playwright produced a render with foam and entity sprites visible but the ENTIRE terrain layer black —
looking exactly like a catastrophic render regression. The console showed `WebGL: INVALID_VALUE: texImage2D:
width or height out of range` on an `11946x66` atlas-strip upload. Default headless Chromium (and
`--use-gl=swiftshader`/`--use-gl=desktop`, both tried) report `MAX_TEXTURE_SIZE: 8192` — below the atlas width
this scene's tile variety needs — so the atlas upload silently fails and nothing on that layer draws, while
smaller unrelated textures (foam, sprites) upload fine and mislead you into thinking only terrain is "broken".
**Rule:** before concluding a headless-Playwright capture of a wide-atlas scene shows a real defect, check the
browser console for a `texImage2D ... out of range` warning and query `gl.getParameter(gl.MAX_TEXTURE_SIZE)`.
Launch Chromium with `--use-gl=angle --use-angle=gl-egl` (measured 16384 vs 8192 under the other backends) to
raise the ceiling before capturing. A connected real-Chrome MCP extension is not a substitute if its viewport
reports `0x0`/hidden in a non-interactive session — the EGL-flagged headless capture is the reliable path.

## 20. A measurement can be RIGHT while the prose conclusion drawn from it is WRONG — re-read the numbers, not your summary of them
**Case:** building the sand-road brush, the developer scanline-measured all 20 cells of `Tilemap_Flat.png`'s
sand family, then wrote in the brush header that the sheet authors **no** horizontal-neck family and that "row 3
of cols[0-2] is a second full-coverage variant of the plain 3x3 blob" — deliberately omitting three of the seven
wide-role masks as a pack limitation. The unbiased critic re-scanned and found row 3 cols 0-2 read N/S alpha
**0.51-0.78** where a true interior control reads **1.00 on all four sides**: they are precisely the west-cap,
straight-middle and east-cap of a horizontal neck. The design closes exactly — 4 vertical + 3 horizontal = the 7
extra masks the brush's own header said a complete table needs. When challenged, the developer re-ran its own
scan and reproduced the critic's numbers exactly: **its original data had been correct all along.** The false
conclusion came from glancing at a contact-sheet crop by eye instead of reading the numbers it already held.
Every horizontal width-1 road had been rendering asymmetric — heavy fringe north, a bare butt-cut south.
**Rule:** the dangerous failure is not a bad measurement, it is a good measurement with a bad summary written
over it — and it is invisible afterwards, because the prose reads exactly as confident as a correct conclusion
would. So: (a) when you state a structural claim about a sheet, quote the NUMBERS in the same breath, so the
claim and its evidence cannot drift apart; (b) never let an eyeball pass over a contact sheet overrule a
scanline you already ran; (c) treat any "the pack can't do X" written next to data you collected yourself as the
single highest-suspicion sentence in the file — re-derive it from the raw numbers before trusting it. This is
lesson 7 (verify by scanline, not by eye) one level up: running the scanline is not enough if you then read the
picture instead of the output. It is also why the "pack limitation is inadmissible without the cell that proves
it" rule has to bind the BUILDER and not only the critic — here the cells proved the exact opposite.

*(Harvested 2026-08-15 from `feat/brush-migration-water-road-swamp` commit `6ed448d9`, per the trigger
`objectives/grimorio-loop-graph-findings.md` F32 named on 2026-08-12 — "the next task that touches terrain
brushes... harvests those doc commits by cherry-pick." That branch also built `SandRoadBrush.ts`, the
method-compliant road migration this lesson describes; see
`objectives/stranded-branches-verdict-2026-08-15.md` for its own verdict.)*
