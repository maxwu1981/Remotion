/**
 * Ordered scene registry for this video. Root.tsx builds the composition from
 * this; Master.tsx stitches the scenes. Add scenes to the SCENES array.
 */
import { scene1 } from "./scenes/Scene1";
import { scene2 } from "./scenes/Scene2";
import { scene3 } from "./scenes/Scene3";
import { scene4 } from "./scenes/Scene4";
import { scene5 } from "./scenes/Scene5";
import { scene6 } from "./scenes/Scene6";
import { scene7 } from "./scenes/Scene7";
import { scene8 } from "./scenes/Scene8";
import type { SceneDef } from "../../shared-skills/types";

export const FPS = 30;

/** Crossfade length between scenes in the master composition. */
export const TRANSITION_FRAMES = 14;

export const SCENES: SceneDef[] = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8];

/** Master length = Σ scene lengths − the overlap each crossfade consumes. */
export const getMovieFrames = (): number => {
  const total = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  return total - TRANSITION_FRAMES * (SCENES.length - 1);
};
