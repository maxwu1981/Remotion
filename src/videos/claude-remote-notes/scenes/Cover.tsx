import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, ramp } from "../components";
import { Phone, Cloud } from "../motifs";
import { MOTIF } from "../data";
import { BRAND } from "../brand";

const { cues: CUES, dur: DUR } = buildScene(["cv-c1", "cv-c2"], { lead: 8, minDur: 250 });
const at = (i: number) => CUES[i].from;
const RESOLVE = () => at(1); // cv-c2 — the hook resolves into the title

/** The glowing cloud computer — the thing that actually runs & thinks. */
const CloudComputer: React.FC<{ glow: number }> = ({ glow }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative" }}>
      <div style={{ position: "relative", width: 300, height: 210, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Cloud w={300} color={MOTIF.cloud} glow={glow * (0.6 + 0.4 * pulse)} />
        <div style={{ position: "absolute", top: "46%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 78, filter: `drop-shadow(0 0 ${10 + glow * 20 * pulse}px ${MOTIF.cloud})` }}>🧠</div>
      </div>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>雲端遠端電腦</span>
      <span style={{ fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: TYPE.small, color: MOTIF.cloud }}>真正在跑、在思考</span>
    </div>
  );
};

/** Connector: a big pulsing "?" of tension (hook), resolving into a live signal. */
const Connector: React.FC<{ resolve: number }> = ({ resolve }) => {
  const frame = useCurrentFrame();
  const w = 300;
  const qScale = 1 + 0.06 * Math.sin(frame / 7);
  const reveal = interpolate(resolve, [0, 1], [6, w - 6]);
  return (
    <div style={{ position: "relative", width: w, height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* hook "?" */}
      <div style={{ position: "absolute", opacity: 1 - resolve, transform: `scale(${qScale})` }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 96, color: MOTIF.cloud, filter: `drop-shadow(0 6px 16px ${MOTIF.cloud}66)` }}>？</span>
      </div>
      {/* resolved signal */}
      <svg width={w} height={70} style={{ overflow: "visible", opacity: resolve }}>
        <line x1={6} y1={35} x2={w - 6} y2={35} stroke={COLORS.borderStrong} strokeWidth={2} strokeDasharray="2 7" />
        <line x1={6} y1={35} x2={reveal} y2={35} stroke={MOTIF.phone} strokeWidth={3} strokeLinecap="round" />
        {resolve > 0.95
          ? new Array(5).fill(0).map((_, i) => {
              const t = (((frame / 40 + i / 5) % 1) + 1) % 1;
              const c = i % 2 === 0 ? MOTIF.phone : MOTIF.cloud;
              return <circle key={i} cx={6 + (w - 12) * t} cy={35} r={4.5} fill={c} opacity={Math.sin(Math.PI * t)} style={{ filter: `drop-shadow(0 0 6px ${c})` }} />;
            })
          : null}
        <circle cx={6} cy={35} r={6} fill={MOTIF.phone} />
        <circle cx={w - 6} cy={35} r={6} fill={MOTIF.cloud} />
      </svg>
    </div>
  );
};

export const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolveStart = RESOLVE();

  // hook (beat 1) → leaves as the title (beat 2) arrives
  const hookIn = appearUp(frame, at(0) + 2, 16, 26);
  const hookOpacity = Math.min(hookIn.opacity, leave(frame, resolveStart - 8, 12));
  const resolve = ramp(frame, resolveStart, resolveStart + 24);

  const phone = springPop(frame, fps, { delay: 10, from: 0.7, dist: 40 });
  const cloud = springPop(frame, fps, { delay: 22, from: 0.7, dist: 40 });
  const glow = ramp(frame, 40, 80);

  const title = appearUp(frame, resolveStart + 6, 20, 26);
  const sub = appearUp(frame, resolveStart + 22, 18, 20);
  const date = appearUp(frame, resolveStart + 40, 16, 16);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={MOTIF.cloud} seed="cover">
      {/* top zone: hook question (beat 1) cross-fades to title (beat 2) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 132, textAlign: "center" }}>
        {/* hook */}
        <div style={{ position: "absolute", left: 0, right: 0, opacity: hookOpacity, transform: hookIn.transform }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>在手機上用 Claude Code…</div>
          <div style={{ marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 76, letterSpacing: -1.5, color: COLORS.ink, lineHeight: 1.12 }}>
            到底是{" "}
            <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>哪一台電腦</span>
            在跑？
          </div>
        </div>
        {/* title */}
        <div style={{ position: "absolute", left: 0, right: 0, opacity: title.opacity, transform: title.transform }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 70, letterSpacing: -1, color: COLORS.ink, lineHeight: 1.14 }}>
            Claude Code <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>手機／遠端全解析</span>
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, letterSpacing: -0.5, color: COLORS.inkSoft }}>
            記憶、容器與 <span style={{ fontFamily: FONT.mono }}>CLAUDE.md</span>
          </div>
        </div>
      </div>

      {/* hero stage: phone — (? / signal) — cloud */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 388, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <div style={{ ...phone }}>
          <Phone h={320} label="手機 · 螢幕／遙控器" screen={<span style={{ fontSize: 86 }}>📱</span>} />
        </div>
        <div style={{ opacity: cloud.opacity, marginBottom: 60 }}>
          <Connector resolve={resolve} />
        </div>
        <div style={{ ...cloud }}>
          <CloudComputer glow={glow} />
        </div>
      </div>

      {/* subtitle + date (beat 2) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 812, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{BRAND.tagline}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 904, display: "flex", justifyContent: "center", ...date }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 24px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: MOTIF.cloud }} />
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>{BRAND.date}</span>
        </div>
      </div>

      <Sfx src="pop" at={10} volume={0.4} />
      <Sfx src="pop" at={22} volume={0.4} />
      <Sfx src="whoosh" at={resolveStart} volume={0.4} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const cover: SceneDef = {
  id: "cv",
  index: 0,
  kicker: "封面 · Cover",
  title: "Cover",
  accent: MOTIF.cloud,
  durationInFrames: DUR,
  Component: Cover,
};
