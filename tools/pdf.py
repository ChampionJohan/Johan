#!/usr/bin/env python3
"""책 원고를 PDF로 만든다. (전자책 플랫폼이 epub 을 안 받아 줄 때 대신 쓴다)

    python3 tools/pdf.py book         # book/site/돈의 해부학.pdf
    python3 tools/pdf.py book-teen    # book-teen/site/....pdf

book/site/index.html (또는 book-teen/site/index.html) 을 먼저 최신으로 만든 뒤,
headless 크롬으로 그 화면을 그대로 인쇄해서 PDF 로 저장한다.
"""

import os
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
        import importlib
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


def to_pdf(m):
    from playwright.sync_api import sync_playwright

    html_path = os.path.join(m.SITE, "index.html")
    pdf_path = os.path.join(m.SITE, "%s.pdf" % m.TITLE)

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
