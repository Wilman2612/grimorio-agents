# Code Reviewer — Brief Template (FIX-VERIFICATION mode)

This is a REAL, literal worked example of a FIX-VERIFICATION brief — copy this shape, fill in this
dispatch's own values, NEVER hand a bare diff for a REWORK cycle.

````
## MODE: FIX-VERIFICATION — cycle 2 of 2

## PER-FINDING CONTEXT

### FINDING-01 — Severity: HIGH

**Original finding (cycle 1 verdict, verbatim):**
> [FINDING-01] Silenced error swallows a real DB failure — Severity: HIGH
> - File/Lines: `services/{service}/src/db/pool.ts` L42-L48
> - Category: silenced-error
> - Problem: a catch block around the pool connection swallows every error and returns null, so a real
>   connection failure looks like "no rows" to every caller.
> - Evidence: `catch (e) { return null; }`
> - Required Fix: rethrow, or return a typed Result that distinguishes "no rows" from "connection failed."

**Original code (before the fix):**
```ts
async function getPool() {
  try {
    return await connect(DSN);
  } catch (e) {
    return null;
  }
}
```

**What changed, and why (this cycle's own fix):**
```ts
async function getPool(): Promise<Result<Pool, ConnectionError>> {
  try {
    return ok(await connect(DSN));
  } catch (e) {
    return err(new ConnectionError(e));
  }
}
```
Changed to return a typed `Result` instead of swallowing the error, so a connection failure is now
distinguishable from "no rows" at every call site — closes FINDING-01 exactly as required.

## YOUR SCOPE THIS CYCLE

Verify ONLY: (1) does the fix above actually close FINDING-01 as stated — read the real diff, don't trust
this summary; (2) did the fix introduce anything new in its own touched lines (a caller left unmigrated to
the new Result type, a swallowed error re-introduced elsewhere). Do NOT re-hunt the rest of the diff from
scratch — it was already fully hunted in cycle 1 (see that cycle's own `code-review.md` for the complete
record).
````

**WHEN a cycle carries more than one finding ⟶ repeat the `### FINDING-NN` block above once per finding —
NEVER collapse multiple findings into one undifferentiated summary.**
