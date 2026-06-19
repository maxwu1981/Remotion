#!/usr/bin/env node
/** Verification stills for the MCP-vs-API video. Bundles once, one frame per scene. */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out/stills-mcp");
mkdirSync(outDir, { recursive: true });

const shots = [
  ["M1", 135], // hook: MCP × API + question
  ["M2", 135], // API = waiter flow + note
  ["M3", 160], // MCP hub → sources
  ["M4", 175], // cooperation pipeline + cards
  ["M5", 190], // differences table
  ["M6", 210], // socket vs universal adapter
  ["M7", 150], // summary takeaways
];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
console.log("bundled ✓");
for (const [id, frame] of shots) {
  const composition = await selectComposition({ serveUrl, id });
  const output = path.join(outDir, `${id}-f${frame}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.5, overwrite: true });
  console.log(`  ${id} @${frame}`);
}
console.log("✓ stills → out/stills-mcp/");
