// Shared reader for the turn ledger: parse a transcript tail into windows, fold windows into the ask
// index, and run the invariants. Design: ref:memory/grimorio.system-design-memory/designs/platform/turn-declaration-hook/design.md
import { readFileSync, existsSync, writeFileSync, mkdirSync, statSync, openSync, readSync, closeSync } from "fs";
import { dirname } from "path";
import { loadInstallationConfig } from "./installation-config.mjs";

// Every installation supplies its own principal-language words via .claude/grimorio-config(.local).json;
// this module's own decision logic (CATEGORIES, BOARD_EXEMPT, checkInvariants, foldWindow) compares only
// against the CANONICAL keys below, never a localized literal -- see installation-config's own design doc.
const { tokens } = loadInstallationConfig();

export const CATEGORIES = Object.keys(tokens.categories);
// A fixed grimorio schema key, not principal-language output -- never sourced from config.
export const BOARD_EXEMPT = new Set(["diagnosis"]);
export const STALE_WINDOWS = 3;
export const MAX_BLOCKS = 2;

const strip = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// @keep-comment The original hardcoded pattern tolerated an accented vs. unaccented spelling of the same field-name
// keyword via one special-cased alternation -- a real installation's own transcripts mix accented and
// unaccented spelling of other words the same way. This generalizes that one hardcoded tolerance to
// every config-driven keyword, so a config value still matches either spelling instead of only its own.
// Every variant keys its own class, base and accented alike: a token the config spells WITH an accent
// ("categoría") must match the unaccented spelling too, which a base-letter-only map cannot do.
const ACCENT_CLASSES = ["aá", "eé", "ií", "oó", "uúü", "nñ"];
const ACCENT_FOLD = Object.fromEntries(ACCENT_CLASSES.flatMap((cls) => [...cls].map((ch) => [ch, cls])));
function foldKeyword(word) {
  return [...String(word)]
    .map((ch) => {
      const cls = ACCENT_FOLD[ch.toLowerCase()];
      return cls ? `[${cls}]` : escapeRegExp(ch);
    })
    .join("");
}

const CATEGORY_ALTERNATION = Object.values(tokens.categories).map(foldKeyword).join("|");
const DECLARE_KW = foldKeyword(tokens.declare);
const CLOSE_KW = foldKeyword(tokens.close);
const PENDING_KW = foldKeyword(tokens.pending);
const CATEGORY_FIELD_KW = foldKeyword(tokens.categoryField);
const OBJECTIVE_FIELD_KW = foldKeyword(tokens.objectiveField);
const DECLARE_PATTERN =
  `^\\s*${DECLARE_KW}\\s*·\\s*${CATEGORY_FIELD_KW}=(${CATEGORY_ALTERNATION})\\s*·\\s*id=([A-Za-z0-9._-]+)\\s*·\\s*${OBJECTIVE_FIELD_KW}:\\s*(.+)$`;

const DECLARE = new RegExp(DECLARE_PATTERN, "im");
const DECLARE_ALL = new RegExp(DECLARE_PATTERN, "gim");
const PENDING_ALL = new RegExp(`^\\s*${PENDING_KW}\\s*·\\s*id=([A-Za-z0-9._-]+)\\s*·\\s*(.+)$`, "gim");
// VERIFIED / COULD NOT / NOTHING are fixed protocol vocabulary (grimorio-conduct rule 21), never
// config-driven: a verdict keyword is grimorio's own protocol, not principal-language output.
const CLOSE_ALL = new RegExp(
  `^\\s*${CLOSE_KW}\\s*·\\s*id=([A-Za-z0-9._-]+)\\s*·\\s*(VERIFIED|COULD NOT|NOTHING)\\s*(?:·\\s*checks:\\s*([^·\\n]*))?(?:·\\s*)?(.*)$`,
  "gim",
);

// Maps a matched, localized category word back to its canonical key (case/diacritic-insensitive, via the
// same strip() used everywhere else). The regex alternation above only ever captures a known localized
// word, so this always resolves -- the fallback exists only as a defensive no-op, never a real path.
function canonicalCategory(rawWord) {
  const norm = strip(rawWord);
  for (const [key, word] of Object.entries(tokens.categories)) {
    if (strip(word) === norm) return key;
  }
  return norm;
}

// A genuine user turn is a string or an all-text content block. A tool_result is the harness talking
// back, never the principal, so it never opens a window.
export function isGenuineUser(rec) {
  if (!rec || rec.type !== "user" || !rec.message) return false;
  const c = rec.message.content;
  if (typeof c === "string") return c.trim().length > 0;
  return Array.isArray(c) && c.length > 0 && c.every((b) => b && b.type === "text");
}

export function isCompactBoundary(rec) {
  return Boolean(rec && (rec.subtype === "compact_boundary" || rec.isCompactSummary === true));
}

function textOf(rec) {
  const c = rec && rec.message && rec.message.content;
  if (typeof c === "string") return c;
  if (!Array.isArray(c)) return "";
  return c.filter((b) => b && b.type === "text").map((b) => b.text || "").join("\n");
}

// `bash .grimorio/scripts/selftest/run-all.sh` -> {"bash", "run-all.sh", ".grimorio/scripts/selftest/run-all.sh"}
// `gh project item-edit --id X` -> {"gh", "gh project", "gh project item-edit"}
const WORD_RE = new RegExp("^[A-Za-z][A-Za-z0-9_.-]*$");
const SEGMENT_RE = new RegExp("[" + String.fromCharCode(10) + ";|&]+|[$][(]|[)]|`");
const SPACE_RE = new RegExp("[ " + String.fromCharCode(9) + String.fromCharCode(10) + String.fromCharCode(13) + "<>]+");
const PATHY_RE = new RegExp("[./]");
export function normalizeCommand(cmd) {
  const out = new Set();
  const text = String(cmd || "");
  // A block is many commands: newlines, ; && || and pipes each start a new one. Reading only the first word
  // of the whole block made every command after a leading `cd` invisible, so a claim naming one could never
  // be a member of this set.
  const isWord = (w) => Boolean(w) && !w.startsWith("-") && WORD_RE.test(w);
  for (const segment of text.split(SEGMENT_RE)) {
    const words = segment.split(SPACE_RE).filter(Boolean);
    if (!words.length) continue;
    if (isWord(words[0])) {
      out.add(words[0]);
      if (isWord(words[1])) {
        out.add(words[0] + " " + words[1]);
        if (isWord(words[2])) out.add(words[0] + " " + words[1] + " " + words[2]);
      }
    }
    for (const w of words) {
      if (PATHY_RE.test(w) && !w.startsWith("-")) {
        out.add(w);
        const base = w.split("/").pop();
        if (base) out.add(base);
      }
    }
  }
  return out;
}



export function readTranscriptTail(path, fromOffset) {
  if (!path || !existsSync(path)) return { text: "", offset: fromOffset || 0 };
  const size = statSync(path).size;
  const start = Math.min(Math.max(0, fromOffset || 0), size);
  if (start >= size) return { text: "", offset: size };
  const fd = openSync(path, "r");
  const buf = Buffer.alloc(size - start);
  readSync(fd, buf, 0, buf.length, start);
  closeSync(fd);
  let text = buf.toString("utf8");
  if (start > 0) {
    const nl = text.indexOf("\n");
    text = nl === -1 ? "" : text.slice(nl + 1);
  }
  return { text, offset: size };
}

// A window opens at a genuine user record or a compact boundary and runs to the next one. A mid-turn
// message therefore gets a window of its own, which is what makes a second ask in one turn visible.
export function buildWindows(tailText) {
  const windows = [];
  let cur = null;
  const open = (rec, kind) => {
    cur = {
      kind,
      openedAt: (rec && rec.timestamp) || null,
      cmdSet: new Set(),
      spawns: new Set(),
      writes: new Set(),
      texts: [],
      boardWrite: false,
    };
    windows.push(cur);
  };
  for (const line of String(tailText).split("\n")) {
    if (!line.trim()) continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch (_) {
      continue;
    }
    if (isGenuineUser(rec)) {
      open(rec, "user");
      continue;
    }
    // A compact boundary ends the window too, so a command run before it never satisfies a claim made
    // after it -- but it opens a CONTINUATION, which owes no new DECLARE of its own.
    if (isCompactBoundary(rec)) {
      open(rec, "compact");
      continue;
    }
    if (!cur || rec.type !== "assistant" || !rec.message) continue;
    const content = rec.message.content;
    if (typeof content === "string") {
      cur.texts.push(content);
      continue;
    }
    if (!Array.isArray(content)) continue;
    for (const b of content) {
      if (!b) continue;
      if (b.type === "text") cur.texts.push(b.text || "");
      if (b.type !== "tool_use") continue;
      const input = b.input || {};
      if (b.name === "Bash" || b.name === "PowerShell") {
        for (const n of normalizeCommand(input.command)) cur.cmdSet.add(n);
        const c = String(input.command || "");
        if (/gh\s+project\s+item-(create|edit)|board-write\.mjs/.test(c)) cur.boardWrite = true;
        if (/\bgit\s+commit\b/.test(c)) cur.writes.add("git commit");
      }
      if (b.name === "Write" || b.name === "Edit" || b.name === "NotebookEdit") {
        cur.writes.add(String(input.file_path || "file"));
      }
      if (b.name === "Agent") {
        const t = String(input.subagent_type || "");
        cur.spawns.add(t);
        if (t === "grimorio.board-writer" || t === "grimorio.board-feeder") cur.boardWrite = true;
      }
    }
  }
  return windows;
}

export function emptyIndex() {
  return { version: 1, watermark: 0, byId: {} };
}

export function loadIndex(path) {
  if (!existsSync(path)) return emptyIndex();
  try {
    const idx = JSON.parse(readFileSync(path, "utf8"));
    if (!idx || typeof idx !== "object" || !idx.byId) return emptyIndex();
    return idx;
  } catch (_) {
    return emptyIndex();
  }
}

export function saveIndex(path, idx) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(idx, null, 2), "utf8");
}

function parseChecks(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function foldWindow(idx, win) {
  const first = win.texts[0] || "";
  const all = win.texts.join("\n");
  const declared = [];
  let m;
  DECLARE_ALL.lastIndex = 0;
  while ((m = DECLARE_ALL.exec(all))) {
    const category = canonicalCategory(m[1]);
    const id = m[2];
    declared.push(id);
    const ask = idx.byId[id] || {
      id,
      category,
      objective: m[3].trim(),
      declaredAt: win.openedAt,
      windowsOpen: 0,
      boardWriteAt: null,
      claimedChecks: [],
      closedAt: null,
      verdict: null,
      lastTouchedBy: "main-loop",
    };
    ask.category = category;
    ask.objective = m[3].trim();
    idx.byId[id] = ask;
  }
  if (win.boardWrite) {
    for (const id of declared) {
      const a = idx.byId[id];
      if (a && !a.boardWriteAt) a.boardWriteAt = win.openedAt;
    }
    for (const a of Object.values(idx.byId)) {
      if (!a.closedAt && !a.boardWriteAt && declared.length === 0) a.boardWriteAt = win.openedAt;
    }
  }
  const pendientes = new Set();
  PENDING_ALL.lastIndex = 0;
  while ((m = PENDING_ALL.exec(all))) pendientes.add(m[1]);

  const closes = [];
  CLOSE_ALL.lastIndex = 0;
  while ((m = CLOSE_ALL.exec(all))) {
    closes.push({ id: m[1], verdict: m[2].toUpperCase(), checks: parseChecks(m[3]) });
  }
  for (const c of closes) {
    const a = idx.byId[c.id];
    if (!a) continue;
    a.claimedChecks = c.checks;
    const missing = c.checks.filter((chk) => !win.cmdSet.has(chk));
    if (missing.length === 0) {
      a.closedAt = win.openedAt;
      a.verdict = c.verdict;
      a.disputed = null;
    } else {
      a.disputed = missing;
    }
  }
  const closedIds = new Set(closes.map((c) => c.id));
  for (const a of Object.values(idx.byId)) {
    if (a.closedAt) continue;
    if (!closedIds.has(a.id) && !declared.includes(a.id)) a.windowsOpen = (a.windowsOpen || 0) + 1;
    if (pendientes.has(a.id)) a.pendienteAt = win.openedAt;
  }
  return { declared, first, all, closes, pendientes };
}

// Each invariant is a pure predicate over (window, index). The first failure is what the hook reports,
// so the main loop is told one thing to fix, never a list.
export function checkInvariants(idx, win, folded) {
  const { declared, first, all } = folded;
  // A window with no assistant text carries nothing to judge: the turn's own final message is not in the
  // transcript yet when Stop fires, and a trailing system record opens a window that will never hold text.
  if (win.texts.length === 0) return null;
  if (win.kind === "user" && !DECLARE.test(first) && !DECLARE.test(all)) {
    return {
      id: "I1",
      reason: `no ${tokens.declare} in this window. State: ${tokens.declare} · ${tokens.categoryField}=<${CATEGORY_ALTERNATION}> · id=<slug> · ${tokens.objectiveField}: <one sentence>`,
    };
  }
  for (const id of declared) {
    const a = idx.byId[id];
    if (!a) continue;
    if (!CATEGORIES.includes(a.category)) {
      return { id: "I0", reason: `category "${a.category}" on "${id}" is not one of ${Object.values(tokens.categories).join(", ")}` };
    }
    // A window can carry several asks: a genuine diagnosis alongside an execution that writes. The write
    // is only unexplained when EVERY ask declared in this window is a non-writing kind, so attribution
    // never needs a judgment about which ask a given file belongs to.
    const allNonWriting = declared.every((d) => {
      const x = idx.byId[d];
      return x && (x.category === "diagnosis" || x.category === "idea");
    });
    const wrote = allNonWriting && (win.writes.size > 0 || win.spawns.size > 0);
    if (a.category === "diagnosis" && wrote) {
      return {
        id: "I8",
        reason: `"${id}" is labelled ${tokens.categories.diagnosis}, but this window wrote or spawned (${[...win.writes, ...win.spawns].slice(0, 3).join(", ")}). Re-label it.`,
      };
    }
    if (a.category === "idea" && wrote) {
      return {
        id: "I8",
        reason: `"${id}" is labelled ${tokens.categories.idea}, but this window executed. A "${tokens.categories.idea}" is stored, never executed. Re-label it.`,
      };
    }
    if (!BOARD_EXEMPT.has(a.category) && !a.boardWriteAt) {
      return { id: "I2", reason: `"${id}" (${a.category}) has no board item. Register it before working it.` };
    }
  }
  for (const c of folded.closes) {
    const a = idx.byId[c.id];
    if (a && a.disputed && a.disputed.length) {
      return { id: "I4", reason: `you claimed check "${a.disputed[0]}" for "${c.id}" — no tool call in this window ran it.` };
    }
    if (a && a.category === "evaluation" && c.verdict === "NOTHING" && !win.boardWrite) {
      return { id: "I7", reason: `"${c.id}" evaluated to nothing — move its board item to Discarded in this window.` };
    }
  }
  for (const a of Object.values(idx.byId)) {
    if (a.closedAt) continue;
    if ((a.windowsOpen || 0) >= STALE_WINDOWS && a.pendienteAt !== win.openedAt) {
      return { id: "I5", reason: `"${a.id}" has been open ${a.windowsOpen} windows. Close it, or state: ${tokens.pending} · id=${a.id} · <why>` };
    }
  }
  return null;
}

export function ledgerLine(idx) {
  const open = Object.values(idx.byId).filter((a) => !a.closedAt);
  const unAll = (idx.unresolved || []).slice(-2).map((u) => `${u.id} (${u.reason.slice(0, 60)})`);
  const unTail = unAll.length ? ` · RAISED AND UNANSWERED: ${unAll.join("; ")}` : "";
  if (open.length === 0) return `TURN LEDGER — no open asks.${unTail}`;
  const parts = open
    .sort((a, b) => (b.windowsOpen || 0) - (a.windowsOpen || 0))
    .map((a) => {
      const bits = [`${a.id} (${a.category}`];
      if (a.windowsOpen) bits.push(`, ${a.windowsOpen} window${a.windowsOpen === 1 ? "" : "s"}`);
      if (a.disputed && a.disputed.length) bits.push(`, DISPUTED: ${a.disputed[0]}`);
      if (!a.boardWriteAt && !BOARD_EXEMPT.has(a.category)) bits.push(", NO BOARD ITEM");
      return bits.join("") + ")";
    });
  const stale = open.filter((a) => (a.windowsOpen || 0) >= STALE_WINDOWS).map((a) => a.id);
  return `TURN LEDGER — ${open.length} open: ${parts.join(" · ")} · STALE: ${stale.length ? stale.join(", ") : "none"}${unTail}`;
}
