#!/usr/bin/env python3
"""EP09 hf-voiceid 真截圖遮蔽預處理（2026-07-10 老闆拍板：遮 token＋分頁列＋Claude 側欄專案名，帳號名保留）。
輸入：~/Pictures/Hugging Face/ 原始截圖
輸出：public/hf-voiceid/shot-*.png（紅框/放大鏡在 Remotion 內做，這裡只做像素級遮蔽）
"""
import os
from PIL import Image, ImageFilter

SRC = os.path.expanduser("~/Pictures/Hugging Face")
DST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "hf-voiceid")
os.makedirs(DST, exist_ok=True)

# 瀏覽器截圖共用：分頁列帶（原圖 2784×1764 座標）
TABSTRIP = (341, 70, 2683, 150)

def blur_region(im, box, radius=22):
    region = im.crop(box).filter(ImageFilter.GaussianBlur(radius))
    im.paste(region, box)

def pixelate_region(im, box, factor=28):
    region = im.crop(box)
    w, h = region.size
    region = region.resize((max(1, w // factor), max(1, h // factor)), Image.NEAREST)
    region = region.resize((w, h), Image.NEAREST)
    im.paste(region, box)

# (原檔名, 輸出名, [模糊區], [馬賽克區])
JOBS = [
    ("截圖 2026-07-06 下午3.03.45.png", "shot-join.png", [TABSTRIP], []),
    ("截圖 2026-07-06 下午3.31.30.png", "shot-model.png", [TABSTRIP], []),
    ("截圖 2026-07-06 下午3.31.57.png", "shot-agree.png", [TABSTRIP], []),
    ("截圖 2026-07-06 下午3.42.52.png", "shot-seg.png", [TABSTRIP], []),
    # Claude Desktop（2560×1600）：側欄筆記本/專案清單模糊；帳號列保留
    ("截圖 2026-07-06 下午3.44.09.png", "shot-claude.png", [(19, 500, 500, 1450)], []),
    ("截圖 2026-07-06 下午3.53.49.png", "shot-tokens.png", [TABSTRIP], []),
    ("截圖 2026-07-06 下午3.53.59.png", "shot-token-new.png", [TABSTRIP], []),
    # token 彈窗：分頁列模糊＋token 字串馬賽克
    ("截圖 2026-07-06 下午3.54.21.png", "shot-token-save.png", [TABSTRIP], [(880, 786, 1620, 852)]),
]

for src_name, dst_name, blurs, pixels in JOBS:
    im = Image.open(os.path.join(SRC, src_name)).convert("RGB")
    for box in blurs:
        blur_region(im, box)
    for box in pixels:
        pixelate_region(im, box)
    out = os.path.join(DST, dst_name)
    im.save(out, "PNG", optimize=True)
    print(f"{dst_name}  {im.size[0]}x{im.size[1]}  {os.path.getsize(out)//1024}KB")
print("done →", DST)
