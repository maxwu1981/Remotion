import React from "react";
import { CaptionTrack as Base, Cue, ReelCaptionContext } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";
import script from "./script.json";

/** Canonical narration text (id → line). Same text is captioned and spoken. */
const TEXT = script as Record<string, string>;
/** Measured voiceover lengths (seconds). Written by scripts/make-vo-recap.mjs. */
const VO = voManifest as Record<string, number>;

const FPS = 30;
const LEAD = 14; // frames of quiet before the first line
const GAP = 12; // breath between lines
const TAIL = 24; // hold after the last line
const FALLBACK = 3.4; // per-line seconds when no VO exists yet (captions-only preview)

export type { Cue };

/**
 * Lay a scene's lines back-to-back, each lasting its measured VO length, so the
 * narration plays at a natural pace and never overruns the next line. Returns the
 * timed cues plus the scene length they imply (floored by `minDur`). With an empty
 * manifest it falls back to a fixed length, so the project still previews before VO.
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
    const frames = Math.ceil((VO[id] ?? FALLBACK) * FPS);
    const cue: Cue = { id, text: TEXT[id] ?? id, from: t, dur: frames };
    t += frames + gap;
    return cue;
  });
  const dur = Math.max(t - gap + tail, opts.minDur ?? 0);
  return { cues, dur };
}

/** CaptionTrack pre-bound to this video's VO manifest + public/vo/ai-daily-recap/. */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const hideBars = React.useContext(ReelCaptionContext);
  return <Base cues={cues} vo={VO} voDir="vo/ai-daily-recap" hideBars={hideBars} />;
};
