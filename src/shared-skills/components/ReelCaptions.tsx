import React from "react";
import { Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW } from "../theme";
import type { Cue } from "../captions";

/**
 * One big caption line, vertically centred in the reel's lower third. Frame-based
 * fade + lift (no CSS transitions). Sized for muted phone viewing — reels are
 * mostly watched without sound, so the words have to carry the video.
 *
 * Shared across every video's vertical reel: pass the global cue track + accent.
 */
const ReelLine: React.FC<{ text: string; dur: number; accent: string }> = ({ text, dur, accent }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const disappear = interpolate(frame, [Math.max(0, dur - 9), Math.max(1, dur - 1)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(appear, disappear);
  const y = interpolate(appear, [0, 1], [22, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 18px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          padding: "40px 46px",
          background: "rgba(255,255,255,0.86)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.lg,
          boxShadow: SHADOW.md,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            width: 64,
            height: 6,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.remotion}, ${accent})`,
          }}
        />
        <span
          style={{
            fontFamily: FONT.uiCjk,
            fontWeight: 800,
            fontSize: 50,
            lineHeight: 1.42,
            letterSpacing: -0.5,
            color: COLORS.ink,
            textAlign: "center",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * Lays the whole reel's caption track. Each line persists until the next one starts
 * (no gaps) so a muted viewer always has something to read. Place inside a
 * positioned container (the lower third) — the lines fill it.
 */
export const ReelCaptions: React.FC<{ cues: Cue[]; accent?: string }> = ({
  cues,
  accent = COLORS.remotion,
}) => (
  <>
    {cues.map((c, i) => {
      const next = cues[i + 1];
      const dur = Math.max(20, next ? next.from - c.from : c.dur + 36);
      return (
        <Sequence key={c.id} from={c.from} durationInFrames={dur} layout="none" name={`reel-cap · ${c.id}`}>
          <ReelLine text={c.text} dur={dur} accent={accent} />
        </Sequence>
      );
    })}
  </>
);
