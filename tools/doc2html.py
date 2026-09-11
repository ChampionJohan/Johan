#!/usr/bin/env python3
"""문서 한 편(md)을 지금까지 쓰던 문서용 HTML 틀에 실어 낸다."""
import io
import os
import re
import sys

sys.path.insert(0, "/home/user/Johan/tools")
import mdlite

HEAD = """<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%(title)s</title><style>
:root{--ink:#1a1a1a;--muted:#666;--rule:#e2e2e2;--accent:#E85D2F;--bg:#fdfdfc;--card:#fff}
@media (prefers-color-scheme:dark){:root{--ink:#e8e6e3;--muted:#9a9a9a;--rule:#333;--accent:#f0a080;--bg:#16181a;--card:#1d2022}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font-family:"Nanum Barun Gothic","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;
 line-height:1.75;font-size:16px}
.wrap{max-width:800px;margin:0 auto;padding:48px 24px 96px}
h1{font-size:1.9rem;line-height:1.3;margin:2.4em 0 .6em;padding-bottom:.3em;border-bottom:2px solid var(--accent)}
h1:first-of-type{margin-top:0}
h2{font-size:1.25rem;margin:2em 0 .5em;color:var(--accent)}
h3{font-size:1.05rem;margin:1.6em 0 .4em}
p{margin:.8em 0}
blockquote{margin:1.2em 0;padding:.8em 1.2em;border-left:3px solid var(--accent);
 background:var(--card);border-radius:0 6px 6px 0;color:var(--muted)}
blockquote strong{color:var(--ink)}
table{border-collapse:collapse;width:100%%;margin:1.2em 0;font-size:.94rem;display:block;overflow-x:auto}
th,td{border:1px solid var(--rule);padding:.5em .7em;text-align:left;vertical-align:top}
th{background:var(--card);font-weight:700}
pre{background:var(--card);border:1px solid var(--rule);border-radius:6px;
 padding:1em 1.2em;overflow-x:auto;font-size:.9rem;line-height:1.7;
 font-family:"Nanum Barun Gothic","Apple SD Gothic Neo",monospace;white-space:pre-wrap}
code{background:var(--card);padding:.1em .35em;border-radius:3px;font-size:.9em}
pre code{background:none;padding:0}
ul,ol{padding-left:1.3em} li{margin:.35em 0}
ul.checklist{list-style:none;padding-left:.2em}
ul.checklist input{margin-right:.5em}
hr{border:0;border-top:1px solid var(--rule);margin:2.5em 0}
.meta{color:var(--muted);font-size:.9rem;margin-bottom:2.5em}
</style></head><body><div class="wrap">
"""
TAIL = "\n</div></body></html>"


def convert(src, dst=None):
    text = io.open(src, encoding="utf-8").read()
    meta, body = mdlite.split_front_matter(text)
    body = mdlite.render(body)
    # `- [ ]` 목록을 체크박스로 바꾼다. mdlite 는 그냥 li 로 낸다.
    body = re.sub(r"<li>\[ \]\s*", '<li><input type="checkbox" disabled> ', body)
    body = body.replace(
        '<ul><li><input type="checkbox"',
        '<ul class="checklist"><li><input type="checkbox"')
    # 문서 안 링크는 .md 대신 .html 을 가리키게 한다.
    body = re.sub(r'(href="[^"]+)\.md"', r'\1.html"', body)
    out = HEAD % {"title": meta.get("title", os.path.basename(src))} + body + TAIL
    dst = dst or os.path.splitext(src)[0] + ".html"
    io.open(dst, "w", encoding="utf-8").write(out)
    return dst


if __name__ == "__main__":
    for path in sys.argv[1:]:
        print(convert(path))
