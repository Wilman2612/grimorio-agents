---
name: grimorio.game-development
description: "Universal knowledge for building a client-side real-time game render that CONSUMES data and FEELS good: the game loop + the replay interpolation/tween model, an ECS-lite entity model, PixiJS v8 scene-graph + the async-init/StrictMode leak + lifecycle discipline, animation grounded in Disney's 12 principles, JUICE for a watched-on-mute surface, filters-for-look, and per-frame (fill-rate) performance. Load when building or reviewing a game render / battle view / animated canvas. game=DATA — the render never holds game logic. (Sourced + entropy-reviewed; not written from memory.)"
---

# Skill: game-development — a game render that consumes data and feels good

Universal conventions for a **client-side real-time render** (2D canvas/WebGL) that draws from an
already-computed data stream. This is a distinct discipline from app-frontend work — it thinks **frame-by-frame,
in entities, about the tween between discrete states, and about feel + per-frame fill-rate**.

> **Hard invariant for our kind of game: game = DATA.** The render CONSUMES the event transcript / view-model;
> it does NOT simulate game logic and holds NO authority (the server/interpreter is the source of truth). The
> loop *interpolates/animates* between discrete already-decided states — it never decides an outcome. Because it
> is **non-interactive** (a watch/replay, no input), much "gameplay" canon (control feel, physics) does NOT apply —
> see the authorities note.

## The frame model + THE REPLAY TWEEN MODEL (the hard core — do not hand-wave it)
- Separate **UPDATE** (advance animation state) from **RENDER** (draw). Drive with the engine ticker
  (`Ticker` → the callback receives a **`Ticker` instance**; use `ticker.deltaTime`/`ticker.deltaMS`, not a raw
  delta). Delta-timed — never assume a fixed FPS.
- **The source of truth is the DATA; the loop tweens between its discrete states.** Specify HOW:
  - **Double-buffer + alpha-lerp**: hold the previous + current entity snapshot, render at refresh rate, lerp by
    an alpha accumulator. (Glenn Fiedler, *"Fix Your Timestep!"* — the standard for decoupling render from
    discrete state.)
  - **An animation QUEUE with a collapse-to-latest rule**: a fast/live match (SSE) can deliver several `beat`s
    before a strike/hit/KO animation finishes. Without an explicit queue + a skip/collapse-to-latest policy the
    canvas either falls behind reality or drops the KO. Decide the policy explicitly.
  - **A State-pattern guard on `AnimState`** (idle→strike→hit→defeated): a unit that **dies mid-strike** must
    interrupt cleanly, not double-play. (Nystrom, *State* pattern.)
- **Fixed timestep is only for physics-like simulation** — for a positionless/no-physics render it does NOT
  apply; don't cargo-cult it.

## Entity model (ECS-lite) — the fix for "who died" bugs
- Model the scene as **entities with components** (`position`, `hp`, `appearance`, `animState`), maintained by a
  **reducer that folds events ONCE**. State that belongs to a thing lives **on that thing**. Never re-derive
  per-entity state from raw events every frame — that ad-hoc fold is exactly how "which unit died" gets
  mis-attributed (killer vs fallen). (Nystrom, *Component* — render side only; we do NOT run his simulation loop.)

## PixiJS v8 discipline (v8 changed a lot from v7 — these are the ones that bite)

> **Engine note (tracked grimorio self-repair item): the project has committed to Phaser 3, not PixiJS.** This
> section's specifics are PixiJS v8 API calls — translate each to its Phaser 3 equivalent before applying it;
> do not follow them verbatim against a Phaser codebase. -> the commitment + how to translate:
> `./developer-behavior.md` → "Reading the ref:skill/grimorio.game-development canon (engine translation note)".
- **Bootstrap is ASYNC:** `const app = new Application(); await app.init(opts)` — NOT the v7 `new Application(opts)`
  constructor. Options go to `init()`.
- **The React↔Pixi v8 mount race — the REAL leak (not just "destroy on unmount"):** `app.init()` is async and
  React StrictMode **double-mounts in dev** (mount→unmount→remount). Teardown then runs *before* the first
  `await app.init()` resolves, the resolved app attaches to an unmounted node, and it **leaks a whole WebGL
  context** (pixi-react #602). Browsers cap **~16 live contexts** → this **crashes the page**, far faster than
  "GPU memory" implies. **Rule:** guard the async init with a `destroyed`/cancelled flag; in cleanup, `destroy()`
  **even if init hasn't resolved yet**; verify unmount→remount (StrictMode ON) leaks **zero** contexts.
  Distinguish *GPU-texture-memory* (slow leak) from *WebGL-context exhaustion* (hard cap, fast crash).
- **Teardown needs options:** `container.destroy({ children: true, texture: true })` — a bare `destroy()` leaves
  child textures on the GPU.
- **Graphics is shape-then-style in v8:** `g.rect(x,y,w,h).fill(0x…).stroke({ width, color })`. **`beginFill()` /
  `lineStyle()` / `endFill()` are REMOVED** — procedural drawing must use the v8 idiom or it won't compile.
- **`app.canvas`**, not `app.view` (renamed).
- **Code-split the engine** (heavy) to the route that needs it (`dynamic(ssr:false)`); never in the main bundle.
- Source: PixiJS v8 Migration Guide (pixijs.com/8.x/guides/migrations/v8); pixijs/pixi-react #602; React StrictMode docs.

## The LOOK: filters (know what actually ships in v8)
- A filter stack is a cheap way to get a graded look — BUT in **v8 only these ship in `pixi.js`**: `AlphaFilter,
  BlurFilter, ColorMatrixFilter, DisplacementFilter, NoiseFilter`. **Vignette / scanline / CRT are NOT built-in**
  — they live in the separate **`pixi-filters`** package (v8 sub-module import; the old `@pixi/filter-*` are
  unmaintained for v8), which is a **bundle-size + license line to declare**, OR write a custom `Filter` (fragment
  shader).
- Filters cost **fill-rate**: apply at the **container** level, not per-sprite, and **collapse passes** — fold
  desaturate + tint + brightness into ONE `ColorMatrixFilter`, and grain + scanline + vignette into ONE custom
  shader, rather than 5 stacked full-screen passes.
- **Appearance is a swappable seam** — draw "by identity" through a provider (procedural → asset atlas →
  commissioned); never a hardcoded asset path. Procedural/programmer-art first; **AI-generated game images are
  unreliable — do not depend on them.**
- **`BitmapText`, not `Text`, for anything that updates per frame/hit** (HP readouts, floating damage numbers):
  each `new Text()` rasterizes its own texture — spawning one per hit is the "texture-per-frame" churn. `Text`
  is for static labels only.

## Animation + JUICE (the discipline for a NON-INTERACTIVE animated spectacle)
- The governing authority is **Frank Thomas & Ollie Johnston, *The Illusion of Life* — Disney's 12 principles**:
  **staging, timing, anticipation, exaggeration, follow-through/overlapping action, squash & stretch, arcs,
  secondary action**. For a watch render, **staging + timing + anticipation + exaggeration ARE the job**.
- **Juice toolkit** (Vlambeer/Nijman, *"The Art of Screenshake"*): **hit-stop** (freeze a few frames on impact),
  **screen-shake — with ROTATION, not just translation** (pure translation "reads as a glitch"; a few tenths of
  a degree of rotation "reads as force") using **three magnitudes** (routine / event / peak-KO); **squash &
  stretch**, **knockback**, **flash / particles**. A hit must **LAND with weight**; the KO/win is the **peak**
  (Peak-End).
- **The surface is watched ON MUTE (tiktokeable):** short-form video autoplays silent, so feel must be **fully
  legible without sound**, **at small size**, and **looping**. **Telegraph/anticipate** the hit so a spectator
  who didn't press a button can parse it (staging). **Stage the KO INSIDE a fixed, share-safe frame** — never off-edge.

## Performance (know the real bottleneck here)
- **~16 ms / 60 fps.** For a small scene (~2 entities) the dominant cost is **fill-rate: full-screen filter
  passes**, NOT allocation — reduce passes first (above). Object-pooling matters when there are **many**
  sprites/particles (don't allocate in the loop → GC hitches).
- **v8 culling is MANUAL** (`cullable` / `Culler` / `CullerPlugin`) — a bare "cull off-screen" is a no-op unless
  you opt in; for a fixed top-down board with no camera pan, culling is arguably unnecessary — say so, don't cargo-cult.

## Accessibility (a canvas is opaque to assistive tech)
- A `<canvas>` has **zero semantic content** for screen readers. Any information conveyed only in the canvas MUST
  also exist in the DOM fallback / an `aria-live` region — **WCAG 1.1.1 (non-text content) + 4.1.2**. (The
  SSR/no-WebGL fallback to a DOM renderer serves both AT users and reduced-motion.) `prefers-reduced-motion` is a
  **separate** concern from AT access — don't conflate them.

## Anti-patterns
| Anti-pattern | Why it's bad |
|---|---|
| Re-deriving entity state from raw events every frame | who-died mis-attribution + churn; state belongs on the entity |
| Simulating game logic / deciding outcomes in the renderer | breaks game=DATA; the interpreter is the authority |
| No explicit tween model (double-buffer/lerp) + no animation queue | canvas falls behind a fast match or drops the KO — the hard part, un-done |
| Async `app.init()` with no `destroyed`-guarded teardown | StrictMode/route-change leaks WebGL contexts → page crash at ~16 |
| Bare `destroy()` (no `{children,texture}`) / undestroyed ticker | GPU leak |
| `Text` for per-hit numbers; 5 stacked full-screen filters | texture-per-frame + fill-rate bottleneck — `BitmapText` + ≤2 passes |
| Translation-only screen-shake | reads as a glitch, not force — add rotation + magnitude tiers |
| Relying on sound for feel on a muted autoplay surface | the beat must read silent + small + in-frame |
| Hardcoding an asset path / depending on AI-generated images | can't swap art; unreliable |
| Shipping the engine in the main bundle | bloats every route — code-split |

## Game-feel checklist (builder builds TO it; the `ux` critic evaluates AGAINST it)
- Does an impact **LAND** (hit-stop / shake-with-rotation / flash / knockback), or just change a number?
- Is the **peak** (KO/win) the loudest beat, and **staged inside a share-safe frame**?
- Motion **eased**, with **anticipation/telegraph** + follow-through — not linear?
- **Watch-surface**: reads on **mute**, at **small size**, loop-friendly?
- **`prefers-reduced-motion`** honored AND a **DOM fallback** carries the info for AT (WCAG 1.1.1)?
- **60 fps** held — filter passes ≤2, teardown leaks **zero WebGL contexts**, no per-frame alloc?

The checklist above is JUICE/feel. It is NOT the CONVENTIONS/MECHANICS bar — HUD (resource + health bars),
speed/PAUSE controls, construction/harvest feedback, readable unit behavior, camera/zoom range, streamed load.
A juice-and-aesthetics gate will PASS a loop missing all of those (it happened, 2026-07-22). A render needs a
game-CONVENTIONS/MECHANICS critic, separate from the aesthetic/`ux` critic, that checks against:
-> deeper: **./project.conventions.md** — the self-improving conventions canon + the known-wrong catalog (the mistakes we
   have already made, so we stop re-making them). Build TO it; the conventions critic evaluates AGAINST it.

## Authorities (grounded; a finding cites one of these, not taste)
- **Thomas & Johnston, *The Illusion of Life* (Disney's 12 principles)** — THE authority for a non-interactive
  animated spectacle (staging/timing/anticipation/exaggeration/squash&stretch).
- **Robert Nystrom, *Game Programming Patterns*** — the **render-side** patterns only (Game Loop, Update Method,
  State, Component, Object Pool, Dirty Flag); we do NOT run his simulation loop (game=DATA).
- **Glenn Fiedler, *"Fix Your Timestep!"*** — decoupling render from discrete state (double-buffer + alpha lerp).
- **Jan Willem Nijman / Vlambeer, *"The Art of Screenshake"*** + Jonasson & Purho, *"Juice it or lose it"* — the
  juice toolkit (rotation-shake, tiers, hit-stop).
- **Steve Swink, *Game Feel*** — **polish vocabulary ONLY**; its core (real-time control within a <100 ms
  correction cycle + simulated space) does NOT apply to a non-interactive watch/replay.

-> This project's game render (the `MatchRenderer` adapter, PixiJS v8 decision, `Character`/appearance/position
   seams, game=DATA): the battle-render arch-decisions + ref:skill/grimorio.architect-memory. The `pixi-filters`-vs-custom-shader
   bundle/license call is a `solution-architect` decision.
-> Frontend architecture the render still obeys (DAL, Fake, Storybook, decoupling): ref:skill/grimorio.frontend-development. The
   look/feel bar: ref:skill/grimorio.ux-memory → "Design Canon" + `design-context.md`.
