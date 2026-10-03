#!/usr/bin/env python3
"""『모른다고 열아홉 번』 한국어 원고. tools/book.py 와 같은 방식이다.

    python3 tools/aibook.py            # ai-book/site/index.html
    python3 tools/aibook.py --stat     # 분량 · 확인 · TODO

제목에서 숫자를 뺐다. 책 안에서 실제로 세니 일곱쯤이었고, 더 큰 문제는
한 줄만 고쳐도 숫자가 바뀌는데 KDP 는 발행 뒤에 제목을 못 바꾼다는 것이다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "ai-book", "manuscript")
m.SITE = os.path.join(m.ROOT, "ai-book", "site")
m.TITLE = "기계가 말하지 못한 것"
m.SUBTITLE = "사람 하나와 기계 하나가 나눈 기록"
# 짧은 책으로 간다(2026-10-03 작가 결정). 대화편이라 늘리면 묽어진다.
m.SERIES = ""
m.AUTHOR = "최재혁"
m.TARGET = 35000

if __name__ == "__main__":
    raise SystemExit(m.main())
