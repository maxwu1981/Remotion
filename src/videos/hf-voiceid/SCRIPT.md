# 生活應用 EP09 — Hugging Face 入門：讓 AI 聽出「誰在說話」

**狀態**：✅ v4（名詞四框終版）已算繪＋QA 全過（2026-07-10）⛔ 未上傳，等老闆說「發」
**成品**：`out/hf-voiceid/hf-voiceid-v4.mp4`（432.96s，46MB，PNG+CRF15）
**v3 改版**：老闆 20 題拍板「混合制」——實操三景（註冊/條款/token）＋名詞段側圖改用 8 張真截圖（PIL 遮蔽：token 馬賽克/分頁列模糊/Claude 側欄模糊），正紅 #FF3B30 紅框畫框動畫＋聚光壓暗＋關鍵欄位放大鏡，紅框隨旁白句移動；旁白/VO/時長不變。
**v4 改版**：老闆退名詞終端卡（「四個詞」對不上①②③行號）→ 名詞小教室兩景改「四詞四框」GlossaryScene（pipeline 節點卡同款、講到哪個詞哪框亮、gl11 全亮總結；側圖實據保留）。v4 QA：實操/側卡/標點窗口幀差全 1–2；四框三窗口 mp4 值 ≤24 經 lossless 全=0＝調暗細字 QP 假警報。v1/v2 已刪，v3 暫留對照。
**QA 紀錄**：v1 抓到場景10「」，」全形標點競態（lossless 相鄰幀 YMAX=161、逐幀半字寬跳）→ 根節點補 `textSpacingTrim:"space-all"`（同 EP08 修法）→ v2 lossless=0、mp4 三窗口幀差全歸 1；t=110 恆定 YMAX≈41 經 lossless 對照=0＋放大無空間結構＝細字 QP 假警報。封面 0:00 亮相/前3秒鉤子/結尾 CTA/字幕同步/BGM 全過。
**系列**：生活應用 EP09（registry 已 reserve）
**片型**：黑曜石 Explainer（同 EP04–08）＋名詞小教室＋實操 demo
**片名（草案）**：我讓 AI 聽出會議裡「誰在說話」：Hugging Face 從註冊到實測完整教學（免費 pyannote 模型）｜生活應用 EP09

**素材依據**：`~/Pictures/Hugging Face/` 11 張真實截圖（畫面依真實 UI 黑曜石重建，不放真截圖）＋ `~/Documents/Claude/VoiceID/` 實跑管線（diarize.py / enroll.py / identify.py）。
**用詞紀律**：demo 用示範音檔；片中人名全用化名；不出現真實 token。

---

## 0:00 封面卡（0–2 秒，烘進片頭）

大標：**AI 聽得出「誰」在說話**
副標：Hugging Face 完整入門｜註冊 → 授權 → 實測
徽章：生活應用 EP09 ｜ BRAND_MARK

---

## CH1 鉤子（故事弧：誰遇到＋影響）

1. 上禮拜我開了一場 41 分鐘的視訊會議，裡面有 9 個人輪流發言。
2. 會後要整理會議記錄，我把音檔重播了三遍，還是分不清哪一句到底是誰講的。
3. 後來我讓 AI 來聽——它把 41 分鐘拆成 700 段發言，每一段都標好是誰說的，連名字都對得出來。
4. 用的工具完全免費，來自一個你一定聽過、但可能沒真的用過的網站——Hugging Face。
5. 這支影片帶你從註冊、同意授權、到實際跑出結果，照著做就會，不用寫半行程式。

## CH2 名詞小教室（4 個詞，白話三層講解）

6. 動手之前，先花九十秒搞懂四個詞，等一下每一步你都知道自己在做什麼。
7. 第一個詞，Hugging Face。你可以把它想成「AI 模型界的 App Store」。
8. 全世界的研究團隊把訓練好的 AI 模型上架到這裡，超過一百萬個，大部分免費。
9. 差別在於：App Store 下載的是 App，這裡下載的是「已經學會某個技能的 AI 大腦」。
10. 第二個詞，模型。模型就是那顆訓練完成的大腦。
11. 今天要用的 pyannote，就是一顆專門「聽聲音、分辨說話人」的大腦——光上個月就被全球下載超過 800 萬次。
12. 第三個詞，gated model，門控模型。有些模型像「要登記才能進場的展覽」。
13. 作者要求你留下基本資料、同意使用條款，才開放下載。等一下註冊完就會遇到，不用怕，就是填兩個欄位。
14. 第四個詞，Access Token。Token 就像你的「借書證」。
15. 程式要從 Hugging Face 下載模型時，出示這張證，網站才知道你是誰、你同意過條款。
16. 好，四個詞講完：去 App Store（Hugging Face）、借一顆會認聲音的大腦（模型）、簽個名進場（gated）、辦張借書證（token）。開工。

## CH3 為什麼一般工具解不掉（故事弧：大家為何卡住）

17. 你可能會問：語音轉文字的工具滿街都是，為什麼還要這麼麻煩？
18. 因為多數工具只給你「一大坨文字」——誰講的、什麼時候講的，全部糊在一起。
19. 「分辨說話人」在行話裡叫 speaker diarization，公認最能打的開源模型 pyannote，就放在 Hugging Face 上。
20. 很多人卡在門口：滿版英文、又要同意條款、又要 token，看起來很工程師。
21. 其實整套流程五分鐘搞定，而且有 Claude 帶路，你連英文都不用自己讀。

## CH4 實操第一步：註冊帳號（畫面：join 頁黑曜石重建）

22. 打開 huggingface點co 斜線 join，填 email 和密碼，按 Next。
23. 到信箱點驗證信，帳號就開好了，完全免費，不用綁信用卡。
24. 💬 你也可以直接對 Claude 說：「幫我開 Hugging Face 的註冊頁，一步一步教我完成註冊。」

## CH5 實操第二步：同意 gated 條款（畫面：pyannote 模型頁重建）

25. 搜尋 pyannote 斜線 speaker-diarization-3.1，會看到一個提示：「你需要同意分享聯絡資訊才能使用這個模型」。
26. 往下捲，填兩個必填欄位——公司或學校、網站。個人使用的話，網站填你的部落格或 email 都可以。
27. 按下「Agree and access repository」，畫面出現「You have been granted access」，第一顆模型到手。
28. 注意，pyannote 其實是兩顆模型搭著用的——另一顆叫 segmentation-3.0，同樣的條款要再同意一次，別漏了。
29. 💬 對 Claude 說：「帶我完成 pyannote/speaker-diarization-3.1 和 segmentation-3.0 兩個模型的條款同意。」（同意條款這種要本人確認的動作，Claude 會停下來讓你自己按。）

## CH6 實操第三步：建 Access Token（畫面：Settings→Access Tokens 重建）

30. 右上角頭像進 Settings，左邊選 Access Tokens，按「Create new token」。
31. 權限選 Read 就夠——我們只是要「讀取」模型，給越少權限越安全。
32. Token 只會顯示這一次，先複製收好；弄丟了就重建一顆，不用緊張。
33. 一個安全提醒：這串 token 等於你的借書證，不要貼給別人、不要拍進截圖。我第一次就差點把它拍進畫面。
34. 💬 對 Claude 說：「教我在 Hugging Face 建一個 Read 權限的 Access Token，並告訴我要收在哪裡。」

## CH7 實測：跑給你看（畫面：終端輸出＋結果卡重建；示範音檔）

35. 接下來就是見證的時刻。我請 Claude 寫了一支小程式，把音檔丟進 pyannote。
36. 這裡用一段三個人的示範對話來跑給你看。
37. 跑完的輸出長這樣：從第幾秒到第幾秒、是幾號說話人，一段一段全部列出來。
38. 提醒一下速度：在我這台 8GB 記憶體的老 Mac 上，41 分鐘的音檔大約要跑 40 分鐘——丟給它跑，你去做別的事就好。
39. 但這時候它只認得「幾號說話人」，還不知道名字。重頭戲在下一步。
40. 我多做了一件大部分教學不會教的事：聲紋註冊。
41. 每個人取兩小段他自己說話的聲音，存成一張「聲紋卡」——就像幫每個聲音辦身分證。
42. 之後程式一比對，SPEAKER_03 自動變成「小美」、SPEAKER_07 變成「阿明」。
43. 最後合併起來，就是一份帶名字、帶時間戳的會議全文：幾分幾秒、誰、說了什麼，一行一行清清楚楚。
44. 💬 對 Claude 說：「用我的 Hugging Face token，幫我用 pyannote 分析這個音檔，列出每一段是誰在說話；再幫我做聲紋註冊，把編號換成真名。」

## CH8 差異化＋證明（故事弧：哪裡不同＋可量測 before/after）

45. 整理一下這套跟別人哪裡不一樣。
46. 一般教學做到「說話人A、說話人B」就停了；加上聲紋註冊，輸出直接是名字，會議記錄拿到手不用再猜。
47. Before：41 分鐘音檔重播三遍，還原不出誰說了什麼。After：一句指令，700 段發言自動標好名字。
48. 成本是零元——模型免費、MIT 授權，你付出的只有註冊那五分鐘。

## CH9 Outro（CTA）

49. Hugging Face 上還有一百多萬顆模型：會看圖的、會翻譯的、會生音樂的，這支影片只是幫你把門推開。
50. 完整的操作 prompt 我逐字放在影片描述欄，複製貼給 Claude 就能開跑。
51. 如果這支影片有幫到你，訂閱、按讚、分享給那個每次都要整理會議記錄的同事。我們下支影片見。

---

## 片尾 master prompt（禮物卡＋描述欄逐字附）

「我要用 Hugging Face 的 pyannote 模型分析多人對話音檔。請帶我：1. 註冊 Hugging Face 帳號；2. 同意 pyannote/speaker-diarization-3.1 和 pyannote/segmentation-3.0 的使用條款；3. 建立 Read 權限的 Access Token；4. 在我電腦安裝 pyannote.audio 並寫一支程式，輸入音檔、輸出每段發言的起訖時間與說話人；5. 幫每位說話人做聲紋註冊，把編號自動換成真名，最後輸出帶時間戳的全文。」

## 製作備忘（不進片）

- 示範音檔（2026-07-10 已實跑 ✅）：edge-tts 三聲合成 59.3s 九段對話 → `~/Documents/Claude/VoiceID/samples/hf-ep09-demo.wav`；diarize 50s 出 13 segments（3 speakers 全對）→ `hf_ep09_demo_diarization.json`；聲紋註冊＋identify 全中（小美0.84/阿明0.99/大衛1.00，demo 聲紋放 scratchpad 未混入真 enrollment）。spec 場景 08/09 終端輸出＝此次真實數值。
- BGM（2026-07-10 已生成 ✅）：Gemini Lyria 3「Open Window Desk」102s → `public/bgm-hf-voiceid.mp3`，`HAS_BGM=true`；待老闆試聽定版。
- 真實數字來源：41 分鐘會議＝lr_poc_0706.wav（79MB）；700 segments＝diarization.json；跑 2376s；下載量 8,354,654/月＝模型頁截圖。
- 防抖：黑曜石卡風 → `--image-format=png --crf=15`；render 前查負載。
- BGM：Gemini Lyria 新生一首鋼琴水晶，`bgm-hf-voiceid.mp3`。
- 片中化名：小美、阿明、大衛。真名（enrollment 資料夾）絕不入鏡。
