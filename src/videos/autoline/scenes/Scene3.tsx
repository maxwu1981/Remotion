import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, TYPE } from "../../../shared-skills/theme";
import { springV } from "../../../shared-skills/anim";
import { SceneShell } from "../SceneShell";
import { CaptionTrack, Cue } from "../captions";
import { Sfx } from "../../../shared-skills/audio";
import {
  CoilSpring,
  GlassPanel,
  LightStream,
  Platform,
  Ruler,
  clamp01,
} from "../../../shared-skills/components/lux";
import {
  JsonDocLogo,
  NodeLogo,
  NpmLogo,
  OBSLogo,
  OpenAILogo,
  RemotionLogo,
} from "../../../shared-skills/components/logos";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 1255;
const FOCUS = [143, 360, 546, 816, 1007, 1227];

const CARD_W = 300;
const GAP = 28;
const COUNT = 5;
const ROW_W = CARD_W * COUNT + GAP * (COUNT - 1);
const X0 = (1920 - ROW_W) / 2;
const centerX = (i: number) => X0 + CARD_W / 2 + i * (CARD_W + GAP);
const FOOT_Y = 812;

type Tool = {
  name: string;
  lines: string[];
  accent: string;
  logo: React.ReactNode;
};

const TOOLS: Tool[] = [
  {
    name: "OBS Studio",
    lines: ["Free & Open-Source", "Recording Tool", "obsproject.com"],
    accent: COLORS.hi.sky,
    logo: <OBSLogo size={62} />,
  },
  {
    name: "Node.js & npm",
    lines: ["Automation Engine", "Install at nodejs.org"],
    accent: "#5A9E3C",
    logo: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NodeLogo size={58} />
        <NpmLogo height={22} />
      </div>
    ),
  },
  {
    name: "OpenAI API",
    lines: ["Whisper + GPT Brain", "+ Onyx TTS Voiceover"],
    accent: "#10A37F",
    logo: <OpenAILogo size={58} />,
  },
  {
    name: "Remotion",
    lines: ["Render Animated", "Videos via Code"],
    accent: COLORS.remotion,
    logo: <RemotionLogo size={60} />,
  },
  {
    name: "episode.json",
    lines: ["Video Config File", "Auto-written —", "no manual work!"],
    accent: COLORS.hi.amber,
    logo: <JsonDocLogo size={58} />,
  },
];

const Item: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = TOOLS[i];

  // drop in and bounce on the spring
  const land = springV(frame, fps, { delay: 10 + i * 12, damping: 9, stiffness: 110, mass: 1 });
  const drop = (1 - land) * -300;
  const dip = clamp01(Math.max(0, land - 1) * 3.4);

  // focus window
  const up = interpolate(frame, [FOCUS[i], FOCUS[i] + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const down = interpolate(frame, [FOCUS[i + 1] - 14, FOCUS[i + 1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const focus = Math.min(up, down);
  const phase = frame >= FOCUS[0] - 6 && frame < FOCUS[FOCUS.length - 1];

  const cardY = drop - 34 * focus;
  const opacity = clamp01(land * 1.3) * (phase ? 0.58 + 0.42 * focus : 1);

  return (
    <div
      style={{
        position: "absolute",
        left: centerX(i) - CARD_W / 2,
        top: 332,
        width: CARD_W,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ opacity, transform: `translateY(${cardY}px) scale(${1 + 0.05 * focus})`, transformOrigin: "center bottom" }}>
        <GlassPanel
          tint={t.accent}
          glow={t.accent}
          glowAmt={focus}
          radius={26}
          style={{ width: CARD_W, height: 348, padding: "30px 24px 26px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <div style={{ height: 78, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {t.logo}
            </div>
            <div
              style={{
                fontFamily: FONT.ui,
                fontWeight: 800,
                fontSize: 28,
                letterSpacing: -0.5,
                color: COLORS.ink,
                marginTop: 6,
                textAlign: "center",
              }}
            >
              {t.name}
            </div>
            <div style={{ width: 34, height: 3, borderRadius: 2, background: t.accent, margin: "12px 0 14px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5, textAlign: "center" }}>
              {t.lines.map((l, k) => (
                <div
                  key={k}
                  style={{
                    fontFamily: k === t.lines.length - 1 && /(\.com|\.org|!|nodejs)/.test(l) ? FONT.mono : FONT.ui,
                    fontSize: TYPE.small,
                    fontWeight: 500,
                    color: k >= 2 || /(\.com|\.org|!)/.test(l) ? COLORS.muted : COLORS.inkSoft,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>
      <CoilSpring width={96} coils={6} compress={dip} style={{ marginTop: -6, opacity }} />
    </div>
  );
};

const CUES: Cue[] = [
  { id: "s3-c0", from: 6, dur: 84, text: "Five tools run this entire factory — and most are free." },
  { id: "s3-c1", from: 143, dur: 258, text: "OBS Studio: your free, lossless recorder. Press record; the AI does the rest." },
  { id: "s3-c2", from: 360, dur: 258, text: "Node and npm — a tireless assistant that runs the whole pipeline from one command." },
  { id: "s3-c3", from: 546, dur: 282, text: "The OpenAI API: Whisper transcribes, GPT rewrites the rambling into gold, Onyx voices it." },
  { id: "s3-c4", from: 816, dur: 282, text: "Remotion: make video like you build a web page — animation, straight from code." },
  { id: "s3-c5", from: 1007, dur: 276, text: "And episode.json — the memory file the system writes for you. Titles, timings, done." },
];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell kicker="03 / 06" title="The Toolbox" accent={COLORS.remotion} durationInFrames={DUR}>
      <AbsoluteFill>
        {/* the stage */}
        <div style={{ position: "absolute", left: (1920 - 1640) / 2, top: 716, display: "flex", justifyContent: "center" }}>
          <Platform width={1640} depth={430} tilt={33} />
        </div>

        {/* flowing light along the base */}
        {[0, 1, 2, 3].map((i) => (
          <LightStream
            key={i}
            from={[centerX(i), FOOT_Y]}
            to={[centerX(i + 1), FOOT_Y]}
            ctrl={[(centerX(i) + centerX(i + 1)) / 2, FOOT_Y + 44]}
            progress={interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            color={COLORS.remotion}
            particles={3}
            speed={64}
            particleFrom={110}
          />
        ))}

        {/* cards on springs */}
        {TOOLS.map((_, i) => (
          <Item key={i} i={i} />
        ))}

        <Ruler
          width={1560}
          label="SEQUENCE 03  ·  THE CORE TOOLBOX"
          sublabel="Remotion spring physics"
          style={{ position: "absolute", left: (1920 - 1560) / 2, top: 902 }}
        />
      </AbsoluteFill>

      {FOCUS.slice(0, 5).map((f, i) => (
        <Sfx key={i} src="ding" at={f} volume={0.5} />
      ))}

      <CaptionTrack cues={CUES} />
    </SceneShell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "03 / 06",
  title: "The Toolbox",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene3,
};
