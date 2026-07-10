import React from "react";
import { FONT } from "../../shared-skills/theme";
import { ACC, darkCard, Glare, rgba } from "./glass";

/**
 * 依「實際觀察到的 developers.facebook.com 真實 UI」忠實重建的黑曜石版 Meta 畫面（非截圖）。
 * 參考時間 2026-07-05 實際登入畫面：
 *   - 基本資料頁：應用程式編號 994414572924952（真·可公開）、應用程式密鑰預設打碼 ●●●●
 *   - Graph API Explorer：存取權杖(Token 打碼)、Generate Access Token、Meta 應用程式=Autopost、權限清單
 * 敏感值一律假碼：App Secret、Access Token、聯絡信箱改通用值。
 */

const FB_BLUE = ACC.fb;
const PAGE_BG = "#F0F2F5";
const INK = "#1C1E21";
const SUBIN = "#606770";

/** Mac 瀏覽器視窗外框（黑曜石深卡邊 + 網址列），內嵌真實感 Meta 淺色頁面。 */
const MetaFrame: React.FC<{ url: string; children: React.ReactNode; w?: number }> = ({ url, children, w = 1500 }) => (
  <div style={{ ...darkCard(ACC.fb, { r: 20, glow: 0.9 }), position: "relative", overflow: "hidden", width: w }}>
    <Glare />
    {/* 瀏覽器 chrome */}
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57" }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E" }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28C840" }} />
      <div style={{ marginLeft: 14, flex: 1, maxWidth: 620, padding: "7px 18px", borderRadius: 999, background: rgba("#060a14", 0.55), border: `1px solid ${rgba("#ffffff", 0.12)}`, fontFamily: FONT.mono, fontSize: 21, color: rgba("#ffffff", 0.7) }}>🔒 {url}</div>
    </div>
    {/* Meta 淺色頁面 */}
    <div style={{ position: "relative", background: PAGE_BG, fontFamily: FONT.uiCjk }}>
      {/* Meta top nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "12px 26px", background: "#fff", borderBottom: "1px solid #DADDE1" }}>
        <span style={{ fontWeight: 800, fontSize: 26, color: FB_BLUE, letterSpacing: 1 }}>∞ Meta</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: FB_BLUE, background: rgba(FB_BLUE, 0.12), padding: "6px 14px", borderRadius: 8 }}>我的應用程式</span>
        <span style={{ fontSize: 20, color: SUBIN }}>文件</span>
        <span style={{ fontSize: 20, color: SUBIN }}>工具</span>
        <span style={{ fontSize: 20, color: SUBIN }}>支援</span>
      </div>
      {children}
    </div>
  </div>
);

const Field: React.FC<{ label: string; value: React.ReactNode; highlight?: string; mono?: boolean }> = ({ label, value, highlight, mono }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 19, fontWeight: 700, color: INK, marginBottom: 8 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, padding: "13px 16px", borderRadius: 8, background: highlight ? rgba(highlight, 0.1) : "#fff", border: `2px solid ${highlight ?? "#CCD0D5"}`, fontFamily: mono ? FONT.mono : FONT.uiCjk, fontSize: 22, color: INK }}>{value}</div>
    </div>
  </div>
);

/** CH3：Autopost → 應用程式設定 → 基本資料（App ID + App Secret）。 */
export const MetaBasicSettings: React.FC = () => (
  <MetaFrame url="developers.facebook.com/apps/…/settings/basic">
    <div style={{ display: "flex", minHeight: 380 }}>
      {/* 左側 nav */}
      <div style={{ width: 230, background: "#fff", borderRight: "1px solid #DADDE1", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, border: "1px solid #CCD0D5", marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>⚙️</span><span style={{ fontWeight: 700, fontSize: 20, color: INK }}>Autopost</span>
        </div>
        {["🏠 主控板", "✅ 必要動作", "✏️ 使用案例", "💼 商家專用登入", "🛡 檢查"].map((t) => (
          <div key={t} style={{ padding: "9px 12px", fontSize: 19, color: SUBIN }}>{t}</div>
        ))}
        <div style={{ padding: "9px 12px", fontSize: 19, fontWeight: 700, color: FB_BLUE, background: rgba(FB_BLUE, 0.1), borderRadius: 8 }}>⚙️ 應用程式設定 · 基本</div>
      </div>
      {/* 主內容 */}
      <div style={{ flex: 1, padding: "30px 40px" }}>
        <div style={{ display: "flex", gap: 34, marginBottom: 30 }}>
          <Field label="應用程式編號（App ID）" value="994414572924952" highlight={FB_BLUE} mono />
          <Field label="應用程式密鑰（App Secret）" value={<span style={{ letterSpacing: 3 }}>●●●●●●●●●●●● <span style={{ float: "right", color: FB_BLUE, fontWeight: 700, fontFamily: FONT.uiCjk }}>顯示</span></span>} highlight={ACC.rose} mono />
        </div>
        <div style={{ display: "flex", gap: 34 }}>
          <Field label="顯示名稱" value="Autopost" />
          <Field label="聯絡電子郵件" value="your-email@example.com" />
        </div>
      </div>
    </div>
  </MetaFrame>
);

const TokenPill: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: active ? rgba(FB_BLUE, 0.1) : "#fff", border: `2px solid ${active ? FB_BLUE : "#E4E6EB"}` }}>
    <span style={{ fontFamily: FONT.mono, fontSize: 21, color: active ? FB_BLUE : SUBIN, fontWeight: active ? 700 : 500 }}>✕ {label}</span>
  </div>
);

/** CH4：圖形 API 測試工具（Graph API Explorer）。 */
export const MetaExplorer: React.FC = () => (
  <MetaFrame url="developers.facebook.com/tools/explorer">
    <div style={{ padding: "16px 28px" }}>
      <div style={{ fontSize: 19, color: SUBIN, marginBottom: 10 }}>圖形 API 測試工具</div>
      {/* 請求列 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {["GET", "graph.facebook.com/", "v19.0", "me?fields=id,name"].map((t, i) => (
          <div key={i} style={{ padding: "10px 14px", borderRadius: 8, background: "#fff", border: "1px solid #CCD0D5", fontFamily: FONT.mono, fontSize: 21, color: INK, flex: i === 3 ? 1 : "none" }}>{t}{i < 2 ? " ▾" : ""}</div>
        ))}
        <div style={{ padding: "10px 22px", borderRadius: 8, background: FB_BLUE, color: "#fff", fontWeight: 700, fontSize: 21 }}>提交</div>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {/* 左：回應區 */}
        <div style={{ flex: 1, minHeight: 150, background: "#fff", borderRadius: 10, border: "1px solid #DADDE1" }} />
        {/* 右：存取權杖面板 */}
        <div style={{ width: 480, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 22, color: INK }}>存取權杖</div>
          <div style={{ padding: "12px 16px", borderRadius: 8, background: "#fff", border: "2px solid #E4E6EB", fontFamily: FONT.mono, fontSize: 20, color: INK }}>EAAOIai9g8Bg••••••••••••••••</div>
          <div style={{ padding: "13px", borderRadius: 8, background: FB_BLUE, color: "#fff", fontWeight: 700, fontSize: 22, textAlign: "center" }}>Generate Access Token</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: INK, marginBottom: 6 }}>Meta 應用程式</div>
            <div style={{ padding: "11px 14px", borderRadius: 8, background: "#fff", border: "2px solid #CCD0D5", fontSize: 21, color: INK, display: "flex", justifyContent: "space-between" }}>Autopost <span>▾</span></div>
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: INK, marginBottom: 6 }}>用戶或粉絲專頁</div>
            <div style={{ padding: "11px 14px", borderRadius: 8, background: rgba(ACC.mint, 0.1), border: `2px solid ${ACC.mint}`, fontSize: 21, color: INK, display: "flex", justifyContent: "space-between" }}>粉絲專頁：峻清书画 <span>▾</span></div>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: INK, marginTop: 4 }}>權限（勾這兩個）</div>
          <TokenPill label="pages_manage_posts" active />
          <TokenPill label="pages_read_engagement" active />
        </div>
      </div>
    </div>
  </MetaFrame>
);
