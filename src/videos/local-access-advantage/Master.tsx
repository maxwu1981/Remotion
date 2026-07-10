import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-manifest.json";
import { MetalBg, SILVER } from "./glass";
import { LocalAccessCover } from "./Cover";
import {
  AskScene,
  CompareWall,
  KitchenScene,
  Mark,
  OutroScene,
  PainScene,
  ProofScene,
  RaceScene,
  SceneProps,
  StoryScene,
  TerminalScene,
  ThreeCasesScene,
} from "./Scenes";

/**
 * EP06「本地存取優勢」(新手名詞系列) — 本機路徑 vs 雲端存取(16:9, 1920×1080, 30fps)。
 * 銀灰霧玻璃資訊面板風貫穿全片(同封面);故事弧:我全丟雲端→變慢燒額度→
 * 直接問 Claude Code(真實截圖)→四回合比較→廚房比喻→兩個案例操作→分工結論→CTA。
 * 防抖:金屬底全片靜態墊底,景與景只 fade 內容;字幕 opacity 淡入。
 */
const FPS = 30;
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 16; // 每景 VO 起唸前鋪陳
const GAP = 8; // 同景句間停頓
const TAIL = 22; // 末句唸完留白
const XFADE = 11; // 景間交叉淡入
const COVER = 66; // 0:00 封面亮相 2.2s(縮圖同款,烘進片頭)

type Line = { id: string; cap: string };
type SceneDef = { key: string; chapter: number; lines: Line[]; Comp: React.FC<SceneProps> };

/** 章節概念錨(頂部藥丸帶;橘=術語)。 */
const OSpan: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: SILVER.orange }}>{children}</span>
);
const ANCHORS: React.ReactNode[] = [
  <>檔案放哪裡,決定 <OSpan>AI 多快拿到</OSpan></>,
  <><OSpan>本機</OSpan>=直讀 0 API call · <OSpan>雲端</OSpan>=繞網路 1+ call</>,
  <>路徑給對,<OSpan>AI 自己接手</OSpan></>,
  <><OSpan>本機</OSpan>給 Claude Code · <OSpan>雲端</OSpan>給 Gemini</>,
];

const SCENES: SceneDef[] = [
  {
    key: "s1",
    chapter: 0,
    Comp: RaceScene,
    lines: [
      { id: "h1", cap: "你請 AI 讀一個檔案,它可能正在繞地球一圈" },
      { id: "h2", cap: "放對地方幾毫秒到手;放錯地方,慢上百倍還多花錢" },
    ],
  },
  {
    key: "s2",
    chapter: 0,
    Comp: StoryScene,
    lines: [
      { id: "st1", cap: "我每天用 Claude Code 做影片,檔案整天丟來丟去" },
      { id: "st2", cap: "一開始想得很美:全放 Google Drive,走到哪讀到哪" },
      { id: "st3", cap: "直到發現——讀個檔案怎麼那麼慢,還一直吃額度?" },
    ],
  },
  {
    key: "s3",
    chapter: 0,
    Comp: PainScene,
    lines: [
      { id: "p1", cap: "AI 從雲端拿檔案:先呼叫工具、跨網路來回,一趟幾百毫秒" },
      { id: "p2", cap: "每檔至少多 1 次 API 呼叫,回應夾一堆結構,token 白燒" },
      { id: "p3", cap: "最痛:雲端這條路只能讀、不能改" },
    ],
  },
  {
    key: "s4",
    chapter: 1,
    Comp: AskScene,
    lines: [
      { id: "a1", cap: "與其上網查,不如直接問當事人——我原話這樣問 Claude Code" },
      { id: "a2", cap: "「對我來說,本機路徑完勝 Google Drive」" },
      { id: "a3", cap: "它給了一張完整比較表——四個回合,一個一個看" },
    ],
  },
  {
    key: "s5",
    chapter: 1,
    Comp: CompareWall,
    lines: [
      { id: "c1", cap: "回合① 存取:本機 Read/Bash 直讀 0 call;雲端每檔 1+ call" },
      { id: "c2", cap: "回合② 速度:硬碟直讀幾毫秒 vs 網路往返幾百毫秒,差約 100 倍" },
      { id: "c3", cap: "回合③ Token:本機只算內容;雲端多付 API 結構+metadata 過路費" },
      { id: "c4", cap: "回合④ 操作:本機讀改寫跑指令全行;雲端唯讀——4:0" },
    ],
  },
  {
    key: "s6",
    chapter: 1,
    Comp: KitchenScene,
    lines: [
      { id: "m1", cap: "本機路徑=自家冰箱:伸手就拿,想煎想炒都隨你" },
      { id: "m2", cap: "雲端=叫外送:等配送、付運費,外送員不進廚房幫你煮" },
      { id: "m3", cap: "廚師就住你家,卻每樣食材都叫外送——我之前幹的傻事" },
    ],
  },
  {
    key: "s7",
    chapter: 2,
    Comp: ThreeCasesScene,
    lines: [
      { id: "t1", cap: "路徑實際怎麼給?就三種情況" },
      { id: "t2", cap: "① 專案資料夾裡:它自動知道,講檔名就好" },
      { id: "t3", cap: "② 下載、文件等常用夾:知道規律,給檔名就找得到" },
      { id: "t4", cap: "③ 陌生路徑:Finder 拖進終端機,完整路徑自己跳出來" },
    ],
  },
  {
    key: "s8",
    chapter: 2,
    Comp: TerminalScene,
    lines: [
      { id: "d1", cap: "Gemini 生的音樂落在下載夾——我什麼路徑都沒報" },
      { id: "d2", cap: "它自己跑指令按時間排序,最新檔案立刻現形" },
      { id: "d3", cap: "再自己 cp 進專案——全程我沒打過一個字的路徑" },
    ],
  },
  {
    key: "s9",
    chapter: 3,
    Comp: ProofScene,
    lines: [
      { id: "v1", cap: "Before 每檔 1+ call·幾百毫秒 → After 0 call·幾毫秒·可改" },
      { id: "v2", cap: "陷阱:MCP 外掛每次對話要先載入,斷線=卡死;本機沒這問題" },
      { id: "v3", cap: "分工:本機路徑給 Claude Code;Drive 給讀不到你電腦的 Gemini" },
    ],
  },
  {
    key: "s10",
    chapter: -1,
    Comp: OutroScene,
    lines: [
      { id: "o1", cap: "檔案放哪裡,決定 AI 多快拿到、能不能動手" },
      { id: "o2", cap: "訂閱、按讚,分享給還在把檔案丟雲端的朋友——下集見" },
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

export const LOCAL_ACCESS_FRAMES =
  COVER + SCENES.reduce((a, s) => a + sceneFrames(s), 0) - SCENES.length * XFADE;

const fadeIn = (frame: number, at: number, d = 12) =>
  interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 頂部概念錨藥丸(該章節相關景持續重現;深底玻璃、橘字術語)。 */
const TopBanner: React.FC<{ chapter: number }> = ({ chapter }) => {
  const f = useCurrentFrame();
  if (chapter < 0) return null;
  return (
    <div style={{ position: "absolute", top: 36, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 6, 16) }}>
      <div
        style={{
          padding: "12px 36px",
          borderRadius: 999,
          background: "rgba(30,36,48,0.62)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 20px rgba(40,48,62,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 31, color: "#f4f7fb", letterSpacing: 0.5 }}>
          {ANCHORS[chapter]}
        </span>
      </div>
    </div>
  );
};

/** 底部硬字幕(與 VO 逐句同步;深底白字在銀底上最清楚)。 */
const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, at - 4, 8) * (1 - fadeIn(f, until - 2, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1620, padding: "16px 36px", borderRadius: 18, background: "rgba(30,36,48,0.68)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 42, lineHeight: 1.4, color: "#fff" }}>{text}</div>
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
          <Audio src={staticFile(`vo/local-access-advantage/${l.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** 0:00 封面亮相(縮圖同款;frame 0 就要完整可見——廚房 EP01 v9「frame 0 封面透明」被退的教訓,不淡入)。 */
const CoverFlash: React.FC = () => (
  <AbsoluteFill>
    <LocalAccessCover />
  </AbsoluteFill>
);

export const LocalAccessEP06: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill>
    {/* 金屬底全片墊底不參與轉場 → 景間只有內容 fade,底永遠穩定 */}
    <MetalBg />
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
