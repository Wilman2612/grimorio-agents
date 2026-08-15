#!/usr/bin/env node
/* @keep-comment
 * replan-check.mjs — THE MECHANISM HALF OF THE RE-PLAN TRIGGER.
 *
 * WHY THIS EXISTS. Measured 2026-08-13/14: three delegates were raised against lanes A, D and E of
 * `designs/product-replan-2026-08-13.md` — all three lanes were already shipped and merged before their
 * delegates started. The plan was ONE DAY old. Nothing ever re-read the plan against the repo; the
 * staleness was found only because each delegate happened to survey first and report back rather than
 * rebuild. See `designs/product-replan-2026-08-14.md` (its own last section, "WHAT THIS PLAN CANNOT DO
 * FOR ITSELF") for the full incident and the standing instruction that this script implements.
 *
 * THE SIGNAL. An OPEN plan item whose own DONE-condition ALREADY HOLDS is stale. Each open item carries
 * @keep-comment CROSS-FILE CONTRACT with scripts/objective-lib.sh — the two VERIFY grammars.
 * its own `VERIFY:` line, naming the KEYWORD `objectives/*.md` checklists already use for `- [ ]`/`- [x]`
 * lines, extended here to the plan's bold-ID items (`**F1 — ...`). The GRAMMAR is NOT the same, and that
 * is the part worth stating honestly: `objectives/*.md` (scripts/objective-lib.sh) REQUIRES the command
 * wrapped in a backtick pair. This script accepts a bare command with NO backticks, OR that same
 * fully-wrapped backtick form (unwrapped before running, so the two conventions converge) — any OTHER
 * backtick usage is rejected as an ERROR and NEVER reaches bash, because bash reads a stray backtick pair
 * as command substitution, not literal text, which used to make a genuinely stale item read as silently
 * still-open forever. Running every open item's VERIFY and reporting the ones that already pass makes
 * staleness mechanical instead of relying on a delegate happening to notice.
 *
 * DESIGN RULE, same as `scripts/status.sh`'s own header states for its sibling: DERIVE everything, WRITE
 * NOTHING, KEEP NO CACHE. This script is read-only — it never writes a file, a cache, or a
 * "last-checked" marker. It does not duplicate `status.sh`'s checks (objectives/branches drift); it
 * covers PLAN ITEMS, which `status.sh` cannot see.
 *
 * WHAT THIS DOES NOT DO. It does not judge WHETHER an item's VERIFY command is honest — that is a
 * per-item authoring responsibility (see `designs/product-replan-2026-08-14.md`'s own VERIFY lines and
 * the report that shipped them). A VERIFY that is green for the wrong reason will read as done here
 * exactly as a real done item would; this script can only be as honest as the VERIFY lines it is given.
 *
 * USAGE
 *   node scripts/replan-check.mjs [<plan-file>] [--quiet] [--max-age-commits N]
 *
 * With no <plan-file>, resolves the CURRENT plan as the lexically-greatest `designs/product-replan-*.md`
 * (the names are ISO-dated, so lexical order is chronological order).
 *
 * EXIT CODE — load-bearing. 1 when any STALE item was found, OR when --max-age-commits N was passed and
 * the plan's age in commits exceeds N. 0 otherwise. ERROR and UNVERIFIABLE findings are REPORTED, never
 * gated — a parse gap, a rejected backtick VERIFY, or a missing VERIFY line must never be indistinguishable
 * from a real staleness finding. `scripts/audit-chain.mjs` in this very repo shipped a gate that never
 * called process.exit() and passed forever; this script calls it explicitly, on every path.
 *
 * POPULATION + grammar coverage: see the commit that added the POPULATION line and ITEM_DASH_BOLD below
 * for why both exist and what review pass found them missing.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const REPO_ROOT = spawnSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).stdout.trim();
const VERIFY_TIMEOUT_MS = 120_000;

function parseArgs(argv) {
  let planFile = null;
  let quiet = false;
  let maxAgeCommits = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--quiet") {
      quiet = true;
    } else if (a === "--max-age-commits") {
      i++;
      maxAgeCommits = Number(argv[i]);
      if (!Number.isFinite(maxAgeCommits)) {
        console.error(`--max-age-commits requires a numeric argument, got: ${argv[i]}`);
        process.exit(2);
      }
    } else if (!a.startsWith("--") && planFile === null) {
      planFile = a;
    } else {
      console.error(`Unrecognized argument: ${a}`);
      process.exit(2);
    }
  }
  return { planFile, quiet, maxAgeCommits };
}

// Resolve which plan file this run targets: the explicit argument, or (with none given) the CURRENT
// plan — the lexically-greatest designs/product-replan-*.md.
function resolvePlanFile(planArg) {
  if (planArg) {
    const planFile = path.isAbsolute(planArg) ? planArg : path.join(REPO_ROOT, planArg);
    return { planFile, resolvedWhy: "explicit argument" };
  }
  return { planFile: resolveCurrentPlan(), resolvedWhy: "lexically-greatest designs/product-replan-*.md" };
}

function resolveCurrentPlan() {
  const dir = path.join(REPO_ROOT, "designs");
  let entries;
  try {
    entries = readdirSync(dir);
  } catch (err) {
    console.error(`Cannot list ${dir}: ${err.message}`);
    process.exit(2);
  }
  const candidates = entries.filter((f) => /^product-replan-.*\.md$/.test(f)).sort();
  if (candidates.length === 0) {
    console.error(`No designs/product-replan-*.md files found in ${dir}`);
    process.exit(2);
  }
  const chosen = candidates[candidates.length - 1];
  return path.join(dir, chosen);
}

const ITEM_BOLD = /^\*\*([A-Z][A-Za-z0-9]*) — /;
const ITEM_CHECKBOX = /^- \[([ xX])\] /;
// The plan's OTHER item shape: `- **Lane B** — ...` (see commit for why this and the whitespace
// tolerance below were added — no closed variant exists today, so this form is always OPEN).
const ITEM_DASH_BOLD = /^- \*\*([^*]+)\*\* — /;
const VERIFY_LINE = /^\s*VERIFY: (.+)$/; // tolerant of an indented continuation line
const SECTION_BREAK = /^(---|## )/;

// Does line i open a new item? Tries all three item grammars, in the same precedence the old
// single-pass loop used (bold-ID, then checkbox, then dash-bold).
function matchItemStart(line, i) {
  const boldMatch = line.match(ITEM_BOLD);
  if (boldMatch) return { index: i, id: boldMatch[1], open: true };
  const cbMatch = line.match(ITEM_CHECKBOX);
  if (cbMatch) {
    const closed = cbMatch[1] === "x" || cbMatch[1] === "X";
    const label = line.slice(cbMatch[0].length).trim().slice(0, 60);
    return { index: i, id: label || `line ${i + 1}`, open: !closed };
  }
  const dbMatch = line.match(ITEM_DASH_BOLD);
  if (dbMatch) return { index: i, id: dbMatch[1].trim(), open: true };
  return null;
}

function findItemStarts(lines) {
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    const start = matchItemStart(lines[i], i);
    if (start) starts.push(start);
  }
  return starts;
}

// An item's body ends at the next item's start, or earlier at a SECTION_BREAK — whichever comes first.
function findBoundary(lines, index, nextStart) {
  for (let j = index + 1; j < nextStart; j++) {
    if (SECTION_BREAK.test(lines[j])) return j;
  }
  return nextStart;
}

function findVerify(lines, index, boundary) {
  for (let j = index + 1; j < boundary; j++) {
    const m = lines[j].match(VERIFY_LINE);
    if (m) return m[1].trim();
  }
  return null;
}

function buildItems(lines, starts) {
  const items = [];
  for (let s = 0; s < starts.length; s++) {
    const { index, id, open } = starts[s];
    const nextStart = s + 1 < starts.length ? starts[s + 1].index : lines.length;
    const boundary = findBoundary(lines, index, nextStart);
    const verify = findVerify(lines, index, boundary);
    items.push({ id, open, lineNo: index + 1, verify });
  }
  return items;
}

// Parse the plan file into ITEMs: {id, open, lineNo, verify: string|null}.
function parseItems(text) {
  // Normalize CRLF/CR to LF first. On Windows, git's core.autocrlf checks files out with CRLF; a bare
  // split("\n") then leaves a trailing "\r" on every line, which a $-anchored regex (VERIFY_LINE) never
  // matches even though the line "looks" right in an editor — found live: F1-F4's VERIFY lines were
  // parsed as absent (UNVERIFIABLE) purely because of line-ending, not content.
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const starts = findItemStarts(lines);
  return buildItems(lines, starts);
}

// A fully-wrapped backtick pair on RAW text is unambiguous by construction — no comment-stripping is
// involved in deciding this, which is exactly what keeps stripLineComment's quote-blindness from ever
// inventing a false ERROR on a genuinely valid fully-wrapped command (see resolveVerifyCommand step 1).
function isFullyWrapped(text) {
  const backtickCount = (text.match(/`/g) || []).length;
  return text.startsWith("`") && text.endsWith("`") && backtickCount === 2;
}

// @keep-comment CLASSIFICATION only, and only ever reached AFTER the raw-text fully-wrapped check above
// has already failed (resolveVerifyCommand step 1) — so a `#` inside a quoted string being misread as a
// comment start can now only ever cause a MISS on a line that was not fully-wrapped to begin with. It can
// never invent a false ERROR on a fully-wrapped command, and the ORIGINAL text (comment included) is what
// actually runs whenever this heuristic finds nothing.
function stripLineComment(text) {
  let quote = null;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      continue;
    }
    if (c === "#" && (i === 0 || /\s/.test(text[i - 1]))) return text.slice(0, i).trim();
  }
  return text;
}

// @keep-comment Two repo grammars collide here: objective-lib.sh REQUIRES backticks, this file accepts a
// bare command. A fully-wrapped command is unwrapped and run literally so both mean the same thing; any
// other backtick use is rejected before bash sees it, since bash reads it as command substitution.
function resolveVerifyCommand(rawVerify) {
  const trimmed = rawVerify.trim();
  if (isFullyWrapped(trimmed)) {
    return { ok: true, command: trimmed.slice(1, -1) };
  }
  const codePortion = stripLineComment(trimmed);
  if (isFullyWrapped(codePortion)) {
    return { ok: true, command: codePortion.slice(1, -1) };
  }
  const backtickCount = (codePortion.match(/`/g) || []).length;
  if (backtickCount > 0) {
    return {
      ok: false,
      detail:
        "ambiguous/partial backtick in VERIFY command (bash would read it as command substitution, " +
        `not literal text): ${trimmed}`,
    };
  }
  // An EMPTY command is not a passing one. A VERIFY line that is entirely a comment leaves nothing to
  // run, and bash exits 0 on nothing — which reported the item as ALREADY DONE. Loud, but false, and a
  // false "already done" is the one direction that makes a reader skip live work.
  if (codePortion === "") {
    return { ok: false, detail: `VERIFY line carries no command, only a comment: ${trimmed}` };
  }
  // STRUCTURAL, not another heuristic patch: run codePortion — already PROVEN backtick-free two lines
  // above — never the raw `trimmed`. Two exploit rounds died here because classification read one string
  // and bash was handed a different, unvetted one. Now "no live backtick reaches bash" holds BY
  // CONSTRUCTION, however badly the comment-boundary heuristic approximates real bash grammar.
  return { ok: true, command: codePortion };
}

// Run one VERIFY command from the repo root. Returns "STALE" | "OPEN" | "ERROR" (+ detail on ERROR).
function runVerify(command) {
  const result = spawnSync("bash", ["-c", command], {
    cwd: REPO_ROOT,
    timeout: VERIFY_TIMEOUT_MS,
    encoding: "utf8",
  });
  if (result.error) {
    return { status: "ERROR", detail: result.error.message };
  }
  if (result.signal) {
    return { status: "ERROR", detail: `killed by signal ${result.signal} (likely timeout)` };
  }
  if (result.status === 0) return { status: "STALE" };
  return { status: "OPEN" };
}

// Classify one OPEN item into exactly one bucket: stale / unverifiable / error / (silently) open.
function classifyOpenItem(item) {
  if (!item.verify) return { bucket: "unverifiable" };
  const resolved = resolveVerifyCommand(item.verify);
  if (!resolved.ok) return { bucket: "error", detail: resolved.detail };
  const result = runVerify(resolved.command);
  if (result.status === "STALE") return { bucket: "stale" };
  if (result.status === "ERROR") return { bucket: "error", detail: result.detail };
  return { bucket: "open" };
}

function runVerifyChecks(openItems) {
  const stale = [];
  const unverifiable = [];
  const errors = [];
  for (const item of openItems) {
    const result = classifyOpenItem(item);
    if (result.bucket === "stale") stale.push(item);
    else if (result.bucket === "unverifiable") unverifiable.push(item);
    else if (result.bucket === "error") errors.push({ ...item, detail: result.detail });
  }
  return { stale, unverifiable, errors };
}

function computeAge(planFile) {
  const relPath = path.relative(REPO_ROOT, planFile);
  const hashRes = spawnSync("git", ["log", "-1", "--format=%H", "--", relPath], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  const hash = hashRes.stdout.trim();
  if (!hash) return { commits: null, lastCommit: null };
  const countRes = spawnSync("git", ["rev-list", "--count", `${hash}..HEAD`], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  const commits = Number(countRes.stdout.trim());
  return { commits: Number.isFinite(commits) ? commits : null, lastCommit: hash };
}

// THE POPULATION LINE, load-bearing (see commit): a count with no stated population is not evidence.
// Printed even for a ZERO-item parse (order matters — see loadAndReportItems below), so a reader always
// sees the count before the LOUD zero-item failure, never instead of it.
function printPopulation(items) {
  const openItems = items.filter((i) => i.open);
  const closedItems = items.filter((i) => !i.open);
  const openWithVerify = openItems.filter((i) => i.verify).length;
  console.log(
    `POPULATION: ${items.length} item(s) parsed — ${openItems.length} open, ${closedItems.length} closed; ` +
      `${openWithVerify}/${openItems.length} open item(s) carry a VERIFY.`,
  );
  return openItems;
}

// Parse, print POPULATION (even when it's zero), THEN guard on zero — same order the original inline
// code used, so a zero-item plan still shows its POPULATION: 0 line before the LOUD failure.
function loadAndReportItems(planFile) {
  const text = readFileSync(planFile, "utf8");
  const items = parseItems(text);
  const openItems = printPopulation(items);
  if (items.length === 0) {
    console.error(`FAIL: parsed ZERO items from ${planFile}. Either the plan is genuinely empty of`);
    console.error(`items, or the item grammar (ITEM_BOLD / ITEM_CHECKBOX / ITEM_DASH_BOLD) no longer`);
    console.error(`matches this plan's shape. A plan the parser cannot see into is not a clean plan.`);
    process.exit(2);
  }
  return openItems;
}

function printAge(planFile, quiet) {
  const { commits: age, lastCommit } = computeAge(planFile);
  if (!quiet) {
    if (age === null) {
      console.log("AGE: could not determine (plan file has no commit history)");
    } else {
      console.log(`AGE: ${age} commit(s) on the current branch since the plan's last commit (${lastCommit})`);
    }
  }
  return age;
}

function printStale(stale) {
  console.log();
  if (stale.length === 0) {
    console.log("STALE: none");
    return;
  }
  console.log(`STALE (${stale.length}) — OPEN items whose VERIFY already exits 0:`);
  for (const item of stale) {
    console.log(`  STALE  ${item.id}  (line ${item.lineNo})  VERIFY: ${item.verify}`);
  }
}

function printUnverifiable(unverifiable) {
  console.log();
  console.log(`UNVERIFIABLE (${unverifiable.length}) — OPEN items with no VERIFY line:`);
  for (const item of unverifiable) {
    console.log(`  UNVERIFIABLE  ${item.id}  (line ${item.lineNo})`);
  }
}

function printErrors(errors) {
  if (errors.length === 0) return;
  console.log();
  console.log(`ERROR (${errors.length}) — VERIFY could not be run (timeout or spawn error):`);
  for (const item of errors) {
    console.log(`  ERROR  ${item.id}  (line ${item.lineNo})  ${item.detail}`);
  }
}

function printFindings(stale, unverifiable, errors) {
  printStale(stale);
  printUnverifiable(unverifiable);
  printErrors(errors);
}

function computeExitCode(staleCount, age, maxAgeCommits) {
  const ageExceeded = maxAgeCommits !== null && age !== null && age > maxAgeCommits;
  console.log();
  if (ageExceeded) {
    console.log(`AGE GATE: ${age} commit(s) exceeds --max-age-commits ${maxAgeCommits}`);
  }
  const exitCode = staleCount > 0 || ageExceeded ? 1 : 0;
  console.log(`EXIT ${exitCode}`);
  return exitCode;
}

function main() {
  const { planFile: planArg, quiet, maxAgeCommits } = parseArgs(process.argv.slice(2));
  const { planFile, resolvedWhy } = resolvePlanFile(planArg);

  if (!existsSync(planFile)) {
    console.error(`FAIL: plan file does not exist: ${planFile}`);
    process.exit(2);
  }
  if (!quiet) {
    console.log(`Plan: ${planFile}  (resolved by: ${resolvedWhy})`);
  }

  const openItems = loadAndReportItems(planFile);
  const { stale, unverifiable, errors } = runVerifyChecks(openItems);
  const age = printAge(planFile, quiet);
  printFindings(stale, unverifiable, errors);

  const exitCode = computeExitCode(stale.length, age, maxAgeCommits);
  process.exit(exitCode);
}

main();
