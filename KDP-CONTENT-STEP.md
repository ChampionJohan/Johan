---
title: KDP Content 단계 — 화면 설명과 표지
date: 2026-09-10
---

# 이 화면이 무엇인지

앞 화면(Details)에서 **책 정보**를 넣었다면, 이 화면(Content)은 **파일**을 넣는 자리입니다.
칸이 넷 나옵니다.

| 칸 | 무엇을 넣나 | 필수인가 |
|---|---|---|
| Kindle eBook Cover | 표지 이미지 | **필수** |
| Kindle eBook ISBN | 국제 표준 도서 번호 | 아니오 — 비워 두세요 |
| Publisher | 출판사 이름 | 아니오 |
| Accessibility Features | 접근성 정보 | **답은 해야 함** |

하나씩 봅니다.

---

## Kindle eBook Cover

두 가지 중에 고르는 화면입니다.

**`Use Cover Creator to make your book cover`** (지금 선택돼 있는 쪽)
KDP가 제공하는 표지 만들기 도구입니다. 무료이고 쓸 만한데, 템플릿이 정해져 있어서
아마존에 같은 틀의 표지가 아주 많습니다.

**`Upload a cover you already have (JPG/TIFF only)`** ← **이쪽을 고르세요.**
표지를 만들어 드렸습니다. 아래 「표지」 항목을 보세요.

> 표지는 **발행 후에도 바꿀 수 있습니다.** 제목과 달리 되돌릴 수 있으니
> 지금 것으로 올리고 나중에 더 나은 게 나오면 교체하시면 됩니다.

---

## Kindle eBook ISBN — 비워 두세요

**전자책에는 ISBN이 필요 없습니다.** 화면에도 그렇게 적혀 있습니다.
아마존이 ASIN이라는 자체 번호를 자동으로 붙여 줍니다.

- 이미 산 ISBN이 있으면 넣어도 됩니다. 없으면 그냥 비웁니다
- **종이책(페이퍼백)은 다릅니다.** 그때는 KDP가 무료 ISBN을 줍니다
- 전자책과 종이책에 **같은 ISBN을 쓰면 안 됩니다.** 형식이 다르면 다른 번호입니다

## Publisher — 선택입니다

출판사 이름을 적는 칸인데, 1인 출판이면 **비워 두거나 본인 이름을 적습니다.**

비워 두면 아마존 상세 페이지에 출판사 줄이 안 나옵니다. 문제 되지 않습니다.
브랜드로 쓰고 싶은 이름이 있으면 적으세요. 다만 **없는 회사 이름을 지어내면 안 됩니다.**

네 권을 한 시리즈로 낼 거라면 **네 권 모두 같은 값**으로 맞추세요.

---

## Accessibility Features — 이 책들은 답이 정해져 있습니다

시각장애가 있는 독자가 화면 낭독기로 읽을 수 있는지를 아마존이 상세 페이지에
표시해 주려고 묻는 항목입니다. 2025년부터 유럽 접근성 법 때문에 생겼습니다.

질문은 **"이미지에 대체 텍스트가 있는가"** 입니다.

네 권 모두 **본문에 이미지가 하나도 없습니다.** 표, 글, 표지뿐입니다.
표지는 '정보를 전달하는 이미지(informative image)'로 치지 않습니다.

그러니 답은 이것입니다.

> **`All informative images include alternative text and/or extended description.`**

정보를 담은 이미지가 아예 없으니 "전부 포함"이 참입니다.
지금 골라져 있는 `I don't know`(모르겠다)로 두면 상세 페이지에 **"접근성 정보 없음"**
으로 표시됩니다. 아는 것을 모른다고 둘 이유가 없습니다.

그 아래 노란 상자의 **`By clicking this, I confirm that my answers are accurate`**
체크박스도 눌러야 다음으로 넘어갑니다.

---

# 표지 — 네 권 전부 만들었습니다

`release/covers/` 아래에 있습니다. **1600 × 2560 픽셀, JPG** — KDP 권장 규격입니다.

| 파일 | 책 |
|---|---|
| `01_Whos-Actually-Paying-cover.jpg` | 성인판 1권 |
| `02_The-Fourth-Box-cover.jpg` | 성인판 2권 |
| `03_Its-Free-So-How-Are-They-Rich-cover.jpg` | 청소년판 1권 |
| `04_I-Started-So-Why-Isnt-It-Working-cover.jpg` | 청소년판 2권 |

## 어떻게 만들었나

**표지의 그림 요소가 다섯 칸입니다.** 다섯 개의 네모를 나란히 놓고,
그 책이 파고드는 칸 하나만 색으로 채웠습니다.

| 책 | 채운 칸 | 이유 |
|---|---|---|
| Who's Actually Paying? | **1 · Customer** | 제목이 곧 첫째 칸의 질문입니다 |
| The Fourth Box | **4 · Moat** | 제목이 곧 넷째 칸입니다 |
| It's Free. So How Are They Rich? | **3 · Payment** | 공짜인데 어떻게 버는가 — 셋째 칸 |
| I Started. So Why Isn't It Working? | **5 · Fault Line** | 시작한 뒤 무너지는 자리 |

네 권을 나란히 놓으면 **채워진 칸이 서로 다른 위치로 옮겨 갑니다.**
시리즈라는 것이 한눈에 보이고, 각 권이 무엇을 다루는지도 표지가 먼저 말합니다.

책마다 색을 다르게 줬습니다. 붉은색(1권) · 청록(2권) · 주황(청소년 1권) · 초록(청소년 2권).

## 왜 어두운 배경인가

아마존 검색 결과에서 표지는 **가로 160픽셀 정도**로 보입니다.
그 크기에서는 흰 배경이 주변에 묻힙니다. 어두운 바탕에 밝은 제목이 훨씬 잘 뜹니다.

제목도 그 크기에서 읽히도록 최대한 크게 잡았습니다.
네 권 다 썸네일로 줄여서 확인했습니다.

## 바꾸고 싶으시면

`tools/cover.py` 안에 책마다 색과 채울 칸이 적혀 있습니다.

```
python3 tools/cover.py            # 네 권 전부 다시 만들기
python3 tools/cover.py en-book    # 한 권만
```

색을 바꾸고 싶으면 `accent` 값을, 채울 칸을 옮기고 싶으면 `box` 값을 고치면 됩니다.

## EPUB 안의 표지도 같이 바꿨습니다

전자책 파일 안에 들어 있던 예전 표지를 이 표지로 교체하고 다시 뽑았습니다.
**아마존에 올리는 표지와 책을 열었을 때 나오는 표지가 같아야 합니다.**

네 권 모두 epubcheck 다시 통과했습니다(오류·경고 0).
`release/` 안의 EPUB 파일도 새것으로 바꿔 뒀으니 그것을 올리시면 됩니다.

---

# 이 화면에서 할 일 정리

1. **Manuscript** — `01_Whos-Actually-Paying.epub` 올리기
2. **Kindle eBook Cover** — `Upload a cover you already have` 를 고르고
   `01_Whos-Actually-Paying-cover.jpg` 올리기
3. **Kindle eBook ISBN** — 비움
4. **Publisher** — 비우거나 본인 이름 (네 권 통일)
5. **Accessibility** — `All informative images include alternative text...` + 확인 체크박스
6. **Preview** — 미리보기로 한 번은 넘겨 보기. 특히 차례와 표가 제대로 나오는지
7. `Save and Continue` → 가격 책정 화면

2권도 파일 이름만 `02_...` 로 바꿔서 똑같이 하시면 됩니다.

---

# 미리보기에서 볼 것

`Launch Previewer` 로 들어가면 실제 킨들 화면으로 보입니다. 세 군데만 확인하세요.

- **차례** — 장 제목을 누르면 그 장으로 넘어가는지
- **표** — 각 장 끝의 다섯 칸 정리 표가 깨지지 않는지
- **각주 번호** — 본문의 ¹ ² ³ 가 제대로 보이는지

셋 다 만들 때 확인한 것이지만, 킨들 화면에서 한 번 더 보시는 게 좋습니다.
여기서 문제가 보이면 발행 전이라 고칠 수 있고, 발행 뒤에는 다시 심사를 받아야 합니다.
