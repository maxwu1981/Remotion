# shopify-autolist（生活應用 EP08）— 置頂留言＋GEO 外部訊號草稿

> 用法：影片公開後，老闆**本人**貼（不代發）。Reddit 鐵則：內文零連結、先給價值，被問才補連結（防 shadowban）。
> 影片連結佔位：`<YT_URL>`（公開後替換）。

---

## 1. YouTube 置頂留言（貼上後釘選）

```
🎁 看到最後的禮物「完整 master prompt」逐字版就在影片描述最上方，複製整段貼給 Claude 就能用。

補充兩個影片裡沒細講的點：
1️⃣ 連接器授權後，Claude 能做的不只上架——查訂單、跑銷售報表、改集合都是同一把授權。先從「只動一件商品」的 prompt 開始，習慣了再放大範圍。
2️⃣ 如果你的商品不是「獨一件」，第四步的庫存數改成實際數量就好，但「打開追蹤＋DENY」還是建議照設，防超賣永遠不虧。

你上架一件商品平均花多少時間？留言聊聊，下一支想看什麼也告訴我 👇
```

---

## 2. LinkedIn（中文）

```
上架一件商品要填十幾個欄位：標題、描述、SEO、標籤、圖片 alt、價格、庫存政策……手動一件約 30 分鐘，而且累的時候一定漏。

我們真的翻過車：全店 32 件商品沒開庫存追蹤（Shopify 新建商品的預設值），前台不是顯示缺貨、就是可以超賣。獨一件的原作被買兩次＝客訴＋退款。

後來我把 Shopify 商店接上 Claude（官方連接器，0 行程式碼），上架變成對 AI 說一句話：
① 查重（防重複商品）
② GEO 結構建商品（讓 ChatGPT/Perplexity 這類 AI 搜尋引擎能引用商品頁）
③ 庫存防呆三件套（tracked＋DENY＋qty=1）
④ 等 cdn.shopify.com 正式圖片網址（圖片是非同步的，這是第二個坑）
⑤ 驗收清單逐項核對

實測：32 件商品全用這條線上架，30 分鐘的事變 3 分鐘，欄位不會漏。

完整教學影片（含可複製的完整 prompt）：<YT_URL>

#Shopify #ClaudeAI #AI自動化 #電商營運
```

## 3. LinkedIn（English）

```
Listing one product on Shopify means a dozen-plus fields: title, description, SEO meta, tags, image alt text, price, inventory policy. ~30 minutes per item done by hand — and you WILL miss fields when tired.

We learned the hard way: all 32 products in our store had inventory tracking OFF (Shopify's default for newly created products). The storefront either showed "sold out" or allowed overselling one-of-a-kind originals.

So I connected the store to Claude (official Shopify connector, zero code). Now listing = one sentence to the AI:
1) Dedup check before creating
2) GEO-structured listing (so AI answer engines like ChatGPT/Perplexity can actually cite your product page)
3) The inventory trio: tracked=true + DENY + qty=1
4) Poll for the cdn.shopify.com image URL (images are async — trap #2)
5) A verification checklist, item by item

Result: all 32 products listed this way; 30 minutes → 3 minutes per item, no missed fields.

Full walkthrough (with the copy-paste master prompt): <YT_URL>

#Shopify #ClaudeAI #Automation #Ecommerce
```

## 4. Reddit（r/shopify 或 r/ecommerce · value-first · 內文零連結）

標題：`PSA: newly created Shopify products default to inventory tracking OFF — all 32 of our products were affected`

```
Sharing because this cost us real headaches. If you create products via API/apps/AI tools (not the admin UI wizard), Shopify defaults to:

- inventoryItem.tracked = false (Shopify doesn't count your stock at all)
- quantity = 0
- and depending on how it was created, inventory policy may allow overselling

For a store selling one-of-a-kind items (original art in our case), that means the storefront either shows Sold Out on available items, or lets someone buy a piece that's already gone.

The fix per product is three settings: turn on "Track quantity", set "Continue selling when out of stock" to OFF (DENY), set quantity to your real count (1 for us).

Two more traps we hit while automating listings:
1. Product images are processed async — right after upload, featuredImage URL comes back null. Poll a few times (5s apart) until you get the cdn.shopify.com URL.
2. Don't trust totalInventory right after updating — it's an aggregate that lags. Check the variant's inventoryQuantity instead.

Hope this saves someone a weekend.
```

（被問「怎麼自動化」再回覆補影片連結：`<YT_URL>`）
