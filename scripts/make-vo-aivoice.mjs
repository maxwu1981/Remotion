#!/usr/bin/env node
/**
 * Voiceover for the "AI Voice Picker" video — Microsoft edge-tts neural voice
 * (free, no key, needs network). One mp3 per cue into public/vo/ai-voice/<id>.mp3,
 * with measured durations written to src/videos/ai-voice-comparison/vo-manifest.json
 * so scenes re-time to the real audio.
 *
 *   npm run vo:aivoice
 *   VO_VOICE="en-US-EmmaMultilingualNeural" npm run vo:aivoice
 *
 * Text is tuned for pronunciation (T T S, A P I …); on-screen captions stay clean.
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "ai-voice");
const manifestDir = join(root, "src", "videos", "ai-voice-comparison");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "en-US-AvaMultilingualNeural";
const RATE = process.env.VO_RATE || null;

/** id → spoken text (pronunciation-tuned). Ids match each scene's CUES. */
const CUES = [
  // Scene 1 — cold-open hook
  ["av1-c1", "Five A I voices. Only one is right for you."],
  ["av1-c2", "Pick wrong, and you waste time or money — so I scored all five, on the data."],

  // Scene 2 — how we score
  ["av2-c1", "Two numbers tell the story. First, MOS — a 1-to-5 score from real human listeners."],
  ["av2-c2", "Then four metrics: naturalness, emotion, speed, and value. Lowest to highest — let's go."],

  // Scene 3 — Mac Siri (the floor)
  ["av3-c1", "Bottom of the pile: your Mac's built-in Siri. MOS, just 3.0."],
  ["av3-c2", "Naturalness 60, emotion 40 — robotic. Use it to proofread, never to publish."],

  // Scene 4 — Edge-TTS
  ["av4-c1", "Edge T T S: MOS 4.2, and free. Value pegged at a hundred — unbeatable for mass production."],
  ["av4-c2", "The catch? It's unofficial, with a slight news-anchor tone."],

  // Scene 5 — ChatTTS
  ["av5-c1", "Chat T T S: MOS 4.7. Emotion, a perfect hundred — real breathing and laughter, made for dialogue."],
  ["av5-c2", "The catch? It's open-source, so you self-host it with Python."],

  // Scene 6 — OpenAI TTS
  ["av6-c1", "OpenAI's text-to-speech: MOS 4.5. Speed 90, clean and stable — the developer's pick."],
  ["av6-c2", "It's pay-as-you-go, but cheap, and dead simple to wire into an app."],

  // Scene 7 — ElevenLabs (the champion)
  ["av7-c1", "And the champion: ElevenLabs. MOS 4.8 — the highest here — with naturalness and emotion near a hundred."],
  ["av7-c2", "The catch? It's pay-per-character, so it gets pricey at scale."],

  // Scene 8 — comparison table + champions
  ["av8-c1", "Head to head: ElevenLabs and Chat T T S win on naturalness and emotion."],
  ["av8-c2", "The free tools win on speed and value. Every column has a different champion."],

  // Scene 9 — decision cheat-sheet
  ["av9-c1", "So here's your three-second cheat sheet."],
  ["av9-c2", "Free at scale? Edge. Podcasts? Chat T T S. An app? OpenAI. Pure quality? ElevenLabs."],

  // Scene 10 — closing hook + CTA
  ["av10-c1", "The best A I voice isn't the priciest — it's the one that fits your job."],
  ["av10-c2", "So which one are you picking? Tell me in the comments."],
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
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(7)} ${seconds.toFixed(2)}s   ${text.slice(0, 52)}`);
}

writeFileSync(join(manifestDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${CUES.length} clips → public/vo/ai-voice/  ·  manifest → src/videos/ai-voice-comparison/vo-manifest.json`);
console.log(`  spoken total: ${total.toFixed(1)}s`);
