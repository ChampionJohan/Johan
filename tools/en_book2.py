#!/usr/bin/env python3
"""영어판 둘째 권 — Anatomy of Money II.

    python3 tools/en_book2.py           # en-book/site/index.html
    python3 tools/en_book2.py --stat    # 분량 · 확인 항목
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-book2", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-book2", "site")
m.TITLE = "Anatomy of Money II"
m.SUBTITLE = "Moats, Fault Lines, and How to Build One That Lasts"
m.SERIES = "The Five Boxes Series · Book Two"
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
m.TRIM = "6x9"
m.TARGET = 44000  # 낱말 수 기준

if __name__ == "__main__":
    raise SystemExit(m.main())
