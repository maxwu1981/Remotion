import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, FlowArrow, ramp } from "../components";
import { Terminal } from "../motifs";
import { S8_LOOP, S8_LEVELUP, S8_KEY, S6_PERMISSION, MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s8-c1", "s8-c2", "s8-c3", "s8-c4", "s8-c5", "s8-c6", "s8-c7", "s8-c8", "s8-c9", "s8-c10"],
  { lead: 14, minDur: 340 },
);
const at = (i: number) => CUES[i].from;

const LOOP_COLORS = [COLORS.success, MOTIF.chat, MOTIF.push];

/** One node of the habit loop; glows when it is the active step. */
const LoopNode: React.FC<{ idx: number; active: boolean; reveal: { opacity: number; transform: string } }> = ({ idx, active, reveal }) => {
  const item = S8_LOOP[idx];
  const c = LOOP_COLORS[idx];
  return (
    <div style={{ ...reveal, width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "22px 18px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${active ? c : c + "44"}`, boxShadow: active ? SHADOW.glow(c) : SHADOW.md, transform: `${reveal.transform} scale(${active ? 1.04 : 1})` }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: `${c}16`, border: `2px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{item.icon}</div>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, textAlign: "center", lineHeight: 1.25 }}>{item.text}</span>
    </div>
  );
};

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();

  const loopStart = at(1);
  const active = frame >= loopStart ? Math.floor(((frame - loopStart) / 22) % 3) : -1;
  const n1 = springPop(frame, 30, { delay: at(1), from: 0.7, dist: 20 });
  const n2 = springPop(frame, 30, { delay: at(2), from: 0.7, dist: 20 });
  const n3 = springPop(frame, 30, { delay: at(4), from: 0.7, dist: 20 });

  const phaseALeave = leave(frame, at(7) - 8, 14);
  const markers = [at(5) + 6, at(5) + 26, at(6), at(6) + 20];

  const levelIn = appearUp(frame, at(7), 16, 22);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.commit} kicker="08 · 給你的小建議" seed="s8">
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center" }}>
        <Heading zh="養成習慣：每完成一段，就 commit 並 push" en="A habit: finish a chunk → commit & push → backed up" delay={at(0)} />
      </div>

      {/* Phase A — the habit loop + restore-point timeline */}
      {frame < at(7) + 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 256, opacity: phaseALeave }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <LoopNode idx={0} active={active === 0} reveal={n1} />
            <div style={{ marginBottom: 4 }}>
              <FlowArrow width={70} thickness={3} color={COLORS.borderStrong} progress={ramp(frame, at(2) - 6, at(2) + 8)} />
            </div>
            <LoopNode idx={1} active={active === 1} reveal={n2} />
            <div style={{ marginBottom: 4 }}>
              <FlowArrow width={70} thickness={3} color={COLORS.borderStrong} progress={ramp(frame, at(4) - 6, at(4) + 8)} />
            </div>
            <LoopNode idx={2} active={active === 2} reveal={n3} />
          </div>

          {/* loop badge */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18, ...appearUp(frame, at(5), 14, 14) }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${MOTIF.commit}55`, boxShadow: SHADOW.sm }}>
              <span style={{ fontSize: 22 }}>🔁</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>周而復始，雲端永遠有最新備份</span>
            </div>
          </div>

          {/* restore-point timeline */}
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 1100, height: 96 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 4, borderRadius: 2, background: COLORS.borderStrong }} />
              {markers.map((d, i) => {
                const show = frame >= d;
                const a = springPop(frame, 30, { delay: d, from: 0.5, dist: 14 });
                const x = 130 + i * 280;
                return show ? (
                  <div key={i} style={{ position: "absolute", left: x, top: 0, opacity: a.opacity, transform: `translateX(-50%) ${a.transform}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 16, color: COLORS.success }}>✔</span>
                    <span style={{ fontSize: 32 }}>💾</span>
                    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.micro, color: COLORS.muted }}>進度 {i + 1}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Phase B — level up to CLI / GUI */}
      {frame >= at(7) - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, ...levelIn }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 28px", borderRadius: RADIUS.pill, background: `${MOTIF.push}10`, border: `1.5px solid ${MOTIF.push}55` }}>
            <span style={{ fontSize: 26 }}>⬆️</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.inkSoft }}>{S8_LEVELUP}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ ...appearUp(frame, at(8), 14, 18), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Terminal lines={S6_PERMISSION.map((t) => ({ text: t, kind: "cmd" }))} w={520} title="terminal" progress={1} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>CLI 三行指令</span>
            </div>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.faint }}>或</span>
            <div style={{ ...appearUp(frame, at(8) + 8, 14, 18), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ padding: "16px 40px", borderRadius: RADIUS.md, background: MOTIF.commit, color: "#fff", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, boxShadow: `0 8px 18px ${MOTIF.commit}55` }}>Commit</div>
                <div style={{ padding: "16px 40px", borderRadius: RADIUS.md, background: MOTIF.push, color: "#fff", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, boxShadow: `0 8px 18px ${MOTIF.push}55` }}>Push</div>
              </div>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>桌面 App 的按鈕</span>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
        <KeyLine text={S8_KEY} tone={MOTIF.commit} delay={at(2)} width={1480} />
      </div>

      <Sfx src="ding" at={at(1)} volume={0.3} />
      <Sfx src="ding" at={at(2)} volume={0.3} />
      <Sfx src="ding" at={at(4)} volume={0.3} />
      <Sfx src="pop" at={markers[0]} volume={0.26} />
      <Sfx src="pop" at={markers[2]} volume={0.26} />
      <Sfx src="whoosh" at={at(7)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene8: SceneDef = {
  id: "s8",
  index: 8,
  kicker: "08 · 給你的小建議",
  title: "Build the habit, then level up",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Scene8,
};
