#!/usr/bin/env node
/**
 * Verification stills for the Auto-Upload tutorial. Bundles once, then renders a
 * representative frame for each scene into out/stills-upload/.
 *   node scripts/stills-upload.mjs
 */
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out/stills-upload");
mkdirSync(outDir, { recursive: true });

const shots = [
  ["U1", 150], // opening: hero + windows + auto pill
  ["U2", 60], // gcp: new project + CREATE pulse + cursor
  ["U2", 345], // gcp: enable api card
  ["U3", 70], // oauth: user type external
  ["U3", 360], // oauth: test users + blink + added
  ["U4", 60], // creds: create client desktop app
  ["U4", 200], // creds: download json
  ["U4", 415], // creds: finder rename + folder check
  ["U5", 150], // terminal lines
  ["U6", 165], // auth: advanced open + arrow
  ["U6", 330], // auth: permissions checked
  ["U7", 60], // success popup
  ["U7", 235], // studio + confetti
  ["U8", 210], // recap glass cards + streams
  ["U9", 130], // cta slogan + shimmer
];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
console.log("bundled ✓");

for (const [id, frame] of shots) {
  const composition = await selectComposition({ serveUrl, id });
  const output = path.join(outDir, `${id}-f${frame}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.5, overwrite: true });
  console.log(`  ${id} @${frame} → ${path.relative(process.cwd(), output)}`);
}
console.log("\n✓ stills complete");
