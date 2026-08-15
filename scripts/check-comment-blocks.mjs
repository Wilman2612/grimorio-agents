#!/usr/bin/env node
// Refuses a staged diff that ADDS a comment block longer than MAX lines to a source file.
// Escape hatch: `@keep-comment` on the block's first line.
// Rationale, the measurement that produced it, and the rule it enforces: see the commit that added this.
import { execFileSync } from "node:child_process";

const MAX = 4;
const COMMENT = /^\s*(\/\/|#|\/\*|\*|""")/;
const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs|py|go)$/;

const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const files = git(["diff", "--cached", "--name-only", "--diff-filter=ACM"])
  .split("\n")
  .filter((f) => SOURCE.test(f));

if (files.length === 0) process.exit(0);

const offences = [];
for (const file of files) {
  let diff;
  try {
    diff = git(["diff", "--cached", "-U0", "--", file]);
  } catch {
    continue;
  }
  let run = 0;
  let start = "";
  let keep = false;
  const flush = () => {
    if (run > MAX && !keep) offences.push({ file, run, start });
    run = 0;
    keep = false;
  };
  for (const line of diff.split("\n")) {
    if (!line.startsWith("+") || line.startsWith("+++")) {
      flush();
      continue;
    }
    const body = line.slice(1);
    if (COMMENT.test(body)) {
      if (run === 0) start = body.trim().slice(0, 70);
      run++;
      if (body.includes("@keep-comment")) keep = true;
    } else {
      flush();
    }
  }
  flush();
}

if (offences.length) {
  for (const o of offences) {
    console.error(`  ${o.file}: ${o.run} consecutive added comment lines — starts: ${o.start}`);
  }
  console.error(`
REFUSED: a comment block longer than ${MAX} lines was added to a source file.

The truth lives in the code, and a comment describing current behaviour goes stale and then misleads.
Put the reasoning in the COMMIT MESSAGE, where it is dated and cannot drift from the code it describes.
If the block genuinely earns its place — a harness invariant, a cross-language contract note — put
\`@keep-comment\` on its first line and it passes.

If this gate is in your way rather than doing its job, DELETE it — do not bypass it. Remove the
check-comment-blocks line from scripts/pre-commit.sh and delete this file.

-> \`development-patterns\` → the comment rule this enforces.`);
  process.exit(1);
}
process.exit(0);
