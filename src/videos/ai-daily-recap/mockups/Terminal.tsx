import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, TYPE } from "../../../shared-skills/theme";

export type TermOut = { text: string; color?: string; at: number };

/**
 * A glowing dark terminal. Types `command` out character-by-character (string
 * slicing, never per-char opacity), then reveals `output` lines at their frames.
 */
export const Terminal: React.FC<{
  command: string;
  prompt?: string;
  startFrame?: number;
  typeFrames?: number;
  output?: TermOut[];
  title?: string;
  width?: number;
  minHeight?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({
  command,
  prompt = "autoline",
  startFrame = 8,
  typeFrames,
  output = [],
  title = "zsh — autoline",
  width = 880,
  minHeight = 300,
  accent = COLORS.remotion,
  style,
}) => {
  const frame = useCurrentFrame();
  const dur = typeFrames ?? Math.max(18, command.length * 1.7);
  const chars = Math.floor(
    interpolate(frame, [startFrame, startFrame + dur], [0, command.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typed = command.slice(0, chars);
  const doneTyping = chars >= command.length;
  const cursorOn = Math.floor(frame / 16) % 2 === 0;

  return (
    <div
      style={{
        width,
        minHeight,
        background: `linear-gradient(180deg, ${COLORS.term.bgTop} 0%, ${COLORS.term.bg} 14%)`,
        borderRadius: RADIUS.lg,
        boxShadow: `0 40px 90px ${accent}33, 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)`,
        overflow: "hidden",
        fontFamily: FONT.mono,
        ...style,
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 18px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span
            key={c}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 12,
            color: COLORS.term.dim,
            fontSize: TYPE.micro,
            letterSpacing: 0.4,
          }}
        >
          {title}
        </span>
      </div>

      {/* body */}
      <div style={{ padding: "22px 26px", fontSize: TYPE.small, lineHeight: 1.7 }}>
        <div style={{ display: "flex", whiteSpace: "pre" }}>
          <span style={{ color: COLORS.term.prompt }}>{prompt}</span>
          <span style={{ color: COLORS.term.blue }}>{" ❯ "}</span>
          <span style={{ color: COLORS.term.text }}>{typed}</span>
          <span
            style={{
              opacity: !doneTyping || cursorOn ? 1 : 0,
              color: COLORS.term.text,
              marginLeft: 1,
            }}
          >
            ▋
          </span>
        </div>

        {output.map((line, i) => {
          if (frame < line.at) return null;
          const op = interpolate(frame, [line.at, line.at + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                color: line.color ?? COLORS.term.dim,
                opacity: op,
                whiteSpace: "pre-wrap",
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
