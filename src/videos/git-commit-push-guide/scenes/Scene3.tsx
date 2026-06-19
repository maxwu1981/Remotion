import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop, springV } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine } from "../components";
import { S3_COMMIT_TRIGGERS, S3_PUSH_TRIGGERS, S3_WRONG, S3_RIGHT, S3_EDGE, S3_KEY, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s3-c1", "s3-c2", "s3-c3", "s3-c4", "s3-c5", "s3-c6", "s3-c7", "s3-c8", "s3-c9", "s3-c10", "s3-c11", "s3-c12", "s3-c13"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** A trigger checklist that lights up row by row, feeding a 💾/☁️ sink badge. */
const TriggerPanel: React.FC<{
  badge: string;
  title: string;
  color: string;
  items: string[];
  headAt: number;
  litAts: number[];
  reveal: { opacity: number; transform: string };
}> = ({ badge, title, color, items, headAt, litAts, reveal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anyLit = litAts.some((d) => frame >= d);
  const pulse = anyLit ? 1 + 0.04 * Math.sin(frame / 6) : 1;
  return (
    <div style={{ ...reveal, width: 720, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${color}44`, boxShadow: SHADOW.lg, padding: "24px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...appearUp(frame, headAt, 12, 14) }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${color}16`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, transform: `scale(${pulse})` }}>{badge}</div>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it, i) => {
          const lit = frame >= litAts[i];
          const s = springV(frame, fps, { delay: litAts[i], damping: 12, stiffness: 160 });
          return (
            <div key={it} style={{ ...appearUp(frame, headAt + 4, 12, 14), display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderRadius: RADIUS.md, background: lit ? `${color}10` : COLORS.surfaceAlt, border: `1.5px solid ${lit ? color : COLORS.border}` }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: lit ? color : COLORS.bgAlt, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, transform: `scale(${0.6 + 0.4 * Math.min(1, s)})` }}>{lit ? "✓" : ""}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: lit ? COLORS.ink : COLORS.muted }}>{it}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelsLeave = leave(frame, at(9) - 8, 14);
  const leftIn = appearUp(frame, at(3), 16, 22);
  const rightIn = appearUp(frame, at(7), 16, 22);

  // phase B
  const wrong = springPop(frame, fps, { delay: at(9), from: 0.7, dist: 20 });
  const right = springPop(frame, fps, { delay: at(9) + 8, from: 0.7, dist: 20 });
  const edge = appearUp(frame, at(12), 16, 18);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.commit} kicker="03 · 什麼時候用？" seed="s3">
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center" }}>
        <Heading zh="觸發點是「完成一個進度」，不是「聊完」" en="The trigger is a milestone, not the end of a chat" delay={at(0)} />
      </div>

      {/* Phase A — trigger checklists */}
      {frame < at(9) + 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 268, display: "flex", justifyContent: "center", gap: 40, opacity: panelsLeave, transform: `translateY(${(1 - panelsLeave) * -16}px)` }}>
          <TriggerPanel badge="💾" title="這些時候 → commit" color={MOTIF.commit} items={S3_COMMIT_TRIGGERS} headAt={at(3)} litAts={[at(4), at(5), at(6)]} reveal={leftIn} />
          <TriggerPanel badge="☁️" title="這些時候 → push" color={MOTIF.push} items={S3_PUSH_TRIGGERS} headAt={at(7)} litAts={[at(8), at(8) + 16, at(8) + 32]} reveal={rightIn} />
        </div>
      ) : null}

      {/* Phase B — wrong vs right + edge case */}
      {frame >= at(9) - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
            <div style={{ ...wrong, width: 600, display: "flex", alignItems: "center", gap: 18, padding: "24px 30px", borderRadius: RADIUS.xl, background: PAL.noBg, border: `2px solid ${PAL.no}`, boxShadow: SHADOW.md }}>
              <span style={{ fontSize: 44 }}>✘</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: PAL.no }}>{S3_WRONG}</span>
            </div>
            <div style={{ ...right, width: 600, display: "flex", alignItems: "center", gap: 18, padding: "24px 30px", borderRadius: RADIUS.xl, background: PAL.yesBg, border: `2px solid ${PAL.yes}`, boxShadow: SHADOW.md }}>
              <span style={{ fontSize: 44 }}>✔</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: PAL.yes }}>{S3_RIGHT}</span>
            </div>
          </div>

          {/* edge case */}
          <div style={{ ...edge, display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 26px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.sm }}>
            <span style={{ fontSize: 28, opacity: 0.4, filter: "grayscale(1)" }}>📄</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.muted }}>{S3_EDGE}</span>
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text={S3_KEY} tone={MOTIF.commit} delay={at(10)} width={1500} />
      </div>

      <Sfx src="ding" at={at(4)} volume={0.28} />
      <Sfx src="ding" at={at(5)} volume={0.28} />
      <Sfx src="ding" at={at(6)} volume={0.28} />
      <Sfx src="whoosh" at={at(7)} volume={0.3} />
      <Sfx src="pop" at={at(9)} volume={0.3} />
      <Sfx src="ding" at={at(10)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "03 · 什麼時候用？",
  title: "When to commit / push",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Scene3,
};
