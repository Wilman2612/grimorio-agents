#!/usr/bin/env bash
# .git/hooks is not versioned, so the gate has to be installed per clone. grimorio's SessionStart hook runs this
# whenever a shim is missing or stale (.grimorio/hooks/ensure-git-hooks.mjs), so a fresh or cloud clone is gated too.
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
left_alone=0
write_shim() {
  local name=$1 file="$hooks/$1"
  # A hook that never mentions grimorio is someone else's (a hook framework, a hand-written lint): never replace it.
  if [ -f "$file" ] && ! grep -qi grimorio "$file"; then
    echo "left alone: $file is not grimorio's hook; chain it or remove it to install grimorio's $name gate" >&2
    left_alone=1
    return
  fi
  cat > "$file" <<SHIM
#!/usr/bin/env bash
# grimorio gate shim v2: runs this checkout's own copy of the gate.
s="\$(git rev-parse --show-toplevel)/.grimorio/scripts/$name.sh"
[ -f "\$s" ] || { echo "grimorio $name gate: \$s is not in this checkout, so this $name is not gated" >&2; exit 0; }
exec bash "\$s" "\$@"
SHIM
  chmod +x "$file"
  echo "$name gate installed at $file"
}
write_shim pre-commit
echo "  gates: build output · apps/web typecheck · comment blocks · agent tiers · comment history · file size ·"
echo "         prompt shape · work-product placement · phase chains walk"
write_shim pre-push
echo "  gates: instruction-system changes pushed to develop/master carry a code-review verdict"
echo "  gates: apps/web changes pushed to develop/master pass 'next build'"
exit "$left_alone"
