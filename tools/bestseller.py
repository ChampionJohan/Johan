#!/usr/bin/env python3
"""『베스트셀러 & 스테디셀러』 원고를 한 권으로 묶는다. tools/book.py 오버레이다.

    python3 tools/bestseller.py           # bestseller/site/index.html
    python3 tools/bestseller.py --md      # 번호 매겨진 원고 한 파일
    python3 tools/bestseller.py --stat    # 분량 · 남은 확인 항목

다섯 칸 시리즈와 나란히 꽂히지만 같은 시리즈는 아니다.
형태는 그대로 두고 강조색만 따로 준다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "bestseller", "manuscript")
m.SITE = os.path.join(m.ROOT, "bestseller", "site")
m.TITLE = "베스트셀러 & 스테디셀러"
m.SUBTITLE = "왜 어떤 것은 터지고 사라지며, 어떤 것은 조용히 남는가"
m.SERIES = ""
m.TARGET = 91000

# 시리즈 네 권과 구별되는 색. 오래 두고 보는 책이라 채도를 낮춘다.
m.STYLE = m.STYLE.replace("--accent:#8A2E2E;", "--accent:#4A5D3A;")
m.STYLE = m.STYLE.replace("--accent:#D9906A;", "--accent:#A8C08C;")

if __name__ == "__main__":
    raise SystemExit(m.main())
