import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Terminal, ramp } from "../components";
import { MOTIF } from "../data";
import { BRAND } from "../brand";

const { cues: CUES, dur: DUR } = buildScene(["cv-c1", "cv-c2", "cv-c3"], { lead: 10, minDur: 320 });

const CHIPS = [
  { n: "1", t: "Node 版本", c: MOTIF.node },
  { n: "2", t: "權限 / sudo", c: MOTIF.perm },
  { n: "3", t: "command not found", c: MOTIF.path },
  { n: "4", t: "登入授權", c: MOTIF.auth },
];

export const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const title = appearUp(frame, 6, 20, 26);
  const termIn = appearUp(frame, 40, 18, 26);
  const chipsIn = ramp(frame, 150, 174);
  const sub = appearUp(frame, 196, 18, 20);
  const date = appearUp(frame, 220, 16, 16);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={MOTIF.install} seed="cover">
      {/* title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center", ...title }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 104, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.06 }}>
          <span style={{ fontFamily: FONT.mono }}>Claude Code</span>{" "}
          <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>安裝經驗</span>
        </div>
      </div>

      {/* terminal hero */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...termIn }}>
        <Terminal
          width={1120}
          start={48}
          step={20}
          lines={[
            { k: "cmd", t: "npm install -g @anthropic-ai/claude-code" },
            { k: "ok", t: "installed @anthropic-ai/claude-code" },
            { k: "cmd", t: "claude" },
            { k: "ok", t: "Welcome to Claude Code — ready." },
          ]}
        />
      </div>

      {/* four 經驗 chips */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 712, display: "flex", justifyContent: "center", gap: 18, opacity: chipsIn, transform: `translateY(${(1 - chipsIn) * 16}px)` }}>
        {CHIPS.map((c) => (
          <div key={c.n} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${c.c}66`, boxShadow: SHADOW.md }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: c.c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small }}>{c.n}</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{c.t}</span>
          </div>
        ))}
      </div>

      {/* subtitle */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 836, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{BRAND.tagline}</span>
      </div>

      {/* date chip */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 916, display: "flex", justifyContent: "center", ...date }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 24px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: MOTIF.install }} />
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>{BRAND.date}</span>
        </div>
      </div>

      <Sfx src="pop" at={40} volume={0.4} />
      <Sfx src="ding" at={150} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const cover: SceneDef = {
  id: "cv",
  index: 0,
  kicker: "封面 · Cover",
  title: "Cover",
  accent: MOTIF.install,
  durationInFrames: DUR,
  Component: Cover,
};
