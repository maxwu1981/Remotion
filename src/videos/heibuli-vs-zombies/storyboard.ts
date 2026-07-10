/**
 * heibuli-vs-zombies 分鏡 spec — 黑布哩 (Black Buly) 大戰殭屍/骷髏戰士，最後打贏僵屍王｜純配樂英雄蒙太奇 9:16。
 *
 * 做法(2026-06-25 拍板)：走 veo-reel — Google Flow(Veo 3.1 Fast) 一段段生 AI 影片 → Remotion 串接。
 * - 無旁白：純配樂(英雄/冒險感) + 音效；沒有 edge-tts script；caption 為「可選」螢幕短字，預設可不顯示。
 * - 一致性鐵則：必把 Flow「黑布哩角色實體」附進每個提示當參考(composer「+」→ 選人物 → 添加到提示)。
 *   光用文字點名 Veo 會飄(毛量/觸角顏色/球鞋會亂)。角色實體用 refs/master.jpg 建。
 * - 提示詞一律英文；畫面內不放中文。封面/結尾卡走 Remotion(用 master.jpg)，不燒 Flow 點數。
 * - 調性：可愛卡通、不血腥、family-friendly(萬聖節卡通風殭屍/骷髏)，黑布哩仍保持萌但變身打怪英雄。
 * - 長度不綁死 8s：Veo 單次≈8s，逐 shot 判斷；本片每段原生 8s 即可。
 *
 * 故事弧：陰森墓地殭屍湧出 → 迎戰骷髏小兵 → 滾球破陣 → 撿武器/觸角充能 → 僵屍王登場 → 閃躲 → 終擊 → 黎明勝利。
 * 結構：Remotion 封面卡(~2s) → 11 段 Veo 蒙太奇 → Remotion 結尾卡(~3s) ≈ 90s。
 */
import { z } from "zod";

export const Shot = z.object({
  id: z.string(), // "s1"…"s11"
  beat: z.string(), // 這段的故事節拍(中文，文件用)
  motionPromptEn: z.string(), // 給 Veo 的英文運鏡提示(已含黑布哩定妝鎖定句)
  caption: z.string(), // 可選的螢幕短字(預設可不顯示)
  pose: z.string(), // 取自四動作表的主要姿態
  targetSec: z.number(),
  status: z.enum(["done", "wip", "todo"]).default("todo"),
  note: z.string().optional(),
});
export type Shot = z.infer<typeof Shot>;

export const Storyboard = z.object({
  id: z.string(),
  title: z.string(),
  style: z.string(),
  /** 黑布哩定妝描述：建 Flow 角色實體 + 每個 motion prompt 開頭都鎖這串特徵。 */
  masterPrompt: z.string(),
  shots: z.array(Shot).min(1),
});
export type Storyboard = z.infer<typeof Storyboard>;

/* ──────────────────────────────────────────────────────────────── */

/** 黑布哩外型鎖定句(每個 shot 提示開頭都帶這串，防 Veo 飄)。 */
const LOCK =
  "Animate this exact Black Buly character, keeping its design 100% identical: a small round ball-shaped " +
  "creature fully covered in shaggy spiky soft black fur, two very large round bright-yellow eyes with small " +
  "black pupils, a tiny mouth, two soft curving antennae on top of its head — the left one RED with horizontal " +
  "stripes, the right one BLUE-TEAL with dark polka dots — and tiny sneakers on its little feet, one red and " +
  "one blue. Brave, bouncy, heroic little hero. Cute family-friendly cartoon, non-gory, no blood. ";

export const HEIBULI_VS_ZOMBIES: Storyboard = {
  id: "heibuli-vs-zombies",
  title: "黑布哩｜大戰僵屍王",
  style:
    "3D animated children's-movie style, fluffy textured fur rendering, cinematic spooky-but-cute Halloween " +
    "cartoon mood, moonlit graveyard, teal-and-purple night palette with warm hero rim-light, dynamic action " +
    "camera, family-friendly and non-gory.",

  masterPrompt:
    "3D animated children's-movie style, fluffy textured fur rendering, soft cinematic lighting. " +
    "A small round creature named Black Buly: a ball-shaped body fully covered in shaggy spiky soft black fur, " +
    "two very large round bright-yellow eyes with small black pupils, a small mouth, two soft curving antennae on " +
    "top of its head — the left one red with horizontal stripes, the right one blue-teal with dark polka dots — " +
    "wearing tiny sneakers, one red and one blue. Brave and adorable little hero. " +
    "Plain softly-blurred background, full body in frame. Highly consistent recurring mascot, high resolution, no text, no logo.",

  shots: [
    {
      id: "s1",
      beat: "陰森開場：墓地殭屍湧出",
      pose: "好奇觀察 (Curious Observe)",
      caption: "夜色降臨…",
      motionPromptEn:
        LOCK +
        "Black Buly stands alone in a moonlit foggy cartoon graveyard as cute cartoon zombies and skeletons slowly " +
        "rise from the ground all around, dirt crumbling. Black Buly's big yellow eyes widen and its antennae perk up " +
        "alertly as it braces into a brave stance. Slow ominous push-in, drifting fog, teal moonlight. " +
        "Smooth cinematic 3D animation, spooky-but-cute, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s2",
      beat: "第一個骷髏戰士逼近",
      pose: "沉思等待 (Contemplative Wait)",
      caption: "",
      motionPromptEn:
        LOCK +
        "A cartoon skeleton warrior holding a sword marches toward Black Buly through the graveyard. Black Buly " +
        "lowers into a ready fighting stance, narrows its eyes confidently, and its antennae twitch. Tension builds. " +
        "Slow side dolly between hero and skeleton, dramatic moonlight rim-light. " +
        "Smooth cinematic 3D animation, family-friendly, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s3",
      beat: "閃身撲擊、骷髏散架",
      pose: "騰躍跳躍 (Pounce & Jump)",
      caption: "閃！",
      motionPromptEn:
        LOCK +
        "Black Buly nimbly dodges the skeleton warrior's sword swing, then pounces and headbutts it. The cartoon " +
        "skeleton harmlessly clatters apart into a pile of bones (non-gory, comedic). Black Buly lands proudly, " +
        "antennae bouncing. Fast dynamic tracking camera with the leap, motion blur. " +
        "Smooth cinematic 3D action animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s4",
      beat: "縮成毛球滾過殭屍陣",
      pose: "淘氣滾動 (Playful Roll)",
      caption: "衝啊！",
      motionPromptEn:
        LOCK +
        "Black Buly curls into a fast-spinning fuzzy ball and rolls like a bowling ball straight through a line of " +
        "cartoon zombies, scattering them harmlessly in all directions (slapstick, non-gory). It pops back upright " +
        "at the end, grinning. Low fast tracking camera following the roll, debris flying. " +
        "Smooth cinematic 3D action animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s5",
      beat: "撿起發光武器、英雄擺架",
      pose: "騰躍跳躍 (Pounce & Jump)",
      caption: "",
      motionPromptEn:
        LOCK +
        "Black Buly grabs a glowing magical sword stuck in the ground, lifts it overhead with both little arms, and " +
        "strikes a heroic pose as it glows brighter. Cartoon zombies hesitate and step back. Low heroic hero-shot " +
        "angle, dramatic glow lighting it from below. Smooth cinematic 3D animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s6",
      beat: "被群骷髏包圍、旋身橫掃",
      pose: "淘氣滾動 (Playful Roll)",
      caption: "",
      motionPromptEn:
        LOCK +
        "Black Buly is surrounded by a circle of cartoon skeleton warriors. It spins rapidly with the glowing sword, " +
        "knocking several of them apart into clattering bones in one sweeping flurry (comedic, non-gory). Antennae fly " +
        "with the spin. Orbiting action camera around the spinning hero. Smooth cinematic 3D action animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s7",
      beat: "觸角充能、蓄力",
      pose: "沉思等待 (Contemplative Wait)",
      caption: "蓄力中…",
      motionPromptEn:
        LOCK +
        "Black Buly plants its feet and charges up: its red and blue antennae begin to glow brightly with crackling " +
        "magical energy, swirling light gathering around its body, fur rippling from the power. Determined fierce " +
        "expression. Slow dramatic push-in, intense glowing rim-light. Smooth cinematic 3D animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s8",
      beat: "僵屍王登場(巨大威脅)",
      pose: "好奇觀察 (Curious Observe)",
      caption: "僵屍王！",
      motionPromptEn:
        LOCK +
        "A huge menacing cartoon Zombie King — a giant hulking crowned zombie monster with a tattered cape — looms " +
        "over tiny Black Buly, roaring. Black Buly looks up bravely, tiny but unafraid, antennae glowing. Extreme " +
        "low-angle scale contrast, the King filling the top of frame, lightning flicker. " +
        "Smooth cinematic 3D animation, epic spooky-but-cute, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s9",
      beat: "閃躲僵屍王重擊",
      pose: "騰躍跳躍 (Pounce & Jump)",
      caption: "",
      motionPromptEn:
        LOCK +
        "The Zombie King smashes both fists down; Black Buly leaps high to dodge as the ground cracks and rubble " +
        "bursts up where it stood. Black Buly bounces off a flying tombstone and somersaults through the air, glowing " +
        "antennae trailing light. Fast dynamic action camera tracking the leap, debris and dust. " +
        "Smooth cinematic 3D action animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s10",
      beat: "終極一擊、僵屍王崩解",
      pose: "騰躍跳躍 (Pounce & Jump)",
      caption: "終結！",
      motionPromptEn:
        LOCK +
        "Black Buly unleashes its final attack: it dives down and slams the glowing sword into the Zombie King in a " +
        "huge burst of radiant light. The cartoon Zombie King staggers, its crown falls, and it harmlessly crumbles " +
        "into a swirl of dust and sparkles (non-gory, magical). Big bright energy shockwave. " +
        "Epic slow-motion impact then snap to normal speed. Smooth cinematic 3D action animation, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
    {
      id: "s11",
      beat: "黎明勝利",
      pose: "騰躍跳躍 (Pounce & Jump)",
      caption: "勝利！",
      motionPromptEn:
        LOCK +
        "Victory at dawn: Black Buly stands triumphantly atop the fallen Zombie King's crown as the sun rises and the " +
        "graveyard fog clears. It throws its little arms up, antennae high, and bounces with a joyful cheer. Warm " +
        "golden sunrise light floods the scene. Slow celebratory pull-back to a heroic wide shot. " +
        "Smooth cinematic 3D animation, triumphant warm lighting, vertical 9:16.",
      targetSec: 8,
      status: "todo",
    },
  ],
};
