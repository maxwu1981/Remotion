#!/usr/bin/env python3
"""
Audition multiple ChatTTS speakers: same line, different fixed speakers (seeds),
with an approximate pitch (F0) measurement so we can avoid deep/low voices.
Output: out/chattts-samples/audition/cand-seedNNN.mp3  (does NOT touch Ava).
"""
import os, wave, subprocess
import numpy as np
import torch
import torchaudio.functional as AF
import ChatTTS

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out", "chattts-samples", "audition")
os.makedirs(OUT, exist_ok=True)

LINE = "Five AI voices. Only one is right for you. So I scored all five, on the data."
SEEDS = [2, 5, 11, 17, 23, 70, 88, 111, 222, 369]  # excludes 42 (the deep one you disliked)


def save_wav(path, audio, sr=24000):
    a = np.clip(np.asarray(audio).flatten().astype("float32"), -1.0, 1.0)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((a * 32767.0).astype("<i2").tobytes())


def mean_pitch(audio, sr=24000):
    try:
        t = torch.tensor(np.asarray(audio).flatten().astype("float32")).unsqueeze(0)
        p = AF.detect_pitch_frequency(t, sr).flatten().numpy()
        p = p[(p > 75) & (p < 400)]
        return float(np.median(p)) if len(p) else 0.0
    except Exception:
        return 0.0


def main():
    chat = ChatTTS.Chat()
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)
    print("model loaded\n", flush=True)

    results = []
    for seed in SEEDS:
        torch.manual_seed(seed)
        spk = chat.sample_random_speaker()
        infer = ChatTTS.Chat.InferCodeParams(spk_emb=spk, temperature=0.3, top_P=0.7, top_K=20)
        refine = ChatTTS.Chat.RefineTextParams(prompt="[oral_2][laugh_0][break_4]")
        torch.manual_seed(seed)
        wavs = chat.infer([LINE], params_infer_code=infer, params_refine_text=refine)
        audio = wavs[0]
        if hasattr(audio, "detach"):
            audio = audio.detach().cpu().numpy()
        f0 = mean_pitch(audio)
        wavp = f"/tmp/cand_{seed}.wav"
        save_wav(wavp, audio)
        mp3 = os.path.join(OUT, f"cand-seed{seed:03d}-{int(f0)}hz.mp3")
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wavp, "-ar", "44100", "-ac", "1", "-b:a", "192k", mp3], check=True)
        results.append((seed, f0, os.path.basename(mp3)))
        print(f"  seed {seed:3d}  ~{f0:5.0f} Hz  {os.path.basename(mp3)}", flush=True)

    print("\n=== sorted brightest → deepest (higher Hz = brighter/less deep) ===")
    for seed, f0, name in sorted(results, key=lambda r: -r[1]):
        tone = "bright" if f0 >= 190 else ("mid" if f0 >= 145 else "deep")
        print(f"  seed {seed:3d}  ~{f0:5.0f} Hz  [{tone}]  {name}")
    print("\nDONE →", OUT)


if __name__ == "__main__":
    main()
