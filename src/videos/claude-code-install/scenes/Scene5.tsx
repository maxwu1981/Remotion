import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Terminal, ramp } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s5-c1", "s5-c2", "s5-c3", "s5-c4", "s5-c5", "s5-c6"],
  { lead: 14, minDur: 400 },
);
const at = (i: number) => CUES[i].from;

const OPTIONS = [
  { t: "Claude Pro 訂閱", c: COLORS.claude },
  { t: "Claude Max 訂閱", c: COLORS.hi.violet },
  { t: "API 額度", c: COLORS.remotion },
];

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const optsIn = ramp(frame, at(3), at(3) + 18);
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.auth} kicker="經驗 04 · 登入授權" seed="s5">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗四：第一次啟動，要登入授權" en="First run opens a browser to sign in" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <Terminal
          width={1200}
          start={40}
          step={18}
          lines={[
            { k: "cmd", t: "claude" },
            { k: "out", t: "Opening browser to sign in to Claude…" },
            { k: "out", t: "Waiting for authorization…" },
            { k: "ok", t: "Logged in. Welcome to Claude Code." },
          ]}
        />
      </div>

      {/* login options */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: optsIn, transform: `translateY(${(1 - optsIn) * 16}px)` }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.muted }}>登入可以用 👇</div>
        <div style={{ display: "flex", gap: 18 }}>
          {OPTIONS.map((o) => (
            <div key={o.t} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${o.c}`, boxShadow: SHADOW.md }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: o.c }} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{o.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="第一次會開瀏覽器登入；用 Pro／Max 或 API 額度都行 — 做一次，之後都記住" tone={MOTIF.auth} delay={at(4)} />
      </div>

      <Sfx src="pop" at={at(1)} volume={0.32} />
      <Sfx src="ding" at={at(3)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "經驗 04 · 登入授權",
  title: "First-run login",
  accent: MOTIF.auth,
  durationInFrames: DUR,
  Component: Scene5,
};
