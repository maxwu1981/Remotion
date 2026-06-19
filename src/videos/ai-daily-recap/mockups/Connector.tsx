import React from "react";
import { evolvePath } from "@remotion/paths";
import { interpolate } from "remotion";
import { COLORS } from "../../../shared-skills/theme";

/**
 * An animated connector between two absolute points on the 1920×1080 stage.
 * `progress` (0→1) draws the line; the arrowhead fades in as it completes.
 */
export const Connector: React.FC<{
  from: [number, number];
  to: [number, number];
  progress: number;
  color?: string;
  width?: number;
  arrow?: boolean;
  /** perpendicular curvature in px; 0 = straight */
  curve?: number;
  svgW?: number;
  svgH?: number;
}> = ({
  from,
  to,
  progress,
  color = COLORS.borderStrong,
  width = 3,
  arrow = true,
  curve = 0,
  svgW = 1920,
  svgH = 1080,
}) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const evolve = evolvePath(Math.max(0.0001, progress), d);

  const angle = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI;
  const headOpacity = interpolate(progress, [0.82, 0.98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headSize = width * 3.4;

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={evolve.strokeDasharray}
        strokeDashoffset={evolve.strokeDashoffset}
      />
      {arrow ? (
        <g
          transform={`translate(${x2} ${y2}) rotate(${angle})`}
          opacity={headOpacity}
        >
          <path
            d={`M 0 0 L ${-headSize} ${-headSize * 0.62} L ${-headSize * 0.7} 0 L ${-headSize} ${headSize * 0.62} Z`}
            fill={color}
          />
        </g>
      ) : null}
    </svg>
  );
};

/** A small static dotted connector (no draw animation), e.g. for grids/links. */
export const DottedLine: React.FC<{
  from: [number, number];
  to: [number, number];
  color?: string;
  width?: number;
  opacity?: number;
}> = ({ from, to, color = COLORS.borderStrong, width = 2, opacity = 1 }) => (
  <svg
    width={1920}
    height={1080}
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
  >
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color}
      strokeWidth={width}
      strokeDasharray="2 9"
      strokeLinecap="round"
      opacity={opacity}
    />
  </svg>
);
