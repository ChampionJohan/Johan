---
title: Anatomy of Money for Teens — First English Book Complete
date: 2026-09-09
---

# The first English book is finished

| | |
|---|---|
| Title | **Anatomy of Money for Teens** |
| Subtitle | *How Businesses Really Make Money — and How You Can Start* |
| Series | The Five Boxes: Teen Edition, Book One |
| Length | **10,465 words** · 28 pieces · 3 parts, 20 chapters |
| PDF | **115 pages** at 6×9in (Amazon print trim) |
| EPUB | epubcheck 5.1.0 — **0 errors, 0 warnings** |
| Linter | clean |

**This is the first of four, and it's done — front matter, all twenty chapters,
copyright page, closing.**

---

# Part Two — the ten brands

Six of ten were swapped. The rule was **match the mechanism, not the category**,
because the chapter teaches a mechanism.

| Ch | Korean | English | Why |
|---|---|---|---|
| 7 | 나이키 | **Nike** | Global. Unchanged. |
| 8 | 넷플릭스 | **Netflix** | Global. Unchanged. |
| 9 | 배달의민족 | **DoorDash** | Takes a cut, cooks nothing |
| 10 | 컴포즈커피 | **Dunkin'** | Cheap coffee — and it sets up the Starbucks contrast in Ch 13, which was the whole point of the Korean pairing |
| 11 | 무신사 | **Etsy** | Hosts small makers, does what they can't, takes a commission |
| 12 | 마인크래프트 | **Roblox** | The chapter is about *earning inside a game*, and Roblox actually pays creators |
| 13 | 스타벅스 | **Starbucks** | Global. Unchanged. |
| 14 | 쿠팡 | **Amazon** | Next-day delivery built on owned warehouses |
| 15 | 유튜브 | **YouTube** | Global. Unchanged. |
| 16 | 당근 | **Facebook Marketplace** | Free for individuals, paid by advertisers |

**Four of ten stayed.** Enough global anchors that it doesn't read as regional,
enough substitution that every chapter lands.

## Two swaps I got wrong the first time, and corrected

**Ch 11 — I had said StockX.** Wrong. StockX is peer resale, and Chapter 7
already covers resale. 무신사's mechanism is *a marketplace hosting small makers
who can't do photos, marketing, and shipping alone.* **That's Etsy**, beat for beat —
including the fault line, where a maker who gets big leaves to sell direct.

**Ch 16 — I had said OfferUp.** 당근's moat is **address-verified neighborhood**,
and no US app replicates it. Rather than invent a feature, I moved to
**Facebook Marketplace** and re-described the moat honestly:

> Everyone nearby is already there, so anything you post gets seen. And you can
> see who you're dealing with — a real account with a history beats an anonymous
> username when you're about to meet a stranger.

The chapter's actual lesson survives intact, because the lesson was never the
verification badge — it was **free on one side, paid on the other, and a trade
that makes no profit is still worth making.**

---

# Three errors found in the Korean edition

Working through Part Two surfaced mistakes in the published Korean book.
**All three are now fixed in Korean as well as English.**

**One. Part Two has ten brands; six places said nine.**
Fixed in six files.

**Two. Book 1 promised a sequel called 『왜 아직 안 뺏겼는가』.**
That's the *adult* volume 2's subtitle. The teen sequel is a different book.

**Three. Chapter 13 cited "1장에서 배운 다이소."** The dollar store is Chapter 2.
An off-by-one cross-reference.

---

# Two bugs the PDF exposed

Building the print PDF caught two things the EPUB never would have.

**The table of contents printed Korean "장" next to English titles** —
*"1장 Customer — It's Free…"*. The chapter-number label was hardcoded.
Now it follows the book's language.

**Part labels were letter-spaced into "P a r t  O n e."** Wide tracking looks
deliberate in Hangul and looks broken in English. Tracking is now a variable:
`.16em` for Korean, `.06em` for English. **The Korean books are untouched** —
verified after the change.

---

# The linter earned its place

Three false positives were fixed while writing these chapters, and each one
sharpened a real rule.

| It flagged | Why it was wrong | The rule that came out |
|---|---|---|
| `**Bold**` at line start | Read as a list bullet | A bullet needs a space after it |
| *"Don't memorize them."* | Read as a question | Inversion needs a subject after the auxiliary |
| *"Do it long enough and…"* | Read as a question | **Subject–verb agreement** — a question would be *"Does it"* |

That last one is the useful one. The linter now knows that
**"Do it…" is an imperative and "Does it…" is a question**, which is a
distinction it will apply across the remaining ~110,000 words.

---

# Where the series stands

| Book | Words | Status |
|---|---|---|
| **Anatomy of Money for Teens** | 10,465 | **Complete** |
| Anatomy of Money | ~46,000 | Not started |
| Anatomy of Money for Teens II | ~21,000 | Not started |
| Anatomy of Money II | ~44,000 | Not started |

Next is **Anatomy of Money** — the flagship. It has to be locked before its
sequel, because Book II quotes it constantly.

**One reminder from the publishing plan:** don't upload this one alone.
A series with a single book has no series effect. The second book is what
makes the first one sell.
