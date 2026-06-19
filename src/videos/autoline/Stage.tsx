import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, TYPE } from "../../shared-skills/theme";
import { appearUp } from "../../shared-skills/anim";

/** Centered content area that clears the top chrome and bottom caption bar. */
export const Stage: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  pad?: boolean;
}> = ({ children, style, pad = true }) => (
  <AbsoluteFill
    style={{
      padding: pad ? "184px 112px 152px" : 0,
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Big in-stage heading for title beats, with an accent underline. */
export const BeatHeading: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: string;
  align?: "center" | "left";
  startFrame?: number;
  maxWidth?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({
  title,
  subtitle,
  accent = COLORS.remotion,
  align = "center",
  startFrame = 4,
  maxWidth = 1400,
  size = TYPE.h1,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        textAlign: align,
        maxWidth,
        ...appearUp(frame, startFrame, 16, 28),
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: -1,
          color: COLORS.ink,
          lineHeight: 1.08,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 18,
            fontFamily: FONT.ui,
            fontSize: TYPE.h3,
            fontWeight: 500,
            color: COLORS.muted,
            lineHeight: 1.32,
          }}
        >
          {subtitle}
        </div>
      ) : null}
      <div
        style={{
          marginTop: 26,
          height: 5,
          width: 92,
          borderRadius: 3,
          background: accent,
          marginLeft: align === "center" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
        }}
      />
    </div>
  );
};

/** Small uppercase label used above diagrams. */
export const StageLabel: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = COLORS.muted, style }) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontSize: TYPE.tiny,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
