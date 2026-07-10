#!/usr/bin/env python3
"""
Reddit 留言發布 —— 官方 API 寫入，但內建「養號保險」（新號低 karma 別被秒封）。

預設 --dry-run（只印不發）；要真的發要加 --confirm。
保險：① 每日上限 ② 養號期含連結→拒發（karma 不夠）③ 全程寫 log。

用法：
  python3 automation/reddit_comment.py whoami                         # 看自己 karma/帳齡（養號進度）
  python3 automation/reddit_comment.py --thread <url|id> --text-file draft.md          # 預演（dry-run）
  python3 automation/reddit_comment.py --thread <url|id> --text-file draft.md --confirm # 真的發
  python3 automation/reddit_comment.py --thread <url> --text "..." --parent t1_xxx      # 回某則留言

旗標：
  --max-per-day N   覆蓋每日上限（預設 3）
  --link-karma N    覆蓋「可帶連結」的最低 comment karma（預設 50）
"""
import sys, re, json, time, datetime, pathlib, argparse
import reddit_api as R

ROOT = pathlib.Path(__file__).resolve().parent
STATE = ROOT / "state"; STATE.mkdir(exist_ok=True)
LOG = STATE / "reddit-actions.json"

DEFAULT_MAX_PER_DAY = 3
DEFAULT_LINK_KARMA = 50
URL_RE = re.compile(r"https?://|www\.|youtu\.?be|youtube\.com", re.I)


def load_log():
    if LOG.exists():
        return json.loads(LOG.read_text())
    return {"posts": []}


def save_log(d):
    LOG.write_text(json.dumps(d, ensure_ascii=False, indent=2))


def posts_today(log):
    today = datetime.date.today().isoformat()
    return [p for p in log["posts"] if p.get("date") == today]


def post_fullname(thread):
    """從 URL 或 id 取出貼文 fullname t3_xxx。"""
    if thread.startswith("t3_"):
        return thread
    m = re.search(r"/comments/([a-z0-9]+)", thread)
    pid = m.group(1) if m else thread.strip()
    return "t3_" + pid


def cmd_whoami(cfg):
    info = R.me(cfg)
    created = info.get("created_utc", 0)
    age_days = (time.time() - created) / 86400 if created else 0
    ck = info.get("comment_karma", 0)
    print(f"u/{info.get('name')}")
    print(f"  comment karma: {ck}")
    print(f"  link karma   : {info.get('link_karma', 0)}")
    print(f"  帳齡         : {age_days:.0f} 天")
    ok_link = ck >= DEFAULT_LINK_KARMA and age_days >= 14
    print(f"  養號狀態     : {'✅ 可開始偶爾帶連結' if ok_link else '🔒 仍在養號期 → 只留言、別帶連結'}"
          f"（門檻：comment karma ≥ {DEFAULT_LINK_KARMA} 且帳齡 ≥ 14 天）")
    return info


def cmd_comment(cfg, args):
    text = ""
    if args.text_file:
        text = pathlib.Path(args.text_file).read_text().strip()
    elif args.text:
        text = args.text.strip()
    if not text:
        sys.exit("✗ 沒有留言內容（--text 或 --text-file 擇一）。")
    if not args.thread and not args.parent:
        sys.exit("✗ 需要 --thread <貼文 url/id>（或 --parent <留言 fullname>）。")

    parent = args.parent or post_fullname(args.thread)
    has_link = bool(URL_RE.search(text))

    # 查 karma（養號保險用）
    info = R.me(cfg)
    ck = info.get("comment_karma", 0)
    created = info.get("created_utc", 0)
    age_days = (time.time() - created) / 86400 if created else 0

    log = load_log()
    today_n = len(posts_today(log))

    print("=== 預備發布 ===")
    print(f"  帳號     : u/{info.get('name')}  (comment karma {ck}, 帳齡 {age_days:.0f} 天)")
    print(f"  parent   : {parent}")
    print(f"  今日已發 : {today_n}/{args.max_per_day}")
    print(f"  含連結   : {'是 ⚠️' if has_link else '否'}")
    print("  ---- 留言內容 ----")
    print("  " + text.replace("\n", "\n  "))
    print("  ------------------")

    # 保險 1：每日上限
    if today_n >= args.max_per_day:
        sys.exit(f"✗ 今日已達上限 {args.max_per_day} 則 → 停手（養號期別洗版）。")
    # 保險 2：養號期含連結→拒發
    if has_link and (ck < args.link_karma or age_days < 14):
        sys.exit(f"✗ 養號期拒發含連結留言（comment karma {ck} < {args.link_karma} 或 帳齡 {age_days:.0f} < 14 天）。\n"
                 f"  先拿掉連結、純給價值；karma/帳齡到門檻再帶。")

    if not args.confirm:
        print("\n(dry-run) 沒有真的發。確認 OK 後加 --confirm 再跑一次。")
        return

    # 真的發
    resp = R.api_post(cfg, "/api/comment", {"api_type": "json", "thing_id": parent, "text": text})
    errs = resp.get("json", {}).get("errors", [])
    if errs:
        sys.exit(f"✗ Reddit 回報錯誤：{errs}")
    things = resp.get("json", {}).get("data", {}).get("things", [])
    permalink = ""
    if things:
        d = things[0].get("data", {})
        permalink = "https://www.reddit.com" + d.get("permalink", "")
    log["posts"].append({
        "ts": datetime.datetime.now().isoformat(timespec="seconds"),
        "date": datetime.date.today().isoformat(),
        "parent": parent, "permalink": permalink,
        "has_link": has_link, "karma_at": ck,
        "preview": text[:80],
    })
    save_log(log)
    print(f"\n✅ 已發布：{permalink or '(取回 permalink 失敗，但已送出)'}")
    print(f"   已記錄到 state/reddit-actions.json（今日 {today_n + 1}/{args.max_per_day}）")


def main():
    cfg = R.load_env()
    if not R.have_creds(cfg):
        sys.exit("✗ 缺 Reddit 憑證 → 先 `cp automation/reddit.env.example automation/reddit.env` 填好。\n"
                 "  註冊步驟見 automation/reddit-playbook.md「① 5 分鐘註冊 script app」。")
    if len(sys.argv) >= 2 and sys.argv[1] == "whoami":
        cmd_whoami(cfg)
        return
    ap = argparse.ArgumentParser()
    ap.add_argument("--thread", help="貼文 URL 或 id（在該貼文下發頂層留言）")
    ap.add_argument("--parent", help="回某則留言：其 fullname，如 t1_xxxxxx（覆蓋 --thread）")
    ap.add_argument("--text", help="留言內容（行內）")
    ap.add_argument("--text-file", help="留言內容檔（建議：先寫成 md 過稿）")
    ap.add_argument("--confirm", action="store_true", help="真的發布（否則 dry-run）")
    ap.add_argument("--max-per-day", type=int, default=DEFAULT_MAX_PER_DAY)
    ap.add_argument("--link-karma", type=int, default=DEFAULT_LINK_KARMA)
    args = ap.parse_args()
    cmd_comment(cfg, args)


if __name__ == "__main__":
    main()
