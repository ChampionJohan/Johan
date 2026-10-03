#!/usr/bin/env python3
"""하루를 돌아보는 일기를 쓰고, 읽기 좋은 HTML 로 만든다.

    python3 tools/diary.py new           # 오늘자 일기 뼈대 생성
    python3 tools/diary.py new 2026-09-22
    python3 tools/diary.py build         # writing/diary/*.md -> writing/diary/html/
    python3 tools/diary.py reading       # 일기에서 말씀 기록만 뽑아 독서 진행표 생성

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
READING_MD = "독서진행표.md"
READING_HTML = "독서진행표.html"
PASSAGE_ROW = re.compile(r"^\|\s*말씀\s*\|\s*([^|]+?)\s*\|")
PASSAGE_HEAD = re.compile(r"^##\s*말씀\s*[-\u2013\u2014]\s*(.+?)\s*$")
NUMBERS = re.compile(r"\d+")

TEMPLATE = """---
title: {day} 기록
date: {day}
weekday: {weekday}
place: 쿠알라룸푸르, 말레이시아
tags: [일기]
passage:
summary:
---

## 오늘 있었던 일

## 말씀 -

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
    rows = ["<header class=\"site\"><h1>일기</h1><p>하루를 돌아보며 남기는 기록. %d편 · "
        "<a href=\"%s\">독서 진행표</a></p></header>" % (len(found), READING_HTML),
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


def passage_of(meta, body):
    """그날 읽은 본문을 찾는다. 설교자 이름처럼 장 표기가 없는 값은 본문으로 보지 않는다."""
    if meta.get("passage"):
        return meta["passage"].strip()
    for line in body.splitlines():
        match = PASSAGE_ROW.match(line) or PASSAGE_HEAD.match(line)
        if not match:
            continue
        text = match.group(1).strip()
        if "장" in text and NUMBERS.search(text):
            return text
    return ""


def passage_parts(text):
    """'출애굽기 29~31장' -> ('출애굽기', 29, 31). 장 번호가 없으면 None."""
    nums = [int(n) for n in NUMBERS.findall(text)]
    if not nums:
        return None
    book = text[:text.index(str(nums[0]))].strip(" ,.") or "(권 미상)"
    return book, nums[0], nums[-1]


def passage_note(body):
    """말씀 섹션의 첫 문장을 그날의 한 줄로 쓴다."""
    lines = body.splitlines()
    for i, line in enumerate(lines):
        if not (PASSAGE_HEAD.match(line) or line.strip() == "## 말씀"):
            continue
        for follow in lines[i + 1:]:
            text = follow.strip()
            if text.startswith("##"):
                break
            if text:
                return text
    return ""


def flow_of(book, start, end, previous):
    """앞 기록과 이어지는지 본다."""
    if previous is None:
        return "시작"
    prev_book, prev_end = previous
    if book != prev_book:
        return "새 권"
    if start == prev_end + 1:
        return "이어짐"
    if start <= prev_end:
        return "겹침 %d장" % (prev_end - start + 1)
    return "건너뜀 %d장" % (start - prev_end - 1)


def reading_rows():
    """날짜 오름차순으로 (날짜, 요일, 본문, 장 수, 흐름, 한 줄) 목록을 만든다."""
    rows = []
    previous = None
    chapters = {}
    for day, meta, body, _slug in sorted(entries(), key=lambda e: e[0]):
        text = passage_of(meta, body)
        if not text:
            continue
        parts = passage_parts(text)
        if not parts:
            continue
        book, start, end = parts
        flow = flow_of(book, start, end, previous)
        previous = (book, end)
        chapters.setdefault(book, set()).update(range(start, end + 1))
        rows.append({
            "day": day, "weekday": meta.get("weekday", ""), "text": text,
            "count": end - start + 1, "flow": flow, "note": passage_note(body),
        })
    return rows, chapters


def reading_markdown(rows, chapters):
    out = ["# 독서 진행표", "",
           "일기(`writing/diary/*.md`)의 말씀 기록에서 자동으로 뽑았다. 직접 고치지 말 것.",
           "`python3 tools/diary.py reading` 으로 다시 만든다.", ""]
    if not rows:
        out += ["아직 말씀 기록이 없다.", ""]
        return "\n".join(out)
    out += ["## 날짜별 기록", "", "| 날짜 | 요일 | 본문 | 장 수 | 흐름 | 그날의 한 줄 |",
            "|---|---|---|---|---|---|"]
    for row in rows:
        out.append("| %s | %s | %s | %d | %s | %s |" % (
            row["day"], row["weekday"], row["text"], row["count"], row["flow"], row["note"]))
    out += ["", "## 권별 누적", "", "| 권 | 기록된 범위 | 읽은 장 수 |", "|---|---|---|"]
    for book in sorted(chapters):
        read = chapters[book]
        out.append("| %s | %d~%d장 | %d장 |" % (book, min(read), max(read), len(read)))
    total = sum(len(v) for v in chapters.values())
    out += ["", "## 요약", "",
            "- 기록한 날: %d일" % len(rows),
            "- 읽은 장: %d장 (중복 제외)" % total,
            "- 첫 기록: %s · 마지막 기록: %s" % (rows[0]["day"], rows[-1]["day"]), ""]
    return "\n".join(out)


def cmd_reading(_args):
    rows, chapters = reading_rows()
    text = reading_markdown(rows, chapters)
    os.makedirs(HTML_DIR, exist_ok=True)
    with open(os.path.join(DIARY_DIR, READING_MD), "w", encoding="utf-8") as handle:
        handle.write(text)
    page = PAGE.format(
        title=esc("독서 진행표"), desc=esc("일기에서 뽑은 말씀 기록"), ogtype="website",
        css=CSS,
        body='<a class="back" href="index.html">← 일기 목록</a><article>%s</article>' % mdlite.render(text),
        footer_left=esc("일기"),
    ).replace('<span><a href="../feed.xml">RSS</a></span>', "")
    with open(os.path.join(HTML_DIR, READING_HTML), "w", encoding="utf-8") as handle:
        handle.write(page)
    print("독서 진행표: %d일 · %d장" % (len(rows), sum(len(v) for v in chapters.values())))
    return 0


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
    return cmd_reading([])


def main():
    command = sys.argv[1] if len(sys.argv) > 1 else "build"
    handlers = {"new": cmd_new, "build": cmd_build, "reading": cmd_reading}
    if command not in handlers:
        print(__doc__)
        return 1
    return handlers[command](sys.argv[2:])


if __name__ == "__main__":
    raise SystemExit(main())
