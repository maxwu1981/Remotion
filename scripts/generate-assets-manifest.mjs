// 產生 assets-manifest.json —— 記錄哪些 public/ 素材搬去了 Google Drive，
// 用 sha256 讓 fetch-assets.sh 或人工都能核對複製回來的檔案是否正確。
// 用法：node scripts/generate-assets-manifest.mjs
import { createHash } from "node:crypto";
import { createReadStream, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const DRIVE_ROOT =
  "/Users/maxwu/Library/CloudStorage/GoogleDrive-finalaaaa@gmail.com/我的雲端硬碟/Remotion-Assets-Archive";

// 對應 Repo 可攜性計畫 Phase E：這些資料夾不進 git，改走 Google Drive。
const FOLDERS = [
  "public/trips",
  "public/vo",
  "public/footage",
  "public/facecam",
  "public/handson",
  "public/gemini",
  "public/gemini-clips",
  "public/aas-v2",
  "public/resume-ai-apply",
  "public/claude-desktop-shots",
  "public/flow-ss-shots",
  "public/shot-library",
  "src/videos/heibuli-vs-skull-king",
];

function sha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walk(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

const entries = [];
for (const folder of FOLDERS) {
  const drivePath = path.join(DRIVE_ROOT, folder);
  let files;
  try {
    files = await walk(drivePath);
  } catch (err) {
    console.error(`跳過 ${folder}（Google Drive 裡找不到，先跑複製步驟）：${err.message}`);
    continue;
  }
  console.log(`${folder}：${files.length} 個檔案，計算 checksum 中...`);
  for (const file of files) {
    const rel = path.relative(DRIVE_ROOT, file).split(path.sep).join("/");
    const { size } = statSync(file);
    const hash = await sha256(file);
    entries.push({ repoPath: rel, size, sha256: hash });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  driveRoot:
    "我的雲端硬碟/Remotion-Assets-Archive（Google Drive 帳號 finalaaaa@gmail.com，桌面同步）",
  note: "repoPath 是相對 repo 根目錄的路徑，同時也是 Drive 裡 Remotion-Assets-Archive/ 底下的相對路徑。這些資料夾不進 git，用 scripts/fetch-assets.sh 從 Google Drive 複製回來。",
  fileCount: entries.length,
  totalBytes: entries.reduce((sum, e) => sum + e.size, 0),
  files: entries,
};

const outPath = path.join(REPO_ROOT, "assets-manifest.json");
await import("node:fs/promises").then((fs) =>
  fs.writeFile(outPath, JSON.stringify(manifest, null, 2) + "\n"),
);
console.log(`寫入 ${outPath}：${entries.length} 個檔案，共 ${(manifest.totalBytes / 1e9).toFixed(2)} GB`);
