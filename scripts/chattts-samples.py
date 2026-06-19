#!/usr/bin/env python3
"""
Generate 5 ChatTTS voice samples (one fixed speaker) into out/chattts-samples/.
Standalone experiment — does NOT touch the Ava edge-tts files in public/vo/ai-voice/.

Run with the venv python:  .venv-chattts/bin/python scripts/chattts-samples.py
"""
import os, sys, wave, subprocess
import numpy as np
import torch
import ChatTTS

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out", "chattts-samples")
os.makedirs(OUT, exist_ok=True)

# 3 real narration lines from the video + 2 dialogue-style lines (ChatTTS's specialty)
SAMPLES = [
    ("1-hook", "Five A I voices. Only one is right for you."),
    ("2-numbers", "The champion is Eleven Labs. An M O S of four point eight, the highest, with naturalness and emotion near one hundred."),
    ("3-cheatsheet", "Free at scale? Edge. Podcasts? Chat T T S. Building an app? Open A I. Pure quality? Eleven Labs."),
    ("4-dialogue", "So, which AI voice should you actually pick? [uv_break] Honestly, it just depends on your budget. [laugh]"),
    ("5-dialogue", "Wait, this one is completely free? [uv_break] Yeah, and it sounds amazing."),
]


def save_wav(path, audio, sr=24000):
    a = np.clip(np.asarray(audio).flatten().astype("float32"), -1.0, 1.0)
    pcm = (a * 32767.0).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def main():
    print("loading ChatTTS (first run downloads ~1GB model)…", flush=True)
    chat = ChatTTS.Chat()
    # force CPU — MPS can produce NaNs/garbage with ChatTTS
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)
    print("model loaded.", flush=True)

    # fix ONE speaker so all 5 clips are the same voice
    torch.manual_seed(42)
    spk = chat.sample_random_speaker()

    infer = ChatTTS.Chat.InferCodeParams(spk_emb=spk, temperature=0.3, top_P=0.7, top_K=20)
    refine = ChatTTS.Chat.RefineTextParams(prompt="[oral_2][laugh_0][break_4]")

    for name, text in SAMPLES:
        torch.manual_seed(42)  # reproducible per line
        wavs = chat.infer([text], params_infer_code=infer, params_refine_text=refine)
        audio = wavs[0]
        if hasattr(audio, "detach"):
            audio = audio.detach().cpu().numpy()
        wavp = f"/tmp/cs_{name}.wav"
        mp3p = os.path.join(OUT, f"sample-{name}.mp3")
        save_wav(wavp, audio)
        subprocess.run(
            ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp, "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3p],
            check=True,
        )
        dur = len(np.asarray(audio).flatten()) / 24000.0
        print(f"  ✓ sample-{name}.mp3  ({dur:.1f}s)", flush=True)

    print("\nDONE →", OUT, flush=True)


if __name__ == "__main__":
    main()
