---
title: Amazon KDP — Upload Set and Checklist
date: 2026-09-09
---

# The eight files

All in `release/`, with ASCII-safe filenames (three of the four titles contain
`?`, which Windows rejects in a filename — the title inside each file is
unaffected).

| # | Book | EPUB | PDF | Pages |
|---|---|---|---|---|
| 01 | Who's Actually Paying? | 428 KB | 693 KB | 366 |
| 02 | The Fourth Box | 393 KB | 703 KB | 358 |
| 03 | It's Free. So How Are They Rich? | 243 KB | 283 KB | 115 |
| 04 | I Started. So Why Isn't It Working? | 297 KB | 439 KB | 185 |

**EPUB → Kindle ebook. PDF → paperback interior.**

That split matters. KDP will accept a PDF for an ebook, and it reflows badly on
a Kindle. Upload the EPUB for the ebook every time.

---

# What was checked

## EPUB — all four pass

| Check | Result |
|---|---|
| epubcheck 5.1.0 | **0 fatals / 0 errors / 0 warnings** |
| `dc:language` | `en` — not inherited from the Korean edition |
| `dc:creator` | Jaehyuk Choi |
| `dc:identifier` | Stable UUID, derived from the title, so a revision stays the same book |
| Navigation | EPUB3 `nav` **and** EPUB2 `toc.ncx`, for older Kindle pipelines |
| Cover | 1600×2400, declared `cover-image`, first item in the spine |
| Series metadata | `belongs-to-collection` with position 1 / 2 |

## PDF — all four meet KDP's print rules

The 6×9 inch trim is KDP's standard paperback size, so no trim conversion is
needed at upload.

| Check | Requirement | Result |
|---|---|---|
| Trim size | 6 × 9 in | **6 × 9 in** |
| Inside (gutter) margin | 0.625 in at 301–500 pp, 0.5 in at 151–300, 0.375 in at 24–150 | **0.84 in minimum on every book** |
| All content from trim edge | ≥ 0.25 in | **0.40 in minimum** |
| Fonts | embedded | **all embedded subsets** |
| Table of contents | page numbers matching final pagination | **converged** |

Two things were fixed to get there.

**Page numbers sat 0.21 in from the bottom trim edge** — under KDP's 0.25 in
minimum, which is a rejection at preflight. Chromium pins the footer to the
very bottom of the margin band, so it's now lifted with padding. They print at
0.40 in.

**Cover titles were breaking mid-word** — "Who's Actually P / aying?". The
cover generator wrapped per character, which is right for Korean and wrong for
English. It now wraps on word boundaries for English, uses a Latin serif rather
than a Korean one, and carries the series line and the author name at the foot.

---

# What KDP still needs from you

The files are complete. Three things are account-side and can't be produced
here.

**1. A cover for each book.**

The cover inside each EPUB is a working placeholder — title, subtitle, series,
author, on a colour band. It's legitimate and it will pass review, and it isn't
a cover that sells anything on a thumbnail-sized shelf.

- **Ebook:** upload a JPG or TIFF separately. KDP's ideal is 2560 × 1600
  (1.6:1); the placeholders are 1600 × 2400 (1.5:1), inside the accepted range
  but not ideal.
- **Paperback:** KDP needs a single PDF wrapping front, spine and back. Spine
  width depends on page count and paper stock, so use KDP's cover template
  generator with the page counts in the table above.

**2. Categories, keywords and description.**

The Korean book descriptions won't translate straight across — the shelves
differ. Both adult books belong in Business & Money → Economics or
Entrepreneurship; both teen books in Teen & Young Adult → Education & Reference
→ Careers, or Business & Economics.

**3. Check the titles on Amazon before listing.**

*Anatomy of Money* was a crowded shelf, which is why these four titles are
questions instead. That check was done from search results, not from Amazon
directly — this environment can't reach it. Worth five minutes in a browser
before you commit the titles.

---

# Two things to know about the source

**The Korean editions were not rebuilt.** The typesetting fixes here — table
width, code-block wrapping, footer position, cover wrapping — apply to the
whole toolchain, and the Korean books were never affected by the first two and
would only change cosmetically under the rest.

Their released files are byte-identical to what you already have. If you do
rebuild them, rebuild all four together so their pagination stays consistent
with each other.

**Both adult books state their own verification limits in the colophon.**
Fact-checking was cross-referencing published reporting, not opening filings
one by one. That's written plainly in *How This Book Was Made* in both books.
It's honest, and it's the thing to strengthen first if you revise.
