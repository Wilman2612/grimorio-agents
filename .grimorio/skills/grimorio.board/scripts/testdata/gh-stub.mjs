// Impersonates `gh` for the board selftests. State lives in the file GH_STUB_STATE names; every call is
// appended to GH_STUB_LOG so a test can count reads and writes. STUB_STALE_OPTIONS=1 makes the first
// field-list hand out option ids GitHub will reject, and the second hand out the real ones.
import { existsSync, readFileSync, writeFileSync, appendFileSync } from "fs";

const statePath = process.env.GH_STUB_STATE;
const logPath = process.env.GH_STUB_LOG;
const args = process.argv.slice(2);
if (logPath) appendFileSync(logPath, args.join(" ") + "\n");

const state = existsSync(statePath)
  ? JSON.parse(readFileSync(statePath, "utf8"))
  : { fieldLists: 0, items: [], values: {}, issues: [] };
const save = () => writeFileSync(statePath, JSON.stringify(state));

const FIELDS = {
  State: "PVTSSF_state",
  AskId: "PVTF_askid",
  Actor: "PVTF_actor",
  Blocker: "PVTF_blocker",
};
const REAL = { queued: "opt_q", progress: "opt_p", blocked: "opt_b", done: "opt_d" };
const STALE = { queued: "stale_q", progress: "stale_p", blocked: "stale_b", done: "stale_d" };

function fail(msg) {
  process.stderr.write(msg + "\n");
  process.exit(1);
}

// Every `-F name=value` on the call, keyed by name -- a GraphQL call may carry more than one variable
// (itemId+repositoryId, issueId+subIssueId, ...), unlike the single `id=` the field-values query used.
function collectF(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-F") {
      const eq = argv[i + 1].indexOf("=");
      out[argv[i + 1].slice(0, eq)] = argv[i + 1].slice(eq + 1);
    }
  }
  return out;
}

const [group, cmd] = args;

if (group === "project" && cmd === "field-list") {
  state.fieldLists++;
  save();
  const opts = process.env.STUB_STALE_OPTIONS === "1" && state.fieldLists === 1 ? STALE : REAL;
  const options = (o) => Object.entries(o).map(([name, id]) => ({ name: name[0].toUpperCase() + name.slice(1), id }));
  console.log(JSON.stringify({ fields: [
    { id: FIELDS.State, name: "State", options: options(opts) },
    { id: FIELDS.AskId, name: "AskId" },
    { id: FIELDS.Actor, name: "Actor" },
    { id: FIELDS.Blocker, name: "Blocker" },
  ] }));
} else if (group === "project" && cmd === "item-list") {
  console.log(JSON.stringify({ items: state.items }));
} else if (group === "project" && cmd === "item-create") {
  if (process.env.STUB_RATE_LIMIT === "1") fail("GraphQL: API rate limit exceeded for user ID 1.");
  const title = args[args.indexOf("--title") + 1];
  const body = args[args.indexOf("--body") + 1];
  const n = state.items.length + 1;
  const id = `PVTI_${n}`;
  // `gh project item-create` always creates a DraftIssue -- there is no `--issue` flag on this stub's
  // own surface, matching every real item this board has ever written (139 of them, 0 real issues).
  state.items.push({ id, title, body, askId: null, state: null, type: "DraftIssue", contentId: `DI_${n}` });
  state.values[id] = {};
  save();
  console.log(JSON.stringify({ id, title }));
} else if (group === "project" && cmd === "item-edit") {
  const id = args[args.indexOf("--id") + 1];
  const item = state.items.find((i) => i.id === id);
  if (!item) fail("GraphQL: Could not resolve to a node");
  if (args.includes("--body")) {
    item.body = args[args.indexOf("--body") + 1];
  } else if (args.includes("--single-select-option-id")) {
    const opt = args[args.indexOf("--single-select-option-id") + 1];
    const name = Object.keys(REAL).find((k) => REAL[k] === opt);
    if (!name) fail("GraphQL: The single select option Id does not belong to the field (updateProjectV2ItemFieldValue)");
    item.state = name[0].toUpperCase() + name.slice(1);
    state.values[id].State = item.state;
  } else {
    const fieldId = args[args.indexOf("--field-id") + 1];
    const text = args[args.indexOf("--text") + 1];
    const fname = Object.keys(FIELDS).find((k) => FIELDS[k] === fieldId);
    state.values[id][fname] = text;
    if (fname === "AskId") item.askId = text;
  }
  save();
} else if (group === "api" && cmd === "graphql") {
  const query = (args[args.indexOf("-f") + 1] || "").replace(/^query=/, "");
  const vars = collectF(args);
  if (query.includes("repository(owner")) {
    console.log(JSON.stringify({ data: { repository: { id: `R_${vars.owner}_${vars.name}` } } }));
  } else if (query.includes("convertProjectV2DraftIssueItemToIssue")) {
    const item = state.items.find((i) => i.id === vars.itemId);
    if (!item) fail("GraphQL: Could not resolve to a node");
    if (item.type !== "DraftIssue") fail("GraphQL: item is not a draft issue");
    const issueId = `I_${state.issues.length + 1}`;
    state.issues.push({ id: issueId, title: item.title, body: item.body, subIssues: [] });
    item.type = "Issue";
    item.contentId = issueId;
    save();
    console.log(JSON.stringify({ data: { convertProjectV2DraftIssueItemToIssue: { item: { id: item.id, content: { id: issueId } } } } }));
  } else if (query.includes("createIssue(input")) {
    const issueId = `I_${state.issues.length + 1}`;
    state.issues.push({ id: issueId, title: vars.title, body: "", subIssues: [] });
    save();
    console.log(JSON.stringify({ data: { createIssue: { issue: { id: issueId } } } }));
  } else if (query.includes("addSubIssue(input")) {
    const parent = state.issues.find((i) => i.id === vars.issueId);
    if (!parent) fail("GraphQL: Could not resolve to a node");
    parent.subIssues.push(vars.subIssueId);
    save();
    console.log(JSON.stringify({ data: { addSubIssue: { issue: { id: parent.id } } } }));
  } else if (query.includes("__typename")) {
    const item = state.items.find((i) => i.id === vars.id);
    if (!item) fail("GraphQL: Could not resolve to a node");
    const content = item.type === "DraftIssue"
      ? { __typename: "DraftIssue", id: item.contentId, title: item.title, body: item.body }
      : { __typename: "Issue", id: item.contentId, body: item.body };
    console.log(JSON.stringify({ data: { node: { content } } }));
  } else {
    const id = vars.id;
    const vals = state.values[id] || {};
    const nodes = Object.entries(vals).map(([name, v]) =>
      name === "State" ? { name: v, field: { name } } : { text: v, field: { name } });
    console.log(JSON.stringify({ data: { node: { fieldValues: { nodes } } } }));
  }
} else {
  fail(`gh-stub: unhandled ${args.join(" ")}`);
}
