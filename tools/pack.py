#!/usr/bin/env python3
"""KDP 에 올릴 파일을 zip 한 장으로 묶는다.

    python3 tools/pack.py aibook
    python3 tools/pack.py --list

폴더 이름의 번호가 그대로 올리는 순서다. 1번부터 차례로 열면 된다.

묶기 전에 세 가지를 검사한다. 셋 다 전에 실제로 당한 것들이다.

  1. 본문 PDF 의 쪽수가 파일 이름의 쪽수와 같은가
  2. 표지 PDF 의 폭이 그 쪽수로 계산한 폭과 같은가
  3. 표지 뒷면 글과 설명문에 적힌 장 수가 실제 장 수와 같은가

둘째가 중요하다. 쪽수가 바뀌었는데 표지를 다시 안 만들면 책등이 어긋나고,
그건 인쇄본이 나와야 보인다. 여기서 막는다.

셋째는 11번에서 당했다. 14장을 새로 넣어 열일곱 장이 열여덟 장이 됐는데
표지 뒷면 글과 설명문의 숫자를 같이 안 고쳤다. 앞띠는 18 CHAPTERS 인데
뒷면은 Seventeen chapters 인 표지가 검수까지 올라갔다. 사람이 세는 숫자를
손으로 적어 두면 원고가 바뀌어도 안 따라온다. 그래서 여기서 센다.
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
    # 한국어 158쪽, 영어 180쪽이다(장면 열여덟이 들어간 뒤).
    "person": dict(
        name="11-12_사람을-사람으로-보는-법",
        docs=["업로드-사람책.md", "업로드-사람책.html"],
        steps=[
            ("1-영어-전자책", [
                "release/ebook/How to See a Person.epub",
                "release/covers/11_How-to-See-a-Person-cover.jpg"]),
            ("2-영어-종이책", [
                "release/paperback/11_How-to-See-a-Person_interior-180p.pdf",
                "release/paperback/11_How-to-See-a-Person_cover-180p-cream.pdf"]),
            ("3-한국어-전자책", [
                "release/ebook/사람을 사람으로 보는 법.epub",
                "release/covers/12_사람을-사람으로-보는-법-cover.jpg"]),
            ("4-한국어-종이책", [
                "release/paperback/12_사람을-사람으로-보는-법_본문-158p.pdf",
                "release/paperback/12_사람을-사람으로-보는-법_표지-158p-미색.pdf"]),
        ],
        spare=[],
        pages={"영어": 180, "한국어": 158},
        # 장 수를 손으로 안 적는다. 여기 적힌 폴더를 세어서 쓴다.
        manuscripts=["person/manuscript", "en-person/manuscript"],
        cover_keys=["person", "en-person"],
    ),

    # 13~18번. 『떠오르는 사람』 세 권이라 묶음이 셋이다. 합본을 안 만든다.
    # 업로드 문서는 하나이고 세 묶음이 같은 것을 들고 간다.
    #
    # 한 권이 67~75쪽이라 책등에 글자가 없다. 그건 작가가 알고 고른 것이다.
    "love1": dict(
        name="13-14_먼저-와-있던-사람",
        docs=["업로드-사랑책.md", "업로드-사랑책.html"],
        steps=[
            ("1-영어-전자책", [
                "release/ebook/The One Who Was Already There.epub",
                "release/covers/13_The-One-Who-Was-Already-There-cover.jpg"]),
            ("2-영어-종이책", [
                "release/paperback/13_The-One-Who-Was-Already-There_interior-71p.pdf",
                "release/paperback/13_The-One-Who-Was-Already-There_cover-71p-cream.pdf"]),
            ("3-한국어-전자책", [
                "release/ebook/먼저 와 있던 사람.epub",
                "release/covers/14_먼저-와-있던-사람-cover.jpg"]),
            ("4-한국어-종이책", [
                "release/paperback/14_먼저-와-있던-사람_본문-67p.pdf",
                "release/paperback/14_먼저-와-있던-사람_표지-67p-미색.pdf"]),
        ],
        spare=[],
        pages={"영어": 71, "한국어": 67},
        manuscripts=["love1/manuscript", "en-love1/manuscript"],
        cover_keys=["love1", "en-love1"],
    ),

    "love2": dict(
        name="15-16_아무것도-묻지-않는-사람",
        docs=["업로드-사랑책.md", "업로드-사랑책.html"],
        steps=[
            ("1-영어-전자책", [
                "release/ebook/The One Who Never Asked.epub",
                "release/covers/15_The-One-Who-Never-Asked-cover.jpg"]),
            ("2-영어-종이책", [
                "release/paperback/15_The-One-Who-Never-Asked_interior-73p.pdf",
                "release/paperback/15_The-One-Who-Never-Asked_cover-73p-cream.pdf"]),
            ("3-한국어-전자책", [
                "release/ebook/아무것도 묻지 않는 사람.epub",
                "release/covers/16_아무것도-묻지-않는-사람-cover.jpg"]),
            ("4-한국어-종이책", [
                "release/paperback/16_아무것도-묻지-않는-사람_본문-68p.pdf",
                "release/paperback/16_아무것도-묻지-않는-사람_표지-68p-미색.pdf"]),
        ],
        spare=[],
        pages={"영어": 73, "한국어": 68},
        manuscripts=["love2/manuscript", "en-love2/manuscript"],
        cover_keys=["love2", "en-love2"],
    ),

    "love3": dict(
        name="17-18_끝까지-남은-사람",
        docs=["업로드-사랑책.md", "업로드-사랑책.html"],
        steps=[
            ("1-영어-전자책", [
                "release/ebook/The One Who Stayed.epub",
                "release/covers/17_The-One-Who-Stayed-cover.jpg"]),
            ("2-영어-종이책", [
                "release/paperback/17_The-One-Who-Stayed_interior-75p.pdf",
                "release/paperback/17_The-One-Who-Stayed_cover-75p-cream.pdf"]),
            ("3-한국어-전자책", [
                "release/ebook/끝까지 남은 사람.epub",
                "release/covers/18_끝까지-남은-사람-cover.jpg"]),
            ("4-한국어-종이책", [
                "release/paperback/18_끝까지-남은-사람_본문-71p.pdf",
                "release/paperback/18_끝까지-남은-사람_표지-71p-미색.pdf"]),
        ],
        spare=[],
        pages={"영어": 75, "한국어": 71},
        manuscripts=["love3/manuscript", "en-love3/manuscript"],
        cover_keys=["love3", "en-love3"],
    ),
}

# 장 수를 적을 때 쓰는 말. 검사는 이 말들만 본다.
CH_KO = {11: "열한", 12: "열두", 13: "열세", 14: "열네",
         15: "열다섯", 16: "열여섯", 17: "열일곱", 18: "열여덟",
         19: "열아홉", 20: "스물", 21: "스물한"}
CH_EN = {11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen",
         15: "fifteen", 16: "sixteen", 17: "seventeen", 18: "eighteen",
         19: "nineteen", 20: "twenty", 21: "twenty-one"}


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


def chapters_of(folder):
    """장 파일만 센다. 앞글(0 으로 시작)과 부 여는 글(00 으로 끝)은 뺀다."""
    import glob
    import re
    files = glob.glob(os.path.join(ROOT, folder, "*.md"))
    return len([f for f in files
                if re.search(r"[/\\][1-9]\d\d-", f)
                and not re.search(r"[/\\][1-9]00-", f)])


def check_chapters(spec):
    """표지 뒷면 글과 설명문에 적힌 장 수가 실제와 같은가.

    사람이 손으로 적어 둔 숫자는 원고가 바뀌어도 안 따라온다.
    11번이 그래서 앞띠와 뒷면의 숫자가 다른 채로 검수까지 갔다.

    보는 데는 두 군데뿐이다. 다른 데까지 보면 다른 책의 숫자와
    지난 일을 적어 둔 줄까지 걸려서 거짓 경보만 난다.

      1. cover.py 의 이 책 항목 — back_head 와 back
      2. 업로드 문서의 ```html 블록 — 실제로 붙여 넣는 글
    """
    import re
    folders = spec.get("manuscripts")
    if not folders:
        return []

    counts = {f: chapters_of(f) for f in folders}
    real = set(counts.values())
    bad = []
    if len(real) > 1:
        bad.append("원고 폴더마다 장 수가 다르다 — %s"
                   % " · ".join("%s %d장" % (f, n) for f, n in counts.items()))
        return bad
    n = real.pop()

    texts = {}

    for key in spec.get("cover_keys", []):
        try:
            import cover
        except Exception:
            break
        d = cover.BOOKS.get(key)
        if not d:
            continue
        texts["표지 뒷면 · %s" % key] = " ".join(
            [d.get("back_head", "")] + list(d.get("back", [])))

    for doc in spec.get("docs", []):
        if not doc.endswith(".md"):
            continue
        path = os.path.join(ROOT, doc)
        if not os.path.exists(path):
            continue
        blocks = re.findall(r"```html\n(.*?)```",
                            io.open(path, encoding="utf-8").read(), flags=re.S)
        if blocks:
            texts["설명문 · %s" % doc] = "\n".join(blocks)

    for where, text in texts.items():
        low = text.lower()
        for k, word in CH_KO.items():
            if k != n and re.search(word + r"\s*장", text):
                bad.append("%s — 「%s 장」이라고 적혀 있는데 실제는 %d장"
                           % (where, word, n))
        for k, word in CH_EN.items():
            if k != n and re.search(word + r"\s+chapters", low):
                bad.append("%s — 「%s chapters」라고 적혀 있는데 실제는 %d장"
                           % (where, word, n))
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
    wrong = check_chapters(spec)
    if wrong:
        print("장 수가 안 맞습니다. 묶지 않았습니다.")
        for w in wrong:
            print("   %s" % w)
        return 1

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
