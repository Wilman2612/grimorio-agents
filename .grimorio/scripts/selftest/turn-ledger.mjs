// Selftest for the turn ledger: six fixtures, one per state the design names. Each builds a transcript
// and an index in a throwaway root, runs the hook as a real process over stdin, and asserts on what it
// actually printed -- never on the library's internals.
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { execFileSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { cacheDir, cachePath } from "../refobl/cache-paths.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
// never a level count: it breaks the moment depth changes, which is what moving this tree did
const REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const CLOSE = path.join(REPO, ".claude/hooks/turn-close.mjs");
const OPEN = path.join(REPO, ".claude/hooks/turn-open.mjs");

let pass = 0;
let fail = 0;
const ok = (name) => {
  pass++;
  console.log(`  ok   ${name}`);
};
const bad = (name, detail) => {
  fail++;
  console.log(`  FAIL ${name}\n         ${detail}`);
};

const T0 = Date.parse("2026-09-16T10:00:00.000Z");
const iso = (n) => new Date(T0 + n * 1000).toISOString();

const user = (n, text) => JSON.stringify({ type: "user", timestamp: iso(n), message: { role: "user", content: text } });
const toolResult = (n) =>
  JSON.stringify({ type: "user", timestamp: iso(n), message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: "ok" }] } });
const compact = (n) => JSON.stringify({ type: "system", subtype: "compact_boundary", timestamp: iso(n) });
const assistant = (n, blocks) =>
  JSON.stringify({ type: "assistant", timestamp: iso(n), message: { role: "assistant", content: blocks } });
const text = (t) => ({ type: "text", text: t });
const bash = (cmd) => ({ type: "tool_use", id: "tu" + Math.random(), name: "Bash", input: { command: cmd } });
const write = (p) => ({ type: "tool_use", id: "tu" + Math.random(), name: "Write", input: { file_path: p } });
const spawn = (t) => ({ type: "tool_use", id: "tu" + Math.random(), name: "Agent", input: { subagent_type: t } });

// The CEO's own live installation: committed English schema + his own Spanish local override, mirroring
// .claude/grimorio-config(.local).json exactly (design: ref:memory/grimorio.system-design-memory/designs/platform/installation-config/design.md).
const DEFAULT_COMMITTED_CONFIG = {
  language: "en",
  tokens: {
    declare: "DECLARE", close: "CLOSE", pending: "PENDING", categoryField: "category", objectiveField: "objective",
    categories: { request: "request", execution: "execution", evaluation: "evaluation", idea: "idea", diagnosis: "diagnosis" },
  },
  writeGuard: { enabled: false },
};
const DEFAULT_LOCAL_CONFIG = {
  language: "es",
  tokens: {
    declare: "DECLARO", close: "CIERRO", pending: "PENDIENTE", categoryField: "categoría", objectiveField: "objetivo",
    categories: { request: "peticion", execution: "ejecucion", evaluation: "evaluacion", idea: "idea", diagnosis: "diagnostico" },
  },
};

// `config.committed`/`config.local` override the defaults above; `config.local === null` writes NO local
// file at all (a bare-clone / non-Spanish installation), never falling back to the CEO's own override.
function fixture(lines, index, config) {
  const dir = mkdtempSync(path.join(tmpdir(), "turn-ledger-"));
  mkdirSync(cacheDir(dir), { recursive: true });
  // .claude/ used to be created as a side effect of making .claude/.cache; the cache root moved out from
  // under it, so the config this fixture writes below needs the directory made on purpose now.
  mkdirSync(path.join(dir, ".claude"), { recursive: true });
  const tpath = path.join(dir, "transcript.jsonl");
  writeFileSync(tpath, lines.join("\n") + "\n", "utf8");
  if (index) writeFileSync(cachePath("ask-index.json", dir), JSON.stringify(index), "utf8");
  const committed = (config && config.committed) || DEFAULT_COMMITTED_CONFIG;
  writeFileSync(path.join(dir, ".claude/grimorio-config.json"), JSON.stringify(committed), "utf8");
  const local = config && config.local === null ? null : (config && config.local) || DEFAULT_LOCAL_CONFIG;
  if (local) writeFileSync(path.join(dir, ".claude/grimorio-config.local.json"), JSON.stringify(local), "utf8");
  return { dir, tpath };
}

function runHook(script, dir, payload) {
  try {
    const out = execFileSync(process.execPath, [script], {
      input: JSON.stringify(payload),
      env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
      encoding: "utf8",
    });
    return { out, code: 0 };
  } catch (e) {
    return { out: String(e.stdout || ""), code: e.status === undefined ? -1 : e.status, err: String(e.stderr || "") };
  }
}

const idxOf = (dir) => {
  const p = cachePath("ask-index.json", dir);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};

// ---- 1. clean: declared, registered, claimed with a check that actually ran -> exit 0, ask CLOSED
{
  const { dir, tpath } = fixture([
    user(0, "arregla el ledger"),
    assistant(1, [
      text("DECLARO · categoría=petición · id=demo-ask · objetivo: build the ledger"),
      bash('gh project item-create 2 --owner selftest-owner --title "demo"'),
      bash("bash .grimorio/scripts/selftest/run-all.sh"),
      text("CIERRO · id=demo-ask · VERIFIED · checks: run-all.sh · done"),
    ]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  const idx = idxOf(dir);
  if (r.code === 0 && !r.out.includes("block") && idx && idx.byId["demo-ask"] && idx.byId["demo-ask"].closedAt) ok("clean-window");
  else bad("clean-window", `code=${r.code} out=${r.out.slice(0, 160)} closed=${idx && idx.byId["demo-ask"] && idx.byId["demo-ask"].closedAt}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 2. a claimed check no tool call ran -> DISPUTED and a block naming it
{
  const { dir, tpath } = fixture([
    user(0, "arregla"),
    assistant(1, [
      text("DECLARO · categoría=ejecución · id=demo2 · objetivo: x"),
      bash("gh project item-create 2 --owner selftest-owner"),
      text("CIERRO · id=demo2 · VERIFIED · checks: run-all.sh · done"),
    ]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  const idx = idxOf(dir);
  if (r.out.includes('"block"') && r.out.includes("run-all.sh") && idx.byId.demo2.disputed) ok("disputed-claim");
  else bad("disputed-claim", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 3. a peticion with no board write blocks; a diagnostico in the same shape does not
{
  const { dir, tpath } = fixture([
    user(0, "haz esto"),
    assistant(1, [text("DECLARO · categoría=petición · id=demo3 · objetivo: x"), text("CIERRO · id=demo3 · VERIFIED · checks: · done")]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  const { dir: d2, tpath: t2 } = fixture([
    user(0, "por qué falla"),
    assistant(1, [text("DECLARO · categoría=diagnóstico · id=demo3b · objetivo: why"), text("CIERRO · id=demo3b · VERIFIED · checks: · because")]),
  ]);
  const r2 = runHook(CLOSE, d2, { transcript_path: t2 });
  if (r.out.includes('"block"') && r.out.includes("no board item") && r2.code === 0 && !r2.out.includes("block")) ok("missing-board-write");
  else bad("missing-board-write", `peticion=${r.out.slice(0, 120)} diagnostico=${r2.out.slice(0, 120)}`);
  rmSync(dir, { recursive: true, force: true });
  rmSync(d2, { recursive: true, force: true });
}

// ---- 4. a label the window's own facts contradict
{
  const { dir, tpath } = fixture([
    user(0, "por qué falla"),
    assistant(1, [text("DECLARO · categoría=diagnóstico · id=demo4 · objetivo: why"), write("src/thing.ts"), text("CIERRO · id=demo4 · VERIFIED · checks: · fixed")]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.out.includes('"block"') && r.out.includes("Re-label")) ok("label-contradicted");
  else bad("label-contradicted", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 5. the third failure in one window fails OPEN with a defect row
{
  const { dir, tpath } = fixture(
    [user(0, "haz esto"), assistant(1, [text("nothing declared here")])],
    { version: 1, watermark: 0, byId: {}, blocks: 2 },
  );
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  const defects = cachePath("turn-ledger-defects.log", dir);
  if (r.code === 0 && !r.out.includes("block") && existsSync(defects) && readFileSync(defects, "utf8").includes("fail-open")) ok("fail-open");
  else bad("fail-open", `code=${r.code} out=${r.out.slice(0, 120)} defects=${existsSync(defects)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 6. turn-open prints the ledger from the index and never touches the transcript
{
  const { dir } = fixture([], {
    version: 1,
    watermark: 0,
    byId: {
      "open-one": { id: "open-one", category: "peticion", windowsOpen: 4, boardWriteAt: iso(0), closedAt: null },
      "done-one": { id: "done-one", category: "ejecucion", windowsOpen: 0, boardWriteAt: iso(0), closedAt: iso(1) },
    },
  });
  const r = runHook(OPEN, dir, { hook_event_name: "UserPromptSubmit", transcript_path: "/nonexistent/path.jsonl" });
  if (r.code === 0 && r.out.includes("TURN LEDGER") && r.out.includes("open-one") && !r.out.includes("done-one") && r.out.includes("STALE")) ok("ledger-line");
  else bad("ledger-line", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 7. a mid-turn genuine message opens its own window and owes its own DECLARO
{
  const { dir, tpath } = fixture([
    user(0, "primera petición"),
    assistant(1, [text("DECLARO · categoría=diagnóstico · id=w1 · objetivo: a"), bash("ls")]),
    assistant(3, [text("CIERRO · id=w1 · VERIFIED · checks: · a")]),
    user(4, "segunda petición a mitad"),
    assistant(5, [text("no declaration in this second window")]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.out.includes('"block"') && r.out.includes("I1")) ok("mid-turn-window");
  else bad("mid-turn-window", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 7b. a tool_result is the harness talking back, so it opens NO window and owes no DECLARO
{
  const { dir, tpath } = fixture([
    user(0, "una petición"),
    assistant(1, [text("DECLARO · categoría=diagnóstico · id=w2 · objetivo: a"), bash("ls")]),
    toolResult(2),
    assistant(3, [text("CIERRO · id=w2 · VERIFIED · checks: · a")]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes("block")) ok("tool-result-opens-nothing");
  else bad("tool-result-opens-nothing", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 8. a compact boundary ends the window: a command run before it does NOT satisfy a claim after it,
//         and the continuation owes no DECLARO of its own.
{
  const { dir, tpath } = fixture([
    user(0, "algo"),
    assistant(1, [
      text("DECLARO · categoría=ejecución · id=across · objetivo: x"),
      bash("gh project item-create 2"),
      bash("bash .grimorio/scripts/selftest/run-all.sh"),
    ]),
    compact(2),
    assistant(3, [text("CIERRO · id=across · VERIFIED · checks: run-all.sh · done")]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.out.includes('"block"') && r.out.includes("run-all.sh") && r.out.includes("I4")) ok("compact-boundary");
  else bad("compact-boundary", `out=${r.out.slice(0, 220)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 8b. the index itself survives a compaction: an ask declared before it is still open after
{
  const { dir, tpath } = fixture([
    user(0, "guarda esta idea"),
    assistant(1, [text("DECLARO · categoría=idea · id=keepme · objetivo: store it"), bash("gh project item-create 2")]),
    compact(2),
    assistant(3, [text("PENDIENTE · id=keepme · still an idea")]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  const idx = idxOf(dir);
  if (r.code === 0 && idx && idx.byId.keepme && !idx.byId.keepme.closedAt) ok("index-survives-compaction");
  else bad("index-survives-compaction", `code=${r.code} out=${r.out.slice(0, 160)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 9. a spawned agent's own Stop is not this ledger's business
{
  const { dir, tpath } = fixture([user(0, "x"), assistant(1, [text("nothing")])]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath, agent_id: "a123", agent_type: "grimorio.scout" });
  if (r.code === 0 && r.out.trim() === "") ok("subagent-exempt");
  else bad("subagent-exempt", `code=${r.code} out=${r.out.slice(0, 120)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 10. a blocked window is judged ONCE: the watermark advances, so the same window never blocks
//         twice and the transcript is never re-read from zero.
{
  const { dir, tpath } = fixture([user(0, "haz esto"), assistant(1, [text("no declaration at all")])]);
  const r1 = runHook(CLOSE, dir, { transcript_path: tpath });
  const after1 = idxOf(dir);
  const r2 = runHook(CLOSE, dir, { transcript_path: tpath });
  const after2 = idxOf(dir);
  if (r1.out.includes('"block"') && after1.watermark > 0 && r2.code === 0 && !r2.out.includes("block") && after2.watermark === after1.watermark)
    ok("window-judged-once");
  else bad("window-judged-once", `wm1=${after1 && after1.watermark} r2=${r2.out.slice(0, 120)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 11. a raised-and-unanswered failure survives on the index and reaches the ledger
{
  const { dir } = fixture([], { version: 1, watermark: 0, byId: {}, unresolved: [{ at: iso(0), id: "I1", reason: "no DECLARO in this window" }] });
  const r = runHook(OPEN, dir, { hook_event_name: "UserPromptSubmit" });
  if (r.code === 0 && r.out.includes("RAISED AND UNANSWERED") && r.out.includes("I1")) ok("unanswered-reaches-ledger");
  else bad("unanswered-reaches-ledger", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 12. a window with no assistant text at all is not judged: Stop can fire before the turn's own
//         final message reaches the transcript, and a trailing system record opens such a window.
{
  const { dir, tpath } = fixture([
    user(0, "primera"),
    assistant(1, [text("DECLARO · categoría=diagnóstico · id=w12 · objetivo: a"), text("CIERRO · id=w12 · VERIFIED · checks: · a")]),
    user(2, "segunda, cuyo turno aun no ha escrito nada"),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes("block")) ok("empty-window-not-judged");
  else bad("empty-window-not-judged", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 13. a diagnosis alongside an execution in the SAME window is not contradicted by that window's
//         writes: the write belongs to the execution. Only an all-non-writing window is flagged.
{
  const { dir, tpath } = fixture([
    user(0, "haz esto y de paso dime por que falla"),
    assistant(1, [
      text("DECLARO · categoría=ejecución · id=mix-exec · objetivo: build it"),
      bash("gh project item-create 2"),
      write("scripts/thing.mjs"),
      text("DECLARO · categoría=diagnóstico · id=mix-diag · objetivo: why it failed"),
      text("CIERRO · id=mix-exec · VERIFIED · checks: · built"),
      text("CIERRO · id=mix-diag · VERIFIED · checks: · because of X"),
    ]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes("block")) ok("diagnosis-beside-execution");
  else bad("diagnosis-beside-execution", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 14. a two-word claim matches for ANY command, not only gh: `git ls-files`, `npm test`.
{
  const { dir, tpath } = fixture([
    user(0, "comprueba"),
    assistant(1, [
      text("DECLARO · categoría=diagnóstico · id=two-word · objetivo: check it"),
      bash("git ls-files objectives | head"),
      bash("npm test --prefix packages/shared"),
      text("CIERRO · id=two-word · VERIFIED · checks: git ls-files, npm test · checked"),
    ]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes("block")) ok("two-word-command-claim");
  else bad("two-word-command-claim", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 15. a command after a leading `cd`, or after a pipe, is still a command: reading only the first
//         word of the whole block made every later command invisible and every claim naming one DISPUTED.
{
  const { dir, tpath } = fixture([
    user(0, "comprueba"),
    assistant(1, [
      text("DECLARO · categoría=diagnostico · id=segments · objetivo: check it"),
      bash("cd /e/Proyect/arena" + String.fromCharCode(10) + "npx --no-install playwright-cli --version | head -1"),
      bash("cd /e/Proyect/arena && bash .grimorio/scripts/selftest/run-all.sh"),
      text("CIERRO · id=segments · VERIFIED · checks: npx, head, run-all.sh · checked"),
    ]),
  ]);
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes("block")) ok("commands-after-cd-and-pipe");
  else bad("commands-after-cd-and-pipe", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 16. a CIERRO written in the turn Stop fires ON is not lost: the window carrying it has no
//         assistant text yet at that instant, so the watermark stops short and reads it once more.
{
  const openIdx = { version: 1, watermark: 0, byId: { "old-ask": { id: "old-ask", category: "ejecucion", windowsOpen: 4, boardWriteAt: iso(0), closedAt: null } } };
  const { dir, tpath } = fixture([
    user(0, "cierra aquello"),
    assistant(1, [text("DECLARO · categoría=diagnostico · id=w16 · objetivo: a"), text("CIERRO · id=w16 · VERIFIED · checks: · a")]),
    user(2, "otra cosa"),
  ], openIdx);
  runHook(CLOSE, dir, { transcript_path: tpath });
  const after1 = idxOf(dir);
  // the turn finishes: its own final text lands in the transcript
  writeFileSync(tpath, readFileSync(tpath, "utf8") + assistant(3, [text("DECLARO · categoría=diagnostico · id=w16b · objetivo: b"), text("CIERRO · id=old-ask · VERIFIED · checks: · done at last")]) + String.fromCharCode(10), "utf8");
  runHook(CLOSE, dir, { transcript_path: tpath });
  const after2 = idxOf(dir);
  if (after1.watermark === 0 && after2.byId["old-ask"] && after2.byId["old-ask"].closedAt) ok("close-in-the-firing-turn-survives");
  else bad("close-in-the-firing-turn-survives", `wm1=${after1.watermark} closed=${after2.byId["old-ask"] && after2.byId["old-ask"].closedAt}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 17. config-driven-tokens: an installation with arbitrary, non-English, non-Spanish tokens is
//         still accepted -- proof the parser reads .claude/grimorio-config.json at runtime rather than
//         any hardcoded vocabulary. A THIRD, distinct throwaway root: no local override, so the tokens
//         below are the ONLY vocabulary that root's own config carries.
{
  const { dir, tpath } = fixture(
    [
      user(0, "try something new"),
      assistant(1, [
        text("MARK · kind=wish · id=demo9 · aim: try it"),
        bash("gh project item-create 2 --owner selftest-owner"),
        text("STAMP · id=demo9 · VERIFIED · checks: · done"),
      ]),
    ],
    undefined,
    {
      committed: {
        language: "xx",
        tokens: {
          declare: "MARK",
          close: "STAMP",
          pending: "HOLD",
          categoryField: "kind",
          objectiveField: "aim",
          categories: { request: "wish", execution: "deed", evaluation: "verdict", idea: "spark", diagnosis: "probe" },
        },
        writeGuard: { enabled: false },
      },
      local: null,
    },
  );
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes('"block"')) ok("config-driven-tokens");
  else bad("config-driven-tokens", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 18. nothing-verdict-raises-i7: an evaluation closed NOTHING (fixed protocol word, like VERIFIED) with
//         no board write in its window must raise I7 -- the invariant had no probe before this fixture,
//         and a hardcoded Spanish verdict word survived unnoticed behind it.
{
  const { dir, tpath } = fixture(
    [
      user(0, "is this worth anything"),
      assistant(1, [
        text("MARK · kind=verdict · id=demo10 · aim: weigh it"),
        bash("gh project item-create 2 --owner selftest-owner"),
      ]),
      user(2, "and?"),
      assistant(3, [
        text("MARK · kind=probe · id=demo11 · aim: look again"),
        text("STAMP · id=demo10 · NOTHING · checks: · it came to nothing"),
      ]),
    ],
    undefined,
    {
      committed: {
        language: "xx",
        tokens: {
          declare: "MARK",
          close: "STAMP",
          pending: "HOLD",
          categoryField: "kind",
          objectiveField: "aim",
          categories: { request: "wish", execution: "deed", evaluation: "verdict", idea: "spark", diagnosis: "probe" },
        },
        writeGuard: { enabled: false },
      },
      local: null,
    },
  );
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.out.includes("I7")) ok("nothing-verdict-raises-i7");
  else bad("nothing-verdict-raises-i7", `expected I7, out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

// ---- 19. accent-folding-is-symmetric: a config token spelled WITH an accent must also match the reader's
//         unaccented spelling. The fold map keys every variant, base and accented, so "categoría" in the
//         config accepts "categoria" in the turn -- which is what the principal actually types.
{
  const { dir, tpath } = fixture(
    [
      user(0, "algo"),
      assistant(1, [
        text("DECLARO · categoria=peticion · id=demo12 · objetivo: probar"),
        bash("gh project item-create 2 --owner selftest-owner"),
        text("CIERRO · id=demo12 · VERIFIED · checks: gh project item-create · hecho"),
      ]),
    ],
    undefined,
    {
      committed: {
        language: "es",
        tokens: {
          declare: "DECLARO",
          close: "CIERRO",
          pending: "PENDIENTE",
          categoryField: "categoría",
          objectiveField: "objetivo",
          categories: { request: "peticion", execution: "ejecucion", evaluation: "evaluacion", idea: "idea", diagnosis: "diagnostico" },
        },
        writeGuard: { enabled: false },
      },
      local: null,
    },
  );
  const r = runHook(CLOSE, dir, { transcript_path: tpath });
  if (r.code === 0 && !r.out.includes("I1")) ok("accent-folding-is-symmetric");
  else bad("accent-folding-is-symmetric", `out=${r.out.slice(0, 200)}`);
  rmSync(dir, { recursive: true, force: true });
}

console.log(`\nSELFTEST: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
