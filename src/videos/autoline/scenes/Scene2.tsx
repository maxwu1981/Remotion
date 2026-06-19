import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { SceneShell } from "../SceneShell";
import { CaptionTrack, Cue } from "../captions";
import { Sfx } from "../../../shared-skills/audio";
import { ArrowLink, GlassPanel } from "../../../shared-skills/components/lux";
import {
  JsonDocLogo,
  NodeLogo,
  NpmLogo,
  OpenAILogo,
  RecordLogo,
  ReelsLogo,
  RemotionLogo,
  YouTubeLogo,
} from "../../../shared-skills/components/logos";
import { FolderIcon } from "../mockups/icons";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 650;

/* ------------------------------------------------------------- node card --- */

const NodeBox: React.FC<{
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  step?: string;
  name: string;
  logo: React.ReactNode;
  delay: number;
  accent?: string;
}> = ({ cx, cy, w = 212, h = 92, step, name, logo, delay, accent = COLORS.remotion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springPop(frame, fps, { delay, from: 0.8, dist: 18 });
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, ...s }}>
      <GlassPanel radius={16} glow={accent} glowAmt={0.12} style={{ width: w, height: h, padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, height: "100%" }}>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{logo}</div>
          <div style={{ lineHeight: 1.22 }}>
            {step ? (
              <div style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: accent }}>
                {step}
              </div>
            ) : null}
            <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>
              {name}
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

/* ------------------------------------------------------------- positions --- */

const P = {
  record: [1108, 248],
  node: [1108, 432],
  openai: [560, 432],
  audio: [352, 664],
  json: [650, 664],
  assets: [968, 706],
  remotion: [1330, 706],
  youtube: [1690, 556],
  reels: [1690, 826],
} as const;

const ARROWS: { from: [number, number]; to: [number, number]; ctrl?: [number, number]; start: number }[] = [
  { from: [1108, 296], to: [1108, 388], start: 30 },
  { from: [1002, 432], to: [668, 432], start: 110 },
  { from: [500, 478], to: [378, 620], ctrl: [400, 562], start: 272 },
  { from: [612, 478], to: [648, 620], ctrl: [616, 560], start: 288 },
  { from: [458, 676], to: [862, 704], ctrl: [660, 724], start: 352 },
  { from: [756, 672], to: [864, 700], ctrl: [812, 698], start: 362 },
  { from: [1074, 706], to: [1222, 706], start: 422 },
  { from: [1438, 682], to: [1602, 568], ctrl: [1548, 604], start: 470 },
  { from: [1438, 730], to: [1602, 814], ctrl: [1548, 782], start: 486 },
];

const ArrowFlow: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const a = ARROWS[i];
  const progress = interpolate(frame, [a.start, a.start + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <ArrowLink from={a.from} to={a.to} ctrl={a.ctrl} progress={progress} color={COLORS.remotion} />;
};

const ArrowLabel: React.FC<{ x: number; y: number; from: number; children: React.ReactNode }> = ({ x, y, from, children }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, from, 12, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 200,
        textAlign: "center",
        fontFamily: FONT.ui,
        fontSize: TYPE.tiny,
        fontWeight: 600,
        color: COLORS.muted,
        ...a,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ cues --- */

const CUES: Cue[] = [
  { id: "s2-c1", from: 8, dur: 150, text: "Here's the whole machine — a zero-touch automation factory." },
  { id: "s2-c2", from: 145, dur: 196, text: "Record your raw footage, drop it in a folder, and the system takes over." },
  { id: "s2-c3", from: 302, dur: 188, text: "It cuts the dead air, rewrites the script, and voices it with AI…" },
  { id: "s2-c4", from: 455, dur: 162, text: "…then renders a landscape and a vertical cut. Untouched by human hands." },
];

export const Scene2: React.FC = () => (
  <SceneShell kicker="02 / 06" title="Workflow Overview" accent={COLORS.remotion} durationInFrames={DUR}>
    <AbsoluteFill>
      {ARROWS.map((_, i) => (
        <ArrowFlow key={i} i={i} />
      ))}

      <NodeBox cx={P.record[0]} cy={P.record[1]} step="STEP 1" name="Record" delay={8} accent={COLORS.claude} logo={<RecordLogo size={34} />} />
      <NodeBox cx={P.node[0]} cy={P.node[1]} w={224} step="STEP 2" name="Node script" delay={44} accent="#5A9E3C"
        logo={<div style={{ display: "flex", alignItems: "center", gap: 7 }}><NodeLogo size={30} /><NpmLogo height={14} /></div>} />
      <NodeBox cx={P.openai[0]} cy={P.openai[1]} w={246} step="STEP 2A" name="OpenAI · Whisper→GPT" delay={124} accent="#10A37F" logo={<OpenAILogo size={32} />} />
      <NodeBox cx={P.audio[0]} cy={P.audio[1]} w={196} name="voice.mp3" delay={284} accent="#10A37F" logo={<OpenAILogo size={30} />} />
      <NodeBox cx={P.json[0]} cy={P.json[1]} w={196} name="episode.json" delay={300} accent={COLORS.hi.amber} logo={<JsonDocLogo size={30} />} />
      <NodeBox cx={P.assets[0]} cy={P.assets[1]} w={196} step="STEP 3" name="Asset package" delay={366} accent={COLORS.muted}
        logo={<FolderIcon size={32} color="#2B3A55" />} />
      <NodeBox cx={P.remotion[0]} cy={P.remotion[1]} w={196} step="STEP 4" name="Remotion" delay={434} accent={COLORS.remotion} logo={<RemotionLogo size={34} />} />
      <NodeBox cx={P.youtube[0]} cy={P.youtube[1]} w={184} step="STEP 5" name="YouTube" delay={478} accent={COLORS.error} logo={<YouTubeLogo size={30} />} />
      <NodeBox cx={P.reels[0]} cy={P.reels[1]} w={184} step="STEP 5" name="Reels / Shorts" delay={492} accent={COLORS.hi.violet} logo={<ReelsLogo size={28} />} />

      <ArrowLabel x={236} y={556} from={300}>Refined audio · Onyx TTS</ArrowLabel>
      <ArrowLabel x={612} y={548} from={316}>Auto-writes text &amp; timings</ArrowLabel>
    </AbsoluteFill>

    {/* whoosh on each stage drawing */}
    <Sfx src="whoosh" at={30} volume={0.45} />
    <Sfx src="whoosh" at={110} volume={0.4} />
    <Sfx src="whoosh" at={352} volume={0.4} />
    <Sfx src="whoosh" at={422} volume={0.4} />
    <Sfx src="whoosh" at={470} volume={0.4} />

    <CaptionTrack cues={CUES} />
  </SceneShell>
);

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "02 / 06",
  title: "Workflow Overview",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene2,
};
