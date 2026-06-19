import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, Chip, KeyLine, ramp } from "../components";
import { Warehouse, Container } from "../motifs";
import { MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s4-c1", "s4-c2", "s4-c3", "s4-c4", "s4-c5", "s4-c6", "s4-c7"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** The little project bundle that gets photocopied from warehouse to desk. */
const CopyBundle: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 16px", borderRadius: RADIUS.md, background: COLORS.surface, border: `1.5px solid ${MOTIF.warehouse}66`, boxShadow: SHADOW.md, transform: `scale(${size})` }}>
    <span style={{ fontSize: 34 }}>📦</span>
    <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.inkSoft }}>專案 + CLAUDE.md</span>
  </div>
);

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const wh = appearUp(frame, at(2), 16, 22);
  const ct = appearUp(frame, at(3), 16, 22);

  const flyP = ramp(frame, at(4), at(4) + 28);
  const wiped = frame >= at(5);
  const copyX = interpolate(flyP, [0, 1], [470, 1430], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const copyY = interpolate(flyP, [0, 1], [470, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const copyAppear = ramp(frame, at(4), at(4) + 6);
  const copyWipe = wiped ? interpolate(frame, [at(5), at(5) + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.warehouse} kicker="04 · 倉庫 vs 工作桌" seed="s4">
      <div style={{ position: "absolute", left: 0, right: 0, top: 122, display: "flex", justifyContent: "center" }}>
        <Heading zh="GitHub 與容器，是兩個不同的地方" en="Warehouse vs work desk — not one disk in two" delay={at(0)} />
      </div>

      {/* photocopy label + arrow across the middle */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 326, display: "flex", justifyContent: "center", opacity: ramp(frame, at(4), at(4) + 10) }}>
        <Chip text="影印一份（repo clone）" color={MOTIF.warehouse} size={TYPE.body} icon={<span style={{ fontSize: 22 }}>🖨️</span>} />
      </div>

      {/* left: warehouse (permanent) */}
      <div style={{ position: "absolute", left: 150, top: 400, width: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, ...wh }}>
        <Warehouse w={330} label="GitHub 倉庫" sub="永久存放 · 永遠在 · 不會清空" ok />
      </div>

      {/* right: container = work desk (wiped each session) */}
      <div style={{ position: "absolute", right: 150, top: 392, width: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, ...ct }}>
        <Container w={460} h={250} label="容器 ＝ 工作桌" sub="每次 session 給一張新空桌" wiped={wiped}>
          {flyP > 0.96 && !wiped ? <CopyBundle /> : null}
        </Container>
        <Chip
          text={wiped ? "收工後桌子被清掉 🗑" : "在桌上工作"}
          color={wiped ? PAL.no : MOTIF.cloud}
          size={TYPE.small}
        />
      </div>

      {/* the flying photocopy */}
      {flyP > 0.001 && flyP < 0.97 ? (
        <div style={{ position: "absolute", left: copyX, top: copyY, opacity: copyAppear * copyWipe }}>
          <CopyBundle size={0.92} />
        </div>
      ) : null}

      {/* warehouse original still there marker */}
      {wiped ? (
        <div style={{ position: "absolute", left: 150, top: 366, width: 560, display: "flex", justifyContent: "center", ...appearUp(frame, at(6), 14, 14) }}>
          <Chip text="倉庫原稿還在 ✔" color={PAL.yes} size={TYPE.small} />
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 104 }}>
        <KeyLine
          text="桌上的東西是從倉庫影印來的副本；桌子丟了沒關係，倉庫原稿還在。"
          tone={MOTIF.warehouse}
          delay={at(6)}
          width={1340}
        />
      </div>

      <Sfx src="whoosh" at={at(2)} volume={0.32} />
      <Sfx src="whoosh" at={at(3)} volume={0.32} />
      <Sfx src="typing" at={at(4)} volume={0.3} durationInFrames={28} />
      <Sfx src="whoosh" at={at(5)} volume={0.4} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "04 · 倉庫 vs 工作桌",
  title: "Warehouse vs desk",
  accent: MOTIF.warehouse,
  durationInFrames: DUR,
  Component: Scene4,
};
