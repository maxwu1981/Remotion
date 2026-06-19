import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, springPop } from "../../../shared-skills/anim";
import { BrowserFrame, GoogleCloudMark, PulseRing, Redact, typed } from "../ui";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 412; // holds the (slightly longer) edge-tts narration tail

const FRAME = { left: 210, top: 214, w: 1500, h: 760 };

/* the search query typed into the API library */
const QUERY = "YouTube Data API v3";

const GcpTopBar: React.FC<{ searchActive: boolean }> = ({ searchActive }) => {
  const frame = useCurrentFrame();
  const caretOn = Math.floor(frame / 15) % 2 === 0;
  const q = searchActive ? typed(QUERY, frame, 138, 22) : "";
  return (
    <div style={{ height: 60, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
      <GoogleCloudMark size={26} />
      <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: "#5F6368" }}>Google Cloud</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: RADIUS.sm, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt }}>
        <span style={{ fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.inkSoft }}>youtube-auto-upload</span>
        <span style={{ color: COLORS.faint }}>▾</span>
      </div>
      <div
        style={{
          flex: 1,
          height: 38,
          borderRadius: RADIUS.pill,
          border: `1px solid ${searchActive ? COLORS.remotion : COLORS.border}`,
          background: COLORS.surfaceAlt,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 18px",
          boxShadow: searchActive ? `0 0 0 3px ${COLORS.remotion}22` : "none",
        }}
      >
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none">
          <circle cx={11} cy={11} r={7} stroke={COLORS.muted} strokeWidth={2} />
          <path d="M16 16l5 5" stroke={COLORS.muted} strokeWidth={2} strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: q ? COLORS.ink : COLORS.faint }}>
          {q || "Search for APIs & Services"}
          {searchActive ? <span style={{ opacity: caretOn ? 1 : 0, color: COLORS.remotion }}>|</span> : null}
        </span>
      </div>
    </div>
  );
};

/* phase A — create new project */
const NewProjectView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 10, from: 0.92, dist: 16 });
  const created = frame >= 92;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: card.opacity }}>
      <div style={{ width: 620, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md, padding: 34, transform: card.transform }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>New Project</div>
        <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint, letterSpacing: 1 }}>PROJECT NAME</div>
        <div style={{ marginTop: 8, height: 46, borderRadius: RADIUS.sm, border: `1px solid ${COLORS.remotion}`, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", padding: "0 14px", fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.ink }}>
          youtube-auto-upload
        </div>
        <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint, letterSpacing: 1 }}>ORGANIZATION</div>
        <div style={{ marginTop: 8, height: 46, borderRadius: RADIUS.sm, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", padding: "0 14px" }}>
          <Redact><span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.inkSoft }}>finalaaaa@gmail.com</span></Redact>
        </div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", padding: "12px 30px", borderRadius: RADIUS.sm, background: created ? COLORS.success : COLORS.remotion, color: "#fff", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small }}>
            {created ? "✓ CREATED" : "CREATE"}
            {!created ? <PulseRing color={COLORS.remotion} radius={RADIUS.sm} from={36} /> : null}
          </div>
          <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.faint }}>Cancel</span>
        </div>
      </div>
    </div>
  );
};

/* phase C — enable the API */
const EnableApiView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 258, from: 0.92, dist: 18 });
  const enabled = frame >= 332;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: card.opacity }}>
      <div style={{ width: 880, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md, padding: 40, transform: card.transform, display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ width: 110, height: 110, flexShrink: 0, borderRadius: RADIUS.lg, background: "#FFF1F1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={64} height={64} viewBox="0 0 24 24"><rect x={1} y={5} width={22} height={14} rx={4.4} fill="#FF0000" /><path d="M10 8.6l6 3.4-6 3.4z" fill="#fff" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>YouTube Data API v3</div>
          <div style={{ marginTop: 8, fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted, lineHeight: 1.4 }}>
            The API lets you upload videos, manage playlists, and update channel resources programmatically.
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 34px", borderRadius: RADIUS.sm, background: enabled ? COLORS.success : COLORS.remotion, color: "#fff", fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.body }}>
              {enabled ? (
                <>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  API ENABLED
                </>
              ) : (
                "ENABLE"
              )}
              {!enabled ? <PulseRing color={COLORS.remotion} radius={RADIUS.sm} from={290} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CUES: Cue[] = [
  { id: "u2-c1", from: 14, dur: 110, text: "First, head to Google Cloud and create a new project." },
  { id: "u2-c2", from: 130, dur: 120, text: "Then search for the YouTube Data API v3…" },
  { id: "u2-c3", from: 255, dur: 140, text: "…and click Enable — the key that lets your scripts upload videos." },
];

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const phaseB = frame >= 128 && frame < 250;
  const showA = frame < 132;
  const showC = frame >= 250;

  return (
    <UploadShell durationInFrames={DUR} step="STEP 01" kicker="GCP PROJECT" title="Create a project & enable the API" accent={COLORS.remotion}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
        <BrowserFrame url="console.cloud.google.com" width={FRAME.w} height={FRAME.h}>
          <GcpTopBar searchActive={phaseB || showC} />
          <div style={{ position: "relative", height: FRAME.h - 54 - 60 }}>
            {showA ? <div style={{ position: "absolute", inset: 0, opacity: enter(frame, 0, 10) * (frame > 120 ? interpolate(frame, [120, 132], [1, 0], { extrapolateRight: "clamp" }) : 1) }}><NewProjectView /></div> : null}
            {phaseB ? (
              <div style={{ position: "absolute", inset: 0, opacity: enter(frame, 128, 10), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ width: 760, borderRadius: RADIUS.md, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md, overflow: "hidden" }}>
                  {["YouTube Data API v3", "YouTube Analytics API", "YouTube Reporting API"].map((s, i) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", background: i === 0 ? `${COLORS.remotion}10` : "transparent", borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
                      <svg width={22} height={22} viewBox="0 0 24 24"><rect x={1} y={5} width={22} height={14} rx={4.4} fill={i === 0 ? "#FF0000" : "#C7CCD6"} /><path d="M10 8.6l6 3.4-6 3.4z" fill="#fff" /></svg>
                      <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? COLORS.ink : COLORS.muted }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {showC ? <EnableApiView /> : null}
          </div>
        </BrowserFrame>
      </AbsoluteFill>

      <Sfx src="pop" at={12} volume={0.4} />
      <Sfx src="ui-pop.mp3" at={70} volume={0.45} />
      <Sfx src="typing" at={138} volume={0.4} durationInFrames={90} />
      <Sfx src="ding" at={332} volume={0.5} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene2: SceneDef = {
  id: "u2",
  index: 2,
  kicker: "STEP 01",
  title: "Create a project & enable the API",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene2,
};
