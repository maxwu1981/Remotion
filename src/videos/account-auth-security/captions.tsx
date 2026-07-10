import React from "react";
import { CaptionTrack as Base, Cue } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";
import script from "./script.json";

/** Canonical narration text (id → line). Same verbatim text is captioned and spoken. */
const TEXT = script as Record<string, string>;
/** Measured voiceover lengths (seconds). Empty → captions-only fallback timing. */
const VO = voManifest as Record<string, number>;

const FPS = 30;
const LEAD = 12;
const GAP = 10;
const TAIL = 18;

/** Captions-only fallback length for a line, scaled to its character count. */
const fallbackSeconds = (text: string): number =>
  Math.max(2.4, Math.min(7.5, 0.7 + text.length * 0.14));

export type { Cue };

/** Look up the verbatim text for a cue id. */
export const lineText = (id: string): string => TEXT[id] ?? id;

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

/** CaptionTrack pre-bound to this video's VO manifest + public/vo/account-auth-security/.
 * hideBars=true always: the TextWall already shows every line on-screen. */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  return <Base cues={cues} vo={VO} voDir="vo/account-auth-security" hideBars />;
};
