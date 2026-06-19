import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { API, DIFFS, MCP } from "../data";
import { Heading, Shell, SideBadge } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s5-c1", "s5-c2", "s5-c3", "s5-c4"], { lead: 14, minDur: 175 });

const COL = { dim: 360, api: 552, mcp: 552 };
const W = COL.dim + COL.api + COL.mcp;

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const head = appearUp(frame, 20, 16, 18);

  return (
    <Shell durationInFrames={DUR} accent={MCP.color} kicker="主要差異 · Differences">
      <div style={{ position: "absolute", left: 0, right: 0, top: 138, display: "flex", justifyContent: "center" }}>
        <Heading zh="主要差異一次看懂" en="The core differences" />
      </div>

      <div style={{ position: "absolute", left: (1920 - W) / 2, top: 300, width: W, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: `2px solid ${COLORS.border}`, ...head }}>
          <div style={{ width: COL.dim, padding: "20px 28px" }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.faint }}>比較維度</span>
          </div>
          <div style={{ width: COL.api, padding: "16px 28px", background: `${API.color}0e`, display: "flex", justifyContent: "center" }}>
            <SideBadge label="API" color={API.color} sub="應用程式介面" big />
          </div>
          <div style={{ width: COL.mcp, padding: "16px 28px", background: `${MCP.color}0e`, display: "flex", justifyContent: "center" }}>
            <SideBadge label="MCP" color={MCP.color} sub="模型上下文協定" big />
          </div>
        </div>

        {/* rows */}
        {DIFFS.map((row, i) => {
          const a = appearUp(frame, 40 + i * 22, 16, 16);
          const last = i === DIFFS.length - 1;
          return (
            <div key={row.dimEn} style={{ display: "flex", alignItems: "stretch", borderBottom: last ? "none" : `1px solid ${COLORS.border}`, ...a }}>
              <div style={{ width: COL.dim, padding: "22px 28px" }}>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{row.dim}</div>
                <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.micro, color: COLORS.faint, marginTop: 2 }}>{row.dimEn}</div>
              </div>
              <div style={{ width: COL.api, padding: "22px 28px", background: `${API.color}08`, display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft }}>{row.api}</span>
              </div>
              <div style={{ width: COL.mcp, padding: "22px 28px", background: `${MCP.color}0c`, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: MCP.deep }}>{row.mcp}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Sfx src="whoosh" at={20} volume={0.35} />
      {DIFFS.map((r, i) => (
        <Sfx key={r.dimEn} src="pop" at={40 + i * 22} volume={0.26} />
      ))}
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "主要差異 · Differences",
  title: "Differences",
  accent: MCP.color,
  durationInFrames: DUR,
  Component: Scene5,
};
