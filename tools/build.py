#!/usr/bin/env python3
"""writing/posts/*.md 를 읽어 writing/site/ 아래 정적 사이트를 만든다.

    python3 tools/build.py

front matter 규칙은 writing/STYLE.md 참고. date 가 없는 글은 파일명 앞의
YYYY-MM-DD 를 날짜로 쓴다.
"""

import html
import os
import re
import sys
from datetime import date, datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "writing", "posts")
SITE_DIR = os.path.join(ROOT, "writing", "site")
SITE_TITLE = "Johan 작가노트"
SITE_DESC = "매일 한 편씩 쌓는 글. 브런치스토리·요즘IT 기고를 위한 원고 저장소."
SITE_URL = os.environ.get("SITE_URL", "")

CSS = """
:root{--bg:#fbfaf8;--fg:#1c1b19;--muted:#6b6862;--line:#e3dfd8;--accent:#8a5a2b;--card:#fff;--code:#f2efe9}
@media (prefers-color-scheme:dark){:root{--bg:#16151a;--fg:#e8e5df;--muted:#9a958c;--line:#2e2c33;--accent:#d9a978;--card:#1d1c22;--code:#232228}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
  font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;
  line-height:1.75;-webkit-text-size-adjust:100%}
.wrap{max-width:44rem;margin:0 auto;padding:0 1.25rem}
header.site{border-bottom:1px solid var(--line);padding:2.5rem 0 1.75rem;margin-bottom:2.5rem}
header.site h1{font-size:1.35rem;margin:0 0 .4rem;letter-spacing:-.02em}
header.site h1 a{color:inherit;text-decoration:none}
header.site p{margin:0;color:var(--muted);font-size:.9rem}
.stats{display:flex;gap:1.5rem;flex-wrap:wrap;margin-top:1.25rem;font-size:.82rem;color:var(--muted)}
.stats b{display:block;font-size:1.4rem;color:var(--accent);font-weight:650;line-height:1.2}
.series{margin:2.5rem 0 1rem;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);
  border-bottom:1px solid var(--line);padding-bottom:.5rem}
ul.posts{list-style:none;padding:0;margin:0}
ul.posts li{padding:1.1rem 0;border-bottom:1px solid var(--line)}
ul.posts a{color:inherit;text-decoration:none;font-size:1.05rem;font-weight:600;letter-spacing:-.01em}
ul.posts a:hover{color:var(--accent)}
ul.posts .sum{color:var(--muted);font-size:.9rem;margin:.35rem 0 0}
.meta{color:var(--muted);font-size:.78rem;margin-top:.4rem;display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.tag{background:var(--code);border-radius:2rem;padding:.1rem .55rem;font-size:.72rem}
.badge{border:1px solid var(--line);border-radius:2rem;padding:.1rem .55rem;font-size:.72rem}
.badge.draft{color:var(--accent);border-color:var(--accent)}
article h1{font-size:1.9rem;line-height:1.35;letter-spacing:-.025em;margin:0 0 .6rem}
article h2{font-size:1.3rem;margin:2.5rem 0 .75rem;letter-spacing:-.015em}
article h3{font-size:1.08rem;margin:2rem 0 .6rem}
article p{margin:0 0 1.15rem}
article ul,article ol{padding-left:1.3rem}
article li{margin:.35rem 0}
article blockquote{margin:1.5rem 0;padding:.2rem 0 .2rem 1.1rem;border-left:3px solid var(--accent);color:var(--muted)}
article img{max-width:100%;height:auto;border-radius:.4rem}
article a{color:var(--accent)}
code{background:var(--code);padding:.1rem .35rem;border-radius:.25rem;font-size:.88em;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
pre{background:var(--code);padding:1rem;border-radius:.5rem;overflow-x:auto}
pre code{background:none;padding:0;font-size:.85rem;line-height:1.6}
.table-wrap{overflow-x:auto;margin:1.5rem 0}
table{border-collapse:collapse;width:100%;font-size:.9rem}
th,td{border-bottom:1px solid var(--line);padding:.55rem .7rem;text-align:left}
th{font-weight:650}
hr{border:0;border-top:1px solid var(--line);margin:2.5rem 0}
ul.checklist{list-style:none;padding-left:.2rem}
ul.checklist li{margin:.5rem 0}
ul.checklist input{margin-right:.5rem;accent-color:var(--accent)}
footer.site{border-top:1px solid var(--line);margin:4rem 0 0;padding:1.75rem 0 3rem;
  color:var(--muted);font-size:.82rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
footer.site a{color:var(--muted)}
.back{display:inline-block;margin-bottom:2rem;color:var(--muted);text-decoration:none;font-size:.85rem}
.back:hover{color:var(--accent)}
"""

PAGE = """<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}">
<meta property="og:type" content="{ogtype}">
<style>{css}</style></head>
<body><div class="wrap">{body}
<footer class="site"><span>{footer_left}</span><span><a href="../feed.xml">RSS</a></span></footer>
</div></body></html>
"""


def esc(text):
    return html.escape(str(text), quote=True)


def slugify(text):
    text = re.sub(r"[^\w가-힣\s-]", "", str(text)).strip().lower()
    return re.sub(r"[\s_]+", "-", text)[:60] or "post"


def read_posts():
    posts = []
    if not os.path.isdir(POSTS_DIR):
        return posts
    for name in sorted(os.listdir(POSTS_DIR)):
        if not name.endswith(".md"):
            continue
        path = os.path.join(POSTS_DIR, name)
        with open(path, encoding="utf-8") as handle:
            meta, body = mdlite.split_front_matter(handle.read())
        stamp = re.match(r"(\d{4}-\d{2}-\d{2})", name)
        meta.setdefault("date", stamp.group(1) if stamp else date.today().isoformat())
        meta.setdefault("title", re.sub(r"^\d{4}-\d{2}-\d{2}-", "", name[:-3]))
        meta.setdefault("series", "낱글")
        meta.setdefault("status", "draft")
        meta.setdefault("target", "brunch")
        text = mdlite.to_plain(body)
        meta["chars"] = len(re.sub(r"\s", "", text))
        meta["minutes"] = max(1, round(len(text) / 500))
        if not meta.get("summary"):
            first = next((p for p in text.split("\n") if len(p.strip()) > 20), "")
            meta["summary"] = first.strip()[:110]
        meta["slug"] = "%s-%s" % (meta["date"], slugify(meta["title"]))
        meta["body"] = body
        meta["file"] = name
        posts.append(meta)
    posts.sort(key=lambda p: (p["date"], p["title"]), reverse=True)
    return posts


def streak(posts):
    """오늘(또는 어제)부터 거꾸로 며칠 연속으로 글이 있는지 센다."""
    days = {p["date"] for p in posts}
    today = date.today()
    cursor = today if today.isoformat() in days else today - timedelta(days=1)
    count = 0
    while cursor.isoformat() in days:
        count += 1
        cursor -= timedelta(days=1)
    return count


def render_index(posts):
    total_chars = sum(p["chars"] for p in posts)
    ready = sum(1 for p in posts if p["status"] != "draft")
    body = [
        '<header class="site"><h1><a href="index.html">%s</a></h1><p>%s</p>' % (esc(SITE_TITLE), esc(SITE_DESC)),
        '<div class="stats">'
        '<div><b>%d</b>편</div><div><b>%d</b>일 연속</div><div><b>%s</b>자</div><div><b>%d</b>편 발행 준비</div>'
        "</div></header>" % (len(posts), streak(posts), format(total_chars, ","), ready),
    ]
    seen = []
    for post in posts:
        if post["series"] not in seen:
            seen.append(post["series"])
    for series in seen:
        body.append('<h2 class="series">%s</h2><ul class="posts">' % esc(series))
        for post in [p for p in posts if p["series"] == series]:
            tags = "".join('<span class="tag">%s</span>' % esc(t) for t in post.get("tags", []))
            draft = '<span class="badge draft">초고</span>' if post["status"] == "draft" else ""
            body.append(
                '<li><a href="posts/%s.html">%s</a><p class="sum">%s</p>'
                '<p class="meta"><span>%s</span><span>%s자 · %d분</span>%s%s</p></li>'
                % (esc(post["slug"]), esc(post["title"]), esc(post["summary"]),
                   esc(post["date"]), format(post["chars"], ","), post["minutes"], draft, tags)
            )
        body.append("</ul>")
    if not posts:
        body.append("<p>아직 글이 없습니다. <code>python3 tools/new_post.py</code> 로 첫 글을 시작하세요.</p>")
    return PAGE.format(
        title=esc(SITE_TITLE), desc=esc(SITE_DESC), ogtype="website", css=CSS,
        body="\n".join(body), footer_left=esc("갱신 %s" % datetime.now().strftime("%Y-%m-%d %H:%M")),
    ).replace('href="../feed.xml"', 'href="feed.xml"')


def render_post(post):
    tags = "".join('<span class="tag">%s</span>' % esc(t) for t in post.get("tags", []))
    body = (
        '<a class="back" href="../index.html">← 목록</a>'
        "<article><h1>%s</h1>"
        '<p class="meta"><span>%s</span><span>%s</span><span>%s자 · %d분</span>%s</p>%s</article>'
        % (esc(post["title"]), esc(post["date"]), esc(post["series"]),
           format(post["chars"], ","), post["minutes"], tags, mdlite.render(post["body"]))
    )
    return PAGE.format(
        title=esc(post["title"]), desc=esc(post["summary"]), ogtype="article",
        css=CSS, body=body, footer_left=esc(SITE_TITLE),
    )


def render_feed(posts):
    items = []
    for post in posts[:20]:
        link = "%s/posts/%s.html" % (SITE_URL.rstrip("/"), post["slug"]) if SITE_URL else "posts/%s.html" % post["slug"]
        items.append(
            "<item><title>%s</title><link>%s</link><guid isPermaLink=\"false\">%s</guid>"
            "<pubDate>%s</pubDate><description>%s</description></item>"
            % (esc(post["title"]), esc(link), esc(post["slug"]),
               datetime.strptime(post["date"], "%Y-%m-%d").strftime("%a, %d %b %Y 09:00:00 +0900"),
               esc(post["summary"]))
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>'
        "<title>%s</title><link>%s</link><description>%s</description><language>ko</language>%s"
        "</channel></rss>" % (esc(SITE_TITLE), esc(SITE_URL), esc(SITE_DESC), "".join(items))
    )


def main():
    posts = read_posts()
    os.makedirs(os.path.join(SITE_DIR, "posts"), exist_ok=True)
    for post in posts:
        with open(os.path.join(SITE_DIR, "posts", post["slug"] + ".html"), "w", encoding="utf-8") as handle:
            handle.write(render_post(post))
    with open(os.path.join(SITE_DIR, "index.html"), "w", encoding="utf-8") as handle:
        handle.write(render_index(posts))
    with open(os.path.join(SITE_DIR, "feed.xml"), "w", encoding="utf-8") as handle:
        handle.write(render_feed(posts))
    print("빌드 완료: %d편 · %d일 연속 · %s" % (len(posts), streak(posts), SITE_DIR))


if __name__ == "__main__":
    main()
