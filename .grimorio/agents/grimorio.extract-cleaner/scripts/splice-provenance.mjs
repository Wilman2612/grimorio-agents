#!/usr/bin/env node

// @keep-comment splice-provenance.mjs — PROOF that a cleaned extract on disk was produced by
// `assemble-cleaned-extract.mjs splice`, and not typed out by an agent.
//
// THE GAP THIS CLOSES, stated as the invariant rather than as a story. `splice` guarantees byte-fidelity BY
// CONSTRUCTION: it copies every `user:` block out of the window file byte-for-byte and substitutes each
// `agent:` block with a pre-written abstract, so no text reaches the output through free-generation. That
// guarantee is a property of THE TOOL, never of the FILE — and every downstream reader (the H11 spawn gate's
// own file-based element, every brief written from the extract) reads the FILE. An extract an agent wrote by
// hand is indistinguishable from a spliced one on inspection, satisfies every structural check, and carries
// none of the guarantee. So the file has to be able to SAY who made it.
//
// THE MECHANISM: `splice` writes a sidecar next to its output holding a SHA-256 of the exact bytes it wrote.
// `verify-cleaned-extract.mjs` refuses when that sidecar is missing, unreadable, or no longer matches the
// bytes on disk — which also catches a spliced extract EDITED afterwards, not only a hand-written one.
//
// THE HONEST BOUND, stated so nobody reads this as tamper-proofing: a determined agent could compute the
// digest of its own hand-written file. This is not a cryptographic authenticity claim and cannot be one
// without a secret, which a repo-visible script has nowhere to keep. What it closes is the REAL failure —
// an extract produced the obvious way instead of the correct way, with nothing anywhere reporting it — by
// making the bypass a deliberate, visible act rather than an accident nobody notices.
// @keep-comment

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

/** The sidecar's path for a given extract path. One formula, used by the writer and the reader alike. */
export function provenancePathFor(outPath) {
  return `${outPath}.provenance.json`;
}

/** SHA-256 of a file's exact bytes — never of a decoded string, so a newline translation cannot pass. */
export function digestOfFile(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

/** Stamp the sidecar for an extract `splice` has just written. Called ONLY by the producer. */
export function writeProvenance(outPath, producer) {
  const record = {
    producedBy: producer,
    at: new Date().toISOString(),
    bytes: readFileSync(outPath).length,
    sha256: digestOfFile(outPath),
  };
  writeFileSync(provenancePathFor(outPath), `${JSON.stringify(record, null, 2)}\n`, "utf8");
  return record;
}

/**
 * @keep-comment
 * The verdict a gate acts on. Returns `{ ok: true, record }`, or `{ ok: false, code, detail }` with one of
 * four codes, each naming a DIFFERENT thing the reader must be told apart:
 *   NOT_SPLICED      — no sidecar at all: this extract was never produced by `splice`.
 *   UNREADABLE       — a sidecar exists but is not valid JSON, or carries no `sha256`.
 *   DIGEST_MISMATCH  — a sidecar exists and does not match the bytes on disk: the extract was edited after
 *                      it was spliced, which is the same loss of guarantee as never having been spliced.
 *   MISSING_EXTRACT  — the extract itself is gone.
 * NEVER collapse these into one message: "you hand-wrote this" and "you edited this afterwards" send a
 * reader to two different places.
 * @keep-comment
 */
export function checkProvenance(outPath) {
  if (!existsSync(outPath)) {
    return { ok: false, code: "MISSING_EXTRACT", detail: `${outPath} does not exist` };
  }
  const sidecar = provenancePathFor(outPath);
  if (!existsSync(sidecar)) {
    return {
      ok: false,
      code: "NOT_SPLICED",
      detail:
        `${outPath} carries no provenance sidecar (${sidecar}), so it was never produced by ` +
        "`assemble-cleaned-extract.mjs splice`. An extract written by hand loses splice's own byte-fidelity " +
        "guarantee entirely, and every reader downstream still treats it as if it had one. Re-run the real " +
        "finalize path instead of writing the extract yourself.",
    };
  }
  let record;
  try {
    record = JSON.parse(readFileSync(sidecar, "utf8"));
  } catch (err) {
    return { ok: false, code: "UNREADABLE", detail: `${sidecar} is not valid JSON: ${err.message}` };
  }
  if (typeof record.sha256 !== "string" || record.sha256 === "") {
    return { ok: false, code: "UNREADABLE", detail: `${sidecar} carries no sha256 field` };
  }
  const actual = digestOfFile(outPath);
  if (actual !== record.sha256) {
    return {
      ok: false,
      code: "DIGEST_MISMATCH",
      detail:
        `${outPath} no longer matches the digest ${sidecar} recorded for it (recorded ${record.sha256}, ` +
        `actual ${actual}) — the extract was modified after splice wrote it, which loses the same ` +
        "byte-fidelity guarantee as never having been spliced at all.",
    };
  }
  return { ok: true, record };
}
