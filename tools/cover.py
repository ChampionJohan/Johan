#!/usr/bin/env python3
"""아마존 KDP 전자책 표지를 만든다.

    python3 tools/cover.py            # release/covers/ 아래 네 권 전부
    python3 tools/cover.py en-book    # 한 권만

KDP 권장 크기인 1600 x 2560 (세로:가로 1.6:1) JPG 로 뽑는다.
표지의 그림 요소는 다섯 칸이다. 책마다 그중 한 칸을 채워서,
그 책이 다섯 칸 가운데 어느 칸을 파는 책인지 표지가 먼저 말하게 한다.
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1600, 2560

SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_R = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

# 책마다: 제목 · 부제 · 시리즈 줄 · 강조색 · 채울 칸(1~5) · 칸 이름
BOOKS = {
    "en-book": dict(
        title="Who's Actually Paying?",
        subtitle="Take Any Business Apart in Five Questions",
        series="THE FIVE BOXES", volume="BOOK ONE",
        accent="#C4453F", ink="#14181C", box=1,
        labels=["CUSTOMER", "VALUE", "PAYMENT", "MOAT", "FAULT LINE"]),
    "en-book2": dict(
        title="The Fourth Box",
        subtitle="Why Some Businesses Can't Be Taken",
        series="THE FIVE BOXES", volume="BOOK TWO",
        accent="#3E96AE", ink="#101A1E", box=4,
        labels=["CUSTOMER", "VALUE", "PAYMENT", "MOAT", "FAULT LINE"]),
    "en-teen": dict(
        title="It's Free. So How Are They Rich?",
        subtitle="How Money Actually Works — and How to Start",
        series="THE FIVE BOXES · TEEN EDITION", volume="BOOK ONE",
        accent="#E8703A", ink="#1A1512", box=3,
        labels=["CUSTOMER", "VALUE", "PAYMENT", "MOAT", "FAULT LINE"]),
    "en-teen2": dict(
        title="I Started. So Why Isn't It Working?",
        subtitle="The Part Nobody Warns You About",
        series="THE FIVE BOXES · TEEN EDITION", volume="BOOK TWO",
        accent="#3E9B6B", ink="#111814", box=5,
        labels=["CUSTOMER", "VALUE", "PAYMENT", "MOAT", "FAULT LINE"]),
}

CREAM = "#F4F1EA"
MUTED = "#8A8A86"


def font(path, size):
    return ImageFont.truetype(path, size)


def track(draw, xy, text, fnt, fill, spacing):
    """PIL 에는 자간 기능이 없다. 글자를 하나씩 찍어 자간을 만든다."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + spacing
    return x - spacing


def track_width(draw, text, fnt, spacing):
    return sum(draw.textlength(c, font=fnt) for c in text) + spacing * (len(text) - 1)


def wrap(draw, text, fnt, limit):
    """낱말 단위로 접는다."""
    lines, line = [], ""
    for word in text.split(" "):
        trial = (line + " " + word) if line else word
        if draw.textlength(trial, font=fnt) > limit and line:
            lines.append(line)
            line = word
        else:
            line = trial
    if line:
        lines.append(line)
    return lines


def make(spec, out_path):
    img = Image.new("RGB", (W, H), spec["ink"])
    d = ImageDraw.Draw(img)
    accent = spec["accent"]
    pad = 130
    inner = W - pad * 2

    # 위쪽 가는 선과 시리즈 표시
    d.rectangle([pad, 150, W - pad, 154], fill=accent)
    f_eyebrow = font(SANS_B, 40)
    track(d, (pad, 200), spec["series"], f_eyebrow, MUTED, 8)
    vw = track_width(d, spec["volume"], f_eyebrow, 8)
    track(d, (W - pad - vw, 200), spec["volume"], f_eyebrow, accent, 8)

    # 제목 — 아마존 목록은 썸네일이라 제목이 표지를 지배해야 한다.
    # 넉 줄 안에 들어오는 가장 큰 크기를 찾는다.
    size = 200
    while size >= 110:
        f_title = font(SERIF, size)
        lines = wrap(d, spec["title"], f_title, inner)
        if len(lines) <= 4:
            break
        size -= 10
    # 조금만 줄여서 줄 수가 하나 준다면 그쪽이 낫다.
    # "The Fourth / Box" 처럼 낱말 하나가 남는 줄을 없앤다.
    for trial in range(size - 6, int(size * 0.85), -4):
        f2 = font(SERIF, trial)
        l2 = wrap(d, spec["title"], f2, inner)
        if len(l2) < len(lines):
            size, f_title, lines = trial, f2, l2
            break
    step = int(size * 1.14)
    f_sub = font(SERIF_R, 62)
    sub_lines = wrap(d, spec["subtitle"], f_sub, inner)

    # 제목이 짧은 책에 가운데가 비지 않도록, 제목 덩어리를
    # 눈썹 줄과 다섯 칸 사이 공간의 한가운데에 앉힌다.
    TOP, BOTTOM = 400, 1430
    block = len(lines) * step + 46 + len(sub_lines) * 84
    y = TOP + max(0, (BOTTOM - TOP - block) / 2)
    for line in lines:
        d.text((pad, y), line, font=f_title, fill=CREAM)
        y += step

    # 부제
    y += 46
    for line in sub_lines:
        d.text((pad + 4, y), line, font=f_sub, fill="#B9B5AC")
        y += 84

    # 다섯 칸 — 이 책이 파는 칸 하나만 채운다
    gap = 26
    side = (inner - gap * 4) // 5
    top = 1560
    f_num = font(SANS_B, 54)
    f_lab = font(SANS_B, 25)
    for i in range(5):
        x = pad + i * (side + gap)
        on = (i + 1) == spec["box"]
        if on:
            d.rectangle([x, top, x + side, top + side], fill=accent)
        else:
            d.rectangle([x, top, x + side, top + side], outline="#3A4148", width=4)
        num = str(i + 1)
        nw = d.textlength(num, font=f_num)
        d.text((x + (side - nw) / 2, top + side / 2 - 36), num,
               font=f_num, fill=(CREAM if on else "#4E555C"))
        lab = spec["labels"][i]
        lw = track_width(d, lab, f_lab, 3)
        # 칸 이름이 칸보다 넓으면 줄인다
        f2, s2 = f_lab, 3
        if lw > side:
            f2 = font(SANS_B, 21)
            s2 = 1
            lw = track_width(d, lab, f2, s2)
        track(d, (x + (side - lw) / 2, top + side + 26), lab, f2,
              (accent if on else "#5A6169"), s2)

    # 아래쪽 지은이
    d.rectangle([pad, H - 420, pad + 120, H - 416], fill=accent)
    f_author = font(SERIF, 66)
    d.text((pad, H - 350), "Jaehyuk Choi", font=f_author, fill=CREAM)

    img.save(out_path, quality=92, subsampling=0)
    return out_path


def main():
    which = sys.argv[1:] or list(BOOKS)
    out_dir = os.path.join(ROOT, "release", "covers")
    os.makedirs(out_dir, exist_ok=True)
    for key in which:
        if key not in BOOKS:
            print("모르는 책: %s" % key)
            return 1
        path = os.path.join(out_dir, "%s-cover.jpg" % key)
        make(BOOKS[key], path)
        print("만들었습니다: %s  (%d x %d, %.0f KB)"
              % (os.path.relpath(path, ROOT), W, H, os.path.getsize(path) / 1024))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
