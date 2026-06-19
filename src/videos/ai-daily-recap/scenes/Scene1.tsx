import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearScale, appearUp, springPop } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { Tooltip } from "../Tooltip";
import { buildScene, Captions } from "../captions";
import { AppWindow, FakeAppScreen, ReelsFrame } from "../mockups/windows";
import { VideoPlayerMock } from "../mockups/VideoPlayerMock";
import { Connector } from "../mockups/Connector";
import { FileBadge } from "../mockups/nodes";
import { MicIcon } from "../mockups/icons";
import { JsonDocLogo, ReelsLogo, YouTubeLogo } from "../../../shared-skills/components/logos";
import { EPISODE } from "../data/episode";

const IDS = ["s1-c1", "s1-c2", "s1-c3", "s1-c4", "s1-c5", "s1-c6", "s1-c7"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.remotion;

/** A small monospace stage label sitting above each pipeline column. */
const ColLabel: React.FC<{ n: string; text: string; color: string; left: number; top: number; show: number }> = ({
  n,
  text,
  color,
  left,
  top,
  show,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top, ...appearUp(frame, show, 14, 16) }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: color,
            color: "#fff",
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: TYPE.small,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {n}
        </span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink }}>{text}</span>
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sub = appearUp(frame, at(0), 16, 22);
  const rec = appearScale(frame, at(2), 18, 0.9);
  const cap = appearUp(frame, at(2) + 10, 14, 18);
  const jsn = springPop(frame, fps, { delay: at(4), from: 0.7, dist: 18 });
  const out = appearScale(frame, at(3), 18, 0.92);
  const files = appearUp(frame, at(5), 16, 20);

  const link1 = interpolate(frame, [at(4) + 6, at(4) + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const link2 = interpolate(frame, [at(4) + 22, at(4) + 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneShell kicker="01 / 09" title="專案目標" accent={ACCENT} durationInFrames={DUR}>
      {/* in-stage subheading */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink }}>
          從<span style={{ color: ACCENT }}>一次錄製</span>，到<span style={{ color: COLORS.teal }}>兩支成品</span>
        </span>
      </div>

      {/* connectors behind the columns */}
      <Connector from={[612, 560]} to={[846, 560]} progress={link1} color={COLORS.borderStrong} curve={0} />
      <Connector from={[1074, 560]} to={[1190, 560]} progress={link2} color={COLORS.borderStrong} curve={0} />

      {/* ── column 1 · manual recording ─────────────────────────── */}
      <ColLabel n="1" text="錄製 · 手動" color={COLORS.hi.sky} left={170} top={262} show={at(2) - 6} />
      <div style={{ position: "absolute", left: 170, top: 318, ...rec }}>
        <AppWindow title="OBS Studio" width={442} height={250} accent={COLORS.error} badge="● REC">
          <FakeAppScreen variant="editor" seed="s1-obs" />
        </AppWindow>
      </div>
      <div style={{ position: "absolute", left: 196, top: 596, ...cap }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 13,
            padding: "13px 20px",
            borderRadius: RADIUS.md,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.md,
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#111317",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT.mono,
              fontWeight: 800,
              color: "#fff",
              fontSize: TYPE.body,
            }}
          >
            C
          </span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>CapCut</div>
            <div style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.micro, color: COLORS.muted }}>手動配音</div>
          </div>
          <span style={{ width: 1, height: 34, background: COLORS.border }} />
          <MicIcon size={26} color={COLORS.error} />
        </div>
      </div>

      {/* ── column 2 · episode.json (the core) ──────────────────── */}
      <ColLabel n="2" text="episode.json" color={COLORS.hi.amber} left={840} top={262} show={at(4) - 6} />
      <div
        style={{
          position: "absolute",
          left: 838,
          top: 430,
          width: 244,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: jsn.opacity,
          transform: jsn.transform,
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: RADIUS.lg,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.glow(COLORS.hi.amber),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <JsonDocLogo size={86} color={COLORS.hi.amber} />
        </div>
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>
          episode.json
        </span>
        <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.micro, color: COLORS.muted, textAlign: "center" }}>
          影片的設定檔 · 自動寫入
        </span>
      </div>

      {/* ── column 3 · Remotion dual-format output ──────────────── */}
      <ColLabel n="3" text="Remotion 雙格式輸出" color={ACCENT} left={1192} top={262} show={at(3) - 6} />
      <div style={{ position: "absolute", left: 1192, top: 330, display: "flex", alignItems: "flex-start", gap: 22, ...out }}>
        <div>
          <FormatTag logo={<YouTubeLogo size={20} />} label="16:9 · YouTube" />
          <VideoPlayerMock
            width={372}
            screen={<FakeAppScreen variant="art" seed="s1-yt" />}
            title={EPISODE.title}
            subtitle="onyx 自動配音"
            showLowerThird
            playhead={0.42}
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <FormatTag logo={<ReelsLogo size={18} />} label="9:16 · Reels" />
          <ReelsFrame width={124} caption="@ai-daily-recap" style={{ marginTop: 10 }}>
            <FakeAppScreen variant="art" seed="s1-reel" />
          </ReelsFrame>
        </div>
      </div>

      {/* the two finished files */}
      <div style={{ position: "absolute", left: 1218, top: 642, display: "flex", gap: 40, ...files }}>
        <FileBadge name="day-001.mp4" size={50} />
        <FileBadge name="day-001-reels.mp4" size={50} />
      </div>

      {/* payoff callout */}
      <Tooltip
        from={at(6)}
        accent={COLORS.success}
        label="唯一的手動步驟：錄製"
        sub="其餘全部交給流水線"
        width={330}
        origin="center bottom"
        style={{ left: 256, top: 760 }}
      />

      <Captions cues={CUES} />
    </SceneShell>
  );
};

const FormatTag: React.FC<{ logo: React.ReactNode; label: string }> = ({ logo, label }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 13px",
      borderRadius: RADIUS.pill,
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      boxShadow: SHADOW.sm,
      fontFamily: FONT.ui,
      fontWeight: 700,
      fontSize: TYPE.tiny,
      color: COLORS.ink,
    }}
  >
    {logo}
    {label}
  </div>
);

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "01 / 09",
  title: "專案目標",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene1,
};
