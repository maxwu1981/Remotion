import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Panel, FlowArrow, ramp } from "../components";
import { AppWindow, Terminal, Disk } from "../motifs";
import { MOTIF, PAL, S3_AUTO_SHARED, S3_NOT_SHARED, S3_CONTINUE, S3_EXCEPTION, S3_KEY } from "../data";

const IDS = Array.from({ length: 14 }, (_, i) => `s3-${i + 1}`);
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 12, minDur: 300 });
const at = (i: number) => CUES[i].from;

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const aOp = leave(frame, at(4) - 8, 12);
  const bOp = Math.min(ramp(frame, at(4) - 8, at(4) + 6), leave(frame, at(12) - 8, 12));
  const cOp = ramp(frame, at(12) - 8, at(12) + 6);

  return (
    <Shell durationInFrames={DUR} kicker="03 · 同機轉移" accent={MOTIF.disk} seed="s3">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116 }}>
        <Heading zh="記憶跟資料怎麼轉移（同一台電腦）" en="same machine · same files on disk" />
      </div>

      {/* ── View A: Code + CLI read the SAME files on disk ── */}
      <AbsoluteFill style={{ opacity: aOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", ...appearUp(frame, at(2), 12, 14) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 20px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.muted }}>
            🖥 同一台電腦
          </span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ ...appearUp(frame, at(2) + 6, 16, 22), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <AppWindow active="code" w={300} bodyH={70} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: MOTIF.code }}>桌面 Code</span>
          </div>
          <FlowArrow width={96} thickness={3} color={MOTIF.disk} progress={ramp(frame, at(2) + 20, at(2) + 40)} />
          <div style={{ ...appearUp(frame, at(2), 16, 22) }}>
            <Disk w={280} glow={0.6} />
          </div>
          <div style={{ transform: "scaleX(-1)" }}>
            <FlowArrow width={96} thickness={3} color={MOTIF.disk} progress={ramp(frame, at(2) + 26, at(2) + 46)} />
          </div>
          <div style={{ ...appearUp(frame, at(2) + 12, 16, 22), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Terminal w={300} title="claude — CLI" lines={[{ text: "claude", kind: "cmd" }]} progress={ramp(frame, at(2) + 18, at(2) + 44)} fontSize={TYPE.small} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: MOTIF.cli }}>終端機 CLI</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 760 }}>
          <KeyLine text={S3_KEY} tone={MOTIF.disk} delay={at(3)} width={1280} />
        </div>
      </AbsoluteFill>

      {/* ── View B: auto-shared ✅ vs not-auto-shared ❌ ── */}
      <AbsoluteFill style={{ opacity: bOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 222, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 40 }}>
          <Panel
            title="自動共用"
            badge="登入後自動就有"
            tone="yes"
            items={S3_AUTO_SHARED}
            start={at(4) + 6}
            step={13}
            w={900}
            mono
            itemSize={TYPE.small}
          />
          <Panel
            title="不會自動共用"
            badge="各自獨立"
            tone="no"
            items={S3_NOT_SHARED}
            start={at(9) + 4}
            step={28}
            w={740}
            itemSize={TYPE.small}
          />
        </div>
      </AbsoluteFill>

      {/* ── View C: Continue in… handoff + Chatbot Memory exception ── */}
      <AbsoluteFill style={{ opacity: cOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 238, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <div style={{ ...appearUp(frame, at(12), 16, 20), position: "relative" }}>
            <AppWindow active="code" w={360} bodyH={90} label="Code 分頁" />
            {/* Continue in… menu */}
            <div style={{ position: "absolute", top: 44, right: -54, width: 220, borderRadius: RADIUS.md, background: COLORS.surface, border: `1.5px solid ${MOTIF.disk}`, boxShadow: SHADOW.lg, overflow: "hidden", opacity: ramp(frame, at(12) + 12, at(12) + 26) }}>
              <div style={{ padding: "8px 14px", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.muted, background: COLORS.bgAlt }}>Continue in…</div>
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `${MOTIF.disk}12` }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: MOTIF.disk }}>CLI</span>
                <span style={{ color: MOTIF.disk, fontWeight: 800 }}>✓</span>
              </div>
            </div>
          </div>
          <FlowArrow width={120} thickness={3.2} color={MOTIF.disk} progress={ramp(frame, at(12) + 20, at(12) + 38)} />
          <div style={{ ...appearUp(frame, at(12) + 14, 16, 20) }}>
            <Terminal w={360} title="claude — CLI" lines={[{ text: "claude --continue", kind: "cmd" }, { text: "● 接續同一個 session", kind: "ok" }]} progress={ramp(frame, at(12) + 24, at(12) + 60)} fontSize={TYPE.small} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", ...appearUp(frame, at(12) + 8, 14, 16) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft, maxWidth: 1200, textAlign: "center" }}>{S3_CONTINUE}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 696, display: "flex", justifyContent: "center" }}>
          <div style={{ ...appearUp(frame, at(13), 16, 22), display: "flex", alignItems: "center", gap: 18, width: 1320, padding: "22px 32px", borderRadius: RADIUS.lg, background: PAL.warnBg, border: `2px solid ${PAL.warn}`, boxShadow: SHADOW.md }}>
            <span style={{ fontSize: 40, flexShrink: 0 }}>⚠️</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, lineHeight: 1.34, color: COLORS.ink }}>{S3_EXCEPTION}</span>
          </div>
        </div>
      </AbsoluteFill>

      <Sfx src="ding" at={at(2) + 20} volume={0.3} />
      <Sfx src="whoosh" at={at(4) - 6} volume={0.32} />
      <Sfx src="pop" at={at(9) + 4} volume={0.3} />
      <Sfx src="whoosh" at={at(12) - 6} volume={0.32} />
      <Sfx src="ding" at={at(13)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "03 · 同機轉移",
  title: "記憶跟資料怎麼轉移（同一台電腦）",
  accent: MOTIF.disk,
  durationInFrames: DUR,
  Component: Scene3,
};
