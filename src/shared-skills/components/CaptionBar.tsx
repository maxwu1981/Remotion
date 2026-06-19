import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../theme";

/**
 * Lower subtitle bar, synced to the current beat. Fades in at the start of the
 * beat and out just before it ends (driven by the beat's own local frame).
 */
export const CaptionBar: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();

  const appear = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const disappear = interpolate(
    frame,
    [Math.max(0, durationInFrames - 8), Math.max(1, durationInFrames - 1)],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(appear, disappear);
  const y = interpolate(appear, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 60,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1340,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 28px",
          background: "rgba(255,255,255,0.92)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.pill,
          boxShadow: SHADOW.md,
          backdropFilter: "blur(6px)",
        }}
      >
        <CaptionGlyph />
        <span
          style={{
            fontFamily: FONT.ui,
            fontWeight: 500,
            fontSize: TYPE.body,
            lineHeight: 1.3,
            color: COLORS.inkSoft,
            textAlign: "center",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const CaptionGlyph: React.FC = () => (
  <div
    style={{
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: RADIUS.pill,
      background: COLORS.remotion,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        fill="#fff"
      />
      <path
        d="M16 8.5a4 4 0 0 1 0 7"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  </div>
);
