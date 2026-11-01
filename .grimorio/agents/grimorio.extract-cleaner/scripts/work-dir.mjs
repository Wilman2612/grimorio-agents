// The cleaner's folders, declared once: prepare, finalize and the cache sweep import them, so they can never
// default to different places again. The root itself is skill-roots.json's `workRoot`, read, never copied.
import path from "node:path";
import { readFileSync } from "node:fs";

const WORK_ROOT = JSON.parse(
  readFileSync(new URL("../../../../.grimorio/scripts/refobl/skill-roots.json", import.meta.url), "utf8"),
).workRoot;

/** Every session's folder sits under this root, relative to the project; nothing is ever written outside it. */
export const CLEANER_ROOT = WORK_ROOT + "extract-cleaner";

/** The folder one session's run reads and writes when no --work-dir is given. */
export function defaultWorkDir(sessionId) {
  return path.join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), CLEANER_ROOT, sessionId);
}
