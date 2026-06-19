#!/usr/bin/env node
/** Verification stills for the AI-voice video. Bundles once, renders one frame per scene. */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out/stills-aivoice");
mkdirSync(outDir, { recursive: true });

const shots = [
  ["AV1", 200], // hook
  ["AV2", 300], // how we score: MOS panel + 4 metrics
  ["AV3", 130], // Siri deep dive (#5)
  ["AV4", 130], // Edge deep dive (#4)
  ["AV5", 130], // OpenAI deep dive (#3)
  ["AV6", 130], // ChatTTS deep dive (#2)
  ["AV7", 130], // ElevenLabs deep dive (#1)
  ["AV8", 290], // comparison table + champions
  ["AV9", 250], // cheat sheet: 5-radar + pick-by-need
  ["AV10", 235], // closing hook
];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
console.log("bundled ✓");
for (const [id, frame] of shots) {
  const composition = await selectComposition({ serveUrl, id });
  const output = path.join(outDir, `${id}-f${frame}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.5, overwrite: true });
  console.log(`  ${id} @${frame}`);
}
console.log("✓ stills → out/stills-aivoice/");
