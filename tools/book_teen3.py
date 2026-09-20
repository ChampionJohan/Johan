#!/usr/bin/env python3
"""청소년판 『다들 갖고 있었잖아. 다 어디 갔지?』

    python3 tools/book_teen3.py             # book-teen3/site/index.html
    python3 tools/book_teen3.py --stat      # 분량 · 확인 항목

앞의 청소년판 두 권과 같은 문체와 디자인을 쓴다. 다만 이 책은 다섯 칸
시리즈가 아니라 『베스트셀러 & 스테디셀러』의 청소년판이라 시리즈 표기가
다르고, 강조색도 세 번째 색을 쓴다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book_teen                      # 청소년판 문체와 디자인을 먼저 입힌다
import book as m

m.MANUSCRIPT = os.path.join(m.ROOT, "book-teen3", "manuscript")
m.SITE = os.path.join(m.ROOT, "book-teen3", "site")
m.TITLE = "다들 갖고 있었잖아. 다 어디 갔지?"
m.SUBTITLE = "유행은 왜 끝나고, 어떤 건 왜 안 끝날까"
m.SERIES = "『베스트셀러 & 스테디셀러』 청소년판"
m.TARGET = 64000

# 앞의 두 권은 주황과 초록. 이 책은 세 번째 색으로 간다.
m.STYLE = m.STYLE.replace("--accent:#E85D2F;", "--accent:#B5542F;")
m.STYLE = m.STYLE.replace("--accent:#FF8A5C;", "--accent:#E0895F;")

if __name__ == "__main__":
    raise SystemExit(m.main())
