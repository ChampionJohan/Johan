#!/usr/bin/env python3
"""루프 연대기 / Loop Chronicles — 48장 원고를 PDF + EPUB로 묶는다.

    python3 tools/build_ebook.py ko   # 한국어판
    python3 tools/build_ebook.py en   # 영어판
    python3 tools/build_ebook.py both # 둘 다

PDF는 Playwright(Chromium)로, EPUB는 ebooklib으로 만든다. 둘 다 이 저장소에
이미 있는 mdlite.py(의존성 없는 마크다운 렌더러)를 재사용한다.
"""

import glob
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite

ROOT = "/home/user/Johan/writing/novel/루프-연대기"
OUT = os.path.join(ROOT, "build")
os.makedirs(OUT, exist_ok=True)

AUTHOR_PLACEHOLDER_KO = "[필명을 입력하세요 · Author Name Here]"
AUTHOR_PLACEHOLDER_EN = "[Author Name Here]"

CONFIGS = {
    "ko": dict(
        src_dir=ROOT,
        pattern=re.compile(r"^\d{2}장.*\.md$"),
        lang="ko",
        title="루프 연대기",
        subtitle="다니엘 12장 4절에서 시작하는 판타지 연작",
        author=AUTHOR_PLACEHOLDER_KO,
        toc_label="목차",
        cover_kicker="장편 소설",
        out_base="loop-chronicles-ko",
        part_word="부",
    ),
    "en": dict(
        src_dir=os.path.join(ROOT, "english"),
        pattern=re.compile(r"^\d{2}-.*\.md$"),
        lang="en",
        title="Loop Chronicles",
        subtitle="A novel that begins at Daniel 12:4",
        author=AUTHOR_PLACEHOLDER_EN,
        toc_label="Table of Contents",
        cover_kicker="A NOVEL",
        out_base="loop-chronicles-en",
        part_word="Part",
    ),
}

BOOK_CSS = """
@page { size: 6in 9in; }
:root{--fg:#221d18;--muted:#6b6255;--accent:#7a3b2e;--line:#ddd3c4}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{color:var(--fg);font-family:"Noto Serif KR","Apple SD Gothic Neo",Georgia,"Times New Roman",serif;
  line-height:1.55;font-size:10.3pt}
.cover{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;page-break-after:always}
.cover .kicker{letter-spacing:.25em;color:var(--accent);font-size:.85rem;margin-bottom:1.2rem}
.cover h1{font-size:2.6rem;margin:0 0 .6rem;letter-spacing:-.02em}
.cover .subtitle{color:var(--muted);font-size:1.05rem;margin-bottom:3rem}
.cover .author{font-size:1.1rem;color:var(--fg)}
.toc{page-break-after:always}
.toc h2{font-size:1.3rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);
  border-bottom:1px solid var(--line);padding-bottom:.6rem;margin-bottom:1.4rem}
.toc .part{font-weight:700;margin:1.4rem 0 .4rem;color:var(--accent)}
.toc .chap{margin:.35rem 0;color:var(--fg);font-size:.95rem}
.part-divider{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;page-break-before:always;page-break-after:always}
.part-divider .num{color:var(--accent);letter-spacing:.2em;font-size:.85rem;margin-bottom:.8rem}
.part-divider h2{font-size:2rem;margin:0}
article.chapter{page-break-before:always}
article.chapter h1{font-size:1.5rem;line-height:1.4;margin:0 0 1.6rem;letter-spacing:-.01em}
article.chapter p{margin:0 0 1.1rem}
article.chapter blockquote{margin:1.6rem 0;padding:.2rem 0 .2rem 1.1rem;
  border-left:3px solid var(--accent);color:var(--muted);font-style:italic;font-size:.95rem}
article.chapter hr{border:0;text-align:center;margin:2rem 0;color:var(--muted)}
article.chapter hr::before{content:"· · ·"}
article.chapter em{color:var(--accent);font-style:italic}
.colophon{page-break-before:always;padding-top:40vh;text-align:center;color:var(--muted);font-size:.85rem}
"""

PDF_PAGE = """<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><style>{css}</style></head>
<body>{body}</body></html>
"""

EPUB_CSS = """
body{font-family:serif;line-height:1.7;margin:1em}
h1{font-size:1.3em;line-height:1.4}
blockquote{margin:1.2em 0;padding-left:1em;border-left:3px solid #7a3b2e;color:#555;font-style:italic}
hr{border:0;text-align:center;margin:2em 0}
hr::before{content:"\\2022 \\2022 \\2022"}
em{font-style:italic}
"""


def load_chapters(cfg):
    files = sorted(
        f for f in os.listdir(cfg["src_dir"])
        if cfg["pattern"].match(f)
    )
    chapters = []
    for name in files:
        with open(os.path.join(cfg["src_dir"], name), encoding="utf-8") as fh:
            meta, body = mdlite.split_front_matter(fh.read())
        m = re.match(r"^\d+", name)
        num = int(m.group(0))
        first_h1 = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        title = meta.get("title") or (first_h1.group(1).strip() if first_h1 else name)
        series = meta.get("series", "")
        part = series.split("·")[0].strip() if "·" in series else ""
        part_title = series.split("·", 1)[1].strip() if "·" in series else ""
        chapters.append(dict(num=num, name=name, title=title, series=series,
                              part=part, part_title=part_title, body=body))
    return chapters


def build_pdf(cfg):
    chapters = load_chapters(cfg)

    cover = (
        '<section class="cover"><p class="kicker">%s</p>'
        '<h1>%s</h1><p class="subtitle">%s</p>'
        '<p class="author">%s</p></section>'
        % (html.escape(cfg["cover_kicker"]), html.escape(cfg["title"]),
           html.escape(cfg["subtitle"]), html.escape(cfg["author"]))
    )

    toc_items = []
    current_part = None
    for c in chapters:
        if c["part"] and c["part"] != current_part:
            toc_items.append('<div class="part">%s</div>' % html.escape(c["series"]))
            current_part = c["part"]
        toc_items.append('<div class="chap">%s</div>' % html.escape(c["title"]))
    toc = '<section class="toc"><h2>%s</h2>%s</section>' % (
        html.escape(cfg["toc_label"]), "".join(toc_items)
    )

    body_parts = [cover, toc]
    current_part = None
    for c in chapters:
        if c["part"] and c["part"] != current_part:
            body_parts.append(
                '<section class="part-divider"><p class="num">%s</p><h2>%s</h2></section>'
                % (html.escape(c["part"]), html.escape(c["part_title"]))
            )
            current_part = c["part"]
        chapter_html = mdlite.render(c["body"])
        body_parts.append('<article class="chapter">%s</article>' % chapter_html)

    body_parts.append(
        '<section class="colophon"><p>%s</p><p>%s</p></section>'
        % (html.escape(cfg["title"]), html.escape(cfg["author"]))
    )

    page = PDF_PAGE.format(lang=cfg["lang"], css=BOOK_CSS, body="\n".join(body_parts))
    html_path = os.path.join(OUT, cfg["out_base"] + ".html")
    with open(html_path, "w", encoding="utf-8") as fh:
        fh.write(page)

    pdf_path = os.path.join(OUT, cfg["out_base"] + ".pdf")
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
        )
        page_obj = browser.new_page()
        page_obj.goto("file://" + html_path)
        footer = (
            '<div style="width:100%;font-size:8.5px;color:#8a8072;'
            'font-family:Georgia,serif;text-align:center;padding-top:2px;">'
            '<span class="pageNumber"></span></div>'
        )
        page_obj.pdf(
            path=pdf_path, print_background=True,
            width="6in", height="9in",
            margin={"top": "0.75in", "bottom": "0.85in", "left": "0.7in", "right": "0.7in"},
            display_header_footer=True, header_template="<span></span>",
            footer_template=footer,
        )
        browser.close()
    print("PDF:", pdf_path, "(%d chapters)" % len(chapters))
    return chapters


def build_epub(cfg, chapters=None):
    import ebooklib
    from ebooklib import epub

    if chapters is None:
        chapters = load_chapters(cfg)

    book = epub.EpubBook()
    book.set_identifier("loop-chronicles-%s" % cfg["lang"])
    book.set_title(cfg["title"])
    book.set_language(cfg["lang"])
    book.add_author(cfg["author"])

    style = epub.EpubItem(uid="style", file_name="style/main.css",
                           media_type="text/css", content=EPUB_CSS)
    book.add_item(style)

    epub_chapters = []
    toc = []
    current_part = None
    part_section = []

    for c in chapters:
        if c["part"] and c["part"] != current_part:
            current_part = c["part"]
            if part_section:
                toc.append(part_section)
            part_section = [c["series"], []]

        file_name = "chap_%02d.xhtml" % c["num"]
        chapter_html = mdlite.render(c["body"])
        item = epub.EpubHtml(title=c["title"], file_name=file_name, lang=cfg["lang"])
        item.content = "<h1>%s</h1>\n%s" % (html.escape(c["title"]), chapter_html)
        item.add_item(style)
        book.add_item(item)
        epub_chapters.append(item)
        part_section[1].append(item)

    if part_section:
        toc.append(part_section)

    book.toc = tuple(
        (epub.Section(part_name), tuple(items)) for part_name, items in toc
    )
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())
    book.spine = ["nav"] + epub_chapters

    epub_path = os.path.join(OUT, cfg["out_base"] + ".epub")
    epub.write_epub(epub_path, book)
    print("EPUB:", epub_path, "(%d chapters)" % len(chapters))


def main():
    targets = sys.argv[1:] or ["both"]
    if "both" in targets:
        targets = ["ko", "en"]
    for t in targets:
        cfg = CONFIGS[t]
        chapters = build_pdf(cfg)
        build_epub(cfg, chapters)


if __name__ == "__main__":
    main()
