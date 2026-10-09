#!/usr/bin/env python3
"""영어판 — The One Who Was Already There. 한국어가 원고고 이쪽이 옮긴 것이다.

    python3 tools/en_love1.py          # en-love1/site/index.html
    python3 tools/en_love1.py --stat   # 분량 · 확인 · TODO

이 세 권에는 안 쓰는 낱말이 있다. tools/voice.py 의 WATCH 를 볼 것.
기준이 다섯 번이 아니라 **영 번**이고, 영어 쪽 목록이 따로 있다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-love1", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-love1", "site")
m.TITLE = "The One Who Was Already There"
m.SUBTITLE = "Already there before I ever asked"
m.SERIES = "Someone Comes to Mind · Book One"
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
m.TRIM = "6x9"
m.TARGET = 8000  # 낱말
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")

if __name__ == "__main__":
    raise SystemExit(m.main())
