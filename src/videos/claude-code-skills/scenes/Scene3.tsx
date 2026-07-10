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
  ["s3-c1", "s3-c2", "s3-c3", "s3-c4", "s3-c5", "s3-c6", "s3-c7"],
  { lead: 14, minDur: 430 },
);
const at = (i: number) => CUES[i].from;

const Card: React.FC<{ good: boolean; badge: string; code: string; note: string; delay: number }> = ({
  good,
  badge,
  code,
  note,
  delay,
}) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  const c = good ? PAL.yes : PAL.no;
  return (
    <div style={{ ...a, width: 740, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2.5px solid ${c}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", background: good ? PAL.yesBg : PAL.noBg, borderBottom: `1px solid ${c}33` }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>{good ? "✔" : "✘"}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: c }}>{badge}</span>
      </div>
      <div style={{ padding: "22px 26px" }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, background: COLORS.code.panel, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: "14px 18px", lineHeight: 1.4 }}>
          {code}
        </div>
        <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.muted, lineHeight: 1.4 }}>{note}</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.trigger} kicker="經驗 02 · description 觸發" seed="s3">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗二：description 決定 Claude 用不用它" en="Write WHEN to use it — not just what it does" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 40 }}>
        <Card good={false} badge="只寫功能" code={'description: "處理 PDF"'} note="Claude 不知道何時該用 → 該用的時候常常沒被觸發" delay={at(1)} />
        <Card good badge="寫清楚何時用" code={'description: "當使用者要讀取或產生 PDF 時使用"'} note="情境 + 觸發詞寫進去 → 命中率大幅提升" delay={at(1) + 26} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="description 要寫「何時用 + 觸發詞」，不要只描述功能 — Claude 才會在對的時機載入" tone={MOTIF.trigger} delay={at(5)} />
      </div>

      <Sfx src="pop" at={at(1)} volume={0.32} />
      <Sfx src="ding" at={at(4)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "經驗 02 · description 觸發",
  title: "description triggers it",
  accent: MOTIF.trigger,
  durationInFrames: DUR,
  Component: Scene3,
};
