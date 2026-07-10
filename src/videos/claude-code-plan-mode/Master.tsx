import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-manifest.json";
import { ACC, Glare, WhiteBg, darkCard, rgba } from "./glass";
import { PlanModeCover } from "./Cover";
import {
  CompareScene,
  ComplaintsScene,
  FailedApproachesScene,
  HookScene,
  Mark,
  MasterPromptScene,
  PlanModeOutroScene,
  ProofScene,
  PromptCard,
  SceneProps,
  SolutionScene,
} from "./Scenes";

/**
 * 「新手知道一下比較好的名詞」EP07 · Claude Code Plan Mode — 黑曜石高級感精修版。
 * 內容沿用每日影片工廠 2026-07-03 雙 agent 合議 brief(對照 code.claude.com/docs/en/permission-modes.md
 * + ultraplan 查證) + 3 則真實 GitHub issue 抱怨 + Anthropic 官方 93% 核准率數據。
 * 只重製視覺(白底+黑曜石玻璃卡),原 36 句旁白/節拍沿用 vo-manifest.json;
 * 另補 4 句(sa0p + g1-3)套用 [[tutorial-video-show-claude-prompts]] 標準規則:
 * solution 景開頭 💬 PromptCard(對 Claude 說的 settings.json 設定句)+ outro 前一格
 * MasterPromptScene(片尾合成 master prompt 禮物,兩關驗證見 Scenes.tsx 註解)。
 */
const FPS = 30;
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 16;
const GAP = 8;
const TAIL = 22;
const XFADE = 11;
const COVER = 66;
const INTRO = 84;

type Line = { id: string; cap: string };
type SceneDef = { key: string; chapter: number; lines: Line[]; Comp: React.FC<SceneProps>; promptText?: string };

/** 每章開場卡:Gemini 圖(白底+黑曜石玻璃+暖橙光+近正面微傾,無文字)+ 中文站名藥丸 + 大標題。 */
const INTRO_CARDS: Record<string, { img: string; eyebrow: string; title: string }> = {
  hook: { img: "gemini/claude-code-plan-mode/ch1.png", eyebrow: "痛點", title: "核准框轟炸" },
  complaints: { img: "gemini/claude-code-plan-mode/ch2.png", eyebrow: "真實心聲", title: "大家都在抱怨" },
  failed: { img: "gemini/claude-code-plan-mode/ch3.png", eyebrow: "為何解不掉", title: "三招都沒用" },
  solution: { img: "gemini/claude-code-plan-mode/ch4.png", eyebrow: "解法", title: "切進 Plan Mode" },
  compare: { img: "gemini/claude-code-plan-mode/ch5.png", eyebrow: "差異化", title: "一次看全貌" },
  proof: { img: "gemini/claude-code-plan-mode/ch6.png", eyebrow: "實測佐證", title: "官方內建機制" },
  gift: { img: "gemini/claude-code-plan-mode/ch7.png", eyebrow: "禮物", title: "完整指令" },
};

const OSpan: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ACC.ember }}>{children}</span>
);
const ANCHORS: React.ReactNode[] = [
  <>唯讀先出計畫，<OSpan>你來決定</OSpan></>,
  <>一次看全貌，<OSpan>不拆成幾十次核准</OSpan></>,
  <>官方內建機制，<OSpan>不是偏方</OSpan></>,
];

const SCENES: SceneDef[] = [
  {
    key: "hook",
    chapter: -1,
    Comp: HookScene,
    lines: [
      { id: "cv1", cap: "改大範圍程式碼，被跳出來的核准框轟炸過，這支就是要解決這件事" },
      { id: "cv2", cap: "我把「先看完整份計畫、一次決定」這招找出來，取代一直按核准的日子" },
      { id: "cv3", cap: "先說清楚：這個困擾，真的不是只有你" },
    ],
  },
  {
    key: "complaints",
    chapter: -1,
    Comp: ComplaintsScene,
    lines: [
      { id: "na1", cap: "我上網查了 GitHub 上真實回報，發現這個痛，一個接一個" },
      { id: "na2", cap: "明明開了「編輯前先問」，Claude 還是直接改了檔案，設定重來也沒用，卡了兩個多禮拜" },
      { id: "na3", cap: "只是問一句「為什麼分頁沒有頁碼」，結果被當成編輯指令，二十幾次呼叫直接改了好幾個檔案" },
      { id: "na4", cap: "工作樹明明乾淨，還是每次都要手動按允許，很麻煩" },
      { id: "na5", cap: "Anthropic 自己的工程部落格都承認，使用者平均核准了 93% 的權限提示——多半按到疲乏" },
      { id: "na6", cap: "你看，同一個痛，一個接一個，蓋滿整個螢幕" },
    ],
  },
  {
    key: "failed",
    chapter: -1,
    Comp: FailedApproachesScene,
    lines: [
      { id: "fa1", cap: "為什麼會這樣？預設模式是「每一步都問」，任務一大，提示就跟著暴增" },
      { id: "fa2", cap: "第一招，硬著頭皮全部按核准，改到後面根本沒在看，就是前面 93% 的由來" },
      { id: "fa3", cap: "第二招，乾脆切成自動模式全部跳過，遇到真正危險的改動也來不及攔" },
      { id: "fa4", cap: "第三招，把規則寫進 CLAUDE.md 交代「先問我」，但版本一有 bug，照樣被改" },
      { id: "fa5", cap: "三招的共同死穴：不是按到疲乏、就是風險失控，要不然就是不保證有效" },
    ],
  },
  {
    key: "solution",
    chapter: 0,
    Comp: SolutionScene,
    promptText: "幫我在 .claude/settings.json 裡加上 permissions.defaultMode 設成 plan，這樣以後一開新對話都先進 Plan Mode，唯讀先出計畫，不會直接動手改檔案",
    lines: [
      { id: "sa0p", cap: "跟 Claude 說：幫我在 settings.json 設定 Plan Mode 當預設" },
      { id: "sa1", cap: "真正的解法，是先切進 Plan Mode，讓 Claude 只能讀、不能動手" },
      { id: "sa2", cap: "按 Shift+Tab，在 default、acceptEdits、plan 三種模式間切換，切到 plan 就對了" },
      { id: "sa3", cap: "也可以開頭就加 --permission-mode plan，或打 /plan 加你要它規劃的內容" },
      { id: "sa4", cap: "要它變成預設，在 .claude/settings.json 的 permissions 裡把 defaultMode 設成 plan" },
      { id: "sa5", cap: "這段時間它只能讀檔、跑唯讀指令，寫檔、改檔、有副作用的指令全部先被擋下" },
    ],
  },
  {
    key: "compare",
    chapter: 1,
    Comp: CompareScene,
    lines: [
      { id: "da1", cap: "這就是 Plan Mode，跟「全部按核准」「全部自動跳過」最大的不同" },
      { id: "da2", cap: "全部按核准，是把同一個決定拆成幾十次，按到最後根本沒在看" },
      { id: "da3", cap: "全部自動跳過，省事，但真正危險的改動也一起被放過" },
      { id: "da4", cap: "Plan Mode 是先把整份計畫攤開來，一次看完、一次決定，而不是拆成幾十次" },
      { id: "da5", cap: "核准之後你還能選：轉自動執行、轉逐一核准、或送進瀏覽器版 Ultraplan 共審" },
      { id: "da6", cap: "一次看清全貌、按需核准、還能多人共審，這三點，另外兩種都做不到" },
    ],
  },
  {
    key: "proof",
    chapter: 2,
    Comp: ProofScene,
    lines: [
      { id: "pa1", cap: "那怎麼知道這真的有解？" },
      { id: "pa2", cap: "同樣一個跨十幾個檔案的重構，default 要按幾十次核准；plan 只要決定一次" },
      { id: "pa3", cap: "Anthropic 自己都說，使用者平均核准 93% 的提示——正是 Plan Mode 想解決的問題" },
      { id: "pa4", cap: "這是官方文件寫在 permission-modes 頁面裡的正式機制，不是偏方，也沒被標記過時" },
      { id: "pa5", cap: "覺得計畫還要調整，Ctrl+G 直接編輯，或送進 Ultraplan 讓別人留言，再回來執行" },
    ],
  },
  {
    key: "gift",
    chapter: -1,
    Comp: MasterPromptScene,
    lines: [
      { id: "g1", cap: "最後，送給看到這裡的你一個禮物" },
      { id: "g2", cap: "這一整段，是把前面每一步合成的一句完整指令" },
      { id: "g3", cap: "暫停整段複製，貼給 Claude，它就能幫你把 Plan Mode 設定好，順便教你怎麼用" },
    ],
  },
  {
    key: "outro",
    chapter: -1,
    Comp: PlanModeOutroScene,
    lines: [
      { id: "o1", cap: "快速總整理" },
      { id: "o2", cap: "痛點：預設模式逐步核准按到疲乏，bug 甚至讓「先問我」照樣被略過" },
      { id: "o3", cap: "解法：Shift+Tab 或 --permission-mode plan 切進 Plan Mode，唯讀先出計畫" },
      { id: "o4", cap: "差別：一次看全貌、按需核准、可送 Ultraplan 多人共審" },
      { id: "o5", cap: "官方內建機制：docs 裡 permission-modes 的正式功能，不是過時、也不是偏方" },
      { id: "o6", cap: "下次大改動前，先切 Plan Mode 看一次計畫吧。按讚、訂閱、分享，我們下次見！" },
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

const INTRO_COUNT = SCENES.filter((s) => INTRO_CARDS[s.key]).length;
export const PLAN_MODE_FRAMES =
  COVER + SCENES.reduce((a, s) => a + sceneFrames(s), 0) + INTRO_COUNT * INTRO - (SCENES.length + INTRO_COUNT) * XFADE;

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
  const o = fadeIn(f, at - 4, 8) * (1 - fadeIn(f, until - 6, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1620, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 36, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

/** prompt 句期間的全幀 💬 PromptCard overlay(蓋住該景內容,句末淡出接內容)。 */
const PromptBeat: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const out = 1 - fadeIn(f, dur - 9, 9);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <WhiteBg />
      <PromptCard text={text} />
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const dur = sceneFrames(scene);
  const marks = sceneMarks(scene);
  const promptDur = scene.promptText && marks.length > 1 ? marks[1].start - marks[0].start + 9 : 0;
  return (
    <AbsoluteFill>
      <scene.Comp dur={dur} marks={marks} />
      {scene.promptText && promptDur > 0 && (
        <Sequence from={marks[0].start} durationInFrames={promptDur}>
          <PromptBeat text={scene.promptText} dur={promptDur} />
        </Sequence>
      )}
      <TopBanner chapter={scene.chapter} />
      {scene.lines.map((l, i) => (
        (scene.promptText && i === 0) ? null : <Caption key={l.id} text={l.cap} at={marks[i].start} until={marks[i].end + GAP} />
      ))}
      {scene.lines.map((l, i) => (
        <Sequence key={`a-${l.id}`} from={marks[i].start}>
          <Audio src={staticFile(`vo/claude-code-plan-mode/${l.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const CoverFlash: React.FC = () => (
  <AbsoluteFill>
    <PlanModeCover />
  </AbsoluteFill>
);

/** 章節開場卡:框住的 Gemini 圖(黑曜石玻璃卡)+ 橙站名藥丸 + 中文大標題,淡入。 */
const ChapterIntroCard: React.FC<{ img: string; eyebrow: string; title: string }> = ({ img, eyebrow, title }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 3, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "56px 90px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, opacity: o, transform: `translateY(${(1 - o) * 26}px)` }}>
        <div style={{ position: "relative", width: 1120, overflow: "hidden", ...darkCard(ACC.ember, { r: 30, glow: 1 }) }}>
          <Glare />
          <Img src={staticFile(img)} style={{ width: "100%", display: "block", position: "relative" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "7px 24px", borderRadius: 999, background: rgba(ACC.ember, 0.1), border: `1px solid ${rgba(ACC.ember, 0.4)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 4, color: ACC.ember, marginBottom: 16 }}>{eyebrow}</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 72, letterSpacing: 3, color: ACC.ink }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ClaudeCodePlanMode: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill>
    <WhiteBg />
    {bgm && <Audio loop src={staticFile("bgm-claude-code-plan-mode.mp3")} volume={0.11} />}
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
