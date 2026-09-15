---
title: Why Is This Still Here? — Production Files
date: 2026-09-15
---

# First: do not upload these yet

The files are made. **The book is not ready to publish.**

```
52 verification items, 3 TODOs.  Both have to be zero before publishing.
```

The 52 are **primary-source checks**, one attached to each case.
What has been done so far is cross-checking public material, not opening the originals.

The 3 TODOs are the blanks left in *How This Book Was Made*:
**how many items were cut, how many anecdotes were dropped, and how far
verification actually went.** All three can only be written accurately at
publication time.

What follows is for **looking at the cover, checking the typesetting, and
reading it through.** It becomes uploadable when those two numbers are zero.

---

# Covers

This book is not part of the Five Boxes series, so the five-box motif could not be used.

**The motif is a peak and a plain.**

Chapter 1 puts the two sales curves side by side.
A bestseller is a tall narrow peak; a steady seller is a low wide plain.
**That drawing is the cover.**

The two filled areas are sized to be roughly equal.
**That the heights differ and the areas don't is the argument of the book.**

| File | Size |
|---|---|
| `release/covers/bestseller-cover.jpg` | 1600 × 2560 |
| `release/covers/en-bestseller-cover.jpg` | 1600 × 2560 |

KDP's recommended 1.6:1 ratio.

The Korean edition is set in **Nanum Myeongjo** — the Latin faces have no Hangul,
so a separate family had to be wired in. The English edition uses Liberation Serif,
the same as the four earlier books.

The top line names the scope, so the cover says what the book covers before
the title does.

- Korean — 책 · 옷 · 가전 · 식품 · 미디어
- English — BOOKS · CLOTHES · FOOD · FILM · MUSIC

---

# Ebooks

| File | Pieces | Check |
|---|---|---|
| `release/ebook/Why Is This Still Here?.epub` | 31 | **epubcheck: 0 errors** |
| `release/ebook/베스트셀러 & 스테디셀러.epub` | 31 | **epubcheck: 0 errors** |

The cover is inside, and so is the EPUB nav table of contents.

## One thing that had to be fixed

The first build produced an error.

```
ERROR(RSC-005): content.opf  character content of element "meta" invalid
```

**It was caused by this book not being part of a series.**
The four earlier books all are, so the `belongs-to-collection` metadata had a value.
This one is empty, so an empty `<meta>` tag went out.

`tools/epub.py` now omits the collection metadata entirely when there is no series.
**The four earlier books were rebuilt to confirm nothing regressed.**

## PDF ebook

For platforms that take PDF rather than EPUB.

| File | Trim | Pages |
|---|---|---|
| `release/ebook/베스트셀러 & 스테디셀러-A5.pdf` | A5 | 314 |

---

# Print — English edition

Built to KDP paperback specification.

| File | Size |
|---|---|
| `release/paperback/05_Why-Is-This-Still-Here_interior-326p.pdf` | 6 × 9 in · 326 pages |
| `release/paperback/05_Why-Is-This-Still-Here_cover-326p-cream.pdf` | **13.065 × 9.250 in** · spine 0.815 in |

Named by the same rule as the four earlier books.
**The page count and the paper are in the filename, so a mismatched pair
is visible before upload.**

## Specification checks

| Item | KDP requires | Actual | |
|---|---|---|---|
| Trim | 6 × 9 in | 6.0000 × 9.0000 | pass |
| Inside margin (301–500 pages) | 0.625 in | **0.843 in** | pass |
| Inside the trim line | 0.25 in | **0.397 in** | pass |
| Wrap size | 13.065 × 9.250 | 13.065 × 9.250 | match |
| Fonts | must be embedded | all embedded | pass |

The wrap is calculated like this.

```
0.125 + 6 + (326 pages × 0.0025) + 6 + 0.125 = 13.065 in
```

Cream paper. **Switching to white means regenerating the wrap.**

```
python3 tools/wrap_cover.py en-bestseller 326 --paper white
```

The white rectangle at the lower right of the back cover is the barcode zone.
**It was left empty on purpose, not forgotten.**

---

# Print — Korean edition is not built yet

There's a reason.

`tools/wrap_cover.py` is **KDP-specific.** Bleed, spine thickness and the
barcode zone are all fixed to KDP's numbers.

If the Korean edition goes to a domestic self-publishing service,
**the specification is different.** A5 is common there and the spine formula differs.

Tell me where it's going and it gets built to that specification.
**The interior PDF already exists at A5, so only the cover has to be redrawn.**

If the Korean edition also goes to KDP, the interior has to be re-rendered at 6 × 9.
That is also one line.

---

# Changes made to the tools

Three files were changed for this book. All passed regression checks
against the earlier books.

| File | What |
|---|---|
| `tools/cover.py` | Added the curve motif (`motif="curve"`) and Korean faces |
| `tools/epub.py` | Handles a standalone book with no series |
| `tools/pdf.py` | Added both editions of this book |

`cover.py` also got a guard so the top line can't collide.
The English scope line was long enough to overlap the right-hand mark;
**it now tightens the letter-spacing first and reduces the size only if that
isn't enough.** No future book can collide there.

## One thing worth knowing

While rebuilding the four earlier English ebooks as a regression check,
their embedded covers came out **different by a few pixels** —
same layout, slightly different glyph rendering.

The cause is the environment, not the code. `cover.py`'s five-box path is untouched.
The container was replaced mid-session and the font rendering shifted very slightly.

**The four published ebooks were restored to their original bytes.**
`release/covers/<key>-cover.jpg` now holds the exact artwork that was uploaded,
so future rebuilds reuse it rather than re-rendering.

---

# What's left

- [ ] **52 verification items** — patent records, trademark registries,
      distributor records, official charts, manufacturer material
- [ ] **3 TODOs** — the counts and the verification level in *How This Book Was Made*
- [ ] Check on Amazon whether `Why Is This Still Here?` is already taken.
      **A title cannot be changed after publication**
- [ ] Decide where the Korean edition goes, then build its print cover
- [ ] If a shop you have seen yourself turns up, swap it into the two slots
      in the opening and the closing

**The first line takes the longest.** Everything else is under half a day.
