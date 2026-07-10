# Reddit 手動養號 — 第 1 週清單（u/Pale-Wasabi-2160）

> 背景：帳號全新、karma=1。API 被新政策(Responsible Builder Policy)卡住 → 先**純手動養號**。
> 本週目標：karma 1 → ~30、profile 建好、學會 4 個主攻版的規則。**內容零連結**（連結只放 profile）。
> 鐵則：每天 ≤3 個動作、9:1（九成真參與）、每篇都不同、發前先讀該版規則。詳見 [reddit-playbook.md](reddit-playbook.md)。

---

## Step 0 — 一次性設定（15 分鐘）

1. **建 profile（你唯一能放連結的地方）**
   - 開你的 profile → Edit → **About/Bio** 寫一句真人介紹，例：
     `Chinese ink & calligraphy — original hand-painted works (姜進清 / 峻清书画). Happy to talk symbolism & technique.`
   - **Social links / 連結**放店首頁，加 UTM 才追得到成交：
     `https://wwnpxf-xx.myshopify.com/?utm_source=reddit&utm_medium=profile&utm_campaign=bio`
     （若有自訂網域就換掉 myshopify 那段）
2. **訂閱 4 主攻版 + 讀規則**（看有沒有 karma/帳齡門檻、能不能貼自己作品）：
   r/ChineseArt、r/feng_shui、r/Calligraphy、r/Sumi_e。

> ⚠️ karma=1 的新號，**有些版會擋你發文**（crowd control / 最低 karma）。所以**本週主力是「留言」**累積 karma + 建立「懂行」印象，發作品次之。

## 主攻 4 版 — 各版該做什麼

| 版 | 本週主要動作 | 為何 |
|---|---|---|
| **r/feng_shui** | **留言為主**：回答「這符號什麼意思／招財掛什麼好」 | 你的吉祥寓意是原生內容、最容易展現權威、買家在這 |
| **r/ChineseArt** | 留言 + 偶爾**分享 1 張作品**（講寓意/技法，無連結） | 最對口，適合放你的畫 |
| **r/Calligraphy** | **只留言**（書體/釋文/出處），先別發 | 規則嚴、重評析，先混臉熟 |
| **r/Sumi_e / r/inkpainting** | 分享水墨 + 聊筆墨 | 墨法社群 |

## 每日例行（2–3 個動作，<20 分鐘）

1. 進 r/feng_shui + r/ChineseArt 看當天新帖 → 挑 1–2 個**你能真的補充價值**的留言（套下面公式）。
2. 每 2–3 天，在 r/ChineseArt 分享 1 張作品（圖 + 寓意 + 一句技法），**貼文不放連結**。
3. 別洗版、別複製貼上同一段、別在留言塞店連結。

> 想找今天哪裡值得留言，可跑 `python3 automation/reddit_radar.py --profile art`（RSS 模式，被 429 就晚點再試）。

## GEO 公式（留言/貼文都用）

第一句**直接給答案＋一個具體點**（寓意/典故/筆墨細節）→ 再展開 → 點名實體（Chinese ink、花鳥 bird-and-flower、山水 shan shui、feng shui）讓 AI 引擎能歸因。**養號期不放連結。**

### 3 個可直接改用的範例

**① r/feng_shui 留言**（有人問葫蘆/招福掛什麼）：
> In Chinese symbolism the gourd (葫蘆) is one of the classic fortune-and-protection motifs — it's a homophone for 福祿 ("fortune & prosperity"), so a gourd vine is read as blessings multiplying. Pair it with two resting ducks and you add 和諧 (peaceful harmony). Hang it in a living area rather than a bathroom. (No link — just the meaning.)

**② r/ChineseArt 分享貼文**（松鶴延年 crane & pine）：
> Title: 松鶴延年 — Crane & Pine, the classic Chinese longevity wish (ink & color on paper, hand-painted)
> Body: Crane + pine together = "may you live as long as the pine, as enduring as the crane" — one of the most beloved longevity blessings in 花鳥 (bird-and-flower) painting. Brushed wet-into-wet for the pine needles, fine line for the crane. Happy to answer anything about the symbolism or technique.

**③ r/Calligraphy 留言**（有人貼厚德載物/問釋文）：
> That's 厚德載物 — "a person of great virtue carries all things," from the 易經 (I Ching). It's a favourite motto-scroll because it pairs with 自強不息 ("strive without ceasing"). The brushwork here reads as [行書/楷書] — note the [具體一點，如起筆/結構].

## 何時「畢業」→ 接 API + 開始帶連結

跑 `python3 automation/reddit_comment.py whoami`（API 通了之後）顯示 **comment karma ≥ 50 且帳齡 ≥ 14 天** → 才：
- 開始在 Tier3 允許賣的版（r/ArtStore 等）帶 UTM 連結；
- 回頭接 API（那時新政策關卡通常也較好過，帳號不再是「全新」風險）。
