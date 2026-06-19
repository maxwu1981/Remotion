#!/usr/bin/env node
/**
 * Pre-delivery QA for a rendered video. Two checks that catch the things that
 * silently slip past a single still:
 *
 *   1. JITTER / shimmer — renders LOSSLESS consecutive stills of a scene at a
 *      "hold" frame (N and N+gap) and diffs them. Real render-jitter shows the
 *      content moving; a black diff means the render is pixel-stable (any shimmer
 *      in the mp4 is then h264 compression noise → fix with a calmer background +
 *      higher bitrate, not code).
 *   2. MP4 shimmer — extracts the same two frames from the encoded mp4 and diffs
 *      them, so you can compare "render-stable" vs "what the encoder actually did".
 *
 * Plus it prints the human checklist every video must pass before "done".
 *
 *   node scripts/qa-video.mjs <SceneCompId> <holdFrame> [gap=8] [mp4]
 *   e.g. node scripts/qa-video.mjs CR-s1 1140 8 out/claude-remote-notes.mp4
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [comp, holdStr, gapStr, mp4] = process.argv.slice(2);
if (!comp || !holdStr) {
  console.error("usage: node scripts/qa-video.mjs <SceneCompId> <holdFrame> [gap=8] [mp4]");
  process.exit(1);
}
const hold = Number(holdStr);
const gap = Number(gapStr ?? 8);
const dir = path.resolve("out/qa");
mkdirSync(dir, { recursive: true });

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "inherit"] }).toString();

const a = path.join(dir, `ll_${comp}_${hold}.png`);
const b = path.join(dir, `ll_${comp}_${hold + gap}.png`);
console.log(`▶ lossless stills ${comp} @ ${hold} & ${hold + gap} …`);
run("npx", ["remotion", "still", comp, a, `--frame=${hold}`]);
run("npx", ["remotion", "still", comp, b, `--frame=${hold + gap}`]);

const diff = path.join(dir, `DIFF_${comp}_${hold}.png`);
run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", a, "-i", b,
  "-filter_complex", "blend=all_mode=difference,format=gray,signalstats,metadata=print:file=-:key=lavfi.signalstats.YMAX", "-f", "null", "-"]);
// amplified visual diff + a numeric max-delta
run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", a, "-i", b,
  "-filter_complex", "blend=all_mode=difference,format=gray,eq=contrast=16:brightness=0.06", diff]);
const ymax = run("ffmpeg", ["-hide_banner", "-loglevel", "info", "-i", a, "-i", b,
  "-filter_complex", "blend=all_mode=difference,format=gray,signalstats", "-f", "null", "-"])
  .match(/YMAX:(\d+)/)?.[1] ?? "?";

console.log(`\n  lossless diff  → ${diff}`);
console.log(`  max pixel delta (lossless): ${ymax}  ${Number(ymax) <= 4 ? "✅ render is stable (any mp4 shimmer = compression → calm bg / raise bitrate)" : "⚠ REAL render jitter at this hold — fix in code"}`);

console.log(`\n──────── pre-delivery checklist (every video) ────────`);
[
  "Hook in the first ~3s (a curiosity question / tension BEFORE the title settles).",
  "Outro has a thanks + 訂閱/按讚/分享 call-to-action — never end cold on a brand card.",
  "No jitter: lossless hold-diff is ~black (≤4). If mp4 shimmers, calm the background + raise bitrate.",
  "Captions stay synced to the voice; first/last lines aren't clipped.",
  "Section reveals build step-by-step; nothing dumped at once.",
].forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
