// Records Agent dispatches without allowing logging failures to affect a dispatch.
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { cacheDir } from "../../.grimorio/scripts/refobl/cache-paths.mjs";

const NA = "-";

function quiet(fn, fallback) {
  try {
    const value = fn();
    return value === undefined || value === null || value === "" ? fallback : value;
  } catch (_) {
    return fallback;
  }
}

function gitBranch(root) {
  return quiet(
    () => execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim(),
    NA,
  );
}

function repeatCount(logPath, session, type, description) {
  const stem = description.toLowerCase().split(/\s+/).slice(0, 4).join(" ");
  return quiet(() => {
    const prior = fs.readFileSync(logPath, "utf8").split("\n").filter((line) => {
      const fields = line.split("\t");
      if (fields[1] !== session || fields[2] !== type || !fields[6]) return false;
      return quiet(() => JSON.parse(fields[6]), "").toLowerCase().split(/\s+/).slice(0, 4).join(" ") === stem;
    }).length;
    return prior ? `R${prior}` : NA;
  }, NA);
}

function isAsyncCleanerDispatch(input, type) {
  return input.hook_event_name === "PostToolUse" &&
    type === "grimorio.extract-cleaner" &&
    input.tool_response &&
    input.tool_response.status === "async_launched";
}

export function run(input) {
  if (input.tool_name !== "Agent") return null;

  const tool = input.tool_input || {};
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const directory = cacheDir(root);
  const logPath = path.join(directory, "agent-invocations.log");
  fs.mkdirSync(directory, { recursive: true });

  const session = String(input.session_id || "").slice(0, 8);
  const type = tool.subagent_type || "(default)";
  const prompt = String(tool.prompt || "");
  const description = String(tool.description || "");
  if (isAsyncCleanerDispatch(input, type)) return null;

  fs.appendFileSync(
    logPath,
    [
      new Date().toISOString(), session, type, tool.model || NA, tool.isolation || NA, prompt.length,
      JSON.stringify(description), gitBranch(root),
      quiet(() => fs.existsSync(path.join(root, "objectives", `${gitBranch(root)}.md`)) ? "yes" : "no", NA),
      "", repeatCount(logPath, session, type, description), input.agent_type || NA,
      input.hook_event_name === "PreToolUse" ? "pre" : "post", input.agent_id || NA, input.tool_use_id || NA,
      (input.tool_response && input.tool_response.agentId) || NA,
      (input.tool_response && input.tool_response.status) || NA,
    ].join("\t") + "\n",
    "utf8",
  );
  return null;
}
