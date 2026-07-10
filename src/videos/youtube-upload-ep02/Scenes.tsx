import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, darkCard, Glare, emberPill, hairline, rgba } from "./glass";

/**
 * 「YouTube 上片全自動化」實戰自動化 EP02 — 場景元件庫。
 * 視覺=EP01 黑曜石 v3 同骨:淺底 + 黑曜石玻璃卡(白字) + 收斂光暈。
 * 本片主角=22 張 2026-06-04 實錄截圖 → ShotScene 統一播放:
 * 裁掉瀏覽器分頁列(58px) + 個資遮罩(email/client ID/專案編號) + 聚焦框/禁區框。
 * 防抖:淺底由 Master 全片墊底,景內只 opacity/translate 淡入。
 */
export type Mark = { start: number; end: number };
export type SceneProps = { dur: number; marks: Mark[] };
export type Box = { x: number; y: number; w: number; h: number };

const rise = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const gloss = (size = 28): React.CSSProperties => ({
  fontFamily: FONT.uiCjk,
  fontWeight: 500,
  fontSize: size,
  letterSpacing: 0.5,
  color: rgba("#ffffff", 0.74),
});

/** 內容置中放大、壓低上下留白(video-fill-frame-rule)。 */
const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "60px 50px 96px" }}>
    <div style={{ transform: "scale(1.12)", transformOrigin: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<{ c: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ c, style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", ...darkCard(c), ...style }}>
    <Glare />
    {children}
  </div>
);

/* ════════════════════════ ShotScene:實錄截圖播放器 ════════════════════════
 * 截圖源 2048×1280;瀏覽器截圖裁掉頂部分頁列 58px(保留網址列=導航教學價值)。
 * 遮罩=% 座標的磨砂黑chip(蓋 email/client ID/專案編號/頭像區)。
 * focus=橙聚焦框(該點就是要按的);avoid=紅禁區框+✗(千萬別按)。 */
export type ShotSeg = {
  from: number; // 第幾句(marks index)起顯示
  img?: string; // public/ 相對路徑
  node?: React.ReactNode; // 取代截圖的重演面板
  masks?: Box[];
  note?: string; // 卡內左下步驟chip
  focus?: Box;
  avoid?: Box;
  mac?: boolean; // 單段覆蓋:mac 全螢幕截圖(不裁分頁列、不遮頭像區)
};

const SRC_W = 2048, SRC_H = 1280, CROP = 58;
/** 瀏覽器工具列右端頭像/擴充群(每張瀏覽器截圖都遮)。 */
const AVATAR_MASK: Box = { x: 88.2, y: 0.4, w: 11.4, h: 5.2 };

const MaskChip: React.FC<{ b: Box }> = ({ b }) => (
  <div style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, borderRadius: 8, background: "#0D1322", border: `1px solid ${rgba("#ffffff", 0.12)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ color: rgba("#ffffff", 0.4), fontSize: 13, letterSpacing: 3, fontFamily: FONT.mono }}>●●●</span>
  </div>
);

const FocusRing: React.FC<{ b: Box; c: string; at: number; cross?: boolean }> = ({ b, c, at, cross }) => {
  const f = useCurrentFrame();
  const o = rise(f, at, 10);
  return (
    <div style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, borderRadius: 12, border: `4px solid ${c}`, boxShadow: `0 0 18px ${rgba(c, 0.55)}, inset 0 0 14px ${rgba(c, 0.25)}`, opacity: o }}>
      {cross && (
        <div style={{ position: "absolute", top: -21, right: -21, width: 42, height: 42, borderRadius: 999, background: c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26, boxShadow: `0 6px 14px ${rgba(c, 0.5)}` }}>✗</div>
      )}
    </div>
  );
};

export const ShotScene: React.FC<SceneProps & { segs: ShotSeg[]; title: string; mac?: boolean }> = ({ marks: m, dur, segs, title, mac }) => {
  const f = useCurrentFrame();
  const W = 1500;
  const crop = mac ? 0 : CROP;
  const scale = W / SRC_W;
  const innerH = Math.round((SRC_H - crop) * scale);
  const segAt = (i: number) => (segs[i].from <= 0 ? 0 : m[Math.min(segs[i].from, m.length - 1)].start);
  return (
    <Wrap>
      <Card c={ACC.ember} style={{ width: W + 36, padding: 0, borderRadius: 26 }}>
        {/* 視窗標題列 */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", height: 52, padding: "0 24px", background: rgba("#ffffff", 0.04), borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 14, height: 14, borderRadius: 999, background: c, marginRight: 10, boxShadow: `inset 0 1px 1px ${rgba("#ffffff", 0.3)}` }} />
          ))}
          <span style={{ fontFamily: FONT.monoCjk, fontSize: 21, letterSpacing: 1, color: rgba("#ffffff", 0.45), marginLeft: 12 }}>{title}</span>
          <span style={{ ...emberPill, marginLeft: "auto", padding: "4px 16px", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 19, letterSpacing: 2 }}>實錄截圖 · 個資已遮蔽</span>
        </div>
        {/* 截圖區:段落交叉淡入 */}
        <div style={{ position: "relative", width: W + 36, height: innerH, background: "#0A0F1C" }}>
          {segs.map((s, i) => {
            const at = segAt(i);
            const until = i + 1 < segs.length ? segAt(i + 1) : dur;
            const o = rise(f, at, 10) * (1 - rise(f, until, 10));
            if (o <= 0.01) return null;
            const segMac = s.mac ?? mac;
            const segCrop = segMac ? 0 : CROP;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, margin: "0 18px", opacity: o, overflow: "hidden" }}>
                {s.img ? (
                  <>
                    <Img src={staticFile(s.img)} style={{ width: W, display: "block", marginTop: -Math.round(segCrop * scale) }} />
                    {[...(s.masks ?? []), ...(segMac ? [] : [AVATAR_MASK])].map((b, j) => (
                      <MaskChip key={j} b={b} />
                    ))}
                    {s.focus && <FocusRing b={s.focus} c={ACC.ember} at={at + 16} />}
                    {s.avoid && <FocusRing b={s.avoid} c={ACC.rose} at={at + 26} cross />}
                  </>
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.node}</div>
                )}
                {s.note && (
                  <div style={{ position: "absolute", left: 22, top: 16, padding: "9px 24px", borderRadius: 999, background: "rgba(13,19,34,0.88)", border: `1px solid ${rgba(ACC.ember, 0.5)}`, boxShadow: `0 0 16px ${rgba(ACC.ember, 0.25)}` }}>
                    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: "#fff", letterSpacing: 1 }}>{s.note}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </Wrap>
  );
};

/* ── 重演面板(code 畫的示意,誠實標「重演」) ── */

/** Access blocked 錯誤重演(實錄裡靠白名單躲過,畫給觀眾看長什麼樣)。 */
export const AccessBlockedMock: React.FC = () => (
  <div style={{ position: "relative", width: 860, borderRadius: 20, background: "#101418", border: `1px solid ${rgba(ACC.rose, 0.4)}`, boxShadow: `0 0 24px ${rgba(ACC.rose, 0.2)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "44px 54px", fontFamily: FONT.uiCjk }}>
    <div style={{ position: "absolute", top: 18, right: 20, padding: "4px 14px", borderRadius: 999, background: rgba(ACC.rose, 0.16), border: `1px solid ${rgba(ACC.rose, 0.4)}`, fontSize: 17, fontWeight: 700, letterSpacing: 2, color: ACC.rose }}>重演示意</div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 34, color: "#fff", width: 46, height: 46, borderRadius: 999, background: "linear-gradient(135deg,#4285F4,#EA4335 60%,#FBBC05)", display: "flex", alignItems: "center", justifyContent: "center" }}>G</span>
      <span style={{ fontWeight: 700, fontSize: 40, color: "#fff" }}>存取遭封鎖</span>
    </div>
    <div style={{ fontWeight: 500, fontSize: 27, lineHeight: 1.6, color: rgba("#ffffff", 0.72) }}>
      這個應用程式目前處於<span style={{ color: ACC.gold }}>測試階段</span>，只有<span style={{ color: ACC.gold }}>開發人員核准的測試使用者</span>才能存取。
    </div>
    <div style={{ marginTop: 26, display: "inline-block", padding: "10px 22px", borderRadius: 10, background: rgba(ACC.rose, 0.12), border: `1px solid ${rgba(ACC.rose, 0.35)}`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 25, color: ACC.rose }}>
      错误 403: access_denied
    </div>
    <div style={{ ...hairline, margin: "28px 0 20px" }} />
    <div style={{ fontWeight: 700, fontSize: 26, color: ACC.mint }}>
      解法:回同意畫面 → Test users 補加你的帳號 → 重跑一次授權 ✓
    </div>
  </div>
);

/** 改名指令重演(坑二的解法,實錄裡 Claude 自動做掉)。 */
export const RenameMock: React.FC = () => (
  <div style={{ width: 1050, borderRadius: 20, background: "#0B1220", border: `1px solid ${rgba(ACC.ember, 0.45)}`, boxShadow: `0 0 22px ${rgba(ACC.ember, 0.2)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "38px 46px", fontFamily: FONT.monoCjk, fontSize: 27, lineHeight: 2 }}>
    <div style={{ color: rgba("#ffffff", 0.5) }}># 下載檔名帶一長串亂碼,腳本不認得</div>
    <div style={{ color: rgba("#ffffff", 0.86) }}>client_secret_98877<span style={{ color: ACC.rose }}>●●●●●●●●</span>.apps.googleusercontent.com.json</div>
    <div style={{ marginTop: 14, color: rgba("#ffffff", 0.5) }}># 改成腳本認的名字(Claude 自動做掉了)</div>
    <div style={{ color: rgba("#ffffff", 0.92) }}>
      <span style={{ color: ACC.gold }}>$</span> mv client_secret_98877●●●.json <span style={{ color: ACC.emberSoft, fontWeight: 700 }}>client_secrets.json</span>
    </div>
    <div style={{ marginTop: 10, color: ACC.mint, fontWeight: 700 }}>✓ 憑證就位 · 桌面應用類型 · 有效</div>
  </div>
);

/** 鑰匙安全卡(8-9)。 */
export const SecurityMock: React.FC = () => (
  <div style={{ width: 940, borderRadius: 20, background: "#0B1220", border: `1px solid ${rgba(ACC.gold, 0.5)}`, boxShadow: `0 0 24px ${rgba(ACC.gold, 0.22)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "42px 52px", fontFamily: FONT.uiCjk }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
      <span style={{ fontSize: 46 }}>🔑</span>
      <span style={{ fontWeight: 800, fontSize: 38, color: "#fff", letterSpacing: 1 }}>
        <span style={{ fontFamily: FONT.mono, color: ACC.gold }}>client_secrets.json</span> ＋ <span style={{ fontFamily: FONT.mono, color: ACC.gold }}>token</span> ＝ 頻道鑰匙
      </span>
    </div>
    {([
      ["✗", ACC.rose, "不要放進公開的程式碼庫(git)"],
      ["✗", ACC.rose, "不要傳給任何人"],
      ["✓", ACC.mint, "只留在自己電腦的腳本資料夾"],
    ] as const).map(([mark, c, label]) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: c }}>{mark}</span>
        <span style={{ fontWeight: 500, fontSize: 30, color: rgba("#ffffff", 0.85) }}>{label}</span>
      </div>
    ))}
  </div>
);

/** 三個勾環境齊全卡(9-5)。 */
export const ChecksMock: React.FC = () => (
  <div style={{ width: 900, borderRadius: 20, background: "#0B1220", border: `1px solid ${rgba(ACC.mint, 0.5)}`, boxShadow: `0 0 24px ${rgba(ACC.mint, 0.2)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "42px 56px", fontFamily: FONT.uiCjk }}>
    {([
      ["client_secrets.json 憑證就位", true],
      ["Google API 套件已裝(warning 只是老版本提示)", true],
      ["網路暢通(剛剛直接裝成功)", true],
    ] as const).map(([label]) => (
      <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 18, padding: "13px 0" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 34, color: ACC.mint, textShadow: `0 0 12px ${rgba(ACC.mint, 0.5)}` }}>✓</span>
        <span style={{ fontWeight: 600, fontSize: 31, color: rgba("#ffffff", 0.88) }}>{label}</span>
      </div>
    ))}
    <div style={{ ...hairline, margin: "18px 0 20px" }} />
    <div style={{ fontWeight: 700, fontSize: 28, color: ACC.gold, letterSpacing: 2 }}>一次性設定 · 人工部分到此結束</div>
  </div>
);

/** 坑三解法:相容安裝指令(9-3,真指令出自實錄 _install_deps.command)。 */
export const PipFixMock: React.FC = () => (
  <div style={{ width: 1150, borderRadius: 20, background: "#0B1220", border: `1px solid ${rgba(ACC.mint, 0.5)}`, boxShadow: `0 0 22px ${rgba(ACC.mint, 0.2)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "38px 46px", fontFamily: FONT.monoCjk, fontSize: 26, lineHeight: 2 }}>
    <div style={{ color: rgba("#ffffff", 0.5) }}># 原指令帶新參數,老 pip 不認得</div>
    <div style={{ color: rgba("#ffffff", 0.8) }}>
      pip3 install google-auth google-auth-oauthlib google-api-python-client <span style={{ color: ACC.rose, textDecoration: "line-through", textDecorationColor: ACC.rose }}>--break-system-packages</span>
    </div>
    <div style={{ marginTop: 14, color: rgba("#ffffff", 0.5) }}># Claude 的解法:拿掉新參數,直接裝(真指令)</div>
    <div style={{ color: rgba("#ffffff", 0.92) }}>
      <span style={{ color: ACC.gold }}>$</span> pip3 install <span style={{ color: ACC.emberSoft }}>google-auth google-auth-oauthlib google-api-python-client</span>
    </div>
    <div style={{ marginTop: 10, color: ACC.mint, fontWeight: 700 }}>✓ 套件安裝成功(warning 只是 Python 3.9 老版本提示,不影響)</div>
  </div>
);

/** 上傳自動跑面板(11-1/11-2)。 */
export const UploadRunMock: React.FC = () => (
  <div style={{ width: 1050, borderRadius: 20, background: "#0B1220", border: `1px solid ${rgba(ACC.ember, 0.45)}`, boxShadow: `0 0 22px ${rgba(ACC.ember, 0.2)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "38px 46px", fontFamily: FONT.monoCjk, fontSize: 27, lineHeight: 2.1 }}>
    <div style={{ color: rgba("#ffffff", 0.86) }}>
      <span style={{ color: ACC.gold }}>$</span> python3 yt_upload.py --file 成片.mp4
    </div>
    <div style={{ color: rgba("#ffffff", 0.7) }}>↑ 上傳 30MB　<span style={{ color: ACC.gold }}>▓▓▓▓▓▓▓▓▓▓ 100%</span>　<span style={{ color: rgba("#ffffff", 0.5) }}>(30–60 秒)</span></div>
    <div style={{ color: ACC.mint }}>✓ 上傳完成 · 平台轉檔中</div>
    <div style={{ color: ACC.emberSoft, fontWeight: 700 }}>🔗 https://youtu.be/●●●●●●●●●●●　← Claude 回報連結</div>
  </div>
);

/** token 永存卡(10-8)。 */
export const TokenMock: React.FC = () => (
  <div style={{ width: 960, borderRadius: 20, background: "#0B1220", border: `1px solid ${rgba(ACC.mint, 0.5)}`, boxShadow: `0 0 24px ${rgba(ACC.mint, 0.2)}, 0 22px 44px rgba(0,0,0,0.4)`, padding: "44px 54px", fontFamily: FONT.uiCjk, textAlign: "center" }}>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 34px", borderRadius: 14, background: rgba(ACC.mint, 0.1), border: `1px solid ${rgba(ACC.mint, 0.4)}` }}>
      <span style={{ fontSize: 36 }}>🎟️</span>
      <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 32, color: "#fff" }}>.yt_token.json</span>
      <span style={{ fontWeight: 700, fontSize: 28, color: ACC.mint }}>已自動保存 ✓</span>
    </div>
    <div style={{ marginTop: 26, fontWeight: 700, fontSize: 34, color: "#fff" }}>
      日常上傳 <span style={{ fontFamily: FONT.mono, fontSize: 44, color: ACC.gold, textShadow: `0 0 16px ${rgba(ACC.gold, 0.4)}` }}>0</span> 次授權
    </div>
    <div style={{ marginTop: 14, ...gloss(26) }}>萬一失效,重跑一次授權就好,三十秒的事</div>
  </div>
);

/* ════════════════════════ 💬 PromptCard:每步「對 Claude 說的那句」 ════════════════════════
 * 每個動作章節開頭閃一張,可暫停複製;逐字對照 yt_upload.py 驗過(見 SCRIPT.md)。 */
export const PromptCard: React.FC<{ text: string; note?: string }> = ({ text, note }) => {
  const f = useCurrentFrame();
  const o = rise(f, 4, 12);
  const caret = Math.floor(f / 14) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "70px 90px" }}>
      <div style={{ width: 1280, maxWidth: "100%", opacity: o, transform: `translateY(${(1 - o) * 22}px)` }}>
        {/* 標籤列 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <span style={{ fontSize: 42 }}>💬</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: ACC.ink, letterSpacing: 2 }}>
            你只要對 <span style={{ color: ACC.ember }}>Claude</span> 說
          </span>
          {note && <span style={{ marginLeft: "auto", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 24, color: ACC.muted }}>{note}</span>}
        </div>
        {/* prompt 面板(可複製感:mono、選取藍) */}
        <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 24, glow: 1 }), padding: "36px 44px" }}>
          <Glare />
          <div style={{ position: "relative", fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: 40, lineHeight: 1.62, color: "#fff", letterSpacing: 0.5 }}>
            <span style={{ color: ACC.gold, marginRight: 12 }}>&gt;</span>
            {text}
            <span style={{ opacity: caret ? 1 : 0, color: ACC.emberSoft }}>▌</span>
          </div>
        </div>
        {/* 暫停提示 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, justifyContent: "center" }}>
          <span style={{ padding: "8px 24px", borderRadius: 999, background: rgba(ACC.ember, 0.1), border: `1px solid ${rgba(ACC.ember, 0.4)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: ACC.ember }}>⏸ 暫停這格就能複製</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ════════════════════════ CH14 片尾 Master Prompt:看到最後的禮物 ════════════════════════
 * 螢幕放濃縮版(可暫停複製);逐字完整版放 YouTube 描述第一行。 */
const MASTER_LINES: React.ReactNode[] = [
  <><span style={{ color: ACC.emberSoft }}>Hi Claude</span>，我想用 YouTube 官方 Data API v3，做到之後每支影片<b style={{ color: "#fff" }}>一句話就自動上傳</b>。請一步步帶我做（我去 Console 點、你教我）：</>,
  <><span style={{ color: ACC.gold }}>①</span> 建專案 → 啟用 YouTube Data API v3</>,
  <><span style={{ color: ACC.gold }}>②</span> OAuth 同意畫面：User Type 外部，把我帳號加進「測試使用者」白名單</>,
  <><span style={{ color: ACC.gold }}>③</span> 建「桌面應用」OAuth 憑證、下載，改名 <span style={{ color: ACC.emberSoft }}>client_secrets.json</span></>,
  <><span style={{ color: ACC.gold }}>④</span> 裝 google-auth、google-auth-oauthlib、google-api-python-client</>,
  <><span style={{ color: ACC.gold }}>⑤</span> 寫上傳程式：InstalledAppFlow 走 OAuth（scope <span style={{ color: ACC.emberSoft }}>youtube.upload</span>）→ Token 存 <span style={{ color: ACC.emberSoft }}>.yt_token.json</span> 自動沿用 → <span style={{ color: ACC.emberSoft }}>videos().insert</span> 上傳</>,
  <><span style={{ color: ACC.gold }}>⑥</span> 以後一句話上傳：讀檔、填標題描述、先設不公開、回報連結</>,
  <><span style={{ color: ACC.gold }}>⑦</span> 安全：憑證當密碼、不進 git；配額 100 支/天</>,
];

export const MasterPromptScene: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const giftAt = m[0].start + 6;
  const bodyAt = m[1].start + 2;
  const copyAt = m[2].start + 2;
  return (
    <Wrap>
      <div style={{ width: 1560, maxWidth: "100%" }}>
        {/* 禮物標題 */}
        <div style={{ textAlign: "center", marginBottom: 22, opacity: rise(f, giftAt, 12), transform: `translateY(${(1 - rise(f, giftAt, 12)) * 16}px)` }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 54, color: ACC.ink, letterSpacing: 2 }}>
            🎁 看到最後的<span style={{ color: ACC.ember }}>禮物</span>：完整指令
          </span>
        </div>
        {/* master prompt 面板 */}
        <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 26, glow: 1.1 }), padding: "34px 46px", opacity: rise(f, bodyAt, 14) }}>
          <Glare />
          <div style={{ position: "relative", fontFamily: FONT.monoCjk }}>
            {MASTER_LINES.map((node, i) => (
              <div key={i} style={{ fontWeight: i === 0 ? 600 : 500, fontSize: i === 0 ? 30 : 29, lineHeight: 1.55, color: rgba("#ffffff", i === 0 ? 0.94 : 0.86), marginBottom: i === 0 ? 16 : 9, opacity: rise(f, bodyAt + 4 + i * 3, 10) }}>
                {node}
              </div>
            ))}
          </div>
        </div>
        {/* 複製鼓勵 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 22, opacity: rise(f, copyAt, 12) }}>
          <span style={{ ...emberPill, padding: "13px 34px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30 }}>⏸ 暫停整段複製</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 28, color: ACC.inkSoft }}>逐字完整版 = 影片描述第一行</span>
        </div>
      </div>
    </Wrap>
  );
};

/* ════════════════════════ CH1 Hook:一句指令上線(終端重演) ════════════════════════ */
export const DemoScene: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const runAt = m[0].start + 14;
  const prog = interpolate(f, [m[1].start - 34, m[1].start + 14], [0, 1], clamp);
  const blocks = Math.round(prog * 10);
  const bar = "▓".repeat(blocks) + "░".repeat(10 - blocks);
  const wTxt = rgba("#ffffff", 0.86);
  const wDim = rgba("#ffffff", 0.55);
  const ok = (label: React.ReactNode) => (
    <>
      <span style={{ color: ACC.mint }}>✓ </span>
      <span style={{ color: wTxt }}>{label}</span>
    </>
  );
  const LOG: { at: number; node: React.ReactNode }[] = [
    { at: runAt, node: <span style={{ color: wDim }}>── Claude Code 接手:讀描述檔 → 上傳 → 回報連結</span> },
    { at: runAt + 22, node: ok(<>讀 video.meta.yaml · 標題/描述/標籤 就緒</>) },
    { at: runAt + 46, node: ok(<>token 檢查 · <span style={{ color: ACC.mint }}>免授權</span>(通行證還有效)</>) },
    { at: m[1].start - 40, node: <span style={{ color: ACC.signal }}>↑ <span style={{ color: wTxt }}>上傳 新片.mp4　</span><span style={{ color: ACC.gold }}>{bar} {Math.round(prog * 100)}%</span></span> },
    { at: m[1].start + 20, node: ok(<>上傳完成 · 隱私=不公開 · 等我檢查</>) },
    { at: m[1].start + 46, node: <span style={{ color: ACC.emberSoft, fontWeight: 700 }}>🔗 https://youtu.be/●●●●●●●●　← 連結回報</span> },
    { at: m[2].start + 10, node: <span style={{ color: ACC.gold, fontWeight: 700, letterSpacing: 2 }}>── 約 60 秒 · 全程沒碰 YouTube ──</span> },
  ];
  return (
    <Wrap>
      <Card c={ACC.ember} style={{ width: 1480, padding: 0, borderRadius: 24 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", height: 54, padding: "0 26px", background: rgba("#ffffff", 0.04), borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 15, height: 15, borderRadius: 999, background: c, marginRight: 11, boxShadow: `inset 0 1px 1px ${rgba("#ffffff", 0.3)}` }} />
          ))}
          <span style={{ fontFamily: FONT.monoCjk, fontSize: 22, letterSpacing: 1, color: rgba("#ffffff", 0.45), marginLeft: 14 }}>zsh — YouTube 自動上片</span>
          <span style={{ ...emberPill, marginLeft: "auto", padding: "5px 18px", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 21, letterSpacing: 2, opacity: rise(f, m[0].start + 6, 10) }}>實錄重演</span>
        </div>
        <div style={{ position: "relative", padding: "26px 40px 30px", fontFamily: FONT.monoCjk, fontSize: 28, lineHeight: "46px", minHeight: 500 }}>
          <div style={{ opacity: rise(f, m[0].start + 4, 8) }}>
            <span style={{ color: ACC.gold }}>$</span> <span style={{ color: "#fff", fontWeight: 700 }}>我:「上傳」</span>
          </div>
          {LOG.map((l, i) => (
            <div key={i} style={{ opacity: rise(f, l.at, 8) }}>{l.node}</div>
          ))}
          {/* c1-4 五分鐘代價 chip */}
          <div style={{ marginTop: 22, display: "flex", gap: 18, opacity: rise(f, m[3].start + 8, 12) }}>
            <span style={{ padding: "10px 26px", borderRadius: 999, background: rgba(ACC.ember, 0.14), border: `1px solid ${rgba(ACC.ember, 0.5)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, color: ACC.emberSoft }}>代價=一次性 5 分鐘設定</span>
            <span style={{ padding: "10px 26px", borderRadius: 999, background: rgba(ACC.mint, 0.1), border: `1px solid ${rgba(ACC.mint, 0.45)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, color: ACC.mint }}>之後每支片,永遠自動</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, color: rgba("#ffffff", 0.8), opacity: rise(f, m[4].start + 8, 12) }}>
            接下來:實際畫面走一遍 <span style={{ color: ACC.emberSoft }}>+ 我踩過的 3 個坑</span>
          </div>
        </div>
      </Card>
    </Wrap>
  );
};

/* ════════════════════════ CH2 手動上傳之痛+實證泡泡牆 ════════════════════════ */
const BUBBLES: { text: React.ReactNode; src: string }[] = [
  {
    text: <>“Manually uploading videos… it&apos;s <b>tedious, repetitive</b>, and honestly, it&apos;s a total <b>creativity killer</b>.”</>,
    src: "Blog · Nigel Y.",
  },
  {
    text: <>“<b>Access blocked</b>: ●●● has not completed the Google verification process — <b>Error 403: access_denied</b>”</>,
    src: "GitHub · waga●●●●",
  },
  {
    text: <>“The app is currently being tested, and can <b>only be accessed by developer-approved testers</b>.”</>,
    src: "Google Groups · Jarrod D●●●●",
  },
];

export const PainScene: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const STEPS = ["開 Studio", "拖檔案", "等進度條", "填標題", "貼描述", "打標籤", "設隱私"];
  return (
    <Wrap>
      <div style={{ display: "flex", gap: 44, alignItems: "flex-start", marginTop: 46 }}>
        {/* 左:手動流程鏈(c2-1 逐一亮) */}
        <Card c={ACC.rose} style={{ width: 560, padding: "34px 42px" }}>
          <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 32, color: "#fff", marginBottom: 20 }}>
            手動上傳一支片 <span style={{ color: ACC.rose }}>= 7 道工</span>
          </div>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, padding: "7px 0", opacity: rise(f, m[0].start + 10 + i * 16, 10) }}>
              <span style={{ width: 34, height: 34, borderRadius: 999, background: rgba(ACC.rose, 0.14), border: `1px solid ${rgba(ACC.rose, 0.45)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, color: ACC.rose }}>{i + 1}</span>
              <span style={{ ...gloss(28), color: rgba("#ffffff", 0.85) }}>{s}</span>
              {i === STEPS.length - 1 && <span style={{ ...gloss(24), color: rgba("#ffffff", 0.5), marginLeft: "auto" }}>×3 次下一步</span>}
            </div>
          ))}
          <div style={{ ...hairline, margin: "18px 0 16px" }} />
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 29, color: ACC.gold, opacity: rise(f, m[1].start + 6, 12) }}>
            10 分/支 → 一個月 <span style={{ fontFamily: FONT.mono, fontSize: 38 }}>2</span> 小時體力活
          </div>
        </Card>
        {/* 右:泡泡牆(c2-3 逐顆彈出) → API 正門(c2-5) */}
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 22 }}>
          {BUBBLES.map((b, i) => (
            <div key={i} style={{ alignSelf: i % 2 ? "flex-end" : "flex-start", maxWidth: 780, padding: "20px 30px", borderRadius: 20, borderTopLeftRadius: i % 2 ? 20 : 6, borderTopRightRadius: i % 2 ? 6 : 20, background: "rgba(13,19,34,0.9)", border: `1px solid ${rgba(ACC.rose, 0.35)}`, boxShadow: `0 12px 26px ${rgba("#0b1020", 0.25)}`, opacity: rise(f, m[2].start + 8 + i * 24, 12), transform: `translateY(${(1 - rise(f, m[2].start + 8 + i * 24, 12)) * 16}px)` }}>
              <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 24, lineHeight: 1.5, color: rgba("#ffffff", 0.88) }}>{b.text}</div>
              <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 20, color: rgba("#ffffff", 0.45) }}>— {b.src}(逐字引用)</div>
            </div>
          ))}
          {/* c2-5 官方正門 */}
          <Card c={ACC.mint} style={{ padding: "26px 36px", opacity: rise(f, m[3].start + 6, 12) }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ width: 58, height: 40, borderRadius: 10, background: ACC.yt, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${rgba(ACC.yt, 0.45)}` }}>
                <span style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "15px solid #fff", marginLeft: 3 }} />
              </span>
              <div>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, color: "#fff" }}>
                  官方正門:<span style={{ fontFamily: FONT.mono, color: ACC.mint }}>YouTube Data API v3</span>
                </div>
                <div style={{ ...gloss(24), marginTop: 4 }}>程式直接把影片送進你的頻道</div>
              </div>
            </div>
            {/* c2-6 門檻名詞 */}
            <div style={{ position: "relative", display: "flex", gap: 14, marginTop: 20, opacity: rise(f, m[4].start + 6, 12) }}>
              {["OAuth", "同意畫面", "用戶端 ID", "憑證檔"].map((t) => (
                <span key={t} style={{ padding: "7px 20px", borderRadius: 999, background: rgba("#ffffff", 0.06), border: `1px solid ${rgba("#ffffff", 0.18)}`, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 24, color: rgba("#ffffff", 0.7) }}>{t}</span>
              ))}
              <span style={{ ...gloss(24), alignSelf: "center", color: rgba("#ffffff", 0.5) }}>← 大多數人卡在這</span>
            </div>
            {/* c2-7 Claude 帶路 */}
            <div style={{ position: "relative", marginTop: 20, opacity: rise(f, m[5].start + 6, 12) }}>
              <span style={{ ...emberPill, padding: "10px 28px", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27 }}>Claude 帶路走過一次 · 全程截圖存證 · 照著走就好</span>
            </div>
          </Card>
        </div>
      </div>
    </Wrap>
  );
};

/* ════════════════════════ CH3 產線全景地圖 ════════════════════════ */
export const MapScene: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const Step: React.FC<{ n: number; label: string; c: string; at: number }> = ({ n, label, c, at }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", opacity: rise(f, at, 10) }}>
      <span style={{ width: 36, height: 36, borderRadius: 999, background: rgba(c, 0.14), border: `1px solid ${rgba(c, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontWeight: 700, fontSize: 21, color: c }}>{n}</span>
      <span style={{ ...gloss(29), color: rgba("#ffffff", 0.86) }}>{label}</span>
    </div>
  );
  return (
    <Wrap>
      <div style={{ display: "flex", alignItems: "stretch", gap: 30 }}>
        {/* 左:一次性設定 */}
        <Card c={ACC.ember} style={{ width: 620, padding: "34px 42px", opacity: rise(f, m[1].start + 4, 12) }}>
          <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 36, color: "#fff" }}>一次性設定</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: ACC.gold }}>5 min</span>
            <span style={{ ...gloss(23), marginLeft: "auto", color: rgba("#ffffff", 0.5) }}>人只動手這一次</span>
          </div>
          <Step n={1} label="建 Google Cloud 專案" c={ACC.ember} at={m[1].start + 14} />
          <Step n={2} label="啟用 YouTube Data API v3" c={ACC.ember} at={m[1].start + 26} />
          <Step n={3} label="OAuth 同意畫面＋白名單" c={ACC.ember} at={m[1].start + 38} />
          <Step n={4} label="下載憑證檔＋首次授權" c={ACC.ember} at={m[1].start + 50} />
        </Card>
        {/* 中:兩個檔案=橋樑 */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, opacity: rise(f, m[3].start + 4, 12) }}>
          {([
            ["client_secrets.json", "身分證 · 辦一次", ACC.gold, m[4].start + 4],
            [".yt_token.json", "通行證 · 自動保存", ACC.mint, m[4].start + 18],
          ] as const).map(([file, tag, c, at]) => (
            <div key={file} style={{ width: 430, padding: "20px 28px", borderRadius: 18, background: "#0B1220", border: `1px solid ${rgba(c, 0.55)}`, boxShadow: `0 0 ${18 + 10 * rise(f, at, 12)}px ${rgba(c, 0.3)}`, textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 27, color: "#fff" }}>{file}</div>
              <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 24, color: c, marginTop: 6 }}>{tag}</div>
            </div>
          ))}
          <div style={{ textAlign: "center", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 25, color: ACC.inkSoft, opacity: rise(f, m[5].start + 6, 12) }}>
            之後 Claude 拿通行證<br />直接進門 →
          </div>
        </div>
        {/* 右:每次全自動 */}
        <Card c={ACC.mint} style={{ width: 620, padding: "34px 42px", opacity: rise(f, m[2].start + 4, 12) }}>
          <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 36, color: "#fff" }}>每次全自動</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: ACC.mint }}>∞</span>
            <span style={{ ...gloss(23), marginLeft: "auto", color: rgba("#ffffff", 0.5) }}>Claude 全包</span>
          </div>
          <Step n={1} label="Claude 寫好標題描述檔" c={ACC.mint} at={m[2].start + 14} />
          <Step n={2} label="一句指令執行上傳腳本" c={ACC.mint} at={m[2].start + 26} />
          <Step n={3} label="YouTube API 收件" c={ACC.mint} at={m[2].start + 38} />
          <Step n={4} label="連結回報到手" c={ACC.mint} at={m[2].start + 50} />
        </Card>
      </div>
    </Wrap>
  );
};

/* ════════════════════════ CH12 之後的日常 ════════════════════════ */
export const DailyScene: React.FC<SceneProps & { promptText?: string }> = ({ marks: m, promptText }) => {
  const f = useCurrentFrame();
  const pub = rise(f, m[4].start + 20, 14); // unlisted→public 撥桿(m[0]=prompt 句後順延)
  return (
    <Wrap>
      {promptText && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, opacity: rise(f, m[0].start + 4, 12) }}>
          <span style={{ fontSize: 30 }}>💬</span>
          <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 16, glow: 0.8 }), padding: "14px 28px", maxWidth: 1320 }}>
            <Glare />
            <span style={{ position: "relative", fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: 28, color: "#fff" }}>
              <span style={{ color: ACC.gold, marginRight: 8 }}>&gt;</span>{promptText}
            </span>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
        {/* 左:描述檔 */}
        <Card c={ACC.signal} style={{ width: 760, padding: 0, opacity: rise(f, m[2].start + 4, 12) }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", height: 50, padding: "0 24px", background: rgba("#ffffff", 0.04), borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 22, color: rgba("#ffffff", 0.5) }}>video.meta.yaml</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 20, color: ACC.signal }}>描述檔 = 上片說明書</span>
          </div>
          <div style={{ position: "relative", padding: "24px 34px", fontFamily: FONT.monoCjk, fontSize: 25, lineHeight: 1.9 }}>
            <div><span style={{ color: ACC.signal }}>title:</span> <span style={{ color: rgba("#ffffff", 0.88) }}>5 分鐘設定,YouTube 上片全自動…</span></div>
            <div style={{ opacity: rise(f, m[3].start + 4, 10) }}><span style={{ color: ACC.signal }}>description:</span> <span style={{ color: rgba("#ffffff", 0.7) }}>問題開頭+具體數字</span></div>
            <div style={{ opacity: rise(f, m[3].start + 18, 10) }}><span style={{ color: ACC.signal }}>chapters:</span> <span style={{ color: rgba("#ffffff", 0.7) }}>00:00 封面 / 00:12 為什麼…</span></div>
            <div style={{ opacity: rise(f, m[3].start + 32, 10) }}><span style={{ color: ACC.signal }}>tags:</span> <span style={{ color: rgba("#ffffff", 0.7) }}>[YouTube API, OAuth, 自動化]</span></div>
            <div><span style={{ color: ACC.signal }}>privacy:</span> <span style={{ color: ACC.gold, fontWeight: 700 }}>unlisted</span> <span style={{ color: rgba("#ffffff", 0.45) }}># 先不公開,把關後才轉</span></div>
            <div style={{ ...hairline, margin: "16px 0" }} />
            <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: rgba("#ffffff", 0.85), opacity: rise(f, m[7].start + 6, 12) }}>
              頁面會消失,<span style={{ color: ACC.emberSoft }}>檔案永遠能重來</span> — 跟小紅書產線同一個中心思想
            </div>
          </div>
        </Card>
        {/* 右:把關撥桿 + 配額卡 */}
        <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 26 }}>
          <Card c={ACC.violet} style={{ padding: "30px 38px", opacity: rise(f, m[4].start + 4, 12) }}>
            <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 18 }}>
              最後一道把關 <span style={{ color: ACC.violet }}>留給人</span>
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 }}>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 27, color: pub > 0.5 ? rgba("#ffffff", 0.4) : ACC.gold }}>unlisted</span>
              <div style={{ width: 92, height: 44, borderRadius: 999, background: pub > 0.5 ? rgba(ACC.mint, 0.25) : rgba("#ffffff", 0.08), border: `1px solid ${pub > 0.5 ? ACC.mint : rgba("#ffffff", 0.25)}`, position: "relative" }}>
                <div style={{ position: "absolute", top: 4, left: 6 + pub * 46, width: 34, height: 34, borderRadius: 999, background: pub > 0.5 ? ACC.mint : rgba("#ffffff", 0.55), boxShadow: `0 2px 8px rgba(0,0,0,0.4)` }} />
              </div>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 27, color: pub > 0.5 ? ACC.mint : rgba("#ffffff", 0.4) }}>public</span>
              <span style={{ ...gloss(24), color: rgba("#ffffff", 0.55) }}>我檢查完才撥</span>
            </div>
            <div style={{ position: "relative", marginTop: 18, ...gloss(25), opacity: rise(f, m[5].start + 6, 12) }}>
              縮圖、播放清單 → 同一套 API 自動掛上 ✓
            </div>
          </Card>
          <Card c={ACC.gold} style={{ padding: "30px 38px", opacity: rise(f, m[6].start + 4, 12) }}>
            <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 29, color: "#fff", marginBottom: 14 }}>
              配額(2025-12 新制) <span style={{ ...gloss(22), color: rgba("#ffffff", 0.5) }}>跟帳號等級無關</span>
            </div>
            <div style={{ position: "relative", display: "flex", gap: 46 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: ACC.gold, textShadow: `0 0 18px ${rgba(ACC.gold, 0.4)}` }}>100</span>
                <span style={{ ...gloss(24), whiteSpace: "nowrap" }}>支/天 · 上傳獨立額度</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: rgba("#ffffff", 0.85) }}>10,000</span>
                <span style={{ ...gloss(24), whiteSpace: "nowrap" }}>點/天 · 其他操作</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Wrap>
  );
};

/* ════════════════════════ CH13 複盤＋CTA ════════════════════════ */
export const OutroScene: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const STEPS = ["建專案", "開 API", "同意畫面", "加測試使用者", "憑證改名放好", "裝套件", "授權一次"];
  const PITS: [string, string][] = [
    ["Access blocked", "回去補白名單"],
    ["檔名一長串亂碼", "改名 client_secrets.json"],
    ["老 pip 不認新參數", "拿掉參數直接裝"],
  ];
  return (
    <Wrap>
      {/* 複盤鏈 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 30, flexWrap: "wrap", justifyContent: "center", maxWidth: 1560 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <span style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(13,19,34,0.9)", border: `1px solid ${rgba(ACC.ember, 0.45)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: "#fff", opacity: rise(f, m[0].start + 8 + i * 12, 10) }}>{s}</span>
            {i < STEPS.length - 1 && <span style={{ alignSelf: "center", color: ACC.ember, fontWeight: 700, fontSize: 24, opacity: rise(f, m[0].start + 14 + i * 12, 10) }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      {/* 三坑卡 */}
      <div style={{ display: "flex", gap: 24, marginBottom: 30 }}>
        {PITS.map(([pit, fix], i) => (
          <Card key={pit} c={ACC.rose} style={{ width: 480, padding: "24px 30px", opacity: rise(f, m[1].start + 8 + i * 14, 12) }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 25, color: ACC.rose }}>坑{i + 1}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: "#fff" }}>{pit}</span>
            </div>
            <div style={{ position: "relative", marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 25, color: ACC.mint }}>✓ {fix}</div>
          </Card>
        ))}
      </div>
      {/* 遷移+產線完成 */}
      <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 30, opacity: rise(f, m[2].start + 6, 12) }}>
        {["YouTube", "日曆", "雲端硬碟", "試算表"].map((t) => (
          <span key={t} style={{ padding: "8px 22px", borderRadius: 999, background: rgba(ACC.signal, 0.1), border: `1px solid ${rgba(ACC.signal, 0.4)}`, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 25, color: ACC.ink }}>{t}</span>
        ))}
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: ACC.inkSoft }}>← 同一套憑證流程,學一次用到處</span>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 34, opacity: rise(f, m[3].start + 6, 12) }}>
        {["寫程式", "配音", "算繪", "上傳"].map((s, i) => (
          <React.Fragment key={s}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 14, background: "rgba(13,19,34,0.9)", border: `1px solid ${rgba(ACC.mint, 0.5)}` }}>
              <span style={{ color: ACC.mint, fontWeight: 800, fontSize: 24 }}>✓</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: "#fff" }}>{s}</span>
            </span>
            {i < 3 && <span style={{ color: ACC.mint, fontWeight: 700, fontSize: 24 }}>→</span>}
          </React.Fragment>
        ))}
        <span style={{ marginLeft: 10, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30, ...{ color: ACC.ink } }}>全自動影片工廠 · <span style={{ color: ACC.ember }}>最後一塊拼圖</span></span>
      </div>
      {/* CTA */}
      <div style={{ display: "flex", gap: 22, alignItems: "center", opacity: rise(f, m[4].start + 6, 12) }}>
        {["訂閱", "按讚", "分享"].map((t) => (
          <span key={t} style={{ ...emberPill, padding: "14px 44px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 34 }}>{t}</span>
        ))}
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 27, color: ACC.muted, letterSpacing: 3, marginLeft: 8 }}>AI WISDOM · @aiwisdomcc</span>
      </div>
    </Wrap>
  );
};
