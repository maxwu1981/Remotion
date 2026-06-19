/**
 * One reusable, parametrized vertical (9:16) travel photo reel. A trip is just a
 * TripReelConfig: a title + an ordered list of {image, label} slides. Each slide
 * gets a slow Ken-Burns move and a caption chip; slides cross-fade; a cover and
 * outro bookend it. Duration is derived so the TransitionSeries always matches.
 *
 * Same pattern as painting-reveal: edit props in Studio, register a per-trip
 * <Composition> in Root.tsx, or pass `--props` at render time.
 */
import { z } from "zod";
import type { CalculateMetadataFunction } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
/** Cross-fade length between every section (frames). */
export const TRANS = 12;

export const slideSchema = z.object({
  /** staticFile path under public/, e.g. "trips/kanazawa/03_higashi_chaya.jpg". */
  image: z.string(),
  /** 地點 — big caption chip. */
  label: z.string(),
  /** optional small second line under the label. */
  sub: z.string().optional(),
});

export const tripReelSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  handle: z.string().default("@獨自旅遊亂走"),
  /** outro big line + small line. */
  outroTitle: z.string().default(""),
  outroSub: z.string().default(""),
  /** accent colour (金澤 gold by default). */
  accent: z.string().default("#C9A227"),
  coverSec: z.number().min(1).default(2.6),
  slideSec: z.number().min(1).default(2.6),
  outroSec: z.number().min(1).default(3),
  slides: z.array(slideSchema).min(1),
});

export type TripReelConfig = z.infer<typeof tripReelSchema>;
export type Slide = z.infer<typeof slideSchema>;

/**
 * Total length = all sections minus the overlap eaten by each cross-fade.
 * Sections = cover + N slides + outro (N+2). Transitions = N+1.
 */
export const reelFrames = (c: TripReelConfig): number => {
  const cf = Math.round(c.coverSec * FPS);
  const sf = Math.round(c.slideSec * FPS);
  const of = Math.round(c.outroSec * FPS);
  const n = c.slides.length;
  return Math.max(1, cf + n * sf + of - (n + 1) * TRANS);
};

export const calculateTripReelMetadata: CalculateMetadataFunction<TripReelConfig> = ({ props }) => {
  const cfg = tripReelSchema.parse(props);
  return {
    durationInFrames: reelFrames(cfg),
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    props: cfg,
    defaultOutName: `${cfg.title}_reel`,
  };
};

/* ---------------------------------------------------------------- 金澤 ----- */

export const KANAZAWA_REEL: TripReelConfig = {
  title: "金澤 加賀百萬石",
  subtitle: "小京都 · 半日 citywalk",
  handle: "@獨自旅遊亂走",
  outroTitle: "金澤,你贏了",
  outroSub: "把京都的雅 · 縮進半天的腳程",
  accent: "#C9A227",
  coverSec: 2.6,
  slideSec: 2.6,
  outroSec: 3,
  slides: [
    { image: "trips/kanazawa/03_higashi_chaya.jpg", label: "東茶屋街", sub: "清晨無人" },
    { image: "trips/kanazawa/17_kanazawa_oldstreet.jpg", label: "東茶屋街", sub: "木格子老街" },
    { image: "trips/kanazawa/09_kanazawa_asanogawa.jpg", label: "淺野川", sub: "主計町" },
    { image: "trips/kanazawa/01_kanazawa_tsuzumi.jpg", label: "金澤駅 鼓門" },
    { image: "trips/kanazawa/02_kanazawa_castle.jpg", label: "金澤城" },
    { image: "trips/kanazawa/13_kanazawa_castle2.jpg", label: "金澤城", sub: "石川門" },
    { image: "trips/kanazawa/14_kanazawa_castle_dusk.jpg", label: "金澤城", sub: "暮色點燈" },
    { image: "trips/kanazawa/08_kanazawa_bridge.jpg", label: "鼠多門橋" },
    { image: "trips/kanazawa/11_kanazawa_kenrokuen.jpg", label: "兼六園", sub: "日本三名園" },
    { image: "trips/kanazawa/12_kanazawa_gyokusen.jpg", label: "玉泉院丸庭園" },
    { image: "trips/kanazawa/07_kanazawa_suzuki.jpg", label: "鈴木大拙館", sub: "水鏡之庭" },
    { image: "trips/kanazawa/16_kanazawa_retro.jpg", label: "金澤街角" },
    { image: "trips/kanazawa/15_kanazawa_station.jpg", label: "金澤駅", sub: "もてなしドーム" },
  ],
};
