#!/usr/bin/env python3
"""
ChatTTS v2 — production VO for the AI-voice video (fixes end-of-clip mush).
  • skip_refine_text=True (no GPT rewrite / trailing [break] tokens)
  • clean text (acronyms as words, no em-dash)
  • split each line into short sentences, synth each, trim trailing mush, concat
  • fit each finished clip to its existing time-slot (atempo only if it overruns)
Seed 23 (locked). Writes public/vo/ai-voice-chattts/<id>.mp3 (overwrites the old
problematic set) + vo-manifest-chattts.json. Ava is untouched.
Env SAMPLE="av2-c1,..." limits to a subset (for testing).
"""
import os, re, json, wave, subprocess
import numpy as np, torch, ChatTTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "vo", "ai-voice-chattts")
MANIFEST = os.path.join(ROOT, "src", "videos", "ai-voice-comparison", "vo-manifest-chattts.json")
os.makedirs(OUT, exist_ok=True)
SPK = open(os.path.join(ROOT, "out", "chattts-samples", "spk-seed23.txt")).read().strip()
SR = 24000

CUES = {
    "av1-c1": "Five AI voices. Only one is right for you.",
    "av1-c2": "Pick wrong, and you waste time or money. So I scored all five, on the data.",
    "av2-c1": "Two numbers tell the story. First, MOS. A one to five score from real human listeners.",
    "av2-c2": "Then four metrics. Naturalness, emotion, speed, and value. Lowest to highest, let's go.",
    "av3-c1": "Bottom of the pile. Your Mac's built-in Siri. MOS, just three point oh.",
    "av3-c2": "Naturalness sixty, emotion forty. Robotic. Use it to proofread, never to publish.",
    "av4-c1": "Edge TTS. MOS four point two, and free. Value pegged at a hundred. Unbeatable for mass production.",
    "av4-c2": "The catch. It's unofficial, with a slight news anchor tone.",
    "av5-c1": "Chat TTS. MOS four point seven. Emotion, a perfect hundred. Real breathing and laughter, made for dialogue.",
    "av5-c2": "The catch. It's open source, so you self host it with Python.",
    "av6-c1": "OpenAI's text to speech. MOS four point five. Speed ninety, clean and stable. The developer's pick.",
    "av6-c2": "It's pay as you go, but cheap, and dead simple to wire into an app.",
    "av7-c1": "And the champion, ElevenLabs. MOS four point eight, the highest here. Naturalness and emotion near a hundred.",
    "av7-c2": "The catch. It's pay per character, so it gets pricey at scale.",
    "av8-c1": "Head to head. ElevenLabs and Chat TTS win on naturalness and emotion.",
    "av8-c2": "The free tools win on speed and value. Every column has a different champion.",
    "av9-c1": "So here's your three second cheat sheet.",
    "av9-c2": "Free at scale, Edge. Podcasts, Chat TTS. An app, OpenAI. Pure quality, ElevenLabs.",
    "av10-c1": "The best AI voice isn't the priciest. It's the one that fits your job.",
    "av10-c2": "So which one are you picking. Tell me in the comments.",
}

SLOT = {
    "av1-c1": 4.47, "av1-c2": 6.0, "av2-c1": 6.93, "av2-c2": 8.3, "av3-c1": 6.37, "av3-c2": 6.97,
    "av4-c1": 8.73, "av4-c2": 5.23, "av5-c1": 9.53, "av5-c2": 4.87, "av6-c1": 8.53, "av6-c2": 5.57,
    "av7-c1": 8.93, "av7-c2": 5.5, "av8-c1": 6.6, "av8-c2": 5.9, "av9-c1": 3.13, "av9-c2": 10.13,
    "av10-c1": 5.4, "av10-c2": 5.13,
}


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
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())


def probe(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                 "-of", "default=nw=1:nk=1", p], capture_output=True, text=True).stdout.strip())


def main():
    chat = ChatTTS.Chat()
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)
    infer = ChatTTS.Chat.InferCodeParams(spk_emb=SPK, temperature=0.3, top_P=0.7, top_K=20)

    sample = os.environ.get("SAMPLE")
    ids = [s.strip() for s in sample.split(",")] if sample else list(CUES.keys())
    gap = np.zeros(int(0.11 * SR), dtype="float32")
    manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}

    for cid in ids:
        chunks = [s.strip() for s in re.split(r"(?<=[.!?])\s+", CUES[cid]) if s.strip()]
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
        wavp = f"/tmp/v2_{cid}.wav"
        mp3 = os.path.join(OUT, f"{cid}.mp3")
        save_wav(wavp, combined)
        nat = probe(wavp)
        slot = SLOT.get(cid, nat)
        if nat > slot:
            ratio = min(2.0, nat / (slot * 0.97))
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp,
                            "-filter:a", f"atempo={ratio:.4f}", "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
            tag = f"fit x{ratio:.2f}"
        else:
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp,
                            "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
            tag = "ok"
        fin = probe(mp3)
        manifest[cid] = round(fin, 3)
        print(f"  {cid:8s} {len(chunks)} chunks  nat {nat:4.1f}s  slot {slot:4.1f}s -> {fin:4.1f}s [{tag}]", flush=True)

    json.dump(manifest, open(MANIFEST, "w"), indent=2)
    open(MANIFEST, "a").write("\n")
    print(f"\n✓ {len(ids)} clips -> public/vo/ai-voice-chattts/  ·  manifest updated", flush=True)


if __name__ == "__main__":
    main()
