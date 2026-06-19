import React from "react";
import { COLORS } from "../../../shared-skills/theme";

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const S: React.FC<
  IconProps & { children: React.ReactNode; fill?: boolean }
> = ({ size = 24, color = COLORS.ink, strokeWidth = 2, children, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <g
      stroke={fill ? "none" : color}
      fill={fill ? color : "none"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (p) => (
  <S {...p} fill>
    <path d="M7 5l12 7-12 7z" />
  </S>
);
export const PauseIcon: React.FC<IconProps> = (p) => (
  <S {...p} fill>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </S>
);
export const CheckIcon: React.FC<IconProps> = (p) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 2.6}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </S>
);
export const CrossIcon: React.FC<IconProps> = (p) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 2.6}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);
export const ArrowIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </S>
);
export const LinkIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M9 15l6-6" />
    <path d="M8 9.5l-1.5 1.5a3.5 3.5 0 005 5l1.5-1.5" />
    <path d="M16 14.5l1.5-1.5a3.5 3.5 0 00-5-5L11 9.5" />
  </S>
);
export const LinkBrokenIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M8.5 9.5L7 11a3.5 3.5 0 005 5" />
    <path d="M15.5 14.5L17 13a3.5 3.5 0 00-5-5" />
    <path d="M12 4v3M19 11h-3M5 13h3M12 17v3" strokeWidth={1.6} />
  </S>
);
export const MicIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" />
  </S>
);
export const EyeIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </S>
);
export const BrainIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5 3 3 0 002 4 2.5 2.5 0 005 .5V5a2 2 0 00-3-1z" />
    <path d="M15 4a3 3 0 013 3 3 3 0 011 5 3 3 0 01-2 4 2.5 2.5 0 01-5 .5" />
  </S>
);
export const ScissorsIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <path d="M8 7.5L20 18M8 16.5L20 6" />
  </S>
);
export const TranslateIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M4 5h8M8 4v1.5c0 3.5-2 6.5-5 8" />
    <path d="M6 9c1 2.5 3 4.5 6 5.5" />
    <path d="M12 20l3.5-8 3.5 8M13.5 17h5" />
  </S>
);
export const UploadIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M12 16V5M8 9l4-4 4 4" />
    <path d="M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3" />
  </S>
);
export const ImageIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="M5 18l5-5 3.5 3.5L17 13l3 3" />
  </S>
);
export const CalendarIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </S>
);
export const RefreshIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M4 12a8 8 0 0113.5-5.8L20 8M20 4v4h-4" />
    <path d="M20 12a8 8 0 01-13.5 5.8L4 16M4 20v-4h4" />
  </S>
);
export const SparkIcon: React.FC<IconProps> = (p) => (
  <S {...p} fill>
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
  </S>
);
export const WaveIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M3 12h2l2-6 3 13 3-16 3 12 2-3h2" />
  </S>
);
export const FolderIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </S>
);
export const DocIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M7 3h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
    <path d="M14 3v4h4M9 13h6M9 16.5h6M9 9.5h2" strokeWidth={1.6} />
  </S>
);
export const CodeIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
  </S>
);
export const TerminalIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M7 10l3 2.5L7 15M12.5 15.5H17" />
  </S>
);
export const FilmIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" strokeWidth={1.5} />
  </S>
);
export const YouTubeIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="1.5" y="5" width="21" height="14" rx="4" fill="#FF0033" />
    <path d="M10 8.5l6 3.5-6 3.5z" fill="#fff" />
  </svg>
);
export const FacebookIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2" />
    <path
      d="M14.5 8.5h1.6V6h-2.2c-1.8 0-2.9 1.1-2.9 3v1.6H9v2.6h2v6h2.7v-6h2l.4-2.6h-2.4V9.4c0-.6.3-.9 1.3-.9z"
      fill="#fff"
    />
  </svg>
);
