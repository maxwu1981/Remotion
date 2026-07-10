/**
 * The whole video as data: every doc section → one scene spec that maps its
 * verbatim narration cues (ids in script.json) onto a layout. The narration text
 * is the single source of truth (script.json); here we only choose how each line
 * is shown and time the visual reveals.
 */
import { COLORS } from "../../shared-skills/theme";
import type { ArtKind } from "./components";

export type SceneKind = "text" | "bullets" | "metaphor" | "table" | "compare" | "flow" | "roleswap";

export type SceneSpec = {
  id: string;
  no?: string;
  titleZh: string;
  titleEn?: string;
  motif: string; // key into MOTIF
  kind: SceneKind;
  cueIds: string[];
  minDur?: number;

  /** metaphor: which illustration to draw beside the text. */
  art?: ArtKind;

  /** table: header + body cells (verbatim), plus optional reveal timing + framing. */
  table?: {
    cols: string[];
    rows: string[][];
    rowCueIdx?: number[]; // which cue index reveals each row (default: evenly spread)
    leadIdx?: number; // a cue shown as a lead line above the table
    keyText?: string; // a KeyLine shown under the table
    highlightCol0?: boolean;
  };
  /** table alt: a cards-variant of the same table, registered as a separate comp to choose from. */
  altCards?: { title: string; sub?: string; lines: string[]; accent: string }[];

  /** compare: two columns, each built from a set of cues. */
  compare?: {
    leadIdx?: number;
    left: { badge: string; tone: string; cueIdx: number[] };
    right: { badge: string; tone: string; cueIdx: number[] };
    keyIdx?: number;
  };

  /** flow: numbered steps built from cues. */
  flow?: { leadIdx?: number; stepIdx: number[]; keyIdx?: number[] };

  /** roleswap: the §6 hero diagram + text blocks below. */
  roleswap?: { hotel: string; guest: string; action: string; introIdx: number[]; bodyIdx: number[] };
};

export const SCENES: SceneSpec[] = [
  /* ---------------------------------------------------------------- overview */
  {
    id: "s0a",
    titleZh: "一張圖看懂四個角色",
    titleEn: "The four roles at a glance",
    motif: "intro",
    kind: "table",
    cueIds: ["s0-1", "s0-2", "s0-3"],
    minDur: 360,
    table: {
      cols: ["名詞", "比喻", "它回答的問題", "在你手上還是程式手上"],
      rows: [
        ["密碼 Password", "家裡的萬能鑰匙", "「你是哪個人？」", "永遠只在你身上，從不交出"],
        ["OAuth", "發鑰匙的整套流程／制度（旅館前台）", "「怎麼安全地給程式一把鑰匙？」", "一套規則，不是物件"],
        ["Token", "限定通行證（門禁卡／房卡）", "「這支程式能做哪些事？」", "在「被你授權的程式」手上"],
        ["CAPTCHA", "門口的警衛", "「你是真人，還是機器人？」", "一道關卡，不發鑰匙"],
      ],
      leadIdx: 0,
      keyText: "核心一句話：密碼證明你是誰、token 決定程式能做什麼、CAPTCHA 確認你是不是人。三者各管一件事，不能互相取代。",
    },
    altCards: [
      { title: "密碼 Password", sub: "家裡的萬能鑰匙", lines: ["問：你是哪個人？", "永遠只在你身上，從不交出"], accent: COLORS.claude },
      { title: "OAuth", sub: "發鑰匙的流程／制度（旅館前台）", lines: ["問：怎麼安全地給程式一把鑰匙？", "一套規則，不是物件"], accent: COLORS.teal },
      { title: "Token", sub: "限定通行證（門禁卡／房卡）", lines: ["問：這支程式能做哪些事？", "在「被你授權的程式」手上"], accent: COLORS.success },
      { title: "CAPTCHA", sub: "門口的警衛", lines: ["問：你是真人，還是機器人？", "一道關卡，不發鑰匙"], accent: COLORS.error },
    ],
  },
  {
    id: "s0b",
    titleZh: "兩套互補的比喻",
    titleEn: "Two complementary metaphors",
    motif: "intro",
    kind: "text",
    cueIds: ["s0b-1", "s0b-2"],
    minDur: 300,
  },

  /* ----------------------------------------------------------- 1 認證 vs 授權 */
  {
    id: "s1",
    no: "1",
    titleZh: "認證 vs 授權：先分清楚這兩個",
    titleEn: "Authentication vs Authorization",
    motif: "s1",
    kind: "text",
    cueIds: ["s1-1", "s1-2", "s1-3", "s1-4", "s1-5", "s1-6", "s1-7"],
  },
  {
    id: "s1b",
    no: "1.1",
    titleZh: "誤解一：認證就是密碼",
    titleEn: "False equality #1 — auth = password",
    motif: "s1",
    kind: "text",
    cueIds: ["s1b-1", "s1b-2", "s1b-3", "s1b-4"],
  },
  {
    id: "s1b2",
    no: "1.1",
    titleZh: "誤解二：授權就是 OAuth 發 token",
    titleEn: "False equality #2 — authz = OAuth issuing a token",
    motif: "s1",
    kind: "text",
    cueIds: ["s1b-5", "s1b-6", "s1b-7", "s1b-8", "s1b-9", "s1b-10"],
  },
  {
    id: "s1c",
    no: "1.2",
    titleZh: "用旅館比喻對齊這四個",
    titleEn: "Lining the four up with the hotel",
    motif: "s1",
    kind: "bullets",
    cueIds: ["s1c-1", "s1c-2", "s1c-3", "s1c-4"],
    minDur: 360,
  },

  /* ------------------------------------------------------- 2 密碼 = 萬能鑰匙 */
  {
    id: "s2",
    no: "2",
    titleZh: "密碼 = 萬能鑰匙",
    titleEn: "Password = the master key",
    motif: "s2",
    kind: "metaphor",
    art: "key",
    cueIds: ["s2-1", "s2-2", "s2-3", "s2-4", "s2-5", "s2-6", "s2-7"],
  },

  /* ------------------------------------------------------------- 3 OAuth 制度 */
  {
    id: "s3",
    no: "3",
    titleZh: "OAuth =「不必交出密碼，也能授權程式」的制度",
    titleEn: "OAuth — authorise without handing over the password",
    motif: "s3",
    kind: "flow",
    cueIds: ["s3-1", "s3-2", "s3-3", "s3-4", "s3-5", "s3-6", "s3-7"],
    flow: { leadIdx: 0, stepIdx: [1, 2, 3, 4], keyIdx: [5, 6] },
  },

  /* ---------------------------------------------------- 4 Token = 限定通行證 */
  {
    id: "s4a",
    no: "4.1",
    titleZh: "它故意「比密碼弱」，而這正是它的價值",
    titleEn: "Deliberately weaker than the password — that's the point",
    motif: "s4",
    kind: "bullets",
    cueIds: ["s4a-1", "s4a-2", "s4a-3", "s4a-4"],
    minDur: 420,
  },
  {
    id: "s4b",
    no: "4.2",
    titleZh: "一把 token 可包多種權限；要改權限就換一把",
    titleEn: "One token can carry many scopes; change scope = new token",
    motif: "s4",
    kind: "text",
    cueIds: ["s4b-1", "s4b-2", "s4b-3"],
    minDur: 320,
  },
  {
    id: "s4c",
    no: "4.3",
    titleZh: "鑰匙在程式手上，遙控器在你手上",
    titleEn: "The key is with the app; the remote is with you",
    motif: "s4",
    kind: "text",
    cueIds: ["s4c-1", "s4c-2", "s4c-3", "s4c-4"],
  },
  {
    id: "s4d",
    no: "4",
    titleZh: "三層分清楚",
    titleEn: "Three layers, kept apart",
    motif: "s4",
    kind: "bullets",
    cueIds: ["s4d-1", "s4d-2", "s4d-3"],
    minDur: 340,
  },

  /* --------------------------------------------------------- 5 為什麼更安全 */
  {
    id: "s5",
    no: "5",
    titleZh: "為什麼這樣「更安全」，而不是更危險？",
    titleEn: "Why this is safer, not riskier",
    motif: "s5",
    kind: "text",
    cueIds: ["s5-1", "s5-2", "s5-3"],
    minDur: 320,
  },
  {
    id: "s5b",
    no: "5",
    titleZh: "遛狗的人比喻",
    titleEn: "The dog-walker",
    motif: "s5",
    kind: "compare",
    cueIds: ["s5b-1", "s5b-2", "s5b-3", "s5b-4", "s5b-5"],
    art: "dog",
    compare: {
      leadIdx: 0,
      left: { badge: "只用密碼的方案", tone: COLORS.error, cueIdx: [1] },
      right: { badge: "token 方案", tone: COLORS.success, cueIdx: [2] },
      keyIdx: 4,
    },
  },

  /* ----------------------------------------------- 6 旅館模型（角色互換）★ */
  {
    id: "s6",
    no: "6",
    titleZh: "進階：旅館模型——多方關係與「角色會互換」",
    titleEn: "The hotel model — many parties, swapping roles",
    motif: "s6",
    kind: "metaphor",
    art: "hotel",
    cueIds: ["s6-1"],
    minDur: 300,
  },
  {
    id: "s6a",
    no: "6.1",
    titleZh: "先修一個關鍵誤解：「你」≠「你的 Google 帳號」",
    titleEn: "You ≠ your Google account",
    motif: "s6",
    kind: "table",
    cueIds: ["s6a-1", "s6a-2", "s6a-3", "s6a-4"],
    minDur: 460,
    table: {
      cols: ["角色", "對應"],
      rows: [
        ["主人（永遠是你）", "你這個人"],
        ["旅館", "Google、Facebook、Pinterest…（保管你某些資料的平台）"],
        ["房間", "你在那家平台的帳號／資料"],
        ["前台服務員", "OAuth（發房卡的制度）"],
        ["房卡", "token"],
        ["訪客", "來串接、想進去拿東西的程式（Claude Code、或互相登入時的 FB）"],
      ],
      leadIdx: 3,
    },
    altCards: [
      { title: "主人", sub: "永遠是你", lines: ["你這個人"], accent: COLORS.hi.violet },
      { title: "旅館", sub: "保管你某些資料的平台", lines: ["Google、Facebook、Pinterest…"], accent: COLORS.remotion },
      { title: "房間", sub: "你在那家平台的帳號／資料", lines: ["Gmail、粉專、貼文、相片…"], accent: COLORS.teal },
      { title: "前台服務員", sub: "發房卡的制度", lines: ["OAuth"], accent: COLORS.success },
      { title: "房卡", sub: "拿到的成果", lines: ["token"], accent: COLORS.warn },
      { title: "訪客", sub: "想進去拿東西的程式", lines: ["Claude Code、或互相登入時的 FB"], accent: COLORS.claude },
    ],
  },
  {
    id: "s6b",
    no: "6.2",
    titleZh: "最重要的觀念：旅館和訪客「不是固定身分」",
    titleEn: "Hotel and guest are not fixed identities",
    motif: "s6",
    kind: "roleswap",
    cueIds: ["s6b-1", "s6b-2"],
    minDur: 360,
    roleswap: { hotel: "被敲門的那一家", guest: "想進去的那支程式", action: "敲門 → 拿東西", introIdx: [], bodyIdx: [0, 1] },
  },
  {
    id: "s6c",
    no: "6.3",
    titleZh: "情況 A：用 Google 登入 Claude Code、FB",
    titleEn: "Case A — Sign in with Google",
    motif: "s6",
    kind: "roleswap",
    cueIds: ["s6c-1", "s6c-2", "s6c-3", "s6c-4", "s6c-5", "s6c-6"],
    roleswap: { hotel: "Google", guest: "FB / Claude Code", action: "跑去敲 Google 的門拿 token", introIdx: [0, 1], bodyIdx: [2, 3, 4, 5] },
  },
  {
    id: "s6d",
    no: "6.3",
    titleZh: "情況 B：Claude Code 要替你發 FB、或讀 Gmail",
    titleEn: "Case B — the hotel changes",
    motif: "s6",
    kind: "roleswap",
    cueIds: ["s6d-1", "s6d-2", "s6d-3", "s6d-4"],
    roleswap: { hotel: "Facebook / Google", guest: "Claude Code", action: "敲被碰那家的門", introIdx: [0], bodyIdx: [1, 2, 3] },
  },
  {
    id: "s6e",
    no: "6.4",
    titleZh: "三個問題的標準答案",
    titleEn: "Three questions, answered",
    motif: "s6",
    kind: "bullets",
    cueIds: ["s6e-1", "s6e-2", "s6e-3", "s6e-4"],
    minDur: 420,
  },

  /* ------------------------------------------------------- 7 兩種 token */
  {
    id: "s7",
    no: "7",
    titleZh: "進階：兩種 token——身分卡 vs 工作門卡",
    titleEn: "Two kinds of token — ID card vs work keycard",
    motif: "s7",
    kind: "compare",
    cueIds: ["s7-1", "s7-2", "s7-3", "s7-4", "s7-5", "s7-6", "s7-7", "s7-8"],
    compare: {
      leadIdx: 0,
      left: { badge: "① 身分卡（登入用）", tone: COLORS.hi.sky, cueIdx: [1, 2, 3] },
      right: { badge: "② 工作門卡（動作用）", tone: COLORS.claude, cueIdx: [4, 5, 6] },
      keyIdx: 7,
    },
  },

  /* ---------------------------------------- 7.5 API key vs OAuth token */
  {
    id: "s7b",
    no: "7.5",
    titleZh: "等等——都是 key，為什麼要分兩種？",
    titleEn: "Both are keys — why two kinds?",
    motif: "s7",
    kind: "text",
    cueIds: ["s7b-1", "s7b-2", "s7b-3", "s7b-4", "s7b-5"],
  },
  {
    id: "s7c",
    no: "7.6",
    titleZh: "房客的限時房卡 vs 洗衣廠司機的後門密碼",
    titleEn: "Room keycard vs the laundry van's back-door code",
    motif: "s7",
    kind: "text",
    cueIds: ["s7c-1", "s7c-2", "s7c-3", "s7c-4", "s7c-5", "s7c-6"],
  },

  /* --------------------------------------------------- 8 CAPTCHA = 警衛 */
  {
    id: "s8",
    no: "8",
    titleZh: "CAPTCHA = 門口的警衛（不是鑰匙）",
    titleEn: "CAPTCHA = the guard at the door",
    motif: "s8",
    kind: "metaphor",
    art: "guard",
    cueIds: ["s8-1", "s8-2"],
    minDur: 320,
  },
  {
    id: "s8b",
    no: "8",
    titleZh: "它跟前面角色的差別 · 三個關鍵性質",
    titleEn: "How it differs · three key properties",
    motif: "s8",
    kind: "bullets",
    cueIds: ["s8b-1", "s8b-2", "s8b-3", "s8c-1", "s8c-2", "s8c-3"],
  },

  /* ------------------------------------------------ 9 只能你本人做 */
  {
    id: "s9",
    no: "9",
    titleZh: "為什麼有些事「只能你本人做」？",
    titleEn: "Why some steps need a real you",
    motif: "s9",
    kind: "table",
    cueIds: ["s9-1", "s9r-1", "s9r-2", "s9r-3", "s9r-4", "s9-2"],
    minDur: 460,
    table: {
      cols: ["動作", "為什麼只能你"],
      rows: [
        ["CAPTCHA", "它要抓的就是「自動化程式」，而 AI 正是它設計要擋的對象。詳見第 10 節。"],
        ["本人登入 / 2FA（認證）", "認證就是在驗「本人」，代做就失去意義，規則上也不允許。"],
        ["產生 / 貼上新的密鑰、token", "明文憑證屬最高機密；AI 在任何情況都不碰，由你親自處理。"],
        ["按「提交 / 送出」這種不可逆動作", "送出表單、發布、付款等會造成實際後果，需你最後確認。"],
      ],
      rowCueIdx: [1, 2, 3, 4],
      leadIdx: 0,
      keyText: "好消息：日常照跑不用煩你——已存在設定檔裡的 token 直接讀檔用；只有要動「新的憑證」或「不可逆的送出」才需要你出手。",
    },
  },
  {
    id: "s9b",
    no: "9",
    titleZh: "跨 session 的補充",
    titleEn: "On sessions",
    motif: "s9",
    kind: "text",
    cueIds: ["s9b-1", "s9b-2", "s9b-3", "s9b-4"],
  },

  /* ----------------------------------- 10 Claude 能不能按 CAPTCHA */
  {
    id: "s10",
    no: "10",
    titleZh: "那 Claude 到底「能不能」按 CAPTCHA？",
    titleEn: "Can Claude click a CAPTCHA?",
    motif: "s10",
    kind: "text",
    cueIds: ["s10-1"],
    minDur: 260,
  },
  {
    id: "s10a",
    no: "10",
    titleZh: "能不能（capability）——部分是真的能",
    titleEn: "Capability — partly, yes",
    motif: "s10",
    kind: "text",
    cueIds: ["s10a-1", "s10a-2", "s10a-3", "s10a-4"],
  },
  {
    id: "s10b",
    no: "10",
    titleZh: "該不該（rule）——這才是真正的原因",
    titleEn: "The rule — the real reason",
    motif: "s10",
    kind: "text",
    cueIds: ["s10b-1", "s10b-2", "s10b-3"],
  },
  {
    id: "s10c",
    no: "10",
    titleZh: "為什麼是這條界線，而不是道德表演",
    titleEn: "Why this line, honestly",
    motif: "s10",
    kind: "text",
    cueIds: ["s10c-1", "s10c-2", "s10c-3"],
  },
];

/** §11 一頁速查 — split into two recap screens, then the CTA outro. */
export const RECAP_A = ["ot-1", "ot-2", "ot-3", "ot-4", "ot-5", "ot-6", "ot-7"];
export const RECAP_B = ["ot-8", "ot-9", "ot-10", "ot-11", "ot-12", "ot-13"];
