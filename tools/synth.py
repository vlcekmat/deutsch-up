# Synthesises a batch of texts with Piper (called by tools/build_audio.js).
# Usage: tools/tts/venv/bin/python tools/synth.py jobs.json
#   jobs.json = [{ "voice": ".../de_DE-kerstin-medium.onnx", "text": "...", "wav": "out.wav" }, ...]
import json
import sys
import wave

from piper import PiperVoice

jobs = json.load(open(sys.argv[1], encoding='utf-8'))
loaded = {}
for i, job in enumerate(jobs):
    voice = loaded.get(job['voice'])
    if voice is None:
        voice = loaded[job['voice']] = PiperVoice.load(job['voice'])
    with wave.open(job['wav'], 'wb') as w:
        voice.synthesize_wav(job['text'], w)
    if i % 100 == 99:
        print('synthesised', i + 1, 'of', len(jobs), flush=True)
