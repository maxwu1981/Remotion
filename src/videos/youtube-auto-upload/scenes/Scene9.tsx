import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop, springV } from "../../../shared-skills/anim";
import { RemotionLogo, YouTubeLogo } from "../../../shared-skills/components/logos";
import { BrainMark, GmailMark } from "../ui";
import { UPLOAD_BRAND } from "../brand";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 345;

const Token: React.FC<{ icon: React.ReactNode; label: string; delay: number }> = ({ icon, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springPop(frame, fps, { delay, from: 0.7, dist: 18 });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 30px",
        borderRadius: RADIUS.lg,
        background: GRADIENT.surface,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 18px 40px -18px rgba(20,20,43,0.4), inset 0 1px 0 #fff",
        opacity: p.opacity,
        transform: p.transform,
      }}
    >
      <span style={{ width: 56, height: 56, borderRadius: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </span>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, letterSpacing: -0.5, textShadow: "0 1px 0 #fff" }}>{label}</span>
    </div>
  );
};

const Chevron: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.6 + 0.4 * Math.sin(frame / 9);
  return (
    <svg width={64} height={40} viewBox="0 0 64 40" style={{ opacity: op }}>
      <path d="M8 20h40M40 10l12 10-12 10" fill="none" stroke={COLORS.remotion} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={pulse} />
    </svg>
  );
};

/** Diagonal light band sweeping across the slogan row. */
const Shimmer: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + dur], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visible = frame >= start && frame <= start + dur + 6;
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: RADIUS.xl,
        background: `linear-gradient(105deg, transparent ${t - 16}%, rgba(255,255,255,0.85) ${t}%, transparent ${t + 16}%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const CUES: Cue[] = [
  { id: "u9-c1", from: 18, dur: 180, text: "From the incoming email, to the script, to the final publish — zero manual steps." },
  { id: "u9-c2", from: 205, dur: 138, text: "Start building your fully automated production line today." },
];

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hero = springV(frame, fps, { delay: 14, stiffness: 90, damping: 15 });
  const cta = appearUp(frame, 205, 18, 22);
  const fade = interpolate(frame, [DUR - 36, DUR - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // faint background nodes drifting
  const bgOp = interpolate(frame, [0, 26], [0, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <UploadShell durationInFrames={DUR} showChrome={false} showProgress={false} accent={COLORS.remotion}>
      <AbsoluteFill style={{ opacity: fade }}>
        {/* shrunken nodes settling into the background */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 120, opacity: bgOp, transform: `scale(0.7) translateY(${Math.sin(frame / 50) * 8}px)` }}>
          {[<GmailMark key="g" size={70} />, <RemotionLogo key="r" size={70} />, <YouTubeLogo key="y" size={70} />].map((ic, i) => (
            <div key={i} style={{ filter: "grayscale(0.2)" }}>{ic}</div>
          ))}
        </div>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", transform: `scale(${0.86 + hero * 0.14})`, opacity: hero }}>
            <div style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, letterSpacing: 4, color: COLORS.muted, marginBottom: 34 }}>
              ZERO MANUAL INTERVENTION
            </div>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, padding: 14 }}>
              <Token icon={<GmailMark size={34} />} label="Email" delay={20} />
              <Chevron delay={40} />
              <Token icon={<BrainMark size={32} color={COLORS.hi.violet} />} label="Auto-Generate Script" delay={48} />
              <Chevron delay={70} />
              <Token icon={<YouTubeLogo size={36} />} label="YouTube Auto-Upload" delay={78} />
              <Shimmer start={104} dur={46} />
            </div>
          </div>
        </AbsoluteFill>

        {/* CTA */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", ...cta }}>
          <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, letterSpacing: -1, color: COLORS.ink }}>
            Build your fully automated line — <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>today</span>.
          </div>
          <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 14, padding: "9px 16px 9px 9px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: "#FF0000", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={15} height={15} viewBox="0 0 24 24"><path d="M9 6l9 6-9 6z" fill="#fff" /></svg>
            </span>
            <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, letterSpacing: -0.3 }}>
              {UPLOAD_BRAND.pre}<span style={{ color: COLORS.remotion }}>{UPLOAD_BRAND.post}</span>
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={20} volume={0.4} />
      <Sfx src="pop" at={48} volume={0.4} />
      <Sfx src="pop" at={78} volume={0.45} />
      <Sfx src="whoosh" at={104} volume={0.4} />
      <Sfx src="ding" at={205} volume={0.45} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene9: SceneDef = {
  id: "u9",
  index: 9,
  kicker: "CTA",
  title: "Core value & call to action",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene9,
};
