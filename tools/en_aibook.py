#!/usr/bin/env python3
"""영어판 — What It Could Not Tell Me. 이 책의 본판이다.

    python3 tools/en_aibook.py          # en-ai-book/site/index.html
    python3 tools/en_aibook.py --stat   # 분량 · 확인 · TODO

제목에 숫자를 안 넣었다. 『모른다고 열아홉 번』으로 가려다 책 안에서 실제로
세어 보니 일곱쯤이었고, 더 큰 문제는 한 줄만 고쳐도 숫자가 바뀌는데 KDP 는
발행 뒤에 제목을 못 바꾼다는 것이다. 숫자를 쓰려면 책 안에 그 목록을 실어
독자가 세어 볼 수 있게 해야 한다. 작가가 그쪽을 원하면 되돌린다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "en-ai-book", "manuscript")
m.SITE = os.path.join(m.ROOT, "en-ai-book", "site")
m.TITLE = "What It Could Not Tell Me"
m.SUBTITLE = "A Record of One Person and One Machine"
m.SERIES = ""
m.AUTHOR = "Jaehyuk Choi"
m.LANG = "en"
m.TRIM = "6x9"
m.TARGET = 12000  # 낱말
m.STYLE = m.STYLE.replace("--track:.16em;", "--track:.06em;")

if __name__ == "__main__":
    raise SystemExit(m.main())
