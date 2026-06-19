import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { BRAND } from "../brand";
import { appearUp, enter, springPop } from "../../../shared-skills/anim";
import { SceneShell } from "../SceneShell";
import { CaptionTrack, Cue } from "../captions";
import { Sfx } from "../../../shared-skills/audio";
import { CheckIcon } from "../mockups/icons";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 640;

const money = (n: number) => `$${n.toFixed(2)}`;

const Row: React.FC<{
  delay: number;
  label: string;
  sub: string;
  value: React.ReactNode;
  valueColor: string;
  tag?: string;
}> = ({ delay, label, sub, value, valueColor, tag }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ ...a }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.body, color: COLORS.inkSoft }}>{label}</span>
        <span
          style={{
            flex: 1,
            borderBottom: `2px dotted ${COLORS.borderStrong}`,
            transform: "translateY(-6px)",
          }}
        />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {tag ? (
            <span
              style={{
                padding: "3px 9px",
                borderRadius: RADIUS.pill,
                background: `${valueColor}1A`,
                color: valueColor,
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: TYPE.micro,
              }}
            >
              {tag}
            </span>
          ) : null}
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.h3, color: valueColor }}>
            {value}
          </span>
        </span>
      </div>
      <div style={{ fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.faint, marginTop: 2 }}>{sub}</div>
    </div>
  );
};

const Receipt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 10, from: 0.9, dist: 22 });
  const cloud = interpolate(frame, [140, 200], [0, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const totalIn = enter(frame, 232, 14);

  return (
    <div
      style={{
        width: 620,
        padding: "30px 34px 34px",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.lg,
        ...card,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.body, letterSpacing: 3, color: COLORS.ink }}>
          DIGITAL RECEIPT
        </span>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: COLORS.muted }}>episode #014</span>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: COLORS.faint, marginTop: 4 }}>
        AutoLine pipeline · 2026-06-03
      </div>

      <div
        style={{
          margin: "20px 0",
          borderTop: `2px dashed ${COLORS.border}`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Row
          delay={66}
          label="Local Compute"
          sub="editing + rendering · on your machine"
          value={money(0)}
          valueColor={COLORS.success}
          tag="FREE"
        />
        <Row
          delay={128}
          label="Cloud AI"
          sub="16 min re-voice · whisper + gpt + onyx"
          value={`~${money(cloud)}`}
          valueColor={COLORS.remotion}
          tag="$0.50–$1.00"
        />
      </div>

      <div style={{ margin: "20px 0", borderTop: `2px solid ${COLORS.borderStrong}` }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: totalIn,
          transform: `translateY(${(1 - totalIn) * 10}px)`,
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>TOTAL</span>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.success }}>
          &lt; $1.00
        </span>
      </div>
    </div>
  );
};

const Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = springPop(frame, fps, { delay: 300, from: 0.82, dist: 18 });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 700,
        display: "flex",
        justifyContent: "center",
        ...a,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 22,
          padding: "16px 30px",
          borderRadius: RADIUS.pill,
          background: GRADIENT.ink,
          boxShadow: SHADOW.lg,
          color: "#fff",
          fontFamily: FONT.ui,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: TYPE.body }}>
          <span style={{ fontSize: 24 }}>🕐</span> Time Saved:&nbsp;<b>2 Hours</b>
        </span>
        <span style={{ width: 1, height: 26, background: "rgba(255,255,255,0.25)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: TYPE.body }}>
          <span style={{ fontSize: 24 }}>☕</span> Cost:&nbsp;<b style={{ color: COLORS.teal }}>&lt; 1 Cup of Coffee</b>
        </span>
      </div>
    </div>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, 430, 16, 20);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 800,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        ...a,
      }}
    >
      <div style={{ fontFamily: FONT.ui, fontSize: TYPE.h3, fontWeight: 800, color: COLORS.ink }}>
        Build your first automated line today.
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 20px",
          borderRadius: RADIUS.pill,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.sm,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: TYPE.small,
          color: COLORS.inkSoft,
        }}
      >
        <CheckIcon size={18} color={COLORS.success} />
        {BRAND.pre}
        <span style={{ color: COLORS.remotion }}>{BRAND.post}</span>
        <span style={{ color: COLORS.faint }}>·</span>
        Record once. Ship everywhere.
      </div>
    </div>
  );
};

const CUES: Cue[] = [
  { id: "s6-c1", from: 12, dur: 226, text: "Last, the bill. Editing and rendering run free, on your own machine." },
  { id: "s6-c2", from: 182, dur: 210, text: "Re-voicing sixteen minutes of audio? Under one dollar." },
  { id: "s6-c3", from: 322, dur: 232, text: "Two hours of your life back — for less than a cup of coffee." },
  { id: "s6-c4", from: 452, dur: 142, text: "So what are you waiting for? Go build your first automated line." },
];

export const Scene6: React.FC = () => (
  <SceneShell kicker="06 / 06" title="The ROI" accent={COLORS.success} durationInFrames={DUR}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: "translateY(-78px)" }}>
        <Receipt />
      </div>
    </AbsoluteFill>
    <Summary />
    <Cta />

    {/* sound design */}
    <Sfx src="pop" at={10} volume={0.4} />
    <Sfx src="ding" at={66} volume={0.4} />
    <Sfx src="ding" at={128} volume={0.4} />
    <Sfx src="cash" at={300} volume={0.7} />
    <Sfx src="pop" at={430} volume={0.4} />

    <CaptionTrack cues={CUES} />
  </SceneShell>
);

export const scene6: SceneDef = {
  id: "s6",
  index: 6,
  kicker: "06 / 06",
  title: "The ROI",
  accent: COLORS.success,
  durationInFrames: DUR,
  Component: Scene6,
};
