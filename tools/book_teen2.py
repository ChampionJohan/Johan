#!/usr/bin/env python3
"""청소년판 둘째 권 원고를 전자책 한 권으로 묶는다.

    python3 tools/book_teen2.py             # book-teen2/site/index.html
    python3 tools/book_teen2.py --md        # 원고 한 파일
    python3 tools/book_teen2.py --stat      # 분량 · 확인 항목

문체와 디자인은 청소년판 1권을 그대로 따르고, 강조색만 구분한다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book_teen                      # 청소년판 설정을 먼저 입힌다
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "book-teen2", "manuscript")
m.SITE = os.path.join(m.ROOT, "book-teen2", "site")
m.TITLE = "너 그거 아니? 돈 버는 머리! 2"
m.SUBTITLE = "시작했는데, 왜 나만 안 될까?"
m.SERIES = "『돈의 해부학』 청소년판 · 10대 창업 시리즈 둘째 권"
m.TARGET = 50000

# 1권은 주황, 2권은 초록. 나란히 꽂혔을 때 같은 시리즈로 보이되 구분된다.
m.STYLE = m.STYLE.replace("--accent:#E85D2F;", "--accent:#2E7D52;")
m.STYLE = m.STYLE.replace("--accent:#FF8A5C;", "--accent:#6FC08D;")

if __name__ == "__main__":
    raise SystemExit(m.main())
