/**
 * A GLOBAL caption track for the vertical reel, rebuilt from the exact same single
 * sources the landscape scenes use — `script.json` (text) + `vo-manifest.json`
 * (measured VO lengths) + the registry's scene durations. Because every scene lays
 * its cues with the same `buildScene` rule (lead 14, gap 10) and the master stitches
 * them in a TransitionSeries, we can reproduce each cue's global frame precisely:
 *
 *   globalFrom = sceneStart + localFrom         (localFrom from the same lay-out rule)
 *   sceneStart(k) = Σ dur(i<k) − k · TRANSITION  (TransitionSeries overlap)
 *
 * So the big reel captions track the voice frame-for-frame, and there is nothing to
 * keep in sync by hand — change a scene's timing and this follows. No scene edits.
 */
import type { Cue } from "../captions";
import { SCENES, FPS, TRANSITION_FRAMES } from "../registry";
import voManifest from "../vo-manifest.json";
import script from "../script.json";

const VO = voManifest as Record<string, number>;
const TEXT = script as Record<string, string>;

// Must match every scene's buildScene(..., { lead: 14 }) and the captions defaults.
const LEAD = 14;
const GAP = 10;
const FALLBACK = 2.6;

/** Lay one scene's cues back-to-back at their measured VO length (scene-local). */
const localCues = (ids: string[]): Cue[] => {
  let t = LEAD;
  return ids.map((id) => {
    const frames = Math.ceil((VO[id] ?? FALLBACK) * FPS);
    const cue: Cue = { id, text: TEXT[id] ?? id, from: t, dur: frames };
    t += frames + GAP;
    return cue;
  });
};

/** Cue ids belonging to a scene, in order (ids look like "s3-c2"). */
const idsForScene = (index: number): string[] =>
  Object.keys(TEXT).filter((id) => id.startsWith(`s${index}-`));

/** Flat, master-timeline caption list for the whole reel. */
export const REEL_CUES: Cue[] = (() => {
  const out: Cue[] = [];
  let start = 0;
  for (const s of SCENES) {
    for (const c of localCues(idsForScene(s.index))) {
      out.push({ ...c, from: c.from + start });
    }
    start += s.durationInFrames - TRANSITION_FRAMES;
  }
  return out;
})();

export type SceneSpan = { index: number; kicker: string; accent: string; from: number };

/** Where each scene begins on the master timeline — drives the live section chip. */
export const SCENE_SPANS: SceneSpan[] = (() => {
  const spans: SceneSpan[] = [];
  let start = 0;
  for (const s of SCENES) {
    spans.push({ index: s.index, kicker: s.kicker, accent: s.accent, from: start });
    start += s.durationInFrames - TRANSITION_FRAMES;
  }
  return spans;
})();
