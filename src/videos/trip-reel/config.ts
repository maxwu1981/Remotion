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

/* ----------------------------------------------------------- 金澤·兼六園 ----- */
/** 封面=鉤子(時間+稀缺):清晨6点 / 整座没别人。簡體。 */
export const KENROKU_REEL: TripReelConfig = {
  title: "清晨6点的兼六园",
  subtitle: "日本三名园·整座没别人",
  handle: "@獨自旅遊亂走",
  outroTitle: "拼一个清晨",
  outroSub: "整座兼六园·只有你",
  accent: "#5E7A4F",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kenroku/kenroku_01.jpg", label: "霞ヶ池", sub: "唐崎松雪吊" },
    { image: "trips/kenroku/kenroku_02.jpg", label: "霞ヶ池", sub: "清晨无人" },
    { image: "trips/kenroku/kenroku_03.jpg", label: "霞ヶ池雪吊" },
    { image: "trips/kenroku/kenroku_04.jpg", label: "内桥亭" },
    { image: "trips/kenroku/kenroku_05.jpg", label: "霞ヶ池", sub: "雪见灯笼" },
    { image: "trips/kenroku/kenroku_06.jpg", label: "蓬莱岛" },
    { image: "trips/kenroku/kenroku_07.jpg", label: "瓢池", sub: "海石塔" },
    { image: "trips/kenroku/kenroku_08.jpg", label: "翠滝", sub: "瓢池" },
    { image: "trips/kenroku/kenroku_09.jpg", label: "海石塔" },
    { image: "trips/kenroku/kenroku_10.jpg", label: "瓢池" },
    { image: "trips/kenroku/kenroku_11.jpg", label: "梅林" },
    { image: "trips/kenroku/kenroku_12.jpg", label: "梅林", sub: "早春" },
    { image: "trips/kenroku/kenroku_13.jpg", label: "苔の小径" },
    { image: "trips/kenroku/kenroku_14.jpg", label: "时雨亭" },
    { image: "trips/kenroku/kenroku_15.jpg", label: "时雨亭", sub: "茶室" },
  ],
};

/* ---------------------------------------------------------------- 金澤 ----- */
export const KANAZAWA_REEL: TripReelConfig = {
  title: "半天走完小京都",
  subtitle: "金泽·加贺百万石",
  handle: "@獨自旅遊亂走",
  outroTitle: "金泽,你赢了",
  outroSub: "把京都的雅·缩进半天脚程",
  accent: "#C9A227",
  coverSec: 2.6,
  slideSec: 2.6,
  outroSec: 3,
  slides: [
    { image: "trips/kanazawa/03_higashi_chaya.jpg", label: "东茶屋街", sub: "清晨无人" },
    { image: "trips/kanazawa/17_kanazawa_oldstreet.jpg", label: "东茶屋街", sub: "木格子老街" },
    { image: "trips/kanazawa/09_kanazawa_asanogawa.jpg", label: "浅野川", sub: "主计町" },
    { image: "trips/kanazawa/01_kanazawa_tsuzumi.jpg", label: "金泽站 鼓门" },
    { image: "trips/kanazawa/02_kanazawa_castle.jpg", label: "金泽城" },
    { image: "trips/kanazawa/13_kanazawa_castle2.jpg", label: "金泽城", sub: "石川门" },
    { image: "trips/kanazawa/14_kanazawa_castle_dusk.jpg", label: "金泽城", sub: "暮色点灯" },
    { image: "trips/kanazawa/08_kanazawa_bridge.jpg", label: "鼠多门桥" },
    { image: "trips/kanazawa/11_kanazawa_kenrokuen.jpg", label: "兼六园", sub: "日本三名园" },
    { image: "trips/kanazawa/12_kanazawa_gyokusen.jpg", label: "玉泉院丸庭园" },
    { image: "trips/kanazawa/07_kanazawa_suzuki.jpg", label: "铃木大拙馆", sub: "水镜之庭" },
    { image: "trips/kanazawa/16_kanazawa_retro.jpg", label: "金泽街角" },
    { image: "trips/kanazawa/15_kanazawa_station.jpg", label: "金泽站", sub: "もてなしドーム" },
  ],
};

/* --------------------------------------------------------------- 富山 ----- */
export const TOYAMA_REEL: TripReelConfig = {
  title: "日落后20分钟最美",
  subtitle: "富山·立山蓝时刻",
  handle: "@獨自旅遊亂走",
  outroTitle: "富山,被低估的小城",
  outroSub: "日落后20分钟·安静地美",
  accent: "#2E6B8F",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/toyama/05_toyama_kansui.jpg", label: "环水公园", sub: "天门桥蓝调" },
    { image: "trips/toyama/19_toyama_kansui_laser.jpg", label: "天门桥", sub: "激光" },
    { image: "trips/toyama/20_toyama_kansui_trees.jpg", label: "环水公园", sub: "点灯" },
    { image: "trips/toyama/21_toyama_kansui_arch.jpg", label: "富岩运河环水公园" },
    { image: "trips/toyama/22_toyama_kansui_dusk.jpg", label: "环水公园", sub: "黄昏" },
    { image: "trips/toyama/23_toyama_eki_night.jpg", label: "富山站", sub: "市电夜" },
    { image: "trips/toyama/24_toyama_eki_day.jpg", label: "富山站", sub: "セントラム" },
    { image: "trips/toyama/25_toyama_castle.jpg", label: "富山城" },
    { image: "trips/toyama/26_toyama_amaharashi1.jpg", label: "雨晴海岸", sub: "海上立山连峰" },
    { image: "trips/toyama/27_toyama_amaharashi2.jpg", label: "雨晴海岸" },
    { image: "trips/toyama/28_toyama_amaharashi3.jpg", label: "雨晴海岸", sub: "女岩" },
    { image: "trips/toyama/29_toyama_amaharashi_iwa.jpg", label: "雨晴·女岩" },
    { image: "trips/toyama/30_toyama_amaharashi_eki.jpg", label: "雨晴站" },
  ],
};

/* --------------------------------------------------------------- 新潟 ----- */
export const NIIGATA_REEL: TripReelConfig = {
  title: "坐火车看雪国",
  subtitle: "新潟·在来线妙高雪景",
  handle: "@獨自旅遊亂走",
  outroTitle: "火车慢慢开,雪一直下",
  outroSub: "有些风景,是要坐着看的",
  accent: "#3949AB",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/niigata/06_niigata_train.jpg", label: "雪国在来线", sub: "车窗妙高" },
    { image: "trips/niigata/32_niigata_myoko_cone.jpg", label: "妙高山" },
    { image: "trips/niigata/33_niigata_train_plain.jpg", label: "车窗", sub: "妙高连峰" },
    { image: "trips/niigata/34_niigata_train_peak.jpg", label: "妙高连峰" },
    { image: "trips/niigata/35_niigata_train_pano.jpg", label: "雪原全景" },
    { image: "trips/niigata/36_niigata_train_village.jpg", label: "雪国风景" },
    { image: "trips/niigata/37_niigata_sekiyama_platform.jpg", label: "关山站", sub: "雪月台" },
    { image: "trips/niigata/38_niigata_sekiyama_sign.jpg", label: "妙高はねうまライン" },
    { image: "trips/niigata/39_niigata_kenshin.jpg", label: "上越·上杉谦信" },
  ],
};

/* --------------------------------------------------------------- 大阪 ----- */
export const OSAKA_REEL: TripReelConfig = {
  title: "天黑后才是大阪",
  subtitle: "新世界·通天阁霓虹",
  handle: "@獨自旅遊亂走",
  outroTitle: "真正的大阪在天黑后",
  outroSub: "那盏亮起来的霓虹里",
  accent: "#E5322D",
  coverSec: 2.6, slideSec: 2.8, outroSec: 3,
  slides: [
    { image: "trips/osaka/41_osaka_tsutenkaku_night.jpg", label: "通天阁", sub: "Welcome to Osaka" },
    { image: "trips/osaka/42_osaka_tsutenkaku_street.jpg", label: "新世界", sub: "霓虹街" },
    { image: "trips/osaka/43_osaka_skyline.jpg", label: "大阪天际线" },
    { image: "trips/osaka/44_osaka_harukas.jpg", label: "あべのハルカス" },
    { image: "trips/osaka/45_osaka_bijutsukan.jpg", label: "天王寺·美术馆" },
  ],
};

/* --------------------------------------------------------------- 京都 ----- */
export const KYOTO_REEL: TripReelConfig = {
  title: "清晨无人的东山",
  subtitle: "京都·citywalk",
  handle: "@獨自旅遊亂走",
  outroTitle: "挑一个清晨",
  outroSub: "把东山留给自己",
  accent: "#A07CC5",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kyoto/48_kyoto_yasaka_gate.jpg", label: "八坂神社" },
    { image: "trips/kyoto/49_kyoto_yasaka_pagoda.jpg", label: "八坂塔", sub: "东山町家" },
    { image: "trips/kyoto/50_kyoto_ninenzaka_sbux.jpg", label: "二年坂", sub: "百年町家星巴克" },
    { image: "trips/kyoto/51_kyoto_sakura_latte.jpg", label: "二年坂", sub: "樱花拿铁" },
    { image: "trips/kyoto/52_kyoto_kiyomizu_gate.jpg", label: "清水寺", sub: "仁王门" },
    { image: "trips/kyoto/53_kyoto_kiyomizu_sign.jpg", label: "清水寺" },
    { image: "trips/kyoto/54_kyoto_nishiki.jpg", label: "锦市场" },
    { image: "trips/kyoto/55_kyoto_takasegawa.jpg", label: "高瀬川·木屋町" },
    { image: "trips/kyoto/56_kyoto_gosho.jpg", label: "京都御所" },
    { image: "trips/kyoto/57_kyoto_wagyu.jpg", label: "京都美食" },
    { image: "trips/kyoto/58_kyoto_hina.jpg", label: "季节·雏祭" },
    { image: "trips/kyoto/59_kyoto_station.jpg", label: "京都站" },
    { image: "trips/kyoto/60_kyoto_tower.jpg", label: "京都塔" },
  ],
};

/* --------------------------------------------------------------- 犬山 ----- */
export const INUYAMA_REEL: TripReelConfig = {
  title: "名古屋旁的国宝城",
  subtitle: "犬山城·国宝天守",
  handle: "@獨自旅遊亂走",
  outroTitle: "把战国风景留下",
  outroSub: "犬山·名古屋小旅行",
  accent: "#C9A227",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/inuyama/62_inuyama_castle.jpg", label: "国宝犬山城" },
    { image: "trips/inuyama/63_inuyama_kisogawa.jpg", label: "犬山城·木曽川" },
    { image: "trips/inuyama/64_inuyama_castle_trees.jpg", label: "犬山城天守" },
    { image: "trips/inuyama/65_inuyama_view.jpg", label: "天守俯瞰", sub: "木曽川" },
    { image: "trips/inuyama/66_inuyama_stairs.jpg", label: "国宝天守内部" },
    { image: "trips/inuyama/67_inuyama_torii.jpg", label: "三光稲荷·针纲神社" },
    { image: "trips/inuyama/68_inuyama_shrine_bridge.jpg", label: "针纲神社" },
    { image: "trips/inuyama/69_inuyama_machiya.jpg", label: "犬山城下町" },
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
