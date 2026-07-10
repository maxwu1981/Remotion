/**
 * Placeholder content for the Roadmap + PromptGem scenes below. Replace every
 * value when you copy this template into a real video.
 */
import { COLORS } from "../../shared-skills/theme";
import type { RoadmapStop } from "../../shared-skills/components/Roadmap";
import type { GemContent } from "../../shared-skills/components/PromptGem";

export const ROADMAP: RoadmapStop[] = [
  { n: 1, emoji: "1️⃣", zh: "Replace: stop one", sub: "one-line detail", color: COLORS.hi.blue },
  { n: 2, emoji: "2️⃣", zh: "Replace: stop two", sub: "one-line detail", color: COLORS.hi.violet },
  { n: 3, emoji: "3️⃣", zh: "Replace: stop three", sub: "one-line detail", color: COLORS.hi.sky },
  { n: 4, emoji: "💎", zh: "帶走：今日提示詞", sub: "可複製、帶回家就能用", color: COLORS.hi.amber, gem: true },
];
export const ROADMAP_KEY = "看到最後，還有一份可以直接複製的提示詞帶回家。";

export const GEM: GemContent = {
  label: "今日提示詞",
  labelEn: "Prompt of the Day",
  hint: "Replace: where the viewer should paste this",
  prompt: "Replace me with the exact prompt viewers should copy.",
  why: "Replace me: one sentence on why the prompt is phrased this way.",
  variant: "Replace me: one variant for a different situation.",
  save: "完整提示詞在資訊欄 · 每支影片都留一個給你 ⭐",
};
