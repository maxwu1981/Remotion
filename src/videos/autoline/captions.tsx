import React from "react";
import { CaptionTrack as Base, Cue } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";

/** Measured AutoLine voiceover lengths (seconds), from `npm run vo`. */
const VO = voManifest as Record<string, number>;

export type { Cue };

/** CaptionTrack pre-bound to the AutoLine VO manifest + public/vo/. */
export const CaptionTrack: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <Base cues={cues} vo={VO} voDir="vo" />
);
