#!/usr/bin/env python3
"""
Scout — 每日影片工廠第一棒。
從 Reddit 4 個社群的公開 RSS + Hacker News（Algolia API）抓本週熱門貼文 → 過濾出「可教學的 Claude 問題」
→ 去重（covered-topics）→ 依「衝瀏覽量潛力」排序 → 選出今日 1 題。

無需任何 Reddit app/憑證（.json 會 403，改用 .rss）；HN Algolia API 同樣免金鑰。請求間隔 3 秒避免 429。
用法：python3 automation/scout.py
"""
import json, time, sys, urllib.request, urllib.error, urllib.parse, xml.etree.ElementTree as ET, pathlib, datetime, re

SUBS = ["ClaudeAI", "ClaudeCode", "Anthropic", "LLMDevs"]
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}
NS = {"a": "http://www.w3.org/2005/Atom"}

ROOT = pathlib.Path(__file__).resolve().parent
STATE = ROOT / "state"; STATE.mkdir(exist_ok=True)
COVERED = json.loads((STATE / "covered-topics.json").read_text()).get("keywords", [])

# 像問題/可教學的訊號
# 必須有實質「可教學」訊號（移除單獨的「?」——太鬆會放行迷因/玩笑）
QWORDS = ["how ", "how to", "how do", "how can", "why ", "what's the", "best way", "best practice",
          "can't", "cannot", "unable", "doesn't", "won't", "not working", "stopped working",
          "error", "fix", "issue", "problem", "stuck", "fails", "failing", "broken",
          "difference between", " vs ", "which ", "setup", "set up", "install", "configure",
          "config", "guide", "tutorial", "step by step", "tips", "workflow",
          "怎麼", "如何", "為什麼", "教學", "設定", "解決", "請問", "踩雷", "心得"]
# 抱怨/政策/迷因/雜訊 → 排除
BADWORDS = ["banned", "ban wave", "lawsuit", "sue", "refund", "cancel my", "downgrad", "shutting down",
            "shut down", "politic", "drama", "rant", "scam", "worst", "stock", "ipo", "layoff",
            "fired", "price increase", "pricing change", "is down", "outage", "boycott", "petition",
            "marry", "wanna", "name for", "perfect name", "meme", "funny", " lol", "joke", "lmao",
            "circlejerk", "shitpost", "anyone else", "am i the only", "vent", "rip ", "love this",
            "hot take", "unpopular opinion"]

def fetch(sub, tries=3):
    url = f"https://www.reddit.com/r/{sub}/top/.rss?t=week"
    data = None
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=25) as r:
                data = r.read()
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and k < tries - 1:
                time.sleep(20 * (k + 1))   # 429 退避：20s, 40s
                continue
            raise
    root = ET.fromstring(data)
    out = []
    for i, e in enumerate(root.findall("a:entry", NS)):
        t = (e.findtext("a:title", default="", namespaces=NS) or "").strip()
        le = e.find("a:link", NS)
        link = le.get("href", "") if le is not None else ""
        out.append({"sub": sub, "pos": i, "title": t, "link": link})
    return out

def fetch_hn(days=10, tries=2):
    """Hacker News（Algolia API，免金鑰）：補 Reddit 之外的技術討論串，抓近 N 天提到 Claude/Anthropic 的 story。"""
    since = int(time.time()) - days * 86400
    hits = {}
    for q in ("Claude", "Anthropic"):
        params = {"query": q, "tags": "story", "numericFilters": f"created_at_i>{since}", "hitsPerPage": "50"}
        url = "https://hn.algolia.com/api/v1/search_by_date?" + urllib.parse.urlencode(params)
        data = {"hits": []}
        for k in range(tries):
            try:
                req = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(req, timeout=25) as r:
                    data = json.loads(r.read())
                break
            except Exception as e:
                if k == tries - 1:
                    print(f"HN({q}): 抓取失敗 {e}")
                else:
                    time.sleep(3)
        for h in data.get("hits", []):
            hits[h["objectID"]] = h
    ranked = sorted(hits.values(), key=lambda h: h.get("points") or 0, reverse=True)
    out = []
    for i, h in enumerate(ranked):
        title = (h.get("title") or "").strip()
        if not title:
            continue
        out.append({"sub": "HN", "pos": i, "title": title, "link": f"https://news.ycombinator.com/item?id={h['objectID']}"})
    return out

def _pats(words):
    """ASCII 詞用 word-boundary（避免 somehow→how）；CJK 用子字串。"""
    out = []
    for w in words:
        kw = w.lower().strip()
        if re.search(r"[a-z]", kw):
            out.append(re.compile(r"(?<![a-z])" + re.escape(kw) + r"(?![a-z])"))
        else:
            out.append(kw)
    return out

QPATS = _pats(QWORDS)
BADPATS = _pats(BADWORDS)

def _hit(tl, pats):
    for p in pats:
        if isinstance(p, str):
            if p and p in tl:
                return True
        elif p.search(tl):
            return True
    return False

def teachable(t):
    tl = t.lower()
    if _hit(tl, BADPATS):
        return False
    return _hit(tl, QPATS)

def covered(t):
    tl = t.lower()
    return any(k.lower() in tl for k in COVERED)

def claude_relevant(item):
    tl = item["title"].lower()
    if item["sub"] in ("LLMDevs", "HN"):  # 泛社群 → 必須提到 claude/anthropic
        return "claude" in tl or "anthropic" in tl
    return True

def score(item):
    s = max(0, 26 - item["pos"])          # top 越前面（熱度 proxy）分越高
    tl = item["title"].lower()
    if any(k in tl for k in ["how", "怎麼", "如何", "guide", "tutorial", "教學"]): s += 8
    if any(k in tl for k in ["error", "not working", "fix", "stuck", "issue", "problem", "解決"]): s += 6
    if any(k in tl for k in ["best", "vs ", "difference", "which"]): s += 5
    if "?" in item["title"]: s += 3
    if item["sub"] in ("ClaudeCode", "ClaudeAI"): s += 3   # 最核心受眾
    return s

def src_label(sub):
    return "Hacker News" if sub == "HN" else f"r/{sub}"

def geo_title(t):
    base = re.sub(r"\s+", " ", t).strip().rstrip("?？")
    return f"Claude 實戰：{base[:40]} — 我的解法（含經驗）"

def main():
    cands, raw = [], []
    for i, sub in enumerate(SUBS):
        if i: time.sleep(10)              # 避免 429（間隔拉大）
        try:
            items = fetch(sub)
        except Exception as e:
            print(f"r/{sub}: 抓取失敗 {e}"); continue
        raw += items
        for it in items:
            if not claude_relevant(it): continue
            if not teachable(it["title"]): continue
            if covered(it["title"]):
                it["skip"] = "已涵蓋"; continue
            it["score"] = score(it)
            cands.append(it)

    try:
        hn_items = fetch_hn()
    except Exception as e:
        print(f"HN: 抓取失敗 {e}"); hn_items = []
    raw += hn_items
    for it in hn_items:
        if not claude_relevant(it): continue
        if not teachable(it["title"]): continue
        if covered(it["title"]):
            it["skip"] = "已涵蓋"; continue
        it["score"] = score(it)
        cands.append(it)

    cands.sort(key=lambda x: x["score"], reverse=True)

    print(f"\n抓到 {len(raw)} 篇；通過過濾(可教學/未涵蓋) {len(cands)} 篇。\n")
    print("=== 今日候選排序（前 12）===")
    for it in cands[:12]:
        print(f"  {it['score']:>3}  {src_label(it['sub']):<12} {it['title'][:72]}")

    pick = cands[0] if cands else None
    out = {"date": datetime.date.today().isoformat(), "picked": pick,
           "candidates": cands[:12], "fetched": len(raw)}
    (STATE / f"scout-{out['date']}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2))
    if pick:
        print("\n=== 今日選題 ===")
        print(f"  題目：{pick['title']}")
        print(f"  來源：{src_label(pick['sub'])}  {pick['link']}")
        print(f"  GEO 標題建議：{geo_title(pick['title'])}")
    else:
        print("\n⚠️ 今日無強題 → 走 fallback（選一個 AI skill 詳細介紹）。")

def selftest():
    SAMPLE = [
        ("ClaudeCode", "How do I stop Claude Code from looping on context compaction?"),
        ("ClaudeCode", "Best way to share a skill across multiple projects?"),
        ("ClaudeCode", "MCP server keeps disconnecting — how to debug it?"),
        ("ClaudeAI", "They're demanding Fable to somehow be 100% jailbreak-proof. It's so over."),
        ("ClaudeAI", "Any USA citizen wanna marry me? I'm tryna access Fable 5"),
        ("ClaudeAI", "Claude keeps forgetting CLAUDE.md — how to make memory persist?"),
        ("Anthropic", "Why does my API return 429 and how to handle rate limits?"),
        ("LLMDevs", "Claude vs GPT for coding agents — which is better?"),
        ("LLMDevs", "Check out my new startup launch"),
        ("ClaudeCode", "How to install Claude Code on Windows WSL"),
    ]
    print("=== Scout 過濾/排序自我測試（離線、不打 Reddit）===\n")
    kept = []
    for i, (sub, title) in enumerate(SAMPLE):
        it = {"sub": sub, "pos": i, "title": title}
        if not claude_relevant(it):
            print(f"  ✗ 丟棄[非 Claude]   r/{sub}: {title[:58]}"); continue
        if not teachable(title):
            print(f"  ✗ 丟棄[非教學/雜訊] r/{sub}: {title[:58]}"); continue
        if covered(title):
            print(f"  ✗ 丟棄[已涵蓋]     r/{sub}: {title[:58]}"); continue
        it["score"] = score(it)
        kept.append(it)
        print(f"  ✓ 保留 score={it['score']:>3}    r/{sub}: {title[:58]}")
    kept.sort(key=lambda x: x["score"], reverse=True)
    print("\n=== 排序後 ===")
    for it in kept:
        print(f"  {it['score']:>3}  r/{it['sub']:<10} {it['title']}")
    if kept:
        print(f"\n→ 會選：{kept[0]['title']}")
        print(f"  GEO 標題建議：{geo_title(kept[0]['title'])}")


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        selftest()
    else:
        main()
