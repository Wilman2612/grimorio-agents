// @keep-comment
// The ESM face of cache-paths.cjs. It RE-EXPORTS rather than re-implementing, so the resolution logic and
// the fallback have exactly one home -- a second copy here is the shape that broke three things in this
// migration already. The .cjs is the implementation because the hooks under .claude/hooks are CommonJS and
// cannot import an ESM module synchronously.
import { createRequire } from "node:module";

const { cacheRoot, cacheDir, cachePath, cacheRelative } = createRequire(import.meta.url)("./cache-paths.cjs");

export { cacheRoot, cacheDir, cachePath, cacheRelative };
