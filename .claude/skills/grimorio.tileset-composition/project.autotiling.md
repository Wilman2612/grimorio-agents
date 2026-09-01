# Autotiling — Composing Terrain Transitions

Universal reference for automatically selecting the right tile variant from a set, based on a cell's neighbors.
Applies to any engine with a tile grid.

## Corner/edge bitmasking — the 47-tile blob system

Each cell examines its 8 neighbors (4 cardinal edges N/E/S/W + 4 diagonal corners NE/SE/SW/NW). For each
neighbor, set a bit if it matches the current terrain type — this produces an 8-bit bitmask, 256 theoretical
values. Apply the **corner rule**: a diagonal bit only counts if BOTH its flanking cardinal edges are also solid
("if either edge of a corner is empty, the corner must also be empty"). This constraint eliminates 209 impossible
configurations, leaving exactly **47 valid tile shapes** — hence "blob" or "47-tile" tilesets. Use the bitmask
value as an index to select which of the 47 pre-drawn variants to draw.

Tile categories inside the 47: 1 center (all neighbors match), 4 straight edges, 15 inner corners, 8 outer
corners, 2 corridors, 17 remaining mixed configurations. The 47-tile format uses only 5 base minitiles to
generate all 47 variants (not solid outer tiles per variant), giving comprehensive inner/outer corner coverage
and single-tile-width path support that a naive 16-tile cardinal-only system cannot produce.
-> sources: Boris the Brave, "Classification of Tilesets" (boristhebrave.com/2021/11/14); Red Blob Games,
   "Autotiling — Interactive Guide to Procedural Tile Selection" (redblobgames.com/articles/autotile/claude);
   Jaconir Blog, "Bitmask Autotiling: 47-Tile Reference" (jaconir.online).

## Wang tiles / corner-Wang

Wang tiles (Hao Wang, 1960s) match constraints at tile CORNERS or EDGES rather than neighborhoods. **2-corner
Wang** = each of a tile's 4 corners is one of 2 values ("land"/"water") → 2⁴ = 16 tiles, indexed by summing
per-corner weights: NE=1, SE=2, SW=4, NW=8.

**Key structural difference from edge-matching**: a shared EDGE only affects 1 adjacent tile; a shared CORNER
affects 3 adjacent tiles. This produces a visually different result — corner-Wang gives a **patchier, more
terrain-patch-like** look (useful for navigation-relevant terrain diversity), while blob/edge-based autotiling
gives a smoother continuous blend. Neither is "better" — they are different visual grammars; pick per the desired
read.
-> source: cr31 (canonical corner-Wang reference, mirrored at
   https://boristhebrave.com/permanent/24/06/cr31/stagecast/wang/2corn.html); Boris the Brave, "Classification of
   Tilesets"; dev.to, "Wang 2-Corner Tiles" (joestrout).

**RPG Maker's mini-tile compositing** is a practical, shipped 4-corner-based realization: each 48×48 autotile is
assembled from four fixed 24×24 "minitiles" (color-coded by corner position — red=NW, green=NE, yellow=SW,
blue=SE in the sheet's authoring convention), selected per-neighbor and composited. Edges of adjacent minitiles
must match (right edge of red = left edge of green; bottom of green = top of blue) for the composite to tile
seamlessly. This yields ~48 practical variants from a compact 4-piece system.
-> sources: RPG Maker Official Blog, "Classic Tutorial: How Autotiles Work" (rpgmakerweb.com/blog); RPG Maker
   Wiki, "Auto-tile" (rpgm.fandom.com).

## Tiled's formal terrain-set workflow (a concrete, tool-enforced implementation)

Tiled's "Terrain Sets" (internally "Wang sets" since 1.5+; the pre-1.5 `<terraintypes>` XML element is deprecated
in favor of `<wangsets>`) formalize exactly this corner/edge system in a production tool:

- **Corner Set**: marks only the 4 corners → 16 tiles for 2 terrains (2⁴).
- **Edge Set**: marks only the 4 edges → 16 tiles for 2 terrains (2⁴). Used for linear features (roads, streams,
  fences).
- **Mixed Set**: marks all 8 indices (4 corners + 4 edges) → 256 tiles for 2 terrains (2⁸). Used when both corner
  and edge differentiation matter (e.g. water foam edges + corner depth gradients).
- The `wangid` attribute in TMX/JSON stores 8 terrain-color indices in the fixed order: **top, top-right, right,
  bottom-right, bottom, bottom-left, left, top-left.**
- The **WangFiller algorithm** selects a tile in two passes: a hard constraint filter (`candidateWangId & mask ==
  desired & mask`), then penalty-scoring the remaining ambiguity by transition smoothness across all 8 positions;
  after placement it re-resolves adjacent tiles that no longer match ("correction mode").
- The **Patterns tab** shows every possible terrain-combination pattern for the current set type, darkened when
  defined — a built-in gap-detector so missing combinations aren't discovered only by trial-and-error painting.
-> source: Tiled 1.12.2 documentation, "Using Terrains" (doc.mapeditor.org/en/stable/manual/terrain) and "TMX Map
   Format" reference; DeepWiki Wang Brush overview (deepwiki.com/mapeditor/tiled/6.4).

## Multi-terrain transitions — priority and routing

Classic autotiling handles one terrain vs "not this terrain." With 3+ terrain types (grass/water/dirt/forest…),
transitions between DIFFERENT types must be explicitly managed:

**Priority hierarchy.** Assign each terrain a numeric priority (e.g. Hills > Forest > Grass > Desert > Swamp >
Water). A cell "matches" its neighbor if the neighbor has same-or-higher priority. Draw each terrain's overlay
lowest-to-highest priority, so higher-priority terrain visually "wins" the boundary. Resolve ties (equal priority)
lexicographically.
-> sources: Tiled docs, "Using Terrains"; Godot Proposals issue #7670, "Refactor Terrain Tile Matching Algorithm"
   (github.com/godotengine/godot-proposals); Craft My Game, "Smart Autotiling" (craftmygame.com/features/autotiling).

**Routing (avoiding O(n²) transition art).** Rather than hand-drawing a transition tileset for every terrain
PAIR, build a graph where terrains are nodes and existing direct-transition tilesets are edges, then compute the
shortest path (BFS) when no direct A↔B transition exists — e.g. sand→water routes via an intermediate dirt/shore
tile if no direct sand-to-water art was drawn. This means artists only need tilesets for DIRECT neighbors in the
graph, not every combination.
-> source: dev.to, "Autotile Routing Pipeline" (tundraray, dev.to/tundraray/autotile-routing-pipeline).

**Never hand-roll a parallel selector.** Whatever autotile strategy the target engine ships (corner-Wang, blob-47,
9-slice-as-terrain), reuse its existing selector rather than building a second, competing one alongside it.
