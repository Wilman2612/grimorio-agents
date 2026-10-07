// Selftest for board-update.mjs against the gh stub. Never touches the network.
import { execFileSync } from "child_process";
import { readFileSync, rmSync } from "fs";
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

const WRITE = ["board-write.mjs"];
const UPDATE = ["board-update.mjs"];
const ACTOR = "grimorio.board-feeder/spawned-1";
const stubState = (root) => JSON.parse(readFileSync(path.join(root, "stub-state.json"), "utf8"));

// Seeds one draft item, with two --subtask lines already in its body, and returns the root.
function seedDraft(askId = "demo-ask") {
  const root = makeRoot();
  run(...WRITE, ["--ask-id", askId, "--title", "Demo ask", "--body", "the verbatim text", "--state", "queued",
    "--actor", ACTOR, "--subtask", "first task", "--subtask", "second task"], root);
  return root;
}

// 1. a plain field update (no state/lifecycle involved) edits Blocker and leaves the item a draft
{
  const root = seedDraft();
  const r = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--blocker", "waiting on X"], root);
  const st = stubState(root);
  if (r.code === 0 && st.values.PVTI_1.Blocker === "waiting on X" && st.items[0].type === "DraftIssue") ok("update-plain-blocker-edit");
  else bad("update-plain-blocker-edit", `code=${r.code} ${r.err} type=${st.items[0].type}`);
  rmSync(root, { recursive: true, force: true });
}

// 2. --state progress on a draft converts it to a real issue and promotes every checklist line to its
//    own real, tracked sub-issue via addSubIssue -- the lifecycle branch this whole feature exists for.
{
  const root = seedDraft();
  const r = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--state", "progress"], root);
  const st = stubState(root);
  const item = st.items[0];
  if (r.code !== 0) { bad("update-progress-converts-and-creates-subissues", `code=${r.code} ${r.err}`); }
  else if (item.type !== "Issue") { bad("update-progress-converts-and-creates-subissues", `item.type=${item.type}`); }
  else if (item.state !== "Progress") { bad("update-progress-converts-and-creates-subissues", `item.state=${item.state}`); }
  else {
    const parent = st.issues.find((i) => i.id === item.contentId);
    const titles = (parent ? parent.subIssues : []).map((id) => st.issues.find((i) => i.id === id).title);
    if (parent && titles.length === 2 && titles.includes("first task") && titles.includes("second task")) {
      ok("update-progress-converts-and-creates-subissues");
    } else bad("update-progress-converts-and-creates-subissues", `subIssues=${JSON.stringify(titles)}`);
  }
  rmSync(root, { recursive: true, force: true });
}

// 3. a SECOND --state progress on an already-converted item does NOT re-convert or re-create sub-issues
{
  const root = seedDraft();
  run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--state", "progress"], root);
  const before = stubState(root);
  const issuesBefore = before.issues.length;
  const r = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--state", "progress"], root);
  const after = stubState(root);
  if (r.code === 0 && after.issues.length === issuesBefore && after.items[0].type === "Issue") {
    ok("update-second-progress-does-not-reconvert");
  } else bad("update-second-progress-does-not-reconvert", `code=${r.code} issuesBefore=${issuesBefore} issuesAfter=${after.issues.length}`);
  rmSync(root, { recursive: true, force: true });
}

// 4. --subtask on an item that already started (a real Issue) becomes a real sub-issue immediately,
//    never text -- the asymmetry the whole design exists to express.
{
  const root = seedDraft();
  run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--state", "progress"], root);
  const before = stubState(root);
  const parentId = before.items[0].contentId;
  const r = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--subtask", "third task"], root);
  const after = stubState(root);
  const parent = after.issues.find((i) => i.id === parentId);
  const titles = parent.subIssues.map((id) => after.issues.find((i) => i.id === id).title);
  if (r.code === 0 && titles.includes("third task")) ok("update-subtask-on-started-item-becomes-real-subissue");
  else bad("update-subtask-on-started-item-becomes-real-subissue", `code=${r.code} titles=${JSON.stringify(titles)}`);
  rmSync(root, { recursive: true, force: true });
}

// 5. --actor proof holds on update exactly as it does on create -- same guard, same code paths, no
//    separate, looser check for the update surface.
{
  const root = seedDraft();
  const noActor = run(...UPDATE, ["--ask-id", "demo-ask", "--blocker", "b"], root);
  if (noActor.code === 1 && /ACTOR_REQUIRED/.test(noActor.err)) ok("update-without-actor-refused");
  else bad("update-without-actor-refused", noActor.err);

  const unspawned = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", "grimorio.board-feeder/never-ran", "--blocker", "b"], root);
  if (unspawned.code === 1 && /ACTOR_NOT_A_SPAWNED_AGENT/.test(unspawned.err)) ok("update-with-unspawned-id-refused");
  else bad("update-with-unspawned-id-refused", unspawned.err);

  const callersId = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", "grimorio.board-feeder/caller-999", "--blocker", "b"], root);
  if (callersId.code === 1 && /ACTOR_NOT_A_SPAWNED_AGENT/.test(callersId.err)) ok("update-callers-own-id-refused");
  else bad("update-callers-own-id-refused", callersId.err);

  const real = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR, "--blocker", "b"], root);
  if (real.code === 0) ok("update-from-a-spawned-agent-passes");
  else bad("update-from-a-spawned-agent-passes", real.err);
  rmSync(root, { recursive: true, force: true });
}

// 6. an unknown --ask-id is refused, and calling with none of --state/--blocker/--subtask
//    is refused before any gh call -- a caller that names no change is very likely a mistake, not a no-op
{
  const root = seedDraft();
  const unknown = run(...UPDATE, ["--ask-id", "no-such-ask", "--actor", ACTOR, "--blocker", "b"], root);
  if (unknown.code === 1 && /ASK_ID_NOT_FOUND/.test(unknown.err)) ok("update-refuses-unknown-ask-id");
  else bad("update-refuses-unknown-ask-id", unknown.err);

  const nothing = run(...UPDATE, ["--ask-id", "demo-ask", "--actor", ACTOR], root);
  if (nothing.code === 1 && /NOTHING_TO_DO/.test(nothing.err)) ok("update-refuses-nothing-to-do");
  else bad("update-refuses-nothing-to-do", nothing.err);
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nSELFTEST: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
