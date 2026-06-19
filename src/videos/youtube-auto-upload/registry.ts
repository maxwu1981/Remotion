/**
 * Ordered registry of the nine Auto-Upload sequences. Root.tsx builds
 * compositions from this and Master.tsx stitches them together. Each scene
 * owns its own length, timed to the measured voiceover.
 */
import { scene1 } from "./scenes/Scene1";
import { scene2 } from "./scenes/Scene2";
import { scene3 } from "./scenes/Scene3";
import { scene4 } from "./scenes/Scene4";
import { scene5 } from "./scenes/Scene5";
import { scene6 } from "./scenes/Scene6";
import { scene7 } from "./scenes/Scene7";
import { scene8 } from "./scenes/Scene8";
import { scene9 } from "./scenes/Scene9";
import type { SceneDef } from "../../shared-skills/types";

export const UPLOAD_FPS = 30;

/** Crossfade length between sequences in the master composition. */
export const UPLOAD_TRANSITION_FRAMES = 14;

export const UPLOAD_SCENES: SceneDef[] = [
  scene1,
  scene2,
  scene3,
  scene4,
  scene5,
  scene6,
  scene7,
  scene8,
  scene9,
];

/** Master length = Σ scene lengths − the overlap each crossfade consumes. */
export const getUploadMovieFrames = (): number => {
  const total = UPLOAD_SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  return total - UPLOAD_TRANSITION_FRAMES * (UPLOAD_SCENES.length - 1);
};
