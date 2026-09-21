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

# 한국어판 표지용. 라틴 글꼴에는 한글이 없어서 따로 잡는다.
KO_SERIF = "/usr/share/fonts/truetype/nanum/NanumMyeongjoBold.ttf"
KO_SERIF_R = "/usr/share/fonts/truetype/nanum/NanumMyeongjo.ttf"
KO_SANS_B = "/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf"

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

    # 다섯 칸 시리즈가 아닌 단행본. 그림은 봉우리와 평지다.
    "bestseller": dict(
        title="베스트셀러 & 스테디셀러",
        subtitle="왜 어떤 것은 터지고 사라지며, 어떤 것은 조용히 남는가",
        series="책 · 옷 · 가전 · 식품 · 미디어", volume="스무 장",
        accent="#D9552F", accent2="#8FA97A", ink="#14181A",
        motif="curve", lang="ko", author="최재혁",
        curve_labels=["베스트셀러", "스테디셀러"],
        back_head="작년에 줄 서 있던 가게는 지금 없다.",
        back=[
            "같은 길 끝의 오래된 가게는 아직 있다. 어느 쪽이 장사를 잘한 것인가? "
            "이 질문부터가 잘못됐다는 것이 이 책의 시작이다.",
            "두 해 만에 오백 개를 연 프랜차이즈와 천 년 동안 한 가지만 파는 가게를 "
            "같은 자로 잰다. 시계 셋과 다리 넷, 그리고 네 개의 길.",
            "그리고 오래 남은 것들의 대부분은 계획된 것이 아니라 안 없어진 것이다. "
            "그래서 이것은 늦게 시작한 사람에게 유리한 게임이다.",
        ]),

    "en-bestseller": dict(
        title="Why Is This Still Here?",
        subtitle="How Things Go from Selling Out to Never Leaving",
        series="BOOKS · CLOTHES · FOOD · FILM · MUSIC", volume="20 CHAPTERS",
        accent="#D9552F", accent2="#8FA97A", ink="#14181A",
        motif="curve", lang="en", author="Jaehyuk Choi",
        curve_labels=["BESTSELLER", "STEADY SELLER"],
        back_head="The shop with the queue last year is gone.",
        back=[
            "The old one at the end of the same street is still there. Which was "
            "better at business? That the question is wrong is where this book starts.",
            "A franchise that opened five hundred stores in two years and a shop that "
            "has sold one thing for a thousand years, measured with the same ruler. "
            "Three clocks, four bridges, and four paths.",
            "Most things that lasted were not planned. They just never disappeared. "
            "Which makes this a game that favours whoever started late.",
        ]),

    # 위 단행본의 청소년판. 같은 봉우리와 평지를 쓰되 색을 낮춘다.
    "teen3": dict(
        title="다들 갖고 있었잖아. 다 어디 갔지?",
        title_lines=["다들 갖고 있었잖아.", "다 어디 갔지?"],
        subtitle="유행은 왜 끝나고, 어떤 건 왜 안 끝날까",
        series="『베스트셀러 & 스테디셀러』 청소년판", volume="열여섯 장",
        accent="#B5542F", accent2="#5E8CA6", ink="#141A1E",
        motif="curve", lang="ko", author="최재혁",
        curve_labels=["유행하는 것", "계속 쓰는 것"],
        back_head="작년에 다들 갖고 있던 거, 지금 누가 갖고 있어?",
        back=[
            "없어진 날짜도 없어. 누가 그만두자고 한 것도 아니고. "
            "그냥 어느 순간 아무도 안 하고 있어.",
            "그런데 같은 교실에 몇 년째 그대로 있는 것도 있어. "
            "아무도 유행이라고 안 하는데 다들 계속 써. 둘은 다른 거야.",
            "시계 셋이랑 다리 넷으로 그 차이를 열여섯 장에 걸쳐 봐. "
            "그리고 마지막 장은, 이 게임은 늦게 시작해도 된다는 얘기야.",
        ],
        age="청소년 12~18"),

    "en-teen3": dict(
        title="Everyone Had One. Where Did They All Go?",
        title_lines=["Everyone Had One.", "Where Did They All Go?"],
        subtitle="Why Fads End, and Why Some Things Don't",
        series="TEEN EDITION OF WHY IS THIS STILL HERE?", volume="16 CHAPTERS",
        accent="#B5542F", accent2="#5E8CA6", ink="#141A1E",
        motif="curve", lang="en", author="Jaehyuk Choi",
        curve_labels=["THE FAD", "THE KEEPER"],
        back_head="Everyone had one last year. Who has one now?",
        back=[
            "There is no date it ended. Nobody voted to stop. At some point "
            "everyone just wasn't doing it anymore.",
            "But some things in that same room have been there for years. "
            "Nobody calls them a trend and everybody keeps using them. "
            "Those are two different things.",
            "Three clocks and four bridges, across sixteen chapters. And a last "
            "chapter about why this is a game you can start late.",
        ],
        age="Ages 12-18"),
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
    """낱말 단위로 접는다. 여러 줄이 넘어오면 줄마다 따로 접는다."""
    if isinstance(text, (list, tuple)):
        out = []
        for part in text:
            out.extend(wrap(d, part, fnt, limit))
        return out
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


def faces(spec):
    """책마다 쓸 글꼴 세 벌을 고른다. 한국어판은 나눔 계열을 쓴다."""
    if spec.get("lang") == "ko":
        return KO_SERIF, KO_SERIF_R, KO_SANS_B
    return SERIF, SERIF_R, SANS_B


def peak(d, ox, oy, w, h, color):
    """봉우리 — 높고 좁다. 가운데가 솟은 종 모양으로 채운다."""
    pts = [(ox, oy + h)]
    n = 60
    for i in range(n + 1):
        t = i / n
        # 가운데가 1, 양끝이 0 이 되는 매끄러운 종 모양
        v = (1 - abs(2 * t - 1)) ** 2.2
        pts.append((ox + w * t, oy + h - h * v))
    pts.append((ox + w, oy + h))
    d.polygon(pts, fill=color)


def plain(d, ox, oy, w, h, color):
    """평지 — 낮고 넓다. 천천히 올라 오래 유지되다 천천히 내린다."""
    pts = [(ox, oy + h)]
    n = 80
    for i in range(n + 1):
        t = i / n
        if t < 0.18:
            v = (t / 0.18) ** 1.6
        elif t > 0.88:
            v = ((1 - t) / 0.12) ** 1.6
        else:
            v = 1.0
        pts.append((ox + w * t, oy + h - h * v))
    pts.append((ox + w, oy + h))
    d.polygon(pts, fill=color)


def draw_front_curve(d, ox, oy, w, h, spec):
    """봉우리와 평지를 그림으로 쓰는 앞표지.

    다섯 칸 시리즈가 아닌 책이 쓴다. 이 책의 1장이 그대로 그림이 된다.
    두 도형의 넓이를 비슷하게 잡아 두었다. 높이는 다르고 넓이는 비슷하다는
    것이 이 책의 주장이기 때문이다.
    """
    f_serif, f_serif_r, f_sans_b = faces(spec)
    accent = spec["accent"]
    cool = spec["accent2"]
    s = w / 1600.0
    pad = w * 0.08125
    inner = w - pad * 2
    L = ox + pad

    # 위쪽 가는 선과 갈래 표시
    d.rectangle([L, oy + h * 0.0586, ox + w - pad, oy + h * 0.0586 + 4 * s],
                fill=accent)
    ey = oy + h * 0.0781

    # 왼쪽 갈래 줄과 오른쪽 표시가 겹치면 안 된다.
    # 자간을 먼저 줄이고, 그래도 넘치면 글자를 줄인다.
    size_eye, sp = 36 * s, 6 * s
    while size_eye >= 22 * s:
        f_eye = font(f_sans_b, size_eye)
        left = track_width(d, spec["series"], f_eye, sp)
        right = track_width(d, spec["volume"], f_eye, sp)
        if left + right + inner * 0.06 <= inner:
            break
        if sp > 2 * s:
            sp -= 1 * s
        else:
            size_eye -= 2 * s
    track(d, (L, ey), spec["series"], f_eye, MUTED, sp)
    vw = track_width(d, spec["volume"], f_eye, sp)
    track(d, (ox + w - pad - vw, ey), spec["volume"], f_eye, cool, sp)

    # 제목
    size = 190 * s
    while size >= 100 * s:
        f_title = font(f_serif, size)
        lines = wrap(d, spec.get("title_lines") or spec["title"], f_title, inner)
        if len(lines) <= 3:
            break
        size -= 8 * s
    step = size * 1.2
    f_sub = font(f_serif_r, 56 * s)
    sub_lines = wrap(d, spec["subtitle"], f_sub, inner)

    TOP, BOTTOM = oy + h * 0.16, oy + h * 0.50
    block = len(lines) * step + 46 * s + len(sub_lines) * 78 * s
    y = TOP + max(0, (BOTTOM - TOP - block) / 2)
    for line in lines:
        d.text((L, y), line, font=f_title, fill=CREAM)
        y += step
    y += 46 * s
    for line in sub_lines:
        d.text((L + 4 * s, y), line, font=f_sub, fill=DIM)
        y += 78 * s

    # 두 곡선 — 높이는 다르고 넓이는 비슷하다
    base = oy + h * 0.775
    gap = inner * 0.09
    pw = inner * 0.34                     # 봉우리는 좁고
    lw = inner - pw - gap                 # 평지는 넓다
    ph = h * 0.20                         # 봉우리는 높고
    lh = h * 0.068                        # 평지는 낮다

    peak(d, L, base - ph, pw, ph, accent)
    plain(d, L + pw + gap, base - lh, lw, lh, cool)

    # 바닥선
    d.rectangle([L, base, ox + w - pad, base + 3 * s], fill="#3A4148")

    # 두 이름
    f_lab = font(f_sans_b, 30 * s)
    ly = base + 30 * s
    w1 = track_width(d, spec["curve_labels"][0], f_lab, 5 * s)
    track(d, (L + (pw - w1) / 2, ly), spec["curve_labels"][0], f_lab, accent, 5 * s)
    w2 = track_width(d, spec["curve_labels"][1], f_lab, 5 * s)
    track(d, (L + pw + gap + (lw - w2) / 2, ly), spec["curve_labels"][1],
          f_lab, cool, 5 * s)

    # 아래쪽 지은이
    d.rectangle([L, oy + h * 0.895, L + 120 * s, oy + h * 0.895 + 4 * s],
                fill=accent)
    d.text((L, oy + h * 0.920), spec.get("author", "Jaehyuk Choi"),
           font=font(f_serif, 60 * s), fill=CREAM)


def draw_front(d, ox, oy, w, h, spec):
    """앞표지를 (ox, oy) 에서 시작하는 w x h 영역에 그린다.

    전자책 표지와 인쇄용 표지 앞면이 이 함수 하나를 같이 쓴다.
    가로세로 비가 달라도 되도록 좌표를 전부 비율로 잡는다.
    """
    if spec.get("motif") == "curve":
        return draw_front_curve(d, ox, oy, w, h, spec)
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
        lines = wrap(d, spec.get("title_lines") or spec["title"], f_title, inner)
        if len(lines) <= 4:
            break
        size -= 10 * s
    # 조금만 줄여서 줄 수가 하나 준다면 그쪽이 낫다
    for trial in range(int(size - 6 * s), int(size * 0.85), -int(max(1, 4 * s))):
        f2 = font(SERIF, trial)
        l2 = wrap(d, spec.get("title_lines") or spec["title"], f2, inner)
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
