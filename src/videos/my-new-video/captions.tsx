import React from "react";
import { CaptionTrack as Base, Cue } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";

/** Measured voiceover lengths (seconds) for this video. From its VO script. */
const VO = voManifest as Record<string, number>;

export type { Cue };

/** CaptionTrack pre-bound to this video's VO manifest + public/vo/template/. */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <Base cues={cues} vo={VO} voDir="vo/template" />
);
