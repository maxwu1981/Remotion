#!/usr/bin/env node
/**
 * Voiceover for the "Auto-Upload" tutorial, using Microsoft **edge-tts** — the
 * free online neural voices from Edge (no API key, just network). Sounds far
 * more natural than the local `say` engine. One mp3 per cue into
 * public/vo/upload/<id>.mp3, with measured durations written to
 * src/videos/youtube-auto-upload/vo-manifest.json so scenes re-time to the audio.
 *
 *   pip install edge-tts          # one-time
 *   npm run vo:upload
 *   VO_VOICE="en-US-AndrewMultilingualNeural" npm run vo:upload
 *   VO_RATE="+8%" npm run vo:upload      # speed up / slow down
 *
 * Good English voices: en-US-AvaMultilingualNeural (default, warm female),
 * en-US-AndrewMultilingualNeural (conversational male), en-US-EmmaMultilingualNeural,
 * en-US-BrianMultilingualNeural, en-US-AriaNeural, en-US-GuyNeural.
 *
 * `say` text tuning is kept (A P I, dot json, O-Auth …) — it is engine-agnostic
 * and keeps pronunciation crisp; on-screen captions stay clean.
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "upload");
const manifestDir = join(root, "src", "videos", "youtube-auto-upload");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });
if (!existsSync(manifestDir)) mkdirSync(manifestDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "en-US-AvaMultilingualNeural";
const RATE = process.env.VO_RATE || null;

/** id → spoken text (pronunciation-tuned). Ids match each scene's CUES. */
const CUES = [
  // Scene 1 — opening hook
  ["u1-c1", "Set it up once, and auto-upload forever."],
  ["u1-c2", "A one-time, five-minute setup — and every future video uploads itself to YouTube."],

  // Scene 2 — GCP project + enable API
  ["u2-c1", "First, head to Google Cloud and create a new project."],
  ["u2-c2", "Then search for the YouTube Data A P I, version three,"],
  ["u2-c3", "and click Enable. This is the key that lets your scripts upload videos."],

  // Scene 3 — OAuth consent + test users
  ["u3-c1", "Next, configure the O-Auth consent screen. Set the user type to External."],
  ["u3-c2", "Here's the step almost everyone misses."],
  ["u3-c3", "Under Test users, add your channel's Gmail — or Google will block the authorization."],

  // Scene 4 — credentials JSON
  ["u4-c1", "Now create an O-Auth client I D, and choose Desktop app."],
  ["u4-c2", "Download the json file, rename it to client secrets dot json,"],
  ["u4-c3", "and drop it into your project folder. Setup complete."],

  // Scene 5 — environment + terminal launch
  ["u5-c1", "Environment ready."],
  ["u5-c2", "Start the upload script — and it opens your browser for the final authorization."],

  // Scene 6 — browser authorization
  ["u6-c1", "Don't panic if you see a security warning."],
  ["u6-c2", "Click Advanced, at the bottom left, then Go to project."],
  ["u6-c3", "Make sure every permission stays checked, including Manage your YouTube videos."],

  // Scene 7 — auth success
  ["u7-c1", "When you see this screen, authorization is complete. Your token is saved automatically."],
  ["u7-c2", "From now on, every A I generated video queues up and uploads to YouTube on its own."],

  // Scene 8 — recap (glassmorphism + data flow)
  ["u8-c1", "Let's review the production line."],
  ["u8-c2", "Email comes in. A I writes and renders the video. YouTube publishes it."],
  ["u8-c3", "Three nodes, fully connected."],

  // Scene 9 — call to action
  ["u9-c1", "From the incoming email, to the script, to the final publish — zero manual steps."],
  ["u9-c2", "Start building your fully automated production line today."],
];

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`)
      .toString()
      .trim(),
  );

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}${RATE ? `   rate: ${RATE}` : ""}\n`);
for (const [id, text] of CUES) {
  const raw = join("/tmp", `${id}.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", text, "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  // normalize to 44.1k mono to sit consistently with the SFX/BGM bed
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(7)} ${seconds.toFixed(2)}s   ${text.slice(0, 52)}`);
}

writeFileSync(join(manifestDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${CUES.length} clips → public/vo/upload/  ·  manifest → src/videos/youtube-auto-upload/vo-manifest.json`);
console.log(`  spoken total: ${total.toFixed(1)}s`);
