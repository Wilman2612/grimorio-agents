import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

// never a level count: two levels up was the repo root from scripts/selftest/ and is .grimorio/ from
// .grimorio/scripts/selftest/. This defect wore THREE different spellings across the suites, and a sweep
// for each form in turn missed the other two -- the property is "the repo root", so ask the one thing
// that knows it.
const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const hook = path.join(root, ".codex/hooks/turn-close-format.mjs");
const openHook = path.join(root, ".codex/hooks/turn-open-format.mjs");
let failed = 0;

function check(name, input, expectedBlock) {
  const result = spawnSync(process.execPath, [hook], { input: JSON.stringify(input), encoding: "utf8" });
  let actual = null;
  try { actual = result.stdout ? JSON.parse(result.stdout) : null; } catch { actual = "invalid-json"; }
  const blocked = Boolean(actual && actual.decision === "block");
  if (result.status === 0 && blocked === expectedBlock) console.log(`PASS: ${name}`);
  else { console.log(`FAIL: ${name}`); failed++; }
}

check("missing CIERRO blocks", { hook_event_name: "Stop", last_assistant_message: "Finished." }, true);
check("valid CIERRO passes", { hook_event_name: "Stop", last_assistant_message: "CIERRO · id=board-port · VERIFIED · checks: node test · adapters committed" }, false);
check("malformed CIERRO blocks", { hook_event_name: "Stop", last_assistant_message: "CIERRO VERIFIED" }, true);
check("continued Stop fails open", { hook_event_name: "Stop", stop_hook_active: true, last_assistant_message: "Still malformed" }, false);
check("unknown fields cannot bypass format", { hook_event_name: "Stop", agent_id: "child-1", last_assistant_message: "Finished." }, true);

const open = spawnSync(process.execPath, [openHook], {
  input: JSON.stringify({ hook_event_name: "UserPromptSubmit", prompt: "test" }), encoding: "utf8",
});
try {
  const output = JSON.parse(open.stdout);
  const context = output.hookSpecificOutput?.additionalContext;
  if (open.status === 0 && output.hookSpecificOutput?.hookEventName === "UserPromptSubmit" && /^TURN LEDGER /.test(context)) {
    console.log("PASS: open hook forwards canonical ledger");
  } else {
    console.log("FAIL: open hook forwards canonical ledger");
    failed++;
  }
} catch {
  console.log("FAIL: open hook forwards canonical ledger");
  failed++;
}

process.exit(failed ? 1 : 0);
