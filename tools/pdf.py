#!/usr/bin/env python3
"""책 원고를 PDF로 만든다. (전자책 플랫폼이 epub 을 안 받아 줄 때 대신 쓴다)

    python3 tools/pdf.py book         # book/site/돈의 해부학.pdf
    python3 tools/pdf.py book2        # book2/site/....pdf
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


OVERLAY = {"book2": "book2", "book-teen": "book_teen", "teen": "book_teen"}


def build_html(which):
    which = which.rstrip("/")
    if which not in OVERLAY and which not in ("book", "adult"):
        raise SystemExit("첫 인자는 book · book2 · book-teen 중 하나여야 합니다.")
    script = OVERLAY.get(which, "book") + ".py"
    subprocess.run([sys.executable, os.path.join(ROOT, "tools", script)], check=True, cwd=ROOT)
    import book as m
    if which in OVERLAY:
        importlib.import_module(OVERLAY[which])
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
    """각 장의 제목이 실제로 시작되는 쪽을 찾는다.

    차례 쪽 자체에도 모든 장 제목이 글자 그대로 나오기 때문에, 단순히
    "이 페이지에 제목이 있는가"만 보면 차례 쪽을 그 장의 시작 쪽으로
    잘못 짚는다. 차례 쪽은 한 페이지에 여러 장 제목이 한꺼번에 나온다는
    점으로 구분해 건너뛴다.
    """
    import fitz
    doc = fitz.open(pdf_path)
    pages_text = [norm(p.get_text()) for p in doc]
    targets = [(item["slug"], norm(item["title"])) for item in items]

    toc_last = -1
    for i, text in enumerate(pages_text):
        hits = sum(1 for _, t in targets if t and t in text)
        if hits > 1:
            toc_last = i

    mapping = {}
    pointer = toc_last + 1
    for slug, target in targets:
        found = None
        for i in range(pointer, len(pages_text)):
            if target in pages_text[i][:160]:
                found = i
                break
        if found is not None:
            mapping[slug] = found + 1
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
