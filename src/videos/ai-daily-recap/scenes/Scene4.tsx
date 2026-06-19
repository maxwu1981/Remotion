import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, enter } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { CodeBlock } from "../mockups/CodeBlock";
import { VideoPlayerMock } from "../mockups/VideoPlayerMock";
import { FakeAppScreen } from "../mockups/windows";
import { Connector } from "../mockups/Connector";
import { ArrowIcon } from "../mockups/icons";
import { EPISODE } from "../data/episode";

const IDS = ["s4-c1", "s4-c2", "s4-c3", "s4-c4", "s4-c5", "s4-c6"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.hi.amber;

const EPISODE_JSON = `{
  "title": "峻清書畫 × AI 自動發文",
  "subtitle": "上傳畫作 → 中英文案 → 排程",
  "highlights": [
    { "atSecond": 40,  "label": "畫作上傳" },
    { "atSecond": 180, "label": "AI 文案" },
    { "atSecond": 360, "label": "中英雙語" }
  ],
  "captions": [
    { "atSecond": 0, "text": "今天上傳老師的新作" }
  ],
  "stats": { "語音": "19 段", "長度": "約 10 分鐘" }
}`;

const MAP: Record<number, { k: string; v: string; lines: number[] }> = {
  1: { k: "title · subtitle", v: "左下角 · 標題字卡", lines: [1, 2] },
  2: { k: "highlights[ ]", v: "進度條 · 彩色標記", lines: [3, 4, 5, 6, 7] },
  3: { k: "captions[ ]", v: "畫面下方 · 字幕", lines: [8, 9, 10] },
  4: { k: "stats", v: "片尾 · 數據總結卡", lines: [11] },
};

const EndStats: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30, color: "#fff" }}>本集數據</div>
    <div style={{ display: "flex", gap: 30 }}>
      {EPISODE.stats.map((s) => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 26, color: ACCENT }}>{s.value}</div>
          <div style={{ fontFamily: FONT.uiCjk, fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const b = frame >= at(5) ? 5 : frame >= at(4) ? 4 : frame >= at(3) ? 3 : frame >= at(2) ? 2 : frame >= at(1) ? 1 : 0;

  const codeIn = appearUp(frame, at(0), 16, 22);
  const playerIn = appearUp(frame, at(0) + 8, 16, 22);
  const activeLines = MAP[b]?.lines ?? [];

  const showLT = b >= 1;
  const showMk = b >= 2;
  const showCap = b === 3 || b >= 5;
  const showEnd = b === 4;
  const ltProg = enter(frame, at(1), 14);

  const link = enter(frame, at(1), 20);

  const m = MAP[b];

  return (
    <SceneShell kicker="04 / 09" title="episode.json 結構" accent={ACCENT} durationInFrames={DUR}>
      {/* left · the schema */}
      <div style={{ position: "absolute", left: 96, top: 250, ...codeIn }}>
        <CodeBlock
          code={EPISODE_JSON}
          language="json"
          filename="episode.json"
          startFrame={at(0) + 6}
          perLine={4}
          width={668}
          activeLines={activeLines}
          activeColor={ACCENT}
        />
      </div>

      {/* flow arrow between panels */}
      <Connector from={[770, 486]} to={[1024, 486]} progress={link} color={COLORS.borderStrong} />

      {/* mapping label riding above the player */}
      {m ? (
        <div style={{ position: "absolute", left: 1024, right: 96, top: 250, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 20px",
              borderRadius: RADIUS.pill,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: SHADOW.md,
            }}
          >
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: ACCENT }}>{m.k}</span>
            <ArrowIcon size={20} color={COLORS.faint} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{m.v}</span>
          </div>
        </div>
      ) : b >= 5 ? (
        <div style={{ position: "absolute", left: 1024, right: 96, top: 250, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, textAlign: "center" }}>
            改一個檔案，整支影片<span style={{ color: ACCENT }}>跟著變</span>
          </div>
        </div>
      ) : null}

      {/* right · the player it drives */}
      <div style={{ position: "absolute", left: 1024, top: 330, ...playerIn }}>
        <VideoPlayerMock
          width={772}
          screen={<FakeAppScreen variant="art" seed="s4-player" />}
          title={EPISODE.title}
          subtitle={EPISODE.subtitle}
          showLowerThird={showLT}
          lowerThirdProgress={ltProg}
          highlights={EPISODE.highlights}
          duration={EPISODE.recordingDuration}
          showMarkers={showMk}
          markerLabels={showMk}
          caption={EPISODE.captions[0]?.text}
          showCaption={showCap}
          playhead={0.46}
          endCard={<EndStats />}
          showEndCard={showEnd}
        />
      </div>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "04 / 09",
  title: "episode.json 結構",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene4,
};
