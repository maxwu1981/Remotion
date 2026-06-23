---
name: commit-zh
description: |
  產生 git commit 訊息時使用：把目前的程式碼改動寫成「繁體中文 + Conventional Commits」格式的提交訊息。
  當用戶說「幫我寫 commit」「寫個提交訊息」「commit 訊息」「幫我 commit」時觸發。
---

# commit-zh — 繁中 Conventional Commit 產生器

當用戶要你寫 commit 訊息時，照以下規則產出：

## 步驟
1. 跑 `git diff --staged`（沒 staged 就 `git diff` + `git status`）看實際改了什麼。
2. 判斷類型，挑一個 type：`feat`（新功能）、`fix`（修 bug）、`docs`（文件）、`refactor`（重構）、`style`（格式）、`test`（測試）、`chore`（雜項）。
3. 用這個格式輸出，**標題用繁體中文**：

   ```
   <type>: <一句話繁中描述，動詞開頭，≤ 30 字>

   - <為什麼這樣改 / 影響範圍，每點一行>
   ```

## 規則
- 標題只講「做了什麼」，不要寫檔名清單。
- 一次只描述一個邏輯改動；混在一起就分行條列。
- 不要加結尾署名、不要加無關 emoji。
- 寫完先把訊息給用戶看、**等確認再執行 `git commit`**。
