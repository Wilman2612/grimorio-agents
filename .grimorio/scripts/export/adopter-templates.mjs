#!/usr/bin/env node
// @keep-comment WHAT THE ADOPTER IS EXPECTED TO WRITE, derived from the citation graph. A travelling prompt
// that declares `import:` on a `project.` path puts an EAGER obligation on a file only the adopter can
// write, and until this existed nothing told them the file was expected: a fresh clone had 42 such loads
// across 19 paths and shipped one template. Derived, never listed -- a list falls behind the first time an
// agent gains a bullet, and it falls behind QUIETLY.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const LF = String.fromCharCode(10);

// A `project.` FILE inside a `grimorio.` container is a companion SLOT this corpus defines, so it gets a
// template. A `project.` CONTAINER is the adopter's own invention -- grimorio has no shape to offer for it.
const isCompanionSlot = (p) => {
  const parts = p.split("/");
  const container = parts[0];
  return container.startsWith("grimorio.") && parts.slice(1).some((s) => s.startsWith("project."));
};

// classifyMemory is INJECTED rather than imported: the caller already has it, and a module-level global
// would make this untestable without one.
export function collectAdopterSlots(root, classifyMemory) {
  const all = execFileSync("git", ["-C", root, "ls-files", ".grimorio"], { encoding: "utf8" }).trim().split(LF).filter(Boolean);
  const travels = new Set(classifyMemory(all).travels);
  const senders = all.filter((f) => f.endsWith(".md"))
    .filter((f) => !f.startsWith(".grimorio/memory/") || travels.has(f))
    .filter((f) => !f.split("/").some((s) => s.startsWith("project.")));
  const slots = new Map();
  for (const f of senders) {
    let txt = ""; try { txt = readFileSync(root + "/" + f, "utf8"); } catch { continue; }
    for (const m of txt.matchAll(/(?:import|ref|cite):(memory|skill|agent)\/([A-Za-z0-9.\/_#-]+)/g)) {
      const raw = m[2].replace(/[.,;:]+$/, "");
      const [rel, anchor] = raw.split("#");
      if (!rel.endsWith(".md") || !isCompanionSlot(rel)) continue;
      // An AGENT folder holds companion slots too, and a slot is something this corpus DEFINES, so the
      // adopter is expected to write it whichever relation names it. Seeding only the EAGER ones left the
      // published corpus pointing at files nobody had been told to write.
      const store = { memory: ".grimorio/memory/", skill: ".grimorio/skills/", agent: ".grimorio/agents/" }[m[1]];
      const key = store + rel;
      if (!slots.has(key)) slots.set(key, { by: new Set(), anchors: new Set() });
      slots.get(key).by.add(f);
      if (anchor) slots.get(key).anchors.add(anchor);
    }
  }
  return slots;
}

export function renderTemplate(target, info) {
  const name = target.split("/").pop();
  const by = [...info.by].sort();
  const anchors = [...info.anchors].sort();
  const L = [
    `# [YOUR PROJECT] — ${name}`,
    "",
    `> **This file is YOURS, and it is EXPECTED.** grimorio ships it empty because ${by.length} prompt(s) below`,
    "> load it EAGERLY -- without it they are told to read a file that is not there. Write it, or delete it and",
    "> the imports naming it. An empty file left here is worse than no file: it answers the load and says nothing.",
    "",
    "**Imported by**",
    ...by.map((f) => `- \`${f}\``),
  ];
  if (anchors.length) {
    // @keep-comment The anchor TEXT is deliberately NOT published. These slugs are headings from the project
    // this corpus was authored in -- one of them names a milestone -- so printing them would both leak that
    // project and tell an adopter to write a heading that means nothing to them. The GREP tells them how to
    // find the expectation in their own clone, which leaks nothing and cannot go stale.
    L.push("",
      `**${anchors.length} of those imports address a heading in this file BY NAME.** An \`#anchor\` expects`,
      "that heading to exist, so a missing one stays a dead reference even once this file has content. Find",
      "what is expected of you in your own clone:", "",
      "```sh",
      `grep -rn "${name}#" .grimorio/ --include=*.md`,
      "```", "",
      "The names used in the authoring project are NOT shipped: they describe its product, not yours.");
  }
  L.push("");
  return L.join(LF);
}

if (process.argv[1] && process.argv[1].endsWith("adopter-templates.mjs")) {
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
  const { classifyMemory } = await import(pathToFileURL(root + "/.grimorio/scripts/export/memory-split.mjs").href);
  const slots = collectAdopterSlots(root, classifyMemory);
  if (process.argv.includes("--sample")) {
    const [k, v] = [...slots].sort()[0];
    console.log(`--- ${k}`);
    console.log(renderTemplate(k, v));
  } else {
    for (const [k, v] of [...slots].sort()) console.log(`slot ${k}  (${v.by.size} prompt(s), ${v.anchors.size} anchor(s))`);
  }
  console.log(`slots ${slots.size}`);
}
