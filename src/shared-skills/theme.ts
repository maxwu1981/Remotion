/**
 * Design tokens for the whole tutorial. Light, technical, professional.
 * Import these instead of hard-coding colors/spacing so every scene stays consistent.
 */
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadNotoTC } from "@remotion/google-fonts/NotoSansTC";

export const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
}).fontFamily;

/**
 * Traditional-Chinese family for CJK glyphs (bilingual videos). The
 * chinese-traditional subset fans out into many unicode-range slices, so keep
 * the weight set tight and silence the (expected) too-many-requests warning.
 */
export const notoTC = loadNotoTC("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "chinese-traditional"],
  ignoreTooManyRequestsWarning: true,
}).fontFamily;

export const FONT = {
  ui: inter,
  mono,
  /** Noto Sans TC on its own — for predominantly-Chinese text. */
  cjk: notoTC,
  /** Bilingual stacks: Latin renders in Inter/mono, CJK falls back to Noto Sans TC. */
  uiCjk: `${inter}, ${notoTC}`,
  monoCjk: `${mono}, ${notoTC}`,
};

export const COLORS = {
  // canvas — pure light-gray, minimalist (per brief: #F8F9FA)
  bg: "#F8F9FA",
  bgAlt: "#EEF1F6",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F9FD",
  border: "#E6E9F0",
  borderStrong: "#D5DBE6",

  // ink
  ink: "#14142B",
  inkSoft: "#363B57",
  muted: "#697090",
  faint: "#9AA1B8",

  // brand accents
  remotion: "#0B84F3",
  remotionDeep: "#0768C9",
  teal: "#1FC7D4",
  claude: "#D97757",
  claudeDeep: "#BE5C3C",

  // semantic
  success: "#16A34A",
  successBg: "#E8F6EE",
  error: "#E5484D",
  errorBg: "#FCEDED",
  warn: "#E8910C",
  warnBg: "#FCF3E2",

  // highlight palette — used for episode.json highlights & progress-bar markers
  hi: {
    blue: "#0B84F3",
    emerald: "#10B981",
    amber: "#F59E0B",
    violet: "#8B5CF6",
    rose: "#F43F5E",
    sky: "#0EA5E9",
  } as Record<string, string>,

  // light-theme syntax highlighting for code panels
  code: {
    bg: "#FBFCFE",
    panel: "#F2F5FB",
    text: "#3A3F58",
    key: "#0B69C7",
    string: "#1F8A4C",
    number: "#B5562A",
    keyword: "#8B5CF6",
    comment: "#9AA1B8",
    punct: "#828AA3",
    func: "#C2592F",
    gutter: "#B9C0D4",
  },

  // a classic dark terminal panel reads well even on a light canvas
  term: {
    bg: "#0F1530",
    bgTop: "#1A2145",
    text: "#E7EBF8",
    dim: "#8B93B5",
    green: "#5BE3A7",
    blue: "#74B7FF",
    yellow: "#FFD479",
    red: "#FF8088",
    prompt: "#7CF0C8",
  },
};

export const GRADIENT = {
  remotion: `linear-gradient(135deg, ${COLORS.remotion} 0%, ${COLORS.teal} 100%)`,
  claude: `linear-gradient(135deg, ${COLORS.claude} 0%, #ECA988 100%)`,
  ink: `linear-gradient(135deg, ${COLORS.ink} 0%, #2C3257 100%)`,
  surface: `linear-gradient(180deg, #FFFFFF 0%, ${COLORS.surfaceAlt} 100%)`,
};

export const RADIUS = { sm: 8, md: 14, lg: 22, xl: 30, pill: 999 };

export const SHADOW = {
  sm: "0 1px 2px rgba(20,20,43,0.06), 0 1px 1px rgba(20,20,43,0.04)",
  md: "0 8px 24px rgba(20,20,43,0.08), 0 2px 6px rgba(20,20,43,0.05)",
  lg: "0 24px 60px rgba(20,20,43,0.13), 0 8px 18px rgba(20,20,43,0.07)",
  glow: (c: string) => `0 0 0 1px ${c}26, 0 16px 50px ${c}40`,
};

/** Standard type scale (px) used across scenes. */
export const TYPE = {
  display: 92,
  h1: 64,
  h2: 46,
  h3: 34,
  body: 26,
  small: 21,
  tiny: 17,
  micro: 14,
};
