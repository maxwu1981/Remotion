import React from "react";
import { CaptionTrack as Base, Cue, ReelCaptionContext } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";
import script from "./script.json";

/** Canonical narration text (id → line). Same text is captioned and (later) spoken. */
const TEXT = script as Record<string, string>;
/**
 * Measured voiceover lengths (seconds). Empty for now → the project renders
 * captions-only (no missing-audio errors). To add narration later: generate one
 * mp3 per cue id into public/vo/git-commit-push-guide/ and fill this manifest.
 */
const VO = voManifest as Record<string, number>;

const FPS = 30;
const LEAD = 12; // frames of quiet before the first line
const GAP = 10; // breath between lines
const TAIL = 18; // hold after the last line

/**
 * Captions-only fallback length for a line, scaled to its character count so a
 * long line gets the seconds it needs to be read at a calm pace (~6 chars/sec)
 * and a short line isn't left lingering. Replaced per-line by the measured VO
 * length once narration is generated.
 */
const fallbackSeconds = (text: string): number =>
  Math.max(2.2, Math.min(5.0, 0.6 + text.length * 0.135));

export type { Cue };

/**
 * Lay a scene's lines back-to-back, each lasting its measured VO length (or a
 * fixed fallback while captions-only), so narration never overruns the next line.
 * Returns the timed cues plus the scene length they imply (floored by `minDur`
 * so late visual beats always have room).
 */
export function buildScene(
  ids: string[],
  opts: { lead?: number; gap?: number; tail?: number; minDur?: number } = {},
): { cues: Cue[]; dur: number } {
  const lead = opts.lead ?? LEAD;
  const gap = opts.gap ?? GAP;
  const tail = opts.tail ?? TAIL;
  let t = lead;
  const cues: Cue[] = ids.map((id) => {
    const text = TEXT[id] ?? id;
    const frames = Math.ceil((VO[id] ?? fallbackSeconds(text)) * FPS);
    const cue: Cue = { id, text, from: t, dur: frames };
    t += frames + gap;
    return cue;
  });
  const dur = Math.max(t - gap + tail, opts.minDur ?? 0);
  return { cues, dur };
}

/** CaptionTrack pre-bound to this video's VO manifest + public/vo/git-commit-push-guide/. */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const hideBars = React.useContext(ReelCaptionContext);
  return <Base cues={cues} vo={VO} voDir="vo/git-commit-push-guide" hideBars={hideBars} />;
};
