# YouTube 上片全自動化——逐句旁白稿（v2 · 2026-07-03 納入老闆 6 點回饋，待複審）

> 片型：解說片（工具書式 13 章）｜主軸：**Claude Code 如何用 YouTube Data API 幫我全自動上片**
> 系列：實戰自動化 EP02（接 EP01 小紅書全自動發文）｜封面：黑曜石 v3 系列同款（⬆ 上傳獨石碑，草案待定）｜聲音：曉晴 edge-tts + 本片專屬鋼琴水晶 BGM
> **定位鐵則**（同 EP01）：主詞＝Claude 自動執行；「我」＝出主意＋把關的人。一次性設定是「唯一需要人動手的五分鐘」，Claude 全程帶路、出錯自動繞。
> **素材**：2026-06-04 真實對話實錄 Google Doc（含當時實際截圖）；截圖遮蔽 email＋OAuth client ID。
> **文案寫法**：SEO + GEO（問答體、具體數字、實體講清楚：Claude Code／YouTube Data API v3／OAuth／client_secrets.json）。
> 概念錨（頂部藥丸帶）逐章標注於各章標題後。

---

## 逐句旁白稿（編號＝章-句，要改直接說「7-3 改成…」）

### CH1 一句指令上線（Hook）
- 1-1 這支影片算繪完成之後，我只對 Claude 說了一句話：上傳。
- 1-2 六十秒後，它把 YouTube 連結交回我手上，標題、描述、隱私設定，全部填好。
- 1-3 沒有開瀏覽器、沒有拖檔案、沒有填表單，我全程沒碰 YouTube。
- 1-4 代價是一次性的五分鐘設定。做完那五分鐘，之後每一支影片，永遠自動。
- 1-5 這支片，我把那五分鐘拆成實際畫面帶你走一遍，含我踩過的三個坑，照做就能通。

### CH2 手動上傳之痛（議題＋實證）｜概念錨：重複操作＝純體力活
- 2-1 先講為什麼值得。手動上傳一支影片，你要開 YouTube Studio、拖檔案、等進度條、填標題、貼描述、打標籤、設隱私，一路按三次下一步。
- 2-2 一支片十分鐘就這樣沒了；一週三支，一個月就是兩小時的純體力活。
- 2-3 而且重複操作最容易出錯，貼錯描述、忘了設隱私，網路上滿是這種哀嚎。
- 2-4 （泡泡牆：真實逐字抱怨，ID 部分遮蔽——手動上傳煩／API 設定卡關／Access blocked 求救，建置時抓 Stack Overflow、GitHub、Reddit 逐字）
- 2-5 YouTube 其實留了正門，官方的 YouTube Data API v3，讓程式直接把影片送進你的頻道。
- 2-6 但大多數人在門口就放棄了，因為進門要先過 Google Cloud 憑證設定，OAuth、同意畫面、用戶端 ID，一堆陌生名詞。
- 2-7 這條設定路，Claude 帶著我走過一次，全程截圖存證，這支片你照著走就好。

### CH3 產線全景（地圖）｜概念錨：一次性設定 vs 每次全自動
- 3-1 先看全景，整條自動上片產線分成兩段。
- 3-2 左邊是一次性設定：建 Google Cloud 專案、開 API、設 OAuth 同意畫面、拿憑證檔，人只動手這一次，大約五分鐘。
- 3-3 右邊是每次全自動：Claude 寫好標題描述檔，執行上傳腳本，API 收件，連結回報。
- 3-4 兩段中間的橋樑，是兩個小檔案。
- 3-5 client_secrets.json 是你程式的身分證，token 是通行證。
- 3-6 身分證辦一次，通行證第一次授權後自動保存，之後每次上傳，Claude 拿著通行證直接進門。

### CH4 建立 Google Cloud 專案｜概念錨：專案＝API 的家
> 畫面註記：本章開頭字幕帶小字「Google Cloud 介面可能微調，認名稱、不認位置」（老闆拍板 2026-07-03）。
- 4-1 開工。打開 Google Cloud Console，用你 YouTube 頻道的那個 Google 帳號登入。
- 4-2 上方專案選單，新增專案，名字隨意，我取 youtube-uploader。
- 4-3 建立，然後記得切換到這個新專案。
- 4-4 專案就是一個容器，等下開的 API、發的憑證，全都掛在它下面。

### CH5 啟用 YouTube Data API v3｜概念錨：啟用＝申請能力
- 5-1 第二步，最上面的搜尋列，輸入 YouTube Data API v3，點進去。
- 5-2 按下藍色的啟用。
- 5-3 這一步是在告訴 Google：我這個專案，要用上傳影片這個能力。
- 5-4 到這裡都只是點按鈕，還沒有坑，坑從下一章開始。

### CH6 OAuth 同意畫面｜概念錨：同意畫面＝授權時的門面
- 6-1 第三步，左側選單，API 和服務，OAuth 同意畫面。
- 6-2 User Type 選外部，External，建立。
- 6-3 接著填三個欄位：App 名稱隨意取，使用者支援信箱、開發人員聯絡信箱，都填你自己的 email，一路儲存。
- 6-4 這個畫面，就是等下授權跳出來時，你會看到的那個應用程式的門面。
- 6-5 五分鐘後你會再見到它一次，帶著一個嚇人的警告，先賣個關子。

### CH7 測試使用者（頭號坑）｜概念錨：測試使用者＝白名單
- 7-1 現在，畫面停一下，這是全片最重要的一步。
- 7-2 在目標對象，Audience，找到測試使用者，Test users，按 ADD USERS。
- 7-3 把你等一下要登入授權的那個帳號信箱加進去，儲存。
- 7-4 沒加的話，授權時 Google 會直接把你擋在門外，畫面寫著：存取遭封鎖，Access blocked。
- 7-5 這不是你做錯什麼，是 Google 對測試階段應用的保護機制，只有白名單裡的帳號能用。
- 7-6 但錯誤訊息完全不會告訴你要回來加這一步，所以 Stack Overflow 上一堆人卡死在這。
- 7-7 當時實錄裡，Claude 前後提醒了我兩次別跳過，就是因為這一步的翻車率最高。
- 7-8 記住一個原則：等下用哪個帳號按允許，哪個帳號就要在白名單裡。
- 7-9 萬一你已經撞上 Access blocked，也不用重來，回到同意畫面補加測試使用者，再跑一次授權就過了。

### CH8 憑證檔 client_secrets.json（坑二）｜概念錨：client_secrets.json＝身分證
- 8-1 第四步，發身分證。左側憑證，Credentials，建立憑證，OAuth 用戶端 ID。
- 8-2 應用程式類型，選桌面應用程式，Desktop app，因為上傳腳本是在你自己的電腦上跑的。
- 8-3 建立之後跳出視窗，下載 JSON。
- 8-4 第二個坑來了：下載下來的檔名，是 client_secret 加一長串亂碼。
- 8-5 腳本認的名字是 client_secrets.json，要改名，再放進上傳腳本的資料夾。
- 8-6 實錄裡我根本沒注意到這件事，是 Claude 檢查環境時自己發現、自己改好的。
- 8-7 它還順手驗證了憑證內容，桌面應用類型，有效，才往下走。
- 8-8 這就是我讓 Claude 帶路的原因，它不只給步驟，還會自己收拾我漏掉的細節。
- 8-9 最後提醒一句：client_secrets.json 跟等下產生的 token，等於你頻道的鑰匙，不要放進公開的程式碼庫，也不要傳給任何人。

### CH9 裝套件（坑三）｜概念錨：環境差異，Claude 自動繞
- 9-1 第五步，裝 Google API 的 Python 套件。
- 9-2 第三個坑在這裡：環境差異。Claude 第一次的安裝指令帶了一個新參數，我電腦的 pip 是老版本二十一點二點四，根本不認得。
- 9-3 它的處理方式我很欣賞：不叫我先去升級 pip，直接把那個新參數拿掉，換成老版本也認得的指令，一次裝成。（畫面顯示真指令：pip3 install google-auth google-auth-oauthlib google-api-python-client）
- 9-4 畫面跳了一堆 warning，它也先講清楚，那只是 Python 三點九的老版本提示，不影響。
- 9-5 套件裝好、憑證就位、網路暢通，三個勾打完。
- 9-6 一次性設定的人工部分到此結束，接下來是見證的時刻。

### CH10 首次授權實錄｜概念錨：未驗證警告＝正常
- 10-1 Claude 啟動上傳腳本，瀏覽器自動彈出 Google 登入頁，這是第一次、也是唯一一次授權。
- 10-2 用你要上傳的那個帳號登入，然後你會看到一個嚇人的畫面：Google 尚未驗證這個應用程式。
- 10-3 別慌，這完全正常，這個應用是你自己五分鐘前建立的，Google 當然沒驗證過。
- 10-4 點左下的進階，再點繼續前往。
- 10-5 注意，不要點那顆醒目的返回安全網頁，那會取消整個流程。
- 10-6 下一頁，把 YouTube 的權限全部勾選，繼續，允許。
- 10-7 看到「驗證流程已完成，可關閉視窗」，授權成功，localhost 分頁直接關掉。
- 10-8 此刻 token 已經自動存進資料夾，日常上傳不用再跑這套流程；萬一哪天 token 失效，重跑一次授權就好，三十秒的事。

### CH11 上傳自動跑＋成果｜概念錨：token＝上傳通行證
- 11-1 你在授權的同時，上傳其實早就排好隊了，授權一過，自動開跑。
- 11-2 三十 MB 的影片，三十到六十秒跑完，完成的瞬間，Claude 把 YouTube 連結回報給我。
- 11-3 我點開，影片已經公開上線，標題、畫質、時長，全部正確。
- 11-4 剛上傳的片，高畫質要等平台轉檔幾分鐘，這是正常的，不是壞掉。
- 11-5 從此每一支影片的上傳流程，變成一句話：Claude，上傳。

### CH12 之後的日常｜概念錨：描述檔＝上片說明書
- 12-1 講講之後的日常長什麼樣。
- 12-2 每支影片算繪完，Claude 會先寫一個描述檔：標題、描述、標籤、隱私設定，全部先寫成檔案給我過目。
- 12-3 標題描述照搜尋引擎跟 AI 答案引擎的胃口寫，問題開頭、具體數字、加章節時間戳。
- 12-4 我看一眼點頭，它一句指令送出，影片先設不公開，我檢查完再轉公開，這是我留給自己的最後一道把關。
- 12-5 縮圖、播放清單，同一套 API 全部能自動掛上。
- 12-5b 配額也講清楚：二〇二五年十二月起，上傳有自己的獨立額度，預設一天一百支，其他操作共用每天一萬點，一般創作者根本用不完。
- 12-6 所有設定都存成檔案的好處是：頁面上的東西會消失，檔案裡的永遠能重來，這跟小紅書那條產線是同一個中心思想。

### CH13 複盤＋CTA
- 13-1 最後複盤這條五分鐘的路：建專案、開 API、同意畫面、加測試使用者、桌面憑證改名放好、裝套件、授權一次。
- 13-2 三個坑再讀一次：Access blocked 就回去補測試使用者白名單、憑證檔要改名成 client_secrets.json、老 pip 拿掉新參數就裝得動。
- 13-3 這套憑證流程不只 YouTube，Google 全家的 API，日曆、雲端硬碟、試算表，全是同一套路，學一次用到處。
- 13-4 至此整條影片產線全部程式化：寫程式、配音、算繪、上傳，這是我的全自動影片工廠的最後一塊拼圖。
- 13-5 如果這支影片幫你省下五分鐘的摸索，訂閱、按讚、分享給也在做影片的朋友。

---

## 每章畫面規劃（截圖以 Doc 實際圖為準，拿到 docx 後對號入座）

| 章 | 畫面主體 | 來源 |
|---|---|---|
| CH1 | 黑曜石開場卡（封面同款 0:00 亮相）→ 終端「上傳」指令 + 連結回報重演 | 程式重演 |
| CH2 | YouTube Studio 手動流程快剪 + 泡泡牆（真實逐字抱怨） | 程式重演＋建置時抓實證 |
| CH3 | 產線全景圖（左：一次性設定｜右：每次全自動｜中：兩個檔案） | 程式繪製 |
| CH4 | Cloud Console 新增專案 | **Doc 截圖** |
| CH5 | YouTube Data API v3 啟用頁 | **Doc 截圖** |
| CH6 | OAuth 同意畫面設定頁 | **Doc 截圖** |
| CH7 | Test users 加人畫面＋Access blocked 示意＋補救路徑（回同意畫面→補加→重跑授權） | **Doc 截圖**＋程式重演 |
| CH8 | 建立 OAuth 用戶端 ID／下載 JSON 視窗／改名前後檔名對比／安全提醒卡（鑰匙 🔑 勿進 git） | **Doc 截圖**＋程式重演 |
| CH9 | 終端 pip 錯誤 → 相容裝法成功（實錄重演） | 程式重演 |
| CH10 | 「Google 尚未驗證」頁（進階→繼續前往 高亮）／權限勾選／驗證完成頁 | **Doc 截圖** |
| CH11 | 上傳進度 → YouTube watch 頁成果 | **Doc 截圖** |
| CH12 | 描述檔（YAML 風）→ 一句指令 → unlisted→public 開關 | 程式重演 |
| CH13 | 複盤清單卡 + 三坑卡 + Outro（訂閱/按讚/分享） | 程式繪製 |

遮蔽規則：所有截圖上的 email（finalaaaa@gmail.com）與 OAuth client ID 一律加遮罩後再進片。

---

## 上片資料（GEO，發佈時定稿）

**描述區第一區塊＝完整 Master Prompt（逐字，鼓勵複製）**：貼上面「完整 Master Prompt」整段，開頭加一行「🎁 想自己做一套？整段複製貼給 Claude 就能從零建好：」。之後才接標題 FAQ。

**標題草案**（問題→解法＋具體數字）：
- A：5 分鐘設定，YouTube 影片全自動上傳｜YouTube Data API + OAuth 保姆級實錄（3 大坑全解）
- B：別再手動上傳 YouTube！一句指令自動上片：Google API 憑證設定完整教學（Access blocked 有解）

**描述區 FAQ（三坑問答，每題有答案、對應片內畫面章節，時間戳算繪後填）**：

> ❓ 授權時出現「存取遭封鎖 / Access blocked」怎麼解？
> ✅ 你的帳號不在測試使用者白名單。回 Google Cloud Console → API 和服務 → OAuth 同意畫面 → 目標對象(Audience) → Test users → + ADD USERS，加入你要授權的帳號信箱並儲存，重跑一次授權即可。完整畫面在片內 CH7（[時間戳]）。
>
> ❓ client_secrets.json 是什麼？要放在哪裡？
> ✅ 它是建立「桌面應用程式」OAuth 用戶端後下載的 JSON 憑證，是程式的身分證。下載時檔名帶一長串亂碼，必須改名成 client_secrets.json，放到上傳腳本同一個資料夾。示範在片內 CH8（[時間戳]）。
>
> ❓ pip 安裝跳「no such option: --break-system-packages」怎麼辦？
> ✅ 你的 pip 版本較舊（如 21.x）不認得這個新參數。把該參數拿掉直接裝即可：`pip3 install google-auth google-auth-oauthlib google-api-python-client`。實錄在片內 CH9（[時間戳]）。

**配額事實（片內 12-5b 引用，2026-07-03 官方文件查核）**：videos.insert 自 2025-12 起獨立配額桶，預設 100 支/天；其他端點共用 10,000 units/天；額度與 YouTube Premium 帳號等級無關，綁 Google Cloud 專案，加額需通過 Google 稽核申請。

---

## 每步「要對 Claude 說的 Prompt」（v3 新增·逐字可複製；已對照 yt_upload.py 驗證）

> 本片核心：觀眾的動作不是自己寫 code，而是**每一步跟 Claude 說一句話**。每個動作章節畫面出現 💬 prompt 方塊（可暫停複製）、旁白同步唸出。
> ✅ 技術 GATE：下列每個端點/權限/參數/套件都對到 `~/Documents/Claude/Projects/Video to Youtube/yt_upload.py`（實際在跑、已上傳過多支）。

| 章 | 對 Claude 說（逐字） |
|---|---|
| 開場總 prompt (CH1) | `Hi Claude，我想用 YouTube 官方 Data API v3，做到之後每支影片一句話就自動上傳到我的頻道，不靠付費工具。請一步步帶我做：先完成一次性的 Google Cloud 憑證設定（我去 Console 點、你告訴我點哪裡），再幫我寫上傳腳本，會卡的地方先提醒我。` |
| CH4 建專案 | `Claude，教我在 Google Cloud Console 建一個新專案叫 youtube-uploader，建好怎麼切換過去，一步步說。` |
| CH5 啟用 API | `Claude，教我在這個專案啟用 YouTube Data API v3，搜尋列打什麼、按哪個鈕。` |
| CH6 同意畫面 | `Claude，教我設定 OAuth 同意畫面：User Type 選外部，App 名稱和支援信箱怎麼填。` |
| CH7 測試使用者 | `Claude，教我把要授權的 Google 帳號加進「測試使用者」白名單、在哪裡加；順便解釋為什麼不加會被 Access blocked 擋。` |
| CH8 憑證 | `Claude，教我建立「桌面應用程式」的 OAuth 用戶端 ID 並下載 JSON；下載後幫我改名成 client_secrets.json、放到上傳腳本資料夾。` |
| CH9 裝套件 | `Claude，幫我裝 YouTube 上傳要的 Python 套件 google-auth、google-auth-oauthlib、google-api-python-client；pip 太舊不認得參數就換相容方式裝。` |
| CH10 授權+腳本 | `Claude，幫我寫上傳腳本：用 client_secrets.json 走 OAuth 桌面流程授權（scope 要 youtube.upload），Token 存起來下次免再授權，然後跑起來讓瀏覽器跳授權頁我來登入。` |
| CH12 日常上傳 | `Claude，把 out 資料夾最新的成片上傳到 YouTube，標題描述用我這個檔，先設不公開，完成後把連結給我。` |

📌 視覺規範：💬 方塊＝終端機面板高亮行，停留夠久可暫停複製；旁白同步唸「你只要跟 Claude 說：…」。

---

## 完整 Master Prompt（片尾「看到最後的禮物」·逐字·已對照 yt_upload.py 驗證）

> 片尾 CH14 場景把這段打在畫面（可暫停複製）；**逐字完整版放 YouTube 描述最上方**，鼓勵看到最後的人整段複製、一次貼給 Claude 就能從零建好整套。
> ✅ 驗證：端點 `youtube.videos().insert`(part=snippet,status)、scope `youtube.upload`、`InstalledAppFlow`+`run_local_server`、Token `.yt_token.json`(過期自動 refresh)、`MediaFileUpload`(chunk+resumable)、`thumbnails().set`、配額 100/天，全對到實際程式。

```
Hi Claude，我想在我自己的電腦上，做到之後每一支影片都用一句話就自動上傳到我的 YouTube 頻道，
全部走 YouTube 官方 Data API v3、OAuth 2.0，不靠任何付費第三方工具。
請一步一步帶我完成；過程中需要我去 Google Cloud Console 或 Google 帳號頁點什麼，也請明確告訴我點哪裡。
你需要的頻道 Google 帳號、影片檔路徑、標題描述，請直接問我。需求如下：

1) 前置：教我到 console.cloud.google.com 建一個新專案，
   然後在「API 和服務」啟用 YouTube Data API v3。

2) OAuth 同意畫面：教我把 User Type 設成「外部」、填好 App 名稱和支援信箱，
   並且一定要把我要授權的那個 Google 帳號加進「測試使用者」白名單
   （不加的話授權會被 Access blocked 擋下來）。

3) 憑證：教我建立「桌面應用程式（Desktop app）」類型的 OAuth 用戶端 ID、下載 JSON，
   幫我把它改名成 client_secrets.json、放到上傳腳本的同一個資料夾。

4) 裝套件：幫我裝 google-auth、google-auth-oauthlib、google-api-python-client；
   如果我的 pip 太舊、不認得某個新參數，就把那個參數拿掉、換相容方式裝。

5) 寫上傳程式（Python）：
   - 用 InstalledAppFlow 讀 client_secrets.json 走 OAuth 桌面流程（run_local_server），
     scope 要 youtube.upload；第一次授權後把 Token 存成 .yt_token.json，之後自動沿用、過期自動 refresh；
   - 用 youtube.videos().insert 上傳，part 帶 snippet 和 status；
     snippet 放 title、description、tags、categoryId；status 放 privacyStatus；
   - 檔案用 MediaFileUpload 分塊、resumable=True 上傳；上傳完印出影片網址。

6) 每次上傳一句話：讓我可以只說「把某個資料夾最新的成片上傳，標題描述用某個檔，先設不公開」，
   你就讀檔、填好、上傳、把 YouTube 連結回報給我。

7) 維運：privacy 一律先設 unlisted（不公開），我檢查完再由我轉公開；
   縮圖用 youtube.thumbnails().set 一起掛上。

安全要求：client_secrets.json 和 .yt_token.json 當成密碼處理，不要進 git、不要外流、不要出現在螢幕截圖裡；
只申請必要的 youtube.upload 權限；並提醒我上傳配額（2025 年 12 月起 videos.insert 獨立額度，預設一天 100 支）。
```

---

**章節時間戳**（v3 算繪版，11:56，含每步 Claude prompt＋片尾禮物）：
```
0:00 一句指令上線（Hook）
0:42 手動上傳有多煩＋真實哀嚎
1:43 產線全景：一次性設定 vs 每次全自動
2:37 步驟① 建 Google Cloud 專案
3:10 步驟② 啟用 YouTube Data API v3
3:37 步驟③ OAuth 同意畫面
4:18 頭號坑：測試使用者白名單（Access blocked 解法）
5:31 步驟④ 憑證檔 client_secrets.json（坑二：改名）
6:46 步驟⑤ 裝套件（坑三：老 pip 參數）
7:43 首次授權實錄（「未驗證」警告怎麼過）
8:51 上傳自動跑＋成果驗證
9:28 之後的日常：描述檔＋配額新制
10:39 🎁 片尾禮物：完整 Master Prompt（暫停複製）
10:59 複盤＋三坑速查
```
片內 FAQ 對應：Access blocked→4:18、client_secrets.json→5:31、pip 參數→6:46。
每步 💬 prompt 卡在各章開頭閃現（2:37 建專案起）；片尾 10:39 禮物場景整段可複製。

---

## 製作決策記錄

- 2026-07-03 老闆拍板：實戰自動化 EP02、黑曜石 v3、完整教學 9–12 分、遮蔽 email＋client ID。
- 10-8 不講「這輩子只授權一次」（實證：`.yt_token.json.revoked.bak` 顯示 6/17 曾重授權過）。
- 舊短版 `youtube-auto-upload/`（6/4，2 分鐘）**不發布**；EP02 完成後從 CH1＋CH11 剪 9:16 Shorts 引流。
- 坑三真指令出處：`~/Documents/Claude/Projects/Video to Youtube/_install_deps.command`（pip3 install google-auth google-auth-oauthlib google-api-python-client --break-system-packages；老 pip 解法＝拿掉尾參數）。
- 截圖來源：Doc docx 匯出（待老闆手動下載到 ~/Downloads）。
