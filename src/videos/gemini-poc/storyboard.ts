/**
 * gemini-poc 分鏡 spec — 資料驅動「Google Flow(Veo 3.1) 生影片 → Remotion 串接」試作片。
 *
 * 流程：在 Flow 建一個「Little Helper」角色 → 每個 shot 把該角色「附進提示當參考」(鎖一致性)
 * → 打 motionPromptEn 生 clip → 下載 → Remotion 串接、疊 edge-tts 旁白(script) + BGM。
 *
 * 規則(2026-06-25)：
 * - 一致性：必把 Flow「角色實體」附進提示(composer「+」→ 選 Little Helper 人物 → 添加到提示)。
 *   光用文字點名角色 Veo 會飄掉(第一次自己長出天線+胸燈)。
 * - 長度：Veo 單次生成≈8s，但「不綁死 8s」——逐 shot 判斷；需要長連續鏡頭就用 Flow extend 接段。
 * - 提示詞一律英文；畫面內不放中文(避免亂碼)，中文走 Remotion 字幕。
 */
import { z } from "zod";

/** 一個鏡頭。鎖一致性靠「Flow 角色實體當參考」(見檔頭規則)，refImage 僅文件/Remotion 用、不是 Veo 鎖定來源。 */
export const Shot = z.object({
  id: z.string(), // 如 "s1"
  refImage: z.string(), // public/ 下參考圖路徑(文件用)
  motionPromptEn: z.string(), // 給 Veo 的英文運鏡提示
  voCue: z.string(), // 對應 script 的旁白 cue id
  /** 目標長度(秒)。非硬上限：Veo 單次≈8s，>8s 用 Flow extend 接段；逐 shot 判斷。 */
  targetSec: z.number(),
  /** 生成狀態：done=好 take 已下載 / wip=生成中 / todo=未生。 */
  status: z.enum(["done", "wip", "todo"]).default("todo"),
  /** 長度/做法備註(逐 shot 判斷的依據)。 */
  note: z.string().optional(),
});
export type Shot = z.infer<typeof Shot>;

export const Storyboard = z.object({
  id: z.string(),
  title: z.string(),
  style: z.string(),
  /** 定妝主圖提示詞(生一張滿意的當 master，之後每個 shot 都餵它維持一致性)。 */
  masterPrompt: z.string(),
  /** master 之外的表情/角度/場景參考圖提示詞(都餵 master 當參考再變化)。 */
  refPrompts: z.record(z.string(), z.string()),
  /** 旁白文字：cue id → 中文句子(同時當字幕)。edge-tts 用同一批 id。 */
  script: z.record(z.string(), z.string()),
  shots: z.array(Shot).min(1),
});
export type Storyboard = z.infer<typeof Storyboard>;

/* ──────────────────────────────────────────────────────────────── */

export const GEMINI_POC: Storyboard = {
  id: "gemini-poc",
  title: "AI 小幫手｜一開機就上工",
  style: "3D Pixar-style, soft global illumination, glossy rounded surfaces, teal+orange channel accents",

  masterPrompt:
    "3D Pixar-style character illustration, soft global illumination, glossy rounded surfaces. " +
    "A cute small desk robot assistant named Little Helper: a rounded white glossy egg-shaped body, " +
    "a single large friendly screen-face glowing soft cyan/teal, two small floating rounded arms, " +
    "a subtle warm orange accent light strip. Big expressive cartoon eyes on the screen-face, gentle happy expression. " +
    "Sitting on a clean modern wooden desk, soft warm room lighting, plain softly-blurred background. " +
    "Highly consistent character design, recurring mascot, high resolution, no text, no logo.",

  refPrompts: {
    "expr-happy":
      "Same Little Helper robot, front view, bright happy expression, one little arm raised in a thumbs-up.",
    "expr-focused":
      "Same Little Helper robot, three-quarter view, focused/curious expression, leaning toward a screen.",
    "angle-side":
      "Same Little Helper robot, side profile view, neutral friendly expression.",
    "scene-desk":
      "Empty establishing shot of the same clean modern wooden desk with a soft warm desk lamp and a faint translucent holographic screen, no robot, plain blurred background. Matches the Little Helper scene lighting.",
  },

  // 每句 ~15–20 中文字，edge-tts 約 5–7 秒。先跑 edge-tts 量出每句實際秒數，再回頭定每 shot targetSec。
  script: {
    s1: "這是我的 AI 小幫手，一開機就準備上工。",
    s2: "丟給它一個任務，它馬上看懂、立刻動手。",
    s3: "再雜的活，它都能同時並行處理。",
    s4: "搞定，比個讚——這就是 AI 幫你省力的樣子。",
  },

  shots: [
    {
      id: "s1",
      refImage: "gemini-clips/gemini-poc/refs/master.png",
      // 實際生成版(已下載 shots/s1.mp4)：從亮場立繪起手「揮手打招呼」，非原本的暗場開機。
      motionPromptEn:
        "Animate the Little Helper character, keeping its design identical. It looks at the camera, blinks its " +
        "big cyan eyes, gives a cheerful little wave with one floating arm, and tilts its head with a happy smile. " +
        "Gentle slow camera push-in. Smooth cinematic 3D Pixar animation, warm desk lighting.",
      voCue: "s1",
      targetSec: 8,
      status: "done",
      note: "好 take 已下載 public/gemini-clips/gemini-poc/shots/s1.mp4 (720×1280, 8.0s)。不重做。",
    },
    {
      id: "s2",
      // PoC：用 master 當 seed，focused 表情交給運鏡提示驅動（一致性更穩、省額度）。
      refImage: "gemini-clips/gemini-poc/refs/master.png",
      motionPromptEn:
        "The same white Pixar-style desk robot turns toward a floating translucent holographic screen filled " +
        "with glowing code and task cards. It reaches out a little arm and taps the hologram, which brightens " +
        "with a soft ripple. Curious focused expression on its cyan screen-face. Gentle orbiting camera. " +
        "Smooth 3D Pixar animation, warm and cool light mix.",
      voCue: "s2",
      targetSec: 8,
      status: "done",
      note: "好 take 已下載 shots/s2.mp4 (720×1280, 8.0s)。轉向→右側冒全息螢幕→伸手點按→收回笑臉，角色一致。前一批兩 take 失敗(且沒附角色實體)，重生時務必附 Little Helper 角色實體。",
    },
    {
      id: "s3",
      refImage: "gemini-clips/gemini-poc/refs/master.png",
      motionPromptEn:
        "The same white Pixar-style desk robot works quickly as several glowing holographic panels swirl " +
        "around it in parallel. Its little arms move fast, and a circular progress ring fills with orange light " +
        "around it. Determined yet cheerful expression. Subtle motion blur, dynamic but smooth. " +
        "3D Pixar animation.",
      voCue: "s3",
      targetSec: 8,
      status: "done",
      note: "好 take 已下載 shots/s3.mp4 (720×1280, 8.0s)。多個全息面板環繞 + 橘色進度環成形 + 雙手忙碌，正對『並行處理』。原生 8s 已足，未 extend。",
    },
    {
      id: "s4",
      refImage: "gemini-clips/gemini-poc/refs/expr-happy.png",
      motionPromptEn:
        "The same white Pixar-style desk robot finishes its task; a large green checkmark appears on the " +
        "holographic screen behind it. The robot turns to the camera, bounces happily, and raises one little arm " +
        "in a thumbs-up. Bright satisfying lighting. Slow push-in to its happy cyan screen-face. " +
        "3D Pixar animation.",
      voCue: "s4",
      targetSec: 8,
      status: "done",
      note: "好 take 已下載 shots/s4.mp4 (720×1280, 8.0s)。背後綠勾亮起→轉向鏡頭→大笑臉→比讚→推近定格，正對收尾。原生 8s 已足。",
    },
  ],
};
