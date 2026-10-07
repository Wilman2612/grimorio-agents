// Builds ONE real-shaped row for .grimorio/.cache/agent-invocations.log, per the authoritative field
// order in ref:repo/.claude/hooks/log-agent-invocation.cjs (lines ~58-77). Every selftest fixture
// builds its log rows through THIS function, never hand-typed -- see the commit that added this.
const NA = "-";

export function invocationRow({
  timestamp = new Date().toISOString(),
  session = "sess",
  spawnedType,
  callerType = NA,
  phase = "post",
  callerId = NA,
  toolUseId = "tool",
  spawnedId,
  status = "completed",
} = {}) {
  if (!spawnedType || !spawnedId) throw new Error("invocationRow needs spawnedType and spawnedId");
  return [
    timestamp, session, spawnedType, NA, NA, "1", '"d"', "develop", "no", "",
    "-", callerType, phase, callerId, toolUseId, spawnedId, status,
  ].join("\t") + "\n";
}
