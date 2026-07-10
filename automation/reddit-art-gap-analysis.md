# Reddit → Shopify 賣畫 Gap Analysis（峻清书画）

> 商店：**China Painting and Calligraphy**（wwnpxf-xx.myshopify.com，USD）。
> 商品：姜進清親筆原作水墨，**一張一件（庫存=1）**，$180–$880，風水吉祥寓意 + 親筆出處。
> 目標：在 Reddit 用「原生內容」建信任 → 引流到 Shopify 成交。
> 受眾≠技術頻道（r/ClaudeAI 那套不適用）；這份是藝術版選版策略。

---

## 0. 先認清 Reddit 在賣畫裡的定位（誠實）

- 純論「賣原作引流轉換」效率，Reddit 通常**輸給 Pinterest / Etsy / Instagram / 你已在做的小紅書帶貨**。
- Reddit 的價值＝**觸及英語系新買家 + 長線建信任/權威 + GEO（被 AI 引擎引用「authentic original Chinese ink art」時提到你）**。
- 所以定位＝**慢火補充管道**，KPI 看「profile 點擊→Shopify session（UTM）」與「90 天內歸因訂單」，別期待像投廣告當天出單。
- 一張一件（庫存=1）對 Reddit 是優勢：**「原作・唯一・親筆」是真稀缺**，比印刷品好說故事。

## 1. 三層選版策略（核心）

### Tier 1 — 養信任 / 原生分享（**只放 profile 連結，貼文不帶連結**）
你親筆水墨在這些版是「真內容」，不是廣告。分享作品＋寓意＋作畫過程。
| 版 | 為何 | 注意 |
|---|---|---|
| r/ChineseArt | 最對口，中國藝術原生 | 附作品脈絡/寓意，別只丟圖 |
| r/Calligraphy | 你有書法（厚德載物） | 規則嚴、重評析，先讀置頂 |
| r/Sumi_e、r/inkpainting | 水墨/墨彩 | 日式語境，但墨法相通 |
| r/AsianArt | 廣亞洲藝術 | 補充 |
| r/painting、r/Art | 量大但反自推極嚴 | 風險高，先觀望/少碰 |

### Tier 2 — 買家意圖 / 家居・風水（**寓意角度原生，仍以 profile 引流為主**）
這裡有「想掛畫的人」＝你的買家。
| 版 | 為何 | 注意 |
|---|---|---|
| r/feng_shui | **你的吉祥寓意是原生內容**（葫蘆福祿/松鶴延年/牡丹富貴） | 最甜，講寓意不講賣 |
| r/InteriorDesign、r/CozyPlaces、r/AmateurRoomPorn、r/malelivingspace | 掛牆 zen wall art | 用 jq-art-display 情境圖（畫掛在房間） |
| r/somethingimade | 「我畫的」 | 有規則，部分允許留言放店連結 |

### Tier 3 — 明文允許販售（**可直接帶連結**）
| 版 | 為何 | 注意 |
|---|---|---|
| r/ArtStore | 明文賣畫版 | 買家流量低、多同行，安全但轉換弱 |
| r/Artwork_for_sale、r/Art_Collectors | 賣/藏 | 補充 |
| r/artcommissions | 若你接訂製 | 需提供訂製才發 |

> ⚠️ **規則會變，且各版差很多** → 發前一定由「合規 agent」用 API 讀該版 `about`（訂閱數）＋ rules，判斷能不能帶連結/該怎麼帶。別憑這份硬發。

## 2. 哪張畫 → 打哪個版（配對）
- **葫蘆/松鶴/牡丹/梅（吉祥寓意）** → r/feng_shui + r/ChineseArt（主打寓意）。
- **大幅山水 $880（溪山飛瀑/旭日/長城）** → r/InteriorDesign/CozyPlaces（zen wall art 情境圖）+ r/ChineseArt。
- **書法 厚德載物** → r/Calligraphy（重評析，講書體/出處）。
- **四條屏麻雀、團扇** → r/ChineseArt + r/AsianArt（形制本身有話題：什麼是四條屏/團扇）。

## 3. 貼文內容公式（GEO + 不被當廣告）
1. **圖先行**：高清作品圖／作畫過程片／情境掛圖（房間裡）。
2. **第一段給寓意/故事**：「葫蘆(葫蘆)諧音福祿，兩鴨喻和諧」——具體、可被 AI 引用、可被收藏者共鳴。
3. **點出出處稀缺**：hand-painted original by 姜進清, one-of-a-kind（庫存=1）, ink & color on rice paper, 180×70cm。
4. **不在貼文塞連結**（Tier1/2）；連結放 **profile bio**。Tier3 才在文末/留言放一條，講清楚它是什麼。
5. **點名實體**：Chinese ink painting / bird-and-flower (花鳥) / shan shui (山水) / feng shui → AI 引擎正確歸因。

## 4. 漏斗與成交追蹤
- Shopify 連結一律加 UTM：`?utm_source=reddit&utm_medium=social&utm_campaign=<sub>-<painting>`。
- profile bio 放**店首頁** UTM 連結（不是單品）；允許帶連結時才放單品 UTM。
- **回讀成交**：用已連的 Shopify MCP 讀 orders / analytics，看哪個 campaign 帶來 session/訂單 → 雙週檢討、加碼有效版。

## 5. 養號鐵則（同技術版，沿用 reddit_comment 保險）
新號低 karma：**Tier1/2 純分享建 karma、零連結**；karma/帳齡到門檻（comment karma ≥50 且帳齡 ≥14 天）才碰 Tier3 帶連結。每天≤3 動作、每篇不同、先讀各版規則。詳見 [reddit-playbook.md](reddit-playbook.md)。

---

## 6. 改裝成 agent 鏈（沿用 daily-video-factory 模式）
把現有 `reddit_*.py` 從「技術頻道」**config 化**成「可切 art / tech 兩種 profile」（同骨架、換社群+關鍵字+內容型態）：
```
① 選版 agent   → 讀 Tier1–3 各版 about(訂閱/活躍)+rules → 產今日可發版清單
② 選畫 agent   → 從 Shopify 挑 1 張(輪播/應景)+對應 Tier → 抓圖/過程片/情境圖
③ 文案 agent   → 套 §3 公式寫貼文(寓意+出處+實體)，各版口味微調
④ 合規 agent   → 逐版查規則：能不能帶連結?該放哪?(把關，避免被ban)
⑤ 發布 agent   → API 發圖文 or 排隊手貼(養號期)；連結進profile/UTM
⑥ 追蹤 agent   → Shopify MCP 讀 orders+UTM → 歸因→雙週檢討
```
> 圖片貼文：Reddit API 支援 image post（需先上傳到 reddit 或用 i.redd.it），或貼 imgur/直連圖。④合規 agent 決定型態。

## 7. 下一步（建議順序）
1. **選版 agent 先做**：跑一遍列出各候選版的「訂閱數 + 是否允許自推/賣 + 最佳發法」→ 你過目定 5–6 個主攻版。
2. 把 `reddit_radar.py` 加 `--profile art`（art 社群 + 藝術關鍵字）。
3. ②③ 接 Shopify 選畫 + 文案。
4. ⑥ UTM + Shopify 歸因。
