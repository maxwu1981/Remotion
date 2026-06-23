/**
 * video-spec schema — 資料驅動「Explainer」影片的合約。
 *
 * 每日影片工廠每天只產出一份符合這個 schema 的 JSON（旁白 + 場景結構），
 * 交給 Explainer 模板算繪，**完全不需要每天寫新的 scene 程式碼**。
 *
 * 設計依據：claude-code-install / claude-code-skills 兩支已驗證的影片，
 * 把它們共通的「積木」抽象成 6 種場景區塊。
 */
import { z } from "zod";

/** 重點配色用語意 key（對映到 palette），讓 JSON 不用寫死色碼。 */
export const AccentKey = z.enum(["blue", "green", "warn", "violet", "claude", "teal"]);

/** 終端機/檔案面板的一行：指令 / 輸出 / 錯誤 / 成功 / 註解。 */
export const TermLine = z.object({
  k: z.enum(["cmd", "out", "err", "ok", "cmt"]),
  t: z.string(),
});
const Terminal = z.object({
  title: z.string().optional(), // 視窗標題，可放檔名如 ~/.claude/skills/pdf/SKILL.md
  lines: z.array(TermLine).min(1),
});

const Chip = z.object({ n: z.string().optional(), t: z.string(), accent: AccentKey.optional() });
const Stamp = z.object({
  kind: z.enum(["yes", "no", "warn"]),
  text: z.string(),
  atCue: z.number().int(), // 第幾句旁白出現（場景內 cue 索引）
});

/* ── 6 種場景區塊（type 區分）─────────────────────────────────────── */

/** 封面索引一列：序號徽章 + 名稱 + 一句 tag（給「盤點」型封面用）。 */
const IndexItem = z.object({ n: z.string(), title: z.string(), tag: z.string(), accent: AccentKey });

/** 封面：標題（前段 mono + 後段漸層）+ 可選終端機 + 4 顆數字 chip 或 N 項索引清單 + 標語/日期。 */
const CoverBlock = z.object({
  type: z.literal("cover"),
  titlePre: z.string(), // mono 部分，如 "Claude Code"
  titlePost: z.string(), // 漸層部分，如 "安裝經驗"
  terminal: Terminal.optional(),
  chips: z.array(Chip).max(4).optional(),
  index: z.array(IndexItem).max(8).optional(), // 「裝這 N 個就夠了」盤點索引清單
  cues: z.array(z.string()).min(1), // 旁白 cue id（封面通常 3 句）
});

/** 終端機/程式碼為主的教學場景：標題 + 終端機 + 可選 stamp/chip + 結論 keyline。 */
const TerminalBlock = z.object({
  type: z.literal("terminal"),
  kicker: z.string(),
  accent: AccentKey,
  headingZh: z.string(),
  headingEn: z.string().optional(),
  terminal: Terminal,
  stamps: z.array(Stamp).optional(),
  chips: z.array(Chip).optional(),
  keyline: z.string(), // 底部結論橫幅
  keylineAtCue: z.number().int().default(4),
  cues: z.array(z.string()).min(1),
});

/** 好/壞對照（兩張卡）：標題 + 左✘右✔ 各一段 code + 說明 + keyline。 */
const CompareBlock = z.object({
  type: z.literal("compare"),
  kicker: z.string(),
  accent: AccentKey,
  headingZh: z.string(),
  headingEn: z.string().optional(),
  bad: z.object({ badge: z.string(), code: z.string(), note: z.string() }),
  good: z.object({ badge: z.string(), code: z.string(), note: z.string() }),
  keyline: z.string(),
  keylineAtCue: z.number().int().default(5),
  cues: z.array(z.string()).min(1),
});

/** 並排選項（2–3 張）：每張 icon + 標題 + path/code + 「誰能用/說明」+ keyline。 */
const PlacesBlock = z.object({
  type: z.literal("places"),
  kicker: z.string(),
  accent: AccentKey,
  headingZh: z.string(),
  headingEn: z.string().optional(),
  items: z
    .array(z.object({ icon: z.string(), title: z.string(), path: z.string(), note: z.string(), accent: AccentKey }))
    .min(2)
    .max(3),
  keyline: z.string(),
  keylineAtCue: z.number().int().default(4),
  cues: z.array(z.string()).min(1),
});

/** 流程圖 pipeline：node → node → node 逐步建立（如 改檔案 → commit → push）。 */
const PipelineBlock = z.object({
  type: z.literal("pipeline"),
  kicker: z.string(),
  accent: AccentKey,
  headingZh: z.string(),
  headingEn: z.string().optional(),
  nodes: z
    .array(z.object({ icon: z.string(), label: z.string(), sub: z.string().optional(), accent: AccentKey.optional() }))
    .min(2)
    .max(6),
  keyline: z.string(),
  keylineAtCue: z.number().int().default(3),
  cues: z.array(z.string()).min(1),
});

/** 單張大圖/截圖；可在重點時「放大解說」(Ken Burns zoom) + callout 標註。 */
const ImageBlock = z.object({
  type: z.literal("image"),
  kicker: z.string(),
  accent: AccentKey,
  headingZh: z.string(),
  headingEn: z.string().optional(),
  src: z.string(), // public/ 下路徑，用 staticFile() 取
  caption: z.string().optional(),
  /** 放大解說：到第 atCue 句時鏡頭推進到 (x,y) 正規化座標(0–1)、放大到 scale 倍。 */
  focus: z
    .object({ x: z.number(), y: z.number(), scale: z.number(), atCue: z.number().int() })
    .optional(),
  /** 重點標註：到 atCue 句時，於 (x,y)(0–1) 顯示一個 callout 文字。 */
  annotations: z
    .array(z.object({ x: z.number(), y: z.number(), text: z.string(), atCue: z.number().int() }))
    .optional(),
  keyline: z.string().optional(),
  cues: z.array(z.string()).min(1),
});

/** 聚光卡：一卡＝一工具/項目。序號＋中文欄目 kicker、大英文名、彩色中文副標、說明、核心特點 bullets。 */
const SpotlightBlock = z.object({
  type: z.literal("spotlight"),
  no: z.string(), // 序號，如 "01"
  kicker: z.string(), // 中文欄目名，如 "視訊處理神器"
  accent: AccentKey,
  titleEn: z.string(), // 大英文名，如 "FFmpeg Skill"
  subZh: z.string(), // 彩色中文副標，如 "視訊剪輯 / 裁剪 / 壓縮 / 加字幕"
  desc: z.string(), // 灰色說明（1–2 行）
  bullets: z.array(z.string()).min(2).max(4), // 核心特點
  keyline: z.string().optional(), // 底部結論橫幅（可選）
  cues: z.array(z.string()).min(1),
});

/** 結尾：N 點總整理卡 + 感謝 + 訂閱/按讚/分享 CTA。 */
const OutroBlock = z.object({
  type: z.literal("outro"),
  headingZh: z.string().default("總整理"),
  headingEn: z.string().default("Recap"),
  cards: z.array(z.object({ emoji: z.string(), text: z.string(), accent: AccentKey })).min(2).max(5),
  cues: z.array(z.string()).min(1), // 1 句開場 + N 句卡片 + 1 句 CTA
});

/** 真實抱怨牆：真人逐字發言「泡泡」逐一彈出、疊滿螢幕（社會實證）。 */
const ComplaintItem = z.object({
  handle: z.string(), // 已部分屏蔽的帳號，如 "prashant****465"
  platform: z.string(), // 來源平台，如 "GitHub" / "Reddit" / "Substack"
  textEn: z.string(), // 真實逐字原文（英文）
  textZh: z.string(), // 小字中譯
  accent: AccentKey,
  x: z.number(), // 卡片左上角 x（0–1，相對 1920）
  y: z.number(), // 卡片左上角 y（0–1，相對 1080）
  rot: z.number().default(0), // 旋轉角度（製造亂貼的堆疊感）
  atCue: z.number().int(), // 第幾句旁白時彈出（場景內 cue 索引）
});
const ComplaintsBlock = z.object({
  type: z.literal("complaints"),
  kicker: z.string(),
  accent: AccentKey,
  headingZh: z.string(),
  headingEn: z.string().optional(),
  items: z.array(ComplaintItem).min(2).max(9),
  keyline: z.string().optional(),
  cues: z.array(z.string()).min(1),
});

export const SceneBlock = z.discriminatedUnion("type", [
  CoverBlock,
  TerminalBlock,
  CompareBlock,
  PlacesBlock,
  PipelineBlock,
  ImageBlock,
  SpotlightBlock,
  ComplaintsBlock,
  OutroBlock,
]);

/** 一支影片的完整 spec。 */
export const VideoSpec = z.object({
  id: z.string(), // kebab-case，如 "claude-code-install"
  brand: z.object({
    titlePre: z.string(),
    titlePost: z.string(),
    name: z.string(), // 頻道名，如 "Ai-Wisdom"（不是 "Ai-Wisdom-01"）
    handle: z.string().optional(), // 頻道 handle，如 "@aiwisdomcc"
    tagline: z.string(),
    date: z.string(),
  }),
  /** 旁白文字：cue id → 句子（同時當字幕）。VO manifest 用同一批 id。 */
  script: z.record(z.string(), z.string()),
  scenes: z.array(SceneBlock).min(2),
});

export type VideoSpec = z.infer<typeof VideoSpec>;
export type SceneBlock = z.infer<typeof SceneBlock>;
export type TermLine = z.infer<typeof TermLine>;
