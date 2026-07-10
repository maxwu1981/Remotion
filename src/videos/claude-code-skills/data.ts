/**
 * Palette + content constants for the Claude Code Skills 實戰 video.
 * Colors come from the shared theme so the whole channel stays consistent.
 */
import { COLORS } from "../../shared-skills/theme";

/** Per-section accent colors. */
export const MOTIF = {
  install: COLORS.remotion, // intro / "what is a Skill"
  build: COLORS.success, // 經驗一 建一個 Skill
  trigger: COLORS.warn, // 經驗二 description 觸發
  lean: COLORS.hi.violet, // 經驗三 漸進式揭露
  place: COLORS.claude, // 經驗四 放哪裡
};

/** Verdict palette (✔ / ✘ / ⚠). */
export const PAL = {
  yes: COLORS.success,
  yesBg: COLORS.successBg,
  no: COLORS.error,
  noBg: COLORS.errorBg,
  warn: COLORS.warn,
  warnBg: COLORS.warnBg,
};

/** The four takeaways, echoed on the cover, the poster and the outro. */
export const OUTRO_CARDS = [
  "Skill ＝ 可重用技能說明書，放 .claude/skills/<name>/SKILL.md",
  "description 要寫「何時用＋觸發詞」，Claude 才會在對的時機載入",
  "SKILL.md 只留索引＋關鍵步驟，細節拆參考檔（漸進式揭露）",
  "全域 vs 專案 vs plugin — 放哪裡＝誰能用、能不能分享",
] as const;
