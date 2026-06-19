import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { springV } from "../../../shared-skills/anim";
import { typed } from "../ui";
import { Sfx } from "../../../shared-skills/audio";
import { UploadShell } from "../UploadShell";
import { UploadCaptions, Cue } from "../captions";
import type { SceneDef } from "../../../shared-skills/types";

const DUR = 238;
const T = COLORS.term;

const Prompt: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span>
    <span style={{ color: T.prompt }}>$ </span>
    {children}
  </span>
);

const Line: React.FC<{ show: boolean; color: string; children: React.ReactNode }> = ({ show, color, children }) =>
  show ? <div style={{ color, marginBottom: 10, opacity: 1 }}>{children}</div> : null;

const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = springV(frame, fps, { delay: 4, stiffness: 90, damping: 15 });
  const caretOn = Math.floor(frame / 14) % 2 === 0;

  // camera pulls back at the end to hand off to the browser
  const out = interpolate(frame, [196, 234], [1, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cmd1 = typed("pip install google-api-python-client google-auth-oauthlib", frame, 8, 34);
  const cmd2 = typed("python upload.py", frame, 78, 22);
  const started = typed("Upload process started 🚀", frame, 122, 20);

  return (
    <div
      style={{
        width: 1180,
        height: 560,
        transform: `scale(${0.92 + intro * 0.08}) scale(${out})`,
        opacity: interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        borderRadius: RADIUS.lg,
        background: T.bg,
        boxShadow: SHADOW.lg,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ height: 46, background: T.bgTop, display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: T.dim, marginLeft: 10 }}>zsh — youtube-auto-upload</span>
      </div>
      <div style={{ padding: "26px 30px", fontFamily: FONT.mono, fontSize: 23, lineHeight: 1.35 }}>
        <Line show={frame >= 8} color={T.text}>
          <Prompt>
            <span style={{ color: T.text }}>{cmd1}</span>
            {frame >= 8 && frame < 40 ? <span style={{ opacity: caretOn ? 1 : 0 }}>▋</span> : null}
          </Prompt>
        </Line>
        <Line show={frame >= 42} color={T.green}>✓ Successfully installed · 8 packages</Line>
        <Line show={frame >= 58} color={T.green}>✓ client_secrets.json detected</Line>
        <Line show={frame >= 70} color={T.dim}>──────────────────────────────</Line>
        <Line show={frame >= 78} color={T.text}>
          <Prompt>
            <span style={{ color: T.text }}>{cmd2}</span>
            {frame >= 78 && frame < 110 ? <span style={{ opacity: caretOn ? 1 : 0 }}>▋</span> : null}
          </Prompt>
        </Line>
        <Line show={frame >= 122} color={T.yellow}>
          ▶ {started}
          {frame >= 122 && frame < 170 ? <span style={{ opacity: caretOn ? 1 : 0 }}>▋</span> : null}
        </Line>
        <Line show={frame >= 168} color={T.blue}>→ Opening browser for authorization{".".repeat(1 + (Math.floor(frame / 12) % 3))}</Line>
      </div>
    </div>
  );
};

const CUES: Cue[] = [
  { id: "u5-c1", from: 14, dur: 50, text: "Environment ready." },
  { id: "u5-c2", from: 70, dur: 160, text: "Start the upload script — it opens your browser for the final authorization." },
];

export const Scene5: React.FC = () => (
  <UploadShell durationInFrames={DUR} step="STEP 04" kicker="TERMINAL" title="Install & launch the upload script" accent={COLORS.teal}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50 }}>
      <Terminal />
    </AbsoluteFill>

    <Sfx src="pop" at={4} volume={0.4} />
    <Sfx src="typing" at={8} volume={0.4} durationInFrames={34} />
    <Sfx src="ding" at={42} volume={0.35} />
    <Sfx src="ding" at={58} volume={0.35} />
    <Sfx src="typing" at={78} volume={0.4} durationInFrames={32} />
    <Sfx src="processing" at={122} volume={0.45} durationInFrames={70} />

    <UploadCaptions cues={CUES} />
  </UploadShell>
);

export const scene5: SceneDef = {
  id: "u5",
  index: 5,
  kicker: "STEP 04",
  title: "Install & launch the upload script",
  accent: COLORS.teal,
  durationInFrames: DUR,
  Component: Scene5,
};
