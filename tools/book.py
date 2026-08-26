#!/usr/bin/env python3
"""원고를 책 한 권짜리 HTML 로 묶고, 진행 상황을 센다.

    python3 tools/book.py            # book/manuscript/*.md → book/site/index.html
    python3 tools/book.py --stat     # 장별 분량 · 남은 확인 항목 · 진행률
    python3 tools/book.py --plain    # 원고 전체를 평문 한 파일로 (투고용)

원고는 book/manuscript/NN-제목.md. 파일 이름 앞 번호가 곧 차례다.
front matter: title · part · order · status(draft|ready).

`<!-- 확인: … -->` 는 1차 자료로 검증해야 하는 숫자,
`<!-- TODO: … -->` 는 아직 안 쓴 부분이다. **둘 다 0 이 되어야 원고가 끝난다.**
"""

import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite
from build import ROOT

MANUSCRIPT = os.path.join(ROOT, "book", "manuscript")
SITE = os.path.join(ROOT, "book", "site")
TARGET = 95000  # 목표 분량. book/plan.md 4절과 맞춘다.

CHECK = re.compile(r"<!--\s*확인:(.*?)-->", re.S)
TODO = re.compile(r"<!--\s*TODO:(.*?)-->", re.S)
COMMENT = re.compile(r"<!--.*?-->", re.S)

PAGE = """<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<style>
:root{--paper:#FBFAF7;--ink:#1A1A1A;--muted:#6B6B66;--rule:#E0DED7;--accent:#8A2E2E}
@media (prefers-color-scheme:dark){:root{--paper:#141513;--ink:#E9E7E1;--muted:#96948C;--rule:#2C2E2A;--accent:#D98A6A}}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
 font-family:"Noto Serif KR","Nanum Myeongjo",Batang,serif;
 font-size:17px;line-height:1.95;word-break:keep-all}
.wrap{max-width:38em;margin:0 auto;padding:0 24px 120px}
header.book{padding:96px 0 40px;border-bottom:2px solid var(--ink);margin-bottom:56px}
header.book h1{font-size:2.6rem;line-height:1.2;margin:0 0 12px;letter-spacing:-.02em}
header.book p{margin:0;color:var(--muted);font-size:1rem}
nav.toc{margin:0 0 96px;padding:28px 0;border-bottom:1px solid var(--rule)}
nav.toc h2{font-size:.78rem;letter-spacing:.18em;color:var(--muted);
 font-family:system-ui,sans-serif;margin:0 0 18px;font-weight:600}
nav.toc ol{list-style:none;margin:0;padding:0}
nav.toc li{padding:5px 0;font-size:.95rem}
nav.toc .part{margin-top:18px;font-size:.72rem;letter-spacing:.16em;color:var(--muted);
 font-family:system-ui,sans-serif;font-weight:600}
nav.toc li:first-child .part{margin-top:0}
nav.toc a{color:var(--ink);text-decoration:none;border-bottom:1px solid transparent}
nav.toc a:hover,nav.toc a:focus{border-bottom-color:var(--accent)}
nav.toc .n{color:var(--muted);font-size:.82rem;margin-left:8px}
section.ch{margin-bottom:104px;scroll-margin-top:20px}
section.ch>h1{font-size:1.75rem;line-height:1.35;margin:0 0 8px;letter-spacing:-.01em}
section.ch>.part{font-family:system-ui,sans-serif;font-size:.72rem;letter-spacing:.16em;
 color:var(--muted);margin-bottom:40px;font-weight:600}
h2{font-size:1.18rem;margin:56px 0 18px;line-height:1.45}
h3{font-size:1rem;margin:36px 0 12px;color:var(--accent)}
p{margin:0 0 1.35em}
blockquote{margin:32px 0;padding:4px 0 4px 22px;border-left:3px solid var(--accent);
 font-size:1.08rem;color:var(--ink)}
blockquote p{margin:0}
ul,ol{margin:0 0 1.35em;padding-left:1.4em}
li{margin-bottom:.4em}
strong{font-weight:700}
table{border-collapse:collapse;width:100%%;margin:28px 0;font-size:.92rem;
 font-family:system-ui,sans-serif;line-height:1.6}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--rule);vertical-align:top}
thead th{border-bottom:1.5px solid var(--ink);font-size:.8rem;color:var(--muted);font-weight:600}
.tblwrap{overflow-x:auto}
.flag{background:#FFF3CD;color:#6B4E00;padding:1px 5px;font-size:.8rem;
 font-family:system-ui,sans-serif;border-radius:2px}
@media (prefers-color-scheme:dark){.flag{background:#3A2E10;color:#E8C97A}}
footer.book{border-top:1px solid var(--rule);padding-top:24px;color:var(--muted);
 font-size:.85rem;font-family:system-ui,sans-serif}
</style></head><body><div class="wrap">
<header class="book"><h1>%(booktitle)s</h1><p>%(subtitle)s</p></header>
%(toc)s
%(body)s
<footer class="book">%(stat)s</footer>
</div></body></html>
"""


def chapters():
    if not os.path.isdir(MANUSCRIPT):
        return []
    out = []
    for name in sorted(os.listdir(MANUSCRIPT)):
        if not name.endswith(".md"):
            continue
        with open(os.path.join(MANUSCRIPT, name), encoding="utf-8") as handle:
            raw = handle.read()
        meta, body = {}, raw
        if raw.startswith("---"):
            _, front, body = raw.split("---", 2)
            for line in front.strip().splitlines():
                if ":" in line:
                    key, value = line.split(":", 1)
                    meta[key.strip()] = value.strip()
        meta.setdefault("title", name)
        meta.setdefault("part", "")
        meta.setdefault("status", "draft")
        meta["file"] = name
        meta["slug"] = "ch" + re.sub(r"\D", "", name.split("-")[0] or "0")
        meta["body"] = body
        meta["checks"] = CHECK.findall(body)
        meta["todos"] = TODO.findall(body)
        meta["chars"] = len(re.sub(r"\s+", " ", COMMENT.sub("", body)))
        out.append(meta)
    return out


def stat(items):
    print("%-26s %8s %6s %6s  %s" % ("장", "분량", "확인", "TODO", "상태"))
    print("-" * 62)
    total = checks = todos = 0
    for item in items:
        total += item["chars"]
        checks += len(item["checks"])
        todos += len(item["todos"])
        print("%-26s %8s %6d %6d  %s" % (
            item["title"][:26], format(item["chars"], ","),
            len(item["checks"]), len(item["todos"]), item["status"]))
    print("-" * 62)
    print("%-26s %8s %6d %6d" % ("합계", format(total, ","), checks, todos))
    print("\n목표 %s자 대비 %.0f%%" % (format(TARGET, ","), 100.0 * total / TARGET))
    if checks or todos:
        print("확인 %d건, TODO %d건 남았습니다. 둘 다 0 이어야 발행할 수 있습니다." % (checks, todos))
    elif total >= TARGET:
        print("확인·TODO 없음. 원고가 끝났습니다.")
    else:
        print("확인·TODO 없음. 남은 일은 분량입니다.")
    return 0


def build(items):
    rows, sections = [], []
    seen = set()
    for item in items:
        part = item["part"]
        label = ('<span class="part">%s</span><br>' % html.escape(part)
                 if part and part not in seen else "")
        seen.add(part)
        rows.append('<li>%s<a href="#%s">%s</a><span class="n">%s자</span></li>' % (
            label, item["slug"], html.escape(item["title"]), format(item["chars"], ",")))

        # 확인이 필요한 숫자는 본문에 표시로 남겨 둔다. 교정할 때 눈에 띄어야 한다.
        body = CHECK.sub(lambda m: '<!--FLAG:%s-->' % m.group(1).strip(), item["body"])
        body = TODO.sub(lambda m: '<!--FLAG:TODO %s-->' % m.group(1).strip(), body)
        body = COMMENT.sub(lambda m: "", body)
        rendered = mdlite.render(body)
        for text in CHECK.findall(item["body"]) + ["TODO " + t for t in TODO.findall(item["body"])]:
            rendered += '<p><span class="flag">확인 필요 · %s</span></p>' % html.escape(text.strip())
        rendered = re.sub(r"<table>", '<div class="tblwrap"><table>', rendered)
        rendered = re.sub(r"</table>", "</table></div>", rendered)
        sections.append(
            '<section class="ch" id="%s"><h1>%s</h1><div class="part">%s</div>%s</section>'
            % (item["slug"], html.escape(item["title"]), html.escape(part), rendered))

    total = sum(i["chars"] for i in items)
    checks = sum(len(i["checks"]) for i in items)
    todos = sum(len(i["todos"]) for i in items)
    os.makedirs(SITE, exist_ok=True)
    page = PAGE % {
        "title": "돈이 흐르는 구조",
        "booktitle": "돈이 흐르는 구조",
        "subtitle": "세계의 비즈니스 모델을 다섯 칸으로 읽는 법",
        "toc": '<nav class="toc"><h2>차례</h2><ol>%s</ol></nav>' % "\n".join(rows),
        "body": "\n".join(sections),
        "stat": "%d꼭지 · %s자 · 확인 %d건 · TODO %d건" % (
            len(items), format(total, ","), checks, todos),
    }
    path = os.path.join(SITE, "index.html")
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(page)
    print("만들었습니다: %s  (%d꼭지 · %s자)" % (
        os.path.relpath(path, ROOT), len(items), format(total, ",")))
    return 0


def plain(items):
    os.makedirs(SITE, exist_ok=True)
    path = os.path.join(SITE, "원고전체.txt")
    with open(path, "w", encoding="utf-8") as handle:
        for item in items:
            handle.write("%s\n%s\n\n%s\n\n\n" % (
                item["title"], "=" * 40, mdlite.to_plain(COMMENT.sub("", item["body"])).strip()))
    print("만들었습니다: %s" % os.path.relpath(path, ROOT))
    return 0


def main():
    items = chapters()
    if not items:
        print("원고가 없습니다. book/manuscript/ 에 NN-제목.md 를 넣으세요.")
        return 1
    if "--stat" in sys.argv[1:]:
        return stat(items)
    if "--plain" in sys.argv[1:]:
        return plain(items)
    return build(items)


if __name__ == "__main__":
    raise SystemExit(main())
