---
title: Amazon Print — Both Editions of Why Is This Still Here?
date: 2026-09-15
---

# Four files

All in `release/paperback/`. **Interior and wrap come in pairs.**

```
05_Why-Is-This-Still-Here_interior-333p.pdf
05_Why-Is-This-Still-Here_cover-333p-cream.pdf

06_베스트셀러-스테디셀러_본문-301p.pdf
06_베스트셀러-스테디셀러_표지-301p-미색.pdf
```

Same naming rule as the four earlier books.
**The page count and the paper are in the filename, so a mismatched pair
is visible before upload.**

| Edition | Pages | Wrap size | Spine |
|---|---|---|---|
| English | 333 | 13.0825 × 9.2500 in | 0.8325 in |
| Korean | 301 | 13.0025 × 9.2500 in | 0.7525 in |

Both **6 × 9 inches, cream paper.**

---

# The Korean edition was re-rendered at 6 × 9

The Korean PDF supplied earlier was **A5** — the domestic self-publishing trim.

Amazon's standard is 6 × 9, so it was rendered again at that size.

```
python3 tools/pdf.py bestseller --trim 6x9
```

The A5 version still exists at `release/ebook/베스트셀러 & 스테디셀러-A5.pdf`,
for the ebook or a domestic printer. **They are different files.**

---

# Two typesetting faults found and fixed

Rendering the Korean edition for print surfaced **a font that had been wrong all along.**

## One · The body text was being set in a Chinese font

The first PDF's font list contained this.

```
WenQuanYiZenHei
```

That is a Chinese face. **The entire body of a Korean book was being set in it.**

The cause was one space.

| | |
|---|---|
| Name in the CSS | `"Nanum Myeongjo"` — with a space |
| Name actually installed | `NanumMyeongjo` — no space |

No match, so the browser substituted any font that had Hangul,
and that font was Chinese.

**The unspaced name is now listed after the spaced one.**
Where the spaced name exists, it still wins. Nothing changes there.

## Two · Hangul in code blocks had the same problem

This book uses code blocks for its checklists.

```
when it broke out → what was being sold → when it turned → what got cut first
```

No font was ever specified for code blocks, so they fell to the browser's default
monospace, which has no Hangul — and the substitution happened again.

**A monospace face that has Hangul (Nanum Gothic Coding) now comes first.**

## After the fix

```
Chinese font remaining: 1 place — 一文字屋和輔
```

That is the Kyoto shop's name in kanji. **Kanji set in a CJK font is correct.**

**The page counts changed,** because changing a font re-flows every line.

| | Before | After |
|---|---|---|
| Korean | 298 | **301** |
| English | 316 | **333** |

The English count changed too, because specifying a code-block font
also changed its monospace face.
**So both wraps were rebuilt at the new counts.** The old 316-page wrap was deleted.


## And this was not only this book's problem

After the fix, the earlier books were checked too.

| Book | Result |
|---|---|
| 돈의 해부학 | Chinese font in the body |
| 돈의 해부학 2 | Chinese font in the body |
| 너 그거 아니? 돈 버는 머리! | Chinese font in the body |
| 너 그거 아니? 돈 버는 머리! 2 | Chinese font in the body |

**All four Korean editions had the same fault.**

So did the files in the `발간본/` folder.
In a thirty-page sample, **more than half the text spans were in the Chinese font.**

> **The PDFs of the two already-published books went out in that state.**

All four have been re-rendered. All four now set in Nanum Myeongjo.

| Book | Pages |
|---|---|
| 돈의 해부학 | 301 |
| 돈의 해부학 2 | 304 |
| 너 그거 아니? 돈 버는 머리! | 103 |
| 너 그거 아니? 돈 버는 머리! 2 | 180 |

**The `발간본/` folder was left untouched.**
It is the record of what was published, so it seemed right to leave it alone.

Whether to re-upload is your call. Here is what the decision needs.

- The Chinese font does contain Hangul, so **it is readable**
- But the stroke shapes differ from Korean type, and two faces mix inside one paragraph
- **It shows more in print.** The difference is larger on paper than on screen

---

# Specification checks

Both pass.

| Item | KDP requires | English | Korean |
|---|---|---|---|
| Trim | 6 × 9 in | 6.0000 × 9.0000 | 6.0000 × 9.0000 |
| Inside margin | 0.625 | **0.843** | **0.847** |
| Inside the trim line | 0.25 in | **0.397** | **0.397** |
| Wrap size | matches the formula | 13.0825 × 9.2500 | 13.0025 × 9.2500 |
| Spine text clearance | 0.0625 in | **0.227** | **0.200** |
| Ink outside the spine | none allowed | none | none |
| Fonts | must be embedded | all embedded | all embedded |

The inside-margin requirement differs because the books sit in different page bands.

- 151–300 pages → 0.5 in
- 301–500 pages → 0.625 in

**The Korean edition is 301 pages, one band lower.**

The wrap is calculated like this.

```
0.125 + 6 + (pages × 0.0025) + 6 + 0.125

English  0.125 + 6 + 0.8325 + 6 + 0.125 = 13.0650
Korean   0.125 + 6 + 0.7525 + 6 + 0.125 = 12.9850
```

0.0025 in per page is the thickness of cream stock.

---

# What the wrap looks like

One PDF page holds **back cover, spine and front cover, left to right.**

```
┌──────────────┬──┬──────────────┐
│  back        │sp│   front      │
│              │in│              │
│  blurb       │e │  title       │
│              │  │  peak+plain  │
│  ┌────────┐  │  │  author      │
│  │ barcode│  │  │              │
└──┴────────┴──┴──┴──────────────┘
```

**Front** — the peak and the plain. Chapter 1's two curves are the cover.

**Spine** — title centred, author below. Reads top to bottom when the book stands up.
The Korean spine now sets correctly in Hangul; it had been picking up a Latin face
and was fixed along with the rest.

**Back** — the blurb.
The white rectangle at the lower right is the barcode zone.
**It was left empty on purpose, not forgotten.**

---

# Upload order

Same as last time.

**1. Create Paperback** — a **separate product** from the ebook.
Leave the EPUB you already uploaded alone.

**2. Print Options**

| Field | Choose |
|---|---|
| Ink and Paper Type | **Black & white interior with cream paper** |
| Trim Size | **6 x 9 in** |
| Bleed | **No Bleed** |
| Cover Finish | Matte or Glossy, your preference |

**Choosing cream matters.** The wrap is calculated on cream thickness.

To switch to white, the wrap has to be rebuilt. One line.

```
python3 tools/wrap_cover.py bestseller 301 --paper white
python3 tools/wrap_cover.py en-bestseller 333 --paper white
```

**3. Manuscript** — upload the `_interior-` / `_본문-` file.
**It is a PDF, not an EPUB.**

**4. Book Cover** — choose *Upload a cover you already have* and give it the
`_cover-` / `_표지-` file. **The cover must also be a PDF.** The JPG is for the ebook.

**5. Previewer** — check that the size KDP asks for matches the table above.
If it doesn't, the page count is wrong.

---

# Final checklist

- [ ] Interior uploaded as **PDF** (not EPUB)
- [ ] Cover uploaded as **PDF** (not JPG)
- [ ] Page counts in the two filenames match (`333p` ↔ `333p`)
- [ ] **Cream** paper selected
- [ ] **No Bleed** selected
- [ ] The size KDP asks for matches the table above
- [ ] In the previewer, the barcode sits at the **lower right of the back cover**
- [ ] Spine text does not cross the fold lines
- [ ] The Korean interior displays in a **Hangul font** in the previewer

Please check that last line.
**That is what sent this back for a re-render this time.**

---

# Ready to publish

```
0 verification items, 0 TODOs.
```

The blanks are cleared. **Nothing was invented to fill them.**

What was confirmed is written into the sources. What could not be confirmed was
**cut whole.** And *How This Book Was Made* states exactly how far the
verification went and what was not done.

Twenty-three items that need raising to primary sources live in
`bestseller/verify.md`. That list does not block publication; it is homework for
the next edition.

One thing to check before publishing.

**Whether `Why Is This Still Here?` already exists on Amazon.**
**A title cannot be changed after publication.**
