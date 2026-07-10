import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, ramp } from "../components";
import { GEM, MOTIF } from "../data";

const IDS = ["gem-c1", "gem-c2", "gem-c3", "gem-c4", "gem-c5", "gem-c6"];
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 14, tail: 40, minDur: 420 });
const at = (i: number) => CUES[i].from;

const GOLD = COLORS.hi.amber;

/** The recurring "欄目" badge — 💎 今日提示詞 · Prompt of the Day. */
const GemBadge: React.FC = () => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 32px", borderRadius: RADIUS.pill, background: `linear-gradient(135deg, ${GOLD}1c, ${COLORS.surface})`, border: `2px solid ${GOLD}`, boxShadow: `0 12px 34px ${GOLD}33` }}>
    <span style={{ fontSize: 40 }}>💎</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink, letterSpacing: -0.5 }}>{GEM.label}</span>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.faint }} />
    <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: TYPE.body, color: COLORS.muted }}>{GEM.labelEn}</span>
  </div>
);

/** The dark, copy-me prompt card — high-contrast "乾貨" against the light canvas. */
const PromptCard: React.FC<{ typed: number; copied: boolean }> = ({ typed, copied }) => {
  const frame = useCurrentFrame();
  const shown = GEM.prompt.slice(0, typed);
  const caret = typed < GEM.prompt.length;
  const blink = Math.floor(frame / 16) % 2 === 0;
  return (
    <div style={{ width: 1240, borderRadius: RADIUS.lg, background: COLORS.term.bg, boxShadow: `0 30px 70px rgba(20,20,43,0.28), 0 0 0 1px ${GOLD}44`, overflow: "hidden" }}>
      {/* title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: COLORS.term.bgTop }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: FONT.monoCjk, fontSize: TYPE.small, color: COLORS.term.dim }}>prompt · Claude Code／Cowork</span>
        <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: RADIUS.pill, background: copied ? COLORS.success : `${GOLD}22`, border: `1px solid ${copied ? COLORS.success : GOLD}` }}>
          <span style={{ fontSize: 15 }}>{copied ? "✓" : "📋"}</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: copied ? "#fff" : GOLD }}>{copied ? "已複製" : "複製"}</span>
        </div>
      </div>
      {/* prompt body */}
      <div style={{ padding: "30px 34px", minHeight: 96, display: "flex", alignItems: "center" }}>
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: TYPE.h3, lineHeight: 1.5, color: COLORS.term.text }}>
          <span style={{ color: COLORS.term.prompt }}>› </span>
          {shown}
          {caret ? <span style={{ opacity: blink ? 1 : 0, color: COLORS.term.green }}>▋</span> : null}
        </span>
      </div>
    </div>
  );
};

/** A small light insight card: an emoji tag + one line of transferable knowledge. */
const InsightCard: React.FC<{ emoji: string; tag: string; text: string; color: string; delay: number }> = ({ emoji, tag, text, color, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 16, 22);
  return (
    <div style={{ ...a, width: 606, display: "flex", flexDirection: "column", gap: 12, padding: "22px 26px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${color}55`, boxShadow: SHADOW.md }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>{emoji}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color }}>{tag}</span>
      </div>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, lineHeight: 1.45, color: COLORS.inkSoft }}>{text}</span>
    </div>
  );
};

export const PromptGem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const header = springPop(frame, fps, { delay: at(0), from: 0.8, dist: 18 });
  const hint = appearUp(frame, at(1), 16, 20);
  const cardIn = appearUp(frame, at(2) - 6, 16, 24);
  const typed = Math.floor(ramp(frame, at(2), at(3) - 12) * GEM.prompt.length);
  const copied = typed >= GEM.prompt.length && frame >= at(3) - 16;

  return (
    <Shell durationInFrames={DUR} accent={GOLD} kicker="今日提示詞 · Prompt of the Day" seed="prompt-gem">
      {/* 欄目 badge */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 118, display: "flex", justifyContent: "center", ...header }}>
        <GemBadge />
      </div>

      {/* hint */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", ...hint }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{GEM.hint}</span>
      </div>

      {/* the collectible prompt */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 288, display: "flex", justifyContent: "center", ...cardIn }}>
        <PromptCard typed={Math.max(0, typed)} copied={copied} />
      </div>

      {/* transferable-knowledge cards */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 28 }}>
        <InsightCard emoji="💡" tag="為什麼這樣寫" text={GEM.why} color={MOTIF.commit} delay={at(3)} />
        <InsightCard emoji="🔄" tag="換個情境" text={GEM.variant} color={MOTIF.file} delay={at(4)} />
      </div>

      {/* save / GEO chip */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 122, display: "flex", justifyContent: "center", ...appearUp(frame, at(5), 16, 18) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 30px", borderRadius: RADIUS.pill, background: `linear-gradient(135deg, ${GOLD}14, ${COLORS.surface})`, border: `1.5px solid ${GOLD}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{GEM.save}</span>
        </div>
      </div>

      <Sfx src="whoosh" at={at(0)} volume={0.32} />
      <Sfx src="typing" at={at(2)} volume={0.3} durationInFrames={Math.max(20, at(3) - 12 - at(2))} />
      <Sfx src="ding" at={at(3) - 14} volume={0.34} />
      <Sfx src="pop" at={at(3)} volume={0.3} />
      <Sfx src="pop" at={at(4)} volume={0.3} />
      <Sfx src="ding" at={at(5)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const promptGem: SceneDef = {
  id: "gem",
  index: 9,
  kicker: "今日提示詞 · Prompt of the Day",
  title: "Prompt of the Day",
  accent: GOLD,
  durationInFrames: DUR,
  Component: PromptGem,
};
