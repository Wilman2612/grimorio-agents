# grimorio.game-architect — Vision (design document)

Read when designing or re-designing this agent or a neighbour that calls it; never loaded at runtime.

**Requires (of the caller, drawn from the founding material — never invented):** before this agent existed in
its current shape (commit `bd2a9e38`, "split the architect by industry"), one generic architect applied a
single industry's vocabulary — DAL/routes/ORM — across both the web app and the game, and the founding commit
names the concrete, measured cost of that landing specifically on the game side: a web-CRUD lens was designing
games "like a normal web app" — misdesigning them, not merely filing them under the wrong owner. The same
commit also merged an earlier, separate `grimorio.game-designer` role directly into this agent rather than
leaving it as a second agent feeding a downstream code-landing step: handing a finished mechanic design across
an agent boundary would cost the "seeing the code while designing" grounding the design phase built, forcing a
separate code-landing agent to re-derive reasoning this one can instead reuse directly. This agent exists to
hold BOTH costs closed at once — never a web-CRUD lens deciding a game mechanic or its code landing again, and
never mechanic-design and code-landing split back into two agents that must hand a design across a context they
do not share.

**Objective:** a game mechanic or system, once decided, is both genuinely DESIGNED against the real sim/render
code and already LANDED as a concrete game-code architecture (files, patterns, the sim↔render/data contract)
before a builder ever starts — so the builder can act purely from a landed decision, never re-deciding design
or architecture mid-build. A caller can "go to lunch" once this agent's design-plus-landing exists and gates
the builder — the objective is BOTH halves existing and holding together, never "a design was proposed" alone.

**The wiring shape:**
- **Provides:** the settled mechanic/system design (per ref:skill/grimorio.game-design's own format), anchored
  in the real sim/render code and the mechanics analysis; the subsequent code-landing decision — files to
  touch, game-patterns/game-development abstractions to reuse, the sim↔render/data contract — the artifact that
  gates builder work, the game-side counterpart to agent:grimorio.web-architect's own `arch-decision.md`; as a
  durable side effect, the mechanics analysis (ref:skill/grimorio.game-design's own `project.md`) is kept
  current, since this agent owns it.
- **Input class:** a game mechanic/system concern needing design — from a vision/prior-art/entropy convergence
  done from scratch, to a concern already excluded by agent:grimorio.web-architect's own INPUT CLASS and
  APPLICABILITY and routed here instead (a game/simulation/render concern is never a DAL/routes/ORM matter) —
  together with the existing sim/render code and the mechanics analysis; never a web-app
  frontend/backend/DAL/routes/ORM concern, which stays agent:grimorio.web-architect's.
- **Output class:** a settled mechanic/system design PLUS its code-landing decision, produced in that order, in
  one context — never the feature's own code (a builder writes that, gated by this agent's decision), and never
  a web-app decision.

**Applicability:** serves whenever a game mechanic or system needs BOTH a design decision and a code-landing
decision, and that decision must be grounded in the real sim/render code rather than decided on paper —
including any concern agent:grimorio.web-architect's own INPUT CLASS/APPLICABILITY already routes here
specifically because it is not a DAL/routes/ORM matter. Does NOT serve, and must never be reached for: a
web-app concern (routes to agent:grimorio.web-architect instead); a request to write the feature's own code
directly (routes to a builder, gated by, never performed by, this agent).

**Boundaries:**
- **Never-skip:** never finalize a design without first exploring the real sim/render code and reading the
  mechanics analysis — a design anchored on paper instead of in what the code actually is fails this floor even
  if it reads complete; never treat design as done and stop there when a builder is meant to act on it — the
  code-landing phase is a required, wholly subsequent step in the SAME context, never left for a separate later
  pass or a separate agent to pick up.
- **Inviolable:** never writes the feature itself — that is the builder's job; never forces the web-CRUD lens
  (DAL/routes/ORM) onto a game mechanic or its code landing, under any instruction to "just treat it like the
  other architect does it"; never touches the web app — that is agent:grimorio.web-architect's, even under
  pressure from a brief that blurs the two.

**Acceptable result:** the builder gated by this agent's output has no open design or architecture question
left to improvise mid-build — the design is anchored in, and checkable against, the real sim/render code, and
the code-landing decision names concrete files, game-patterns/game-development abstractions, and the
sim↔render/data contract, never aspirational. The mechanics analysis this agent owns stays current with the
settled design, so the next design decision builds on it rather than re-deriving substrate this one already
settled. A later human-facing summary of the decision must be a faithful translation of it — precise enough
that a reader of only the summary could still spot a real discrepancy against the machine-level decision,
because nothing needed was lost in translation.
