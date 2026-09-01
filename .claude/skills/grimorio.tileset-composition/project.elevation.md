# Elevation / Cliffs in ¾ Top-Down — the Universal Rule + the Engine-Dependent Families

Universal reference for raised terrain (cliffs, plateaus, multi-level ground) in a ¾ / top-down camera. Companion
to ref:skill/grimorio.tileset-composition/project.layering.md (the general draw-order/compositing toolbox this file's stacking families draw from).

## THE ONE UNIVERSAL RULE (holds across every system researched)

**The tall cliff FACE is drawn ONLY on the side facing the camera.** In a ¾/top-down view that side is SOUTH. The
far/north side, and the east/west sides, get a plain rim/edge treatment — NEVER a face. A wall rendered on
north/east/west reads as a fence standing in a field, not as the edge of a raised area, because nothing in the
camera projection justifies a vertical surface being visible from those angles.

This rule held across all four independently-researched systems: an asset-pack-style engine with real z-ordered
layers, RPG Maker's autotile stacking, Tiled's layer model, and Pokémon-style spatial tile placement. It is
**engine-independent** — obey it regardless of which stacking family below applies to a given tileset.
-> sources: RPG Maker cliff-mapping blog (rpgmakerweb.com/blog/tips-and-tricks-mapping-cliffs); Pokémon Essentials
   / Bulbapedia cliff-face+top-edge documentation (see below); Tiled layer docs; and any asset pack whose devlog
   documents a cliff system (verify the specific pack's own devlog — do not assume, pixel-verify per §"Mandatory
   verification" below).

## There is NO single universal STACKING order — three distinct engine-dependent families

Unlike the south-face rule, HOW the raised read is actually composited depends entirely on what layering
capability the target engine offers. Three families were found, each internally consistent but mutually
incompatible as a recipe:

### Family A — genuine z-ordered tile LAYERS (Tiled / Phaser / Godot TileMap)
Use REAL layering: a flat lower terrain → a cliff BODY (south face only) → a DISTINCT top-surface layer drawn
OVER the elevated cells. The raised percept is born from the top surface sitting on a genuinely DIFFERENT lower
terrain, combined with the south face — grass drawn directly on top of grass reads flat no matter what edge
treatment surrounds it. This is the natural fit for any engine with true multi-layer tilemaps.
-> source: Tiled documentation, multi-layer rendering (doc.mapeditor.org) — "ground layer holds base terrain,
   elevation layer holds cliffs/heights, decoration layer holds trees/props; elevation IS a separate layer, not
   embedded in the ground tile."

### Family B — one-autotile-layer-per-cell, DRAW-ORDER compositing (RPG Maker-style)
The same grid cell holds multiple autotile TYPES stacked by category — e.g. RPG Maker's A1 (animated/shadow), A2
(cliff), A5 (top/grass) — auto-connected per neighbor, and composited by draw-order: a "later" category (higher
row number in the tile-category convention) draws on top. The cliff face is EXPLICIT, pre-drawn in the A2 sheet
via 24×24 mini-tile composition (see ref:skill/grimorio.tileset-composition/project.autotiling.md); the "top" (grass rim) draws over it via category order,
not a real Z. This engine has NO native vertical-offset property — see ref:skill/grimorio.tileset-composition/project.layering.md's "engines without a native
offset" note; RPG Maker's elevation illusions are shading + draw-order/priority only.
-> sources: RPG Maker MZ Official Help, "Tileset Settings" (rpgmakerofficial.com); RPG Maker Official Blog,
   "Classic Tutorial: How Autotiles Work," "Tips and Tricks: Mapping Cliffs," "Making Multi-Level Bridge Tiles."

### Family C — side-by-side spatial placement (Pokémon-style)
No layer stacking at all: the south-facing cliff-FACE tile and the north-adjacent top/rim tile are placed as
ADJACENT tiles on the map, not stacked on top of each other, distinguished by per-tile PRIORITY values (0 =
behind player, 1 = covers body but not head — used for ledges/raised platforms, 2+ = above player head) rather
than by map layer. The raised read comes entirely from which two pieces sit next to each other plus their
priority tags.
-> sources: Bulbapedia, "Ledge" (bulbapedia.bulbagarden.net/wiki/Ledge); Eevee Expo, Pokémon Essentials tileset
   documentation (eeveeexpo.com/resources/10).

**Picking the family**: match it to what the target engine actually supports — genuine multi-layer tilemap → A;
single-layer-with-typed-autotiles → B; single-layer-with-per-tile-priority and no autotile stacking → C. Do not
import a recipe from the wrong family; they solve the same visual problem with mutually exclusive mechanics.

## Shadow — verify against the reference, do not assume

A soft, offset drop shadow is a common generic height cue (shadow displaced toward the viewer sells "this is
raised"), but it is NOT universal — some tilesets bake ambient occlusion directly into the cliff art and use no
separate shadow layer at all. **A hard-edged shadow rectangle is always wrong** regardless of which family
applies — it reads as an alpha/render glitch, never as a height cue. Match exactly what the specific reference
shows; a shadow's ABSENCE is correct when the reference has none, never a "missing shadow" defect.
-> source: xDasher devlog, "4 things we did to add light and depth to our Pixel Art Game" (pixel-beef.itch.io) —
   general drop-shadow height cue, for context; but treat any specific pack's actual shadow behavior as
   asset-specific fact to verify, not a rule to assume.

## MANDATORY: pixel-verify before coding

Elevation semantics are the most tileset-SPECIFIC thing in this entire skill, and text guides/devlogs are
frequently imprecise about a given pack's exact layer structure (independent research on one real devlog found
its own text description arguably ambiguous between reading as Family A or a shadow-offset variant — resolvable
only by opening the actual sheet). Before wiring an elevation model into code:

1. Open the actual tileset sheet image and a real reference SCENE (not just isolated tiles).
2. Confirm by eye which of the three families applies (does the engine actually offer multi-layer stacking? does
   the sheet ship typed/categorized autotiles? is there a per-tile priority system instead?).
3. Confirm which cells are body / top / face by eye, not by assumed naming.
4. Confirm the shadow behavior (present, and if so what shape; or genuinely absent) against the reference.

Never trust a prose description (a devlog, a wiki, or this file) over what the reference pixels actually show —
re-verify per §"the reference wins" in `SKILL.md`.
-> sources: RPG Maker MV/MZ autotile docs/blog; Tiled layer docs; Pokémon Essentials elevation (Bulbapedia / Eevee
   Expo); and whichever specific asset pack's own devlog applies to the tileset in hand.

-> This project's ENGINE choice (Family A applies) and the VERIFIED elevation model for our specific tileset:
   this project's own tileset memory.
