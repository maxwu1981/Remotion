import React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

/**
 * Drop-in voiceover slot, keyed by caption-cue id. Voiceover is OFF by default so
 * the project previews/renders with captions + SFX only. To add narration later:
 *   1. generate one mp3 per cue id into  public/vo/<id>.mp3
 *   2. flip NARRATION_ENABLED to true
 * Each cue already sits in its own <Sequence>, so the audio lands in sync with its
 * caption with no extra wiring.
 */
export const NARRATION_ENABLED = true;

export const Narration: React.FC<{ id: string; volume?: number; dir?: string }> = ({
  id,
  volume = 1,
  dir = "vo",
}) => {
  if (!NARRATION_ENABLED) {
    return null;
  }
  return <Audio src={staticFile(`${dir}/${id}.mp3`)} volume={volume} />;
};
