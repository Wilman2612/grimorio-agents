# [YOUR PROJECT] — project.md

> **This file is YOURS, and it is EXPECTED.** grimorio ships it empty because 3 prompt(s) below
> load it EAGERLY -- without it they are told to read a file that is not there. Write it, or delete it and
> the imports naming it. An empty file left here is worse than no file: it answers the load and says nothing.

**Imported by**
- `.grimorio/agents/grimorio.ui-developer/phases/phase-1-plan.md`
- `.grimorio/agents/grimorio.ui-developer/phases/phase-4-storybook-story-per-state.md`
- `.grimorio/agents/grimorio.ui-developer/phases/phase-5-verify-and-report.md`

**2 of those imports address a heading in this file BY NAME.** An `#anchor` expects
that heading to exist, so a missing one stays a dead reference even once this file has content. Find
what is expected of you in your own clone:

```sh
grep -rn "project.md#" .grimorio/ --include=*.md
```

The names used in the authoring project are NOT shipped: they describe its product, not yours.
