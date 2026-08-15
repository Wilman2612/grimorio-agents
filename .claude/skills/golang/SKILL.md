---
name: golang
description: "Universal Go conventions for building services and simulation kernels: layout, error handling, concurrency (goroutines/context), testing, determinism traps (map iteration order!), and hot-loop performance. Load before writing any Go in this repo."
---

# Go — Universal Conventions

Universal Go knowledge for any project. Project-specific decisions (which services exist, their
contracts) live in the owning memory skills — not here.

## Layout & tooling
- One module per service: `go.mod` at the service root. Binaries under `cmd/<name>/main.go`; private
  packages under `internal/` (enforced by the compiler — use it, it's the default for non-shared code).
- `gofmt` (or `go fmt ./...`) is not optional; run `go vet ./...` with tests. No custom formatting debates.
- Prefer the standard library. Add a dependency only when it clearly beats stdlib (heuristic: would you
  write >200 lines to replace it? If not, write the lines).

## Errors
- Errors are values: return them, wrap with context — `fmt.Errorf("loading spec %q: %w", name, err)` —
  and check with `errors.Is`/`errors.As`.
- **Never panic across a package/API boundary.** `panic` is for programmer bugs caught in development
  (asserting an invariant), never for expected failures (bad input, I/O). A library that panics on bad
  input is broken.
- No naked `_ = err` swallowing. If an error is genuinely ignorable, comment why.

## Concurrency
- Goroutines are cheap; leaking them is not. Every long-lived goroutine needs a documented owner and an
  exit path — usually a `context.Context`: pass `ctx` as the first parameter of anything that blocks,
  and select on `ctx.Done()` in loops.
- Share memory by communicating (channels) for pipelines/fan-out; use `sync.Mutex` for simple shared
  state — do not build channel mazes where a mutex is clearer.
- One battle/job = one goroutine (or a small pool) is the natural unit. A `sync.WaitGroup` joins them.
- **Always run tests with `-race`.** The race detector is the single highest-value Go tool; a data race
  found late is a heisenbug forever.

## Determinism (CRITICAL for simulations)
- **`map` iteration order is deliberately randomized per run.** Any sim logic that iterates a map and
  mutates state in that order is nondeterministic — same seed, different battle. Rules:
  - State that is iterated during the tick lives in **slices** (Structure-of-Arrays), never maps.
  - Maps are fine as INDEXES (spatial hash buckets, lookups) as long as you iterate a stable slice of
    keys or drain per-entity in slice order — never `for k := range m` feeding state mutation.
- Randomness: one `rand.New(rand.NewSource(seed))` PER simulation instance, threaded explicitly — never
  the global `rand` (shared across goroutines = cross-battle nondeterminism + lock contention).
- **Float FUSION is the trap the "same platform" rule hides.** The Go spec explicitly permits an implementation
  to "combine multiple floating-point operations into a single fused operation, possibly across statements, and
  produce a result that differs from the value obtained by executing and rounding the instructions
  individually." So `a*b + c` may become one FMA on arm64 and two rounded ops on amd64 — **same source, same
  seed, divergent results**, and a golden test that passes on the dev machine and fails in CI (or worse, in
  arbitration). Force the intermediate rounding where the value is load-bearing: `float64(a*b) + c` — the spec
  guarantees an explicit conversion breaks the fusion. Audit multiply-then-add in any damage/score/tuning math.
- Float math is otherwise deterministic on one platform/build; do not mix in parallelism WITHIN one battle
  unless the reduction order is fixed. Parallelism ACROSS battles is always safe.
- Time: never read the wall clock inside sim logic; the tick counter is the only clock.

## Testing
- Table-driven tests are the house style: a slice of named cases, one `t.Run(name, ...)` each.
- `go test -race ./...` in CI; add `-run` filters locally. Benchmarks (`func BenchmarkX(b *testing.B)`)
  for any hot loop you claim is fast — measure, don't assert.
- Golden/determinism test for a sim: same seed → byte-identical event stream. This is the cheapest
  regression net a deterministic engine can have; write it first.

## Hot-loop performance
- Preallocate: `make([]T, 0, n)` outside the loop; reuse buffers across ticks (the GC is fine, but not
  in a per-tick allocation storm).
- Structure-of-Arrays beats Array-of-Structs for vectorizable passes (positions `[]float64` x/y planes).
- Avoid interface calls and closures in the innermost loop (defeats inlining); keep the hot path concrete.
- Profile before optimizing: `go test -bench . -cpuprofile` + `go tool pprof`. The bottleneck is never
  where you guessed.

## Clean code — the house rules, in Go
The house limits (same as the ref:skill/javascript / ref:skill/python / ref:skill/development-patterns#structural-hard-limits skills) apply to Go:
- **Function body: max 20 lines** (inside the braces, counting blanks/comments; signature excluded). Extract a
  helper before nesting a third level. Named exceptions, data not logic: table-driven test case TABLES, and an
  exhaustive `switch` dispatcher whose arms are each 1–2 lines (mapping, not logic).
- **File: max 500 lines.** A package has ONE responsibility; split before it becomes a god-package.
- **Happy path left-aligned** (Go proverb): guard clauses + early returns; never `else` after a return.
- **Interfaces are SMALL (1–3 methods) and defined at the CONSUMER** ("accept interfaces, return structs").
  This IS SOLID in Go: SRP = small packages/types; OCP = new behavior via a new implementation registered at a
  seam, never editing switch-cases scattered across the code; ISP/DIP = the consumer declares the minimal
  interface it needs and concrete types are wired in `cmd/`/main. Giant interfaces are a design smell.
- **Composition, never inheritance-simulation**: embedding sparingly, for composition — not to fake hierarchies.
- **No stutter** (`spec.Load`, not `spec.SpecLoad`); short receiver names; every exported symbol documented.
- Canonical prior-art: *Effective Go*, the Go Proverbs, and Google's Go Style Guide — Go's own clean-code canon.

## Anti-patterns
| Anti-pattern | Consequence |
|---|---|
| A 60-line function "because it's just one tick phase" | Unreviewable, untestable in pieces; the house 20-line limit exists in every language here — extract phase helpers |
| One giant interface implemented by everything | ISP violation Go-style; consumers depend on methods they never call and mocks balloon |
| `for k := range someMap` driving state mutation in a sim tick | Nondeterminism: same seed, different battle — impossible to replay or dispute |
| Global `rand` in concurrent sims | Cross-battle nondeterminism + lock contention |
| `panic` on bad input in a service handler | One bad request kills the process (or demands recover-middleware hacks) |
| Goroutine without a context/exit path | Leaks under load; the service degrades over days, not in tests |
| Skipping `-race` because it is slow | A data race ships and corrupts state rarely and unreproducibly |
