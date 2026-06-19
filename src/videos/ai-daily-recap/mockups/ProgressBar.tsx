import React from "react";
import { COLORS, FONT, RADIUS, TYPE } from "../../../shared-skills/theme";

export const ProgressBar: React.FC<{
  progress: number;
  width?: number;
  label?: string;
  color?: string;
  showPercent?: boolean;
  style?: React.CSSProperties;
}> = ({
  progress,
  width = 560,
  label,
  color = COLORS.remotion,
  showPercent = true,
  style,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <div style={{ width, ...style }}>
      {label || showPercent ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 10,
            fontFamily: FONT.mono,
            fontSize: TYPE.tiny,
          }}
        >
          <span style={{ color: COLORS.inkSoft, fontWeight: 600 }}>{label}</span>
          {showPercent ? (
            <span style={{ color, fontWeight: 700 }}>
              {Math.round(p * 100)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        style={{
          height: 16,
          borderRadius: RADIUS.pill,
          background: COLORS.bgAlt,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${p * 100}%`,
            borderRadius: RADIUS.pill,
            background: `linear-gradient(90deg, ${color}, ${COLORS.teal})`,
            boxShadow: `0 0 18px ${color}aa`,
          }}
        />
      </div>
    </div>
  );
};
