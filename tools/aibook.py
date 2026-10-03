#!/usr/bin/env python3
"""『모른다고 열아홉 번』 한국어 원고. tools/book.py 와 같은 방식이다.

    python3 tools/aibook.py            # ai-book/site/index.html
    python3 tools/aibook.py --stat     # 분량 · 확인 · TODO

제목의 숫자는 아직 확정이 아니다. 원고를 다 쓴 뒤에 기계가 모른다고 한
횟수를 세어서 맞춰야 한다. 2026-10-13 기준으로 센 것은 열여섯이다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "ai-book", "manuscript")
m.SITE = os.path.join(m.ROOT, "ai-book", "site")
m.TITLE = "모른다고 열아홉 번"
m.SUBTITLE = "사람 하나와 기계 하나가 나눈 기록"
# 짧은 책으로 간다(2026-10-03 작가 결정). 대화편이라 늘리면 묽어진다.
m.SERIES = ""
m.AUTHOR = "최재혁"
m.TARGET = 35000

if __name__ == "__main__":
    raise SystemExit(m.main())
