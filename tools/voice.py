#!/usr/bin/env python3
"""원고가 기계 글로 읽히는 정도를 잰다.

    python3 tools/voice.py book-teen3
    python3 tools/voice.py en-teen3
    python3 tools/voice.py --all

재는 것은 문체가 아니라 습관이다. 사람이 쓴 글에는 길이가 들쑥날쑥하고,
긴 문장이 섞여 있고, 굵은 글씨가 드물고, 장마다 생김새가 다르다.
기계 글은 그 반대다. 그래서 아래 다섯 개를 세면 대체로 갈린다.

기준값은 사람이 쓴 교양서를 몇 권 훑어 잡은 눈금이지 법이 아니다.
목표는 만점이 아니라 '전부 한쪽으로 쏠려 있지 않은 상태'다.
"""

import glob
import io
import os
import re
import statistics
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BOOKS = {
    "book": "book", "book2": "book2",
    "book-teen": "book-teen", "book-teen2": "book-teen2", "book-teen3": "book-teen3",
    "bestseller": "bestseller",
    "en-book": "en-book", "en-book2": "en-book2",
    "en-teen": "en-teen", "en-teen2": "en-teen2", "en-teen3": "en-teen3",
    "en-bestseller": "en-bestseller",
}


def body(path):
    """표·제목·인용·front matter 를 뺀 본문만 남긴다."""
    s = io.open(path, encoding="utf-8").read()
    s = re.sub(r"^---.*?^---", "", s, flags=re.S | re.M)
    s = re.sub(r"^\|.*$", "", s, flags=re.M)
    s = re.sub(r"^> .*$", "", s, flags=re.M)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    return s


def split_ko(text):
    out = []
    for line in re.sub(r"\*+", "", text).split("\n"):
        line = line.strip()
        if not line or line.startswith(("#", "-", "|", "`")):
            continue
        for t in re.split(r"(?<=[.!?…])\s+", line):
            t = t.strip()
            if len(t) > 3:
                out.append(t)
    return out


def split_en(text):
    text = re.sub(r"^#.*$", "", re.sub(r"\*+", "", text), flags=re.M)
    text = re.sub(r"^[-|`].*$", "", text, flags=re.M)
    return [t.strip() for t in re.split(r"(?<=[.!?])\s+", text) if len(t.strip()) > 3]


def bar(value, floor, good, invert=False):
    """기준을 넘었는지 한 글자로 보여 준다."""
    ok = value <= floor if invert else value >= floor
    near = value <= good if invert else value >= good
    return "OK " if near else (".. " if ok else "!! ")


def measure(key):
    d = os.path.join(ROOT, BOOKS.get(key, key), "manuscript")
    if not os.path.isdir(d):
        raise SystemExit("원고 폴더가 없습니다: %s" % d)
    files = sorted(glob.glob(os.path.join(d, "*.md")))
    chapters = [f for f in files if re.search(r"/[1-9]\d[1-9]-", f)]
    en = key.startswith("en-")
    text = "".join(body(f) for f in chapters)
    sent = (split_en if en else split_ko)(text)
    size = [len(s.split()) if en else len(s) for s in sent]
    paras = [p for p in text.split("\n\n")
             if p.strip() and not p.strip().startswith(("#", "-", "|"))]
    plines = [len(p.strip().split("\n")) for p in paras]

    long_cut = 30 if en else 60
    long_pct = 100.0 * sum(1 for x in size if x > long_cut) / max(len(size), 1)
    sd = statistics.pstdev(size) if len(size) > 1 else 0
    deep_pct = 100.0 * sum(1 for x in plines if x >= 4) / max(len(plines), 1)
    bold = text.count("**") // 2
    bold_pct = 100.0 * bold / max(len(paras), 1)

    # 장마다 되풀이되는 소제목
    heads = {}
    for f in chapters:
        for h in set(re.findall(r"^## (.+)$", io.open(f, encoding="utf-8").read(), re.M)):
            h = re.sub(r"\s*[-—·].*$", "", h).strip()
            heads[h] = heads.get(h, 0) + 1
    n = max(len(chapters), 1)
    same = sorted(((c, h) for h, c in heads.items() if c >= n * 0.8), reverse=True)

    print("== %s ==  장 %d개 · 문장 %d개" % (key, len(chapters), len(sent)))
    unit = "낱말" if en else "자"
    print("  %s긴 문장 비율        %5.1f%%   (기준 3%% 이상, %d%s 초과)"
          % (bar(long_pct, 3, 5), long_pct, long_cut, unit))
    print("  %s문장 길이 표준편차  %5.1f%s   (기준 %s 이상)"
          % (bar(sd, 6 if en else 12, 8 if en else 15), sd, unit, "6" if en else "12"))
    print("  %s네 줄 이상 문단     %5.1f%%   (기준 15%% 이상)"
          % (bar(deep_pct, 15, 25), deep_pct))
    print("  %s굵은 글씨 / 문단    %5.1f%%   (기준 25%% 이하, 지금 %d번)"
          % (bar(bold_pct, 40, 25, invert=True), bold_pct, bold))
    print("  %s장마다 같은 소제목  %5d개  (기준 2개 이하)"
          % (bar(len(same), 4, 2, invert=True), len(same)))
    for c, h in same[:6]:
        print("       %2d/%d장   %s" % (c, len(chapters), h))
    return long_pct, sd, deep_pct, bold_pct, len(same)


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    keys = sorted(BOOKS) if args[0] == "--all" else args
    for i, k in enumerate(keys):
        if i:
            print()
        measure(k)
