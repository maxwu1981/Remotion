import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../theme";
import { appearUp, ramp, springPop } from "../anim";
import { Sfx } from "../audio";
import type { Cue } from "../captions";
import { Shell } from "./Shell";

const GOLD = COLORS.hi.amber;

/**
 * Promoted from the Git commit/push guide's "💎今日提示詞" scene — the
 * recurring "prompt of the day" segment: a copy-me terminal card plus two
 * transferable-knowledge notes, meant to sit right before the Outro so every
 * video ends by sending the viewer away with something concrete.
 */
export type GemContent = {
  label: string;
  labelEn: string;
  hint: string;
  prompt: string;
  why: string;
  variant: string;
  save: string;
};

/** The recurring "欄目" badge — 💎 今日提示詞 · Prompt of the Day. */
const GemBadge: React.FC<{ gem: GemContent }> = ({ gem }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 32px", borderRadius: RADIUS.pill, background: `linear-gradient(135deg, ${GOLD}1c, ${COLORS.surface})`, border: `2px solid ${GOLD}`, boxShadow: `0 12px 34px ${GOLD}33` }}>
    <span style={{ fontSize: 40 }}>💎</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink, letterSpacing: -0.5 }}>{gem.label}</span>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.faint }} />
    <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: TYPE.body, color: COLORS.muted }}>{gem.labelEn}</span>
  </div>
);

/** The dark, copy-me prompt card — high-contrast "乾貨" against the light canvas. */
const PromptCard: React.FC<{ prompt: string; typed: number; copied: boolean }> = ({ prompt, typed, copied }) => {
  const frame = useCurrentFrame();
  const shown = prompt.slice(0, typed);
  const caret = typed < prompt.length;
  const blink = Math.floor(frame / 16) % 2 === 0;
  return (
    <div style={{ width: 1240, borderRadius: RADIUS.lg, background: COLORS.term.bg, boxShadow: `0 30px 70px rgba(20,20,43,0.28), 0 0 0 1px ${GOLD}44`, overflow: "hidden" }}>
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

/**
 * `cues` needs 6 entries (badge reveal, hint, card-type-start, insight 1,
 * insight 2, save chip) — the same convention a video's own
 * `buildScene([...6 ids])` produces. Captions/VO stay video-local (pass your
 * own `<Captions cues={cues} />` via the `captions` prop).
 */
export const PromptGem: React.FC<{
  gem: GemContent;
  cues: Cue[];
  durationInFrames: number;
  accent?: string;
  whyColor?: string;
  variantColor?: string;
  kicker?: string;
  brand: string;
  seed?: string;
  captions?: React.ReactNode;
}> = ({
  gem,
  cues,
  durationInFrames,
  accent = GOLD,
  whyColor = COLORS.hi.violet,
  variantColor = COLORS.hi.sky,
  kicker = "今日提示詞 · Prompt of the Day",
  brand,
  seed = "prompt-gem",
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (i: number) => cues[i]?.from ?? 0;

  const header = springPop(frame, fps, { delay: at(0), from: 0.8, dist: 18 });
  const hint = appearUp(frame, at(1), 16, 20);
  const cardIn = appearUp(frame, at(2) - 6, 16, 24);
  const typed = Math.floor(ramp(frame, at(2), at(3) - 12) * gem.prompt.length);
  const copied = typed >= gem.prompt.length && frame >= at(3) - 16;

  return (
    <Shell durationInFrames={durationInFrames} accent={accent} kicker={kicker} seed={seed} brand={brand}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 118, display: "flex", justifyContent: "center", ...header }}>
        <GemBadge gem={gem} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", ...hint }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{gem.hint}</span>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 288, display: "flex", justifyContent: "center", ...cardIn }}>
        <PromptCard prompt={gem.prompt} typed={Math.max(0, typed)} copied={copied} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 28 }}>
        <InsightCard emoji="💡" tag="為什麼這樣寫" text={gem.why} color={whyColor} delay={at(3)} />
        <InsightCard emoji="🔄" tag="換個情境" text={gem.variant} color={variantColor} delay={at(4)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 122, display: "flex", justifyContent: "center", ...appearUp(frame, at(5), 16, 18) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 30px", borderRadius: RADIUS.pill, background: `linear-gradient(135deg, ${accent}14, ${COLORS.surface})`, border: `1.5px solid ${accent}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{gem.save}</span>
        </div>
      </div>

      <Sfx src="whoosh" at={at(0)} volume={0.32} />
      <Sfx src="typing" at={at(2)} volume={0.3} durationInFrames={Math.max(20, at(3) - 12 - at(2))} />
      <Sfx src="ding" at={at(3) - 14} volume={0.34} />
      <Sfx src="pop" at={at(3)} volume={0.3} />
      <Sfx src="pop" at={at(4)} volume={0.3} />
      <Sfx src="ding" at={at(5)} volume={0.3} />
      {captions}
    </Shell>
  );
};
