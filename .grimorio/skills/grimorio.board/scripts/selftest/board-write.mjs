// Selftest for board-write.mjs and board-feeder-prepare.mjs against the gh stub. Never touches the network.
import { execFileSync } from "child_process";
import { readFileSync, rmSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { makeRoot } from "../testdata/board-selftest-root.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.resolve(here, "..");
const stub = path.resolve(here, "..", "testdata", "gh-stub.mjs");
let pass = 0;
let fail = 0;
const ok = (n) => { pass++; console.log(`  ok   ${n}`); };
const bad = (n, why) => { fail++; console.log(`  FAIL ${n}\n         ${why}`); };

function run(script, args, root, env = {}) {
  const e = {
    ...process.env,
    CLAUDE_PROJECT_DIR: root,
    GH_STUB: stub,
    GH_STUB_STATE: path.join(root, "stub-state.json"),
    GH_STUB_LOG: path.join(root, "stub-log.txt"),
    ...env,
  };
  try {
    const out = execFileSync(process.execPath, [path.join(scripts, script), ...args], { encoding: "utf8", env: e, stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out, err: "" };
  } catch (x) {
    return { code: x.status, out: String(x.stdout || ""), err: String(x.stderr || "") };
  }
}

const calls = (root) => (existsSync(path.join(root, "stub-log.txt")) ? readFileSync(path.join(root, "stub-log.txt"), "utf8").trim().split("\n") : []);
const WRITE = ["board-write.mjs"];
const good = ["--ask-id", "demo-ask", "--title", "Demo ask", "--body", "the verbatim text", "--state", "queued", "--actor", "grimorio.board-feeder/spawned-1"];

// 1. happy path: one item, its fields set, read back, Success printed
{
  const root = makeRoot();
  const r = run(...WRITE, good, root);
  if (r.code === 0 && /^Success: PVTI_1/m.test(r.out)) ok("write-happy-path");
  else bad("write-happy-path", r.err || r.out);
  const st = JSON.parse(readFileSync(path.join(root, "stub-state.json"), "utf8"));
  if (st.values.PVTI_1.AskId === "demo-ask" && st.values.PVTI_1.State === "Queued" && st.values.PVTI_1.Actor === "grimorio.board-feeder/spawned-1") ok("write-sets-every-field");
  else bad("write-sets-every-field", JSON.stringify(st.values));
  rmSync(root, { recursive: true, force: true });
}

// 2. API budget: one write costs exactly ONE item-list (the index), never a full re-list to verify
{
  const root = makeRoot();
  run(...WRITE, good, root);
  const lists = calls(root).filter((c) => c.startsWith("project item-list")).length;
  const reads = calls(root).filter((c) => c.startsWith("api graphql")).length;
  if (lists === 1 && reads === 1) ok("write-costs-one-list-one-node-read");
  else bad("write-costs-one-list-one-node-read", `item-list=${lists} graphql=${reads}`);
  rmSync(root, { recursive: true, force: true });
}

// 3. stale option ids are refreshed from the live project and the write retried, not failed
{
  const root = makeRoot();
  const r = run(...WRITE, good, root, { STUB_STALE_OPTIONS: "1" });
  const fieldLists = calls(root).filter((c) => c.startsWith("project field-list")).length;
  if (r.code === 0 && fieldLists === 2) ok("write-refreshes-stale-option-ids");
  else bad("write-refreshes-stale-option-ids", `code=${r.code} field-lists=${fieldLists} ${r.err}`);
  rmSync(root, { recursive: true, force: true });
}

// 4. a second write with the same askId is refused before any network write
{
  const root = makeRoot();
  run(...WRITE, good, root);
  const before = calls(root).length;
  const r = run(...WRITE, good, root);
  const creates = calls(root).slice(before).filter((c) => c.startsWith("project item-create")).length;
  if (r.code === 1 && /DUPLICATE_ASK_ID/.test(r.err) && creates === 0) ok("write-refuses-duplicate-ask-id");
  else bad("write-refuses-duplicate-ask-id", `code=${r.code} creates=${creates} ${r.err}`);
  rmSync(root, { recursive: true, force: true });
}

// 5. the index is cached: a second write inside the TTL issues no item-list at all
{
  const root = makeRoot();
  run(...WRITE, good, root);
  const before = calls(root).length;
  run(...WRITE, ["--ask-id", "second-ask", "--title", "Second", "--body", "b", "--state", "progress"], root);
  const lists = calls(root).slice(before).filter((c) => c.startsWith("project item-list")).length;
  if (lists === 0) ok("index-cached-within-ttl");
  else bad("index-cached-within-ttl", `item-list=${lists}`);
  rmSync(root, { recursive: true, force: true });
}

// 6. a rate-limit refusal surfaces as its own code, never as a generic failure
{
  const root = makeRoot();
  const r = run(...WRITE, good, root, { STUB_RATE_LIMIT: "1" });
  if (r.code === 1 && /RATE_LIMITED/.test(r.err)) ok("write-names-rate-limit");
  else bad("write-names-rate-limit", r.err);
  rmSync(root, { recursive: true, force: true });
}

// 7. bad input is refused before any gh call
{
  const root = makeRoot();
  const r = run(...WRITE, ["--ask-id", "Bad Id", "--title", "t", "--body", "b", "--state", "queued"], root);
  if (r.code === 1 && /BAD_ASK_ID/.test(r.err) && calls(root).length === 0) ok("write-refuses-bad-ask-id-offline");
  else bad("write-refuses-bad-ask-id-offline", `code=${r.code} calls=${calls(root).length} ${r.err}`);
  rmSync(root, { recursive: true, force: true });
}

// 8. a create must PROVE it comes from a spawned agent. The first version of this guard trusted a
//    self-reported --actor flag, so omitting it or inventing one sailed through -- the exact bypass the
//    guard existed to close, green in its own suite. Every path is probed here.
{
  const root = makeRoot();
  const base = ["--ask-id", "probe", "--title", "T", "--body", "B", "--state", "queued"];
  const noActor = run(...WRITE, base, root);
  if (noActor.code === 1 && /ACTOR_REQUIRED/.test(noActor.err) && calls(root).length === 0) ok("create-without-actor-refused");
  else bad("create-without-actor-refused", `code=${noActor.code} calls=${calls(root).length} ${noActor.err}`);

  const bare = run(...WRITE, [...base, "--actor", "the-orchestrator"], root);
  if (bare.code === 1 && /ACTOR_MALFORMED/.test(bare.err)) ok("create-with-bare-actor-refused");
  else bad("create-with-bare-actor-refused", bare.err);

  const unknown = run(...WRITE, [...base, "--actor", "grimorio.board-feeder/never-ran"], root);
  if (unknown.code === 1 && /ACTOR_NOT_A_SPAWNED_AGENT/.test(unknown.err)) ok("create-with-unspawned-id-refused");
  else bad("create-with-unspawned-id-refused", unknown.err);

  const real = run(...WRITE, [...base, "--actor", "grimorio.board-feeder/spawned-1"], root);
  if (real.code === 0) ok("create-from-a-spawned-agent-passes");
  else bad("create-from-a-spawned-agent-passes", real.err);

  // The log carries "-" as filler in several optional columns, so a whole-LINE membership test accepted
  // "-" -- and every other filler value -- as an agent id. The match is pinned to the identity column.
  for (const filler of ["-", "no", "pre", "tool"]) {
    const f = run(...WRITE, ["--ask-id", `filler-${filler === "-" ? "dash" : filler}`, "--title", "T", "--body", "B", "--state", "queued", "--actor", `grimorio.board-feeder/${filler}`], root);
    if (f.code === 1 && /ACTOR_NOT_A_SPAWNED_AGENT/.test(f.err)) ok(`filler-id-refused (${filler})`);
    else bad(`filler-id-refused (${filler})`, `code=${f.code} ${f.err}`);
  }
  const wrongType = run(...WRITE, ["--ask-id", "wrong-type", "--title", "T", "--body", "B", "--state", "queued", "--actor", "grimorio.scout/spawned-1"], root);
  if (wrongType.code === 1 && /ACTOR_NOT_A_SPAWNED_AGENT/.test(wrongType.err)) ok("real-id-under-wrong-type-refused");
  else bad("real-id-under-wrong-type-refused", wrongType.err);
  rmSync(root, { recursive: true, force: true });
}

// 8b. the CALLER's own id (the hook's column 13, input.agent_id) must never authorize a write -- only
//     the SPAWNED agent's own id (column 15, tool_response.agentId) may. A hand-typed fixture once put
//     the spawned id at column 13 and this exact bypass went undetected, live, for real writes.
{
  const root = makeRoot();
  const callersId = run(...WRITE, ["--ask-id", "callers-id", "--title", "T", "--body", "B", "--state", "queued", "--actor", "grimorio.board-feeder/caller-999"], root);
  if (callersId.code === 1 && /ACTOR_NOT_A_SPAWNED_AGENT/.test(callersId.err)) ok("callers-own-id-refused");
  else bad("callers-own-id-refused", callersId.err);
  rmSync(root, { recursive: true, force: true });
}

// 8c. --subtask renders as a plain-text checklist inside the draft's own body -- board-write.mjs never
//     converts anything; only board-update.mjs's own lifecycle branch promotes these lines later.
{
  const root = makeRoot();
  const r = run(...WRITE, [...good, "--subtask", "first task", "--subtask", "second task"], root);
  const st = JSON.parse(readFileSync(path.join(root, "stub-state.json"), "utf8"));
  const body = st.items[0].body;
  if (r.code === 0 && /## Subtasks/.test(body) && /- \[ \] first task/.test(body) && /- \[ \] second task/.test(body)) {
    ok("write-subtask-stays-text");
  } else bad("write-subtask-stays-text", `code=${r.code} body=${JSON.stringify(body)}`);
  rmSync(root, { recursive: true, force: true });
}

// 9. feeder-prepare: the bundle carries every user turn and only the non-Done items, and reads the board
//    FRESH -- a cached index makes the feeder duplicate whatever was written since, which it did twice live
{
  const root = makeRoot();
  run(...WRITE, good, root);
  run(...WRITE, ["--ask-id", "finished-ask", "--title", "Finished", "--body", "b", "--state", "done"], root);
  const extract = path.join(root, "cleaned.txt");
  writeFileSync(extract, "user: please do X\nagent: doing X\nuser: and also Y\nmore of Y\nagent: ok\n");
  const before = calls(root).length;
  const r = run("board-feeder-prepare.mjs", [extract], root);
  const m = /USER-TURNS=(\d+) OPEN-ITEMS=(\d+) BUNDLE=(\S+)/.exec(r.out);
  const lists = calls(root).slice(before).filter((c) => c.startsWith("project item-list")).length;
  if (m && m[1] === "2" && m[2] === "1" && lists === 1) {
    const b = readFileSync(m[3], "utf8");
    if (/\[user turn 2\]\nand also Y\nmore of Y/.test(b) && /demo-ask · Demo ask/.test(b) && !/finished-ask/.test(b)) ok("feeder-prepare-bundle");
    else bad("feeder-prepare-bundle", b.slice(0, 300));
  } else bad("feeder-prepare-bundle", `${r.out} ${r.err} lists=${lists}`);
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nSELFTEST: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
