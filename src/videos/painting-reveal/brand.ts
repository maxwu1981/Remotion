/**
 * Brand tokens for the 峻清书画 "作畫過程" reveal videos.
 *
 * A warm rice-paper canvas + ink + a 朱砂 (cinnabar) seal accent — deliberately
 * different from the repo's light-technical theme. Titles use Noto Serif TC at a
 * heavy weight (宋體 feel, classical and reliable for both 繁/简 glyphs); body text
 * reuses the shared Noto Sans TC stack so we don't load redundant fonts.
 */
import { loadFont as loadSerifTC } from "@remotion/google-fonts/NotoSerifTC";
import { FONT } from "../../shared-skills/theme";

const serif = loadSerifTC("normal", {
  weights: ["400", "600", "900"],
  subsets: ["latin", "chinese-traditional"],
  ignoreTooManyRequestsWarning: true,
}).fontFamily;

export const FONTS = {
  /** Big 畫名 / brand — classical serif. */
  title: `${serif}, ${FONT.cjk}`,
  /** Running text, captions, contact line. */
  body: FONT.uiCjk,
  /** Predominantly-Chinese body. */
  cjk: FONT.cjk,
};

/** Ink-on-rice-paper palette. */
export const INK = {
  paper: "#F2EADA", // 宣紙 warm off-white
  paperHi: "#FBF7EC", // lighter wash for highlights
  paperEdge: "#E3D6BC", // vignette / mount edge
  ink: "#1C1814", // 墨
  inkSoft: "#4B4339",
  faint: "#9C9079",
  seal: "#C0392B", // 朱砂 cinnabar (default accent / seal)
  sealDeep: "#9B2D22",
  gold: "#B08D3E", // 描金 accents
};

/** Soft shadows tuned for the warm canvas. */
export const INK_SHADOW = {
  frame: "0 24px 60px rgba(28,24,20,0.22), 0 8px 20px rgba(28,24,20,0.12)",
  soft: "0 6px 18px rgba(28,24,20,0.12)",
};
