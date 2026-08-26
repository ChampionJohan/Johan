#!/usr/bin/env python3
"""책 원고를 오디오북으로 만든다.

    python3 tools/audiobook.py book --export         # 장별 낭독용 txt (상용 TTS/성우용)
    python3 tools/audiobook.py book --demo 020        # 한 장을 실제 mp3로 만들어 들어 본다
    python3 tools/audiobook.py book --all             # 전체를 mp3로 (기본 TTS, 품질 낮음)

book 대신 book-teen 을 넣으면 청소년판이다.

무료 내장 TTS(espeak-ng 등)로 만들면 로봇 음성이다. 결과물을 서비스에 낼
생각이면 --export 로 뽑은 텍스트를 상용 TTS(타입캐스트·클로바더빙 등)나
성우 녹음에 넣는 편이 훨씬 낫다. --demo/--all 은 미리 들어 보는 용도다.

의존성: espeak-ng (또는 macOS 라면 자동으로 say 를 쓴다), ffmpeg.
둘 다 없으면 --export 만 쓸 수 있다.
"""

import os
import platform
import re
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite

CHARS_PER_MIN = 330  # 성인 낭독 기준. 청소년판은 더 짧은 문장이라 조금 빠르다.


def load_module(which):
    import book as m
    if which in ("book-teen", "teen"):
        __import__("book_teen")
    elif which not in ("book", "adult"):
        raise SystemExit("첫 인자는 book 또는 book-teen 이어야 합니다.")
    return m


def narration_text(item, m):
    """챕터 본문을 낭독용 평문으로 뽑는다. 표는 낭독에 안 맞아 문장으로 푼다."""
    body, _ = m.clean_body(item, keep_flags=False)
    body = re.sub(r"(?m)^\|.*\|$", "", body)  # 표는 낭독하지 않는다
    body = re.sub(r"(?m)^\s*---+\s*$", "", body)
    text = mdlite.to_plain(body).strip()
    text = re.sub(r"\n{2,}", "\n\n", text)
    return text


def export(m):
    items = [i for i in m.load() if not (i["kind"] == "front" and i.get("order") == "0")]
    out = os.path.join(m.SITE, "narration")
    os.makedirs(out, exist_ok=True)
    for item in items:
        text = narration_text(item, m)
        path = os.path.join(out, "%s.txt" % item["slug"])
        with open(path, "w", encoding="utf-8") as handle:
            handle.write("%s\n%s\n\n%s\n" % (item["title"], "=" * 40, text))
    print("만들었습니다: %s  (%d개 장, 상용 TTS/성우 녹음용)" % (os.path.relpath(out, m.ROOT), len(items)))
    return out


def tts_kind():
    if platform.system() == "Darwin" and shutil.which("say"):
        return "say"
    if shutil.which("espeak-ng"):
        return "espeak"
    return None


def synthesize(text, out_wav):
    kind = tts_kind()
    if kind == "say":
        voice = os.environ.get("TTS_VOICE", "Yuna")
        aiff = out_wav + ".aiff"
        subprocess.run(["say", "-v", voice, "-o", aiff, text], check=True)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", aiff, out_wav], check=True)
        os.remove(aiff)
    elif kind == "espeak":
        subprocess.run(["espeak-ng", "-v", "ko", "-s", "165", "-p", "45", "-w", out_wav, text], check=True)
    else:
        raise SystemExit("쓸 수 있는 TTS 가 없습니다. --export 만 쓸 수 있습니다.")


def ffmpeg_bin():
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        raise SystemExit("ffmpeg 이 없습니다.")


def render_one(item, m, out_dir):
    text = narration_text(item, m)
    if not text:
        return None
    ffmpeg = ffmpeg_bin()
    wav = os.path.join(out_dir, item["slug"] + ".wav")
    synthesize(text, wav)
    mp3 = os.path.join(out_dir, item["slug"] + ".mp3")
    subprocess.run([ffmpeg, "-y", "-v", "error", "-i", wav,
                     "-codec:a", "libmp3lame", "-b:a", "128k", mp3], check=True)
    os.remove(wav)
    chars = len(re.sub(r"\s+", " ", text))
    minutes = chars / float(CHARS_PER_MIN)
    print("  %-8s %-40s %s자 · 약 %d분%02d초" % (
        item["slug"], item["title"][:40], format(chars, ","), int(minutes), round((minutes % 1) * 60)))
    return mp3


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 1
    m = load_module(args[0])
    rest = args[1:]

    if "--export" in rest or not rest:
        export(m)
        return 0

    items = [i for i in m.load() if not (i["kind"] == "front" and i.get("order") == "0")]
    out_dir = os.path.join(m.SITE, "audio")
    os.makedirs(out_dir, exist_ok=True)

    if "--demo" in rest:
        idx = rest.index("--demo")
        prefix = rest[idx + 1] if idx + 1 < len(rest) else None
        if not prefix:
            print("어느 장인지 파일 이름 앞자리(예: 020)를 알려주세요.")
            return 1
        matches = [i for i in items if i["slug"] == "s" + prefix]
        if not matches:
            print("그 번호로 시작하는 장을 못 찾았습니다.")
            return 1
        print("(TTS: %s 로 만듭니다 — 실제 발행본은 상용 TTS나 성우 녹음을 권합니다)" % (tts_kind() or "없음"))
        render_one(matches[0], m, out_dir)
        return 0

    if "--all" in rest:
        print("(TTS: %s)" % (tts_kind() or "없음 — --export 만 가능합니다"))
        for item in items:
            render_one(item, m, out_dir)
        print("만들었습니다: %s" % os.path.relpath(out_dir, m.ROOT))
        return 0

    print(__doc__)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
