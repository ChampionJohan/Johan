---
title: English Edition — Style, Punctuation, and Localization Rules
date: 2026-09-09
---

# A correction to what I said last time

Last turn I wrote: *keep the Korean cases, add a one-clause gloss.*

**That is right for the adult books and wrong for the teen books.**

The teen book's promise is printed on its own title page:

> Part Two puts **ten brands you already know** through all five boxes.

An American fifteen-year-old does not know Compose Coffee, Musinsa, or Danggeun.
Glossing them doesn't fix it — the chapter still opens by assuming recognition
the reader doesn't have, and the whole premise of Part Two collapses.

So the rule splits by book:

| | Policy | Why |
|---|---|---|
| **Adult books** | **Keep and gloss** | The reader is analytical. Unfamiliar cases are the reason to buy *this* book instead of another one with Apple and Amazon in it. |
| **Teen books** | **Swap** | The book's promise is recognition. A case the reader doesn't recognize isn't a hard case — it's a dead chapter. |

---

# 1. Punctuation rules

English is stricter than Korean about terminal marks. These are enforced by
`tools/en_lint.py`, which runs over the manuscript and reports violations.

## The rules

**Every sentence in body text ends with a mark.** No exceptions in prose.
Korean tolerates a trailing clause that just stops. English reads it as an error.

**Headings take no period.** But they keep `?` and `!` when they earn them.

> ## Then who is?
> ## What if the spenders stop?
> ## This isn't only about games

**Questions get `?` — including rhetorical ones.**

> So how does that company cover its servers, pay its staff, and still buy ads?

**Rhetorical fragments that are not questions keep the period.** This is the
distinction the linter had to be taught, because it matters:

> Why that app is free. Why that shop only takes cards.

Those are not questions. They are a list of things you will start to notice.
A `?` there would be wrong.

**Exclamation marks are rationed.** The series voice is dry and confident;
it does not shout. The teen books allow more than the adult books, but:

- never more than **two per paragraph** (linter flags three)
- never in the adult books except in quoted speech
- never to manufacture excitement the sentence hasn't earned

**Em dashes** for interruption, spaced or unspaced consistently — this project
uses spaced em dashes, matching the Korean edition's use of `—`.

**Colons** introduce a payoff. Use them where the Korean used `:` or a line break
before a punchline.

## What the linter checks

```
python3 tools/en_lint.py en-teen en-book en-teen2 en-book2
```

| Check | Why it exists |
|---|---|
| Paragraph with no terminal mark | The single most common translation slip |
| Inverted-auxiliary sentence ending in `.` | *"Is it worth it."* → needs `?` |
| Three or more `!` in one paragraph | Voice drift |
| Hangul left in the file | Untranslated fragments hide easily at 100k words |

Front matter can carry `lint: skip` for display pages (title page, colophon)
where terminal marks are deliberately absent.

---

# 2. Voice

## Adult books

Declarative. Short sentences. The Korean uses plain `~다` endings and never
addresses the reader as "you" except in the exercises. English keeps that:
third person and impersonal in the analysis, second person in **Try It Yourself**.

**Do not add hedges the Korean doesn't have.** The Korean says
*막아서 만든 전환 비용은 오래 못 간다* — "switching costs built by blocking the exit
don't last." Not "tend not to last," not "may not last."

## Teen books

Korean 반말 has no English equivalent. The register that does the same work is
**an older sibling who knows things** — not a teacher, not a peer.

| Do | Don't |
|---|---|
| Contractions everywhere | Slang (dates the book in three years) |
| Second person, direct | "Kids," "guys," "folks" |
| Short sentences. Fragments allowed. | Talking down |
| "Here's the thing." | "Let's dive in!" |

| Korean | English |
|---|---|
| 너 그거 아니? | Here's the thing. |
| 그거 정상이야 | That's normal. |
| ~할 거야 | You'll… / What'll happen is… |
| 절반만 맞아 | Only half right. |
| 딱 하나만 | Exactly one. |

---

# 3. Brand localization — teen books

Ten brands in Part Two, six examples in Part One. Global brands stay.
Korea-only brands are replaced by the closest **mechanism** match, not the
closest category match — the chapter is teaching a mechanism.

## Part One

| Ch | Box | Korean | English | Mechanism preserved |
|---|---|---|---|---|
| 1 | Customer | 무료 모바일 게임 | *(unchanged)* — a free mobile game | Free user is the product |
| 2 | Value | 다이소 | **a dollar store** | Price point sets expectations |
| 3 | Payment | 편의점 선불카드 | **a gift card** | Money collected before use |
| 4 | Moat | 배달앱 | **DoorDash** | Two-sided network |
| 5 | Fault line | 클럽하우스 | *(unchanged)* — Clubhouse | Already a global example |
| 6 | Diagnosis | 유튜브 채널 | *(unchanged)* | — |

## Part Two

| Ch | Korean | English | Why this one |
|---|---|---|---|
| 7 | 나이키 | **Nike** | Global. Unchanged. |
| 8 | 넷플릭스 | **Netflix** | Global. Unchanged. |
| 9 | 배달의민족 | **DoorDash** | Takes a cut, cooks nothing |
| 10 | 컴포즈커피 | **Dunkin'** | Cheap coffee that still profits — and it sets up the Starbucks contrast in Ch 13, which was the point of the Korean pairing |
| 11 | 무신사 | **StockX** | Marketplace that became #1 without making the product |
| 12 | 마인크래프트 | **Roblox** | Better fit than Minecraft for *earning money inside a game* — Roblox actually pays creators |
| 13 | 스타벅스 | **Starbucks** | Global. Unchanged. |
| 14 | 쿠팡 | **Amazon** | Next-day delivery built on owned logistics |
| 15 | 유튜브 | **YouTube** | Global. Unchanged. |
| 16 | 당근 | **OfferUp** | Local secondhand, minimal margin |

**Four of ten stay.** That is the right ratio — enough global anchors that the
book doesn't read as regional, enough substitution that every chapter lands.

---

# 4. Money and units

| Korean | English | Note |
|---|---|---|
| 천 원으로 시작 | **Start with five dollars** | 1,000원 ≈ $0.75, which reads as nothing. $5 is the equivalent *gesture*. |
| 8,000원 (sticker) | **$6** | Teaching numbers, not facts — convert freely |
| 3,000원 (materials) | **$2.50** | |
| Adult-book figures in €/$ | **unchanged** | These are verified facts. Never convert. |

**Rule: convert illustrative numbers, never factual ones.**

---

# 5. Chapters that need rewriting, not translating

Three chapters cannot be translated. The underlying facts are different.

## Teen Ch 19 — 사업자등록 (business registration)

Korean business registration has no US equivalent. This chapter must be rebuilt
around: sole proprietorship, whether a minor can sign, when an EIN is needed,
and the fact that **rules differ by state**.

And per the series' own rule — *don't pin down age limits and conditions, they
change* — the chapter should teach the reader **how to look it up for their own
state**, not state the rules.

## Teen Ch 17 — 또래 창업 사례 (peer founder stories)

The Korean examples are Korean teenagers. English readers need English-language
ones, and the series rule is that **every fact must be checkable**.

**I could not verify any replacement from this environment** — outbound access to
the sources is blocked. This chapter is flagged, not written. It needs either
verified US/UK teen-founder cases or a rewrite that teaches the pattern without
naming anyone.

## Both closings — 대한민국

Teen Ch and adult Book 2 both close on 「대한민국 창업민국」 / 「대한민국, 창업하는 나라」.

Reframe to **"Building From a Small Market"**, as set out in the edition plan.
The argument was never actually about Korea — it was about not having a large
domestic market and not having capital. Korea stays as the author's worked
example and the place he writes from.

---

# 6. Terms — quick reference

| Korean | English |
|---|---|
| 다섯 칸 | the Five Boxes |
| 고객 · 가치 · 과금 · 해자 · 균열 | Customer · Value · Payment · Moat · Fault Line |
| 직접 해 보기 | Try It Yourself |
| 오늘 할 것 | Do This Today |
| 흔한 오해 | The Common Misreading |
| 절반만 맞다 | Only half right. |
| 먼저 아쉬운 쪽은? | Who needs the other more? |
| 무너지는 조건 | What has to change for this to break |
| 이 장의 출처 | Sources for this chapter |
