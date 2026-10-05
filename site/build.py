#!/usr/bin/env python3
"""사업관리 템플릿 사이트 빌더 (의존성 없음, Python 3.8+).

    python3 site/build.py            # 공개용 빌드 (status: draft 제외) -> site/public
    python3 site/build.py --drafts   # 초안 포함 미리보기

설정은 site/config.json, 글은 site/content/posts/*.md, 고정 페이지는
site/content/pages/*.md, 그대로 복사할 파일은 site/static/ 에 둔다.
"""

import html
import json
import os
import re
import shutil
import sys
from datetime import date
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "tools"))
import mdlite  # noqa: E402

OUT = os.path.join(HERE, "public")
CFG = json.load(open(os.path.join(HERE, "config.json"), encoding="utf-8"))
SITE_URL = CFG["url"].rstrip("/")
BASE = urlparse(SITE_URL).path.rstrip("/")
ESC = html.escape

CSS = """
:root{--bg:#fbfaf8;--fg:#1c1b19;--muted:#6b6862;--line:#e3dfd8;--accent:#1f5f8b;--card:#fff;--code:#f2efe9}
@media (prefers-color-scheme:dark){:root{--bg:#15171a;--fg:#e8e6e1;--muted:#9a9c9f;--line:#2b2e33;--accent:#7fb7e0;--card:#1b1e22;--code:#22262b}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);line-height:1.75;-webkit-text-size-adjust:100%;
 font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif}
a{color:var(--accent)}
.wrap{max-width:46rem;margin:0 auto;padding:0 1rem}
header.site{border-bottom:1px solid var(--line);padding:1.25rem 0}
header.site .brand{font-weight:700;font-size:1.15rem;letter-spacing:-.02em;color:var(--fg);text-decoration:none}
header.site nav{margin-top:.5rem;display:flex;gap:1.1rem;flex-wrap:wrap;font-size:.92rem}
header.site nav a{color:var(--muted);text-decoration:none}header.site nav a:hover{color:var(--accent)}
main{padding:2rem 0 3rem;min-height:55vh}
h1{font-size:1.65rem;line-height:1.35;letter-spacing:-.02em}
h2{font-size:1.28rem;margin-top:2.4rem;padding-top:.9rem;border-top:1px solid var(--line)}
h3{font-size:1.08rem;margin-top:1.8rem}
.meta{color:var(--muted);font-size:.85rem}
.hero p{color:var(--muted)}
.cats{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0 1.5rem}
.cats a{padding:.2rem .7rem;border:1px solid var(--line);border-radius:99px;font-size:.85rem;text-decoration:none;color:var(--fg)}
.card{display:block;padding:1rem 1.1rem;margin:.8rem 0;background:var(--card);border:1px solid var(--line);border-radius:10px;text-decoration:none;color:inherit}
.card:hover{border-color:var(--accent)}.card b{display:block;font-size:1.05rem}.card span{color:var(--muted);font-size:.88rem}
table{border-collapse:collapse;display:block;overflow-x:auto;margin:1rem 0;font-size:.9rem}
th,td{border:1px solid var(--line);padding:.45rem .7rem;text-align:left;vertical-align:top}th{background:var(--code)}
blockquote{margin:1rem 0;padding:.4rem 1rem;border-left:3px solid var(--accent);background:var(--code);color:var(--muted)}
code,pre{background:var(--code);border-radius:4px}code{padding:.1rem .3rem}pre{padding:1rem;overflow-x:auto}pre code{padding:0}
img{max-width:100%;height:auto}
footer.site{border-top:1px solid var(--line);padding:1.5rem 0 3rem;color:var(--muted);font-size:.85rem}
footer.site a{color:var(--muted);margin-right:1rem}
.empty{color:var(--muted);padding:2rem 0}
"""


def url(path):
    return f"{BASE}{path}"


def abs_url(path):
    return f"{SITE_URL}{path}"


def fill(text):
    for key in ("name", "author", "email", "url"):
        text = text.replace("{{" + key + "}}", str(CFG.get(key, "")))
    return text


def read_md(path):
    meta, body = mdlite.split_front_matter(open(path, encoding="utf-8").read())
    body = re.sub(r"\]\(/(?!/)", f"]({BASE}/", fill(body))  # 루트 상대 링크에 base path 부여
    return meta, body


def layout(title, desc, path, body, kind="website", extra_head=""):
    full_title = CFG["name"] if path == "/" else f"{title} | {CFG['name']}"
    head = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        f"<title>{ESC(full_title)}</title>",
        f'<meta name="description" content="{ESC(desc)}">',
        f'<link rel="canonical" href="{abs_url(path)}">',
        f'<meta property="og:title" content="{ESC(title)}">',
        f'<meta property="og:description" content="{ESC(desc)}">',
        f'<meta property="og:type" content="{kind}">',
        f'<meta property="og:url" content="{abs_url(path)}">',
        '<meta property="og:locale" content="ko_KR">',
        f"<style>{CSS}</style>",
    ]
    if CFG.get("adsense_client"):
        head.append(
            '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            f'?client={ESC(CFG["adsense_client"])}" crossorigin="anonymous"></script>'
        )
    if CFG.get("ga_id"):
        gid = ESC(CFG["ga_id"])
        head.append(f'<script async src="https://www.googletagmanager.com/gtag/js?id={gid}"></script>')
        head.append(f"<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}"
                    f"gtag('js',new Date());gtag('config','{gid}');</script>")
    head.append(extra_head)
    cats = "".join(f'<a href="{url("/category/" + s + "/")}">{ESC(n)}</a>' for s, n in CFG["categories"].items())
    return f"""<!doctype html>
<html lang="ko"><head>{''.join(head)}</head><body>
<header class="site"><div class="wrap">
<a class="brand" href="{url('/')}">{ESC(CFG['name'])}</a>
<nav><a href="{url('/')}">홈</a><a href="{url('/posts/')}">전체 글</a>{cats}<a href="{url('/about/')}">소개</a></nav>
</div></header>
<main><div class="wrap">{body}</div></main>
<footer class="site"><div class="wrap">
<a href="{url('/about/')}">소개</a><a href="{url('/privacy/')}">개인정보처리방침</a><a href="{url('/contact/')}">문의</a>
<p>© {date.today().year} {ESC(CFG['author'])} · {ESC(CFG['name'])}</p>
</div></footer></body></html>"""


def write(rel, content):
    path = os.path.join(OUT, rel.lstrip("/"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def card(p):
    cat = CFG["categories"].get(p["category"], "")
    return (f'<a class="card" href="{url(p["path"])}"><b>{ESC(p["title"])}</b>'
            f'<span>{ESC(p["date"])} · {ESC(cat)} — {ESC(p["description"])}</span></a>')


def load_posts(drafts):
    posts = []
    pdir = os.path.join(HERE, "content", "posts")
    for name in sorted(os.listdir(pdir)):
        if not name.endswith(".md"):
            continue
        meta, body = read_md(os.path.join(pdir, name))
        if meta.get("status", "draft") != "ready" and not drafts:
            continue
        m = re.match(r"(\d{4}-\d{2}-\d{2})-(.+)\.md$", name)
        slug = m.group(2) if m else name[:-3]
        posts.append({
            "title": meta.get("title", slug),
            "date": meta.get("date") or (m.group(1) if m else str(date.today())),
            "category": meta.get("category", ""),
            "description": meta.get("description", ""),
            "tags": meta.get("tags", []),
            "status": meta.get("status", "draft"),
            "path": f"/posts/{slug}/",
            "html": mdlite.render(body),
        })
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def main():
    drafts = "--drafts" in sys.argv
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    static = os.path.join(HERE, "static")
    if os.path.isdir(static):
        shutil.copytree(static, OUT, dirs_exist_ok=True)

    posts = load_posts(drafts)
    urls = ["/", "/posts/"]

    # 글
    for p in posts:
        ld = json.dumps({"@context": "https://schema.org", "@type": "Article", "headline": p["title"],
                         "datePublished": p["date"], "author": {"@type": "Person", "name": CFG["author"]},
                         "description": p["description"]}, ensure_ascii=False)
        badge = '<p class="meta">⚠ 초안 미리보기</p>' if p["status"] != "ready" else ""
        cat = CFG["categories"].get(p["category"], "")
        body = (f'<article><h1>{ESC(p["title"])}</h1>{badge}<p class="meta">{ESC(p["date"])} · {ESC(cat)} · {ESC(CFG["author"])}</p>'
                f'{p["html"]}</article>')
        write(p["path"] + "index.html", layout(p["title"], p["description"], p["path"], body, "article",
                                              f'<script type="application/ld+json">{ld}</script>'))
        if p["status"] == "ready":
            urls.append(p["path"])

    # 홈
    cats = "".join(f'<a href="{url("/category/" + s + "/")}">{ESC(n)}</a>' for s, n in CFG["categories"].items())
    latest = "".join(card(p) for p in posts[:10]) or '<p class="empty">첫 글을 준비 중입니다.</p>'
    write("index.html", layout(CFG["name"], CFG["description"], "/",
          f'<section class="hero"><h1>{ESC(CFG["tagline"])}</h1><p>{ESC(CFG["description"])}</p></section>'
          f'<div class="cats">{cats}</div><h2>최신 글</h2>{latest}'))

    # 전체 글 / 카테고리
    allp = "".join(card(p) for p in posts) or '<p class="empty">아직 글이 없습니다.</p>'
    write("posts/index.html", layout("전체 글", "전체 글 목록", "/posts/", f"<h1>전체 글</h1>{allp}"))
    for slug, name in CFG["categories"].items():
        items = "".join(card(p) for p in posts if p["category"] == slug) or '<p class="empty">준비 중입니다.</p>'
        path = f"/category/{slug}/"
        write(path + "index.html", layout(name, f"{name} 관련 글", path, f"<h1>{ESC(name)}</h1>{items}"))
        urls.append(path)

    # 고정 페이지
    pdir = os.path.join(HERE, "content", "pages")
    for name in sorted(os.listdir(pdir)):
        if name.endswith(".md"):
            meta, body = read_md(os.path.join(pdir, name))
            slug = name[:-3]
            path = f"/{slug}/"
            write(path + "index.html", layout(meta.get("title", slug), meta.get("description", CFG["description"]),
                  path, f'<h1>{ESC(meta.get("title", slug))}</h1>{mdlite.render(body)}'))
            urls.append(path)

    # 404 / sitemap / robots / ads.txt / CNAME
    write("404.html", layout("페이지를 찾을 수 없습니다", "404", "/404.html",
          f'<h1>페이지를 찾을 수 없습니다</h1><p><a href="{url("/")}">홈으로</a></p>'))
    sm = "".join(f"<url><loc>{abs_url(u)}</loc></url>" for u in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{sm}</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {abs_url('/sitemap.xml')}\n")
    if CFG.get("adsense_client"):
        pub = CFG["adsense_client"].replace("ca-", "")
        write("ads.txt", f"google.com, {pub}, DIRECT, f08c47fec0942fa0\n")
    if CFG.get("custom_domain"):
        write("CNAME", CFG["custom_domain"] + "\n")

    print(f"빌드 완료: 글 {len(posts)}편, 페이지 {len(urls)}개 -> {os.path.relpath(OUT)}"
          + (" (초안 포함)" if drafts else ""))


if __name__ == "__main__":
    main()
