# fixture phase E2 — TERMINAL

Declares `terminal-report` in its own `produces`. No `next` edge departs this phase, so the only moment
its promise can be checked is while it is the CURRENT phase — which is what `verify-chain` must now do.
