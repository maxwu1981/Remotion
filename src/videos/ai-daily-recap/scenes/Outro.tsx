import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { BRAND } from "../brand";
import { YouTubeLogo } from "../../../shared-skills/components/logos";
import { CheckIcon } from "../mockups/icons";

const { cues: CUES, dur: DUR } = buildScene(["out-c1", "out-c2"], { lead: 10, minDur: 230 });
const at = (i: number) => CUES[i]?.from ?? 0;

const RECAP = ["錄製", "轉錄 / 配音", "Remotion 算繪", "雙格式發佈"];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = springPop(frame, fps, { delay: 8, from: 0.78, dist: 20 });
  const recap = appearUp(frame, at(0), 16, 22);
  const cta = springPop(frame, fps, { delay: at(1), from: 0.8, dist: 18 });

  return (
    <SceneShell kicker="" title="" accent={COLORS.remotion} durationInFrames={DUR} showChrome={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, letterSpacing: 3, color: COLORS.muted, opacity: mark.opacity }}>
          THE END · 結尾
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 86,
            letterSpacing: -2,
            color: COLORS.ink,
            ...mark,
          }}
        >
          {BRAND.pre}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            {BRAND.post}
          </span>
        </div>

        {/* pipeline recap */}
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 14, ...recap }}>
          {RECAP.map((r, i) => (
            <React.Fragment key={r}>
              {i > 0 ? <span style={{ color: COLORS.faint, fontSize: TYPE.body }}>→</span> : null}
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: RADIUS.pill,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: SHADOW.sm,
                  fontFamily: FONT.uiCjk,
                  fontWeight: 700,
                  fontSize: TYPE.small,
                  color: COLORS.inkSoft,
                }}
              >
                {r}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* subscribe CTA */}
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 18, opacity: cta.opacity, transform: cta.transform }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 28px",
              borderRadius: RADIUS.pill,
              background: "#FF0033",
              color: "#fff",
              boxShadow: "0 14px 34px rgba(255,0,51,0.4)",
              fontFamily: FONT.uiCjk,
              fontWeight: 800,
              fontSize: TYPE.h3,
            }}
          >
            <YouTubeLogo size={34} />
            訂閱
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 26px",
              borderRadius: RADIUS.pill,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: SHADOW.md,
              fontFamily: FONT.uiCjk,
              fontWeight: 800,
              fontSize: TYPE.h3,
              color: COLORS.ink,
            }}
          >
            <CheckIcon size={28} color={COLORS.success} />
            按讚
          </div>
        </div>

        <div style={{ marginTop: 30, fontFamily: FONT.uiCjk, fontSize: TYPE.body, color: COLORS.muted, opacity: cta.opacity }}>
          我們下支影片見！
        </div>
      </AbsoluteFill>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const outro: SceneDef = {
  id: "outro",
  index: 10,
  kicker: "",
  title: "結尾",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Outro,
};
