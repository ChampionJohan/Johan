---
title: 인쇄용 업로드 세트 — 네 권 (본문 + 겉표지)
date: 2026-09-11
---

# 파일 여덟 개

`release/paperback/` 한 폴더에 모았습니다. **본문과 겉표지가 짝으로 들어 있습니다.**

```
01_Whos-Actually-Paying_interior-366p.pdf
01_Whos-Actually-Paying_cover-366p-cream.pdf

02_The-Fourth-Box_interior-358p.pdf
02_The-Fourth-Box_cover-358p-cream.pdf

03_Its-Free-So-How-Are-They-Rich_interior-115p.pdf
03_Its-Free-So-How-Are-They-Rich_cover-115p-cream.pdf

04_I-Started-So-Why-Isnt-It-Working_interior-185p.pdf
04_I-Started-So-Why-Isnt-It-Working_cover-185p-cream.pdf
```

**파일 이름에 쪽수와 종이를 박아 뒀습니다.**
`115p` 끼리, `cream` 끼리만 짝이 맞습니다.
이번에 나신 오류가 정확히 이 짝이 어긋나서 생긴 것이라, 이름만 봐도 걸러지게 했습니다.

---

# 한 권씩 — 차례대로

## 01 · Who's Actually Paying?

| 단계 | 넣을 값 |
|---|---|
| **1. 언어** | English |
| **2. 제목** | `Who's Actually Paying?` |
| **2. 부제** | `Take Any Business Apart in Five Questions` |
| **2. 시리즈** | `The Five Boxes` · 순번 `1` · Main content |
| **2. 지은이** | `Jaehyuk` / `Choi` |
| **3. ISBN** | **`Get a free KDP ISBN`** |
| **4. 판형** | **6 × 9 in** |
| **5. Bleed** | **No bleed** |
| **6. 용지** | **Black & white interior with cream paper** |
| **7. 본문** | `01_Whos-Actually-Paying_interior-366p.pdf` |
| **8. 겉표지** | `01_Whos-Actually-Paying_cover-366p-cream.pdf` |
| **9. 표지 마감** | Matte |
| **10. 정가** | 아래 「값」 참고 |

## 02 · The Fourth Box

| 단계 | 넣을 값 |
|---|---|
| 제목 | `The Fourth Box` |
| 부제 | `Why Some Businesses Can't Be Taken` |
| 시리즈 | `The Five Boxes` · 순번 `2` · Main content |
| 본문 | `02_The-Fourth-Box_interior-358p.pdf` |
| 겉표지 | `02_The-Fourth-Box_cover-358p-cream.pdf` |

판형·용지·ISBN·마감은 01과 **전부 동일**합니다.

## 03 · It's Free. So How Are They Rich?

| 단계 | 넣을 값 |
|---|---|
| 제목 | `It's Free. So How Are They Rich?` |
| 부제 | `How Money Actually Works — and How to Start` |
| 시리즈 | `The Five Boxes: Teen Edition` · 순번 `1` · Main content |
| 본문 | `03_Its-Free-So-How-Are-They-Rich_interior-115p.pdf` |
| 겉표지 | `03_Its-Free-So-How-Are-They-Rich_cover-115p-cream.pdf` |

**청소년판은 시리즈가 다릅니다.** 성인판 시리즈에 붙이지 마세요.

## 04 · I Started. So Why Isn't It Working?

| 단계 | 넣을 값 |
|---|---|
| 제목 | `I Started. So Why Isn't It Working?` |
| 부제 | `The Part Nobody Warns You About` |
| 시리즈 | `The Five Boxes: Teen Edition` · 순번 `2` · Main content |
| 본문 | `04_I-Started-So-Why-Isnt-It-Working_interior-185p.pdf` |
| 겉표지 | `04_I-Started-So-Why-Isnt-It-Working_cover-185p-cream.pdf` |

---

# 순서를 지켜야 하는 이유

**표지 크기는 본문 쪽수와 용지가 정해져야 계산됩니다.**
그래서 화면 순서를 건너뛰면 안 됩니다.

```
판형 6×9  →  Bleed 없음  →  용지 미색지  →  본문 PDF  →  그다음에 겉표지
```

용지를 고르는 칸이 표지보다 **앞에** 있는 이유가 이것입니다.
미색지와 백색지는 종이 두께가 달라서 책등이 달라지고, 책등이 달라지면 표지 폭이 달라집니다.

**본문을 올리고 나면 KDP가 요구 크기를 다시 계산해서 보여 줍니다.**
그 숫자가 아래 표와 같으면 제대로 간 것입니다.

| 책 | 쪽수 | KDP가 요구할 크기 | 우리 표지 |
|---|---|---|---|
| 01 | 366 | 13.165 × 9.250 | **13.1650 × 9.2500** |
| 02 | 358 | 13.145 × 9.250 | **13.1450 × 9.2500** |
| 03 | 115 | 12.5375 × 9.250 | **12.5375 × 9.2500** |
| 04 | 185 | 12.7125 × 9.250 | **12.7125 × 9.2500** |

숫자가 다르게 나오면 **본문이 우리 파일이 아니거나 용지를 백색지로 고르신 것**입니다.
그 두 가지 말고 다른 이유는 없습니다.

---

# 미리 확인해 둔 것

올리기 전에 네 권 전부 검사했습니다.

## 본문

| 항목 | KDP 기준 | 우리 파일 |
|---|---|---|
| 판형 | — | **6 × 9 in** (네 권 전부) |
| 안쪽(제본) 여백 | 366·358쪽은 0.625 / 185쪽은 0.5 / 115쪽은 0.375 | **0.84 in** (전부) |
| 재단선에서 모든 내용 | 0.25 in 이상 | **0.40 in** (전부) |
| 글꼴 | 내장 필수 | **전부 내장** |
| 차례 쪽 번호 | — | 실제 쪽과 일치하도록 수렴 계산 |

## 겉표지

| 항목 | 확인 |
|---|---|
| 형식 | PDF, **한 쪽짜리** |
| 구성 | 뒤표지 + 책등 + 앞표지 한 장 |
| 도련 | 사방 0.125 in 포함 |
| 책등 글자 | 네 권 다 100쪽 넘어서 허용 |
| 바코드 자리 | 뒤표지 오른쪽 아래 2 × 1.2 in 흰색으로 비움 |

---

# 겉표지에 무엇이 있나

**앞표지** — 전자책 표지와 같은 디자인입니다. 다섯 칸 중 그 책의 칸이 채워져 있습니다.
01은 1번 Customer, 02는 4번 Moat, 03은 3번 Payment, 04는 5번 Fault Line.

**책등** — 제목(가운데)과 지은이(아래). 영어권 관례대로 위에서 아래로 읽힙니다.

**뒤표지** — 짧은 소개글. 청소년판에는 `AGES 12–18` 이 들어 있습니다.
오른쪽 아래 흰 칸이 바코드 자리입니다. **비워 둔 것이지 빠뜨린 것이 아닙니다.**

---

# 값 — 종이책 정가

전자책보다 **눈에 띄게 높아야** 합니다. 인쇄비가 있어서 어차피 그렇게 됩니다.

| 책 | 쪽수 | 전자책 | 권하는 종이책 값 |
|---|---|---|---|
| 01 | 366 | $5.99 | **$14.99** |
| 02 | 358 | $6.99 | **$14.99** |
| 03 | 115 | $3.99 | **$8.99** |
| 04 | 185 | $4.99 | **$10.99** |

KDP가 인쇄비를 계산해서 화면에 보여 줍니다.
**정가에서 인쇄비를 뺀 뒤 60%가 인세**입니다(아마존 판매 기준).
위 값이면 네 권 다 남습니다. 화면에 뜨는 숫자를 보고 조금씩 조정하세요.

---

# 종이를 백색지로 하고 싶으시면

표지를 다시 만들어야 합니다. 한 줄이면 됩니다.

```
python3 tools/wrap_cover.py en-book   366 --paper white
python3 tools/wrap_cover.py en-book2  358 --paper white
python3 tools/wrap_cover.py en-teen   115 --paper white
python3 tools/wrap_cover.py en-teen2  185 --paper white
```

**미색지를 권합니다.** 글자만 있는 책은 미색이 눈에 편하고, 이런 종류의 논픽션에서 흔합니다.

---

# 마지막 점검

- [ ] 본문에 **PDF**를 올렸는가 (EPUB 아님)
- [ ] 파일 이름의 쪽수가 짝이 맞는가 (`115p` ↔ `115p`)
- [ ] 용지를 **미색지**로 골랐는가 (표지가 미색지 기준)
- [ ] KDP가 보여 준 요구 크기가 위 표와 같은가
- [ ] 미리보기에서 바코드가 **뒤표지 오른쪽 아래**에 앉았는가
- [ ] 책등 글자가 접히는 선을 안 넘는가
- [ ] 시리즈가 성인판과 청소년판으로 갈려 있는가

전자책은 이것과 **별개 상품**입니다. 이미 올리신 EPUB과 JPG는 그대로 두세요.
