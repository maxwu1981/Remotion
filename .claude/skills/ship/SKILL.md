---
name: ship
description: |
  出貨前收尾：依序跑 linter／型別檢查與測試，全部通過後，依「繁體中文 + Conventional Commits」草擬一份 commit 訊息給我看。
  只在我輸入 /ship 時執行；草擬而已，不會自動 commit。
disable-model-invocation: true
allowed-tools: Bash(npx eslint*) Bash(npx tsc*) Bash(npm test*) Bash(git status*) Bash(git diff*) Bash(git add*) Bash(git commit*)
---

# /ship — 出貨前檢查 + 草擬 commit

依序做以下三步。**任何一步失敗就停下來、清楚回報卡在哪一步、貼出錯誤訊息，不要繼續、也不要 commit。**

## 1. Linter／型別檢查（只查「本次改動」的檔）
這個 repo 有不少既有 lint 債，所以**只檢查這次改到的檔**，不要被別人的舊錯卡住。
1. 抓出本次改動且仍存在的 TS 檔：`git diff --name-only HEAD -- 'src/**/*.ts' 'src/**/*.tsx'` 再加上未追蹤的（`git status --porcelain` 裡 `??` 的同類檔）。
2. 沒有任何 src 下的 TS 檔改動 → 說明「本次無 TS 改動」，跳過 lint，進下一步。
3. 有 → 對「那些檔」跑 `npx eslint <檔們>`。有 error 就停、列出檔案與行號。
4. 型別：跑 `npx tsc --noEmit`，但**只把路徑落在「本次改動檔」清單裡的 error 當成阻擋**；其餘既有 error 只摘要一句「另有 N 個既有型別錯（非本次改動）」、不阻擋。
- 本次改動的檔全綠 → 進下一步。

## 2. 測試
跑 `npm test`。
- 有測試且全過 → 進下一步。
- 若輸出是「missing script: test」或專案本來就沒有測試 → 註明「本專案目前無測試」，當作通過、繼續（不算失敗）。
- 測試有失敗 → 停下，貼出失敗的測試，不要 commit。

## 3. 草擬 commit 訊息（草擬而已，不要自動 commit）
先看實際改了什麼：`git status --short`，再 `git diff`（若已有 staged 就看 `git diff --staged`）。
依下面格式草擬，**標題用繁體中文**：

```
<type>: <一句話繁中描述，動詞開頭，≤ 30 字>

- <為什麼這樣改 / 影響範圍，每點一行>
```

- `type` 從 `feat`／`fix`／`docs`／`refactor`／`style`／`test`／`chore` 擇一。
- 標題只講「做了什麼」，不要列一長串檔名；混了多個邏輯改動就分行條列。
- 不加結尾署名、不加無關 emoji。

**把草擬好的訊息貼給我看，等我回「commit」或「可以」再執行 `git commit`。在那之前，絕不自己 commit。**
