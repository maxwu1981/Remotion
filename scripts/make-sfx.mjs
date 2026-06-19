#!/usr/bin/env node
/**
 * Generates lightweight PLACEHOLDER sound design into public/ with ffmpeg, so the
 * project renders out-of-the-box. These are synthesized stand-ins — swap them for
 * real assets (same filenames) whenever you like.
 *
 *   npm run sfx
 *
 * Files map 1:1 to the <Sfx>/<Bgm> tags used across the sequences:
 *   bgm.mp3                 — ambient pad bed (looped, played at 15% under the VO)
 *   ui-pop.mp3              — title / tooltip pop          (Seq 1, tooltips)
 *   soft-whoosh.mp3         — flow / panel slide           (Seq 2, Seq 5)
 *   clean-ding.mp3          — tool card focus, tooltip ding (Seq 3)
 *   typing.mp3              — terminal & JSON keystrokes    (Seq 4, Seq 5)
 *   digital-processing.mp3  — AI module crunching           (Seq 4)
 *   cash-register.mp3       — ROI receipt total             (Seq 6)
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
if (!existsSync(pub)) mkdirSync(pub, { recursive: true });

/** Each entry is the ffmpeg argument string (inputs + filter + output file). */
const JOBS = {
  "ui-pop.mp3":
    `-f lavfi -i "sine=frequency=720:duration=0.18" ` +
    `-af "afade=t=out:st=0.03:d=0.15,volume=0.7"`,

  "clean-ding.mp3":
    `-f lavfi -i "sine=frequency=1046:duration=0.55" ` +
    `-f lavfi -i "sine=frequency=1568:duration=0.55" ` +
    `-filter_complex "[0][1]amix=inputs=2,afade=t=out:st=0.07:d=0.48,volume=0.85"`,

  "soft-whoosh.mp3":
    `-f lavfi -i "anoisesrc=d=0.6:c=pink:a=0.7" ` +
    `-af "highpass=f=350,lowpass=f=2600,afade=t=in:st=0:d=0.22,afade=t=out:st=0.30:d=0.30,volume=0.8"`,

  "typing.mp3":
    `-f lavfi -i "anoisesrc=d=1.1:c=pink:a=0.6" ` +
    `-af "highpass=f=900,lowpass=f=5200,tremolo=f=16:d=0.95,volume=0.85"`,

  "digital-processing.mp3":
    `-f lavfi -i "sine=frequency=180:duration=1.6" ` +
    `-f lavfi -i "sine=frequency=1200:duration=1.6" ` +
    `-filter_complex "[1]tremolo=f=22:d=0.8[s];[0][s]amix=inputs=2,` +
    `vibrato=f=6:d=0.4,afade=t=in:st=0:d=0.12,afade=t=out:st=1.3:d=0.3,volume=0.6"`,

  "cash-register.mp3":
    `-f lavfi -i "sine=frequency=1320:duration=0.5" ` +
    `-f lavfi -i "sine=frequency=1760:duration=0.5" ` +
    `-filter_complex "[0]adelay=0|0[a];[1]adelay=95|95[b];` +
    `[a][b]amix=inputs=2:duration=longest,afade=t=out:st=0.45:d=0.25,volume=0.8"`,

  "bgm.mp3":
    `-f lavfi -i "sine=frequency=261.63:duration=16" ` +
    `-f lavfi -i "sine=frequency=329.63:duration=16" ` +
    `-f lavfi -i "sine=frequency=392.00:duration=16" ` +
    `-f lavfi -i "sine=frequency=523.25:duration=16" ` +
    `-filter_complex "[0][1][2][3]amix=inputs=4,tremolo=f=0.18:d=0.5,` +
    `afade=t=in:st=0:d=1.5,afade=t=out:st=14.5:d=1.5,volume=0.5"`,
};

for (const [file, args] of Object.entries(JOBS)) {
  const out = join(pub, file);
  process.stdout.write(`▶ ${file} … `);
  execSync(`ffmpeg -y -hide_banner -loglevel error ${args} "${out}"`, {
    stdio: ["ignore", "ignore", "inherit"],
  });
  console.log("ok");
}
console.log("\n✓ placeholder sound design written to public/");
