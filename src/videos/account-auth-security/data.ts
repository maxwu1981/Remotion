/**
 * Palette + per-section accents for the 帳號授權安全 explainer.
 * Colours come from the shared theme so the whole channel stays consistent.
 */
import { COLORS } from "../../shared-skills/theme";

/** Per-section accent colours, keyed by section id. */
export const MOTIF = {
  intro: COLORS.remotion, // 封面 + 四角色總覽
  s1: COLORS.remotion, // 認證 vs 授權
  s2: COLORS.claude, // 密碼 = 萬能鑰匙
  s3: COLORS.teal, // OAuth = 制度
  s4: COLORS.success, // Token = 限定通行證（重點）
  s5: COLORS.warn, // 為什麼更安全（遛狗的人）
  s6: COLORS.hi.violet, // 旅館模型 — 角色互換（最精緻）
  s7: COLORS.hi.sky, // 兩種 token
  s8: COLORS.error, // CAPTCHA = 警衛
  s9: COLORS.hi.amber, // 只能你本人做
  s10: COLORS.claudeDeep, // Claude 能不能按 CAPTCHA
  outro: COLORS.remotion, // 一頁速查 + CTA
} as Record<string, string>;

/** Verdict palette (✔ / ✘ / ⚠). */
export const PAL = {
  yes: COLORS.success,
  yesBg: COLORS.successBg,
  no: COLORS.error,
  noBg: COLORS.errorBg,
  warn: COLORS.warn,
  warnBg: COLORS.warnBg,
};
