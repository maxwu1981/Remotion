import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

/**
 * Sound design layer. Files live at the root of public/ (see scripts/make-sfx.mjs
 * for the synthesized placeholders — swap them for real assets, same filenames).
 *
 * <Sfx> delays a one-shot to a precise frame by wrapping it in a <Sequence>, so a
 * cue lines up *exactly* with the visual beat it punctuates. `at` is relative to
 * the enclosing sequence (i.e. scene-local frames).
 */
export const SFX = {
  pop: "ui-pop.mp3", // title / tooltip pop-in
  whoosh: "soft-whoosh.mp3", // flow lines, panels sliding in
  ding: "clean-ding.mp3", // tool-card focus
  typing: "typing.mp3", // terminal + JSON keystrokes
  processing: "digital-processing.mp3", // AI module crunching
  cash: "cash-register.mp3", // ROI total
} as const;

export type SfxName = keyof typeof SFX;

export const Sfx: React.FC<{
  src: SfxName | string;
  at: number;
  volume?: number;
  durationInFrames?: number;
  playbackRate?: number;
}> = ({ src, at, volume = 0.6, durationInFrames = 90, playbackRate }) => {
  const file = (SFX as Record<string, string>)[src] ?? src;
  return (
    <Sequence
      from={Math.round(at)}
      durationInFrames={durationInFrames}
      layout="none"
      name={`sfx · ${file}`}
    >
      <Audio src={staticFile(file)} volume={volume} playbackRate={playbackRate} />
    </Sequence>
  );
};

/** Background music bed, looped under the whole piece at a low ducked level. */
export const Bgm: React.FC<{ volume?: number; src?: string }> = ({
  volume = 0.15,
  src = SFX_BGM,
}) => <Audio src={staticFile(src)} volume={volume} loop />;

const SFX_BGM = "bgm.mp3";
