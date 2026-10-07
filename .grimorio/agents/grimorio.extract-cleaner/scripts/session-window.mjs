#!/usr/bin/env node

// @keep-comment session-window.mjs — fetch a window of this session's own recent turns into a file.
//
// WHY THIS EXISTS, and it is not a rename for its own sake (CEO ruling, 2026-09-07). A tool's interface
// should say WHAT is wanted; the machinery for getting it belongs inside. Naming the sensitive part in the
// invocation does three unwanted things to whichever agent runs it: it invites the agent to open the file, it
// invites the agent to "fix" it, and it plants a concept the agent's own task never needed. His analogy: a
// script that reads an encrypted credential to fetch data should expose "fetch the data" — not "read the
// password" — because the data is what the caller wants and the credential is the tool's own business.
//
// Concretely: an agent whose job is to build a cleaned extract has no business naming a session id or a
// transcript on its command line. It wants a window of recent turns. That is this file's whole interface.
//
// This is a thin front door onto ceo-transcript-lookup.mjs, which keeps the fetching, parsing, noise-tag
// filtering and formatting. Nothing about WHAT is read changes, and nothing about who may read it changes —
// the capability stays declared where a human auditing this repo can see it, which is the point of keeping it
// visible in one place instead of spreading it across every caller.
//
// Usage: node .grimorio/agents/grimorio.extract-cleaner/scripts/session-window.mjs [--user-count N] [--count N] [--out <file>]
//   --user-count N   walk back N user turns and return everything from there (both roles), oldest-first
//   --count N        plain turn count instead
//   --out <file>     write there; omitted, writes to stdout
//
// The session resolves from CLAUDE_CODE_SESSION_ID. WHEN it is unset ⟶ this exits non-zero and says so,
// never guessing at a session, because a wrong window is worse than no window.
//
// @keep-comment
// EXIT CODES — a cross-caller contract: `extract-cleaner-finalize.mjs` runs this script and branches on its
// status, so what each code MEANS has to be stated where the script is, not only where a caller reads it.
// The third one is not an error — it is a refusal, which a caller must tell apart from a failure to run:
//   0  a window was produced; its per-origin census is on stderr either way
//   1  this tool could not run (no session id, no transcript found, bad usage)
//   3  the window was read correctly and REFUSED: it holds harness-labelled turns and not one of them is
//      the principal's own, so producing it would hand back a well-formed extract that is empty of him.
//      Widen the window or wait for a real turn of his — never hand-write the extract instead.
//      -> the full rule and why absence of the label is never grounds to refuse: `ceo-transcript-lookup.mjs`'s
//      own TURN ORIGIN and THE REFUSAL comment blocks.

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(here, "ceo-transcript-lookup.mjs");

if (!process.env.CLAUDE_CODE_SESSION_ID) {
  console.error(
    "session-window: CLAUDE_CODE_SESSION_ID is not set in this environment, so there is no session to read.\n" +
      "This is an environment defect, never something to work around by naming a session by hand."
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status === null ? 1 : result.status);
