import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { GlassPanel } from "../../../shared-skills/components/lux";
import { Captions, buildScene } from "../captions";
import { API, MCP } from "../data";
import { FlowArrow, Heading, Shell, SideBadge, ramp } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s6-c1", "s6-c2", "s6-c3"], { lead: 14, minDur: 200 });

const SOCKETS: ("A" | "C" | "G" | "I")[] = ["A", "C", "G", "I"];
const CODES = ["US", "EU", "UK", "AU"];

const Socket: React.FC<{ kind: "A" | "C" | "G" | "I"; size?: number; color?: string }> = ({ kind, size = 66, color = COLORS.inkSoft }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <rect x="4" y="4" width="64" height="64" rx="16" fill={COLORS.surface} stroke={color} strokeWidth="3" />
    {kind === "A" ? (
      <>
        <rect x="28" y="21" width="5" height="18" rx="2" fill={color} />
        <rect x="39" y="21" width="5" height="18" rx="2" fill={color} />
        <circle cx="36" cy="50" r="3" fill={color} />
      </>
    ) : null}
    {kind === "C" ? (
      <>
        <circle cx="28" cy="36" r="5.4" fill={color} />
        <circle cx="44" cy="36" r="5.4" fill={color} />
      </>
    ) : null}
    {kind === "G" ? (
      <>
        <rect x="32" y="18" width="8" height="6" rx="1.5" fill={color} />
        <rect x="21" y="40" width="8" height="6" rx="1.5" fill={color} />
        <rect x="43" y="40" width="8" height="6" rx="1.5" fill={color} />
      </>
    ) : null}
    {kind === "I" ? (
      <>
        <rect x="29" y="24" width="5" height="15" rx="2" fill={color} transform="rotate(22 31 31)" />
        <rect x="38" y="24" width="5" height="15" rx="2" fill={color} transform="rotate(-22 41 31)" />
        <rect x="33" y="45" width="6" height="5" rx="1.5" fill={color} />
      </>
    ) : null}
  </svg>
);

const Check: React.FC = () => (
  <span style={{ position: "absolute", right: -6, top: -6, width: 24, height: 24, borderRadius: "50%", background: COLORS.success, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW.sm }}>✓</span>
);

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = springPop(frame, fps, { delay: 18, from: 0.8, dist: 0 });
  const right = springPop(frame, fps, { delay: 40, from: 0.8, dist: 0 });

  return (
    <Shell durationInFrames={DUR} accent={MCP.color} kicker="比喻 · 插座 Sockets">
      <div style={{ position: "absolute", left: 0, right: 0, top: 142, display: "flex", justifyContent: "center" }}>
        <Heading zh="出國旅行的插座" en="The travel-adapter analogy" />
      </div>

      {/* LEFT — API: many different wall sockets */}
      <div style={{ position: "absolute", left: 130, top: 300, width: 740, height: 552, opacity: left.opacity, transform: left.transform }}>
        <GlassPanel tint={API.color} radius={28} style={{ width: "100%", height: "100%" }}>
          <div style={{ padding: "30px 36px", height: "100%", display: "flex", flexDirection: "column" }}>
            <SideBadge label="API" color={API.color} sub="各國牆壁插座" big />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, margin: "34px 4px 0", flex: 1, alignContent: "center" }}>
              {SOCKETS.map((k, i) => {
                const a = springPop(frame, fps, { delay: 54 + i * 10, from: 0.5, dist: 14 });
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, opacity: a.opacity, transform: a.transform }}>
                    <Socket kind={k} size={70} color={API.deep} />
                    <div>
                      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{CODES[i]}</div>
                      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.tiny, color: COLORS.faint }}>形狀不同</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, padding: "12px 18px", borderRadius: RADIUS.md, background: COLORS.errorBg, border: `1px solid ${COLORS.error}33`, textAlign: "center", opacity: ramp(frame, 96, 116) }}>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.error }}>每換一國 → 換一個轉接頭</span>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* RIGHT — MCP: one universal adapter fits all */}
      <div style={{ position: "absolute", left: 1050, top: 300, width: 740, height: 552, opacity: right.opacity, transform: right.transform }}>
        <GlassPanel tint={MCP.color} glow={MCP.color} glowAmt={0.4} radius={28} style={{ width: "100%", height: "100%" }}>
          <div style={{ padding: "30px 36px", height: "100%", display: "flex", flexDirection: "column" }}>
            <SideBadge label="MCP" color={MCP.color} sub="萬能轉接頭" big />

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              {/* AI device */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 92, height: 92, borderRadius: 22, background: COLORS.surface, border: `2px solid ${COLORS.remotion}55`, boxShadow: SHADOW.md, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🤖</div>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.muted }}>AI 模型</span>
              </div>
              <div style={{ marginTop: -22 }}>
                <FlowArrow width={60} color={MCP.color} progress={ramp(frame, 70, 92)} />
              </div>
              {/* universal adapter */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 118, height: 118, borderRadius: "50%", background: `linear-gradient(150deg, ${MCP.color}, ${MCP.deep})`, boxShadow: `0 18px 40px -10px ${MCP.color}aa, 0 0 0 9px ${MCP.color}1f`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: "#fff" }}>MCP</span>
                  <span style={{ fontSize: 20 }}>🔌</span>
                </div>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: MCP.deep }}>萬能轉接頭</span>
              </div>
              <div style={{ marginTop: -22 }}>
                <FlowArrow width={60} color={MCP.color} progress={ramp(frame, 92, 114)} />
              </div>
              {/* fits every socket */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {SOCKETS.map((k, i) => {
                  const a = springPop(frame, fps, { delay: 116 + i * 9, from: 0.4, dist: 10 });
                  return (
                    <div key={k} style={{ position: "relative", opacity: a.opacity, transform: a.transform }}>
                      <Socket kind={k} size={58} color={MCP.deep} />
                      <Check />
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 18, padding: "12px 18px", borderRadius: RADIUS.md, background: COLORS.successBg, border: `1px solid ${COLORS.success}33`, textAlign: "center", opacity: ramp(frame, 150, 170) }}>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.success }}>學會插上它 → 全部相容、隨插即用</span>
            </div>
          </div>
        </GlassPanel>
      </div>

      <Sfx src="whoosh" at={18} volume={0.4} />
      <Sfx src="whoosh" at={40} volume={0.4} />
      <Sfx src="ding" at={150} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene6: SceneDef = {
  id: "s6",
  index: 6,
  kicker: "比喻 · 插座 Sockets",
  title: "Analogy",
  accent: MCP.color,
  durationInFrames: DUR,
  Component: Scene6,
};
