import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Stamp, FlowArrow, ramp } from "../components";
import { Laptop } from "../motifs";
import { PAL, S4_ITEMS, S4_BEST, S4_KEY, type FateItem } from "../data";

const IDS = Array.from({ length: 13 }, (_, i) => `s4-${i + 1}`);
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 12, minDur: 300 });
const at = (i: number) => CUES[i].from;

const FateRow: React.FC<{ fi: FateItem; delay: number; stampDelay: number }> = ({ fi, delay, stampDelay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 18);
  return (
    <div style={{ ...a, width: 1340, display: "flex", alignItems: "center", gap: 20, padding: "14px 28px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
      <span style={{ fontSize: 34, flexShrink: 0 }}>{fi.icon}</span>
      <span style={{ flex: 1, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{fi.item}</span>
      <FlowArrow width={70} thickness={2.4} color={COLORS.borderStrong} progress={ramp(frame, delay + 6, delay + 20)} />
      <div style={{ flexShrink: 0, minWidth: 420, display: "flex", justifyContent: "flex-end" }}>
        <Stamp kind={fi.kind} text={fi.verdict} at={stampDelay} size={TYPE.small} rotate={-1.5} />
      </div>
    </div>
  );
};

const DashedArrow: React.FC<{ progress: number }> = ({ progress }) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg width={180} height={40} style={{ overflow: "visible" }}>
      <line x1={4} y1={20} x2={150} y2={20} stroke={COLORS.warn} strokeWidth={3} strokeLinecap="round" strokeDasharray="3 9" opacity={0.85} strokeDashoffset={(1 - p) * 160} />
      <path d="M150 13 L164 20 L150 27" fill="none" stroke={COLORS.warn} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.4 ? 1 : 0} />
    </svg>
  );
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const aOp = leave(frame, at(10) - 8, 12);
  const bOp = ramp(frame, at(10) - 8, at(10) + 6);

  const stampDelays = [at(4) + 10, at(5) + 10, at(6) + 10, at(9)];
  const rowDelays = [at(4), at(5), at(6), at(7)];

  return (
    <Shell durationInFrames={DUR} kicker="04 · 換電腦" accent={PAL.warn} seed="s4">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116 }}>
        <Heading zh="換電腦：哪些保留得了、哪些保不住" en="machine switch · local-first" />
      </div>

      {/* ── View A: two-laptop migration + per-item fate ── */}
      <AbsoluteFill style={{ opacity: aOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 206 }}>
          <KeyLine text={S4_KEY} tone={PAL.warn} delay={at(1)} width={1340} size={TYPE.body} />
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 318, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, ...appearUp(frame, at(3), 16, 20) }}>
          <Laptop w={230} label="舊電腦" tone={COLORS.muted}>
            <span style={{ fontSize: 40 }}>🗂</span>
          </Laptop>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 30 }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.warn }}>本機優先 · 多半要手動搬</span>
            <DashedArrow progress={ramp(frame, at(3) + 8, at(3) + 30)} />
          </div>
          <Laptop w={230} label="新電腦" tone={COLORS.ink}>
            <span style={{ fontSize: 40 }}>✨</span>
          </Laptop>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 506, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {S4_ITEMS.map((fi, i) => (
            <FateRow key={fi.item} fi={fi} delay={rowDelays[i]} stampDelay={stampDelays[i]} />
          ))}
        </div>
      </AbsoluteFill>

      {/* ── View B: the most-stable 3-step routine ── */}
      <AbsoluteFill style={{ opacity: bOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", ...appearUp(frame, at(10), 16, 20) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 30px", borderRadius: RADIUS.pill, background: PAL.yesBg, border: `2px solid ${PAL.yes}`, color: PAL.yes, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2 }}>
            <span style={{ fontSize: 34 }}>🛟</span>最穩做法
          </span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", alignItems: "stretch", justifyContent: "center", gap: 10 }}>
          {S4_BEST.map((s, i) => {
            const d = at(10) + 14 + i * 22;
            return (
              <React.Fragment key={s}>
                <div style={{ ...appearUp(frame, d, 16, 20), position: "relative", width: 410, minHeight: 220, borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${PAL.yes}`, boxShadow: SHADOW.lg, padding: "30px 28px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
                  <span style={{ width: 52, height: 52, borderRadius: "50%", background: PAL.yesBg, border: `2px solid ${PAL.yes}`, color: PAL.yes, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 28 }}>{i + 1}</span>
                  <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, lineHeight: 1.34, color: COLORS.ink }}>{s}</span>
                </div>
                {i < S4_BEST.length - 1 ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FlowArrow width={64} thickness={3} color={PAL.yes} progress={ramp(frame, d + 14, d + 30)} />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={at(4) + 10} volume={0.3} />
      <Sfx src="pop" at={at(5) + 10} volume={0.3} />
      <Sfx src="pop" at={at(6) + 10} volume={0.3} />
      <Sfx src="ding" at={at(9)} volume={0.32} />
      <Sfx src="whoosh" at={at(10) - 6} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "04 · 換電腦",
  title: "換電腦：哪些保留得了、哪些保不住",
  accent: PAL.warn,
  durationInFrames: DUR,
  Component: Scene4,
};
