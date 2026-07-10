import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-manifest.json";
import { WhiteBg, ACC, rgba } from "./glass";
import { XhsAutoCover } from "./Cover";
import { PackRealCombo } from "./RealCase";
import { PromptChip, MasterPromptScene } from "./Prompts";
import {
  Mark,
  SceneProps,
  DemoScene,
  MapScene,
  CompareScene,
  RulesScene,
  StatFlipScene,
  ListScene,
  EditScene,
  VerifyScene,
  PitfallScene,
  HandScene,
  OutroScene,
} from "./Scenes";

/**
 * 「小紅書發文全自動化」生活應用系列 EP03 (16:9, 1920×1080, 30fps)。
 * 主軸=我們如何自動化。EP00 玻璃進化版精修(白底+黑曜石玻璃卡)貫穿+獨石碑封面。
 * 防抖:白底全片靜態墊底,景間只 fade 內容;字幕/概念錨 opacity 淡入。
 */
const FPS = 30;
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 16;
const GAP = 8;
const TAIL = 22;
const XFADE = 11;
const COVER = 66; // 0:00 封面亮相 2.2s

/** pad = 該句唸完後的額外停留幀數(靜默 demo 段,只有 BGM;下一句 VO 順延)。 */
type Line = { id: string; cap: string; pad?: number };
type SceneDef = { key: string; chapter: number; lines: Line[]; Comp: React.FC<SceneProps>; prompt?: string };

const OSpan: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ACC.ember }}>{children}</span>
);
/** 概念錨(頂帶;index = SceneDef.chapter)。 */
const ANCHORS: React.ReactNode[] = [
  <>一行指令,<OSpan>整篇發好</OSpan></>,
  <><OSpan>七站</OSpan>產線</>,
  <>像真人的<OSpan>瀏覽器分身</OSpan></>,
  <><OSpan>防封三鐵則</OSpan></>,
  <>文案 AI 寫,<OSpan>數字它自己查</OSpan></>,
  <>一個資料夾 = <OSpan>一篇筆記</OSpan></>,
  <>實拍片也能<OSpan>自動剪</OSpan></>,
  <>一行指令做完<OSpan>六件事</OSpan></>,
  <>坑① <OSpan>設定會自己變</OSpan></>,
  <>坑② <OSpan>草稿會吃素材</OSpan></>,
  <>最後<OSpan>三下滑鼠</OSpan>留給人</>,
  <>先私密,<OSpan>再公開</OSpan></>,
];

const cap = (id: string, cap: string, pad?: number): Line => ({ id, cap, pad });

/** 章節開場卡:每個有 Gemini 圖的章節,在場景前閃一張「框住的 Gemini 圖 + 小紅書紅站名 + 中文標題」(3s)。 */
const INTRO = 90;
const INTRO_CARDS: Record<string, { img: string; eyebrow: string; title: string }> = {
  demo: { img: "gemini/xhs-auto/ch1.png", eyebrow: "先看一眼成果", title: "一鍵發完整篇" },
  env: { img: "gemini/xhs-auto/ch3.png", eyebrow: "第 一 站", title: "環境建置" },
  rules: { img: "gemini/xhs-auto/ch4.png", eyebrow: "第 二 站", title: "防封三鐵則" },
  geo: { img: "gemini/xhs-auto/ch5.png", eyebrow: "第 三 站", title: "GEO 文案" },
  edit: { img: "gemini/xhs-auto/ch7.png", eyebrow: "第 四 站 · 影片篇", title: "實拍自動剪" },
  upload: { img: "gemini/xhs-auto/ch8.png", eyebrow: "第 五 站 · 重頭戲", title: "一鍵自動上傳" },
  hand: { img: "gemini/xhs-auto/ch11.png", eyebrow: "第 六 站", title: "這三下留給人" },
  outro: { img: "gemini/xhs-auto/ch13.png", eyebrow: "總 結", title: "40 分 → 3 分鐘" },
};

const SCENES: SceneDef[] = [
  { key: "demo", chapter: 0, Comp: DemoScene, lines: [
    cap("c1-1", "影片、標題、正文、8 標籤、5 章節,全是 Claude Code 自動完成"),
    cap("c1-1b", "你只要出創意;講不清楚,就讓它問你 30 個問題,問到懂為止"),
    cap("c1-2", "這不是概念展示,是我每天在跑的真實流程", 720), // +24s 靜默實錄重演

    cap("c1-3", "Claude 動手前先講它打算怎麼做,我點頭它才自動執行"),
    cap("c1-4", "每一站該對 Claude 說的那句話,我都放在畫面上,看到最後還有整段禮物"),
  ] },
  { key: "map", chapter: 1, Comp: MapScene, lines: [
    cap("c2-1", "整條產線,Claude 幫我拆成七站"),
    cap("c2-2", "前兩站是地基:環境建置、防封框架"),
    cap("c2-3", "中間三站內容產線:文案、素材、重頭戲一鍵上傳"),
    cap("c2-4", "最後兩站:發布前把關、發布後營運"),
    cap("c2-5", "每站 Claude 都自動執行,但關鍵決定一定先問過我"),
  ] },
  { key: "env", chapter: 2, Comp: CompareScene, prompt: "開真 Chrome 的 debug 埠、connectOverCDP 接上、webdriver 保持 false", lines: [
    cap("c3-1", "第一站:平台看得出你是不是機器人"),
    cap("c3-2", "一般工具一啟動就帶指紋,平台風控系統一查一個準"),
    cap("c3-3", "所以 Claude 開一個專用的真瀏覽器分身"),
    cap("c3-4", "它用指令自己啟動真 Chrome,配獨立使用者資料夾"),
    cap("c3-5", "我只掃碼一次,之後 Claude 每次自己接上去"),
    cap("c3-6", "它從外面接上這顆已在跑的真 Chrome"),
    cap("c3-7", "關鍵在 webdriver:框架開=true 被抓,Claude 接=false 像真人"),
  ] },
  { key: "rules", chapter: 3, Comp: RulesScene, prompt: "防封三鐵則：先私密、一天≤1–3篇、發布鈕留我按", lines: [
    cap("c4-1", "第二站:防封。Claude 幫我立規矩也自己守,先講代價 7 天的教訓"),
    cap("c4-2", "今年六月,我的帳號被封了整整七天"),
    cap("c4-3", "當時那套方案:帶指紋瀏覽器 + 高頻檢查,被抓"),
    cap("c4-4", "自動化該省的是苦工,不是判斷"),
    cap("c4-5", "重建流程時,我要求 Claude 守三條鐵則"),
    cap("c4-6", "① 先發僅自己可見,自檢才轉公開"),
    cap("c4-7", "② 一天最多 1–3 篇,絕不衝量"),
    cap("c4-8", "③ 最後那顆發布鈕,Claude 永遠不碰,留給我按"),
    cap("c4-9", "三條立下來:30 多篇,零事故"),
  ] },
  { key: "geo", chapter: 4, Comp: StatFlipScene, prompt: "文案標題≤20字、正文≤1000字、問答體、數字你自己上網查", lines: [
    cap("c5-1", "第三站:文案。連內容都是 Claude 寫的,但有規矩"),
    cap("c5-2", "標題 ≤20 字、正文 ≤1000 字,寫成問答形式"),
    cap("c5-3", "每段標題是真問題,答案一定有具體數字"),
    cap("c5-4", "但 Claude 寫完不直接用,會自己上網把每個數字查證一遍"),
    cap("c5-5", "金澤巴士一日券:舊文寫 600,它一查,實際是 800"),
    cap("c5-6", "錯一個數字信任就沒了,這步它一定親自上網查過才算數"),
    cap("c5-7", "每段補一行:適合誰、不適合誰"),
  ] },
  { key: "pack", chapter: 5, Comp: PackRealCombo, prompt: "素材整成固定格式包：壓字封面＋編號圖＋文案.txt", lines: [
    cap("c6-1", "第四站:素材。先講圖文筆記"),
    cap("c6-2", "Claude 把每篇素材自動整理成固定格式資料夾:發布包"),
    cap("c6-3", "三樣:壓字封面、編號圖片、文案檔"),
    cap("c6-4", "重點:上傳腳本只認資料夾格式,不認內容"),
    cap("c6-5", "只要包格式對,任何一篇都同一行指令發出去", 240), // +8s 全幅真實金澤案例卡展示
  ] },
  { key: "edit", chapter: 6, Comp: EditScene, prompt: "亂拍自動剪：濾家人、分段、放慢、配BGM、封面烘進第0秒", lines: [
    cap("c7-1", "影片筆記更有趣,連剪輯都是 Claude 自動完成的"),
    cap("c7-2", "金澤清晨實拍:Claude 把 22 支亂拍片段剪成 3 分半成片"),
    cap("c7-3", "① 它抽縮圖、標出有家人入鏡的,問我要不要剔,我點頭它就自動刪"),
    cap("c7-4", "② 它把同地點鏡頭自動排一起,順序照走法,章節才乾淨"),
    cap("c7-5", "③ 它量測運鏡、判斷太晃,自動放慢 2.5x,晃動降近六成"),
    cap("c7-6", "④ 配低音量 BGM,頭尾淡入淡出"),
    cap("c7-7", "⑤ 封面海報烘進影片第 0 秒"),
    cap("c7-8", "平台預設抓第一幀當封面,上傳封面這步直接消失"),
    cap("c7-9", "⑥ 章節時間+名稱存成清單檔,待會兒有大用"),
  ] },
  { key: "upload", chapter: 7, Comp: VerifyScene, prompt: "一句指令上傳、每項讀回核對、標籤精準命中、停在發布鈕", lines: [
    cap("c8-1", "第五站重頭戲:Claude 一句指令自動做完六件事"),
    cap("c8-2", "影片、標題、正文、標籤、僅自己可見、章節"),
    cap("c8-3", "幾個踩坑才知道的關鍵細節"),
    cap("c8-4", "① 標籤要等下拉、精準命中才是真話題有流量"),
    cap("c8-5", "② 章節會自動排序:先填名再填時間,反了會掉光"),
    cap("c8-6", "③ 最重要:每填一項,Claude 都把頁面值重新讀回來核對"),
    cap("c8-7", "一致才存,對不上就自動取消"),
    cap("c8-8", "寧可不存,也不存錯"),
    cap("c8-9", "工程師加料:影片 100+MB 撞 50MB 限制,走除錯通道只傳路徑"),
  ] },
  { key: "p1", chapter: 8, Comp: (p) => <PitfallScene {...p} tag="坑 ①" title="可見範圍會自己變公開" symptom="閒置太久,設好的「仅自己可见」跳回「公开可见」" fix="按發布前最後一刻,重新讀一次這個欄位" />, lines: [
    cap("c9-1", "接下來兩個坑是 Claude 幫我擋下的,每個都可能讓努力歸零"),
    cap("c9-2", "坑一:閒置太久,可見範圍自己跳回公開可見"),
    cap("c9-3", "我親眼看著僅自己可見變回公開"),
    cap("c9-4", "沒發現就按發布,防封第一鐵則直接破功"),
    cap("c9-5", "解法:Claude 按發布前最後一刻,一定自動重讀這欄確認"),
  ] },
  { key: "p2", chapter: 9, Comp: (p) => <PitfallScene {...p} tag="坑 ②" title="草稿取回會吃掉影片+章節" symptom="草稿存回再拿出,影片顯示「请上传视频」、章節歸零,只剩文字" fix="重傳影片 → 等轉碼 → 讀 章节.tsv 重填(1 分鐘)" />, lines: [
    cap("c10-1", "第二個坑更狠"),
    cap("c10-2", "草稿存回再拿出,影片跟章節被清空,只剩文字"),
    cap("c10-3", "標題正文還在,但影片顯示請上傳視頻,章節歸零"),
    cap("c10-4", "Claude 的解法:自動重傳影片、等轉碼、章節清單重填"),
    cap("c10-5", "因為章節存成檔案,重填只要一分鐘"),
    cap("c10-6", "中心思想:設定都存檔,頁面易失,檔案永遠能重來"),
  ] },
  { key: "hand", chapter: 10, Comp: HandScene, prompt: "停下讓我手動：原创声明、添加地点、按發布", lines: [
    cap("c11-1", "第六站:Claude 不自己動手的三件事,一定停下等我"),
    cap("c11-2", "① 原创声明開關:程式點沒反應,只吃真手勢"),
    cap("c11-3", "② 添加地點:自動選容易選錯地方"),
    cap("c11-4", "③ 發布按鈕:這是鐵則,不是技術限制"),
    cap("c11-5", "Claude 把一切填好就停住,我檢查一遍,點三下發布"),
    cap("c11-6", "這三下,是整條產線僅剩的手工,最後的人工把關"),
  ] },
  { key: "ops", chapter: 11, Comp: (p) => <ListScene {...p} title="先私密,再公開" items={[
    ["僅自己可見自檢", "用讀者的眼睛看畫面/數字/標籤"],
    ["都對,才轉公開", "第一鐵則的收尾"],
    ["加進同一合集", "平台自動帶上一篇的合集"],
    ["低頻但穩定", "帳號權重慢慢養起來"],
  ]} />, lines: [
    cap("c12-1", "發布之後,還有第七站"),
    cap("c12-2", "僅自己可見下用讀者的眼睛檢查一遍,都對才轉公開"),
    cap("c12-3", "同系列加進同一合集,平台自動帶上一篇"),
    cap("c12-4", "低頻但穩定,帳號權重就這樣養起來"),
  ] },
  { key: "gift", chapter: -1, Comp: () => <MasterPromptScene />, lines: [
    cap("cGift-1", "在說再見前,送給看到這裡的你一個禮物"),
    cap("cGift-2", "我把剛剛這幾站,合成一整段可以直接貼給 Claude 的話"),
    cap("cGift-3", "暫停這一格,整段複製,貼給 Claude,它就從零幫你把整套建起來"),
    cap("cGift-4", "記得:小紅書官方不鼓勵自動化,壓低頻率、內容真實、風險自負", 120),
  ] },
  { key: "outro", chapter: -1, Comp: OutroScene, lines: [
    cap("c13-1", "最後算個總帳"),
    cap("c13-2", "以前手動一篇:上傳/填寫/封面/標籤/章節,約 40 分鐘"),
    cap("c13-3", "現在:一句指令 3 分鐘,其餘全是 Claude 自動完成"),
    cap("c13-4", "一週省下的時間,夠我多拍兩支素材"),
    cap("c13-5", "這套思路不只小紅書,任何有發布頁的平台 Claude 都能搭"),
    cap("c13-6", "訂閱、按讚、分享給也在熬夜發文的朋友"),
    cap("c13-7", "下一支:把產線搬到別的平台,我們下支片見"),
  ] },
];

const sceneFrames = (s: SceneDef) =>
  LEAD + s.lines.reduce((a, l) => a + sec(l.id) + (l.pad ?? 0), 0) + (s.lines.length - 1) * GAP + TAIL;

const sceneMarks = (s: SceneDef): Mark[] => {
  let off = LEAD;
  return s.lines.map((l) => {
    const m = { start: off, end: off + sec(l.id) };
    off += sec(l.id) + GAP + (l.pad ?? 0);
    return m;
  });
};

const INTRO_COUNT = SCENES.filter((s) => INTRO_CARDS[s.key]).length;
export const XHS_AUTO_FRAMES =
  COVER + SCENES.reduce((a, s) => a + sceneFrames(s), 0) + INTRO_COUNT * INTRO - (SCENES.length + INTRO_COUNT) * XFADE;

const fadeIn = (frame: number, at: number, d = 12) =>
  interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const TopBanner: React.FC<{ chapter: number }> = ({ chapter }) => {
  const f = useCurrentFrame();
  if (chapter < 0 || chapter >= ANCHORS.length) return null;
  return (
    <div style={{ position: "absolute", top: 36, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 6, 16) }}>
      <div style={{ padding: "12px 38px", borderRadius: 999, background: "rgba(13,19,34,0.66)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 24px rgba(11,16,32,0.24), 0 2px 6px rgba(11,16,32,0.16), inset 0 1px 0 rgba(255,255,255,0.22)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 31, color: "#f4f7fb", letterSpacing: 1 }}>{ANCHORS[chapter]}</span>
      </div>
    </div>
  );
};

/** 上一句 until = 下一句 at(sceneMarks 銜接處);淡出要在 at 前收乾淨,淡入從 at 才開始,
 *  否則兩句字幕會在交接處同時半透明疊在一起變鬼影(2026-07-03 老闆抓到 8:23/8:50 抖動)。 */
const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, at, 6) * (1 - fadeIn(f, until - 6, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1620, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 40, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
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
      {scene.prompt && <PromptChip text={scene.prompt} />}
      {scene.lines.map((l, i) => (
        <Caption key={l.id} text={l.cap} at={marks[i].start} until={marks[i].end + GAP} />
      ))}
      {scene.lines.map((l, i) => (
        <Sequence key={`a-${l.id}`} from={marks[i].start}>
          <Audio src={staticFile(`vo/xhs-automation-tutorial/${l.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** 章節開場卡:框住的 Gemini 圖(白底像小紅書筆記卡)+ 小紅書紅站名藥丸 + 中文大標題,淡入。 */
const ChapterIntroCard: React.FC<{ img: string; eyebrow: string; title: string }> = ({ img, eyebrow, title }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 3, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "56px 90px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, opacity: o, transform: `translateY(${(1 - o) * 26}px)` }}>
        <div style={{ width: 1120, borderRadius: 30, overflow: "hidden", border: "4px solid #ffffff", boxShadow: `0 34px 80px ${rgba(ACC.xhs, 0.18)}, 0 10px 24px rgba(11,16,32,0.12)` }}>
          <Img src={staticFile(img)} style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "7px 24px", borderRadius: 999, background: rgba(ACC.xhs, 0.1), border: `1px solid ${rgba(ACC.xhs, 0.3)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 4, color: ACC.xhs, marginBottom: 16 }}>{eyebrow}</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 72, letterSpacing: 3, color: ACC.ink }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CoverFlash: React.FC = () => (
  <AbsoluteFill>
    <XhsAutoCover />
  </AbsoluteFill>
);

export const XhsAutoEP01: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  // textSpacingTrim off:Chrome 的 CJK 標點擠壓在「全形標點相鄰但分屬不同字型分片」時
  // (如 p2 症狀行「」、」)會逐 render-worker 不一致 → 整行半字寬左右跳(2026-07-03 老闆抓到 8:29–9:02 抖動)。
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    {bgm && <Audio loop src={staticFile("bgm-xhs-automation-tutorial.mp3")} volume={0.11} />}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={COVER}>
        <CoverFlash />
      </TransitionSeries.Sequence>
      {SCENES.flatMap((s) => {
        const intro = INTRO_CARDS[s.key];
        const parts: React.ReactNode[] = [
          <TransitionSeries.Transition key={`tr-${s.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
        ];
        if (intro) {
          parts.push(
            <TransitionSeries.Sequence key={`intro-${s.key}`} durationInFrames={INTRO}>
              <ChapterIntroCard img={intro.img} eyebrow={intro.eyebrow} title={intro.title} />
            </TransitionSeries.Sequence>,
            <TransitionSeries.Transition key={`tri-${s.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          );
        }
        parts.push(
          <TransitionSeries.Sequence key={`seq-${s.key}`} durationInFrames={sceneFrames(s)}>
            <SceneShell scene={s} />
          </TransitionSeries.Sequence>,
        );
        return parts;
      })}
    </TransitionSeries>
  </AbsoluteFill>
);

export const XhsAutoPoster: React.FC = () => <XhsAutoCover />;
