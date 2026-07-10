import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT } from "../../shared-skills/theme";

/**
 * SubagentTutorial — 16:9「詳細可照做」實操教學 master (1920×1080, 30fps).
 * 真實操作錄影(public/footage/tutorial.mov) 為主：每章「全窗 establish → Ken Burns 推近」到重點；
 * 左側清單裁掉；曉晴只在頭尾露臉、中間全給內容；全程字幕；分章節；結尾「換你試」可照貼。
 */
const ORANGE = "#E7902F";
const NAVY = "#0F1530";
const fade = (f: number, at: number, d = 14) => interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const TVO = (id: string) => <Audio src={staticFile(`vo/subagent-tutorial/${id}.mp3`)} />;

const Bg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(165deg, #0E2A4E 0%, #16365F 55%, #0A1626 100%)" }} />;

/** 章節標籤（左上，含步驟編號）。 */
const ChapterTag: React.FC<{ n: string; title: string }> = ({ n, title }) => (
  <div style={{ position: "absolute", top: 40, left: 80, display: "flex", alignItems: "center", gap: 14 }}>
    <span style={{ width: 52, height: 52, borderRadius: 14, background: ORANGE, color: "#1a1206", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 30 }}>{n}</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{title}</span>
  </div>
);

/** 全程字幕（底部）。 */
const Cap: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 80, right: 80, bottom: 54, textAlign: "center" }}>
    <span style={{ display: "inline-block", padding: "14px 30px", borderRadius: 18, background: "rgba(8,16,30,0.6)", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{text}</span>
  </div>
);

/** 真實操作畫面：mac 視窗只裁左側清單。短內容用大框(vw 大、文字大)，長內容用整窗框(裝全部)。播放時自然捲動帶出後續。 */
const Footage: React.FC<{ startFrom: number; dispW: number; ox: number; oy: number; vw?: number; src?: string; playbackRate?: number }> = ({ startFrom, dispW, ox, oy, vw = 1480, src = "footage/tutorial.mov", playbackRate = 1 }) => {
  const VW = vw, VH = 904;
  return (
    <div style={{ position: "absolute", top: 110, left: (1920 - VW) / 2, width: VW, borderRadius: 18, overflow: "hidden", background: NAVY, boxShadow: "0 26px 70px rgba(0,0,0,0.55)" }}>
      <div style={{ height: 38, background: "#1A2145", display: "flex", alignItems: "center", gap: 9, padding: "0 16px" }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#E2604A" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#E8A53C" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#4FBF7B" }} />
      </div>
      <div style={{ width: VW, height: VH, overflow: "hidden", position: "relative" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} playbackRate={playbackRate} muted style={{ position: "absolute", width: dispW, left: -ox, top: -oy }} />
      </div>
    </div>
  );
};

const SunnyBig: React.FC<{ side: "l" | "r" }> = ({ side }) => (
  <Img src={staticFile("thumb/sunny.png")} style={{ position: "absolute", bottom: 0, [side === "r" ? "right" : "left"]: 20, height: 980, objectFit: "contain", filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.45))" } as React.CSSProperties} />
);

/* ── chapters ──────────────────────────────────────────── */

const C1Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 320, opacity: fade(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 48, color: "rgba(255,255,255,0.85)" }}>Claude Code 實操教學</div>
        <div style={{ marginTop: 22, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>subagent 並行</div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: ORANGE, textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>手把手做一次</div>
      </div>
      <SunnyBig side="r" />
      <Cap text="今天帶你做一次，看完就能自己照做" />
      {TVO("t_hook")}
    </AbsoluteFill>
  );
};

const C2Setup: React.FC = () => (
  <AbsoluteFill>
    <ChapterTag n="1" title="開新對話、指向專案" />
    <Footage startFrom={150} dispW={2150} ox={250} oy={120} vw={1680} />
    <Cap text="開一個全新對話，調查 ShopFlow 這個 5 模組專案" />
    {TVO("t_setup")}
  </AbsoluteFill>
);

const C3Prompt: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChapterTag n="2" title="下指令（講人話）" />
      <Footage startFrom={150} dispW={2150} ox={250} oy={120} vw={1680} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 250, opacity: fade(f, 80), display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 1500, padding: "22px 34px", borderRadius: 16, background: "rgba(8,16,30,0.82)", border: `2px solid ${ORANGE}88` }}>
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 34, lineHeight: 1.45, color: "#fff" }}>用 5 個 subagent 並行調查專案，每個查一個模組，附 file:line，最後彙整。</div>
        </div>
      </div>
      <Cap text="用自然語言：5 個 subagent 並行、各查一模組、附行號、彙整" />
      {TVO("t_prompt")}
    </AbsoluteFill>
  );
};

const C4Parallel: React.FC = () => (
  <AbsoluteFill>
    <ChapterTag n="3" title="5 個分身並行" />
    <Footage startFrom={1800} dispW={2150} ox={250} oy={140} vw={1680} />
    <Cap text="送出後，5 個 subagent 同時啟動——並行，不是排隊" />
    {TVO("t_parallel")}
  </AbsoluteFill>
);

const C5Report: React.FC = () => (
  <AbsoluteFill>
    <ChapterTag n="4" title="各自回報" />
    <Footage src="footage/scroll.mov" startFrom={150} dispW={1740} ox={80} oy={56} vw={1640} playbackRate={1.7} />
    <Cap text="5 個模組的問題一次攤開：密鑰、卡號、競態、N+1、阻塞" />
    {TVO("t_report")}
  </AbsoluteFill>
);

const C6Merge: React.FC = () => (
  <AbsoluteFill>
    <ChapterTag n="5" title="彙整結論" />
    <Footage src="footage/scroll.mov" startFrom={1080} dispW={1740} ox={80} oy={56} vw={1640} playbackRate={2.2} />
    <Cap text="主代理彙整成一份結論，排好優先順序——你只下了一句話" />
    {TVO("t_merge")}
  </AbsoluteFill>
);

const C7YourTurn: React.FC = () => {
  const f = useCurrentFrame();
  const step = (n: string, t: string, d: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: fade(f, d), transform: `translateY(${(1 - fade(f, d)) * 16}px)` }}>
      <span style={{ width: 50, height: 50, borderRadius: "50%", background: ORANGE, color: "#1a1206", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 28, flexShrink: 0 }}>{n}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 42, color: "#fff" }}>{t}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: fade(f, 4), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 72, color: "#fff" }}>換你試 👇</div>
      <div style={{ position: "absolute", top: 230, left: 150, display: "flex", flexDirection: "column", gap: 26 }}>
        {step("1", "開新對話，指向你的專案", 16)}
        {step("2", "貼上這句並行 subagent 指令", 40)}
        {step("3", "等 5 個跑完，看彙整結論", 64)}
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 560, opacity: fade(f, 80) }}>
        <div style={{ padding: "26px 38px", borderRadius: 16, background: "rgba(8,16,30,0.82)", border: `2px solid ${ORANGE}` }}>
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 38, lineHeight: 1.5, color: "#fff" }}>用 5 個 subagent 並行調查專案，每個查一個模組，附 file:line，最後彙整。</div>
        </div>
      </div>
      <Cap text="指令就在畫面上，按暫停照著做" />
      {TVO("t_yourturn")}
    </AbsoluteFill>
  );
};

const C8Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 360, opacity: fade(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 110, lineHeight: 1.14, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>任務夠重<br />才開 subagent</div>
        <div style={{ marginTop: 50, display: "flex", gap: 24 }}>
          {["👍 按讚", "🔔 訂閱", "🔗 分享"].map((t) => (
            <div key={t} style={{ padding: "20px 34px", borderRadius: 999, background: "rgba(255,255,255,0.96)", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#14142B" }}>{t}</div>
          ))}
        </div>
        <div style={{ marginTop: 46, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: ORANGE }}>Ai-Wisdom-01</div>
      </div>
      <SunnyBig side="r" />
      <Cap text="任務夠重才划算。按讚訂閱分享，我們下次見" />
      {TVO("t_outro")}
    </AbsoluteFill>
  );
};

export const SUBAGENT_TUTORIAL_FRAMES = 3178;

export const SubagentTutorial: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <Audio src={staticFile("bgm-piano.mp3")} volume={0.06} />
    <Sequence from={0} durationInFrames={220}><C1Hook /></Sequence>
    <Sequence from={220} durationInFrames={419}><C2Setup /></Sequence>
    <Sequence from={639} durationInFrames={471}><C3Prompt /></Sequence>
    <Sequence from={1110} durationInFrames={425}><C4Parallel /></Sequence>
    <Sequence from={1535} durationInFrames={510}><C5Report /></Sequence>
    <Sequence from={2045} durationInFrames={312}><C6Merge /></Sequence>
    <Sequence from={2357} durationInFrames={528}><C7YourTurn /></Sequence>
    <Sequence from={2885} durationInFrames={293}><C8Outro /></Sequence>
  </AbsoluteFill>
);
