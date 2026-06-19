import React from "react";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { EyeIcon, FilmIcon, PlayIcon, SparkIcon, WaveIcon } from "./icons";

/* ----------------------------------------------------------------- files --- */

export const EXT_COLOR: Record<string, string> = {
  json: COLORS.hi.amber,
  mp4: COLORS.hi.violet,
  py: COLORS.hi.sky,
  ts: COLORS.remotion,
  tsx: COLORS.teal,
  mjs: COLORS.warn,
  txt: COLORS.muted,
  mp3: COLORS.hi.rose,
  srt: COLORS.hi.emerald,
};

const extOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "txt";

export const FileGlyph: React.FC<{ ext: string; size?: number }> = ({
  ext,
  size = 64,
}) => {
  const color = EXT_COLOR[ext] ?? COLORS.muted;
  const w = size;
  const h = size * 1.26;
  return (
    <svg width={w} height={h} viewBox="0 0 50 64">
      <path
        d="M6 2h26l12 12v46a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
        fill="#fff"
        stroke={COLORS.borderStrong}
        strokeWidth={2}
      />
      <path d="M32 2l12 12H34a2 2 0 01-2-2z" fill={COLORS.bgAlt} />
      <rect x="4" y="40" width="40" height="16" rx="3" fill={color} />
      <text
        x="24"
        y="52"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="700"
        fontSize="12"
        fill="#fff"
        letterSpacing="0.5"
      >
        {ext.toUpperCase()}
      </text>
    </svg>
  );
};

export const FileBadge: React.FC<{
  name: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 64, style }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      ...style,
    }}
  >
    <FileGlyph ext={extOf(name)} size={size} />
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: TYPE.tiny,
        fontWeight: 600,
        color: COLORS.inkSoft,
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </div>
  </div>
);

/* ------------------------------------------------------------- tool nodes --- */

const RecordGlyph: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth={2} />
    <circle cx="12" cy="12" r="4" fill="#fff" />
  </svg>
);
const SpeakerGlyph: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <path d="M4 9v6h3l5 4V5L7 9H4z" fill="#fff" />
    <path
      d="M15 9a4 4 0 010 6"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);
const HexGlyph: React.FC<{ label: string }> = ({ label }) => (
  <svg width={26} height={26} viewBox="0 0 24 24">
    <path
      d="M12 2l8.6 5v10L12 22l-8.6-5V7z"
      fill="none"
      stroke="#fff"
      strokeWidth={1.8}
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontFamily="monospace"
      fontWeight="700"
      fontSize="9"
      fill="#fff"
    >
      {label}
    </text>
  </svg>
);
const CirclesGlyph: React.FC = () => (
  <svg width={24} height={24} viewBox="0 0 24 24">
    <circle cx="12" cy="6.5" r="3.4" fill="#fff" opacity={0.95} />
    <circle cx="6.5" cy="16" r="3.4" fill="#fff" opacity={0.75} />
    <circle cx="17.5" cy="16" r="3.4" fill="#fff" opacity={0.85} />
  </svg>
);

export type ToolKey =
  | "remotion"
  | "obs"
  | "capcut"
  | "whisper"
  | "gpt4o"
  | "tts"
  | "ffmpeg"
  | "node"
  | "python"
  | "opencv"
  | "claude";

export const TOOLS: Record<
  ToolKey,
  { label: string; sub: string; color: string; glyph: React.ReactNode }
> = {
  remotion: {
    label: "Remotion",
    sub: "4.0",
    color: COLORS.remotion,
    glyph: <PlayIcon size={20} color="#fff" />,
  },
  obs: {
    label: "OBS Studio",
    sub: "capture",
    color: "#1F2740",
    glyph: <RecordGlyph />,
  },
  capcut: {
    label: "CapCut",
    sub: "voiceover",
    color: "#111317",
    glyph: <HexGlyph label="C" />,
  },
  whisper: {
    label: "Whisper",
    sub: "transcribe",
    color: "#10A37F",
    glyph: <WaveIcon size={22} color="#fff" />,
  },
  gpt4o: {
    label: "GPT-4o Vision",
    sub: "analyze",
    color: "#7C5CFF",
    glyph: <EyeIcon size={22} color="#fff" />,
  },
  tts: {
    label: "OpenAI TTS",
    sub: "onyx",
    color: "#0B8F6B",
    glyph: <SpeakerGlyph />,
  },
  ffmpeg: {
    label: "FFmpeg",
    sub: "merge",
    color: "#2B7A2B",
    glyph: <FilmIcon size={22} color="#fff" />,
  },
  node: {
    label: "Node.js",
    sub: "v24",
    color: "#3C873A",
    glyph: <HexGlyph label="N" />,
  },
  python: {
    label: "Python",
    sub: "3.9",
    color: "#2C6BAE",
    glyph: <HexGlyph label="Py" />,
  },
  opencv: {
    label: "OpenCV",
    sub: "frames",
    color: "#E5484D",
    glyph: <CirclesGlyph />,
  },
  claude: {
    label: "Claude",
    sub: "cowork",
    color: COLORS.claude,
    glyph: <SparkIcon size={20} color="#fff" />,
  },
};

export const ToolTile: React.FC<{ tool: ToolKey; size?: number }> = ({
  tool,
  size = 52,
}) => {
  const t = TOOLS[tool];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: t.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 8px 20px ${t.color}44`,
      }}
    >
      {t.glyph}
    </div>
  );
};

export const LogoBadge: React.FC<{
  tool: ToolKey;
  style?: React.CSSProperties;
}> = ({ tool, style }) => {
  const t = TOOLS[tool];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 20px 14px 14px",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md,
        boxShadow: SHADOW.md,
        ...style,
      }}
    >
      <ToolTile tool={tool} />
      <div style={{ lineHeight: 1.15 }}>
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 700,
            fontSize: TYPE.small,
            color: COLORS.ink,
          }}
        >
          {t.label}
        </div>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            color: COLORS.muted,
            marginTop: 2,
          }}
        >
          {t.sub}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------- step badge --- */

export const StepBadge: React.FC<{
  n: number;
  color: string;
  size?: number;
  active?: boolean;
}> = ({ n, color, size = 40, active = true }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: active ? color : COLORS.surface,
      border: `2px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.mono,
      fontWeight: 700,
      fontSize: size * 0.42,
      color: active ? "#fff" : color,
      boxShadow: active ? `0 6px 16px ${color}55` : "none",
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);
