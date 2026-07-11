# ai-wisdom-video plugin

Ai-Wisdom 影片產線的 5 個 skills 打包版（與 `.claude/skills/` 內容同源；`makevideo` 已於 2026-07-11 移除、功能全併入 Max1）：

| Skill | 用途 |
|---|---|
| `Max1` | 影片產線唯一入口，4 種起點：A 全新／B 工廠草稿／C 跟操長片／D 每日自動草稿（/ai-wisdom-video:Max1） |
| `veo-reel` | Flow(Veo) 生 clip → Remotion 串片 |
| `visual-skills` | AI 影片分鏡/提示詞方法論 |
| `ship` | lint/型別/測試 → 草擬繁中 commit |
| `commit-zh` | 繁中 Conventional Commits |

## 安裝（在互動 session 執行一次）

```
/plugin marketplace add /Users/maxwu/Remotion
/plugin install ai-wisdom-video@ai-wisdom
```

裝好後 skills 以 `ai-wisdom-video:<name>` 命名空間出現，任何專案都能用。

## 注意

- ⚠️ 部分 skill 內的路徑寫死 `/Users/maxwu/Remotion` 與 `~/Documents/Claude/Projects/Video to Youtube/`，換機器要同步這兩個目錄。
- 專案內 `.claude/skills/` 原版仍在（雙保險）；確認 plugin 版運作正常後，可刪 `.claude/skills/` 內同名者避免重複觸發。
- 更新方式：改 `.claude/skills/` 原版 → 同步 cp 到 `plugins/ai-wisdom-video/skills/` → bump `plugin.json` 的 version。
