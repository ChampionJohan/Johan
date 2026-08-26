#!/usr/bin/env python3
"""책 원고를 PDF로 만든다. (전자책 플랫폼이 epub 을 안 받아 줄 때 대신 쓴다)

    python3 tools/pdf.py book         # book/site/돈의 해부학.pdf
    python3 tools/pdf.py book-teen    # book-teen/site/....pdf

book/site/index.html (또는 book-teen/site/index.html) 을 먼저 최신으로 만든 뒤,
headless 크롬으로 그 화면을 그대로 인쇄해서 PDF 로 저장한다.

한 번 인쇄해 각 장이 실제로 몇 쪽에서 시작하는지 알아낸 뒤,
그 쪽수를 차례에 붙여 다시 한번 인쇄한다(두 번 렌더링).
"""

import importlib
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))


def build_html(which):
    script = {"book": "book.py", "adult": "book.py",
              "book-teen": "book_teen.py", "teen": "book_teen.py"}.get(which)
    if not script:
        raise SystemExit("첫 인자는 book 또는 book-teen 이어야 합니다.")
    subprocess.run([sys.executable, os.path.join(ROOT, "tools", script)], check=True, cwd=ROOT)
    import book as m
    if which in ("book-teen", "teen"):
        importlib.import_module("book_teen")
    return m


def find_chrome():
    base = "/opt/pw-browsers"
    for name in sorted(os.listdir(base)):
        if name.startswith("chromium-"):
            candidate = os.path.join(base, name, "chrome-linux", "chrome")
            if os.path.exists(candidate):
                return candidate
    return None


def render_pdf(html_path, pdf_path):
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=find_chrome())
        page = browser.new_page()
        page.goto("file://%s" % html_path)
        page.pdf(
            path=pdf_path,
            format="A5",
            margin={"top": "16mm", "bottom": "18mm", "left": "14mm", "right": "14mm"},
            print_background=True,
            display_header_footer=True,
            header_template="<span></span>",
            footer_template=(
                '<div style="width:100%;text-align:center;font-size:8px;'
                'color:#999;font-family:sans-serif;">'
                '<span class="pageNumber"></span></div>'),
        )
        browser.close()


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def page_map(pdf_path, items):
    import fitz
    doc = fitz.open(pdf_path)
    mapping = {}
    pointer = 1
    for item in items:
        target = norm(item["title"])
        found = None
        for page in doc:
            if page.number + 1 < pointer:
                continue
            head = norm(page.get_text())[:160]
            if target in head:
                found = page.number + 1
                break
        if found:
            mapping[item["slug"]] = found
            pointer = found
    return mapping


def to_pdf(m):
    pdf_path = os.path.join(m.SITE, "%s.pdf" % m.TITLE)
    html_path = os.path.join(m.SITE, "index.html")

    render_pdf(html_path, pdf_path)

    items = [i for i in m.load() if not (i["kind"] == "front" and i.get("order") == "0")]
    pages = page_map(pdf_path, items)

    numbered_html = os.path.join(m.SITE, "index.print.html")
    m.render_html(m.load(), out_name="index.print.html", page_numbers=pages)
    render_pdf(numbered_html, pdf_path)

    print("만들었습니다: %s" % os.path.relpath(pdf_path, ROOT))
    return pdf_path


def main():
    if not sys.argv[1:]:
        print(__doc__)
        return 1
    m = build_html(sys.argv[1])
    to_pdf(m)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
