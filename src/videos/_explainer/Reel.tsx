/**
 * 直幅原生 9:16 Reel（1080×1920）for the roundup / 工具盤點卡 specs.
 *
 * 不是把橫版 Master 縮放進 reel —— 而是用同一份 spec + VO，把 cover / spotlight /
 * outro 三種場景**重新排成滿版直式**（卡片佔滿整個 9:16，字大、手機可讀），
 * 對齊參考片那種「裝這 N 個就夠了」的直幅卡片觀感。
 *
 * 時間軸與 Master 完全共用（同 buildScene / MIN_DUR / explainerFrames），所以
 * 旁白、字幕、場景長度都跟橫版一致。只支援 roundup 會用到的 cover/spotlight/outro。
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp } from "../../shared-skills/anim";
import { Bgm, Sfx } from "../../shared-skills/audio";
import { CaptionTrack, Cue } from "../../shared-skills/captions";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { BrandGlyph, ramp } from "./components";
import { accent as accentColor } from "./palette";
import { buildScene, MIN_DUR, explainerFrames } from "./Explainer";
import type { SceneBlock, VideoSpec } from "./schema";
import { useCurrentFrame } from "remotion";

const TRANSITION = 14;
const M = 60; // side margin

export const roundupReelFrames = explainerFrames;

/* ── vertical page chrome ─────────────────────────────────────────────── */
const VShell: React.FC<{
  name: string;
  kicker?: string;
  accent: string;
  durationInFrames: number;
  seed?: string;
  showChrome?: boolean;
  children: React.ReactNode;
}> = ({ name, kicker, accent, durationInFrames, seed, showChrome = true, children }) => {
  const frame = useCurrentFrame();
  const headIn = ramp(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={seed ?? kicker ?? "reel"} freeze />
      <AbsoluteFill>{children}</AbsoluteFill>
      {showChrome ? (
        <>
          <div style={{ position: "absolute", top: 64, left: M, right: M, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: headIn, transform: `translateY(${(1 - headIn) * -12}px)` }}>
            {kicker ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: accent, boxShadow: `0 0 0 5px ${accent}22` }} />
                <span style={{ fontFamily: FONT.monoCjk, fontSize: TYPE.small, fontWeight: 700, letterSpacing: 1, color: accent }}>{kicker}</span>
              </div>
            ) : (<span />)}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              <BrandGlyph size={28} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{name}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.remotion}, ${COLORS.hi.violet}, ${COLORS.claude})`, boxShadow: `0 0 16px ${accent}88` }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ── one vertical scene ───────────────────────────────────────────────── */
const ReelScene: React.FC<{ block: SceneBlock; cues: Cue[]; dur: number; spec: VideoSpec; vo: Record<string, number>; voDir: string }> = ({ block, cues, dur, spec, vo, voDir }) => {
  const frame = useCurrentFrame();
  const at = (i: number) => cues[Math.min(i, cues.length - 1)].from;
  const acc = (k?: string) => accentColor(k);
  const caps = <CaptionTrack cues={cues} vo={vo} voDir={voDir} />;

  if (block.type === "cover") {
    const title = appearUp(frame, 6, 20, 26);
    const sub = appearUp(frame, 180, 18, 20);
    return (
      <VShell name={spec.brand.name} durationInFrames={dur} accent={acc("blue")} seed="cover" showChrome={false}>
        <div style={{ position: "absolute", left: M, right: M, top: 150, textAlign: "center", ...title }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 76, letterSpacing: -1, color: COLORS.ink, lineHeight: 1.05 }}>{block.titlePre}</div>
          <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 118, letterSpacing: -2, lineHeight: 1.04, background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{block.titlePost}</div>
        </div>
        {block.index?.length ? (
          <div style={{ position: "absolute", left: M, right: M, top: 540, display: "flex", flexDirection: "column", gap: 18 }}>
            {block.index.map((it, i) => {
              const col = acc(it.accent);
              const ri = appearUp(frame, 60 + i * 12, 16, 22);
              return (
                <div key={i} style={{ ...ri, display: "flex", alignItems: "center", gap: 24, padding: "22px 30px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${col}66`, boxShadow: SHADOW.md }}>
                  <span style={{ width: 76, height: 76, flexShrink: 0, borderRadius: 18, background: col, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 40 }}>{it.n}</span>
                  <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink, letterSpacing: -0.5 }}>{it.title}</span>
                  <span style={{ marginLeft: "auto", textAlign: "right", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.muted }}>{it.tag}</span>
                </div>
              );
            })}
          </div>
        ) : null}
        <div style={{ position: "absolute", left: M, right: M, top: 1640, textAlign: "center", ...sub }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted, lineHeight: 1.4 }}>{spec.brand.tagline}</span>
        </div>
        <Sfx src="pop" at={20} volume={0.4} />
        {caps}
      </VShell>
    );
  }

  if (block.type === "spotlight") {
    const col = acc(block.accent);
    const card = appearUp(frame, at(0), 18, 26);
    return (
      <VShell name={spec.brand.name} durationInFrames={dur} accent={col} kicker={`${block.no} · ${block.kicker}`} seed={block.titleEn}>
        <div style={{ position: "absolute", left: M, right: M, top: 300, bottom: 360, ...card }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2.5px solid ${col}`, boxShadow: SHADOW.lg, padding: "76px 64px", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", top: 36, right: 52, fontFamily: FONT.ui, fontWeight: 800, fontSize: 240, lineHeight: 1, color: `${col}1c`, letterSpacing: -6 }}>{block.no}</div>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 100, letterSpacing: -2.5, color: COLORS.ink, lineHeight: 1.02 }}>{block.titleEn}</div>
            <div style={{ marginTop: 22, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: col, letterSpacing: -0.5, lineHeight: 1.2 }}>{block.subZh}</div>
            <div style={{ marginTop: 30, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 38, color: COLORS.muted, lineHeight: 1.5 }}>{block.desc}</div>
            <div style={{ marginTop: 54, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 13, height: 13, borderRadius: 4, background: col }} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, letterSpacing: 2, color: col }}>核心特點</span>
            </div>
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 26 }}>
              {block.bullets.map((b, i) => {
                const bi = appearUp(frame, at(Math.min(i + 1, cues.length - 1)), 14, 20);
                return (
                  <div key={i} style={{ ...bi, display: "flex", alignItems: "center", gap: 22 }}>
                    <span style={{ width: 46, height: 46, flexShrink: 0, borderRadius: "50%", background: `${col}18`, border: `2.5px solid ${col}`, color: col, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 24 }}>✓</span>
                    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 50, color: COLORS.inkSoft, lineHeight: 1.25 }}>{b}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Sfx src="pop" at={at(0) + 8} volume={0.3} />
        {caps}
      </VShell>
    );
  }

  // outro (roundup reels only use cover / spotlight / outro)
  if (block.type !== "outro") return null;
  const intro = appearUp(frame, at(0), 18, 22);
  const ctaAt = at(block.cues.length - 1);
  const ctaShow = frame >= ctaAt - 16;
  const ctaA = appearUp(frame, ctaAt, 18, 26);
  const ctas = [
    { icon: "👍", t: "按讚", c: COLORS.success },
    { icon: "🔔", t: "訂閱", c: COLORS.error },
    { icon: "🔗", t: "分享", c: COLORS.remotion },
  ];
  return (
    <VShell name={spec.brand.name} durationInFrames={dur} accent={acc("blue")} seed="outro" showChrome={false}>
      <div style={{ position: "absolute", left: M, right: M, top: 150, textAlign: "center", ...intro }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 80, letterSpacing: -1.5, color: COLORS.ink }}>{block.headingZh}</div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.body, color: COLORS.muted }}>{block.headingEn}</div>
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 360, display: "flex", flexDirection: "column", gap: 18 }}>
        {block.cards.map((c, i) => {
          const a = appearUp(frame, at(Math.min(i + 1, block.cues.length - 1)), 16, 22);
          const col = acc(c.accent);
          return (
            <div key={i} style={{ ...a, display: "flex", alignItems: "center", gap: 22, padding: "22px 30px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${col}55`, boxShadow: SHADOW.md }}>
              <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: "50%", background: `${col}16`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>{c.emoji}</div>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 38, color: COLORS.ink, lineHeight: 1.3 }}>{c.text}</span>
            </div>
          );
        })}
      </div>
      {ctaShow ? (
        <div style={{ position: "absolute", left: M, right: M, top: 1230, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, ...ctaA }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 84, letterSpacing: -1, color: COLORS.ink }}>感謝 <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>觀看</span>！</div>
          <div style={{ display: "flex", gap: 20 }}>
            {ctas.map((cta) => (
              <div key={cta.t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2.5px solid ${cta.c}`, boxShadow: SHADOW.md }}>
                <span style={{ fontSize: 40 }}>{cta.icon}</span>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: cta.c }}>{cta.t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
            <BrandGlyph size={30} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{spec.brand.name}</span>
          </div>
        </div>
      ) : null}
      <Sfx src="pop" at={ctaAt + 10} volume={0.34} />
      {caps}
    </VShell>
  );
};

/** The whole vertical reel, data-driven from the same VideoSpec + VO manifest. */
export const RoundupReel: React.FC<{ spec: VideoSpec; vo: Record<string, number>; voDir: string }> = ({ spec, vo, voDir }) => {
  const built = spec.scenes.map((block) => ({ block, ...buildScene(block.cues, spec.script, vo, MIN_DUR[block.type]) }));
  const children: React.ReactNode[] = [];
  built.forEach((b, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={b.dur}>
        <ReelScene block={b.block} cues={b.cues} dur={b.dur} spec={spec} vo={vo} voDir={voDir} />
      </TransitionSeries.Sequence>,
    );
    if (i < built.length - 1) {
      children.push(<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />);
    }
  });
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Bgm src="bgm-piano.mp3" volume={0.13} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
