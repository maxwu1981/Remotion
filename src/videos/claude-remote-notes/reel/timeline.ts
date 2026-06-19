/**
 * A GLOBAL caption track for the vertical reel, rebuilt from the exact same single
 * sources the landscape scenes use — `script.json` (text) + `vo-manifest.json`
 * (measured VO lengths) + the registry's scene durations. Because every scene lays
 * its cues with the same `buildScene` rule and the master stitches them in a
 * TransitionSeries, we can reproduce each cue's global frame precisely:
 *
 *   globalFrom = sceneStart + localFrom
 *   sceneStart(k) = Σ dur(i<k) − k · TRANSITION   (TransitionSeries overlap)
 *
 * So the big reel captions track the voice frame-for-frame, with nothing to keep in
 * sync by hand. No scene edits. (Cue ids carry the scene id as a prefix — "cv-c1",
 * "s3-c2", "ot-c1" — and the cover scene uses lead 8 while the rest use lead 14.)
 */
import type { Cue } from "../captions";
import { SCENES, FPS, TRANSITION_FRAMES } from "../registry";
import voManifest from "../vo-manifest.json";
import script from "../script.json";

const VO = voManifest as Record<string, number>;
const TEXT = script as Record<string, string>;

const GAP = 10; // every scene's buildScene default
const FALLBACK = 3.0;

/** Per-scene lead — must match each scene's buildScene(..., { lead }). */
const leadFor = (sceneId: string): number => (sceneId === "cv" ? 8 : 14);

/** Lay one scene's cues back-to-back at their measured VO length (scene-local). */
const localCues = (ids: string[], lead: number): Cue[] => {
  let t = lead;
  return ids.map((id) => {
    const frames = Math.ceil((VO[id] ?? FALLBACK) * FPS);
    const cue: Cue = { id, text: TEXT[id] ?? id, from: t, dur: frames };
    t += frames + GAP;
    return cue;
  });
};

/** Cue ids belonging to a scene, in script order (ids look like "s3-c2"). */
const idsForScene = (sceneId: string): string[] =>
  Object.keys(TEXT).filter((id) => id.startsWith(`${sceneId}-`));

/** Flat, master-timeline caption list for the whole reel. */
export const REEL_CUES: Cue[] = (() => {
  const out: Cue[] = [];
  let start = 0;
  for (const s of SCENES) {
    for (const c of localCues(idsForScene(s.id), leadFor(s.id))) {
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
