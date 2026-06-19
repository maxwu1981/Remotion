import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, Stamp, KeyLine, ramp } from "../components";
import { DeviceToken, Cloud } from "../motifs";
import { MEMORY_ROWS, S1_DEVICES, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s1-c1", "s1-c2", "s1-c3", "s1-c4", "s1-c5", "s1-c6", "s1-c7"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** Row 1 centre: three devices converge into one glowing session cloud. */
const Converge: React.FC<{ p: number }> = ({ p }) => {
  const frame = useCurrentFrame();
  const drawn = ramp(p, 0, 1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {S1_DEVICES.map((d, i) => (
          <div key={d.zh} style={{ ...appearUp(frame, at(3) + i * 4, 12, 12) }}>
            <DeviceToken emoji={d.emoji} label={d.zh} size={58} color={MOTIF.phone} />
          </div>
        ))}
      </div>
      <svg width={130} height={210} style={{ overflow: "visible" }}>
        {[40, 105, 170].map((y, i) => (
          <path
            key={y}
            d={`M 4 ${y} Q 70 ${y} 124 105`}
            fill="none"
            stroke={MOTIF.phone}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={200}
            strokeDashoffset={200 * (1 - ramp(p, i * 0.12, 0.6 + i * 0.12))}
            opacity={0.7}
          />
        ))}
        {drawn > 0.9
          ? new Array(3).fill(0).map((_, i) => {
              const t = (((frame / 38 + i / 3) % 1) + 1) % 1;
              return <circle key={i} cx={4 + 120 * t} cy={105 + Math.sin((1 - t) * 1.2) * 0} r={3.5} fill={MOTIF.phone} opacity={Math.sin(Math.PI * t)} />;
            })
          : null}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: ramp(p, 0.5, 1), transform: `scale(${0.8 + 0.2 * ramp(p, 0.5, 1)})` }}>
        <div style={{ position: "relative", width: 130, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cloud w={130} color={MOTIF.cloud} glow={0.5} />
          <span style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 36 }}>🧠</span>
        </div>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: MOTIF.cloud }}>同一個 session</span>
      </div>
    </div>
  );
};

/** Row 2 centre: phone files | barrier | container files — fully isolated. */
const FileBox: React.FC<{ emoji: string; label: string; color: string; delay: number }> = ({ emoji, label, color, delay }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...appearUp(frame, delay, 12, 16), display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 190, padding: "14px 10px", borderRadius: RADIUS.md, background: COLORS.surface, border: `1.5px solid ${color}44`, boxShadow: SHADOW.sm }}>
      <span style={{ fontSize: 40 }}>{emoji}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.inkSoft, textAlign: "center" }}>{label}</span>
    </div>
  );
};

const Barrier: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <FileBox emoji="📱" label="手機本機檔案" color={MOTIF.phone} delay={at(6)} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: ramp(p, 0.2, 0.8) }}>
      <span style={{ fontSize: 38 }}>🚫</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.tiny, color: PAL.no }}>完全隔離</span>
    </div>
    <FileBox emoji="🖥" label="容器檔案" color={MOTIF.cloud} delay={at(6) + 6} />
  </div>
);

const RowPanel: React.FC<{
  reveal: { opacity: number; transform: string };
  zh: string;
  en: string;
  stamp: React.ReactNode;
  children: React.ReactNode;
}> = ({ reveal, zh, en, stamp, children }) => (
  <div style={{ ...reveal, width: 1560, display: "flex", alignItems: "center", gap: 28, padding: "22px 34px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg }}>
    <div style={{ width: 360, flexShrink: 0 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.2 }}>{zh}</div>
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.tiny, color: COLORS.faint }}>{en}</div>
    </div>
    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>{children}</div>
    <div style={{ width: 220, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>{stamp}</div>
  </div>
);

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const rowA = appearUp(frame, at(2), 16, 22);
  const rowB = appearUp(frame, at(5), 16, 22);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.cloud} kicker="01 · 共享記憶嗎？" seed="s1">
      <div style={{ position: "absolute", left: 0, right: 0, top: 128, display: "flex", justifyContent: "center" }}>
        <Heading zh="手機與遠端電腦，「共享記憶」嗎？" en="Two kinds of memory — opposite answers" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <RowPanel
          reveal={rowA}
          zh={MEMORY_ROWS[0].zh}
          en={MEMORY_ROWS[0].en}
          stamp={<Stamp kind="yes" text={MEMORY_ROWS[0].badge} at={at(3)} />}
        >
          <Converge p={ramp(frame, at(3), at(4))} />
        </RowPanel>

        <RowPanel
          reveal={rowB}
          zh={MEMORY_ROWS[1].zh}
          en={MEMORY_ROWS[1].en}
          stamp={<Stamp kind="no" text={MEMORY_ROWS[1].badge} at={at(6)} />}
        >
          <Barrier p={ramp(frame, at(6), at(6) + 24)} />
        </RowPanel>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
        <KeyLine
          text="對話記憶共享（同一個 session）；執行環境／檔案／記憶體不共享。"
          tone={MOTIF.cloud}
          delay={at(6) + 20}
          width={1380}
        />
      </div>

      <Sfx src="whoosh" at={at(2)} volume={0.32} />
      <Sfx src="ding" at={at(3)} volume={0.3} />
      <Sfx src="whoosh" at={at(5)} volume={0.32} />
      <Sfx src="pop" at={at(6)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "01 · 共享記憶嗎？",
  title: "Shared memory?",
  accent: MOTIF.cloud,
  durationInFrames: DUR,
  Component: Scene1,
};
