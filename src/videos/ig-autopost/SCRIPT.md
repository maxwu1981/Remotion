# 生活應用系列 EP06 ·「我讓 Instagram 也每天自動發文」完整串接教學
### 教學報告 + 影片腳本（黑曜石重製版）

> 承接 EP04（FB 每天自動發文）。EP04 結尾 CTA 就說「下一集講怎麼順便同步發到 IG」——**這集就是那一集**。
> 核心賣點：**用 EP04 那把同一支 Page Token，只多勾兩個 IG 權限，就能讓你的 Instagram 商業帳號也每天自動發文。**
> 技術驗證來源：Meta 官方文件 *Instagram Platform → Content Publishing*（已於 2026-07-05 逐條核對，見 §7 驗證附錄）。
> ⚠️ 與 FB 最大不同、且必教清楚的坑：**IG 不能上傳本機檔，圖片必須先有「公開可存取的網址」**。

---

## 0. 一句話定位（GEO 實體宣告）

**這支影片教你：用 Meta 官方 Instagram Graph API（Content Publishing），讓你的 Instagram 商業／創作者帳號每天固定時間自動發貼文——沿用你發 FB 粉專的同一把 Page Token，不用重拿、不綁任何付費第三方工具。** 我把 EP04 的 FB 自動發文系統，用同一支排程直接擴充成「FB + IG 一起自動發」。

- ✅ 適用：已經是（或願意轉成）**Instagram 商業／創作者帳號、且有連結一個 FB 粉絲專頁**的小商家 / 創作者 / 個人品牌。
- 🚫 不建議：只想用**個人 IG 帳號**自動發的人——Instagram 官方 Content Publishing API **只開放商業／創作者帳號**，個人帳號沒有官方自動發布接口（硬走瀏覽器外掛有封號風險，這條我們不教）。

---

## 1. 影片分章總表（給觀眾的目錄）

| # | 章節（用「觀眾會問的問題」當標題） | 核心一句答案（含數字/結論） |
|---|---|---|
| 0 | 封面卡（0:00 亮相） | 標題大字 + 鉤子「FB 發完，IG 也自動發｜同一把鑰匙」 |
| 1 | 為什麼「IG 自動發文」比 FB 多一道坎？ | IG 不吃本機檔，圖要先有公開網址；且只認商業帳號 |
| 2 | 這套「FB+IG 一起自動發」系統長什麼樣？ | 5 個零件：比 FB 版多一步「圖上公開網址」 |
| 3 | 第一步：怎麼讓 IG 有「被程式發文」的資格？ | 轉商業帳號 + 連 FB 粉專 + 一個 Meta App（開發模式發自己免送審） |
| 4 | 第二步：發 IG 的 Token 和「IG 帳號 ID」去哪拿？ | 沿用 FB 的 Page Token，多勾 2 個 IG 權限；ID 一個 API 就問到 |
| 5 | **關鍵差異：為什麼 IG 貼圖不能傳本機檔？** | **Meta 端會去 cURL 你給的網址，所以圖必須先有公開 URL** |
| 6 | 第三步：一則 IG 貼文怎麼發出去？（單圖＋輪播） | 兩步：先 `/media` 建容器拿 ID，再 `/media_publish` 發布 |
| 7 | **第四步：怎麼讓它「每天自己發」？（自動的核心）** | **同一支排程一次發 FB + IG，作業系統每天替你按執行** |
| 8 | 自己跑起來後：每天發什麼、怎麼不重複？ | 抓今日資料夾 + 去重 log + 沒新圖就回收輪播（沿用 EP04） |
| 9 | Token 會過期嗎？IG 有發文上限嗎？ | Page Token 60 天、剩 14 天預警；IG 每 24 小時上限 100 篇 |
| 10 | 成果：真的發出去了嗎？（證明） | ⚠️ 需老闆決策：實跑真實紀錄 vs 架構驗證＋一則真實貼文 |
| 11 | 補充：IG 專屬避坑（最重要） | 公開 URL / 商業帳號 / 送審門檻 / caption 連結不可點 / 限速 |
| 12 | 結尾 CTA | 感謝 + 訂閱 / 按讚 / 分享 + master prompt 放描述 |

> **內容方向定位**：主軸是**「如何讓 IG 自動發文」**。CH3–CH6（帳號資格／Token／公開 URL／發一次）是**前置門檻**；CH7（掛排程讓它每天自己跑、且一次發兩平台）+ CH8（不重複）才是**「自動發文」的心臟**，份量與具體度要對得起標題。

---

## 2. 故事線（第一人稱，符合「解說片＝故事腳本」鐵則）

- **為何有此議題**：上一集我把 FB 粉專搞成每天自動發文，連 40 天沒碰鍵盤。接著問題來了——**IG 呢？** 我的書畫品牌（峻清书画）在 IG 也要日更，總不能 FB 全自動、IG 還在手動貼。
- **誰遇到**：任何「同時要顧 FB 和 IG」的個人品牌／小商家——內容其實一樣，卻要在兩個 App 各貼一次。
- **影響**：IG 演算法一樣吃「穩定日更」，斷更就掉觸及；手動雙平台發，等於每天多一份重工。
- **為何別人解不掉**：① 第三方排程工具（Buffer/Later）要月費、又把帳號授權押在別人伺服器；② 很多人卡在「IG 明明可以在 Business Suite 手動排程，為什麼還要 API？」——因為 Business Suite 要你**每天人工去點**，沒法跟你自己的內容產線串成「端到端全自動」；③ 真的想用官方 API 的人，99% 卡在**「IG 貼圖傳本機檔一直失敗」**這個坑（IG 只吃公開網址，文件寫得很隱晦）。
- **我怎麼解**：沿用 EP04 的 Meta **官方** Graph API 系統，**同一把 Page Token 只多勾兩個 IG 權限**，發文腳本多加一步「把當天的圖先上傳到公開網址拿 URL」，再走 IG 的「建容器 → 發布」兩步；最後把 FB 和 IG 掛在**同一支每日排程**裡，一次發兩平台。
- **我跟別人哪裡不同**：① 官方 API 不經第三方、免月費 ② Token 沿用 FB 那把、不用重拿 ③ FB + IG 共用一支排程、一次發兩邊 ④ 把「IG 只吃公開 URL」這個最大的坑，直接在腳本裡幫你處理掉。
- **怎麼證明（可量測 before/after）**：before = FB 自動、IG 還手動雙平台重工；after = 一支排程同時把 FB + IG 發出去，我完全不用打開 IG App。（實際證明素材見 CH10，待老闆定案。）
- **CTA**：完整 master prompt 放資訊欄，訂閱看下一集「怎麼連 Threads 也一起發」。

---

## 3. 逐章詳細內容（含真實頁面上要點哪裡 + 精確 API，逐條對照 Meta 官方文件）

### 【CH1】為什麼「IG 自動發文」比 FB 多一道坎？（Hook，約 20 秒）
- 痛點畫面：FB 那邊 07:11 準時自動上線了 ✅；切到 IG，還是我半夜手動在貼。兩個平台、同樣內容、貼兩次。
- 兩個「IG 專屬的坎」先劇透，讓觀眾知道這集在解什麼：
  1. **IG 只認商業／創作者帳號**——個人帳號官方不給程式發文。
  2. **IG 貼圖不能傳本機檔**——圖必須先有一個「公開網址」，這是最多人卡關的地方。
- 一句結論：**「會發 FB，不代表會發 IG——IG 的規矩不一樣，這集把兩個坑幫你踩平。」**

### 【CH2】系統總覽：五個零件（架構圖，約 30 秒）
畫一張流程圖（黑曜石風格節點），跟 EP04 對照，**紅框標出多出來的第 ③ 步**：

```
① 素材夾  ~/…/posts/<日期>/(圖片 + 文案)
        │
        ▼
② 排程  每天固定時間自動觸發（一支排程，FB + IG 一起）
        │
        ▼
③ 圖上公開網址  ← ★ IG 專屬！先把本機圖上傳到公開 URL（FB 版沒有這步）
        │
        ▼
④ IG Graph API  https://graph.facebook.com/v23.0
        │   ├─ POST /{ig-user-id}/media          （建容器：帶 image_url + caption）
        │   └─ POST /{ig-user-id}/media_publish  （發布：帶 creation_id）
        ▼
⑤ Instagram 商業帳號  → 貼文上線
```

重點：**跟 EP04 幾乎一樣，唯一的新東西是第 ③ 步「圖上公開網址」和 ④ 的兩步端點換成 IG 的。Token、排程、去重全部沿用。**

### 【CH3】第一步：讓 IG 有「被程式發文」的資格（真實頁面）
> 目的：IG 官方 Content Publishing 只服務「商業／創作者帳號、且連到一個 FB 粉專」的帳號。

觀眾照做的點選路徑：
1. **把 IG 轉成商業或創作者帳號**：IG App →「設定 → 帳號類型與工具 → 切換為專業帳號」。
2. **把這個 IG 帳號連到你的 FB 粉絲專頁**（峻清书画）：FB 粉專「設定 → 已連結的帳號 → Instagram」綁定。
3. **沿用 EP04 建的那個 Meta App**（就是發 FB 用的同一個，不用另外建）。
4. **確認你在這個 App 裡是管理員／測試者角色**——這樣 App 停在**「開發模式」就能發自己的 IG 帳號，不用送 App Review**。
   - 📌 誠實補充：**要程式化發「別人的」IG 帳號才需要送審**（每個權限要各錄一段操作影片、審核約 2–4 週）；發**自己**的、你是 App 管理員，開發模式即可，免審核。

📌 視覺標註：三格編號圖「① 轉專業帳號 → ② 連 FB 粉專 → ③ 沿用同一個 App（你是管理員）」。

### 【CH4】第二步：發 IG 的 Token 與「IG 帳號 ID」去哪拿？（真實頁面 + 1 個 API）
> 好消息：**Token 不用重拿**。發 FB 的那把 Page Token 就能發它連結的 IG，只要多勾兩個 IG 權限。

**① Token（沿用 EP04 + 加權限）** — 在 Graph API Explorer（`developers.facebook.com/tools/explorer/`）：
- 選你的 App → 權限欄，在 EP04 的 `pages_manage_posts`、`pages_read_engagement` 之外，**再加這兩個**：
  - `instagram_basic` ← 讀 IG 帳號基本資料
  - `instagram_content_publish` ← 幫我的 IG 帳號發文（發文核心權限）
- Generate → 選你的粉專 → 拿到 Token（一樣，畫面上**必打碼**）。
- 換長效 / 取 Page Token 的兩步跟 EP04 完全一樣（`fb_exchange_token` → 取 Page Token），沿用不重講。

**② 拿「IG 帳號 ID」（ig-user-id）** — 一個 API 就問到（程式對照 Meta 文件）：
```
GET https://graph.facebook.com/v23.0/<page_id>
    ?fields=instagram_business_account
    &access_token=<Page Token>
```
→ 回傳 `{"instagram_business_account":{"id":"1784xxxxxxxxx"}}`，這個 `id` 就是等一下所有發文端點裡的 `<ig-user-id>`。

📌 視覺標註：把「加 2 個 IG 權限」和「一個 API 換出 ig-user-id」做成兩格放大圖。
⚠️ 安全：Token 一律打碼，只露開頭 `EAAO…` 示意。

### 【CH5】關鍵差異：為什麼 IG 貼圖不能傳本機檔？（★ 最多人卡關，約 40 秒）
> 這是 IG 跟 FB 最大、也最容易踩雷的不同，畫面要停久一點講清楚。

- **FB 的做法**：直接把本機圖檔用 multipart 傳給 `/photos`（EP04 就是這樣）。
- **IG 的做法（官方原文）**：*"We cURL media used in publishing attempts, so the media must be hosted on a publicly accessible server."* ——**Meta 的伺服器會拿你給的網址去「抓」圖**，所以你不能傳本機檔，必須給一個**公開、任何人都連得到的圖片網址**（`image_url`）。
- **所以發文腳本要多一步**：發 IG 前，先把當天要發的本機圖**上傳到一個公開網址**拿到 URL，再餵給 IG API。最省事的三種做法：
  1. 丟到你自己的雲端物件儲存（Cloudflare R2 / AWS S3 開公開讀）拿 URL；
  2. 丟到免費圖床 / 你的網站 `public/` 目錄；
  3. 推到一個公開的 GitHub repo，用 raw 連結。
- 一句結論：**「IG 不是傳檔案，是傳一個網址。想通這件事，IG API 就通了一半。」**

📌 視覺：左邊「本機圖 ❌ 直接傳 IG」打叉 → 中間「先上傳公開網址」→ 右邊「把 URL 餵給 IG ✅」。

### 【CH6】第三步：一則 IG 貼文怎麼發出去？（兩步 API·單圖＋輪播）
> IG 發文一律「兩步」：先建一個「容器（container）」，再「發布」這個容器。

**A. 發單張圖：**
```
① 建容器  POST https://graph.facebook.com/v23.0/<ig-user-id>/media
     image_url    = <你剛拿到的公開圖片網址>
     caption      = <你的文案>
     access_token = <Page Token>
   → 回傳 { "id": "<creation_id>" }

② 發布    POST https://graph.facebook.com/v23.0/<ig-user-id>/media_publish
     creation_id  = <上一步的 id>
     access_token = <Page Token>
   → 回傳貼文的 media id，貼文正式上線
```

**B. 發多張圖（輪播 Carousel，最多 10 張）：**
```
① 每張子圖各建一個容器（多帶 is_carousel_item=true）
     POST /<ig-user-id>/media
       image_url = <第 N 張的公開網址>
       is_carousel_item = true
     → 各拿一個子容器 id

② 建「輪播父容器」
     POST /<ig-user-id>/media
       media_type = CAROUSEL
       children   = <子容器 id 用逗號串起來，最多 10 個>
       caption    = <文案>

③ 發布父容器
     POST /<ig-user-id>/media_publish  creation_id=<父容器 id>
```
📌 提醒：輪播所有圖會**依第一張的比例裁切**（預設 1:1），所以第一張決定版型。

📌 視覺：終端機打指令 → 切到 IG，貼文「啪」地出現（前後對照，跟 EP04 的 FB 對照鏡呼應）。

### 【CH7】第四步：怎麼讓它「每天自己發」？（★ 自動的核心，本片重點）
> 前面 CH3–CH6 都只是「怎麼發一次 IG」。真正的「自動」＝讓作業系統每天固定時間自己跑，而且**同一支排程一次發 FB + IG**。

- **核心一件事**：把「發 FB」+「發 IG」寫進**同一支發文腳本**，交給作業系統內建排程器（`cron` / macOS `launchd`）。
- **實際做法（觀眾照打）**：
  ```
  crontab -e
  # 每天早上 07:11 自動執行「一次發 FB + IG」的腳本
  11 7 * * *  /usr/bin/python3 ~/social/publish_all.py
  ```
  存檔即生效——**從這一刻起，你的手不用再碰，作業系統每天替你把兩個平台一起發出去**。
- 💡 這一章是全片「如何自動發文」真正發生的地方，畫面要停久一點，強調「**一支排程、兩個平台**」的省力感。

### 【CH8】自己跑起來後：每天發什麼、怎麼不重複？（去重 + 回收，沿用 EP04）
- **素材來源**：`~/…/posts/<YYYY-MM-DD>/` 每天一夾（圖 + 文案）；排程時間到就抓今天這夾。
- **去重**：發過的資料夾記在 log，不重發（FB、IG 各記或共記一份）。
- **沒新圖怎麼辦？回收輪播**：抽「最久沒重發」的舊資料夾重發（LRU 輪播）——**這就是它能天天不斷更的關鍵**（EP04 靠這招連 40 天沒斷）。

### 【CH9】Token 會過期嗎？IG 有發文上限嗎？（維運）
- **Token**：沿用 EP04 的 Page Token，壽命約 **60 天**、剩 **14 天** 自動預警、一支指令換新。IG 和 FB 共用同一把，不用分開顧。
- **IG 速率限制（官方）**：同一個 IG 帳號**每 24 小時（滾動視窗）最多 100 篇** API 發文；輪播算 1 篇。查目前用量：
  ```
  GET https://graph.facebook.com/v23.0/<ig-user-id>/content_publishing_limit
  ```
- 📌 提醒：正常日更一天一兩篇，離 100 篇上限很遠；但別寫成「每分鐘發一篇」洗版。

### 【CH10】成果展示：真的自動發出去了嗎？（⚠️ 需老闆決策）
> EP04 的重頭戲是「連 40 天、34 篇真實 log」。IG 這套是**新接上的**，還沒有 40 天歷史，所以這一章的「證明素材」要你決定走哪條：
>
> - **選項 A（架構驗證版，快）**：我實際跑一次、**發一則真實的 IG 貼文**，截「終端機指令 → IG 上真的出現這則貼文」的前後對照，加上「FB+IG 同一支排程」的程式碼證明。→ 誠實、當天可交付。
> - **選項 B（真實紀錄版，慢但最強）**：把系統實際接上你的 IG 帳號、掛排程跑幾天，累積真實發文紀錄再收尾。→ 證據力最強，但需要你的 IG 帳號憑證、且要等幾天（發文前我會先跟你握手確認）。
>
> 這個選擇會影響 CH10 的畫面與旁白，**請你先勾一個**（其餘章節不受影響、可先做）。

### 【CH11】補充章（IG 專屬「盲點與避坑」— 我主動加的）
1. **圖一定要公開 URL，本機檔傳不了**（全片最重要的坑，這裡再敲一次）。
2. **只認商業／創作者帳號 + 連 FB 粉專**：個人帳號官方沒有發布 API。
3. **發自己免送審、發別人要 App Review**：開發模式（你是 App 管理員）可發自己帳號；要幫客戶/別人發才要送審（每權限錄影、約 2–4 週）。
4. **caption 裡的連結不可點**：IG 貼文內文的網址不會變成可點連結（跟 FB 不同），別把「點這裡購買」放內文，該放的是個人檔案的 bio 連結。
5. **輪播依第一張裁切**：多圖版型由第一張決定，預設 1:1。
6. **Business Suite 本來就能免費「手動排程」IG**——誠實講：如果你只是要偶爾排幾篇，Business Suite 就夠了；**API 的價值在「跟你自己的內容產線端到端全自動、且一次發多平台」**，不用每天人工去點。
7. **Token = 密碼**：IG 用的還是那把 Page Token，一樣一律打碼、別入鏡。
8. **失敗要有通知**：排程某天發失敗（多半 Token 過期或圖床網址掛了），用 iMessage / Email 通知自己，別等一週後才發現全停。

### 【CH12】結尾 Outro（CTA）
- 感謝觀看 +「這套完全免月費，FB 和 IG 共用一支排程，程式與 master prompt 都放資訊欄」。
- 訂閱（看下一集 Threads 同步）+ 按讚 + 分享給也在雙平台顧內容的朋友。
- 曉晴頭尾露臉。

---

## 3.5 每一步「要對 Claude 說的 Prompt」（逐字·可複製 — 放影片下方＋畫面上）

> **本片核心框架**：觀眾的動作不是自己土法寫 code，而是**每一步跟 Claude 說一句話**。畫面上每個動作章節都會出現一個 💬 prompt 方塊（可暫停複製），旁白也會唸出來。
> ✅ 下列每句 prompt 的技術內容都已對照 Meta 官方 Content Publishing 文件驗證（見 §7）。

| 步驟 | 對 Claude 說（逐字） |
|---|---|
| 開場總 prompt | `Hi Claude，我已經用 Meta 官方 Graph API 讓 FB 粉專自動發文了。現在我想沿用同一把 Page Token，讓連結在同一個粉專下的 Instagram 商業帳號也每天自動發文。請一步一步帶我做：加 IG 權限、拿到 IG 帳號 ID、把圖上傳到公開網址、用「建容器→發布」兩步發文，最後把 FB 和 IG 掛在同一支每天的排程裡。` |
| CH3 帳號資格 | `Claude，請教我怎麼把 Instagram 轉成商業帳號並連結到我的 FB 粉專，以及為什麼發自己的帳號在「開發模式」就不用送 App Review。` |
| CH4 權限＋IG ID | `Claude，我發 FB 用的 Page Token 想沿用來發 IG。請告訴我要在 Graph API Explorer 多勾哪些 IG 權限，並用 GET /{page_id}?fields=instagram_business_account 幫我取得我的 Instagram 帳號 ID。` |
| CH5 公開 URL | `Claude，IG 發圖不能傳本機檔、只吃公開網址。請幫我在發文腳本裡加一步：把當天要發的本機圖片先上傳到一個公開可存取的網址（用我的雲端 storage 或圖床），拿到 image_url 再往下發。` |
| CH6 發文（兩步） | `Claude，幫我寫 IG 發文腳本：先 POST /{ig-user-id}/media 帶 image_url 和 caption 建立容器拿 creation_id，再 POST /{ig-user-id}/media_publish 帶 creation_id 發布；多圖時用 is_carousel_item 和 media_type=CAROUSEL 的 children 做輪播。` |
| CH7 掛排程（★核心） | `Claude，幫我把「發 FB」和「發 IG」合併成同一支腳本，掛上排程每天早上 7:11 自動執行（cron 或 launchd），一次把兩個平台都發出去，並告訴我怎麼確認它有在跑。` |
| CH8 去重／回收 | `Claude，幫我沿用 FB 那套去重與回收邏輯到 IG：發過的資料夾不再發；沒有新圖時，自動回收最久沒發的舊資料夾輪播。` |
| CH9 維運＋限速 | `Claude，幫我加上 Token 到期檢查（剩 14 天提醒），並用 GET /{ig-user-id}/content_publishing_limit 檢查 IG 當天的發文用量，避免超過每 24 小時 100 篇上限。` |

📌 視覺規範：每個 💬 prompt 方塊用終端機面板的高亮行呈現，停留夠久讓觀眾暫停複製；旁白同步唸出「你只要跟 Claude 說：…」。

---

## 3.6 完整 Master Prompt（片尾「看到最後的禮物」· 逐字 · 已對照 Meta 官方 Content Publishing 文件驗證）

> 片尾 CH12 場景會把濃縮版打在畫面上（可暫停複製）；**這份逐字完整版放 YouTube 描述最上方**，鼓勵觀眾看到最後複製整段、一次貼給 Claude 就能從零建好整套。
> ✅ 驗證：下列每個端點／權限／參數都對到 Meta 官方 *Instagram Platform → Content Publishing* 文件（v23.0）。

```
Hi Claude，我想在我自己的電腦上，做一套讓我的 Instagram 商業帳號每天自動發文的系統，
全部用 Meta 官方 Instagram Graph API（Content Publishing，版本 v23.0 或更新）、不靠任何付費第三方工具。
（如果我已經有在用官方 Graph API 發 FB 粉專，請沿用同一個 Meta App 和同一把 Page Token，不要叫我重建。）
請一步一步帶我完成；過程中需要我去 Facebook / Instagram 網站點什麼，也請明確告訴我點哪裡。
過程中你需要的 App ID、App Secret、我的 FB 粉專 page_id、素材資料夾路徑、以及我用哪種公開儲存放圖，請直接問我。需求如下：

1) 前置資格：教我把 Instagram 轉成商業／創作者帳號、連結到我的 FB 粉絲專頁；
   並說明：因為我要發的是「自己的」帳號、我又是這個 Meta App 的管理員，
   所以 App 停在「開發模式」就能發，不用送 App Review。

2) 權限與 IG 帳號 ID：教我在 Graph API Explorer 為我的 App 多加 instagram_basic 和
   instagram_content_publish 兩個權限（連同發 FB 用的 pages_read_engagement）；
   然後用 GET /{page_id}?fields=instagram_business_account 取得我的 Instagram 帳號 ID（ig-user-id）。

3) 公開網址（IG 專屬關鍵）：IG 發圖不能傳本機檔，Meta 會去 cURL 我提供的網址，
   所以圖必須先有公開 URL。幫我在發文腳本裡加一步：把當天要發的本機圖片先上傳到一個
   公開可存取的網址（我的雲端物件儲存或圖床），拿到 image_url 再往下發。

4) 發文腳本（兩步式）：
   - 單圖：先 POST /{ig-user-id}/media 帶 image_url + caption 建立容器、拿到 creation_id；
     再 POST /{ig-user-id}/media_publish 帶 creation_id 發布。
   - 多圖輪播（最多 10 張）：每張子圖 POST /{ig-user-id}/media 帶 image_url + is_carousel_item=true，
     收集子容器 id；再 POST /{ig-user-id}/media 帶 media_type=CAROUSEL + children=<子 id 逗號串> + caption 建父容器；
     最後 media_publish 發布父容器。
   - 發完印出貼文結果。

5) 內容來源＋去重＋回收：每天去一個以日期命名的資料夾（例如 ~/social/YYYY-MM-DD/）抓當天圖片和文案；
   已發過的資料夾記在一份 log、不重複發；若今天沒有新資料夾，就自動抽「最久沒發過」的舊資料夾回收輪播。

6) 一次發兩平台＋排程：如果我已有 FB 自動發文腳本，把「發 FB」和「發 IG」合併成同一支腳本；
   幫我掛上排程每天早上 07:11 自動執行（macOS 用 launchd 或 cron、Linux 用 cron，
   例如 crontab 一行：11 7 * * * /usr/bin/python3 ~/social/publish_all.py），並告訴我怎麼確認它有在跑。

7) 維運與限速：幫我寫 Token 到期檢查（Page Token 剩 14 天就提醒我）；
   並用 GET /{ig-user-id}/content_publishing_limit 檢查 IG 每 24 小時的發文用量，避免超過 100 篇上限。

安全要求：所有 Token 和 App Secret 當成密碼處理，不要寫死在會外流的地方、不要出現在截圖裡；
只申請必要的權限；並提醒我：Instagram Content Publishing 只支援商業／創作者帳號、
圖片必須是公開網址、以及 IG 貼文內文（caption）裡的連結不可點。
```

---

## 4. 視覺素材清單（哪些用真實截圖、哪些必須用程式重建）

| 章節 | 畫面 | 來源方式 | 為何 |
|---|---|---|---|
| CH3 | IG 轉專業帳號 / FB 粉專綁 IG 設定頁 | ✅ 可真實截圖（不含 Token） | 純設定頁，無密碼 |
| CH4 | Graph API Explorer 加 2 個 IG 權限 / 取 ig-user-id 的 API 回傳 | ⚠️ 真實截圖但 **Token 與 ig-user-id 尾碼打碼** | 會露出真 Token / 帳號 ID |
| CH5 | 「本機檔 ❌ → 上傳公開網址 → 餵 URL ✅」流程圖 | ✅ 程式重建（示意圖） | 觀念圖，無敏感 |
| CH6 | 終端機兩步發文指令 + IG 貼文出現 | ✅ 真實錄，Token 段打碼 | 展示效果 |
| CH10 | 真實 IG 貼文截圖 / 或幾天發文紀錄 | ⚠️ 依老闆選 A 或 B（見 CH10） | 這是成果證據 |

> 依 repo 慣例 + 記憶 `claude-in-chrome-no-file-access`：含 Token/密碼的畫面用「程式碼重建、繪製時就打碼」最安全；不含密碼的導覽頁可用真實截圖。

---

## 5. 製作規格（黑曜石重製版，套用本專案影片鐵則）

- **一片一資料夾**：`src/videos/ig-autopost/`（本檔所在）。**視覺完全複用 EP04 的黑曜石模板**：抄 `fb-autopost/Obsidian.tsx` + `fb-autopost/glass.tsx`，只換 spec（`_explainer/specs/ig-autopost.json`）與每景概念錨。
- **Composition**：`IgAutopostObsidian`（hand-built，讀 `ig-autopost.json` + `ig-autopost.vo.json`），比照 `FbAutopostObsidian` 註冊進 `Root.tsx`。
- **封面 0:00 亮相**：開場 1–2 秒先閃封面卡（大標 +「FB 發完，IG 也自動發」鉤子）再進 Hook。EP00 玻璃進化版封面設計。
- **概念錨頂部藥丸帶**：每章配一句頂部概念錨（草稿見下）。
- **旁白**：edge-tts 曉晴（`zh-TW-HsiaoChenNeural`）；**逐句先給老闆過稿再算繪**（本檔 §2/§3 即待過稿的旁白內容）。
- **BGM**：Gemini 生鋼琴水晶 BGM，本片新生一首、檔名帶片名（`public/bgm-ig-autopost.mp3`）。
- **GEO 上片**：標題 problem→solution + 具體結果、開字幕、章節時間戳、FAQ/VideoObject JSON-LD；master prompt 逐字貼進描述欄（教學片發布鐵則）。
- **QA gate**：收工前跑 `scripts/qa-video.mjs` + 檢查 0:00 封面 / 前 3 秒鉤子 / 結尾 CTA / 無抖動（PNG+CRF15）/ 字幕同步。
- **不自動上傳**：算繪 + QA 後，老闆本機看過說「發」才上 unlisted → 轉 public；加入「生活應用」播放清單（PLFDr5Lb7xr6Y…）。

**每景概念錨草稿（對 IG 版章節）：**
- CH1 → 會發 FB ≠ **會發 IG**
- CH2 → 五個零件，**多一步公開網址**
- CH3 → 資格 = **商業帳號 + 連粉專**
- CH4 → Token **沿用**，多勾 2 個 IG 權限
- CH5 → IG 只吃**公開網址**，不吃本機檔
- CH6 → 發文 = **建容器 → 發布**
- CH7 → 自動 = **一支排程發兩平台**
- CH8 → 去重＋回收 = 天天不斷更
- CH9 → 24 小時**上限 100 篇**
- CH10 → 真的發出去了
- CH11 → 公開 URL / 商業帳號 / 別外洩

---

## 6. GEO 標題 / 描述草案（problem → solution → 具體結果）

**標題（候選）：**
1. `我讓 Instagram 也每天自動發文｜沿用 FB 的同一把 Token，官方 API 免月費全教學`
2. `IG 自動發文卡在「圖傳不上去」？官方 Content Publishing API 手把手（含最大的坑）`

**描述開頭（前 2 行給 AI 引擎抓）：**
> 這支影片手把手教你用 Instagram 官方 Graph API（Content Publishing），讓你的 IG 商業帳號每天固定時間自動發文——沿用你發 FB 粉專的同一把 Page Token，不用重拿、不綁付費第三方工具。重點解決最多人卡關的「IG 只吃公開網址、不能傳本機檔」，並教你把 FB + IG 掛在同一支排程一次發兩平台。含：加 IG 權限、取得 ig-user-id、圖上公開網址、`/media`+`/media_publish` 兩步發文、輪播 carousel、排程與限速。

**章節時間戳**：對應 CH1–CH11。

---

## 7. 技術驗證附錄（GATE：每條 prompt 的依據，2026-07-05 對照 Meta 官方文件）

| 主張 | 官方依據 |
|---|---|
| 兩步發文：建容器 → 發布 | `POST /{ig-user-id}/media` → `POST /{ig-user-id}/media_publish`（creation_id） |
| 單圖容器參數 | `image_url`（必填）、`caption`、`access_token`；`alt_text` 選填 |
| 輪播 | 子圖 `is_carousel_item=true`；父容器 `media_type=CAROUSEL` + `children=<最多10個容器id>` |
| 圖必須公開網址 | 官方原文：*"We cURL media used in publishing attempts, so the media must be hosted on a publicly accessible server."* 本機檔不支援 |
| 權限（Facebook Login 路線） | `instagram_content_publish`、`instagram_basic`、`pages_read_engagement` |
| 取 IG 帳號 ID | `GET /{page_id}?fields=instagram_business_account` |
| 發自己帳號免送審 | 開發模式下，App 的管理員／開發者／測試者可用權限，無需 App Review |
| 速率限制 | 每 24 小時滾動視窗上限 100 篇；查 `GET /{ig-user-id}/content_publishing_limit` |

> 來源：Meta for Developers — *Instagram Platform → Content Publishing*、*Media (/media) reference*、*Overview（development mode）*。
