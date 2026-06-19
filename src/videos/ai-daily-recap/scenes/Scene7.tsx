import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { ProblemSolution, CodePill } from "../mockups/ProblemSolution";

const IDS = ["s7-c1", "s7-c2", "s7-c3", "s7-c4", "s7-c5", "s7-c6"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.hi.rose;

type Fix = {
  problem: string;
  solution: string;
  pd: React.ReactNode;
  sd: React.ReactNode;
};

const FIXES: Fix[] = [
  {
    problem: "找不到專案進入點",
    solution: "補上 src/index.ts",
    pd: <CodePill text="Error: no entry point" tone="bad" />,
    sd: <CodePill text="registerRoot(RemotionRoot)" tone="good" />,
  },
  {
    problem: "字幕軌時間區間寫反了",
    solution: "改回正向時間範圍",
    pd: <CodePill text="interpolate(f, [0.5, 0], …)" tone="bad" />,
    sd: <CodePill text="interpolate(f, [0, 0.5], …)" tone="good" />,
  },
  {
    problem: "Whisper 命令列一直失敗",
    solution: "改用 Python API 載入模型",
    pd: <CodePill text="$ whisper audio.mp3  ✗" tone="bad" />,
    sd: <CodePill text="whisper.load_model('base')" tone="good" />,
  },
  {
    problem: "音畫對不上",
    solution: "用 ffprobe 重新量測時長",
    pd: <CodePill text="recordingDuration: 0" tone="bad" />,
    sd: <CodePill text="ffprobe → recordingDuration" tone="good" />,
  },
  {
    problem: "Python 套件裝不起來",
    solution: "拿掉 --break-system-packages",
    pd: <CodePill text="pip install … --break-system-packages  ✗" tone="bad" />,
    sd: <CodePill text="pip install -r requirements.txt" tone="good" />,
  },
];

const Counter: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 226, display: "flex", justifyContent: "center", ...appearUp(frame, 0, 10, 14) }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 18px",
          borderRadius: RADIUS.pill,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.sm,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: TYPE.tiny,
          letterSpacing: 1,
          color: COLORS.muted,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: ACCENT }} />
        FIX {n} / {FIXES.length}
      </div>
    </div>
  );
};

const FixView: React.FC<{ f: Fix; n: number }> = ({ f, n }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <Counter n={n} />
    <ProblemSolution problemTitle={f.problem} solutionTitle={f.solution} problemDetail={f.pd} solutionDetail={f.sd} />
  </AbsoluteFill>
);

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const introIn = appearUp(frame, at(0), 16, 22);
  const introOut = leave(frame, at(1) - 14, 14);

  return (
    <SceneShell kicker="07 / 09" title="疑難排解 · 已修正" accent={ACCENT} durationInFrames={DUR}>
      {/* intro card before the first fix */}
      {frame < at(1) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", transform: introIn.transform, opacity: Math.min(introIn.opacity, introOut) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink }}>
            開發路上的 <span style={{ color: ACCENT }}>5 個雷</span>，與解法
          </span>
        </div>
      ) : null}

      {FIXES.map((f, i) => {
        const start = at(i + 1);
        const end = i < FIXES.length - 1 ? at(i + 2) : DUR;
        return (
          <Sequence key={i} from={start} durationInFrames={Math.max(1, end - start)} name={`fix-${i + 1}`}>
            <FixView f={f} n={i + 1} />
          </Sequence>
        );
      })}

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene7: SceneDef = {
  id: "s7",
  index: 7,
  kicker: "07 / 09",
  title: "疑難排解 · 已修正",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene7,
};
