#!/usr/bin/env python3
"""완성된 대본을 녹음용·업로드용 텍스트로 뽑는다.

    python3 tools/video_export.py                  # status 가 draft 가 아닌 대본 전부
    python3 tools/video_export.py 2026-08-26       # 특정 날짜
    python3 tools/video_export.py --all            # 초고까지 전부

결과는 video/export/ 아래로 떨어진다.
  *.나레이션.txt  프롬프터에 띄우고 그대로 읽는 텍스트
  *.업로드.txt    유튜브 제목·설명란·챕터·태그 붙여넣기용

TODO 가 남아 있거나 나레이션 분량이 규격을 벗어나면 경고를 띄운다.
"""

import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mdlite
from build import ROOT, slugify

SCRIPTS_DIR = os.path.join(ROOT, "video", "scripts")
OUT = os.path.join(ROOT, "video", "export")

COMMENT = re.compile(r"<!--.*?-->", re.S)
SECTION = re.compile(r"^##\s+(.+)$", re.M)
CHAPTER = re.compile(r"^###\s+\[(\d{1,2}:\d{2})\]\s*(.+)$", re.M)
CHARS_PER_MIN = 330  # 한국어 나레이션 기준. 자기 속도에 맞춰 고치면 된다.


def parse(path):
    with open(path, encoding="utf-8") as handle:
        raw = handle.read()
    meta, body = {}, raw
    if raw.startswith("---"):
        _, front, body = raw.split("---", 2)
        for line in front.strip().splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                meta[key.strip()] = value.strip()
    meta.setdefault("title", os.path.basename(path))
    meta.setdefault("status", "draft")
    meta.setdefault("category", "미분류")
    meta["date"] = meta.get("date") or os.path.basename(path)[:10]
    meta["todo"] = raw.count("TODO")
    return meta, body


def sections(body):
    """`## 제목` 단위로 (제목, 본문) 목록을 만든다."""
    marks = [(m.group(1).strip(), m.end()) for m in SECTION.finditer(body)]
    out = []
    for index, (name, start) in enumerate(marks):
        end = marks[index + 1][1] - len("## %s" % marks[index + 1][0]) if index + 1 < len(marks) else len(body)
        out.append((name, body[start:end]))
    return out


def clean(text):
    """주석과 마크다운 기호를 걷어내고 읽을 문장만 남긴다."""
    return mdlite.to_plain(COMMENT.sub("", text)).strip()


def narration_of(body):
    """`## 대본…` 섹션을 (타임코드, 소제목, 문장) 목록으로 돌려준다."""
    for name, text in sections(body):
        if not name.startswith("대본"):
            continue
        marks = [(m.group(1), m.group(2).strip(), m.start(), m.end()) for m in CHAPTER.finditer(text)]
        chapters = []
        for index, (code, label, start, end) in enumerate(marks):
            stop = marks[index + 1][2] if index + 1 < len(marks) else len(text)
            chapters.append((code, label, clean(text[end:stop])))
        return chapters
    return []


def source_lines(body):
    for name, text in sections(body):
        if name.startswith("리서치"):
            return [l.strip() for l in clean(text).splitlines()
                    if re.match(r"^\d+\.\s+\S", l.strip())]
    return []


def section_text(body, prefix):
    for name, text in sections(body):
        if name.startswith(prefix):
            return clean(text)
    return ""


def export(path):
    meta, body = parse(path)
    chapters = narration_of(body)
    spoken = "\n".join(c[2] for c in chapters if c[2])
    chars = len(re.sub(r"\s+", " ", spoken))
    minutes = chars / float(CHARS_PER_MIN)
    slug = slugify(meta["title"])

    prompter = ["%s  (%s)" % (meta["title"], meta["category"]), "=" * 50, ""]
    for code, label, text in chapters:
        prompter += ["[%s] %s" % (code, label), "", text or "(비어 있음)", ""]
    prompter += ["-" * 50, "나레이션 %s자 · 예상 %d분 %02d초" % (
        format(chars, ","), int(minutes), round((minutes % 1) * 60))]

    upload = ["제목: %s" % meta["title"], "", "[설명란]", section_text(body, "업로드") or "", "",
              "[챕터]"]
    upload += ["%s %s" % (code, label) for code, label, _ in chapters] or ["(타임코드 없음)"]
    sources = source_lines(body)
    if sources:
        upload += ["", "[출처]"] + sources
    upload += ["", "[숏폼]", section_text(body, "숏폼") or "(없음)"]

    os.makedirs(OUT, exist_ok=True)
    for suffix, lines in (("나레이션", prompter), ("업로드", upload)):
        out_path = os.path.join(OUT, "%s.%s.txt" % (slug, suffix))
        with open(out_path, "w", encoding="utf-8") as handle:
            handle.write("\n".join(lines).rstrip() + "\n")

    warnings = []
    if meta["todo"]:
        warnings.append("TODO %d개 남음" % meta["todo"])
    if meta.get("runtime", "").startswith("10") and not 3000 <= chars <= 3400:
        warnings.append("분량 규격(3,000~3,400자) 밖")
    if not sources:
        warnings.append("출처 없음")
    print("%s  %s자 / 예상 %.1f분  %s" % (
        slug, format(chars, ","), minutes, ("⚠ " + ", ".join(warnings)) if warnings else "ok"))
    return 0


def main():
    args = sys.argv[1:]
    show_all = "--all" in args
    day = next((a for a in args if a[:1].isdigit()), None)

    if not os.path.isdir(SCRIPTS_DIR):
        print("대본이 없습니다. python3 tools/new_video.py 로 먼저 만드세요.")
        return 1

    paths = sorted(os.path.join(SCRIPTS_DIR, n) for n in os.listdir(SCRIPTS_DIR) if n.endswith(".md"))
    if day:
        paths = [p for p in paths if os.path.basename(p).startswith(day)]
    elif not show_all:
        paths = [p for p in paths if parse(p)[0]["status"] != "draft"]

    if not paths:
        print("내보낼 대본이 없습니다. front matter 의 status 를 ready 로 바꾸거나 --all 을 쓰세요.")
        return 1
    for path in paths:
        export(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
