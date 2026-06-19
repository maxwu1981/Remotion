import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, FlowArrow, ramp } from "../components";
import { ChangedFile, CommitBox, Laptop, GitHubCloud, PushArrow } from "../motifs";
import { MOTIF, S2_COMMIT_NOTE } from "../data";
import { BRAND } from "../brand";

const { cues: CUES, dur: DUR } = buildScene(["cv-c1", "cv-c2", "cv-c3"], { lead: 10, minDur: 300 });

export const Cover: React.FC = () => {
  const frame = useCurrentFrame();

  // Title is the hook (first beat); pipeline builds piece-by-piece beneath it.
  const title = appearUp(frame, 6, 20, 26);
  const fileIn = appearUp(frame, 26, 16, 22);
  const arrow1 = ramp(frame, 42, 58);
  const laptopIn = appearUp(frame, 52, 18, 24);
  const pushP = ramp(frame, 78, 104);
  const cloudIn = appearUp(frame, 92, 18, 24);
  const sub = appearUp(frame, 120, 18, 20);
  const date = appearUp(frame, 140, 16, 16);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={MOTIF.commit} seed="cover">
      {/* title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 132, textAlign: "center", ...title }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 96, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.08 }}>
          Git <span style={{ fontFamily: FONT.mono }}>commit</span> 與{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            <span style={{ fontFamily: FONT.mono }}>push</span>
          </span>
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 72, letterSpacing: -1, color: COLORS.inkSoft }}>
          新手指南
        </div>
      </div>

      {/* hero: 改檔案 → commit(在電腦裡) → push 上雲端 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 452, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <div style={{ ...fileIn }}>
          <ChangedFile name="login" w={150} label="改檔案" />
        </div>

        <div style={{ marginBottom: 40 }}>
          <FlowArrow width={84} thickness={3} color={COLORS.borderStrong} progress={arrow1} />
        </div>

        <div style={{ ...laptopIn }}>
          <Laptop w={430} label="你的電腦（本地）">
            <CommitBox note={S2_COMMIT_NOTE} w={300} flag={false} />
          </Laptop>
        </div>

        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 6 }}>
          <PushArrow h={140} progress={pushP} color={MOTIF.push} label="push" />
        </div>

        <div style={{ ...cloudIn, marginBottom: 24 }}>
          <GitHubCloud w={300} label="GitHub 雲端" sub="遠端 · 有備份" glow={0.6} ok={pushP > 0.98} />
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 878, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{BRAND.tagline}</span>
      </div>

      {/* date chip */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 952, display: "flex", justifyContent: "center", ...date }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 24px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: MOTIF.commit }} />
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>{BRAND.date}</span>
        </div>
      </div>

      <Sfx src="pop" at={26} volume={0.4} />
      <Sfx src="whoosh" at={52} volume={0.34} />
      <Sfx src="whoosh" at={78} volume={0.34} />
      <Sfx src="ding" at={104} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const cover: SceneDef = {
  id: "cv",
  index: 0,
  kicker: "封面 · Cover",
  title: "Cover",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Cover,
};
