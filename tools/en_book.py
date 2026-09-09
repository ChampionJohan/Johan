#!/usr/bin/env python3
"""영어판 첫째 권 — Anatomy of Money.

    python3 tools/en_book.py           # en-book/site/index.html
    python3 tools/en_book.py --stat    # 분량 · 확인 항목
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-book", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-book", "site")
m.TITLE = "Who's Actually Paying?"
m.SUBTITLE = "Take Any Business Apart in Five Questions"
m.SERIES = "The Five Boxes Series · Book One"
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
# 영문은 자간을 넓히면 낱말이 흩어져 보인다
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")
m.TRIM = "6x9"
m.TARGET = 46000  # 낱말 수 기준

if __name__ == "__main__":
    raise SystemExit(m.main())
