---
name: tileset-composition
description: "How to compose 2D top-down TILESETS from real cut art — finding the grid & seams, 9-slice, autotiling (bitmask/Wang), the reference-first breakdown workflow, ¾ elevation/cliff LAYERING, layering/compositing tricks, and coherence tricks. Load before building or reviewing any terrain brush/tile render. Sourced from real docs/tutorials, not guessed. GENERAL — applies to any tileset/sprite set, not any one specific asset pack."
---

The craft of turning a source tile SHEET (any tileset, any sprite pack — never assume a specific asset) into a
rendered terrain that reads as one cohesive place. This is a CUTTING + COMPOSITION problem: real tile art is
already good and symmetric — the failures come from cutting it on the wrong seam or composing the layers wrong,
NOT from the art. **Never smooth/antialias/recolor to hide a bad cut; find the right cut.** Every claim in every
file under this skill is grounded in a named real source; when a rule and the reference pixels disagree, the
reference wins — re-verify against the actual tileset image, never against prose (including this skill's own).

## THE METHOD — a tileset is a CLOSED PUZZLE, not a creative task (read this FIRST)

If you are stuck, over-thinking, or about to declare "can't," you are treating a CLOSED puzzle as if it were open.
There is no creativity here and none is wanted — only the USE of a fixed set. A tileset is a **small, finite,
SYMMETRIC set of piece types**: you cut the set ONCE and arrange the pieces by their neighbors. That is all of it.

**The piece vocabulary is tiny and symmetric — a jigsaw.** ONE corner, ONE edge, ONE center. The four corners and
four edges are the SAME piece MIRRORED — understand ONE and you have all four (in principle one axis suffices and
it is symmetric on the four sides; verify, but expect symmetry). Plus their UNIONS: two corners meeting = a width-1
neck; a corner + center; a center flanked by centers. A handful of unique cuts, mirrored — nothing more exists.

**Arrange by NEIGHBORS — it's a chessboard.** Each cell's piece is DETERMINED by which neighbors are same-mass: all
four same → center (repeats to fill the interior); one side different → that edge; two adjacent different → that
corner; a single-cell-wide run → the neck (two corners back-to-back). A LOOKUP by neighbor pattern — never a
decision, never a special case.

**Expand from the center.** Placing centers GROWS the mass (right → a row, down → a column, both → a rectangle); the
boundary just follows, wrapped by the edge/corner pieces.

**Elevation is the SAME puzzle, nested.** Cut the level's pieces, find the symmetry, expand. Each higher level NESTS
on the one below (footprint `band ≥ N` is a subset); the SOUTH edge is the cliff face, every other side a grass rim.
A taller mass beside a shorter one is just a higher nested blob — not two objects, not a special case, no seam.

**TRANSCRIBE — the pack's Example scene is the ANSWER KEY.** When a render doesn't match, ask *"which numbered piece
does the Example put at THIS cell?"* — never *"can the pack do X?"*. If the Example shows it, it is possible; a
"limitation" claim without the Example cell that proves it is dead on arrival.

**The tell that you have LEFT the method (EVERY block came from here):** you're treating a cell as a novel/creative
case; or asking "can it do X" (generation) instead of "which piece goes here" (lookup); or re-deriving each side
instead of mirroring one; or reaching for BLUR/smoothing to fake an edge that a real edge tile should cut. All four
are over-thinking a closed puzzle. Stop, count the piece types, mirror the symmetry, read the Example. It is
ARRANGEMENT, not invention.

**Robust to a new source:** none of this depends on a specific sheet — swap the image tomorrow and the method is
identical: measure the new grid, classify each tile's role (center / edge / corner / cliff), mirror the symmetry,
arrange by neighbor, transcribe the Example.

> The water/road/swamp brushes still run an OLD blur/dither pipeline — a SECOND, WRONG mechanism, NOT this method.
> Do not learn the method from them; the mountain + Tiny Swords elevation resolvers ARE this method.

## The universal principles (true every time, any tileset)

1. **Cut ON the design grid, never off it.** Find the sheet's real grid (it divides the sheet's pixel dimensions
   evenly); an off-grid/sub-pixel cut re-introduces seams that don't exist in the source. -> deeper: `./cutting.md`.
2. **Verify by IMAGE, not by prose.** The seam test (tile a candidate cell into a 3×3 block and inspect the
   touching edges) is the ground-truth check for "is this cut right" — text guides and devlogs are frequently
   imprecise about a specific tileset's structure. Open the actual sheet and pixel-verify; a rule stated in a
   doc (including this one) is a hypothesis until confirmed against the reference image. -> deeper: `./workflow.md`.
3. **CENTER vs EDGE/FADE cells play different roles — never interchange them.** The CENTER cell must
   independently pass the seam test (it repeats everywhere); EDGE/corner/cap/fade cells are NOT required to be
   seamless and often carry a hard terminator — they appear ONCE at a specific boundary. Stamping an edge cell
   mid-run is the single most common cut bug (a foreign tile breaking a straight run). -> deeper: `./cutting.md`.
4. **Autotiling composes transitions from a selector, never by hand-placing every combination.** Reuse the
   engine's existing autotile strategy (corner-Wang / bitmask-blob / 9-slice) — never hand-roll a parallel
   selector. -> deeper: `./autotiling.md`.
5. **In a ¾ top-down camera, a tall face is drawn ONLY on the side facing the camera — south.** This is the one
   rule held across every elevation/cliff system researched (Tiny-Swords-style engines, RPG Maker, Tiled,
   Pokémon-style spatial placement): a wall on north/east/west reads as a fence on a field, never a cliff.
   Everything else about elevation (stacking order, shadow, offset) is engine- and tileset-DEPENDENT and must be
   pixel-verified against the specific asset. -> deeper: `./elevation.md`.
6. **Layering/z-order is what makes reused pieces read as different heights or roles — not new art.** The same
   piece placed on a different layer, at a different draw-priority, or with a sort-offset can read as "the second
   floor," "behind the player," or "in front of the wall" without drawing anything new. -> deeper: `./layering.md`.
7. **A unified palette is the #1 coherence lever** — more than resolution, animation, or tile complexity, for
   making separately-sourced or separately-drawn pieces read as one place. -> deeper: `./coherence.md`.

## Map of the reference files (load only what the task touches)

| File | Covers | Load when |
|---|---|---|
| `./cutting.md` | Grid detection, the seam test, 9-slice/9-patch anatomy, CENTER vs EDGE/FADE roles | Cutting a sheet into tiles for the first time, or a seam/edge-cell bug |
| `./autotiling.md` | Bitmask/blob-47, corner-Wang, multi-terrain priority + routing | Building or reviewing terrain transition logic |
| `./workflow.md` | The reference-first breakdown method: grid → geometry → seam-test → classify cell ROLE → symmetric/unique → verify-by-image loop | Reading/analyzing an unfamiliar tileset before building anything with it |
| `./layering.md` | Layer order, draw-priority tricks, passability-vs-draw decoupling, the "second floor from reused pieces" family of tricks, sprite-stacking | Compositing multiple pieces/layers into one read (height, occlusion, floors) |
| `./elevation.md` | The ¾ cliff/elevation model: the universal south-face rule + the engine-dependent stacking families | Building or reviewing any raised-terrain/cliff brush |
| `./coherence.md` | Decompose+reorient, center-variation without asset explosion, the unified-palette lever | Making disparate or separately-sourced pieces read as one place |
| `./field-lessons.md` | EMPIRICAL rules earned building real brushes: measure the reference at 1:1, transcription-not-tuning, native-res-not-resample, new-brush-not-edit, occlusion-as-mask, scanline-verify, autotile-vs-animation-vs-overlay, corner-Wang degeneracy, parts→combinations→scene | Building or reviewing ANY brush — read alongside the topic files; APPEND a lesson whenever a real build teaches one |

## How to use this skill

- **Building/fixing a terrain brush or elevation**: apply `./cutting.md` (cut on-grid, center-vs-edge) →
  `./autotiling.md` (reuse the autotile selector) → `./elevation.md` (south-only face, then pixel-verify this
  tileset's own stacking) → `./layering.md` (draw order, occlusion) → `./coherence.md` (palette + reorient, never
  smooth).
- **Reading/analyzing an unfamiliar tileset before building with it**: start at `./workflow.md` — it is the
  end-to-end method (grid → geometry → seam-test → role classification → symmetric/unique → verify loop) that
  the other files' techniques plug into.
- **Reviewing a render** (e.g. agent:grimorio.brush-critic): the concrete cut/composition parameters to check
  against the reference pixels are — abrupt seam (edge cell mid-run), squared edge, a wall/face on the wrong
  side, layer/height read, palette coherence. Each has its criterion in the file above that owns it.

-> EMPIRICAL field lessons earned building real brushes (general/portable, a LIVING log — the *earned* craft vs
this skill's *researched* craft): `./field-lessons.md`. Read it before building any brush; append to it when a build
teaches a general lesson.
-> Full raw research (all named sources, ~50+ citations across two research rounds): permanent bibliography,
`documentation-memory/docs/` (see that skill's index for the exact filename).
-> This project's engine, tileset facts, and verified elevation model for OUR specific assets: `./project.md`.
