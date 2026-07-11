# 每日影片工廠 — 發布 runbook

> **runbook A（每日建片）已於 2026-07-11 併入 `.claude/skills/Max1/SKILL.md` 的「D 起點：每日自動草稿」**，
> 那裡是建片流程的**單一事實來源**——排程 task `daily-video-factory`（每天 06:00）直接照它執行，本檔不再重複。
> 本檔只剩 **runbook B（發今天的）**。維運速查（Mac 喚醒/預授權/疑難排解）見 `automation/CHEATSHEET.md`。

遵守：繁中＋技術詞英文、正面語氣（**不用「坑」**，用 經驗/終於發現/解法）、GEO 公式、[[geo-first-publishing]]。

---

## B. 發今天的（老闆本機看過 `out/vf-daily.mp4`、確認要發佈時說「發今天的」）

1. 讀 `automation/state/daily-runs.json`，取**最新一筆 status 為 `"rendered_pending_review"` 或 `"unlisted"`** 的紀錄。
   （若 `out/vf-daily.mp4` 已被隔天算繪覆蓋，成品在 `out/youtube-videos/<topic id>/<topic id>.mp4`——render_daily.py 每天自動歸檔。）
2.（可選）使用者要改標題/縮圖就先處理（縮圖＝老闆自己用 Gemini 生、告訴 Claude 檔案路徑）。
3. 若該筆 `status == "rendered_pending_review"`（尚未上傳）→ **先上傳成不公開**：
   ```
   python3 "$HOME/Documents/Claude/Projects/Video to Youtube/yt_upload.py" \
     --video <video_path> --title "<title>" \
     --description "<description>" \
     --tags "<tags>" --category 28 --privacy unlisted \
     [--thumbnail <老闆提供的縮圖路徑，若有]
   ```
   從輸出抓 **video_id / url**，把該筆 `status` 改成 `"unlisted"` 並記下 `video_id`/`url`。（網路：本機原生執行；經 Bash 工具時加 `dangerouslyDisableSandbox`。）
4. 轉公開：
   ```
   python3 "$HOME/Documents/Claude/Projects/Video to Youtube/yt_publish.py" --video-id <ID> --privacy public
   ```
5. 把該筆 `status` 改成 `"public"`。
6. **刷新影片中心靜態快照（GEO：讓新片對 AI 引擎可見）**：`npm run snapshot` → 把 `docs/index.html` 與 `docs/sitemap.xml` 的更動 `git add docs && git commit && git push`（GitHub Pages 從 main/docs 部署，push 後幾分鐘生效）。快照只收**公開**影片，所以一定在轉公開後才跑。
7. 在對話直接回報公開連結即可（老闆本來就在對話中主動觸發，**不再另發 iMessage**）。
