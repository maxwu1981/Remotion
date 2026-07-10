/**
 * Ordered scene registry for this video. Root.tsx builds the composition from
 * this; Master.tsx stitches the scenes. Add scenes to the SCENES array.
 */
import { scene1 } from "./scenes/Scene1";
import { roadmap } from "./scenes/Roadmap";
import { promptGem } from "./scenes/PromptGem";
import type { SceneDef } from "../../shared-skills/types";

export const FPS = 30;

/** Crossfade length between scenes in the master composition. */
export const TRANSITION_FRAMES = 14;

/**
 * scene1 = your Hook/Cover. roadmap + promptGem are pre-wired, reusable
 * "world-class skeleton" pieces (see shared-skills/components/): Roadmap goes
 * right after the cover, PromptGem right before your Outro. Add your content
 * scenes between them; add your own Outro at the end (not templated here —
 * every video's CTA card is different).
 */
export const SCENES: SceneDef[] = [scene1, roadmap, promptGem];

/** Master length = Σ scene lengths − the overlap each crossfade consumes. */
export const getMovieFrames = (): number => {
  const total = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  return total - TRANSITION_FRAMES * (SCENES.length - 1);
};
