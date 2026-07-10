#!/usr/bin/env python3
"""
透過 macOS Messages 發 iMessage 通知（每日影片工廠用）。
收件號碼讀 automation/state/config.json 的 imessage_to。

用法：python3 automation/notify_imessage.py "訊息內容"
"""
import sys, json, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
to = json.loads((ROOT / "state" / "config.json").read_text())["imessage_to"]
text = sys.argv[1] if len(sys.argv) > 1 else "（測試）每日影片工廠通知"

script = f'''
tell application "Messages"
  set targetService to 1st service whose service type = iMessage
  set targetBuddy to buddy "{to}" of targetService
  send "{text}" to targetBuddy
end tell
'''
try:
    subprocess.run(["osascript", "-e", script], check=True, capture_output=True, text=True)
    print(f"✅ iMessage 已送到 {to}")
except subprocess.CalledProcessError as e:
    print(f"⚠️ iMessage 失敗：{e.stderr.strip()}")
    sys.exit(1)
