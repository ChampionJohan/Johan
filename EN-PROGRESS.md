---
title: English Editions — Progress
date: 2026-09-09
---

# Where things stand

| Book | Words | Done | Status |
|---|---|---|---|
| **It's Free. So How Are They Rich?** | 10,465 | 100% | **Complete** — 115 pages |
| **Who's Actually Paying?** | ~12,400 | 27% | Front matter + **all of Part One** + first case |
| The Fourth Box | 0 | 0% | Titles and series data configured |
| I Started. So Why Isn't It Working? | 0 | 0% | Titles and series data configured |

**Roughly 98,600 words remain.** That's two and a half books.
It won't come out of one sitting, and anything that claims otherwise
is machine translation.

---

# What got finished this round

## Part One of the flagship — the piece everything else waited on

Six chapters: Customer, Value, Payment, Moat, Fault Line, Diagnosis.

This block had to come before anything else because **it's where the English
definitions of the five boxes get fixed.** *The Fourth Box* and the teen sequel
both quote these terms constantly. Translating them before Part One was locked
would have meant retranslating them after.

That's now locked.

## One structural decision, affecting all eighteen case chapters

Every chapter in Part Two ends with a section called **「한국에 옮기면」** —
*if you moved this to Korea.*

Translated literally it's dead weight for an American reader.
Cut, and the chapter loses the part that turns analysis into application.

**It became "Could You Build This Where You Are?"**

The Korean argument was never really about Korea — it was about
**a smaller market with concentrated suppliers.** Generalized, it applies
to more readers and loses nothing. In the Spotify chapter it reads:

> When your supplier is also your competitor, a distributor has essentially
> no way to control costs.

Which is true in Seoul, Stockholm, and Toronto alike.

## Chapter 6's source list was replaced, not translated

The Korean chapter tells readers to pull filings from **DART**, Korea's
disclosure system. Useless to an English reader.

Replaced with **SEC EDGAR** (10-K, and 20-F for foreign issuers),
**Companies House**, and the international bodies the book already uses —
FAO, UNWTO, World Bank, OECD.

---

# A bug the PDF caught that the EPUB never would have

**The table of contents came out with no page numbers at all.**

The cause was in how the renderer identifies which page *is* the contents page.
It looks for a page containing more than one chapter title.

But every chapter's opening page carries an eyebrow line naming its part —
and in English that string is **character-for-character identical** to the
part divider's own title: *Part One · The Five Boxes.*

So every chapter opening registered as a contents page. The detector kept
walking forward, decided the contents ran to the final chapter,
and then searched for chapter starts **after** it. Nothing was left to find.

**The Korean editions escaped this by luck.** Their eyebrow reads
`1부 다섯 칸` while the divider title reads `1부 · 다섯 칸` — one character apart.
Not safe, just lucky.

Fixed two ways: names used as eyebrows are excluded from the detection count,
and the contents is only allowed to be contiguous from the front.

**Both Korean books and the finished English one were rebuilt and checked
for regressions.** None.

---

# The linter keeps paying for itself

Three more false positives this round, each one sharpening a rule.

| Flagged | Why it was wrong | Rule added |
|---|---|---|
| A bullet wrapping to a second line | Read as a new paragraph | Join wrapped list items |
| *"Which is why they carry it."* | Read as a question | Relative clauses aren't questions |
| *"Do these three in order…"* | Read as a question | Imperative `do` takes no third-person subject |
| *"…leaving as cost.¹"* | Read as missing punctuation | Footnote markers count as terminal |

It now knows that **"Do it…" is an imperative and "Does it…" is a question.**
That distinction will hold across the remaining ~98,600 words.

---

# What's next, in order

1. **Part Two of *Who's Actually Paying?*** — seventeen more case chapters,
   then the closing. This is the bulk of the book.
2. **I Started. So Why Isn't It Working?** — reuses the teen voice already set.
3. **The Fourth Box** — last, because it quotes Book One on every other page.

**Nothing is publishable alone yet.** *It's Free* is finished, but a
one-book series has no series effect. The second finished book is what
makes the first one sell.
