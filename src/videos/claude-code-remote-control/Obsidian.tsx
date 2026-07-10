import React from "react";
import { ExplainerObsidian, ExplainerObsidianThumb, explainerObsidianFrames } from "../_explainer/ExplainerObsidian";
import { ACC } from "../_explainer/obsidian-glass";
import spec from "../_explainer/specs/claude-code-remote-control.json";
import voManifest from "../_explainer/specs/claude-code-remote-control.vo.json";
import type { VideoSpec } from "../_explainer/schema";

/**
 * Claude Code Remote Control（手機遙控）黑曜石深度教學版（16:9, 1920×1080, 30fps）。
 * 資料驅動：讀 _explainer/specs/claude-code-remote-control.json + 同名 vo.json + VO(public/vo/claude-code-remote-control)。
 * 視覺沿用通用 ExplainerObsidian（跟 claude-code-agent-view 同一套黑曜石語言）。
 */
const SPEC = spec as unknown as VideoSpec;
const VO = voManifest as Record<string, number>;

/** 每景頂帶「概念錨」，index 對 scenes（cover/places/pipeline/terminal/outro）；封面與 outro 不顯示。 */
const OS: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACC.emberSoft }}>{children}</span>;
const ANCHORS: (React.ReactNode | null)[] = [
  null,
  <>工作綁死終端機 = <OS>離開座位就停擺</OS></>,
  <>claude remote-control = <OS>手機掃碼就接手</OS></>,
  <>跟 Dispatch 不同 = <OS>接續現有 session</OS></>,
  null,
];

export const claudeCodeRemoteControlObsidianFrames = () => explainerObsidianFrames(SPEC, VO);

export const ClaudeCodeRemoteControlObsidian: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <ExplainerObsidian
    spec={SPEC}
    vo={VO}
    voDir="vo/claude-code-remote-control"
    anchors={ANCHORS}
    kickerLabel="Claude Code 深度教學"
    bgmSrc={bgm ? "bgm-claude-code-remote-control.mp3" : undefined}
  />
);

export const ClaudeCodeRemoteControlThumb: React.FC = () => (
  <ExplainerObsidianThumb spec={SPEC} kickerLabel="Claude Code 深度教學" />
);
