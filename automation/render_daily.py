#!/usr/bin/env python3
"""
算繪今日影片：render VF-Daily（讀 current.json/current.vo.json）→ 出縮圖 → ffprobe 驗證
→ 歸檔 spec/縮圖到 out/youtube-videos/<topic id>/（避免明天算繪覆寫 current.json 後，
今天的縮圖/spec 就再也回不去；2026-07-06 教訓見記憶 claude-code-deep-dive-playlist）。
orchestrator/cron 原生執行，不受 Bash 工具 10 分鐘上限。

用法：python3 automation/render_daily.py [comp id，預設 VF-Daily；做了名詞小教室片尾就傳 VF-DailyFull]
輸出：out/vf-daily.mp4 、 out/vf-daily-thumb.png 、 out/youtube-videos/<topic id>/{spec,vo,thumb}
"""
import json, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMP = sys.argv[1] if len(sys.argv) > 1 else "VF-Daily"
MP4 = ROOT / "out" / "vf-daily.mp4"
THUMB = ROOT / "out" / "vf-daily-thumb.png"
SPEC = ROOT / "src/videos/_explainer/specs/current.json"
VO = ROOT / "src/videos/_explainer/specs/current.vo.json"
GLOSSARY = ROOT / "src/videos/_explainer/specs/current.glossary.json"
GLOSSARY_VO = ROOT / "src/videos/_explainer/specs/current.glossary.vo.json"

def run(cmd):
    print("›", " ".join(cmd))
    subprocess.run(cmd, cwd=str(ROOT), check=True)

def archive():
    topic_id = json.loads(SPEC.read_text())["id"]
    dest = ROOT / "out" / "youtube-videos" / topic_id
    dest.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SPEC, dest / "spec.json")
    shutil.copy2(VO, dest / "spec.vo.json")
    shutil.copy2(THUMB, dest / "thumb.png")
    # 有做名詞小教室片尾（terms 非空）就一併歸檔，明天 reset current.glossary.json 後才回得去
    if GLOSSARY.exists() and json.loads(GLOSSARY.read_text()).get("terms"):
        shutil.copy2(GLOSSARY, dest / "spec.glossary.json")
        shutil.copy2(GLOSSARY_VO, dest / "spec.glossary.vo.json")
    print(f"   歸檔：out/youtube-videos/{topic_id}/{{spec.json,spec.vo.json,thumb.png}}")

def warn_glossary_state():
    # 只警告不擋：名詞段 spec 比主片 spec 舊＝疑似昨天殘留（會接到昨天的卡+旁白）；terms 空＝會算成純主片
    if COMP == "VF-Daily" or not GLOSSARY.exists():
        return
    terms = json.loads(GLOSSARY.read_text()).get("terms")
    if not terms:
        print(f"⚠️ 指定 {COMP} 但 current.glossary.json terms 為空——會算成純主片（無名詞段）")
    elif GLOSSARY.stat().st_mtime < SPEC.stat().st_mtime:
        print("⚠️ current.glossary.json 比 current.json 舊——確認名詞段是今天的、不是昨天殘留（照常繼續算繪）")

def main():
    warn_glossary_state()
    run(["npx", "remotion", "render", COMP, str(MP4), "--concurrency=3", "--timeout=300000"])
    run(["npx", "remotion", "still", COMP, str(THUMB), "--frame=250"])
    dur = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(MP4)]).decode().strip()
    has_audio = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
         "stream=codec_type", "-of", "csv=p=0", str(MP4)]).decode().strip()
    if not has_audio:
        print("⚠️ 無音軌"); sys.exit(1)
    print(f"✅ 算繪完成：{MP4.name}  {float(dur):.1f}s  音軌={has_audio}")
    print(f"   縮圖：{THUMB.name}")
    archive()

if __name__ == "__main__":
    main()
