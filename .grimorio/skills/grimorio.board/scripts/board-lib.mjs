// Shared plumbing for the board scripts: config, the gh runner, a cached board index, and live field ids.
// The cache is what keeps the GitHub GraphQL budget intact: one full item-list per TTL across every caller,
// and field/option ids resolved from the live project (never hardcoded) and refreshed when GitHub rejects one.
import { execFileSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { cachePath } from "../../../../scripts/refobl/cache-paths.mjs";

const root = process.env.CLAUDE_PROJECT_DIR || ".";

export class BoardError extends Error {
  constructor(code, detail) {
    super(`Error [${code}]: ${detail}`);
    this.code = code;
  }
}

// Session-scoped state (the invocations log, the board index cache) anchors to the MAIN checkout, not
// a worktree -- the hook that writes the invocations log only ever writes there. Tree-scoped state
// (board-config.json) stays root-relative. See the commit that added this for the full reasoning.
function gitRaw(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", cwd: root, stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch (e) {
    throw new BoardError("GIT_FAILED", `git ${args.join(" ")}: ${String(e.stderr || e.message || "").trim()}`);
  }
}
export const MAIN_CHECKOUT = path.dirname(path.resolve(root, gitRaw(["rev-parse", "--git-common-dir"])));

export const CONFIG_PATH = path.join(root, ".claude/board-config.json");
export const CACHE_PATH = cachePath("board-index.json", MAIN_CHECKOUT);
const INDEX_TTL_MS = Number(process.env.BOARD_INDEX_TTL_MS || 10 * 60 * 1000);

export function loadConfig() {
  // @keep-comment The board's installation values are the ADOPTER's, so they live with the adopter's own
  // content under .claude/ -- never inside a grimorio memory store, where they sat until 2026-10-05.
  // Folding them into grimorio-config.json would be better still, one declaration instead of two, but its
  // reader is a WHITELIST inside a hook and a hook is the CEO's to change.
  const c = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  for (const k of ["owner", "projectNumber", "projectId"]) {
    if (!c[k]) throw new BoardError("CONFIG_INCOMPLETE", `${CONFIG_PATH} has no "${k}"`);
  }
  return c;
}

export function gh(args) {
  // GH_STUB names a node script that impersonates gh -- the selftests' only way to run without the network.
  const stub = process.env.GH_STUB;
  const bin = stub ? process.execPath : "gh";
  const argv = stub ? [stub, ...args] : args;
  try {
    return execFileSync(bin, argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    const msg = String(e.stderr || e.message || "");
    if (/rate limit/i.test(msg)) throw new BoardError("RATE_LIMITED", msg.trim());
    throw new BoardError("GH_FAILED", `${args.slice(0, 3).join(" ")}: ${msg.trim()}`);
  }
}

function ghJson(args) {
  const out = gh(args);
  try {
    return JSON.parse(out);
  } catch (_) {
    throw new BoardError("GH_NOT_JSON", `${args.slice(0, 3).join(" ")} returned no JSON`);
  }
}

function readCache() {
  if (!existsSync(CACHE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch (_) {
    return null;
  }
}

function writeCache(cache) {
  mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
}

// Field and single-select option ids, resolved from the live project. Option ids change whenever the field
// is rewritten, so they are never trusted from config -- only from this resolution, refreshed on rejection.
export function resolveFields(cfg, { force = false } = {}) {
  const cache = readCache() || {};
  if (!force && cache.fields) return cache.fields;
  const list = ghJson(["project", "field-list", String(cfg.projectNumber), "--owner", cfg.owner, "--format", "json"]);
  const byName = {};
  for (const f of list.fields || []) {
    const entry = { id: f.id };
    if (Array.isArray(f.options)) {
      entry.options = {};
      for (const o of f.options) entry.options[o.name.toLowerCase()] = o.id;
    }
    byName[f.name] = entry;
  }
  for (const need of ["State", "AskId", "Actor", "Blocker"]) {
    if (!byName[need]) throw new BoardError("FIELD_MISSING", `project has no "${need}" field`);
  }
  writeCache({ ...cache, fields: byName, fieldsFetchedAt: Date.now() });
  return byName;
}

export function editText(cfg, itemId, fieldId, text) {
  gh(["project", "item-edit", "--id", itemId, "--project-id", cfg.projectId, "--field-id", fieldId, "--text", text]);
}

export function editSelect(cfg, itemId, fieldId, optionId) {
  gh(["project", "item-edit", "--id", itemId, "--project-id", cfg.projectId, "--field-id", fieldId, "--single-select-option-id", optionId]);
}

// A stale option id is the one failure GitHub reports only at write time; refresh the ids once and retry.
export function setState(cfg, itemId, state) {
  let fields = resolveFields(cfg);
  try {
    editSelect(cfg, itemId, fields.State.id, fields.State.options[state]);
  } catch (e) {
    if (!/does not belong to the field/i.test(String(e.message))) throw e;
    fields = resolveFields(cfg, { force: true });
    editSelect(cfg, itemId, fields.State.id, fields.State.options[state]);
  }
  return fields;
}

// The compact index a model reasons against: id, askId, title, state -- never bodies, never 500 full items.
export function loadIndex(cfg, { force = false } = {}) {
  const cache = readCache() || {};
  const fresh = cache.items && Date.now() - (cache.itemsFetchedAt || 0) < INDEX_TTL_MS;
  if (!force && fresh) return cache.items;
  const list = ghJson(["project", "item-list", String(cfg.projectNumber), "--owner", cfg.owner, "--format", "json", "--limit", "500"]);
  const items = (list.items || []).map((i) => ({
    id: i.id,
    askId: i.askId || null,
    title: i.title || "",
    state: i.state || null,
  }));
  writeCache({ ...cache, items, itemsFetchedAt: Date.now() });
  return items;
}

export function appendToIndex(item) {
  const cache = readCache() || {};
  cache.items = [...(cache.items || []), item];
  writeCache(cache);
}

// A raw GraphQL call, for the mutations `gh project`/`gh issue` have no dedicated subcommand for
// (convert/addSubIssue/createIssue/repository-id lookup) and for a hand-built query (board-write.mjs's
// own read-back). Reuses ghJson's own parse/error handling rather than a second copy of it.
export function ghGraphQL(query, vars = {}) {
  const args = ["api", "graphql", "-f", `query=${query}`];
  for (const [k, v] of Object.entries(vars)) args.push("-F", `${k}=${v}`);
  return ghJson(args).data;
}

// The repo id a draft->issue conversion needs, resolved live from board-config.json's own "owner" +
// "repo" (name only) -- never hardcoded, per the same never-trust-a-literal-id discipline
// resolveFields() above already applies to Project field/option ids.
export function resolveRepoId(cfg, { force = false } = {}) {
  if (!cfg.repo) throw new BoardError("CONFIG_INCOMPLETE", `${CONFIG_PATH} has no "repo"`);
  const cache = readCache() || {};
  if (!force && cache.repoId) return cache.repoId;
  const data = ghGraphQL("query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id } }", {
    owner: cfg.owner,
    name: cfg.repo,
  });
  const id = data && data.repository && data.repository.id;
  if (!id) throw new BoardError("REPO_NOT_FOUND", `no repository "${cfg.owner}/${cfg.repo}"`);
  writeCache({ ...cache, repoId: id });
  return id;
}

// The fixed checklist shape a draft's body carries its subtasks in, per
// ref:repo/.grimorio/skills/grimorio.board/plan/subtask-lifecycle.md -- text while the item is
// still a draft, real tracked sub-issues once it starts. Shared by board-write.mjs (initial render) and
// board-update.mjs (append + promotion-parse), so the shape can only ever be defined once.
export const SUBTASKS_HEADING = "## Subtasks";

export function renderSubtasksBlock(subtasks) {
  return [SUBTASKS_HEADING, ...subtasks.map((t) => `- [ ] ${t}`)].join("\n");
}

export function appendSubtasksToBody(body, subtasks) {
  if (!subtasks.length) return body;
  if (body.includes(SUBTASKS_HEADING)) return [body, ...subtasks.map((t) => `- [ ] ${t}`)].join("\n");
  const block = renderSubtasksBlock(subtasks);
  return body ? `${body}\n\n${block}` : block;
}

export function parseSubtaskLines(body) {
  const out = [];
  for (const line of String(body || "").split(/\r?\n/)) {
    const m = /^-\s*\[ \]\s*(.+)$/.exec(line.trim());
    if (m) out.push(m[1].trim());
  }
  return out;
}

// A create/update must PROVE it comes from a spawned agent: --actor is required and its id must appear
// in the invocations log against that same type, at the SPAWNED agent's own column. Why, and what this
// still cannot stop: ref:repo/.grimorio/agents/grimorio.board-feeder/behavior.md
const INVOCATIONS_LOG = cachePath("agent-invocations.log", MAIN_CHECKOUT);
const TYPE_COL = 2;
// Column 15 (tool_response.agentId) is the SPAWNED agent's own id -- the only one a real spawn
// record proves. Column 13 (input.agent_id) is the CALLER's own id and can never match it; pairing
// TYPE_COL with column 13 let every write through unguarded until this fix. Authority:
// ref:repo/.claude/hooks/log-agent-invocation.cjs.
const AGENT_ID_COL = 15;
// The hook writes "-" into several optional columns, so a whole-line membership test accepts "-" as an id.
const NA = "-";

export function spawnedAgentExists(type, id) {
  if (!id || id === NA) return false;
  let text;
  try {
    text = readFileSync(INVOCATIONS_LOG, "utf8");
  } catch (_) {
    return false;
  }
  for (const line of text.split(/\r?\n/)) {
    const cols = line.split("\t");
    if (cols[TYPE_COL] === type && cols[AGENT_ID_COL] === id) return true;
  }
  return false;
}

export function requireSpawnedActor(actor) {
  if (!actor) {
    throw new BoardError("ACTOR_REQUIRED", "--actor <agentType>/<agentId> is required: a write must name the spawned agent making it");
  }
  const [type, id] = String(actor).split("/");
  if (!type || !id) {
    throw new BoardError("ACTOR_MALFORMED", `--actor must be "<agentType>/<agentId>", got "${actor}"`);
  }
  // The main loop's own fixed identity: "main/-" cannot be forged (it is never a spawn record, so it
  // structurally cannot appear in the invocations log) and needs no log lookup. CEO ruling 2026-09-22:
  // lift the restriction so the main loop can call the board scripts directly for its own duty -- never
  // a license to resume hand-writing items from memory over another agent's entries.
  if (type === "main" && id === "-") return;
  if (!spawnedAgentExists(type, id)) {
    throw new BoardError(
      "ACTOR_NOT_A_SPAWNED_AGENT",
      `no spawn of "${type}" with id "${id}" is on record -- a board item is created by a spawned agent reading a cleaned extract, never by the main loop from memory`,
    );
  }
}
