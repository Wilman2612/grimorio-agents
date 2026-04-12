---
name: development-patterns
description: "Use when: writing, reviewing, or refactoring any TypeScript code in this repo. Enforces the 14 mandatory patterns, anti-patterns forbidden list, structural hard limits, and pattern composition rules. Activate anytime code is created or changed in src/**/*.ts or apps/**/*.ts."
applyTo: "src/**/*.{ts,tsx},apps/**/*.{ts,tsx},scripts/**/*.ts"
---

# Development Pattern Standards

Apply these rules on every code write, review, or refactor in this repository.
The full reference lives in `docs/development-pattern-standards.md`.

> **Related skill**: `javascript` ΓÇö covers language-level standards (naming, async, formatting, SOLID). This skill covers **architectural patterns** specific to this codebase. Both skills complement each other: `javascript` tells you *how to write the code*, this skill tells you *where to put the code and how to wire the layers*.

---

## Mandatory Patterns ΓÇö Cheat Sheet

| # | Pattern | When | Hard Rule |
|---|---------|------|-----------|
| 1 | **Repository** | Any persistence access | Zero Prisma imports in `application/` or `domain/` |
| 2 | **Adapter (Port + Impl)** | Any external SDK/service | Zero raw SDK imports in `application/` or `domain/` |
| 3 | **Dependency Rule** | Always | `domain/` only imports from `domain/` |
| 4 | **Domain Events** | Any command that mutates state | Every command handler must `eventBus.publish()` |
| 5 | **CQRS** | Any business operation | Commands mutate + emit events; Queries read-only |
| 6 | **Handler / Use Case** | Any API route or job | Route max 80 lines; delegates to handler |
| 7 | **Strategy** | ΓëÑ2 behavioral variants | No long if-else or switch chains |
| 8 | **Factory / Builder** | Complex object creation | Aggregates use static factory methods |
| 9 | **Result / Error Object** | Expected business failures | Never `throw` for business errors ΓÇö use `Result<T, E>` |
| 10 | **Mapper** | Prisma model Γåö domain entity | In `infrastructure/persistence/prisma/mappers/` |
| 11 | **Dependency Injection** | Any class with external deps | Constructor injection; wired in `container.ts` |
| 12 | **Policy Object** | Business rules that change independently | Extract to standalone policy class |
| 13 | **Template Method / Pipeline** | Fixed stages, variable implementations | Do not inline stages in a single function |
| 14 | **Route Guard (IRouteGuard)** | Every authenticated route | Use `Container.getInstance().getRouteGuard().wrap()` / `.wrapWithParams<T>()` ΓÇö never manual `getCurrentUser()` in route files |

---

## Structural Hard Limits

- File: max **500 lines**
- Function body: max **20 lines** (lines inside `{}`, not counting signature or braces)
- Route handler: max **80 lines**
- Module function count: max **20**
- **Zero** direct Prisma imports outside `infrastructure/persistence/`
- **Zero** direct SDK imports outside `infrastructure/`

---

## Anti-Patterns ΓÇö Never Do

- **Magic strings for error discrimination** ΓÇö `if (err.message === "Already premium")`. Use typed errors: `class BillingError extends Error { code: BillingErrorCode }` and check `instanceof BillingError && err.code === "ALREADY_PREMIUM"`.
- **Magic strings for domain constants** ΓÇö `?? "FREE"` scattered across files. Extract to a named constant in the domain: `export const DEFAULT_TIER: UserTier = "FREE";` and import it everywhere.
- **Fat route handler** with orchestration or business logic.
- **Patch over patch** ΓÇö adding a workaround on top of a structural problem instead of fixing the layer.
- **Cross-layer shortcut** ΓÇö calling Prisma from a route, calling a repository from a domain entity.
- **God module** ΓÇö one file with many responsibilities.
- **Boolean/flag explosion** ΓÇö multiple boolean params controlling branch behavior.
- **`.env.test` placeholder keys overriding real keys** ΓÇö never put `KEY=placeholder` in `.env.test` for keys that are needed by integration tests; placeholders win over `.env` base file due to Vite `loadEnv` merge order.
- **Impure free function** ΓÇö a standalone function (not a class method) that performs I/O, reads `process.env`, or calls an external service. Free functions are only valid when they are pure or near-pure (deterministic, no side effects, no hidden dependencies). The moment a function crosses any of these three limits it must become a class method with constructor-injected dependencies. See rule below.

---

## Free Function vs Class Method ΓÇö Decision Rule

A free-standing function is valid **only** when all three conditions hold:

1. It performs no I/O (no DB, no network, no file system).
2. It does not read `process.env` in its body (values captured at module load time become invisible to tests and cannot be overridden without restarting the process).
3. It calls no external service or singleton.

If any condition fails, the logic belongs in a class method with its dependencies injected through the constructor.

```typescript
// Γ¥î Looks like a helper ΓÇö actually untestable
async function notifyUser(userId: string) {
  const db = new DatabaseClient();                        // I/O hidden inside
  const user = await db.users.findById(userId);
  await fetch(process.env.NOTIFY_URL + "/push", { ... }); // env read at call time
}

// Γ£à Same logic ΓÇö dependencies explicit, injectable, mockable
class UserNotificationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly pushClient: IPushClient,
  ) {}

  async notify(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    await this.pushClient.send({ recipientId: user.id });
  }
}
```

**Why this matters for tests**: a free function that hides I/O cannot be unit-tested without hitting the real infrastructure. A class with injected interfaces can be tested by passing fakes ΓÇö no network, no DB, no env required.

**Why `process.env` at module level is a trap**: the value is captured once when the module is first imported. Any test that changes `process.env.SOME_KEY` after that point sees the old value. The fix is to read env inside the method body, or ΓÇö better ΓÇö inject the value as a constructor parameter.

---

## Typed Domain Errors (Critical Pattern)

Every module that can fail with distinct business reasons must define a typed error:

```typescript
// Γ£à domain/billing/services/billing.service.ts
export type BillingErrorCode = "ALREADY_PREMIUM" | "CUSTOMER_NOT_FOUND" | "BILLING_PROVIDER_ERROR";

export class BillingError extends Error {
  constructor(public readonly code: BillingErrorCode, message: string) {
    super(message);
    this.name = "BillingError";
  }
}
```

```typescript
// Γ£à Handler ΓÇö produces typed error
if (command.tier === "PREMIUM") {
  return fail(new BillingError("ALREADY_PREMIUM", "El usuario ya tiene suscripci├│n activa"));
}
```

```typescript
// Γ£à Route ΓÇö discriminates by code, not message string
if (result.isFailure()) {
  const err = result.error;
  if (err instanceof BillingError && err.code === "ALREADY_PREMIUM") {
    return NextResponse.json({ error: "ALREADY_PREMIUM" }, { status: 400 });
  }
  return NextResponse.json({ error: "BILLING_ERROR" }, { status: 500 });
}
```

---

## IRouteGuard ΓÇö Required for All Authenticated Routes

`IRouteGuard` is registered in the container (`getRouteGuard()`) and receives `IAuthProvider` via constructor injection. Routes consume it at module level ΓÇö the guard is a singleton, auth resolution happens per request inside `wrap()`.

```typescript
// Γ£à Static route (no dynamic segments)
import { Container } from "@/config/container";

const guard = Container.getInstance().getRouteGuard();

export const GET = guard.wrap(async (user, req) => {
  // user: AuthenticatedUser ΓÇö already resolved and validated
});

export const POST = guard.wrap(async (user, req) => {
  // re-use same guard instance, don't call getRouteGuard() again
});
```

```typescript
// Γ£à Dynamic route ([id] segment)
import { Container } from "@/config/container";

const guard = Container.getInstance().getRouteGuard();

export const GET = guard.wrapWithParams<{ id: string }>(async (user, req, { id }) => {
  // params already awaited ΓÇö no need to call await params manually
});
```

**Exceptions** (do NOT use the guard):
- Cron jobs ΓÇö use `timingSafeEqual` Bearer token check
- Webhooks ΓÇö use signature validation (Standard Webhooks / Svix)

**Test mocking pattern** ΓÇö mock the container, never `@/lib/auth-helpers`:

```typescript
vi.mock("@/config/container", async () => {
  const { NextResponse } = await import("next/server");
  return {
    Container: {
      getInstance: () => ({
        getRouteGuard: () => ({
          wrap: (handler) => async (req) => {
            const user = await mockGetOrCreateUser(req);
            if (!user) return NextResponse.json({ code: "UNAUTHORIZED", message: "No autorizado" }, { status: 401 });
            return handler(user, req);
          },
          wrapWithParams: (handler) => async (req, { params }) => {
            const user = await mockGetOrCreateUser(req);
            if (!user) return NextResponse.json({ code: "UNAUTHORIZED", message: "No autorizado" }, { status: 401 });
            const resolvedParams = await params;
            return handler(user, req, resolvedParams);
          },
        }),
        // ... other handlers
      }),
    },
  };
});
```

---

## Pattern Composition ΓÇö Heuristics & Industry Combos

Patterns rarely live alone. Use these heuristics to recognize when **multiple patterns must be applied together** to solve a situation correctly.

### Heuristic 1: "If it crosses a layer boundary, you need at least 3 patterns"

Any operation that starts in presentation and touches persistence will always compose:
- **Route Guard** (presentation boundary) ΓåÆ **Handler/Use Case** (application orchestration) ΓåÆ **Repository** (persistence abstraction)

If the operation mutates state, add:
- **Domain Events** (notify side effects) + **Result** (communicate outcome without exceptions)

> This is the backbone of Clean Architecture + CQRS. Every authenticated write operation in this codebase touches all 5.

### Heuristic 2: "External service = Port + Adapter + typed error"

Whenever a new external integration appears (payment provider, AI API, email service):
1. **Port interface** in `domain/` or `application/` ΓÇö defines what the system needs
2. **Adapter** in `infrastructure/` ΓÇö implements it with the real SDK
3. **Typed domain error** ΓÇö the adapter translates SDK errors into domain-meaningful codes
4. **Result pattern** ΓÇö handler returns `Result<T, DomainError>`, never throws

> Gang of Four "Adapter" + Hexagonal Architecture "Port" + Result Monad. This trio always travels together when touching anything external.

### Heuristic 3: "Behavioral branching = Strategy, not conditionals"

When you see `if (type === "A") { ... } else if (type === "B") { ... }` with ΓëÑ2 variants:
1. **Strategy interface** ΓÇö declares the operation contract
2. **Concrete strategies** ΓÇö one per variant
3. **Factory or Map** ΓÇö selects strategy by discriminator

> Open/Closed Principle: new variants = new class, zero modification to existing code. Classic GoF Strategy + Factory Method combo.

### Heuristic 4: "Constructor has >4 params = Builder or Parameter Object"

High-parameter constructors signal design pressure:
- **Builder** when construction has optional steps or ordering matters
- **Parameter Object / Value Object** when the params represent a cohesive concept
- Often combined with **Factory Method** for domain entities (`Fact.create(props)`)

### Heuristic 5: "Thin route + fat domain = correct separation"

If you find yourself wanting to put logic in a route handler, that's the signal for:
1. **Command/Query Handler** ΓÇö encapsulate the operation
2. **Repository** ΓÇö data access abstraction
3. **Domain service or entity method** ΓÇö business logic lives here
4. Route stays under 80 lines, only parses request ΓåÆ delegates ΓåÆ formats response

### Industry Composition Templates

| Situation | Patterns that compose | Why |
|-----------|----------------------|-----|
| **Authenticated CRUD** | Route Guard ΓåÆ Command Handler ΓåÆ Repository ΓåÆ Domain Events ΓåÆ Result | Full write path: auth, orchestration, persistence, notification, error handling |
| **Read-only query** | Route Guard ΓåÆ Query Handler ΓåÆ Repository ΓåÆ DTO Mapper | No events, no mutation ΓÇö Result optional (query can't fail with business error) |
| **External API integration** | Port Interface + Adapter + Typed Error + Result + Repository (cache/store) | Isolation from SDK; domain errors for each external failure; persistence for caching |
| **Webhook ingestion** | Signature Validation ΓåÆ Idempotency Check ΓåÆ Command Handler ΓåÆ Repository ΓåÆ Events | No Route Guard (webhook has its own auth); idempotency prevents double-processing |
| **Multi-variant processing** | Strategy Interface + Concrete Strategies + Factory + Handler | Handler delegates to strategy; factory selects by type; each strategy is testable alone |
| **Domain entity creation** | Factory Method + Value Objects + Domain Events | `Entity.create(props)` validates invariants, returns Result, emits creation event |
| **Cross-cutting auth** | IRouteGuard (DI) + IAuthProvider (Port) + ClerkAuthProvider (Adapter) | Auth is infrastructure; route guard wraps all routes uniformly via container |

### Recognition Signals

When reviewing code, these signals indicate missing pattern composition:

| Signal | Missing pattern(s) |
|--------|-------------------|
| Route handler > 80 lines | Command/Query Handler not extracted |
| `import { PrismaClient }` in application layer | Repository not created |
| `if (err.message === "some string")` | Typed domain error not defined |
| `new ExternalSDK()` in handler | Port + Adapter not extracted |
| Repeated `if (!user) return 401` in routes | IRouteGuard not used |
| Same branching logic in 2+ places | Strategy not extracted |
| `?? "FREE"` or `?? "default"` scattered | Domain constant not defined |
| Constructor with 5+ params | Builder or Parameter Object needed |

**Key insight**: Patterns are tools that solve forces. When you see the force (duplication, coupling, branching), apply the corresponding combo ΓÇö never a single pattern in isolation.

---

## Result Pattern ΓÇö Correct Usage

```typescript
// Γ£à Return Result ΓÇö never throw for business failures
async execute(cmd: Command): Promise<Result<Output, DomainError | Error>> {
  if (!valid) return fail(new DomainError("CODE", "message"));
  return this.repository.save(entity);
}

// Γ£à Route reads result
if (result.isFailure()) { ... }
const data = result.unwrap();   // or result.value
```

---

## Dependency Injection ΓÇö Container Pattern

This codebase uses a **manual container** (`config/container.ts`) as the composition root. This is the correct pattern for Next.js App Router (no class decorators in edge/server components).

```typescript
// Γ£à Register in container.ts
getBillingService(): IBillingService {
  return this._billingService ??= new BillingServiceImpl(
    this.getUserRepository(),
    process.env.POLAR_ACCESS_TOKEN!,
  );
}

// Γ£à Consume in route
Container.getInstance().getCreateCheckoutSessionHandler().execute(cmd)
```

Never instantiate infrastructure classes directly in routes, handlers, or domain.

---

## Before Touching Any File ΓÇö Context Scan (Mandatory)

Before writing a single line, answer these questions about the code you're about to change:

1. **Who calls this?** ΓÇö Search usages. If it's called from 3+ places, there's a pattern being repeated that should be abstracted, not patched.
2. **Why does it exist?** ΓÇö If the answer is "to replicate something the framework/filesystem already provides," delete it instead of fixing it.
3. **What already exists nearby?** ΓÇö Check for interfaces, repositories, services, or helpers in the same domain before creating new ones. Use the existing abstraction.

### Architectural Smell Heuristics

These patterns are signals to *stop and question*, not to fix in place:

| Observation | Question to ask before fixing |
|-------------|-------------------------------|
| A manually-maintained list that mirrors a filesystem structure | Does the framework already provide this via convention? (e.g., file-based routing) |
| A function called from NΓëÑ3 files doing the same thing | Should this be a shared abstraction instead of a copy? |
| A helper that replicates a repository method (load N ΓåÆ filter in memory) | Does the repository already have a method for this query? |
| A violation fixed by raising a limit (e.g., increasing fnCountLimit) | Is the limit exposing a real design problem that should be solved, not tolerated? |
| A file grows with each fix | Is each fix adding the right thing, or compensating for structural debt? |

### Framework Convention Rule

**Do not manually maintain what the framework or filesystem already defines.**

If the directory structure *is* the data (e.g., `api/**/route.ts` *is* the route table in Next.js App Router), do not replicate it as a static array. Auto-discover it at runtime instead.

---

## Reduction Rule ΓÇö Rewrites Must Reduce Lines

**Every refactor or rewrite must produce fewer lines than the original, or explain specifically why it can't.**

This is not a style preference ΓÇö it's a correctness signal. More lines after a refactor typically means:
- Compensation code for a design problem that was not fixed at the root
- Added defensiveness/validation for cases that cannot actually happen
- Duplication of logic that already existed and should have been reused

### Checklist before submitting a change that adds lines

- [ ] Is this new code solving a problem that didn't exist before?
- [ ] Is there an existing abstraction (repository method, helper, domain service) I could have called instead of writing new code?
- [ ] If the function grew, did I remove the old body it replaces, or just wrap it?
- [ ] If I added error handling, can the error actually occur given the invariants of the system?

If any answer is "no" or "I'm not sure" ΓÇö the change needs another pass.

---

## Definition of Done for Any Code Change

1. No magic strings for error discrimination ΓÇö use typed error codes.
2. No business logic in route handlers ΓÇö in handlers.
3. No Prisma / SDK imports outside `infrastructure/`.
4. All authenticated routes use `Container.getInstance().getRouteGuard().wrap()` / `.wrapWithParams<T>()`.
5. Test mocks use `vi.mock("@/config/container")` with `getRouteGuard` ΓÇö never mock `@/lib/auth-helpers` for route auth.
6. `.env.test` does not contain API key placeholders for keys needed by integration tests.
7. TypeScript 0 errors on changed files.
8. `npm run typecheck` exits 0 (`tsc --noEmit -p apps/web-client/tsconfig.json`).
9. Unit tests green (`npm run test`).
10. Line count of changed files is equal or lower than before, or the increase is explicitly justified.
