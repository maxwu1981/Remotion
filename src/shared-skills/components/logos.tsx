import React from "react";

/**
 * Recognizable brand marks, drawn as self-contained SVGs so they render crisply
 * at any size with no external assets. Brand colors are baked in.
 */

type LogoProps = { size?: number; style?: React.CSSProperties };

const Wrap: React.FC<{
  size: number;
  vb?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ size, vb = "0 0 24 24", style, children }) => (
  <svg width={size} height={size} viewBox={vb} style={style}>
    {children}
  </svg>
);

/* ----------------------------------------------------------------- OBS --- */
export const OBSLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <Wrap size={size} style={style}>
    <circle cx={12} cy={12} r={11} fill="#16222F" />
    <circle cx={12} cy={12} r={11} fill="none" stroke="#4B7FB5" strokeWidth={1.3} />
    <circle cx={12} cy={12} r={5.4} fill="none" stroke="#fff" strokeWidth={1.7} opacity={0.92} />
    {[90, 210, 330].map((a) => {
      const r = 5.4;
      const x = 12 + r * Math.cos((a * Math.PI) / 180);
      const y = 12 + r * Math.sin((a * Math.PI) / 180);
      return <circle key={a} cx={x} cy={y} r={2} fill="#16222F" stroke="#fff" strokeWidth={1.4} />;
    })}
  </Wrap>
);

/* --------------------------------------------------------------- Node --- */
export const NodeLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <Wrap size={size} style={style}>
    <defs>
      <linearGradient id="nodeG" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#8CC84B" />
        <stop offset="100%" stopColor="#3C873A" />
      </linearGradient>
    </defs>
    <path d="M12 1.6 21 6.7 21 17.3 12 22.4 3 17.3 3 6.7Z" fill="url(#nodeG)" />
    <path d="M12 5 17.4 8.1 17.4 14.3 12 17.4 6.6 14.3 6.6 8.1Z" fill="#3C873A" opacity={0.55} />
    <path
      d="M12 7.6c-.3 0-.5.3-.5.6v6.1c0 .2-.2.3-.4.2l-1.4-.8M12 7.6c.3 0 .5.3.5.6"
      fill="none"
      stroke="#EAF6DF"
      strokeWidth={1.1}
      strokeLinecap="round"
      opacity={0.9}
    />
  </Wrap>
);

/** npm wordmark — red block with white "npm". */
export const NpmLogo: React.FC<{ height?: number; style?: React.CSSProperties }> = ({
  height = 24,
  style,
}) => (
  <svg width={height * 2.5} height={height} viewBox="0 0 50 20" style={style}>
    <rect width={50} height={20} rx={3} fill="#CB3837" />
    <path
      d="M6 5h12v12h-3V8h-2v9H6zM21 5h12v15h-3v-3h-3V5zm3 3v6h3V8zM36 5h12v9h-3V8h-1v6h-2V8h-1v6h-2V5z"
      fill="#fff"
    />
  </svg>
);

/* ------------------------------------------------------------- OpenAI --- */
export const OpenAILogo: React.FC<LogoProps & { color?: string }> = ({
  size = 48,
  color = "#0D0D0D",
  style,
}) => (
  <Wrap size={size} style={style}>
    <path
      fill={color}
      d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0805.0805 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
    />
  </Wrap>
);

/* -------------------------------------------------- React / Remotion --- */
export const ReactLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <svg width={size} height={size} viewBox="-12 -11 24 22" style={style}>
    <circle r={2.05} fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth={1} fill="none">
      <ellipse rx={11} ry={4.2} />
      <ellipse rx={11} ry={4.2} transform="rotate(60)" />
      <ellipse rx={11} ry={4.2} transform="rotate(120)" />
    </g>
  </svg>
);

/** React atom with a small play badge — the way "Remotion" reads on screen. */
export const RemotionLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <div style={{ position: "relative", width: size, height: size, ...style }}>
    <ReactLogo size={size} />
    <div
      style={{
        position: "absolute",
        right: -size * 0.04,
        bottom: size * 0.06,
        width: size * 0.4,
        height: size * 0.4,
        borderRadius: size * 0.1,
        background: "#0B1622",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <svg width={size * 0.2} height={size * 0.2} viewBox="0 0 24 24">
        <path d="M8 5l11 7-11 7z" fill="#fff" />
      </svg>
    </div>
  </div>
);

/* ------------------------------------------------------------ YouTube --- */
export const YouTubeLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <Wrap size={size} vb="0 0 24 24" style={style}>
    <rect x={1} y={5} width={22} height={14} rx={4.4} fill="#FF0000" />
    <path d="M10 8.6l6 3.4-6 3.4z" fill="#fff" />
  </Wrap>
);

/* -------------------------------------------------------- Reels / IG --- */
export const ReelsLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <Wrap size={size} vb="0 0 24 24" style={style}>
    <defs>
      <linearGradient id="igG" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#FEDA75" />
        <stop offset="35%" stopColor="#FA7E1E" />
        <stop offset="65%" stopColor="#D62976" />
        <stop offset="100%" stopColor="#962FBF" />
      </linearGradient>
    </defs>
    <rect x={2} y={2} width={20} height={20} rx={6} fill="url(#igG)" />
    <path d="M7 2.4 9.8 7H6.2L4 3.1A6 6 0 0 1 7 2.4z" fill="#fff" opacity={0.92} />
    <path d="M13 2.2 15.8 6.9h-3.6L9.4 2.3z" fill="#fff" opacity={0.6} />
    <path d="M22 6.9h-9.2L10 2.3" fill="none" />
    <path d="M10 9.4l5 2.9-5 2.9z" fill="#fff" />
  </Wrap>
);

/* ------------------------------------------------------- episode.json --- */
export const JsonDocLogo: React.FC<LogoProps & { color?: string }> = ({
  size = 48,
  color = "#2B3A55",
  style,
}) => (
  <Wrap size={size} vb="0 0 24 24" style={style}>
    <path
      d="M6 2.5h8.5L19 7v13.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"
      fill="#fff"
      stroke={color}
      strokeWidth={1.5}
    />
    <path d="M14 2.6V7h4.3" fill="none" stroke={color} strokeWidth={1.5} />
    <path
      d="M10 11.5c-1.2 0-1.4.8-1.4 1.7s.1 1.3-.9 1.3c1 0 .9.4.9 1.3s.2 1.7 1.4 1.7"
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11.5c1.2 0 1.4.8 1.4 1.7s-.1 1.3.9 1.3c-1 0-.9.4-.9 1.3s-.2 1.7-1.4 1.7"
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Wrap>
);

/* ----------------------------------------------------- record (live) --- */
export const RecordLogo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <Wrap size={size} vb="0 0 24 24" style={style}>
    <circle cx={12} cy={12} r={10} fill="#FCE9E9" />
    <circle cx={12} cy={12} r={5.4} fill="#E5484D" />
  </Wrap>
);
