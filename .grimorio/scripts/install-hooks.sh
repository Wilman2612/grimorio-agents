#!/usr/bin/env bash
# .git/hooks is not versioned, so the gate has to be installed per clone. grimorio's SessionStart hook runs this
# whenever a shim is missing (.grimorio/hooks/ensure-git-hooks.mjs), so a fresh or cloud clone is gated too.
#
# Uses --git-common-dir, not $root/.git: in a linked WORKTREE, .git is a FILE, so the old path wrote
# the hook to a place git never reads and every worktree ran ungated. Worktrees share the common
# hooks dir, so installing once covers all of them.
set -euo pipefail
hooks=$(git rev-parse --git-common-dir)/hooks
mkdir -p "$hooks"
# A SHIM, not a copy: the hook resolves the script from whichever worktree is committing, so editing
# .grimorio/scripts/pre-commit.sh takes effect immediately instead of leaving a stale copy behind the gate. It runs
# the script through bash because git does not keep the scripts' executable bit on every clone.
cat > "$hooks/pre-commit" <<'SHIM'
#!/usr/bin/env bash
exec bash "$(git rev-parse --show-toplevel)/.grimorio/scripts/pre-commit.sh" "$@"
SHIM
chmod +x "$hooks/pre-commit"
cat > "$hooks/pre-push" <<'SHIM'
#!/usr/bin/env bash
exec bash "$(git rev-parse --show-toplevel)/.grimorio/scripts/pre-push.sh" "$@"
SHIM
chmod +x "$hooks/pre-push"
echo "pre-commit gate installed at $hooks/pre-commit"
echo "  gates: build output · apps/web typecheck · prompt shape · work-product placement · phase chains walk"
echo "pre-push gate installed at $hooks/pre-push"
echo "  gates: instruction-system changes pushed to develop/master carry a code-review verdict"
echo "  gates: apps/web changes pushed to develop/master pass 'next build'"
