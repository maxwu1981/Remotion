import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Stamp, Panel, FlowArrow, ramp } from "../components";
import { AppWindow, Terminal, EngineBlock } from "../motifs";
import { MOTIF, PAL, S1_TABS, S1_CODE_FEATURES, S1_CLI_FEATURES, S1_KEY, S1_CAPTION, type Tab } from "../data";

const IDS = Array.from({ length: 16 }, (_, i) => `s1-${i + 1}`);
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 12, minDur: 300 });
const at = (i: number) => CUES[i].from;

/* one of the three tab "products" as a card */
const TabCard: React.FC<{ tab: Tab; delay: number; active: boolean }> = ({ tab, delay, active }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 16, 20);
  return (
    <div
      style={{
        ...a,
        width: 540,
        borderRadius: RADIUS.lg,
        background: COLORS.surface,
        border: `2px solid ${active ? tab.color : `${tab.color}55`}`,
        boxShadow: active ? SHADOW.glow(tab.color) : SHADOW.md,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 8, background: tab.color }} />
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12, minHeight: 196 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 30 }}>{tab.emoji}</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.h3, color: tab.color }}>{tab.name}</span>
        </div>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, lineHeight: 1.4, color: COLORS.inkSoft }}>{tab.desc}</span>
        <div style={{ marginTop: "auto" }}>
          {tab.tag && tab.tagKind ? (
            <Stamp kind={tab.tagKind} text={tab.tag} at={delay + 10} size={TYPE.small} rotate={-1.5} />
          ) : (
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>—</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // active tab cycles as we discuss each product
  const activeTab = frame >= at(6) ? "code" : frame >= at(5) ? "cowork" : frame >= at(2) ? "chatbot" : null;

  // three crossfaded views
  const aOp = leave(frame, at(7) - 8, 12);
  const bOp = Math.min(ramp(frame, at(7) - 8, at(7) + 6), leave(frame, at(10) - 8, 12));
  const cOp = ramp(frame, at(10) - 8, at(10) + 6);

  return (
    <Shell durationInFrames={DUR} kicker="01 · 桌面版 vs CLI" accent={MOTIF.code} seed="s1">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116 }}>
        <Heading zh="桌面版 vs CLI 差在哪" en="three tabs, one shared engine" />
      </div>

      {/* ── View A: three tabs = three different products ── */}
      <AbsoluteFill style={{ opacity: aOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center" }}>
          <AppWindow active={activeTab} w={560} bodyH={120} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", gap: 24 }}>
          {S1_TABS.map((tab, i) => (
            <TabCard key={tab.key} tab={tab} active={activeTab === tab.key} delay={at([2, 5, 6][i])} />
          ))}
        </div>
      </AbsoluteFill>

      {/* ── View B: Code ≡ CLI, one engine (echoes the cover) ── */}
      <AbsoluteFill style={{ opacity: bOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <AppWindow active="code" w={380} bodyH={96} label="Code 分頁" glowActive />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 30 }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 72, color: MOTIF.engine, lineHeight: 0.8 }}>≡</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Terminal w={380} title="claude — CLI" lines={[{ text: "claude", kind: "cmd" }, { text: "● 同一個 agent", kind: "ok" }]} progress={ramp(frame, at(7), at(7) + 46)} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>⌨️ 終端機 CLI</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center" }}>
          <FlowArrow vertical width={54} thickness={3.2} color={MOTIF.engine} progress={ramp(frame, at(8), at(8) + 20)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 668, display: "flex", justifyContent: "center" }}>
          <EngineBlock w={460} active={frame > at(8)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 808 }}>
          <KeyLine text={S1_KEY} tone={MOTIF.engine} delay={at(9)} width={1240} />
        </div>
      </AbsoluteFill>

      {/* ── View C: interface & workflow comparison ── */}
      <AbsoluteFill style={{ opacity: cOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 226, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 40 }}>
          <Panel
            title="桌面 Code 分頁"
            badge="GUI · 工作流"
            tone="neutral"
            accent={MOTIF.code}
            items={S1_CODE_FEATURES}
            start={at(10) + 6}
            step={11}
            w={800}
            itemSize={TYPE.body}
          />
          <Panel
            title="終端機 CLI"
            badge="純文字 · 可自動化"
            tone="neutral"
            accent={MOTIF.cli}
            items={S1_CLI_FEATURES}
            start={at(13)}
            step={10}
            w={800}
            mono
            itemSize={TYPE.small}
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center" }}>
          <div style={{ ...appearUp(frame, at(15), 16, 20), display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 32px", borderRadius: RADIUS.pill, background: PAL.yesBg, border: `2px solid ${PAL.yes}`, boxShadow: SHADOW.md }}>
            <span style={{ fontSize: 26 }}>⚙️</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: PAL.yes }}>{S1_CAPTION}</span>
          </div>
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={at(2)} volume={0.34} />
      <Sfx src="pop" at={at(5)} volume={0.34} />
      <Sfx src="pop" at={at(6)} volume={0.34} />
      <Sfx src="ding" at={at(8) + 6} volume={0.3} />
      <Sfx src="whoosh" at={at(10) - 6} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "01 · 桌面版 vs CLI",
  title: "桌面版 vs CLI 差在哪",
  accent: MOTIF.code,
  durationInFrames: DUR,
  Component: Scene1,
};
