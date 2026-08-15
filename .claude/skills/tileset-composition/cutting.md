# Cutting a Sheet — Grid, Seams, 9-Slice

Universal reference for turning a raw tile SHEET into correctly-cut cells. Applies to any tileset — pixel art or
otherwise, any engine.

## Finding the design grid

Every authored sheet is built on a fixed grid (commonly 8, 16, 32, or 64 px); the sheet's pixel dimensions divide
evenly by it. If they don't (e.g. 250×290 for a suspected 16 px grid), the grid guess is wrong or the sheet has
margins/padding to account for.

**Empirical method — proportional scaling.** Open a screenshot/reference at native resolution, scale it to exactly
1 in-game pixel = 1 canvas pixel, then overlay a candidate grid and nudge it until level geometry (platform edges,
walls, terrain boundaries) aligns exactly with no spillover. A grid "looks right" when features align without the
overlay needing sub-pixel adjustment. This removes viewport/camera artifacts that obscure the true authoring grid.
-> source: Aran Oakley, "Celeste Tilesets Step-by-Step" (aran.ink/posts/celeste-tilesets).

**Common orthogonal sizes**: 8×8 (dense pixel-detail budgets, e.g. Celeste at 320×180), 16×16 (general/mobile
baseline), 32×32 (larger indie pixel art). **Isometric grids use a 2:1 width:height ratio** (64×32 standard,
32×16 mobile, 128×64 hi-res) — width is always 2× height to preserve fidelity under the projection's Y-compression.
-> sources: Celeste Tilesets (aran.ink); Sprite-AI Isometric Pixel Art Guide (sprite-ai.art/guides/isometric-pixel-art).

Cut ON that grid with integer cell coordinates — never a sub-pixel/off-grid window. An off-grid cut re-introduces
seams that do not exist in the source art.

## The seam test — the ground-truth check

**Procedure**: cut one candidate tile, duplicate it into a 3×3 block (for a 16×16 tile, a 48×48 canvas), and
inspect all four touching edges. If no seam is visible, the cut is on a real seam and safe to tile; iterate the
cut until seamless. Turn off any grid overlay to see the raw result — a visible line, color discontinuity, or
pattern break at any touching edge means the cut is wrong.
-> source: Pinnguaq, "Pixel Art 3: Tiling Basics Using GIMP" (pinnguaq.com); Sprite-AI, "Pixel Art Tiles That Don't
   Look Terrible" (sprite-ai.art/blog/seamless-pixel-art-tiles) — "place 9 copies in a grid; seams are immediately
   visible at this scale."

**Re-test AFTER shading.** A tile can pass base-texture seam testing and still fail once lighting (shadows,
highlights, AO) is added — the eye is drawn to contrast, so lighting seams are more visible than flat-color seams.
Re-run the 3×3 test after any shading pass.
-> source: Pinnguaq tutorials.

**Secondary check — the offset test.** Beyond the static 3×3 grid, shift the tiled preview by 50% horizontally
and vertically (an offset/wrap slider — Photoshop's Filter > Other > Offset, Aseprite's Tile Mode, or equivalent)
and watch for seams appearing at intermediate positions. Some seams that accidentally pass a static 3×3 test
surface only under continuous offset shifting, because it exposes alignment edges a fixed grid position hides.
-> source: Sprite-AI, "Pixel Art Tiles That Don't Look Terrible" and "Grass Tiles Pixel Art in Under 60 Seconds"
   (sprite-ai.art).

**"Seamless" ≠ "pixel-identical at the boundary."** The rightmost column of a tile must *transition naturally*
into the leftmost column of its right neighbor — matching color, pattern density, and detail — not be a literal
mirror. A gradient or blend at the boundary is seamless if the eye can't detect a grid line; overly rigid
enforcement produces a mechanical, repetitive look.
-> source: Sprite-AI, "Pixel Art Tiles That Don't Look Terrible."

## 9-slice / nine-patch — the fill primitive

A 3×3 division of a rectangular asset: the 4 CORNERS are fixed size (never stretch — they carry the fine detail,
e.g. rounded bevels; stretching flattens them), the 4 EDGES stretch/repeat along one axis only, the CENTER
stretches/repeats in both axes. Shrinking a region = drop the center, butt the edges together; growing it =
duplicate the center.

- "9-patch" (with the dot, `.9.png`) is Android's concrete FILE FORMAT — a PNG with a 1-pixel border of black
  pixels annotating the stretchable region, authored via the Draw 9-patch tool. Minimum stretch-region size is
  2×2 px (a 1×1 region can vanish under downscaling due to rounding); leave 1 px of buffer before/after a
  stretchable region to avoid interpolation artifacts.
  -> source: Android Developers, "Create Resizable Bitmaps (9-Patch Files)" (developer.android.com/studio/write/draw9patch).
- "9-slice" is the PORTABLE ALGORITHM every engine ships under its own name, independent of the `.9.png` file
  format: Godot's `NinePatchRect` (patch margins per edge + an Axis Stretch Mode of STRETCH/TILE/TILE_FIT — TILE
  is directly applicable to seamless tileset textures used as UI panels), Unity's Image component (Sliced image
  type + Fill Center toggle + Full Rect/Tight mesh type).
  -> sources: Godot Engine docs, `NinePatchRect` (docs.godotengine.org); Unity UI Image documentation.
- **Do not apply 9-slice to detailed/meaningful artwork** (icons, character sprites, unique props) — slicing
  freezes the corners and stretches the middle, mangling it. It is for flat container elements: panels, frames,
  dialogs, progress bars, and simple geometric tile backgrounds.
  -> source: "9-Slice Scaling Explained" (generalistprogrammer.com/tutorials/nine-slice-scaling-explained).

## CENTER vs EDGE/FADE cell roles (the #1 cut bug)

A tileset's cells split into two functionally distinct categories:

- **CENTER / base cells**: fully seamless, must independently pass the seam test in all 8 directions. Safe to
  place anywhere mid-run. This is the "always-works" tile a designer fills terrain with.
- **EDGE / border / corner / cap / FADE cells**: NOT required to be seamless, and frequently carry a hard
  terminator, a transparent fade margin, or asymmetric decorative detail. They are designed to appear ONCE, at a
  specific boundary or terminus — never repeated mid-run.

**The failure mode**: stamping a fade/cap/edge cell into the middle of a run produces an "abrupt seam / foreign
tile" defect (reads like a stair tile stuck in the middle of a wall). If a straight run repeats visibly or breaks
oddly, the diagnosis is almost always "wrong cell chosen for this position" — never fix it by flipping, shifting,
or smoothing; find and use the correct seamless CENTER cell for that run, and reserve edge/cap cells for true
ends/corners only.
-> sources: Sandro Maglione, "Pixel Art Game Tileset Made Easier" and "How to Create a Pixel Art Tileset — Complete
   Guide" (sandromaglione.com); BorisTheBrave, "Classification of Tilesets" (boristhebrave.com/2021/11/14).

## Scoping a tileset by tile count

Rough planning numbers (hand-crafted, no autotile symmetry applied): a minimal platformer-style set needs ~16
tiles (1 center + 4 borders + 4 corners + 4 single-tile variants + spares); a fully-featured set with internal
(concave) corners runs to ~48 tiles. Symmetry (rotation/mirroring) can cut this dramatically — see the R/M
notation in ref:skill/tileset-composition/workflow.md (BorisTheBrave classification), where allowing rotation drops a 16-tile vertex-based
set to 6 unique drawn tiles (62.5% reduction).
-> source: Sandro Maglione, "How to Create a Pixel Art Tileset — Complete Guide."

## Engine-specific grid configuration notes

These are mechanical, tool-specific facts — useful when the pipeline uses that specific tool, not general
principles:
- **Godot**: Tile Size must be set on the TileSet resource before atlas creation; Texture Region Size / Margins /
  Separation / Use Texture Padding handle sheets with guide-gutters or bleed padding.
- **Aseprite** (v1.3+): native tileset layers (Sprite → New Tileset Layer), grid config via View > Grid > Grid
  Settings, and automatic tile deduplication (painting an existing tile reuses its reference).
-> sources: Godot Engine docs, "Using TileSets" (docs.godotengine.org); Aseprite official docs
   (aseprite.org/docs/tilemap, aseprite.org/api/grid).
