#!/usr/bin/env node
/** Verification stills for the vertical MCP-vs-API reel. Bundles once; samples the
 *  timeline by fraction (so we don't hardcode the frame count) + renders the cover. */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out/stills-mcp-reel");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
console.log("bundled ✓");

// cover
{
  const composition = await selectComposition({ serveUrl, id: "McpVsApiReelPoster" });
  const output = path.join(outDir, "cover.png");
  await renderStill({ serveUrl, composition, frame: 0, output, scale: 0.5, overwrite: true });
  console.log("  cover ✓");
}

// reel — eight samples across the timeline
const reel = await selectComposition({ serveUrl, id: "McpVsApiReel" });
const total = reel.durationInFrames;
console.log(`  reel duration = ${total} frames (${(total / reel.fps).toFixed(1)}s)`);
for (const frac of [0.02, 0.12, 0.25, 0.4, 0.55, 0.72, 0.85, 0.97]) {
  const frame = Math.min(total - 1, Math.round(total * frac));
  const output = path.join(outDir, `reel-f${frame}.png`);
  await renderStill({ serveUrl, composition: reel, frame, output, scale: 0.5, overwrite: true });
  console.log(`  reel @${frame} (${frac})`);
}
console.log("✓ stills → out/stills-mcp-reel/");
