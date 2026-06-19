import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, TYPE } from "../../../shared-skills/theme";
import { appearScale, appearUp, enter } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import {
  ArrowIcon,
  BrainIcon,
  DocIcon,
  FilmIcon,
  MicIcon,
  PlayIcon,
  TerminalIcon,
  WaveIcon,
} from "../mockups/icons";
import { RecordLogo } from "../../../shared-skills/components/logos";

const IDS = ["s3-c1", "s3-c2", "s3-c3", "s3-c4", "s3-c5", "s3-c6", "s3-c7", "s3-c8"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

type Step = {
  icon: React.ReactNode;
  label: string;
  cmd?: string;
  color: string;
  show: number;
  hero?: boolean;
};

const NODE_W = 168;
const ARROW_W = 46;

const StepNode: React.FC<{ step: Step }> = ({ step }) => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, step.show, 16, 0.86);
  const glow = step.hero && frame >= step.show;
  return (
    <div style={{ width: NODE_W, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...a }}>
      <div
        style={{
          width: step.hero ? 76 : 60,
          height: step.hero ? 76 : 60,
          borderRadius: "50%",
          background: step.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: glow ? `0 0 0 6px ${step.color}22, 0 12px 28px ${step.color}66` : `0 8px 20px ${step.color}40`,
        }}
      >
        {step.icon}
      </div>
      <div style={{ textAlign: "center", lineHeight: 1.2 }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{step.label}</div>
        {step.cmd ? (
          <div style={{ fontFamily: FONT.mono, fontSize: 13, color: COLORS.muted, marginTop: 3 }}>{step.cmd}</div>
        ) : null}
      </div>
    </div>
  );
};

const Arrow: React.FC<{ show: number; color?: string }> = ({ show, color = COLORS.faint }) => {
  const frame = useCurrentFrame();
  const o = enter(frame, show - 6, 12);
  return (
    <div style={{ width: ARROW_W, display: "flex", alignItems: "center", justifyContent: "center", opacity: o, marginBottom: 30 }}>
      <ArrowIcon size={26} color={color} strokeWidth={2.4} />
    </div>
  );
};

const Lane: React.FC<{ steps: Step[]; top: number; arrowColor: string }> = ({ steps, top, arrowColor }) => (
  <div style={{ position: "absolute", left: 232, top, display: "flex", alignItems: "center" }}>
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        {i > 0 ? <Arrow show={s.show} color={arrowColor} /> : null}
        <StepNode step={s} />
      </React.Fragment>
    ))}
  </div>
);

const RouteHeader: React.FC<{ tag: string; title: string; color: string; top: number; show: number }> = ({
  tag,
  title,
  color,
  top,
  show,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 96, top, ...appearUp(frame, show, 14, 18) }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <span
          style={{
            padding: "5px 13px",
            borderRadius: RADIUS.pill,
            background: `${color}1A`,
            color,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: TYPE.tiny,
            letterSpacing: 1,
          }}
        >
          {tag}
        </span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, maxWidth: 120 }}>
          {title}
        </span>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const routeA: Step[] = [
    { icon: <RecordLogo size={30} />, label: "OBS 錄影", color: COLORS.hi.sky, show: at(2) },
    { icon: <MicIcon size={26} color="#fff" />, label: "CapCut 配音", color: "#111317", show: at(2) + 12 },
    { icon: <FilmIcon size={26} color="#fff" />, label: "screen.mp4", color: COLORS.hi.violet, show: at(2) + 24 },
    { icon: <WaveIcon size={26} color="#fff" />, label: "語音轉文字", cmd: "transcribe", color: "#10A37F", show: at(3) },
    { icon: <DocIcon size={24} color="#fff" />, label: "微調設定", cmd: "episode.json", color: COLORS.hi.amber, show: at(4) },
    { icon: <TerminalIcon size={26} color="#fff" />, label: "算繪輸出", cmd: "render", color: COLORS.hi.emerald, show: at(4) + 14 },
    { icon: <PlayIcon size={24} color="#fff" />, label: "雙格式", color: COLORS.remotion, show: at(4) + 28 },
  ];
  const routeB: Step[] = [
    { icon: <RecordLogo size={30} />, label: "OBS 錄影", color: COLORS.hi.sky, show: at(6) },
    { icon: <FilmIcon size={26} color="#fff" />, label: "screen.mp4", color: COLORS.hi.violet, show: at(6) + 12 },
    { icon: <DocIcon size={24} color="#fff" />, label: "episode.json", color: COLORS.hi.amber, show: at(6) + 24 },
    { icon: <BrainIcon size={30} color="#fff" />, label: "AI 自動配音", cmd: "narrate", color: COLORS.claude, show: at(6) + 40, hero: true },
    { icon: <TerminalIcon size={26} color="#fff" />, label: "算繪輸出", cmd: "render", color: COLORS.hi.emerald, show: at(7) },
    { icon: <PlayIcon size={24} color="#fff" />, label: "雙格式", color: COLORS.remotion, show: at(7) + 16 },
  ];

  return (
    <SceneShell kicker="03 / 09" title="每日工作流程" accent={COLORS.hi.violet} durationInFrames={DUR}>
      <RouteHeader tag="ROUTE A" title="手動配音" color={COLORS.hi.sky} top={336} show={at(1)} />
      <Lane steps={routeA} top={356} arrowColor={COLORS.hi.sky} />

      {/* divider */}
      <div style={{ position: "absolute", left: 96, right: 96, top: 560, height: 1, background: COLORS.border }} />

      <RouteHeader tag="ROUTE B" title="全自動 AI 配音" color={COLORS.claude} top={648} show={at(5)} />
      <Lane steps={routeB} top={668} arrowColor={COLORS.claude} />

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "03 / 09",
  title: "每日工作流程",
  accent: COLORS.hi.violet,
  durationInFrames: DUR,
  Component: Scene3,
};
