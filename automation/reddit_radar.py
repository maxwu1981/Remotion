#!/usr/bin/env python3
"""
Reddit 雷達 —— 找「現在值得去留言」的新鮮討論串（價值優先留言策略用）。

跟 scout.py 不同：scout 是從 top/week 選「拍片題目」；radar 是從 new/rising 找
「你能答得好、又夠新（可搶到前排留言＝最被 AI 引擎引用）」的提問串。

有憑證 → 走官方 API（拿得到 留言數/內文/讚數，過濾更準）；
沒憑證 → 退而用公開 RSS（只有標題，仍可用）。

用法：
  python3 automation/reddit_radar.py                       # 預設 profile=art（賣畫）
  python3 automation/reddit_radar.py --profile art         # 藝術社群＋書畫/風水關鍵字
  python3 automation/reddit_radar.py --profile tech         # Claude 技術頻道
  python3 automation/reddit_radar.py --profile art feng_shui ChineseArt   # 指定社群覆蓋
"""
import sys, re, time, datetime, pathlib, json
import urllib.request, urllib.error, xml.etree.ElementTree as ET
import reddit_api as R

NS = {"a": "http://www.w3.org/2005/Atom"}
RSS_UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"}

ROOT = pathlib.Path(__file__).resolve().parent
STATE = ROOT / "state"; STATE.mkdir(exist_ok=True)

# 兩種 profile：art＝賣畫(峻清书画)、tech＝Claude 技術頻道。預設 art（現行目標）。
PROFILES = {
    "art": {
        "subs": ["ChineseArt", "Calligraphy", "Sumi_e", "inkpainting", "AsianArt",
                 "feng_shui", "somethingimade"],
        # 你能權威發言的題目（中國書畫・風水寓意）→ 命中加分
        "wheelhouse": ["chinese painting", "chinese art", "ink painting", "ink wash", "calligraphy",
                       "feng shui", "shan shui", "landscape", "bird and flower", "gourd", "plum blossom",
                       "crane", "peony", "lotus", "sparrow", "bamboo", "koi", "symbol", "symbolis",
                       "meaning", "auspicious", "authentic", "original", "hand-painted", "handpainted",
                       "scroll", "sumi", "brush", "rice paper", "xuan", "where to buy", "commission",
                       "hang", "wall art", "zen"],
        "bad_extra": ["ai art", "ai-generated", "ai generated", "midjourney", "stable diffusion",
                      "is this ai", "diffusion", "nft", "print on demand"],
    },
    "tech": {
        "subs": ["ClaudeAI", "ClaudeCode", "Anthropic"],
        "wheelhouse": ["claude code", "claude.md", "skill", "subagent", "sub-agent", "mcp", "hook",
                       "slash command", "memory", "context", "agent sdk", "cli", "install", "setup",
                       "permission", "token", "rate limit", "prompt", "workflow", "remotion"],
        "bad_extra": [],
    },
}
# 目前作用中（main() 會依 --profile 覆寫）；預設 art。
WHEELHOUSE = PROFILES["art"]["wheelhouse"]
# 是真的「提問/求助」訊號
QWORDS = ["how ", "how to", "how do", "how can", "why ", "what's the", "best way", "best practice",
          "can't", "cannot", "unable", "doesn't", "won't", "not working", "error", "fix",
          "issue", "problem", "stuck", "fails", "failing", "broken", "which ", "vs ", "?",
          "怎麼", "如何", "為什麼", "請問", "設定", "解決"]
# 抱怨/政策/迷因 → 不適合給技術留言
BADWORDS = ["banned", "lawsuit", "refund", "cancel my", "shutting down", "politic", "drama",
            "rant", "scam", "worst", "layoff", "price increase", "is down", "outage", "boycott",
            "meme", "funny", " lol", "joke", "circlejerk", "shitpost", "vent", "hot take",
            "unpopular opinion", "how did we get", "poor"]
# 作用中的排除詞（main() 依 profile 覆寫＝BADWORDS + 該 profile bad_extra）
BADWORDS_ALL = BADWORDS + PROFILES["art"]["bad_extra"]


def _hit(tl, words):
    return any(w in tl for w in words)


def answerable(title):
    tl = title.lower()
    if _hit(tl, BADWORDS_ALL):
        return False
    return _hit(tl, QWORDS)


def score(it):
    """越新 + 越在守備範圍 + 留言越少（搶前排）+ 是疑問 → 越高。"""
    s = 0.0
    tl = it["title"].lower()
    if _hit(tl, WHEELHOUSE):
        s += 10
    if "?" in it["title"]:
        s += 3
    if _hit(tl, ["how", "怎麼", "如何", "best way", "best practice"]):
        s += 4
    age_h = it.get("age_h")
    if age_h is not None:
        s += max(0, 12 - age_h / 3)          # 越新越高（36h 內最甜）
    nc = it.get("num_comments")
    if nc is not None:
        s += 8 if nc <= 3 else (4 if nc <= 10 else 0)   # 留言少＝你能當前排
    return round(s, 1)


def fetch_api(cfg, sub):
    out = []
    for listing in ("new", "rising"):
        try:
            j = R.api_get(cfg, f"/r/{sub}/{listing}", {"limit": 50})
        except Exception as e:
            print(f"  r/{sub}/{listing} API 失敗：{e}")
            continue
        for ch in j.get("data", {}).get("children", []):
            d = ch.get("data", {})
            age_h = (time.time() - d.get("created_utc", time.time())) / 3600
            out.append({
                "sub": sub, "title": d.get("title", ""),
                "permalink": "https://www.reddit.com" + d.get("permalink", ""),
                "num_comments": d.get("num_comments"), "ups": d.get("score"),
                "age_h": round(age_h, 1),
                "selftext": (d.get("selftext") or "")[:280],
            })
    # 同帖 new+rising 會重複 → 去重
    seen, uniq = set(), []
    for it in out:
        if it["permalink"] in seen:
            continue
        seen.add(it["permalink"]); uniq.append(it)
    return uniq


def fetch_rss(sub):
    url = f"https://www.reddit.com/r/{sub}/new/.rss"
    try:
        req = urllib.request.Request(url, headers=RSS_UA)
        with urllib.request.urlopen(req, timeout=25) as r:
            root = ET.fromstring(r.read())
    except Exception as e:
        print(f"  r/{sub} RSS 失敗：{e}")
        return []
    out = []
    for e in root.findall("a:entry", NS):
        t = (e.findtext("a:title", default="", namespaces=NS) or "").strip()
        le = e.find("a:link", NS)
        link = le.get("href", "") if le is not None else ""
        out.append({"sub": sub, "title": t, "permalink": link,
                    "num_comments": None, "ups": None, "age_h": None, "selftext": ""})
    return out


def main():
    global WHEELHOUSE, BADWORDS_ALL
    args = sys.argv[1:]
    profile = "art"
    if "--profile" in args:
        i = args.index("--profile")
        profile = args[i + 1] if i + 1 < len(args) else "art"
        del args[i:i + 2]
    if profile not in PROFILES:
        sys.exit(f"✗ 未知 profile「{profile}」，可用：{', '.join(PROFILES)}")
    prof = PROFILES[profile]
    WHEELHOUSE = prof["wheelhouse"]
    BADWORDS_ALL = BADWORDS + prof["bad_extra"]
    subs = [a for a in args if not a.startswith("-")] or prof["subs"]
    cfg = R.load_env()
    mode = "官方 API" if R.have_creds(cfg) else "RSS（無憑證→只有標題；填 reddit.env 可拿留言數/內文）"
    print(f"\nprofile：{profile}　模式：{mode}\n社群：{', '.join('r/'+s for s in subs)}\n")

    cands = []
    for i, sub in enumerate(subs):
        if i and not R.have_creds(cfg):
            time.sleep(5)                     # RSS 間隔避免 429
        items = fetch_api(cfg, sub) if R.have_creds(cfg) else fetch_rss(sub)
        for it in items:
            if not answerable(it["title"]):
                continue
            it["score"] = score(it)
            cands.append(it)
    cands.sort(key=lambda x: x["score"], reverse=True)

    print(f"找到 {len(cands)} 個可留言的提問串。\n=== 今日留言機會（前 12）===")
    for it in cands[:12]:
        meta = []
        if it.get("age_h") is not None:
            meta.append(f"{it['age_h']:.0f}h")
        if it.get("num_comments") is not None:
            meta.append(f"{it['num_comments']}留言")
        tag = f"[{' · '.join(meta)}]" if meta else ""
        print(f"  {it['score']:>5}  r/{it['sub']:<10} {it['title'][:66]} {tag}")
        print(f"          {it['permalink']}")

    out = {"date": datetime.date.today().isoformat(), "mode": mode,
           "opportunities": cands[:12], "count": len(cands)}
    (STATE / f"reddit-radar-{out['date']}.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2))
    print(f"\n已寫 state/reddit-radar-{out['date']}.json")
    if cands:
        top = cands[0]
        print("\n→ 最值得先看：", top["title"])
        print("  ", top["permalink"])
        print("  下一步：人工讀整串 → 草擬有價值的解法留言 → "
              "python3 automation/reddit_comment.py --thread <url> --text-file draft.md（先 --dry-run）")
    else:
        print("\n今天沒有明顯的留言機會 → 換個社群或晚點再掃。")


if __name__ == "__main__":
    main()
