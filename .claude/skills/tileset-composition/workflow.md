# The Reference-First Breakdown Workflow

The end-to-end method for reading and understanding an UNFAMILIAR tileset (a source sheet, a reference
screenshot, or a shipped game's tile art) before building or modifying anything with it. This is the "how do I
even start" answer — the other files in this skill (ref:skill/tileset-composition/cutting.md, ref:skill/tileset-composition/autotiling.md, ref:skill/tileset-composition/elevation.md, ref:skill/tileset-composition/layering.md)
are the techniques this workflow's steps plug into.

## Why reference-first

Text guides, devlogs, and even this skill's own claims can be imprecise about a SPECIFIC tileset's structure —
elevation semantics in particular vary by engine/asset (see ref:skill/tileset-composition/elevation.md). The only ground truth is the actual
sheet pixels and a real reference scene. **Always verify by opening the image, never by trusting a prose
description alone** — including this skill's.

## The workflow, step by step

### 1. Establish the grid
Measure the sheet's pixel dimensions; divide by a candidate tile size (8/16/32/64 px — see ref:skill/tileset-composition/cutting.md for the
common-size table) to get columns × rows. If the division isn't clean, the candidate size or an assumed
margin/separation is wrong. If working from a screenshot rather than a raw sheet, scale to 1:1 pixel ratio and
align a grid overlay to level geometry (see ref:skill/tileset-composition/cutting.md's grid-finding method).

### 2. Extract basic geometry
Strip visual detail mentally (or in an editor, by flattening to silhouette) to see only solid terrain / playable
mass vs empty space. This separates "where is the grid" from "what does the art look like," so grid-fitting isn't
biased by decorative noise.

### 3. Identify terrain types / materials present
Scan the sheet for distinct material families (dirt, stone, grass, water, metal…) before classifying individual
cells — this gives the vocabulary the later role-classification step will use.

### 4. Classify each cell's ROLE by visual criteria
When no legend or sample map ships with the pack, cell role (floor/center vs wall/edge vs corner) is readable
from shading and orientation alone:

- **Floor / horizontal / CENTER cells**: tilt toward the viewer (¾) or lie flat; receive direct/bright lighting
  from above; seamlessly repeatable in all 8 directions (no terminator pattern); symmetric or near-symmetric
  silhouette.
- **Vertical wall / EDGE cells**: shaded darker (less direct light); appear perpendicular to or tilted away from
  the viewer; often carry a distinct "top edge" terminator line (e.g. a grass cap on a soil wall); may have
  directional features that break symmetry.
- **CORNER cells**: combine two perpendicular planes. Outer/convex corners visually "stick out," lit directly at
  the edge, no interior shadow. Inner/concave corners look recessed — shadow or reduced light visible in the
  crease, two planes meeting at a fold rather than a protrusion.

A complete, well-designed tileset has BOTH inner and outer corner variants; a set with only one cannot produce
correct concave or convex joins — spotting this gap tells you the tileset is minimal, not broken.
-> source: Raymond Schlitter (SLYNYRD), "Pixelblog - 28 - Side View Tiles" (slynyrd.com/blog/2020/5/21); Sprite-AI,
   "Pixel Art Tiles That Don't Look Terrible."

If the pack ships RPG-Maker-style color-coded minitiles (red/green/yellow/blue = NW/NE/SW/SE), that coding IS the
legend — read it directly rather than inferring from shading. -> source: RPG Maker Official Blog, "Classic
Tutorial: How Autotiles Work."

### 5. Classify by SYMMETRY — mirror-able vs unique vs seamless-center
Once roles are known, further classify each cell for reuse potential:

- **Symmetric / mirror-able**: bilateral or rotational symmetry, ambient/omnidirectional lighting (natural
  textures — grass, dirt, generic stone). Safe to flip horizontally/vertically to generate the opposite
  orientation without visible inconsistency.
- **Unique / direction-dependent**: single-direction light source, intentional asymmetry, or directional visual
  flow (a path, a slope). Mirroring these BREAKS visual consistency — never flip a directional tile to fake
  variety.
- **Repeatable center**: passes the seam test in all 8 directions; always safe to duplicate.

Correctly identifying mirror-able cells cuts real asset count: BorisTheBrave's formal notation marks this as R
(rotation-symmetric) / M (mirror-symmetric) — e.g. a 16-tile vertex-based set ("S-V2") drops to 6 unique drawn
tiles under rotation symmetry ("S-V2-R"), a 62.5% reduction. This is the SAME classification exercise as
ref:skill/tileset-composition/coherence.md's "decompose into reusable parts," applied at the cell-symmetry level rather than the
sprite-decomposition level.
-> sources: Raymond Schlitter (SLYNYRD), "Pixelblog - 20: Top Down Tiles" (slynyrd.com/blog/2019/8/27); Sandro
   Maglione, tileset guides; BorisTheBrave, "Classification of Tilesets" (also see:
   https://boristhebrave.github.io/DeBroglie/articles/rotation.html for the full R/M axis notation).

### 6. Run the seam test — verify, don't assume
Take the candidate center cell, place it in a 3×3 grid (see ref:skill/tileset-composition/cutting.md for full procedure), and inspect all
touching edges. This is the empirical checkpoint that closes the loop on steps 1-5: if the seam test fails, the
grid, the cell-role classification, or the cut itself is wrong — go back, don't patch forward with smoothing.

### 7. Document the structure
Record grid size, tile count, symmetry notation, and color palette before building anything with the tileset.
This is the artifact a second person (or a critic agent) can check the actual render against later.

## Applying the workflow to a formal editor (Tiled example)

Tiled operationalizes steps 4-6 as: open the tileset → Terrain Sets → Add a new set (Corner/Edge/Mixed, see
ref:skill/tileset-composition/autotiling.md) → paint each terrain type across the sheet's corners/edges (a 3×3 sub-tile grid within each cell
gives forgiving click targets — the mouse position maps to the nearest corner or edge index) → check the Patterns
tab for gaps → return to the map and paint with the Terrain Brush (shortcut T) as a FUNCTIONAL verification: if
the WangFiller picks the wrong tile or leaves a visible seam, the terrain-set marking (not just the Patterns
coverage) is wrong, and the fix is to re-examine the tile's actual visual content, not to assume the mark was
right.
-> source: Tiled 1.12.2 documentation, "Using Terrains" and "Editing Tile Layers" (doc.mapeditor.org).

## Common mistakes this workflow prevents

- **Incomplete corner/edge marking** — the Patterns/gap-check step (7) catches this before it reaches the engine.
- **Misaligned marking** — assigning the wrong terrain to a corner because of assumption rather than visual
  inspection (step 4's discipline exists specifically to prevent this).
- **Skipping the seam test after classification** — a role/symmetry classification (steps 4-5) that "looks right"
  on paper can still fail the pixel-level seam test; step 6 is not optional.
-> source: Tiled Forum, "How to Use Wang Sets Like Terrains?" (discourse.mapeditor.org/t/how-to-use-wang-sets-like-terrains/4802).
