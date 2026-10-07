// Stop hook logic: fold this turn's windows into the ask index, then block on the first invariant that
// fails. Design: ref:memory/grimorio.system-design-memory/designs/platform/turn-declaration-hook/design.md
import { appendFileSync, mkdirSync } from "fs";
import path from "path";
import { cachePath } from "../../.grimorio/scripts/refobl/cache-paths.mjs";
import {
  readTranscriptTail, buildWindows, loadIndex, saveIndex, foldWindow, checkInvariants, MAX_BLOCKS,
} from "./turn-ledger-lib.mjs";

const root = process.env.CLAUDE_PROJECT_DIR || ".";
const INDEX = cachePath("ask-index.json", root);
const DEFECTS = cachePath("turn-ledger-defects.log", root);

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
}

function failOpen(idx, note) {
  mkdirSync(path.dirname(DEFECTS), { recursive: true });
  appendFileSync(DEFECTS, `${new Date().toISOString()}\tfail-open\t${note}\n`, "utf8");
  idx.blocks = 0;
  saveIndex(INDEX, idx);
  process.exit(0);
}

export function run(input) {
  // A spawned agent has its own Stop; this ledger is the main loop's alone.
  if (input.agent_id || input.agent_type) process.exit(0);

  const idx = loadIndex(INDEX);
  const { text, offset } = readTranscriptTail(input.transcript_path, idx.watermark || 0);
  const windows = buildWindows(text);
  if (windows.length === 0) {
    idx.watermark = offset;
    saveIndex(INDEX, idx);
    process.exit(0);
  }

  let failure = null;
  for (const win of windows) {
    const folded = foldWindow(idx, win);
    const f = checkInvariants(idx, win, folded);
    if (f && !failure) failure = f;
  }

  // A window with no assistant text yet is the turn Stop is firing ON: its own final message, where the
  // close lines live, is not in the transcript at this instant. Advancing past it loses every close
  // permanently, so the watermark stops short and that window is read once more next time.
  const lastEmpty = windows.length > 0 && windows[windows.length - 1].texts.length === 0;
  const nextWatermark = lastEmpty ? idx.watermark || 0 : offset;

  if (!failure) {
    idx.watermark = nextWatermark;
    idx.blocks = 0;
    saveIndex(INDEX, idx);
    process.exit(0);
  }

  // A window is judged ONCE. The watermark advances even on a block, because the repair lands in the
  // NEXT window: holding the watermark back re-reads the same failed window forever and re-reads the
  // whole transcript with it. The unreported failure is kept on the index instead, so the ledger shows
  // it was raised and never answered.
  idx.watermark = nextWatermark;
  idx.blocks = (idx.blocks || 0) + 1;
  idx.unresolved = [...(idx.unresolved || []), { at: new Date().toISOString(), id: failure.id, reason: failure.reason }].slice(-20);
  if (idx.blocks > MAX_BLOCKS) failOpen(idx, `${failure.id}: ${failure.reason}`);
  saveIndex(INDEX, idx);
  block(`turn-close.mjs — ${failure.id}: ${failure.reason}`);
}
