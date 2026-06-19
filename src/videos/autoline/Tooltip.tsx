import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { enter, springV } from "../../shared-skills/anim";
import { SparkIcon } from "./mockups/icons";

/**
 * A glassmorphism "knowledge point" card — like a teacher circling a detail on
 * the board. Springs in (with a tiny built-in delay via `from`) so it reads as a
 * layered annotation on top of the diagram it explains. Position it with `style`
 * (absolute left/top/right/bottom); the pop scales from `origin`.
 */
export const Tooltip: React.FC<{
  from: number;
  label: string;
  sub?: string;
  accent?: string;
  width?: number;
  origin?: string;
  style?: React.CSSProperties;
}> = ({
  from,
  label,
  sub,
  accent = COLORS.remotion,
  width,
  origin = "left center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from - 1) {
    return null;
  }
  const s = springV(frame, fps, {
    delay: from,
    damping: 13,
    stiffness: 130,
    mass: 0.8,
  });
  const opacity = enter(frame, from, 7);

  return (
    <div
      style={{
        position: "absolute",
        width,
        opacity,
        transform: `scale(${0.72 + 0.28 * s})`,
        transformOrigin: origin,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "13px 18px 13px 13px",
          borderRadius: RADIUS.md,
          background: "rgba(255,255,255,0.74)",
          border: `1px solid rgba(255,255,255,0.7)`,
          boxShadow: `${SHADOW.lg}, inset 0 1px 0 rgba(255,255,255,0.9)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 11,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 16px ${accent}55`,
          }}
        >
          <SparkIcon size={22} color="#fff" />
        </div>
        <div style={{ lineHeight: 1.2 }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: TYPE.small,
              letterSpacing: -0.2,
              color: COLORS.ink,
            }}
          >
            {label}
          </div>
          {sub ? (
            <div
              style={{
                fontFamily: FONT.ui,
                fontSize: TYPE.tiny,
                color: COLORS.muted,
                marginTop: 3,
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
