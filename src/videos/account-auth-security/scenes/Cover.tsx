import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";

const { cues: CUES, dur: DUR } = buildScene(["cv-1", "cv-2"], { lead: 8, minDur: 320 });

const ROWS = [
  { c: COLORS.claude, key: "密碼 Password", gloss: "萬能鑰匙 · 你是誰" },
  { c: COLORS.teal, key: "OAuth · Token", gloss: "前台發房卡 · 程式的限時通行證" },
  { c: COLORS.warn, key: "API Key", gloss: "後門密碼 · 機器對機器、不過期" },
  { c: COLORS.error, key: "CAPTCHA", gloss: "門口警衛 · 你是不是人" },
];

/** Animated EP00「致勝公式」cover — flashes at 0:00, then the topic hook. */
export const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const brand = appearUp(frame, 2, 14, 14);
  const title = appearUp(frame, 8, 18, 24);
  const hook = appearUp(frame, 28, 20, 26);
  const chips = appearUp(frame, 60, 18, 20);

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted, ...brand }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 140, left: 96, ...title }}>
        <div style={{ fontWeight: 800, fontSize: 64, color: COLORS.ink, lineHeight: 1 }}>帳號授權安全</div>
        <div style={{ fontWeight: 800, fontSize: 132, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>鑰匙比喻</div>
      </div>

      <div style={{ position: "absolute", top: 478, left: 92, display: "flex", alignItems: "center", gap: 26, ...hook }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 300, lineHeight: 0.84, color: COLORS.claudeDeep, letterSpacing: -10 }}>4</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: COLORS.ink }}>個角色</span>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>一次搞懂</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 96, left: 96, display: "flex", gap: 18, alignItems: "center", ...chips }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44 }}>鑰匙 · 警衛 · 旅館</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 40 }}>觀念詳解</span>
      </div>

      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {ROWS.map((r, i) => {
          const a = appearUp(frame, 16 + i * 8, 16, 22);
          return (
            <div key={r.key} style={{ ...a, display: "flex", alignItems: "center", gap: 22, height: 196, padding: "0 32px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box", boxShadow: SHADOW.md }}>
              <span style={{ fontWeight: 800, fontSize: 60, opacity: 0.5, width: 50 }}>{i + 1}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.05 }}>{r.key}</span>
                <span style={{ fontWeight: 700, fontSize: 32, opacity: 0.92 }}>{r.gloss}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Sfx src="pop" at={8} volume={0.4} />
      <Sfx src="ding" at={60} volume={0.3} />
      <Captions cues={CUES} />
    </AbsoluteFill>
  );
};

export const cover: SceneDef = {
  id: "cv",
  index: 0,
  kicker: "封面 · Cover",
  title: "Cover",
  accent: COLORS.claude,
  durationInFrames: DUR,
  Component: Cover,
};
