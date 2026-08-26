#!/usr/bin/env python3
"""대본에서 화면에 쓸 그래픽을 자동으로 만든다.

    python3 tools/video_assets.py              # status 가 draft 가 아닌 대본 전부
    python3 tools/video_assets.py --latest     # 가장 최근 대본 하나
    python3 tools/video_assets.py 2026-08-26   # 특정 날짜
    python3 tools/video_assets.py --all        # 초고까지 전부

video/assets/<슬러그>/ 아래로 떨어진다.

    thumbnail.svg      1280x720 썸네일
    frames.svg         1920x1080 BM 5칸 고정 그래픽
    chapters/NN-*.svg  구간별 타이틀 카드
    board.html         전부 모아 본 장면 보드 (브라우저로 열어 확인·캡처)

SVG 는 피그마·캔바가 그대로 읽고, 브라우저로 열어 캡처하면 PNG 가 된다.
저작권 문제가 없는 자체 제작 소재라 화면의 절반을 이걸로 채우는 게 목표다 (video/STYLE.md).
"""

import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT, slugify
from video_export import CHAPTER, parse, sections, clean

ASSETS = os.path.join(ROOT, "video", "assets")
FONT = "IBM Plex Sans KR, Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif"
MONO = "IBM Plex Mono, D2Coding, Consolas, monospace"
BG, FG, DIM = "#16191B", "#F1F3F2", "#8B9895"
ROW = re.compile(r"^\|\s*(\d)\.\s*([^|—]+?)\s*(?:—[^|]*)?\|\s*(.*?)\s*\|\s*$", re.M)


def esc(text):
    return html.escape(str(text), quote=True)


def width_of(text):
    """한글은 한 글자 폭, 영숫자는 절반으로 잡는다."""
    return sum(1.0 if ord(c) > 0x2E80 else 0.52 for c in text)


def wrap(text, limit):
    """limit(글자 폭 단위) 안으로 줄바꿈한다. 한국어는 어절 단위로 끊는다."""
    lines, line = [], ""
    for word in text.split():
        candidate = (line + " " + word).strip()
        if line and width_of(candidate) > limit:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def text_block(lines, x, y, size, weight=600, fill=None, spacing=1.28, anchor="start"):
    out = []
    for index, line in enumerate(lines):
        out.append(
            '<text x="%d" y="%.0f" font-family="%s" font-size="%d" font-weight="%d" '
            'fill="%s" text-anchor="%s">%s</text>'
            % (x, y + index * size * spacing, FONT, size, weight, fill or FG, anchor, esc(line))
        )
    return "\n  ".join(out)


def svg(width, height, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" '
            'viewBox="0 0 %d %d">\n  <rect width="%d" height="%d" fill="%s"/>\n  %s\n</svg>\n'
            % (width, height, width, height, width, height, BG, body))


def five_frames(body):
    """리서치 섹션의 BM 5칸 표를 [(번호, 이름, 내용), ...] 로 읽는다."""
    for name, text in sections(body):
        if not name.startswith("리서치"):
            continue
        rows = []
        for num, label, value in ROW.findall(text):
            value = re.sub(r"<!--.*?-->", "", value).strip()
            rows.append((num, label.strip(), value))
        return [r for r in rows if r[0] in "12345"]
    return []


def chapters_of(body):
    for name, text in sections(body):
        if name.startswith("대본"):
            return [(m.group(1), m.group(2).strip()) for m in CHAPTER.finditer(text)]
    return []


# ---------------------------------------------------------------- 그래픽

def thumbnail(meta):
    """1280x720. 문구는 front matter 의 thumb, 없으면 제목에서 가져온다."""
    accent = meta.get("color", "#2F6FED")
    phrase = meta.get("thumb") or meta["title"]
    # 좌우 여백 96 을 뺀 1088px 안에 들어오는 글자 폭으로 잡는다.
    lines = wrap(phrase, 1088 / 118.0)
    size = 118 if len(lines) <= 2 else 96
    if size != 118:
        lines = wrap(phrase, 1088 / float(size))[:3]
    body = [
        '<rect x="0" y="0" width="26" height="720" fill="%s"/>' % accent,
        '<text x="96" y="130" font-family="%s" font-size="30" font-weight="600" '
        'fill="%s" letter-spacing="6">%s</text>' % (MONO, accent, esc(meta.get("category", ""))),
        text_block(lines, 96, 300, size, 700),
        '<rect x="96" y="612" width="120" height="7" fill="%s"/>' % accent,
        '<text x="96" y="672" font-family="%s" font-size="27" fill="%s" '
        'letter-spacing="3">세계의 비즈니스 모델</text>' % (FONT, DIM),
    ]
    return svg(1280, 720, "\n  ".join(body))


def frames_card(meta, rows):
    """1920x1080. 매 편 같은 자리에 나오는 BM 5칸."""
    accent = meta.get("color", "#2F6FED")
    body = [
        '<text x="120" y="140" font-family="%s" font-size="26" font-weight="600" '
        'fill="%s" letter-spacing="7">BUSINESS MODEL · 5</text>' % (MONO, accent),
        text_block(wrap(meta["title"], 1680 / 62.0)[:2], 120, 232, 62, 700),
    ]
    left, gap, top = 120, 28, 400
    col = (1920 - left * 2 - gap * 4) / 5.0
    for index in range(5):
        num, label, value = rows[index] if index < len(rows) else (str(index + 1), "", "")
        x = left + index * (col + gap)
        body.append('<rect x="%.0f" y="%d" width="%.0f" height="480" fill="#1E2426"/>' % (x, top, col))
        body.append('<rect x="%.0f" y="%d" width="%.0f" height="5" fill="%s"/>' % (x, top, col, accent))
        body.append('<text x="%.0f" y="%d" font-family="%s" font-size="24" font-weight="600" '
                    'fill="%s">0%s</text>' % (x + 34, top + 76, MONO, accent, num))
        inner = (col - 68) # 칸 안쪽 폭. 여기를 넘으면 글자가 칸 밖으로 샌다.
        body.append(text_block(wrap(label, inner / 40.0)[:1], int(x + 34), top + 140, 40, 700))
        body.append(text_block(wrap(value or "…", inner / 25.0)[:7], int(x + 34), top + 208, 25, 400, DIM, 1.5))
    return svg(1920, 1080, "\n  ".join(body))


def chapter_card(meta, code, label, index, total):
    accent = meta.get("color", "#2F6FED")
    body = [
        '<rect x="0" y="1064" width="%.0f" height="16" fill="%s"/>' % (1920 * index / float(total), accent),
        '<text x="120" y="470" font-family="%s" font-size="34" font-weight="500" '
        'fill="%s" letter-spacing="5">%s</text>' % (MONO, accent, esc(code)),
        text_block(wrap(label, 1680 / 104.0)[:2], 120, 610, 104, 700),
        '<text x="120" y="760" font-family="%s" font-size="26" fill="%s">%s / %s</text>'
        % (MONO, DIM, esc("%02d" % index), esc("%02d" % total)),
    ]
    return svg(1920, 1080, "\n  ".join(body))


BOARD = """<!doctype html>
<meta charset="utf-8">
<title>%(title)s — 장면 보드</title>
<style>
 body{margin:0;background:#0D1011;color:#F1F3F2;font-family:%(font)s;padding:40px}
 h1{font-size:22px;font-weight:600;margin:0 0 6px}
 p.meta{color:#8B9895;font-size:14px;margin:0 0 32px;font-family:%(mono)s}
 figure{margin:0 0 36px}
 figcaption{font-family:%(mono)s;font-size:12px;color:#8B9895;margin-bottom:8px;letter-spacing:.08em}
 img{width:100%%;max-width:960px;display:block;border:1px solid #2B3433}
</style>
<h1>%(title)s</h1>
<p class="meta">%(category)s · %(date)s · 브라우저에서 이미지를 우클릭해 저장하면 PNG 로 쓸 수 있다</p>
%(figures)s
"""


def export(path):
    meta, body = parse(path)
    slug = slugify(meta["title"])
    out = os.path.join(ASSETS, slug)
    os.makedirs(os.path.join(out, "chapters"), exist_ok=True)

    rows = five_frames(body)
    chapters = chapters_of(body)
    written = [("thumbnail.svg", thumbnail(meta)), ("frames.svg", frames_card(meta, rows))]
    for index, (code, label) in enumerate(chapters, start=1):
        written.append((
            os.path.join("chapters", "%02d-%s.svg" % (index, slugify(label))),
            chapter_card(meta, code, label, index, len(chapters)),
        ))

    for name, content in written:
        with open(os.path.join(out, name), "w", encoding="utf-8") as handle:
            handle.write(content)

    figures = "\n".join(
        '<figure><figcaption>%s</figcaption><img src="%s" alt="%s"></figure>'
        % (esc(name), esc(name.replace(os.sep, "/")), esc(name)) for name, _ in written)
    with open(os.path.join(out, "board.html"), "w", encoding="utf-8") as handle:
        handle.write(BOARD % {
            "title": esc(meta["title"]), "category": esc(meta.get("category", "")),
            "date": esc(meta.get("date", "")), "font": FONT, "mono": MONO, "figures": figures,
        })

    filled = sum(1 for r in rows if r[2])
    print("%s  그래픽 %d개  ·  5칸 %d/5 채움%s" % (
        slug, len(written), filled, "" if filled == 5 else "  ⚠ 5칸을 채우면 그래픽이 완성된다"))
    return 0


def main():
    args = sys.argv[1:]
    scripts = os.path.join(ROOT, "video", "scripts")
    if not os.path.isdir(scripts):
        print("대본이 없습니다. python3 tools/new_video.py 로 먼저 만드세요.")
        return 1

    paths = sorted(os.path.join(scripts, n) for n in os.listdir(scripts) if n.endswith(".md"))
    day = next((a for a in args if a[:1].isdigit()), None)
    if day:
        paths = [p for p in paths if os.path.basename(p).startswith(day)]
    elif "--latest" in args:
        paths = paths[-1:]
    elif "--all" not in args:
        paths = [p for p in paths if parse(p)[0]["status"] != "draft"]

    if not paths:
        print("만들 그래픽이 없습니다. --latest 나 --all 을 쓰거나 status 를 ready 로 바꾸세요.")
        return 1
    for path in paths:
        export(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
