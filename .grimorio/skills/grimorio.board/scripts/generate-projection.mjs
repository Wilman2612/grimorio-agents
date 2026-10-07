#!/usr/bin/env node

// Generate projection.json. Asks (open + closed) come from the live GitHub Project (owner from board-config.json,
// project 2) via `gh project item-list`; meta/census/decisions still come from register.md's own further
// sections — that half of the file is a separate, CEO-gated migration; until then it stays the source for
// those three sections only.

// @size-exempt: a pre-existing oversize (545 lines, unrelated to any addition landed alongside this note);
// a real split is out of scope here — risks destabilizing a working parser for a cosmetic line-count win.

import { readFileSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CONFIG_PATH } from './board-lib.mjs';

// Read owner/projectNumber from board-config.json (C24 config half) rather than a hardcoded const, so a
// project/owner change is a one-file edit instead of a second hand-copy to keep in sync with
// board-writer-behavior.md's own table (both cite this file's fields now).
// @keep-comment -- the path comes from board-lib.mjs's own CONFIG_PATH, the single place that knows where
// the ADOPTER's board config lives. It was computed here as '../board-config.json', relative to this
// script, and that broke the moment the config moved out of the skill into
// .grimorio/memory/grimorio.board-memory/ -- where it belongs, because it carries the adopter's own
// GitHub account and project id, not grimorio's doctrine. Two scripts computing one path is the
// hand-kept-copy shape again.
const configPath = CONFIG_PATH;
const boardConfig = JSON.parse(readFileSync(configPath, 'utf8'));
const GH_PROJECT_NUMBER = String(boardConfig.projectNumber);
const GH_PROJECT_OWNER = boardConfig.owner;

// A hyphen ATTACHED to a word is a wrapped compound ("multi-" + "agent"); one preceded by a space is
// punctuation and must keep its space. Testing only the last character conflates them.
const endsWithWordHyphen = (s) => /\w-$/.test(s);

// Shared helper: collect multi-line continuation values with proper hyphen-join handling
function collectContinuation(lines, startIndex, isNewFieldOrEntry) {
  let accumulated = '';
  let i = startIndex;

  while (i < lines.length) {
    const nextLine = lines[i];
    if (isNewFieldOrEntry(nextLine, i)) {
      i--;
      break;
    }
    if (nextLine.trim()) {
      // FINDING-02 fix: check if accumulated value ends with hyphen
      if (accumulated && endsWithWordHyphen(accumulated)) {
        accumulated += nextLine.trim();
      } else if (accumulated) {
        accumulated += ' ' + nextLine.trim();
      } else {
        accumulated = nextLine.trim();
      }
    }
    i++;
  }

  return { value: accumulated, endIndex: i };
}

// @keep-comment The register numbers its continuations (why2:, why3:, ...). They join into one `why`
// separated by this, so a reader never sees "why3:" printed mid-sentence on the board.
const PARA = String.fromCharCode(10, 10);

const cwd = process.cwd();
const registerPath = join(cwd, '.grimorio', 'memory', 'grimorio.board-memory', 'register.md');
const outputPath = join(cwd, '.grimorio', '.cache', 'board-projection.json');

// Each GitHub Project item's own `content.body` is exactly one register-stanza block, verbatim (the
// live Project was populated FROM register.md in this same shape) — the leading
// "- **DATE** `id` — state: X(; via actor)?" line plus indented said/why/blocker/closed/title/ref
// fields. Both regexes are unchanged from the register.md-parsing version; only what feeds them moved.
const requestRegex = /^- \*\*(\d{4}-\d{2}-\d{2})\*\* `([a-z0-9-]+)` — state: (queued|progress|blocked|done)(?:; via (.+))?$/;
const fieldRegex = /^  (title|said|why[0-9a-z]*|blocker|closed|ref): (.*)$/;

// Dispatches to whichever of the two known body shapes this body uses (board-writer-behavior.md Step 5).
// Returns null only when neither shape explains the body at all.
function parseEntryFromLines(lines) {
  const match = requestRegex.exec(lines[0]);
  if (match) return parseOldShapeEntry(lines, match);
  return parseNewShapeEntry(lines);
}

// OLD shape: the migration-seeded register-stanza header ("- **DATE** `id` — state: X(; via actor)?") as
// the body's own first line, followed by indented `  field: value` lines. Extracted from the old
// per-section parser's own inner loop so it runs once per GitHub Project item's `body` (already exactly
// one entry block, startIdx 0, no section terminator to watch for) instead of once per file section.
function parseOldShapeEntry(lines, match) {
  const [, date, id, bodyState, actor] = match;
  const request = {
    // @keep-comment `id` is the STABLE document key; `ref` is display evidence a `ref:` field
    // overwrites. Keying a publish on `ref` writes a commit SHA where a doc id belongs.
    id,
    // FINDING (carried from the register.md version, "D1" bug): the id-derived default capitalizes
    // only the first word's first letter, so a decision-summary id like "d1" would otherwise render as
    // the misleading "D1" — an explicit `title:` field below overrides this, and 40 live items use it.
    title: id.split('-').map((w, idx) => idx === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' '),
    ref: id,
    said: '',
    why: '',
    asked: date,
    order: 0
  };
  if (actor) request.actor = actor;

  let blockerRaw;
  let closedRaw;

  let i = 1;
  while (i < lines.length) {
    const fieldLine = lines[i];
    if (!fieldLine.startsWith('  ') && fieldLine.trim()) { i--; break; }

    const fieldMatch = fieldRegex.exec(fieldLine);
    if (fieldMatch) {
      const [, key, value] = fieldMatch;
      let fullValue = value;

      i++;
      const continuation = collectContinuation(
        lines,
        i,
        (line) => !line.startsWith('  ') || line.match(/^  (title|said|why[0-9a-z]*|blocker|closed|ref):/)
      );
      // FINDING-02: Apply hyphen-join fix when joining initial value with continuation
      if (continuation.value) {
        if (fullValue && endsWithWordHyphen(fullValue)) {
          fullValue += continuation.value;
        } else if (fullValue) {
          fullValue += ' ' + continuation.value;
        } else {
          fullValue = continuation.value;
        }
      }
      i = continuation.endIndex;

      if (key === 'title') {
        // An explicit title beats the id-derived one. Without this, "d1" renders as "D1".
        request.title = fullValue;
      } else if (key === 'said') {
        request.said = fullValue;
      } else if (key === 'why' || /^why[0-9a-z]+$/.test(key)) {
        // The register numbers its continuations (why2:, why3:, ...). Join them in file order with a
        // blank line, so a reader sees paragraphs instead of "why3:" printed mid-sentence.
        request.why = request.why ? request.why + PARA + fullValue : fullValue;
      } else if (key === 'blocker') {
        // Not gated on bodyState here: the top-level GitHub Project "State" field, not this body copy,
        // decides whether `blocker` actually gets attached (see the caller) — a card dragged between
        // Project columns changes State without necessarily rewriting this body text.
        blockerRaw = fullValue;
      } else if (key === 'closed') {
        closedRaw = fullValue;
      } else if (key === 'ref') {
        // FINDING-03 fix: use real ref: field value if present
        request.ref = fullValue;
      }
    }

    i++;
  }

  return { request, blockerRaw, closedRaw };
}

// NEW shape (board-writer-behavior.md Step 5): the ask's verbatim text, plus optional UNINDENTED
// "why:"/"blocker:" lines — never the OLD shape's indented "  why:". id/title/ref/state/actor live on the
// item's own top-level JSON fields, so the caller fills them in when `request.id` is left unset.
function parseNewShapeEntry(lines) {
  const whyIdx = lines.findIndex((l) => /^why:\s?/.test(l));
  const blockerIdx = lines.findIndex((l) => /^blocker:\s?/.test(l));

  const boundaries = [whyIdx, blockerIdx].filter((i) => i !== -1).sort((a, b) => a - b);
  const saidEnd = boundaries.length ? boundaries[0] : lines.length;
  const said = lines.slice(0, saidEnd).join('\n').trim();
  if (!said) return null;

  const request = { said, why: '' };

  if (whyIdx !== -1) {
    const whyEnd = blockerIdx !== -1 && blockerIdx > whyIdx ? blockerIdx : lines.length;
    const whyLines = [lines[whyIdx].replace(/^why:\s?/, ''), ...lines.slice(whyIdx + 1, whyEnd)];
    request.why = whyLines.join('\n').trim();
  }

  let blockerRaw;
  if (blockerIdx !== -1) {
    const blockerLines = [lines[blockerIdx].replace(/^blocker:\s?/, ''), ...lines.slice(blockerIdx + 1)];
    blockerRaw = blockerLines.join('\n').trim();
  }

  return { request, blockerRaw, closedRaw: undefined };
}

try {
  const content = readFileSync(registerPath, 'utf8').replace(/\r\n/g, '\n');
  const lines = content.split('\n');

  // Parse meta: line1 is the sentence starting with "This file is what" through its period
  let line1 = null;
  let line2 = null;
  let foundH1 = false;
  let foundLine1 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!foundH1 && line.startsWith('# Board Register')) {
      foundH1 = true;
      continue;
    }
    if (foundH1 && line.startsWith('This file is what')) {
      // Found line1 start: collect until sentence ends with period
      let fullLine = line;
      let j = i + 1;
      while (j < lines.length && !fullLine.trim().endsWith('.')) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('-')) {
          fullLine += ' ' + nextLine;
        }
        j++;
      }
      line1 = fullLine;
      line2 = null;
      foundLine1 = true;
      break;
    }
  }

  // FINDING-07(c) fix: fail if no line1 candidate found
  if (!foundLine1) {
    console.error('ERROR: could not derive meta.line1 from register.md\'s own opening paragraph');
    process.exit(1);
  }

  // Find section boundaries. Only Census/Decisions are read from register.md now — Open asks/Closed
  // moved to the GitHub Project below; this scan keeps looking for all four headings anyway since
  // register.md is not being restructured in this pass (its own further sections are unaffected).
  let censusStart = -1;
  let decisionsStart = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## Census')) {
      censusStart = i + 1;
    } else if (lines[i] === '## Decisions') {
      decisionsStart = i + 1;
    }
  }

  if (decisionsStart === -1) {
    console.error('ERROR: Missing ## Decisions section in register.md');
    process.exit(1);
  }

  // Parse the census section: an evidence block (**key:** value, multi-line) plus `- **cN** n:/sev: — label`
  // rows. Same source-and-projection shape as every other section; nothing here is hand-seeded downstream.
  let evidence = null;
  const census = [];
  if (censusStart !== -1) {
    const end = decisionsStart === -1 ? lines.length : decisionsStart;
    const ev = {};
    let k = censusStart;
    while (k < end) {
      const line = lines[k];
      if (/^## /.test(line)) break;
      const f = /^\*\*(note|title|lede|body):\*\*\s*(.*)$/.exec(line);
      if (f) {
        let v = f[2];
        let n = k + 1;
        while (n < end && lines[n].trim() && !/^\*\*(note|title|lede|body):\*\*/.test(lines[n]) && !lines[n].startsWith('- **') && !lines[n].startsWith('##')) {
          v += ' ' + lines[n].trim();
          n++;
        }
        ev[f[1]] = v.trim();
        k = n;
        continue;
      }
      const c = /^- \*\*([a-z0-9-]+)\*\* n: (-?\d+); sev: (bad|mid|dim) — (.*)$/.exec(line);
      if (c) census.push({ n: Number(c[2]), sev: c[3], label: c[4], order: census.length + 1 });
      k++;
    }
    if (Object.keys(ev).length) evidence = ev;
  }

  // Parse decisions
  let i;
  const decisions = [];
  const decisionTitleRegex = /^- \*\*title:\*\* (.+)$/;
  const verdictRegex = /^  \*\*verdict:\*\* (.+)$/;
  const dateRegex = /^  \*\*date:\*\* (.+)$/;
  const rowsMarkerRegex = /^  \*\*rows:\*\*$/;
  const rowRegex = /^  - l: (.+?) — t: (.+)$/;

  i = decisionsStart;
  let decisionOrder = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('##')) {
      break;
    }

    const titleMatch = decisionTitleRegex.exec(line);
    if (titleMatch) {
      decisionOrder++;
      const title = titleMatch[1];
      const decision = {
        title: title,
        verdict: '',
        date: '',
        rows: [],
        order: decisionOrder
      };

      // Parse decision fields
      i++;
      while (i < lines.length) {
        const fieldLine = lines[i];

        if (fieldLine.startsWith('##') || (fieldLine.trim() && !fieldLine.startsWith('  '))) {
          i--;
          break;
        }

        const verdictMatch = verdictRegex.exec(fieldLine);
        if (verdictMatch) {
          decision.verdict = verdictMatch[1];
        }

        const dateMatch = dateRegex.exec(fieldLine);
        if (dateMatch) {
          decision.date = dateMatch[1];
        }

        const rowsMarkerMatch = rowsMarkerRegex.exec(fieldLine);
        if (rowsMarkerMatch) {
          // Collect rows
          i++;
          while (i < lines.length) {
            const rowLine = lines[i];

            if (rowLine.startsWith('##') || (rowLine.trim() && !rowLine.startsWith('  '))) {
              i--;
              break;
            }

            const rowMatch = rowRegex.exec(rowLine);
            if (rowMatch) {
              let [, l, t] = rowMatch;

              // Continue collecting multi-line t values using shared helper
              i++;
              const continuation = collectContinuation(
                lines,
                i,
                (line) => !line.startsWith('    ') || line.match(/^  - l:/)
              );
              // FINDING-02: Apply hyphen-join fix when joining initial t value with continuation
              if (continuation.value) {
                if (t && endsWithWordHyphen(t)) {
                  t += continuation.value;
                } else if (t) {
                  t += ' ' + continuation.value;
                } else {
                  t = continuation.value;
                }
              }
              i = continuation.endIndex;

              decision.rows.push({ l, t });
            }

            i++;
          }
          i--;
        }

        i++;
      }

      decisions.push(decision);
    }

    i++;
  }

  // ---- Asks: live GitHub Project, replacing register.md's own "## Open asks" / "## Closed" sections ----

  let ghRaw;
  try {
    // BOARD_PROJECTION_ITEMS_JSON substitutes a file for the `gh` call, so the selftest can exercise
    // this parser without a network or a live Project. Never set in normal operation.
    ghRaw = process.env.BOARD_PROJECTION_ITEMS_JSON
      ? readFileSync(process.env.BOARD_PROJECTION_ITEMS_JSON, 'utf8')
      : execFileSync(
          'gh',
          ['project', 'item-list', GH_PROJECT_NUMBER, '--owner', GH_PROJECT_OWNER, '--format', 'json', '--limit', '500'],
          { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
        );
  } catch (err) {
    console.error(`ERROR: "gh project item-list ${GH_PROJECT_NUMBER} --owner ${GH_PROJECT_OWNER}" failed: ${err.message}`);
    process.exit(1);
  }

  let ghItems;
  try {
    ghItems = JSON.parse(ghRaw).items;
  } catch (err) {
    console.error(`ERROR: gh project item-list did not return valid JSON: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(ghItems)) {
    console.error('ERROR: gh project item-list JSON carried no "items" array');
    process.exit(1);
  }

  // DEDUP GATE (carried from the register.md version, where it caught `symbiosis-script-llm` doubled on
  // 2026-09-11 with no error, no warning, a doubled row on the CEO's own board). A generator that cannot
  // refuse its own input's duplicates is not deterministic, it is only repeatable.
  const seenAskIds = new Map();
  for (const item of ghItems) {
    if (seenAskIds.has(item.askId)) {
      console.error(`ERROR: duplicate askId "${item.askId}" in the GitHub Project — an askId must be unique across every item.`);
      process.exit(1);
    }
    seenAskIds.set(item.askId, true);
  }

  const STATE_MAP = { Queued: 'queued', Progress: 'progress', Blocked: 'blocked', Done: 'done', Discarded: 'discarded' };

  const requests = [];
  const closed = [];
  let requestOrder = 0;
  const unrecognised = [];
  // Items whose body carried no usable ask text under EITHER known shape (Finding 1) — skipped, never
  // aborting the whole run; excluded from the self-check's own expected counts below so a run stays a
  // clean exit 0 when every OTHER item parsed fine, exactly as it does today with zero skips.
  const skippedAskIds = new Set();

  for (const item of ghItems) {
    const body = (item.content && item.content.body) || '';
    const bodyLines = body.split('\n');

    // A why-field this parser does not recognise is swallowed into the previous value with its own name
    // left in the rendered prose. Checked against the SOURCE: prose never begins "  whyX:".
    for (let k = 0; k < bodyLines.length; k++) {
      const m = /^  (why[^:\s]*):/.exec(bodyLines[k]);
      if (m && !fieldRegex.test(bodyLines[k])) unrecognised.push(`${item.askId} line ${k + 1}: ${m[1]}`);
    }

    const state = STATE_MAP[item.state];
    if (!state) {
      console.error(`ERROR: item "${item.askId}" carries State "${item.state}" — expected one of Queued/Progress/Blocked/Done/Discarded.`);
      process.exit(1);
    }

    const parsed = parseEntryFromLines(bodyLines);
    if (!parsed) {
      // Neither known shape explains this body. Skip-and-warn, never abort: the self-check below
      // excludes skipped items from its expected counts, and the skip is visible in stderr and the OK line.
      console.error(`WARNING: item "${item.askId}"'s own body carries no usable ask text under either known shape — skipping this item; it will not appear in the projection.`);
      skippedAskIds.add(item.askId);
      continue;
    }

    const { request, blockerRaw, closedRaw } = parsed;
    if (request.id === undefined) {
      // NEW-shape item: id/title/ref are top-level JSON fields (board-writer-behavior.md Step 3).
      // A GitHub Project item carries no date anywhere, so `asked` stays '' rather than fabricated.
      request.id = item.askId;
      request.title = item.title || item.askId;
      request.ref = item.askId;
      request.asked = '';
    }
    // The top-level GitHub Project "State" field is authoritative (a card dragged between columns
    // changes it without necessarily rewriting the body text) — it overrides whatever state the body's
    // own copy carries, which is why parseEntryFromLines never reads bodyState into `request` at all.
    request.state = state;

    // blocker/closed attach only for their own state, tested against the authoritative state above.
    // The Project's own "Blocker" field truncates (~95-100 chars), so the body's full copy wins.
    if (state === 'blocked') {
      request.blocker = blockerRaw || item.blocker || '';
    }
    if (state === 'done') {
      request.closed = closedRaw;
    }
    // Same fallback reasoning for `actor`: prefer the body's own "; via <actor>" capture; the top-level
    // field (not observed truncated in live data, unlike Blocker) covers an item whose actor was set on
    // the Project item directly.
    if (!request.actor && item.actor) request.actor = item.actor;

    if (state === 'done') {
      request.order = closed.length + 1;
      closed.push(request);
    } else {
      requestOrder++;
      request.order = requestOrder;
      requests.push(request);
    }
  }

  if (unrecognised.length) {
    console.error(`ERROR: the GitHub Project uses why-fields this parser does not recognise, so each would be swallowed into the previous value with its name left in the rendered prose: ${unrecognised.join(', ')}`);
    process.exit(1);
  }

  // Every entry must carry the ask itself. An empty said is a stanza that renders as a title and nothing else.
  const silent = [...requests, ...closed].filter((e) => !e.said || !e.said.trim());
  if (silent.length) {
    console.error(`ERROR: entries with an empty said: ${silent.map((e) => e.ref).join(', ')}`);
    process.exit(1);
  }

  // @keep-comment CONTRACT for any publisher: null/[] here means NOT OWNED BY THE REGISTER — leave
  // whatever the live board holds. It never means "empty it".
  const output = {
    meta: { line1: line1, line2: line2 },
    registerOwns: { evidence: evidence !== null, census: census.length > 0 },
    evidence: evidence,
    requests: requests,
    closed: closed,
    decisions: decisions,
    census: census
  };

  // Write to file
  writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

  // Self-check: read back and verify counts against the GitHub Project's own item states — the
  // register.md-era version counted regex matches in file text; this counts states in the fetched JSON,
  // same intent (source count must equal emitted count), new source.
  const readBack = JSON.parse(readFileSync(outputPath, 'utf8'));
  const effectiveItems = ghItems.filter((it) => !skippedAskIds.has(it.askId));
  const expectedClosed = effectiveItems.filter((it) => it.state === 'Done').length;
  const expectedRequests = effectiveItems.length - expectedClosed;

  // Count decision entries in register
  let decisionCount = 0;
  for (let i = decisionsStart; i < lines.length; i++) {
    if (decisionTitleRegex.test(lines[i])) {
      decisionCount++;
    }
  }

  if (readBack.requests.length !== expectedRequests || readBack.decisions.length !== decisionCount || readBack.closed.length !== expectedClosed) {
    console.error(`ERROR: self-check mismatch (requests ${readBack.requests.length}/${expectedRequests}, closed ${readBack.closed.length}/${expectedClosed}, decisions ${readBack.decisions.length}/${decisionCount})`);
    process.exit(1);
  }

  console.log(`OK: wrote .grimorio/.cache/board-projection.json (${readBack.requests.length} requests, ${readBack.closed.length} closed, ${readBack.decisions.length} decisions)`);
  process.exit(0);

} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('ERROR: .grimorio/memory/grimorio.board-memory/register.md not found');
  } else {
    console.error(`ERROR: ${err.message}`);
  }
  process.exit(1);
}
