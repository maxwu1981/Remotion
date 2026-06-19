/**
 * A GLOBAL caption track for the vertical reel, rebuilt from the same single
 * sources the landscape scenes use — script.json (text) + vo-manifest.json
 * (measured VO) + the registry's scene durations. Each cue's global frame is
 * reproduced with the same lay-out rule each scene's buildScene uses, so the big
 * reel captions track the voice frame-for-frame with no manual sync.
 *
 *   globalFrom = sceneStart + localFrom
 *   sceneStart(k) = Σ dur(i<k) − k · TRANSITION   (TransitionSeries overlap)
 */
import type { Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";
import { SCENES, FPS, TRANSITION_FRAMES } from "../registry";
import voManifest from "../vo-manifest.json";
import script from "../script.json";

const VO = voManifest as Record<string, number>;
const TEXT = script as Record<string, string>;

// Must match every scene's buildScene defaults (gap 12, fallback 3.4) and the
// per-scene lead (cover/outro use lead 10, all sections use the default 14).
const GAP = 12;
const FALLBACK = 3.4;

const sceneInfo = (s: SceneDef): { prefix: string; lead: number } => {
  if (s.id === "cover") return { prefix: "cov-", lead: 10 };
  if (s.id === "outro") return { prefix: "out-", lead: 10 };
  return { prefix: `${s.id}-`, lead: 14 };
};

const idsFor = (prefix: string): string[] => Object.keys(TEXT).filter((k) => k.startsWith(prefix));

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

/** Flat, master-timeline caption list for the whole reel. */
export const REEL_CUES: Cue[] = (() => {
  const out: Cue[] = [];
  let start = 0;
  for (const s of SCENES) {
    const { prefix, lead } = sceneInfo(s);
    for (const c of localCues(idsFor(prefix), lead)) {
      out.push({ ...c, from: c.from + start });
    }
    start += s.durationInFrames - TRANSITION_FRAMES;
  }
  return out;
})();

export type SceneSpan = { id: string; kicker: string; accent: string; from: number };

/** Where each scene begins on the master timeline — drives the live section chip. */
export const SCENE_SPANS: SceneSpan[] = (() => {
  const spans: SceneSpan[] = [];
  let start = 0;
  for (const s of SCENES) {
    spans.push({ id: s.id, kicker: s.kicker, accent: s.accent, from: start });
    start += s.durationInFrames - TRANSITION_FRAMES;
  }
  return spans;
})();
