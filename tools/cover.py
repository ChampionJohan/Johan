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

    # 사람 하나와 기계 하나의 대화편. 그림은 번갈아 오는 말차례다.
    # 비어 있는 칸이 기계가 모르겠다고 한 자리고, 그게 제목이다.
    "aibook": dict(
        title="기계가 말하지 못한 것",
        title_lines=["기계가 말하지", "못한 것"],
        subtitle="사람 하나와 기계 하나가 나눈 기록",
        series="기록 · 재료 · 차이 · 권한 · 사람", volume="열여덟 장과 코다",
        accent="#C08A43", accent2="#5B8CA0", ink="#0F1419",
        motif="dialog", lang="ko", author="최재혁",
        curve_labels=["묻는 쪽", "답하는 쪽"],
        motif_note="빈 칸이 모르겠다고 한 자리다",
        back_head="나는 그 기계로 책 여덟 권을 냈다.",
        back=[
            "그래서 이 책은 밖에서 본 이야기가 아니다. 먼저 내가 본 것을 적고, "
            "그다음에 물은 것을 적는다. 다섯 부에 열여덟 장이다.",
            "무엇으로 만들어졌는가. 사람과 저것 사이에 안 닳는 차이가 있는가. "
            "넘어서면 무슨 일이 벌어지는가. 그럼 사람은.",
            "답이 안 나온 자리를 얼버무리지 않고 비워 두었다. "
            "그 비워 둔 자리가 이 책에서 제일 중요한 자리다.",
        ]),

    "en-aibook": dict(
        title="What It Could Not Tell Me",
        subtitle="A Record of One Person and One Machine",
        series="RECORD · MATERIAL · DIFFERENCE · AUTHORITY · US",
        volume="18 CHAPTERS + CODA",
        accent="#C08A43", accent2="#5B8CA0", ink="#0F1419",
        motif="dialog", lang="en", author="Jaehyuk Choi",
        curve_labels=["THE ONE ASKING", "THE ONE ANSWERING"],
        motif_note="The hollow ones are where it did not know",
        back_head="I published eight books with the machine.",
        back=[
            "So this is not a book written from outside it. What I saw comes first "
            "and what I asked comes after, across five parts and eighteen chapters.",
            "What is it made of. Is there a difference between a person and that "
            "which does not wear away. What happens if it passes us. Then what "
            "about people.",
            "Where no answer came, the place was left empty rather than smoothed "
            "over. Those empty places are the most important thing in the book.",
        ]),

    # 쓸모를 하나씩 빼면 위는 아무것도 안 남고 아래 한 줄만 남는다.
    # 그 한 줄이 제목이다. 09·10 과 같은 선반에 놓이도록 글꼴과 짜임은 같게 두고
    # 색만 바꿨다. 금빛·쪽빛이 저쪽이고 이쪽은 붉은흙·잿빛초록이다.
    "person": dict(
        title="사람을 사람으로 보는 법",
        title_lines=["사람을 사람으로", "보는 법"],
        subtitle="쓸모를 빼고 사람을 보는 법",
        series="셈 · 빼기 · 할 것 · 둘 사이 · 그다음",
        volume="열여덟 장",
        accent="#C2563C", accent2="#7E9A86", ink="#141A1F",
        motif="subtract", lang="ko", author="최재혁",
        curve_labels=["쌓인 것", "다 빠진 자리"],
        motif_note="아래 줄은 어느 칸에서도 안 빠진다",
        back_head="사람에게 값이 있다고 쓰려다 그만뒀다.",
        back=[
            "반박할 수 없는 문장이라서 그만뒀다. 반박할 수 없는 문장 앞에서 "
            "사람은 생각을 멈춘다. 그래서 주장을 버리고, 쓸모가 실제로 0이 되는 "
            "자리로 갔다.",
            "아직 아무것도 못 하는 사람, 한동안 멈춘 사람, 할 수 있던 것을 "
            "하나씩 돌려주는 사람, 할 줄 아는데 쓸 데가 없어진 사람. 그 네 자리에서 "
            "사람들이 하는 일이 서로 닮아 있다. 행동은 반박이 안 된다.",
            "열일곱 장이고 장마다 오늘 할 것 하나가 붙어 있다. 그리고 장마다 "
            "하나는 안 풀고 끝낸다. 마지막 장은 질문 하나로 닫고 그 뒤에 한 줄도 없다.",
        ]),

    "en-person": dict(
        title="How to See a Person",
        subtitle="What Is Left When Usefulness Is Taken Away",
        series="COUNTING · SUBTRACTION · DOING · BETWEEN · AFTER",
        volume="18 CHAPTERS",
        accent="#C2563C", accent2="#7E9A86", ink="#141A1F",
        motif="subtract", lang="en", author="Jaehyuk Choi",
        curve_labels=["WHAT IS STACKED", "WHAT IS TAKEN"],
        motif_note="The bottom row is never taken away",
        back_head="I started to write that a person has worth, and stopped.",
        back=[
            "I stopped because the sentence cannot be argued with, and nobody "
            "thinks in front of a sentence like that. So I dropped the argument "
            "and went to the places where usefulness really does fall to zero.",
            "Someone who cannot do anything yet. Someone stopped for a while. "
            "Someone handing back one ability at a time. Someone skilled with "
            "nowhere to use it. In all four places people do the same kinds of "
            "things. What people do cannot be argued with.",
            "Seventeen chapters, each ending with one thing to do today, and each "
            "leaving one thing unresolved. The last chapter closes on a question "
            "with nothing written after it.",
        ]),

    # ── 13~18번. 사랑 세 권. 선 하나를 세 권에 나눠 그린다.
    # 나란히 놓아야 한 줄이 된다. 그게 셋을 같이 사게 만드는 자리다.
    "love1": dict(
        title="먼저 와 있던 사람",
        title_lines=["먼저 와", "있던 사람"],
        subtitle="내가 요청한 적 없는데 이미 있던 사람",
        series="먼저 간다 · 값을 안 묻는다 · 끝까지 간다",
        volume="첫째 권",
        accent="#E3A765", accent2="#C7604A", ink="#16110F",
        motif="thread", thread_phase=1, lang="ko", author="최재혁",
        curve_labels=["바깥에서", "나에게"],
        motif_note="시작이 화면 밖에 있다",
        back_head="나는 받고 시작했다.",
        back=[
            "태어나는 일에 동의한 사람은 없다. 그런데 이름은 이미 지어져 있었고 "
            "옷도 자리도 준비되어 있었다. 요청한 적 없는 것이 먼저 와 있었다.",
            "받은 것의 대부분은 기억에 없다. 업어 준 등도, 수천 번 말을 가르쳐 준 "
            "입도 기억나지 않는다. 기억 안 나는 쪽이 사람을 만든다.",
            "열두 장이고 장마다 떠오르는 사람 한 명을 묻는다. 답은 책이 아니라 "
            "읽는 사람 쪽에 있다.",
        ]),

    "love2": dict(
        title="아무것도 묻지 않는 사람",
        title_lines=["아무것도", "묻지 않는 사람"],
        subtitle="돌아올 것이 없는 쪽으로 가는 사람",
        series="먼저 간다 · 값을 안 묻는다 · 끝까지 간다",
        volume="둘째 권",
        accent="#E3A765", accent2="#C7604A", ink="#16110F",
        motif="thread", thread_phase=2, lang="ko", author="최재혁",
        curve_labels=["나에게서", "모르는 쪽으로"],
        motif_note="끝에 아무도 없어도 간다",
        back_head="조건이 붙으면 거래가 된다.",
        back=[
            "잘하면, 착하면. 그 냄새를 아이들이 제일 먼저 안다. 자격을 따지기 "
            "시작하면 줄이 생기고, 줄이 생기면 아래쪽이 생긴다.",
            "다시 볼 일 없는 사람에게 가는 것이 있다. 이름을 안 밝히고 가는 것도 "
            "있다. 셈이 안 맞는데 계속되는 자리가 있다.",
            "둘째 권이다. 첫째 권이 받은 이야기였고 이쪽은 흘려보내는 이야기다.",
        ]),

    "love3": dict(
        title="끝까지 남은 사람",
        title_lines=["끝까지", "남은 사람"],
        subtitle="상대가 몰라도 곁에 있는 사람",
        series="먼저 간다 · 값을 안 묻는다 · 끝까지 간다",
        volume="셋째 권",
        accent="#E3A765", accent2="#C7604A", ink="#16110F",
        motif="thread", thread_phase=3, lang="ko", author="최재혁",
        curve_labels=["끊긴 적 없이", "계속"],
        motif_note="세 권을 나란히 놓으면 한 줄이다",
        back_head="알아보지 못하는 사람 곁을 지키는 일이 있다.",
        back=[
            "돌아오는 것이 없어도 계속되는 자리가 있다. 매일 같은 일을 하는 "
            "돌봄이 있고, 올지 안 올지 모르는 것을 기다리는 자리가 있다.",
            "준 사람이 없어진 뒤에도 안 끝난다. 유품과 습관과 말투로 남아서 "
            "다음 사람에게 간다. 세대를 건너뛰기도 한다.",
            "셋째 권이고 마지막 장은 질문 하나로 닫는다. 그 뒤에 한 줄도 없다.",
        ]),

    # 영어판 셋. 한국어판과 같은 선, 같은 색, 같은 단계다.
    "en-love1": dict(
        title="The One Who Was Already There",
        title_lines=["The One Who", "Was Already", "There"],
        subtitle="Already there before I ever asked",
        series="GOES FIRST · NEVER ASKS · DOES NOT STOP",
        volume="BOOK ONE",
        accent="#E3A765", accent2="#C7604A", ink="#16110F",
        motif="thread", thread_phase=1, lang="en", author="Jaehyuk Choi",
        curve_labels=["FROM OUTSIDE", "TO ME"],
        motif_note="the line begins off the page",
        back_head="I started out having received.",
        back=[
            "No one consented to being born. And yet the name was already chosen, "
            "the clothes bought, the place made ready. What was never asked for "
            "had arrived first.",
            "Most of what we received is not in memory. Not the back that carried "
            "us, not the mouth that taught us words a thousand times over. The part "
            "we cannot remember is the part that made us.",
            "Twelve chapters. Each one ends with a box called Someone Comes to Mind. "
            "Not something to do. Someone to remember.",
        ]),

    "en-love2": dict(
        title="The One Who Never Asked",
        title_lines=["The One Who", "Never Asked"],
        subtitle="Going where nothing comes back",
        series="GOES FIRST · NEVER ASKS · DOES NOT STOP",
        volume="BOOK TWO",
        accent="#E3A765", accent2="#C7604A", ink="#16110F",
        motif="thread", thread_phase=2, lang="en", author="Jaehyuk Choi",
        curve_labels=["FROM ME", "TO SOMEONE UNKNOWN"],
        motif_note="it goes even with no one at the end",
        back_head="Attach a condition and it becomes a trade.",
        back=[
            "If you do well. If you are good. Children smell that first. Once you "
            "start weighing who deserves it, a line forms, and a line has a bottom.",
            "Some things go to people we will never see again. Some go without a "
            "name attached. There are places where the arithmetic does not work and "
            "people keep going anyway.",
            "Book two. The first was about receiving. This one is about what passes "
            "through.",
        ]),

    "en-love3": dict(
        title="The One Who Stayed",
        title_lines=["The One", "Who Stayed"],
        subtitle="It goes on even when they do not know",
        series="GOES FIRST · NEVER ASKS · DOES NOT STOP",
        volume="BOOK THREE",
        accent="#E3A765", accent2="#C7604A", ink="#16110F",
        motif="thread", thread_phase=3, lang="en", author="Jaehyuk Choi",
        curve_labels=["NEVER BROKEN", "STILL GOING"],
        motif_note="set the three side by side and it is one line",
        back_head="Some people sit beside someone who no longer knows them.",
        back=[
            "There are places that continue with nothing coming back. Care that is "
            "the same thing done again tomorrow. A chair where someone waits for "
            "what may never arrive.",
            "It does not end when the giver is gone. It stays as an object, a habit, "
            "a turn of phrase, and goes to the next person. Sometimes it skips a "
            "generation.",
            "Book three. The last chapter closes on one question, and nothing is "
            "written after it.",
        ]),
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


# 말차례 — (쪽, 길이, 비어 있나). 0 이 묻는 쪽, 1 이 답하는 쪽이다.
# 비어 있는 둘이 기계가 모르겠다고 한 자리고, 마지막 줄이 그 자리다.
TURNS = [
    (0, 0.95, False),
    (1, 0.72, False),
    (0, 0.54, False),
    (1, 0.90, False),
    (0, 0.78, False),
    (1, 0.46, True),
    (0, 0.63, False),
    (1, 0.92, False),
    (0, 0.50, False),
    (1, 0.34, True),
]


def draw_front_dialog(d, ox, oy, w, h, spec):
    """번갈아 오는 말차례를 그림으로 쓰는 앞표지.

    왼쪽 칸이 묻는 쪽, 오른쪽 칸이 답하는 쪽이다. 막대가 가운데를 향해
    자라서 가운데가 들쭉날쭉해진다. 테두리만 있는 막대가 답이 안 온 자리고,
    그 자리가 이 책의 제목이다. 그래서 마지막 줄을 비워 두었다.
    """
    f_serif, f_serif_r, f_sans_b = faces(spec)
    warm = spec["accent"]
    cool = spec["accent2"]
    s = w / 1600.0
    pad = w * 0.08125
    inner = w - pad * 2
    L = ox + pad
    R = ox + w - pad

    # 위쪽 가는 선과 다섯 부 표시
    d.rectangle([L, oy + h * 0.0586, R, oy + h * 0.0586 + 4 * s], fill=warm)
    ey = oy + h * 0.0781

    # 왼쪽 줄과 오른쪽 표시가 겹치면 안 된다. 자간부터 줄이고 그래도 넘치면
    # 글자를 줄인다. draw_front_curve 와 같은 방식이다.
    size_eye, sp = 34 * s, 5 * s
    while size_eye >= 20 * s:
        f_eye = font(f_sans_b, size_eye)
        left = track_width(d, spec["series"], f_eye, sp)
        right = track_width(d, spec["volume"], f_eye, sp)
        if left + right + inner * 0.06 <= inner:
            break
        if sp > 1 * s:
            sp -= 1 * s
        else:
            size_eye -= 2 * s
    track(d, (L, ey), spec["series"], f_eye, MUTED, sp)
    vw = track_width(d, spec["volume"], f_eye, sp)
    track(d, (R - vw, ey), spec["volume"], f_eye, cool, sp)

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

    TOP, BOTTOM = oy + h * 0.155, oy + h * 0.47
    block = len(lines) * step + 46 * s + len(sub_lines) * 78 * s
    y = TOP + max(0, (BOTTOM - TOP - block) / 2)
    for line in lines:
        d.text((L, y), line, font=f_title, fill=CREAM)
        y += step
    y += 46 * s
    for line in sub_lines:
        d.text((L + 4 * s, y), line, font=f_sub, fill=DIM)
        y += 78 * s

    # 말차례 — 가운데를 향해 자라는 막대 열 개
    top = oy + h * 0.515
    bot = oy + h * 0.785
    col = inner * 0.455
    rh = (bot - top) / len(TURNS)
    bh = rh * 0.42
    edge = max(2, int(5 * s))
    for i, (side, frac, hollow) in enumerate(TURNS):
        y0 = top + i * rh + (rh - bh) / 2
        length = col * frac
        if side == 0:
            x0, x1, color = L, L + length, warm
        else:
            x0, x1, color = R - length, R, cool
        if hollow:
            d.rectangle([x0, y0, x1, y0 + bh], outline=color, width=edge)
        else:
            d.rectangle([x0, y0, x1, y0 + bh], fill=color)

    # 가운데 가는 세로선 — 두 쪽을 가르는 자리
    mx = ox + w / 2
    d.rectangle([mx - 1 * s, top, mx + 1 * s, bot], fill="#2A3238")

    # 두 쪽의 이름
    f_lab = font(f_sans_b, 28 * s)
    ly = bot + 22 * s
    track(d, (L, ly), spec["curve_labels"][0], f_lab, warm, 5 * s)
    w2 = track_width(d, spec["curve_labels"][1], f_lab, 5 * s)
    track(d, (R - w2, ly), spec["curve_labels"][1], f_lab, cool, 5 * s)

    if spec.get("motif_note"):
        f_note = font(f_serif_r, 36 * s)
        d.text((L, bot + 86 * s), spec["motif_note"], font=f_note, fill=MUTED)

    # 아래쪽 지은이
    d.rectangle([L, oy + h * 0.895, L + 120 * s, oy + h * 0.895 + 4 * s], fill=warm)
    d.text((L, oy + h * 0.920), spec.get("author", "Jaehyuk Choi"),
           font=font(f_serif, 60 * s), fill=CREAM)


# 빼기 — 칸이 열이고, 왼쪽에서 오른쪽으로 쌓인 것이 하나씩 빠진다.
# 맨 오른쪽 칸에는 쌓인 것이 하나도 없다. 그런데 바닥의 점은 열 칸에 다 있다.
# 그 점이 이 책이고, 그래서 바닥 줄만 안 끊긴다.
SUBTRACT_N = 10


def draw_front_subtract(d, ox, oy, w, h, spec):
    """쌓인 것을 하나씩 빼는 그림을 쓰는 앞표지.

    위는 계단처럼 내려가서 끝에는 아무것도 안 남고, 아래 한 줄은 어느 칸에서도
    안 빠진다. 위가 쓸모고 아래가 사람이다. 제목이 그 아래 줄을 가리킨다.
    """
    f_serif, f_serif_r, f_sans_b = faces(spec)
    warm = spec["accent"]
    cool = spec["accent2"]
    s = w / 1600.0
    pad = w * 0.08125
    inner = w - pad * 2
    L = ox + pad
    R = ox + w - pad

    # 위쪽 가는 선과 다섯 부 표시
    d.rectangle([L, oy + h * 0.0586, R, oy + h * 0.0586 + 4 * s], fill=warm)
    ey = oy + h * 0.0781

    size_eye, sp = 34 * s, 5 * s
    while size_eye >= 20 * s:
        f_eye = font(f_sans_b, size_eye)
        left = track_width(d, spec["series"], f_eye, sp)
        right = track_width(d, spec["volume"], f_eye, sp)
        if left + right + inner * 0.06 <= inner:
            break
        if sp > 1 * s:
            sp -= 1 * s
        else:
            size_eye -= 2 * s
    track(d, (L, ey), spec["series"], f_eye, MUTED, sp)
    vw = track_width(d, spec["volume"], f_eye, sp)
    track(d, (R - vw, ey), spec["volume"], f_eye, cool, sp)

    # 제목
    size = 190 * s
    while size >= 100 * s:
        f_title = font(f_serif, size)
        lines = wrap(d, spec.get("title_lines") or spec["title"], f_title, inner)
        if len(lines) <= 3:
            break
        size -= 8 * s
    step_t = size * 1.2
    f_sub = font(f_serif_r, 56 * s)
    sub_lines = wrap(d, spec["subtitle"], f_sub, inner)

    TOP, BOTTOM = oy + h * 0.155, oy + h * 0.47
    block = len(lines) * step_t + 46 * s + len(sub_lines) * 78 * s
    y = TOP + max(0, (BOTTOM - TOP - block) / 2)
    for line in lines:
        d.text((L, y), line, font=f_title, fill=CREAM)
        y += step_t
    y += 46 * s
    for line in sub_lines:
        d.text((L + 4 * s, y), line, font=f_sub, fill=DIM)
        y += 78 * s

    # 쌓인 칸과 바닥의 점
    top = oy + h * 0.515
    bot = oy + h * 0.790
    base = bot - (bot - top) * 0.20
    step = inner / SUBTRACT_N
    cw = step * 0.52
    unit = (base - top) / (SUBTRACT_N - 1)
    bh = unit * 0.58
    dot = cw * 0.52
    for i in range(SUBTRACT_N):
        x0 = L + i * step
        for k in range(SUBTRACT_N - 1 - i):
            y1 = base - 10 * s - k * unit
            d.rectangle([x0, y1 - bh, x0 + cw, y1], fill=warm)
        dy = base + 16 * s
        d.rectangle([x0, dy, x0 + cw, dy + dot], fill=cool)

    # 바닥선 — 위와 아래를 가르는 자리
    d.rectangle([L, base, R, base + 2 * s], fill="#2A3238")

    # 두 쪽의 이름
    f_lab = font(f_sans_b, 28 * s)
    ly = base + 16 * s + dot + 26 * s
    track(d, (L, ly), spec["curve_labels"][0], f_lab, warm, 5 * s)
    w2 = track_width(d, spec["curve_labels"][1], f_lab, 5 * s)
    track(d, (R - w2, ly), spec["curve_labels"][1], f_lab, cool, 5 * s)

    if spec.get("motif_note"):
        f_note = font(f_serif_r, 36 * s)
        d.text((L, ly + 52 * s), spec["motif_note"], font=f_note, fill=MUTED)

    # 아래쪽 지은이
    d.rectangle([L, oy + h * 0.895, L + 120 * s, oy + h * 0.895 + 4 * s], fill=warm)
    d.text((L, oy + h * 0.920), spec.get("author", "Jaehyuk Choi"),
           font=font(f_serif, 60 * s), fill=CREAM)


# 실 — 세 권에 걸쳐 선 하나가 간다. thread_phase 가 1·2·3 이다.
# 1권은 바깥에서 들어와 한 점에 닿고, 2권은 그 점에서 표시 없는 쪽으로 나가고,
# 3권은 양쪽 가장자리를 다 넘어간다. 세 권을 나란히 놓아야 한 줄이 된다.
def draw_front_thread(d, ox, oy, w, h, spec):
    """세 권에 나눠 그리는 선 하나를 쓰는 앞표지."""
    f_serif, f_serif_r, f_sans_b = faces(spec)
    warm = spec["accent"]
    cool = spec["accent2"]
    s = w / 1600.0
    pad = w * 0.08125
    inner = w - pad * 2
    L = ox + pad
    R = ox + w - pad

    d.rectangle([L, oy + h * 0.0586, R, oy + h * 0.0586 + 4 * s], fill=warm)
    ey = oy + h * 0.0781

    size_eye, sp = 34 * s, 5 * s
    while size_eye >= 20 * s:
        f_eye = font(f_sans_b, size_eye)
        left = track_width(d, spec["series"], f_eye, sp)
        right = track_width(d, spec["volume"], f_eye, sp)
        if left + right + inner * 0.06 <= inner:
            break
        if sp > 1 * s:
            sp -= 1 * s
        else:
            size_eye -= 2 * s
    track(d, (L, ey), spec["series"], f_eye, MUTED, sp)
    vw = track_width(d, spec["volume"], f_eye, sp)
    track(d, (R - vw, ey), spec["volume"], f_eye, cool, sp)

    size = 190 * s
    while size >= 100 * s:
        f_title = font(f_serif, size)
        lines = wrap(d, spec.get("title_lines") or spec["title"], f_title, inner)
        if len(lines) <= 3:
            break
        size -= 8 * s
    step_t = size * 1.2
    f_sub = font(f_serif_r, 52 * s)
    sub_lines = wrap(d, spec["subtitle"], f_sub, inner)

    TOP, BOTTOM = oy + h * 0.155, oy + h * 0.47
    block = len(lines) * step_t + 46 * s + len(sub_lines) * 72 * s
    y = TOP + max(0, (BOTTOM - TOP - block) / 2)
    for line in lines:
        d.text((L, y), line, font=f_title, fill=CREAM)
        y += step_t
    y += 46 * s
    for line in sub_lines:
        d.text((L + 4 * s, y), line, font=f_sub, fill=DIM)
        y += 72 * s

    # 선 하나
    phase = spec.get("thread_phase", 1)
    ty = oy + h * 0.600
    th = max(3, int(7 * s))
    dot = 26 * s

    if phase == 1:
        x0, x1 = ox, L + inner * 0.70
        d.rectangle([x0, ty - th / 2, x1, ty + th / 2], fill=warm)
        d.ellipse([x1 - dot, ty - dot, x1 + dot, ty + dot], fill=cool)
    elif phase == 2:
        x0, x1 = L + inner * 0.14, ox + w
        d.ellipse([x0 - dot, ty - dot, x0 + dot, ty + dot], fill=cool)
        d.rectangle([x0, ty - th / 2, x1, ty + th / 2], fill=warm)
        gap = (x1 - x0) * 0.22
        r = dot * 0.72
        x = x0 + gap
        while x < x1 - dot * 0.4:
            e = max(2, int(4 * s))
            d.ellipse([x - r, ty - r, x + r, ty + r], outline=cool, width=e)
            x += gap
            gap *= 1.18
            r *= 0.82
    else:
        d.rectangle([ox, ty - th / 2, ox + w, ty + th / 2], fill=warm)
        n = 6
        step_d = w / (n + 1.0)
        for i in range(1, n + 1):
            x = step_d * i
            d.ellipse([x - dot * 0.8, ty - dot * 0.8,
                       x + dot * 0.8, ty + dot * 0.8], fill=cool)

    f_lab = font(f_sans_b, 28 * s)
    ly = ty + 60 * s
    track(d, (L, ly), spec["curve_labels"][0], f_lab, warm, 5 * s)
    w2 = track_width(d, spec["curve_labels"][1], f_lab, 5 * s)
    track(d, (R - w2, ly), spec["curve_labels"][1], f_lab, cool, 5 * s)

    if spec.get("motif_note"):
        f_note = font(f_serif_r, 36 * s)
        d.text((L, ly + 52 * s), spec["motif_note"], font=f_note, fill=MUTED)

    d.rectangle([L, oy + h * 0.895, L + 120 * s, oy + h * 0.895 + 4 * s], fill=warm)
    d.text((L, oy + h * 0.920), spec.get("author", "Jaehyuk Choi"),
           font=font(f_serif, 60 * s), fill=CREAM)


def draw_front(d, ox, oy, w, h, spec):
    """앞표지를 (ox, oy) 에서 시작하는 w x h 영역에 그린다.

    전자책 표지와 인쇄용 표지 앞면이 이 함수 하나를 같이 쓴다.
    가로세로 비가 달라도 되도록 좌표를 전부 비율로 잡는다.
    """
    if spec.get("motif") == "curve":
        return draw_front_curve(d, ox, oy, w, h, spec)
    if spec.get("motif") == "dialog":
        return draw_front_dialog(d, ox, oy, w, h, spec)
    if spec.get("motif") == "subtract":
        return draw_front_subtract(d, ox, oy, w, h, spec)
    if spec.get("motif") == "thread":
        return draw_front_thread(d, ox, oy, w, h, spec)
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
