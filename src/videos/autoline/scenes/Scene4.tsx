import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, leave, springPop } from "../../../shared-skills/anim";
import { SceneShell } from "../SceneShell";
import { Tooltip } from "../Tooltip";
import { CaptionTrack, Cue } from "../captions";
import { Sfx } from "../../../shared-skills/audio";
import { Waveform } from "../mockups";
import { ScissorsIcon } from "../mockups/icons";
import { GlassPanel, HoloModule, LightStream, Window3D } from "../../../shared-skills/components/lux";
import { OpenAILogo } from "../../../shared-skills/components/logos";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 850;
const SWAP = 330;

const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

const Label: React.FC<{ x: number; y: number; w?: number; children: React.ReactNode; align?: "center" | "left" }> = ({
  x,
  y,
  w = 240,
  children,
  align = "center",
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      textAlign: align,
      fontFamily: FONT.ui,
      fontSize: TYPE.small,
      fontWeight: 600,
      color: COLORS.inkSoft,
      lineHeight: 1.3,
    }}
  >
    {children}
  </div>
);

/* =========================================================== PART A · cut === */

const TW = 880;
const SEGS = (() => {
  const raw = new Array(20).fill(0).map((_, i) => ({
    silence: random(`sil${i}`) > 0.45,
    r: 0.4 + random(`w${i}`),
  }));
  const total = raw.reduce((s, x) => s + x.r, 0);
  let acc = 0;
  return raw.map((x) => {
    const w = (x.r / total) * TW;
    const start = acc;
    acc += w;
    return { ...x, w, start, center: start + w / 2 };
  });
})();

const CutLab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scanStart = 96;
  const scanEnd = 214;
  const panel = springPop(frame, fps, { delay: 60, from: 0.94, dist: 16 });
  const scanX = interpolate(frame, [scanStart, scanEnd], [0, TW], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cut = interpolate(frame, [scanStart, scanEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dur = interpolate(cut, [0, 1], [1200, 312]);
  const scanning = frame >= scanStart && frame <= scanEnd + 4;
  const refined = springPop(frame, fps, { delay: 230, from: 0.85, dist: 14 });

  return (
    <div style={{ position: "absolute", left: (1920 - TW) / 2 - 60, top: 486, ...panel }}>
      {/* duration readout */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14, marginLeft: 4 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, letterSpacing: -2, color: cut > 0.95 ? COLORS.success : COLORS.ink }}>
          {fmt(dur)}
        </span>
        <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted }}>
          {cut > 0.95 ? "tight cut" : "raw · 20:00"}
        </span>
      </div>

      <div style={{ position: "relative", width: TW + 28, height: 92, padding: 14, background: "rgba(255,255,255,0.6)", border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, boxShadow: SHADOW.md, boxSizing: "border-box", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "stretch", height: "100%", gap: 3 }}>
          {SEGS.map((s, i) => {
            const collapse = s.silence
              ? interpolate(scanX, [s.center - 22, s.center + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              : 0;
            const w = s.w * (1 - collapse);
            return (
              <div
                key={i}
                style={{
                  width: w,
                  borderRadius: 5,
                  background: s.silence
                    ? `linear-gradient(180deg, #FF8A8A, #E5484D)`
                    : `linear-gradient(180deg, #FF6B6B, #D43A3F)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                  opacity: 1 - collapse * 0.7,
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
        {scanning ? (
          <>
            <div style={{ position: "absolute", top: 6, bottom: 6, left: 14 + scanX, width: 3, background: COLORS.teal, boxShadow: `0 0 18px 3px ${COLORS.teal}` }} />
            <div style={{ position: "absolute", top: -16, left: 14 + scanX - 12, color: COLORS.ink }}>
              <ScissorsIcon size={26} color={COLORS.inkSoft} />
            </div>
          </>
        ) : null}
      </div>

      <div style={{ marginTop: 10, marginLeft: 6, fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.muted }}>
        20 min raw footage · red blocks = static / silence &gt; 3s
      </div>

      {/* refined output */}
      <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 12, ...refined }}>
        <span style={{ width: 38, height: 28, borderRadius: 7, background: COLORS.ink, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={12} height={12} viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill="#fff" /></svg>
        </span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink }}>Refined Video</span>
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.success }}>5:12 total</span>
      </div>
    </div>
  );
};

const PartA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = leave(frame, SWAP - 18, 18);
  const chars = Math.floor(interpolate(frame, [16, 60], [0, 11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const win = springPop(frame, fps, { delay: 6, from: 0.9, dist: 18 });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 720, top: 196, ...win }}>
        <Window3D command="npm run cut" caretAt={chars} width={480} height={188} rotateY={-7} accent={COLORS.remotion} />
      </div>
      <CutLab />
      <Tooltip from={120} accent={COLORS.teal} label="Silence Detection Algorithm" sub="FFmpeg silencedetect flags gaps > 3s." style={{ left: 130, top: 372 }} />
    </AbsoluteFill>
  );
};

/* ======================================================== PART B · retell === */

const WaveCard: React.FC<{ side: "in" | "out"; x: number; delay: number }> = ({ side, x, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = springPop(frame, fps, { delay, from: 0.9, dist: 16 });
  const isIn = side === "in";
  const text = isIn ? "So, um… today, uh… let's — yeah — get into it." : "Today, let's get into it.";
  const chars = Math.floor(interpolate(frame, [delay + 10, delay + 70], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div style={{ position: "absolute", left: x, top: 470, ...a }}>
      <GlassPanel radius={20} style={{ width: 318, padding: 22 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: isIn ? COLORS.muted : COLORS.hi.emerald, marginBottom: 12 }}>
          {isIn ? "RAW VOCALS · um's & ah's" : "ONYX · clean voice"}
        </div>
        <Waveform seed={isIn ? "raw" : "onyx"} bars={26} width={274} height={60} color={isIn ? COLORS.faint : COLORS.hi.emerald} live={isIn} revealProgress={isIn ? 1 : enter(frame, delay + 30, 40)} />
        <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: 14, lineHeight: 1.5, minHeight: 44, color: isIn ? COLORS.faint : COLORS.inkSoft, textDecoration: isIn ? "line-through" : "none" }}>
          {text.slice(0, chars)}
        </div>
      </GlassPanel>
    </div>
  );
};

const PartB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = enter(frame, SWAP - 6, 20);
  const chars = Math.floor(interpolate(frame, [SWAP + 16, SWAP + 64], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const win = springPop(frame, fps, { delay: SWAP + 6, from: 0.9, dist: 18 });
  const active = frame > SWAP + 200 && frame < SWAP + 460;
  const done = frame >= SWAP + 460;
  const moduleIn = springPop(frame, fps, { delay: SWAP + 80, from: 0.85, dist: 18 });

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 720, top: 150, ...win }}>
        <Window3D command="npm run retell" caretAt={chars} width={480} height={188} rotateY={7} accent={COLORS.hi.violet} />
      </div>

      <WaveCard side="in" x={132} delay={SWAP + 60} />

      <div style={{ position: "absolute", left: 805, top: 470, ...moduleIn }}>
        <HoloModule size={232} active={active} done={done} icon={<OpenAILogo size={42} />} caption={done ? "✓ done" : "STT → NLP → TTS"} />
      </div>

      <WaveCard side="out" x={1470} delay={SWAP + 360} />

      {/* curved light streams through the module */}
      <LightStream from={[450, 560]} to={[800, 586]} ctrl={[630, 660]} progress={enter(frame, SWAP + 120, 16)} color={COLORS.faint} particles={4} speed={48} particleFrom={SWAP + 150} />
      <LightStream from={[1038, 586]} to={[1466, 560]} ctrl={[1260, 660]} progress={enter(frame, SWAP + 380, 16)} color={COLORS.hi.emerald} particles={4} speed={48} particleFrom={SWAP + 420} />
      {/* decorative stream from window into module */}
      <LightStream from={[960, 348]} to={[920, 468]} ctrl={[1010, 420]} progress={enter(frame, SWAP + 90, 16)} color={COLORS.hi.violet} particles={3} speed={40} particleFrom={SWAP + 120} />

      <Label x={132} y={742} w={318}>Original vocal waveforms (um's &amp; ah's)</Label>
      <Label x={1470} y={742} w={318}>New smooth Onyx voice — Whisper + GPT</Label>

      <Tooltip from={SWAP + 120} accent={COLORS.hi.violet} label="STT → NLP → TTS" sub="Whisper hears · GPT rewrites · Onyx speaks." style={{ left: 770, top: 392 }} />
    </AbsoluteFill>
  );
};

/* ============================================================= the scene === */

const CUES: Cue[] = [
  { id: "s4-c1", from: 16, dur: 150, text: "Step one — npm run cut." },
  { id: "s4-c2", from: 110, dur: 360, text: "The algorithm strips every pause over three seconds. Twenty minutes becomes five." },
  { id: "s4-c3", from: SWAP + 12, dur: 200, text: "Step two — npm run retell." },
  { id: "s4-c4", from: SWAP + 112, dur: 300, text: "It transcribes your own voice, deletes the filler, and re-voices it in Onyx — studio grade." },
  { id: "s4-c5", from: SWAP + 337, dur: 190, text: "No re-recording. Your stumbles, gone." },
];

export const Scene4: React.FC = () => (
  <SceneShell kicker="04 / 06" title="Cut & Re-voice" accent={COLORS.remotion} durationInFrames={DUR}>
    <PartA />
    <PartB />

    <Sfx src="typing" at={16} volume={0.5} />
    <Sfx src="processing" at={96} volume={0.45} durationInFrames={120} />
    <Sfx src="ding" at={232} volume={0.45} />

    <Sfx src="typing" at={SWAP + 16} volume={0.5} />
    <Sfx src="processing" at={SWAP + 200} volume={0.5} durationInFrames={260} />
    <Sfx src="ding" at={SWAP + 460} volume={0.5} />

    <CaptionTrack cues={CUES} />
  </SceneShell>
);

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "04 / 06",
  title: "Cut & Re-voice",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene4,
};
