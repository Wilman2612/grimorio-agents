#!/usr/bin/env node
// Counts lines in files to compute registration-cost threshold for grimorio.system-keeper Phase B step 8.
import { readFileSync, existsSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";

const args = process.argv.slice(2);
const selfTest = args.includes("--self-test");
const fileArgs = args.filter((a) => a !== "--self-test");

function countLines(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    return (content.match(/\n/g) || []).length;
  } catch {
    return null;
  }
}

function fail(msg) {
  console.error(`SELF-TEST: FAIL — ${msg}`);
  process.exit(1);
}

function getWcCount(file) {
  try {
    const out = execFileSync("wc", ["-l", file], { encoding: "utf8" });
    const m = out.match(/^(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  } catch {
    return null;
  }
}

function compareLineCounts(file) {
  const nodeCount = countLines(file);
  if (nodeCount === null) fail(`${file} not found`);
  const wcCount = getWcCount(file);
  if (wcCount === null) fail(`could not read ${file} with wc`);
  if (nodeCount !== wcCount) fail(`${file} mismatch (${nodeCount} vs ${wcCount})`);
}

function runSelfTest() {
  const testFiles = ["CLAUDE.md", ".grimorio/scripts/audit-chain.mjs"];
  for (const file of testFiles) {
    compareLineCounts(file);
  }
  const tmpFile = tmpdir() + "/registration-cost-selftest-no-trailing-nl.tmp";
  writeFileSync(tmpFile, "line one\nline two\nline three");
  compareLineCounts(tmpFile);
  unlinkSync(tmpFile);
  console.log("SELF-TEST: PASS");
}

// If no file arguments and --self-test was not passed, print usage and exit
if (fileArgs.length === 0 && !selfTest) {
  console.error("USAGE: node .grimorio/scripts/registration-cost.mjs <file1> [file2 ...]");
  process.exit(1);
}

let totalLines = 0;

// Process each file argument
for (const fileArg of fileArgs) {
  const resolvedPath = path.resolve(fileArg);

  // Check if file exists
  if (!existsSync(resolvedPath)) {
    console.error(`ERROR: cannot read ${fileArg}`);
    process.exit(1);
  }

  // Count lines
  const lineCount = countLines(resolvedPath);
  if (lineCount === null) {
    console.error(`ERROR: cannot read ${fileArg}`);
    process.exit(1);
  }

  // Print line with original path as given
  console.log(`  ${lineCount}  ${fileArg}`);
  totalLines += lineCount;
}

// Print total
console.log(`TOTAL: ${totalLines} lines`);

// Run self-test if requested
if (selfTest) {
  console.log(""); // Blank line before self-test output
  runSelfTest();
}

process.exit(0);
