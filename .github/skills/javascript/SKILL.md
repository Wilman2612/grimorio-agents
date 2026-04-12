---
name: javascript
description: Enforces JavaScript and TypeScript coding standards including formatting, naming conventions, SOLID principles, async patterns, and code organization. Activate when writing, reviewing, or refactoring JavaScript or TypeScript code.
user-invocable: true
---

# JavaScript / TypeScript Best Practices

Apply these guidelines when writing, reviewing, or refactoring JavaScript or TypeScript code.

> **Related skill**: `development-patterns` ΓÇö covers architectural patterns (Repository, Adapter, CQRS, DI, Route Guard, etc.) specific to this codebase. This skill covers **language-level** standards. Both complement: this skill tells you *how to write the code*, `development-patterns` tells you *where to put it and how to wire the layers*.

---

## Code Structure Limits

- **Functions**: Maximum 20 lines INSIDE the function body (from opening `{` to closing `}`, including ALL blank lines, comments, and code). The function signature and braces themselves are NOT counted.
- **Classes / Modules**: Maximum 500 lines. Split into multiple files if exceeded.
- **Line length**: Maximum 130 columns.
- **Single-line functions**: Avoid unless reusable across multiple locations.

### How to Count Function Lines (CRITICAL)

**What to count:**
- Every line INSIDE the braces `{}`
- Blank lines
- Comment lines
- Code lines with opening/closing braces for `if`/`for`/`while`/etc.

**What NOT to count:**
- The function signature (e.g., `async function handleAsync(id, signal)`)
- The function's opening brace `{`
- The function's closing brace `}`
- Decorators/annotations above the function

**Example:**
```js
async function doSomethingAsync(id, signal)  // NOT counted
{                                             // NOT counted ΓÇö function opening brace
    const data = await getDataAsync(id, signal); // Line 1
                                              // Line 2 (blank line)
    if (data == null) {                       // Line 3
        return null;                          // Line 4
    }                                         // Line 5
                                              // Line 6 (blank line)
    return transform(data);                   // Line 7
}                                             // NOT counted ΓÇö function closing brace
```
**Total: 7 lines** ΓÇö Under 20 limit

---

## Modern JavaScript / TypeScript Features

- **`const` / `let` only** ΓÇö never use `var`
- **`const` by default**; use `let` only when reassignment is genuinely needed
- **Arrow functions** for callbacks and short expressions: `items.map(x => x.id)`
- **Destructuring**: `const { name, email } = user;`
- **Template literals** over string concatenation: `` `Hello, ${name}` ``
- **Optional chaining**: `user?.address?.street`
- **Nullish coalescing**: `value ?? defaultValue` (not `||` which coerces falsy values)
- **Logical assignment**: `user.name ??= 'Anonymous'`
- **Spread / rest operators**: `const merged = { ...defaults, ...overrides };`
- **Array methods** over imperative loops: `map`, `filter`, `reduce`, `find`, `some`, `every`
- **`Object.freeze()`** for immutable singleton objects
- **ES modules** (`import` / `export`) ΓÇö never CommonJS (`require` / `module.exports`) in new code
- **`Promise.all()`** / **`Promise.allSettled()`** for concurrent async operations
- Replace long `if-else` chains with **object maps** or **strategy patterns**

**TypeScript (preferred when the project uses it):**
- Enable `strict` mode in `tsconfig.json`
- Use `interface` for object shapes, `type` for unions / intersections / aliases
- Use `readonly` on properties that don't change after construction
- Use `as const` for literal type inference
- Avoid `any` ΓÇö use `unknown` and narrow with type guards
- Use `satisfies` operator to validate shapes without widening the type

---

## Formatting Rules

- Always use braces `{}` for `if`, `else`, `for`, `while`, even for single statements
- Remove unused imports
- Prefer `const` over `let`; never use `var`
- Always use strict equality `===` / `!==` ΓÇö never `==` / `!=` (only exception: `== null` to check both null and undefined in plain JS)
- Use semicolons consistently ΓÇö or omit consistently. Pick one per project and never mix.

---

## Naming Conventions

Use meaningful, descriptive names that reveal intent.

| Element | Convention | Example |
|---------|------------|---------|
| Classes, constructors | PascalCase | `CustomerService`, `OrderRepository` |
| Functions, methods, variables | camelCase | `getOrderTotal`, `orderCount` |
| Private class fields (native) | `#camelCase` | `#customerRepository` |
| Private fields (TS convention) | `_camelCase` | `_customerRepository` |
| Module-level constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT` |
| TypeScript interfaces / types | PascalCase | `IOrderRepository`, `CustomerDto` |
| Files | kebab-case | `customer-service.ts`, `order-repository.ts` |

- **One class / major export per file, file name must match the exported name** ΓÇö `customer-service.ts` must contain `CustomerService`. Mismatches are a naming violation.

---

## Guard Clauses and Null Safety

Validate inputs at function boundaries using explicit guards:

```js
// Γ£à Fail fast with explicit guards
if (request == null) throw new Error('request is required');
if (!name?.trim()) throw new Error('name cannot be empty');
if (amount <= 0) throw new RangeError('amount must be positive');
```

Null handling rules:
- Use optional chaining `?.` to safely access nested properties
- Use nullish coalescing `??` for defaults
- Use `Object.hasOwn(obj, key)` instead of `obj.hasOwnProperty(key)`
- In TypeScript, leverage strict null checks ΓÇö never suppress with `!` unless you have verified the value is non-null at that point

---

## Async / Await

- Always use `async/await`. Never chain `.then().catch()` when `async/await` is available.
- Suffix async functions with `Async`: `getCustomerAsync()`
- **`AbortSignal` is mandatory** on all public async functions that perform I/O
- `AbortSignal` is always the **last parameter**
- Propagate signal through the entire call chain (e.g., pass to `fetch` options)
- Use `Promise.all()` for independent concurrent operations, not sequential awaits

```js
// Γ£à Concurrent
const [user, orders] = await Promise.all([
    getUserAsync(userId, signal),
    getOrdersAsync(userId, signal),
]);

// Γ¥î Sequential when they could run in parallel
const user = await getUserAsync(userId, signal);
const orders = await getOrdersAsync(userId, signal);
```

---

## Structured Logging

- Use a structured logger (e.g., `pino`, `winston`) with object parameters ΓÇö not `console.log`
- Log at appropriate levels: `debug`, `info`, `warn`, `error`
- **Never log sensitive data** (PII, tokens, passwords, connection strings)

```js
// Γ£à Structured ΓÇö queryable in log aggregators
logger.error({ orderId, customerId, err }, 'Failed to process order');

// Γ¥î String interpolation defeats structured logging
logger.error(`Failed to process order ${orderId}`);
```

---

## Error Handling

- Don't catch `Error` generically without a clear reason. Use specific error types or error codes.
- Don't swallow errors silently. Log and rethrow, or handle explicitly.
- **Don't use exceptions for business logic flow control.** Use a Result pattern or return values for expected failures.
- Guard clauses at function start for fail-fast behavior on invalid inputs.
- Use global error handler / middleware for unhandled exceptions in web apps / APIs.

---

## Anti-Patterns (AVOID)

- **No mutable module-level state** ΓÇö causes hard-to-trace bugs and makes testing impossible
- **No service locator pattern** ΓÇö use constructor injection exclusively
- **Thin controllers / route handlers** ΓÇö no business logic in handlers; delegate to services
- **No exposed domain entities in API responses** ΓÇö use DTOs to decouple internal models from API contracts
- **No God classes / modules** ΓÇö if a module has too many responsibilities, split it
- **No `setTimeout` for logic sequencing** ΓÇö use proper async/await patterns
- **No direct array / object indexing** without existence checks
- **No hardcoded configuration values** ΓÇö use environment variables or a typed config module
- **No prototype mutation on built-ins** ΓÇö add behavior via pure utility functions instead

---

## Architecture Boundary Guardrails

When a project uses multiple bounded contexts or multiple services in one monorepo,
enforce boundaries as code rules, not team memory.

- **No cross-service application imports**: service A cannot import handlers/services from service B.
- **Share contracts, not implementations**: only DTO/contracts/types from shared packages may cross boundaries.
- **One composition root per service**: avoid a global container that wires unrelated domains together.
- **Route handlers should call local application services or external APIs only**: never call another service's internal module directly.
- **Ban legacy fallback aliases** once migration is complete (example: deprecated singleton clients that bypass boundaries).

Recommended enforcement:
- `eslint` import restrictions (`no-restricted-imports` / `import/no-restricted-paths`)
- CI step that fails on forbidden import patterns
- ownership map per folder/domain

---

## Immutability and Collections

Prefer functions that return new values over mutating parameters. Use spread operators.

**Make mutations explicit at the call site.** Avoid void functions that hide what they change.

```js
// Γ¥î Opaque ΓÇö what property changes? Forces reader to explore the function
updateTotalPrice(shopList);

// Γ£à Explicit ΓÇö the mutation is visible without entering the function
shopList.totalPrice = getTotalPrice(shopList);

// Γ£àΓ£à Best ΓÇö immutable update
const updatedList = { ...shopList, totalPrice: getTotalPrice(shopList) };
```

A void function that sets multiple properties of an object is the same violation. Prefer extracting only the computation and leaving assignments visible at the call site.

- Return arrays as `readonly T[]` (TypeScript) where the caller should not mutate them
- Use `Array.from()` or spread to copy arrays rather than mutating the original
- Use `Map` and `Set` over plain objects for dynamic key-value storage when key type is not a plain string literal
- Use `Object.freeze()` for singleton config / constant objects

---

## Avoid Magic Numbers

Extract all literal values into named `const` with SCREAMING_SNAKE_CASE. This includes numeric values, string keys, timeout durations, retry counts, and threshold values.

---

## Class Design

- Use ES classes for stateful services
- Use `#privateField` syntax (or `_` prefix in TS) for private members
- Use `readonly` (TS) on fields that don't change after construction
- Prefer properties over public fields for encapsulation
- **Depend on abstractions** (interfaces / types in TS), not concretions
- Use **constructor injection** for dependencies ΓÇö no `new SomeDependency()` inside class methods
- Prefer composition over inheritance

---

## Function / Method Declaration Order (Stepdown Rule)

Order functions/methods so the reader flows **top-to-bottom**. A caller must always appear **above** every function it calls.

```
export function entryPoint()   // exported, called first ΓÇö declared first
function stepA()               // called by entryPoint ΓÇö declared next
function subStepA1()           // called by stepA ΓÇö declared next
function stepB()               // called by entryPoint after stepA ΓÇö declared after subStepA1
```

**Rules:**
- Exported / public entry-point functions come first
- Private helpers are declared immediately after the first function that calls them
- If two helpers are called in sequence by the same parent, they appear in that same sequence
- Fields and constructor always precede all methods

---

## Utility Functions

Use module-level utility functions to add reusable behavior. **Never mutate built-in prototypes.**

**When to create a utility function:**
- Operations on types you don't control (strings, arrays, dates, built-ins)
- Pure helpers reused in 3+ places

**When NOT to:**
- For methods that belong on a class you own ΓÇö add them to the class
- To hide business logic that belongs in a service
- As a one-use helper that adds indirection without clarity

**Conventions:**
- Place in a dedicated `[type]-utils.ts` file (e.g., `string-utils.ts`, `date-utils.ts`)
- Keep utility functions pure (no side effects, no external dependencies)
- Group by the type being operated on, one file per type

---

## String Handling

- Prefer template literals over concatenation
- Use `localeCompare` for locale-aware / user-facing string comparison
- Use strict `===` for non-linguistic / identifier comparisons
- Trim user input before storing or comparing: `value.trim()`

---

## Comments

Code should be self-documenting. Use comments only for:
- Explaining **why**, not **what**
- Documenting non-obvious constraints or business rules

**JSDoc is required** on all exported functions, classes, and types:
- The class / function declaration itself
- Every public method ΓÇö add `@param` for each parameter and `@returns` for non-void functions
- Exported constants and TypeScript types / interfaces

No exceptions for "obvious" members ΓÇö if it is exported, it gets a `@description` / `@param` / `@returns`.

```js
/**
 * Persists a new or updated global redirect mapping.
 * @param {GlobalRedirectMappingForm} form - The mapping data submitted by the user.
 * @param {AbortSignal} [signal] - Optional cancellation signal.
 * @returns {Promise<void>}
 */
async function persistMappingAsync(form, signal) { ... }
```

---

## Design Principles

**SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.

**Other**: KISS (keep it simple), DRY (don't repeat yourself), YAGNI (don't add until needed).

Use design patterns (Repository, Factory, Strategy, Observer) when they solve a real problem, not preemptively.

---

## Testing Conventions

- **Naming**: `functionName_scenario_expectedResult` (e.g., `processPayment_invalidAmount_throwsError`)
- **Structure**: Arrange-Act-Assert (AAA) pattern in every test
- **Isolation**: Fresh data per test, no shared mutable state between tests
- **Async tests**: Always `await` or `return` promises ΓÇö never fire-and-forget in a test
- Use `describe` / `it` (or `test`) blocks to group related scenarios
- Use parameterized tests (`it.each` / `test.each` in Jest) over duplicate test cases
- Use shared fixtures for expensive setup (database, HTTP client)
- Avoid testing implementation details ΓÇö test behavior and outcomes

---

## Refactoring to Stay Under 20 Lines

**THE 20-LINE LIMIT IS NON-NEGOTIABLE.** When a function exceeds 20 lines, it MUST be refactored.

### Strategies (choose based on context)

- **Extract by business responsibility** ΓÇö group related operations into functions named after what they do in domain terms (e.g., `validateInputs`, `executeTransaction`, `notifyStakeholders`)
- **Fail fast** ΓÇö validate cheap preconditions before expensive async I/O
- **Pipeline / orchestrator** ΓÇö keep the main function as a high-level orchestrator that delegates each step
- **Split responsibilities** ΓÇö if a function does multiple things, split into named steps

### Principles

1. **Find the concept first, then name it.** Good names answer a domain question without reading the body. Names that describe control flow (`tryX`, `fallbackToY`) are still mechanical ΓÇö they hide the seam differently.

2. Each extracted function must have a **clear single responsibility** with a meaningful business name.

3. **Never split mechanically** (e.g., "first 10 lines" / "last 10 lines") ΓÇö splits must reflect logical boundaries.

4. Prefer **fewer, cohesive functions** over many tiny ones ΓÇö a 2-line helper used once adds noise.

5. **FORBIDDEN**: Do NOT extract functions solely to reduce line count when they have no meaningful name.

6. **FORBIDDEN**: Do NOT leave old code commented out after refactoring. Replace completely and cleanly.

### No Exceptions Policy

- **Orchestrator functions** are NOT exempt ΓÇö they should delegate clearly to named steps
- **Multiple catch blocks** are NOT exempt ΓÇö extract error handling functions if needed
- **"It's already well-structured"** is NOT an excuse ΓÇö if it exceeds 20 lines, refactor it
- **The ONLY acceptable exception**: Functions with unavoidable complexity (e.g., large switch-like mappings with 15+ cases)

---

## Validation and Accountability

**CRITICAL**: Before completing ANY JavaScript / TypeScript file:

1. Manually count lines INSIDE each function body (from line after `{` to line before `}`, including blank lines)
2. If ANY function exceeds 20 lines, you MUST refactor IMMEDIATELY
3. **DO NOT generate validation reports for code YOU wrote** ΓÇö just fix it
4. **DO NOT justify violations** ΓÇö 99% of the time, the code CAN be refactored

### If YOU Wrote the Code:

- Γ¥î **WRONG**: Generate a report saying "this needs refactoring"
- Γ¥î **WRONG**: Leave old code commented out after refactoring
- Γ£à **CORRECT**: Refactor the code immediately before proceeding
- Γ£à **CORRECT**: Replace old code completely and cleanly

### If You're Reviewing Existing Code:

- Γ£à Generate a validation report with specific refactoring suggestions
- Γ£à Provide before/after examples where helpful
- Γ¥î Do NOT leave commented-out code in the final result
