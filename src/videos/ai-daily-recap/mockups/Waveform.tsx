import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { COLORS } from "../../../shared-skills/theme";

/**
 * Synthesized audio waveform — deterministic bar heights from a seed, with an
 * optional live wiggle and a left-to-right reveal driven by `revealProgress`.
 */
export const Waveform: React.FC<{
  seed?: string;
  bars?: number;
  width?: number;
  height?: number;
  color?: string;
  color2?: string;
  revealProgress?: number;
  live?: boolean;
  style?: React.CSSProperties;
}> = ({
  seed = "wave",
  bars = 48,
  width = 520,
  height = 120,
  color = COLORS.remotion,
  color2,
  revealProgress = 1,
  live = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const barW = width / bars;
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        gap: barW * 0.34,
        ...style,
      }}
    >
      {new Array(bars).fill(0).map((_, i) => {
        const base = 0.18 + random(`${seed}-${i}`) * 0.82;
        const wig = live ? 0.62 + 0.38 * Math.sin(frame / 5 + i * 0.7) : 1;
        const h = Math.max(0.06, base * wig) * height;
        const shown = i / bars <= revealProgress;
        const op = shown
          ? interpolate(
              revealProgress,
              [i / bars, i / bars + 0.04],
              [0.25, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          : 0.12;
        const c = color2 && i % 2 === 0 ? color2 : color;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: barW,
              background: c,
              opacity: op,
            }}
          />
        );
      })}
    </div>
  );
};
