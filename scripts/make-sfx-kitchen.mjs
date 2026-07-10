#!/usr/bin/env node
/**
 * 廚房比喻短片專用音效（免版權 ffmpeg 合成佔位，可日後換真檔、同檔名）。
 *   node scripts/make-sfx-kitchen.mjs
 * 對應 Reel.tsx 的 <Sfx>：
 *   kf-boom      懸疑低音 Boom（封面/hook）
 *   kf-thunder   雷擊（職場求生評估）
 *   kf-crow      尷尬烏鴉飛過（廚房比喻）
 *   kf-rewind    時光倒流咻咻（Git）
 *   kf-slap      尺拍手心啪（Linter）
 *   kf-gong      皇上駕到敲鑼（測試）
 *   kf-sparkle   米其林聖光 shimmer
 *   kf-riser     恐怖片拉弦上升（快逃 setup）
 *   kf-glass     玻璃碎掉（快逃）
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
if (!existsSync(pub)) mkdirSync(pub, { recursive: true });

const JOBS = {
  // deep cinematic boom: low sine + sub, slow swell out
  // (volume kept ≤1 + low-pass so the two sines never clip into a buzzy crackle)
  "kf-boom.mp3":
    `-f lavfi -i "sine=frequency=58:duration=1.6" ` +
    `-f lavfi -i "sine=frequency=92:duration=1.6" ` +
    `-filter_complex "[0][1]amix=inputs=2,lowpass=f=200,afade=t=in:st=0:d=0.08,afade=t=out:st=0.7:d=0.9,volume=0.9"`,

  // thunder crack: filtered noise burst with a sharp attack
  "kf-thunder.mp3":
    `-f lavfi -i "anoisesrc=d=1.2:c=brown:a=0.9" ` +
    `-af "lowpass=f=1400,highpass=f=60,afade=t=in:st=0:d=0.01,afade=t=out:st=0.25:d=0.9,volume=1.6"`,

  // awkward 'crow' descending whistle (slide tone down)
  "kf-crow.mp3":
    `-f lavfi -i "sine=frequency=900:duration=0.7" ` +
    `-af "asetrate=44100*1.0,atempo=1.0,vibrato=f=7:d=0.6,aeval='val(0)*(1-0.7*t/0.7)',afade=t=out:st=0.4:d=0.3,volume=0.5"`,

  // time-rewind: quick zippy up-sweep (reverse-whoosh feel)
  "kf-rewind.mp3":
    `-f lavfi -i "anoisesrc=d=0.55:c=pink:a=0.8" ` +
    `-af "highpass=f=500,lowpass=f=4200,tremolo=f=30:d=0.9,areverse,afade=t=in:st=0:d=0.2,afade=t=out:st=0.42:d=0.12,volume=0.9"`,

  // ruler slap: tight click + tiny noise snap
  "kf-slap.mp3":
    `-f lavfi -i "sine=frequency=240:duration=0.12" ` +
    `-f lavfi -i "anoisesrc=d=0.12:c=white:a=0.6" ` +
    `-filter_complex "[1]highpass=f=1500[n];[0][n]amix=inputs=2,afade=t=out:st=0.02:d=0.1,volume=1.3"`,

  // gong: metallic cluster with long ring
  "kf-gong.mp3":
    `-f lavfi -i "sine=frequency=196:duration=1.8" ` +
    `-f lavfi -i "sine=frequency=233:duration=1.8" ` +
    `-f lavfi -i "sine=frequency=311:duration=1.8" ` +
    `-f lavfi -i "sine=frequency=466:duration=1.8" ` +
    `-filter_complex "[0][1][2][3]amix=inputs=4,vibrato=f=4:d=0.3,afade=t=in:st=0:d=0.01,afade=t=out:st=0.4:d=1.4,volume=1.1"`,

  // sparkle / holy shimmer: high bells arpeggio
  // (softer: gentler tremolo, fade-in to kill the click, low-pass + lower gain so the top bell isn't piercing)
  "kf-sparkle.mp3":
    `-f lavfi -i "sine=frequency=1568:duration=1.0" ` +
    `-f lavfi -i "sine=frequency=2093:duration=1.0" ` +
    `-f lavfi -i "sine=frequency=2637:duration=1.0" ` +
    `-filter_complex "[0]adelay=0|0[a];[1]adelay=120|120[b];[2]adelay=240|240[c];` +
    `[a][b][c]amix=inputs=3:duration=longest,tremolo=f=6:d=0.3,lowpass=f=3000,afade=t=in:st=0:d=0.05,afade=t=out:st=0.6:d=0.4,volume=0.4"`,

  // horror string riser: rising sustained dissonant tone
  "kf-riser.mp3":
    `-f lavfi -i "sine=frequency=300:duration=1.6" ` +
    `-af "asetrate=44100,vibrato=f=8:d=0.4,afade=t=in:st=0:d=0.6,afade=t=out:st=1.4:d=0.2,volume=0.55"`,

  // glass shatter: bright noise burst + high tinkles
  "kf-glass.mp3":
    `-f lavfi -i "anoisesrc=d=0.6:c=white:a=0.9" ` +
    `-f lavfi -i "sine=frequency=3200:duration=0.6" ` +
    `-filter_complex "[0]highpass=f=2500[n];[1]tremolo=f=28:d=0.9[t];[n][t]amix=inputs=2,afade=t=out:st=0.12:d=0.45,volume=1.2"`,
};

for (const [file, args] of Object.entries(JOBS)) {
  const out = join(pub, file);
  process.stdout.write(`▶ ${file} … `);
  execSync(`ffmpeg -y -hide_banner -loglevel error ${args} "${out}"`, { stdio: ["ignore", "ignore", "inherit"] });
  console.log("ok");
}
console.log("\n✓ kitchen sound design → public/");
