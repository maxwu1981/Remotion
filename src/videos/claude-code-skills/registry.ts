/**
 * Ordered scene registry for the Claude Code Skills 實戰 video.
 * Root.tsx builds the composition from this; Master.tsx stitches the scenes.
 */
import { cover } from "./scenes/Cover";
import { scene1 } from "./scenes/Scene1";
import { scene2 } from "./scenes/Scene2";
import { scene3 } from "./scenes/Scene3";
import { scene4 } from "./scenes/Scene4";
import { scene5 } from "./scenes/Scene5";
import { outro } from "./scenes/Outro";
import type { SceneDef } from "../../shared-skills/types";

export const FPS = 30;

/** Crossfade length between scenes in the master composition. */
export const TRANSITION_FRAMES = 14;

export const SCENES: SceneDef[] = [cover, scene1, scene2, scene3, scene4, scene5, outro];

/** Master length = Σ scene lengths − the overlap each crossfade consumes. */
export const getMovieFrames = (): number => {
  const total = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  return total - TRANSITION_FRAMES * (SCENES.length - 1);
};
