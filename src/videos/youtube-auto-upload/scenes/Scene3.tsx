import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { enter, springPop } from "../../../shared-skills/anim";
import { BlinkBox, BrowserFrame, GoogleCloudMark, Redact } from "../ui";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 445;
const FRAME = { w: 1500, h: 760 };

const ConsentHeader: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ height: 60, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
    <GoogleCloudMark size={24} />
    <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: "#5F6368" }}>Google Cloud</span>
    <span style={{ color: COLORS.faint }}>›</span>
    <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.inkSoft }}>APIs &amp; Services</span>
    <span style={{ color: COLORS.faint }}>›</span>
    <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{label}</span>
  </div>
);

const Radio: React.FC<{ on: boolean; label: string; sub: string; checked: number }> = ({ on, label, sub, checked }) => (
  <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: RADIUS.md, border: `1px solid ${on ? COLORS.remotion : COLORS.border}`, background: on ? `${COLORS.remotion}0C` : COLORS.surface }}>
    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2, border: `2px solid ${on ? COLORS.remotion : COLORS.borderStrong}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.remotion, transform: `scale(${on ? checked : 0})` }} />
    </div>
    <div>
      <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{label}</div>
      <div style={{ marginTop: 4, fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.muted }}>{sub}</div>
    </div>
  </div>
);

/* phase A — user type = External */
const UserTypeView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 8, from: 0.95, dist: 14 });
  const checked = interpolate(frame, [64, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, padding: "44px 70px", opacity: card.opacity, transform: card.transform }}>
      <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink }}>OAuth consent screen</div>
      <div style={{ marginTop: 10, fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted }}>Choose who can use your app — pick the user type, then continue.</div>
      <div style={{ marginTop: 30, fontFamily: FONT.mono, fontSize: TYPE.micro, letterSpacing: 1, color: COLORS.faint }}>USER TYPE</div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
        <Radio on={false} label="Internal" sub="Only users within your organization" checked={0} />
        <Radio on label="External" sub="Any test user with a Google Account" checked={checked} />
      </div>
    </div>
  );
};

/* phase C — test users */
const TestUsersView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = springPop(frame, fps, { delay: 276, from: 0.95, dist: 16 });
  const added = frame >= 338;
  return (
    <div style={{ position: "absolute", inset: 0, padding: "44px 70px", opacity: card.opacity, transform: card.transform }}>
      <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink }}>Test users</div>
      <div style={{ marginTop: 10, fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted, maxWidth: 880 }}>
        While publishing status is <b>Testing</b>, only test users listed here can authorize your app.
      </div>

      <div style={{ marginTop: 26, width: 900, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, background: COLORS.surface, boxShadow: SHADOW.sm, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${COLORS.border}` }}>
          <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>Users</span>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px", borderRadius: RADIUS.sm, border: `1px solid ${COLORS.remotion}`, color: COLORS.remotion, fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.tiny }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> ADD USERS
            <BlinkBox color={COLORS.error} radius={RADIUS.sm} from={282} />
          </div>
        </div>
        <div style={{ padding: "10px 22px 18px" }}>
          {added ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: RADIUS.md, background: COLORS.successBg, opacity: enter(frame, 338, 10) }}>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.success, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800 }}>f</span>
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.inkSoft }}>
                f<Redact amount={7}>inalaaaa</Redact>@gmail.com
              </span>
              <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, color: COLORS.success }}>✓ test user</span>
            </div>
          ) : (
            <div style={{ padding: "20px 4px", fontFamily: FONT.ui, fontSize: TYPE.tiny, color: COLORS.faint }}>No test users yet — add your channel's Gmail.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const MissBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springPop(frame, fps, { delay: 188, from: 0.8, dist: 0 });
  const out = interpolate(frame, [262, 274], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "20px 38px", borderRadius: RADIUS.pill, background: "#fff", border: `2px solid ${COLORS.error}`, boxShadow: SHADOW.glow(COLORS.error), opacity: p.opacity * out, transform: p.transform }}>
        <span style={{ fontSize: 34 }}>⚠️</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>The step almost everyone misses</span>
      </div>
    </AbsoluteFill>
  );
};

const CUES: Cue[] = [
  { id: "u3-c1", from: 16, dur: 160, text: "Configure the OAuth consent screen. Set the user type to External." },
  { id: "u3-c2", from: 185, dur: 84, text: "Here's the step almost everyone misses." },
  { id: "u3-c3", from: 281, dur: 160, text: "Under Test users, add your channel's Gmail — or Google blocks the authorization." },
];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const showA = frame < 188;
  const showC = frame >= 270;
  const headerLabel = showC ? "Audience" : "OAuth consent screen";

  return (
    <UploadShell durationInFrames={DUR} step="STEP 02" kicker="OAUTH · TEST USERS" title="Configure consent — add a test user" accent={COLORS.hi.violet}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
        <BrowserFrame url="console.cloud.google.com › OAuth consent" width={FRAME.w} height={FRAME.h}>
          <ConsentHeader label={headerLabel} />
          <div style={{ position: "relative", height: FRAME.h - 54 - 60 }}>
            {showA ? <div style={{ position: "absolute", inset: 0, opacity: frame > 176 ? interpolate(frame, [176, 188], [1, 0], { extrapolateRight: "clamp" }) : 1 }}><UserTypeView /></div> : null}
            {showC ? <TestUsersView /> : null}
          </div>
        </BrowserFrame>
      </AbsoluteFill>

      <MissBanner />

      <Sfx src="pop" at={8} volume={0.4} />
      <Sfx src="ui-pop.mp3" at={70} volume={0.4} />
      <Sfx src="processing" at={188} volume={0.4} durationInFrames={60} />
      <Sfx src="ding" at={338} volume={0.5} />

      <UploadCaptions cues={CUES} />
    </UploadShell>
  );
};

export const scene3: SceneDef = {
  id: "u3",
  index: 3,
  kicker: "STEP 02",
  title: "Configure consent — add a test user",
  accent: COLORS.hi.violet,
  durationInFrames: DUR,
  Component: Scene3,
};
