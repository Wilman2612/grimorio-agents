#!/usr/bin/env bash
# C4 — THE CALLER PASSES NO SPEND LIMIT.
#
#   "Uno hace una llamada y listo... no es que OpenRouter me esté diciendo, no pasaste un parámetro."
#
# Sizing one call's worst case is the metering layer's job, never a consumer's: a limit that travels
# in the caller's arguments is a limit the caller can get wrong. This selftest reads the two surfaces
# a caller actually touches — the TypeScript input type and the HTTP request body — and refuses any
# limit-shaped field in either.
#
# It checks the fields a caller SUPPLIES, not the whole file: `callWithBudget.ts` legitimately names
# PLATFORM_MAX_TOKENS_PER_CALL and maxOutputTokens when it DERIVES the bound and stamps it on the
# provider request. That is the point of the module, not a violation of it. Only the declared caller
# surfaces are scanned.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

INPUT_TYPE="apps/web/src/application/metering/callWithBudget.ts"
# The wire surface is now a Zod schema — the SAME object the route parses with and the OpenAPI
# document is generated from. Checking it here means the guard, the validation and the published
# contract all read one definition, so a cap cannot appear in any of them without appearing in this.
WIRE_SCHEMA="apps/web/src/application/metering/contract.ts"

# Limit-shaped names. A field matching any of these is a spend ceiling the caller was asked for.
FORBIDDEN='cap|ceiling|limit|max[_A-Za-z]*[Tt]okens|maxTokens|tokenBudget|quota|allowance|maxCost|maxSpend|budgetMicroUsd|spendLimit'

fail=0
note() { printf '  %s\n' "$1"; }

# Extracts the body of a named `export interface X {` block, up to its closing brace at column 0.
extract_interface() {
  awk -v name="$2" '
    $0 ~ "^export interface " name " \\{" { inside = 1; next }
    inside && /^\}/ { exit }
    inside { print }
  ' "$1"
}

# Extracts the fields of the `.object({ ... })` a named Zod schema declares.
extract_zod_object() {
  awk -v name="$2" '
    $0 ~ "^export const " name " = z$" { armed = 1; next }
    armed && /\.object\(\{/ { inside = 1; armed = 0; next }
    inside && /^[[:space:]]*\}\)/ { exit }
    inside { print }
  ' "$1"
}

check_surface() {
  local label="$1" body="$2"
  if [ -z "$(printf '%s' "$body" | tr -d '[:space:]')" ]; then
    note "MISSING: could not read the $label surface — it was renamed or restructured."
    note "         A caller surface this selftest cannot see is a caller surface it cannot guard."
    fail=1
    return
  fi
  # Field names only: strip comments, then take the identifier before the colon.
  local fields
  fields=$(printf '%s\n' "$body" | sed 's://.*::' | grep -oE '^[[:space:]]*(readonly[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*\??:' | sed -E 's/[[:space:]]*(readonly[[:space:]]+)?//; s/[[:space:]]*\??:$//')
  local offenders
  offenders=$(printf '%s\n' "$fields" | grep -EI "$FORBIDDEN" || true)
  if [ -n "$offenders" ]; then
    note "FAIL: $label asks the caller for a spend limit:"
    printf '        %s\n' $offenders
    fail=1
  else
    note "ok: $label — fields: $(printf '%s' "$fields" | tr '\n' ' ')"
  fi
}

echo "C4 — no caller-passed cap"
check_surface "CallWithBudgetInput ($INPUT_TYPE)" "$(extract_interface "$INPUT_TYPE" CallWithBudgetInput)"
check_surface "MeteredCallRequestSchema ($WIRE_SCHEMA)" "$(extract_zod_object "$WIRE_SCHEMA" MeteredCallRequestSchema)"

# THE PROVIDER PORT, checked from the other end. The port legitimately carries `maxOutputTokens` — but
# it must arrive ON THE ADMISSION, minted by the layer that priced it, never as a parameter a caller
# supplies alongside it. So the assertion here is not "no limit word appears"; it is that `complete`
# takes an `AdmittedCall` and NOTHING else. A second parameter is how a cap would get back in.
PROVIDER_PORT="apps/web/src/infrastructure/metering/MeteredCompletionProvider.ts"
if grep -qE '^\s*complete\(admitted: AdmittedCall\): Promise<MeteredCompletionResult>;\s*$' "$PROVIDER_PORT"; then
  note "ok: provider port — complete() takes an AdmittedCall and nothing else"
else
  note "FAIL: $PROVIDER_PORT — complete() no longer takes exactly one AdmittedCall."
  note "      The output ceiling must travel ON the admission that priced it, never as a caller argument."
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo "REFUSED: a caller-facing signature carries a spend limit. The metering layer derives the bound."
  exit 1
fi
echo "PASS: the only thing a caller names is its budget."
