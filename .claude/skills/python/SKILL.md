---
name: python
description: "Language-level Python standards for backend services: type hints, module/function structure limits, async, Pydantic validation, Ports & Adapters via Protocol, error handling, and pytest testing. Load when writing, reviewing, or refactoring Python. Tells you HOW to write the code (the design tells you WHERE it goes)."
---

# Skill: python — backend Python standards

Universal conventions for clean, typed, testable backend Python (FastAPI-era). Portable to any Python service.

## Structure & typing
- **Type hints everywhere** — every function signature (params + return). Prefer precise types (`list[str]`,
  `X | None`, `Literal[...]`) over `Any`. A type checker (mypy/pyright) is a gate, not optional.
- **Small functions** — one responsibility, short (≈≤20 lines of logic). Extract a helper before nesting a third level.
- **Modules by responsibility**, not by kind-of-thing. A package (`domain/`, `engine/`, `provider/`) groups a
  concern; `__init__.py` exposes only the intended public surface.
- **No module-level mutable state.** Pass dependencies in (constructor / function args). Module scope = constants only.

## Data & validation
- **Pydantic (v2)** for anything crossing a boundary — HTTP bodies, wire contracts, config. Mirror external
  contracts field-for-field; never hand-parse dicts at the edge.
- **`@dataclass(frozen=True)`** or Pydantic models for internal value objects; prefer immutability.
- **Config fails fast**: validate required env/settings at startup (`pydantic-settings`); crash loudly if missing,
  never limp along with a `None`.

## Ports & Adapters (dependency inversion)
- Define seams as **`typing.Protocol`** classes (structural interfaces); inject an implementation. This is how a
  swap (provider, gateway, executor) becomes a new class, not a rewrite. One implementation per port unless a
  second is genuinely needed now.
- Keep the **functional core** (rules, interpreter, resolution) pure and deterministic; push I/O (HTTP, LLM
  calls, files) to a thin **imperative shell** at the edges. Purity is what makes replay and tests trustworthy.

## Async
- FastAPI handlers are `async`; `await` all I/O (httpx, the LLM SDK). Never block the event loop with sync I/O.
- Bound concurrency with `asyncio.Semaphore`; never spawn unbounded tasks.

## Errors
- A small **typed exception hierarchy** per failure kind — not bare `Exception` or error strings. Catch narrowly
  at the boundary, map to the right HTTP status. Never `except Exception: pass`.

## Testing (pytest)
- **AAA** (arrange / act / assert), one behavior per test; fixtures for setup, `parametrize` for cases.
- **Determinism**: inject fakes for LLM/HTTP (a scripted `FakeLlmClient`) so a pure run is byte-reproducible.
- **Never weaken an assertion to make a test pass** — a red test is a finding, not an obstacle.

## Anti-patterns
| Anti-pattern | Why it's bad |
|---|---|
| `Any` / untyped functions | kills the type checker's value; hides contract drift |
| Business logic inside the FastAPI handler | untestable, couples transport to rules — push it to the core |
| Module-level mutable globals | hidden shared state; breaks concurrency and tests |
| Hand-parsing external JSON into dicts | no validation, silent shape drift — use Pydantic |
| Broad `except Exception: pass` | swallows real failures; the 3am debugging nightmare |
| Concrete dependency hard-wired in a class | can't swap or test — depend on a `Protocol`, inject the impl |

-> Where the code goes for THIS project (the runner's module layout, named ports, and T-tasks):
   `architect-memory/docs/26` + the `arch-decision.md` for the current slice.
