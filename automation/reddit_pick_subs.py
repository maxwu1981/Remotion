#!/usr/bin/env python3
"""
選版 agent —— 為峻清书画賣畫盤點候選 subreddit。
抓每版「即時訂閱數 / 活躍 / 型別 / 投稿型態 / 規則」→ 粗判「能不能帶連結」→
列清單給老闆圈 5–6 個主攻版（後面 agent 才有靶）。

候選版來自 reddit-art-gap-analysis.md 三層。需官方 API 憑證
（Reddit 擋未授權 .json/.about）→ 填 automation/reddit.env 後跑：
  python3 automation/reddit_pick_subs.py
"""
import json, pathlib, datetime
import reddit_api as R

ROOT = pathlib.Path(__file__).resolve().parent
STATE = ROOT / "state"; STATE.mkdir(exist_ok=True)

# (subreddit, 層級, 用途備註)
CANDIDATES = [
    ("ChineseArt", "T1", "最對口·原生分享寓意/過程"),
    ("Calligraphy", "T1", "書法厚德載物·規則嚴重評析"),
    ("Sumi_e", "T1", "水墨/墨彩"),
    ("inkpainting", "T1", "水墨"),
    ("AsianArt", "T1", "廣亞洲藝術"),
    ("feng_shui", "T2", "吉祥寓意原生·最甜"),
    ("InteriorDesign", "T2", "大幅山水掛牆·情境圖"),
    ("CozyPlaces", "T2", "掛牆 zen wall art"),
    ("somethingimade", "T2", "「我畫的」·部分允許留言放連結"),
    ("AmateurRoomPorn", "T2", "房間掛畫"),
    ("ArtStore", "T3", "明文賣畫·買家流量弱"),
    ("Artwork_for_sale", "T3", "賣畫"),
    ("Art_Collectors", "T3", "藏家"),
]

PROMO_NEG = ["no self-promo", "no self promotion", "no advertis", "no selling", "no sales",
             "no shop", "no store", "no links", "not a marketplace", "no promotion", "no soliciting"]
PROMO_POS = ["self-promo", "self promotion", "for sale", "selling allowed", "sellers", "promo thread",
             "marketplace", "share your work", "artist", "shop link"]


def assess(rules_text, submission_type):
    t = rules_text.lower()
    neg = any(w in t for w in PROMO_NEG)
    pos = any(w in t for w in PROMO_POS)
    if pos and not neg:
        return "✅ 似允許自推/賣"
    if neg and not pos:
        return "🚫 似禁自推/連結→只養信任"
    if neg and pos:
        return "⚠️ 有條件·看細則"
    return "❓ 規則未明·人工讀"


def fetch_sub(cfg, sub):
    d = R.api_get(cfg, f"/r/{sub}/about").get("data", {})
    try:
        rules = R.api_get(cfg, f"/r/{sub}/about/rules").get("rules", [])
    except Exception:
        rules = []
    rules_text = " ".join((r.get("short_name", "") + " " + r.get("description", "")) for r in rules)
    return {
        "sub": sub,
        "subscribers": d.get("subscribers"),
        "active": d.get("active_user_count"),
        "type": d.get("subreddit_type"),            # public/restricted/private
        "submission_type": d.get("submission_type"),  # any/link/self
        "desc": (d.get("public_description") or "").replace("\n", " ")[:90],
        "rule_names": [r.get("short_name") for r in rules][:8],
        "promo": assess(rules_text, d.get("submission_type")),
    }


def main():
    cfg = R.load_env()
    if not R.have_creds(cfg):
        print("✗ 缺憑證 → 填 automation/reddit.env 才能抓即時訂閱/規則（Reddit 擋未授權）。\n"
              "  註冊步驟見 reddit-playbook.md。候選版（待抓）：")
        for sub, tier, note in CANDIDATES:
            print(f"   [{tier}] r/{sub:18} {note}")
        return

    rows = []
    for sub, tier, note in CANDIDATES:
        try:
            info = fetch_sub(cfg, sub)
            info["tier"], info["note"] = tier, note
        except Exception as e:
            info = {"sub": sub, "tier": tier, "note": note, "error": str(e)[:60]}
        rows.append(info)
    rows.sort(key=lambda r: (r.get("tier", ""), -(r.get("subscribers") or 0)))

    print(f"\n=== 候選版盤點（{datetime.date.today().isoformat()}）===")
    print(f"{'層':<3}{'subreddit':<20}{'訂閱':>9}{'活躍':>7}  {'型別':<10}{'自推判斷':<18}用途")
    for r in rows:
        if r.get("error"):
            print(f"{r['tier']:<3}r/{r['sub']:<18}{'—':>9}{'—':>7}  抓取失敗：{r['error']}")
            continue
        subs = f"{r['subscribers']:,}" if r.get("subscribers") is not None else "?"
        act = f"{r['active']:,}" if r.get("active") else "?"
        print(f"{r['tier']:<3}r/{r['sub']:<18}{subs:>9}{act:>7}  "
              f"{(r.get('type') or '?'):<10}{r.get('promo', ''):<18}{r.get('note', '')}")

    (STATE / "reddit-subreddits.json").write_text(
        json.dumps({"date": datetime.date.today().isoformat(), "rows": rows},
                   ensure_ascii=False, indent=2))
    print("\n已寫 state/reddit-subreddits.json")
    print("→ 從上表圈 5–6 個主攻版（建議：T1 養信任 2–3 個 + T2 買家意圖 2 個 + T3 帶連結 1 個）。")
    print("  ⚠️ 自推判斷是關鍵字粗判，發前仍由合規 agent 細讀該版完整規則。")


if __name__ == "__main__":
    main()
