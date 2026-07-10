import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-manifest.json";
import { WhiteBg, ACC, darkCard, Glare, rgba } from "./glass";
import { YtUploadCover } from "./Cover";
import {
  Mark,
  SceneProps,
  Box,
  ShotSeg,
  ShotScene,
  DemoScene,
  PainScene,
  MapScene,
  DailyScene,
  OutroScene,
  PromptCard,
  MasterPromptScene,
  AccessBlockedMock,
  RenameMock,
  PipFixMock,
  UploadRunMock,
  SecurityMock,
  ChecksMock,
  TokenMock,
} from "./Scenes";

/**
 * 「YouTube 上片全自動化」實戰自動化系列 EP02 (16:9, 1920×1080, 30fps)。
 * 主軸=Claude 帶我做一次性 5 分鐘設定,之後上傳全自動。
 * 畫面主角=2026-06-04 實錄截圖(ShotScene 裁瀏覽器分頁列+遮個資)。
 * 防抖:淺底全片靜態墊底,景間只 fade 內容;字幕/概念錨 opacity 淡入。
 */
const FPS = 30;
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 16;
const GAP = 8;
const TAIL = 22;
const XFADE = 11;
const COVER = 66; // 0:00 封面亮相 2.2s

type Line = { id: string; cap: string; pad?: number };
/** promptText:該景第一句(prompt 句)期間,全幀閃一張 💬 PromptCard overlay(逐字對照 yt_upload.py)。 */
type SceneDef = { key: string; chapter: number; lines: Line[]; Comp: React.FC<SceneProps>; promptText?: string };

const OSpan: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ACC.ember }}>{children}</span>
);
/** 概念錨(頂帶;index = SceneDef.chapter)。 */
const ANCHORS: React.ReactNode[] = [
  <>一句指令,<OSpan>影片上線</OSpan></>,
  <>官方正門 = <OSpan>YouTube Data API</OSpan></>,
  <><OSpan>一次性設定</OSpan> vs 每次全自動</>,
  <>專案 = <OSpan>API 的家</OSpan></>,
  <>啟用 = <OSpan>申請能力</OSpan></>,
  <>同意畫面 = <OSpan>授權門面</OSpan></>,
  <>測試使用者 = <OSpan>白名單</OSpan></>,
  <><OSpan>client_secrets.json</OSpan> = 身分證</>,
  <>環境差異,<OSpan>Claude 自動繞</OSpan></>,
  <>未驗證警告 = <OSpan>正常</OSpan></>,
  <>token = <OSpan>上傳通行證</OSpan></>,
  <>描述檔 = <OSpan>上片說明書</OSpan></>,
];

const cap = (id: string, cap: string, pad?: number): Line => ({ id, cap, pad });

/* ── 遮罩座標(% of 裁切後截圖;mac 截圖為全圖 %) ── */
const M_PROJ_WELCOME: Box[] = [{ x: 8.5, y: 43, w: 38, h: 6 }];
const M_PROJ_PICKER: Box[] = [{ x: 53.5, y: 42.5, w: 26, h: 10 }];
const M_PROJ_CREATED: Box[] = [{ x: 26, y: 70, w: 17, h: 11 }];
const M_CONSENT_EMAIL: Box[] = [{ x: 22.5, y: 52, w: 43, h: 6.5 }];
const M_CLIENT_ID: Box[] = [{ x: 45.5, y: 52, w: 29, h: 14 }];
const M_SCOPE_EMAIL: Box[] = [{ x: 16.5, y: 41, w: 21, h: 5 }];
const M_LOCALHOST_URL: Box[] = [{ x: 12, y: 0.6, w: 42, h: 4.5 }];
const M_TERMINAL_USER: Box[] = [{ x: 1, y: 52.5, w: 24, h: 3.5 }];

const RAW = "yt-upload-ep02/raw";
const shots = (title: string, segs: ShotSeg[], mac?: boolean): React.FC<SceneProps> => {
  const C: React.FC<SceneProps> = (p) => <ShotScene {...p} title={title} segs={segs} mac={mac} />;
  return C;
};

const SCENES: SceneDef[] = [
  { key: "demo", chapter: 0, Comp: DemoScene, lines: [
    cap("c1-1", "算繪完成後,我只對 Claude 說了一句話:上傳"),
    cap("c1-2", "60 秒後,連結交回我手上:標題、描述、隱私全填好", 40),
    cap("c1-3", "沒開瀏覽器、沒拖檔案、沒填表單,全程沒碰 YouTube"),
    cap("c1-4", "代價=一次性 5 分鐘設定;之後每支影片,永遠自動"),
    cap("c1-5", "這支片把那 5 分鐘拆成實際畫面,含我踩過的 3 個坑"),
  ] },
  { key: "pain", chapter: 1, Comp: PainScene, lines: [
    cap("c2-1", "手動上傳:開 Studio、拖檔、等進度、填標題、貼描述、打標籤、設隱私", 40),
    cap("c2-2", "一支 10 分鐘;一週三支,一個月=2 小時純體力活"),
    cap("c2-3", "重複操作最容易出錯,網路上滿是這種哀嚎", 70),
    cap("c2-5", "YouTube 留了正門:官方 YouTube Data API v3"),
    cap("c2-6", "但要先過 Google Cloud 憑證設定:OAuth、同意畫面、用戶端 ID"),
    cap("c2-7", "Claude 帶著我走過一次,全程截圖存證,照著走就好"),
  ] },
  { key: "map", chapter: 2, Comp: MapScene, lines: [
    cap("c3-1", "整條自動上片產線,分成兩段"),
    cap("c3-2", "左:一次性設定,人只動手這一次,約 5 分鐘"),
    cap("c3-3", "右:每次全自動,描述檔→腳本→API 收件→連結回報"),
    cap("c3-4", "兩段中間的橋樑,是兩個小檔案"),
    cap("c3-5", "client_secrets.json=身分證;token=通行證"),
    cap("c3-6", "身分證辦一次,通行證自動保存,之後直接進門"),
    cap("c3-tp", "整條路,你開場先給 Claude 一句總說明,它就一步步帶你走"),
  ] },
  { key: "proj", chapter: 3, promptText: "Claude，教我在 Google Cloud Console 建一個新專案叫 youtube-uploader，建好怎麼切換過去，一步步說。", Comp: shots("Google Cloud Console — 建立專案", [
    { from: 1, img: `${RAW}/ch4-01-console-welcome.png`, masks: M_PROJ_WELCOME, note: "① 打開 Cloud Console · 用頻道帳號登入" },
    { from: 2, img: `${RAW}/ch4-02-project-picker.png`, masks: M_PROJ_PICKER, note: "上方專案選單 → 新建項目" },
    { from: 3, img: `${RAW}/ch4-03-new-project-form.png`, note: "命名 youtube-uploader → 創建" },
    { from: 4, img: `${RAW}/ch4-04-project-created.png`, masks: M_PROJ_CREATED, note: "建立完成 · 記得切換到新專案" },
  ]), lines: [
    cap("c4-0p", "你只要跟 Claude 說:教我建一個叫 youtube-uploader 的專案"),
    cap("c4-1", "開工:打開 Google Cloud Console,用頻道那個帳號登入"),
    cap("c4-2", "上方專案選單→新增專案,名字隨意,我取 youtube-uploader"),
    cap("c4-3", "建立,然後記得切換到這個新專案"),
    cap("c4-4", "專案=容器:等下開的 API、發的憑證都掛在它下面"),
  ] },
  { key: "api", chapter: 4, promptText: "Claude，教我在這個專案啟用 YouTube Data API v3，搜尋列打什麼、按哪個鈕。", Comp: shots("Google Cloud Console — 啟用 API", [
    { from: 1, img: `${RAW}/ch5-01-search-api.png`, note: "② 搜尋列輸入 YouTube Data API v3" },
    { from: 2, img: `${RAW}/ch5-02-enable-api.png`, note: "點「啟用」", focus: { x: 16.4, y: 51.8, w: 6.5, h: 5 } },
  ]), lines: [
    cap("c5-0p", "跟 Claude 說:教我啟用 YouTube Data API"),
    cap("c5-1", "第二步:搜尋列輸入 YouTube Data API v3,點進去"),
    cap("c5-2", "按下藍色的「啟用」"),
    cap("c5-3", "= 告訴 Google:我這個專案要用「上傳影片」這個能力"),
    cap("c5-4", "到這裡都只是點按鈕;坑,從下一章開始"),
  ] },
  { key: "consent", chapter: 5, promptText: "Claude，教我設定 OAuth 同意畫面：User Type 選外部，App 名稱和支援信箱怎麼填。", Comp: shots("Google Cloud Console — OAuth 同意畫面", [
    { from: 1, img: `${RAW}/ch6-01-consent-appinfo.png`, masks: M_CONSENT_EMAIL, note: "③ API 和服務 → OAuth 同意畫面" },
    { from: 2, img: `${RAW}/ch6-02-consent-external.png`, note: "User Type 選「外部 External」" },
    { from: 3, img: `${RAW}/ch6-03-consent-finish.png`, note: "三個欄位都填自己 email → 一路儲存 → 創建" },
    { from: 4, img: `${RAW}/ch6-04-oauth-overview.png`, note: "OAuth 配置完成 · 這就是授權時的門面" },
  ]), lines: [
    cap("c6-0p", "跟 Claude 說:教我設定 OAuth 同意畫面"),
    cap("c6-1", "第三步:左側選單「API 和服務」→「OAuth 同意畫面」"),
    cap("c6-2", "User Type 選「外部 (External)」→ 建立"),
    cap("c6-3", "App 名稱隨意;支援信箱、聯絡信箱都填自己的 email,一路儲存"),
    cap("c6-4", "這個畫面=等下授權跳出來時,你看到的應用程式門面"),
    cap("c6-5", "5 分鐘後你會再見到它,帶著一個嚇人的警告,先賣個關子"),
  ] },
  { key: "testuser", chapter: 6, promptText: "Claude，教我把要授權的 Google 帳號加進「測試使用者」白名單、在哪裡加；順便解釋為什麼不加會被 Access blocked 擋。", Comp: shots("Google Cloud Console — 測試使用者(頭號坑)", [
    { from: 1, img: `${RAW}/ch7-01-audience-testing.png`, note: "目標對象 (Audience) · 發布狀態=測試" },
    { from: 2, img: `${RAW}/ch7-02-test-users-add.png`, note: "Test users → + Add users → 填授權帳號", focus: { x: 22.6, y: 82.5, w: 10.5, h: 5.5 } },
    { from: 4, node: <AccessBlockedMock /> },
    { from: 8, img: `${RAW}/ch7-02-test-users-add.png`, note: "原則:用哪個帳號授權,哪個就要在白名單" },
  ]), lines: [
    cap("c7-0p", "跟 Claude 說:教我把帳號加進測試使用者白名單"),
    cap("c7-1", "畫面停一下:這是全片最重要的一步"),
    cap("c7-2", "目標對象 Audience → Test users → ADD USERS"),
    cap("c7-3", "把等下要登入授權的那個帳號信箱加進去,儲存"),
    cap("c7-4", "沒加=直接被擋:「存取遭封鎖 Access blocked」"),
    cap("c7-5", "不是你做錯,是測試階段的保護:只有白名單帳號能用"),
    cap("c7-6", "但錯誤訊息不會叫你回來加,Stack Overflow 一堆人卡死在這"),
    cap("c7-7", "實錄裡 Claude 前後提醒我兩次別跳過:翻車率最高的一步"),
    cap("c7-8", "原則:等下用哪個帳號按允許,哪個帳號就要在白名單裡"),
    cap("c7-9", "已經撞上了?回同意畫面補加,再跑一次授權就過"),
  ] },
  { key: "cred", chapter: 7, promptText: "Claude，教我建立「桌面應用程式」的 OAuth 用戶端 ID 並下載 JSON；下載後幫我改名成 client_secrets.json、放到上傳腳本資料夾。", Comp: shots("Google Cloud Console — 憑證檔(坑二)", [
    { from: 1, img: `${RAW}/ch6-04-oauth-overview.png`, note: "④ 建立 OAuth 用戶端", focus: { x: 83, y: 43, w: 14, h: 5.5 } },
    { from: 2, img: `${RAW}/ch8-01-client-type-desktop.png`, note: "應用類型=桌面應用 (Desktop app)", focus: { x: 25, y: 63, w: 12, h: 5.5 } },
    { from: 3, img: `${RAW}/ch8-02-client-created-json.png`, masks: M_CLIENT_ID, note: "已創建 → 下載 JSON", focus: { x: 32, y: 64.8, w: 13, h: 5.5 } },
    { from: 4, node: <RenameMock /> },
    { from: 6, img: `${RAW}/ch8-03-claude-autofix.png`, mac: true, note: "實錄:Claude 自己發現、自己改好、順手驗證" },
    { from: 9, node: <SecurityMock /> },
  ]), lines: [
    cap("c8-0p", "跟 Claude 說:教我建桌面應用憑證,下載後幫我改名成 client secrets 檔"),
    cap("c8-1", "第四步發身分證:憑證→建立憑證→OAuth 用戶端 ID"),
    cap("c8-2", "類型選「桌面應用程式」:腳本在你自己電腦上跑"),
    cap("c8-3", "建立後跳出視窗→下載 JSON"),
    cap("c8-4", "坑二:下載檔名=client_secret_ + 一長串亂碼"),
    cap("c8-5", "要改名成 client_secrets.json,放進腳本資料夾"),
    cap("c8-6", "實錄裡我沒注意,是 Claude 檢查環境時自己發現自己改好"),
    cap("c8-7", "它還順手驗證憑證:桌面應用類型,有效,才往下走"),
    cap("c8-8", "這就是讓 Claude 帶路的原因:它會收拾你漏掉的細節"),
    cap("c8-9", "🔑 client_secrets.json+token=頻道鑰匙:不進 git、不外傳"),
  ] },
  { key: "pkg", chapter: 8, promptText: "Claude，幫我裝 YouTube 上傳要的 Python 套件 google-auth、google-auth-oauthlib、google-api-python-client；pip 太舊不認得參數就換相容方式裝。", Comp: shots("終端機 — 裝套件(坑三)", [
    { from: 1, img: `${RAW}/ch9-01-pip-error-terminal.png`, masks: M_TERMINAL_USER, note: "實錄:雙擊 _install_deps.command" },
    { from: 2, img: `${RAW}/ch9-01-pip-error-terminal.png`, masks: M_TERMINAL_USER, note: "老 pip 21.2.4 不認 --break-system-packages", focus: { x: 0.8, y: 73, w: 27, h: 5 } },
    { from: 3, node: <PipFixMock /> },
    { from: 5, node: <ChecksMock /> },
  ], true), lines: [
    cap("c9-0p", "跟 Claude 說:幫我裝上傳要的 Python 套件,pip 太舊就換相容方式"),
    cap("c9-1", "第五步:裝 Google API 的 Python 套件"),
    cap("c9-2", "坑三=環境差異:安裝指令帶新參數,老 pip 21.2.4 不認得"),
    cap("c9-3", "Claude 不叫我升級 pip:拿掉新參數,換相容指令一次裝成"),
    cap("c9-4", "跳一堆 warning?只是 Python 3.9 老版本提示,不影響"),
    cap("c9-5", "套件✓ 憑證✓ 網路✓ — 三個勾打完"),
    cap("c9-6", "一次性設定的人工部分到此結束;接下來,見證的時刻"),
  ] },
  { key: "auth", chapter: 9, promptText: "Claude，幫我寫上傳腳本：用 client_secrets.json 走 OAuth 桌面流程授權（scope 要 youtube.upload），Token 存起來下次免再授權，然後跑起來讓瀏覽器跳授權頁我來登入。", Comp: shots("Google 授權頁 — 首次授權實錄", [
    { from: 1, img: `${RAW}/ch10-01-unverified-warning.png`, note: "腳本啟動 → 瀏覽器自動彈出" },
    { from: 4, img: `${RAW}/ch10-01-unverified-warning.png`, note: "點「繼續」→ 繼續前往", focus: { x: 62, y: 62.5, w: 9, h: 7 }, avoid: { x: 69.2, y: 62, w: 16.5, h: 8 } },
    { from: 6, img: `${RAW}/ch10-02-scope-checkboxes.png`, masks: M_SCOPE_EMAIL, note: "YouTube 權限全部勾選 → 繼續/允許" },
    { from: 7, img: `${RAW}/ch10-03-localhost-done.png`, masks: M_LOCALHOST_URL, note: "驗證流程已完成 · 這分頁直接關掉" },
    { from: 8, node: <TokenMock /> },
  ]), lines: [
    cap("c10-0p", "跟 Claude 說:幫我寫上傳腳本、走授權,Token 存起來下次免再跑"),
    cap("c10-1", "Claude 啟動上傳腳本,瀏覽器自動彈出:第一次也是唯一一次授權"),
    cap("c10-2", "登入後,嚇人畫面來了:「Google 尚未驗證這個應用程式」"),
    cap("c10-3", "別慌,完全正常:這 app 是你 5 分鐘前自己建的"),
    cap("c10-4", "點「進階」→「繼續前往」"),
    cap("c10-5", "⚠️ 不要點醒目的「返回安全網頁」,那會取消整個流程"),
    cap("c10-6", "下一頁:YouTube 權限全部勾選→繼續→允許"),
    cap("c10-7", "「驗證流程已完成,可關閉視窗」= 成功,localhost 分頁關掉"),
    cap("c10-8", "token 已自動存進資料夾:日常上傳不再跑這套;失效重跑一次 30 秒"),
  ] },
  { key: "result", chapter: 10, Comp: shots("YouTube — 上傳自動跑＋成果", [
    { from: 0, node: <UploadRunMock /> },
    { from: 2, img: `${RAW}/ch11-01-youtube-live.png`, note: "公開上線 · 標題/畫質/時長全對" },
    { from: 3, img: `${RAW}/ch11-01-youtube-live.png`, note: "「仍在处理中」= 高畫質轉檔中,正常", focus: { x: 1, y: 10.5, w: 97, h: 5.5 } },
    { from: 4, img: `${RAW}/ch11-02-video-playing.png`, note: "從此上傳=一句話:Claude,上傳" },
  ]), lines: [
    cap("c11-1", "授權的同時,上傳早就排好隊:授權一過,自動開跑"),
    cap("c11-2", "30MB 影片,30–60 秒跑完;完成瞬間,連結回報"),
    cap("c11-3", "點開:已公開上線,標題、畫質、時長全部正確"),
    cap("c11-4", "剛上傳高畫質要等轉檔幾分鐘,正常,不是壞掉"),
    cap("c11-5", "從此每支影片的上傳=一句話:Claude,上傳"),
  ] },
  { key: "daily", chapter: 11, Comp: (p) => <DailyScene {...p} promptText="把 out 最新的成片上傳,標題描述用這個檔,先設不公開,完成給我連結" />, lines: [
    cap("c12-0p", "以後你只要說:把最新的成片上傳,先設不公開,完成給我連結"),
    cap("c12-1", "講講之後的日常長什麼樣"),
    cap("c12-2", "算繪完,Claude 先寫描述檔:標題/描述/標籤/隱私,先給我過目"),
    cap("c12-3", "標題描述照搜尋+AI 答案引擎胃口:問題開頭、具體數字、章節時間戳"),
    cap("c12-4", "我點頭→一句指令送出;先不公開,檢查完才轉公開"),
    cap("c12-5", "縮圖、播放清單:同一套 API 自動掛上"),
    cap("c12-5b", "配額(2025-12 新制):上傳獨立額度 100 支/天;其他共用 10,000 點/天"),
    cap("c12-6", "頁面會消失,檔案永遠能重來 — 跟小紅書產線同一個中心思想"),
  ] },
  { key: "gift", chapter: -1, Comp: MasterPromptScene, lines: [
    cap("c14-1", "最後,送給看到這裡的你一個禮物", 20),
    cap("c14-2", "這一整段,是把前面每一步合成的一句完整指令"),
    cap("c14-3", "暫停整段複製,貼給 Claude,它就能從零幫你把這套自動上傳建起來", 30),
  ] },
  { key: "outro", chapter: -1, Comp: OutroScene, lines: [
    cap("c13-1", "複盤:建專案→開 API→同意畫面→白名單→憑證改名→裝套件→授權一次"),
    cap("c13-2", "三坑:Access blocked 補白名單/改名 client_secrets.json/老 pip 拿掉新參數"),
    cap("c13-3", "同一套憑證流程:日曆、雲端硬碟、試算表,學一次用到處"),
    cap("c13-4", "寫程式→配音→算繪→上傳 全程式化:影片工廠最後一塊拼圖"),
    cap("c13-5", "幫你省下 5 分鐘摸索的話:訂閱、按讚、分享"),
    cap("c13-6", "我們下支片見"),
  ] },
];

const sceneFrames = (s: SceneDef) =>
  LEAD + s.lines.reduce((a, l) => a + sec(l.id) + (l.pad ?? 0), 0) + (s.lines.length - 1) * GAP + TAIL;

const sceneMarks = (s: SceneDef): Mark[] => {
  let off = LEAD;
  return s.lines.map((l) => {
    const m = { start: off, end: off + sec(l.id) };
    off += sec(l.id) + GAP + (l.pad ?? 0);
    return m;
  });
};

/** 章節開場卡(文字版:步驟眉標+大標;3s)。 */
const INTRO = 84;
const INTRO_CARDS: Record<string, { eyebrow: string; title: string }> = {
  proj: { eyebrow: "一次性設定 · 開工", title: "建 Google Cloud 專案" },
  testuser: { eyebrow: "頭 號 坑", title: "測試使用者白名單" },
  auth: { eyebrow: "見 證 時 刻", title: "首次授權實錄" },
  outro: { eyebrow: "總 結", title: "5 分鐘,換永遠自動" },
};

const INTRO_COUNT = SCENES.filter((s) => INTRO_CARDS[s.key]).length;
export const YT_UPLOAD_FRAMES =
  COVER + SCENES.reduce((a, s) => a + sceneFrames(s), 0) + INTRO_COUNT * INTRO - (SCENES.length + INTRO_COUNT) * XFADE;

const fadeIn = (frame: number, at: number, d = 12) =>
  interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const TopBanner: React.FC<{ chapter: number }> = ({ chapter }) => {
  const f = useCurrentFrame();
  if (chapter < 0 || chapter >= ANCHORS.length) return null;
  return (
    <div style={{ position: "absolute", top: 36, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 6, 16) }}>
      <div style={{ padding: "12px 38px", borderRadius: 999, background: "rgba(13,19,34,0.66)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 24px rgba(11,16,32,0.24), 0 2px 6px rgba(11,16,32,0.16), inset 0 1px 0 rgba(255,255,255,0.22)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 31, color: "#f4f7fb", letterSpacing: 1 }}>{ANCHORS[chapter]}</span>
      </div>
    </div>
  );
};

/** CH4 介面免責小字(老闆拍板):只在 proj 景出現。 */
const UiDisclaimer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 96, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 20, 14) }}>
      <span style={{ padding: "6px 20px", borderRadius: 999, background: "rgba(13,19,34,0.7)", border: "1px solid rgba(255,255,255,0.16)", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 21, letterSpacing: 2, color: "rgba(244,247,251,0.75)" }}>
        Google Cloud 介面可能微調 — 認名稱、不認位置
      </span>
    </div>
  );
};

/** 上句淡出收乾淨、下句才淡入(同 EP01,防交接鬼影)。 */
const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, at, 6) * (1 - fadeIn(f, until - 6, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1620, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 40, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

/** prompt 句期間的全幀 💬 PromptCard overlay(蓋住該景內容,句末淡出接截圖)。 */
const PromptBeat: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const out = 1 - fadeIn(f, dur - 9, 9);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <WhiteBg />
      <PromptCard text={text} />
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const dur = sceneFrames(scene);
  const marks = sceneMarks(scene);
  const promptDur = scene.promptText && marks.length > 1 ? marks[1].start - marks[0].start + 9 : 0;
  return (
    <AbsoluteFill>
      <scene.Comp dur={dur} marks={marks} />
      {scene.promptText && promptDur > 0 && (
        <Sequence from={marks[0].start} durationInFrames={promptDur}>
          <PromptBeat text={scene.promptText} dur={promptDur} />
        </Sequence>
      )}
      <TopBanner chapter={scene.chapter} />
      {scene.key === "proj" && <UiDisclaimer />}
      {scene.lines.map((l, i) => (
        (scene.promptText && i === 0) ? null : <Caption key={l.id} text={l.cap} at={marks[i].start} until={marks[i].end + GAP} />
      ))}
      {scene.lines.map((l, i) => (
        <Sequence key={`a-${l.id}`} from={marks[i].start}>
          <Audio src={staticFile(`vo/youtube-upload-ep02/${l.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** 章節開場卡(文字版)。 */
const ChapterIntroCard: React.FC<{ eyebrow: string; title: string }> = ({ eyebrow, title }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 3, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...darkCard(ACC.ember, { r: 36, glow: 1.1 }), position: "relative", overflow: "hidden", padding: "72px 130px", textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 26}px)` }}>
        <Glare />
        <div style={{ position: "relative", display: "inline-block", padding: "8px 28px", borderRadius: 999, background: rgba(ACC.ember, 0.14), border: `1px solid ${rgba(ACC.ember, 0.5)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: ACC.emberSoft, marginBottom: 26 }}>{eyebrow}</div>
        <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 84, letterSpacing: 3, color: "#fff", textShadow: `0 0 30px ${rgba(ACC.ember, 0.35)}` }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const CoverFlash: React.FC = () => (
  <AbsoluteFill>
    <YtUploadCover />
  </AbsoluteFill>
);

/** bgm=本片專屬水晶鋼琴《Pale Light on the Keys》(Gemini Lyria 3,老闆 2026-07-04 選定)。 */
export const YtUploadEP02: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill>
    <WhiteBg />
    {bgm && <Audio loop src={staticFile("bgm-yt-upload-ep02.mp3")} volume={0.11} />}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={COVER}>
        <CoverFlash />
      </TransitionSeries.Sequence>
      {SCENES.flatMap((s) => {
        const intro = INTRO_CARDS[s.key];
        const parts: React.ReactNode[] = [
          <TransitionSeries.Transition key={`tr-${s.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
        ];
        if (intro) {
          parts.push(
            <TransitionSeries.Sequence key={`intro-${s.key}`} durationInFrames={INTRO}>
              <ChapterIntroCard eyebrow={intro.eyebrow} title={intro.title} />
            </TransitionSeries.Sequence>,
            <TransitionSeries.Transition key={`tri-${s.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          );
        }
        parts.push(
          <TransitionSeries.Sequence key={`seq-${s.key}`} durationInFrames={sceneFrames(s)}>
            <SceneShell scene={s} />
          </TransitionSeries.Sequence>,
        );
        return parts;
      })}
    </TransitionSeries>
  </AbsoluteFill>
);

export const YtUploadPoster: React.FC = () => <YtUploadCover />;
