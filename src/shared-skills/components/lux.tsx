import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { COLORS, FONT, TYPE } from "../theme";

/* ============================================================ glass card === */

export const GlassPanel: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  tint?: string;
  glow?: string;
  glowAmt?: number;
}> = ({ children, style, radius = 26, tint, glow, glowAmt = 0 }) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      background: tint
        ? `linear-gradient(155deg, ${tint}26 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.42) 100%)`
        : "linear-gradient(155deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0.4) 100%)",
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: glow
        ? `0 30px 60px -22px rgba(30,40,70,0.28), 0 0 0 1px ${glow}${glowAmt > 0.5 ? "55" : "22"}, 0 0 ${30 + glowAmt * 60}px ${glow}${glowAmt > 0.3 ? "55" : "22"}, inset 0 1px 0 rgba(255,255,255,0.95)`
        : "0 30px 60px -22px rgba(30,40,70,0.26), 0 8px 22px rgba(30,40,70,0.07), inset 0 1px 0 rgba(255,255,255,0.95)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      overflow: "hidden",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {/* glossy top-left reflection */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(150deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 36%)",
        pointerEvents: "none",
      }}
    />
    <div style={{ position: "relative", height: "100%" }}>{children}</div>
  </div>
);

/* ========================================================== coil spring === */

export const CoilSpring: React.FC<{
  width?: number;
  coils?: number;
  ringH?: number;
  compress?: number;
  style?: React.CSSProperties;
}> = ({ width = 96, coils = 6, ringH = 15, compress = 0, style }) => {
  const rawId = React.useId().replace(/:/g, "-");
  const rx = width / 2 - 7;
  const spacing = ringH * (1 - 0.38 * compress);
  const top = 8;
  const height = top + spacing * coils + 22;

  return (
    <svg width={width} height={height} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`chrome-${rawId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7E889A" />
          <stop offset="22%" stopColor="#C9D2DE" />
          <stop offset="50%" stopColor="#F6F9FC" />
          <stop offset="78%" stopColor="#AEB8C6" />
          <stop offset="100%" stopColor="#828C9C" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse
        cx={width / 2}
        cy={height - 6}
        rx={rx * 0.92}
        ry={7}
        fill="rgba(30,40,70,0.16)"
      />

      {/* coils, back-to-front */}
      {new Array(coils).fill(0).map((_, i) => {
        const cy = top + spacing * i + 6;
        return (
          <g key={i}>
            <ellipse
              cx={width / 2}
              cy={cy}
              rx={rx}
              ry={9}
              fill="none"
              stroke={`url(#chrome-${rawId})`}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <ellipse
              cx={width / 2}
              cy={cy - 1.6}
              rx={rx}
              ry={9}
              fill="none"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth={1.6}
            />
          </g>
        );
      })}

      {/* top cap the card sits on */}
      <ellipse
        cx={width / 2}
        cy={top}
        rx={rx + 2}
        ry={6}
        fill={`url(#chrome-${rawId})`}
      />
    </svg>
  );
};

/* ============================================================== platform === */

export const Platform: React.FC<{
  width?: number;
  depth?: number;
  tilt?: number;
  style?: React.CSSProperties;
}> = ({ width = 1640, depth = 420, tilt = 32, style }) => (
  <div
    style={{
      position: "absolute",
      width,
      height: depth,
      transform: `perspective(1700px) rotateX(${tilt}deg)`,
      transformOrigin: "center top",
      background: "linear-gradient(180deg, #FFFFFF 0%, #EEF2F8 70%, #E4EAF2 100%)",
      borderRadius: 26,
      boxShadow:
        "0 60px 80px -40px rgba(30,40,70,0.28), inset 0 2px 0 rgba(255,255,255,0.9)",
      border: "1px solid rgba(255,255,255,0.8)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 26,
        background:
          "radial-gradient(ellipse 60% 50% at 50% 18%, rgba(120,150,220,0.10), transparent 70%)",
      }}
    />
  </div>
);

/* ================================================================= ruler === */

export const Ruler: React.FC<{
  width?: number;
  label: string;
  sublabel?: string;
  ticks?: number;
  style?: React.CSSProperties;
}> = ({ width = 1560, label, sublabel, ticks = 16, style }) => (
  <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, ...style }}>
    <div style={{ position: "relative", width: "100%", height: 14 }}>
      <div style={{ position: "absolute", top: 6, left: 0, right: 0, height: 1.5, background: COLORS.borderStrong }} />
      {new Array(ticks + 1).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i / ticks) * 100}%`,
            top: i % 4 === 0 ? 0 : 4,
            width: 1.5,
            height: i % 4 === 0 ? 13 : 7,
            background: COLORS.borderStrong,
          }}
        />
      ))}
    </div>
    <div style={{ textAlign: "center" }}>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small, color: COLORS.inkSoft }}>{label}</span>
      {sublabel ? (
        <div style={{ fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.muted, marginTop: 2 }}>{sublabel}</div>
      ) : null}
    </div>
  </div>
);

/* ========================================================= light stream === */

const quad = (t: number, p0: number, c: number, p1: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p1;

export const LightStream: React.FC<{
  from: [number, number];
  to: [number, number];
  ctrl: [number, number];
  progress?: number;
  color?: string;
  width?: number;
  particles?: number;
  speed?: number;
  particleFrom?: number;
}> = ({
  from,
  to,
  ctrl,
  progress = 1,
  color = COLORS.remotion,
  width = 3,
  particles = 4,
  speed = 70,
  particleFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const d = `M ${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`;
  const ev = evolvePath(Math.max(0.0001, progress), d);
  const flowing = progress >= 0.98 && frame >= particleFrom;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={0.32}
        strokeDasharray={ev.strokeDasharray}
        strokeDashoffset={ev.strokeDashoffset}
      />
      {flowing
        ? new Array(particles).fill(0).map((_, k) => {
            const t = (((frame - particleFrom) / speed + k / particles) % 1 + 1) % 1;
            const x = quad(t, from[0], ctrl[0], to[0]);
            const y = quad(t, from[1], ctrl[1], to[1]);
            const op = Math.sin(Math.PI * t);
            return (
              <circle key={k} cx={x} cy={y} r={5} fill={color} opacity={op} style={{ filter: `drop-shadow(0 0 7px ${color})` }} />
            );
          })
        : null}
    </svg>
  );
};

/* ============================================================= arrow link === */

/**
 * A workflow connector in the style of the reference renders: a curved trail of
 * small dots with a moving highlight flowing toward a solid arrowhead.
 * `progress` (0→1) reveals the trail; the arrowhead fades in as it completes.
 */
export const ArrowLink: React.FC<{
  from: [number, number];
  to: [number, number];
  ctrl?: [number, number];
  progress?: number;
  color?: string;
  arrow?: boolean;
  gap?: number;
  dotR?: number;
  speed?: number;
}> = ({
  from,
  to,
  ctrl,
  progress = 1,
  color = COLORS.remotion,
  arrow = true,
  gap = 16,
  dotR = 2.8,
  speed = 46,
}) => {
  const frame = useCurrentFrame();
  const c = ctrl ?? [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const approxLen =
    Math.hypot(c[0] - from[0], c[1] - from[1]) + Math.hypot(to[0] - c[0], to[1] - c[1]);
  const count = Math.max(6, Math.floor(approxLen / gap));
  const head = (((frame / speed) % 1) + 1) % 1;

  const dots: { x: number; y: number; op: number }[] = [];
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    if (t > progress) break;
    const d = Math.min(Math.abs(t - head), 1 - Math.abs(t - head));
    dots.push({
      x: quad(t, from[0], c[0], to[0]),
      y: quad(t, from[1], c[1], to[1]),
      op: 0.4 + 0.6 * Math.exp(-(d * d) / 0.008),
    });
  }
  const ang = (Math.atan2(2 * (to[1] - c[1]), 2 * (to[0] - c[0])) * 180) / Math.PI;
  const headOp = interpolate(progress, [0.86, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sz = 12;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={dotR} fill={color} opacity={p.op} />
      ))}
      {arrow && progress > 0.05 ? (
        <g transform={`translate(${to[0]} ${to[1]}) rotate(${ang})`} opacity={headOp}>
          <path d={`M3 0 L ${-sz} ${-sz * 0.6} L ${-sz * 0.5} 0 L ${-sz} ${sz * 0.6} Z`} fill={color} />
        </g>
      ) : null}
    </svg>
  );
};

/* ============================================================= browser 3D === */

export const Window3D: React.FC<{
  command?: string;
  caretAt?: number;
  width?: number;
  height?: number;
  rotateY?: number;
  accent?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  command,
  caretAt,
  width = 460,
  height = 260,
  rotateY = 0,
  accent = COLORS.remotion,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const cursorOn = Math.floor(frame / 16) % 2 === 0;
  return (
    <div
      style={{
        width,
        height,
        transform: `perspective(1600px) rotateY(${rotateY}deg) rotateX(3deg)`,
        transformStyle: "preserve-3d",
        borderRadius: 18,
        background: "#FBFCFE",
        boxShadow:
          "0 50px 90px -30px rgba(30,45,90,0.4), 0 12px 30px rgba(30,45,90,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.9)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 18px",
          background: `linear-gradient(180deg, ${accent}1c, ${accent}10)`,
          borderBottom: `1px solid ${accent}22`,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div
        style={{
          height: height - 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {command !== undefined ? (
          <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 40, color: COLORS.ink, whiteSpace: "pre" }}>
            <span style={{ color: accent }}>$ </span>
            {caretAt === undefined ? command : command.slice(0, caretAt)}
            <span style={{ opacity: cursorOn ? 1 : 0 }}>▋</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

/* ============================================================ holo module === */

export const HoloModule: React.FC<{
  size?: number;
  active?: boolean;
  done?: boolean;
  label?: string;
  caption?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ size = 230, active = false, done = false, label = "AI PROCESSING MODULE", caption, icon, style }) => {
  const frame = useCurrentFrame();
  const spin = (frame * 1.4) % 360;
  const glow = active ? 0.5 + 0.5 * Math.sin(frame / 5) : done ? 0.7 : 0.2;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: 30,
        overflow: "hidden",
        transform: "perspective(1400px) rotateX(6deg)",
        boxShadow: `0 40px 70px -28px rgba(40,30,80,0.5), 0 0 ${20 + glow * 50}px rgba(150,120,255,${0.25 + glow * 0.4}), inset 0 1px 0 rgba(255,255,255,0.8)`,
        border: "1px solid rgba(255,255,255,0.85)",
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        ...style,
      }}
    >
      {/* iridescent sheen */}
      <div
        style={{
          position: "absolute",
          left: "-40%",
          top: "-40%",
          width: "180%",
          height: "180%",
          background:
            "conic-gradient(from 0deg, #ff9aa2, #ffd59e, #a0e7ff, #c9a0ff, #a0ffd6, #ff9aa2)",
          opacity: 0.42,
          transform: `rotate(${spin}deg)`,
          filter: "blur(14px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(155deg, rgba(255,255,255,0.7), rgba(255,255,255,0.1) 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {icon}
        <span
          style={{
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: size * 0.066,
            letterSpacing: 1.5,
            color: COLORS.ink,
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: size * 0.8,
          }}
        >
          {label}
        </span>
        {caption ? (
          <span style={{ fontFamily: FONT.mono, fontSize: size * 0.05, color: done ? COLORS.success : COLORS.muted }}>
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
};

/** Helper kept for callers that want a clamped 0..1. */
export const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

/** small util so interpolate stays tidy in scenes */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
