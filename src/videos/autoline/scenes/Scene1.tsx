import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { BRAND } from "../brand";
import { appearUp, enter, leave, springPop } from "../../../shared-skills/anim";
import { SceneShell } from "../SceneShell";
import { Tooltip } from "../Tooltip";
import { CaptionTrack, Cue } from "../captions";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 510;
const SLASH = 224; // X begins to draw
const SLASH_END = 270;
const TITLE = 292; // title pops in

/* ----------------------------------------------------- messy editor window --- */

const MessyEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = springPop(frame, fps, { delay: 6, from: 0.92, dist: 18 });

  // fall apart as the X strikes through
  const fall = interpolate(frame, [SLASH_END - 6, 286], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = frame > 150 && frame < SLASH ? Math.sin(frame / 2.2) * 2 : 0;

  // frantic editing clock 00:00:00 → 02:00:00
  const secs = interpolate(frame, [12, 150], [0, 7200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hh = Math.floor(secs / 3600);
  const mm = Math.floor((secs % 3600) / 60);
  const ss = Math.floor(secs % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const maxed = frame >= 150;
  const flash = maxed ? 0.55 + 0.45 * Math.sin(frame / 4) : 1;

  const clips = new Array(13).fill(0);

  return (
    <div
      style={{
        opacity: intro.opacity * (1 - fall),
        transform: `${intro.transform} translateY(${fall * 40}px) translateX(${shake}px) scale(${1 - fall * 0.06})`,
        width: 860,
        borderRadius: RADIUS.lg,
        background: "#15171C",
        boxShadow: SHADOW.lg,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* titlebar */}
      <div
        style={{
          height: 42,
          background: "#1E2128",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 16px",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span
            key={c}
            style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
          />
        ))}
        <span
          style={{
            fontFamily: FONT.ui,
            fontSize: TYPE.tiny,
            color: "#C7CCD6",
            marginLeft: 8,
          }}
        >
          RawCut — manual edit
        </span>
        <span
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 11px",
            borderRadius: RADIUS.pill,
            background: `${COLORS.error}26`,
            color: COLORS.error,
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            fontWeight: 700,
            opacity: enter(frame, 70, 12),
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLORS.error,
            }}
          />
          re-record · take 7
        </span>
      </div>

      {/* preview area */}
      <div style={{ height: 300, position: "relative", background: "#0E1118" }}>
        {/* fake jittery edit graph */}
        <svg width={860} height={300} style={{ position: "absolute", inset: 0 }}>
          {new Array(40).fill(0).map((_, i) => (
            <rect
              key={i}
              x={20 + i * 21}
              y={150 - random(`g${i}`) * 110}
              width={11}
              height={random(`h${i}`) * 130 + 18}
              rx={3}
              fill={["#3a4a66", "#5a4566", "#664a3a"][i % 3]}
              opacity={0.5}
            />
          ))}
        </svg>

        {/* the editing clock */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: TYPE.small,
              fontWeight: 700,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            EDITING TIME
          </span>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -2,
              color: COLORS.error,
              opacity: flash,
              textShadow: `0 0 40px ${COLORS.error}99`,
            }}
          >
            {pad(hh)}:{pad(mm)}:{pad(ss)}
          </span>
        </div>
      </div>

      {/* the chaotic timeline */}
      <div style={{ background: "#0B0D11", padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", gap: 4, height: 34, marginBottom: 8 }}>
          {clips.map((_, i) => {
            const silence = i % 4 === 1 || i % 5 === 3;
            return (
              <div
                key={i}
                style={{
                  width: 22 + random(`c${i}`) * 78,
                  height: "100%",
                  borderRadius: 4,
                  background: silence ? `${COLORS.error}cc` : "#3C4A66",
                  border: silence ? `1px solid ${COLORS.error}` : "none",
                  opacity: 0.9,
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 4, height: 16 }}>
          {clips.map((_, i) => (
            <div
              key={i}
              style={{
                width: 16 + random(`a${i}`) * 64,
                height: "100%",
                borderRadius: 3,
                background: "#222A38",
              }}
            />
          ))}
        </div>
        {/* scrubbing red playhead */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${12 + ((frame * 1.6) % 80)}%`,
            width: 2,
            background: COLORS.error,
          }}
        />
      </div>

      {/* the giant X */}
      {frame >= SLASH ? <SlashX /> : null}
    </div>
  );
};

const SlashX: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame, [SLASH, SLASH + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p2 = interpolate(frame, [SLASH + 16, SLASH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg
      width={860}
      height={490}
      viewBox="0 0 860 490"
      style={{ position: "absolute", inset: 0 }}
    >
      {[
        { d: "M150 90 L710 400", p: p1 },
        { d: "M710 90 L150 400", p: p2 },
      ].map((s, i) => (
        <path
          key={i}
          d={s.d}
          stroke={COLORS.error}
          strokeWidth={26}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - s.p}
          style={{ filter: `drop-shadow(0 6px 20px ${COLORS.error}88)` }}
        />
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------- hero title --- */

const HeroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = springPop(frame, fps, { delay: TITLE, from: 0.8, dist: 16 });
  const l1 = springPop(frame, fps, { delay: TITLE + 6, from: 0.9, dist: 26 });
  const l2 = springPop(frame, fps, { delay: TITLE + 16, from: 0.9, dist: 26 });
  const tag = appearUp(frame, TITLE + 30, 16, 22);
  const underline = interpolate(frame, [TITLE + 24, TITLE + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ textAlign: "center", marginTop: -20 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 18px",
          borderRadius: RADIUS.pill,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.sm,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: TYPE.tiny,
          letterSpacing: 2,
          color: COLORS.muted,
          ...pill,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: COLORS.remotion,
          }}
        />
        ZERO-TOUCH PIPELINE · THE {BRAND.course}
      </div>

      <div
        style={{
          marginTop: 26,
          fontFamily: FONT.ui,
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1.02,
          letterSpacing: -3,
          color: COLORS.ink,
        }}
      >
        <div style={{ ...l1 }}>{BRAND.hero[0]}</div>
        <div style={{ ...l2 }}>
          <span
            style={{
              background: GRADIENT.remotion,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {BRAND.hero[1]}
          </span>
        </div>
      </div>

      <div
        style={{
          margin: "22px auto 0",
          height: 6,
          width: 120 * underline,
          borderRadius: 3,
          background: GRADIENT.remotion,
        }}
      />

      <div
        style={{
          marginTop: 22,
          fontFamily: FONT.ui,
          fontSize: TYPE.h3,
          fontWeight: 500,
          color: COLORS.muted,
          ...tag,
        }}
      >
        {BRAND.tagline}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ scene --- */

const CUES: Cue[] = [
  { id: "s1-c1", from: 6, dur: 132, text: "You recorded twenty minutes. Editing just ate two hours." },
  { id: "s1-c2", from: 140, dur: 146, text: "Trimming dead air, re-recording every stumble — that's not creating, it's burning your life." },
  { id: "s1-c3", from: 332, dur: 250, text: "What if you could build a fully automated video production line?" },
];

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const painGone = leave(frame, 282, 14); // editor fades; title takes over

  return (
    <SceneShell
      kicker="01 / 06"
      title="The Pain"
      accent={COLORS.error}
      durationInFrames={DUR}
      showChrome={false}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {frame < 300 ? (
          <div style={{ opacity: painGone === 0 ? 0 : 1 }}>
            <MessyEditor />
          </div>
        ) : (
          <HeroTitle />
        )}
      </AbsoluteFill>

      {/* knowledge card during the pain */}
      {frame < 296 ? (
        <Tooltip
          from={92}
          accent={COLORS.error}
          label="Pain Point: Manual Editing is Dead"
          sub="The bottleneck isn't recording — it's the timeline."
          style={{ left: 150, top: 196 }}
        />
      ) : null}

      {/* sound design, frame-aligned */}
      <Sfx src="pop" at={92} volume={0.4} />
      <Sfx src="whoosh" at={SLASH} volume={0.6} />
      <Sfx src="whoosh" at={SLASH + 16} volume={0.4} />
      <Sfx src="pop" at={TITLE} volume={0.5} />

      <CaptionTrack cues={CUES} />
    </SceneShell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "01 / 06",
  title: "The Pain",
  accent: COLORS.error,
  durationInFrames: DUR,
  Component: Scene1,
};
