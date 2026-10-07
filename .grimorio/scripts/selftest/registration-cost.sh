#!/usr/bin/env bash
set -uo pipefail
node "$(dirname "$0")/../registration-cost.mjs" --self-test
