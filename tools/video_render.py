#!/usr/bin/env python3
"""대본과 나레이션으로 실제 영상 파일(mp4)을 만든다.

    python3 tools/video_render.py --check
        필요한 도구가 깔렸는지 먼저 확인한다.

    python3 tools/video_render.py video/scripts/2026-08-26-....md --all
        롱폼 1 · 중폼 1 · 숏폼 3 = 그 주 다섯 편을 한 번에 렌더한다.

    python3 tools/video_render.py <대본> --short1        # 하나만
    python3 tools/video_render.py <대본> --all --voice   # 직접 녹음한 목소리 사용

결과는 video/render/<슬러그>/ 아래로 떨어진다.

    롱폼.mp4  중폼.mp4  숏폼1.mp4  숏폼2.mp4  숏폼3.mp4
    롱폼.srt  ...                     유튜브 자막 업로드용

필요한 것
    ffmpeg / ffprobe   영상 합성          brew install ffmpeg  ·  winget install ffmpeg
    크롬(또는 엣지)     자막 화면 렌더링    이미 깔려 있으면 자동으로 찾는다

나레이션
    기본값은 운영체제 내장 TTS 다 (macOS say · Windows SAPI · Linux espeak-ng).
    --voice 를 주면 video/voice/<슬러그>/<이름>/01.wav ... 를 구간 순서대로 쓴다.
    본인 목소리를 권한다 — 유튜브 재사용 콘텐츠 심사에도, 신뢰도에도 유리하다 (video/STYLE.md).

화면은 전부 자체 생성이라 저작권 문제가 없다. 숏폼·중폼은 이대로 올리고,
롱폼만 편집기에서 B롤을 얹는 것이 주간 리듬의 전제다 (video/plan.md 7절).
"""

import html
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT, slugify
from video_export import CHAPTER, parse, sections, clean

RENDER = os.path.join(ROOT, "video", "render")
VOICE = os.path.join(ROOT, "video", "voice")
GAP = 0.28          # 자막 한 줄이 끝나고 다음 줄로 넘어가기 전 여백(초)
FPS = 30

VARIANTS = {
    "long":   {"name": "롱폼", "section": "대본",  "size": (1920, 1080), "cap": 26},
    "mid":    {"name": "중폼", "section": "중폼",  "size": (1920, 1080), "cap": 26},
    "short1": {"name": "숏폼1", "section": "숏폼", "pick": "숏폼 1", "size": (1080, 1920), "cap": 13},
    "short2": {"name": "숏폼2", "section": "숏폼", "pick": "숏폼 2", "size": (1080, 1920), "cap": 13},
    "short3": {"name": "숏폼3", "section": "숏폼", "pick": "숏폼 3", "size": (1080, 1920), "cap": 13},
}

CHROME_CANDIDATES = [
    os.environ.get("CHROME_BIN", ""),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge",
]


# ------------------------------------------------------------------ 환경

def find_chrome():
    for candidate in CHROME_CANDIDATES:
        if not candidate:
            continue
        if os.path.isfile(candidate):
            return candidate
        found = shutil.which(candidate)
        if found:
            return found
    return None


def run(args, **kwargs):
    return subprocess.run(args, check=True, capture_output=True, **kwargs)


DURATION = re.compile(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)")


def duration_of(path):
    """ffprobe 가 있으면 쓰고, 없으면 ffmpeg 출력에서 읽는다."""
    if shutil.which("ffprobe"):
        out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                   "-of", "default=noprint_wrappers=1:nokey=1", path]).stdout
        return float(out.decode().strip())
    probe = subprocess.run(["ffmpeg", "-i", path], capture_output=True)
    match = DURATION.search(probe.stderr.decode("utf-8", "replace"))
    if not match:
        raise SystemExit("오디오 길이를 못 읽었습니다: %s" % path)
    return int(match.group(1)) * 3600 + int(match.group(2)) * 60 + float(match.group(3))


def check():
    chrome = find_chrome()
    rows = [
        ("ffmpeg", shutil.which("ffmpeg"), "brew install ffmpeg / winget install Gyan.FFmpeg / apt install ffmpeg"),

        ("크롬 계열", chrome, "크롬·엣지·크로미움 중 아무거나. CHROME_BIN 으로 직접 지정도 된다"),
        ("TTS", tts_kind(), "--voice 로 직접 녹음한 파일을 쓰면 없어도 된다"),
    ]
    for label, found, hint in rows:
        print("%-10s %s" % (label, ("있음  %s" % found) if found else "없음  → %s" % hint))
    return 0 if all(r[1] for r in rows[:2]) else 1


# ------------------------------------------------------------------ 나레이션

def tts_kind():
    system = platform.system()
    if system == "Darwin" and shutil.which("say"):
        return "say"
    if system == "Windows" and shutil.which("powershell"):
        return "sapi"
    if shutil.which("espeak-ng"):
        return "espeak"
    return None


def synthesize(text, out_wav):
    """운영체제 내장 TTS 로 한 줄을 읽어 wav 로 만든다."""
    kind = tts_kind()
    if kind == "say":
        voice = os.environ.get("TTS_VOICE", "Yuna")  # macOS 한국어 음성
        aiff = out_wav + ".aiff"
        run(["say", "-v", voice, "-o", aiff, text])
        run(["ffmpeg", "-y", "-v", "error", "-i", aiff, out_wav])
        os.remove(aiff)
    elif kind == "sapi":
        script = (
            "Add-Type -AssemblyName System.Speech;"
            "$s=New-Object System.Speech.Synthesis.SpeechSynthesizer;"
            "$s.SetOutputToWaveFile(%s);$s.Speak(%s);$s.Dispose()"
            % (json.dumps(out_wav), json.dumps(text))
        )
        run(["powershell", "-NoProfile", "-Command", script])
    elif kind == "espeak":
        run(["espeak-ng", "-v", "ko", "-s", "150", "-w", out_wav, text])
    else:
        raise SystemExit(
            "쓸 수 있는 TTS 가 없습니다. --voice 로 직접 녹음한 파일을 쓰거나,\n"
            "macOS 는 시스템 설정에서 한국어 음성(Yuna)을 내려받으세요.")
    return out_wav


def pad(wav, seconds=GAP):
    """뒤에 짧은 여백을 붙여 자막이 급하게 넘어가지 않게 한다."""
    padded = wav.replace(".wav", ".pad.wav")
    run(["ffmpeg", "-y", "-v", "error", "-i", wav,
         "-af", "apad=pad_dur=%.2f" % seconds, "-ar", "44100", "-ac", "1", padded])
    os.replace(padded, wav)
    return wav


# ------------------------------------------------------------------ 대본 → 장면

SENTENCE = re.compile(r"[^.!?\n]+[.!?]?")


def split_captions(text, limit):
    """나레이션을 자막 한 줄 크기로 자른다. 문장을 먼저 끊고, 길면 쉼표에서 다시 끊는다."""
    captions = []
    for raw in SENTENCE.findall(text):
        sentence = raw.strip()
        if not sentence:
            continue
        if len(sentence) <= limit:
            captions.append(sentence)
            continue
        # 앞줄을 꽉 채우면 "…회사가 왜 / 적자일까요" 처럼 조사가 혼자 남는다.
        # 필요한 줄 수로 길이를 나눠 균등하게 끊는다.
        needed = max(1, -(-len(sentence) // limit))
        target = len(sentence) / float(needed)
        chunk, made = "", []
        for word in sentence.split():
            candidate = (chunk + " " + word).strip()
            if not chunk:
                chunk = candidate
                continue
            # 한 어절 더 넣는 게 목표 길이에서 더 멀어지면 거기서 끊는다.
            overshoots = (len(made) < needed - 1 and len(candidate) > target
                          and abs(len(chunk) - target) <= abs(len(candidate) - target))
            if len(candidate) > limit or overshoots:
                made.append(chunk)
                chunk = word
            else:
                chunk = candidate
        if chunk:
            made.append(chunk)
        captions += made
    return captions


def scenes_for(body, variant):
    """[(구간 이름, 구간 번호, 자막), ...] 를 만든다."""
    config = VARIANTS[variant]
    target = None
    for name, text in sections(body):
        if name.startswith(config["section"]):
            target = text
            break
    if target is None:
        return []

    groups = []
    if config.get("pick"):
        match = re.search(r"^###\s+%s[^\n]*$(.*?)(?=^###|\Z)" % re.escape(config["pick"]),
                          target, re.M | re.S)
        if match:
            groups = [(config["pick"], clean(match.group(1)))]
    else:
        marks = [(m.group(2).strip(), m.start(), m.end()) for m in CHAPTER.finditer(target)]
        for index, (label, _, start) in enumerate(marks):
            end = marks[index + 1][1] if index + 1 < len(marks) else len(target)
            groups.append((label, clean(target[start:end])))

    scenes = []
    for number, (label, text) in enumerate(groups, start=1):
        for caption in split_captions(text, config["cap"]):
            scenes.append((label, number, caption))
    return scenes


# ------------------------------------------------------------------ 화면

CARD = """<!doctype html><meta charset="utf-8"><style>
 html,body{margin:0;padding:0;width:%(w)dpx;height:%(h)dpx;overflow:hidden}
 body{background:%(bg)s;color:#F1F3F2;display:flex;flex-direction:column;
   justify-content:%(justify)s;padding-top:%(top)dpx;
   font-family:Pretendard,"Apple SD Gothic Neo","Malgun Gothic",
   "Noto Sans KR","NanumGothic","IBM Plex Sans KR",sans-serif;position:relative}
 .ghost{position:absolute;right:%(ghostx)dpx;top:%(ghosty)dpx;font-size:%(ghost)dpx;
   font-weight:800;color:%(accent)s;opacity:.13;line-height:1;letter-spacing:-.05em}
 .label{position:absolute;left:%(pad)dpx;top:%(pad)dpx;display:flex;align-items:center;gap:%(gap)dpx}
 .label i{display:block;width:%(dot)dpx;height:%(dot)dpx;background:%(accent)s}
 .label span{font-size:%(small)dpx;font-weight:600;letter-spacing:.14em;color:#9AA8A5}
 .cap{padding:0 %(capright)dpx 0 %(pad)dpx;font-size:%(size)dpx;font-weight:700;
   line-height:1.42;letter-spacing:-.02em;word-break:keep-all;text-wrap:balance}
 .foot{position:absolute;left:%(pad)dpx;%(footside)s:%(footy)dpx;font-size:%(small)dpx;
   color:#6F7C7A;letter-spacing:.1em}
 .bar{position:absolute;left:0;%(barside)s:0;height:%(barh)dpx;width:%(pct).2f%%;background:%(accent)s}
</style>
<div class="ghost">%(number)s</div>
<div class="label"><i></i><span>%(label)s</span></div>
<div class="cap">%(caption)s</div>
<div class="foot">세계의 비즈니스 모델</div>
<div class="bar"></div>
"""


def card_html(caption, label, number, progress, accent, size):
    width, height = size
    vertical = height > width
    pad = int(width * (0.09 if vertical else 0.07))
    return CARD % {
        "w": width, "h": height, "bg": "#16191B", "accent": accent, "pad": pad,
        # 세로는 위쪽 3분의 1 에 자막을 둔다. 아래 25% 는 쇼츠 UI 가 덮는다.
        "justify": "flex-start" if vertical else "center",
        "top": int(height * 0.36) if vertical else 0,
        "capright": int(width * (0.20 if vertical else 0.07)),  # 오른쪽 버튼 열을 피한다
        "footside": "top" if vertical else "bottom",
        "footy": pad + int(width * 0.055) if vertical else pad,
        "barside": "top" if vertical else "bottom",
        "ghostx": int(width * (0.16 if vertical else 0.06)),
        "ghosty": int(height * (0.09 if vertical else 0.05)),
        "ghost": int(width * (0.22 if vertical else 0.30)),
        "gap": int(width * 0.012), "dot": int(width * 0.011),
        "small": int(width * (0.021 if vertical else 0.0135)),
        "size": int(width * (0.068 if vertical else 0.046)),
        "barh": int(height * (0.005 if vertical else 0.008)), "pct": progress * 100,
        "number": number, "label": html.escape(label), "caption": html.escape(caption),
    }


# 크롬 버전과 실행 환경에 따라 먹히는 조합이 다르다. 되는 걸 찾을 때까지 순서대로 시도한다.
# (--headless=new 는 구버전이 모르고, --no-sandbox 는 컨테이너·root 환경에서 필요하다)
SHOOT_MODES = [
    ["--headless=new"],
    ["--headless=new", "--no-sandbox"],
    ["--headless", "--no-sandbox"],
]
_mode = [0]


def shoot(chrome, html_path, png_path, size):
    for attempt in range(_mode[0], len(SHOOT_MODES)):
        subprocess.run(
            [chrome] + SHOOT_MODES[attempt] + [
                "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                "--window-size=%d,%d" % size, "--screenshot=" + png_path, "file://" + html_path],
            capture_output=True)
        if os.path.exists(png_path):
            _mode[0] = attempt  # 되는 조합을 찾았으면 다음부터 바로 그걸 쓴다
            return
    raise SystemExit("크롬이 화면을 못 만들었습니다. CHROME_BIN 으로 다른 브라우저를 지정해 보세요.")


# ------------------------------------------------------------------ 자막 파일

def timestamp(seconds):
    ms = int(round(seconds * 1000))
    return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)


def write_srt(scenes, durations, path):
    lines, clock = [], 0.0
    for index, ((_, _, caption), length) in enumerate(zip(scenes, durations), start=1):
        lines.append("%d\n%s --> %s\n%s\n" % (
            index, timestamp(clock), timestamp(clock + length), caption))
        clock += length
    with open(path, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))


# ------------------------------------------------------------------ 렌더

def render(script_path, variant, use_voice):
    meta, body = parse(script_path)
    config = VARIANTS[variant]
    scenes = scenes_for(body, variant)
    if not scenes:
        print("  %s  건너뜀 — 대본이 비어 있습니다" % config["name"])
        return None

    slug = slugify(meta["title"])
    out_dir = os.path.join(RENDER, slug)
    os.makedirs(out_dir, exist_ok=True)
    accent = meta.get("color", "#2F6FED")
    chrome = find_chrome()
    work = tempfile.mkdtemp(prefix="render-")

    try:
        # 1) 나레이션
        audio_paths, durations = [], []
        voice_dir = os.path.join(VOICE, slug, config["name"])
        if use_voice:
            available = sorted(f for f in os.listdir(voice_dir)) if os.path.isdir(voice_dir) else []
            if not available:
                raise SystemExit("녹음 파일이 없습니다: %s\n구간 순서대로 01.wav, 02.wav ... 로 넣으세요."
                                 % os.path.relpath(voice_dir, ROOT))
        by_chapter = {}
        for index, (_, number, _) in enumerate(scenes):
            by_chapter.setdefault(number, []).append(index)

        if use_voice:
            # 구간별 녹음 하나를 그 구간의 자막들이 글자 수 비율로 나눠 갖는다.
            for order, number in enumerate(sorted(by_chapter)):
                path = os.path.join(voice_dir, available[min(order, len(available) - 1)])
                audio_paths.append(path)
                length = duration_of(path)
                indexes = by_chapter[number]
                chars = sum(len(scenes[i][2]) for i in indexes) or 1
                durations += [length * len(scenes[i][2]) / chars for i in indexes]
                print("\r  %s  나레이션 %d/%d" % (config["name"], order + 1, len(by_chapter)),
                      end="", flush=True)
        else:
            for index, (_, _, caption) in enumerate(scenes):
                wav = os.path.join(work, "a%04d.wav" % index)
                pad(synthesize(caption, wav))
                audio_paths.append(wav)
                durations.append(duration_of(wav))
                print("\r  %s  나레이션 %d/%d" % (config["name"], index + 1, len(scenes)),
                      end="", flush=True)

        # 2) 화면
        for index, (label, number, caption) in enumerate(scenes):
            page = os.path.join(work, "s%04d.html" % index)
            with open(page, "w", encoding="utf-8") as handle:
                shown = meta.get("category", "") if config.get("pick") else label
                mark = "%02d" % (index + 1 if config.get("pick") else number)
                handle.write(card_html(caption, shown, mark, (index + 1) / float(len(scenes)),
                                       accent, config["size"]))
            shoot(chrome, page, os.path.join(work, "s%04d.png" % index), config["size"])
            print("\r  %s  화면 %d/%d      " % (config["name"], index + 1, len(scenes)),
                  end="", flush=True)

        # 3) 합성
        images = os.path.join(work, "images.txt")
        with open(images, "w", encoding="utf-8") as handle:
            for index, length in enumerate(durations):
                handle.write("file '%s'\nduration %.3f\n" % (
                    os.path.join(work, "s%04d.png" % index), length))
            handle.write("file '%s'\n" % os.path.join(work, "s%04d.png" % (len(durations) - 1)))

        audio_list = os.path.join(work, "audio.txt")
        with open(audio_list, "w", encoding="utf-8") as handle:
            for path in audio_paths:
                handle.write("file '%s'\n" % os.path.abspath(path))

        mp4 = os.path.join(out_dir, "%s.mp4" % config["name"])
        run(["ffmpeg", "-y", "-v", "error",
             "-f", "concat", "-safe", "0", "-i", images,
             "-f", "concat", "-safe", "0", "-i", audio_list,
             "-c:v", "libx264", "-preset", "medium", "-crf", "20",
             "-pix_fmt", "yuv420p", "-r", str(FPS),
             "-c:a", "aac", "-b:a", "192k", "-shortest", mp4])
        write_srt(scenes, durations, os.path.join(out_dir, "%s.srt" % config["name"]))

        total = sum(durations)
        print("\r  %-5s %s  %d:%02d  장면 %d개%s" % (
            config["name"], os.path.relpath(mp4, ROOT), total // 60, total % 60, len(scenes),
            "" if variant not in ("long", "mid") or in_range(variant, total) else "  ⚠ 규격 밖"))
        return mp4
    finally:
        shutil.rmtree(work, ignore_errors=True)


def in_range(variant, seconds):
    return (570 <= seconds <= 630) if variant == "long" else (160 <= seconds <= 200)


def main():
    args = sys.argv[1:]
    if "--check" in args:
        return check()

    scripts = [a for a in args if a.endswith(".md")]
    if not scripts:
        print(__doc__)
        return 1
    if not shutil.which("ffmpeg"):
        print("ffmpeg 이 없습니다. `python3 tools/video_render.py --check` 로 확인하세요.")
        return 1
    if not find_chrome():
        print("크롬 계열 브라우저를 못 찾았습니다. CHROME_BIN 으로 지정하세요.")
        return 1

    chosen = [v for v in VARIANTS if "--" + v in args]
    if "--all" in args or not chosen:
        chosen = list(VARIANTS)
    use_voice = "--voice" in args

    meta = parse(scripts[0])[0]
    print("%s  (%s)" % (meta["title"], meta.get("category", "")))
    made = [render(scripts[0], variant, use_voice) for variant in chosen]
    print("\n%d편 나왔습니다. 숏폼·중폼은 그대로 올리고, 롱폼만 편집기에서 B롤을 얹으세요."
          % len([m for m in made if m]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
