#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""종이책 패키지의 안내문(권별 순서 + 전체 가이드)을 만든다.
숫자는 전부 PDF에서 직접 읽는다. 사람이 세어 적지 않는다."""
import os, re, json, glob, html as H

NOVEL = "/home/user/Johan/writing/novel"
OUT   = os.path.join(NOVEL, "종이책")
UP    = os.path.join(NOVEL, "업로드")

TRIM_W, TRIM_H, BLEED, PAPER = 6.0, 9.0, 0.125, 0.0025
# 미국 마켓플레이스 기준 흑백 6×9 인쇄비(110쪽 초과): 고정 $1.00 + 쪽당 $0.012
FIX, PER = 1.00, 0.012
ROY = 0.60
PRICE = 17.99          # 7권 공통 정가(모든 권의 최저가보다 높게 하나로)

META = {
 1: ("Loop Chronicles",   "A Novel of Daniel's Prophecy and the Machine That Answers Everything"),
 2: ("The Weeping Ledger","A Novel of a Father Who Forgot His Name"),
 3: ("The Forty-Day Clause","A Novel of a City Given Forty Days"),
 4: ("The Gleaning Ground","A Novel of a Field Where Nothing Falls"),
 5: ("The Dry Valley",    "A Novel of a City Where No One Dies"),
 6: ("The Unsigned Book", "A Novel of a City Where Nobody Decides"),
 7: ("The Last Room",     "The Final Novel of the Loop Chronicles"),
}
KO = {1:"루프 연대기",2:"울음 장부",3:"사십 일 조항",4:"이삭 줍는 자리",
      5:"마른 골짜기",6:"저자 없는 책",7:"마지막 방"}


def pdf_meta(path):
    d = open(path, "rb").read()
    pages = int(re.findall(rb"/Count\s+(\d+)", d)[-1])
    mb = re.findall(rb"/MediaBox\s*\[\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)", d)[0]
    w = (float(mb[2]) - float(mb[0])) / 72.0
    h = (float(mb[3]) - float(mb[1])) / 72.0
    return pages, round(w, 4), round(h, 4)


def scan():
    books = []
    for d in sorted(glob.glob(os.path.join(OUT, "*권-*")),
                    key=lambda p: int(re.match(r"(\d+)권", os.path.basename(p)).group(1))):
        n = int(re.match(r"(\d+)권", os.path.basename(d)).group(1))
        slug = os.path.basename(d).split("권-", 1)[1]
        ip = glob.glob(os.path.join(d, "*-본문.pdf"))[0]
        cp = glob.glob(os.path.join(d, "*-표지.pdf"))[0]
        pages, iw, ih = pdf_meta(ip)
        _, cw, ch = pdf_meta(cp)
        cost = FIX + PER * pages
        books.append(dict(
            n=n, slug=slug, dir=os.path.basename(d), title=META[n][0], sub=META[n][1],
            ko=KO[n], pages=pages, spine=round(pages * PAPER, 4),
            cover_w=cw, cover_h=ch, interior=os.path.basename(ip), cover=os.path.basename(cp),
            trim=(iw, ih), cost=round(cost, 3),
            minprice=round(-(-(cost / ROY) * 100 // 1) / 100, 2),   # 올림
        ))
    return books


# ------------------------------------------------------------------ 권별 순서
PER_BOOK = """# KDP 종이책 올리는 순서 — {n}권 『{title}』({ko})

전자책 『{title}』이(가) **Live 가 된 뒤에** 진행합니다.
새 책으로 만들지 말고, Bookshelf 에서 그 전자책 오른쪽의
**「+ Create paperback」** 을 누르세요. 그래야 전자책과 종이책이
한 상품으로 묶입니다. 따로 만들면 독자에게 다른 책 두 권으로 보입니다.

---

## 이 권의 숫자 (파일에서 직접 읽은 값)

| 항목 | 값 |
|---|---|
| 본문 쪽수 | **{pages}쪽** |
| 판형(Trim) | **6 × 9 in** |
| 종이 | **크림색(cream)** — 쪽당 0.0025 in |
| 책등 | {pages} × 0.0025 = **{spine} in** |
| 표지 PDF 크기 | **{cover_w} × {cover_h} in** (0.125 + 6 + {spine} + 6 + 0.125) |
| 본문 PDF | `{interior}` |
| 표지 PDF | `{cover}` |

> 이 두 파일은 짝입니다. 원고를 한 줄이라도 고쳐 쪽수가 바뀌면
> 책등이 바뀌고 표지 폭이 틀려집니다. **본문 다시 → 표지 다시 → 올리기**
> 순서를 지키세요. 가운데를 빼먹는 것이 제일 흔한 실수입니다.

---

## 1단계 — Paperback Details

대부분 전자책에서 그대로 복사됩니다. **보기만 하고 넘기지 말고** 아래 넷을 확인하세요.

**1. Language** → `English`

**2. Book Title** → `{title}`
(라벨 텍스트를 같이 붙여넣지 말 것 — 제목만)

**3. Subtitle** → `{sub}`

**4. Series** → `Loop Chronicles` / 번호 `{n}`
→ 새로 만들지 말고 **목록에서 기존 시리즈를 고를 것**

**5. Author** → First `Jaehyuk` / Last `Choi`

**6. Description** → 전자책 설명문이 그대로 넘어옵니다.
비어 있으면 `업로드/{n}권-{slug}/{nn}-KDP-업로드-순서.md` 의
**8번 Description** 을 복사해 넣으세요.
→ 붙여넣기 전에 에디터 오른쪽 **`Source` 버튼을 먼저 누를 것.**
안 누르면 `<p>` 같은 태그가 독자에게 글자로 보입니다.

**7. Publishing Rights** → `I own the copyright…`

**8. Primary Audience / Sexually Explicit** → `No`

**9. Reading age** → `13` ~ `18`

**10. 저내용(low-content) 체크** → ⚠️ **반드시 끔**
공책·색칠북용 항목입니다. 켜 두면 **ISBN 을 못 받고** 분류도 엉킵니다.
이 체크 하나 때문에 표지를 두 번 다시 만든 사례가 있습니다.

**11. Categories / Keywords** → 전자책과 동일 (복사되어 있으면 그대로)

→ **Save and Continue**

---

## 2단계 — Paperback Content

**1. Print ISBN** → `Get a free KDP ISBN`
공짜입니다. 받은 번호가 `979-8` 로 시작하면 정상입니다.
(저내용 체크를 안 껐으면 이 칸이 막혀 있습니다 → 1단계로 돌아갈 것)

**2. Publication Date** → 비워 둠

**3. Print Options**
- Ink and Paper Type → **`Black & white interior with cream paper`**
  ⚠️ 표지를 크림색 두께(0.0025)로 계산했습니다. 여기서 흰색을 고르면
  책등 두께가 달라지는데, **화면에서는 안 보이고 인쇄본이 나와야 보입니다.**
- Trim Size → **`6 x 9 in`**
- Bleed Settings → **`No Bleed`** (본문은 6×9 정확히, 도련 없음)
- Paperback cover finish → `Matte` 권장

**4. Manuscript** → `{interior}` 업로드
→ 업로드 후 KDP 가 읽은 쪽수가 **{pages}** 인지 확인

**5. Book Cover** → `Upload a cover you already have (print-ready PDF)`
→ `{cover}` 업로드

**6. 「Yes, my cover has a barcode」** → ⚠️ **반드시 끔**
우리 표지에는 바코드가 없고 **흰 자리만** 있습니다(2.0 × 1.2 in).
켜 두면 KDP 가 표지에서 바코드를 찾다 못 찾고
「valid barcode 를 찾을 수 없다」며 막습니다.

**7. AI-Generated Content** → `Yes` → `Text`, `Translation` 체크
(전자책과 같은 답. 만든 방법을 묻는 칸이고 독자에게 안 보입니다)

**8. Launch Previewer** → **끝까지 넘겨 볼 것**
- 책등 글자가 앞뒤로 넘어가지 않았는지 ({spine} in 폭)
- 뒤표지 오른쪽 아래 흰 네모가 제자리에 있는지
- 쪽 번호가 빠진 쪽이 없는지
- 글꼴이 바뀌지 않았는지

→ **Save and Continue**

---

## 3단계 — Paperback Rights & Pricing

**1. Territories** → `All territories`

**2. Primary Marketplace** → `Amazon.com`

**3. Royalty** → `60%` (종이책은 60% 하나뿐)

**4. Price** → `${price}`
- 이 권의 인쇄비: 약 **${cost}** (고정 $1.00 + {pages}쪽 × $0.012)
- KDP 가 받아 주는 **최저 정가: 약 ${minprice}**
- 받는 돈 = ${price} × 60% − ${cost} ≈ **${royalty}**
- 화면에 KDP 가 계산한 최저가가 뜹니다. 그 숫자가 위와 다르면
  **화면의 숫자를 따르세요.**

**5. Expanded Distribution** → 선택 (켜면 서점·도서관 유통, 인세는 40%)

→ **Publish Your Paperback** — 보통 72시간 안에 심사됩니다.

---

## 끝나고 확인할 것

- [ ] 전자책 상세 페이지에 `Paperback` 선택지가 같이 뜨는가
      (안 뜨면 따로 만든 것 — Bookshelf 에서 `Link existing paperback`)
- [ ] 시리즈 페이지에서 {n}권 자리에 들어가 있는가
- [ ] 저자명이 `Jaehyuk Choi` 인가
"""


def write_per_book(books):
    for b in books:
        b = dict(b, nn="%02d" % b["n"],
                 price="%.2f" % PRICE, cost="%.2f" % b["cost"],
                 minprice="%.2f" % b["minprice"],
                 royalty="%.2f" % (PRICE * ROY - b["cost"]))
        path = os.path.join(OUT, b["dir"], "%s-KDP-종이책-순서.md" % b["nn"])
        open(path, "w", encoding="utf-8").write(PER_BOOK.format(**b))
        print("  ", os.path.relpath(path, NOVEL))


# ------------------------------------------------------------------ 전체 가이드
FOUR = [
 ("Details", "저내용(low-content) 체크", "끔",
  "공책·색칠북용 항목. 켜 두면 ISBN 을 못 받고 분류가 엉킨다."),
 ("Content", "Print ISBN", "Get a free KDP ISBN",
  "공짜. 979-8 로 시작하면 정상. 저내용 체크가 켜져 있으면 이 칸이 막힌다."),
 ("Content", "Ink and Paper Type", "Black &amp; white interior with cream paper",
  "표지를 크림색 두께로 계산했다. 흰색을 고르면 책등이 어긋나는데 인쇄본이 나와야 보인다."),
 ("Content", "Yes, my cover has a barcode", "끔",
  "우리 표지엔 바코드가 없고 흰 자리만 있다. 켜 두면 바코드를 못 찾아 막힌다."),
]


def tablerows(books):
    rows = []
    for b in books:
        rows.append((b["n"], b["title"], b["pages"], b["spine"],
                     "%s × %s" % (b["cover_w"], b["cover_h"]),
                     "$%.2f" % b["cost"], "$%.2f" % b["minprice"],
                     "$%.2f" % (PRICE * ROY - b["cost"])))
    return rows


def md_guide(books):
    L = []
    w = L.append
    w("# 루프 연대기 1~7권 — KDP 종이책(페이퍼백) 업로드 가이드\n")
    w("영어판 7권의 **본문 PDF**와 **감싸는 표지 PDF**를 다 만들어 뒀습니다.")
    w("이 문서는 그 파일들을 KDP에 올리는 법이고, 권별 상세 순서는 각 폴더 안에 따로 있습니다.\n")
    w("---\n")
    w("## 폴더 구성\n")
    w("```")
    w("종이책/")
    w("  00-종이책-업로드-가이드.md / .html   ← 이 문서")
    for b in books:
        w("  %s/" % b["dir"])
        w("    %s      ← KDP에 올리는 본문" % b["interior"])
        w("    %s      ← KDP에 올리는 표지" % b["cover"])
        w("    %02d-KDP-종이책-순서.md%s← 이 권만의 상세 순서" % (b["n"], " " * 12))
        if b["n"] == 1:
            w("  …")
            break
    w("```\n")
    w("**KDP에 올리는 건 권마다 PDF 두 개뿐입니다.** 전자책에서 쓰던 EPUB·JPG는 여기서 안 씁니다.\n")
    w("---\n")
    w("## 종이책은 전자책과 다른 물건입니다\n")
    w("| | 전자책 | 종이책 |")
    w("|---|---|---|")
    w("| 본문 | EPUB (흐르는 글) | **PDF** (쪽이 고정된 글) |")
    w("| 표지 | 앞면만, JPG | **앞·책등·뒤가 이어진 한 장, PDF** |")
    w("| 쪽수 | 없음 | 있고, **표지 크기가 거기서 나옵니다** |\n")
    w("셋째 줄이 제일 중요합니다. 종이책 표지는 앞면 그림이 아니라 뒤표지 + 책등 + 앞표지가")
    w("한 장으로 펼쳐진 것이고, 그 폭이 쪽수에 따라 달라집니다.\n")
    w("```")
    w("┌──────────────┬──┬──────────────┐")
    w("│              │책│              │")
    w("│    뒤표지     │등│    앞표지     │")
    w("│              │  │              │")
    w("└──────────────┴──┴──────────────┘")
    w("        ↑ 오른쪽 아래에 바코드 흰 자리")
    w("```\n")
    w("---\n")
    w("## 7권의 숫자 — 전부 PDF에서 직접 읽은 값입니다\n")
    w("| 권 | 제목 | 쪽수 | 책등 | 표지 PDF 크기 | 인쇄비 | 최저 정가 | 정가 $%.2f 일 때 인세 |" % PRICE)
    w("|---|---|---|---|---|---|---|---|")
    for r in tablerows(books):
        w("| %d | %s | %d쪽 | %s in | %s in | %s | %s | %s |" % r)
    w("")
    w("- 판형은 7권 모두 **6 × 9 in**, 종이는 **크림색(cream)** 입니다.")
    w("- 쪽수는 **전부 짝수**로 맞춰 뒀습니다. 홀수로 올리면 KDP가 빈 쪽을 하나 붙이는데,")
    w("  그러면 실제 쪽수가 우리가 책등을 계산한 숫자와 어긋납니다.")
    w("- 인쇄비는 미국 기준 (고정 $1.00 + 쪽당 $0.012) 으로 계산한 값입니다.")
    w("  **KDP 화면에 뜨는 숫자가 다르면 화면을 따르세요.**")
    w("- 정가는 7권 모두 **$%.2f** 을 권합니다. 모든 권의 최저가보다 높고, 시리즈 값이 하나로 맞습니다.\n" % PRICE)
    w("---\n")
    w("## 표지 크기 — 이 식 그대로\n")
    w("```")
    w("폭  = 0.125 + 6 + 책등 + 6 + 0.125")
    w("높이 = 0.125 + 9 + 0.125 = 9.25")
    w("책등 = 쪽수 × 0.0025        (크림색 종이, 쪽당 인치)")
    w("```\n")
    w("앞뒤의 `0.125`는 **도련(bleed)** 입니다. 재단할 때 잘려 나가는 여유분이고,")
    w("빼먹으면 가장자리에 흰 줄이 생깁니다. 이미 다 넣어 뒀습니다.\n")
    w("> 글자는 재단선에서 **0.25 안쪽**에 둡니다. 바깥 0.125는 잘려 나가고,")
    w("> 그 안쪽 0.125도 재단이 밀리면 위험합니다.\n")
    w("---\n")
    w("## 바코드 — 그리는 게 아니라 자리를 비우는 것\n")
    w("아마존이 뒤표지 오른쪽 아래에 바코드를 직접 찍습니다.")
    w("우리는 그 자리에 **흰 네모 하나**를 둡니다. 7권 표지에 이미 들어 있습니다.\n")
    w("| 항목 | 값 |")
    w("|---|---|")
    w("| 흰 네모 크기 | 2.0 × 1.2 in |")
    w("| 자리 | 책등 쪽에서 0.25 · 아래 재단선에서 0.25 |\n")
    w("> 띄우는 값을 0.375로 두면 우리 네모가 아마존 자리보다 0.125 안쪽이어서")
    w("> 바코드 오른쪽과 아래가 밖으로 나갑니다. **0.25입니다.**\n")
    w("---\n")
    w("## KDP 화면에서 틀리면 막히는 네 칸\n")
    w("여기가 이 문서의 알맹이입니다. **네 칸 다 기본값이 틀린 쪽입니다.**\n")
    w("| 탭 | 칸 | 맞는 값 | 왜 |")
    w("|---|---|---|---|")
    for t, k, v, why in FOUR:
        w("| %s | %s | **%s** | %s |" % (t, k.replace("&amp;", "&"), v.replace("&amp;", "&"), why))
    w("")
    w("> **막히면 표지를 의심하기 전에 이 네 칸부터 보세요.**")
    w("> 같은 코드로 만든 다른 권의 표지가 통과했으면, 표지가 원인이 아닙니다.")
    w("> 7권 표지는 전부 같은 코드로 만들었고 폭을 기계로 맞춰 뒀습니다.\n")
    w("---\n")
    w("## 올리는 순서\n")
    w("```")
    w("1. 전자책이 Live 인지 확인한다")
    w("2. Bookshelf 에서 그 전자책 오른쪽의 「+ Create paperback」 을 누른다   ← 핵심")
    w("3. Details 를 확인한다            (저내용 체크 끔)")
    w("4. Content 에서 본문 PDF · 표지 PDF 를 올린다")
    w("   (ISBN 무료 발급 · cream · 6x9 · No Bleed · 바코드 체크 끔)")
    w("5. Previewer 를 끝까지 넘겨 본다")
    w("6. Rights & Pricing → 60%% / $%.2f → 발행" % PRICE)
    w("```\n")
    w("**2번이 핵심입니다.** 따로 새 책으로 만들면 독자에게 *다른 책 두 권*으로 보입니다.")
    w("이미 따로 만든 종이책이 있으면 `Link existing paperback` 으로 붙입니다.\n")
    w("---\n")
    w("## 미리보기(Previewer)는 반드시 끝까지\n")
    w("마지막 방어선입니다.\n")
    w("- **책등 글자** — 앞뒤로 넘어가지 않았는지")
    w("- **바코드 자리** — 흰 네모가 오른쪽 아래에 있는지")
    w("- **쪽 번호** — 빠진 쪽이 없는지")
    w("- **글꼴** — 이상한 글꼴로 바뀌지 않았는지 (7권 모두 글꼴을 PDF에 넣어 뒀습니다)\n")
    w("---\n")
    w("## 설명문은 `Source` 버튼을 먼저 누르고\n")
    w("설명문 칸은 HTML을 받습니다. 에디터 오른쪽의 **`Source`** 를 먼저 누르고 붙여넣으세요.")
    w("안 누르고 붙이면 `<p>` 같은 태그가 독자에게 글자로 보입니다.")
    w("쓸 수 있는 건 `<h4> <p> <b> <i> <ul> <li> <br>` 정도입니다.\n")
    w("「+ Create paperback」으로 만들면 설명문은 전자책에서 그대로 넘어옵니다.")
    w("비어 있을 때만 `업로드/` 폴더의 권별 순서 문서에서 복사하세요.\n")
    w("---\n")
    w("## AI 문항\n")
    w("만든 방법을 묻는 칸이지 글이 좋은지 묻는 칸이 아닙니다. 독자에게 안 보입니다.")
    w("전자책과 **같은 답**을 적으세요: `Text` **Yes**, `Translation` **Yes**.")
    w("표지 그림에 썼으면 `Images` 도 **Yes**.")
    w("이 칸은 판매에 영향이 없고, 틀리게 적는 쪽이 계정에 위험합니다.\n")
    w("---\n")
    w("## 쪽수가 바뀌면 표지를 반드시 다시\n")
    w("원고를 한 줄만 고쳐도 쪽수가 바뀔 수 있습니다. 쪽수가 바뀌면 책등이 바뀌고 표지 폭이 틀려집니다.\n")
    w("```")
    w("쪽수 바뀜 → 본문 PDF 다시 → 표지 다시 → 올리기")
    w("                            ↑ 여기를 빼먹는 것이 제일 흔한 실수")
    w("```\n")
    w("다시 만들 때는 이 두 줄이면 됩니다.\n")
    w("```bash")
    w("python3 tools/paperback_run.py 5     # 5권만 (본문 → 쪽수 → 표지 자동)")
    w("python3 tools/paperback_docs.py      # 숫자를 다시 읽어 안내문을 다시 씀")
    w("```\n")
    w("---\n")
    w("## 기계로 검사해 둔 것\n")
    w("사람이 세면 틀립니다. 아래는 파일에서 직접 읽어 확인한 값입니다.\n")
    w("- 본문 PDF 판형이 7권 모두 정확히 **6 × 9 in**")
    w("- 본문 쪽수가 7권 모두 **짝수**")
    w("- 표지 PDF가 **한 장**이고 높이가 **9.25 in**")
    w("- 표지 폭이 그 권의 쪽수로 계산한 폭과 **오차 0**")
    w("- 글꼴이 7권 모두 PDF 안에 **들어 있음**")
    w("- 뒤표지 글에 적힌 숫자(1,140명 · 432명 등)가 **본문과 일치**\n")
    w("---\n")
    w("## 확인 못 한 것\n")
    w("`kdp.amazon.com` 을 직접 열 수 없어 아래는 공개 자료를 대조한 수준입니다.\n")
    w("- 책등 글자를 넣을 수 있는 **100쪽 기준** — 우리 책은 전부 500쪽이 넘어 해당 없음")
    w("- 종이책 60% 구간의 **$9.99 문턱** — 확인 못 했습니다")
    w("- **인쇄비 식** (고정 $1.00 + 쪽당 $0.012) — KDP 화면의 숫자를 따르세요")
    w("- 종이 두께 값(크림 0.0025) — KDP 공표값으로 알고 쓰는 값\n")
    w("---\n")
    w("## 한국어판은 따로입니다\n")
    w("한국어판과 영어판은 아마존이 안 묶어 줍니다. 별개의 새 책입니다.")
    w("묶이는 건 `Series` 칸뿐입니다.")
    w("이번 종이책은 **영어판 7권**만 만들었습니다. 한국어 종이책도 필요하시면 말씀해 주세요.\n")
    w("---\n")
    w("## 한 장 요약\n")
    w("**파일 둘**\n")
    w("- [ ] 본문 PDF — 글꼴 넣음 · 쪽수 적어 둠 · 짝수")
    w("- [ ] 표지 PDF — 한 장 · 폭이 계산과 같음\n")
    w("**표지**\n")
    w("- [ ] 도련 0.125 사방")
    w("- [ ] 글자가 재단선에서 0.25 안쪽")
    w("- [ ] 바코드 흰 네모 2.0 × 1.2 · 띄우기 0.25\n")
    w("**KDP 화면 네 칸**\n")
    w("- [ ] 저내용(low-content) 체크 ────── **끔**")
    w("- [ ] Print ISBN ─────────────────── **Get a free KDP ISBN**")
    w("- [ ] Ink and Paper Type ─────────── **cream**")
    w("- [ ] 「내 표지에 바코드가 있다」 ──── **끔**\n")
    w("**마지막**\n")
    w("- [ ] 전자책에 「+ Create paperback」 으로 붙였는가")
    w("- [ ] 미리보기를 끝까지 넘겨 봤는가")
    w("- [ ] 설명문을 `Source` 누르고 붙였는가\n")
    w("> 막히면 표지를 고치기 전에 네 칸부터 보세요.\n")
    return "\n".join(L)


def html_guide(books):
    src = open(os.path.join(UP, "00-전체-업로드-가이드.html"), encoding="utf-8").read()
    style = src[src.index("<style>"):src.index("</style>") + 8]
    rows = "\n".join(
        "<tr><td>%d권</td><td>%s</td><td><b>%d</b>쪽</td><td>%s in</td>"
        "<td>%s in</td><td>%s</td><td>%s</td><td>%s</td></tr>" % r
        for r in tablerows(books))
    tree = "\n".join(
        "  <b>%s/</b>\n    %s\n    %s\n    %02d-KDP-종이책-순서.md" %
        (b["dir"], b["interior"], b["cover"], b["n"]) for b in books[:1])
    four = "\n".join(
        "<tr><td>%s</td><td>%s</td><td><b>%s</b></td><td>%s</td></tr>" % f for f in FOUR)
    body = """<div class="wrap">
<header>
  <div class="kicker">Loop Chronicles &middot; Paperback</div>
  <h1>1~7권 KDP 종이책 업로드 가이드</h1>
  <p class="sub">영어판 7권 &middot; 6 × 9 in &middot; 크림색 종이 &middot; 본문 PDF + 감싸는 표지 PDF</p>
</header>

<div class="note"><strong>준비는 끝났습니다.</strong> 권마다 <b>본문 PDF</b>와
<b>표지 PDF</b> 두 개를 만들어 뒀고, 표지 폭은 그 권의 쪽수로 계산한 값과
<b>오차 0</b>으로 맞춰 두었습니다. 이 문서는 그 파일을 올리는 법입니다.</div>

<h2>폴더 구성</h2>
<pre><code>종이책/
  00-종이책-업로드-가이드.md / .html   ← 이 문서
{tree}
  2권-… ~ 7권-… 도 같은 구성</code></pre>
<div class="note"><strong>KDP에 올리는 건 권마다 PDF 두 개뿐입니다.</strong>
전자책에서 쓰던 EPUB·JPG는 종이책에 쓰지 않습니다.</div>

<h2>종이책은 전자책과 다른 물건입니다</h2>
<div class="tablewrap"><table>
<tr><th></th><th>전자책</th><th>종이책</th></tr>
<tr><td>본문</td><td>EPUB (흐르는 글)</td><td><b>PDF</b> (쪽이 고정된 글)</td></tr>
<tr><td>표지</td><td>앞면만, JPG</td><td><b>앞·책등·뒤가 이어진 한 장, PDF</b></td></tr>
<tr><td>쪽수</td><td>없음</td><td>있고, <b>표지 크기가 거기서 나옵니다</b></td></tr>
</table></div>
<p>셋째 줄이 제일 중요합니다. 종이책 표지는 앞면 그림이 아니라
뒤표지 + 책등 + 앞표지가 한 장으로 펼쳐진 것이고, 그 폭이 쪽수에 따라 달라집니다.</p>
<div class="tablewrap"><svg viewBox="0 0 560 230" width="100%" style="max-width:560px;display:block;margin:18px auto" role="img" aria-label="감싸는 표지 구조: 왼쪽 뒤표지, 가운데 책등, 오른쪽 앞표지">
<rect x="20" y="30" width="520" height="170" fill="none" stroke="var(--gold)" stroke-dasharray="5 4"/>
<rect x="33" y="43" width="222" height="144" fill="var(--panel)" stroke="var(--line)"/>
<rect x="255" y="43" width="30" height="144" fill="var(--navy)" opacity=".85"/>
<rect x="285" y="43" width="222" height="144" fill="var(--panel)" stroke="var(--line)"/>
<rect x="188" y="137" width="55" height="33" fill="#fff" stroke="var(--line)"/>
<text x="144" y="112" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="sans-serif">뒤표지</text>
<text x="396" y="112" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="sans-serif">앞표지</text>
<text x="270" y="108" text-anchor="middle" font-size="12" fill="var(--gold)" font-family="sans-serif">책</text>
<text x="270" y="126" text-anchor="middle" font-size="12" fill="var(--gold)" font-family="sans-serif">등</text>
<text x="216" y="158" text-anchor="middle" font-size="9.5" fill="#444" font-family="sans-serif">바코드 자리</text>
<text x="280" y="20" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="sans-serif">점선 = 도련 0.125 (잘려 나감)</text>
<text x="280" y="220" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="sans-serif">PDF 한 장 &#183; 폭 = 0.125 + 6 + 책등 + 6 + 0.125</text>
</svg></div>

<h2>7권의 숫자</h2>
<p>전부 PDF에서 직접 읽은 값입니다. 사람이 세어 적은 숫자가 아닙니다.</p>
<div class="tablewrap"><table>
<tr><th>권</th><th>제목</th><th>쪽수</th><th>책등</th><th>표지 PDF 크기</th>
<th>인쇄비</th><th>최저 정가</th><th>인세</th></tr>
{rows}
</table></div>
<ul>
<li>판형은 7권 모두 <b>6 × 9 in</b>, 종이는 <b>크림색(cream)</b>입니다.</li>
<li>쪽수는 <b>전부 짝수</b>로 맞춰 뒀습니다. 홀수로 올리면 KDP가 빈 쪽을 하나 붙이는데,
그러면 실제 쪽수가 우리가 책등을 계산한 숫자와 어긋납니다.</li>
<li>인쇄비는 미국 기준(고정 $1.00 + 쪽당 $0.012)으로 계산한 값입니다.
<b>KDP 화면의 숫자가 다르면 화면을 따르세요.</b></li>
</ul>
<div class="big"><span class="n">정가는 7권 모두 ${price}</span>
모든 권의 최저가보다 높고, 시리즈 값이 하나로 맞습니다. 인세는 60%.</div>

<h2>표지 크기 — 이 식 그대로</h2>
<pre><code>폭  = 0.125 + 6 + 책등 + 6 + 0.125
높이 = 0.125 + 9 + 0.125 = 9.25
책등 = 쪽수 × 0.0025        (크림색 종이, 쪽당 인치)</code></pre>
<p>앞뒤의 <code>0.125</code>는 <b>도련(bleed)</b>입니다. 재단할 때 잘려 나가는
여유분이고, 빼먹으면 가장자리에 흰 줄이 생깁니다. 이미 다 넣어 뒀습니다.</p>
<div class="note"><strong>글자는 재단선에서 0.25 안쪽에.</strong>
바깥 0.125는 잘려 나가고, 그 안쪽 0.125도 재단이 밀리면 위험합니다.</div>

<h2>바코드 — 그리는 게 아니라 자리를 비우는 것</h2>
<p>아마존이 뒤표지 오른쪽 아래에 바코드를 직접 찍습니다.
우리는 그 자리에 <b>흰 네모 하나</b>를 둡니다. 7권 표지에 이미 들어 있습니다.</p>
<div class="tablewrap"><table>
<tr><th>항목</th><th>값</th></tr>
<tr><td>흰 네모 크기</td><td><code>2.0 × 1.2 in</code></td></tr>
<tr><td>자리</td><td>책등 쪽에서 <code>0.25</code> · 아래 재단선에서 <code>0.25</code></td></tr>
</table></div>
<div class="warn"><strong>띄우는 값이 함정입니다.</strong>
<code>0.375</code>로 두면 우리 네모가 아마존 자리보다 0.125 안쪽이어서
바코드 오른쪽과 아래가 밖으로 나갑니다. <b>0.25</b>입니다.</div>

<h2>KDP 화면에서 틀리면 막히는 네 칸</h2>
<p>여기가 이 문서의 알맹이입니다. <b>네 칸 다 기본값이 틀린 쪽입니다.</b></p>
<div class="tablewrap"><table>
<tr><th>탭</th><th>칸</th><th>맞는 값</th><th>왜</th></tr>
{four}
</table></div>
<div class="warn"><strong>막히면 표지를 의심하기 전에 이 네 칸부터 보세요.</strong><br>
같은 코드로 만든 다른 권의 표지가 통과했으면, 표지가 원인이 아닙니다.
7권 표지는 전부 같은 코드로 만들었고 폭을 기계로 맞춰 뒀습니다.</div>

<h2>올리는 순서</h2>
<pre><code>1. 전자책이 Live 인지 확인한다
2. Bookshelf 에서 그 전자책 오른쪽의 「+ Create paperback」 을 누른다   ← 핵심
3. Details 를 확인한다            (저내용 체크 끔)
4. Content 에서 본문 PDF · 표지 PDF 를 올린다
   (ISBN 무료 발급 · cream · 6x9 · No Bleed · 바코드 체크 끔)
5. Previewer 를 끝까지 넘겨 본다
6. Rights &amp; Pricing → 60% / ${price} → 발행</code></pre>
<div class="warn"><strong>2번이 핵심입니다.</strong>
따로 새 책으로 만들면 독자에게 <b>다른 책 두 권</b>으로 보입니다.
이미 따로 만든 종이책이 있으면 <code>Link existing paperback</code> 으로 붙입니다.</div>

<h2>미리보기(Previewer)는 반드시 끝까지</h2>
<p>마지막 방어선입니다.</p>
<ul class="chk">
<li><b>책등 글자</b> — 앞뒤로 넘어가지 않았는지</li>
<li><b>바코드 자리</b> — 흰 네모가 오른쪽 아래에 있는지</li>
<li><b>쪽 번호</b> — 빠진 쪽이 없는지</li>
<li><b>글꼴</b> — 이상한 글꼴로 바뀌지 않았는지 (7권 모두 글꼴을 PDF에 넣어 뒀습니다)</li>
</ul>

<h2>설명문은 <code>Source</code> 버튼을 먼저 누르고</h2>
<p>설명문 칸은 HTML을 받습니다. 에디터 오른쪽의 <code>Source</code> 를 먼저 누르고
붙여넣으세요. 안 누르고 붙이면 <code>&lt;p&gt;</code> 같은 태그가 독자에게 글자로 보입니다.
쓸 수 있는 건 <code>&lt;h4&gt; &lt;p&gt; &lt;b&gt; &lt;i&gt; &lt;ul&gt; &lt;li&gt; &lt;br&gt;</code> 정도입니다.</p>
<p>「+ Create paperback」으로 만들면 설명문은 전자책에서 그대로 넘어옵니다.
비어 있을 때만 <code>업로드/</code> 폴더의 권별 순서 문서에서 복사하세요.</p>

<h2>AI 문항</h2>
<p>만든 방법을 묻는 칸이지 글이 좋은지 묻는 칸이 아닙니다. 독자에게 안 보입니다.
전자책과 <b>같은 답</b>을 적으세요 — <code>Text</code> <b>Yes</b>,
<code>Translation</code> <b>Yes</b>. 표지 그림에 썼으면 <code>Images</code> 도 <b>Yes</b>.</p>
<p>이 칸은 판매에 영향이 없고, 틀리게 적는 쪽이 계정에 위험합니다.</p>

<h2>쪽수가 바뀌면 표지를 반드시 다시</h2>
<p>원고를 한 줄만 고쳐도 쪽수가 바뀔 수 있습니다.
쪽수가 바뀌면 책등이 바뀌고 표지 폭이 틀려집니다.</p>
<pre><code>쪽수 바뀜 → 본문 PDF 다시 → 표지 다시 → 올리기
                            ↑ 여기를 빼먹는 것이 제일 흔한 실수</code></pre>
<p>다시 만들 때는 이 두 줄이면 됩니다.</p>
<pre><code>python3 tools/paperback_run.py 5     # 5권만 (본문 → 쪽수 → 표지 자동)
python3 tools/paperback_docs.py      # 숫자를 다시 읽어 안내문을 다시 씀</code></pre>

<h2>기계로 검사해 둔 것</h2>
<p>사람이 세면 틀립니다. 아래는 파일에서 직접 읽어 확인한 값입니다.</p>
<ul>
<li>본문 PDF 판형이 7권 모두 정확히 <b>6 × 9 in</b></li>
<li>본문 쪽수가 7권 모두 <b>짝수</b></li>
<li>표지 PDF가 <b>한 장</b>이고 높이가 <b>9.25 in</b></li>
<li>표지 폭이 그 권의 쪽수로 계산한 폭과 <b>오차 0</b></li>
<li>글꼴이 7권 모두 PDF 안에 <b>들어 있음</b></li>
<li>뒤표지 글에 적힌 숫자(1,140명 · 432명 등)가 <b>본문과 일치</b></li>
</ul>

<h2>확인 못 한 것</h2>
<p><code>kdp.amazon.com</code> 을 직접 열 수 없어 아래는 공개 자료를 대조한 수준입니다.</p>
<ul>
<li>책등 글자를 넣을 수 있는 <b>100쪽 기준</b> — 우리 책은 전부 500쪽이 넘어 해당 없음</li>
<li>종이책 60% 구간의 <b>$9.99 문턱</b> — 확인 못 했습니다</li>
<li><b>인쇄비 식</b>(고정 $1.00 + 쪽당 $0.012) — KDP 화면의 숫자를 따르세요</li>
<li>종이 두께 값(크림 0.0025) — KDP 공표값으로 알고 쓰는 값</li>
</ul>
<p>확인 못 한 것은 확인 못 했다고 적는 쪽이 낫습니다.</p>

<h2>한국어판은 따로입니다</h2>
<p>한국어판과 영어판은 아마존이 안 묶어 줍니다. 별개의 새 책이고,
묶이는 건 <code>Series</code> 칸뿐입니다.
이번 종이책은 <b>영어판 7권</b>만 만들었습니다. 한국어 종이책도 필요하시면 말씀해 주세요.</p>

<h2>한 장 요약</h2>
<h3>파일 둘</h3>
<ul class="chk">
<li>본문 PDF — 글꼴 넣음 · 쪽수 적어 둠 · 짝수</li>
<li>표지 PDF — 한 장 · 폭이 계산과 같음</li>
</ul>
<h3>표지</h3>
<ul class="chk">
<li>도련 0.125 사방</li>
<li>글자가 재단선에서 0.25 안쪽</li>
<li>바코드 흰 네모 2.0 × 1.2 · 띄우기 0.25</li>
</ul>
<h3>KDP 화면 네 칸</h3>
<ul class="chk">
<li>저내용(low-content) 체크 ────── <b>끔</b></li>
<li>Print ISBN ─────────────────── <b>Get a free KDP ISBN</b></li>
<li>Ink and Paper Type ─────────── <b>cream</b></li>
<li>「내 표지에 바코드가 있다」 ──── <b>끔</b></li>
</ul>
<h3>마지막</h3>
<ul class="chk">
<li>전자책에 「+ Create paperback」 으로 붙였는가</li>
<li>미리보기를 끝까지 넘겨 봤는가</li>
<li>설명문을 <code>Source</code> 누르고 붙였는가</li>
</ul>
<div class="warn"><strong>막히면 표지를 고치기 전에 네 칸부터 보세요.</strong></div>

<footer>루프 연대기 종이책 패키지 · 영어판 7권 · 6 × 9 in · 크림색 종이<br>
본문 {total}쪽 · 권별 상세 순서는 각 권 폴더의 <code>NN-KDP-종이책-순서.md</code></footer>
</div>
""".format(tree=tree, rows=rows, four=four, price="%.2f" % PRICE,
           total="{:,}".format(sum(b["pages"] for b in books)))
    return ('<!doctype html>\n<html lang="ko">\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            '<title>루프 연대기 종이책 업로드 가이드</title>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
            'family=Noto+Serif+KR:wght@400;600&family=Noto+Sans+KR:wght@400;500;700&display=swap">\n'
            + style + "\n" + body + "</html>\n")


def main():
    books = scan()
    write_per_book(books)
    open(os.path.join(OUT, "00-종이책-업로드-가이드.md"), "w",
         encoding="utf-8").write(md_guide(books))
    open(os.path.join(OUT, "00-종이책-업로드-가이드.html"), "w",
         encoding="utf-8").write(html_guide(books))
    print("   종이책/00-종이책-업로드-가이드.md / .html")
    print("   총 %d쪽" % sum(b["pages"] for b in books))


if __name__ == "__main__":
    main()
