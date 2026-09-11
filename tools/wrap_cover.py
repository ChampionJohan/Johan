#!/usr/bin/env python3
"""KDP 페이퍼백 표지(앞·책등·뒤가 한 장인 PDF)를 만든다.

    python3 tools/wrap_cover.py en-teen 115
    python3 tools/wrap_cover.py en-teen 115 --paper white
    python3 tools/wrap_cover.py --all

전자책 표지와 전혀 다른 물건이다. 전자책은 앞면만 있는 이미지이고,
인쇄용은 뒤표지 + 책등 + 앞표지가 이어진 한 장이며 크기가 쪽수에 따라 달라진다.

    폭 = 0.125(도련) + 6(뒤) + 책등 + 6(앞) + 0.125(도련)
    높이 = 0.125 + 9 + 0.125 = 9.25
    책등 = 쪽수 x 종이 두께

쪽수나 종이를 바꾸면 표지 크기가 바뀐다. 그래서 쪽수를 인자로 받는다.
"""

import os
import sys

import pymupdf
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cover import (BOOKS, CREAM, DIM, MUTED, ROOT, SANS_B, SERIF, SERIF_R,
                   draw_front, font, track, track_width, wrap)

DPI = 300
TRIM_W, TRIM_H = 6.0, 9.0
BLEED = 0.125
SAFE = 0.25                      # 재단선에서 이만큼 안쪽에 글자를 둔다

# 쪽당 종이 두께 (KDP 공표값, 인치)
PAPER = {"cream": 0.0025, "white": 0.002252, "color": 0.002347}

# KDP 가 뒤표지 오른쪽 아래에 바코드를 얹는다. 이만큼 비워 둔다.
BARCODE_W, BARCODE_H = 2.0, 1.2

# 책등에 글자를 넣으려면 쪽수가 이 이상이어야 한다
SPINE_TEXT_MIN = 100


def px(inches):
    return int(round(inches * DPI))


def draw_back(d, ox, oy, w, h, spec):
    """뒤표지. 바코드 자리는 비워 둔다."""
    accent = spec["accent"]
    s = w / 1600.0
    pad = w * 0.08125
    L = ox + pad
    inner = w - pad * 2

    d.rectangle([L, oy + h * 0.0586, ox + w - pad, oy + h * 0.0586 + 4 * s],
                fill=accent)
    f_eye = font(SANS_B, 40 * s)
    track(d, (L, oy + h * 0.0781), spec["series"], f_eye, MUTED, 8 * s)

    y = oy + h * 0.17
    f_head = font(SERIF, 86 * s)
    for line in wrap(d, spec["back_head"], f_head, inner):
        d.text((L, y), line, font=f_head, fill=CREAM)
        y += 100 * s

    y += 54 * s
    f_body = font(SERIF_R, 52 * s)
    for para in spec["back"]:
        for line in wrap(d, para, f_body, inner):
            d.text((L, y), line, font=f_body, fill=DIM)
            y += 72 * s
        y += 34 * s

    if spec.get("age"):
        f_age = font(SANS_B, 40 * s)
        track(d, (L, y + 20 * s), spec["age"].upper(), f_age, accent, 6 * s)

    # 바코드 자리 — 흰 바탕을 깔아 두면 바코드가 얹혔을 때 깔끔하다
    bx = ox + w - px(SAFE) - px(BARCODE_W)
    by = oy + h - px(SAFE) - px(BARCODE_H)
    d.rectangle([bx, by, bx + px(BARCODE_W), by + px(BARCODE_H)], fill="#FFFFFF")


def draw_spine(d, ox, oy, w, h, spec, pages):
    """책등. 100쪽 미만이면 KDP 가 글자를 허용하지 않으므로 색만 둔다.

    영어권 책등은 책을 세웠을 때 글자가 위에서 아래로 읽힌다.
    그래서 가로로 쓴 뒤 시계 방향으로 돌린다(rotate(-90)).
    돌리고 나면 strip 의 왼쪽이 책등 위, 오른쪽이 아래가 된다.
    """
    if pages < SPINE_TEXT_MIN or w < px(0.2):
        return None
    strip = Image.new("RGB", (int(h), int(w)), spec["ink"])
    sd = ImageDraw.Draw(strip)

    # 아래쪽에 지은이 자리를 먼저 잡아 두고, 제목은 남은 자리에 맞춘다
    fa = font(SANS_B, w * 0.30)
    author = "Jaehyuk Choi"
    aw = sd.textlength(author, font=fa)
    author_x = h - px(0.6) - aw

    room = author_x - px(0.5) - px(0.4)
    size = w * 0.52
    f = font(SERIF, size)
    while sd.textlength(spec["title"], font=f) > room and size > 10:
        size -= 2
        f = font(SERIF, size)
    tw = sd.textlength(spec["title"], font=f)
    sd.text((px(0.5) + (room - tw) / 2, (w - size * 1.15) / 2),
            spec["title"], font=f, fill=CREAM)
    sd.text((author_x, (w - w * 0.30 * 1.2) / 2), author, font=fa,
            fill=spec["accent"])
    return strip.rotate(-90, expand=True)


def make(key, pages, paper="cream", out_dir=None):
    spec = BOOKS[key]
    spine = pages * PAPER[paper]
    w_in = BLEED * 2 + TRIM_W * 2 + spine
    h_in = BLEED * 2 + TRIM_H

    W, H = px(w_in), px(h_in)
    img = Image.new("RGB", (W, H), spec["ink"])
    d = ImageDraw.Draw(img)

    back_x = 0
    spine_x = px(BLEED + TRIM_W)
    front_x = px(BLEED + TRIM_W + spine)
    panel_w = px(TRIM_W + BLEED)      # 바깥쪽 도련까지 포함한 폭

    # 뒤표지 — 왼쪽. 도련 쪽으로 글이 나가지 않게 안쪽을 기준으로 그린다
    draw_back(d, px(BLEED), px(BLEED), px(TRIM_W), px(TRIM_H), spec)
    # 앞표지 — 오른쪽
    draw_front(d, front_x, px(BLEED), px(TRIM_W), px(TRIM_H), spec)

    strip = draw_spine(d, spine_x, 0, px(spine), H, spec, pages)
    if strip is not None:
        img.paste(strip, (spine_x, 0))

    os.makedirs(out_dir, exist_ok=True)
    jpg = os.path.join(out_dir, "%s-wrap-%dp.jpg" % (key, pages))
    img.save(jpg, quality=94, subsampling=0)

    # 크기가 정확해야 하므로 PDF 는 포인트 단위로 직접 만든다 (1in = 72pt)
    pdf_path = os.path.join(out_dir, "%s-wrap-%dp.pdf" % (key, pages))
    doc = pymupdf.open()
    page = doc.new_page(width=w_in * 72, height=h_in * 72)
    page.insert_image(pymupdf.Rect(0, 0, w_in * 72, h_in * 72), filename=jpg)
    doc.save(pdf_path, deflate=True)
    doc.close()
    os.remove(jpg)

    return pdf_path, w_in, h_in, spine


DEFAULT = [("en-book", 366), ("en-book2", 358), ("en-teen", 115), ("en-teen2", 185)]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    paper = "cream"
    if "--paper" in sys.argv:
        paper = sys.argv[sys.argv.index("--paper") + 1]
    out_dir = os.path.join(ROOT, "release", "covers")

    jobs = DEFAULT if ("--all" in sys.argv or not args) else [(args[0], int(args[1]))]
    for key, pages in jobs:
        path, w, h, spine = make(key, pages, paper, out_dir)
        note = "" if pages >= SPINE_TEXT_MIN else "  (100쪽 미만이라 책등 글자 없음)"
        print("만들었습니다: %s\n   %.3f x %.3f in · 책등 %.4f in · %s · %d쪽%s"
              % (os.path.relpath(path, ROOT), w, h, spine, paper, pages, note))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
