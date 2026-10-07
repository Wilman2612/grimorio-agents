// Updates ONE existing board item: state/blocker/subtask changes. A DraftIssue landing in "progress"
// is converted to a real issue and its checklist promoted to real sub-issues -- state-driven, the
// caller never decides it. Design: ref:repo/.grimorio/skills/grimorio.board/plan/subtask-lifecycle.md.

// Usage: node board-update.mjs --ask-id <slug> --actor <agentType>/<agentId>
//                               [--state queued|progress|blocked|done] [--blocker "<text>"]
//                               [--subtask "<text>" ...]
// Prints "Success: <itemId>" on exit 0. Any failure throws with a stable [CODE] and exit 1.
import {
  BoardError, appendSubtasksToBody, editText, gh, ghGraphQL, loadConfig, loadIndex,
  parseSubtaskLines, requireSpawnedActor, resolveFields, resolveRepoId, setState,
} from "./board-lib.mjs";

const STATES = ["queued", "progress", "blocked", "done", "discarded"];

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
  if (!out["ask-id"] || !out["ask-id"].trim()) throw new BoardError("BAD_ARGS", "--ask-id is required and non-empty");
  if (out.state && !STATES.includes(out.state)) throw new BoardError("BAD_STATE", `--state must be one of ${STATES.join("|")}`);
  if (!out.state && !out.blocker && !out.subtasks.length) {
    throw new BoardError("NOTHING_TO_DO", "at least one of --state/--blocker/--subtask is required");
  }
  return out;
}

function findItem(cfg, askId) {
  const item = loadIndex(cfg).find((i) => i.askId === askId);
  if (!item) throw new BoardError("ASK_ID_NOT_FOUND", `"${askId}" is not on the board`);
  return item;
}

// gh's own subcommands have no verb for these four -- they only exist as raw GraphQL calls.
const CONTENT_QUERY = "query($id:ID!){ node(id:$id){ ... on ProjectV2Item { content { __typename ... on DraftIssue { id title body } ... on Issue { id body } } } } }";
const CONVERT_MUTATION = "mutation($itemId:ID!,$repositoryId:ID!){ convertProjectV2DraftIssueItemToIssue(input:{itemId:$itemId,repositoryId:$repositoryId}){ item { id content { ... on Issue { id } } } } }";
const CREATE_ISSUE_MUTATION = "mutation($repositoryId:ID!,$title:String!){ createIssue(input:{repositoryId:$repositoryId,title:$title}){ issue { id } } }";
const ADD_SUB_ISSUE_MUTATION = "mutation($issueId:ID!,$subIssueId:ID!){ addSubIssue(input:{issueId:$issueId,subIssueId:$subIssueId}){ issue { id } } }";

function readContent(itemId) {
  const data = ghGraphQL(CONTENT_QUERY, { id: itemId });
  const content = data && data.node && data.node.content;
  if (!content) throw new BoardError("CONTENT_NOT_FOUND", `"${itemId}" has no readable content`);
  return content;
}

function createSubIssue(repositoryId, parentIssueId, title) {
  const created = ghGraphQL(CREATE_ISSUE_MUTATION, { repositoryId, title });
  const subIssueId = created && created.createIssue && created.createIssue.issue && created.createIssue.issue.id;
  if (!subIssueId) throw new BoardError("SUBISSUE_NO_ID", `createIssue returned no id for "${title}"`);
  ghGraphQL(ADD_SUB_ISSUE_MUTATION, { issueId: parentIssueId, subIssueId });
}

// A DraftIssue landing in "progress" converts to a real issue; its checklist lines become real
// sub-issues. Idempotent by construction -- content type IS the check, never a separate flag.
// Runs BEFORE setState so a conversion failure never leaves State claiming "progress" on a draft.
function convertIfStarting(cfg, itemId, requestedState) {
  if (requestedState !== "progress") return;
  const content = readContent(itemId);
  if (content.__typename !== "DraftIssue") return;
  const repositoryId = resolveRepoId(cfg);
  const converted = ghGraphQL(CONVERT_MUTATION, { itemId, repositoryId });
  const payload = converted && converted.convertProjectV2DraftIssueItemToIssue;
  const issueId = payload && payload.item && payload.item.content && payload.item.content.id;
  if (!issueId) throw new BoardError("CONVERT_NO_ID", "conversion returned no issue id");
  for (const title of parseSubtaskLines(content.body)) createSubIssue(repositoryId, issueId, title);
}

// A --subtask on an item that already started (a real Issue) becomes a real sub-issue immediately; on
// a still-draft item it stays plain text in the body, appended to whatever the body already carries.
function applySubtasks(cfg, itemId, subtasks) {
  const content = readContent(itemId);
  if (content.__typename === "DraftIssue") {
    const body = appendSubtasksToBody(content.body, subtasks);
    gh(["project", "item-edit", "--id", itemId, "--project-id", cfg.projectId, "--body", body]);
  } else {
    const repositoryId = resolveRepoId(cfg);
    for (const title of subtasks) createSubIssue(repositoryId, content.id, title);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  requireSpawnedActor(args.actor);
  const cfg = loadConfig();
  const item = findItem(cfg, args["ask-id"]);

  if (args.state) {
    convertIfStarting(cfg, item.id, args.state);
    setState(cfg, item.id, args.state);
  }
  if (args.subtasks.length) applySubtasks(cfg, item.id, args.subtasks);
  if (args.blocker) editText(cfg, item.id, resolveFields(cfg).Blocker.id, args.blocker);

  console.log(`Success: ${item.id}`);
}

try {
  main();
} catch (e) {
  console.error(e instanceof BoardError ? e.message : `Error [UNEXPECTED]: ${e.message}`);
  process.exit(1);
}
