#!/usr/bin/env python3
"""하루를 돌아보는 일기를 쓰고, 읽기 좋은 HTML 로 만든다.

    python3 tools/diary.py new           # 오늘자 일기 뼈대 생성
    python3 tools/diary.py new 2026-09-22
    python3 tools/diary.py build         # writing/diary/*.md -> writing/diary/html/

원고(writing/posts)와 달리 일기는 사이트 빌드·RSS 대상이 아니다.
매체에 낼 글이 아니라 기록이므로 TODO 규칙도 적용하지 않는다.
"""

import os
import re
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite
from build import CSS, PAGE, ROOT, esc

DIARY_DIR = os.path.join(ROOT, "writing", "diary")
HTML_DIR = os.path.join(DIARY_DIR, "html")
WEEKDAYS = ("월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "주일")
ENTRY_NAME = re.compile(r"^\d{4}-\d{2}-\d{2}\.md$")  # README 등 일기가 아닌 파일은 건너뛴다

TEMPLATE = """---
title: {day} 기록
date: {day}
weekday: {weekday}
place: 쿠알라룸푸르, 말레이시아
tags: [일기]
summary:
---

## 오늘 있었던 일

## 오늘 만난 사람

## 오늘 배운 것 하나

## 기도

-
"""


def entries():
    """날짜 내림차순으로 (날짜, 메타, 본문, 슬러그) 목록을 돌려준다."""
    found = []
    for name in sorted(os.listdir(DIARY_DIR), reverse=True):
        if not ENTRY_NAME.match(name):
            continue
        path = os.path.join(DIARY_DIR, name)
        with open(path, encoding="utf-8") as handle:
            meta, body = mdlite.split_front_matter(handle.read())
        slug = name[:-3]
        found.append((meta.get("date", slug), meta, body, slug))
    return found


def render_entry(day, meta, body):
    head = " · ".join(x for x in (day, meta.get("weekday", ""), meta.get("place", "")) if x)
    tags = "".join('<span class="tag">%s</span>' % esc(t) for t in meta.get("tags", []))
    article = (
        '<a class="back" href="index.html">← 일기 목록</a>'
        "<article><h1>%s</h1>"
        '<p class="meta"><span>%s</span>%s</p>%s</article>'
        % (esc(meta.get("title", day)), esc(head), tags, mdlite.render(body))
    )
    return PAGE.format(
        title=esc("%s %s" % (day, meta.get("title", ""))).strip(),
        desc=esc(meta.get("summary", "")), ogtype="article",
        css=CSS, body=article, footer_left=esc("일기"),
    ).replace('<span><a href="../feed.xml">RSS</a></span>', "")


def render_index(found):
    rows = ["<header class=\"site\"><h1>일기</h1><p>하루를 돌아보며 남기는 기록. %d편</p></header>" % len(found),
            '<ul class="posts">']
    for day, meta, _body, slug in found:
        head = " · ".join(x for x in (day, meta.get("weekday", ""), meta.get("place", "")) if x)
        rows.append(
            '<li><a href="%s.html">%s</a><p class="sum">%s</p><p class="meta"><span>%s</span></p></li>'
            % (esc(slug), esc(meta.get("title", day)), esc(meta.get("summary", "")), esc(head))
        )
    rows.append("</ul>")
    return PAGE.format(
        title=esc("일기"), desc=esc("하루를 돌아보며 남기는 기록"), ogtype="website",
        css=CSS, body="\n".join(rows), footer_left=esc("일기"),
    ).replace('<span><a href="../feed.xml">RSS</a></span>', "")


def cmd_new(args):
    day = args[0] if args else date.today().isoformat()
    try:
        weekday = WEEKDAYS[date.fromisoformat(day).weekday()]
    except ValueError:
        print("날짜 형식은 YYYY-MM-DD 입니다: %s" % day)
        return 1
    os.makedirs(DIARY_DIR, exist_ok=True)
    path = os.path.join(DIARY_DIR, "%s.md" % day)
    if os.path.exists(path):
        print("이미 있습니다: %s" % os.path.relpath(path, ROOT))
        return 0
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(TEMPLATE.format(day=day, weekday=weekday))
    print("만들었습니다: %s (%s)" % (os.path.relpath(path, ROOT), weekday))
    return 0


def cmd_build(_args):
    found = entries()
    if not found:
        print("일기가 없습니다. python3 tools/diary.py new 로 시작하세요.")
        return 1
    os.makedirs(HTML_DIR, exist_ok=True)
    for day, meta, body, slug in found:
        with open(os.path.join(HTML_DIR, "%s.html" % slug), "w", encoding="utf-8") as handle:
            handle.write(render_entry(day, meta, body))
    with open(os.path.join(HTML_DIR, "index.html"), "w", encoding="utf-8") as handle:
        handle.write(render_index(found))
    print("빌드 완료: %d편 · %s" % (len(found), os.path.relpath(HTML_DIR, ROOT)))
    return 0


def main():
    command = sys.argv[1] if len(sys.argv) > 1 else "build"
    handlers = {"new": cmd_new, "build": cmd_build}
    if command not in handlers:
        print(__doc__)
        return 1
    return handlers[command](sys.argv[2:])


if __name__ == "__main__":
    raise SystemExit(main())
