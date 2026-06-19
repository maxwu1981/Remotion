import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, springPop } from "../../../shared-skills/anim";
import { BrowserFrame, CheckItem, PulseRing, Redact, ShieldMark } from "../ui";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 392;
const FRAME = { w: 1380, h: 740 };

/** A blinking, bobbing arrow that points down-right toward a control. */
const GuideArrow: React.FC<{ x: number; y: number; from: number; color?: string }> = ({ x, y, from, color = COLORS.error }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - from);
  const bob = Math.sin(t / 6) * 7;
  const blink = 0.55 + 0.45 * Math.sin(t / 5);
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" style={{ position: "absolute", left: x, top: y + bob, opacity: blink, filter: `drop-shadow(0 3px 8px ${color}88)`, zIndex: 58 }}>
      <path d="M16 16 Q70 36 92 86" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
      <path d="M92 86 L74 80 M92 86 L86 68" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
};

/* phase A/B — unverified app warning */
const WarningView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 8, from: 0.94, dist: 16 });
  const advancedOpen = frame >= 150;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: card.opacity }}>
      <div style={{ width: 720, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, padding: "40px 44px", transform: card.transform }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: COLORS.warnBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldMark size={28} color={COLORS.warn} />
          </span>
          <div>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>This app isn&apos;t verified</div>
            <div style={{ marginTop: 4, fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.muted }}>Google hasn&apos;t verified this app yet.</div>
          </div>
        </div>

        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: RADIUS.md, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
          <Redact amount={8}><span style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#EA4335,#FBBC05)", display: "block" }} /></Redact>
          <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.inkSoft }}>
            f<Redact amount={6}>inalaaaa</Redact>@gmail.com
          </span>
        </div>

        <div style={{ marginTop: 26, fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted, lineHeight: 1.5 }}>
          Continue only if you built this app and understand the risk.
        </div>

        <div style={{ marginTop: 30, position: "relative", minHeight: 70 }}>
          <span style={{ position: "relative", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.remotion }}>
            Advanced
            {!advancedOpen ? <PulseRing color={COLORS.remotion} radius={6} from={104} /> : null}
          </span>
          {advancedOpen ? (
            <div style={{ marginTop: 18, opacity: enter(frame, 150, 10), transform: `translateY(${(1 - enter(frame, 150, 10)) * 8}px)` }}>
              <span style={{ position: "relative", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.remotion }}>
                Go to youtube-auto-upload <span style={{ color: COLORS.muted, fontWeight: 500 }}>(unsafe)</span>
                <PulseRing color={COLORS.error} radius={6} from={156} />
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/* phase C — permissions / scopes */
const PERMS = [
  "See, edit, and permanently delete your YouTube videos",
  "Manage your YouTube videos",
  "View your YouTube account",
];
const PermsView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 224, from: 0.95, dist: 16 });
  const allow = frame >= 350;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: card.opacity }}>
      <div style={{ width: 800, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, padding: 38, transform: card.transform }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.25 }}>
          <span style={{ color: COLORS.remotion }}>youtube-auto-upload</span> wants access to your Google Account
        </div>
        <div style={{ marginTop: 8, fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.muted }}>
          f<Redact amount={5}>inalaaaa</Redact>@gmail.com — this will allow it to:
        </div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          {PERMS.map((p, i) => {
            const appear = enter(frame, 240 + i * 14, 12);
            const check = interpolate(frame, [262 + i * 14, 280 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isKey = i === 1;
            return (
              <div key={p} style={{ position: "relative" }}>
                <CheckItem label={p} appear={appear} check={check} accent={isKey ? COLORS.remotion : COLORS.success} />
                {isKey ? <PulseRing color={COLORS.remotion} radius={RADIUS.md} from={300} /> : null}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.faint, alignSelf: "center" }}>Cancel</span>
          <div style={{ padding: "12px 30px", borderRadius: RADIUS.sm, background: allow ? COLORS.success : COLORS.remotion, color: "#fff", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small }}>
            {allow ? "✓ ALLOWED" : "Continue"}
          </div>
        </div>
      </div>
    </div>
  );
};

const CUES: Cue[] = [
  { id: "u6-c1", from: 14, dur: 80, text: "Don't panic if you see a security warning." },
  { id: "u6-c2", from: 100, dur: 115, text: "Click Advanced at the bottom left, then “Go to project”." },
  { id: "u6-c3", from: 220, dur: 168, text: "Keep every permission checked — including “Manage your YouTube videos”." },
];

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const showWarn = frame < 224;
  const showPerms = frame >= 218;

  return (
    <UploadShell durationInFrames={DUR} step="STEP 05" kicker="AUTHORIZE" title="Get past the security warning" accent={COLORS.error}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
        <BrowserFrame url="accounts.google.com" width={FRAME.w} height={FRAME.h}>
          <div style={{ position: "relative", height: FRAME.h - 54 }}>
            {showWarn ? <div style={{ position: "absolute", inset: 0, opacity: frame > 214 ? interpolate(frame, [214, 224], [1, 0], { extrapolateRight: "clamp" }) : 1 }}><WarningView /></div> : null}
            {showPerms ? <PermsView /> : null}
          </div>
        </BrowserFrame>
      </AbsoluteFill>

      {/* guide arrows toward Advanced, then the unsafe link */}
      {frame >= 104 && frame < 152 ? <GuideArrow x={560} y={612} from={104} color={COLORS.remotion} /> : null}
      {frame >= 156 && frame < 212 ? <GuideArrow x={560} y={686} from={156} color={COLORS.error} /> : null}

      <Sfx src="pop" at={8} volume={0.4} />
      <Sfx src="ui-pop.mp3" at={150} volume={0.4} />
      <Sfx src="whoosh" at={205} volume={0.45} />
      <Sfx src="ding" at={300} volume={0.4} />
      <Sfx src="ding" at={350} volume={0.5} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene6: SceneDef = {
  id: "u6",
  index: 6,
  kicker: "STEP 05",
  title: "Get past the security warning",
  accent: COLORS.error,
  durationInFrames: DUR,
  Component: Scene6,
};
