import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { GlassPanel, LightStream } from "../../../shared-skills/components/lux";
import { RemotionLogo, YouTubeLogo } from "../../../shared-skills/components/logos";
import { BrainMark, GmailMark } from "../ui";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 345;

const NodeCard: React.FC<{
  left: number;
  top: number;
  w: number;
  h: number;
  delay: number;
  tint: string;
  glow: string;
  step: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
}> = ({ left, top, w, h, delay, tint, glow, step, label, sub, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springPop(frame, fps, { delay, from: 0.82, dist: 26 });
  const float = Math.sin((frame - delay) / 38) * 6;
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, opacity: p.opacity, transform: `${p.transform} translateY(${float}px)` }}>
      <GlassPanel tint={tint} glow={glow} glowAmt={0.4} radius={28} style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", padding: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 2, color: glow }}>{step}</div>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {icon}
          </div>
          <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{label}</div>
          <div style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted, lineHeight: 1.35 }}>{sub}</div>
        </div>
      </GlassPanel>
    </div>
  );
};

const CUES: Cue[] = [
  { id: "u8-c1", from: 16, dur: 70, text: "Let's review the production line." },
  { id: "u8-c2", from: 88, dur: 168, text: "Email comes in. AI writes and renders the video. YouTube publishes it." },
  { id: "u8-c3", from: 262, dur: 80, text: "Three nodes — fully connected." },
];

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = appearUp(frame, 8, 16, 18);
  const s1 = interpolate(frame, [74, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2 = interpolate(frame, [126, 172], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const banner = springPop(frame, fps, { delay: 256, from: 0.8, dist: 0 });

  return (
    <UploadShell durationInFrames={DUR} showChrome={false} accent={COLORS.teal}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", ...heading }}>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 4, color: COLORS.muted }}>THE PRODUCTION LINE</div>
        <div style={{ marginTop: 10, fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h1, letterSpacing: -1.5, color: COLORS.ink }}>
          Three nodes, one automated flow
        </div>
      </div>

      {/* data-flow streams behind the cards */}
      <LightStream from={[600, 560]} to={[770, 560]} ctrl={[685, 512]} progress={s1} color={COLORS.hi.violet} width={4} particles={4} speed={48} particleFrom={118} />
      <LightStream from={[1150, 560]} to={[1320, 560]} ctrl={[1235, 512]} progress={s2} color={COLORS.remotion} width={4} particles={4} speed={48} particleFrom={170} />

      <NodeCard left={230} top={410} w={370} h={310} delay={18} tint={COLORS.hi.sky} glow={COLORS.hi.sky} step="NODE 01" label="Email In" sub="A new request lands in your inbox" icon={<GmailMark size={52} />} />
      <NodeCard
        left={760} top={388} w={390} h={350} delay={40} tint={COLORS.hi.violet} glow={COLORS.hi.violet} step="NODE 02" label="AI · Render" sub="Script written, voiced & rendered"
        icon={<><BrainMark size={42} /><RemotionLogo size={36} /></>}
      />
      <NodeCard left={1320} top={410} w={370} h={310} delay={62} tint={COLORS.error} glow={"#FF3B3B"} step="NODE 03" label="Auto-Upload" sub="Published straight to YouTube" icon={<YouTubeLogo size={54} />} />

      {/* "fully connected" banner */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", opacity: banner.opacity, transform: banner.transform }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.success}40`, boxShadow: SHADOW.glow(COLORS.success) }}>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: COLORS.success, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, letterSpacing: 1, color: COLORS.ink }}>FULLY CONNECTED · ZERO TOUCH</span>
        </div>
      </div>

      <Sfx src="pop" at={18} volume={0.4} />
      <Sfx src="pop" at={40} volume={0.4} />
      <Sfx src="pop" at={62} volume={0.4} />
      <Sfx src="whoosh" at={118} volume={0.4} />
      <Sfx src="whoosh" at={170} volume={0.4} />
      <Sfx src="ding" at={258} volume={0.5} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene8: SceneDef = {
  id: "u8",
  index: 8,
  kicker: "Recap",
  title: "The production line",
  accent: COLORS.teal,
  durationInFrames: DUR,
  Component: Scene8,
};
