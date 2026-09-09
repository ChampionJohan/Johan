#!/usr/bin/env python3
"""영어판 청소년 첫째 권 — Anatomy of Money for Teens."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-teen", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-teen", "site")
m.TITLE = "It's Free. So How Are They Rich?"
m.SUBTITLE = "How Money Actually Works — and How to Start"
m.SERIES = "The Five Boxes Series · Teen Edition, Book One"
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
# 영문은 자간을 넓히면 낱말이 흩어져 보인다
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")
m.TRIM = "6x9"
m.TARGET = 11000  # 낱말 수 기준
m.STYLE = m.STYLE.replace("--accent:#8A2E2E;", "--accent:#E85D2F;")

if __name__ == "__main__":
    raise SystemExit(m.main())
