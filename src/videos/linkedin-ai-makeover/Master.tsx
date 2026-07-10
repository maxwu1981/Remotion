import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-manifest.json";
import { ACC, WhiteBg } from "./glass";
import { MakeoverCover } from "./Cover";
import {
  BlockedScene,
  BannerRevealScene,
  BonusScene,
  DecayScene,
  ExperienceScene,
  HeadlineScene,
  HonestScene,
  HookScene,
  LinkupScene,
  MakeoverOutroScene,
  Mark,
  OneAskScene,
  PositionForkScene,
  SceneProps,
  ScoreboardScene,
  SkillsGrowScene,
  WordingTrapScene,
} from "./Scenes";

/**
 * 「丟一份舊履歷給 AI,LinkedIn/GitHub 全自動翻新」— 生活應用 EP01,故事腳本 13 章。
 * 視覺 v3(2026-07-03 高級感精修):白底+黑曜石玻璃卡(銀玻璃 v2 退役),檔案卡獨石碑封面。
 * 全片個資遮蔽:不繪出真實姓名/帳號網址/任何公司名/城市(公司用「前公司 A/B」代稱,
 * banner 用馬賽克重繪版 public/linkedin-makeover/banner-redacted.png)。
 * 防抖:白底全片靜態墊底,景與景只 fade 內容;字幕 opacity 淡入。
 */
const FPS = 30;
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 16;
const GAP = 8;
const TAIL = 22;
const XFADE = 11;
const COVER = 66;

type Line = { id: string; cap: string };
type SceneDef = { key: string; chapter: number; lines: Line[]; Comp: React.FC<SceneProps> };

const OSpan: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ACC.ember }}>{children}</span>
);
const ANCHORS: React.ReactNode[] = [
  <>先把 <OSpan>定位</OSpan> 吵清楚,AI 才知道怎麼寫</>,
  <>從零建好,兩邊 <OSpan>互相連結</OSpan></>,
  <><OSpan>程式碼精準畫</OSpan>,AI 生圖中文會亂碼</>,
  <>措辭差一字,<OSpan>誠信</OSpan> 差很多</>,
  <>頭銜 = <OSpan>獵頭會搜的關鍵字</OSpan></>,
  <>經歷用 <OSpan>動詞 + 數字</OSpan> 寫成果</>,
  <>技能欄 = 給 <OSpan>搜尋系統</OSpan> 讀的資料庫</>,
  <>沒開口,它也 <OSpan>順手做了</OSpan></>,
  <>AI 搭 <OSpan>舞台</OSpan>,你上台握手</>,
  <>總成績 = 幾杯咖啡 + <OSpan>十幾次確認</OSpan></>,
];

const SCENES: SceneDef[] = [
  {
    key: "hook",
    chapter: -1,
    Comp: HookScene,
    lines: [
      { id: "h1", cap: "我把一份三年沒更新的舊履歷丟給 Claude,然後去倒了一杯咖啡" },
      { id: "h2", cap: "回來的時候,它已經自己打開瀏覽器,把檔案從封面到技能欄整個翻新" },
      { id: "h3", cap: "這支影片,把它做的每一件事拆給你看,包括三個我沒想到的盲點" },
    ],
  },
  {
    key: "decay",
    chapter: -1,
    Comp: DecayScene,
    lines: [
      { id: "a1", cap: "先講我的起點,有多慘" },
      { id: "a2", cap: "檔案放了快三年沒動,過去七天只有 41 人看過,貼文曝光是 0" },
      { id: "a3", cap: "技能欄只有兩項,各一個肯定" },
      { id: "a4", cap: "最致命的是,十六年資歷只剩現職一段" },
      { id: "a5", cap: "獵頭搜的是經歷和技能關鍵字,這種檔案等於不存在" },
    ],
  },
  {
    key: "blocked",
    chapter: -1,
    Comp: BlockedScene,
    lines: [
      { id: "b1", cap: "不是不知道要改,是每次打開編輯頁就放棄" },
      { id: "b2", cap: "幾十個欄位不知道從哪下手,也不知道獵頭到底搜什麼" },
      { id: "b3", cap: "所以我換了個做法,把整件事外包給 AI" },
    ],
  },
  {
    key: "ask",
    chapter: -1,
    Comp: OneAskScene,
    lines: [
      { id: "c1", cap: "我只做一件事:跟它說幫我更新檔案,讓 HR 更容易注意到我" },
      { id: "c2", cap: "剩下它自己來,而且每一步送出前都停下來讓我確認" },
    ],
  },
  {
    key: "position",
    chapter: 0,
    Comp: PositionForkScene,
    lines: [
      { id: "d1", cap: "它先問我一個沒想過的問題" },
      { id: "d2", cap: "走十六年資歷主管路線,還是轉型 AI 工程師路線?寫法完全不同" },
      { id: "d3", cap: "拍板:資歷為主,AI 當加分項" },
    ],
  },
  {
    key: "linkup",
    chapter: 1,
    Comp: LinkupScene,
    lines: [
      { id: "e1", cap: "發現我根本沒有個人主頁,直接從零建好上線" },
      { id: "e2", cap: "把兩個平台互相連起來,點進任何一邊都能繞到另一邊" },
    ],
  },
  {
    key: "banner",
    chapter: 2,
    Comp: BannerRevealScene,
    lines: [
      { id: "f1", cap: "封面橫幅不是 AI 生圖亂做,是程式碼精準畫,文字零糊字" },
      { id: "f2", cap: "發現字被大頭照擋住,量出遮擋範圍,整版右移重出一張" },
    ],
  },
  {
    key: "wording",
    chapter: 3,
    Comp: WordingTrapScene,
    lines: [
      { id: "g1", cap: "第一個我完全沒注意到的盲點" },
      { id: "g2", cap: "banner 原本寫「某兩家國際大廠 + 十六年經驗」,我自己看覺得很順" },
      { id: "g3", cap: "會讓人以為我在那兩家公司上過班,實際是代工端替他們交付專案" },
      { id: "g4", cap: "它主動改成「為誰交付了三億兩千萬美元的專案」,一字之差誠信差很多" },
    ],
  },
  {
    key: "headline",
    chapter: 4,
    Comp: HeadlineScene,
    lines: [
      { id: "i1", cap: "頭銜原本是系統預設的職稱加公司名" },
      { id: "i2", cap: "改成一整串獵頭會搜的關鍵字,再加一句會用 AI 提效" },
    ],
  },
  {
    key: "experience",
    chapter: 5,
    Comp: ExperienceScene,
    lines: [
      { id: "j1", cap: "它去雲端硬碟把履歷翻出來,抓出前兩家公司的完整資歷" },
      { id: "j2", cap: "駕駛瀏覽器一欄一欄填回去,每段寫成動詞加數字的成果" },
      { id: "j3", cap: "第二個盲點:送出前特地關掉兩個預設選項" },
      { id: "j4", cap: "不讓舊經歷蓋掉頭銜、關掉通知人脈,不然像換工作的假消息" },
    ],
  },
  {
    key: "skills",
    chapter: 6,
    Comp: SkillsGrowScene,
    lines: [
      { id: "k1", cap: "技能欄,兩項變二十四項" },
      { id: "k2", cap: "第三個盲點:技能欄不是給人看的,是給獵頭搜尋系統讀的資料庫" },
      { id: "k3", cap: "挑的十七個新技能全是標準詞條,一個一個加完還回頭核對清單" },
    ],
  },
  {
    key: "bonus",
    chapter: 7,
    Comp: BonusScene,
    lines: [
      { id: "l1", cap: "還有一堆我沒開口的事,它順手做了" },
      { id: "l2", cap: "檢查連結是否活著、存進長期記憶、關掉推銷視窗、偵測重複技能" },
    ],
  },
  {
    key: "honest",
    chapter: 8,
    Comp: HonestScene,
    lines: [
      { id: "m1", cap: "也有它做不到的,誠實講" },
      { id: "m2", cap: "推薦信是零要真人寫,技能肯定是零要同事點" },
      { id: "m3", cap: "AI 能把舞台搭好,站上去握手還是得我自己" },
    ],
  },
  {
    key: "scoreboard",
    chapter: 9,
    Comp: ScoreboardScene,
    lines: [
      { id: "n1", cap: "最後看總成績" },
      { id: "n2", cap: "技能 2→24、經歷 1→3、頭銜預設→關鍵字、封面空白→定製、主頁無→上線" },
      { id: "n3", cap: "花的時間,大概幾杯咖啡,和十幾次按下確認鍵" },
    ],
  },
  {
    key: "outro",
    chapter: -1,
    Comp: MakeoverOutroScene,
    lines: [
      { id: "o1", cap: "訂閱、按讚、分享給那個檔案也荒廢很久的朋友" },
      { id: "o2", cap: "把 AI 當同事用的頻道,我們下支影片見" },
    ],
  },
];

const sceneFrames = (s: SceneDef) =>
  LEAD + s.lines.reduce((a, l) => a + sec(l.id), 0) + (s.lines.length - 1) * GAP + TAIL;

const sceneMarks = (s: SceneDef): Mark[] => {
  let off = LEAD;
  return s.lines.map((l) => {
    const m = { start: off, end: off + sec(l.id) };
    off += sec(l.id) + GAP;
    return m;
  });
};

export const LINKEDIN_MAKEOVER_FRAMES =
  COVER + SCENES.reduce((a, s) => a + sceneFrames(s), 0) - SCENES.length * XFADE;

const fadeIn = (frame: number, at: number, d = 12) =>
  interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const TopBanner: React.FC<{ chapter: number }> = ({ chapter }) => {
  const f = useCurrentFrame();
  if (chapter < 0) return null;
  return (
    <div style={{ position: "absolute", top: 36, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 6, 16) }}>
      <div
        style={{
          padding: "12px 38px",
          borderRadius: 999,
          background: "rgba(13,19,34,0.66)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 10px 24px rgba(11,16,32,0.24), 0 2px 6px rgba(11,16,32,0.16), inset 0 1px 0 rgba(255,255,255,0.22)",
        }}
      >
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 31, color: "#f4f7fb", letterSpacing: 1 }}>
          {ANCHORS[chapter]}
        </span>
      </div>
    </div>
  );
};

const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, at - 4, 8) * (1 - fadeIn(f, until - 2, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1620, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 38, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

const SceneShell: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const dur = sceneFrames(scene);
  const marks = sceneMarks(scene);
  return (
    <AbsoluteFill>
      <scene.Comp dur={dur} marks={marks} />
      <TopBanner chapter={scene.chapter} />
      {scene.lines.map((l, i) => (
        <Caption key={l.id} text={l.cap} at={marks[i].start} until={marks[i].end + GAP} />
      ))}
      {scene.lines.map((l, i) => (
        <Sequence key={`a-${l.id}`} from={marks[i].start}>
          <Audio src={staticFile(`vo/linkedin-ai-makeover/${l.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const CoverFlash: React.FC = () => (
  <AbsoluteFill>
    <MakeoverCover />
  </AbsoluteFill>
);

export const LinkedinAiMakeover: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill>
    <WhiteBg />
    {bgm && <Audio loop src={staticFile("bgm-crystal.mp3")} volume={0.11} />}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={COVER}>
        <CoverFlash />
      </TransitionSeries.Sequence>
      {SCENES.flatMap((s) => [
        <TransitionSeries.Transition key={`tr-${s.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
        <TransitionSeries.Sequence key={`seq-${s.key}`} durationInFrames={sceneFrames(s)}>
          <SceneShell scene={s} />
        </TransitionSeries.Sequence>,
      ])}
    </TransitionSeries>
  </AbsoluteFill>
);
