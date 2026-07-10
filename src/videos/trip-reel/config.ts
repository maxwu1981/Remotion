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

/* -------------------------------------------------------- 中部·常滑 ----- */
export const TOKONAME_REEL: TripReelConfig = {
  title: "常滑·烧物散步道",
  subtitle: "招财猫产地·土管坂·登窑",
  handle: "@獨自旅遊亂走",
  outroTitle: "飞走前留半天",
  outroSub: "机场旁的陶器老镇",
  accent: "#8C6239",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/tokoname/tokoname_01.jpg", label: "土管坂", sub: "常滑地标" },
    { image: "trips/tokoname/tokoname_02.jpg", label: "登窑·烟囱" },
    { image: "trips/tokoname/tokoname_03.jpg", label: "登窑·夕阳" },
    { image: "trips/tokoname/tokoname_04.jpg", label: "红砖窑厂" },
    { image: "trips/tokoname/tokoname_05.jpg", label: "烧物散步道·老街" },
    { image: "trips/tokoname/tokoname_06.jpg", label: "招财猫·陶器" },
    { image: "trips/tokoname/tokoname_07.jpg", label: "招财猫店" },
    { image: "trips/tokoname/tokoname_08.jpg", label: "常滑烧·陶器店" },
    { image: "trips/tokoname/tokoname_09.jpg", label: "古民家·庭" },
    { image: "trips/tokoname/tokoname_10.jpg", label: "陶艺café" },
    { image: "trips/tokoname/tokoname_11.jpg", label: "常滑·花火" },
  ],
};

/* -------------------------------------------------------- 中部·名古屋 ----- */
export const NAGOYA_REEL: TripReelConfig = {
  title: "名古屋一日",
  subtitle: "清洲城·庭园·老街·食品样本",
  handle: "@獨自旅遊亂走",
  outroTitle: "名古屋别只转车",
  outroSub: "留一天刚好",
  accent: "#8C6239",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/nagoya/nagoya_01.jpg", label: "清洲城", sub: "织田信长居城" },
    { image: "trips/nagoya/nagoya_02.jpg", label: "金鯱", sub: "名古屋象征" },
    { image: "trips/nagoya/nagoya_03.jpg", label: "名古屋·庭园" },
    { image: "trips/nagoya/nagoya_04.jpg", label: "庭园·茶室" },
    { image: "trips/nagoya/nagoya_05.jpg", label: "日本庭园" },
    { image: "trips/nagoya/nagoya_06.jpg", label: "名古屋·社殿" },
    { image: "trips/nagoya/nagoya_07.jpg", label: "料亭·和室" },
    { image: "trips/nagoya/nagoya_08.jpg", label: "灯笼·和室" },
    { image: "trips/nagoya/nagoya_09.jpg", label: "食品样本", sub: "名古屋名产" },
    { image: "trips/nagoya/nagoya_10.jpg", label: "古民家·縁侧" },
    { image: "trips/nagoya/nagoya_11.jpg", label: "名古屋美食" },
  ],
};

/* -------------------------------------------------------- 中部·郡上八幡 ----- */
export const GUJO_REEL: TripReelConfig = {
  title: "郡上八幡",
  subtitle: "水之町·日本最古木造再建城",
  handle: "@獨自旅遊亂走",
  outroTitle: "别只冲高山白川乡",
  outroSub: "这座水之町太可惜",
  accent: "#8C6239",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/gujo/gujo_01.jpg", label: "郡上八幡城", sub: "日本最古木造再建" },
    { image: "trips/gujo/gujo_02.jpg", label: "水之小径", sub: "やなか/いがわ" },
    { image: "trips/gujo/gujo_03.jpg", label: "吉田川·桥" },
    { image: "trips/gujo/gujo_04.jpg", label: "城下町老街" },
    { image: "trips/gujo/gujo_05.jpg", label: "老街与山" },
    { image: "trips/gujo/gujo_06.jpg", label: "城下町" },
    { image: "trips/gujo/gujo_07.jpg", label: "郡上八幡城·庭" },
    { image: "trips/gujo/gujo_08.jpg", label: "食品样本", sub: "发祥地" },
    { image: "trips/gujo/gujo_09.jpg", label: "旧庁舎记念馆" },
    { image: "trips/gujo/gujo_10.jpg", label: "郡上舞", sub: "三大盆踊" },
    { image: "trips/gujo/gujo_11.jpg", label: "清流·水景" },
    { image: "trips/gujo/gujo_12.jpg", label: "长良川铁道" },
    { image: "trips/gujo/gujo_13.jpg", label: "木造老屋" },
    { image: "trips/gujo/gujo_14.jpg", label: "古民家·室内" },
    { image: "trips/gujo/gujo_15.jpg", label: "城下町·食べ歩き" },
  ],
};

/* -------------------------------------------------------- 中部·妻籠宿 ----- */
export const TSUMAGO_REEL: TripReelConfig = {
  title: "妻笼宿",
  subtitle: "日本首个重传建·江户宿场",
  handle: "@獨自旅遊亂走",
  outroTitle: "时间停在江户",
  outroSub: "保存最完整的宿场",
  accent: "#8C6239",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/tsumago/tsumago_01.jpg", label: "妻笼宿", sub: "木造宿场街" },
    { image: "trips/tsumago/tsumago_02.jpg", label: "妻笼·街道" },
    { image: "trips/tsumago/tsumago_03.jpg", label: "妻笼·枡形街" },
    { image: "trips/tsumago/tsumago_04.jpg", label: "妻笼·街与山" },
    { image: "trips/tsumago/tsumago_05.jpg", label: "旅籠·水车" },
    { image: "trips/tsumago/tsumago_06.jpg", label: "木造旅籠" },
    { image: "trips/tsumago/tsumago_07.jpg", label: "妻笼街" },
    { image: "trips/tsumago/tsumago_08.jpg", label: "旅籠·街屋" },
    { image: "trips/tsumago/tsumago_09.jpg", label: "妻笼街道" },
    { image: "trips/tsumago/tsumago_10.jpg", label: "本阵·脇本阵" },
    { image: "trips/tsumago/tsumago_11.jpg", label: "脇本阵·座敷" },
    { image: "trips/tsumago/tsumago_12.jpg", label: "旅籠·室内" },
    { image: "trips/tsumago/tsumago_13.jpg", label: "囲炉裏" },
    { image: "trips/tsumago/tsumago_14.jpg", label: "妻笼·街与绿" },
    { image: "trips/tsumago/tsumago_15.jpg", label: "妻笼·街与山" },
  ],
};

/* -------------------------------------------------------- 中部·馬籠宿 ----- */
export const MAGOME_REEL: TripReelConfig = {
  title: "马笼宿·中山道",
  subtitle: "江户古道·徒步妻笼",
  handle: "@獨自旅遊亂走",
  outroTitle: "走完马笼到妻笼",
  outroSub: "7.7公里的中山道",
  accent: "#8C6239",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/magome/magome_01.jpg", label: "马笼宿", sub: "石叠坡" },
    { image: "trips/magome/magome_02.jpg", label: "石叠坡·恵那山" },
    { image: "trips/magome/magome_03.jpg", label: "马笼·街与山" },
    { image: "trips/magome/magome_04.jpg", label: "木造旅籠" },
    { image: "trips/magome/magome_05.jpg", label: "旅籠·街屋" },
    { image: "trips/magome/magome_06.jpg", label: "旅籠" },
    { image: "trips/magome/magome_07.jpg", label: "恵那山远望" },
    { image: "trips/magome/magome_08.jpg", label: "高札场" },
    { image: "trips/magome/magome_09.jpg", label: "中山道道标", sub: "妻笼⇔马笼" },
    { image: "trips/magome/magome_10.jpg", label: "杉并木古道" },
    { image: "trips/magome/magome_11.jpg", label: "中山道" },
    { image: "trips/magome/magome_12.jpg", label: "古道·道标" },
    { image: "trips/magome/magome_13.jpg", label: "杉并木" },
    { image: "trips/magome/magome_14.jpg", label: "杉木古道" },
    { image: "trips/magome/magome_15.jpg", label: "旅籠·古钟" },
  ],
};

/* -------------------------------------------------------- 大阪·天王寺あべの ----- */
export const ABENO_REEL: TripReelConfig = {
  title: "天王寺·阿倍野",
  subtitle: "あべのハルカス·真田幸村古战场",
  handle: "@獨自旅遊亂走",
  outroTitle: "南大阪一区逛半天",
  outroSub: "ハルカス+公园+新世界",
  accent: "#E5322D",
  coverSec: 2.6, slideSec: 2.8, outroSec: 3,
  slides: [
    { image: "trips/abeno/abeno_01.jpg", label: "あべのハルカス", sub: "日本最高车站楼" },
    { image: "trips/abeno/abeno_02.jpg", label: "大阪天际线" },
    { image: "trips/abeno/abeno_03.jpg", label: "大阪市立美术馆" },
    { image: "trips/abeno/abeno_04.jpg", label: "天王寺公园" },
    { image: "trips/abeno/abeno_05.jpg", label: "天王寺·神社" },
    { image: "trips/abeno/abeno_06.jpg", label: "茶臼山", sub: "大阪之阵古战场" },
  ],
};

/* -------------------------------------------------------- 大阪·新世界 ----- */
export const SHINSEKAI_REEL: TripReelConfig = {
  title: "新世界·通天阁",
  subtitle: "大阪最有烟火气的夜",
  handle: "@獨自旅遊亂走",
  outroTitle: "天黑后才是大阪",
  outroSub: "在那盏霓虹里",
  accent: "#E5322D",
  coverSec: 2.6, slideSec: 2.7, outroSec: 3,
  slides: [
    { image: "trips/shinsekai/shinsekai_01.jpg", label: "通天阁", sub: "点灯" },
    { image: "trips/shinsekai/shinsekai_02.jpg", label: "通天阁·夜" },
    { image: "trips/shinsekai/shinsekai_03.jpg", label: "新世界", sub: "霓虹街" },
    { image: "trips/shinsekai/shinsekai_04.jpg", label: "新世界·霓虹" },
    { image: "trips/shinsekai/shinsekai_05.jpg", label: "新世界街" },
    { image: "trips/shinsekai/shinsekai_06.jpg", label: "新世界·招牌" },
    { image: "trips/shinsekai/shinsekai_07.jpg", label: "新世界", sub: "清晨" },
  ],
};

/* ------------------------------------------------------ 京都·市区citywalk ----- */
export const KYOTOCITY_REEL: TripReelConfig = {
  title: "京都市区citywalk",
  subtitle: "祇园·鸭川·锦市场·京都塔",
  handle: "@獨自旅遊亂走",
  outroTitle: "京都不只清水寺",
  outroSub: "市中心慢慢串起来",
  accent: "#A07CC5",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kyotocity/kyotocity_01.jpg", label: "八坂神社", sub: "西楼门·重文" },
    { image: "trips/kyotocity/kyotocity_02.jpg", label: "八坂神社", sub: "南楼门·鸟居" },
    { image: "trips/kyotocity/kyotocity_03.jpg", label: "祇园·清晨" },
    { image: "trips/kyotocity/kyotocity_04.jpg", label: "锦市场", sub: "京都厨房" },
    { image: "trips/kyotocity/kyotocity_05.jpg", label: "高瀬川·木屋町" },
    { image: "trips/kyotocity/kyotocity_06.jpg", label: "京都御所" },
    { image: "trips/kyotocity/kyotocity_07.jpg", label: "京都和牛" },
    { image: "trips/kyotocity/kyotocity_08.jpg", label: "雛祭", sub: "季节限定" },
    { image: "trips/kyotocity/kyotocity_09.jpg", label: "京都站" },
    { image: "trips/kyotocity/kyotocity_10.jpg", label: "京都塔" },
  ],
};

/* -------------------------------------------------------- 京都·二三年坂 ----- */
export const NINENZAKA_REEL: TripReelConfig = {
  title: "二年坂·三年坂",
  subtitle: "百年町家星巴克·东山石叠",
  handle: "@獨自旅遊亂走",
  outroTitle: "跟清水寺一起拼早上",
  outroSub: "白天这条坡会爆",
  accent: "#A07CC5",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/ninenzaka/ninenzaka_01.jpg", label: "二寧坂", sub: "町家星巴克" },
    { image: "trips/ninenzaka/ninenzaka_02.jpg", label: "八坂通·町家" },
    { image: "trips/ninenzaka/ninenzaka_03.jpg", label: "二三年坂", sub: "石叠老街" },
    { image: "trips/ninenzaka/ninenzaka_04.jpg", label: "二年坂·坂道" },
    { image: "trips/ninenzaka/ninenzaka_05.jpg", label: "石阶坂道" },
    { image: "trips/ninenzaka/ninenzaka_06.jpg", label: "京町家·木格子" },
    { image: "trips/ninenzaka/ninenzaka_07.jpg", label: "二寧坂星巴克", sub: "外观" },
    { image: "trips/ninenzaka/ninenzaka_08.jpg", label: "星巴克·榻榻米席" },
    { image: "trips/ninenzaka/ninenzaka_09.jpg", label: "樱花拿铁" },
    { image: "trips/ninenzaka/ninenzaka_10.jpg", label: "町家·丸窗" },
    { image: "trips/ninenzaka/ninenzaka_11.jpg", label: "东山·八坂塔远望" },
    { image: "trips/ninenzaka/ninenzaka_12.jpg", label: "东山街景" },
  ],
};

/* ---------------------------------------------------------- 京都·清水寺 ----- */
export const KIYOMIZU_REEL: TripReelConfig = {
  title: "清水寺",
  subtitle: "清晨6点·世界遗产空景",
  handle: "@獨自旅遊亂走",
  outroTitle: "6点开门就上去",
  outroSub: "趁旅行团来之前",
  accent: "#A07CC5",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kiyomizu/kiyomizu_01.jpg", label: "三重塔" },
    { image: "trips/kiyomizu/kiyomizu_02.jpg", label: "本堂·伽蓝" },
    { image: "trips/kiyomizu/kiyomizu_03.jpg", label: "仁王门" },
    { image: "trips/kiyomizu/kiyomizu_04.jpg", label: "仁王门·朱红" },
    { image: "trips/kiyomizu/kiyomizu_05.jpg", label: "西门" },
    { image: "trips/kiyomizu/kiyomizu_06.jpg", label: "三重塔·伽蓝" },
    { image: "trips/kiyomizu/kiyomizu_07.jpg", label: "子安塔回望" },
    { image: "trips/kiyomizu/kiyomizu_08.jpg", label: "子安塔" },
    { image: "trips/kiyomizu/kiyomizu_09.jpg", label: "清水の舞台" },
    { image: "trips/kiyomizu/kiyomizu_10.jpg", label: "清水坂·石阶" },
    { image: "trips/kiyomizu/kiyomizu_11.jpg", label: "清水坂·清晨" },
  ],
};

/* -------------------------------------------------------- 富山·富山城市電 ----- */
export const TCASTLE_REEL: TripReelConfig = {
  title: "富山城·市电",
  subtitle: "市中心半日citywalk",
  handle: "@獨自旅遊亂走",
  outroTitle: "慢富山·留个半天",
  outroSub: "搭复古市电逛城",
  accent: "#2E6B8F",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/tcastle/tcastle_01.jpg", label: "富山城", sub: "模拟天守" },
    { image: "trips/tcastle/tcastle_02.jpg", label: "富山城天守" },
    { image: "trips/tcastle/tcastle_03.jpg", label: "天守" },
    { image: "trips/tcastle/tcastle_04.jpg", label: "城址公园" },
    { image: "trips/tcastle/tcastle_05.jpg", label: "城门·松川" },
    { image: "trips/tcastle/tcastle_06.jpg", label: "城址公园" },
    { image: "trips/tcastle/tcastle_07.jpg", label: "城址公园", sub: "天守" },
    { image: "trips/tcastle/tcastle_08.jpg", label: "富山站·市电", sub: "夜" },
    { image: "trips/tcastle/tcastle_09.jpg", label: "富山站", sub: "复古市电" },
    { image: "trips/tcastle/tcastle_10.jpg", label: "市电·站前" },
    { image: "trips/tcastle/tcastle_11.jpg", label: "市电" },
    { image: "trips/tcastle/tcastle_12.jpg", label: "富山站·市电" },
    { image: "trips/tcastle/tcastle_13.jpg", label: "富山站" },
    { image: "trips/tcastle/tcastle_14.jpg", label: "城址公园·松" },
  ],
};

/* -------------------------------------------------------- 富山·雨晴海岸 ----- */
export const AMA_REEL: TripReelConfig = {
  title: "雨晴海岸",
  subtitle: "海越しに立山连峰·女岩",
  handle: "@獨自旅遊亂走",
  outroTitle: "冬天冷晨拼一趟",
  outroSub: "海上的3000m雪山",
  accent: "#2E6B8F",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/ama/ama_01.jpg", label: "海上立山连峰" },
    { image: "trips/ama/ama_02.jpg", label: "女岩" },
    { image: "trips/ama/ama_03.jpg", label: "女岩", sub: "清晨" },
    { image: "trips/ama/ama_04.jpg", label: "女岩", sub: "富山湾" },
    { image: "trips/ama/ama_05.jpg", label: "女岩·松" },
    { image: "trips/ama/ama_06.jpg", label: "海岸", sub: "清晨" },
    { image: "trips/ama/ama_07.jpg", label: "雨晴海岸" },
    { image: "trips/ama/ama_08.jpg", label: "雨晴駅" },
    { image: "trips/ama/ama_09.jpg", label: "雨晴駅", sub: "月台" },
    { image: "trips/ama/ama_10.jpg", label: "氷见线", sub: "红列车" },
    { image: "trips/ama/ama_11.jpg", label: "氷见线·月台" },
    { image: "trips/ama/ama_12.jpg", label: "氷见线", sub: "贴海开" },
    { image: "trips/ama/ama_13.jpg", label: "氷见线·雨晴駅" },
  ],
};

/* -------------------------------------------------------- 富山·環水公園 ----- */
export const KANSUI_REEL: TripReelConfig = {
  title: "环水公园",
  subtitle: "世界最美星巴克·蓝调",
  handle: "@獨自旅遊亂走",
  outroTitle: "日落后20分钟",
  outroSub: "才是环水公园封神时刻",
  accent: "#2E6B8F",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kansui/kansui_01.jpg", label: "环水公园", sub: "蓝调时刻" },
    { image: "trips/kansui/kansui_02.jpg", label: "天门桥", sub: "倒影" },
    { image: "trips/kansui/kansui_03.jpg", label: "天门桥", sub: "光束" },
    { image: "trips/kansui/kansui_04.jpg", label: "运河·点灯" },
    { image: "trips/kansui/kansui_05.jpg", label: "蓝调时刻" },
    { image: "trips/kansui/kansui_06.jpg", label: "イルミ步道" },
    { image: "trips/kansui/kansui_07.jpg", label: "黄昏" },
    { image: "trips/kansui/kansui_08.jpg", label: "运河·天门桥" },
    { image: "trips/kansui/kansui_09.jpg", label: "富岩运河" },
    { image: "trips/kansui/kansui_10.jpg", label: "天门桥", sub: "双塔展望" },
    { image: "trips/kansui/kansui_11.jpg", label: "环水公园" },
    { image: "trips/kansui/kansui_12.jpg", label: "运河步道" },
  ],
};

/* ------------------------------------------------------------ 金澤·尾山神社 ----- */
export const OYAMA_REEL: TripReelConfig = {
  title: "尾山神社",
  subtitle: "和漢洋神门·彩绘玻璃",
  handle: "@獨自旅遊亂走",
  outroTitle: "神社配彩绘玻璃",
  outroSub: "全日本几乎只有这里",
  accent: "#C9A227",
  coverSec: 2.6, slideSec: 3.0, outroSec: 3,
  slides: [
    { image: "trips/oyama/oyama_01.jpg", label: "神门", sub: "和漢洋·彩绘玻璃" },
    { image: "trips/oyama/oyama_02.jpg", label: "拝殿" },
    { image: "trips/oyama/oyama_03.jpg", label: "拝殿·早梅" },
    { image: "trips/oyama/oyama_04.jpg", label: "前田利家骑马像" },
    { image: "trips/oyama/oyama_05.jpg", label: "神苑" },
  ],
};

/* ---------------------------------------------------------- 金澤·鈴木大拙館 ----- */
export const SUZUKI_REEL: TripReelConfig = {
  title: "铃木大拙馆",
  subtitle: "水镜の庭·金泽最静的庭",
  handle: "@獨自旅遊亂走",
  outroTitle: "金泽最静的10分钟",
  outroSub: "留给水镜の庭",
  accent: "#C9A227",
  coverSec: 2.6, slideSec: 3.4, outroSec: 3,
  slides: [
    { image: "trips/suzuki/suzuki_01.jpg", label: "水镜の庭", sub: "思索空间栋" },
    { image: "trips/suzuki/suzuki_02.jpg", label: "水镜の庭", sub: "全景" },
    { image: "trips/suzuki/suzuki_03.jpg", label: "思索空间栋", sub: "倒影" },
    { image: "trips/suzuki/suzuki_04.jpg", label: "学习空间·回廊" },
  ],
};

/* ------------------------------------------------------------ 金澤·東茶屋街 ----- */
export const HIGASHI_REEL: TripReelConfig = {
  title: "东茶屋街",
  subtitle: "清晨无人的金箔老街",
  handle: "@獨自旅遊亂走",
  outroTitle: "清晨没人的茶屋街",
  outroSub: "11点后就挤满了",
  accent: "#C9A227",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/higashi/higashi_01.jpg", label: "东茶屋街", sub: "清晨无人" },
    { image: "trips/higashi/higashi_02.jpg", label: "主街", sub: "清晨" },
    { image: "trips/higashi/higashi_03.jpg", label: "茶屋街", sub: "晨光" },
    { image: "trips/higashi/higashi_04.jpg", label: "木格子小巷" },
    { image: "trips/higashi/higashi_05.jpg", label: "御茶屋", sub: "のれん" },
    { image: "trips/higashi/higashi_06.jpg", label: "茶屋·大树" },
    { image: "trips/higashi/higashi_07.jpg", label: "茶屋座敷", sub: "室内" },
    { image: "trips/higashi/higashi_08.jpg", label: "金箔店" },
    { image: "trips/higashi/higashi_09.jpg", label: "茶屋街" },
    { image: "trips/higashi/higashi_10.jpg", label: "坡道小巷" },
    { image: "trips/higashi/higashi_11.jpg", label: "浅野川畔" },
    { image: "trips/higashi/higashi_12.jpg", label: "浅野川·桥" },
    { image: "trips/higashi/higashi_13.jpg", label: "南天·茶屋" },
    { image: "trips/higashi/higashi_14.jpg", label: "茶屋老屋" },
  ],
};

/* ---------------------------------------------------------- 金澤·長町武家屋敷 ----- */
export const NAGAMACHI_REEL: TripReelConfig = {
  title: "长町·野村家庭园",
  subtitle: "武士老街的日本名园",
  handle: "@獨自旅遊亂走",
  outroTitle: "坐在縁侧发呆",
  outroSub: "长町最值得的20分钟",
  accent: "#4F7942",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/nagamachi/nagamachi_01.jpg", label: "野村家庭园", sub: "米其林2星" },
    { image: "trips/nagamachi/nagamachi_02.jpg", label: "庭园", sub: "石灯笼" },
    { image: "trips/nagamachi/nagamachi_03.jpg", label: "縁侧·庭园" },
    { image: "trips/nagamachi/nagamachi_04.jpg", label: "庭园·曲水" },
    { image: "trips/nagamachi/nagamachi_05.jpg", label: "庭园·大树" },
    { image: "trips/nagamachi/nagamachi_06.jpg", label: "庭园·早梅" },
    { image: "trips/nagamachi/nagamachi_07.jpg", label: "武家屋敷", sub: "床の间" },
    { image: "trips/nagamachi/nagamachi_08.jpg", label: "縁侧·水景" },
    { image: "trips/nagamachi/nagamachi_09.jpg", label: "加贺友禅" },
    { image: "trips/nagamachi/nagamachi_10.jpg", label: "武家屋敷" },
    { image: "trips/nagamachi/nagamachi_11.jpg", label: "土塀老街" },
    { image: "trips/nagamachi/nagamachi_12.jpg", label: "土塀老街", sub: "早梅" },
    { image: "trips/nagamachi/nagamachi_13.jpg", label: "武家屋敷门" },
    { image: "trips/nagamachi/nagamachi_14.jpg", label: "长町街景" },
  ],
};

/* ------------------------------------------------------------- 金澤·金澤城 ----- */
export const KANAZAWA_CASTLE_REEL: TripReelConfig = {
  title: "金泽城公园",
  subtitle: "兼六园隔壁·免费百万石",
  handle: "@獨自旅遊亂走",
  outroTitle: "免费的百万石城",
  outroSub: "大多人只逛兼六园,可惜了",
  accent: "#C9A227",
  coverSec: 2.6, slideSec: 2.5, outroSec: 3,
  slides: [
    { image: "trips/kanazawacastle/kanazawacastle_01.jpg", label: "五十间长屋" },
    { image: "trips/kanazawacastle/kanazawacastle_02.jpg", label: "菱栌·五十间长屋" },
    { image: "trips/kanazawacastle/kanazawacastle_03.jpg", label: "石川门" },
    { image: "trips/kanazawacastle/kanazawacastle_04.jpg", label: "城郭建筑" },
    { image: "trips/kanazawacastle/kanazawacastle_05.jpg", label: "桥爪门木桥" },
    { image: "trips/kanazawacastle/kanazawacastle_06.jpg", label: "玉泉院丸庭园" },
    { image: "trips/kanazawacastle/kanazawacastle_07.jpg", label: "城内·杉木道" },
    { image: "trips/kanazawacastle/kanazawacastle_08.jpg", label: "三の丸广场" },
    { image: "trips/kanazawacastle/kanazawacastle_09.jpg", label: "玉泉院丸", sub: "夜间点灯" },
    { image: "trips/kanazawacastle/kanazawacastle_10.jpg", label: "鼠多门桥" },
    { image: "trips/kanazawacastle/kanazawacastle_11.jpg", label: "鼠多门桥" },
    { image: "trips/kanazawacastle/kanazawacastle_12.jpg", label: "鼠多门", sub: "木组" },
    { image: "trips/kanazawacastle/kanazawacastle_13.jpg", label: "玉泉院丸", sub: "休憩馆" },
    { image: "trips/kanazawacastle/kanazawacastle_14.jpg", label: "玉泉院丸庭园" },
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

/* --- 関西賞櫻 EP 系列(資料驅動;由 scripts/gen-sakura-eps.mjs 產生 eps/<slug>.json) --- */
import amanoEps from "./eps/amano.json";
import ineEps from "./eps/ine.json";
const SAKURA_EP_JSONS = [amanoEps, ineEps];
const SAKURA_EP_REELS: { id: string; cfg: TripReelConfig }[] = SAKURA_EP_JSONS.flatMap(
  (e) => e.reels as { id: string; cfg: TripReelConfig }[],
);

/* ----------------------------------------------------- 関西賞櫻·姫路城(白鷺城) ----- */
export const HIMEJI_REEL: TripReelConfig = {
  title: "姫路城",
  subtitle: "世界遗产·白鹭城樱花",
  handle: "@獨自旅遊亂走",
  outroTitle: "日本第一座世界遗产",
  outroSub: "白鹭城配1000棵樱",
  accent: "#DE6E9C",
  coverSec: 2.6, slideSec: 2.7, outroSec: 3,
  slides: [
    { image: "trips/himeji/himeji_01.jpg", label: "姫路城", sub: "世界遗产·三の丸" },
    { image: "trips/himeji/himeji_02.jpg", label: "大天守", sub: "白鹭城" },
    { image: "trips/himeji/himeji_03.jpg", label: "姫路城", sub: "松与樱" },
    { image: "trips/himeji/himeji_04.jpg", label: "大天守", sub: "樱花季" },
    { image: "trips/himeji/himeji_05.jpg", label: "姫路城", sub: "城与市景" },
    { image: "trips/himeji/himeji_06.jpg", label: "姫路城", sub: "远望" },
    { image: "trips/himeji/himeji_07.jpg", label: "大手前通", sub: "站前参道" },
  ],
};

/* ----------------------------------------------------- 関西賞櫻·城崎温泉(外湯) ----- */
export const KINOSAKI_REEL: TripReelConfig = {
  title: "城崎温泉",
  subtitle: "外汤めぐり·柳与樱",
  handle: "@獨自旅遊亂走",
  outroTitle: "穿浴衣逛七个外汤",
  outroSub: "1300年的柳树汤町",
  accent: "#C4607E",
  coverSec: 2.6, slideSec: 2.6, outroSec: 3,
  slides: [
    { image: "trips/kinosaki/kinosaki_01.jpg", label: "大谿川", sub: "柳并木" },
    { image: "trips/kinosaki/kinosaki_02.jpg", label: "太鼓桥", sub: "大谿川" },
    { image: "trips/kinosaki/kinosaki_03.jpg", label: "大谿川", sub: "石桥与柳" },
    { image: "trips/kinosaki/kinosaki_04.jpg", label: "温泉街", sub: "大谿川" },
    { image: "trips/kinosaki/kinosaki_05.jpg", label: "温泉街", sub: "樱花" },
    { image: "trips/kinosaki/kinosaki_06.jpg", label: "温泉街", sub: "外汤巡" },
    { image: "trips/kinosaki/kinosaki_07.jpg", label: "城崎", sub: "街景" },
    { image: "trips/kinosaki/kinosaki_08.jpg", label: "城崎温泉", sub: "商店街" },
    { image: "trips/kinosaki/kinosaki_09.jpg", label: "城崎温泉站" },
    { image: "trips/kinosaki/kinosaki_10.jpg", label: "温泉寺" },
  ],
};

/** All trip reels, registered as a Folder in Root.tsx. */
export const TRIP_REELS: { id: string; cfg: TripReelConfig }[] = [
  { id: "KinosakiReel", cfg: KINOSAKI_REEL },
  { id: "HimejiReel", cfg: HIMEJI_REEL },
  ...SAKURA_EP_REELS,
  { id: "KenrokuReel", cfg: KENROKU_REEL },
  { id: "TokonameReel", cfg: TOKONAME_REEL },
  { id: "NagoyaReel", cfg: NAGOYA_REEL },
  { id: "GujoReel", cfg: GUJO_REEL },
  { id: "TsumagoReel", cfg: TSUMAGO_REEL },
  { id: "MagomeReel", cfg: MAGOME_REEL },
  { id: "AbenoReel", cfg: ABENO_REEL },
  { id: "ShinsekaiReel", cfg: SHINSEKAI_REEL },
  { id: "KyotocityReel", cfg: KYOTOCITY_REEL },
  { id: "NinenzakaReel", cfg: NINENZAKA_REEL },
  { id: "KiyomizuReel", cfg: KIYOMIZU_REEL },
  { id: "TcastleReel", cfg: TCASTLE_REEL },
  { id: "AmaReel", cfg: AMA_REEL },
  { id: "KansuiReel", cfg: KANSUI_REEL },
  { id: "OyamaReel", cfg: OYAMA_REEL },
  { id: "SuzukiReel", cfg: SUZUKI_REEL },
  { id: "HigashiReel", cfg: HIGASHI_REEL },
  { id: "NagamachiReel", cfg: NAGAMACHI_REEL },
  { id: "KanazawaCastleReel", cfg: KANAZAWA_CASTLE_REEL },
  { id: "KanazawaReel", cfg: KANAZAWA_REEL },
  { id: "ToyamaReel", cfg: TOYAMA_REEL },
  { id: "NiigataReel", cfg: NIIGATA_REEL },
  { id: "OsakaReel", cfg: OSAKA_REEL },
  { id: "KyotoReel", cfg: KYOTO_REEL },
  { id: "InuyamaReel", cfg: INUYAMA_REEL },
];

/* --------------------------------------------------- 小紅書 3:4 covers (Still) ----- */
import type { XhsCoverConfig } from "./XhsCover";

/** Per-spot XHS covers, registered as <Still> in Root.tsx (Folder Xhs-Covers). */
export const XHS_COVERS: { id: string; cfg: XhsCoverConfig }[] = [
  {
    id: "KinosakiCover",
    cfg: {
      image: "trips/kinosaki/_cover_src.jpg",
      accent: "#C4607E",
      pillL: "一个人旅行",
      pillR: "温泉古镇",
      hookL: "穿浴衣逛7个外汤",
      hookR: "柳树太鼓桥配满开樱",
      title: "城崎温泉",
      subtitle: "1300年汤町·外汤めぐり发祥地",
      handle: "@独自旅游乱走",
      focus: "50% 50%",
      ep: "",
    },
  },
  {
    id: "HimejiCover",
    cfg: {
      image: "trips/himeji/_cover_src.jpg",
      accent: "#DE6E9C",
      pillL: "一个人旅行",
      pillR: "世界遗产",
      hookL: "日本第一座世界遗产",
      hookR: "1000棵樱花围着白鹭城",
      title: "姫路城",
      subtitle: "国宝五城·白鹭城樱花满开",
      handle: "@独自旅游乱走",
      focus: "50% 60%",
      ep: "",
    },
  },
  ...SAKURA_EP_JSONS.flatMap((e) => e.covers as { id: string; cfg: XhsCoverConfig }[]),
];
