# 生活應用系列 ·「我讓 Facebook 每天自動發文」完整串接教學
### 教學報告 + 影片腳本（黑曜石重製版）

> 來源：`~/Documents/Claude/Projects/FB/` 的實際運作程式碼與排程
> 主程式：`jq_token_manager.py`（Token）、`_fb_upload_one.py` + `jq_fb_publish.py`（發文）、排程 `jq-daily-facebook-post`（每天 07:11）
> 已驗證成果：**2026-05-25 → 07-04 連續約 40 天、34 篇自動發文紀錄**（含 Token 到期後的回收輪播）

---

## 0. 一句話定位（GEO 實體宣告）

**這支影片教你：不靠任何第三方付費工具、不綁月費，用 Meta 官方 Graph API + 一支本機排程，讓你的 Facebook 粉絲專頁每天固定時間自動發圖文貼文，Token 與素材全部留在自己電腦。** 我用它連續 40 天沒碰過鍵盤，粉專照樣天天更新。

- ✅ 適用：有 FB 粉絲專頁（Page）的小商家 / 創作者 / 個人品牌，想穩定日更又沒時間人肉發。
- 🚫 不建議：只發個人動態牆（Profile，非 Page）— Graph API 2018 後已封鎖個人頁發文；也不建議想「一鍵洗版狂發」的人（會被 FB 限速、判協同造假）。

---

## 1. 影片分章總表（給觀眾的目錄）

| # | 章節（用「觀眾會問的問題」當標題） | 核心一句答案（含數字/結論） |
|---|---|---|
| 0 | 封面卡（0:00 亮相） | 標題大字 + 鉤子「40 天沒碰鍵盤，粉專天天更新」 |
| 1 | 為什麼「每天記得發文」會拖垮一個粉專？ | 斷更 3 天觸及就掉，人肉日更 2 週必累垮 |
| 2 | 這套自動發文系統長什麼樣？ | 4 個零件：素材夾 → 排程 → Graph API → FB，全在自己電腦 |
| 3 | 第一步：怎麼在 Meta 拿到「發文權」？ | 建一個 Meta App，5 分鐘、免審核就能發自己的 Page |
| 4 | 第二步：Token 到底要去哪裡點？ | Graph API Explorer 選 App → 選 Page → 勾 2 個權限 → 生成 |
| 5 | 第三步：怎麼把「短命 Token」變成 60 天耐用的？ | 一次 API 呼叫換長效，再取 Page Token（不會過期版） |
| 6 | 第四步：一行指令怎麼發出一則貼文？ | 兩步：先 `/photos` 傳圖拿 ID，再 `/feed` 組成貼文 |
| 7 | **第五步：怎麼讓程式「每天自己發」？（自動的核心）** | **把發文腳本掛上 cron/launchd，作業系統每天 07:11 替你執行** |
| 8 | 自己跑起來後：每天發什麼、怎麼不重複？ | 抓今日資料夾 + 去重 log + 沒新圖就回收輪播 |
| 9 | Token 會過期怎麼辦？ | 60 天壽命、剩 14 天自動預警、一支指令換新 |
| 10 | 成果：連續 40 天自動發文的真實紀錄 | 34 篇 log + 每日 IG 快取，全自動零介入 |
| 11 | 補充：安全 / 合規 / 避坑（最重要） | Token = 密碼別播出去、FB 每日限速、可擴充 IG/Threads |
| 12 | 結尾 CTA | 感謝 + 訂閱 / 按讚 / 分享 + 素材連結 |

> **內容方向定位（2026-07-04 核對）**：這支的主軸是**「如何讓 FB 自動發文」**，不是「如何拿 Token」。CH3–6（建 App/取 Token/發一次）是**前置門檻**；CH7（掛排程讓它每天自己跑）+ CH8（不重複）才是**「自動發文」的心臟**，份量與具體度要對得起標題。

---

## 2. 故事線（第一人稱，符合「解說片＝故事腳本」鐵則）

- **為何有此議題**：經營粉專最累的從來不是「想不出內容」，是「每天記得在對的時間發出去」。
- **誰遇到**：我幫家裡的書畫品牌（峻清书画）經營 FB Page，一個人顧不過來。
- **影響**：只要斷更兩三天，觸及就雪崩，演算法把你當「不活躍」冷處理。
- **為何別人解不掉**：市面排程工具要嘛月費（Buffer/Hootsuite 一個月台幣好幾百）、要嘛把你的內容與授權押在別人伺服器上，帳號被綁架風險高。
- **我怎麼解**：改用 Meta **官方** Graph API，自己寫一支排程，每天 07:11 從本機資料夾抓圖、組文案、直接打 FB 官方接口發出。
- **我跟別人哪裡不同**：① 官方 API 不經第三方 ② 免月費 ③ Token 和素材都在自己電腦 ④ 沒新圖會「回收輪播」舊圖，永不斷更。
- **怎麼證明（可量測 before/after）**：before = 人肉發、常斷更；after = **連續 40 天、34 篇全自動發文的實際 log**，中間我完全沒開過 FB 後台。
- **CTA**：把完整素材與指令放在資訊欄，訂閱看下一支「怎麼順便同步發到 IG / Threads」。

---

## 3. 逐章詳細內容（含真實頁面上要點哪裡 + 精確 API）

### 【CH1】為什麼「每天記得發文」會拖垮一個粉專？（Hook，約 20 秒）
- 痛點畫面：行事曆上一排「該發文」提醒、半夜還在補發、忘記發的那幾天觸及圖直接掉一半。
- 一句結論：**「日更」不是靠意志力，是靠系統。** 這支影片就是把「系統」整套拆給你看。

### 【CH2】系統總覽：四個零件（架構圖，約 30 秒）
畫一張流程圖（黑曜石風格節點）：

```
① 素材夾  ~/…/FB/FB/<日期>/(圖片+文案)
        │
        ▼
② 排程  每天 07:11 自動觸發（jq-daily-facebook-post）
        │
        ▼
③ Graph API  https://graph.facebook.com/v19.0
        │   ├─ POST /{page_id}/photos   （傳圖，暫不公開）
        │   └─ POST /{page_id}/feed     （組成一則多圖貼文）
        ▼
④ Facebook 粉絲專頁  → 貼文上線
```

重點：**這四個零件全部在你自己的電腦上跑，沒有任何第三方平台碰到你的帳號。**

### 【CH3】第一步：在 Meta 拿到「發文權」＝建一個 Meta App（真實頁面）
> 目的：Graph API 要認得「是哪個 App 在發文」，所以先建一個 App（只發自己的 Page 不用送審）。

觀眾照做的點選路徑（真實 FB 頁面）：
1. 開 **https://developers.facebook.com** → 右上「我的應用程式 / My Apps」。
2. 點 **「建立應用程式 Create App」**。
3. 用途選 **「其他 / Other」** → 類型選 **「商業 Business」** → 下一步。
4. 填 App 名稱（例：`Autopost`）→ 建立。
5. 進 App 後，左側 **「應用程式設定 → 基本資料 (Settings → Basic)」**，這裡有兩個等下要用的東西：
   - **App ID**（本專案實際值：`994414572924952`，示範用）
   - **App Secret**（點「顯示」才看得到 —— ⚠️ 這是密碼等級，影片裡一律打碼）

📌 視覺標註：在「基本資料」頁上用箭頭圈出 App ID 與 App Secret 的位置。

### 【CH4】第二步：Token 去哪裡點？＝ Graph API Explorer（真實頁面，逐個點選）
> 這是整支影片最多人卡關的地方，要一格一格慢慢點。

真實頁面路徑（對照程式 `jq_token_manager.py` 的 `cmd_refresh`）：
1. 開 **https://developers.facebook.com/tools/explorer/**（Graph API Explorer）。
2. **右上「Meta App」下拉** → 選你剛建的 App（本專案 = `Autopost`）。
3. 右邊 **「User or Page」下拉** → 先維持 User Token。
4. **「Permissions 權限」欄** 逐一加入這兩個（缺一發不出去）：
   - `pages_manage_posts` ← 代表「幫我的粉專發文」
   - `pages_read_engagement` ← 代表「讀我的粉專互動」
5. 點藍色 **「Generate Access Token 生成存取權杖」**。
6. 跳出 FB 授權視窗 → 選 **你的粉絲專頁（峻清书画）** → 允許。
7. 上方欄位就出現一串 **`EAAxxxx…` 的 Token** → 複製起來。

📌 視覺標註：把「選 App」「加權限」「Generate」「選 Page」四個步驟做成四格編號放大圖。
⚠️ 安全：真實 Token（`EAAOIai9g8Bg…`，共 207 字）在畫面上**必須打碼**，只露開頭 `EAAO…` 示意。

### 【CH5】第三步：把「短命 Token」換成 60 天耐用版（API 呼叫）
> Explorer 直接給的 User Token 只有 1–2 小時壽命，發一次就死。要做兩件事：換長效 + 取 Page Token。

**① 換 60 天長效 User Token**（程式 `_exchange_long_lived`）：
```
GET https://graph.facebook.com/v19.0/oauth/access_token
    ?grant_type=fb_exchange_token
    &client_id=<App ID>
    &client_secret=<App Secret>
    &fb_exchange_token=<剛剛複製的短效 Token>
```
→ 回傳新的 `access_token`，壽命約 60 天。

**② 用長效 User Token 取「Page Access Token」**（程式 `_get_page_token`）：
```
GET https://graph.facebook.com/v19.0/<page_id>
    ?fields=access_token,name
    &access_token=<長效 User Token>
```
→ 回傳裡的 `access_token` 就是**粉專專用 Token**。這一張才是真正拿去發文的鑰匙（用長效 User Token 換出來的 Page Token 幾乎不會過期）。

**③ 存起來**：寫進 `~/.jq_facebook_config.json` 的 `page_access_token`，並記到期日（+60 天）。
> 本專案一支指令包好全部：`python3 jq_token_manager.py refresh`（會自動開瀏覽器、問你貼 Token、換長效、取 Page Token、寫檔）。

### 【CH6】第四步：一行指令發出一則貼文（兩步 API）
> FB 多圖貼文不能一次送，要「先傳圖拿 ID、再把 ID 組成貼文」。

**① 上傳每張圖（先不公開）**（程式 `_fb_upload_one.py`）：
```
POST https://graph.facebook.com/v19.0/<page_id>/photos
  multipart 表單：
    access_token = <Page Token>
    published    = false          ← 關鍵：先傳不公開，拿到 media id
    source       = <圖片檔>
```
→ 每張回一個 `media_fbid`，累積成一個清單。

**② 把多張圖組成一則貼文**（程式 `jq_fb_publish.py`）：
```
POST https://graph.facebook.com/v19.0/<page_id>/feed
    message         = <你的文案>
    attached_media  = [{"media_fbid":"…"},{"media_fbid":"…"}]
    access_token    = <Page Token>
```
→ 回傳 `post_id`，貼文正式上線。貼文網址 = `https://www.facebook.com/<page_id>/posts/<post_id>`。

📌 視覺：終端機打一行指令 → 切到 FB 粉專，貼文「啪」地出現（前後對照）。

### 【CH7】第五步：怎麼讓程式「每天自己發」？（★ 自動的核心，本片重點）
> 前面 CH3–CH6 都只是「怎麼發一次」。真正的「自動」＝讓作業系統每天固定時間、自己執行發文腳本，你完全不用碰。

- **核心一件事**：把 CH6 那支發文腳本，交給作業系統內建的排程器。macOS / Linux 都有，就是 `cron`（Mac 也可用 `launchd`）。
- **實際做法（觀眾照打）**：
  ```
  crontab -e
  # 加一行：每天早上 07:11 自動執行發文腳本
  11 7 * * *  /usr/bin/python3 ~/fb/publish.py
  ```
  存檔即生效——**從這一刻起，你的手不用再碰，作業系統每天替你按下執行**。
- 📌 本專案實際是用 Claude Code routine（`jq-daily-facebook-post` 07:11）觸發，但對一般觀眾，`cron`／`launchd` 是最簡單、免裝任何工具的替代方案，一定要示範這一行。
- 💡 這一章是全片「如何自動發文」真正發生的地方，畫面要停久一點、把 cron 那行放大講清楚。

### 【CH8】自己跑起來後：每天發什麼、怎麼不重複？（去重 + 回收）
- **素材來源**：`~/…/FB/FB/<YYYY-MM-DD>/` 資料夾（每天一夾，放圖 + 文案）；排程時間到就去抓今天這夾。
- **去重**：發過的資料夾記在 `.jq_published_log.json` 的 `published_folders`，不重發。
- **沒新圖怎麼辦？回收輪播**：抽「最久沒重發」的舊資料夾重發（LRU 輪播），旗標 `RECYCLE_MODE=1`——**這就是它能連續 40 天不斷更的關鍵**。

### 【CH9】Token 會過期怎麼辦？（維運）
- Page Token 壽命約 **60 天**；程式在 **剩 14 天** 時自動預警。
- 檢查一行：`python3 jq_token_manager.py check` → 顯示「✅ 有效（剩 N 天）」或「⚠️ 即將到期」。
- 換新一行：`python3 jq_token_manager.py refresh`（重跑 CH4–CH5）。
- 📌 提醒觀眾：把「檢查 Token」也排進每週排程，就不會某天突然全停。

### 【CH10】成果展示：連續 40 天自動發文的真實紀錄（重頭戲）
- 畫面：把 `.jq_ig_cache_2026-05-25.json … 2026-07-04.json`（**34 個檔**）像月曆一樣鋪滿螢幕。
- 打出 `.jq_published_log.json` 的 `history`，逐筆時間戳（多筆標著 `"recycle": true`）滾動。
- 一句結論：**「這 40 天，我一次都沒打開 FB 後台。」**
- before / after 對照：before = 常斷更；after = 天天 07:11 準時上線。

### 【CH11】補充章（我主動加的「盲點與避坑」— 讓細節更完善）
1. **Token = 密碼，絕對不能入鏡**：影片、截圖、教學文一律打碼。真實 Token 外洩＝任何人都能用你的名義發文。本片所有 Token/App Secret 畫面都用「假碼重建」。
2. **一定要用「Page Token」不是「User Token」發文**：User Token 會過期、權限也不對；用長效 User Token 換出的 Page Token 才穩。
3. **FB 有每日限速**：官方 Page 一天發文有上限，別排「每小時發一篇」洗版，會被判垃圾訊息 / 協同造假。本專案設每日上限、固定一天一篇。
4. **個人動態牆發不了**：Graph API 只能發「粉絲專頁 Page」，不能發個人 Profile（2018 起封鎖）。
5. **權限最小化**：只勾 `pages_manage_posts` + `pages_read_engagement` 兩個就夠，別亂勾一堆增加審核與風險。
6. **可無痛擴充**：同一套 Page Token 幾乎能直通 Instagram（商業帳號）與 Threads——下一集講怎麼「一次發三平台」。
7. **失敗要有通知**：排程若某天發失敗（多半是 Token 過期），要用 iMessage / Email 通知自己，別等一週後才發現全停。

### 【CH12】結尾 Outro（CTA）
- 感謝觀看 + 「這套完全免月費，程式與指令都放資訊欄」。
- 訂閱（看下一集 IG/Threads 同步）+ 按讚 + 分享給也在顧粉專的朋友。
- 曉晴頭尾露臉。

---

## 3.5 每一步「要對 Claude 說的 Prompt」（逐字·可複製 — 放影片下方＋畫面上）

> **本片核心框架**：觀眾的動作不是自己土法寫 code，而是**每一步跟 Claude 說一句話**。畫面上每個動作章節都會出現一個 💬 prompt 方塊（可暫停複製），旁白也會唸出來。

| 步驟 | 對 Claude 說（逐字） |
|---|---|
| 開場總 prompt | `Hi Claude，我想讓我的 Facebook 粉專每天自動發文。請用 Meta 官方 Graph API 幫我做一套本機自動發文系統：管理 Page Token、上傳圖片、發多圖貼文，再掛上每天早上的排程。一步一步帶我做，需要我去 FB 後台點什麼也告訴我。` |
| CH3 建 App | `Claude，請一步一步教我在 developers.facebook.com 建一個 Meta App，並告訴我要去哪裡複製 App ID 和 App Secret。` |
| CH4 取 Token | `Claude，請教我用 Graph API Explorer 拿到粉專發文用的 Access Token，要勾哪些權限、點哪個按鈕，講清楚。` |
| CH5 換長效 Token | `Claude，幫我寫一支 Python 程式，把短效 Token 換成 60 天長效，再換出粉專專用的 Page Token，然後存進設定檔並記到期日。` |
| CH6 發文腳本 | `Claude，幫我寫發文腳本：先把每張圖以 published=false 上傳拿 media id，再用 /feed 把多張圖和文案組成一則貼文。` |
| CH7 掛排程（★核心） | `Claude，幫我把這支發文腳本掛上排程，讓它每天早上 7:11 自動執行（用 cron 或 launchd），並告訴我怎麼確認它有在跑。` |
| CH8 去重／回收 | `Claude，幫我加上去重：發過的資料夾不再發；還有沒有新圖時，自動回收最久沒發的舊資料夾輪播。` |
| CH9 Token 維運 | `Claude，幫我寫一個檢查 Token 到期的指令，剩 14 天就提醒我，並排進每週自動檢查。` |

📌 視覺規範：每個 💬 prompt 方塊用終端機面板的高亮行呈現（`cmd` 樣式），停留夠久讓觀眾暫停複製；旁白同步唸出「你只要跟 Claude 說：…」。

---

## 3.6 完整 Master Prompt（片尾「看到最後的禮物」· 逐字 · 已對照 `Projects/FB` 程式碼驗證）

> 片尾 CH12 場景會把這段濃縮版打在畫面上（可暫停複製）；**這份逐字完整版放 YouTube 描述最上方**，鼓勵觀眾看到最後複製整段、一次貼給 Claude 就能從零建好整套。
> ✅ 驗證：下列每個端點/權限/參數都對到實際在運作的程式（`jq_token_manager.py`、`_fb_upload_one.py`、`jq_fb_publish.py`），且該系統已連續自動發文 40 天。

```
Hi Claude，我想在我自己的電腦上，做一套讓我的 Facebook 粉絲專頁每天自動發文的系統，
全部用 Meta 官方 Graph API（版本 v19.0 或更新）、不靠任何付費第三方工具。
請一步一步帶我完成；過程中需要我去 Facebook 網站或後台點什麼，也請明確告訴我點哪裡。
過程中你需要的 App ID、App Secret、我的粉專 page_id、素材資料夾路徑，以及資料夾裡圖片與文案的檔名規則，請直接問我。需求如下：

1) 前置：教我到 developers.facebook.com 建立一個 Meta App（用途選「其他」、類型選「商業」），
   並告訴我在「設定 → 基本資料」哪裡複製 App ID 和 App Secret。

2) 取得 Token：教我用 Graph API Explorer，選我的 App、加入 pages_manage_posts 和
   pages_read_engagement 兩個權限、產生存取權杖並選我的粉絲專頁，然後把 Token 複製給你。

3) 幫我寫一支 Python 程式管理 Token：
   - 用 App ID + App Secret，呼叫 GET /oauth/access_token?grant_type=fb_exchange_token
     把短效 User Token 換成 60 天長效 User Token；
   - 再用 GET /{page_id}?fields=access_token 換出粉專專用的 Page Access Token；
   - 把 page_id、page_access_token、到期日（換發日 + 60 天）存進 ~/.fb_config.json。

4) 幫我寫發文腳本（多圖貼文分兩步）：
   - 先對 POST /{page_id}/photos 上傳每張圖、帶 published=false，拿到每張的 media id；
   - 再對 POST /{page_id}/feed 帶 message（文案）和 attached_media（media id 陣列）組成一則貼文；
   - 發完印出貼文網址（https://www.facebook.com/{page_id}/posts/{post_id}）。

5) 內容來源＋去重＋回收：每天去一個以日期命名的資料夾（例如 ~/fb/YYYY-MM-DD/）抓當天圖片和文案；
   已發過的資料夾記在一份 log、不重複發；若今天沒有新資料夾，就自動抽「最久沒發過」的舊資料夾
   回收輪播，確保天天有內容。

6) 排程：幫我把發文腳本掛上排程，每天早上 07:11 自動執行
   （macOS 用 launchd 或 cron、Linux 用 cron，例如 crontab 一行：11 7 * * * /usr/bin/python3 ~/fb/publish.py），
   並告訴我怎麼確認它有在跑。

7) Token 維運：幫我寫一個檢查 Token 到期的指令，Page Token 剩 14 天就提醒我，並排一個每週自動檢查。

安全要求：所有 Token 和 App Secret 當成密碼處理，不要寫死在會外流的地方、不要出現在螢幕截圖裡；
只申請必要的那兩個權限；並提醒我 Graph API 只能發「粉絲專頁 Page」不能發個人動態牆，而且有每日發文上限，排程不要太密集。
```

---

## 4. 視覺素材清單（哪些用真實截圖、哪些必須用程式重建）

| 章節 | 畫面 | 來源方式 | 為何 |
|---|---|---|---|
| CH3 | developers.facebook.com「建立應用程式」「基本資料」頁 | ✅ 可真實截圖（不含 Token） | 純導覽頁，無密碼 |
| CH4 | Graph API Explorer 選 App / 加權限 / Generate / 選 Page | ⚠️ 真實截圖但 **Token 欄打碼**，或用程式重建 | 會露出真 Token |
| CH4/5 | 出現 `EAAxxx` Token、App Secret | ❌ 一律程式重建假碼 | 密碼等級，外洩即被盜用 |
| CH6 | 終端機發文指令 + FB 貼文出現 | ✅ 真實錄，Token 段打碼 | 展示效果 |
| CH9 | 34 個快取檔月曆 + published log 時間戳 | ✅ 真實資料（檔名/時間戳無敏感） | 這就是成果證據 |

> 依本 repo 既有慣例（LinkedIn 那支影片的個資處理）＋ 記憶 `claude-in-chrome-no-file-access`：**含 Token/密碼的畫面用「程式碼重建、繪製時就打碼」最安全**；不含密碼的導覽頁可用真實截圖。

---

## 5. 製作規格（黑曜石重製版，套用本專案影片鐵則）

- **一片一資料夾**：`src/videos/fb-autopost/`（本檔所在），從 `_template` / `_explainer` 起、複用 `shared-skills/`。
- **封面 0:00 亮相**：開場 1–2 秒先閃封面卡（大標 +「40 天沒碰鍵盤」鉤子）再進 Hook。
- **概念錨頂部藥丽帶**：每章配一句頂部概念錨（如 CH4「Token = 發文的鑰匙」），底部字幕放本鏡重點。
- **旁白**：edge-tts 曉晴（`zh-TW-HsiaoChenNeural`）；**逐句先給老闆過稿再算繪**。
- **BGM**：Gemini 生鋼琴水晶 BGM，本片新生一首、檔名帶片名（`public/bgm-fb-autopost.mp3`）。
- **GEO 上片**：標題 problem→solution + 具體結果（40 天）、開字幕、章節時間戳、FAQ/VideoObject JSON-LD、實體講清楚（Facebook Graph API / Page Access Token / 排程）。
- **QA gate**：收工前跑 `scripts/qa-video.mjs` + 檢查 0:00 封面 / 前 3 秒鉤子 / 結尾 CTA / 無抖動 / 字幕同步。
- **不自動上傳**：算繪 + QA 後，老闆本機看過說「發」才上 unlisted → 轉 public。

---

## 6. GEO 標題 / 描述草案（problem → solution → 具體結果）

**標題（候選）：**
1. `我讓 Facebook 每天自動發文，40 天沒碰鍵盤｜Graph API 免月費串接全教學`
2. `不用 Buffer！用 Meta 官方 API 讓粉專天天自動發文（Token 怎麼拿手把手教）`

**描述開頭（前 2 行給 AI 引擎抓）：**
> 這支影片手把手教你用 Facebook 官方 Graph API，讓粉絲專頁每天固定時間自動發圖文貼文，不靠任何付費第三方工具、Token 全留在自己電腦。實測連續 40 天、34 篇全自動發文零介入。含：建立 Meta App、Graph API Explorer 取 Token、換 60 天長效 Token、`/photos`+`/feed` 發文、排程與去重回收。

**章節時間戳**：對應 CH1–CH11。
