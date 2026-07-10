import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, darkCard, Glare, emberPill, rgba } from "./glass";

/**
 * tutorial-video-show-claude-prompts 規則的兩個載體：
 *  ① PromptChip：每個動作站底部一條「💬 對 Claude 說的話」obsidian 藥丸(可暫停複製)。
 *  ② MasterPromptScene：片尾「看到最後的禮物」——合成的完整 master prompt(逐字,已對照
 *     automation-pw 的 xhs-chrome-launch.sh + xhs-post-video.mjs 驗證)+⚠️警語。
 */

const rise = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 動作站底部 💬 prompt 藥丸。放 bottom:128(字幕上方),整片一致。 */
export const PromptChip: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = rise(f, 14, 14);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 128, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 16, glow: 0.6 }), maxWidth: 1560, padding: "13px 30px", display: "flex", alignItems: "center", gap: 16 }}>
        <Glare />
        <span style={{ position: "relative", fontSize: 30 }}>💬</span>
        <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 30, letterSpacing: 0.5, color: "#fff", whiteSpace: "nowrap" }}>
          對 Claude 說：<span style={{ color: ACC.emberSoft, fontWeight: 700 }}>{text}</span>
        </span>
      </div>
    </div>
  );
};

/** master prompt 內的橙色強調字。 */
const OB: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ACC.emberSoft, fontWeight: 700 }}>{children}</span>
);
/** master prompt 內的 mono 代碼片段。 */
const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: 23, color: ACC.gold, background: rgba("#000000", 0.32), padding: "1px 8px", borderRadius: 6 }}>{children}</span>
);

/** master prompt 的六段(逐字對照程式驗證過)。 */
const STEPS: [string, React.ReactNode][] = [
  ["① 環境", <>用系統 Chrome 開 <Code>--remote-debugging-port=9222</Code> + 獨立 profile，<OB>不要加 --enable-automation</OB>，讓 <Code>navigator.webdriver</Code> 維持 false；我第一次自己掃碼登入創作平台。</>],
  ["② 接管", <>用 <Code>chromium.connectOverCDP('http://localhost:9222')</Code> 接上這顆已登入的真 Chrome。</>],
  ["③ 發布包", <>定「一個資料夾 = 一篇筆記」格式：<Code>00_封面.jpg</Code>(3:4壓字)、編號圖片、<Code>文案.txt</Code>、影片版加 mp4 + <Code>章节.tsv</Code>；腳本只認格式。</>],
  ["④ 上傳", <>開 <Code>creator.xiaohongshu.com</Code> 發布頁，用 CDP <Code>DOM.setFileInputFiles</Code> 傳影片路徑(繞 50MB)；等轉碼→填標題/正文/標籤(精準命中才選真話題)/設仅自己可见/封面/章節(先名後時間、讀回核對才存)。</>],
  ["⑤ 安全防封", <><OB>先發仅自己可见自檢才轉公開</OB>、一天≤1–3篇、<OB>發布鈕永遠留我自己按</OB>；發布前手動開原创声明、添加地点、確認合集；cookie 當密碼不外流。</>],
  ["⑥ 一句話跑", <>給我 <Code>{'node xhs-post-video.mjs "<發布包資料夾>"'}</Code>，並教我確認真的接上了。</>],
];

/** 片尾「看到最後的禮物」——完整 master prompt 場景。 */
export const MasterPromptScene: React.FC = () => {
  const f = useCurrentFrame();
  const head = rise(f, 6, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "44px 70px 150px" }}>
      <div style={{ opacity: head, display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
        <span style={{ ...emberPill, padding: "12px 34px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, letterSpacing: 2 }}>🎁 看到最後的禮物</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 30, letterSpacing: 1, color: ACC.inkSoft }}>整段複製，貼給 Claude 就從零幫你建好</span>
      </div>

      <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 26, glow: 0.9 }), width: 1580, padding: "30px 44px", opacity: rise(f, 20, 16) }}>
        <Glare />
        {/* 開頭句 */}
        <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 18, lineHeight: 1.4 }}>
          Hi Claude，幫我在自己 Mac 上做一套「小紅書全自動發文」，用 Playwright 接管我自己開的真 Chrome、不靠付費工具。一步步帶我做：
        </div>
        {/* 六段 */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map(([k, body], i) => (
            <div key={k} style={{ display: "flex", gap: 16, opacity: rise(f, 34 + i * 6, 12) }}>
              <span style={{ flex: "0 0 148px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 26, color: ACC.gold, whiteSpace: "nowrap" }}>{k}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 25, lineHeight: 1.5, color: rgba("#ffffff", 0.9) }}>{body}</span>
            </div>
          ))}
        </div>
        {/* ⚠️ 警語 */}
        <div style={{ position: "relative", marginTop: 20, padding: "14px 24px", borderRadius: 12, background: rgba(ACC.rose, 0.14), border: `1px solid ${rgba(ACC.rose, 0.5)}`, opacity: rise(f, 76, 14) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 25, color: "#FFB4C0" }}>⚠️ 小紅書官方不鼓勵自動化發文</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 25, color: rgba("#ffffff", 0.9) }}>　請壓低頻率、內容真實、風險自負。</span>
        </div>
      </div>

      <div style={{ opacity: rise(f, 92, 14), marginTop: 20, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: ACC.ember }}>
        暫停這一格　→　全選複製　→　貼給 Claude
      </div>
    </AbsoluteFill>
  );
};
