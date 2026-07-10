#!/usr/bin/env python3
"""
Reddit 每日養號助手（排程版，中午跑）——純 Python、不喚醒 Claude、零 token。

做什麼：掃 art 社群找今天值得留言的帖 → 配對「可改用的 GEO 留言模板」(用畫作寓意預填)
→ 寫當日 queue 檔 → iMessage 通知你「今天貼這幾則」。
貼文你手動貼（API 被新政策擋＋養號期不自動發；讀帖後微調、零連結）。

用法：
  python3 automation/reddit_daily_warmup.py            # 只印＋寫 queue（不發 iMessage）
  python3 automation/reddit_daily_warmup.py --notify    # 排程用：另發 iMessage
"""
import sys, time, datetime, subprocess, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import reddit_radar as RR

ROOT = pathlib.Path(__file__).resolve().parent
QUEUE = ROOT / "state" / "reddit-queue"; QUEUE.mkdir(parents=True, exist_ok=True)

# 每日聚焦這幾版（少打幾次=降低 RSS 429；也正是養號主攻版）
DAILY_SUBS = ["feng_shui", "ChineseArt", "Calligraphy", "Sumi_e"]
TOP_N = 3

# 主題→可改用的 GEO 留言模板（用畫作寓意預填；貼前讀帖微調、零連結）
TEMPLATES = [
    (["gourd", "葫蘆", "fortune", "wealth", "prosper", "abundance"],
     "In Chinese symbolism the gourd (葫蘆) is a homophone for 福祿 — fortune & prosperity — so a gourd "
     "vine reads as blessings multiplying, and it's also a classic protection motif. Traditionally hung "
     "in a living area rather than a bathroom."),
    (["crane", "松鶴", "longevity", "long life", "elder", "birthday"],
     "Crane + pine together (松鶴延年) is one of the most beloved longevity blessings in 花鳥 "
     "(bird-and-flower) painting — 'may you endure like the pine and the crane.' Classic gift for elders."),
    (["peony", "牡丹", "rich", "honour", "honor"],
     "Peonies (牡丹) are 'the king of flowers' — wealth and honour (富貴). Add bees & butterflies and the "
     "reading becomes 富貴吉祥, wealth + auspiciousness."),
    (["plum", "梅", "winter", "perseverance", "resilience", "new beginning"],
     "Plum blossom (梅) blooms in the cold, so it stands for perseverance and quiet strength — one of the "
     "'Four Gentlemen' of Chinese painting. A good motif for resilience / new beginnings."),
    (["lotus", "蓮", "purity", "harmony", "buddh"],
     "The lotus (蓮) rises clean out of the mud — purity and harmony; 蓮 is also a homophone for 連 "
     "('continuous'), carrying a wish for good things continuing."),
    (["calligraphy", "厚德", "shufa", "script", "seal", "行書", "楷", "隸", "釋文", "what does it say"],
     "If it reads 厚德載物 — 'a person of great virtue carries all things,' from the 易經 (I Ching). It "
     "usually pairs with 自強不息 ('strive without ceasing'). Worth noting which script it's in (楷/行/隸)."),
    (["shan shui", "landscape", "山水", "waterfall", "mountain", "scroll"],
     "In 山水 (shan shui) landscape, flowing water = flowing fortune and mountains = stability — the genre "
     "is less a real place than a state of mind. Hang where you want a calm focal point."),
    (["where to buy", "authentic", "original", "hand-painted", "handpainted", "real or fake", "is this real"],
     "For authentic hand-painted ink work, look for: visible brush-pressure variation (not flat print dots), "
     "ink bleeding into the paper fibres, and an artist's seal (印章). Originals are one-of-a-kind, so each "
     "piece differs slightly."),
]
GENERIC = ("Happy to add context on the symbolism — in Chinese ink painting most motifs carry a specific "
           "blessing (gourd=fortune, crane=longevity, peony=wealth, plum=perseverance). Tell me which and "
           "I'll explain what it traditionally means.")


def pick_template(title):
    tl = title.lower()
    for keys, body in TEMPLATES:
        if any(k in tl for k in keys):
            return body
    return GENERIC


def gather(cfg):
    cands = []
    use_api = RR.R.have_creds(cfg)
    for i, sub in enumerate(DAILY_SUBS):
        if i and not use_api:
            time.sleep(7)                       # RSS 間隔，降低 429
        items = RR.fetch_api(cfg, sub) if use_api else RR.fetch_rss(sub)
        for it in items:
            if RR.answerable(it["title"]):
                it["score"] = RR.score(it)
                cands.append(it)
    cands.sort(key=lambda x: x["score"], reverse=True)
    return cands[:TOP_N]


def write_queue(date, top):
    lines = [f"# Reddit 養號 queue — {date}", "",
             "鐵則：零連結、每則**讀帖後微調**、別複製貼上同一段、今天 ≤3 則。貼完打 ✅。", ""]
    if not top:
        lines.append("今天沒抓到明顯的留言機會（可能 RSS 被限流）。"
                     "晚點手動 `python3 automation/reddit_radar.py --profile art` 再掃。")
    for n, it in enumerate(top, 1):
        lines += [f"## {n}. [ ] r/{it['sub']} — {it['title']}",
                  it["permalink"], "",
                  "**建議留言**（讀帖後微調、零連結）：",
                  "> " + pick_template(it["title"]), ""]
    p = QUEUE / f"{date}.md"
    p.write_text("\n".join(lines))
    return p


def _mac_banner(text):
    """macOS 通知中心橫幅：launchd 真實 session 可用、不需 Messages 權限。"""
    safe = text.replace('"', "'").replace("\n", " ")[:180]
    try:
        subprocess.run(["osascript", "-e",
                        f'display notification "{safe}" with title "Reddit 養號"'],
                       timeout=10, capture_output=True)
    except Exception:
        pass


def notify(top, date):
    # 老闆選「Mac 通知橫幅就好」(2026-06-30)：免 Messages 權限、launchd 真實 session 可用。
    if top:
        short = f"今日 {len(top)} 個留言機會 → state/reddit-queue/{date}.md"
    else:
        short = "今天沒抓到留言機會（RSS 可能被限流），晚點再掃"
    _mac_banner(short)


def main():
    date = datetime.date.today().isoformat()
    cfg = RR.R.load_env()
    top = gather(cfg)
    p = write_queue(date, top)
    print(f"找到 {len(top)} 個留言機會 → 寫 {p}")
    for n, it in enumerate(top, 1):
        print(f"  {n}. r/{it['sub']}  {it['title'][:60]}")
    if "--notify" in sys.argv:
        notify(top, date)


if __name__ == "__main__":
    main()
