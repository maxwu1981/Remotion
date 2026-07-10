import React from "react";
import { FONT } from "../../shared-skills/theme";
import { ACC, darkCard, Glare, rgba } from "./glass";

/**
 * 依真實 UI 忠實重建的黑曜石版畫面（非截圖；概化示意店，不露真實店家）。
 *   - ClaudeConnectors：claude.ai 設定 → 連接器（加入 Shopify 並授權）
 *   - ShopifyInventoryPanel：Shopify 後台商品頁「庫存」卡（預設 vs 三件套設好）
 * 敏感值一律示意：店名=示意店 Demo Studio、網域=demo-studio.myshopify.com。
 */

const SHOP_GREEN = "#008060";
const PAGE_BG = "#F6F6F7";
const INK = "#202223";
const SUBIN = "#6D7175";

/** Mac 瀏覽器視窗外框（黑曜石深卡邊 + 網址列），內嵌真實感淺色頁面。 */
const BrowserFrame: React.FC<{ url: string; accent: string; children: React.ReactNode; w?: number }> = ({ url, accent, children, w = 1500 }) => (
  <div style={{ ...darkCard(accent, { r: 20, glow: 0.9 }), position: "relative", overflow: "hidden", width: w }}>
    <Glare />
    {/* 瀏覽器 chrome */}
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57" }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E" }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28C840" }} />
      <div style={{ marginLeft: 14, flex: 1, maxWidth: 620, padding: "7px 18px", borderRadius: 999, background: rgba("#060a14", 0.55), border: `1px solid ${rgba("#ffffff", 0.12)}`, fontFamily: FONT.mono, fontSize: 21, color: rgba("#ffffff", 0.7) }}>🔒 {url}</div>
    </div>
    <div style={{ position: "relative", background: PAGE_BG, fontFamily: FONT.uiCjk }}>{children}</div>
  </div>
);

/** CH3：claude.ai 設定 → 連接器 → 加入 Shopify 並授權。 */
export const ClaudeConnectors: React.FC = () => (
  <BrowserFrame url="claude.ai/settings/connectors" accent={ACC.ember}>
    <div style={{ display: "flex", minHeight: 400 }}>
      {/* 左側 nav */}
      <div style={{ width: 230, background: "#fff", borderRight: "1px solid #E1E3E5", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>✳️</span><span style={{ fontWeight: 700, fontSize: 20, color: INK }}>Claude 設定</span>
        </div>
        {["👤 個人資料", "🎨 外觀", "⚙️ 功能"].map((t) => (
          <div key={t} style={{ padding: "9px 12px", fontSize: 19, color: SUBIN }}>{t}</div>
        ))}
        <div style={{ padding: "9px 12px", fontSize: 19, fontWeight: 700, color: ACC.ember, background: rgba(ACC.ember, 0.1), borderRadius: 8 }}>🔌 連接器 Connectors</div>
      </div>
      {/* 主內容：連接器清單 */}
      <div style={{ flex: 1, padding: "26px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 26, color: INK, marginBottom: 4 }}>連接器</div>
        {/* Shopify 高亮列 */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 12, background: rgba(SHOP_GREEN, 0.08), border: `2px solid ${SHOP_GREEN}` }}>
          <span style={{ width: 52, height: 52, borderRadius: 12, background: SHOP_GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🛍</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 23, color: INK }}>Shopify</div>
            <div style={{ fontSize: 19, color: SUBIN }}>管理商品、庫存、訂單與商店資料</div>
          </div>
          <div style={{ padding: "11px 30px", borderRadius: 10, background: SHOP_GREEN, color: "#fff", fontWeight: 800, fontSize: 21 }}>連接</div>
        </div>
        {/* 授權視窗提示 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 22px", borderRadius: 12, background: "#fff", border: "1px solid #E1E3E5" }}>
          <span style={{ fontSize: 24 }}>🔐</span>
          <span style={{ fontSize: 20, color: INK }}>跳出 Shopify 登入 → 登入 <b>demo-studio.myshopify.com</b>（自己的店）→ 授權</span>
          <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: 18, color: SUBIN }}>隨時可撤銷</span>
        </div>
        {/* 其他連接器（弱化） */}
        {[["📁", "Google Drive", "已連接"], ["✉️", "Gmail", "已連接"]].map(([e, t, st]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, padding: "13px 22px", borderRadius: 12, background: "#fff", border: "1px solid #E1E3E5", opacity: 0.6 }}>
            <span style={{ fontSize: 26 }}>{e}</span>
            <span style={{ fontWeight: 700, fontSize: 21, color: INK }}>{t}</span>
            <span style={{ marginLeft: "auto", fontSize: 18, color: SUBIN }}>{st}</span>
          </div>
        ))}
      </div>
    </div>
  </BrowserFrame>
);

const InvRow: React.FC<{ icon: string; label: string; sub: string; before: string; after: string }> = ({ icon, label, sub, before, after }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 12, background: "#fff", border: "1px solid #E1E3E5" }}>
    <span style={{ fontSize: 26 }}>{icon}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 800, fontSize: 22, color: INK }}>{label}</div>
      <div style={{ fontSize: 18, color: SUBIN }}>{sub}</div>
    </div>
    <span style={{ padding: "8px 16px", borderRadius: 999, background: rgba(ACC.rose, 0.1), border: `2px solid ${ACC.rose}`, fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 19, color: "#B42318" }}>預設 {before}</span>
    <span style={{ fontSize: 22, fontWeight: 800, color: SUBIN }}>→</span>
    <span style={{ padding: "8px 16px", borderRadius: 999, background: rgba(SHOP_GREEN, 0.1), border: `2px solid ${SHOP_GREEN}`, fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 19, color: SHOP_GREEN }}>{after}</span>
  </div>
);

/** CH6：Shopify 後台商品頁「庫存」卡 — 預設值 vs 三件套設好。 */
export const ShopifyInventoryPanel: React.FC = () => (
  <BrowserFrame url="admin.shopify.com/store/demo-studio/…" accent={ACC.rose}>
    <div style={{ padding: "22px 36px 28px" }}>
      {/* 商品頁頂列 */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <span style={{ width: 46, height: 46, borderRadius: 10, background: `linear-gradient(150deg, ${rgba(SHOP_GREEN, 0.25)}, ${rgba(ACC.ember, 0.2)})`, border: "1px solid #E1E3E5" }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 23, color: INK }}>Original Chinese Ink Landscape Painting | 山霧晨光</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 17, color: SUBIN }}>demo-studio.myshopify.com · 獨一件原作</div>
        </div>
        <span style={{ marginLeft: "auto", padding: "7px 16px", borderRadius: 999, background: rgba(SHOP_GREEN, 0.12), fontWeight: 700, fontSize: 18, color: SHOP_GREEN }}>Active</span>
      </div>
      {/* 庫存卡 */}
      <div style={{ fontWeight: 800, fontSize: 21, color: INK, margin: "0 0 10px 2px" }}>庫存 Inventory</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <InvRow icon="📊" label="追蹤數量 Track quantity" sub="不開＝Shopify 根本不管你剩幾件" before="✘ 關" after="✔ tracked=true" />
        <InvRow icon="🚫" label="缺貨後繼續銷售" sub="開了＝獨一件原作可以被買兩次" before="有時開" after="✔ DENY 賣完即止" />
        <InvRow icon="1️⃣" label="數量 Quantity（Shop location）" sub="原作只有一件" before="0" after="✔ qty=1" />
      </div>
    </div>
  </BrowserFrame>
);
