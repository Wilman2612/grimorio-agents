# Layering — Compositing, Draw-Order, and the "Reused-Piece" Tricks

Universal reference for how draw order, layer stacking, and priority/passability rules turn a fixed set of tile
pieces into MULTIPLE visual reads (height, occlusion, "which floor is this") without drawing new art. Companion
to ref:skill/grimorio.tileset-composition/project.elevation.md (which covers specifically the ¾-cliff case) — this file covers the general layering toolbox
that elevation, second floors, bridges, and prop occlusion all draw from.

## The base compositing primitive: transparent overlay over opaque base

The universal building block, present in every engine surveyed: a layer holding mostly-transparent "detail"
tiles, stacked ABOVE a layer holding an opaque "base" tile, lets the base show through the transparent regions.
This is how a detail/decoration layer composes with a base fill WITHOUT pre-baking every base+detail combination
as its own tile.
-> source: Tiled Map Editor documentation, Layers manual (doc.mapeditor.org/en/stable/manual/layers); SLYNYRD
   Pixelblog #43, "Top Down Tiles Part 2" (slynyrd.com) — removing backgrounds from textures that don't fill the
   full tile space enables layering different texture combos on the fly.

**Standard layer stack for top-down terrain** (bottom to top): base ground → detail/blend layer → transitions →
elevated bodies/cliffs → props/decor → characters. This is a formal constraint that prevents both Z-fighting
(two opaque things claiming the same visual slot) and occlusion errors (something drawing over what should cover
it).
-> source: Tiled documentation on layers; convergent across every engine's docs surveyed.

## Decoupling PASSABILITY from DRAW-PRIORITY (the general elevation/occlusion trick)

The single most reusable idea in this file: an engine that separates "can an entity occupy this grid cell" from
"does this tile's art draw over an entity standing in that cell" can fake elevation, canopies, bridges, and
overhangs using ONLY existing pieces — no new art, no real Z coordinate.

**RPG Maker's star (☆) priority.** A tile flagged with star passability is walkable (the character can enter its
cell) but ALWAYS renders above the character regardless of screen position — unlike normal tiles, whose relative
draw order is computed from Y-position. Used for tree canopies, roof overhangs, tall-grass tops: the character
walks "into" the footprint while the tile's visual mass still occludes them.
-> source: RPG Maker MZ Official Help, "Tilesets" (https://rpgmakerofficial.com/product/MZ_help-en/01_08_10.html).

**The bridge trick — same art, two draw-order states via a state switch.** A documented pattern (and independently,
Pokémon Essentials' `$PokemonGlobal.bridge` + "Bridge" terrain tag) toggles a SINGLE tile's rendering priority and
passability via a runtime flag: while the flag is off, the bridge tile renders at normal priority and its
passability is ignored (the player can walk "beneath" it); while the flag is on, the same tile renders BELOW the
player (so the player appears to stand ON it) and normal passability applies. Two visually distinct elevation
reads from ONE piece of art, driven entirely by a state switch — never by moving pixels or introducing real depth.
-> sources: RPG Maker Official Blog, "Making Multi-Level Bridge Tiles" (rpgmakerweb.com/blog); Pokémon Essentials
   Engine Wiki, "Bridge" (essentialsengine.miraheze.org/wiki/Bridge).

**The tileset-swap variant.** A related pattern duplicates a tileset (pixel-identical art) but changes ONLY the
passability settings on the duplicate; a trigger swaps which tileset is active as the player crosses a
transition. The player never perceives the swap — only the walkability logic changes. This is the "same piece,
different passability layer" family, distinct from (and complementary to) offset-based tricks below, since here
the art is literally unchanged and only the rule layer differs.
-> source: RPG Maker Official Blog, "Making Multi-Level Bridge Tiles."

**Engines without a native offset: elevation is shading + draw-order only.** RPG Maker has no built-in vertical
pixel-offset property for tiles — any sense of elevation there comes from EITHER painted shading cues (art-level,
darker sides signal "higher") or the priority/passability trick above (engine-level), never a coordinate trick.
Knowing which mechanism family a target engine actually supports prevents assuming an offset feature exists where
it doesn't.
-> source: RPG Maker Official Blog, "Making Your Own Stair Tiles."

## Y-sort and its elevation-tier extension

**Plain Y-sort** (Godot's `y_sort_enabled` on any `CanvasItem`/`TileMapLayer`; the general "sort by screen Y"
convention) automatically reorders draw calls so lower-on-screen (higher Y) objects draw in front of
higher-on-screen (lower Y) objects — correct occlusion for top-down/isometric scenes without manually authoring
layer order per object.
-> source: Godot Engine documentation, `CanvasItem.y_sort_enabled` (docs.godotengine.org, stable).

**Plain Y-sort breaks down across multiple floors** — once two floors can occupy similar screen-Y positions, a
single global Y-sort cannot tell them apart. The documented fix is an ELEVATION-TIER extension layered ON TOP of
Y-sort, in one of several concrete forms:

- **Godot's per-tile `y_sort_origin`**: an integer offset shifting the Y-coordinate USED FOR SORTING only (not
  the tile's actual grid position or pixels) — lets a tall tile's "sort point" sit near its visual base rather
  than its bounding-box center, or bias a tile to sort as if it were at a different elevation tier than its
  literal grid Y implies. Multiple independent `TileMapLayer` nodes at the same grid alignment (e.g. a static
  ground layer + a separate Y-sorted walls/props layer) let ONE (x, y) cell hold both a ground tile and an
  occluding upper-tier tile drawn by a different layer — the clearest mechanical description of "hide the lower
  region, let the upper layer's tiles overdraw it" using only reused pieces.
  -> source: Godot Engine documentation, TileMapLayer / TileSet properties (docs.godotengine.org, stable).
- **Isometric elevation buckets** (Excalibur.js, Phaser-style): reuse the SAME tile graphic at a different
  apparent height by placing it on a separate layer carrying a distinct `elevation`/`z` property; a depth formula
  buckets draw order first by elevation, then by screen position within the bucket — e.g. `depth = cartX + cartY
  + z` (Excalibur) or `z = maxZIndexPerElevation × elevation + screenY` (Phaser/general isometric). Fractional
  offsets (`+0.1`) fine-tune ordering within a shared tier. This is the most literal "reuse the piece, place it
  at an offset, let the z-bucket hide the lower copy" implementation found.
  -> sources: Excalibur.js, "Isometric Tilemaps" (excaliburjs.com/docs/isometric); Erik Onarheim, "Handling Height
     in Isometric Tile Maps" (erikonarheim.com); "Phaser Isometric Game Tutorial: 2.5D Tile Rendering & Depth
     Sorting" (generalistprogrammer.com).
- **Tile Anchor vertical offset** (isometric buildings): anchor ground-level tiles at (0,0); anchor tiles meant to
  read one tier higher at (1,1) with an increased render-layer order — a tile-authoring-level recipe for the same
  outcome as the engine-architecture-level findings above, using the SAME wall/floor art.
  -> sources: Tiled Forum, "Proper way to Layer building tiles" (discourse.mapeditor.org/t/5350); Unity Tilemap
     documentation, Isometric Tilemaps.
- **Floor-per-pass rendering**: a robust multi-floor architecture renders and Y-sorts each floor as a fully
  separate pass (Floor 0's tiles → Floor 0's Y-sorted entities → Floor 1's tiles → Floor 1's Y-sorted entities…)
  rather than one global Y-sort across all floors — avoids Y-sort ambiguity between floors entirely; complements
  rather than replaces the elevation-bucketing approaches above.
  -> source: GameDev.net Forums, "Sprites draw-order sorting for top-down 2D game with floors and bridges."
- Naming the baseline failure explicitly: for complex tall objects (e.g. an arch spanning two floors), plain
  Y-sort by `boundingBox.top + boundingBox.height` is insufficient and the object must be split into multiple
  bounding boxes by height level, each sorted independently.
  -> source: Elias Daler, "Z-order in top-down 2D games" (eliasdaler.wordpress.com/2013/11/20).

## Sprite-stacking — pseudo-3D from stacked 2D slices (the same idea, applied to objects)

A 3D model is sliced into 8-16 horizontal cross-sections ("CT scan" slices), exported as one spritesheet, and
drawn as a stack of flat 2D layers with a slight offset per layer (based on camera angle). Read together, the eye
perceives one continuous 3D object rather than discrete flat slices. This generalizes directly to tile layering:
a tall wall/building can be thought of as slices where hiding a lower slice and drawing an upper slice over it at
an offset produces a taller-reading structure from REUSED flat art — the same underlying principle (reuse flat
art, offset it, let draw order do the work) as the tile-layer tricks above, just applied per-object.
-> sources: Sam DeLaughter, "Sprite Stacking: How to Make a 3D Game with a 2D Engine" (samd.is/2020/04/10); The
   Pixelnaut, "Sprite Stacking Tutorial" (thepixelnaut.com).

## Star-priority passability generalization

Any engine that lets you flag a tile/prop as "walkable but always-draws-above" (RPG Maker's star, or a manual
equivalent — e.g. a fixed high z-index combined with a passability override) can replicate the canopy/overhang
effect without true 3D geometry or new art. The requirement is only that the engine separates the collision/
occupancy question from the draw-order question — if it does, this trick is available regardless of which engine
it is.
