import React from "react";
import { random } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { FileBadge } from "./nodes";
import { ImageIcon } from "./icons";

const TrafficLights: React.FC = () => (
  <div style={{ display: "flex", gap: 8 }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
      <span
        key={c}
        style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
      />
    ))}
  </div>
);

/* --------------------------------------------------------------- browser --- */

export const BrowserWindow: React.FC<{
  url?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({
  url = "localhost:3000",
  children,
  width = 900,
  height = 560,
  accent = COLORS.remotion,
  style,
}) => (
  <div
    style={{
      width,
      height,
      background: COLORS.surface,
      borderRadius: RADIUS.lg,
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
        height: 50,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 18px",
        background: COLORS.surfaceAlt,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <TrafficLights />
      <div
        style={{
          flex: 1,
          height: 30,
          borderRadius: RADIUS.pill,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 14px",
          fontFamily: FONT.mono,
          fontSize: TYPE.micro,
          color: COLORS.muted,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accent,
          }}
        />
        {url}
      </div>
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

/* ------------------------------------------------------------- app window --- */

export const AppWindow: React.FC<{
  title: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  accent?: string;
  badge?: string;
  style?: React.CSSProperties;
}> = ({ title, children, width = 760, height = 460, accent, badge, style }) => (
  <div
    style={{
      width,
      height,
      background: "#15171C",
      borderRadius: RADIUS.lg,
      boxShadow: SHADOW.lg,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 16px",
        background: "#1E2128",
      }}
    >
      <TrafficLights />
      <span
        style={{
          fontFamily: FONT.ui,
          fontSize: TYPE.tiny,
          fontWeight: 600,
          color: "#C7CCD6",
        }}
      >
        {title}
      </span>
      {badge ? (
        <span
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 11px",
            borderRadius: RADIUS.pill,
            background: `${accent ?? COLORS.error}26`,
            color: accent ?? COLORS.error,
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accent ?? COLORS.error,
            }}
          />
          {badge}
        </span>
      ) : null}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

/* ----------------------------------------------------------- fake screen --- */

export const FakeAppScreen: React.FC<{
  variant?: "editor" | "art";
  seed?: string;
}> = ({ variant = "editor", seed = "scr" }) => {
  if (variant === "art") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #FBF7F0, #F1E8DA)",
          display: "flex",
          padding: 26,
          gap: 22,
        }}
      >
        <div
          style={{
            width: "46%",
            borderRadius: RADIUS.md,
            background: "linear-gradient(160deg, #1f2733, #36506b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <ImageIcon size={56} color="rgba(255,255,255,0.7)" />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 22, width: "70%", borderRadius: 6, background: "#C9A24B" }} />
          {new Array(6).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                height: 11,
                width: `${55 + random(`${seed}-a${i}`) * 40}%`,
                borderRadius: 5,
                background: "rgba(60,50,35,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: "#0E1118" }}>
      <div style={{ width: 54, background: "#11141C", borderRight: "1px solid #1C2230" }} />
      <div style={{ width: 150, background: "#0F131B", borderRight: "1px solid #1C2230", padding: 12 }}>
        {new Array(8).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              height: 9,
              marginBottom: 11,
              marginLeft: (i % 3) * 10,
              width: `${45 + random(`${seed}-s${i}`) * 45}%`,
              borderRadius: 4,
              background: "rgba(120,150,200,0.22)",
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1, padding: 18 }}>
        {new Array(11).fill(0).map((_, i) => {
          const colors = ["#6BB6FF", "#5BE3A7", "#FFD479", "#C9A6FF", "#8B93B5"];
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 9, marginLeft: ((i * 7) % 3) * 16 }}>
              <span style={{ width: 18, fontSize: 9, color: "#39414F", fontFamily: FONT.mono }}>{i + 1}</span>
              <div
                style={{
                  height: 9,
                  width: `${20 + random(`${seed}-c${i}`) * 55}%`,
                  borderRadius: 4,
                  background: colors[i % colors.length],
                  opacity: 0.7,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------- reels frame --- */

export const ReelsFrame: React.FC<{
  width?: number;
  children?: React.ReactNode;
  caption?: string;
  style?: React.CSSProperties;
}> = ({ width = 220, children, caption = "@autoline", style }) => {
  const height = width * (16 / 9);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 26,
        background: "#0E1118",
        boxShadow: SHADOW.lg,
        border: "5px solid #11141C",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {children}
      {/* right action rail */}
      <div
        style={{
          position: "absolute",
          right: 10,
          bottom: 70,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {["♥", "💬", "↗"].map((g, i) => (
          <span
            key={i}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {g}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 50,
          bottom: 16,
          color: "#fff",
          fontFamily: FONT.ui,
          fontSize: 12,
          fontWeight: 600,
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        {caption}
      </div>
    </div>
  );
};

/* --------------------------------------------------------- desktop folder --- */

export const DesktopFolder: React.FC<{
  title?: string;
  files: string[];
  visibleCount?: number;
  width?: number;
  style?: React.CSSProperties;
}> = ({ title = "Output", files, visibleCount = files.length, width = 520, style }) => (
  <div
    style={{
      width,
      background: COLORS.surface,
      borderRadius: RADIUS.lg,
      boxShadow: SHADOW.lg,
      border: `1px solid ${COLORS.border}`,
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        background: COLORS.surfaceAlt,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <TrafficLights />
      <span
        style={{
          fontFamily: FONT.ui,
          fontSize: TYPE.tiny,
          fontWeight: 700,
          color: COLORS.inkSoft,
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 30,
        padding: "30px 28px",
      }}
    >
      {files.map((f, i) => (
        <FileBadge
          key={f}
          name={f}
          size={54}
          style={{ opacity: i < visibleCount ? 1 : 0 }}
        />
      ))}
    </div>
  </div>
);
