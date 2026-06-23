/** AccentKey → 實際色碼（取自共用 theme），讓 video-spec JSON 不用寫死色碼。 */
import { COLORS } from "../../shared-skills/theme";

export const ACCENT: Record<string, string> = {
  blue: COLORS.remotion,
  green: COLORS.success,
  warn: COLORS.warn,
  violet: COLORS.hi.violet,
  claude: COLORS.claude,
  teal: COLORS.teal,
};

export const accent = (k?: string): string => ACCENT[k ?? "blue"] ?? COLORS.remotion;

export const PAL = {
  yes: COLORS.success,
  yesBg: COLORS.successBg,
  no: COLORS.error,
  noBg: COLORS.errorBg,
  warn: COLORS.warn,
  warnBg: COLORS.warnBg,
};
