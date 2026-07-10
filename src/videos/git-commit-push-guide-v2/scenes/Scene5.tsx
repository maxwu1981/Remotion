import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, ramp } from "../components";
import { SlashMenu } from "../motifs";
import { S5_SLASH, S5_PATH, S5_STICKY, S5_KEY, MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s5-c1", "s5-c2", "s5-c3", "s5-c4", "s5-c5", "s5-c6", "s5-c7", "s5-c8", "s5-c9", "s5-c10"],
  { lead: 14, minDur: 320 },
);
const at = (i: number) => CUES[i].from;

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shown = frame >= at(4) ? 3 : frame >= at(2) ? 2 : 0;
  const menuIn = appearUp(frame, at(2), 16, 22);
  const pathIn = appearUp(frame, at(5), 14, 16);

  // fly /commit into the folder during c7
  const fly = ramp(frame, at(6), at(6) + 26);
  const flying = frame >= at(6) && frame < at(6) + 30;
  const flyX = interpolate(fly, [0, 1], [720, 1300]);
  const flyY = interpolate(fly, [0, 1], [512, 470]);
  const dropped = frame >= at(6) + 24;

  const sticky = springPop(frame, fps, { delay: at(7), from: 0.5, dist: 14 });

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.commit} kicker="05 · 關於 /commit" seed="s5">
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Heading zh="/commit 是進階快捷，不是新手必備" en="/commit is a custom shortcut — not a default" delay={at(0)} />
      </div>

      {/* slash menu */}
      <div style={{ position: "absolute", left: 170, top: 318, ...menuIn }}>
        <SlashMenu items={S5_SLASH} highlight="/commit" shown={shown} w={640} />
        {/* path chip under /commit */}
        <div style={{ ...pathIn, marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: RADIUS.pill, background: `${MOTIF.commit}10`, border: `1px solid ${MOTIF.commit}55` }}>
          <span style={{ fontSize: 18 }}>📁</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: MOTIF.commit }}>{S5_PATH}</span>
        </div>
        {/* sticky note over /commit */}
        {frame >= at(7) ? (
          <div style={{ position: "absolute", right: -36, top: 150, ...sticky }}>
            <div style={{ transform: "rotate(-6deg)", padding: "14px 20px", borderRadius: 6, background: "#FFF3B0", border: "1px solid #E9D98A", boxShadow: SHADOW.md, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: "#8A6D1B" }}>
              📌 {S5_STICKY}
            </div>
          </div>
        ) : null}
      </div>

      {/* the .claude/commands/ folder you build into */}
      <div style={{ position: "absolute", left: 1080, top: 360, ...appearUp(frame, at(5) + 8, 16, 20) }}>
        <div style={{ width: 560, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px dashed ${MOTIF.commit}66`, boxShadow: SHADOW.md, padding: "22px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 34 }}>📁</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.ink }}>{S5_PATH}</span>
          </div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>使用者自己做的快捷，放在這裡</div>
          {/* dropped file */}
          <div style={{ minHeight: 56, display: "flex", alignItems: "center" }}>
            {dropped ? (
              <div style={{ ...appearUp(frame, at(6) + 24, 12, 12), display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: RADIUS.md, background: `${MOTIF.commit}12`, border: `1.5px solid ${MOTIF.commit}` }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.body, color: MOTIF.commit }}>commit.md</span>
                <span style={{ fontSize: 18 }}>✅</span>
              </div>
            ) : (
              <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.faint }}>（還沒有自訂指令…）</span>
            )}
          </div>
        </div>
      </div>

      {/* flying /commit chip */}
      {flying ? (
        <div style={{ position: "absolute", left: flyX, top: flyY, transform: "translate(-50%,-50%)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: RADIUS.md, background: COLORS.surface, border: `2px solid ${MOTIF.commit}`, boxShadow: SHADOW.lg }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.body, color: MOTIF.commit }}>/commit</span>
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
        <KeyLine text={S5_KEY} tone={MOTIF.commit} delay={at(7)} width={1480} />
      </div>

      <Sfx src="pop" at={at(2)} volume={0.3} />
      <Sfx src="pop" at={at(4)} volume={0.32} />
      <Sfx src="whoosh" at={at(6)} volume={0.34} />
      <Sfx src="ding" at={at(6) + 24} volume={0.3} />
      <Sfx src="pop" at={at(7)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "05 · 關於 /commit",
  title: "What /commit really is",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Scene5,
};
