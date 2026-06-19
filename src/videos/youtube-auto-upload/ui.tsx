import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";

/**
 * Reusable UI props for the tutorial scenes: a mock browser/console window, an
 * animated cursor + click ripple, a privacy-blur wrapper, pulsing highlight
 * rings, permission rows and a small set of inline SVG brand marks. Everything
 * is deterministic and frame-driven (no CSS transitions).
 */

/* ============================================================ browser frame === */

export const BrowserFrame: React.FC<{
  url?: string;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ url, width = 1200, height = 690, children, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      background: COLORS.surface,
      boxShadow: SHADOW.lg,
      border: `1px solid ${COLORS.border}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: 54,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 20px",
        background: COLORS.surfaceAlt,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ display: "flex", gap: 9 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
        ))}
      </div>
      {url !== undefined ? (
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            height: 34,
            borderRadius: RADIUS.pill,
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 16px",
            fontFamily: FONT.mono,
            fontSize: 15,
            color: COLORS.muted,
            maxWidth: 720,
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <rect x={5} y={11} width={14} height={9} rx={2} fill={COLORS.muted} />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={COLORS.muted} strokeWidth={2} fill="none" />
          </svg>
          {url}
        </div>
      ) : null}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: COLORS.surface }}>
      {children}
    </div>
  </div>
);

/* =================================================================== cursor === */

/** macOS-style arrow pointer. `down` nudges a click-press scale. */
export const Cursor: React.FC<{
  x: number;
  y: number;
  down?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ x, y, down = false, size = 30, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${down ? 0.84 : 1})`,
      transformOrigin: "top left",
      filter: "drop-shadow(0 3px 5px rgba(20,20,43,0.4))",
      zIndex: 60,
      pointerEvents: "none",
      ...style,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M4 2.2 4 19.4 8.6 15.1 11.5 21.4 14.3 20.1 11.5 14 17.2 14 Z"
        fill="#fff"
        stroke="#111422"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Expanding ring that fires once at scene-local frame `at`. */
export const ClickRipple: React.FC<{
  x: number;
  y: number;
  at: number;
  color?: string;
}> = ({ x, y, at, color = COLORS.remotion }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 22) return null;
  const r = interpolate(t, [0, 22], [4, 42], { extrapolateRight: "clamp" });
  const op = interpolate(t, [0, 22], [0.55, 0], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        opacity: op,
        zIndex: 55,
        pointerEvents: "none",
      }}
    />
  );
};

/* ================================================================ privacy === */

/** Privacy mask per the style guide: filter: blur(8px) over sensitive text. */
export const Redact: React.FC<{
  children: React.ReactNode;
  amount?: number;
  style?: React.CSSProperties;
}> = ({ children, amount = 8, style }) => (
  <span style={{ filter: `blur(${amount}px)`, userSelect: "none", ...style }}>{children}</span>
);

/* ============================================================ pulse / blink === */

/** Soft pulsing ring around a control to draw the eye (opacity via Math.sin). */
export const PulseRing: React.FC<{
  color?: string;
  radius?: number;
  from?: number;
  style?: React.CSSProperties;
}> = ({ color = COLORS.remotion, radius = 14, from = 0, style }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - from);
  const pulse = 0.5 + 0.5 * Math.sin(t / 6);
  return (
    <div
      style={{
        position: "absolute",
        inset: -10,
        borderRadius: radius,
        boxShadow: `0 0 0 ${2 + pulse * 3}px ${color}${pulse > 0.5 ? "88" : "55"}, 0 0 ${14 + pulse * 26}px ${color}aa`,
        opacity: 0.5 + pulse * 0.5,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/** Blinking red attention box (warning callout border). */
export const BlinkBox: React.FC<{
  color?: string;
  radius?: number;
  from?: number;
  style?: React.CSSProperties;
}> = ({ color = COLORS.error, radius = 12, from = 0, style }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - from);
  const blink = 0.5 + 0.5 * Math.sin(t / 7);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        border: `3px solid ${color}`,
        boxShadow: `0 0 ${10 + blink * 26}px ${color}`,
        opacity: 0.35 + blink * 0.65,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/* ============================================================ permission row === */

export const CheckItem: React.FC<{
  label: string;
  appear: number; // 0..1
  check: number; // 0..1
  accent?: string;
}> = ({ label, appear, check, accent = COLORS.success }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 20px",
      borderRadius: RADIUS.md,
      background: check > 0.5 ? `${accent}12` : COLORS.surfaceAlt,
      border: `1px solid ${check > 0.5 ? `${accent}55` : COLORS.border}`,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 14}px)`,
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        flexShrink: 0,
        borderRadius: 8,
        background: check > 0.5 ? accent : COLORS.surface,
        border: `2px solid ${check > 0.5 ? accent : COLORS.borderStrong}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12.5 10 17.5 19 7"
          stroke="#fff"
          strokeWidth={2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - check}
        />
      </svg>
    </div>
    <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 600, color: COLORS.inkSoft }}>
      {label}
    </span>
  </div>
);

/* =============================================================== typewriter === */

/** Visible substring of `text` typed out from frame `start` at `cps` chars/sec. */
export const typed = (text: string, frame: number, start: number, cps = 26, fps = 30): string => {
  const n = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  return text.slice(0, Math.min(text.length, n));
};

/* =============================================================== brand marks === */

type MarkProps = { size?: number; style?: React.CSSProperties };

/** Google Cloud — four-color hexard mark, simplified. */
export const GoogleCloudMark: React.FC<MarkProps> = ({ size = 48, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12.5 6.5 15 10.8h-5L8 7.4A6 6 0 0 1 12.5 6.5z" fill="#EA4335" />
    <path d="M15 10.8 12.5 6.5A6.4 6.4 0 0 1 18 9.7l-1.8 3.1z" fill="#FBBC05" />
    <path d="M7.2 8.2 10 13l-2.4 4.2A6.4 6.4 0 0 1 7.2 8.2z" fill="#4285F4" />
    <path d="M7.6 17.2 10 13h6.2l-1.7 4.2a6.4 6.4 0 0 1-6.9 0z" fill="#34A853" />
  </svg>
);

/** Gmail envelope. */
export const GmailMark: React.FC<MarkProps> = ({ size = 48, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <rect x={2.5} y={5.5} width={19} height={13} rx={2.2} fill="#fff" stroke="#E6E9F0" strokeWidth={0.6} />
    <path d="M3.5 6.5 12 13l8.5-6.5" fill="none" stroke="#EA4335" strokeWidth={2} strokeLinecap="round" />
    <path d="M3 7v11h3V9.2z" fill="#4285F4" />
    <path d="M21 7v11h-3V9.2z" fill="#34A853" />
    <path d="M3 6.6 12 13.2 21 6.6 21 8.2 12 14.8 3 8.2z" fill="#EA4335" />
  </svg>
);

/** Key — for credentials / OAuth client. */
export const KeyMark: React.FC<MarkProps & { color?: string }> = ({ size = 48, color = "#E8910C", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <circle cx={8} cy={8} r={4.4} fill="none" stroke={color} strokeWidth={2.2} />
    <circle cx={8} cy={8} r={1.4} fill={color} />
    <path d="M11 11 19 19M16.5 16.5 18.5 14.5M19 19l-2 2" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

/** Shield with exclamation — the browser security warning. */
export const ShieldMark: React.FC<MarkProps & { color?: string }> = ({ size = 48, color = "#E8910C", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z" fill={`${color}22`} stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M12 7.5v5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    <circle cx={12} cy={15.6} r={1.2} fill={color} />
  </svg>
);

/** Folder — project folder for the JSON file. */
export const FolderMark: React.FC<MarkProps & { color?: string }> = ({ size = 48, color = "#0B84F3", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5h4l2 2.2h8A1.5 1.5 0 0 1 20 8.7v9.3a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3 18z" fill={`${color}26`} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

/** AI brain / chip — the render brain in the recap. */
export const BrainMark: React.FC<MarkProps & { color?: string }> = ({ size = 48, color = "#8B5CF6", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <rect x={7} y={7} width={10} height={10} rx={2.4} fill={`${color}26`} stroke={color} strokeWidth={1.8} />
    <circle cx={12} cy={12} r={2.1} fill={color} />
    {[-1, 1].map((s) =>
      [9, 12, 15].map((p) => (
        <line
          key={`${s}-${p}`}
          x1={s < 0 ? 4.5 : 19.5}
          y1={p}
          x2={s < 0 ? 7 : 17}
          y2={p}
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      )),
    )}
    {[9, 12, 15].map((p) => (
      <React.Fragment key={`v-${p}`}>
        <line x1={p} y1={4.5} x2={p} y2={7} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <line x1={p} y1={17} x2={p} y2={19.5} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      </React.Fragment>
    ))}
  </svg>
);
