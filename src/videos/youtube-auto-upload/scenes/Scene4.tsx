import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, springPop } from "../../../shared-skills/anim";
import { BrowserFrame, FolderMark, PulseRing, Redact } from "../ui";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 438;
const FRAME = { w: 1440, h: 750 };

/* phase A — create OAuth client ID, type = Desktop app */
const CreateClientView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 8, from: 0.94, dist: 16 });
  const created = frame >= 104;
  return (
    <div style={{ position: "absolute", inset: 0, padding: "40px 64px", opacity: card.opacity, transform: card.transform }}>
      <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink }}>Create OAuth client ID</div>
      <div style={{ marginTop: 28, fontFamily: FONT.mono, fontSize: TYPE.micro, letterSpacing: 1, color: COLORS.faint }}>APPLICATION TYPE</div>
      <div style={{ marginTop: 10, width: 560, height: 52, borderRadius: RADIUS.sm, border: `1px solid ${COLORS.remotion}`, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", boxShadow: `0 0 0 3px ${COLORS.remotion}1f` }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 600, color: COLORS.ink }}>
          <span style={{ fontSize: 20 }}>🖥️</span> Desktop app
        </span>
        <span style={{ color: COLORS.faint }}>▾</span>
      </div>
      <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: TYPE.micro, letterSpacing: 1, color: COLORS.faint }}>NAME</div>
      <div style={{ marginTop: 10, width: 560, height: 52, borderRadius: RADIUS.sm, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.inkSoft }}>
        youtube-uploader
      </div>
      <div style={{ marginTop: 34 }}>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 34px", borderRadius: RADIUS.sm, background: created ? COLORS.success : COLORS.remotion, color: "#fff", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small }}>
          {created ? "✓ CREATED" : "CREATE"}
          {!created ? <PulseRing color={COLORS.remotion} radius={RADIUS.sm} from={40} /> : null}
        </div>
      </div>
    </div>
  );
};

/* phase B — client created modal + download json */
const DownloadView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 152, from: 0.94, dist: 16 });
  const downloaded = frame >= 214;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: card.opacity }}>
      <div style={{ width: 760, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, padding: 38, transform: card.transform }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.successBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke={COLORS.success} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>OAuth client created</span>
        </div>
        <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: TYPE.micro, letterSpacing: 1, color: COLORS.faint }}>CLIENT ID</div>
        <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.inkSoft }}>
          <Redact amount={7}>8f3c92ad17be</Redact>.apps.googleusercontent.com
        </div>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: RADIUS.md, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <JsonFile size={40} />
            <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.inkSoft }}>
              client_secret_<Redact amount={5}>8f3c</Redact>.json
            </span>
          </span>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, padding: "11px 22px", borderRadius: RADIUS.sm, background: downloaded ? COLORS.success : COLORS.remotion, color: "#fff", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.tiny }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M12 3v11M7 10l5 5 5-5M5 20h14" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            {downloaded ? "DOWNLOADED" : "DOWNLOAD JSON"}
            {!downloaded ? <PulseRing color={COLORS.remotion} radius={RADIUS.sm} from={172} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const JsonFile: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M6 2.5h8.5L19 7v13.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" fill="#fff" stroke={COLORS.borderStrong} strokeWidth={1.4} />
    <path d="M14 2.6V7h4.3" fill="none" stroke={COLORS.borderStrong} strokeWidth={1.4} />
    <text x={12} y={17} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fontWeight={700} fill={COLORS.remotion}>JSON</text>
  </svg>
);

/* phase C — rename + drop into project folder */
const FinderView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 308, from: 0.95, dist: 16 });
  const renamed = frame >= 360;
  const drop = interpolate(frame, [372, 402], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = frame >= 402;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: card.opacity }}>
      <div style={{ width: 980, display: "flex", alignItems: "center", justifyContent: "center", gap: 70, transform: card.transform }}>
        {/* the file (rename + travel) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateX(${drop * 250}px) translateY(${drop * 16}px) scale(${1 - drop * 0.4})`, opacity: Math.max(0, 1 - drop * 1.15) }}>
          <JsonFile size={104} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: renamed ? COLORS.success : COLORS.muted }}>
              {renamed ? "client_secrets.json" : "client_secret_••••.json"}
            </span>
            {renamed ? <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.success }}>renamed ✓</span> : <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint }}>rename →</span>}
          </div>
        </div>

        {/* the project folder */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <FolderMark size={120} color={COLORS.remotion} />
            {done ? (
              <span style={{ position: "absolute", right: -10, bottom: 6, width: 40, height: 40, borderRadius: "50%", background: COLORS.success, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW.md, transform: `scale(${enter(frame, 402, 10)})` }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            ) : null}
          </div>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: COLORS.inkSoft }}>youtube-auto-upload/</span>
        </div>
      </div>
    </div>
  );
};

const CUES: Cue[] = [
  { id: "u4-c1", from: 14, dur: 130, text: "Create an OAuth client ID — choose Desktop app." },
  { id: "u4-c2", from: 150, dur: 150, text: "Download the JSON, rename it to client_secrets.json…" },
  { id: "u4-c3", from: 305, dur: 130, text: "…and drop it into your project folder. Setup complete." },
];

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const showA = frame < 152;
  const showB = frame >= 146 && frame < 308;
  const showC = frame >= 304;
  const isFinder = showC;

  return (
    <UploadShell durationInFrames={DUR} step="STEP 03" kicker="CREDENTIALS" title="Download the credentials JSON" accent={COLORS.warn}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
        <BrowserFrame url={isFinder ? undefined : "console.cloud.google.com › Credentials"} width={FRAME.w} height={FRAME.h}>
          {isFinder ? (
            <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: COLORS.surfaceAlt, borderBottom: `1px solid ${COLORS.border}` }}>
              <FolderMark size={20} color={COLORS.muted} />
              <span style={{ fontFamily: FONT.ui, fontSize: TYPE.tiny, fontWeight: 600, color: COLORS.muted }}>Finder — Downloads</span>
            </div>
          ) : null}
          <div style={{ position: "relative", height: isFinder ? FRAME.h - 54 - 50 : FRAME.h - 54 }}>
            {showA ? <div style={{ position: "absolute", inset: 0, opacity: frame > 142 ? interpolate(frame, [142, 152], [1, 0], { extrapolateRight: "clamp" }) : 1 }}><CreateClientView /></div> : null}
            {showB ? <div style={{ position: "absolute", inset: 0, opacity: frame > 298 ? interpolate(frame, [298, 308], [1, 0], { extrapolateRight: "clamp" }) : enter(frame, 146, 10) }}><DownloadView /></div> : null}
            {showC ? <FinderView /> : null}
          </div>
        </BrowserFrame>
      </AbsoluteFill>

      <Sfx src="pop" at={8} volume={0.4} />
      <Sfx src="ui-pop.mp3" at={110} volume={0.4} />
      <Sfx src="whoosh" at={214} volume={0.45} />
      <Sfx src="typing" at={340} volume={0.35} durationInFrames={40} />
      <Sfx src="ding" at={402} volume={0.55} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene4: SceneDef = {
  id: "u4",
  index: 4,
  kicker: "STEP 03",
  title: "Download the credentials JSON",
  accent: COLORS.warn,
  durationInFrames: DUR,
  Component: Scene4,
};
