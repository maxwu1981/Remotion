#!/usr/bin/env python3
"""Diagnose ChatTTS dropped-words: show the refine-text rewrite for every line,
and A/B a few lines (with refine vs raw / skip_refine) by audio duration."""
import os, wave, subprocess
import numpy as np, torch, ChatTTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPK = open(os.path.join(ROOT, "out", "chattts-samples", "spk-seed23.txt")).read().strip()

CUES = {
    "av1-c1": "Five A I voices. Only one is right for you.",
    "av2-c1": "Two numbers tell the story. First, M O S — a one to five score from real human listeners.",
    "av4-c1": "Edge T T S: M O S four point two, and free. Value pegged at a hundred — unbeatable for mass production.",
    "av7-c1": "And the champion: Eleven Labs. M O S four point eight, the highest here, with naturalness and emotion near a hundred.",
    "av9-c2": "Free at scale, Edge. Podcasts, Chat T T S. An app, OpenAI. Pure quality, Eleven Labs.",
}

# cleaned variant (no em-dash, acronyms as words) to test
CLEAN = {
    "av2-c1": "Two numbers tell the story. First, MOS, a one to five score from real human listeners.",
    "av4-c1": "Edge TTS. MOS four point two, and free. Value pegged at a hundred. Unbeatable for mass production.",
    "av7-c1": "And the champion, ElevenLabs. MOS four point eight, the highest here, with naturalness and emotion near a hundred.",
}


def dur_of(audio, sr=24000):
    return len(np.asarray(audio).flatten()) / sr


def gen(chat, text, spk, skip_refine):
    torch.manual_seed(23)
    infer = ChatTTS.Chat.InferCodeParams(spk_emb=spk, temperature=0.3, top_P=0.7, top_K=20)
    kw = dict(params_infer_code=infer)
    if skip_refine:
        kw["skip_refine_text"] = True
    else:
        kw["params_refine_text"] = ChatTTS.Chat.RefineTextParams(prompt="[oral_2][laugh_0][break_4]")
    a = chat.infer([text], **kw)[0]
    if hasattr(a, "detach"):
        a = a.detach().cpu().numpy()
    return a


def main():
    chat = ChatTTS.Chat()
    try:
        chat.load(source="huggingface", compile=False, device=torch.device("cpu"))
    except TypeError:
        chat.load(source="huggingface", compile=False)

    print("\n===== 1) REFINE rewrite (what ChatTTS actually says) =====")
    for cid, text in CUES.items():
        torch.manual_seed(23)
        r = chat.infer([text], refine_text_only=True,
                       params_refine_text=ChatTTS.Chat.RefineTextParams(prompt="[oral_2][laugh_0][break_4]"))
        print(f"\n[{cid}]")
        print(f"  IN : {text}")
        print(f"  OUT: {r[0]}")

    print("\n\n===== 2) audio duration: refine vs skip_refine vs clean+skip =====")
    for cid in ["av2-c1", "av4-c1", "av7-c1"]:
        d_ref = dur_of(gen(chat, CUES[cid], SPK, skip_refine=False))
        d_raw = dur_of(gen(chat, CUES[cid], SPK, skip_refine=True))
        d_cln = dur_of(gen(chat, CLEAN[cid], SPK, skip_refine=True))
        print(f"  {cid}:  refine {d_ref:4.1f}s   raw/skip {d_raw:4.1f}s   clean+skip {d_cln:4.1f}s")
        # save the clean+skip one to listen
        a = gen(chat, CLEAN[cid], SPK, skip_refine=True)
        wp = f"/tmp/diag_{cid}.wav"
        x = np.clip(np.asarray(a).flatten().astype("float32"), -1, 1)
        with wave.open(wp, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes((x * 32767).astype("<i2").tobytes())
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", wp, "-ar", "44100", "-ac", "1",
                        os.path.join(ROOT, "out", "chattts-samples", f"diag-{cid}-clean.mp3")], check=True)
    print("\nclean+skip samples → out/chattts-samples/diag-*.mp3")


if __name__ == "__main__":
    main()
