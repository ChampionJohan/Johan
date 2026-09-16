#!/usr/bin/env python3
"""income-auto/*.md 를 인쇄·모바일에서 읽기 좋은 HTML 로 바꾼다.

    python3 income-auto/tools/md2html.py            # 전체 변환
    python3 income-auto/tools/md2html.py 01_크몽_따라하기.md

저장소의 tools/mdlite.py 를 그대로 쓴다. 의존성 없음. 결과는 income-auto/html/ 에 쌓인다.
mdlite 가 이미 `- [ ]` 를 체크박스로 만든다. 여기서는 disabled 만 걷어내
브라우저에서 눌러 볼 수 있게 한다. 표시 상태는 파일에 반영되지 않는다.
"""

import html as html_mod
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
INCOME = os.path.dirname(HERE)
ROOT = os.path.dirname(INCOME)
OUT_DIR = os.path.join(INCOME, "html")

sys.path.insert(0, os.path.join(ROOT, "tools"))
import mdlite  # noqa: E402

CSS = """
:root{--bg:#fbfaf8;--fg:#1c1b19;--muted:#6b6862;--line:#e3dfd8;--accent:#8a5a2b;
  --code:#f2efe9;--mark:#fff3d6}
@media (prefers-color-scheme:dark){:root{--bg:#16151a;--fg:#e8e5df;--muted:#9a958c;
  --line:#2e2c33;--accent:#d9a978;--code:#232228;--mark:#3a3320}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);line-height:1.75;
  font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",
  "Malgun Gothic",system-ui,sans-serif;-webkit-text-size-adjust:100%}
.wrap{max-width:46rem;margin:0 auto;padding:2.5rem 1.25rem 5rem}
h1{font-size:1.7rem;letter-spacing:-.02em;margin:0 0 .6rem;line-height:1.35}
h2{font-size:1.25rem;margin:3rem 0 .9rem;padding-top:1.4rem;border-top:1px solid var(--line)}
h3{font-size:1.02rem;margin:2rem 0 .6rem;color:var(--accent)}
p,li{font-size:.97rem}
a{color:var(--accent)}
code{background:var(--code);padding:.12em .38em;border-radius:4px;font-size:.88em}
pre{background:var(--code);padding:1rem 1.15rem;border-radius:8px;overflow-x:auto;
  font-size:.86rem;line-height:1.6}
pre code{background:none;padding:0}
blockquote{margin:1.4rem 0;padding:.2rem 0 .2rem 1.1rem;border-left:3px solid var(--accent);
  color:var(--muted)}
hr{border:0;border-top:1px solid var(--line);margin:2.5rem 0}
.tablebox{overflow-x:auto;margin:1.4rem 0}
table{border-collapse:collapse;width:100%;font-size:.9rem;min-width:22rem}
th,td{border:1px solid var(--line);padding:.5rem .7rem;text-align:left;vertical-align:top}
th{background:var(--code);font-weight:650;white-space:nowrap}
ul,ol{padding-left:1.35rem}
li{margin:.3rem 0}
ul.checklist{list-style:none;padding-left:0}
ul.checklist li{display:flex;gap:.6rem;align-items:flex-start}
ul.checklist input{margin-top:.42rem;width:1.05rem;height:1.05rem;flex:0 0 auto;
  accent-color:var(--accent);cursor:pointer}
ul.checklist li:has(input:checked){color:var(--muted);text-decoration:line-through}
ul.checklist li:not(:has(input)){padding-left:1.65rem;color:var(--muted);font-size:.9rem}
strong{font-weight:650}
.meta{color:var(--muted);font-size:.84rem;margin:0 0 2.5rem}
@media print{
  body{background:#fff;color:#000}
  .wrap{max-width:none;padding:0}
  h2{break-before:auto;page-break-inside:avoid}
  table,pre,blockquote{page-break-inside:avoid}
  a{color:#000;text-decoration:none}
}
"""

PAGE = """<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(title)s</title>
<style>%(css)s</style>
<div class="wrap">
%(body)s
</div>
"""

def _enable_checkboxes(body):
    """mdlite 가 disabled 로 내보낸 체크박스를 눌러 볼 수 있게 푼다."""
    return body.replace('<input type="checkbox" disabled', '<input type="checkbox"')


def convert(md_path):
    with open(md_path, encoding="utf-8") as f:
        text = f.read()
    meta, body_md = mdlite.split_front_matter(text)
    body = _enable_checkboxes(mdlite.render(body_md))
    body = body.replace("<table>", '<div class="tablebox"><table>').replace(
        "</table>", "</table></div>")

    title = meta.get("title") or os.path.basename(md_path).rsplit(".", 1)[0]
    page = PAGE % {"title": html_mod.escape(title), "css": CSS, "body": body}

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, os.path.basename(md_path).rsplit(".", 1)[0] + ".html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page)
    return out_path


def main(argv):
    if argv:
        targets = [a if os.path.isabs(a) else os.path.join(INCOME, a) for a in argv]
    else:
        targets = []
        for base in (INCOME, os.path.join(INCOME, "kmong")):
            for name in sorted(os.listdir(base)):
                if name.endswith(".md") and name != "README.md":
                    targets.append(os.path.join(base, name))

    for path in targets:
        if not os.path.exists(path):
            print("없는 파일: %s" % path, file=sys.stderr)
            return 1
        print("%s -> %s" % (os.path.relpath(path, ROOT), os.path.relpath(convert(path), ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
