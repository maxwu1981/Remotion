#!/usr/bin/env node
/**
 * Voiceover for「丟一份舊履歷給 AI,LinkedIn 全自動翻新」— EP00 銀玻璃風,故事腳本 13 章。
 * 旁白 = 曉晴,全程第一人稱、不點名任何公司、不提本人姓名或帳號網址。
 *
 * 每句 → public/vo/linkedin-ai-makeover/<id>.mp3
 * 量到的秒數 → src/videos/linkedin-ai-makeover/vo-manifest.json
 *
 *   node scripts/make-vo-linkedin-makeover.mjs         # 全部
 *   node scripts/make-vo-linkedin-makeover.mjs g1 g2   # 只重生指定句
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "linkedin-ai-makeover");
const videoDir = join(root, "src", "videos", "linkedin-ai-makeover");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = "zh-TW-HsiaoChenNeural"; // 曉晴,全片第一人稱

const LINES = [
  // Hook
  { id: "h1", text: "我把一份三年沒更新的舊履歷丟給 Claude,然後去倒了一杯咖啡。" },
  { id: "h2", text: "回來的時候,它已經自己打開瀏覽器,把我的檔案從封面到技能欄,整個翻新了一遍。" },
  { id: "h3", text: "這支影片,我把它做的每一件事拆給你看,包括三個我自己完全沒想到的盲點。" },
  // Ch1 荒廢的檔案有多慘
  { id: "a1", text: "先講我的起點,有多慘。" },
  { id: "a2", text: "我的檔案放了快三年沒動,過去七天,只有四十一個人看過,貼文曝光是零。" },
  { id: "a3", text: "技能欄只有兩項,各一個肯定。" },
  { id: "a4", text: "最致命的是,我十六年的資歷,工作經歷欄裡只剩下現職一段。" },
  { id: "a5", text: "獵頭在後台搜的是經歷和技能關鍵字,這種檔案,等於不存在。" },
  // Ch2 為什麼一直沒改
  { id: "b1", text: "不是不知道要改,是每次打開編輯頁就放棄。" },
  { id: "b2", text: "幾十個欄位不知道從哪下手,寫出來的字像自嗨,也不知道獵頭到底搜什麼。" },
  { id: "b3", text: "所以我換了個做法,把整件事外包給 AI。" },
  // Ch3 我只做了一件事
  { id: "c1", text: "我做的事只有一件,跟 Claude 說,幫我更新檔案,讓 HR 更容易注意到我,然後把舊履歷的位置告訴它。" },
  { id: "c2", text: "剩下的它自己來,它會讀我雲端硬碟裡的履歷檔,自己開瀏覽器操作,而且每一步送出之前,都會停下來讓我按確認。" },
  // Ch4 優化一:先把定位吵清楚
  { id: "d1", text: "它做的第一件事不是改字,是先問我一個我沒想過的問題。" },
  { id: "d2", text: "你要走十六年資歷的專案管理主管路線,還是轉型 AI 工程師路線,兩條路的寫法完全不同。" },
  { id: "d3", text: "我們拍板,資歷為主,AI 當加分項,後面所有措辭都圍繞這個定位。" },
  // Ch5 GitHub 門面從零到有
  { id: "e1", text: "接著它發現我根本沒有個人主頁,直接從零幫我建了一個,把作品、技術棧、聯絡方式排好版推上線。" },
  { id: "e2", text: "然後把兩個平台互相連起來,獵頭從任何一邊點進來,都能繞到另一邊。" },
  // Ch6 Banner 用程式畫
  { id: "f1", text: "封面橫幅,它不是拿 AI 生圖亂做一張,是用程式碼精準畫出一張定製 banner,文字零糊字。" },
  { id: "f2", text: "第一版上傳後我發現字被大頭照擋住,它量出大頭照的實際覆蓋範圍,把整個版面右移重出一張。" },
  // Ch7 盲點一:措辭會誤導
  { id: "g1", text: "再來是第一個我完全沒注意到的盲點。" },
  { id: "g2", text: "banner 上原本寫,某兩家國際大廠加十六年經驗,我自己看覺得很順。" },
  { id: "g3", text: "但這種寫法,會讓人以為我在那兩家公司上過班,實際上我是在代工廠端,替他們交付專案。" },
  { id: "g4", text: "它主動把措辭改成,為誰交付了三億兩千萬美元的專案,一字之差,誠信差很多。" },
  // Ch8 Headline 改寫
  { id: "i1", text: "我的頭銜原本是系統預設的,職稱加公司名。" },
  { id: "i2", text: "它改成一整串獵頭會搜的關鍵字,十六年、新產品導入、量化金額、跨國產線移轉,再加一句會用 AI 提效。" },
  // Ch9 把十六年經歷找回來
  { id: "j1", text: "工作經歷這塊,它自己去我的雲端硬碟把履歷翻出來,抓出前兩家公司的完整資歷。" },
  { id: "j2", text: "然後駕駛瀏覽器一欄一欄填回去,每段都寫成動詞加數字的成果,良率提升百分之十、缺料降百分之三十、成本降百分之十五。" },
  { id: "j3", text: "這裡藏著第二個盲點,送出前它特地把兩個預設選項關掉。" },
  { id: "j4", text: "一個是不讓新增的舊經歷蓋掉我剛改好的頭銜,一個是關掉通知人脈,不然我兩百多個聯絡人會收到我換工作的假消息。" },
  // Ch10 技能 2 變 24
  { id: "k1", text: "然後是技能欄,兩項變二十四項。" },
  { id: "k2", text: "第三個盲點在這,我一直以為技能欄是給人看的,其實它是給獵頭搜尋系統讀的資料庫。" },
  { id: "k3", text: "它挑的十七個新技能,全是照獵頭搜尋邏輯選的標準詞條,一個一個加進去,加完還回頭核對清單。" },
  // Ch11 我沒開口它也做了的
  { id: "l1", text: "還有一堆我根本沒開口的事,它順手做了。" },
  { id: "l2", text: "檢查我放的每條連結是不是活的、把每個決策存進長期記憶方便下次接著做、跳出來的付費推銷視窗自動關掉、重複的技能自動偵測跳過。" },
  // Ch12 誠實清單:它做不到的
  { id: "m1", text: "當然,也有它做不到的,這裡誠實講。" },
  { id: "m2", text: "推薦信是零,這要真人幫我寫;技能肯定是零,這要同事幫我點。" },
  { id: "m3", text: "AI 能把舞台搭好,但站上去握手的還是得我自己。" },
  // Ch13 總成績 Before/After
  { id: "n1", text: "最後看總成績。" },
  { id: "n2", text: "技能兩項變二十四項,工作經歷一段變三段,頭銜從預設變成一整串關鍵字,封面從空白變定製,主頁從不存在變上線。" },
  { id: "n3", text: "我花的時間,大概就是幾杯咖啡,和十幾次按下確認鍵。" },
  // Outro
  { id: "o1", text: "如果這支影片對你有幫助,訂閱、按讚、分享給那個檔案也荒廢很久的朋友。" },
  { id: "o2", text: "我是把 AI 當同事用的頻道,我們下支影片見。" },
];

/** 洗成「好唸」版本(畫面字幕不受影響);避開 edge-tts 怪音(冒號+字母、——、…)。 */
const speak = (text) =>
  text
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

console.log("engine: edge-tts  曉晴旁白(第一人稱、不點名公司/姓名)\n");
for (const { id, text } of LINES) {
  if (only.length && !only.includes(id)) continue;
  const raw = join("/tmp", `${id}.lam.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(3)} ${seconds.toFixed(2)}s  ${text.slice(0, 30)}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ → public/vo/linkedin-ai-makeover/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
