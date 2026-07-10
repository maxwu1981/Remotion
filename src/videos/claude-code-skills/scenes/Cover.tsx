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
  { n: "1", t: "建立 SKILL.md", c: MOTIF.build },
  { n: "2", t: "description 觸發", c: MOTIF.trigger },
  { n: "3", t: "漸進式揭露", c: MOTIF.lean },
  { n: "4", t: "放哪裡", c: MOTIF.place },
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, textAlign: "center", ...title }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 100, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.06 }}>
          <span style={{ fontFamily: FONT.mono }}>Claude Code Skills</span>{" "}
          <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>實戰</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 296, display: "flex", justifyContent: "center", ...termIn }}>
        <Terminal
          title="~/.claude/skills/pdf/SKILL.md"
          width={1120}
          start={48}
          step={18}
          lines={[
            { k: "cmt", t: "---" },
            { k: "out", t: "name: pdf" },
            { k: "out", t: "description: 當使用者要讀取或產生 PDF 時使用…" },
            { k: "cmt", t: "---" },
            { k: "ok", t: "# PDF 技能　·　步驟、規則、範例" },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 712, display: "flex", justifyContent: "center", gap: 18, opacity: chipsIn, transform: `translateY(${(1 - chipsIn) * 16}px)` }}>
        {CHIPS.map((c) => (
          <div key={c.n} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${c.c}66`, boxShadow: SHADOW.md }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: c.c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small }}>{c.n}</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{c.t}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 836, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{BRAND.tagline}</span>
      </div>

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
