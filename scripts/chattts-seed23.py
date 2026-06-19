#!/usr/bin/env python3
"""
Lock ChatTTS speaker = seed 23, save its embedding, and render 6 more lines
(varied real video copy) so we can confirm the voice. Output to
out/chattts-samples/seed23/ — does NOT touch the Ava files.
"""
import os, wave, subprocess
import numpy as np
import torch
import ChatTTS

BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out", "chattts-samples")
OUT = os.path.join(BASE, "seed23")
os.makedirs(OUT, exist_ok=True)
SEED = 23

# varied lines: number/acronym heavy, long descriptive, list, closing
LINES = [
    ("1-mos", "Two numbers tell the story. First, M O S — a one to five score from real human listeners."),
    ("2-siri", "Bottom of the pile: your Mac's built-in Siri. M O S, just three point oh."),
    ("3-chattts", "Chat T T S: M O S four point seven. Emotion, a perfect hundred — real breathing and laughter, made for dialogue."),
    ("4-elevenlabs", "And the champion: Eleven Labs. M O S four point eight, the highest here, with naturalness and emotion near one hundred."),
    ("5-cheatsheet", "Free at scale, use Edge. Podcasts, Chat T T S. Building an app, Open A I. Pure quality, Eleven Labs."),
    ("6-closing", "The best AI voice isn't the priciest. It's the one that fits your job."),
]


def save_wav(path, audio, sr=24000):
    a = np.clip(np.asarray(audio).flatten().astype("float32"), -1.0, 1.0)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((a * 32767.0).astype("<i2").tobytes())


def main():
    chat = ChatTTS.Chat()
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)
    print("model loaded", flush=True)

    torch.manual_seed(SEED)
    spk = chat.sample_random_speaker()
    spk_path = os.path.join(BASE, "spk-seed23.txt")
    with open(spk_path, "w") as f:
        f.write(spk)
    print(f"saved speaker embedding → {spk_path}  ({len(spk)} chars)", flush=True)

    infer = ChatTTS.Chat.InferCodeParams(spk_emb=spk, temperature=0.3, top_P=0.7, top_K=20)
    refine = ChatTTS.Chat.RefineTextParams(prompt="[oral_2][laugh_0][break_4]")

    for name, text in LINES:
        torch.manual_seed(SEED)
        wavs = chat.infer([text], params_infer_code=infer, params_refine_text=refine)
        audio = wavs[0]
        if hasattr(audio, "detach"):
            audio = audio.detach().cpu().numpy()
        wavp = f"/tmp/s23_{name}.wav"
        mp3 = os.path.join(OUT, f"seed23-{name}.mp3")
        save_wav(wavp, audio)
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp, "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
        print(f"  ✓ seed23-{name}.mp3  ({len(np.asarray(audio).flatten())/24000:.1f}s)", flush=True)

    print("\nDONE →", OUT, flush=True)


if __name__ == "__main__":
    main()
