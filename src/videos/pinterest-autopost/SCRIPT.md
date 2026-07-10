# 生活應用系列 EP06 ·「我怎麼讓 Pinterest 自動把畫作變流量」

### 故事解說片腳本（黑曜石模板）— 待老闆逐句過稿

> 來源：`~/Documents/Claude/Projects/` 的真實 Pinterest 專案
> 主程式：`FB/jq_post_pinterest.py`（官方 v5 API 發 Pin + 合規護欄）、`FB/pinterest_sandbox_demo.py`（sandbox 驗證）
> 專案狀態：`Pinterest/Pinterest-API-專案狀態.md`、發布進度：`Pinterest/Pinterest發布進度.md`
> 真實現況：App「China Painting and Calligraphy」(ID 1583819) Trial 已核准；**公開發 Pin 卡 Standard 審查中（2026-06-25 送審）**；瀏覽器路線已發 33 張 Pin
> 片型：**故事解說片**（不是照做教學片）· 集數：**生活應用系列 EP06**

---

## 0. 一句話定位（GEO 實體宣告）

**這支影片講：一個賣中國書畫的小品牌，怎麼用 Pinterest 官方 API 把原創畫作自動發成帶連結的 Pin、導流到自己的 Shopify——以及我從「申請當天被拒」一路搏鬥到「真人複審通過」的完整真實過程。** 重點不是叫你照抄步驟，是把「跟平台官方 API 審查打交道」的思路與踩坑，一次講清楚。

- ✅ 適用：賣視覺作品（畫作 / 攝影 / 手作 / 設計）想長期被搜到、用 Pinterest 導流到自己商店的人。
- 🚫 不建議：只想「一鍵狂發洗版」衝量的人——Pinterest 對重複、高頻、非原創內容會限流甚至封號。

---

## 1. 影片分章總表（觀眾會問的問題當標題）

| # | 場景 type | 章節（觀眾會問的問題） | 核心一句答案（含數字/結論） |
|---|---|---|---|
| 0 | cover | 封面卡（0:00 亮相） | 鉤子「申請當天被拒，我怎麼讓 Pinterest 自動幫我賣畫」 |
| 1 | compare | 為什麼賣畫的人不該跳過 Pinterest？ | 它是視覺搜尋引擎，一張 Pin 帶客好幾個月；IG 貼文 24 小時就沉 |
| 2 | pipeline | 我到底想讓 Pinterest 自動做什麼？ | 原創畫作 → 自動發帶連結 Pin → 導到 Shopify，走官方 API |
| 3 | terminal | 為什麼我第一次申請 API 當天就被拒？ | app 名稱含「Auto Poster」跟網站名不一致 → 被判可疑，自動拒 |
| 4 | pipeline | 我怎麼從被拒翻到真人複審通過？ | 開 support ticket → 開名稱＝網站的新 app → 專員真人複審，隔天過 |
| 5 | terminal | 打通後，程式怎麼自動發一張 Pin？ | 三步：OAuth 換 token → 列看板 → POST /pins（標題+說明+圖+連結） |
| 6 | terminal | 怎麼確保它「不被判洗版、保住帳號」？ | 兩道護欄：同圖去重 + 每天最多 1 張，把洗版訊號壓到 0 |
| 7 | compare | 現在到底能不能全自動公開發？（誠實說） | Trial 只能 sandbox 私密發；公開發要 Standard，已送審、審查中 |
| 8 | pipeline | API 全開前，畫作怎麼還是天天上架？ | 瀏覽器半自動路線：已發 33 張、鋪滿 4 個主題看板 |
| 9 | compare | 這套跟花錢買排程工具差在哪？ | 官方 API 免月費 + 合規護欄自保 + 授權素材全在自己電腦 |
| 10 | pipeline | 成果，還有我學到最貴的一課 | 33 張 Pin + sandbox 全鏈路驗證；最貴一課＝app 名稱要跟網站一致 |
| 11 | outro | 結尾 CTA | 感謝 + 訂閱/按讚/分享 + 預告「Standard 過了做真·全自動」 |

> **主軸定位**：這支的心臟是**「跟官方 API 審查搏鬥的故事」（CH3–4）＋「合規才活得久」（CH6–7）**，技術（CH5）點到為止即可。全片約 **6.2 分鐘**（48 句旁白 · 含轉場開銷）。

---

## 2. 故事線（第一人稱，套「解說片＝故事腳本」鐵則）

- **為何有此議題**：賣畫最難的不是畫，是讓對的人「看到並點進來買」。
- **誰遇到**：我幫家裡的書畫品牌（峻清書畫，五代水墨世家）做線上通路，一個人顧不過來。
- **影響**：IG 貼文發完 24 小時就沉，等於一次性曝光；靠人手一張張發 Pin 也撐不久。
- **為何別人解不掉**：市面排程工具要月費、又把帳號授權押在第三方伺服器；而想走官方 API，光「拿到發文資格」這關就會被審查擋下來。
- **我怎麼解**：走 Pinterest 官方 v5 API 自己寫程式，OAuth 換 token → 列看板 → 發 Pin，並把合規護欄（去重＋每日上限）直接寫進程式。
- **我跟別人哪裡不同**：① 官方 API 不經第三方 ② 內建合規護欄主動避免被判 spam ③ 每張 Pin 都第一方原創、帶連結導流 ④ 卡機器審查時懂得把案子推到「真人」手上。
- **怎麼證明（可量測 before/after）**：before＝申請當天被拒、零 API 能力；after＝Trial 通過、sandbox 全鏈路驗證、瀏覽器路線已發 **33 張 Pin 鋪滿 4 個看板**。
- **誠實邊界**：API「對外公開自動發」還沒開通，卡在 Standard 審查中——這點片裡明講，不假裝全打通。
- **CTA**：訂閱看下一支「Standard 過了、真・全自動公開發 Pin」實戰。

---

## 3. 逐章詳細（畫面 + 場景欄位 + 旁白逐句 + 底部字幕）

> 旁白聲音：edge-tts `zh-TW-HsiaoChenNeural`（曉晴）。cue key 對應下面 §4 的 `script` 表。

### 【CH0】封面卡（cover，0:00 亮相，約 2 秒）
- **titlePre**：`Pinterest`　**titlePost**：`自動發文引流`
- **封面 terminal 卡** title：`我只想讓 Pinterest 自動幫我賣畫`
  - `cmd` 💬「Hi Claude，幫我用 Pinterest 官方 API 自動發我的畫作」
  - `cmt` 原創畫作 → 自動組成 Pin → 帶連結導到 Shopify
  - `out` Pinterest 官方 v5 API · 內建合規護欄
  - `ok` 33 張 Pin 鋪滿 4 個看板 · API 全鏈路已驗證
- **chips**：`33`張 Pin 已上線(violet)｜`4`個主題看板(blue)｜`1`張/天 合規護欄(green)｜`14`天 從被拒到通關(claude)
- **旁白**：
  - cv1：我幫家裡的書畫品牌，想讓 Pinterest 自動幫我把畫作變成流量。
  - cv2：結果第一次申請官方 API，當天就被打槍。
  - cv3：這支影片，就是我怎麼從被拒、一路搏鬥到通關的完整過程。

### 【CH1】為什麼賣畫的人不該跳過 Pinterest？（compare · accent warn）
- **headingZh**：為什麼賣畫的人，不該跳過 Pinterest？　**headingEn**：Why Pinterest for selling art
- **bad**：badge「IG 貼文 · 壽命短」／code「發完 24 小時就沉」／note「動態一直洗，舊貼文沒人再看到，等於一次性曝光。」
- **good**：badge「Pinterest Pin · 長效」／code「被搜到、被收藏 → 長期帶連結」／note「Pinterest 本質是視覺搜尋引擎，一張 Pin 可以帶客好幾個月。」
- **keyline**（第 3 句浮現）：Pinterest 不是社群，是「會幫你長期帶客的視覺搜尋引擎」
- **底部字幕**：一張 Pin 帶客好幾個月，IG 貼文 24 小時就沉
- **旁白**：
  - wy1：賣畫最難的不是畫，是讓對的人看到、並且點進來買。
  - wy2：IG 貼文發完 24 小時就被洗下去，等於一次性曝光。
  - wy3：Pinterest 不一樣，它本質是視覺搜尋引擎，一張 Pin 被搜到、被收藏，可以幫你長期帶連結導流。
  - wy4：對賣視覺作品的人來說，這是最划算、也最該自動化的一條管道。

### 【CH2】我到底想讓 Pinterest 自動做什麼？（pipeline · accent blue）
- **headingZh**：我想讓 Pinterest 自動做的一件事　**headingEn**：What I want to automate
- **nodes**：🖼 原創畫作 / 五代水墨真跡(teal) → 🤖 官方 API / 自動組成 Pin(violet) → 📌 發成 Pin / 標題+說明+連結(blue) → 🛒 Shopify / 一鍵導到商品頁(green)
- **keyline**（第 4 句）：每張 Pin 都是第一方原創、帶連結，直接把看到的人導去買
- **底部字幕**：原創畫作 → 自動發帶連結 Pin → 導到 Shopify
- **旁白**：
  - go1：我要的自動化其實很單純：把自己的原創畫作，自動發成一張帶連結的 Pin。
  - go2：每張 Pin 都放標題、說明，還有一個連結，直接指到 Shopify 上那幅畫的商品頁。
  - go3：而且我堅持走 Pinterest 官方 API，不經任何第三方付費工具。
  - go4：聽起來很簡單對吧？結果光是拿到「用官方 API 發文」的資格，我就卡了兩個禮拜。

### 【CH3】為什麼第一次申請，當天就被打槍？（terminal · accent warn）
- **headingZh**：為什麼我第一次申請，當天就被打槍？　**headingEn**：Denied on day one
- **terminal** title：`developers.pinterest.com → API access 申請結果`
  - `err` ❌ Trial access denied（2026-06-11 · 當天自動拒絕）
  - `cmt` 我以為是內容或帳號問題，查了老半天都不對
  - `out` 真正原因：app 公司名稱含「… Auto Poster」
  - `err` 跟網站顯示名「China Painting and Calligraphy」對不上 → 判定可疑
- **stamps**：warn「名稱不一致 ＝ 紅旗」（第 4 句浮現）
- **keyline**（第 3 句）：Pinterest 的自動審查，會用「名稱一致性」抓可疑 app
- **底部字幕**：被拒真正原因＝app 名稱「Auto Poster」跟網站名對不上
- **旁白**：
  - rj1：2026 年 6 月 11 號，我送出 API 申請，當天就被自動拒絕。
  - rj2：一開始我以為是畫作內容或帳號有問題，查了老半天都不對。
  - rj3：後來才知道真正原因：我那個 app 的公司名稱裡有 Auto Poster 這種字眼，跟網站上的顯示名稱 China Painting and Calligraphy 對不起來。
  - rj4：對 Pinterest 的審查系統來說，名稱對不上就是一面紅旗，直接判你可疑。

### 【CH4】我怎麼從被拒翻到真人複審通過？（pipeline · accent violet）
- **headingZh**：我怎麼從「被自動拒」翻到「真人複審通過」？　**headingEn**：From auto-reject to human review
- **nodes**：🎫 開 support ticket / 不糾纏論壇(warn) → 🆕 開新 app / 名稱＝網站完全一致(blue) → 👩‍💼 真人複審 / API Ops 專員接手(violet) → ✅ Trial 核准 / OAuth+token 全通(green)
- **keyline**（第 4 句）：卡在自動審查，就想辦法把案子推到「真人」手上
- **底部字幕**：開名稱對齊網站的新 app → 專員真人複審，隔天過
- **旁白**：
  - fx1：我沒有跟論壇的罐頭回覆糾纏，而是直接開了一張官方 support ticket。
  - fx2：Pinterest API 團隊一位專員回信點出名稱問題後，我做的事很簡單：重開一個 app，名稱跟網站完全一模一樣，都叫 China Painting and Calligraphy。
  - fx3：這次由專員真人複審，隔天就核准了 Trial，OAuth、access token、讀取全部打通。
  - fx4：這一課最值錢：卡在機器審查時，想辦法把案子推到真人手上，而且先把最容易被誤判的地方修乾淨。

### 【CH5】打通後，程式怎麼自動發一張 Pin？（terminal · accent teal）
- **headingZh**：打通之後，程式怎麼自動發一張 Pin？　**headingEn**：How one Pin gets posted
- **terminal** title：`jq_post_pinterest.py — Pinterest 官方 v5 API`
  - `cmd` 💬 對 Claude：「用官方 API 幫我把這幅畫發成一張帶連結的 Pin」
  - `cmt` ① OAuth 授權 → 把授權碼換成 access token
  - `cmt` ② 列出我的看板（山水 / 花鳥 / 書法 / 神明人物）
  - `out` ③ POST /pins：標題 ＋ 說明 ＋ 圖片 ＋ Shopify 連結
  - `ok` ✅ Pin 建立成功，回傳 Pin ID 與網址
- **keyline**（第 3 句）：一支 Python，把「授權 → 選看板 → 發 Pin」全串起來
- **底部字幕**：三步：OAuth 換 token → 列看板 → POST /pins
- **旁白**：
  - pin1：打通之後，發一張 Pin 其實就三步。
  - pin2：先用 OAuth 授權，把授權碼換成 access token；再列出我在 Pinterest 上的看板，像山水、花鳥、書法、神明人物。
  - pin3：最後呼叫官方接口 POST /pins，把標題、說明、畫作圖片，還有指回 Shopify 的連結一起送出去。
  - pin4：成功的話，Pinterest 會回傳這張 Pin 的 ID 跟網址——整段就是一支 Python 幫我跑完。

### 【CH6】怎麼確保它不被判洗版、保住帳號？（terminal · accent green）
- **headingZh**：怎麼確保它「不會被判洗版、保住帳號」？　**headingEn**：Guardrails that keep the account safe
- **terminal** title：`合規護欄（直接寫進發文程式）`
  - `cmd` # 護欄一：同一張圖只發一次
  - `out` if 圖片 in 已發清單:  跳過（重複發 ＝ spam 訊號）
  - `cmd` # 護欄二：每天最多發 1 張
  - `out` if 今天已發 >= 1:  今天不再發
  - `ok` 主動把「洗版訊號」壓到 0，帳號才活得久
- **stamps**：warn「合規 ＝ 資產，不是限制」（第 4 句）
- **keyline**（第 3 句）：能自動，更要「刻意發得慢」——這是帳號能長久的關鍵
- **底部字幕**：同圖去重 ＋ 每天 1 張，把洗版訊號壓到 0
- **旁白**：
  - gd1：能自動發，不代表就該狂發。這也是很多人自動化之後帳號被限流的原因。
  - gd2：所以我把兩道合規護欄直接寫進程式：第一，同一張圖只發一次，避免重複發被判洗版。
  - gd3：第二，每天最多發一張，刻意放慢節奏。
  - gd4：對平台來說，穩定、低頻、原創，才是好帳號。合規不是限制，是讓帳號活得久的資產。

### 【CH7】現在到底能不能全自動公開發？（compare · accent warn，誠實章節）
- **headingZh**：那現在，到底能不能「全自動公開發」？（誠實說）　**headingEn**：The honest current status
- **bad**：badge「Trial 等級 · 現在」／code「production 發 Pin → 403 code 29」／note「Trial 只能在 sandbox 私密環境建 Pin，對外公開發會被官方擋下。」
- **good**：badge「Standard 等級 · 審查中」／code「通過後 → 公開自動發解鎖」／note「2026-06-25 已送出 Standard 申請，含合規護欄與示範影片，正在審查佇列裡等。」
- **keyline**（第 4 句）：全鏈路已在 sandbox 驗證，只差 Pinterest 核准 Standard 這一步
- **底部字幕**：Trial 只能 sandbox 私密發；公開發要 Standard，審查中
- **旁白**：
  - st1：這裡我必須誠實講清楚，因為這才是真實狀態。
  - st2：我這個 app 目前是 Trial 等級，只能在 sandbox、也就是私密環境裡建 Pin；真的要對外公開自動發，Pinterest 會回一個 403 錯誤把你擋下。
  - st3：要解鎖公開發，必須升級到 Standard。我已經在 6 月 25 號送出申請，連合規護欄跟示範影片都附上了，現在還在官方審查佇列裡等。
  - st4：換句話說，整條技術鏈路我在 sandbox 已經全部跑通、驗證過，就差 Pinterest 點頭這一步。

### 【CH8】API 全開前，畫作怎麼還是天天上架？（pipeline · accent teal）
- **headingZh**：那在 API 全開之前，畫作怎麼還是天天上架？　**headingEn**：Keeping art live while waiting
- **nodes**：🖥 瀏覽器半自動 / Claude 駕駛 pin-builder(teal) → 📌 已發 33 張 Pin / 每天 3–5 張穩鋪(blue) → 🗂 4 個主題看板 / 山水·花鳥·書法·神明(violet) → 🔗 每張帶連結 / 全導回 Shopify(green)
- **keyline**（第 4 句）：等審查的同時，畫作一天都沒停過上架
- **底部字幕**：瀏覽器路線已發 33 張，鋪滿 4 個主題看板
- **旁白**：
  - br1：等審查的這段時間，我沒讓畫作停下來。
  - br2：我改走瀏覽器半自動路線，用 Claude 駕駛 Pinterest 的 pin-builder，每天穩定發個三到五張。
  - br3：到目前為止已經發了 33 張 Pin，鋪滿山水、花鳥、書法、神明人物四個主題看板，每一張都帶連結導回 Shopify。
  - br4：所以就算 API 還沒完全開，我的畫作在 Pinterest 上的能見度，一天都沒有斷。

### 【CH9】這套跟花錢買排程工具差在哪？（compare · accent blue）
- **headingZh**：這套跟花錢買排程工具，差在哪？　**headingEn**：vs paid schedulers
- **bad**：badge「第三方付費工具」／code「月費 ＋ 內容押在別人伺服器」／note「授權綁在第三方，平台一改政策或工具收掉，你的排程跟資料一起沒。」
- **good**：badge「官方 API · 自己的程式」／code「免月費 ＋ 合規護欄自保」／note「授權、圖片、連結全在自己電腦，護欄自己控，帳號安全自己顧。」
- **keyline**（第 3 句）：差別不只省錢，是「帳號跟資料的主導權在誰手上」
- **底部字幕**：官方 API＝免月費 ＋ 授權素材全在自己手上
- **旁白**：
  - df1：你可能會問，市面上一堆排程工具，為什麼要自己搞官方 API？
  - df2：付費工具要月費，還把你的內容跟帳號授權押在它的伺服器上；哪天它改政策或收掉，你的排程跟資料就一起陪葬。
  - df3：走官方 API、自己寫程式，授權、圖片、連結全在自己電腦，合規節奏自己控——差別不只是省錢，是帳號跟資料的主導權在誰手上。

### 【CH10】成果，還有我學到最貴的一課（pipeline · accent green）
- **headingZh**：成果，還有我學到最貴的一課　**headingEn**：Results & the costliest lesson
- **nodes**：📌 33 張 Pin / 4 個看板已鋪滿(blue) → 🔬 API 全鏈路 / sandbox 驗證通過(violet) → ⏳ Standard / 審查中，通過即全自動(warn) → 💡 最貴一課 / app 名稱要跟網站一致(green)
- **keyline**（第 4 句）：從當天被拒到全鏈路打通——最貴的一課只花一行字：名稱對齊
- **底部字幕**：33 張 Pin ＋ sandbox 全鏈路；最貴一課＝名稱要跟網站一致
- **旁白**：
  - rs1：快速收個尾。到今天，瀏覽器路線已經鋪了 33 張 Pin，四個主題看板都上滿了。
  - rs2：官方 API 這條，OAuth、換 token、列看板、建 Pin，我在 sandbox 全鏈路都驗證通過。
  - rs3：只剩 Standard 審查這一步，一旦通過，公開自動發就直接解鎖。
  - rs4：而我學到最貴的一課其實只有一行字：申請 API 時，app 名稱一定要跟你的網站完全一致——就這一點，讓我從當天被拒翻到真人複審通過。

### 【CH11】結尾 CTA（outro）
- **headingZh**：這一集的重點，總整理　**headingEn**：Pinterest auto-post recap
- **cards**：
  - 📌 Pinterest ＝視覺搜尋引擎，Pin 長效帶客(teal)
  - 🔑 官方 v5 API：授權 → 換 token → 發 Pin(violet)
  - 🛡 合規護欄：同圖去重 ＋ 每天 1 張，帳號才活得久(green)
  - 🧭 卡機器審查，就把案子推到真人手上(blue)
  - 💡 最貴一課：app 名稱要跟網站完全一致(warn)
- **旁白**：
  - o1：這一集，我把怎麼讓 Pinterest 自動幫我把畫作變流量，從頭到尾拆給你看。
  - o2：重點回顧：Pinterest 是視覺搜尋引擎，一張 Pin 能長期帶客。
  - o3：官方 API 三步：授權、換 token、發 Pin；再加同圖去重跟每天一張的合規護欄，帳號才活得久。
  - o4：還有那個最貴的教訓——app 名稱一定要跟網站一致。
  - o5：如果這支對你有幫助，記得訂閱、按讚、分享給也在經營帳號的朋友。
  - o6：Standard 一過，我會再做一支「Pinterest 真・全自動公開發」的實戰，我們下支見。

---

## 4. 旁白總表（script cue → 逐字，給 VO 生成用）

```
cv1 我幫家裡的書畫品牌，想讓 Pinterest 自動幫我把畫作變成流量。
cv2 結果第一次申請官方 API，當天就被打槍。
cv3 這支影片，就是我怎麼從被拒、一路搏鬥到通關的完整過程。
wy1 賣畫最難的不是畫，是讓對的人看到、並且點進來買。
wy2 IG 貼文發完 24 小時就被洗下去，等於一次性曝光。
wy3 Pinterest 不一樣，它本質是視覺搜尋引擎，一張 Pin 被搜到、被收藏，可以幫你長期帶連結導流。
wy4 對賣視覺作品的人來說，這是最划算、也最該自動化的一條管道。
go1 我要的自動化其實很單純：把自己的原創畫作，自動發成一張帶連結的 Pin。
go2 每張 Pin 都放標題、說明，還有一個連結，直接指到 Shopify 上那幅畫的商品頁。
go3 而且我堅持走 Pinterest 官方 API，不經任何第三方付費工具。
go4 聽起來很簡單對吧？結果光是拿到用官方 API 發文的資格，我就卡了兩個禮拜。
rj1 二零二六年六月十一號，我送出 API 申請，當天就被自動拒絕。
rj2 一開始我以為是畫作內容或帳號有問題，查了老半天都不對。
rj3 後來才知道真正原因：我那個 app 的公司名稱裡有 Auto Poster 這種字眼，跟網站上的顯示名稱對不起來。
rj4 對 Pinterest 的審查系統來說，名稱對不上就是一面紅旗，直接判你可疑。
fx1 我沒有跟論壇的罐頭回覆糾纏，而是直接開了一張官方 support ticket。
fx2 團隊專員回信點出名稱問題後，我做的事很簡單：重開一個 app，名稱跟網站完全一模一樣。
fx3 這次由專員真人複審，隔天就核准了 Trial，OAuth、access token、讀取全部打通。
fx4 這一課最值錢：卡在機器審查時，想辦法把案子推到真人手上，而且先把最容易被誤判的地方修乾淨。
pin1 打通之後，發一張 Pin 其實就三步。
pin2 先用 OAuth 授權，把授權碼換成 access token；再列出我在 Pinterest 上的看板。
pin3 最後呼叫官方接口，把標題、說明、畫作圖片，還有指回 Shopify 的連結一起送出去。
pin4 成功的話，Pinterest 會回傳這張 Pin 的編號跟網址——整段就是一支程式幫我跑完。
gd1 能自動發，不代表就該狂發。這也是很多人自動化之後帳號被限流的原因。
gd2 所以我把兩道合規護欄直接寫進程式：第一，同一張圖只發一次，避免重複發被判洗版。
gd3 第二，每天最多發一張，刻意放慢節奏。
gd4 對平台來說，穩定、低頻、原創，才是好帳號。合規不是限制，是讓帳號活得久的資產。
st1 這裡我必須誠實講清楚，因為這才是真實狀態。
st2 我這個 app 目前是 Trial 等級，只能在私密環境裡建 Pin；真的要對外公開自動發，會被官方擋下。
st3 要解鎖公開發必須升級到 Standard。我已經在六月二十五號送出申請，現在還在官方審查佇列裡等。
st4 換句話說，整條技術鏈路我已經全部跑通、驗證過，就差 Pinterest 點頭這一步。
br1 等審查的這段時間，我沒讓畫作停下來。
br2 我改走瀏覽器半自動路線，用 Claude 駕駛 Pinterest 的發布介面，每天穩定發個三到五張。
br3 到目前為止已經發了三十三張 Pin，鋪滿山水、花鳥、書法、神明人物四個主題看板。
br4 所以就算 API 還沒完全開，我的畫作在 Pinterest 上的能見度，一天都沒有斷。
df1 你可能會問，市面上一堆排程工具，為什麼要自己搞官方 API？
df2 付費工具要月費，還把你的內容跟帳號授權押在它的伺服器上；哪天它收掉，你的資料就一起陪葬。
df3 走官方 API、自己寫程式，授權、圖片、連結全在自己電腦——差別不只是省錢，是主導權在誰手上。
rs1 快速收個尾。到今天，瀏覽器路線已經鋪了三十三張 Pin，四個主題看板都上滿了。
rs2 官方 API 這條，授權、換 token、列看板、建 Pin，我在私密環境全鏈路都驗證通過。
rs3 只剩 Standard 審查這一步，一旦通過，公開自動發就直接解鎖。
rs4 而我學到最貴的一課只有一行字：申請 API 時，app 名稱一定要跟你的網站完全一致。
o1 這一集，我把怎麼讓 Pinterest 自動幫我把畫作變流量，從頭到尾拆給你看。
o2 重點回顧：Pinterest 是視覺搜尋引擎，一張 Pin 能長期帶客。
o3 官方 API 三步：授權、換 token、發 Pin；再加同圖去重跟每天一張的合規護欄，帳號才活得久。
o4 還有那個最貴的教訓——app 名稱一定要跟網站一致。
o5 如果這支對你有幫助，記得訂閱、按讚、分享給也在經營帳號的朋友。
o6 Standard 一過，我會再做一支 Pinterest 真・全自動公開發的實戰，我們下支見。
```

> ⚠️ edge-tts 拆字母怪音坑（記憶 `edge-tts-spaced-acronym-bug`）：旁白稿內 API / OAuth / Pin / Shopify 等字母詞，前後用逗號或空格斷開，**絕不用全形冒號／分號緊接字母**。上表已照此處理。

---

## 5. GEO 上片資料（發佈時用；套 CLAUDE.md §5）

**YouTube 標題（problem → solution + 具體結果）**
> 我讓 Pinterest 自動幫我賣畫：官方 API 從「申請當天被拒」到通關，33 張 Pin 鋪滿看板｜生活應用 EP06

**描述（前 3 行給 AI 引擎抓，含實體）**
> 這支示範一個賣中國書畫的小品牌，怎麼用 Pinterest 官方 v5 API 把原創畫作自動發成帶連結的 Pin、導流到自己的 Shopify 商店；並完整還原我從 API 申請當天被自動拒絕、到開名稱對齊網站的新 app、由真人複審通過的過程。內建「同圖去重＋每天最多 1 張」合規護欄。目前公開自動發卡在 Pinterest Standard 審查，瀏覽器路線已發 33 張 Pin。
> 章節：
> 00:00 為什麼申請當天被拒
> 00:xx 為什麼賣畫要用 Pinterest
> 00:xx 我想自動化什麼
> 00:xx 被拒真正原因：名稱不一致
> 00:xx 從被拒到真人複審通過
> 00:xx 程式怎麼自動發一張 Pin
> 00:xx 合規護欄：不被判洗版
> 00:xx 誠實現況：Standard 審查中
> 00:xx 瀏覽器路線 33 張 Pin
> 00:xx 跟付費工具差在哪
> 00:xx 成果與最貴的一課

**標籤**：Pinterest API, Pinterest 自動發文, Pinterest 賣畫, Shopify 導流, Pinterest v5 API, 內容自動化, Claude Code, 生活應用, China ink painting

---

## 6. 待辦（過稿後的產線；本輪只到腳本，不算繪）

1. 老闆**逐句過稿**（尤其 §4 旁白總表）→ 有要改先改字。
2. 建 spec：`src/videos/_explainer/specs/pinterest-autopost.json`（12 景，複製 fb-autopost 黑曜石結構）+ `.vo.json`。
3. 元件：複製 `fb-autopost/Obsidian.tsx` + `glass.tsx` 到本夾（或共用），改 spec 引用。
4. `src/Root.tsx` 註冊 comp `PinterestAutopost`。
5. `scripts/make-vo-pinterest-autopost.mjs` 生曉晴旁白（edge-tts）。
6. 新生一首鋼琴水晶 BGM（記憶 `video-bgm-crystal-piano`：每片各自新生、檔名帶片名）。
7. 算繪（黑曜石卡風 → **必加 `--image-format=png --crf=15`** 防抖，記憶 `obsidian-render-settings`）。
8. 過 QA gate：0:00 封面亮相 · 前 3 秒鉤子 · 結尾 CTA · 無抖動 · 字幕與旁白同步。
9. ⛔ 不自動上傳，老闆本機看過才上 unlisted → 轉公開前再問。
