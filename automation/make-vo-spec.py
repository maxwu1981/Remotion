#!/usr/bin/env python3
"""
通用旁白產生器（資料驅動）— 讀一份 video-spec JSON 的 script，用 edge-tts 配音，
輸出 mp3 到 public/vo/<voDir>/，並寫 manifest（id→秒）給 Explainer 引擎用。

用法：python3 automation/make-vo-spec.py <spec.json> <voDir> <manifest_out.json>
例：  python3 automation/make-vo-spec.py src/videos/_explainer/specs/compaction-loop.json compaction-loop src/videos/_explainer/specs/compaction-loop.vo.json
"""
import json, sys, subprocess
from pathlib import Path

spec_path, vo_dir_name, manifest_out = sys.argv[1], sys.argv[2], sys.argv[3]
ROOT = Path(__file__).resolve().parent.parent
vo_dir = ROOT / "public" / "vo" / vo_dir_name
vo_dir.mkdir(parents=True, exist_ok=True)

VOICE = "zh-TW-HsiaoChenNeural"
spec = json.loads(Path(spec_path).read_text())
script = spec["script"]

def speak(t):
    t = t.replace("→", "，").replace("／", "、").replace("·", "，")
    # 多音字防呆（只換 TTS 輸入，不影響畫面字幕/caption）：
    # 「重」在「再一次」語意（重建/重新/重複/重講…）常被 edge-tts 誤唸 zhòng，應唸 chóng；
    # 「重點/重要」等 zhòng 語意不受影響，用完整詞替換避免誤傷。
    for w in ["重複", "重講", "重建", "重新", "重讀", "重傳", "重填", "重來", "重打"]:
        t = t.replace(w, w.replace("重", "崇"))
    # 「塞」在「填塞」語意（塞滿/塞進/塞在…）應唸 sāi（腮），edge-tts 常誤唸 sè；
    # 「阻塞/堵塞」等 sè 語意不受影響，用完整詞替換避免誤傷。
    for w in ["塞滿", "塞進", "塞在", "塞好", "塞爆", "塞了"]:
        t = t.replace(w, w.replace("塞", "腮"))
    # 「.json」要唸成一個單字（像英文名 Jason），不要逐字母拼 J-S-O-N。
    t = t.replace(".json", " Jason")
    # 「行」在「N 行 / 每一行」計量語意（程式碼行數）常被誤唸 xíng，應唸 háng（同音字「航」）；
    # 「進行」等 xíng 語意的詞不受影響，同樣用完整詞/詞組替換避免誤傷。
    import re
    t = re.sub(r"([一二三四五六七八九十百千兩0-9]+)行", lambda m: m.group(1) + "航", t)
    t = t.replace("每一行", "每一航")
    return t.strip()

def dur(f):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(f)]).decode().strip())

manifest = {}
print(f"engine: edge-tts  voice: {VOICE}  → public/vo/{vo_dir_name}/\n")
for cid, text in script.items():
    raw = Path("/tmp") / f"{cid}.spec.mp3"
    mp3 = vo_dir / f"{cid}.mp3"
    subprocess.run(["python3", "-m", "edge_tts", "--voice", VOICE, "--text", speak(text),
                    "--write-media", str(raw)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(raw),
                    "-ar", "44100", "-ac", "1", "-b:a", "192k", str(mp3)], check=True)
    s = round(dur(mp3), 3)
    manifest[cid] = s
    print(f"  {cid:<6} {s:>5}s  {text[:34]}")

Path(manifest_out).write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
total = sum(manifest.values())
print(f"\n✓ {len(manifest)} clips · {total:.1f}s ({total/60:.1f} min) · manifest → {manifest_out}")
