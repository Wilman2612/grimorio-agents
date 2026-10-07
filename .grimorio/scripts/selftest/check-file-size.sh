#!/usr/bin/env bash
# Proves check-file-size.mjs can both fail and pass, and that the declared exemption works.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
S=.grimorio/scripts/check-file-size.mjs
fail=0
ck(){ if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1 (got $3, want $2)"; fail=1; fi; }

node "$S" --limit=1000000 >/dev/null 2>&1; ck "a limit nothing exceeds exits 0" 0 $?
node "$S" --limit=1 >/dev/null 2>&1;       ck "a limit everything exceeds exits 1" 1 $?

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
git init -q "$T" && cd "$T" || exit 1
python - <<'PY'
import io
io.open('big.md','w',encoding='utf-8',newline='\n').write("line\n"*600)
io.open('exempt.md','w',encoding='utf-8',newline='\n').write("<!-- @size-exempt: a fixture that must be long -->\n"+"line\n"*600)
PY
git add -A >/dev/null 2>&1
node "$OLDPWD/$S" --limit=500 > out.txt 2>&1; rc=$?
ck "an over-limit file exits 1"       1 "$rc"
ck "the over-limit file is named"     1 "$(grep -c '^OVER .*big\.md' out.txt)"
ck "a declared exemption is exempt"   1 "$(grep -c '^exempt .*exempt\.md' out.txt)"
ck "the exemption is not counted OVER" 0 "$(grep -c '^OVER .*exempt\.md' out.txt)"

# REGRESSION GUARD (2026-09-17): the space-separated CLI form `--limit 500` (two argv tokens, not one
# `--limit=500` token) is the form used by both the CEO-decided pre-commit.sh wiring and any ordinary CLI
# caller. It once leaked its value token ("500") into `paths` (nothing in `paths` filtered out a bare
# non-flag token), turning the scan into `git ls-files 500` — a pathspec matching nothing — so the WHOLE
# gate silently scanned zero files and always exited 0, even with real over-limit files present. Proven
# here against the SAME big.md/exempt.md fixture the equals-form assertions above already use.
node "$OLDPWD/$S" --limit 500 > out-space.txt 2>&1; rc_space=$?
ck "space-separated --limit 500 form also exits 1 on a real over-limit file" 1 "$rc_space"
ck "space-separated form still names the over-limit file (not swallowed as a path arg)" 1 "$(grep -c '^OVER .*big\.md' out-space.txt)"

# REGRESSION GUARD — proves the git behavior .grimorio/scripts/pre-commit.sh's own staged-file scope relies on: a file
# renamed AND edited above git's similarity threshold is classified R (Renamed), invisible to the OLD
# --diff-filter=ACM scope pre-commit.sh used to compute the file list it hands this script. pre-commit.sh now
# uses --diff-filter=d (exclude only deletions) so a rename+edit introducing a real violation is caught.
echo "line" > rename-source.md
for i in $(seq 1 400); do echo "line $i" >> rename-source.md; done
git add rename-source.md >/dev/null 2>&1
git commit -q -m "baseline for rename regression" >/dev/null 2>&1
mv rename-source.md rename-target.md
for i in $(seq 1 200); do echo "extra $i" >> rename-target.md; done
git add -A >/dev/null 2>&1
ck "a rename+edit is invisible to --diff-filter=ACM (the gap the fix closes)" \
   0 "$(git diff --cached --name-only --diff-filter=ACM | grep -c rename-target.md)"
ck "the same rename+edit IS visible to --diff-filter=d (what pre-commit.sh now uses)" \
   1 "$(git diff --cached --name-only --diff-filter=d | grep -c rename-target.md)"
renamed_files=$(git diff --cached --name-only --diff-filter=d)
node "$OLDPWD/$S" --limit=500 $renamed_files > out-renamed.txt 2>&1; rc_renamed=$?
ck "check-file-size.mjs catches the renamed+edited over-limit file when scoped via --diff-filter=d" 1 "$rc_renamed"
ck "the renamed file is named in the output" 1 "$(grep -c '^OVER .*rename-target\.md' out-renamed.txt)"

cd "$OLDPWD" || exit 1
echo; [ "$fail" -eq 0 ] && echo "ALL PASS" || echo "SOME FAILED"
exit "$fail"
