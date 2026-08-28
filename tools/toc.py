#!/usr/bin/env python3
"""PDF 안에서 각 장이 실제로 몇 페이지에서 시작하는지 찾아 목차 표를 만든다.
유페이퍼 같은 곳에 PDF 로 올리면 목차를 손으로 입력해야 하는데, 그때 쓸 표다.

    python3 tools/toc.py book
    python3 tools/toc.py book2
    python3 tools/toc.py book-teen
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

import pdf as pdftool


def load_module(which):
    import importlib
    import book as m
    which = which.rstrip("/")
    if which in pdftool.OVERLAY:
        importlib.import_module(pdftool.OVERLAY[which])
    elif which not in ("book", "adult"):
        raise SystemExit("첫 인자는 book · book2 · book-teen 중 하나여야 합니다.")
    return m


def main():
    if not sys.argv[1:]:
        print(__doc__)
        return 1
    m = load_module(sys.argv[1])
    pdf_path = os.path.join(m.SITE, "%s.pdf" % m.TITLE)
    if not os.path.exists(pdf_path):
        raise SystemExit("먼저 tools/pdf.py 로 PDF 를 만들어 주세요: %s" % pdf_path)

    items = [i for i in m.load() if not (i["kind"] == "front" and i.get("order") == "0")]
    pages = pdftool.page_map(pdf_path, items)

    print("%-46s  %s" % ("목차명", "페이지번호"))
    print("-" * 60)
    for item in items:
        page = pages.get(item["slug"])
        indent = "  " if item["kind"] == "chapter" else ""
        mark = "" if page else "  ⚠ 못 찾음(손으로 확인)"
        print("%-46s  %6s%s" % (indent + item["title"], page if page else "-", mark))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
