/**
 * Ordered scene registry for this video. Root.tsx builds the composition from
 * this; Master.tsx stitches the scenes. Add scenes to the SCENES array.
 */
import { scene1 } from "./scenes/Scene1";
import type { SceneDef } from "../../shared-skills/types";

export const FPS = 30;

/** Crossfade length between scenes in the master composition. */
export const TRANSITION_FRAMES = 14;

export const SCENES: SceneDef[] = [scene1];

/** Master length = Σ scene lengths − the overlap each crossfade consumes. */
export const getMovieFrames = (): number => {
  const total = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  return total - TRANSITION_FRAMES * (SCENES.length - 1);
};
