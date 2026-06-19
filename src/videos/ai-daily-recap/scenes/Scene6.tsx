import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, enter } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { Filmstrip } from "../mockups/Filmstrip";
import { Waveform } from "../mockups/Waveform";
import { StepBadge } from "../mockups/nodes";
import { ArrowIcon, CheckIcon, EyeIcon, FilmIcon } from "../mockups/icons";
import { JsonDocLogo } from "../../../shared-skills/components/logos";

const IDS = ["s6-c1", "s6-c2", "s6-c3", "s6-c4", "s6-c5", "s6-c6", "s6-c7", "s6-c8"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.claude;
const stepStart = (i: number) => at(2 + i); // step i (0..6) ← cues c2..c8
const seg = (frame: number, a: number, len: number) =>
  interpolate(frame, [a, a + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const STEPS = [
  { t: "讀取設定", s: "episode.json → narrate.py" },
  { t: "OpenCV 切格", s: "影片 → 一張張畫格" },
  { t: "GPT-4o 看圖", s: "畫格 → 帶時間戳的腳本" },
  { t: "onyx 配音", s: "腳本 → 語音波形" },
  { t: "adelay 對齊", s: "波形 → 對齊時間軸" },
  { t: "合併音軌", s: "音訊 + 影片" },
  { t: "寫回設定", s: "腳本 → episode.json" },
];

/* ----------------------------------------------------------------- rail --- */

const Rail: React.FC<{ cur: number }> = ({ cur }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 214, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STEPS.map((_, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span style={{ width: 40, height: 3, borderRadius: 2, background: i <= cur ? ACCENT : COLORS.border, margin: "0 6px" }} />
          ) : null}
          <div style={{ transform: `scale(${i === cur ? 1.15 : 1})`, opacity: i <= cur ? 1 : 0.4 }}>
            <StepBadge n={i + 1} color={ACCENT} active={i <= cur} size={i === cur ? 46 : 40} />
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------- pieces --- */

const Glow: React.FC<{ children: React.ReactNode; w: number; h: number; color?: string }> = ({ children, w, h, color }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: RADIUS.lg,
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      boxShadow: color ? SHADOW.glow(color) : SHADOW.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const ScriptCard: React.FC<{ start: number; w?: number; stamps?: boolean }> = ({ start, w = 300, stamps = true }) => {
  const frame = useCurrentFrame();
  const lines = [
    { ts: "00:04", t: "今天上傳老師的新作" },
    { ts: "01:30", t: "Claude 寫出雙語貼文" },
    { ts: "03:00", t: "自動帶上標籤與連結" },
    { ts: "06:00", t: "一鍵排程發佈到 FB" },
  ];
  return (
    <div style={{ width: w, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, boxShadow: SHADOW.md, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 11 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: enter(frame, start + i * 6, 10) }}>
          {stamps ? <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: ACCENT }}>{l.ts}</span> : null}
          <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.inkSoft }}>{l.t}</span>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------ step views --- */

const StageBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 96, right: 96, top: 330, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>{children}</div>
  </div>
);

const Step1: React.FC<{ start: number }> = ({ start }) => (
  <>
    <Glow w={210} h={210} color={COLORS.hi.amber}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <JsonDocLogo size={92} color={COLORS.hi.amber} />
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>episode.json</span>
      </div>
    </Glow>
    <FlowArrowBig show={start} />
    <Glow w={300} h={210} color={ACCENT}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ width: 64, height: 64, borderRadius: 16, background: "#2C6BAE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontWeight: 800, color: "#fff", fontSize: 26 }}>Py</span>
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>narrate.py</span>
        <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.micro, color: COLORS.muted }}>讀進資料，開始處理</span>
      </div>
    </Glow>
  </>
);

const Step2: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const spread = seg(frame, start + 8, 46);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <Filmstrip frames={6} cellW={150} cellH={94} spread={spread} />
      <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.muted }}>OpenCV 把影片切成一張張畫格</span>
    </div>
  );
};

const Step3: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const scan = seg(frame, start + 6, 50);
  return (
    <>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 120, height: 84, borderRadius: 8, background: `linear-gradient(150deg, #FBF7F0, #E9DCC6)`, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }} />
          ))}
        </div>
        <div style={{ position: "absolute", top: -14, left: interpolate(scan, [0, 1], [4, 300]), width: 52, height: 52, borderRadius: "50%", background: COLORS.hi.violet, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${COLORS.hi.violet}77` }}>
          <EyeIcon size={26} color="#fff" />
        </div>
      </div>
      <FlowArrowBig show={start + 18} />
      <ScriptCard start={start + 24} w={320} />
    </>
  );
};

const Step4: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const colors = [COLORS.claude, COLORS.hi.violet, COLORS.remotion, COLORS.hi.emerald];
  return (
    <>
      <ScriptCard start={start} w={280} />
      <FlowArrowBig show={start + 10} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {colors.map((c, i) => (
          <div key={i} style={{ opacity: enter(frame, start + 16 + i * 8, 12) }}>
            <Waveform seed={`s6-w${i}`} bars={30} width={360} height={48} color={c} revealProgress={seg(frame, start + 16 + i * 8, 24)} />
          </div>
        ))}
      </div>
    </>
  );
};

const TIMELINE_CLIPS = [
  { ts: 0.08, color: COLORS.claude },
  { ts: 0.34, color: COLORS.hi.violet },
  { ts: 0.58, color: COLORS.remotion },
  { ts: 0.8, color: COLORS.hi.emerald },
];

const Step5: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const W = 920;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.muted }}>FFmpeg adelay：每段語音滑進主時間軸，對齊時間戳</span>
      <div style={{ width: W, position: "relative", height: 200 }}>
        {/* master timeline track */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 46, borderRadius: 10, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }} />
        {/* tick labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div key={t} style={{ position: "absolute", left: t * (W - 2), top: 150, height: 46, width: 1, background: COLORS.border }}>
            <span style={{ position: "absolute", top: 50, left: -16, fontFamily: FONT.mono, fontSize: 12, color: COLORS.faint }}>{Math.round(t * 10)}:00</span>
          </div>
        ))}
        {/* clips slide from a stack at top into their slot */}
        {TIMELINE_CLIPS.map((c, i) => {
          const p = seg(frame, start + 8 + i * 12, 26);
          const targetX = c.ts * (W - 150);
          const startX = 30 + i * 20;
          const x = interpolate(p, [0, 1], [startX, targetX]);
          const y = interpolate(p, [0, 1], [10, 150]);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 150, height: 46, borderRadius: 10, background: COLORS.surface, border: `2px solid ${c.color}`, boxShadow: SHADOW.sm, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <Waveform seed={`s6-tl${i}`} bars={16} width={130} height={30} color={c.color} live={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Step6: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const merge = seg(frame, start + 10, 34);
  const dy = interpolate(merge, [0, 1], [0, 34]);
  const done = merge > 0.92;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
        <div style={{ transform: `translateY(${dy}px)`, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", width: 520, borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 13, color: COLORS.muted, width: 56 }}>AUDIO</span>
          <Waveform seed="s6-merge-a" bars={42} width={400} height={36} color={ACCENT} live={false} />
        </div>
        <div style={{ transform: `translateY(${-dy}px)`, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", width: 520, borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 13, color: COLORS.muted, width: 56 }}>VIDEO</span>
          <FilmIcon size={24} color={COLORS.hi.violet} />
          <div style={{ flex: 1, height: 22, borderRadius: 5, background: `repeating-linear-gradient(90deg, ${COLORS.hi.violet}33 0 22px, transparent 22px 30px)` }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: done ? 1 : 0.25 }}>
        <CheckIcon size={22} color={COLORS.success} />
        <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, fontWeight: 700, color: done ? COLORS.success : COLORS.muted }}>音畫合併完成</span>
      </div>
    </div>
  );
};

const Step7: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const fly = seg(frame, start + 8, 30);
  const x = interpolate(fly, [0, 1], [0, 300]);
  const op = interpolate(fly, [0.7, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = fly > 0.95;
  return (
    <>
      <ScriptCard start={start} w={280} stamps />
      <div style={{ position: "relative", width: 120, height: 60 }}>
        <div style={{ position: "absolute", top: 16, left: x, opacity: op, padding: "5px 12px", borderRadius: RADIUS.pill, background: ACCENT, color: "#fff", fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
          + 19 段
        </div>
        <div style={{ position: "absolute", top: 18, left: 0 }}>
          <ArrowIcon size={26} color={COLORS.faint} strokeWidth={2.4} />
        </div>
      </div>
      <Glow w={210} h={210} color={done ? COLORS.success : COLORS.hi.amber}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <JsonDocLogo size={92} color={COLORS.hi.amber} />
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>episode.json</span>
          {done ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.success, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.micro }}>
              <CheckIcon size={14} color={COLORS.success} /> 已更新
            </span>
          ) : null}
        </div>
      </Glow>
    </>
  );
};

const FlowArrowBig: React.FC<{ show: number }> = ({ show }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ opacity: enter(frame, show, 12), transform: `scale(${0.7 + 0.3 * enter(frame, show, 12)})` }}>
      <ArrowIcon size={40} color={COLORS.faint} strokeWidth={2.2} />
    </div>
  );
};

/* ----------------------------------------------------------------- scene --- */

const STEP_VIEWS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  let cur = -1;
  for (let i = 0; i < 7; i++) if (frame >= stepStart(i)) cur = i;

  const head = appearUp(frame, at(0), 16, 22);
  const ActiveView = cur >= 0 ? STEP_VIEWS[cur] : null;
  const stepInfo = cur >= 0 ? STEPS[cur] : null;

  return (
    <SceneShell kicker="06 / 09" title="narrate.py 運作邏輯" accent={ACCENT} durationInFrames={DUR}>
      <Rail cur={cur} />

      {/* current step title */}
      {stepInfo ? (
        <div key={cur} style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", ...appearUp(frame, stepStart(cur), 12, 16) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>
            第 {cur + 1} 步 · {stepInfo.t}
          </span>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.muted, marginLeft: 14 }}>{stepInfo.s}</span>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", ...head }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink }}>
            全自動配音的<span style={{ color: ACCENT }}>七個步驟</span>
          </span>
        </div>
      )}

      <StageBox>{ActiveView ? <ActiveView key={cur} start={stepStart(cur)} /> : null}</StageBox>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene6: SceneDef = {
  id: "s6",
  index: 6,
  kicker: "06 / 09",
  title: "narrate.py 運作邏輯",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene6,
};
