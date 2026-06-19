import React from "react";
import { CaptionTrack, Cue } from "../../shared-skills/captions";
import voManifest from "./vo-manifest.json";

/** Measured Auto-Upload voiceover lengths (seconds), from `npm run vo:upload`. */
const UPLOAD_VO = voManifest as Record<string, number>;

export type { Cue };

/** CaptionTrack pre-bound to the Auto-Upload VO manifest + public/vo/upload/. */
export const UploadCaptions: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <CaptionTrack cues={cues} vo={UPLOAD_VO} voDir="vo/upload" />
);
