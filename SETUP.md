# 新機器設定指南

在另一台 Mac 上重現這套 Remotion 影片產線＋Claude Code 工作環境。前提：目標機器是**完整 Mac**（不是 headless Linux 雲端），因為部分工具（`~/.claude/scripts/` 底下的桌面自動化腳本）用到 macOS Accessibility API。

## 0. 三個 repo

| Repo | 可見性 | 內容 |
|---|---|---|
| [Remotion](https://github.com/maxwu1981/Remotion) | 公開 | 影片產線本體：程式碼、腳本、production-scale 素材清單 |
| [claude-dotfiles](https://github.com/maxwu1981/claude-dotfiles) | 私有 | 全域 Claude Code 設定（CLAUDE.md／skills／scripts／settings.json） |
| [remotion-private-content](https://github.com/maxwu1981/remotion-private-content) | 私有 | 記憶系統備份（`.claude-memory-backup/`） |

## 1. Homebrew 套件

```bash
brew install node ffmpeg tesseract jq git-filter-repo gh
```

- `node`：目前開發用 v24.16.0，`package.json` 的 `engines.node` 要求 `>=20.0.0`。
- `ffmpeg`／`tesseract`：影片處理／OCR 驗證（`scripts/verify-highlights-ocr.py`）。
- `jq`：`scripts/fetch-assets.sh` 解析 `assets-manifest.json` 要用。
- `git-filter-repo`：只有要重寫 git 歷史（例如徹底清除 `public/trips` 舊照片紀錄）才需要，平常用不到。
- `gh`：GitHub CLI，`gh auth login` 登入你自己的帳號。

## 2. Clone 三個 repo

```bash
git clone https://github.com/maxwu1981/Remotion.git
git clone https://github.com/maxwu1981/claude-dotfiles.git
git clone https://github.com/maxwu1981/remotion-private-content.git
```

建議把 `claude-dotfiles` 跟 `remotion-private-content` clone 在 `Remotion` 的同層目錄（`scripts/sync-memory.sh` 預設抓 `../remotion-private-content`，抓不到路徑不對可用 `PRIVATE_CONTENT_REPO_PATH` 環境變數指定）。

## 3. 裝 Claude Code 全域設定（dotfiles）

```bash
cp ~/claude-dotfiles/CLAUDE.md ~/.claude/CLAUDE.md
cp ~/claude-dotfiles/settings.json ~/.claude/settings.json
mkdir -p ~/.claude/skills ~/.claude/scripts
cp -R ~/claude-dotfiles/skills/* ~/.claude/skills/
cp -R ~/claude-dotfiles/scripts/* ~/.claude/scripts/
chmod +x ~/.claude/scripts/*.sh
```

6 個外部技能（`find-skills`／`frontend-design`／`grill-me`／`higgsfield-generate`／`remotion-best-practices`／`ui-ux-pro-max`）不在 dotfiles repo 裡，是透過技能市集從公開 GitHub 安裝的，用 `find-skills` 技能重新裝（來源列在 `claude-dotfiles/README.md`）。

`~/.claude/scripts/imswitch` 是預編譯 Swift binary，如果新機器處理器架構不同跑不動：

```bash
swiftc ~/.claude/scripts/imswitch.swift -o ~/.claude/scripts/imswitch
```

## 4. 裝 Remotion 專案依賴

```bash
cd Remotion
npm install
python3 -m pip install -r requirements.txt --break-system-packages
playwright install chromium
```

`requirements.txt` 裡特別註明：**不要**額外裝 `torch`／`torchaudio`／`numpy`／`ChatTTS`，那是廢棄實驗腳本（`scripts/chattts-*.py`）才用得到，正式產線配音全部走 `edge-tts`。

## 5. 記憶系統還原

```bash
cd Remotion
./scripts/sync-memory.sh push
```

這會把 `remotion-private-content/.claude-memory-backup/` 的內容複製回 `~/.claude/projects/<路徑編碼>/memory/`（腳本會自動算出這台機器、這個路徑對應的編碼，細節見腳本開頭註解）。如果目標資料夾已經有內容，腳本會先確認才覆蓋。

日常在**原本那台機器**上，改用 `./scripts/sync-memory.sh pull` 把最新記憶備份回 `remotion-private-content`（自動 commit+push）。

## 6. 素材還原（public/ 大型媒體）

前提：**Google Drive 桌面版**已安裝、已用 `finalaaaa@gmail.com` 登入、`Remotion-Assets-Archive` 資料夾已同步完成（在 Finder 裡確認檔案圖示不是雲朵符號）。

```bash
cd Remotion
./scripts/fetch-assets.sh
```

會照 `assets-manifest.json`（4278 個檔案、約 2.67GB：旅遊照片、旁白 mp3、螢幕截圖素材庫、AI 生成片段等）從 Drive 複製回 `public/` 對應位置，複製完自動抽樣核對 20 筆 checksum。這些資料夾故意不進 git（見 `.gitignore`），只存在 Google Drive。

## 7. YouTube 上傳工具重新登入

外部工具資料夾（**永遠不進任何 git repo**）：`~/Documents/Claude/Projects/Video to Youtube/`。

1. 這個資料夾本身要手動搬過去（AirDrop／隨身碟／自己重新整理都行），**只搬程式碼跟 `client_secrets.json`，不要搬 `.yt_token*.json`**（那是舊機器的登入憑證，新機器要重新產生）。
   - `client_secrets.json` 是 Google Cloud Console 註冊的「應用程式」憑證，不是「使用者」憑證——沒有這支重新登入也發動不了，跟 `.yt_token*.json` 是兩回事。真的連這支都遺失，要回 Google Cloud Console 該專案的「憑證」頁重新下載。
2. 裝 Python 依賴：
   ```bash
   cd "~/Documents/Claude/Projects/Video to Youtube"
   pip3 install google-auth google-auth-oauthlib google-api-python-client --break-system-packages
   ```
   （或直接跑資料夾裡現成的 `_install_deps.command`）
3. 跑任一支會觸發登入的腳本（例如 `python3 yt_upload.py --help` 或實際上傳一支影片），瀏覽器會跳出 Google 登入頁，選 `jinqing-gallery@gmail.com` 帳號、按同意，就會在本機產生新的 `.yt_token.json`。

## 8. 驗證

```bash
cd Remotion
npm run dev
```

確認 Remotion Studio 能開起來、之前的影片專案（`src/videos/*`）都看得到縮圖。想更完整驗證可以挑一支既有影片跑 `npm run render:xxx` 實際算繪一小段。

---

**沒有寫進這份文件、但你可能會需要的**：小紅書／Reddit／Instagram 等其他平台的登入憑證（`cookies.json`、`automation/reddit.env`）也都不在任何 git repo 裡，沿用跟 YouTube 一樣的邏輯——舊機器手動搬過去，或在新機器上重新走一次各平台的登入流程。
