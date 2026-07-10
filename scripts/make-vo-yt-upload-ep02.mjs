#!/usr/bin/env node
/**
 * Voiceover for 「YouTube 上片全自動化」實戰自動化系列 EP02。
 * 全程曉晴(第一人稱老闆視角)。主軸＝Claude 帶我做一次性設定，之後上傳全自動。
 *
 * 每句 → public/vo/youtube-upload-ep02/<id>.mp3
 * 量到的秒數 → src/videos/youtube-upload-ep02/vo-manifest.json
 *
 *   node scripts/make-vo-yt-upload-ep02.mjs            # 全部
 *   node scripts/make-vo-yt-upload-ep02.mjs c7-3       # 只重生指定句(過稿改字用)
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "youtube-upload-ep02");
const videoDir = join(root, "src", "videos", "youtube-upload-ep02");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = { narrator: "zh-TW-HsiaoChenNeural" };

// id 對映 SCRIPT.md v2 章-句（順序即播放順序）。舞台指示行(2-4 泡泡牆)不進旁白。
const LINES = [
  // CH1 一句指令上線（Hook）
  { id: "c1-1", text: "這支影片算繪完成之後，我只對 Claude 說了一句話，上傳。" },
  { id: "c1-2", text: "六十秒後，它把 YouTube 連結交回我手上，標題、描述、隱私設定，全部填好。" },
  { id: "c1-3", text: "沒有開瀏覽器、沒有拖檔案、沒有填表單，我全程沒碰 YouTube。" },
  { id: "c1-4", text: "代價是一次性的五分鐘設定。做完那五分鐘，之後每一支影片，永遠自動。" },
  { id: "c1-5", text: "這支片，我把那五分鐘拆成實際畫面帶你走一遍，含我踩過的三個坑，照做就能通。" },
  // CH2 手動上傳之痛（議題＋實證）
  { id: "c2-1", text: "先講為什麼值得。手動上傳一支影片，你要開 YouTube Studio、拖檔案、等進度條、填標題、貼描述、打標籤、設隱私，一路按三次下一步。" },
  { id: "c2-2", text: "一支片十分鐘就這樣沒了；一週三支，一個月就是兩小時的純體力活。" },
  { id: "c2-3", text: "而且重複操作最容易出錯，貼錯描述、忘了設隱私，網路上滿是這種哀嚎。" },
  { id: "c2-5", text: "YouTube 其實留了正門，官方的 YouTube Data API v3，讓程式直接把影片送進你的頻道。" },
  { id: "c2-6", text: "但大多數人在門口就放棄了，因為進門要先過 Google Cloud 憑證設定，OAuth、同意畫面、用戶端 ID，一堆陌生名詞。" },
  { id: "c2-7", text: "這條設定路，Claude 帶著我走過一次，全程截圖存證，這支片你照著走就好。" },
  // CH3 產線全景（地圖）
  { id: "c3-1", text: "先看全景，整條自動上片產線分成兩段。" },
  { id: "c3-2", text: "左邊是一次性設定，建 Google Cloud 專案、開 API、設 OAuth 同意畫面、拿憑證檔，人只動手這一次，大約五分鐘。" },
  { id: "c3-3", text: "右邊是每次全自動，Claude 寫好標題描述檔，執行上傳腳本，API 收件，連結回報。" },
  { id: "c3-4", text: "兩段中間的橋樑，是兩個小檔案。" },
  { id: "c3-5", text: "client_secrets.json 是你程式的身分證，token 是通行證。" },
  { id: "c3-6", text: "身分證辦一次，通行證第一次授權後自動保存，之後每次上傳，Claude 拿著通行證直接進門。" },
  { id: "c3-tp", text: "這一整條路，你開場先給 Claude 一句總說明，它就會照著，一步步帶你走。" },
  // CH4 建立 Google Cloud 專案
  { id: "c4-0p", text: "你只要跟 Claude 說，教我建一個叫 youtube uploader 的專案。" },
  { id: "c4-1", text: "開工。打開 Google Cloud Console，用你 YouTube 頻道的那個 Google 帳號登入。" },
  { id: "c4-2", text: "上方專案選單，新增專案，名字隨意，我取 youtube-uploader。" },
  { id: "c4-3", text: "建立，然後記得切換到這個新專案。" },
  { id: "c4-4", text: "專案就是一個容器，等下開的 API、發的憑證，全都掛在它下面。" },
  // CH5 啟用 YouTube Data API v3
  { id: "c5-0p", text: "跟 Claude 說，教我啟用 YouTube Data API。" },
  { id: "c5-1", text: "第二步，最上面的搜尋列，輸入 YouTube Data API v3，點進去。" },
  { id: "c5-2", text: "按下藍色的啟用。" },
  { id: "c5-3", text: "這一步是在告訴 Google，我這個專案，要用上傳影片這個能力。" },
  { id: "c5-4", text: "到這裡都只是點按鈕，還沒有坑，坑從下一章開始。" },
  // CH6 OAuth 同意畫面
  { id: "c6-0p", text: "跟 Claude 說，教我設定 OAuth 同意畫面。" },
  { id: "c6-1", text: "第三步，左側選單，API 和服務，OAuth 同意畫面。" },
  { id: "c6-2", text: "User Type 選外部，External，建立。" },
  { id: "c6-3", text: "接著填三個欄位，App 名稱隨意取，使用者支援信箱、開發人員聯絡信箱，都填你自己的 email，一路儲存。" },
  { id: "c6-4", text: "這個畫面，就是等下授權跳出來時，你會看到的那個應用程式的門面。" },
  { id: "c6-5", text: "五分鐘後你會再見到它一次，帶著一個嚇人的警告，先賣個關子。" },
  // CH7 測試使用者（頭號坑）
  { id: "c7-0p", text: "跟 Claude 說，教我把帳號加進測試使用者白名單。" },
  { id: "c7-1", text: "現在，畫面停一下，這是全片最重要的一步。" },
  { id: "c7-2", text: "在目標對象，Audience，找到測試使用者，Test users，按 ADD USERS。" },
  { id: "c7-3", text: "把你等一下要登入授權的那個帳號信箱加進去，儲存。" },
  { id: "c7-4", text: "沒加的話，授權時 Google 會直接把你擋在門外，畫面寫著，存取遭封鎖，Access blocked。" },
  { id: "c7-5", text: "這不是你做錯什麼，是 Google 對測試階段應用的保護機制，只有白名單裡的帳號能用。" },
  { id: "c7-6", text: "但錯誤訊息完全不會告訴你要回來加這一步，所以 Stack Overflow 上一堆人卡死在這。" },
  { id: "c7-7", text: "當時實錄裡，Claude 前後提醒了我兩次別跳過，就是因為這一步的翻車率最高。" },
  { id: "c7-8", text: "記住一個原則，等下用哪個帳號按允許，哪個帳號就要在白名單裡。" },
  { id: "c7-9", text: "萬一你已經撞上 Access blocked，也不用重來，回到同意畫面補加測試使用者，再跑一次授權就過了。" },
  // CH8 憑證檔 client_secrets.json（坑二）
  { id: "c8-0p", text: "跟 Claude 說，教我建桌面應用憑證，下載後幫我改名成 client secrets 檔。" },
  { id: "c8-1", text: "第四步，發身分證。左側憑證，Credentials，建立憑證，OAuth 用戶端 ID。" },
  { id: "c8-2", text: "應用程式類型，選桌面應用程式，Desktop app，因為上傳腳本是在你自己的電腦上跑的。" },
  { id: "c8-3", text: "建立之後跳出視窗，下載 JSON。" },
  { id: "c8-4", text: "第二個坑來了，下載下來的檔名，是 client_secret 加一長串亂碼。" },
  { id: "c8-5", text: "腳本認的名字是 client_secrets.json，要改名，再放進上傳腳本的資料夾。" },
  { id: "c8-6", text: "實錄裡我根本沒注意到這件事，是 Claude 檢查環境時自己發現、自己改好的。" },
  { id: "c8-7", text: "它還順手驗證了憑證內容，桌面應用類型，有效，才往下走。" },
  { id: "c8-8", text: "這就是我讓 Claude 帶路的原因，它不只給步驟，還會自己收拾我漏掉的細節。" },
  { id: "c8-9", text: "最後提醒一句，client_secrets.json 跟等下產生的 token，等於你頻道的鑰匙，不要放進公開的程式碼庫，也不要傳給任何人。" },
  // CH9 裝套件（坑三）
  { id: "c9-0p", text: "跟 Claude 說，幫我裝上傳要的 Python 套件，pip 太舊就換相容方式。" },
  { id: "c9-1", text: "第五步，裝 Google API 的 Python 套件。" },
  { id: "c9-2", text: "第三個坑在這裡，環境差異。Claude 第一次的安裝指令帶了一個新參數，我電腦的 pip 是老版本二十一點二點四，根本不認得。" },
  { id: "c9-3", text: "它的處理方式我很欣賞，不叫我先去升級 pip，直接把那個新參數拿掉，換成老版本也認得的指令，一次裝成。" },
  { id: "c9-4", text: "畫面跳了一堆 warning，它也先講清楚，那只是 Python 三點九的老版本提示，不影響。" },
  { id: "c9-5", text: "套件裝好、憑證就位、網路暢通，三個勾打完。" },
  { id: "c9-6", text: "一次性設定的人工部分到此結束，接下來是見證的時刻。" },
  // CH10 首次授權實錄
  { id: "c10-0p", text: "跟 Claude 說，幫我寫上傳腳本、走授權，Token 存起來下次免再跑。" },
  { id: "c10-1", text: "Claude 啟動上傳腳本，瀏覽器自動彈出 Google 登入頁，這是第一次、也是唯一一次授權。" },
  { id: "c10-2", text: "用你要上傳的那個帳號登入，然後你會看到一個嚇人的畫面，Google 尚未驗證這個應用程式。" },
  { id: "c10-3", text: "別慌，這完全正常，這個應用是你自己五分鐘前建立的，Google 當然沒驗證過。" },
  { id: "c10-4", text: "點左下的進階，再點繼續前往。" },
  { id: "c10-5", text: "注意，不要點那顆醒目的返回安全網頁，那會取消整個流程。" },
  { id: "c10-6", text: "下一頁，把 YouTube 的權限全部勾選，繼續，允許。" },
  { id: "c10-7", text: "看到驗證流程已完成、可關閉視窗，授權成功，localhost 分頁直接關掉。" },
  { id: "c10-8", text: "此刻 token 已經自動存進資料夾，日常上傳不用再跑這套流程；萬一哪天 token 失效，重跑一次授權就好，三十秒的事。" },
  // CH11 上傳自動跑＋成果
  { id: "c11-1", text: "你在授權的同時，上傳其實早就排好隊了，授權一過，自動開跑。" },
  { id: "c11-2", text: "三十 MB 的影片，三十到六十秒跑完，完成的瞬間，Claude 把 YouTube 連結回報給我。" },
  { id: "c11-3", text: "我點開，影片已經公開上線，標題、畫質、時長，全部正確。" },
  { id: "c11-4", text: "剛上傳的片，高畫質要等平台轉檔幾分鐘，這是正常的，不是壞掉。" },
  { id: "c11-5", text: "從此每一支影片的上傳流程，變成一句話，Claude，上傳。" },
  // CH12 之後的日常
  { id: "c12-0p", text: "以後你只要說，把最新的成片上傳，先設不公開，完成給我連結。" },
  { id: "c12-1", text: "講講之後的日常長什麼樣。" },
  { id: "c12-2", text: "每支影片算繪完，Claude 會先寫一個描述檔，標題、描述、標籤、隱私設定，全部先寫成檔案給我過目。" },
  { id: "c12-3", text: "標題描述照搜尋引擎跟 AI 答案引擎的胃口寫，問題開頭、具體數字、加章節時間戳。" },
  { id: "c12-4", text: "我看一眼點頭，它一句指令送出，影片先設不公開，我檢查完再轉公開，這是我留給自己的最後一道把關。" },
  { id: "c12-5", text: "縮圖、播放清單，同一套 API 全部能自動掛上。" },
  { id: "c12-5b", text: "配額也講清楚，二〇二五年十二月起，上傳有自己的獨立額度，預設一天一百支，其他操作共用每天一萬點，一般創作者根本用不完。" },
  { id: "c12-6", text: "所有設定都存成檔案的好處是，頁面上的東西會消失，檔案裡的永遠能重來，這跟小紅書那條產線是同一個中心思想。" },
  // CH13 複盤＋CTA
  { id: "c13-1", text: "最後複盤這條五分鐘的路，建專案、開 API、同意畫面、加測試使用者、桌面憑證改名放好、裝套件、授權一次。" },
  { id: "c13-2", text: "三個坑再讀一次，Access blocked 就回去補測試使用者白名單、憑證檔要改名成 client_secrets.json、老 pip 拿掉新參數就裝得動。" },
  { id: "c13-3", text: "這套憑證流程不只 YouTube，Google 全家的 API，日曆、雲端硬碟、試算表，全是同一套路，學一次用到處。" },
  { id: "c13-4", text: "至此整條影片產線全部程式化，寫程式、配音、算繪、上傳，這是我的全自動影片工廠的最後一塊拼圖。" },
  { id: "c13-5", text: "如果這支影片幫你省下五分鐘的摸索，訂閱、按讚、分享給也在做影片的朋友。" },
  { id: "c13-6", text: "我們下支片見。" },
  // CH14 片尾 master prompt（看到最後的禮物）
  { id: "c14-1", text: "最後，送給看到這裡的你，一個禮物。" },
  { id: "c14-2", text: "這一整段，是把前面每一步，合成的一句完整指令。" },
  { id: "c14-3", text: "暫停，整段複製，貼給 Claude，它就能從零，幫你把這套自動上傳建起來。" },
];

/** 洗成好唸版本(畫面字幕不受影響);避開 edge-tts 怪音。
 *  比 EP01 更嚴:所有冒號一律轉逗號(11-5 有「，Claude」前身是冒號緊鄰字母)。
 *  「重」多音字沿用 EP01 的「崇」替換法,本片新增「重跑」。
 *  client_secrets.json / youtube-uploader 等檔名口語化,畫面照舊顯示原字。 */
const speak = (text) =>
  text
    .replace(/重跑/g, "崇跑")
    .replace(/重建/g, "崇建")
    .replace(/重新/g, "崇新")
    .replace(/重來/g, "崇來")
    .replace(/client_secrets\.json/g, "client secrets 檔")
    .replace(/client_secret/g, "client secret")
    .replace(/youtube-uploader/g, "youtube uploader")
    .replace(/YouTube Data API v3/g, "YouTube Data API")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu, " ")
    .replace(/——/g, "，")
    .replace(/[…]+/g, "，")
    .replace(/([A-Za-z]):([A-Za-z])/g, "$1 $2")
    .replace(/[：:]+/g, "，")
    .replace(/／/g, "、")
    .replace(/\s+/g, " ")
    .trim();

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim(),
  );

const only = process.argv.slice(2);
const manifestPath = join(videoDir, "vo-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

console.log("engine: edge-tts  曉晴旁白(YouTube 上片全自動化 EP02)\n");
for (const { id, text } of LINES) {
  if (only.length && !only.includes(id)) continue;
  const voice = VOICE.narrator;
  const raw = join("/tmp", `${id}.ep02.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(7)} ${seconds.toFixed(2)}s  ${text.slice(0, 24)}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ → public/vo/youtube-upload-ep02/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
