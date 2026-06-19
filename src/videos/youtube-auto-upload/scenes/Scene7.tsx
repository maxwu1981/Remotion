import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, springPop, springV } from "../../../shared-skills/anim";
import { YouTubeLogo } from "../../../shared-skills/components/logos";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 395;
const CONFETTI = ["#0B84F3", "#1FC7D4", "#D97757", "#8B5CF6", "#F59E0B", "#16A34A", "#F43F5E"];

const Confetti: React.FC<{ start: number; x: number; y: number; count?: number }> = ({ start, x, y, count = 100 }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > 120) return null;
  const g = 0.34;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 40 }}>
      {new Array(count).fill(0).map((_, i) => {
        const ang = random(`ang${i}`) * Math.PI * 2;
        const sp = 7 + random(`sp${i}`) * 15;
        const vx = Math.cos(ang) * sp;
        const vy = Math.sin(ang) * sp - 11;
        const px = x + vx * t;
        const py = y + vy * t + 0.5 * g * t * t;
        if (py > 1090) return null;
        const op = interpolate(t, [0, 5, 80, 116], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const w = 8 + random(`w${i}`) * 7;
        const h = 5 + random(`h${i}`) * 5;
        const rot = t * (3 + random(`r${i}`) * 7) + i * 12;
        return <rect key={i} x={px} y={py} width={w} height={h} rx={2} fill={CONFETTI[i % CONFETTI.length]} opacity={op} transform={`rotate(${rot} ${px + w / 2} ${py + h / 2})`} />;
      })}
    </svg>
  );
};

const StudioReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: 150, stiffness: 80, damping: 16 });
  const op = enter(frame, 150, 16);
  const row = springPop(frame, fps, { delay: 178, from: 0.82, dist: 20 });
  const views = Math.floor(interpolate(frame, [200, 320], [0, 1248], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: op, transform: `scale(${0.9 + s * 0.1})` }}>
      <div style={{ width: 1180, height: 560, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", background: COLORS.surfaceAlt, borderBottom: `1px solid ${COLORS.border}` }}>
          <YouTubeLogo size={26} />
          <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink }}>YouTube Studio</span>
          <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: TYPE.tiny, color: COLORS.faint }}>Channel content · Videos</span>
        </div>
        <div style={{ padding: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr", gap: 12, fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint, letterSpacing: 1, padding: "0 16px 14px" }}>
            <span>VIDEO</span><span>VISIBILITY</span><span>DATE</span><span>VIEWS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 18, borderRadius: RADIUS.md, background: `${COLORS.success}0C`, border: `1px solid ${COLORS.success}40`, opacity: row.opacity, transform: row.transform }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 2.4 }}>
              <div style={{ width: 150, height: 86, borderRadius: 8, background: GRADIENT.remotion, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={30} height={30} viewBox="0 0 24 24"><path d="M9 6l10 6-10 6z" fill="rgba(255,255,255,0.92)" /></svg>
                </div>
                <span style={{ position: "absolute", right: 6, bottom: 6, fontFamily: FONT.mono, fontSize: 12, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "1px 5px", borderRadius: 4 }}>1:45</span>
              </div>
              <div>
                <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>How I Auto-Upload to YouTube</div>
                <div style={{ marginTop: 5, fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.faint }}>Uploaded by upload.py</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 13px", borderRadius: RADIUS.pill, background: COLORS.successBg }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.success }} />
                <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.success }}>Public</span>
              </span>
            </div>
            <span style={{ flex: 1, fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.muted }}>just now</span>
            <span style={{ flex: 1, fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: COLORS.inkSoft }}>{views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPopup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = springPop(frame, fps, { delay: 10, from: 0.8, dist: 0 });
  // shrink + drift up as the studio takes over
  const leave = interpolate(frame, [150, 184], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [150, 184], [1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dy = interpolate(frame, [150, 184], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (leave <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ width: 660, borderRadius: RADIUS.xl, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, padding: "44px 48px", textAlign: "center", opacity: inP.opacity * leave, transform: `${inP.transform} translateY(${dy}px) scale(${scale})` }}>
        <div style={{ margin: "0 auto", width: 78, height: 78, borderRadius: "50%", background: COLORS.successBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke={COLORS.success} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - enter(frame, 18, 18)} /></svg>
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>Authentication flow completed</div>
        <div style={{ marginTop: 10, fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted }}>You can close this window.</div>
        <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 16px", borderRadius: RADIUS.pill, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none"><path d="M12 3v11M7 10l5 5 5-5M5 20h14" stroke={COLORS.success} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: COLORS.inkSoft }}>token.json saved automatically</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CUES: Cue[] = [
  { id: "u7-c1", from: 18, dur: 175, text: "When you see this screen, authorization is complete — your token is saved automatically." },
  { id: "u7-c2", from: 200, dur: 175, text: "From now on, every AI-generated video uploads to YouTube on its own." },
];

export const Scene7: React.FC = () => (
  <UploadShell durationInFrames={DUR} step="DONE" kicker="PUBLISHED" title="Authorized — your video is live" accent={COLORS.success}>
    <StudioReveal />
    <SuccessPopup />
    <Confetti start={176} x={960} y={520} />

    <Sfx src="pop" at={10} volume={0.5} />
    <Sfx src="ding" at={18} volume={0.5} />
    <Sfx src="whoosh" at={150} volume={0.45} />
    <Sfx src="cash" at={178} volume={0.5} />
    <Sfx src="ding" at={180} volume={0.45} />

    <UploadCaptions cues={CUES} />
  </UploadShell>
);

export const scene7: SceneDef = {
  id: "u7",
  index: 7,
  kicker: "DONE",
  title: "Authorized — your video is live",
  accent: COLORS.success,
  durationInFrames: DUR,
  Component: Scene7,
};
