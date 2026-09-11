#!/usr/bin/env python3
"""전자책 표지를 만든다.

    python3 tools/cover.py            # release/covers/ 아래 네 권 전부
    python3 tools/cover.py en-book    # 한 권만

KDP 권장 크기인 1600 x 2560 (세로:가로 1.6:1) JPG 로 뽑는다.
표지의 그림 요소는 다섯 칸이다. 책마다 그중 한 칸을 채워서,
그 책이 다섯 칸 가운데 어느 칸을 파는 책인지 표지가 먼저 말하게 한다.

앞면 그리기는 draw_front() 하나에 모아 두었다. 전자책 표지(1.6:1)와
인쇄용 표지의 앞면(6x9, 1.5:1)은 가로세로 비가 다르므로, 좌표를 절대값이
아니라 폭과 높이의 비율로 잡아 두 곳에서 같이 쓴다. (tools/wrap_cover.py)
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

LABELS = ["CUSTOMER", "VALUE", "PAYMENT", "MOAT", "FAULT LINE"]

# 책마다: 제목 · 부제 · 시리즈 줄 · 강조색 · 채울 칸(1~5) · 뒤표지 글
BOOKS = {
    "en-book": dict(
        title="Who's Actually Paying?",
        subtitle="Take Any Business Apart in Five Questions",
        series="THE FIVE BOXES", volume="BOOK ONE",
        accent="#C4453F", ink="#14181C", box=1, labels=LABELS,
        back_head="Most people can tell you what a company sells.",
        back=[
            "Far fewer can tell you who actually pays for it.",
            "Five questions take any business apart. Part One builds them one at "
            "a time. Part Two runs eighteen businesses through all five, from a "
            "music service that lost money at the top of its market to a country "
            "whose only product was its location.",
            "Every figure carries a year and a source. What could not be confirmed "
            "was left out rather than estimated, and the book says where those "
            "gaps are.",
        ]),
    "en-book2": dict(
        title="The Fourth Box",
        subtitle="Why Some Businesses Can't Be Taken",
        series="THE FIVE BOXES", volume="BOOK TWO",
        accent="#3E96AE", ink="#101A1E", box=4, labels=LABELS,
        back_head="Book One asked how a business earns.",
        back=[
            "This one asks whether it gets to keep earning.",
            "It opens by grading its own predecessor. Eighteen predictions checked "
            "against what happened: three wrong, and all three wrong in the same "
            "place. That finding shaped the rest of the book.",
            "Then five kinds of moat, five ways they break, and what you would "
            "build with the two that cost time and decisions rather than capital.",
        ]),
    "en-teen": dict(
        title="It's Free. So How Are They Rich?",
        subtitle="How Money Actually Works — and How to Start",
        series="THE FIVE BOXES · TEEN EDITION", volume="BOOK ONE",
        accent="#E8703A", ink="#1A1512", box=3, labels=LABELS,
        back_head="The game is free. So how is the company rich?",
        back=[
            "There is such a thing as a head for money. Nobody is born with it. "
            "It shows up in people who know five questions.",
            "This book teaches those five, then puts ten brands you already know "
            "through all of them. Then it asks what you could start.",
            "Nothing to hand in. Nothing to memorize. Every chapter ends with one "
            "thing to try today.",
        ],
        age="Ages 12–18"),
    "en-teen2": dict(
        title="I Started. So Why Isn't It Working?",
        subtitle="The Part Nobody Warns You About",
        series="THE FIVE BOXES · TEEN EDITION", volume="BOOK TWO",
        accent="#3E9B6B", ink="#111814", box=5, labels=LABELS,
        back_head="You started something. Nothing is happening.",
        back=[
            "Nobody bought it. Or one person bought it and that was the end of it. "
            "Or you did the math and there was nothing left over.",
            "This book is about that wall. The six you meet after starting, the "
            "moats you can build with no money, and why the thing that breaks a "
            "teenager's business is usually too many orders.",
            "It ends with the chapter nobody writes: how to quit well.",
        ],
        age="Ages 12–18"),
}

CREAM = "#F4F1EA"
MUTED = "#8A8A86"
DIM = "#B9B5AC"


def font(path, size):
    return ImageFont.truetype(path, max(8, int(size)))


def track(d, xy, text, fnt, fill, spacing):
    """PIL 에는 자간 기능이 없다. 글자를 하나씩 찍어 자간을 만든다."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill)
        x += d.textlength(ch, font=fnt) + spacing
    return x - spacing


def track_width(d, text, fnt, spacing):
    if not text:
        return 0
    return sum(d.textlength(c, font=fnt) for c in text) + spacing * (len(text) - 1)


def wrap(d, text, fnt, limit):
    """낱말 단위로 접는다."""
    lines, line = [], ""
    for word in text.split(" "):
        trial = (line + " " + word) if line else word
        if d.textlength(trial, font=fnt) > limit and line:
            lines.append(line)
            line = word
        else:
            line = trial
    if line:
        lines.append(line)
    return lines


def draw_front(d, ox, oy, w, h, spec):
    """앞표지를 (ox, oy) 에서 시작하는 w x h 영역에 그린다.

    전자책 표지와 인쇄용 표지 앞면이 이 함수 하나를 같이 쓴다.
    가로세로 비가 달라도 되도록 좌표를 전부 비율로 잡는다.
    """
    accent = spec["accent"]
    s = w / 1600.0                      # 글자 크기는 폭에 맞춘다
    pad = w * 0.08125
    inner = w - pad * 2
    L = ox + pad

    # 위쪽 가는 선과 시리즈 표시
    d.rectangle([L, oy + h * 0.0586, ox + w - pad, oy + h * 0.0586 + 4 * s],
                fill=accent)
    f_eye = font(SANS_B, 40 * s)
    ey = oy + h * 0.0781
    track(d, (L, ey), spec["series"], f_eye, MUTED, 8 * s)
    vw = track_width(d, spec["volume"], f_eye, 8 * s)
    track(d, (ox + w - pad - vw, ey), spec["volume"], f_eye, accent, 8 * s)

    # 제목 — 넉 줄 안에 들어오는 가장 큰 크기를 찾는다
    size = 200 * s
    while size >= 110 * s:
        f_title = font(SERIF, size)
        lines = wrap(d, spec["title"], f_title, inner)
        if len(lines) <= 4:
            break
        size -= 10 * s
    # 조금만 줄여서 줄 수가 하나 준다면 그쪽이 낫다
    for trial in range(int(size - 6 * s), int(size * 0.85), -int(max(1, 4 * s))):
        f2 = font(SERIF, trial)
        l2 = wrap(d, spec["title"], f2, inner)
        if len(l2) < len(lines):
            size, f_title, lines = trial, f2, l2
            break
    step = size * 1.14
    f_sub = font(SERIF_R, 62 * s)
    sub_lines = wrap(d, spec["subtitle"], f_sub, inner)

    # 제목이 짧은 책에 가운데가 비지 않도록 덩어리를 가운데 앉힌다
    TOP, BOTTOM = oy + h * 0.15625, oy + h * 0.5586
    block = len(lines) * step + 46 * s + len(sub_lines) * 84 * s
    y = TOP + max(0, (BOTTOM - TOP - block) / 2)
    for line in lines:
        d.text((L, y), line, font=f_title, fill=CREAM)
        y += step
    y += 46 * s
    for line in sub_lines:
        d.text((L + 4 * s, y), line, font=f_sub, fill=DIM)
        y += 84 * s

    # 다섯 칸 — 이 책이 파는 칸 하나만 채운다
    gap = 26 * s
    side = (inner - gap * 4) / 5
    top = oy + h * 0.6094
    f_num = font(SANS_B, 54 * s)
    f_lab = font(SANS_B, 25 * s)
    for i in range(5):
        x = L + i * (side + gap)
        on = (i + 1) == spec["box"]
        if on:
            d.rectangle([x, top, x + side, top + side], fill=accent)
        else:
            d.rectangle([x, top, x + side, top + side], outline="#3A4148",
                        width=max(1, int(4 * s)))
        num = str(i + 1)
        nw = d.textlength(num, font=f_num)
        d.text((x + (side - nw) / 2, top + side / 2 - 36 * s), num,
               font=f_num, fill=(CREAM if on else "#4E555C"))
        lab = spec["labels"][i]
        f2, sp = f_lab, 3 * s
        if track_width(d, lab, f2, sp) > side:
            f2, sp = font(SANS_B, 21 * s), 1 * s
        lw = track_width(d, lab, f2, sp)
        track(d, (x + (side - lw) / 2, top + side + 26 * s), lab, f2,
              (accent if on else "#5A6169"), sp)

    # 아래쪽 지은이
    d.rectangle([L, oy + h * 0.8359, L + 120 * s, oy + h * 0.8359 + 4 * s],
                fill=accent)
    d.text((L, oy + h * 0.8633), "Jaehyuk Choi", font=font(SERIF, 66 * s),
           fill=CREAM)


def make(spec, out_path):
    img = Image.new("RGB", (W, H), spec["ink"])
    draw_front(ImageDraw.Draw(img), 0, 0, W, H, spec)
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
