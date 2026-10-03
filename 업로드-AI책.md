---
title: 업로드 묶음 — 09 What It Could Not Tell Me · 10 기계가 말하지 못한 것
date: 2026-10-03
---

# 이 문서 하나만 보시면 됩니다

`KDP-LISTING-AIBOOK.md` 의 내용을 **실제로 올리는 순서**로 다시 짠 것입니다.
화면에 나오는 순서대로 적었으니 위에서 아래로 따라가시면 됩니다.

---

# 한눈에 — 네 번 올립니다

| | 무엇 | 쪽·크기 | 값 |
|---|---|---|---|
| **1** | 영어 전자책 `What It Could Not Tell Me` | 0.37MB | **$4.99** |
| **2** | 영어 종이책 | **113쪽** | **$9.99** |
| **3** | 한국어 전자책 『기계가 말하지 못한 것』 | 0.36MB | **$4.99** |
| **4** | 한국어 종이책 | **107쪽** | **$9.99** |

**순서를 지키세요.** 1번이 살아나야(보통 몇 시간~하루) 2번을 같은 책에 붙일 수 있습니다.
3번은 1번과 **별개의 책**으로 새로 만듭니다. 같은 책의 다른 판이 아닙니다.

---

# 올릴 파일 — 열 장입니다

```
release/covers/      표지 JPG 두 장        (전자책용)
release/ebook/       EPUB 두 장 · PDF 두 장 (PDF 는 예비)
release/paperback/   본문·표지 PDF 네 장    (종이책용)
```

| | 영어판 | 한국어판 |
|---|---|---|
| **전자책 표지** | `09_What-It-Could-Not-Tell-Me-cover.jpg` | `10_기계가-말하지-못한-것-cover.jpg` |
| **전자책 본문** | `What It Could Not Tell Me.epub` | `기계가 말하지 못한 것.epub` |
| 전자책 예비 PDF | `What It Could Not Tell Me.pdf` | `기계가 말하지 못한 것-A5.pdf` |
| **종이책 본문** | `09_…_interior-113p.pdf` | `10_…_본문-107p.pdf` |
| **종이책 표지** | `09_…_cover-113p-cream.pdf` | `10_…_표지-107p-미색.pdf` |

**예비 PDF 는 EPUB 이 안 올라갈 때만 씁니다.** 평소에는 EPUB 을 올리세요.

**전자책 표지는 JPG, 종이책 표지는 PDF 입니다.** 서로 바꿔 올리면 거부됩니다.

본문 PDF 둘 다 글꼴이 파일 안에 묻어 있는 것을 확인했습니다(각 다섯 벌).
KDP가 글꼴을 못 찾아 막는 일은 없습니다.

---

# 네 번 다 틀리면 안 되는 네 칸

05번이 여기서 막혔고 07번 바코드 오류도 같은 원인이었습니다.
**표지를 의심하기 전에 이 네 칸을 먼저 보세요.**

| 탭 | 칸 | 값 | 어디에 |
|---|---|---|---|
| Details | Categories 의 **저내용(low-content) 체크** | **끔** | 네 번 다 |
| Content | **Print ISBN** | **Get a free KDP ISBN** | 종이책만 |
| Content | **Ink and Paper Type** | **cream paper** | 종이책만 |
| Content | **"Yes, my cover has a barcode"** | **끔** | 종이책만 |

**셋째를 틀리면 책등이 어긋납니다.** 표지는 미색 두께(쪽당 0.0025in)로 계산했습니다.
흰 종이를 고르면 책등이 얇아져서 글자가 앞표지로 넘어갑니다.

**넷째를 켜면 "valid barcode 를 못 찾겠다" 로 막힙니다.**
우리 표지에는 바코드가 없고 **흰 자리만** 있습니다. 아마존이 거기에 자기 바코드를 찍습니다.

---

# 1 · 영어 전자책

`Create` → `Kindle eBook`

## Details 탭

| 칸 | 값 |
|---|---|
| Language | `English` |
| Book Title | `What It Could Not Tell Me` |
| Subtitle | `A Record of One Person and One Machine` |
| Series | **비움** — `Add to series` 누르지 마세요 |
| Edition Number | `1` |
| Author | First `Jaehyuk` / Last `Choi` |
| Contributors | **비움** |
| Publishing Rights | `I own the copyright…` |
| Sexually Explicit | `No` |
| Reading age | **비움** |
| Primary marketplace | `Amazon.com` |
| 저내용(low-content) | **끔** |

### Description

에디터 오른쪽 **`Source`** 버튼을 먼저 누르고 붙여 넣으세요.
안 누르고 붙이면 태그가 글자로 보입니다.

```html
<h4>I published eight books with a machine. This is the record.</h4>
<p>Most of what gets written about AI is written from outside it &mdash; by people who haven't used it, or used it twice, or are selling something. I ran a business on it. Eight times. Some of it worked and some of it went wrong.</p>
<p><b>So this book starts with what I saw, and only then with what I asked.</b> Five parts, eighteen chapters, and a coda.</p>
<ul>
<li><b>What I saw</b> &mdash; including the measurement that found twenty long sentences in one thousand six hundred and ninety, and what that turned out to mean about who had been writing</li>
<li><b>What it is made of</b> &mdash; four chapters, and not one of them produces a clean answer</li>
<li><b>What does not change</b> &mdash; not the difference now, but the difference that does not wear away. The last of the three is physics</li>
<li><b>If it passes us</b> &mdash; and the day that arrives well before the one everybody is braced for</li>
<li><b>Then what about people</b> &mdash; the part that side could not answer</li>
</ul>
<p>The title is not a figure of speech. Where no answer came, the place was left empty rather than smoothed over, and the cover draws those empty places. <b>They are the most important thing in the book.</b></p>
<p>It is a short book. A conversation that gets padded stops being a conversation.</p>
```

### Categories (최대 3개)

1. `Computers & Technology` → `Computer Science` → `AI & Machine Learning`
2. `Politics & Social Sciences` → `Philosophy` → `Ethics & Morality`
3. `Business & Money` → `Industries` → `Computers & Technology`

**2번이 이 책의 진짜 자리입니다.** 1번에만 걸면 기술책을 찾아온 사람이 별 하나를 줍니다.

**종교 쪽 분류는 쓰지 않습니다.** 그 칸에 넣으면 독자가 마지막 장을 읽기 전에
답을 알고 들어옵니다. 읽고 나서 알아보게 두는 것이 이 책의 전부입니다.

### Keywords (7개)

```
living with artificial intelligence
what separates humans from machines
writing a book with AI
questions AI cannot answer
philosophy of technology
self publishing with AI tools
future of human work and meaning
```

## Content 탭

| 칸 | 값 |
|---|---|
| Manuscript | `What It Could Not Tell Me.epub` |
| Book Cover | `Upload a cover you already have` → `09_What-It-Could-Not-Tell-Me-cover.jpg` |
| ISBN | 전자책은 **안 넣어도 됩니다** (ASIN 이 붙습니다) |
| DRM | **끄는 쪽** |
| AI 문항 | Text **Yes** · Images **Yes** · Translation **Yes** · 정도는 **전체** |

표지 만들기(Cover Creator)는 쓰지 않습니다.

## Pricing 탭

| 칸 | 값 |
|---|---|
| KDP Select | **넣습니다** |
| Royalty | **70%** |
| List Price (Amazon.com) | **$4.99** |

다른 나라 값은 **자동 환산**에 맡기시면 됩니다.

---

# 2 · 영어 종이책

**1번이 살아난 뒤에** 같은 책 화면에서 `Create paperback` 을 누릅니다.
제목·설명·분류·키워드는 전자책에서 복사됩니다. **그대로 두세요.**

## Details 탭

전자책과 같습니다. **저내용(low-content) 체크만 다시 확인하세요.** 꺼져 있어야 합니다.

## Content 탭 — 여기가 종이책의 전부입니다

| 칸 | 값 |
|---|---|
| **Print ISBN** | **`Get a free KDP ISBN`** |
| **"Yes, my cover has a barcode"** | **끔** |
| Print Options | `Black & white interior with **cream** paper` |
| Trim Size | `6 x 9 in` |
| Bleed | `No bleed` |
| Paperback cover finish | `Matte` |
| Manuscript | `09_What-It-Could-Not-Tell-Me_interior-113p.pdf` |
| Book Cover | `Upload a cover you already have (print-ready PDF)` → `09_…_cover-113p-cream.pdf` |

**전자책 ISBN 과 다른 번호를 받습니다.** 같은 걸 쓰면 안 됩니다.

표지 크기는 쪽수에 맞춰 이미 계산해 뒀습니다.

| 쪽 | 폭 x 높이 | 책등 |
|---|---|---|
| 113쪽 | **12.5325 x 9.2500 in** | **0.2825 in** |

미리보기(Previewer)에서 **책등 글자가 앞뒤로 안 넘어갔는지** 한 번 보세요.
100쪽을 넘어서 책등에 글자가 들어가 있습니다.

## Pricing 탭

| 칸 | 값 |
|---|---|
| Expanded Distribution | **켭니다** |
| List Price (Amazon.com) | **$9.99** |

인쇄비 $2.36 이 먼저 나가고, 권당 **$3.63** 이 남습니다.

---

# 3 · 한국어 전자책

`Create` → `Kindle eBook`. **1번과 별개의 새 책입니다.**

## Details 탭

| 칸 | 값 |
|---|---|
| Language | `Korean` |
| Book Title | `기계가 말하지 못한 것` |
| Subtitle | `사람 하나와 기계 하나가 나눈 기록` |
| Series | **비움** |
| Edition Number | `1` |
| Author | `최재혁` (나누라고 하면 First `재혁` / Last `최`) |
| Reading age | **비움** |
| Primary marketplace | `Amazon.com` |
| 저내용(low-content) | **끔** |

### Description

**`Source`** 버튼을 누르고 붙여 넣으세요.

```html
<h4>나는 그 기계로 책 여덟 권을 냈습니다. 이 책은 그 기록입니다.</h4>
<p>AI에 대해 나오는 말은 대부분 밖에서 본 것입니다. 써 보지 않고 말하거나, 한두 번 써 보고 말하거나, 팔려는 쪽에서 말합니다. 저는 그 기계로 일을 했습니다. 여덟 번 했습니다. 잘된 것도 있고 틀어진 것도 있었습니다.</p>
<p><b>그래서 이 책은 제가 본 것으로 시작하고, 그다음에야 물은 것이 나옵니다.</b> 다섯 부에 열여덟 장, 그리고 코다입니다.</p>
<ul>
<li><b>내가 본 것</b> &mdash; 문장 천육백구십 개 중에 긴 문장이 스무 개였다는 측정과, 그게 누가 쓰고 있었는가에 대해 무슨 뜻이었는지</li>
<li><b>무엇으로 만들어졌나</b> &mdash; 네 장인데 어느 장에서도 답이 깔끔하게 나오지 않습니다</li>
<li><b>무엇이 바뀌지 않는가</b> &mdash; 지금의 차이가 아니라 안 닳는 차이. 셋째 장에 적힌 것은 물리입니다</li>
<li><b>넘어서면</b> &mdash; 그리고 사람들이 걱정하는 그날보다 훨씬 먼저 오는 날</li>
<li><b>그럼 사람은</b> &mdash; 저쪽이 답할 수 없었던 자리</li>
</ul>
<p>제목은 비유가 아닙니다. 답이 안 나온 자리를 얼버무리지 않고 비워 두었고, 표지가 그 비워 둔 자리를 그린 것입니다. <b>그 자리가 이 책에서 제일 중요한 자리입니다.</b></p>
<p>짧은 책입니다. 대화편이라 늘리면 대화가 아니게 됩니다.</p>
```

### Categories

한국어책은 분류가 영어판과 다르게 나옵니다. 가장 가까운 것으로 고르세요.

1. `Computers & Technology` → `Computer Science`
2. `Politics & Social Sciences` → `Philosophy`
3. `Business & Money` → `Industries`

### Keywords

```
AI와 인간의 차이
인공지능 교양서
AI와 함께 글쓰기
기계가 답하지 못하는 질문
인공지능 철학
AI 시대 사람의 자리
자가출판 AI 활용
```

## Content 탭

| 칸 | 값 |
|---|---|
| Manuscript | `기계가 말하지 못한 것.epub` |
| Book Cover | `10_기계가-말하지-못한-것-cover.jpg` |
| DRM | **끄는 쪽** |
| AI 문항 | 영어판과 같습니다 |

## Pricing 탭

| 칸 | 값 |
|---|---|
| KDP Select | **넣습니다** |
| Royalty | **70%** |
| List Price | **$4.99** |

---

# 4 · 한국어 종이책

**이것 하나만 먼저 확인하셔야 합니다.**

> 전자책은 한국어를 받지만, **인쇄본 지원 언어에 한국어가 없다**는 자료가 여럿입니다.
> `kdp.amazon.com` 이 막혀 있어 제가 직접 확인하지 못했습니다.

`Create paperback` 을 누르고 **`Language` 칸에 Korean 이 있는지** 보세요.

- **있으면** — 2번과 똑같이 진행하면 됩니다. 아래 표만 바꾸세요.
- **없으면** — 한국어 종이책은 국내 인쇄로 가야 합니다. 파일은 이미 다 있습니다.

## Content 탭

| 칸 | 값 |
|---|---|
| **Print ISBN** | **`Get a free KDP ISBN`** |
| **"Yes, my cover has a barcode"** | **끔** |
| Print Options | `Black & white interior with **cream** paper` |
| Trim Size | `6 x 9 in` |
| Bleed | `No bleed` |
| Cover finish | `Matte` |
| Manuscript | `10_기계가-말하지-못한-것_본문-107p.pdf` |
| Book Cover | `10_기계가-말하지-못한-것_표지-107p-미색.pdf` |

| 쪽 | 폭 x 높이 | 책등 |
|---|---|---|
| 107쪽 | **12.5175 x 9.2500 in** | **0.2675 in** |

## Pricing 탭

| 칸 | 값 |
|---|---|
| Expanded Distribution | **켭니다** |
| List Price | **$9.99** |

인쇄비 $2.28, 권당 **$3.71** 이 남습니다.

---

# 값 — 한 장에

## 전자책

**$2.99 ~ $9.99 사이에서만 70%를 받습니다.** 그 밖은 전부 35%입니다.
70% 구간에서는 **1MB당 $0.15 전송료**가 빠지는데, 우리 책은 0.36~0.37MB라 5~6센트입니다.

| | 정가 | 전송료 | **권당 수익** |
|---|---|---|---|
| 영어판 | $4.99 | $0.06 | **$3.44** |
| 한국어판 | $4.99 | $0.05 | **$3.44** |

짧은 책이라 05번 자리($6.99)로 올리지 않았습니다.
**$2.99 밑으로 내리지 마세요.** 70% 구간에서 떨어집니다.

## 종이책

> **인쇄비 = $1.00 + (쪽수 x $0.012)**

| | 쪽 | 인쇄비 | 최소 정가 | **정가** | **권당 수익** |
|---|---|---|---|---|---|
| 영어판 | 113 | $2.36 | $3.93 | **$9.99** | **$3.63** |
| 한국어판 | 107 | $2.28 | $3.81 | **$9.99** | **$3.71** |

최소 정가보다 훨씬 위에 잡은 이유는 하나입니다.

**$9.99 가 60% 구간의 문턱입니다.** 그 밑은 50%입니다.
$7.99로 내리면 권당 $1.63, $9.99면 $3.63 입니다. **$2 올렸는데 수익이 두 배가 넘습니다.**

*이 문턱은 `kdp.amazon.com` 이 막혀 있어 재확인하지 못했습니다.
다만 문턱이 있든 없든 $9.99 이상이 유리하다는 결론은 같습니다.*

## 전자책과 종이책의 간격

**두 배입니다.** 앞의 권들(2.4~2.8배)보다 좁게 뒀습니다.
113쪽짜리를 $11.99에 두면 두께를 본 사람이 안 삽니다.
**짧은 책은 간격을 좁히고 전자책 쪽으로 보내는 게 맞습니다.**

---

# 다 올린 뒤 볼 것

**하나. 종이책 미리보기를 끝까지 넘겨 보세요.**
특히 **책등**입니다. 글자가 앞표지나 뒤표지로 넘어가 있으면 종이 종류가 틀린 것입니다.
`cream` 인지 다시 보세요.

**둘. 전자책은 실제 기기에서 한 번 열어 보세요.**
Kindle Previewer 로 **코다까지** 넘어가는지 보시면 됩니다. 마지막 쪽이 이 책의 전부입니다.

**셋. 영어판과 한국어판이 서로 연결되지 않습니다.**
아마존에서 같은 책의 다른 언어판으로 묶어 주지 않습니다. 각각 따로 삽니다.

---

# 번호에 대해

`release/` 의 파일 번호는 01부터 08까지 와 있었습니다.
이 책이 **09(영어판)과 10(한국어판)** 입니다. 작가님의 **아홉 번째 책**입니다.

---

# 아직 안 끝난 것 둘

**하나. 05번과 07번이 아직 그대로입니다.**

| | 고칠 것 |
|---|---|
| 05번 | Print ISBN 을 **free KDP ISBN** 으로, 종이를 **cream** 으로 |
| 07번 | **"내 표지에 바코드가 있다" 체크를 끄기** |

07번은 그 체크 하나 때문에 막혔던 것입니다. 표지는 멀쩡합니다.

**둘. 17장과 18장·코다를 한 번 읽어 주세요.**

3장은 작가님이 확인하셨습니다. 남은 둘은 사실이 아니라 생각이라
틀렸다고 할 수 있는 종류가 아닙니다. **작가님 생각과 다르지 않은지만** 보시면 됩니다.

다르면 그 자리는 제가 아니라 작가님이 고치셔야 합니다.
