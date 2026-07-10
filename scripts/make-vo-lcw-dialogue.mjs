#!/usr/bin/env node
/**
 * Two-voice voiceover for the local-cloud-walk dialogue finale (edge-tts).
 * 新手(n)=male zh-TW-YunJheNeural · 老手(o)=female zh-TW-HsiaoChenNeural.
 * Reads src/videos/local-cloud-walk/dialogue.json, writes one mp3 per line into
 * public/vo/local-cloud-dialogue/<id>.mp3, records durations in
 * src/videos/local-cloud-walk/dialogue.vo.json.
 *
 *   node scripts/make-vo-lcw-dialogue.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "local-cloud-dialogue");
const dlgFile = join(root, "src", "videos", "local-cloud-walk", "dialogue.json");
const voManifest = join(root, "src", "videos", "local-cloud-walk", "dialogue.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = { n: "zh-TW-YunJheNeural", o: "zh-TW-HsiaoChenNeural" };
const lines = JSON.parse(readFileSync(dlgFile, "utf8")).lines;

const speak = (t) =>
  t.replace(/CLAUDE\.md/g, "claude 點 md").replace(/\s*→\s*/g, "，").replace(/[／/]/g, "、").replace(/\s+/g, " ").trim();
const probe = (f) =>
  parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log("engine: edge-tts   新手=YunJhe(男)  老手=HsiaoChen(女)\n");
for (const { id, who, text } of lines) {
  const raw = join("/tmp", `${id}.lcwd.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", VOICE[who], "--text", speak(text), "--write-media", raw], { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(5)} ${who === "n" ? "新手" : "老手"} ${s.toFixed(2)}s  ${text.slice(0, 22)}`);
}
writeFileSync(voManifest, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${lines.length} clips → public/vo/local-cloud-dialogue/  ·  ${total.toFixed(1)}s (${(total / 60).toFixed(1)} min)`);
