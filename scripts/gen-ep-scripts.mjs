#!/usr/bin/env node
// 從 episodes.config.mjs 寫出每集 epNN-script.json(7 句旁白)。
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EPISODES } from "../src/videos/claude-code-map/episodes.config.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "videos", "claude-code-map");
for (const e of EPISODES) {
  const id = `ep${String(e.ep).padStart(2, "0")}`;
  writeFileSync(join(dir, `${id}-script.json`), JSON.stringify(e.lines, null, 2) + "\n");
  console.log(`✓ ${id}-script.json`);
}
console.log(`\n共 ${EPISODES.length} 集 script.json`);
