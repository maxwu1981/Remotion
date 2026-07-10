import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, FlowArrow, ramp } from "../components";
import { Terminal } from "../motifs";
import { MOTIF, PAL, S2_INSTALLERS, S2_INSTALLER_BADGE, S2_ALTS, S2_STEPS, S2_KEY, type Installer, type AltInstall } from "../data";

const IDS = Array.from({ length: 13 }, (_, i) => `s2-${i + 1}`);
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 12, minDur: 300 });
const at = (i: number) => CUES[i].from;

const InstallerCard: React.FC<{ inst: Installer; delay: number }> = ({ inst, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 16, 22);
  return (
    <div style={{ ...a, display: "flex", flexDirection: "column", gap: 12, width: 800 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{inst.os}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: RADIUS.pill, background: PAL.yesBg, border: `1.5px solid ${PAL.yes}`, color: PAL.yes, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small }}>
          <span>✅</span>{S2_INSTALLER_BADGE}
        </span>
      </div>
      <Terminal w={800} title={inst.os} lines={[{ text: inst.cmd, kind: "cmd" }]} progress={ramp(frame, delay + 6, delay + 42)} fontSize={TYPE.small} />
    </div>
  );
};

const AltChip: React.FC<{ alt: AltInstall; delay: number }> = ({ alt, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 18);
  return (
    <div style={{ ...a, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 540 }}>
      <div style={{ width: "100%", padding: "13px 18px", borderRadius: RADIUS.md, background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.sm, textAlign: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>{alt.cmd}</span>
      </div>
      {alt.note ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 13px", borderRadius: RADIUS.pill, background: PAL.warnBg, border: `1px solid ${PAL.warn}`, color: PAL.warn, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny }}>
          <span>⚠️</span>{alt.note}
        </span>
      ) : (
        <span style={{ height: 26 }} />
      )}
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const aOp = leave(frame, at(10) - 8, 12);
  const bOp = ramp(frame, at(10) - 8, at(10) + 6);

  return (
    <Shell durationInFrames={DUR} kicker="02 · CLI 去哪拿" accent={MOTIF.cli} seed="s2">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116 }}>
        <Heading zh="CLI 去哪拿（官方安裝指令）" en="install the CLI · native installer recommended" />
      </div>

      {/* ── View A: installers ── */}
      <AbsoluteFill style={{ opacity: aOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 224, display: "flex", justifyContent: "center", gap: 40 }}>
          <InstallerCard inst={S2_INSTALLERS[0]} delay={at(2)} />
          <InstallerCard inst={S2_INSTALLERS[1]} delay={at(3)} />
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", ...appearUp(frame, at(5), 14, 16) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.muted }}>其他方式</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 624, display: "flex", justifyContent: "center", gap: 28 }}>
          <AltChip alt={S2_ALTS[0]} delay={at(6)} />
          <AltChip alt={S2_ALTS[1]} delay={at(8)} />
          <AltChip alt={S2_ALTS[2]} delay={at(9)} />
        </div>
      </AbsoluteFill>

      {/* ── View B: first-run 3-step flow ── */}
      <AbsoluteFill style={{ opacity: bOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {S2_STEPS.map((s, i) => {
            const d = at(10) + 10 + i * 26;
            return (
              <React.Fragment key={s.t}>
                <div style={{ ...appearUp(frame, d, 16, 20), position: "relative", width: 380, height: 250, borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${MOTIF.cli}66`, boxShadow: SHADOW.lg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 24 }}>
                  <span style={{ position: "absolute", top: 16, left: 20, fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, color: MOTIF.cli, opacity: 0.45 }}>{i + 1}</span>
                  <span style={{ fontSize: 64 }}>{s.icon}</span>
                  <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, textAlign: "center", lineHeight: 1.3 }}>
                    {s.t.split("claude").map((part, k, arr) => (
                      <React.Fragment key={k}>
                        {part}
                        {k < arr.length - 1 ? <span style={{ fontFamily: FONT.mono, color: MOTIF.cli }}>claude</span> : null}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
                {i < S2_STEPS.length - 1 ? (
                  <div style={{ marginTop: 0 }}>
                    <FlowArrow width={70} thickness={3} color={COLORS.borderStrong} progress={ramp(frame, d + 14, d + 30)} />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700 }}>
          <KeyLine text={S2_KEY} tone={MOTIF.cli} delay={at(12)} width={1180} />
        </div>
      </AbsoluteFill>

      <Sfx src="typing" at={at(2)} volume={0.3} durationInFrames={40} />
      <Sfx src="typing" at={at(3)} volume={0.3} durationInFrames={40} />
      <Sfx src="pop" at={at(6)} volume={0.3} />
      <Sfx src="whoosh" at={at(10) - 6} volume={0.32} />
      <Sfx src="ding" at={at(12)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "02 · CLI 去哪拿",
  title: "CLI 去哪拿（官方安裝指令）",
  accent: MOTIF.cli,
  durationInFrames: DUR,
  Component: Scene2,
};
