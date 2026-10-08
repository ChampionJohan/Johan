#!/usr/bin/env python3
"""『먼저 와 있던 것』 — 사랑 세 권 가운데 첫째 권.

    python3 tools/love1.py            # love1/site/index.html
    python3 tools/love1.py --stat     # 분량 · 확인 · TODO

이 세 권에는 안 쓰는 낱말이 있다. tools/voice.py 의 WATCH 를 볼 것.
기준이 다섯 번이 아니라 **영 번**이다. 한 번이라도 나오면 막는다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "love1", "manuscript")
m.SITE = os.path.join(m.ROOT, "love1", "site")
m.TITLE = "먼저 와 있던 사람"
m.SUBTITLE = "내가 요청한 적 없는데 이미 있던 사람"
m.SERIES = "떠오르는 사람 · 첫째 권"
m.AUTHOR = "최재혁"
m.TRIM = "6x9"
m.TARGET = 21000

if __name__ == "__main__":
    raise SystemExit(m.main())
