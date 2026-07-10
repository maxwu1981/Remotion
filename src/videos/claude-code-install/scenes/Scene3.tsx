import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine } from "../components";
import { MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s3-c1", "s3-c2", "s3-c3", "s3-c4", "s3-c5", "s3-c6", "s3-c7", "s3-c8"],
  { lead: 14, minDur: 430 },
);
const at = (i: number) => CUES[i].from;

const Card: React.FC<{
  good: boolean;
  badge: string;
  cmd: string;
  note: string;
  delay: number;
}> = ({ good, badge, cmd, note, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  const c = good ? PAL.yes : PAL.no;
  return (
    <div style={{ ...a, width: 720, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2.5px solid ${c}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", background: good ? PAL.yesBg : PAL.noBg, borderBottom: `1px solid ${c}33` }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>{good ? "✔" : "✘"}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: c }}>{badge}</span>
      </div>
      <div style={{ padding: "22px 26px" }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, background: COLORS.code.panel, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: "14px 18px" }}>
          {cmd}
        </div>
        <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.muted, lineHeight: 1.4 }}>{note}</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.perm} kicker="經驗 02 · 權限 / sudo" seed="s3">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗二：看到 EACCES，別急著 sudo" en="Permission error? sudo creates more problems" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 40 }}>
        <Card good={false} badge="用 sudo 硬裝" cmd="sudo npm install -g …" note="檔案變成 root 擁有，之後更新反而更麻煩" delay={at(1)} />
        <Card good badge="改用 nvm / 設 prefix" cmd="nvm use 20    或    npm config set prefix ~/.npm-global" note="免 sudo、權限乾淨，更新不卡關" delay={at(1) + 26} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="權限錯誤不是要你加 sudo — 用 nvm（或把 npm prefix 設到家目錄）最乾淨" tone={MOTIF.perm} delay={at(6)} />
      </div>

      <Sfx src="pop" at={at(3)} volume={0.32} />
      <Sfx src="ding" at={at(5)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "經驗 02 · 權限 / sudo",
  title: "Permissions / sudo",
  accent: MOTIF.perm,
  durationInFrames: DUR,
  Component: Scene3,
};
