#!/usr/bin/env python3
"""완성된 글을 브런치/요즘IT 에디터에 붙여넣을 형태로 뽑는다.

    python3 tools/export.py                  # status 가 draft 가 아닌 글 전부
    python3 tools/export.py 2026-08-25       # 특정 날짜
    python3 tools/export.py --all            # 초고까지 전부

결과는 writing/export/ 아래 .txt 로 떨어진다. 브런치는 마크다운을 못 받으므로
기호를 걷어낸 순수 텍스트, 요즘IT 는 원본 마크다운 그대로 넘긴다.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite
from build import ROOT, read_posts

OUT = os.path.join(ROOT, "writing", "export")


def main():
    args = sys.argv[1:]
    show_all = "--all" in args
    day = next((a for a in args if a.startswith("2")), None)

    posts = read_posts()
    if day:
        posts = [p for p in posts if p["date"] == day]
    elif not show_all:
        posts = [p for p in posts if p["status"] != "draft"]

    if not posts:
        print("내보낼 글이 없습니다. front matter 의 status 를 ready 로 바꾸거나 --all 을 쓰세요.")
        return 1

    os.makedirs(OUT, exist_ok=True)
    for post in posts:
        brunch = post["target"] not in ("yozm", "publy")
        text = mdlite.to_plain(post["body"]) if brunch else post["body"].strip()
        header = "제목: %s\n부제/요약: %s\n태그: %s\n분량: %s자\n%s\n\n" % (
            post["title"], post["summary"], ", ".join(post.get("tags", [])) or "-",
            format(post["chars"], ","), "-" * 40,
        )
        path = os.path.join(OUT, "%s.%s.txt" % (post["slug"], post["target"]))
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(header + text + "\n")
        print("%s  (%s자, %s)" % (os.path.relpath(path, ROOT), format(post["chars"], ","), post["status"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
