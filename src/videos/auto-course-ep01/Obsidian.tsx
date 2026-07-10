import React from "react";
import { ExplainerObsidian, ExplainerObsidianThumb, explainerObsidianFrames } from "../_explainer/ExplainerObsidian";
import { ACC } from "../_explainer/obsidian-glass";
import spec from "../_explainer/specs/auto-course-ep01.json";
import voManifest from "../_explainer/specs/auto-course-ep01.vo.json";
import type { VideoSpec } from "../_explainer/schema";

/**
 * 非工程師的 Claude 自動化課 EP01（旗艦跟操片，黑曜石版，16:9, 1920×1080, 30fps）。
 * 資料驅動：讀 _explainer/specs/auto-course-ep01.json + 同名 vo.json + VO(public/vo/auto-course-ep01)。
 * ⚠️ 2026-07-09 WIP：spec.scenes 目前只有 3 個 schema 原生場景（cover/CH2 places/CH8 outro）。
 * HOOK 成品秀、CH1/CH3/CH6/CH7 的留言泡泡卡+價目卡+檢核點卡+錯誤畫面演示、CH4/CH5 真實 Mac 錄屏、
 * CH4 Windows 重建段都還沒建——這支 comp 現在只能驗證已完成的片段，不是完整片。
 */
const SPEC = spec as unknown as VideoSpec;
const VO = voManifest as Record<string, number>;

const OS: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACC.emberSoft }}>{children}</span>;
/** 每景頂帶「概念錨」，index 對 spec.scenes（cover/CH1×2/CH2/CH3×3/CH6×3/CH7×4/outro）。 */
const ANCHORS: (React.ReactNode | null)[] = [
  null,
  <>會打字 = <OS>就夠了</OS></>,
  <>今天的目標 = <OS>裝好 ＋ 第一個自動化</OS></>,
  <>會動手的助手 = <OS>只有 Claude Code</OS></>,
  <>免費版 = <OS>不含 Claude Code</OS></>,
  <>撞牆 = <OS>不是壞掉，等重置</OS></>,
  <>省額度 = <OS>攢批交代，外掛別亂裝</OS></>,
  <>動檔案前 = <OS>一定先問你</OS></>,
  <>看不懂 = <OS>先按否</OS></>,
  <>來路不明的 skill = <OS>先別裝</OS></>,
  <>卡住急救 = <OS>四張卡就夠</OS></>,
  <>卡住急救 = <OS>四張卡就夠</OS></>,
  <>卡住急救 = <OS>四張卡就夠</OS></>,
  <>卡住急救 = <OS>四張卡就夠</OS></>,
  null,
];

export const autoCourseEp01ObsidianFrames = () => explainerObsidianFrames(SPEC, VO);

export const AutoCourseEp01Obsidian: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <ExplainerObsidian
    spec={SPEC}
    vo={VO}
    voDir="vo/auto-course-ep01"
    anchors={ANCHORS}
    kickerLabel="非工程師自動化課"
    bgmSrc={bgm ? "bgm-auto-course-ep01.mp3" : undefined}
  />
);

export const AutoCourseEp01Thumb: React.FC = () => (
  <ExplainerObsidianThumb spec={SPEC} kickerLabel="非工程師自動化課" />
);
