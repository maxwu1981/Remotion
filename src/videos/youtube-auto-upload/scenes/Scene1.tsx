import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, enter, springPop, springV } from "../../../shared-skills/anim";
import { ArrowLink } from "../../../shared-skills/components/lux";
import { RemotionLogo, YouTubeLogo } from "../../../shared-skills/components/logos";
import { Sfx } from "../../../shared-skills/audio";
import { UPLOAD_BRAND } from "../brand";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 315;

/* ----------------------------------------------------- left: render window --- */

const RenderWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: 6, stiffness: 90, damping: 15 });
  const x = (1 - s) * -150;
  const op = enter(frame, 6, 14);
  const prog = interpolate(frame, [20, 70], [0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = prog >= 0.999;

  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        top: 300,
        width: 560,
        height: 340,
        opacity: op,
        transform: `translateX(${x}px)`,
        borderRadius: RADIUS.lg,
        background: "#101528",
        boxShadow: SHADOW.lg,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 9, padding: "0 16px", background: "#161C36" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
        <RemotionLogo size={20} style={{ marginLeft: 8 }} />
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: "#AEB7D6", marginLeft: 6 }}>render.mjs</span>
      </div>
      <div style={{ padding: 22 }}>
        <div
          style={{
            height: 150,
            borderRadius: RADIUS.md,
            background: GRADIENT.remotion,
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={46} height={46} viewBox="0 0 24 24">
              <path d="M9 6l10 6-10 6z" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: done ? COLORS.term.green : "#9AA4CC" }}>
            {done ? "✓ render complete" : "rendering 1920×1080…"}
          </span>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, color: "#E7EBF8" }}>
            {Math.round(prog * 100)}%
          </span>
        </div>
        <div style={{ marginTop: 10, height: 9, borderRadius: 999, background: "#27304F", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${prog * 100}%`,
              borderRadius: 999,
              background: done ? COLORS.term.green : `linear-gradient(90deg, ${COLORS.remotion}, ${COLORS.teal})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------- right: youtube studio --- */

const StudioPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: 12, stiffness: 90, damping: 15 });
  const x = (1 - s) * 150;
  const op = enter(frame, 12, 14);
  const rowIn = springPop(frame, fps, { delay: 58, from: 0.8, dist: 22 });
  const live = enter(frame, 74, 12);

  return (
    <div
      style={{
        position: "absolute",
        right: 150,
        top: 300,
        width: 560,
        height: 340,
        opacity: op,
        transform: `translateX(${x}px)`,
        borderRadius: RADIUS.lg,
        background: COLORS.surface,
        boxShadow: SHADOW.lg,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: COLORS.surfaceAlt, borderBottom: `1px solid ${COLORS.border}` }}>
        <YouTubeLogo size={22} />
        <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 700, color: COLORS.ink }}>YouTube Studio</span>
        <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint }}>Channel content</span>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint, letterSpacing: 1, marginBottom: 12 }}>
          VIDEOS
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: 14,
            borderRadius: RADIUS.md,
            background: COLORS.surfaceAlt,
            border: `1px solid ${COLORS.border}`,
            opacity: rowIn.opacity,
            transform: rowIn.transform,
          }}
        >
          <div style={{ width: 132, height: 76, borderRadius: 8, background: GRADIENT.ink, flexShrink: 0, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={26} height={26} viewBox="0 0 24 24"><path d="M9 6l10 6-10 6z" fill="rgba(255,255,255,0.9)" /></svg>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 700, color: COLORS.ink }}>
              How I Auto-Upload to YouTube
            </div>
            <div
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 11px",
                borderRadius: RADIUS.pill,
                background: COLORS.successBg,
                opacity: live,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.success }} />
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, color: COLORS.success }}>Public</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- hero --- */

const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = springPop(frame, fps, { delay: 120, from: 0.9, dist: 24 });
  const l2 = springPop(frame, fps, { delay: 130, from: 0.9, dist: 24 });
  const tag = appearUp(frame, 150, 18, 20);

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center" }}>
      <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 86, lineHeight: 1.0, letterSpacing: -2.5, color: COLORS.ink }}>
        <div style={{ ...l1 }}>{UPLOAD_BRAND.hero[0]}</div>
        <div style={{ ...l2 }}>
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            {UPLOAD_BRAND.hero[1]}
          </span>
        </div>
      </div>
      <div style={{ marginTop: 22, fontFamily: FONT.ui, fontSize: TYPE.h3, fontWeight: 500, color: COLORS.muted, ...tag }}>
        {UPLOAD_BRAND.tagline}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------- automated pill --- */

const AutoPill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springPop(frame, fps, { delay: 40, from: 0.7, dist: 0 });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 150,
        display: "flex",
        justifyContent: "center",
        opacity: p.opacity,
        transform: p.transform,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 26px",
          borderRadius: RADIUS.pill,
          background: COLORS.surface,
          border: `1px solid ${COLORS.success}40`,
          boxShadow: SHADOW.glow(COLORS.success),
        }}
      >
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: COLORS.success, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, letterSpacing: 1, color: COLORS.ink }}>
          100% FULLY AUTOMATED
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- scene --- */

const CUES: Cue[] = [
  { id: "u1-c1", from: 20, dur: 100, text: "Set it up once — and auto-upload forever." },
  { id: "u1-c2", from: 130, dur: 175, text: "A one-time, 5-minute setup, and every future video uploads itself to YouTube." },
];

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const arrowP = interpolate(frame, [40, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <UploadShell durationInFrames={DUR} showChrome={false} accent={COLORS.remotion}>
      <RenderWindow />
      {/* upload flow between the two windows */}
      {frame >= 40 ? (
        <ArrowLink from={[720, 470]} to={[1190, 470]} ctrl={[955, 430]} progress={arrowP} color={COLORS.remotion} />
      ) : null}
      <StudioPanel />
      <AutoPill />
      {frame >= 100 ? <Hero /> : null}

      <Sfx src="whoosh" at={6} volume={0.5} />
      <Sfx src="whoosh" at={12} volume={0.4} />
      <Sfx src="pop" at={40} volume={0.5} />
      <Sfx src="ding" at={74} volume={0.4} />
      <Sfx src="pop" at={120} volume={0.45} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene1: SceneDef = {
  id: "u1",
  index: 1,
  kicker: "Opening",
  title: "Set Up Once, Auto-Upload Forever",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene1,
};
