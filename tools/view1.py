#!/usr/bin/env python3
"""『앞에서 본 사자』 — 『어디서 보았니』 다섯 권 가운데 첫째 권.

    python3 tools/view1.py            # view1/site/index.html
    python3 tools/view1.py --stat     # 분량 · 확인 · TODO

이 다섯 권에는 안 쓰는 낱말이 있다. tools/voice.py 의 WATCH 를 볼 것.
기준이 다섯 번이 아니라 **영 번**이다. 13~18번과 같은 목록이다.

그리고 이 권에는 그림이 한 장도 안 들어간다. 그림은 5권으로 따로 낸다.
읽으면서 상상한 것이 나중에 그림이 되는 설계라, 본문에 그림을 넣으면
상상을 덮어쓴다. CLAUDE.md 5-5 절을 볼 것.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "view1", "manuscript")
m.SITE = os.path.join(m.ROOT, "view1", "site")
m.TITLE = "앞에서 본 사자"
m.SUBTITLE = "마주 서야 보이는 것"
m.SERIES = "어디서 보았니 · 첫째 권"
m.AUTHOR = "최재혁"
m.TRIM = "6x9"
m.TARGET = 10000

if __name__ == "__main__":
    raise SystemExit(m.main())
