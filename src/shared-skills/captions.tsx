import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { CaptionBar } from "./components/CaptionBar";
import { Narration } from "./components/Narration";

/** A single subtitle cue, timed in scene-local frames. */
export type Cue = { id: string; text: string; from: number; dur: number };

/**
 * When true, scenes still play their narration audio but skip the on-screen
 * caption bar. The vertical reel turns this on so the small baked-in subtitles
 * don't compete with the large mobile-legible captions it overlays itself.
 */
export const ReelCaptionContext = React.createContext(false);

/**
 * Lays a scene's subtitle cues onto the timeline. When a voiceover clip exists,
 * the line plays its full measured length and the caption tracks it — but both
 * are clamped to the gap before the next cue, so neither the voice nor the
 * caption ever overlaps the following line. The cue's `from` keeps it locked to
 * the visuals.
 *
 * Shared across every video: each one supplies its own measured `vo` manifest
 * and its own `public/<voDir>/` folder (usually via a thin per-video wrapper).
 */
export const CaptionTrack: React.FC<{
  cues: Cue[];
  vo?: Record<string, number>;
  voDir?: string;
  /** Render narration audio only, no caption bars (used by the vertical reel). */
  hideBars?: boolean;
}> = ({ cues, vo = {}, voDir = "vo", hideBars = false }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((c, i) => {
        const voSeconds = vo[c.id];
        const voFrames = voSeconds ? Math.ceil(voSeconds * fps) : 0;
        const next = cues[i + 1];
        const gap = next ? next.from - c.from : Number.POSITIVE_INFINITY;
        const cap = Number.isFinite(gap) ? gap - 2 : Number.POSITIVE_INFINITY;

        const capDur = Math.max(
          20,
          Math.min(voFrames > 0 ? voFrames + 10 : c.dur, cap),
        );
        const voDur = Math.min(voFrames + 8, Number.isFinite(gap) ? gap - 1 : voFrames + 8);

        return (
          <React.Fragment key={c.id}>
            {voFrames > 0 ? (
              <Sequence from={c.from} durationInFrames={voDur} layout="none" name={`vo · ${c.id}`}>
                <Narration id={c.id} dir={voDir} />
              </Sequence>
            ) : null}
            {hideBars ? null : (
              <Sequence from={c.from} durationInFrames={capDur} layout="none" name={`caption · ${c.id}`}>
                <CaptionBar text={c.text} durationInFrames={capDur} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
