# 定妝 master 英文 prompt（Gemini Nano Banana Pro）

共用風格錨（每張都帶）：`3D rendered, stylized realism (Pixar-like), warm cozy vintage-hotel ambiance, soft warm golden lighting, clean composition, consistent recurring character design, high resolution.`

一致性做法：先把每張生到滿意當 master → 之後每個分鏡圖都餵對應 master 當參考圖（本機檔不能直傳 Gemini，先 cp 到 Google Drive 同步夾再「從雲端硬盤添加」）。一回合一張圖。

---

### 1. 主角「你」（一般人，握萬能鑰匙=密碼）
`3D rendered character, stylized realism (Pixar-like), a relatable ordinary young East Asian man in simple casual everyday clothes (plain sweater), friendly but slightly hesitant and worried expression, holding a comically oversized ornate golden master key in both hands protectively against his chest. Warm cozy vintage-hotel golden lighting, plain warm-neutral background for easy cutout, full-body, recurring character design, high resolution.`

### 2. 前台 OAuth（專業親切員工）
`3D rendered character, stylized realism (Pixar-like), a professional warm female hotel front-desk clerk, smart vintage hotel uniform (deep teal blazer with brass buttons and a small name badge), confident friendly welcoming smile, one hand gesturing reassuringly. Warm golden lobby lighting, plain warm-neutral background for easy cutout, upper-body, recurring character design, high resolution.`

### 3. 訪客機器人（程式 / Claude，好奇有禮小機器人）
`3D rendered character, stylized realism (Pixar-like), a small friendly curious robot guest about the size of a child, rounded matte-white body with soft warm-orange accent light strips, big expressive glowing friendly eyes, polite attentive posture leaning slightly forward with a curious head tilt. IMPORTANT: no antenna, no chest screen, no clutter — clean simple rounded design. Warm hotel lighting, plain warm-neutral background for easy cutout, full-body, recurring character design, high resolution.`

### 4. 房卡 = access token（會發光的限定房卡道具）
`3D rendered product shot, stylized realism, a single glowing hotel key card floating at a slight angle, premium frosted translucent material, the card face shows a row of small door icons where only a few are lit with warm orange glow (limited access) and the rest are dim, subtle embossed label "ACCESS". Plain dark warm background to make the glow pop, clean product framing, high resolution.`

### 5. 大廳場景（溫馨復古旅館大廳，空景待合成角色）
`3D rendered environment, stylized realism (Pixar-like), a cozy warm vintage hotel lobby, rich dark-wood reception desk with brass details, warm golden lighting, a wall of small numbered guest-room doors in the soft-focus background, inviting comfortable atmosphere, gentle depth of field, NO people (empty stage for compositing characters later), wide 16:9 establishing shot, high resolution.`
