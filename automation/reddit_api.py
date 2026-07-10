#!/usr/bin/env python3
"""
Reddit 官方 API 小工具（OAuth）—— 零外部相依，純 urllib（與 scout.py 同風格，不裝 PRAW）。

提供：載入憑證、取 OAuth token、授權後 GET / POST。
給 reddit_radar.py（讀）與 reddit_comment.py（寫）共用。

憑證放 automation/reddit.env（已 gitignore），格式見 reddit.env.example。
script app 用 password grant：需要 client_id / client_secret / username / password。
"""
import json, os, time, base64, pathlib, urllib.request, urllib.parse, urllib.error

ROOT = pathlib.Path(__file__).resolve().parent
ENV = ROOT / "reddit.env"
REQUIRED = ("REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_USERNAME", "REDDIT_PASSWORD")


def load_env():
    """讀 automation/reddit.env；同名系統環境變數可覆蓋（CI/臨時用）。"""
    cfg = {}
    if ENV.exists():
        for line in ENV.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            cfg[k.strip()] = v.strip().strip('"').strip("'")
    for k in REQUIRED + ("REDDIT_USER_AGENT",):
        if os.environ.get(k):
            cfg[k] = os.environ[k]
    return cfg


def have_creds(cfg):
    return all(cfg.get(k) for k in REQUIRED)


def user_agent(cfg):
    # Reddit 規定要有具描述性的 UA，否則容易被限流/封。
    return cfg.get("REDDIT_USER_AGENT") or \
        f"script:ai-wisdom-reddit:v1.0 (by /u/{cfg.get('REDDIT_USERNAME', 'unknown')})"


_token = {}


def get_token(cfg):
    if _token.get("val") and _token.get("exp", 0) > time.time() + 30:
        return _token["val"]
    if not have_creds(cfg):
        raise RuntimeError("缺憑證：請填 automation/reddit.env（見 reddit-playbook.md 註冊步驟）。")
    auth = base64.b64encode(f"{cfg['REDDIT_CLIENT_ID']}:{cfg['REDDIT_CLIENT_SECRET']}".encode()).decode()
    data = urllib.parse.urlencode({
        "grant_type": "password",
        "username": cfg["REDDIT_USERNAME"],
        "password": cfg["REDDIT_PASSWORD"],
    }).encode()
    req = urllib.request.Request(
        "https://www.reddit.com/api/v1/access_token", data=data,
        headers={"Authorization": f"Basic {auth}", "User-Agent": user_agent(cfg)})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            j = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"OAuth 取 token 失敗 HTTP {e.code}: {e.read().decode()[:200]}")
    if "access_token" not in j:
        raise RuntimeError(f"OAuth 回應無 token（帳密或 app 型別錯？需 script app）：{j}")
    _token["val"] = j["access_token"]
    _token["exp"] = time.time() + j.get("expires_in", 3600)
    return _token["val"]


def api_get(cfg, path, params=None):
    url = "https://oauth.reddit.com" + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(
        url, headers={"Authorization": f"bearer {get_token(cfg)}", "User-Agent": user_agent(cfg)})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read())


def api_post(cfg, path, data):
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(
        "https://oauth.reddit.com" + path, data=body,
        headers={"Authorization": f"bearer {get_token(cfg)}", "User-Agent": user_agent(cfg)})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"API POST {path} 失敗 HTTP {e.code}: {e.read().decode()[:300]}")


def me(cfg):
    """回傳目前帳號資訊（karma / 帳齡），用來判斷養號進度。"""
    return api_get(cfg, "/api/v1/me")
