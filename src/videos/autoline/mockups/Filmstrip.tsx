import React from "react";
import { interpolate, random } from "remotion";
import { RADIUS } from "../../../shared-skills/theme";

const PALETTES = [
  ["#DCE9FF", "#0B84F3"],
  ["#FCE7D6", "#D97757"],
  ["#E5DEFF", "#8B5CF6"],
  ["#D6F5EC", "#1FC7D4"],
  ["#FFE6EC", "#F43F5E"],
];

const MiniFrame: React.FC<{ i: number; w: number; h: number }> = ({
  i,
  w,
  h,
}) => {
  const pal = PALETTES[i % PALETTES.length];
  return (
    <div
      style={{
        width: w,
        height: h,
        background: `linear-gradient(160deg, ${pal[0]}, #fff)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ height: h * 0.22, background: pal[1], opacity: 0.85 }} />
      <div
        style={{
          position: "absolute",
          left: w * 0.12,
          top: h * 0.38,
          width: w * 0.4,
          height: w * 0.4,
          borderRadius: 6,
          background: pal[1],
          opacity: 0.5,
        }}
      />
      {[0, 1, 2].map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: w * 0.58,
            top: h * (0.4 + r * 0.16),
            width: w * (0.3 - r * 0.05) * (0.6 + random(`f${i}-${r}`) * 0.6),
            height: 5,
            borderRadius: 3,
            background: pal[1],
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

/**
 * A film strip that morphs (via `spread` 0→1) from a contiguous, sprocket-holed
 * strip into individual tilted "polaroid" frames — OpenCV slicing.
 */
export const Filmstrip: React.FC<{
  frames?: number;
  cellW?: number;
  cellH?: number;
  spread?: number;
  style?: React.CSSProperties;
}> = ({ frames = 5, cellW = 168, cellH = 104, spread = 0, style }) => {
  const gap = interpolate(spread, [0, 1], [6, 34]);
  const stripPad = interpolate(spread, [0, 1], [16, 6]);
  const stripBg = interpolate(spread, [0, 1], [1, 0]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        padding: `${stripPad}px ${stripPad + 6}px`,
        borderRadius: RADIUS.md,
        background: `rgba(17,19,23,${stripBg})`,
        position: "relative",
        ...style,
      }}
    >
      {/* sprocket holes fade out as the strip "chops" */}
      {[0, 1].map((edge) => (
        <div
          key={edge}
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            top: edge === 0 ? 4 : undefined,
            bottom: edge === 1 ? 4 : undefined,
            height: 6,
            display: "flex",
            justifyContent: "space-between",
            opacity: stripBg,
          }}
        >
          {new Array(frames * 3).fill(0).map((_, k) => (
            <span
              key={k}
              style={{
                width: 8,
                height: 6,
                borderRadius: 2,
                background: "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      ))}

      {new Array(frames).fill(0).map((_, i) => {
        const rot = interpolate(
          spread,
          [0, 1],
          [0, (i - (frames - 1) / 2) * 4],
        );
        const lift = interpolate(spread, [0, 1], [0, -(i % 2 === 0 ? 10 : -6)]);
        const border = interpolate(spread, [0, 1], [0, 6]);
        return (
          <div
            key={i}
            style={{
              transform: `rotate(${rot}deg) translateY(${lift}px)`,
              padding: border,
              paddingBottom: border * 2.2,
              background: "#fff",
              borderRadius: 6,
              boxShadow:
                spread > 0.1
                  ? "0 14px 30px rgba(20,20,43,0.22)"
                  : "0 0 0 rgba(0,0,0,0)",
            }}
          >
            <MiniFrame i={i} w={cellW} h={cellH} />
          </div>
        );
      })}
    </div>
  );
};
