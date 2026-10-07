#!/usr/bin/env python3
"""영어판 — How to See a Person. 한국어가 원고고 이쪽이 옮긴 것이다.

    python3 tools/en_person.py          # en-person/site/index.html
    python3 tools/en_person.py --stat   # 분량 · 확인 · TODO

09·10번과 달리 이 책은 한국어가 본판이다. 겪은 일 열여덟 자리가
한국어로 먼저 쓰였고, 그걸 옮기면서 뜻을 바꾸지 않는 것이 제일 중요하다.
특히 8장과 10장과 12장에는 우리말에만 있는 자리가 들어 있어서,
그 자리는 설명을 한 줄 붙여서 옮긴다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-person", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-person", "site")
m.TITLE = "How to See a Person"
m.SUBTITLE = "What Is Left When Usefulness Is Taken Away"
m.SERIES = ""
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
m.TRIM = "6x9"
m.TARGET = 15000  # 낱말
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")

if __name__ == "__main__":
    raise SystemExit(m.main())
