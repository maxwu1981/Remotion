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

/* --------------------------------------------------------------- 富山 ----- */
export const TOYAMA_REEL: TripReelConfig = {
  title: "富山 立山藍時刻",
  subtitle: "環水公園 · 世界最美星巴克",
  handle: "@獨自旅遊亂走",
  outroTitle: "富山,被低估的小城",
  outroSub: "日落後20分鐘,安靜地美",
  accent: "#2E6B8F",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/toyama/05_toyama_kansui.jpg", label: "環水公園", sub: "天門橋藍調" },
    { image: "trips/toyama/19_toyama_kansui_laser.jpg", label: "天門橋", sub: "雷射光" },
    { image: "trips/toyama/20_toyama_kansui_trees.jpg", label: "環水公園", sub: "點燈" },
    { image: "trips/toyama/21_toyama_kansui_arch.jpg", label: "富岩運河環水公園" },
    { image: "trips/toyama/22_toyama_kansui_dusk.jpg", label: "環水公園", sub: "黃昏" },
    { image: "trips/toyama/23_toyama_eki_night.jpg", label: "富山駅", sub: "市電夜" },
    { image: "trips/toyama/24_toyama_eki_day.jpg", label: "富山駅", sub: "セントラム" },
    { image: "trips/toyama/25_toyama_castle.jpg", label: "富山城" },
    { image: "trips/toyama/26_toyama_amaharashi1.jpg", label: "雨晴海岸", sub: "海上立山連峰" },
    { image: "trips/toyama/27_toyama_amaharashi2.jpg", label: "雨晴海岸" },
    { image: "trips/toyama/28_toyama_amaharashi3.jpg", label: "雨晴海岸", sub: "女岩" },
    { image: "trips/toyama/29_toyama_amaharashi_iwa.jpg", label: "雨晴 · 女岩" },
    { image: "trips/toyama/30_toyama_amaharashi_eki.jpg", label: "雨晴駅" },
  ],
};

/* --------------------------------------------------------------- 新潟 ----- */
export const NIIGATA_REEL: TripReelConfig = {
  title: "新潟 雪國列車旅",
  subtitle: "在來線車窗的妙高雪景",
  handle: "@獨自旅遊亂走",
  outroTitle: "火車慢慢開,雪一直下",
  outroSub: "有些風景,是要坐著看的",
  accent: "#3949AB",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/niigata/06_niigata_train.jpg", label: "雪國在來線", sub: "車窗妙高" },
    { image: "trips/niigata/32_niigata_myoko_cone.jpg", label: "妙高山" },
    { image: "trips/niigata/33_niigata_train_plain.jpg", label: "車窗", sub: "妙高連峰" },
    { image: "trips/niigata/34_niigata_train_peak.jpg", label: "妙高連峰" },
    { image: "trips/niigata/35_niigata_train_pano.jpg", label: "雪原全景" },
    { image: "trips/niigata/36_niigata_train_village.jpg", label: "雪國風景" },
    { image: "trips/niigata/37_niigata_sekiyama_platform.jpg", label: "関山駅", sub: "雪月台" },
    { image: "trips/niigata/38_niigata_sekiyama_sign.jpg", label: "妙高はねうまライン" },
    { image: "trips/niigata/39_niigata_kenshin.jpg", label: "上越 · 上杉謙信" },
  ],
};

/* --------------------------------------------------------------- 大阪 ----- */
export const OSAKA_REEL: TripReelConfig = {
  title: "大阪 新世界夜遊",
  subtitle: "通天閣 · 霓虹派手",
  handle: "@獨自旅遊亂走",
  outroTitle: "真正的大阪在天黑後",
  outroSub: "那盞亮起來的霓虹裡",
  accent: "#E5322D",
  coverSec: 2.6, slideSec: 2.8, outroSec: 3,
  slides: [
    { image: "trips/osaka/41_osaka_tsutenkaku_night.jpg", label: "通天閣", sub: "Welcome to Osaka" },
    { image: "trips/osaka/42_osaka_tsutenkaku_street.jpg", label: "新世界", sub: "霓虹街" },
    { image: "trips/osaka/43_osaka_skyline.jpg", label: "大阪天際線" },
    { image: "trips/osaka/44_osaka_harukas.jpg", label: "あべのハルカス" },
    { image: "trips/osaka/45_osaka_bijutsukan.jpg", label: "天王寺 · 美術館" },
  ],
};

/* --------------------------------------------------------------- 京都 ----- */
export const KYOTO_REEL: TripReelConfig = {
  title: "京都 東山citywalk",
  subtitle: "清晨無人的小京都",
  handle: "@獨自旅遊亂走",
  outroTitle: "挑一個清晨",
  outroSub: "把東山留給自己",
  accent: "#A07CC5",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kyoto/48_kyoto_yasaka_gate.jpg", label: "八坂神社" },
    { image: "trips/kyoto/49_kyoto_yasaka_pagoda.jpg", label: "八坂塔", sub: "東山町家" },
    { image: "trips/kyoto/50_kyoto_ninenzaka_sbux.jpg", label: "二年坂", sub: "百年町家星巴克" },
    { image: "trips/kyoto/51_kyoto_sakura_latte.jpg", label: "二年坂", sub: "櫻花拿鐵" },
    { image: "trips/kyoto/52_kyoto_kiyomizu_gate.jpg", label: "清水寺", sub: "仁王門" },
    { image: "trips/kyoto/53_kyoto_kiyomizu_sign.jpg", label: "清水寺" },
    { image: "trips/kyoto/54_kyoto_nishiki.jpg", label: "錦市場" },
    { image: "trips/kyoto/55_kyoto_takasegawa.jpg", label: "高瀬川 · 木屋町" },
    { image: "trips/kyoto/56_kyoto_gosho.jpg", label: "京都御所" },
    { image: "trips/kyoto/57_kyoto_wagyu.jpg", label: "京都美食" },
    { image: "trips/kyoto/58_kyoto_hina.jpg", label: "季節 · 雛祭" },
    { image: "trips/kyoto/59_kyoto_station.jpg", label: "京都駅" },
    { image: "trips/kyoto/60_kyoto_tower.jpg", label: "京都塔" },
  ],
};

/* --------------------------------------------------------------- 犬山 ----- */
export const INUYAMA_REEL: TripReelConfig = {
  title: "犬山 国宝城下町",
  subtitle: "国宝犬山城 · 半日",
  handle: "@獨自旅遊亂走",
  outroTitle: "名古屋旁的國寶城",
  outroSub: "把戰國風景完整留下",
  accent: "#C9A227",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/inuyama/62_inuyama_castle.jpg", label: "国宝犬山城" },
    { image: "trips/inuyama/63_inuyama_kisogawa.jpg", label: "犬山城 · 木曽川" },
    { image: "trips/inuyama/64_inuyama_castle_trees.jpg", label: "犬山城天守" },
    { image: "trips/inuyama/65_inuyama_view.jpg", label: "天守俯瞰", sub: "木曽川" },
    { image: "trips/inuyama/66_inuyama_stairs.jpg", label: "国宝天守內部" },
    { image: "trips/inuyama/67_inuyama_torii.jpg", label: "三光稲荷 · 針綱神社" },
    { image: "trips/inuyama/68_inuyama_shrine_bridge.jpg", label: "針綱神社" },
    { image: "trips/inuyama/69_inuyama_machiya.jpg", label: "犬山城下町" },
  ],
};

/* ----------------------------------------------------------- 金澤·兼六園 ----- */
export const KENROKU_REEL: TripReelConfig = {
  title: "兼六園 日本三名園",
  subtitle: "清晨無人 · 雪吊霞ヶ池",
  handle: "@獨自旅遊亂走",
  outroTitle: "拚一個清晨",
  outroSub: "整座兼六園,只有你",
  accent: "#5E7A4F",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kenroku/kenroku_01.jpg", label: "霞ヶ池", sub: "唐崎松雪吊" },
    { image: "trips/kenroku/kenroku_02.jpg", label: "霞ヶ池", sub: "清晨無人" },
    { image: "trips/kenroku/kenroku_03.jpg", label: "霞ヶ池雪吊" },
    { image: "trips/kenroku/kenroku_04.jpg", label: "内橋亭" },
    { image: "trips/kenroku/kenroku_05.jpg", label: "霞ヶ池", sub: "雪見燈籠" },
    { image: "trips/kenroku/kenroku_06.jpg", label: "蓬莱島" },
    { image: "trips/kenroku/kenroku_07.jpg", label: "瓢池", sub: "海石塔" },
    { image: "trips/kenroku/kenroku_08.jpg", label: "翠滝", sub: "瓢池" },
    { image: "trips/kenroku/kenroku_09.jpg", label: "海石塔" },
    { image: "trips/kenroku/kenroku_10.jpg", label: "瓢池" },
    { image: "trips/kenroku/kenroku_11.jpg", label: "梅林" },
    { image: "trips/kenroku/kenroku_12.jpg", label: "梅林", sub: "早春" },
    { image: "trips/kenroku/kenroku_13.jpg", label: "苔の小徑" },
    { image: "trips/kenroku/kenroku_14.jpg", label: "時雨亭" },
    { image: "trips/kenroku/kenroku_15.jpg", label: "時雨亭", sub: "茶室" },
  ],
};

/** All trip reels, registered as a Folder in Root.tsx. */
export const TRIP_REELS: { id: string; cfg: TripReelConfig }[] = [
  { id: "KenrokuReel", cfg: KENROKU_REEL },
  { id: "KanazawaReel", cfg: KANAZAWA_REEL },
  { id: "ToyamaReel", cfg: TOYAMA_REEL },
  { id: "NiigataReel", cfg: NIIGATA_REEL },
  { id: "OsakaReel", cfg: OSAKA_REEL },
  { id: "KyotoReel", cfg: KYOTO_REEL },
  { id: "InuyamaReel", cfg: INUYAMA_REEL },
];
