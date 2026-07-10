import React from "react";
import { ExplainerObsidian, ExplainerObsidianThumb, explainerObsidianFrames } from "../_explainer/ExplainerObsidian";
import { ACC } from "../_explainer/obsidian-glass";
import spec from "../_explainer/specs/claude-code-agent-view.json";
import voManifest from "../_explainer/specs/claude-code-agent-view.vo.json";
import type { VideoSpec } from "../_explainer/schema";

/**
 * Claude Code Agent View（背景代理）黑曜石深度教學版（16:9, 1920×1080, 30fps）。
 * 資料驅動：讀 _explainer/specs/claude-code-agent-view.json + 同名 vo.json + VO(public/vo/claude-code-agent-view)。
 * 視覺沿用通用 ExplainerObsidian（跟 claude-code-md-memory 同一套黑曜石語言），
 * 只在這層加這支片專屬的概念錨頂帶 + 品牌膠囊字樣 + BGM。
 */
const SPEC = spec as unknown as VideoSpec;
const VO = voManifest as Record<string, number>;

/** 每景頂帶「概念錨」，index 對 scenes（cover/places/pipeline/terminal/outro）；封面與 outro 不顯示。 */
const OS: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACC.emberSoft }}>{children}</span>;
const ANCHORS: (React.ReactNode | null)[] = [
  null,
  <>一次一個任務 = <OS>效率被自己卡住</OS></>,
  <>claude agents = <OS>一畫面同時派工</OS></>,
  <>背景任務 = <OS>自動 git worktree 隔離</OS></>,
  null,
];

export const claudeCodeAgentViewObsidianFrames = () => explainerObsidianFrames(SPEC, VO);

export const ClaudeCodeAgentViewObsidian: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <ExplainerObsidian
    spec={SPEC}
    vo={VO}
    voDir="vo/claude-code-agent-view"
    anchors={ANCHORS}
    kickerLabel="Claude Code 深度教學"
    bgmSrc={bgm ? "bgm-claude-code-agent-view.mp3" : undefined}
  />
);

export const ClaudeCodeAgentViewThumb: React.FC = () => (
  <ExplainerObsidianThumb spec={SPEC} kickerLabel="Claude Code 深度教學" />
);
