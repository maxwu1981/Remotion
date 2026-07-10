/**
 * Palette + small content constants for the Claude Code 安裝經驗 video.
 * Colors come from the shared theme so the whole channel stays consistent.
 */
import { COLORS } from "../../shared-skills/theme";

/** Per-section accent colors. */
export const MOTIF = {
  install: COLORS.remotion,
  node: COLORS.success,
  perm: COLORS.warn,
  path: COLORS.hi.violet,
  auth: COLORS.claude,
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
  "Node 先升到 18 以上，再用 npm 安裝",
  "權限錯誤別用 sudo，改用 nvm 最乾淨",
  "command not found ＝ PATH 沒設好，不是沒裝成功",
  "第一次要登入授權，做一次就記住",
] as const;
