/**
 * Builds the static GitHub Pages preview LOCALLY, without touching your
 * working tree.
 *
 * The preview cannot contain API routes or `force-dynamic`, so producing it
 * means deleting things. Doing that in place is how a real mistake happened
 * once: an unrelated `git add -A` ran while the routes were deleted, and
 * committed their removal. So this copies the project to a temp directory and
 * does the surgery there. Your source is never modified.
 *
 *   npm run build:preview
 *
 * CI performs the same steps in .github/workflows/preview.yml.
 */
import {
  cpSync,
  rmSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  symlinkSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

const root = process.cwd();
const work = mkdtempSync(join(tmpdir(), "rkms-preview-"));
const SKIP = new Set([".next", "out", ".git", "node_modules", ".uploads"]);

console.log(`Building preview in ${work}`);

for (const entry of readdirSync(root)) {
  if (SKIP.has(entry)) continue;
  cpSync(join(root, entry), join(work, entry), { recursive: true });
}

// node_modules is large; link it rather than copying a few hundred megabytes.
try {
  symlinkSync(join(root, "node_modules"), join(work, "node_modules"), "junction");
} catch {
  cpSync(join(root, "node_modules"), join(work, "node_modules"), { recursive: true });
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
