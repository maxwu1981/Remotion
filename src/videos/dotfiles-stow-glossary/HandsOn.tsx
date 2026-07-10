import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import { WhiteBg, ACC, darkCard, Glare, emberClip, rgba } from "../_explainer/obsidian-glass";
import handsOnSpec from "../_explainer/specs/dotfiles-stow-handson.json";
import handsOnVo from "../_explainer/specs/dotfiles-stow-handson.vo.json";

/**
 * 實際操作段 — 今天 dotfiles/GNU Stow 片的第三大段（講解 → 名詞小教室 → 實際操作）。
 * 鐵則：畫面＝真實操作忠實重建（tutorial-ui-rebuild-from-observed）。所有終端輸出
 * 2026-07-09 在 /tmp/demo-home 乾淨沙盒（HOME 覆寫）逐字實跑取得：stow 2.4.1 真衝突
 * 錯誤、stow -v 的 LINK 行、真 commit hash（8da740a/91011fa/c12eac4）、git revert、
 * 新電腦模擬。過長行為了可讀性有換行、節錄處以 # 註解標明，內容不改字。
 * 每步附「對 Claude 說的一句」💬 膠囊＋片尾 master prompt 禮物卡
 * （tutorial-video-show-claude-prompts 鐵則；prompt 已對照實跑指令驗證）。
 * 只用在 16:9 Full。不動 _explainer 共用模板。
 */

const FPS = 30;
const LEAD = 14, TAIL = 16, XFADE = 12;
const script = handsOnSpec.script as Record<string, string>;
const vo = handsOnVo as Record<string, number>;

type Line = { k: "cmd" | "out" | "err" | "ok" | "cmt"; t: string };
type Step = {
  id: string;
  no: number;
  title: string;
  accent: string;
  termTitle: string;
  lines: Line[];
  prompt?: string; // 💬 對 Claude 說的一句
};

const STEPS: Step[] = [
  {
    id: "h1", no: 1, title: "① 裝工具", accent: ACC.signal, termTitle: "Terminal",
    lines: [
      { k: "cmd", t: "brew install stow" },
      { k: "out", t: "==> Pouring stow--2.4.1.arm64_tahoe.bottle.tar.gz" },
      { k: "out", t: "🍺  /opt/homebrew/Cellar/stow/2.4.1: 50 files, 958.5KB" },
      { k: "cmt", t: "（安裝輸出節錄）" },
      { k: "cmd", t: "stow --version" },
      { k: "ok", t: "stow (GNU Stow) version 2.4.1" },
    ],
    prompt: "幫我確認電腦有沒有裝 GNU Stow，沒有就用 Homebrew 裝",
  },
  {
    id: "h2", no: 2, title: "② 蓋倉庫", accent: ACC.signal, termTitle: "~",
    lines: [
      { k: "cmd", t: "mkdir -p ~/dotfiles/claude/.claude" },
      { k: "cmd", t: "cd ~/dotfiles && git init" },
      { k: "out", t: "Initialized empty Git repository in" },
      { k: "out", t: "/private/tmp/demo-home/dotfiles/.git/" },
      { k: "cmt", t: "示範用乾淨家目錄，不動真實設定" },
    ],
    prompt: "在我的家目錄建一個 dotfiles 資料夾，並初始化成 git 倉庫",
  },
  {
    id: "h3", no: 3, title: "③ 裝箱：照家目錄結構擺", accent: ACC.mint, termTitle: "~/dotfiles",
    lines: [
      { k: "cmd", t: "cp ~/.claude/settings.json ~/.claude/CLAUDE.md \\" },
      { k: "cmd", t: "   ~/dotfiles/claude/.claude/" },
      { k: "cmd", t: "find claude -type f" },
      { k: "out", t: "claude/.claude/settings.json" },
      { k: "out", t: "claude/.claude/CLAUDE.md" },
    ],
    prompt: "把我的 Claude Code 設定檔，照 Stow 的目錄結構複製進 dotfiles",
  },
  {
    id: "h4", no: 4, title: "④ 先撞一次牆（Stow 拒絕）", accent: ACC.rose, termTitle: "~/dotfiles",
    lines: [
      { k: "cmd", t: "stow -t ~ claude" },
      { k: "err", t: "WARNING! stowing claude would cause conflicts:" },
      { k: "err", t: "* cannot stow dotfiles/claude/.claude/settings.json" },
      { k: "err", t: "  over existing target .claude/settings.json since" },
      { k: "err", t: "  neither a link nor a directory and --adopt not specified" },
      { k: "err", t: "All operations aborted." },
      { k: "cmt", t: "CLAUDE.md 也同樣衝突（略）— 這是正常的，下一步解" },
    ],
    prompt: "幫我跑 stow 把 claude 套件連到家目錄",
  },
  {
    id: "h5", no: 5, title: "⑤ 備份 → 再跑一次 → LINK", accent: ACC.mint, termTitle: "~/dotfiles",
    lines: [
      { k: "cmd", t: "mkdir -p ~/backup && mv ~/.claude/settings.json \\" },
      { k: "cmd", t: "   ~/.claude/CLAUDE.md ~/backup/" },
      { k: "cmd", t: "stow -v -t ~ claude" },
      { k: "ok", t: "LINK: .claude/CLAUDE.md => ../dotfiles/claude/.claude/CLAUDE.md" },
      { k: "ok", t: "LINK: .claude/settings.json => ../dotfiles/claude/.claude/settings.json" },
    ],
    prompt: "把原本的設定檔先備份走，再跑一次 stow",
  },
  {
    id: "h6", no: 6, title: "⑥ 驗收 symlink", accent: ACC.signal, termTitle: "~",
    lines: [
      { k: "cmd", t: "ls -la ~/.claude/" },
      { k: "out", t: "lrwxr-xr-x  CLAUDE.md -> ../dotfiles/claude/.claude/CLAUDE.md" },
      { k: "out", t: "lrwxr-xr-x  settings.json -> ../dotfiles/claude/.claude/settings.json" },
      { k: "cmt", t: "（欄位節錄）箭頭＝便利貼指向倉庫的證據" },
    ],
    prompt: "列出 .claude 目錄，確認 symlink 都建好了",
  },
  {
    id: "h7", no: 7, title: "⑦ commit 拍快照", accent: ACC.mint, termTitle: "~/dotfiles",
    lines: [
      { k: "cmd", t: "git add -A && git commit -m \"我的 Claude Code 設定 第一版\"" },
      { k: "ok", t: "[main (root-commit) 8da740a] 我的 Claude Code 設定 第一版" },
      { k: "out", t: " 2 files changed, 9 insertions(+)" },
    ],
    prompt: "幫我把這一版設定 commit 進 git",
  },
  {
    id: "h8", no: 8, title: "⑧ git revert 反悔測試", accent: ACC.violet, termTitle: "~/dotfiles",
    lines: [
      { k: "cmd", t: "echo \"- 程式註解也用中文\" >> ~/.claude/CLAUDE.md" },
      { k: "cmd", t: "git commit -am \"加一條註解規則\"" },
      { k: "out", t: "[main 91011fa] 加一條註解規則" },
      { k: "cmd", t: "git revert --no-edit HEAD" },
      { k: "ok", t: "[main c12eac4] Revert \"加一條註解規則\"" },
      { k: "cmt", t: "cat 確認過：設定回到上一版，救回來了" },
    ],
    prompt: "我把設定改壞了，幫我用 git revert 回到上一版",
  },
  {
    id: "h9", no: 9, title: "⑨ 新電腦：clone + stow", accent: ACC.ember, termTitle: "新電腦 ~",
    lines: [
      { k: "cmd", t: "git clone <你的 dotfiles 倉庫> && cd dotfiles" },
      { k: "out", t: "Cloning into 'dotfiles'..." },
      { k: "out", t: "done." },
      { k: "cmd", t: "stow -v -t ~ claude" },
      { k: "ok", t: "LINK: .claude/CLAUDE.md => ../dotfiles/claude/.claude/CLAUDE.md" },
      { k: "ok", t: "LINK: .claude/settings.json => ../dotfiles/claude/.claude/settings.json" },
      { k: "cmt", t: "整趟不用一分鐘，設定全部到位" },
    ],
    prompt: "這台新電腦，clone 我的 dotfiles 並把 Claude Code 設定 stow 好",
  },
];

const MASTER_PROMPT = [
  "幫我把 Claude Code 設定用 GNU Stow 收進 dotfiles 倉庫：",
  "1. 確認有沒有裝 GNU Stow，沒有就用 Homebrew 裝",
  "2. 在家目錄建 dotfiles 資料夾並 git init",
  "3. 把 ~/.claude 的 settings.json 和 CLAUDE.md",
  "   照結構複製到 dotfiles/claude/.claude/",
  "4. 跑 stow -t ~ claude；撞到已存在的檔案，",
  "   就先把原檔備份走再跑一次",
  "5. ls -la 確認 symlink，然後 git commit 這一版",
  "注意：絕對不要把 ~/.claude.json 放進倉庫，",
  "它存著 OAuth token 和 API 金鑰。",
];

type Card = { id: string; kind: "intro" | "step" | "master"; step?: Step };
const CARDS: Card[] = [
  { id: "h0", kind: "intro" },
  ...STEPS.map((s): Card => ({ id: s.id, kind: "step", step: s })),
  { id: "h10", kind: "master" },
];

const cardFrames = (id: string) => Math.ceil((vo[id] ?? 3) * FPS) + LEAD + TAIL;

export function handsOnFrames(): number {
  return CARDS.reduce((s, c) => s + cardFrames(c.id), 0) - XFADE * (CARDS.length - 1);
}

const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, LEAD, 8);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 54, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1560, padding: "16px 40px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 34, lineHeight: 1.45, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

const OpsPill: React.FC<{ f: number; progress?: string }> = ({ f, progress }) => (
  <div style={{ position: "absolute", top: 52, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, opacity: fadeIn(f, 2, 12) }}>
    <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 26px", display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26 }}>🛠</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: "#fff" }}>實際操作</span>
    </div>
    {progress && (
      <div style={{ ...darkCard(ACC.signal, { r: 999, glow: 0.5 }), padding: "10px 24px", display: "inline-flex", alignItems: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: "#fff" }}>{progress}</span>
      </div>
    )}
  </div>
);

const lineStyle = (k: Line["k"]): React.CSSProperties => {
  switch (k) {
    case "cmd": return { color: "#fff", fontWeight: 700 };
    case "err": return { color: "#FF9DAC", fontWeight: 600 };
    case "ok": return { color: "#7EE6B6", fontWeight: 600 };
    case "cmt": return { color: rgba("#ffffff", 0.5), fontWeight: 500 };
    default: return { color: rgba("#ffffff", 0.82), fontWeight: 500 };
  }
};

/** 真輸出終端卡：行隨旁白節奏逐行浮現，settle 後全靜止（防抖）。 */
const OpsTermCard: React.FC<{ step: Step; f: number }> = ({ step, f }) => {
  const dense = step.lines.length > 6;
  const o = fadeIn(f, LEAD, 12);
  return (
    <div style={{ ...darkCard(step.accent, { r: 22, glow: 0.95 }), position: "relative", overflow: "hidden", width: 1360, opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>
      <Glare />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "13px 26px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#28C840" }} />
        <span style={{ marginLeft: 12, fontFamily: FONT.monoCjk, fontSize: 23, color: rgba("#ffffff", 0.6) }}>{step.termTitle}</span>
      </div>
      <div style={{ position: "relative", padding: dense ? "13px 30px" : "20px 30px", display: "flex", flexDirection: "column", gap: dense ? 7 : 12 }}>
        {step.lines.map((l, i) => {
          const lo = fadeIn(f, LEAD + 6 + i * 7, 8);
          return (
            <div key={i} style={{ fontFamily: FONT.monoCjk, fontSize: dense ? (l.t.length > 46 ? 20 : 23) : (l.t.length > 46 ? 22 : 26), lineHeight: 1.3, opacity: lo, ...lineStyle(l.k) }}>
              {l.k === "cmd" && <span style={{ color: ACC.gold, marginRight: 12 }}>$</span>}
              {l.k === "cmt" && <span style={{ color: rgba("#ffffff", 0.32), marginRight: 8 }}>#</span>}
              {l.t}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** 💬 對 Claude 說的一句（可照唸/複製）。 */
const PromptPill: React.FC<{ text: string; f: number; delay: number }> = ({ text, f, delay }) => {
  const o = fadeIn(f, delay, 12);
  return (
    <div style={{ ...darkCard(ACC.gold, { r: 999, glow: 0.6 }), position: "relative", overflow: "hidden", padding: "12px 30px", display: "inline-flex", alignItems: "center", gap: 14, opacity: o, transform: `translateY(${(1 - o) * 10}px)`, maxWidth: 1360 }}>
      <Glare />
      <span style={{ position: "relative", fontSize: 28 }}>💬</span>
      <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, color: "#fff" }}>
        對 Claude 說：<span style={{ color: ACC.gold }}>{text}</span>
      </span>
    </div>
  );
};

const StepCard: React.FC<{ step: Step; f: number }> = ({ step, f }) => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
    <OpsPill f={f} progress={`${step.no} / 9`} />
    <div style={{ position: "absolute", top: 128, left: 0, right: 0, textAlign: "center", opacity: fadeIn(f, 6, 12) }}>
      <div style={{ fontWeight: 800, fontSize: 56, color: ACC.ink }}>{step.title}</div>
    </div>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: 90, bottom: 150 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <OpsTermCard step={step} f={f} />
        {step.prompt && <PromptPill text={step.prompt} f={f} delay={LEAD + 6 + step.lines.length * 7} />}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const IntroCard: React.FC = () => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
        <div style={{ fontSize: 120 }}>🛠</div>
        <div style={{ ...emberClip, fontWeight: 800, fontSize: 116, letterSpacing: 2, marginTop: 6 }}>實際操作</div>
        <div style={{ fontWeight: 600, fontSize: 44, color: ACC.inkSoft, marginTop: 24, lineHeight: 1.42 }}>九個步驟，真的做一遍給你看<br />每一步都給你一句話，丟給 Claude 照做</div>
      </div>
    </AbsoluteFill>
  );
};

const MasterCard: React.FC = () => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk, top: 40, bottom: 150 }}>
      <div style={{ textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ fontWeight: 800, fontSize: 54, color: ACC.ink }}>🎁 看到最後的禮物 · <span style={emberClip}>Master Prompt</span></div>
        <div style={{ ...darkCard(ACC.ember, { r: 22, glow: 0.95 }), position: "relative", overflow: "hidden", padding: "26px 42px", textAlign: "left" }}>
          <Glare />
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
            {MASTER_PROMPT.map((l, i) => (
              <div key={i} style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 26, lineHeight: 1.35, color: i >= MASTER_PROMPT.length - 2 ? "#FF9DAC" : rgba("#ffffff", 0.92), opacity: fadeIn(f, 14 + i * 5, 8) }}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OneCard: React.FC<{ card: Card }> = ({ card }) => {
  const f = useCurrentFrame();
  let visual: React.ReactNode;
  if (card.kind === "intro") visual = <IntroCard />;
  else if (card.kind === "master") visual = <MasterCard />;
  else visual = <StepCard step={card.step!} f={f} />;
  return (
    <AbsoluteFill>
      {visual}
      <Caption text={script[card.id] ?? ""} />
      <Sequence from={LEAD}>
        <Audio src={staticFile(`vo/dotfiles-stow-handson/${card.id}.mp3`)} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** 實際操作片段（自帶白底＋字幕＋旁白；不含 BGM，外層決定）。 */
export const HandsOnSegment: React.FC = () => (
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    <TransitionSeries>
      {CARDS.flatMap((card, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`c-${i}`} durationInFrames={cardFrames(card.id)}>
            <OneCard card={card} />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [
          <TransitionSeries.Transition key={`t-${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          seq,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
