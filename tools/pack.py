#!/usr/bin/env python3
"""KDP 에 올릴 파일을 zip 한 장으로 묶는다.

    python3 tools/pack.py aibook
    python3 tools/pack.py --list

폴더 이름의 번호가 그대로 올리는 순서다. 1번부터 차례로 열면 된다.

묶기 전에 두 가지를 검사한다. 둘 다 전에 실제로 당한 것들이다.

  1. 본문 PDF 의 쪽수가 파일 이름의 쪽수와 같은가
  2. 표지 PDF 의 폭이 그 쪽수로 계산한 폭과 같은가

둘째가 중요하다. 쪽수가 바뀌었는데 표지를 다시 안 만들면 책등이 어긋나고,
그건 인쇄본이 나와야 보인다. 여기서 막는다.
"""

import io
import os
import sys
import zipfile

import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doc2html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 표지 폭 = 도련 + 앞 + 책등 + 뒤 + 도련. wrap_cover.py 와 같은 값이라야 한다.
BLEED, TRIM_W, CREAM = 0.125, 6.0, 0.0025
TOLERANCE = 0.01                      # 인치. 반올림 차이만 봐준다


BUNDLES = {
    "aibook": dict(
        name="09-10_기계가-말하지-못한-것",
        docs=["업로드-AI책.md", "업로드-AI책.html"],
        steps=[
            ("1-영어-전자책", [
                "release/ebook/What It Could Not Tell Me.epub",
                "release/covers/09_What-It-Could-Not-Tell-Me-cover.jpg"]),
            ("2-영어-종이책", [
                "release/paperback/09_What-It-Could-Not-Tell-Me_interior-113p.pdf",
                "release/paperback/09_What-It-Could-Not-Tell-Me_cover-113p-cream.pdf"]),
            ("3-한국어-전자책", [
                "release/ebook/기계가 말하지 못한 것.epub",
                "release/covers/10_기계가-말하지-못한-것-cover.jpg"]),
            ("4-한국어-종이책", [
                "release/paperback/10_기계가-말하지-못한-것_본문-107p.pdf",
                "release/paperback/10_기계가-말하지-못한-것_표지-107p-미색.pdf"]),
        ],
        spare=[
            "release/ebook/What It Could Not Tell Me.pdf",
            "release/ebook/기계가 말하지 못한 것-A5.pdf"],
        pages={"영어": 113, "한국어": 107},
    ),

    # 11·12번. 아직 안 만든 것이 있어서 지금 돌리면 '없는 파일' 로 막힌다.
    # 그게 맞는 동작이다. 남은 것은 영어 원고, 업로드 문서, 그리고 종이책 PDF 넷.
    #
    # 쪽수가 파일 이름에 들어 있다. 작가의 장면 열여덟이 채워지면 쪽수가 늘어나니
    # 그때 아래 네 줄과 표지를 같이 고쳐야 한다. 안 고치면 check() 가 막아 준다.
    # 지금 한국어 본문은 131쪽이다(장면 전).
    "person": dict(
        name="11-12_사람을-사람으로-보는-법",
        docs=["업로드-사람책.md", "업로드-사람책.html"],
        steps=[
            ("1-영어-전자책", [
                "release/ebook/How to See a Person.epub",
                "release/covers/11_How-to-See-a-Person-cover.jpg"]),
            ("2-영어-종이책", [
                "release/paperback/11_How-to-See-a-Person_interior-131p.pdf",
                "release/paperback/11_How-to-See-a-Person_cover-131p-cream.pdf"]),
            ("3-한국어-전자책", [
                "release/ebook/사람을 사람으로 보는 법.epub",
                "release/covers/12_사람을-사람으로-보는-법-cover.jpg"]),
            ("4-한국어-종이책", [
                "release/paperback/12_사람을-사람으로-보는-법_본문-131p.pdf",
                "release/paperback/12_사람을-사람으로-보는-법_표지-131p-미색.pdf"]),
        ],
        spare=[],
        pages={"영어": 131, "한국어": 131},
    ),
}


def pages_of(path):
    doc = pymupdf.open(path)
    n = doc.page_count
    doc.close()
    return n


def width_of(path):
    doc = pymupdf.open(path)
    w = doc[0].rect.width / 72.0
    doc.close()
    return w


def check(step_files):
    """본문 쪽수와 표지 폭을 맞춰 본다. 틀린 것만 돌려준다."""
    bad = []
    interior = [f for f in step_files if "interior-" in f or "본문-" in f]
    cover = [f for f in step_files if "cover-" in f or "표지-" in f]
    if not interior:
        return bad

    path = os.path.join(ROOT, interior[0])
    said = int("".join(c for c in os.path.basename(path).split("-")[-1]
                       if c.isdigit()))
    real = pages_of(path)
    if said != real:
        bad.append("%s — 이름은 %d쪽인데 실제는 %d쪽"
                   % (os.path.basename(path), said, real))

    if cover:
        cpath = os.path.join(ROOT, cover[0])
        want = BLEED * 2 + TRIM_W * 2 + real * CREAM
        got = width_of(cpath)
        if abs(want - got) > TOLERANCE:
            bad.append("%s — %d쪽이면 폭이 %.4f in 이어야 하는데 %.4f in 이다. "
                       "표지를 다시 만들 것"
                       % (os.path.basename(cpath), real, want, got))
    return bad


def order_text(spec):
    """zip 안에 넣을 '올리는 순서'. 목록에서 만들어서 따로 놀 수 없게 한다."""
    out = ["# 올리는 순서", "",
           "**폴더 번호가 그대로 올리는 순서입니다.** 1번부터 차례로 여세요.", ""]
    for i, (folder, files) in enumerate(spec["steps"], 1):
        out.append("## %s" % folder)
        out.append("")
        paper = any(f.endswith(".pdf") for f in files)
        slot = ["Manuscript", "Book Cover"]
        for name, f in zip(slot, files):
            out.append("- **%s** — `%s`" % (name, os.path.basename(f)))
        out.append("")
        if paper:
            out.append("종이책입니다. **표지는 PDF 입니다.** JPG 를 올리면 거부됩니다.")
        else:
            out.append("전자책입니다. **표지는 JPG 입니다.** PDF 를 올리면 거부됩니다.")
        out.append("")
        if i == 1:
            out.append("> 1번이 살아나야(보통 몇 시간~하루) 2번을 같은 책에 붙일 수 "
                       "있습니다.")
            out.append("")
        if i == 3:
            out.append("> 3번은 1번과 **별개의 새 책**입니다. 아마존은 언어판을 "
                       "묶어 주지 않습니다.")
            out.append("")

    out += ["---", "", "# 네 번 다 틀리면 안 되는 칸", "",
            "| 탭 | 칸 | 값 |", "|---|---|---|",
            "| Details | 저내용(low-content) 체크 | **끔** |",
            "| Content | Print ISBN | **Get a free KDP ISBN** (종이책만) |",
            "| Content | Ink and Paper Type | **cream paper** (종이책만) |",
            '| Content | "Yes, my cover has a barcode" | **끔** (종이책만) |', "",
            "셋째를 틀리면 책등이 어긋나고, 넷째를 켜면 바코드를 못 찾겠다고 막힙니다.",
            "", "---", "",
            "# 나머지는 같이 넣은 문서에",
            "",
            "제목·부제·설명·분류·키워드·값은 **`%s`** 에 다 있습니다."
            % spec["docs"][0],
            "그대로 복사해서 붙이시면 됩니다.", ""]
    if spec.get("spare"):
        out += ["---", "", "# 예비 PDF 는 안 올리셔도 됩니다", "",
                "`예비-PDF/` 는 EPUB 이 안 올라갈 때만 씁니다. 평소에는 EPUB 입니다.", ""]
    return "\n".join(out)


def make(key):
    spec = BUNDLES[key]
    out = os.path.join(ROOT, "release", "%s-업로드.zip" % spec["name"])

    # 없는 파일이 있으면 묶지 않는다. 반쯤 든 zip 이 제일 나쁘다.
    wanted = [f for _, fs in spec["steps"] for f in fs]
    wanted += spec.get("spare", []) + spec["docs"]
    missing = [f for f in wanted if not os.path.exists(os.path.join(ROOT, f))]
    if missing:
        print("없는 파일이 있습니다. 묶지 않았습니다.")
        for f in missing:
            print("   %s" % f)
        return 1

    bad = []
    for _folder, files in spec["steps"]:
        bad += check(files)
    if bad:
        print("쪽수와 표지가 안 맞습니다. 묶지 않았습니다.")
        for b in bad:
            print("   %s" % b)
        return 1

    # 올리는 순서는 zip 안에만 두지 않는다. 작가가 열어 보는 건 보통 html 쪽이고,
    # 우리 규칙상 문서는 md 와 html 둘 다 낸다.
    order_md = os.path.join(ROOT, "release", "%s-올리는-순서.md" % spec["name"])
    io.open(order_md, "w", encoding="utf-8").write(
        "---\ntitle: %s — 올리는 순서\n---\n\n" % spec["name"] + order_text(spec))
    order_html = doc2html.convert(order_md)

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(order_md, "올리는-순서.md")
        z.write(order_html, "올리는-순서.html")
        for doc in spec["docs"]:
            z.write(os.path.join(ROOT, doc), os.path.basename(doc))
        for folder, files in spec["steps"]:
            for f in files:
                z.write(os.path.join(ROOT, f),
                        "%s/%s" % (folder, os.path.basename(f)))
        for f in spec.get("spare", []):
            z.write(os.path.join(ROOT, f), "예비-PDF/%s" % os.path.basename(f))

    n = len(wanted) + 2
    print("만들었습니다: %s  (%d장, %.1f MB)"
          % (os.path.relpath(out, ROOT), n, os.path.getsize(out) / 1048576))
    for folder, files in spec["steps"]:
        print("   %s — %s" % (folder, " · ".join(os.path.basename(f) for f in files)))
    return 0


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("--list", "-l"):
        print("묶을 수 있는 것: %s" % ", ".join(sorted(BUNDLES)))
        return 0 if args else 1
    for key in args:
        if key not in BUNDLES:
            print("모르는 묶음: %s  (쓸 수 있는 것: %s)"
                  % (key, ", ".join(sorted(BUNDLES))))
            return 1
        rc = make(key)
        if rc:
            return rc
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
