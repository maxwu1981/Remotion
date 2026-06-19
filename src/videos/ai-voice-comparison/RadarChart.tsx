import React from "react";
import { COLORS, FONT } from "../../shared-skills/theme";

export type RadarSeries = { label: string; color: string; values: number[] };

/**
 * Polygon radar for N axes and one or more series (so a single tool, or all five
 * overlaid). `progress` (0→1) animates the polygons growing from the center.
 */
export const RadarChart: React.FC<{
  axes: string[];
  series: RadarSeries[];
  size?: number;
  max?: number;
  progress?: number;
  showLabels?: boolean;
}> = ({ axes, series, size = 420, max = 100, progress = 1, showLabels = true }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.35;
  const N = axes.length;
  const ang = (i: number) => -Math.PI / 2 + (i / N) * Math.PI * 2;
  const pt = (i: number, vNorm: number): [number, number] => [
    cx + R * vNorm * Math.cos(ang(i)),
    cy + R * vNorm * Math.sin(ang(i)),
  ];
  const poly = (vals: number[], scale: number) =>
    vals.map((v, i) => pt(i, (v / max) * scale).join(",")).join(" ");
  const ring = (f: number) => axes.map((_, i) => pt(i, f).join(",")).join(" ");

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {/* grid rings */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" stroke={COLORS.border} strokeWidth={1.2} />
      ))}
      {/* spokes */}
      {axes.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={COLORS.border} strokeWidth={1.2} />;
      })}
      {/* axis labels */}
      {showLabels &&
        axes.map((a, i) => {
          const [x, y] = pt(i, 1.18);
          return (
            <text
              key={a}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={FONT.mono}
              fontSize={size * 0.045}
              fontWeight={700}
              fill={COLORS.muted}
            >
              {a}
            </text>
          );
        })}
      {/* series */}
      {series.map((s) => (
        <g key={s.label}>
          <polygon points={poly(s.values, progress)} fill={`${s.color}2E`} stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" />
          {s.values.map((v, i) => {
            const [x, y] = pt(i, (v / max) * progress);
            return <circle key={i} cx={x} cy={y} r={size * 0.012} fill={s.color} />;
          })}
        </g>
      ))}
    </svg>
  );
};
