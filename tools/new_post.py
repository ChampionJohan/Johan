#!/usr/bin/env python3
"""오늘자 글 뼈대를 만든다. writing/plan.md 주제 큐에서 다음 주제를 꺼내 쓴다.

    python3 tools/new_post.py                 # 큐에서 다음 주제
    python3 tools/new_post.py "직접 쓴 제목"   # 주제 직접 지정
    python3 tools/new_post.py --peek          # 큐만 확인하고 파일은 안 만듦

큐 형식(writing/plan.md):  - [ ] 제목 | 시리즈 | 한 줄 각도
"""

import os
import re
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT, POSTS_DIR, slugify

PLAN = os.path.join(ROOT, "writing", "plan.md")
TARGETS = (("요즘", "yozm"), ("yozm", "yozm"), ("퍼블리", "publy"), ("publy", "publy"))


def target_for(series):
    """시리즈 이름으로 어느 매체용 원고인지 정한다."""
    name = series.strip().lower()
    for prefix, target in TARGETS:
        if name.startswith(prefix):
            return target
    return "brunch"

QUEUE_LINE = re.compile(r"^(\s*)- \[ \]\s*(.+)$")

TEMPLATE = """---
title: {title}
date: {today}
series: {series}
tags: []
status: draft
target: {target}
summary:
---

{angle_note}## 왜 이 글을 쓰나

<!-- 독자가 겪는 상황 한 문단. "나는" 이 아니라 "당신은" 으로 시작할 것. -->

## 무슨 일이 있었나

<!-- 구체적인 사실, 숫자, 날짜. 여기서 일반론이 나오면 글이 죽는다. -->

## 그래서 배운 것

<!-- 남이 그대로 따라 할 수 있는 형태로. 원칙 2~3개면 충분하다. -->

## 정리

<!-- 한 문단. 독자가 오늘 당장 할 수 있는 행동 하나로 끝낸다. -->
"""


def next_topic():
    """plan.md 에서 아직 안 쓴 첫 주제를 (제목, 시리즈, 각도, 원본줄) 로 돌려준다."""
    if not os.path.exists(PLAN):
        return None
    with open(PLAN, encoding="utf-8") as handle:
        for line in handle:
            match = QUEUE_LINE.match(line.rstrip("\n"))
            if not match:
                continue
            parts = [p.strip() for p in match.group(2).split("|")]
            title = parts[0]
            series = parts[1] if len(parts) > 1 and parts[1] else "낱글"
            angle = parts[2] if len(parts) > 2 else ""
            return title, series, angle, line
    return None


def mark_done(original_line):
    with open(PLAN, encoding="utf-8") as handle:
        text = handle.read()
    text = text.replace(original_line, original_line.replace("- [ ]", "- [x]", 1), 1)
    with open(PLAN, "w", encoding="utf-8") as handle:
        handle.write(text)


def main():
    args = [a for a in sys.argv[1:] if a != "--peek"]
    peek = "--peek" in sys.argv[1:]
    today = date.today().isoformat()

    picked = next_topic()
    if args:
        title, series, angle, line = args[0], (picked[1] if picked else "낱글"), "", None
    elif picked:
        title, series, angle, line = picked
    else:
        print("주제 큐가 비었습니다. writing/plan.md 에 `- [ ] 제목 | 시리즈 | 각도` 를 추가하세요.")
        return 1

    if peek:
        print("다음 주제: %s\n시리즈: %s\n각도: %s" % (title, series, angle or "(없음)"))
        return 0

    path = os.path.join(POSTS_DIR, "%s-%s.md" % (today, slugify(title)))
    if os.path.exists(path):
        print("이미 있습니다: %s" % path)
        return 0

    target = target_for(series)
    os.makedirs(POSTS_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(TEMPLATE.format(
            title=title, today=today, series=series, target=target,
            angle_note="<!-- 각도: %s -->\n\n" % angle if angle else "",
        ))
    if line:
        mark_done(line)
    print("만들었습니다: %s" % os.path.relpath(path, ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
