#!/usr/bin/env python3
"""다음 편 영상 대본 뼈대를 만든다. video/plan.md 편성 큐에서 다음 주제를 꺼내 쓴다.

    python3 tools/new_video.py                 # 큐에서 다음 편
    python3 tools/new_video.py "직접 쓴 제목"   # 주제 직접 지정
    python3 tools/new_video.py --peek          # 큐만 확인하고 파일은 안 만듦
    python3 tools/new_video.py --short         # 숏폼 전용 뼈대 (1~2단계용)

큐 형식(video/plan.md):  - [ ] 제목 | 카테고리 | 한 줄 각도
"""

import os
import re
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT, slugify

PLAN = os.path.join(ROOT, "video", "plan.md")
SCRIPTS_DIR = os.path.join(ROOT, "video", "scripts")
QUEUE_LINE = re.compile(r"^(\s*)- \[ \]\s*(.+)$")

# 카테고리별 썸네일/그래픽 기준색. 목록에서 시리즈로 보이게 하는 장치.
COLORS = {
    "IT": "#2F6FED", "금융": "#1E9E6A", "농업": "#7CB342", "경제": "#5E35B1",
    "숙박": "#00897B", "음식": "#F4801A", "스포츠": "#E53935", "마케팅": "#D81B60",
    "어업": "#0277BD",
}

LONG = """---
title: {title}
date: {today}
category: {category}
color: {color}
runtime: 10분
status: draft
thumb:
angle: {angle}
next: {next_title}
---

## 리서치

<!-- 대본을 쓰기 전에 여기부터 채운다. 여기가 비면 대본은 반드시 일반론이 된다. -->

| 확인할 숫자 | 값 | 연도 | 출처 번호 |
|---|---|---|---|
| 매출 규모 | <!-- TODO --> | | |
| 수익의 출처별 비중 | <!-- TODO --> | | |
| 시장 점유율 또는 순위 | <!-- TODO --> | | |
| 가장 뜻밖의 숫자 하나 | <!-- TODO --> | | |

### 출처 (1차 자료 3개 이상)

1. <!-- TODO: 연차보고서 / 통계 / 공시. 블로그·유튜브는 출처가 아니라 단서다 -->
2. <!-- TODO -->
3. <!-- TODO -->

### BM 5칸

| 칸 | 내용 |
|---|---|
| 1. 고객 — 실제로 돈을 내는 사람 | <!-- TODO --> |
| 2. 가치 — 무엇에 돈을 내나 | <!-- TODO --> |
| 3. 과금 — 어떻게 받나 | <!-- TODO --> |
| 4. 해자 — 왜 못 뺏나 | <!-- TODO --> |
| 5. 균열 — 어디서 무너지나 | <!-- TODO --> |

## 대본 — 롱폼 10분

<!-- 말로 읽을 문장만. 한 문장 40자 이내. 목표 3,000~3,400자. -->

### [0:00] 훅

<!-- TODO: 첫 문장에 숫자나 반전. "오늘은 ~에 대해 알아보겠습니다" 로 시작하면 폐기. -->

### [0:20] 오늘의 질문

<!-- TODO: 이 영상이 답할 질문 한 줄 + 채널 소개 5초. -->

### [0:50] 배경

<!-- TODO: 이 시장이 어떻게 생겼는지. 시청자가 아는 상식 한 겹까지만. -->

### [2:30] 해부 — 고객과 가치와 과금

<!-- TODO: BM 5칸의 1·2·3. 여기가 영상의 본체다. 숫자로 말할 것. -->

### [5:30] 해자

<!-- TODO: 4번 칸. 따라 하려던 회사가 왜 실패했는지 사례 하나. -->

### [7:30] 균열

<!-- TODO: 5번 칸. 가장 뜻밖의 사실을 이 구간 앞머리에 배치한다. 이탈이 몰리는 지점. -->

### [9:00] 한국에 옮기면

<!-- TODO: 국내에 이 구조를 적용하면 무엇이 되고 무엇이 안 되는가. -->

### [9:40] 마무리

<!-- TODO: 한 줄 요약 + 다음 편 예고({next_title}) + 구독. -->

## 숏폼 (이 대본에서 잘라낸다)

### 숏폼 1 — 훅형 (50초)

<!-- TODO: 위 [0:00] 을 늘려서 단독으로 성립하게. 결론은 반만 준다. -->

### 숏폼 2 — 뜻밖의 사실형 (50초)

<!-- TODO: 위 [7:30] 의 사실 하나만. -->

### 숏폼 3 — 한 줄 요약형 (40초)

<!-- TODO: BM 5칸을 40초로. 화면은 5칸 표 그대로. -->

## 업로드

### 제목 후보 (5개 쓰고 하나 고른다)

1. {title}
2. <!-- TODO -->
3. <!-- TODO -->
4. <!-- TODO -->
5. <!-- TODO -->

### 설명란 요약

<!-- TODO: 두 문장. 첫 문장에 검색어가 들어가게. -->

### 태그

<!-- TODO: 비즈니스모델, {category}, 회사명, 국가명 -->

### 썸네일

- 문구(4단어 이하): front matter 의 `thumb:` 에 적는다. 비워 두면 제목이 들어간다.
- 배경색: {color} ({category})
- 확인: 휴대폰 크기로 줄여도 읽히는가
"""

SHORT = """---
title: {title}
date: {today}
category: {category}
color: {color}
runtime: 60초
status: draft
thumb:
angle: {angle}
---

## 리서치

### 출처

1. <!-- TODO: 1차 자료 하나면 된다. 대신 반드시 1차. -->

## 대본 — 숏폼 60초

<!-- 목표 250~330자. 세로 9:16. 자막은 필수. -->

### [0:00] 훅

<!-- TODO: 3초 안에 숫자 하나. 여기서 못 잡으면 나머지는 안 본다. -->

### [0:05] 전개

<!-- TODO: 사실 두 개. 그 이상 넣으면 초과한다. -->

### [0:40] 결론

<!-- TODO: 한 줄로 닫고, 롱폼으로 유도하는 문장 하나. -->

## 업로드

- 제목: <!-- TODO: 30자 이내 -->
- 화면 자막 문구: <!-- TODO -->
- 해시태그: #비즈니스모델 #{category}
"""


def read_queue():
    """plan.md 의 미완료 항목을 [(제목, 카테고리, 각도, 원본줄), ...] 로 돌려준다."""
    items = []
    if not os.path.exists(PLAN):
        return items
    with open(PLAN, encoding="utf-8") as handle:
        for line in handle:
            match = QUEUE_LINE.match(line.rstrip("\n"))
            if not match:
                continue
            parts = [p.strip() for p in match.group(2).split("|")]
            items.append((
                parts[0],
                parts[1] if len(parts) > 1 and parts[1] else "미분류",
                parts[2] if len(parts) > 2 else "",
                line,
            ))
    return items


def mark_done(original_line):
    with open(PLAN, encoding="utf-8") as handle:
        text = handle.read()
    text = text.replace(original_line, original_line.replace("- [ ]", "- [x]", 1), 1)
    with open(PLAN, "w", encoding="utf-8") as handle:
        handle.write(text)


def main():
    argv = sys.argv[1:]
    peek = "--peek" in argv
    short = "--short" in argv
    args = [a for a in argv if not a.startswith("--")]
    today = date.today().isoformat()

    queue = read_queue()
    if args:
        title, category, angle, line = args[0], (queue[0][1] if queue else "미분류"), "", None
        next_title = queue[0][0] if queue else ""
    elif queue:
        title, category, angle, line = queue[0]
        next_title = queue[1][0] if len(queue) > 1 else ""
    else:
        print("편성 큐가 비었습니다. video/plan.md 에 `- [ ] 제목 | 카테고리 | 각도` 를 추가하세요.")
        return 1

    if peek:
        print("다음 편: %s\n카테고리: %s\n각도: %s\n남은 편수: %d" % (
            title, category, angle or "(없음)", len(queue)))
        return 0

    suffix = "-short" if short else ""
    path = os.path.join(SCRIPTS_DIR, "%s-%s%s.md" % (today, slugify(title), suffix))
    if os.path.exists(path):
        print("이미 있습니다: %s" % os.path.relpath(path, ROOT))
        return 0

    template = SHORT if short else LONG
    os.makedirs(SCRIPTS_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(template.format(
            title=title, today=today, category=category, angle=angle,
            color=COLORS.get(category, "#333333"), next_title=next_title,
        ))
    # 숏폼은 롱폼을 위한 예고편이므로 큐를 소비하지 않는다.
    if line and not short:
        mark_done(line)
    print("만들었습니다: %s" % os.path.relpath(path, ROOT))
    print("리서치 표부터 채우세요. 대본은 그다음입니다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
