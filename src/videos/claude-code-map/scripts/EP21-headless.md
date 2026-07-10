# EP21 · Headless 非互動模式是什麼?(第 21 / 30 站)

## GEO
- **標題**:Claude Code 怎麼不開介面也能跑?認識 headless 模式 claude -p
- **一句話描述**:用 claude -p 在不開互動介面下跑單一任務,可把資料 pipe 進來、塞進 build 腳本或 CI,並取得結構化輸出。
- **標籤**:Claude Code, headless, claude -p, CI, 新手教學

## 你在這 / 下一步
- **高亮**:節點 21 `headless`(E 自動化與部署)·關係線:促成自動化(→23 routines)
- **已學**:1–20
- **下一步**:EP22 · /loop 與排程
- **來源**:https://code.claude.com/docs/en/headless

## 腳本(六段)
### 1 鉤子
要讓它「自動跑」,第一步是讓它「不用人坐在前面也能跑」。這叫 headless。
### 2 你在這
地圖第 21 站,進入第五章「自動化與部署」。它是後面排程的基礎(連到第 23)。
### 3 定義
Headless 就是用 claude -p,在不開互動介面的情況下跑一個任務,直接給你結果。它能把資料 pipe 進去、塞進 build 腳本或 CI、還能要求結構化輸出(像 JSON)方便程式接手。它遵循 Unix 哲學,可以跟其他指令串起來。
### 4 例子 / demo
新聞小助手的核心動作可以這樣跑:cat 今天的網址清單,pipe 給 claude -p「整理成 5 則繁中摘要」,輸出存檔。整段不需要你坐在那兒。
### 5 下一步
能無人跑單次了。下一站第 22 號:在一個 session 內「重複跑」——/loop 與排程。
### 6 結尾 CTA
第 21 站打勾!訂閱繼續。來源:官方 headless,連結在描述。

## Demo 腳本(畫面)
- 你在這:節點 21 高亮;虛線到節點 23(促成自動化)。
- 定義:`claude -p` 指令卡;pipe 流程圖(資料 → claude -p → 結構化輸出)。
- demo:`cat sources.txt | claude -p "整理成 5 則繁中摘要" > summary.md`。
- 下一步:鏡頭滑向節點 22。

## YouTube 描述(草稿)
Claude Code 怎麼不開介面也能跑?headless 模式用 claude -p 在非互動下跑單一任務,可 pipe 資料、塞進 build/CI、取得結構化輸出。這集用它跑新聞小助手的核心動作。Claude Code 新手地圖第 21 站。

⏱️ 0:00 不用人坐前面 / 0:20 自動化的基礎 / 0:35 claude -p 是什麼 / 0:55 pipe 跑摘要 / 1:15 下一站:/loop 與排程

❓FAQ
Q:headless 能互動嗎?A:不行,它是一次性、非互動;要排程見 EP22/EP23。
Q:能拿 JSON 嗎?A:能,用 --output-format json。

🔗 https://code.claude.com/docs/en/headless
#ClaudeCode #headless

## VO cues
| cue | 文字 |
|---|---|
| e21-hook1 | 要讓它自動跑,第一步是讓它不用人坐在前面也能跑。這叫 headless。 |
| e21-here1 | 地圖第 21 站,進入第五章自動化與部署。它是後面排程的基礎。 |
| e21-def1 | Headless 就是用 claude -p,在不開互動介面的情況下跑一個任務,直接給你結果。 |
| e21-def2 | 它能把資料 pipe 進去、塞進 build 腳本或 CI、還能要求結構化輸出像 JSON 方便程式接手。 |
| e21-def3 | 它遵循 Unix 哲學,可以跟其他指令串起來。 |
| e21-demo1 | 新聞小助手的核心動作可以這樣跑:cat 今天的網址清單,pipe 給 claude -p 整理成 5 則繁中摘要,輸出存檔。 |
| e21-demo2 | 整段不需要你坐在那兒。 |
| e21-next1 | 能無人跑單次了。下一站第 22 號:在一個 session 內重複跑,/loop 與排程。 |
| e21-cta1 | 第 21 站打勾!訂閱繼續。來源:官方 headless。 |
