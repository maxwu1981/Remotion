import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, enter } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { BrowserWindow, FakeAppScreen } from "../mockups/windows";
import { Waveform } from "../mockups/Waveform";
import { ProgressBar } from "../mockups/ProgressBar";
import { FileBadge } from "../mockups/nodes";
import { ArrowIcon, CheckIcon, EyeIcon } from "../mockups/icons";

const IDS = ["s5-c1", "s5-c2", "s5-c3", "s5-c4", "s5-c5", "s5-c6"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.hi.emerald;

const CMDS = [
  { cmd: "npm start", note: "開啟 Remotion Studio 預覽", show: () => at(1) },
  { cmd: "npm run transcribe", note: "Whisper 語音轉文字", show: () => at(2) },
  { cmd: "npm run narrate", note: "GPT-4o 看圖 → TTS 配音", show: () => at(3) },
  { cmd: "npm run render", note: "輸出 16:9 + 9:16 MP4", show: () => at(4) },
];

/* ---------------------------------------------------------- mini-visuals --- */

const MiniCard: React.FC<{ children: React.ReactNode; w?: number; label?: string }> = ({ children, w = 240, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div
      style={{
        width: w,
        height: 150,
        borderRadius: RADIUS.lg,
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        boxShadow: SHADOW.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
    {label ? <div style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, color: COLORS.muted }}>{label}</div> : null}
  </div>
);

const FlowArrow: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", padding: "0 4px", marginBottom: 30 }}>
    <ArrowIcon size={26} color={COLORS.faint} strokeWidth={2.4} />
  </div>
);

const TextLines: React.FC<{ n?: number }> = ({ n = 5 }) => (
  <div style={{ width: "78%", display: "flex", flexDirection: "column", gap: 9 }}>
    {new Array(n).fill(0).map((_, i) => (
      <div key={i} style={{ height: 8, width: `${95 - i * 12}%`, borderRadius: 4, background: COLORS.bgAlt }} />
    ))}
  </div>
);

const StudioMini: React.FC = () => (
  <BrowserWindow url="localhost:3000 — Remotion Studio" width={760} height={420} accent={COLORS.remotion}>
    <FakeAppScreen variant="editor" seed="s5-studio" />
    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: 18,
        padding: "8px 16px",
        borderRadius: RADIUS.pill,
        background: "rgba(11,132,243,0.92)",
        color: "#fff",
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: TYPE.tiny,
      }}
    >
      ▶ Remotion Studio
    </div>
  </BrowserWindow>
);

const TranscribeMini: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <MiniCard w={280} label="screen.mp4 · 音軌">
      <Waveform seed="s5-tr" bars={34} width={220} height={84} color="#10A37F" />
    </MiniCard>
    <FlowArrow />
    <MiniCard w={260} label="Whisper · 文字稿">
      <TextLines />
    </MiniCard>
  </div>
);

const NarrateMini: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <MiniCard w={196} label="畫面 + GPT-4o">
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#FBF7F0,#F1E8DA)" }} />
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: COLORS.hi.violet,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 20px ${COLORS.hi.violet}66`,
          zIndex: 1,
        }}
      >
        <EyeIcon size={28} color="#fff" />
      </div>
    </MiniCard>
    <FlowArrow />
    <MiniCard w={196} label="腳本 + 時間戳">
      <TextLines n={4} />
    </MiniCard>
    <FlowArrow />
    <MiniCard w={196} label="onyx · 語音">
      <Waveform seed="s5-nar" bars={26} width={150} height={80} color={COLORS.hi.violet} color2={COLORS.claude} />
    </MiniCard>
  </div>
);

const RenderMini: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at(4) + 6, at(4) + 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = p > 0.99;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <ProgressBar progress={p} width={520} label="render · 算繪中" color={ACCENT} />
      <div style={{ display: "flex", gap: 44, opacity: done ? 1 : 0.25, transition: "none" }}>
        <FileBadge name="day-001.mp4" size={56} />
        <FileBadge name="day-001-reels.mp4" size={56} />
      </div>
    </div>
  );
};

const SummaryMini: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {CMDS.map((c) => (
      <div
        key={c.cmd}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 20px",
          borderRadius: RADIUS.md,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.sm,
        }}
      >
        <CheckIcon size={22} color={COLORS.success} />
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink }}>{c.cmd}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.muted, marginLeft: 6 }}>{c.note}</span>
      </div>
    ))}
  </div>
);

/* ----------------------------------------------------------------- scene --- */

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const b = frame >= at(5) ? 5 : frame >= at(4) ? 4 : frame >= at(3) ? 3 : frame >= at(2) ? 2 : frame >= at(1) ? 1 : 0;

  const listIn = appearUp(frame, at(0), 16, 22);

  return (
    <SceneShell kicker="05 / 09" title="核心指令" accent={ACCENT} durationInFrames={DUR}>
      {/* left · command cheat sheet (dark terminal) */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 300,
          width: 600,
          borderRadius: RADIUS.lg,
          background: `linear-gradient(180deg, ${COLORS.term.bgTop} 0%, ${COLORS.term.bg} 16%)`,
          boxShadow: SHADOW.lg,
          overflow: "hidden",
          fontFamily: FONT.mono,
          ...listIn,
        }}
      >
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 12, color: COLORS.term.dim, fontSize: TYPE.micro }}>zsh — ai-daily-recap</span>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {CMDS.map((c, i) => {
            const active = b - 1 === i;
            const shown = frame >= c.show();
            return (
              <div
                key={c.cmd}
                style={{
                  opacity: enter(frame, c.show(), 12),
                  padding: "10px 14px",
                  borderRadius: RADIUS.sm,
                  background: active ? `${ACCENT}1f` : "transparent",
                  borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", whiteSpace: "pre" }}>
                  <span style={{ color: COLORS.term.prompt }}>❯ </span>
                  <span style={{ color: COLORS.term.text, fontSize: TYPE.body, fontWeight: 700 }}>{c.cmd}</span>
                  {active && shown ? (
                    <span style={{ color: COLORS.term.text, marginLeft: 2, opacity: Math.floor(frame / 16) % 2 === 0 ? 1 : 0 }}>▋</span>
                  ) : null}
                </div>
                <div style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.tiny, color: COLORS.term.dim, marginTop: 5, paddingLeft: 18 }}>{c.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* right · mini visual of what runs behind the scenes */}
      <div style={{ position: "absolute", left: 736, right: 96, top: 250, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {b === 1 ? <div style={{ opacity: enter(frame, at(1), 12) }}><StudioMini /></div> : null}
        {b === 2 ? <div style={{ opacity: enter(frame, at(2), 12) }}><TranscribeMini /></div> : null}
        {b === 3 ? <div style={{ opacity: enter(frame, at(3), 12) }}><NarrateMini /></div> : null}
        {b === 4 ? <div style={{ opacity: enter(frame, at(4), 12) }}><RenderMini /></div> : null}
        {b >= 5 ? <div style={{ opacity: enter(frame, at(5), 12) }}><SummaryMini /></div> : null}
      </div>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "05 / 09",
  title: "核心指令",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene5,
};
