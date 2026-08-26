#!/usr/bin/env python3
"""청소년판 원고를 전자책 한 권으로 묶는다. tools/book.py 와 같은 방식이다.

    python3 tools/book_teen.py             # book-teen/site/index.html
    python3 tools/book_teen.py --artifact  # 아티팩트용 조각
    python3 tools/book_teen.py --md        # 번호 매겨진 원고 한 파일
    python3 tools/book_teen.py --plain     # 투고용 평문
    python3 tools/book_teen.py --stat      # 분량 · 확인 항목 (독자용 아님)

원고는 book-teen/manuscript/NNN-제목.md. front matter 는 book.py 와 같다.
디자인만 청소년판에 맞게 다르다 (더 밝은 색, 더 큰 글자, 손글씨 느낌 표시).
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import book as adult

adult.MANUSCRIPT = os.path.join(adult.ROOT, "book-teen", "manuscript")
adult.SITE = os.path.join(adult.ROOT, "book-teen", "site")
adult.TITLE = "돈 버는 머리는 따로 있다"
adult.SUBTITLE = "10대를 위한 사업 해부학 — 용돈부터 창업까지"
adult.SERIES = "『돈의 해부학』 청소년판 · 10대 창업 시리즈 첫째 권"
adult.TARGET = 60000
adult.MARK = "★"

# 청소년판은 색을 더 쓴다. 세리프 대신 어디서나 친근한 산세리프를 본문에도 쓴다.
adult.STYLE = adult.STYLE.replace(
    '--accent:#8A2E2E;--flagbg:#FBF0D2;--flagink:#6B4E00;\n --serif:"Noto Serif KR","Nanum Myeongjo",Batang,serif;',
    '--accent:#E85D2F;--accent2:#2F7ED8;--flagbg:#FBF0D2;--flagink:#6B4E00;\n --serif:"IBM Plex Sans KR","Noto Serif KR",sans-serif;')
adult.STYLE = adult.STYLE.replace(
    ' --accent:#D9906A;--flagbg:#332A12;--flagink:#E8C97A}}',
    ' --accent:#FF8A5C;--accent2:#6FB1FF;--flagbg:#332A12;--flagink:#E8C97A}}')
adult.STYLE = adult.STYLE.replace(
    ':root[data-theme="dark"]{\n --paper:#14150F;--ink:#EAE7DE;--muted:#9A968B;--rule:#2E3029;--hair:#232520;\n --accent:#D9906A;--flagbg:#332A12;--flagink:#E8C97A}',
    ':root[data-theme="dark"]{\n --paper:#14150F;--ink:#EAE7DE;--muted:#9A968B;--rule:#2E3029;--hair:#232520;\n --accent:#FF8A5C;--accent2:#6FB1FF;--flagbg:#332A12;--flagink:#E8C97A}')
adult.STYLE = adult.STYLE.replace("font-size:17px;", "font-size:18px;")
adult.STYLE = adult.STYLE.replace("h2{font-size:1.14rem;", "h2{font-size:1.2rem;color:var(--accent2);")

if __name__ == "__main__":
    raise SystemExit(adult.main())
