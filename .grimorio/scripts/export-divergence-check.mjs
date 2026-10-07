#!/usr/bin/env node
/* @keep-comment
 * export-divergence-check.mjs — EXPORT-CHAIN DIVERGENCE AUDITOR
 *
 * ANSWERS: Are exported-to-project files still in sync with their reference, or have edits
 * diverged without backporting?
 *
 * WHEN: After an export cycle to identify files that have drifted from the reference tree
 * and need human review or remediation.
 *
 * POPULATION: Files under named subdirectories (default: .claude, scripts) recursively,
 * excluding node_modules, .git, .cache. Each file is classified by comparison against the
 * reference tree: IDENTICAL, DIFFERS, MISSING-LOCALLY, or LOCAL-ONLY.
 *
 * NOTE: The per-file CLASS output for DIFFERS files is a HEURISTIC PROXY ONLY, never
 * authoritative. Classification signals (GENERIC_SUBSTITUTION, TRANSLATION) are pattern-
 * based heuristics that catch common change types but cannot replace human judgment on
 * actual semantic divergence. The NEEDS-REVIEW bucket exists because no heuristic is
 * universally reliable — treat the classification as informational direction for triage,
 * never as a proof of what a file actually is. This mirrors the portability honesty caveat
 * that .grimorio/scripts/audit-chain.mjs's own --portability flag states for its PROJECT_MARKERS scan.
 *
 * DESIGN RULE: MEASURE ONLY, WRITE NOTHING, KEEP NO STATE. This script is read-only —
 * it never writes a file, modifies input, or caches state. It compares and reports only.
 *
 * USAGE
 *   node .grimorio/scripts/export-divergence-check.mjs <localDir> <referenceDir> [--subdirs <csv>] [--json]
 *
 * Arguments:
 *   <localDir>      — required; path to the local tree being checked (absolute or relative to CWD)
 *   <referenceDir>  — required; path to the reference tree (absolute or relative to CWD)
 *   --subdirs <csv> — optional; comma-separated list of subdirectory names to walk under each root
 *                     (relative to each root). Default: ".claude,scripts"
 *   --json          — optional; output JSON instead of human-readable report
 *
 * EXIT CODE — load-bearing. Always exit 0 for a completed ordinary run, even if many
 * divergences are found (this is a REPORT tool, not a gate). Divergence existing is
 * informational, not a failure. Exit 2 for usage errors (missing args, non-existent
 * directories). Exit 1 for unexpected failures (missing diff binary, permissions errors,
 * malformed args not already caught).
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join, relative, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

// Parse command-line arguments
function parseArgs(argv) {
  let localDir = null;
  let referenceDir = null;
  let subdirs = ".claude,scripts";
  let jsonMode = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--subdirs") {
      i++;
      if (i >= argv.length) {
        console.error("--subdirs requires an argument");
        process.exit(2);
      }
      subdirs = argv[i];
    } else if (arg === "--json") {
      jsonMode = true;
    } else if (!arg.startsWith("--")) {
      if (localDir === null) {
        localDir = arg;
      } else if (referenceDir === null) {
        referenceDir = arg;
      } else {
        console.error(`Unrecognized positional argument: ${arg}`);
        process.exit(2);
      }
    } else {
      console.error(`Unrecognized option: ${arg}`);
      process.exit(2);
    }
  }

  if (!localDir || !referenceDir) {
    console.error("Usage: node .grimorio/scripts/export-divergence-check.mjs <localDir> <referenceDir> [--subdirs <csv>] [--json]");
    process.exit(2);
  }

  return { localDir, referenceDir, subdirs, jsonMode };
}

// Resolve directory path to absolute
function resolveDir(dirPath) {
  const absPath = isAbsolute(dirPath) ? dirPath : join(process.cwd(), dirPath);
  if (!existsSync(absPath)) {
    console.error(`Directory does not exist: ${absPath}`);
    process.exit(2);
  }
  const stat = statSync(absPath);
  if (!stat.isDirectory()) {
    console.error(`Not a directory: ${absPath}`);
    process.exit(2);
  }
  return absPath;
}

// Recursively list all files under a directory, excluding certain path segments
function listFilesRecursive(dir, excludeSegments) {
  const results = [];

  function walk(current, relativePath) {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch (err) {
      return; // Silently skip inaccessible directories
    }

    for (const entry of entries) {
      // Skip excluded segments
      if (excludeSegments.includes(entry.name)) {
        continue;
      }

      const newRelative = relativePath ? join(relativePath, entry.name) : entry.name;
      const fullPath = join(current, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, newRelative);
      } else if (entry.isFile()) {
        results.push(newRelative);
      }
    }
  }

  walk(dir, "");
  return results.sort();
}

// Read file as UTF-8 and normalize line endings (strip trailing \r from each line)
function readAndNormalize(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const normalized = lines.map((line) => line.replace(/\r$/, ""));
    return normalized.join("\n");
  } catch (err) {
    return null; // File read error
  }
}

// Run diff command and return output
function runDiff(localPath, referencePath) {
  const result = spawnSync("diff", ["--strip-trailing-cr", "-u", localPath, referencePath], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  // diff exits 0 on no difference, 1 on difference, 2 on error
  // We capture output regardless of exit code
  return result.stdout;
}

// Collect removed and added lines from a hunk
function collectHunkLines(lines, hunkStart) {
  const removed = [];
  const added = [];
  let i = hunkStart;

  while (i < lines.length && !lines[i].startsWith("@@")) {
    if (lines[i].startsWith("-") && !lines[i].startsWith("---")) {
      removed.push(lines[i].slice(1));
    } else if (lines[i].startsWith("+") && !lines[i].startsWith("+++")) {
      added.push(lines[i].slice(1));
    }
    i++;
  }

  return { removed, added, nextIdx: i };
}

// Pair removed and added lines from hunk data
function createPairsFromHunk(removed, added) {
  const pairs = [];
  const maxLen = Math.max(removed.length, added.length);
  for (let j = 0; j < maxLen; j++) {
    pairs.push({ removed: removed[j] || "", added: added[j] || "" });
  }
  return pairs;
}

// Process hunks in diff lines
function processHunks(lines, startIdx) {
  const pairs = [];
  let i = startIdx;
  while (i < lines.length) {
    if (lines[i].startsWith("@@")) {
      i++;
      const { removed, added, nextIdx } = collectHunkLines(lines, i);
      pairs.push(...createPairsFromHunk(removed, added));
      i = nextIdx;
    } else {
      i++;
    }
  }
  return pairs;
}

// Parse unified diff output into (removed, added) line pairs grouped by hunk
function parseDiffOutput(diffText) {
  const lines = diffText.split("\n");
  let i = 0;
  // Skip header lines (---/+++)
  while (i < lines.length && (lines[i].startsWith("---") || lines[i].startsWith("+++"))) {
    i++;
  }
  return processHunks(lines, i);
}

// Check if a line contains a GENERIC_SUBSTITUTION signal (case-insensitive)
function hasGenericSubstitution(line) {
  const signals = [
    "this project's own",
    "this project's ",
    "the project's own",
    "this repo's own",
    "a project's own",
  ];
  const lower = line.toLowerCase();
  return signals.some((sig) => lower.includes(sig.toLowerCase()));
}

// Check if a line contains a TRANSLATION signal (Spanish/accent marks or common Spanish words)
function hasTranslation(line) {
  const spanishRegex = /[áéíóúñ¿¡]|(?:\bque\b|\bpara\b|\besto\b|\best[aá]\b|\bmás\b|\bdel\b|\bcon\b|\bpero\b)/i;
  return spanishRegex.test(line);
}

// Count signal detections in diff pairs
function countSignalsInPairs(diffPairs) {
  let genericCount = 0;
  let translationCount = 0;
  let otherCount = 0;

  for (const pair of diffPairs) {
    const removedHasTranslation = hasTranslation(pair.removed);
    const addedHasTranslation = hasTranslation(pair.added);
    const addedHasGeneric = hasGenericSubstitution(pair.added);

    const hasGeneric = addedHasGeneric;
    const hasTranslationSignal =
      removedHasTranslation &&
      !addedHasTranslation &&
      pair.removed.length >= 15;

    if (hasGeneric && !hasTranslationSignal) {
      genericCount++;
    } else if (!hasGeneric && hasTranslationSignal) {
      translationCount++;
    } else if (hasGeneric && hasTranslationSignal) {
      genericCount++;
      translationCount++;
    } else {
      otherCount++;
    }
  }

  return { genericCount, translationCount, otherCount };
}

// Decide classification based on signal counts
function decideClassification(genericCount, translationCount, otherCount) {
  if (otherCount > 0) return "NEEDS-REVIEW";
  if (genericCount > 0 && translationCount > 0) return "SCRUB+TRANSLATION-LIKE";
  if (genericCount > 0) return "SCRUB-LIKE";
  if (translationCount > 0) return "TRANSLATION-LIKE";
  return "NEEDS-REVIEW";
}

// Classify a DIFFERS file based on diff pairs
function classifyDiffersFile(diffPairs) {
  const { genericCount, translationCount, otherCount } = countSignalsInPairs(diffPairs);
  return decideClassification(genericCount, translationCount, otherCount);
}

// Enumerate reference files and return paths, set, and count
function enumerateReferenceFiles(referenceDir, subdirs, excludeSegments) {
  const referencePaths = [];
  for (const subdir of subdirs) {
    const subdirPath = join(referenceDir, subdir);
    if (existsSync(subdirPath)) {
      const files = listFilesRecursive(subdirPath, excludeSegments);
      for (const file of files) {
        referencePaths.push(join(subdir, file));
      }
    }
  }
  return {
    referencePaths,
    referenceSet: new Set(referencePaths),
    referencePopulation: referencePaths.length,
  };
}

// Compare file contents and return classification
function compareFileContents(referencePath, localPath, relPath) {
  const refContent = readAndNormalize(referencePath);
  const localContent = readAndNormalize(localPath);

  if (refContent === null || localContent === null) {
    return { path: relPath, class: "NEEDS-REVIEW" };
  }

  if (refContent === localContent) {
    return { path: relPath, isIdentical: true };
  }

  const diffOutput = runDiff(localPath, referencePath);
  const diffPairs = parseDiffOutput(diffOutput);
  const fileClass = diffPairs.length === 0 ? "NEEDS-REVIEW" : classifyDiffersFile(diffPairs);
  return { path: relPath, class: fileClass };
}

// Classify a single file and return its class
function classifySingleFile(relPath, localDir, referenceDir) {
  const referencePath = join(referenceDir, relPath);
  const localPath = join(localDir, relPath);

  if (!existsSync(localPath)) {
    return { path: relPath, class: "MISSING-LOCALLY" };
  }

  return compareFileContents(referencePath, localPath, relPath);
}

// Classify reference files by comparing against local copies
function classifyAgainstReference(referencePaths, localDir, referenceDir) {
  const identical = [];
  const differs = [];

  for (const relPath of referencePaths) {
    const result = classifySingleFile(relPath, localDir, referenceDir);
    if (result.isIdentical) {
      identical.push(result.path);
    } else {
      differs.push({ path: result.path, class: result.class });
    }
  }

  return { identical, differs };
}

// Find local files not in reference
function findLocalOnly(localDir, subdirs, excludeSegments, referenceSet) {
  const localOnly = [];
  for (const subdir of subdirs) {
    const subdirPath = join(localDir, subdir);
    if (existsSync(subdirPath)) {
      const files = listFilesRecursive(subdirPath, excludeSegments);
      for (const file of files) {
        const relPath = join(subdir, file);
        if (!referenceSet.has(relPath)) {
          localOnly.push(relPath);
        }
      }
    }
  }
  localOnly.sort();
  return localOnly;
}

// Print JSON report
function printJsonReport(referenceDir, subdirs, referencePopulation, identical, differs, missingLocally, localOnly) {
  const report = {
    population: {
      referenceDir,
      subdirs,
      total: referencePopulation,
    },
    identical,
    differs,
    missingLocally: missingLocally.map((d) => d.path),
    localOnly,
  };
  console.log(JSON.stringify(report, null, 2));
}

// Print divergence details for human-readable report
function printDivergenceDetails(realDiffers, needsReview, classified) {
  if (realDiffers.length === 0) return;
  for (const item of classified) {
    console.log(`${item.class}\t${item.path}`);
  }
  for (const item of needsReview) {
    console.log(`>>> ${item.class}\t${item.path}`);
  }
}

// Print missing and local-only sections for human-readable report
function printMissingAndLocalSections(missingLocally, localOnly) {
  if (missingLocally.length > 0) {
    console.log();
    console.log(`MISSING LOCALLY (${missingLocally.length}):`);
    for (const item of missingLocally) {
      console.log(`  ${item.path}`);
    }
  }
  if (localOnly.length > 0) {
    console.log();
    console.log(`LOCAL-ONLY (${localOnly.length}):`);
    for (const path of localOnly) {
      console.log(`  ${path}`);
    }
  }
}

// Print human-readable report
function printHumanReport(referenceDir, subdirs, referencePopulation, identical, realDiffers, needsReview, classified, missingLocally, localOnly) {
  console.log(
    `POPULATION: ${referencePopulation} files under ${referenceDir}/{${subdirs.join(",")}}  |  ` +
      `IDENTICAL: ${identical.length}  DIFFERS: ${realDiffers.length}  MISSING-LOCALLY: ${missingLocally.length}  LOCAL-ONLY: ${localOnly.length}`,
  );
  printDivergenceDetails(realDiffers, needsReview, classified);
  printMissingAndLocalSections(missingLocally, localOnly);
}

// Compute classification buckets from differs array
function computeClassificationBuckets(differs) {
  const missingLocally = differs.filter((d) => d.class === "MISSING-LOCALLY");
  const realDiffers = differs.filter((d) => d.class !== "MISSING-LOCALLY");
  const needsReview = realDiffers.filter((d) => d.class === "NEEDS-REVIEW");
  const classified = realDiffers.filter((d) => d.class !== "NEEDS-REVIEW");
  return { missingLocally, realDiffers, needsReview, classified };
}

// Emit report in appropriate format
function emitReport(jsonMode, referenceDir, subdirs, referencePopulation, identical, differs, missingLocally, realDiffers, needsReview, classified, localOnly) {
  if (jsonMode) {
    printJsonReport(referenceDir, subdirs, referencePopulation, identical, differs, missingLocally, localOnly);
  } else {
    printHumanReport(referenceDir, subdirs, referencePopulation, identical, realDiffers, needsReview, classified, missingLocally, localOnly);
  }
}

// Main entry point
function main() {
  try {
    const { localDir: localArg, referenceDir: referenceArg, subdirs: subdirArg, jsonMode } = parseArgs(process.argv.slice(2));
    const localDir = resolveDir(localArg);
    const referenceDir = resolveDir(referenceArg);
    const subdirs = subdirArg.split(",").map((s) => s.trim());
    const excludeSegments = ["node_modules", ".git", ".cache"];
    const { referencePaths, referenceSet, referencePopulation } = enumerateReferenceFiles(referenceDir, subdirs, excludeSegments);
    const { identical, differs } = classifyAgainstReference(referencePaths, localDir, referenceDir);
    const localOnly = findLocalOnly(localDir, subdirs, excludeSegments, referenceSet);
    const { missingLocally, realDiffers, needsReview, classified } = computeClassificationBuckets(differs);
    emitReport(jsonMode, referenceDir, subdirs, referencePopulation, identical, differs, missingLocally, realDiffers, needsReview, classified, localOnly);
    process.exit(0);
  } catch (err) {
    console.error(`Unexpected error: ${err.message}`);
    process.exit(1);
  }
}

main();
