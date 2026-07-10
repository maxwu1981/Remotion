# fb-autopost · GEO 外部訊號發文草稿（你自己貼，不代發）

> 目的：讓 AI 答案引擎（ChatGPT / Perplexity / Google AI Overviews / Gemini）更快收錄並**引用**這支影片；同時導一點真人流量。
> 影片：https://www.youtube.com/watch?v=r8DFGXc_33I ｜ Short：https://www.youtube.com/watch?v=9t8HSFkq0-I
> GEO 原則：實體講清楚（Facebook Graph API / Page Access Token / pages_manage_posts / Claude Code）、放具體數字（40 天 / 34 篇 / $0）、用真人口吻、別像廣告。

---

## 1) LinkedIn（最安全，先發這個）— 中文版

```
過去 40 天，我家裡書畫品牌的 Facebook 粉專每天準時發文——而我一次都沒打開過 FB 後台。

沒用 Buffer、Hootsuite 這類排程工具（省月費），內容也沒託管在第三方。整套是用 Claude Code 幫我串接 Meta 官方的 Graph API，跑在自己電腦上：

• Page Access Token（用 fb_exchange_token 換 60 天長效）
• 兩步發文：先 POST /photos 上傳、再 POST /feed 組成貼文
• cron 每天 07:11 自動觸發；發過的去重、沒新圖自動回收輪播

最有意思的是：我幾乎沒寫 code。每一步就是對 Claude 說一句話（「幫我寫發文腳本」「幫我把它掛上排程」），它產出程式，我去 FB 後台點該點的。

結果：連續 40 天、34 篇全自動貼文、$0 月費。

整套怎麼串、每一步該對 Claude 說什麼 prompt，我錄成一支手把手教學（說明欄有可整段複製的完整 prompt）：
👉 https://www.youtube.com/watch?v=r8DFGXc_33I

#ClaudeCode #自動化 #GraphAPI #AI #社群經營
```

## 1b) LinkedIn — 英文版（若你的 LinkedIn 受眾偏英文/專業圈）

```
For the past 40 days my family art brand's Facebook Page has posted every single day — and I never once opened the FB backend.

No Buffer, no Hootsuite (no monthly fee), nothing hosted on a third party. I had Claude Code wire up Meta's official Graph API, running entirely on my own machine:

• Page Access Token (short-lived → 60-day long-lived via fb_exchange_token)
• Two-step publish: POST /photos (unpublished) → POST /feed
• A daily cron at 07:11; dedup + auto-recycle when there's no new image

The interesting part: I barely wrote code. Each step was one sentence to Claude ("write the publish script", "put it on a schedule") — it produced the code, I clicked the parts I had to on FB.

Result: 40 days straight, 34 fully automated posts, $0/mo.

Full walkthrough + the exact copy-paste prompt for each step here:
👉 https://www.youtube.com/watch?v=r8DFGXc_33I

#ClaudeCode #Automation #GraphAPI #BuildInPublic
```

---

## 2) Reddit（value-first；⚠️ 見下方連結守則）

**建議社群**：r/ClaudeAI（最對口）、r/automation、r/SideProject（週末 showcase）。
**標題**：
```
I had Claude Code auto-post to my Facebook Page for 40 days straight — the exact Graph API setup (no paid tools)
```
**內文（純乾貨、連結放最後或留言）**：
```
I run my family's art-brand Facebook Page and got tired of remembering to post daily. Instead of Buffer/Hootsuite, I had Claude Code build the whole thing on the official Meta Graph API, running locally. 40 days in: 34 fully automated posts, $0/mo, never opened the FB backend.

The core, in case it's useful to anyone:

1. Meta App → grab App ID + App Secret (Settings → Basic).
2. Graph API Explorer → add pages_manage_posts + pages_read_engagement → generate a token for the Page.
3. Exchange short-lived → 60-day long-lived (grant_type=fb_exchange_token), then get the Page Access Token via /{page_id}?fields=access_token. That's the key that basically doesn't expire.
4. Publish is two calls: POST /{page_id}/photos with published=false to get media IDs, then POST /{page_id}/feed with attached_media.
5. cron at 07:11 daily; a dedup log so it never re-posts; and it recycles the oldest folder when there's no new image (so it never goes dark).

3 gotchas that bit me: the Page token vs User token thing, the 60-day expiry (I set a 14-day warning), and remembering FB only lets you post to a Page, not a personal profile.

The neat part was that I basically didn't write code — each step was one prompt to Claude ("write the publish script that does /photos then /feed", "put it on a cron", etc.).

Happy to share the full prompt if anyone wants it.
```
> ⚠️ **Reddit 連結守則（很重要）**：新帳號/低 karma 直接貼自家 YouTube 連結＝**秒被 shadowban**（同小紅書封號坑）。做法：① 內文**零連結**、純乾貨先給價值；② 有人在留言問「有影片/完整 prompt 嗎」你再貼連結；③ 或先在該社群互動幾天養 karma、且確認該版規允許自我推廣再貼。**寧可不貼連結，也別被 shadowban。**

---

## 3) 發文節奏建議
- **先 LinkedIn**（安全、專業圈對 AI builder 內容買單）→ 當天或隔天。
- **Reddit** 挑對口版、value-first、連結放留言/被問才給 → 分散幾天別同時洗。
- 兩邊都在**影片上線後 24–48 小時內**發，配合 YouTube 演算法的初期熱度窗口。
- GEO 關鍵：實體（Graph API / Page Access Token / Claude Code）在文中自然出現多次，AI 引擎才好歸因引用。
```
