#!/usr/bin/env bash
# .git/hooks is not versioned, so the gate has to be installed per clone. Run once after cloning.
#
# Uses --git-common-dir, not $root/.git: in a linked WORKTREE, .git is a FILE, so the old path wrote
# the hook to a place git never reads and every worktree ran ungated. Worktrees share the common
# hooks dir, so installing once covers all of them.
set -euo pipefail
hooks=$(git rev-parse --git-common-dir)/hooks
mkdir -p "$hooks"
# A SHIM, not a copy: the hook resolves the script from whichever worktree is committing, so editing
# scripts/pre-commit.sh takes effect immediately instead of leaving a stale copy behind the gate.
cat > "$hooks/pre-commit" <<'SHIM'
#!/usr/bin/env bash
exec "$(git rev-parse --show-toplevel)/scripts/pre-commit.sh" "$@"
SHIM
chmod +x "$hooks/pre-commit"
cat > "$hooks/pre-push" <<'SHIM'
#!/usr/bin/env bash
exec "$(git rev-parse --show-toplevel)/scripts/pre-push.sh" "$@"
SHIM
chmod +x "$hooks/pre-push"
echo "pre-commit gate installed at $hooks/pre-commit"
echo "  gates: build output · apps/web typecheck · branch has an objective · branch stays in scope"
echo "pre-push gate installed at $hooks/pre-push"
echo "  gates: instruction-system changes pushed to develop/master carry a code-review verdict"
