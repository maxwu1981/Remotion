#!/usr/bin/env python3
"""
ChatTTS PoC — kitchen-git-linter-test 旁白的 ChatTTS 版（與 Sunny/edge-tts 並存做 A/B）。
  • 中文旁白，seed 23 + spk-seed23 音色（與 ai-voice 同一把聲音，非 Sunny）
  • skip_refine_text=True（不讓 GPT 改寫 / 不長尾 [break]）
  • 每句按中文標點切短句、逐句合成、修尾、串接（避免結尾糊音）
  • 預設生「自然時長」供判斷原始音質；設 FIT=1 才壓到 kitchen.vo.json 的時間槽
輸出 public/vo/kitchen-chattts/<id>.mp3（不碰現有 Sunny 的 vo/kitchen/）。
  ~/.venvs/chattts/bin/python scripts/chattts-vo-kitchen.py
"""
import os, re, json, wave, subprocess
import numpy as np, torch, ChatTTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "vo", "kitchen-chattts")
SLOT_FILE = os.path.join(ROOT, "src", "videos", "kitchen-git-linter-test", "kitchen.vo.json")
MANIFEST = os.path.join(ROOT, "public", "vo", "kitchen-chattts", "manifest.json")
os.makedirs(OUT, exist_ok=True)
SPK = open(os.path.join(ROOT, "out", "_qa", "chattts-samples", "spk-seed23.txt")).read().strip()
SR = 24000
FIT = os.environ.get("FIT") == "1"

# 與 make-vo-kitchen.mjs 的 LINES 同稿（去掉 edge-tts 專用的 rate）。
CUES = {
    "k_hook": "Git、Linter、測試，這三個工程師天天掛在嘴邊的詞，其實，想像成開一間餐廳廚房，三分鐘就懂。",
    "k_kitchen": "把寫程式想像成開餐廳。一間好廚房，會有三樣法寶：時光機、糾察隊、跟皇家試毒官。",
    "k_git": "Git，就是廚房的時光機。整鍋湯搞砸了？沒關係，按一下，啪，倒流回三分鐘前。",
    "k_linter": "Linter，是廚房裡的處女座糾察隊。蒜頭只能切丁，砧板沒擦扣五分！它逼每個廚師習慣一模一樣，端出來的菜才不會忽鹹忽淡。",
    "k_test": "測試，就是皇家試毒官。擺盤再美，吃下去會不會出事？他先吃。改版也先吃，確保你加了新香料，沒把招牌菜變成毒藥。",
    "k_michelin": "三樣都有，代表這是一間，頂級的餐廳廚房。",
    "k_flee_setup": "但如果一間廚房，這三樣全都沒有，菜煮壞了，還直接端給客人……",
    "k_flee": "快逃啊！",
    "k_outro": "我是曉晴。訂閱看更多工程師術語翻譯，把這支，分享給還在火燒廚房的朋友！",
}


def norm_zh(text):
    """ChatTTS 中文 vocab 只認 ，。？ ；把 ！：、… 等轉掉避免 invalid-char 警告/吞字。"""
    return (text.replace("！", "。").replace("：", "，").replace("、", "，")
            .replace("…", "，").replace("；", "，").replace("（", "，").replace("）", "，"))


def split_zh(text):
    """先用 。？ 斷句；過長(>22字)的再用 ，切，讓 ChatTTS 不糊尾。"""
    text = norm_zh(text)
    parts = [p for p in re.split(r"(?<=[。？!?])", text) if p.strip()]
    out = []
    for p in parts:
        if len(p) <= 22:
            out.append(p.strip())
            continue
        sub = re.split(r"(?<=[，])", p)
        buf = ""
        for s in sub:
            if len(buf) + len(s) > 22 and buf:
                out.append(buf.strip()); buf = s
            else:
                buf += s
        if buf.strip():
            out.append(buf.strip())
    return [s for s in out if s]


def trim_tail(a, thr=0.015, pad=0.09):
    a = np.asarray(a).flatten().astype("float32")
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0:
        return a
    start = max(0, idx[0] - int(0.02 * SR))
    end = min(len(a), idx[-1] + int(pad * SR))
    return a[start:end]


def save_wav(path, a):
    x = np.clip(np.asarray(a).flatten().astype("float32"), -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def probe(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                 "-of", "default=nw=1:nk=1", p], capture_output=True, text=True).stdout.strip())


def main():
    slots = json.load(open(SLOT_FILE)) if os.path.exists(SLOT_FILE) else {}
    chat = ChatTTS.Chat()
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)
    infer = ChatTTS.Chat.InferCodeParams(spk_emb=SPK, temperature=0.3, top_P=0.7, top_K=20)

    sample = os.environ.get("SAMPLE")
    ids = [s.strip() for s in sample.split(",")] if sample else list(CUES.keys())
    gap = np.zeros(int(0.12 * SR), dtype="float32")
    manifest = {}

    for cid in ids:
        chunks = split_zh(CUES[cid])
        pieces = []
        for ch in chunks:
            torch.manual_seed(23)
            a = chat.infer([ch], params_infer_code=infer, skip_refine_text=True)[0]
            if hasattr(a, "detach"):
                a = a.detach().cpu().numpy()
            pieces.append(trim_tail(a))
        combined = pieces[0]
        for p in pieces[1:]:
            combined = np.concatenate([combined, gap, p])
        wavp = f"/tmp/kit_{cid}.wav"
        mp3 = os.path.join(OUT, f"{cid}.mp3")
        save_wav(wavp, combined)
        nat = probe(wavp)
        slot = slots.get(cid, nat)
        if FIT and nat > slot:
            ratio = min(2.0, nat / (slot * 0.97))
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp,
                            "-filter:a", f"atempo={ratio:.4f}", "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
            tag = f"fit x{ratio:.2f}"
        else:
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp,
                            "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
            tag = "nat"
        fin = probe(mp3)
        manifest[cid] = round(fin, 3)
        print(f"  {cid:13s} {len(chunks)} chunks  nat {nat:5.2f}s  slot {slot:5.2f}s -> {fin:5.2f}s [{tag}]", flush=True)

    json.dump(manifest, open(MANIFEST, "w"), ensure_ascii=False, indent=2)
    open(MANIFEST, "a").write("\n")
    print(f"\n✓ {len(ids)} clips -> public/vo/kitchen-chattts/  ·  manifest written", flush=True)


if __name__ == "__main__":
    main()
