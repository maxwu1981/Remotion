#!/usr/bin/env node
/**
 * Batch-render every painting's 作畫過程 video to out/.
 *
 * Paintings are discovered dynamically from the registered "P-<slug>"
 * compositions (one per entry in src/videos/painting-reveal/paintings.ts), so
 * the only thing you maintain is that array. Each file is named from the comp's
 * defaultOutName — 「<畫名>_作畫.mp4」.
 *
 *   node scripts/render-paintings.mjs                # all paintings
 *   node scripts/render-paintings.mjs P-sigua-birds  # just one
 */
import { execSync } from "node:child_process";

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

const table = execSync("npx remotion compositions", { encoding: "utf8" });
let ids = table
  .split("\n")
  .map((line) => line.trim().split(/\s+/)[0])
  .filter((id) => /^P-[\w-]+$/.test(id));

if (only.length) ids = ids.filter((id) => only.includes(id));

if (ids.length === 0) {
  console.error("✗ No painting compositions (P-*) found. Add entries to paintings.ts first.");
  process.exit(1);
}

console.log(`▶ rendering ${ids.length} painting video(s): ${ids.join(", ")}`);
for (const id of ids) {
  console.log(`\n▶ ${id}`);
  execSync(`npx remotion render ${id}`, { stdio: "inherit" });
}
console.log("\n✓ all painting videos rendered → out/");
