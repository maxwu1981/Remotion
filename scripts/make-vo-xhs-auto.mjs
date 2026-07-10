#!/usr/bin/env node
/**
 * Voiceover for 「小紅書發文全自動化」實戰自動化系列 EP01。
 * 全程曉晴(第一人稱老闆視角)。主軸＝我們如何自動化。
 *
 * 每句 → public/vo/xhs-automation-tutorial/<id>.mp3
 * 量到的秒數 → src/videos/xhs-automation-tutorial/vo-manifest.json
 *
 *   node scripts/make-vo-xhs-auto.mjs            # 全部
 *   node scripts/make-vo-xhs-auto.mjs c8-4       # 只重生指定句(過稿改字用)
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "xhs-automation-tutorial");
const videoDir = join(root, "src", "videos", "xhs-automation-tutorial");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = { narrator: "zh-TW-HsiaoChenNeural" };

// id 對映 SCRIPT.md 章-句（順序即播放順序）
const LINES = [
  // CH1 一鍵發布 demo（Hook）
  { id: "c1-1", text: "我想告訴各位，發一篇小紅書，從影片、標題、正文，到八個標籤、五個章節，全部是 Claude Code 自動完成。" },
  { id: "c1-1b", text: "你只要出創意；就算你講不清楚要做什麼，讓它問你三十個問題，問到它懂為止。" },
  { id: "c1-2", text: "這不是概念展示，是我每天在跑的真實流程。" },
  { id: "c1-3", text: "而且 Claude 動手之前，會先把它打算怎麼做講給我聽，我點頭，它才自動執行。" },
  { id: "c1-4", text: "這支影片，我把這條「我出主意、Claude 出雙手」的產線一站一站拆給你看；每一站你只要對 Claude 說的那句話，我都放在畫面上，看到最後還有一整段禮物。" },
  // CH2 全景七站地圖
  { id: "c2-1", text: "整條產線，Claude 幫我拆成七站。" },
  { id: "c2-2", text: "前兩站是地基，環境建置、防封框架。" },
  { id: "c2-3", text: "中間三站是內容產線，文案、素材，還有重頭戲，一鍵自動上傳。" },
  { id: "c2-4", text: "最後兩站，發布前的把關，跟發布後的營運。" },
  { id: "c2-5", text: "每一站 Claude 都自動執行，但關鍵決定，它一定先問過我。" },
  // CH3 環境建置
  { id: "c3-1", text: "第一站，Claude 得先解決一個大前提，平台看得出你是不是機器人。" },
  { id: "c3-2", text: "一般的自動化工具，一啟動瀏覽器，就帶著機器人指紋，平台的風控系統一查一個準。" },
  { id: "c3-3", text: "所以 Claude 的做法是，開一個專用的真瀏覽器分身。" },
  { id: "c3-4", text: "它用指令自己啟動一顆真的 Chrome，配一個獨立的使用者資料夾，跟我日常的瀏覽器完全分開。" },
  { id: "c3-5", text: "我只掃碼登入一次，之後登入狀態永久存著，Claude 每次自己接上去，不用再掃。" },
  { id: "c3-6", text: "它不是自己另開瀏覽器，而是從外面，接上這顆已經在跑的真 Chrome。" },
  { id: "c3-7", text: "關鍵在一個叫 webdriver 的屬性，框架直接啟動是 true，一看就被抓；Claude 這樣接上去，它保持 false，看起來就是真人在用。" },
  // CH4 防封三鐵則
  { id: "c4-1", text: "第二站，防封。這是 Claude 幫我立規矩、也自己遵守的一站。先講一個代價七天的教訓。" },
  { id: "c4-2", text: "今年六月，我的帳號被封了整整七天。" },
  { id: "c4-3", text: "當時用的是另一套工具，自己啟動一顆帶指紋的瀏覽器，又高頻檢查登入，風控直接把我抓出來。" },
  { id: "c4-4", text: "那七天我想清楚一件事，自動化該省的是苦工，不是判斷。" },
  { id: "c4-5", text: "所以重建流程的時候，我要求 Claude 守三條鐵則。" },
  { id: "c4-6", text: "第一，每一篇都先發僅自己可見，等我自己檢查沒問題，才轉公開。" },
  { id: "c4-7", text: "第二，一天最多一到三篇，絕不衝量。" },
  { id: "c4-8", text: "第三，最後那顆發布按鈕，Claude 永遠不碰，留給我按。" },
  { id: "c4-9", text: "這三條守下來，三十多篇，零事故。" },
  // CH5 GEO 文案
  { id: "c5-1", text: "第三站，文案。這一段連內容都是 Claude 寫的，但有規矩。" },
  { id: "c5-2", text: "標題二十個字以內，正文一千字以內，寫成問答的形式。" },
  { id: "c5-3", text: "每個段落的標題，是一個真的有人會問的問題，答案裡一定帶具體數字。" },
  { id: "c5-4", text: "但 Claude 寫完不會直接用，它會自己上網，把每一個數字都查證一遍。" },
  { id: "c5-5", text: "舉個真實例子，金澤的巴士一日券，網路上一堆舊文寫六百日圓，它一查，現在是八百。" },
  { id: "c5-6", text: "錯一個數字，這篇的信任就沒了，所以這一步，它一定親自上網查過才算數。" },
  { id: "c5-7", text: "最後它會幫每段補一行，適合誰、不適合誰，讀者跟搜尋引擎都買單。" },
  // CH6 圖文發布包
  { id: "c6-1", text: "第四站，素材。先講圖文筆記。" },
  { id: "c6-2", text: "Claude 把每一篇的素材，自動整理成一個固定格式的資料夾，我叫它發布包。" },
  { id: "c6-3", text: "裡面三樣東西，一張三比四、壓好字的封面，一組編號排好的圖片，一個文案檔。" },
  { id: "c6-4", text: "重點是，上傳腳本只認資料夾格式，不認內容。" },
  { id: "c6-5", text: "所以只要格式對，京都的、金澤的、任何一篇，Claude 都用同一句指令發出去。" },
  // CH7 實拍 vlog 自動剪
  { id: "c7-1", text: "影片筆記更有趣，連剪輯都是 Claude 自動完成的。" },
  { id: "c7-2", text: "金澤清晨的實拍，二十二支我用手機亂拍的片段，Claude 把它剪成一支三分半的成片。" },
  { id: "c7-3", text: "第一步，它自己抽好縮圖，還幫我標出哪幾支有家人入鏡，問我要不要剔除，我一點頭，它就自動刪掉。" },
  { id: "c7-4", text: "第二步，它把同一個地點的鏡頭自動排在一起，順序照文案裡的走法，這樣後面的章節才乾淨。" },
  { id: "c7-5", text: "第三步，它量測每一段的運鏡速度，判斷我手持拍得又快又晃，自動整體放慢兩倍半，晃動感降了將近六成。" },
  { id: "c7-6", text: "第四步，自動配上低音量的背景音樂，頭尾淡入淡出。" },
  { id: "c7-7", text: "第五步是我最喜歡的一招，它把封面海報直接烘進影片的第零秒。" },
  { id: "c7-8", text: "因為平台預設抓第一幀當封面，這樣連上傳封面這個步驟，都被它省掉了。" },
  { id: "c7-9", text: "最後，它把每個章節的時間點跟名稱，存成一個小小的清單檔，待會兒上傳有大用。" },
  // CH8 一鍵自動上傳
  { id: "c8-1", text: "第五站，重頭戲。上傳這一步，Claude 一句指令，自動做完六件事。" },
  { id: "c8-2", text: "上傳影片、填標題、貼正文、打標籤、設成僅自己可見，最後把章節填好。" },
  { id: "c8-3", text: "這裡有幾個 Claude 踩過坑才學會的關鍵細節。" },
  { id: "c8-4", text: "第一，標籤不是打上去就好，它會等平台的下拉選單跳出來，名字精準命中才選，這樣才是真話題、有流量入口。" },
  { id: "c8-5", text: "第二，章節列表會自己依時間排序，所以它先填名稱、再填時間，順序反了，內容會被打亂掉光。" },
  { id: "c8-6", text: "第三，也是我覺得整條產線最重要的一條，每填一項，Claude 都會把頁面上的值重新讀回來核對。" },
  { id: "c8-7", text: "跟預期一致才存，對不上就自動取消。" },
  { id: "c8-8", text: "寧可不存，也不存錯，這樣的自動化我才敢放心用。" },
  { id: "c8-9", text: "補一個工程細節，影片一百多 MB，一般網頁自動化會撞到五十 MB 上限，Claude 改走瀏覽器的除錯通道，只把檔案路徑交給 Chrome，大小就沒有限制了。" },
  // CH9 坑① 可見範圍
  { id: "c9-1", text: "接下來兩個坑，是 Claude 幫我擋下來的，每一個都可能讓前面的努力歸零。" },
  { id: "c9-2", text: "第一個坑，發布頁閒置太久，可見範圍會自己跳回，公開可見。" },
  { id: "c9-3", text: "我親眼看過，設好的僅自己可見，自己變回了公開。" },
  { id: "c9-4", text: "要是沒發現就發布，防封第一鐵則直接破功，草稿內容全公開見人。" },
  { id: "c9-5", text: "所以 Claude 在按發布前的最後一刻，一定會自動重讀一次這個欄位，確認還是僅自己可見。" },
  // CH10 坑② 草稿吃素材
  { id: "c10-1", text: "第二個坑更狠。" },
  { id: "c10-2", text: "草稿存回去，再拿出來，影片跟章節會被平台清空，只剩下文字。" },
  { id: "c10-3", text: "標題還在，正文還在，但影片顯示，請上傳視頻，章節整個歸零。" },
  { id: "c10-4", text: "Claude 的解法是一套自動重傳流程，重新上傳影片、等轉碼，再把章節清單重填一次。" },
  { id: "c10-5", text: "還記得剛剛那個章節清單檔嗎，因為章節存成檔案，它重填只要一分鐘。" },
  { id: "c10-6", text: "這就是整條產線的中心思想，設定都存成檔案，頁面上的東西隨時會消失，檔案裡的永遠能重來。" },
  // CH11 人工三步
  { id: "c11-1", text: "第六站，誠實講講 Claude 不會自己動手的地方，我試過了，有三件事它一定停下來等我。" },
  { id: "c11-2", text: "第一，原創聲明的開關，程式去點沒反應，平台故意做成只吃真人的手勢。" },
  { id: "c11-3", text: "第二，添加地點，自動選很容易選錯，錯一個地點，整篇的可信度打折。" },
  { id: "c11-4", text: "第三，就是那顆發布按鈕，這是我立的鐵則，不是技術限制。" },
  { id: "c11-5", text: "所以 Claude 把一切填好就停住，我過來檢查一遍，點三下，發布。" },
  { id: "c11-6", text: "這三下，是整條產線唯一的人工，我把它當成最後一道把關。" },
  // CH12 發布後營運
  { id: "c12-1", text: "發布之後，還有第七站。" },
  { id: "c12-2", text: "僅自己可見的狀態下，我用讀者的眼睛再看一遍，畫面、數字、標籤都對，才轉公開。" },
  { id: "c12-3", text: "同一個系列的筆記，加進同一個合集，平台會自動幫我把上一篇的合集帶進來。" },
  { id: "c12-4", text: "低頻，但穩定，帳號的權重就是這樣慢慢養起來的。" },
  // 片尾禮物：完整 master prompt（看到最後的獎勵）
  { id: "cGift-1", text: "在說再見之前，送給看到這裡的你一個禮物。" },
  { id: "cGift-2", text: "我把剛剛這幾站，合成一整段可以直接貼給 Claude 的話。" },
  { id: "cGift-3", text: "暫停這一格，整段複製，貼給 Claude，它就從零幫你把整套建起來。" },
  { id: "cGift-4", text: "記得，小紅書官方並不鼓勵自動化發文，請壓低頻率、內容真實、風險自負。" },
  // CH13 成果 + Outro
  { id: "c13-1", text: "最後算個總帳。" },
  { id: "c13-2", text: "以前手動發一篇影片筆記，上傳、填寫、封面、標籤、章節，大概四十分鐘。" },
  { id: "c13-3", text: "現在，我把素材丟進資料夾，一句指令，含上傳跟轉碼，前後三分鐘，其餘全是 Claude 自動完成。" },
  { id: "c13-4", text: "一週省下來的時間，夠我多拍兩支素材。" },
  { id: "c13-5", text: "而且這套思路不只小紅書，任何有發布頁的平台，Claude 都能照這七站幫你搭一條產線。" },
  { id: "c13-6", text: "如果這支影片對你有幫助，訂閱、按讚、分享給也在熬夜發文的朋友。" },
  { id: "c13-7", text: "下一支，我們把這條產線搬到別的平台，我們下支片見。" },
];

/** 洗成好唸版本(畫面字幕不受影響);避開 edge-tts 怪音(冒號+字母、——、…)。
 *  「重」多音字:意思是「再一次」時要唸 chóng,edge-tts 常誤唸成 zhòng(重要)——
 *  用同音字「崇」(單音字,恆唸 chóng)替換這幾個固定詞,只影響配音、不影響畫面字幕。
 *  「重頭戲/重點/重要/權重」維持原字,那些本來就該唸 zhòng。 */
const speak = (text) =>
  text
    .replace(/重建/g, "崇建")
    .replace(/重新/g, "崇新")
    .replace(/重讀/g, "崇讀")
    .replace(/重傳/g, "崇傳")
    .replace(/重填/g, "崇填")
    .replace(/重來/g, "崇來")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu, " ")
    .replace(/——/g, "，")
    .replace(/[…]+/g, "，")
    .replace(/([A-Za-z]):([A-Za-z])/g, "$1 $2")
    .replace(/[：:]\s+/g, "，")
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

console.log("engine: edge-tts  曉晴旁白(小紅書全自動化)\n");
for (const { id, text } of LINES) {
  if (only.length && !only.includes(id)) continue;
  const voice = VOICE.narrator;
  const raw = join("/tmp", `${id}.xa.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(6)} ${seconds.toFixed(2)}s  ${text.slice(0, 24)}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ → public/vo/xhs-automation-tutorial/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
