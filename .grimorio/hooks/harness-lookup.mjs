// @keep-comment PreToolUse hook logic — harness lookup (see .claude/skills/grimorio.code-harness).
// Before an Edit/Write/MultiEdit, walk upward from the target file collecting every `harness.md`
// and build the context to INJECT so the agent obeys the guardrail before editing.
//
// Contract: only ADDS context. NEVER blocks an edit and NEVER exits non-zero — any error here is
// swallowed by the dispatcher's own wrapper and the tool proceeds (degrading to the soft layer: the
// skill + agent reminders). Dedup per session so each harness injects ONCE per session ("read it
// before you start", not per-edit).
import fs from "fs";
import path from "path";
import os from "os";

export function run(input) {
  const ti = input.tool_input || {};
  const filePath = ti.file_path || ti.filePath;
  if (!filePath) return null;

  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

  let dir;
  try {
    dir = path.dirname(path.resolve(filePath));
  } catch (_) {
    return null;
  }

  // Walk upward collecting harness.md, nearest-first. Stop at the repo root (a folder with .git)
  // or the filesystem root; never climb above the project's parent.
  const found = [];
  const fsRoot = path.parse(dir).root;
  const ceiling = path.resolve(projectDir, "..");
  let cur = dir;
  for (let guard = 0; guard < 100; guard++) {
    const h = path.join(cur, "harness.md");
    try {
      if (fs.existsSync(h)) found.push(h);
    } catch (_) {}
    let isRepoRoot = false;
    try {
      isRepoRoot = fs.existsSync(path.join(cur, ".git"));
    } catch (_) {}
    const parent = path.dirname(cur);
    if (cur === fsRoot || parent === cur || isRepoRoot || cur === ceiling) break;
    cur = parent;
  }
  if (found.length === 0) return null;

  // Per-session dedup: inject each harness once per session.
  const sid = input.session_id ? String(input.session_id).replace(/[^a-zA-Z0-9_-]/g, "") : null;
  let already = [];
  let statePath = null;
  if (sid) {
    statePath = path.join(os.tmpdir(), `claude-harness-${sid}.json`);
    try {
      already = JSON.parse(fs.readFileSync(statePath, "utf8"));
    } catch (_) {
      already = [];
    }
  }
  const fresh = found.filter((f) => !already.includes(f));
  if (fresh.length === 0) return null;

  // Deepest (most specific) first — found is nearest->root, which is already deepest-first.
  const blocks = [];
  for (const f of fresh) {
    try {
      blocks.push(`----- ${f} -----\n${fs.readFileSync(f, "utf8")}`);
    } catch (_) {}
  }
  if (blocks.length === 0) return null;

  if (statePath) {
    try {
      fs.writeFileSync(statePath, JSON.stringify(already.concat(fresh)));
    } catch (_) {}
  }

  const context =
    `A harness.md code-guardrail governs the file you are about to modify (${filePath}). ` +
    `Read it and obey it before editing; if your change would break a GATE rule, STOP and ask the user first. ` +
    `(See the code-harness skill for how harness files work.)\n\n` +
    blocks.join("\n\n");

  return {
    hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: context },
  };
}
