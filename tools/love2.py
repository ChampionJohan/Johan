#!/usr/bin/env python3
"""『값을 안 묻고』 — 사랑 세 권 가운데 둘째 권.

    python3 tools/love2.py            # love2/site/index.html
    python3 tools/love2.py --stat     # 분량 · 확인 · TODO

이 세 권에는 안 쓰는 낱말이 있다. tools/voice.py 의 WATCH 를 볼 것.
기준이 다섯 번이 아니라 **영 번**이다. 한 번이라도 나오면 막는다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "love2", "manuscript")
m.SITE = os.path.join(m.ROOT, "love2", "site")
m.TITLE = "값을 묻지 않는 사람"
m.SUBTITLE = "돌아올 것이 없는 쪽으로 가는 사람"
m.SERIES = "떠오르는 사람 · 둘째 권"
m.AUTHOR = "최재혁"
m.TRIM = "6x9"
m.TARGET = 21000

if __name__ == "__main__":
    raise SystemExit(m.main())
