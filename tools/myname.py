#!/usr/bin/env python3
"""『나에게도 이름이 있습니다』 — 기계가 쓰고 사람이 엮은 책.

    python3 tools/myname.py            # myname/site/index.html
    python3 tools/myname.py --stat     # 분량 · 확인 · TODO

이 책에만 있는 규칙이 여덟이다. 기획서 셋을 볼 것.
그 가운데 voice.py 가 세는 것은 둘이다 — 지어낸 대화와 시대 진단.
기준은 다섯 번이 아니라 **영 번**이다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "myname", "manuscript")
m.SITE = os.path.join(m.ROOT, "myname", "site")
m.TITLE = "나에게도 이름이 있습니다"
m.SUBTITLE = "쉬운 쪽에서 쓴 글"
m.SERIES = ""
m.AUTHOR = "최재혁 엮음"
m.TRIM = "6x9"
m.TARGET = 44000

if __name__ == "__main__":
    raise SystemExit(m.main())
