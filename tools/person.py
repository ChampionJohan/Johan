#!/usr/bin/env python3
"""『사람을 사람으로 보는 법』 한국어 원고. tools/book.py 와 같은 방식이다.

    python3 tools/person.py            # person/site/index.html
    python3 tools/person.py --stat     # 분량 · 확인 · TODO

09·10번 『기계가 말하지 못한 것』의 뒷면이다. 저쪽이 기계를 보는 책이고
이쪽이 사람을 보는 책이라 같이 팔 수 있다.

제목은 아직 확정이 아니다. 원고를 다 쓴 뒤에 정하기로 했고 후보가 셋이다.
고치면 이 파일과 tools/cover.py 와 등록 문서 세 군데를 같이 고쳐야 한다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "person", "manuscript")
m.SITE = os.path.join(m.ROOT, "person", "site")
m.TITLE = "사람을 사람으로 보는 법"
m.SUBTITLE = "쓸모를 빼고 사람을 보는 법"
m.SERIES = ""
m.AUTHOR = "최재혁"
m.TRIM = "6x9"
# 열일곱 장에 앞글 셋과 부 여는 글 다섯. 작가의 장면 열여덟이 채워진 뒤 값이다.
m.TARGET = 38000

if __name__ == "__main__":
    raise SystemExit(m.main())
