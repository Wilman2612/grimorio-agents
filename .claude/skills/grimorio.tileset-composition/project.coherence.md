# Coherence Tricks — Making Cut Pieces Read as ONE Place

Universal reference for the composition tricks that make separately-cut, separately-drawn, or separately-sourced
tile pieces read as a single cohesive environment rather than a pile of stickers.

## Decompose the source into reusable PARTS, then reorient

Real tilesets are not built by drawing every combination whole — they are built by decomposing a full asset into
reusable pieces (edges, corners, interior fills, fragments) and then rotating / flipping / recombining them so
the assembled result reads as one cohesive piece or as many varied pieces. A complete tileset can be built from a
much smaller subset of drawn components: one cited progression reduces a 47/48-tile complete set down to ~13 core
drawn pieces via this decomposition.
-> source: Sandro Maglione, "How to Create a Pixel Art Tileset — Complete Guide" (sandromaglione.com).

**Reflection and palette-swap for efficiency.** A single drawn angled piece (e.g. a rock face or cliff wall),
horizontally flipped, produces the opposite-facing piece; combined with a palette/color swap it can produce a
visually distinct variant from the same base draw. This is a direct extension of the decompose-and-reorient
principle — one drawn piece → multiple placed pieces.
-> source: SLYNYRD Pixelblog #43, "Top Down Tiles Part 2" (slynyrd.com/blog/2023/3/26).

**The failure mode this prevents**: stamping whole pre-assembled blobs (rather than decomposed, reoriented parts)
produces the "sticker on top" look — pieces read as pasted rather than belonging to the terrain. Cut and orient
like the reference does; never assemble from whole undifferentiated chunks.

**Verify adjacency in real time, not blind.** Tools that show live tile-connection previews while editing (Pyxel
Edit, Aseprite) prevent decomposition mistakes from shipping — check how a piece reads against its neighbors as
you cut it, not only after the full set is assembled.
-> source: SLYNYRD Pixelblog #43.

## Duplicate the CENTER, vary sparingly — never fake variety by flipping directional tiles

Create 2-5 interior variants of ONLY the highest-use tiles to break visible repetition, without multiplying total
tileset size — not "vary every tile," but target the tiles that will actually repeat most on a real map.
-> source: Sandro Maglione, "How to Create a Pixel Art Tileset — Complete Guide."

**Prefer a thin, separate detail layer over pre-baking every base+detail combination.** By removing the
background from a texture element that doesn't fill the whole tile, that element can be layered onto different
base fills on the fly — avoiding the combinatorial explosion of pre-rendering every base×detail pair as its own
tile. (This is the same transparent-overlay primitive documented in ref:skill/grimorio.tileset-composition/project.layering.md, applied here specifically to
avoid repetition rather than to build height.)
-> source: SLYNYRD Pixelblog #43.

**Pattern variance within a seamless loop is not a contradiction.** A base repeating texture must still loop
cleanly on all four sides (seam test, see ref:skill/grimorio.tileset-composition/project.cutting.md), but the internal pattern (e.g. wave lines in sand) can
vary WITHIN that loop to avoid monotony — watch for connected patterns that read as unintentional "noodles" when
tiled repeatedly.
-> source: SLYNYRD Pixelblog #43.

**Do NOT flip or shift a directional tile to fake variety** — a tile drawn with a single light source or
intentional asymmetry inverts visibly wrong when mirrored (see ref:skill/grimorio.tileset-composition/project.workflow.md's symmetric-vs-unique
classification). Variety comes from genuinely new variants or the detail-layer trick above, never from mirroring
a directional piece.

**"Tile borders" as a repetition-breaker.** Drawing seamless base tiles, then covering their edges with distinct
border pieces of a DIFFERENT size, breaks up grid-lock repetition by disrupting the uniform tile-boundary rhythm
the eye otherwise picks up on.
-> source: Game Developer Magazine, "Splatter Tiles" (gamedeveloper.com/art/splattertiles).

**Probability-weighted decoration scatter.** Rather than hand-placing every decorative element, layer a
decoration tileset with a low placement probability (roughly 0.01-0.3) so props (bushes, rocks) scatter
organically instead of appearing in a regular, obviously-tiled pattern.
-> source: Tiled documentation, "Using Terrains" (doc.mapeditor.org).

## Shadow as a coherence + depth cue for props/characters (distinct from cliff shadow — see ref:skill/grimorio.tileset-composition/project.elevation.md)

A rounded drop shadow beneath a mobile object (player, prop) sells elevation cheaply: shrink the shadow while the
object is airborne to reinforce a jump/height read. Hand-painted shadows (baked into the sprite or a decoupled
shadow sprite tracking the parent's position with a fixed offset) are the traditional pixel-art-era approach and
remain standard for aesthetic consistency and performance versus dynamic lighting.
-> sources: xDasher devlog, "4 things we did to add light and depth to our Pixel Art Game" (pixel-beef.itch.io);
   Medium, Matt Buckley, "Creating Depth in a 2D World" (medium.com/@mattThousand).

## THE #1 COHERENCE LEVER: a unified, constrained palette

A unified, constrained color palette across ALL assets — even ones sourced or drawn separately — does more to
make disparate pieces read as one place than resolution, animation quality, or tile complexity combined. Palette
constraint/swapping can make assets originally drawn by different artists read as though they belong to the same
set.
-> source: "Pixel Art Color Palettes — Complete Guide" (freepixel.art/blog/pixel-art-color-palettes-complete-guide).

**Practical hierarchy**: use a primary, muted palette for large surfaces (base terrain); reserve saturated ACCENT
colors for props and interactable objects. This creates a functional visual language (accents draw attention to
what matters) without breaking overall coherence. An over-saturated, "candy/plasticky" terrain tone across the
whole map is this rule failing.
-> source: tileset composition best-practices aggregation (flooringclarity.com/tile-set-design-2d-games); "Pixel
   Art Color Palettes" guide.

**Match detail level and visual scale across components.** A highly detailed prop next to a simple flat tile
breaks immersion; a tiny decorative element next to an oversized one on the same grid disrupts spatial coherence.
Consistency in BOTH detail density and perceived scale is as important as palette unity.
-> source: tileset composition best-practices aggregation (flooringclarity.com).

## Modular design is coherent by construction

Composing an environment from a limited set of REPEATED modular pieces (rather than many bespoke one-off assets)
enforces consistency automatically, because the same pieces recombine everywhere — this is both an art-production
efficiency gain and a direct coherence mechanism.
-> source: Joel Burgess, "Skyrim's Modular Level Design" (GDC 2013 transcript, blog.joelburgess.com/2013/04).

**Proof-read the assembled whole before declaring a tileset done.** A crude template showing all tiles and their
connection possibilities together (not just pairwise) surfaces cohesion problems that isolated tile-by-tile
review misses.
-> source: SLYNYRD Pixelblog #43.
