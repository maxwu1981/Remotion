import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, FlowArrow, ramp } from "../components";
import { AppWindow, Terminal, EngineBlock } from "../motifs";
import { MOTIF, COVER_TAKEAWAYS } from "../data";
import { BRAND } from "../brand";

const { cues: CUES, dur: DUR } = buildScene(["cv-1", "cv-2", "cv-3"], { lead: 10, minDur: 320 });
const at = (i: number) => CUES[i].from;

export const Cover: React.FC = () => {
  const frame = useCurrentFrame();

  const title = appearUp(frame, 6, 20, 26);
  const appIn = appearUp(frame, at(0), 18, 24);
  const termIn = appearUp(frame, at(0) + 12, 18, 24);
  const equivP = ramp(frame, at(0) + 26, at(0) + 50);
  const arrowP = ramp(frame, at(1), at(1) + 22);
  const engineIn = appearUp(frame, at(1) + 8, 18, 22);
  const sub = appearUp(frame, at(2), 18, 20);
  const chips = appearUp(frame, at(2) + 14, 16, 18);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={MOTIF.engine} seed="cover">
      {/* title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", ...title }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 86, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.08 }}>
          Claude 桌面版{" "}
          <span style={{ color: COLORS.faint, fontWeight: 700 }}>→</span>{" "}
          <span style={{ fontFamily: FONT.mono, background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>CLI</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 52, letterSpacing: -1, color: COLORS.inkSoft }}>
          差異、安裝與換機備份
        </div>
      </div>

      {/* hero: Code 分頁 ≡ 終端機 CLI, both powered by one engine */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <div style={{ ...appIn }}>
            <AppWindow active="code" w={430} bodyH={150} label="桌面 App · Code 分頁" glowActive />
          </div>

          {/* equivalence glyph */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: equivP, transform: `scale(${0.6 + 0.4 * equivP})`, marginBottom: 36 }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 84, color: MOTIF.engine, lineHeight: 0.8, textShadow: `0 0 22px ${MOTIF.engine}66` }}>≡</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: MOTIF.engine }}>同引擎</span>
          </div>

          <div style={{ ...termIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Terminal
              w={430}
              title="claude — CLI"
              lines={[
                { text: "claude", kind: "cmd" },
                { text: "● Claude Code 已就緒", kind: "ok" },
              ]}
              progress={ramp(frame, at(0) + 16, at(0) + 70)}
            />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 22 }}>⌨️</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>終端機 CLI</span>
            </div>
          </div>
        </div>

        {/* converging arrow into the shared engine */}
        <div style={{ marginTop: 6, opacity: arrowP }}>
          <FlowArrow vertical width={64} thickness={3.4} color={MOTIF.engine} progress={arrowP} />
        </div>
        <div style={{ marginTop: 4, ...engineIn }}>
          <EngineBlock w={480} active={frame > at(1) + 18} />
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 902, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{BRAND.tagline}</span>
      </div>

      {/* takeaway chips */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 952, display: "flex", justifyContent: "center", gap: 16, ...chips }}>
        {COVER_TAKEAWAYS.map((k) => (
          <div key={k.t} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 20px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${k.c}66`, boxShadow: SHADOW.sm }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: k.c }} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink }}>{k.t}</span>
          </div>
        ))}
      </div>

      <Sfx src="pop" at={at(0)} volume={0.4} />
      <Sfx src="whoosh" at={at(0) + 12} volume={0.3} />
      <Sfx src="ding" at={at(1) + 10} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const cover: SceneDef = {
  id: "cv",
  index: 0,
  kicker: "封面 · Cover",
  title: "Cover",
  accent: MOTIF.engine,
  durationInFrames: DUR,
  Component: Cover,
};
