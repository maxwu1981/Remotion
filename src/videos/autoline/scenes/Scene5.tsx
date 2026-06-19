import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, leave, springPop } from "../../../shared-skills/anim";
import { SceneShell } from "../SceneShell";
import { Tooltip } from "../Tooltip";
import { CaptionTrack, Cue } from "../captions";
import { Sfx } from "../../../shared-skills/audio";
import {
  CodeBlock,
  FakeAppScreen,
  ReelsFrame,
  RingProgress,
  Terminal,
  VideoPlayerMock,
} from "../mockups";
import { CheckIcon, DocIcon } from "../mockups/icons";
import { ReelsLogo, YouTubeLogo } from "../../../shared-skills/components/logos";
import { EPISODE } from "../data/episode";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 990;
const ACT2 = 360;
const RENDER_START = 420;
const RENDER_END = 620;

const EPISODE_JSON = `{
  "title": "I Automated My Video Pipeline",
  "formats": ["16:9", "9:16"],
  "voice": "onyx",
  "highlights": [
    { "at": 36,  "label": "Silence cut" },
    { "at": 210, "label": "Re-voiced" },
    { "at": 720, "label": "Rendered" }
  ],
  "captions": 24,
  "manualEdits": 0
}`;

/* --------------------------------------------------------- act 1 · the json --- */

const JsonAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = leave(frame, ACT2 - 18, 18);
  const head = springPop(frame, fps, { delay: 8, from: 0.9, dist: 16 });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: op,
        paddingTop: 30,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 18px 10px 10px",
            borderRadius: RADIUS.pill,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.sm,
            ...head,
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: COLORS.hi.amber,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DocIcon size={18} color="#fff" />
          </span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>
            episode.json
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 11px",
              borderRadius: RADIUS.pill,
              background: `${COLORS.success}1A`,
              color: COLORS.success,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: TYPE.micro,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.success, opacity: 0.4 + 0.6 * Math.sin(frame / 5) ** 2 }} />
            WRITES ITSELF
          </span>
        </div>

        <CodeBlock
          code={EPISODE_JSON}
          language="json"
          filename="episode.json"
          startFrame={24}
          perLine={9}
          width={720}
          fontSize={TYPE.small}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- act 2 · the render --- */

const RenderAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = enter(frame, ACT2 - 6, 20);

  const progress = interpolate(frame, [RENDER_START, RENDER_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = frame >= RENDER_END;

  // ring lives during render, then yields to the previews
  const ringOp = leave(frame, RENDER_END + 4, 22);
  const ring = springPop(frame, fps, { delay: ACT2 + 30, from: 0.9, dist: 16 });

  const yt = enter(frame, RENDER_END + 6, 22);
  const reel = enter(frame, RENDER_END + 16, 22);
  const previewsIn = frame >= RENDER_END;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 168, display: "flex", justifyContent: "center" }}>
        <Terminal
          command="node render.mjs"
          prompt="autoline"
          title="zsh — autoline · render"
          startFrame={ACT2 + 12}
          width={620}
          minHeight={150}
          accent={COLORS.hi.emerald}
          output={[
            { text: "▸ bundling compositions…", at: RENDER_START + 20, color: COLORS.term.dim },
            { text: "▸ rendering  16:9  →  out/youtube.mp4", at: RENDER_START + 90, color: COLORS.term.blue },
            { text: "▸ rendering  9:16  →  out/reels.mp4", at: RENDER_START + 180, color: COLORS.term.blue },
            { text: "✓ done — 2 files written", at: RENDER_END, color: COLORS.term.green },
          ]}
        />
      </div>

      {/* the render ring */}
      {!done || ringOp > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: ringOp * ring.opacity,
            transform: ring.transform,
          }}
        >
          <RingProgress
            progress={progress}
            size={300}
            color={COLORS.hi.emerald}
            label="RENDERING"
            sublabel="both formats"
          />
        </div>
      ) : null}

      {/* the two finished cuts slide out */}
      {previewsIn ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 430,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 56,
          }}
        >
          <div style={{ opacity: yt, transform: `translateX(${(1 - yt) * -70}px)` }}>
            <PreviewTag logo={<YouTubeLogo size={22} />} label="YouTube · 16:9" />
            <VideoPlayerMock
              width={620}
              screen={<FakeAppScreen variant="art" seed="yt16" />}
              title={EPISODE.title}
              subtitle="auto-generated · onyx voice"
              showLowerThird
              highlights={EPISODE.highlights}
              duration={EPISODE.recordingDuration}
              showMarkers
              playhead={0.46}
              style={{ marginTop: 12 }}
            />
          </div>
          <div style={{ opacity: reel, transform: `translateX(${(1 - reel) * 70}px)` }}>
            <PreviewTag logo={<ReelsLogo size={20} />} label="Reels · 9:16" />
            <ReelsFrame width={232} caption="@autoline" style={{ marginTop: 12 }}>
              <FakeAppScreen variant="art" seed="reel9" />
            </ReelsFrame>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const PreviewTag: React.FC<{ logo: React.ReactNode; label: string }> = ({ logo, label }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      padding: "6px 14px",
      borderRadius: RADIUS.pill,
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      boxShadow: SHADOW.sm,
      fontFamily: FONT.ui,
      fontWeight: 700,
      fontSize: TYPE.small,
      color: COLORS.ink,
    }}
  >
    {logo}
    {label}
    <CheckIcon size={16} color={COLORS.success} />
  </div>
);

/* ------------------------------------------------------------------ scene --- */

const CUES: Cue[] = [
  { id: "s5-c1", from: 12, dur: 226, text: "Now the system writes episode.json itself — every title and timestamp." },
  { id: "s5-c2", from: 193, dur: 200, text: "One file describes the entire video. Zero manual input." },
  { id: "s5-c3", from: ACT2 + 12, dur: 330, text: "Then one command — node render.mjs." },
  { id: "s5-c4", from: RENDER_END + 14, dur: 272, text: "It packages a 16:9 cut for YouTube and a 9:16 cut for Reels." },
  { id: "s5-c5", from: RENDER_END + 208, dur: 160, text: "Go make a cup of tea. Your video is done." },
];

export const Scene5: React.FC = () => (
  <SceneShell kicker="05 / 06" title="Package & Render" accent={COLORS.hi.emerald} durationInFrames={DUR}>
    <JsonAct />
    <RenderAct />

    <Tooltip
      from={RENDER_END + 40}
      accent={COLORS.hi.emerald}
      label="Write once, render anywhere"
      sub="Same code → every aspect ratio."
      style={{ left: 760, top: 250 }}
    />

    {/* sound design */}
    <Sfx src="typing" at={24} volume={0.45} durationInFrames={210} />
    <Sfx src="typing" at={ACT2 + 12} volume={0.5} />
    <Sfx src="processing" at={RENDER_START + 16} volume={0.4} durationInFrames={260} />
    <Sfx src="ding" at={RENDER_END} volume={0.5} />
    <Sfx src="whoosh" at={RENDER_END + 6} volume={0.5} />
    <Sfx src="whoosh" at={RENDER_END + 16} volume={0.35} />

    <CaptionTrack cues={CUES} />
  </SceneShell>
);

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "05 / 06",
  title: "Package & Render",
  accent: COLORS.hi.emerald,
  durationInFrames: DUR,
  Component: Scene5,
};
