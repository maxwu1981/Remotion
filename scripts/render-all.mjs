#!/usr/bin/env node
/**
 * Render the Auto-Upload tutorial (and its per-scene comps) to out/.
 * Pass `--autoline` to also render the earlier AutoLine masterclass.
 *   npm run render:all
 *   npm run render:all -- --autoline
 */
import { execSync } from "node:child_process";

const targets = [
  ["AutoUpload", "auto-upload.mp4"],
  ["U1", "u1-opening.mp4"],
  ["U2", "u2-gcp-project.mp4"],
  ["U3", "u3-oauth-test-users.mp4"],
  ["U4", "u4-credentials.mp4"],
  ["U5", "u5-terminal.mp4"],
  ["U6", "u6-authorize.mp4"],
  ["U7", "u7-success.mp4"],
  ["U8", "u8-recap.mp4"],
  ["U9", "u9-cta.mp4"],
];

if (process.argv.includes("--autoline")) {
  targets.push(
    ["ProductionLine", "production-line.mp4"],
    ["Seq1", "seq-1-pain.mp4"],
    ["Seq2", "seq-2-pipeline.mp4"],
    ["Seq3", "seq-3-toolbox.mp4"],
    ["Seq4", "seq-4-cut-revoice.mp4"],
    ["Seq5", "seq-5-render.mp4"],
    ["Seq6", "seq-6-roi.mp4"],
  );
}

for (const [id, out] of targets) {
  console.log(`\n▶ rendering ${id} → out/${out}`);
  execSync(`npx remotion render ${id} out/${out}`, { stdio: "inherit" });
}
console.log("\n✓ all renders complete → out/");
