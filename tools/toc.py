#!/usr/bin/env python3
"""PDF 안에서 각 장이 실제로 몇 페이지에서 시작하는지 찾아 목차 표를 만든다.
유페이퍼 같은 곳에 PDF 로 올리면 목차를 손으로 입력해야 하는데, 그때 쓸 표다.

    python3 tools/toc.py book
    python3 tools/toc.py book-teen
"""

import os
import re
import sys

import fitz  # PyMuPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))


def load_module(which):
    import book as m
    if which in ("book-teen", "teen"):
        import importlib
        importlib.import_module("book_teen")
    elif which not in ("book", "adult"):
        raise SystemExit("첫 인자는 book 또는 book-teen 이어야 합니다.")
    return m


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def page_of(doc, title, start_at):
    target = norm(title)
    for page in doc:
        if page.number + 1 < start_at:
            continue
        head = norm(page.get_text())[:160]
        if target in head:
            return page.number + 1
    return None


def main():
    if not sys.argv[1:]:
        print(__doc__)
        return 1
    m = load_module(sys.argv[1])
    pdf_path = os.path.join(m.SITE, "%s.pdf" % m.TITLE)
    if not os.path.exists(pdf_path):
        raise SystemExit("먼저 tools/pdf.py 로 PDF 를 만들어 주세요: %s" % pdf_path)

    doc = fitz.open(pdf_path)
    items = [i for i in m.load() if not (i["kind"] == "front" and i.get("order") == "0")]

    rows = []
    pointer = 1
    for item in items:
        page = page_of(doc, item["title"], pointer)
        if page:
            pointer = page
        indent = "  " if item["kind"] in ("chapter",) else ""
        rows.append((indent + item["title"], page, item["kind"]))

    print("%-46s  %s" % ("목차명", "페이지번호"))
    print("-" * 60)
    for title, page, kind in rows:
        mark = "" if page else "  ⚠ 못 찾음(손으로 확인)"
        print("%-46s  %6s%s" % (title, page if page else "-", mark))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
