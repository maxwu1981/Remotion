import React from "react";
import { FONT } from "../../shared-skills/theme";

/**
 * 三張圖的 **16:9 寬版**（1280×720，大字），給 v3 影片全圖呈現用——填滿畫面、
 * 字夠大夠清楚。座標系即各自的 viewBox；SpotScene 用區塊矩形(viewBox 單位)高亮。
 */

const STYLE = `
.s-tt{font-weight:800;font-size:27px;fill:#14142B;stroke:none}
.s-th{font-weight:700;font-size:23px;fill:#14142B;stroke:none}
.s-ts{font-weight:500;font-size:18px;fill:#566074;stroke:none}
.b-frame{fill:#FFFFFF;stroke:#E0E4EC;stroke-width:1.5}
.b-teal{fill:#E1F5EE;stroke:#1D9E75;stroke-width:1.8}
.b-gray{fill:#F1EFE8;stroke:#A9A79E;stroke-width:1.8}
.b-coral{fill:#FAECE7;stroke:#D85A30;stroke-width:1.8}
.b-purple{fill:#EEEDFE;stroke:#7F77DD;stroke-width:1.8}
.b-amber{fill:#FAEEDA;stroke:#EF9F27;stroke-width:1.8}
.b-green{fill:#EAF3DE;stroke:#639922;stroke-width:1.8}
.b-red{fill:#FCEBEB;stroke:#E24B4A;stroke-width:1.8}
`;

export const BG = "#F8F9FA";
const K = { teal: "#0F6E56", coral: "#C2410C", red: "#DC2626", green: "#16A34A", dash: "rgba(0,0,0,.34)", purple: "#6D28D9" };
const M = (id: string) => (
  <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker>
);

/** 圖 1 · 世界圖（1280×720）。 */
export const DIAGRAM1 = { w: 1280, h: 720 };
export const Diagram1: React.FC<{ vb?: string }> = ({ vb }) => (
  <svg viewBox={vb ?? "0 0 1280 720"} xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block", fontFamily: FONT.uiCjk }}>
    <style>{STYLE}</style>
    <defs>{M("a1")}</defs>
    <rect x="0" y="0" width="1280" height="720" fill={BG} />
    <g className="b-amber"><rect x="40" y="26" width="1200" height="54" rx="10" /><text x="640" y="61" textAnchor="middle" className="s-tt">核心原則：工作『在哪執行』就決定了 檔案 · 記憶 · 可見性</text></g>

    <rect x="44" y="100" width="548" height="402" rx="14" className="b-frame" />
    <text x="66" y="134" className="s-th">本地世界（你的 Mac）</text>
    <text x="66" y="160" className="s-ts">本地執行 → 只有本地看得到</text>
    <g className="b-gray"><rect x="66" y="176" width="504" height="60" rx="8" /><text x="318" y="201" textAnchor="middle" className="s-th">Claude Code（本地）</text><text x="318" y="224" textAnchor="middle" className="s-ts">CLI 或桌面版 · 讀本機 CLAUDE.md</text></g>
    <g className="b-gray"><rect x="66" y="244" width="504" height="56" rx="8" /><text x="318" y="268" textAnchor="middle" className="s-th">Cowork（只在本地）</text><text x="318" y="290" textAnchor="middle" className="s-ts">手機連不進來 · 碰不到</text></g>
    <rect x="66" y="308" width="504" height="34" rx="8" fill="none" stroke={K.dash} strokeWidth="1.5" strokeDasharray="6 5" /><text x="318" y="330" textAnchor="middle" className="s-ts">沙盒 · 限制本地可碰的路徑 / 網路</text>
    <g className="b-teal"><rect x="66" y="350" width="246" height="74" rx="8" /><text x="189" y="384" textAnchor="middle" className="s-th">本機檔案</text><text x="189" y="407" textAnchor="middle" className="s-ts">真實硬碟</text></g>
    <g className="b-teal"><rect x="324" y="350" width="246" height="74" rx="8" /><text x="447" y="384" textAnchor="middle" className="s-th">本機記憶</text><text x="447" y="407" textAnchor="middle" className="s-ts">本機 CLAUDE.md</text></g>
    <text x="318" y="462" textAnchor="middle" className="s-ts">本地跑的東西 → 手機 / 雲端看不到</text>
    <line x1="318" y1="300" x2="318" y2="308" stroke={K.teal} strokeWidth="2" markerEnd="url(#a1)" />
    <line x1="230" y1="342" x2="195" y2="350" stroke={K.teal} strokeWidth="2" markerEnd="url(#a1)" />
    <line x1="406" y1="342" x2="441" y2="350" stroke={K.teal} strokeWidth="2" markerEnd="url(#a1)" />

    <rect x="688" y="100" width="548" height="402" rx="14" className="b-gray" />
    <text x="710" y="134" className="s-th">雲端 · 伺服器 Server</text>
    <text x="710" y="160" className="s-ts">每次對話配一個臨時容器</text>
    <g className="b-coral"><rect x="710" y="176" width="504" height="72" rx="8" strokeDasharray="7 5" /><text x="962" y="202" textAnchor="middle" className="s-th">臨時容器（用完即丟）</text><text x="962" y="228" textAnchor="middle" className="s-ts">雲端 Claude Code ＝ Dispatch · 碰不到本機</text></g>
    <g className="b-coral"><rect x="710" y="258" width="504" height="56" rx="8" /><text x="962" y="282" textAnchor="middle" className="s-th">Chatbot（持久記憶）</text><text x="962" y="304" textAnchor="middle" className="s-ts">Claude.ai · 碰不到本機</text></g>
    <g className="b-coral"><rect x="710" y="324" width="504" height="64" rx="8" /><text x="962" y="350" textAnchor="middle" className="s-th">雲端記憶（持久 · 不會丟）</text><text x="962" y="373" textAnchor="middle" className="s-ts">雲端 CLAUDE.md（雲端讀這份）</text></g>
    <text x="962" y="462" textAnchor="middle" className="s-ts">雲端跑的 → 本地、手機都看得到</text>

    <line x1="640" y1="108" x2="640" y2="478" stroke={K.red} strokeWidth="2.5" strokeDasharray="8 5" />
    <text x="640" y="500" textAnchor="middle" className="s-ts">單向牆</text>
    <text x="640" y="196" textAnchor="middle" className="s-ts">本地 → 雲端 ✓</text>
    <line x1="594" y1="210" x2="686" y2="210" stroke={K.teal} strokeWidth="2.4" markerEnd="url(#a1)" />
    <text x="640" y="280" textAnchor="middle" className="s-ts">雲端 → 本機 ✗</text>
    <line x1="686" y1="294" x2="606" y2="294" stroke={K.red} strokeWidth="2.4" markerEnd="url(#a1)" />
    <text x="640" y="360" textAnchor="middle" className="s-ts">上傳＝共用</text>
    <line x1="594" y1="374" x2="686" y2="374" stroke={K.green} strokeWidth="2.4" markerEnd="url(#a1)" />

    <g className="b-green"><rect x="40" y="516" width="1200" height="54" rx="10" /><text x="64" y="550" className="s-th">✓ CLAUDE.md & 記憶：本地上傳到雲端 → 共用（單向 · 手動，之後各一份）</text></g>
    <g className="b-purple"><rect x="40" y="578" width="1200" height="54" rx="10" /><text x="64" y="612" className="s-th">✓ 檔案 / 資料：放橋接層 Drive · MCP（本機 + 雲端都可讀）</text></g>
    <g className="b-red"><rect x="40" y="640" width="1200" height="54" rx="10" /><text x="64" y="674" className="s-th">✗ 對話：不能共用，只能自己搬遷過去</text></g>
  </svg>
);

/** 圖 2 · 分層架構（1280×720）。 */
export const DIAGRAM2 = { w: 1280, h: 720 };
export const Diagram2: React.FC<{ vb?: string }> = ({ vb }) => (
  <svg viewBox={vb ?? "0 0 1280 720"} xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block", fontFamily: FONT.uiCjk }}>
    <style>{STYLE}</style>
    <rect x="0" y="0" width="1280" height="720" fill={BG} />
    <g className="b-teal"><rect x="40" y="36" width="1200" height="80" rx="12" /><text x="64" y="74" className="s-th">① 本機真實資源</text><text x="64" y="100" className="s-ts">本機檔案 · 本機 CLAUDE.md / 記憶</text><text x="1216" y="86" textAnchor="end" className="s-ts">只有本地碰得到</text></g>
    <line x1="40" y1="130" x2="1240" y2="130" stroke={K.dash} strokeWidth="1.5" strokeDasharray="6 5" /><text x="64" y="148" className="s-ts">沙盒（權限邊界）：限制本地可碰的路徑 / 網路</text>
    <g className="b-gray"><rect x="40" y="160" width="1200" height="80" rx="12" /><text x="64" y="198" className="s-th">② 本地執行層</text><text x="64" y="224" className="s-ts">Claude Code（本地）· Cowork</text><text x="1216" y="210" textAnchor="end" className="s-ts">本地跑 → 只本地看得到</text></g>
    <g className="b-red"><rect x="40" y="256" width="1200" height="76" rx="12" /><text x="640" y="293" textAnchor="middle" className="s-th">③ 單向牆：本地可上傳 / 讀雲端 ✓ · 雲端讀不到本機 ✗</text><text x="640" y="318" textAnchor="middle" className="s-ts">記憶可上傳；對話搬不動</text></g>
    <g className="b-coral"><rect x="40" y="348" width="1200" height="80" rx="12" strokeDasharray="8 5" /><text x="64" y="386" className="s-th">④ 雲端執行層（臨時 · 用完即丟）</text><text x="64" y="412" className="s-ts">伺服器 → 臨時容器 ＝ 雲端 Claude Code / Dispatch</text><text x="1216" y="398" textAnchor="end" className="s-ts">雲端跑 → 任何裝置看得到</text></g>
    <g className="b-coral"><rect x="40" y="444" width="1200" height="80" rx="12" /><text x="64" y="482" className="s-th">⑤ 雲端資源層（持久 · 不會丟）</text><text x="64" y="508" className="s-ts">雲端 CLAUDE.md · Chatbot 自己的記憶</text><text x="1216" y="494" textAnchor="end" className="s-ts">可被上傳共用</text></g>
    <g className="b-purple"><rect x="40" y="540" width="1200" height="72" rx="12" /><text x="640" y="583" textAnchor="middle" className="s-th">橋接層 Drive / MCP：本機 + 雲端都可讀（檔案上雲端的路）</text></g>
    <text x="40" y="652" className="s-ts">① → ⑤：離你的硬碟越遠、跨越的邊界越多；③ 是過不去的硬牆。虛線＝臨時用完即丟。</text>
  </svg>
);

/** 圖 3 · 資料流向（1280×720）。 */
export const DIAGRAM3 = { w: 1280, h: 720 };
export const Diagram3: React.FC<{ vb?: string }> = ({ vb }) => (
  <svg viewBox={vb ?? "0 0 1280 720"} xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block", fontFamily: FONT.uiCjk }}>
    <style>{STYLE}</style>
    <defs>{M("a3")}</defs>
    <rect x="0" y="0" width="1280" height="720" fill={BG} />
    <text x="640" y="56" textAnchor="middle" className="s-ts">本地 ｜ 雲端（單向牆）</text>
    <g className="b-teal"><rect x="80" y="96" width="380" height="96" rx="12" /><text x="270" y="138" textAnchor="middle" className="s-th">本機檔案 / 記憶</text><text x="270" y="166" textAnchor="middle" className="s-ts">~/.claude · 真實硬碟</text></g>
    <g className="b-coral"><rect x="820" y="96" width="380" height="96" rx="12" /><text x="1010" y="138" textAnchor="middle" className="s-th">Chatbot</text><text x="1010" y="166" textAnchor="middle" className="s-ts">自己的記憶 · 雲端</text></g>
    <g className="b-gray"><rect x="80" y="320" width="380" height="100" rx="12" /><text x="270" y="364" textAnchor="middle" className="s-th">本地執行（你的 Mac）</text><text x="270" y="392" textAnchor="middle" className="s-ts">Claude Code · Cowork</text></g>
    <g className="b-coral"><rect x="820" y="306" width="380" height="124" rx="12" /><text x="1010" y="346" textAnchor="middle" className="s-th">雲端臨時容器</text><text x="1010" y="374" textAnchor="middle" className="s-ts">雲端 Claude Code / Dispatch</text><text x="1010" y="400" textAnchor="middle" className="s-ts">讀雲端 CLAUDE.md</text></g>
    <g className="b-purple"><rect x="80" y="560" width="1120" height="84" rx="12" /><text x="640" y="597" textAnchor="middle" className="s-th">橋接層 Drive / MCP</text><text x="640" y="624" textAnchor="middle" className="s-ts">本機 + 雲端都可讀（檔案上雲端的路）</text></g>
    <line x1="270" y1="192" x2="270" y2="320" stroke={K.teal} strokeWidth="2.4" markerStart="url(#a3)" markerEnd="url(#a3)" /><text x="290" y="262" className="s-ts">讀寫</text>
    <line x1="460" y1="352" x2="820" y2="352" stroke={K.coral} strokeWidth="2.4" markerEnd="url(#a3)" /><text x="640" y="340" textAnchor="middle" className="s-ts">dispatch 派工</text>
    <line x1="820" y1="392" x2="460" y2="392" stroke="#7a7a72" strokeWidth="2.4" markerEnd="url(#a3)" /><text x="640" y="416" textAnchor="middle" className="s-ts">結果回傳（檢視 / PR）</text>
    <line x1="460" y1="150" x2="820" y2="320" stroke={K.green} strokeWidth="2.4" markerEnd="url(#a3)" /><text x="612" y="214" className="s-ts">上傳記憶（單向）</text>
    <line x1="820" y1="486" x2="540" y2="486" stroke={K.red} strokeWidth="2.4" markerEnd="url(#a3)" /><text x="640" y="474" textAnchor="middle" className="s-ts">雲端 → 本機：沒權限 ✗</text>
    <line x1="270" y1="560" x2="270" y2="420" stroke={K.purple} strokeWidth="2.2" markerEnd="url(#a3)" /><text x="290" y="500" className="s-ts">可讀</text>
    <line x1="1010" y1="560" x2="1010" y2="430" stroke={K.purple} strokeWidth="2.2" markerEnd="url(#a3)" /><text x="1030" y="500" className="s-ts">可讀</text>
    <text x="640" y="528" textAnchor="middle" className="s-ts">✗ 對話不同步，只能手動搬</text>
    <text x="40" y="690" className="s-ts">實線＝資料流向 · 紅色＝被擋（雲端碰不到本機）</text>
  </svg>
);
