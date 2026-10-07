// Creates ONE item on the live GitHub Project and sets its fields. No judgment: every value is handed in.
// Usage: node board-write.mjs --ask-id <slug> --title "<text>" --body "<text>" --state queued|progress|blocked|done
//                             --actor <agentType>/<agentId> [--blocker "<text>"] [--subtask "<text>" ...]
// A --subtask is rendered as a plain-text checklist line in the draft's own body -- board-update.mjs is
// what promotes those lines to real sub-issues once the item actually starts, per
// ref:repo/.grimorio/skills/grimorio.board/plan/subtask-lifecycle.md; this script never converts anything.
// Prints "Success: <itemId>" on exit 0. Any failure throws with a stable [CODE] and exit 1.
import { BoardError, appendSubtasksToBody, appendToIndex, editText, gh, ghGraphQL, loadConfig, loadIndex, requireSpawnedActor, setState } from "./board-lib.mjs";

const STATES = ["queued", "progress", "blocked", "done"];

function parseArgs(argv) {
  const out = { subtasks: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new BoardError("BAD_ARGS", `unexpected argument "${a}"`);
    const key = a.slice(2);
    const val = argv[i + 1];
    if (val === undefined || val.startsWith("--")) throw new BoardError("BAD_ARGS", `--${key} needs a value`);
    if (key === "subtask") out.subtasks.push(val);
    else out[key] = val;
    i++;
  }
  for (const k of ["ask-id", "title", "body", "state"]) {
    if (!out[k] || !out[k].trim()) throw new BoardError("BAD_ARGS", `--${k} is required and non-empty`);
  }
  if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(out["ask-id"])) {
    throw new BoardError("BAD_ASK_ID", `--ask-id must be kebab-case, got "${out["ask-id"]}"`);
  }
  if (!STATES.includes(out.state)) throw new BoardError("BAD_STATE", `--state must be one of ${STATES.join("|")}`);
  return out;
}

function createItem(cfg, args) {
  const body = appendSubtasksToBody(args.body, args.subtasks);
  const out = gh(["project", "item-create", String(cfg.projectNumber), "--owner", cfg.owner, "--title", args.title, "--body", body, "--format", "json"]);
  let id;
  try {
    id = JSON.parse(out).id;
  } catch (_) {
    id = null;
  }
  if (!id) throw new BoardError("CREATE_NO_ID", "item-create returned no item id");
  return id;
}

// Read back the ONE item just written -- one GraphQL node, never the whole list.
function verify(cfg, itemId, args) {
  const query = `query($id:ID!){ node(id:$id){ ... on ProjectV2Item { fieldValues(first:20){ nodes {
    ... on ProjectV2ItemFieldTextValue { text field { ... on ProjectV2Field { name } } }
    ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2SingleSelectField { name } } } } } } } }`;
  const data = ghGraphQL(query, { id: itemId });
  const nodes = data && data.node && data.node.fieldValues && data.node.fieldValues.nodes;
  if (!nodes) throw new BoardError("VERIFY_NO_JSON", "read-back returned no field values");
  const got = {};
  for (const n of nodes) {
    if (n && n.field && n.field.name) got[n.field.name] = n.text !== undefined ? n.text : n.name;
  }
  if (got.AskId !== args["ask-id"]) throw new BoardError("VERIFY_ASKID", `read-back AskId="${got.AskId}", wanted "${args["ask-id"]}"`);
  if (String(got.State || "").toLowerCase() !== args.state) throw new BoardError("VERIFY_STATE", `read-back State="${got.State}", wanted "${args.state}"`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  requireSpawnedActor(args.actor);
  const cfg = loadConfig();
  const dup = loadIndex(cfg).find((i) => i.askId === args["ask-id"]);
  if (dup) throw new BoardError("DUPLICATE_ASK_ID", `"${args["ask-id"]}" already exists as ${dup.id}`);

  const itemId = createItem(cfg, args);
  const fields = setState(cfg, itemId, args.state);
  editText(cfg, itemId, fields.AskId.id, args["ask-id"]);
  if (args.actor) editText(cfg, itemId, fields.Actor.id, args.actor);
  if (args.blocker) editText(cfg, itemId, fields.Blocker.id, args.blocker);
  verify(cfg, itemId, args);
  appendToIndex({ id: itemId, askId: args["ask-id"], title: args.title, state: args.state });
  console.log(`Success: ${itemId}`);
}

try {
  main();
} catch (e) {
  console.error(e instanceof BoardError ? e.message : `Error [UNEXPECTED]: ${e.message}`);
  process.exit(1);
}
