#!/usr/bin/env python3
"""writing/novel/<시리즈>/*.md 를 읽어 같은 폴더 site/ 에 HTML을 만든다.

    python3 tools/build_novel.py writing/novel/루프-연대기

기획안.md 는 기획안 페이지로, 나머지는 장(챕터)으로 취급해 파일명 앞
숫자(01장, 02장…) 순으로 정렬한다. front matter 는 선택 사항이다.
"""

import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite

CSS = """
:root{--bg:#faf7f2;--fg:#241f1a;--muted:#7a7167;--line:#e6ddd0;--accent:#7a3b2e;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#171412;--fg:#ece6dd;--muted:#a89d8e;--line:#332c25;--accent:#e0a98c;--card:#1e1a16}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
  font-family:Pretendard,-apple-system,"Apple SD Gothic Neo","Noto Serif KR",Georgia,serif;
  line-height:1.9;-webkit-text-size-adjust:100%}
.wrap{max-width:38rem;margin:0 auto;padding:0 1.25rem}
header.book{border-bottom:1px solid var(--line);padding:3rem 0 2rem;margin-bottom:2.5rem}
header.book .kicker{color:var(--accent);font-size:.8rem;letter-spacing:.12em;text-transform:uppercase}
header.book h1{font-size:1.7rem;margin:.5rem 0;letter-spacing:-.02em}
header.book h1 a{color:inherit;text-decoration:none}
header.book p{margin:0;color:var(--muted);font-size:.92rem}
ul.chapters{list-style:none;padding:0;margin:0}
ul.chapters li{padding:1rem 0;border-bottom:1px solid var(--line)}
ul.chapters a{color:inherit;text-decoration:none;font-size:1.05rem;font-weight:600}
ul.chapters a:hover{color:var(--accent)}
ul.chapters li.part{border-bottom:none;padding:2rem 0 .3rem;color:var(--accent);
  font-size:.78rem;letter-spacing:.1em;font-weight:650}
ul.chapters li.part:first-child{padding-top:.5rem}
article h1{font-size:1.6rem;line-height:1.4;margin:0 0 1.75rem;letter-spacing:-.02em}
article p{margin:0 0 1.3rem}
article blockquote{margin:1.8rem 0;padding:.3rem 0 .3rem 1.2rem;border-left:3px solid var(--accent);
  color:var(--muted);font-style:italic}
article hr{border:0;text-align:center;margin:2.5rem 0;color:var(--muted)}
article hr::before{content:"· · ·"}
article em{color:var(--accent)}
.back{display:inline-block;margin-bottom:2rem;color:var(--muted);text-decoration:none;font-size:.85rem}
.back:hover{color:var(--accent)}
footer.site{border-top:1px solid var(--line);margin:4rem 0 0;padding:1.75rem 0 3rem;
  color:var(--muted);font-size:.82rem}
"""

PAGE = """<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<style>{css}</style></head>
<body><div class="wrap">{body}
<footer class="site">{footer}</footer>
</div></body></html>
"""


def slugify(name):
    return re.sub(r"\.md$", "", name)


FRONT_MATTER_DOCS = ("기획안", "스토리라인", "인물과")


def order_key(filename):
    """기획안·스토리라인을 맨 앞에, 나머지는 파일명 앞 번호(01장, 02장…) 순으로."""
    for rank, name in enumerate(FRONT_MATTER_DOCS):
        if filename.startswith(name):
            return (rank - len(FRONT_MATTER_DOCS), filename)
    m = re.match(r"(\d+)", filename)
    return (int(m.group(1)) if m else 999, filename)


def load(path):
    with open(path, encoding="utf-8") as handle:
        meta, body = mdlite.split_front_matter(handle.read())
    return meta, body


def render_page(title, desc, body_html, footer):
    return PAGE.format(title=html.escape(title), desc=html.escape(desc), css=CSS, body=body_html, footer=footer)


def main():
    if len(sys.argv) != 2:
        print("사용법: python3 tools/build_novel.py writing/novel/<시리즈 폴더>")
        return 1
    src_dir = os.path.abspath(sys.argv[1])
    series_name = os.path.basename(src_dir.rstrip("/")).replace("-", " ")
    site_dir = os.path.join(src_dir, "site")
    os.makedirs(site_dir, exist_ok=True)

    files = sorted(
        (f for f in os.listdir(src_dir) if f.endswith(".md")),
        key=order_key,
    )
    if not files:
        print("md 파일이 없습니다: %s" % src_dir)
        return 1

    toc = []
    for name in files:
        meta, body = load(os.path.join(src_dir, name))
        first_h1 = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        title = meta.get("title") or (first_h1.group(1).strip() if first_h1 else slugify(name))
        slug = slugify(name)
        body_html = mdlite.render(body)
        page = render_page(
            title="%s · %s" % (title, series_name),
            desc=meta.get("series", series_name),
            body_html='<a class="back" href="index.html">← 목차</a><article>%s</article>' % body_html,
            footer=html.escape(series_name),
        )
        with open(os.path.join(site_dir, slug + ".html"), "w", encoding="utf-8") as handle:
            handle.write(page)
        toc.append((slug, title, meta.get("series", "")))

    # front matter 의 series 값이 바뀔 때마다 목차에 부(部) 제목을 끼워 넣는다.
    items = []
    current_part = None
    for slug, title, series in toc:
        part = series.split("·")[0].strip() if "·" in series else ""
        if part and part != current_part:
            items.append('<li class="part">%s</li>' % html.escape(series))
            current_part = part
        items.append('<li><a href="%s.html">%s</a></li>' % (html.escape(slug), html.escape(title)))
    items = "".join(items)
    index_body = (
        '<header class="book"><p class="kicker">갓피플 연재</p>'
        '<h1>%s</h1><p>다니엘 12장 4절에서 시작하는 판타지 연작</p></header>'
        '<ul class="chapters">%s</ul>' % (html.escape(series_name), items)
    )
    index_page = render_page(
        title=series_name, desc="다니엘 12장 4절에서 시작하는 판타지 연작",
        body_html=index_body, footer="갓피플 연재용 초고",
    )
    with open(os.path.join(site_dir, "index.html"), "w", encoding="utf-8") as handle:
        handle.write(index_page)

    print("빌드 완료: %d편 · %s" % (len(files), site_dir))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
