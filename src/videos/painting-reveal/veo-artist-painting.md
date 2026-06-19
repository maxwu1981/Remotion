# 「本人作畫」AI 影片 — Veo / Gemini 提示詞指南

目標：你大多只有**成品照**，想要有「**你本人在作畫**」的影片，而且每支的**動作／鏡頭／場景都不同**。
做法：用 **Veo（Gemini）圖生視頻 image-to-video**。

---

## 核心觀念：用「你的靜照」當種子，AI 只負責讓你動起來

要「維持本人」，最可靠的方式是**給 Veo 一張你的清晰靜照當起始畫面**——這樣長相、衣著、畫室都直接沿用照片裡的你，AI 只負責「讓你提筆作畫」。
**文字提示詞只描述：動作、鏡頭、場景**，不用描述你的長相（照片已經提供了）。

> ⚠️ **重要：Veo / Gemini 對「真實人物」可能設限**。Google 有時會**拒絕用真人照片生成影片**（人物政策）。若被擋：
> - 改用 **Kling 可灵**（圖生視頻對人物較寬鬆，你也用過）或 **Runway Gen-4**；
> - 提示詞格式大同小異，跟我說一聲我幫你轉成該工具的版本。

---

## 你要提供的「種子圖」（最關鍵的一步）

- 一張**清晰、正面或四分之三側**的你在畫案前的照片（**從那支 reel 截圖就可以**）。
- 臉、手、毛筆都看得清楚；光線均勻；背景越單純越好（方便之後換場景）。
- 解析度越高越好。可以多給 2–3 張不同角度，我幫你挑最適合當種子的那張。
- 放到 `public/ref/` 或 `~/Downloads/FB/`，再把路徑給我。

---

## 提示詞模板（英文 — Veo 偏好英文）

```
Image-to-video. Keep the EXACT same person, face, hairstyle and clothing as the
input image — do not change his identity.
A Chinese ink-painting (寫意) artist paints at his desk. He [ACTION].
Setting: [SCENE]. Camera: [CAMERA]. Lighting: [LIGHTING].
Calm, focused, documentary feel. Smooth natural motion; hands and brush stay
consistent. 8 seconds.
Avoid: morphing or changing the face, extra fingers, altering his appearance,
on-screen text or watermarks.
```

填空清單（每支換這些就有不同的「動作場景」）：

| 欄位 | 可選內容 |
|---|---|
| **ACTION 動作** | loads the brush with ink and paints a broad leaf with one confident wet stroke ／ signs his name and presses a red seal (朱砂印) in the corner ／ steps back and studies the finished painting ／ dips the brush and dots the eyes of a small bird |
| **SCENE 場景** | a traditional study with xuan rice paper, ink stone and brushes (文房四寶) ／ a bright minimalist studio ／ a courtyard with bamboo seen through a window |
| **CAMERA 鏡頭** | slow push-in toward the paper ／ over-the-shoulder looking down at the paper ／ top-down on the paper ／ gentle handheld drift |
| **LIGHTING 光線** | soft warm window light ／ soft diffused studio light |

---

## 四組現成範例（以「絲瓜雙禽」為例，動作/場景各不同，各 8 秒）

**1 — 運筆特寫**
```
Image-to-video. Keep the EXACT same person, face, hairstyle and clothing as the input image; do not change his identity.
Close-up of a Chinese ink-painting artist's hand and brush: he loads the brush with dark ink and paints the broad leaves of a sponge-gourd (絲瓜) plant on xuan rice paper with confident wet strokes.
Setting: a traditional study with an ink stone and brushes. Camera: slow push-in toward the paper. Lighting: soft warm window light.
Calm, focused, documentary feel; smooth natural motion; hand and brush stay consistent. 8 seconds.
Avoid: morphing or changing the face, extra fingers, altering his appearance, on-screen text.
```

**2 — 過肩看紙**
```
Image-to-video. Keep the EXACT same person, face, hairstyle and clothing as the input image; do not change his identity.
Over-the-shoulder shot from behind the artist looking down at the paper as he paints hanging sponge gourds and adds two small birds near the bottom.
Setting: a bright minimalist studio. Camera: steady over-the-shoulder with a slight drift. Lighting: soft diffused light.
Calm, focused; smooth natural motion; hands and brush stay consistent. 8 seconds.
Avoid: morphing or changing the face, extra fingers, altering his appearance, on-screen text.
```

**3 — 落款蓋印**
```
Image-to-video. Keep the EXACT same person, face, hairstyle and clothing as the input image; do not change his identity.
The artist finishes the painting, writes his signature in the corner with a fine brush, then presses a red seal (朱砂印) onto the paper.
Setting: a traditional desk with 文房四寶. Camera: medium close-up on the corner of the paper and his hand. Lighting: warm.
Calm, deliberate motion; hands stay consistent. 8 seconds.
Avoid: morphing or changing the face, extra fingers, altering his appearance, on-screen text.
```

**4 — 起身看畫**
```
Image-to-video. Keep the EXACT same person, face, hairstyle and clothing as the input image; do not change his identity.
The artist sets down his brush and steps back, looking at the finished sponge-gourd-and-birds painting on the desk with a quiet, satisfied expression.
Setting: a study with bamboo visible through a window. Camera: slow pull-back. Lighting: soft warm light.
Calm, natural motion; appearance stays consistent. 8 seconds.
Avoid: morphing or changing the face, extra fingers, altering his appearance, on-screen text.
```

---

## 每幅畫怎麼換

- **你（種子圖）固定不變**，每支只換 ACTION / SCENE，以及「他畫的是哪幅」。
- 想讓畫面中「畫的就是那幅畫」：生成時讓畫紙留白或半成品即可，**最後我在 Remotion 把你的成品照疊進畫面收尾**——這樣一定收在真實作品上（AI 自己畫常會走樣）。

## 生成完之後（交給我接力）

把生成的片段（8 秒幾支）放到 `~/Desktop/AI影片輸出/`（你 YouTube 上傳 skill 正在掃這個資料夾）或給我路徑，我會：
1. 用 Remotion 直式範本（`painting-reveal/`）套**封面（畫名）＋結尾（落款／CTA）**，把片段用 `@remotion/media` 的 `<Video>` 嵌入，並把**成品照**疊上收尾；
2. 接成一支完整 9:16 直片 → `out/`；
3. 交給 `jq-fb-video-publisher` / `jq-youtube-uploader` 發佈。
