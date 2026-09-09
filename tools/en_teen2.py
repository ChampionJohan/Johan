#!/usr/bin/env python3
"""영어판 청소년 첫째 권 — Anatomy of Money for Teens."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-teen2", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-teen2", "site")
m.TITLE = "Anatomy of Money for Teens II"
m.SUBTITLE = "I Started — So Why Isn't It Working?"
m.SERIES = "The Five Boxes Series · Teen Edition, Book Two"
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
# 영문은 자간을 넓히면 낱말이 흩어져 보인다
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")
m.TRIM = "6x9"
m.TARGET = 21000  # 낱말 수 기준
m.STYLE = m.STYLE.replace("--accent:#8A2E2E;", "--accent:#2E7D52;")

if __name__ == "__main__":
    raise SystemExit(m.main())
