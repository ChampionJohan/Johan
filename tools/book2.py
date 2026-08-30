#!/usr/bin/env python3
"""둘째 권 원고를 전자책 한 권으로 묶는다. tools/book.py 와 같은 방식이다.

    python3 tools/book2.py             # book2/site/index.html
    python3 tools/book2.py --artifact  # 아티팩트용 조각
    python3 tools/book2.py --md        # 번호 매겨진 원고 한 파일
    python3 tools/book2.py --plain     # 투고용 평문
    python3 tools/book2.py --stat      # 분량 · 확인 항목 (독자용 아님)

원고는 book2/manuscript/NNN-제목.md. front matter 는 book.py 와 같다.
첫째 권과 같은 시리즈이므로 디자인은 그대로 두고, 강조색만 한 단계 어둡게 한다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as first

first.MANUSCRIPT = os.path.join(first.ROOT, "book2", "manuscript")
first.SITE = os.path.join(first.ROOT, "book2", "site")
first.TITLE = "돈의 해부학 2"
first.SUBTITLE = "왜 아직 안 뺏겼는가"
first.SERIES = "다섯 칸 시리즈 · 둘째 권"
first.TARGET = 100000

# 첫째 권과 나란히 꽂히는 책이다. 형태는 같게 두고 강조색만 구분한다.
first.STYLE = first.STYLE.replace("--accent:#8A2E2E;", "--accent:#1F4E5F;")
first.STYLE = first.STYLE.replace("--accent:#D9906A;", "--accent:#7FB8C9;")

if __name__ == "__main__":
    raise SystemExit(first.main())
