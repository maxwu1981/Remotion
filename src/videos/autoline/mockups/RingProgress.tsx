import React from "react";
import { COLORS, FONT } from "../../../shared-skills/theme";

/**
 * A techy circular progress ring with a percentage readout in the middle.
 * The arc is a gradient stroke (accent → teal) with a soft glow.
 */
export const RingProgress: React.FC<{
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  gradientId?: string;
}> = ({
  progress,
  size = 320,
  stroke = 22,
  color = COLORS.remotion,
  label,
  sublabel,
  gradientId = "ring-grad",
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={COLORS.teal} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={COLORS.bgAlt}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - p)}
          style={{ filter: `drop-shadow(0 0 12px ${color}aa)` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: size * 0.26,
            letterSpacing: -2,
            color: COLORS.ink,
            lineHeight: 1,
          }}
        >
          {Math.round(p * 100)}
          <span style={{ fontSize: size * 0.12, color: COLORS.muted }}>%</span>
        </div>
        {label ? (
          <div
            style={{
              marginTop: 8,
              fontFamily: FONT.mono,
              fontSize: size * 0.05,
              fontWeight: 700,
              letterSpacing: 1,
              color,
            }}
          >
            {label}
          </div>
        ) : null}
        {sublabel ? (
          <div
            style={{
              marginTop: 2,
              fontFamily: FONT.ui,
              fontSize: size * 0.042,
              color: COLORS.muted,
            }}
          >
            {sublabel}
          </div>
        ) : null}
      </div>
    </div>
  );
};
