#!/usr/bin/env python3
"""원고를 전자책 한 권으로 묶는다.

    python3 tools/book.py             # book/site/index.html  (브라우저용 한 권)
    python3 tools/book.py --artifact  # book/site/artifact.html (아티팩트용 조각)
    python3 tools/book.py --md        # book/site/누가-돈을-내는가.md (번호가 매겨진 원고 한 파일)
    python3 tools/book.py --plain     # book/site/원고전체.txt (투고·편집용 평문)
    python3 tools/book.py --stat      # 장별 분량 · 남은 확인 항목 (독자용 출력이 아니다)

원고는 book/manuscript/NNN-제목.md. 파일 이름 앞 숫자가 곧 차례다.
front matter: title · part · kind(front|part|chapter|back) · status.

소제목 앞의 기호(◆)는 빌드할 때 자동으로 붙는다. 원고에 직접 쓰지 않는다.
분량과 확인 건수는 --stat 에만 나온다. 독자가 보는 책에는 넣지 않는다.
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
TITLE = "돈의 해부학"
SUBTITLE = "세계의 사업을 다섯 칸으로 뜯어보는 법"
SERIES = "다섯 칸 시리즈 · 첫째 권"
TARGET = 95000

CHECK = re.compile(r"<!--\s*확인:(.*?)-->", re.S)
TODO = re.compile(r"<!--\s*TODO:(.*?)-->", re.S)
COMMENT = re.compile(r"<!--.*?-->", re.S)
CHAPNO = re.compile(r"^(\d+)장")
H2 = re.compile(r"(?m)^##\s+(?!◆)(.+)$")


def load():
    items = []
    for name in sorted(os.listdir(MANUSCRIPT)):
        if not name.endswith(".md"):
            continue
        raw = open(os.path.join(MANUSCRIPT, name), encoding="utf-8").read()
        meta, body = {}, raw
        if raw.startswith("---"):
            _, front, body = raw.split("---", 2)
            for line in front.strip().splitlines():
                if ":" in line:
                    key, value = line.split(":", 1)
                    meta[key.strip()] = value.strip()
        meta.setdefault("title", name)
        meta.setdefault("part", "")
        meta.setdefault("kind", "chapter")
        meta.setdefault("status", "draft")
        match = CHAPNO.match(meta["title"])
        meta["no"] = match.group(1) if match else ""
        meta["slug"] = "s" + name.split("-")[0]
        meta["body"] = body
        meta["checks"] = CHECK.findall(body)
        meta["todos"] = TODO.findall(body)
        meta["chars"] = len(re.sub(r"\s+", " ", COMMENT.sub("", body)))
        items.append(meta)
    return items


MARK = "◆"


def numbered(body, chapter_no):
    """`## 소제목` 앞에 기호를 붙인다. 번호 대신 표시만 둔다."""
    return H2.sub(lambda m: "## %s %s" % (MARK, m.group(1).strip()), body)


def clean_body(item, keep_flags=True):
    body = numbered(item["body"], item["no"])
    flags = [t.strip() for t in item["checks"]] + ["TODO — " + t.strip() for t in item["todos"]]
    body = COMMENT.sub("", body)
    return body, (flags if keep_flags else [])


# ------------------------------------------------------------------ HTML

HEAD_FULL = """<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap">
"""

HEAD_FRAGMENT = """<title>%(title)s</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap">
"""

STYLE = """
<style>
:root{
 --paper:#FBFAF7;--ink:#1A1A1A;--muted:#6E6C64;--rule:#DFDCD3;--hair:#EDEAE2;
 --accent:#8A2E2E;--flagbg:#FBF0D2;--flagink:#6B4E00;
 --serif:"Noto Serif KR","Nanum Myeongjo",Batang,serif;
 --sans:"IBM Plex Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
 --paper:#14150F;--ink:#EAE7DE;--muted:#9A968B;--rule:#2E3029;--hair:#232520;
 --accent:#D9906A;--flagbg:#332A12;--flagink:#E8C97A}}
:root[data-theme="dark"]{
 --paper:#14150F;--ink:#EAE7DE;--muted:#9A968B;--rule:#2E3029;--hair:#232520;
 --accent:#D9906A;--flagbg:#332A12;--flagink:#E8C97A}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--serif);
 font-size:17px;line-height:1.95;word-break:keep-all;-webkit-font-smoothing:antialiased}
.wrap{max-width:37em;margin:0 auto;padding:0 24px 140px}
.eyebrow{font-family:var(--sans);font-size:.7rem;font-weight:600;letter-spacing:.18em;
 color:var(--muted);text-transform:none}

/* 표제지 */
.titlepage{padding:120px 0 80px;border-bottom:1px solid var(--rule);margin-bottom:72px;text-align:center}
.titlepage .series{font-family:var(--sans);font-size:.74rem;letter-spacing:.2em;color:var(--muted);margin-bottom:36px}
.titlepage h1{font-size:clamp(2.6rem,9vw,4rem);line-height:1.12;margin:0 0 20px;letter-spacing:-.03em;font-weight:700}
.titlepage p{margin:0;color:var(--muted);font-size:1.02rem}
.titlepage .rule{width:56px;height:2px;background:var(--accent);margin:36px auto 0}

/* 차례 */
nav.toc{margin:0 0 96px}
nav.toc h2{font-family:var(--sans);font-size:.74rem;letter-spacing:.2em;color:var(--muted);
 margin:0 0 24px;font-weight:600;padding-bottom:12px;border-bottom:1px solid var(--rule)}
nav.toc ul{list-style:none;margin:0;padding:0}
nav.toc .grp{font-family:var(--sans);font-size:.72rem;letter-spacing:.16em;color:var(--accent);
 font-weight:600;margin:28px 0 10px}
nav.toc li{padding:4px 0;font-size:.96rem;display:flex;gap:12px;align-items:baseline}
nav.toc .no{font-family:var(--sans);font-size:.78rem;color:var(--muted);
 min-width:2.6em;font-variant-numeric:tabular-nums}
nav.toc a{color:var(--ink);text-decoration:none;border-bottom:1px solid transparent}
nav.toc a:hover,nav.toc a:focus{border-bottom-color:var(--accent);outline:none}

/* 부 표제지 */
section.part{margin:0 0 96px;padding:88px 0;border-top:2px solid var(--ink);
 border-bottom:1px solid var(--rule);scroll-margin-top:16px}
section.part h1{font-size:2.1rem;margin:0 0 40px;letter-spacing:-.02em;line-height:1.3}

/* 장 */
section.ch{margin-bottom:112px;scroll-margin-top:16px}
section.ch>.eyebrow{display:block;margin-bottom:14px}
section.ch>h1{font-size:1.72rem;line-height:1.4;margin:0 0 44px;letter-spacing:-.01em;
 padding-bottom:22px;border-bottom:1px solid var(--rule)}
section.front>h1{font-size:1.5rem;line-height:1.45;margin:0 0 40px;padding-bottom:20px;
 border-bottom:1px solid var(--rule)}

h2{font-size:1.14rem;margin:56px 0 18px;line-height:1.5;font-weight:600}
h3{font-size:1rem;margin:38px 0 12px;color:var(--accent);font-weight:600}
p{margin:0 0 1.35em}
blockquote{margin:34px 0;padding:6px 0 6px 22px;border-left:3px solid var(--accent);font-size:1.06rem}
blockquote p{margin:0 0 .5em}
blockquote p:last-child{margin:0}
ul,ol{margin:0 0 1.35em;padding-left:1.4em}
li{margin-bottom:.45em}
hr{border:0;border-top:1px solid var(--rule);margin:40px 0}
table{border-collapse:collapse;width:100%%;margin:30px 0;font-size:.9rem;
 font-family:var(--sans);line-height:1.65}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--hair);vertical-align:top}
thead th{border-bottom:1.5px solid var(--ink);font-size:.78rem;color:var(--muted);font-weight:600}
tbody tr:last-child td{border-bottom:0}
.tblwrap{overflow-x:auto}
.flag{display:inline-block;background:var(--flagbg);color:var(--flagink);padding:2px 8px;
 font-size:.78rem;font-family:var(--sans);border-radius:2px;line-height:1.6}
.flags{margin:24px 0;padding:16px 18px;background:var(--hair);border-left:3px solid var(--accent)}
.flags .eyebrow{display:block;margin-bottom:10px}
.flags p{margin:0 0 6px;font-size:.86rem;font-family:var(--sans);line-height:1.7}
footer.book{border-top:1px solid var(--rule);padding-top:28px;color:var(--muted);
 font-size:.84rem;font-family:var(--sans);text-align:center}
@media print{.flags{display:none}}
</style>
"""

BODY = """<div class="wrap">
%(title)s
%(toc)s
%(body)s
<footer class="book">%(footer)s</footer>
</div>
"""


def render_html(items, fragment=False):
    groups, rows = [], []
    last = None
    for item in items:
        if item["kind"] == "part":
            rows.append('<li class="grp">%s</li>' % html.escape(item["title"]))
            last = item["part"]
            continue
        if item["kind"] in ("front", "back") and item["part"] != last:
            rows.append('<li class="grp">%s</li>' % html.escape(item["part"]))
            last = item["part"]
        if item["kind"] == "front" and item["order"] == "0":
            continue
        no = (item["no"] + "장") if item["no"] else "—"
        label = item["title"].split(" · ", 1)[-1] if item["no"] else item["title"]
        rows.append('<li><span class="no">%s</span><a href="#%s">%s</a></li>'
                    % (html.escape(no), item["slug"], html.escape(label)))

    sections = []
    for item in items:
        if item["kind"] == "front" and item.get("order") == "0":
            continue  # 표제지는 따로 그린다
        body, flags = clean_body(item)
        rendered = mdlite.render(body)
        rendered = rendered.replace("<table>", '<div class="tblwrap"><table>')
        rendered = rendered.replace("</table>", "</table></div>")
        if flags:
            rendered += ('<div class="flags"><span class="eyebrow">교정 표시 — 발행 전 확인</span>%s</div>'
                         % "".join('<p><span class="flag">%s</span></p>' % html.escape(f) for f in flags))
        if item["kind"] == "part":
            sections.append('<section class="part" id="%s"><h1>%s</h1>%s</section>'
                            % (item["slug"], html.escape(item["title"]), rendered))
        else:
            cls = "front" if item["kind"] in ("front", "back") else "ch"
            eyebrow = ('<span class="eyebrow">%s</span>' % html.escape(item["part"])
                       if item["kind"] == "chapter" else "")
            sections.append('<section class="%s" id="%s">%s<h1>%s</h1>%s</section>'
                            % (cls, item["slug"], eyebrow, html.escape(item["title"]), rendered))

    fields = {
        "title": ('<header class="titlepage"><p class="series">%s</p><h1>%s</h1>'
                  '<p>%s</p><div class="rule"></div></header>'
                  % (html.escape(SERIES), html.escape(TITLE), html.escape(SUBTITLE))),
        "toc": '<nav class="toc"><h2>차례</h2><ul>%s</ul></nav>' % "\n".join(rows),
        "body": "\n".join(sections),
        "footer": "%s · %s" % (html.escape(TITLE), html.escape(SERIES)),
    }
    head = (HEAD_FRAGMENT if fragment else HEAD_FULL) % {"title": TITLE}
    page = head + STYLE + (BODY % fields)
    if not fragment:
        page = page.replace('<div class="wrap">', '</head><body><div class="wrap">', 1) + "</body></html>"

    os.makedirs(SITE, exist_ok=True)
    path = os.path.join(SITE, "artifact.html" if fragment else "index.html")
    open(path, "w", encoding="utf-8").write(page)
    print("만들었습니다: %s  (%d꼭지)" % (os.path.relpath(path, ROOT), len(items)))
    return 0


def render_md(items):
    out = ["# %s\n" % TITLE, "**%s**\n" % SUBTITLE, "*%s*\n" % SERIES, "\n---\n"]
    for item in items:
        if item["kind"] == "front" and item.get("order") == "0":
            continue
        body, flags = clean_body(item)
        out.append("\n\n# %s\n" % item["title"])
        out.append(re.sub(r"(?m)^(#+) ", lambda m: "#" + m.group(1) + " ", body).strip())
        for flag in flags:
            out.append("\n> **교정 표시** — %s" % flag)
    os.makedirs(SITE, exist_ok=True)
    path = os.path.join(SITE, "돈의-해부학.md")
    open(path, "w", encoding="utf-8").write("\n".join(out) + "\n")
    print("만들었습니다: %s" % os.path.relpath(path, ROOT))
    return 0


def render_plain(items):
    os.makedirs(SITE, exist_ok=True)
    path = os.path.join(SITE, "원고전체.txt")
    with open(path, "w", encoding="utf-8") as handle:
        handle.write("%s\n%s\n%s\n\n\n" % (TITLE, SUBTITLE, SERIES))
        for item in items:
            if item["kind"] == "front" and item.get("order") == "0":
                continue
            body, _ = clean_body(item, keep_flags=False)
            handle.write("%s\n%s\n\n%s\n\n\n" % (
                item["title"], "=" * 40, mdlite.to_plain(body).strip()))
    print("만들었습니다: %s" % os.path.relpath(path, ROOT))
    return 0


def stat(items):
    print("%-40s %8s %5s %5s" % ("꼭지", "분량", "확인", "TODO"))
    print("-" * 62)
    total = checks = todos = 0
    for item in items:
        total += item["chars"]
        checks += len(item["checks"])
        todos += len(item["todos"])
        print("%-40s %8s %5d %5d" % (item["title"][:40], format(item["chars"], ","),
                                     len(item["checks"]), len(item["todos"])))
    print("-" * 62)
    print("%-40s %8s %5d %5d" % ("합계", format(total, ","), checks, todos))
    print("\n목표 %s자 대비 %.0f%%" % (format(TARGET, ","), 100.0 * total / TARGET))
    print("확인 %d건, TODO %d건. 둘 다 0 이어야 발행할 수 있습니다." % (checks, todos)
          if (checks or todos) else "확인·TODO 없음.")
    return 0


def main():
    items = load()
    if not items:
        print("원고가 없습니다. book/manuscript/ 에 NNN-제목.md 를 넣으세요.")
        return 1
    args = sys.argv[1:]
    if "--stat" in args:
        return stat(items)
    if "--md" in args:
        return render_md(items)
    if "--plain" in args:
        return render_plain(items)
    return render_html(items, fragment="--artifact" in args)


if __name__ == "__main__":
    raise SystemExit(main())
