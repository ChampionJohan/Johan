---
title: Four English Editions — Complete
date: 2026-09-09
---

# All four are finished

| Book | Words | Pages | EPUB | Status |
|---|---|---|---|---|
| **Who's Actually Paying?** | 38,110 | 366 | 0 errors | **Complete** |
| **The Fourth Box** | 36,301 | 358 | 0 errors | **Complete** |
| **It's Free. So How Are They Rich?** | 10,458 | 115 | 0 errors | **Complete** |
| **I Started. So Why Isn't It Working?** | 17,569 | 185 | 0 errors | **Complete** |

**102,438 words. 1,024 pages. Eight files ready to upload.**

Every EPUB passes epubcheck 5.1.0 with zero errors and zero warnings.
Every PDF is 6×9 inches — Amazon KDP's standard paperback trim — with the
table of contents page numbers converged against the final pagination.

---

# The four books

## Who's Actually Paying?
### *Take Any Business Apart in Five Questions*

The flagship. Part One builds the five boxes one at a time; Part Two runs
eighteen businesses across nine fields through all five.

The eighteen are the same eighteen as the Korean edition — Spotify, Arm,
Domino's, Starbucks, Visa, Berkshire, Airbnb, Marriott, Red Bull, Patagonia,
the NFL, Formula One, Singapore, Dubai, the Netherlands, Israel, Norwegian
salmon, Iceland. All of them already carry outside a Korean reader.

## The Fourth Box
### *Why Some Businesses Can't Be Taken*

The second adult book, and the largest single translation job here.

It opens by grading Book One's own eighteen predictions — three wrong, three
half, eight right, three too early to judge, one unconfirmed — and the three
wrong ones turn out to be wrong in the same place. That finding shapes the
rest of the book.

## It's Free. So How Are They Rich?
### *How Money Actually Works — and How to Start*

The teen edition of Book One. Ten brands teenagers already know, and a third
part on what they could actually start.

## I Started. So Why Isn't It Working?
### *The Part Nobody Warns You About*

The teen sequel, and the one that surprised me. It isn't a business book so
much as a book about not quitting: six walls you hit after starting, five
moats you can build at teenager scale, five ways a thing that was working
stops working.

---

# What "adapted" meant

Translation was the smaller half. Two policies ran through all four books.

**The adult books keep their cases and gloss them.** Spotify and Berkshire
need no introduction anywhere. Where a chapter turned on a Korean market fact,
the sentence was generalized rather than deleted — the Korean edition's closing
section 「한국에 옮기면」 became **"Could you build this where you are?"** in
every one of the eighteen case chapters.

**The teen books swap their cases.** A teen title page that promises "ten
brands you already know" has to mean it. So 무신사 became **Etsy**, 당근 became
**Facebook Marketplace**, 배달의민족 became **DoorDash**, and each swap was
checked against the structure the chapter actually needed, not just the
category.

The Fourth Box needed three swaps of its own for the same reason:

| Korean case | English case | Why this one |
|---|---|---|
| 야놀자 | **OpenTable** | A two-sided network bounded by geography that pivoted from connecting to operating software, to invert who needs whom |
| 골프존 | Golf simulator technology, unnamed | The structure needed is a system installed at independent venues where the *customer's* records do the locking. Market share figures could not be confirmed, so none are given |
| 완도 전복 | **Maine lobster** | Hundreds of small independent harvesters, a widening dock-to-retail spread, slow cooperative attempts |

The one place the change went further than a swapped example is the closing
chapter. The Korean edition asks what moats can be built in one particular
country. The English edition asks the same question of **anybody starting
without capital in a market that isn't the biggest one** — the same question
with the boundary drawn wider. That's stated openly in the colophon rather
than done quietly.

---

# The punctuation linter

English needs terminal punctuation chosen deliberately, so `tools/en_lint.py`
checks every paragraph of every English manuscript for four things: a missing
terminal mark, a question that needs `?`, overuse of `!`, and leftover Hangul.

It caught real errors. It also produced false positives, and each one taught
it something:

- Soft-wrapped lines read as unpunctuated → made it paragraph-aware
- `**bold**` at line start read as a list bullet → require a space after the marker
- "Don't memorize them." read as a question → require a subject after the auxiliary
- "Do it long enough…" → subject–verb agreement check
- "Do these three…" → imperative *do*
- "Which is exactly why…" → relative-clause continuations
- "What was sold to the owner was…" → pseudo-clefts
- A footnote `¹` after a period → superscripts are terminal characters
- Typeset tables inside ``` fences → skip fenced blocks

All four manuscripts pass clean.

---

# One typesetting bug worth naming

While checking the finished PDFs I found that *The Fourth Box* was rendering
its body text at **8.7pt instead of 12.8pt** — a third smaller than the other
books, and too small to read comfortably in print.

The cause: `STYLE` in `tools/book.py` is concatenated raw rather than
percent-formatted, so the escaped `%%` in the table width declaration reached
the CSS verbatim and the whole declaration was dropped. Tables then laid out
at their intrinsic width, and one element wider than the sheet made Chromium
shrink the entire document to fit.

The widest element turned out to be a single `<pre>` line in Chapter 10.

Fixed by unescaping the declaration and adding print rules that keep tables
and code blocks inside the printable width. All four English PDFs now render
at 12.8pt.

**The Korean editions were never affected** — their content always fit — so
their released files are left untouched. If you rebuild them later, their
tables will render full-width rather than content-width. That's an
improvement, and it will change their pagination, so rebuild them together
rather than one at a time.

---

# What's still open

Nothing blocks upload. These are the standing items from before:

- **`book2/verify.md`** still has primary-source items outstanding —
  28 in group B, 13 in F, 5 in G. Both adult books say plainly, in their
  colophons, that the checking was cross-referencing rather than
  primary-source verification. That honesty is load-bearing, and closing
  those items would let it be replaced with something stronger.
- **The thirteen numbers dropped from Book One** are still dropped. They sit
  in corporate filings and regulator publications this environment can't
  reach. Both books record the gap rather than papering over it.
- **The English title strings should be checked on Amazon directly** before
  listing. *Anatomy of Money* was a crowded shelf, which is why these four
  titles are questions instead.

---

# The files

```
en-book/site/    Who's Actually Paying?.pdf / .epub
en-book2/site/   The Fourth Box.pdf / .epub
en-teen/site/    It's Free. So How Are They Rich?.pdf / .epub
en-teen2/site/   I Started. So Why Isn't It Working?.pdf / .epub
```

Three of the four titles contain `?`, which Windows won't accept in a
filename. If you're downloading them to a Windows machine, rename on the way
down — the title inside the file is unaffected.
