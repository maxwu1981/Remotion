import React from "react";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";

export const Card: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  glow?: string;
  pad?: number;
}> = ({ children, style, glow, pad = 24 }) => (
  <div
    style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: RADIUS.lg,
      boxShadow: glow ? SHADOW.glow(glow) : SHADOW.md,
      padding: pad,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ children, color = COLORS.inkSoft, bg = COLORS.surface, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      padding: "8px 16px",
      borderRadius: RADIUS.pill,
      background: bg,
      border: `1px solid ${COLORS.border}`,
      boxShadow: SHADOW.sm,
      fontFamily: FONT.ui,
      fontWeight: 600,
      fontSize: TYPE.small,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  label: string;
  dot?: string;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({ label, dot, mono, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 12px",
      borderRadius: RADIUS.pill,
      background: COLORS.surfaceAlt,
      border: `1px solid ${COLORS.border}`,
      fontFamily: mono ? FONT.mono : FONT.ui,
      fontWeight: 600,
      fontSize: TYPE.tiny,
      color: COLORS.inkSoft,
      ...style,
    }}
  >
    {dot ? (
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dot,
        }}
      />
    ) : null}
    {label}
  </div>
);

export const Callout: React.FC<{
  accent: string;
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ accent, icon, title, children, style }) => (
  <div
    style={{
      display: "flex",
      gap: 16,
      padding: "18px 22px",
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderLeft: `5px solid ${accent}`,
      borderRadius: RADIUS.md,
      boxShadow: SHADOW.sm,
      ...style,
    }}
  >
    {icon ? (
      <div
        style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: RADIUS.sm,
          background: `${accent}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
        }}
      >
        {icon}
      </div>
    ) : null}
    <div>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: TYPE.body,
          color: COLORS.ink,
          marginBottom: children ? 4 : 0,
        }}
      >
        {title}
      </div>
      {children ? (
        <div
          style={{
            fontFamily: FONT.ui,
            fontSize: TYPE.small,
            color: COLORS.muted,
            lineHeight: 1.4,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  </div>
);
