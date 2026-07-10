import React from "react";
import { CaptionTrack as Base, Cue, ReelCaptionContext } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";
import script from "./script.json";

/** Canonical narration text (id → line). Same text is captioned and (later) spoken. */
const TEXT = script as Record<string, string>;
/** Measured voiceover lengths (seconds). Empty → captions-only fallback. */
const VO = voManifest as Record<string, number>;

const FPS = 30;
const LEAD = 12;
const GAP = 10;
const TAIL = 18;

/** Captions-only fallback length for a line, scaled to its character count. */
const fallbackSeconds = (text: string): number =>
  Math.max(2.2, Math.min(5.2, 0.6 + text.length * 0.135));

export type { Cue };

/** Lay a scene's lines back-to-back; returns timed cues + the scene length they imply. */
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

/** CaptionTrack pre-bound to this video's VO manifest + public/vo/claude-code-skills/. */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const hideBars = React.useContext(ReelCaptionContext);
  return <Base cues={cues} vo={VO} voDir="vo/claude-code-skills" hideBars={hideBars} />;
};
