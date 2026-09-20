#!/usr/bin/env python3
"""영어판 청소년판 — Everyone Had One. Where Did They All Go?

    python3 tools/en_teen3.py           # en-teen3/site/index.html
    python3 tools/en_teen3.py --stat    # 분량 · 확인 항목
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book_teen
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-teen3", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-teen3", "site")
m.TITLE = "Everyone Had One. Where Did They All Go?"
m.SUBTITLE = "Why Fads End, and Why Some Things Don't"
m.SERIES = "The Teen Edition of Why Is This Still Here?"
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")
m.TRIM = "6x9"
m.TARGET = 17000  # 낱말 수 기준

m.STYLE = m.STYLE.replace("--accent:#E85D2F;", "--accent:#B5542F;")
m.STYLE = m.STYLE.replace("--accent:#FF8A5C;", "--accent:#E0895F;")

if __name__ == "__main__":
    raise SystemExit(m.main())
