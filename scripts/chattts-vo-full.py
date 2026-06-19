#!/usr/bin/env python3
"""
Full ChatTTS voiceover for the AI-voice video, using the locked seed-23 speaker
(spk-seed23.txt). Each clip is fitted to its existing per-cue time-slot (gentle
atempo only when a clip would overrun), so it drops into the SAME timeline as the
Ava version with no scene edits. Output: public/vo/ai-voice-chattts/<id>.mp3 +
src/videos/ai-voice-comparison/vo-manifest-chattts.json. Ava files untouched.
"""
import os, wave, subprocess, json
import numpy as np
import torch
import ChatTTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VODIR = os.path.join(ROOT, "public", "vo", "ai-voice-chattts")
SPK_FILE = os.path.join(ROOT, "out", "chattts-samples", "spk-seed23.txt")
MANIFEST = os.path.join(ROOT, "src", "videos", "ai-voice-comparison", "vo-manifest-chattts.json")
os.makedirs(VODIR, exist_ok=True)

# id -> spoken text (ChatTTS-tuned: numbers spelled, acronyms spaced, no '?')
CUES = {
    "av1-c1": "Five A I voices. Only one is right for you.",
    "av1-c2": "Pick wrong, and you waste time or money — so I scored all five, on the data.",
    "av2-c1": "Two numbers tell the story. First, M O S — a one to five score from real human listeners.",
    "av2-c2": "Then four metrics: naturalness, emotion, speed, and value. Lowest to highest, let's go.",
    "av3-c1": "Bottom of the pile: your Mac's built-in Siri. M O S, just three point oh.",
    "av3-c2": "Naturalness sixty, emotion forty — robotic. Use it to proofread, never to publish.",
    "av4-c1": "Edge T T S: M O S four point two, and free. Value pegged at a hundred — unbeatable for mass production.",
    "av4-c2": "The catch. It's unofficial, with a slight news-anchor tone.",
    "av5-c1": "Chat T T S: M O S four point seven. Emotion, a perfect hundred — real breathing and laughter, made for dialogue.",
    "av5-c2": "The catch. It's open-source, so you self-host it with Python.",
    "av6-c1": "OpenAI's text-to-speech: M O S four point five. Speed ninety, clean and stable — the developer's pick.",
    "av6-c2": "It's pay-as-you-go, but cheap, and dead simple to wire into an app.",
    "av7-c1": "And the champion: Eleven Labs. M O S four point eight, the highest here, with naturalness and emotion near a hundred.",
    "av7-c2": "The catch. It's pay-per-character, so it gets pricey at scale.",
    "av8-c1": "Head to head: Eleven Labs and Chat T T S win on naturalness and emotion.",
    "av8-c2": "The free tools win on speed and value. Every column has a different champion.",
    "av9-c1": "So here's your three-second cheat sheet.",
    "av9-c2": "Free at scale, Edge. Podcasts, Chat T T S. An app, OpenAI. Pure quality, Eleven Labs.",
    "av10-c1": "The best A I voice isn't the priciest — it's the one that fits your job.",
    "av10-c2": "So which one are you picking. Tell me in the comments.",
}

# max seconds each clip may occupy in the existing timeline (gap / scene-end derived)
SLOT = {
    "av1-c1": 4.47, "av1-c2": 6.0,
    "av2-c1": 6.93, "av2-c2": 8.3,
    "av3-c1": 6.37, "av3-c2": 6.97,
    "av4-c1": 8.73, "av4-c2": 5.23,
    "av5-c1": 9.53, "av5-c2": 4.87,
    "av6-c1": 8.53, "av6-c2": 5.57,
    "av7-c1": 8.93, "av7-c2": 5.5,
    "av8-c1": 6.6, "av8-c2": 5.9,
    "av9-c1": 3.13, "av9-c2": 10.13,
    "av10-c1": 5.4, "av10-c2": 5.13,
}


def save_wav(path, audio, sr=24000):
    a = np.clip(np.asarray(audio).flatten().astype("float32"), -1.0, 1.0)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((a * 32767.0).astype("<i2").tobytes())


def probe(path):
    return float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path],
        capture_output=True, text=True).stdout.strip())


def main():
    with open(SPK_FILE) as f:
        spk = f.read().strip()
    print(f"loaded speaker seed-23 ({len(spk)} chars)", flush=True)

    chat = ChatTTS.Chat()
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)
    print("model loaded\n", flush=True)

    infer = ChatTTS.Chat.InferCodeParams(spk_emb=spk, temperature=0.3, top_P=0.7, top_K=20)
    refine = ChatTTS.Chat.RefineTextParams(prompt="[oral_2][laugh_0][break_4]")

    manifest = {}
    for cid, text in CUES.items():
        torch.manual_seed(23)
        wavs = chat.infer([text], params_infer_code=infer, params_refine_text=refine)
        audio = wavs[0]
        if hasattr(audio, "detach"):
            audio = audio.detach().cpu().numpy()
        raw = f"/tmp/full_{cid}.wav"
        save_wav(raw, audio)
        nat = probe(raw)
        slot = SLOT.get(cid, nat)
        mp3 = os.path.join(VODIR, f"{cid}.mp3")
        if nat > slot:
            ratio = min(2.0, nat / (slot * 0.97))  # speed up to fit
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", raw,
                            "-filter:a", f"atempo={ratio:.4f}", "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
            tag = f"fit x{ratio:.2f}"
        else:
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", raw,
                            "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
            tag = "ok"
        fin = probe(mp3)
        manifest[cid] = round(fin, 3)
        print(f"  {cid:8s} nat {nat:4.1f}s  slot {slot:4.1f}s  -> {fin:4.1f}s  [{tag}]", flush=True)

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    print(f"\n✓ 20 clips -> public/vo/ai-voice-chattts/  ·  manifest -> {os.path.relpath(MANIFEST, ROOT)}", flush=True)


if __name__ == "__main__":
    main()
