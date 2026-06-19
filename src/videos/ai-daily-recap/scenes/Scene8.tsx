import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { VideoPlayerMock } from "../mockups/VideoPlayerMock";
import { FakeAppScreen } from "../mockups/windows";
import { ArrowIcon, CalendarIcon, FacebookIcon, ImageIcon, TranslateIcon } from "../mockups/icons";
import { EPISODE } from "../data/episode";

const IDS = ["s8-c1", "s8-c2", "s8-c3", "s8-c4", "s8-c5", "s8-c6"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.teal;

const BOARD = [
  { icon: <ImageIcon size={26} color="#fff" />, color: COLORS.hi.sky, label: "上傳畫作", sub: "一張作品丟進資料夾" },
  { icon: <TranslateIcon size={26} color="#fff" />, color: COLORS.hi.violet, label: "AI 中英雙語文案", sub: "Claude 讀圖，寫中＋英貼文" },
  { icon: <FacebookIcon size={30} />, color: "#1877F2", label: "排程發佈 Facebook", sub: "自動帶連結，一鍵排程", extra: <CalendarIcon size={22} color="#1877F2" /> },
];

const BoardStep: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const s = BOARD[i];
  return (
    <div style={{ ...appearUp(frame, at(2 + i), 16, 24) }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          width: 880,
          padding: "20px 24px",
          borderRadius: RADIUS.lg,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.md,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            flexShrink: 0,
            borderRadius: 15,
            background: s.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 20px ${s.color}55`,
          }}
        >
          {s.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, color: s.color }}>{`第 ${i + 1} 幕`}</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{s.label}</span>
            {s.extra}
          </div>
          <div style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.muted, marginTop: 4 }}>{s.sub}</div>
        </div>
      </div>
    </div>
  );
};

const DownArrow: React.FC<{ show: number }> = ({ show }) => {
  const frame = useCurrentFrame();
  const o = appearUp(frame, show, 10, 8).opacity;
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 28, opacity: o }}>
      <div style={{ transform: "rotate(90deg)" }}>
        <ArrowIcon size={22} color={COLORS.faint} strokeWidth={2.4} />
      </div>
    </div>
  );
};

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const playerIn = appearUp(frame, at(0), 16, 24);
  const ribbon = springPop(frame, fps, { delay: at(0) + 8, from: 0.7, dist: 12 });
  const badge = springPop(frame, fps, { delay: at(5), from: 0.7, dist: 16 });

  return (
    <SceneShell kicker="08 / 09" title="首集實錄 · Day 001" accent={ACCENT} durationInFrames={DUR}>
      {/* left · finished episode player */}
      <div style={{ position: "absolute", left: 96, top: 300, ...playerIn }}>
        <div style={{ position: "relative", width: 720 }}>
          <VideoPlayerMock
            width={720}
            screen={<FakeAppScreen variant="art" seed="s8-ep" />}
            title={EPISODE.title}
            subtitle={`${EPISODE.date} · onyx 自動配音`}
            showLowerThird
            highlights={EPISODE.highlights}
            duration={EPISODE.recordingDuration}
            showMarkers
            markerLabels
            playhead={0.46}
          />
          {/* Day 001 ribbon */}
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 18,
              padding: "8px 16px",
              borderRadius: RADIUS.pill,
              background: "rgba(31,199,212,0.95)",
              color: "#06303a",
              fontFamily: FONT.mono,
              fontWeight: 800,
              fontSize: TYPE.tiny,
              letterSpacing: 0.5,
              boxShadow: SHADOW.md,
              opacity: ribbon.opacity,
              transform: ribbon.transform,
            }}
          >
            Day 001 · {EPISODE.date}
          </div>
        </div>

        {/* badge */}
        <div style={{ marginTop: 22, display: "flex", gap: 14, opacity: badge.opacity, transform: badge.transform }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 22px",
              borderRadius: RADIUS.lg,
              background: `linear-gradient(135deg, ${ACCENT}, ${COLORS.remotion})`,
              color: "#fff",
              boxShadow: SHADOW.glow(ACCENT),
            }}
          >
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 40 }}>19</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, lineHeight: 1.2 }}>
              段自動語音
              <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: TYPE.small, opacity: 0.9 }}>約 10 分鐘 · 0 手動剪輯</div>
            </span>
          </div>
        </div>
      </div>

      {/* right · the 3-act storyboard */}
      <div style={{ position: "absolute", left: 872, top: 264 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, letterSpacing: 2, color: COLORS.muted, marginBottom: 16 }}>
          STORYBOARD · 三幕流程
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <BoardStep i={0} />
          <DownArrow show={at(3)} />
          <BoardStep i={1} />
          <DownArrow show={at(4)} />
          <BoardStep i={2} />
        </div>
      </div>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene8: SceneDef = {
  id: "s8",
  index: 8,
  kicker: "08 / 09",
  title: "首集實錄 · Day 001",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene8,
};
