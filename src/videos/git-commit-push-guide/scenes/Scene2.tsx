import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, FlowArrow, ramp } from "../components";
import { ChangedFile, CommitBox, GitHubCloud, PushArrow } from "../motifs";
import {
  MOTIF,
  S2_COMMIT_NOTE,
  S2_COMMIT_DESC,
  S2_PUSH_DESC,
  S2_KEY,
} from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s2-c1", "s2-c2", "s2-c3", "s2-c4", "s2-c5", "s2-c6", "s2-c7", "s2-c8", "s2-c9", "s2-c10", "s2-c11", "s2-c12", "s2-c13", "s2-c14"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

/** A titled metaphor panel (local vs cloud). */
const Panel: React.FC<{
  icon: string;
  title: string;
  color: string;
  desc: string;
  descAt: number;
  reveal: { opacity: number; transform: string };
  children: React.ReactNode;
}> = ({ icon, title, color, desc, descAt, reveal, children }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...reveal, width: 740, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${color}44`, boxShadow: SHADOW.lg, padding: "22px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 30 }}>{icon}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{title}</span>
      </div>
      <div style={{ height: 232, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      <div style={{ ...appearUp(frame, descAt, 14, 14), padding: "10px 18px", borderRadius: RADIUS.md, background: `${color}10`, border: `1px solid ${color}44` }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft, textAlign: "center" }}>{desc}</span>
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelsLeave = leave(frame, at(10) - 8, 14);
  const leftIn = appearUp(frame, at(1), 16, 22);
  const rightIn = appearUp(frame, at(7), 16, 22);

  // phase B — many commits, one push
  const deskIn = springPop(frame, fps, { delay: at(10), from: 0.7, dist: 22 });
  const boxDelays = [at(10) + 8, at(10) + 26, at(10) + 44];
  const pushP = ramp(frame, at(11), at(11) + 28);
  const cloudIn = springPop(frame, fps, { delay: at(11) + 4, from: 0.7, dist: 22 });

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.commit} kicker="02 · 用比喻理解" seed="s2">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <Heading zh="commit ＝ 存檔；push ＝ 上傳到雲端" en="commit = save locally · push = upload to the cloud" delay={at(0)} />
      </div>

      {/* Phase A — two-panel metaphor */}
      {frame < at(10) + 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 268, display: "flex", justifyContent: "center", gap: 40, opacity: panelsLeave, transform: `translateY(${(1 - panelsLeave) * -16}px)` }}>
          {/* local */}
          <Panel icon="🖥" title="你的電腦（本地）" color={MOTIF.local} desc={S2_COMMIT_DESC} descAt={at(6)} reveal={leftIn}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ ...appearUp(frame, at(2), 14, 16) }}>
                <ChangedFile name="login" w={104} edited label="改檔案" />
              </div>
              <div style={{ marginBottom: 30 }}>
                <FlowArrow width={70} thickness={3} color={COLORS.borderStrong} progress={ramp(frame, at(3), at(3) + 16)} />
              </div>
              <div style={{ ...appearUp(frame, at(3), 16, 18) }}>
                <CommitBox note={S2_COMMIT_NOTE} w={236} flag />
              </div>
            </div>
          </Panel>

          {/* cloud */}
          <Panel icon="☁️" title="GitHub 雲端" color={MOTIF.cloud} desc={S2_PUSH_DESC} descAt={at(9)} reveal={rightIn}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
              <div style={{ ...appearUp(frame, at(7), 14, 16) }}>
                <CommitBox w={150} flag={false} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <PushArrow h={150} progress={ramp(frame, at(8), at(8) + 24)} color={MOTIF.push} label="push" />
              </div>
              <div style={{ ...appearUp(frame, at(7) + 6, 14, 16), marginBottom: 6 }}>
                <GitHubCloud w={224} label="GitHub" sub="有備份" glow={0.6} ok={frame > at(8) + 24} />
              </div>
            </div>
          </Panel>
        </div>
      ) : null}

      {/* Phase B — many commits, one push */}
      {frame >= at(10) - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          {/* local desk with 3 piling commit boxes */}
          <div style={{ ...deskIn, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${MOTIF.local}33`, boxShadow: SHADOW.lg, padding: "20px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🖥</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>本地：連續 commit 好幾次</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
              {boxDelays.map((d, i) => (
                <div key={i} style={{ ...springPop(frame, fps, { delay: d, from: 0.6, dist: 20 }) }}>
                  <CommitBox w={150} flag label={`存檔 ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* one push up */}
          <div style={{ marginBottom: 18 }}>
            <PushArrow h={150} progress={pushP} color={MOTIF.push} label="最後一次 push" />
          </div>

          {/* cloud receives all */}
          <div style={{ ...cloudIn, marginBottom: 8 }}>
            <GitHubCloud w={280} label="GitHub 雲端" sub="一次全部上傳" glow={0.7} ok={pushP > 0.98} />
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
        <KeyLine text={S2_KEY} tone={MOTIF.commit} delay={at(12)} width={1420} />
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.3} />
      <Sfx src="pop" at={at(3)} volume={0.3} />
      <Sfx src="whoosh" at={at(8)} volume={0.32} />
      <Sfx src="pop" at={boxDelays[0]} volume={0.28} />
      <Sfx src="pop" at={boxDelays[1]} volume={0.28} />
      <Sfx src="pop" at={boxDelays[2]} volume={0.28} />
      <Sfx src="ding" at={at(11) + 24} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "02 · 用比喻理解",
  title: "Save locally vs upload to cloud",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Scene2,
};
