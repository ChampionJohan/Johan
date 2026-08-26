#!/usr/bin/env python3
"""원고를 전자책 표준 형식(EPUB3)으로 묶는다. 부크크·리디·유페이퍼 등
자가출간 플랫폼에 그대로 업로드할 수 있는 .epub 파일 하나를 만든다.

    python3 tools/epub.py book         # book/site/<제목>.epub  (성인판)
    python3 tools/epub.py book-teen    # book-teen/site/<제목>.epub (청소년판)

전자책에는 페이지 번호를 넣지 않는다. 글자 크기에 따라 화면이 다시 짜이는
리플로우 방식이라 고정된 쪽 개념이 없고, 넣으면 오히려 틀린 값이 된다
(book/STYLE.md 5절). 대신 목차(EPUB nav)가 반드시 있어야 하고, 이 도구가
그것까지 만든다.

의존성 없음 — 표준 라이브러리만 쓴다. 표지 이미지는 Pillow가 설치돼
있으면 자동으로 하나 만들고, 없으면 건너뛴다(부크크 등은 어차피 업로드
화면에서 표지를 따로 받으므로 없어도 등록엔 지장이 없다).
"""

import html
import importlib
import os
import re
import sys
import uuid
import zipfile
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite

VOID = re.compile(r"<(br|hr|img|input|meta|source|wbr)([^<>]*?)\s*/?>")


def load_module(which):
    """book_teen.py 는 book.py 의 전역(TITLE·MANUSCRIPT·MARK …)을 제자리에서
    덮어쓰는 방식이라, 청소년판일 때도 실제로 쓰는 모듈은 항상 book 이다."""
    which = which.rstrip("/")
    import book as m
    if which in ("book", "adult"):
        pass
    elif which in ("book-teen", "teen"):
        importlib.import_module("book_teen")
    else:
        raise SystemExit("첫 인자는 book 또는 book-teen 이어야 합니다.")
    return m


def to_xhtml(fragment):
    """mdlite 가 만든 HTML 조각을 XHTML(자기 닫는 태그)로 바꾼다."""
    def close(m):
        tag, attrs = m.group(1), m.group(2).strip()
        return "<%s%s/>" % (tag, " " + attrs if attrs else "")
    return VOID.sub(close, fragment)


PAGE = """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ko" lang="ko">
<head>
<meta charset="utf-8"/>
<title>%(title)s</title>
<link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
<section epub:type="%(kind)s">
%(h1)s%(body)s
</section>
</body>
</html>
"""

CSS = """
@charset "utf-8";
@namespace epub "http://www.idpf.org/2007/ops";
body{font-family:"Noto Serif KR","Nanum Myeongjo",serif;line-height:1.85;margin:0;padding:0 1.2em}
h1{font-size:1.4em;line-height:1.4;margin:2.2em 0 1.2em;border-bottom:1px solid #999;padding-bottom:.5em}
h2{font-size:1.12em;margin:2em 0 .7em}
h3{font-size:1em;margin:1.6em 0 .5em}
p{margin:0 0 1.1em;text-indent:0}
blockquote{margin:1.4em 1.2em;padding:.2em 0 .2em .9em;border-left:3px solid #999}
ul,ol{margin:0 0 1.1em;padding-left:1.3em}
li{margin-bottom:.4em}
table{border-collapse:collapse;width:100%%;margin:1.3em 0;font-size:.92em}
th,td{border-bottom:1px solid #ccc;padding:.45em .6em;text-align:left;vertical-align:top}
thead th{border-bottom:1.5px solid #333}
.flag{display:inline-block;background:#FBF0D2;color:#6B4E00;padding:.1em .4em;font-size:.85em}
.titlepage{text-align:center;margin-top:20%%}
.titlepage .series{font-size:.8em;color:#666;letter-spacing:.1em}
.titlepage h1{border:none;font-size:1.9em}
.titlepage .sub{color:#555}
nav#toc ol{list-style:none;padding-left:0}
nav#toc li{margin:.35em 0}
nav#toc .part{font-weight:bold;margin-top:1em}
"""

CONTAINER = """<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
"""

OPF = """<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="ko">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:%(uuid)s</dc:identifier>
    <dc:title>%(title)s</dc:title>
    <dc:creator>%(author)s</dc:creator>
    <dc:language>ko</dc:language>
    <dc:date>%(date)s</dc:date>
    <meta property="dcterms:modified">%(modified)s</meta>%(cover_meta)s
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="css/style.css" media-type="text/css"/>
%(manifest)s%(cover_item)s
  </manifest>
  <spine>
%(spine)s
  </spine>
</package>
"""

NAV = """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ko" lang="ko">
<head><meta charset="utf-8"/><title>차례</title><link rel="stylesheet" type="text/css" href="css/style.css"/></head>
<body>
<nav epub:type="toc" id="toc"><h1>차례</h1><ol>
%(rows)s
</ol></nav>
</body>
</html>
"""

NCX = """<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:%(uuid)s"/>
  </head>
  <docTitle><text>%(title)s</text></docTitle>
  <navMap>
%(points)s
  </navMap>
</ncx>
"""


def kind_of(item):
    return {"front": "frontmatter", "part": "bodymatter", "chapter": "bodymatter", "back": "backmatter"}.get(
        item["kind"], "bodymatter")


def make_cover(out_dir, title, subtitle, accent):
    """Pillow 가 있으면 간단한 표지를, 없으면 건너뛴다. 없어도 등록엔 지장 없다."""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return None
    w, h = 1600, 2400
    img = Image.new("RGB", (w, h), "#FBFAF7")
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 28, h], fill=accent)

    def font(size, bold=True):
        for path in (
            "/usr/share/fonts/truetype/nanum/NanumMyeongjoBold.ttf",
            "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc",
            "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
            "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
        ):
            if os.path.exists(path):
                try:
                    return ImageFont.truetype(path, size)
                except OSError:
                    continue
        return ImageFont.load_default()

    def wrap(text, fnt, limit):
        lines, line = [], ""
        for ch in text:
            trial = line + ch
            if draw.textlength(trial, font=fnt) > limit and line:
                lines.append(line)
                line = ch
            else:
                line = trial
        if line:
            lines.append(line)
        return lines

    title_font = font(112)
    sub_font = font(48)
    lines = wrap(title, title_font, w - 240)
    y = h * 0.34
    for line in lines:
        draw.text((120, y), line, font=title_font, fill="#1A1A1A")
        y += 132
    y += 40
    for line in wrap(subtitle, sub_font, w - 240):
        draw.text((120, y), line, font=sub_font, fill="#6E6C64")
        y += 66

    path = os.path.join(out_dir, "cover.jpg")
    img.convert("RGB").save(path, quality=90)
    return path


def build(which):
    m = load_module(which)
    items = m.load()
    if not items:
        print("원고가 없습니다.")
        return 1

    author = getattr(m, "AUTHOR", "저자명")
    accent = "#8A2E2E" if which in ("book", "adult") else "#E85D2F"
    out_dir = m.SITE
    os.makedirs(out_dir, exist_ok=True)

    manifest_lines, spine_lines, xhtml_files, ncx_points = [], [], {}, []
    groups = []  # [(그룹 이름, ['<li>...</li>', ...]), ...] — nav.xhtml 중첩 목록용
    play_order = 1
    last_group = None

    for index, item in enumerate(items):
        if item["kind"] == "front" and item.get("order") == "0":
            fid = "cover"
            body = ('<div class="titlepage"><p class="series">%s</p><h1>%s</h1>'
                    '<p class="sub">%s</p></div>' % (
                        html.escape(m.SERIES), html.escape(m.TITLE), html.escape(m.SUBTITLE)))
            h1 = ""
            title_txt = m.TITLE
        else:
            fid = item["slug"]
            body_src, flags = m.clean_body(item)
            rendered = mdlite.render(body_src)
            rendered = rendered.replace("<table>", '<div class="table-wrap"><table>').replace(
                "</table>", "</table></div>")
            for flag in flags:
                rendered += '<p><span class="flag">%s</span></p>' % html.escape(flag)
            body = to_xhtml(rendered)
            h1 = "<h1>%s</h1>" % html.escape(item["title"])
            title_txt = item["title"]

        xhtml_files[fid] = PAGE % {
            "title": html.escape(title_txt), "kind": kind_of(item), "h1": h1, "body": body}
        manifest_lines.append(
            '    <item id="%s" href="text/%s.xhtml" media-type="application/xhtml+xml"/>' % (fid, fid))
        spine_lines.append('    <itemref idref="%s"/>' % fid)

        group = item["part"]
        if item["kind"] == "part" or (item["kind"] in ("front", "back") and group != last_group):
            groups.append((group, []))
            last_group = group
        if not (item["kind"] == "front" and item.get("order") == "0"):
            label = item["title"]
            if not groups:
                groups.append((group, []))
            groups[-1][1].append('<li><a href="text/%s.xhtml">%s</a></li>' % (fid, html.escape(label)))
            ncx_points.append(
                '    <navPoint id="np%d" playOrder="%d"><navLabel><text>%s</text></navLabel>'
                '<content src="text/%s.xhtml"/></navPoint>' % (play_order, play_order, html.escape(label), fid))
            play_order += 1

    cover_path = make_cover(out_dir, m.TITLE, m.SUBTITLE, accent)
    cover_meta = '\n    <meta name="cover" content="cover-image"/>' if cover_path else ""
    cover_item = ('\n    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>'
                  if cover_path else "")

    book_uuid = str(uuid.uuid4())
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    opf = OPF % {
        "uuid": book_uuid, "title": html.escape(m.TITLE), "author": html.escape(author),
        "date": datetime.now().strftime("%Y-%m-%d"), "modified": now,
        "cover_meta": cover_meta, "cover_item": cover_item,
        "manifest": "\n".join(manifest_lines) + "\n",
        "spine": "\n".join(spine_lines),
    }
    nav_parts = []
    for group_label, entries in groups:
        if not entries:
            continue
        nav_parts.append(
            '<li><span class="part">%s</span><ol>\n%s\n</ol></li>'
            % (html.escape(group_label), "\n".join(entries)))
    nav_html = NAV % {"rows": "\n".join(nav_parts)}
    ncx = NCX % {"uuid": book_uuid, "title": html.escape(m.TITLE), "points": "\n".join(ncx_points)}

    path = os.path.join(out_dir, "%s.epub" % m.TITLE.replace("/", "-"))
    with zipfile.ZipFile(path, "w") as zf:
        zf.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        zf.writestr("META-INF/container.xml", CONTAINER)
        zf.writestr("OEBPS/content.opf", opf)
        zf.writestr("OEBPS/nav.xhtml", nav_html)
        zf.writestr("OEBPS/toc.ncx", ncx)
        zf.writestr("OEBPS/css/style.css", CSS)
        for fid, xhtml in xhtml_files.items():
            zf.writestr("OEBPS/text/%s.xhtml" % fid, xhtml)
        if cover_path:
            zf.write(cover_path, "OEBPS/images/cover.jpg")

    print("만들었습니다: %s  (%d꼭지%s)" % (
        os.path.relpath(path, m.ROOT), len(items), ", 표지 포함" if cover_path else ", 표지 없음(선택 사항)"))
    if not cover_path:
        print("  Pillow 가 없어 표지를 안 만들었습니다. 자가출간 사이트는 대개 업로드 화면에서")
        print("  표지를 따로 받으므로 없어도 등록엔 지장이 없습니다.")
    return 0


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    return build(sys.argv[1])


if __name__ == "__main__":
    raise SystemExit(main())
