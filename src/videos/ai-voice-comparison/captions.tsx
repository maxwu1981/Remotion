import React from "react";
import { CaptionTrack as Base, Cue } from "../../shared-skills/captions";
import voAva from "./vo-manifest.json";
import voChatTTS from "./vo-manifest-chattts.json";

export type { Cue };

export type VoVariantValue = { vo: Record<string, number>; voDir: string };

/** Ava (edge-tts) is the default voice; ChatTTS (seed 23) is the alternate. */
export const AVA_VO: VoVariantValue = { vo: voAva as Record<string, number>, voDir: "vo/ai-voice" };
export const CHATTTS_VO: VoVariantValue = { vo: voChatTTS as Record<string, number>, voDir: "vo/ai-voice-chattts" };

/** Lets a Master swap the whole video's narration source without touching scenes. */
export const VoVariant = React.createContext<VoVariantValue>(AVA_VO);

/** CaptionTrack pre-bound to whichever VO variant is active (defaults to Ava). */
export const Captions: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const { vo, voDir } = React.useContext(VoVariant);
  return <Base cues={cues} vo={vo} voDir={voDir} />;
};
