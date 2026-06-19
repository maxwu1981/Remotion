import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, ramp } from "../components";
import { Phone, Cloud, DeviceToken } from "../motifs";
import { DISPATCH_ROUTES, S9_NOW, S9_DISPATCH, S9_SUMMARY, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s9-c1", "s9-c2", "s9-c3", "s9-c4", "s9-c5", "s9-c6", "s9-c7", "s9-c8"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

/** A small deterministic QR-code glyph. */
const QrGlyph: React.FC<{ size?: number }> = ({ size = 110 }) => {
  const n = 9;
  const c = size / n;
  const finder = (gx: number, gy: number) => (
    <g key={`f${gx}${gy}`}>
      <rect x={gx * c} y={gy * c} width={c * 3} height={c * 3} fill={COLORS.ink} />
      <rect x={(gx + 0.5) * c} y={(gy + 0.5) * c} width={c * 2} height={c * 2} fill="#fff" />
      <rect x={(gx + 1) * c} y={(gy + 1) * c} width={c} height={c} fill={COLORS.ink} />
    </g>
  );
  const cells = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      if (!inFinder && (x * 3 + y * 5 + x * y) % 3 === 0) {
        cells.push(<rect key={`${x}-${y}`} x={x * c} y={y * c} width={c} height={c} fill={COLORS.ink} />);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={0} y={0} width={size} height={size} fill="#fff" />
      {cells}
      {finder(0, 0)}
      {finder(6, 0)}
      {finder(0, 6)}
    </svg>
  );
};

/** desktop → fork → two route cards. */
const Fork: React.FC<{ p: number }> = ({ p }) => (
  <svg width={90} height={220} style={{ overflow: "visible" }}>
    <path d="M2 110 Q 50 110 88 40" fill="none" stroke={MOTIF.phone} strokeWidth={3} strokeLinecap="round" strokeDasharray={160} strokeDashoffset={160 * (1 - ramp(p, 0, 0.6))} />
    <path d="M2 110 Q 50 110 88 180" fill="none" stroke={MOTIF.cloud} strokeWidth={3} strokeLinecap="round" strokeDasharray={160} strokeDashoffset={160 * (1 - ramp(p, 0.4, 1))} />
    <circle cx={2} cy={110} r={5} fill={COLORS.inkSoft} />
  </svg>
);

const RouteCard: React.FC<{ kind: string; to: string; color: string; delay: number }> = ({ kind, to, color, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ ...a, width: 540, display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${color}55`, boxShadow: SHADOW.md }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft, flex: 1 }}>{kind}</span>
      <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 26, color }}>➡</span>
      <span style={{ padding: "8px 16px", borderRadius: RADIUS.pill, background: `${color}16`, fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.body, color }}>{to}</span>
    </div>
  );
};

const ContrastRow: React.FC<{ tag: string; text: string; tone: string; delay: number }> = ({ tag, text, tone, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ ...a, display: "flex", alignItems: "center", gap: 16, padding: "12px 22px", borderRadius: RADIUS.md, background: COLORS.surface, border: `1.5px solid ${tone}44`, boxShadow: SHADOW.sm }}>
      <span style={{ padding: "4px 14px", borderRadius: RADIUS.pill, background: tone, color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.tiny, whiteSpace: "nowrap" }}>{tag}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft, lineHeight: 1.4 }}>{text}</span>
    </div>
  );
};

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const desk = appearUp(frame, at(1), 16, 20);
  const phone = appearUp(frame, at(2), 16, 20);
  const tokenP = ramp(frame, at(3), at(3) + 22);
  const greyCloud = appearUp(frame, at(3), 16, 18);
  const tokenX = interpolate(tokenP, [0, 1], [430, 690], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.phone} kicker="09 · Dispatch（派工）" seed="s9">
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, display: "flex", justifyContent: "center" }}>
        <Heading zh="Dispatch 是什麼？在手機上是 Cowork 還是 Code？" en="Dispatch routes the task back to your own desktop" delay={at(0)} />
      </div>

      {/* flow: phone(QR) → 派工 → desktop(+greyed cloud) → fork → routes */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 220, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={{ ...phone }}>
          <Phone h={210} tint={MOTIF.phone} label="掃 QR code 配對" screen={<QrGlyph size={92} />} />
        </div>

        <div style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ opacity: ramp(frame, at(3), at(3) + 8), padding: "6px 14px", borderRadius: RADIUS.pill, background: MOTIF.phone, color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, transform: `translateX(${tokenX - 430}px)` }}>派工 ▶</div>
          <svg width={150} height={20}><line x1={6} y1={10} x2={144} y2={10} stroke={MOTIF.phone} strokeWidth={2.5} strokeDasharray="3 6" opacity={ramp(frame, at(3), at(3) + 10)} /></svg>
        </div>

        <div style={{ ...desk, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative" }}>
          <DeviceToken emoji="🖥" label="你自己的桌面電腦" size={120} color={MOTIF.warehouse} active />
          <div style={{ position: "absolute", top: -36, right: -84, display: "flex", flexDirection: "column", alignItems: "center", opacity: greyCloud.opacity }}>
            <div style={{ position: "relative", filter: "grayscale(1)", opacity: 0.5 }}>
              <Cloud w={92} color={COLORS.faint} />
              <span style={{ position: "absolute", top: 8, left: 30, fontSize: 30, color: PAL.no }}>✘</span>
            </div>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.micro, color: PAL.no }}>不是雲端容器</span>
          </div>
        </div>

        <Fork p={ramp(frame, at(4), at(4) + 20)} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <RouteCard kind={DISPATCH_ROUTES[0].kind} to="Code（Claude Code）" color={DISPATCH_ROUTES[0].color} delay={at(5)} />
          <RouteCard kind={DISPATCH_ROUTES[1].kind} to="Cowork" color={DISPATCH_ROUTES[1].color} delay={at(6)} />
        </div>
      </div>

      {/* contrast vs §5 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 612, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 1500, display: "flex", flexDirection: "column", gap: 10 }}>
          <ContrastRow tag="目前對話" text={S9_NOW} tone={MOTIF.cloud} delay={at(7)} />
          <ContrastRow tag="Dispatch" text={S9_DISPATCH} tone={MOTIF.warehouse} delay={at(7) + 8} />
        </div>
      </div>

      {/* summary strip */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, display: "flex", justifyContent: "center", ...appearUp(frame, at(7) + 16, 16, 18) }}>
        <div style={{ maxWidth: 1520, display: "flex", alignItems: "center", gap: 14, padding: "14px 28px", borderRadius: RADIUS.lg, background: COLORS.ink, boxShadow: SHADOW.lg }}>
          <span style={{ fontSize: 24 }}>🧭</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: "#fff", lineHeight: 1.36 }}>{S9_SUMMARY}</span>
        </div>
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.3} />
      <Sfx src="ding" at={at(2)} volume={0.3} />
      <Sfx src="whoosh" at={at(3)} volume={0.34} />
      <Sfx src="pop" at={at(5)} volume={0.26} />
      <Sfx src="pop" at={at(6)} volume={0.26} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene9: SceneDef = {
  id: "s9",
  index: 9,
  kicker: "09 · Dispatch（派工）",
  title: "Dispatch",
  accent: MOTIF.phone,
  durationInFrames: DUR,
  Component: Scene9,
};
