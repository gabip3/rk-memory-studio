/**
 * Builds the static GitHub Pages preview LOCALLY, without touching your
 * working tree.
 *
 * The preview cannot contain API routes or `force-dynamic`, so producing it
 * means deleting things. Doing that in place is how a real mistake happened
 * once: an unrelated `git add -A` ran while the routes were deleted, and
 * committed their removal. So this copies the project and does the surgery on
 * the copy. Your source is never modified.
 *
 *   npm run build:preview
 *
 * WHERE THE COPY LIVES, and why. It is built in `.preview-build/` inside this
 * project (git-, tsc- and eslint-ignored), not in the system temp folder. Two
 * earlier versions used the temp folder with a link to node_modules; both
 * failed, because the temp folder is on a different drive from the project
 * and neither Turbopack nor webpack can build across drives. Inside the
 * project, no link is needed at all: package resolution walks up one level and
 * finds the real node_modules. The copy deliberately has no package-lock.json,
 * so Next treats this project as the root when it looks for one.
 *
 * It builds with the default bundler, the same as CI.
 */
import {
  cpSync,
  rmSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const buildsDir = join(root, ".preview-build");

// Only plain copies ever live here (no links), so clearing it is safe.
rmSync(buildsDir, { recursive: true, force: true });
mkdirSync(buildsDir, { recursive: true });
const work = mkdtempSync(join(buildsDir, "run-"));

// `.preview-build` must be skipped or the copy would recurse into itself.
const SKIP = new Set([
  ".next",
  "out",
  ".git",
  "node_modules",
  ".uploads",
  ".preview-build",
  "package-lock.json",
]);

console.log(`Building preview in ${work}`);

for (const entry of readdirSync(root)) {
  if (SKIP.has(entry)) continue;
  cpSync(join(root, entry), join(work, entry), { recursive: true });
}

// A static export cannot contain route handlers.
rmSync(join(work, "src/app/api"), { recursive: true, force: true });

// `force-dynamic` is meaningless without a server and blocks the export.
function stripForceDynamic(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) stripForceDynamic(p);
    else if (entry.name.endsWith(".tsx")) {
      const before = readFileSync(p, "utf8");
      const after = before.replace(
        /^export const dynamic = "force-dynamic";\r?\n/m,
        ""
      );
      if (after !== before) writeFileSync(p, after);
    }
  }
}
stripForceDynamic(join(work, "src/app"));

execSync("npx next build", {
  cwd: work,
  stdio: "inherit",
  env: {
    ...process.env,
    STATIC_EXPORT: "true",
    PAGES_BASE_PATH: "/rk-memory-studio",
    NEXT_PUBLIC_BASE_PATH: "/rk-memory-studio",
    NEXT_PUBLIC_DEMO_MODE: "true",
    NEXT_PUBLIC_SITE_URL: "https://gabip3.github.io/rk-memory-studio",
    NEXT_PUBLIC_SITE_INDEXABLE: "false",
  },
});

const out = join(work, "out");
console.log(existsSync(out) ? `\nDone: ${out}` : "\nNo out/ was produced");
console.log("Your working tree was not modified.");
