---
title: English Titles — Options That Actually Stand Out
date: 2026-09-09
---

# First: the current title has a real problem

I flagged *Anatomy of Money* as unverified last time. I've now checked, and
**the concern was right.**

That shelf is crowded:

- *Anatomy of a Business Plan* — a long-running title with an award on the cover
- *Anatomy of Business*
- *The Anatomy of Financial Success*
- *The Anatomy of the Swipe: Making Money Move*

**"Anatomy of ___" is a format, not a title.** Sitting in that row, a new book
reads as one more entry in a pattern rather than something new.

It's also passive. It tells you the book is a dissection. It doesn't make you
want to open it.

---

# What "eye-catching" actually means on Amazon

A title on a category page has **about one second** and roughly a
thumbnail's worth of pixels. So three tests:

| Test | The question |
|---|---|
| **Thumbnail** | Is it legible at 120 pixels wide? Long titles turn to grey mush. |
| **One second** | Does it make a stranger stop, or does it slide past? |
| **Series** | Do all four look like they belong together? |

The strongest hook this book has is not that it dissects things.
**It's that it asks you a question you can't answer.**

You look at a free app every day and you don't actually know who pays for it.
That's Box One, it's Chapter 1, and it's the most arresting thing in the book.

---

# Set A — The Question Set · **recommended**

| | Title | Subtitle |
|---|---|---|
| **Vol 1** | **Who's Actually Paying?** | Take Any Business Apart in Five Questions |
| **Vol 2** | **Why Hasn't Anyone Taken It Yet?** | Moats, Fault Lines, and What to Build Next |
| **Teen 1** | **It's Free. So How Are They Rich?** | How Money Actually Works — and How to Start |
| **Teen 2** | **I Started. So Why Isn't It Working?** | The Part Nobody Warns You About |

## Why this set

**Every title is literally a box from the framework.**

Volume 1 is Box One. Volume 2 is Box Four. The teen book is Chapter 1's hook,
word for word. Teen 2 is the wall the whole book is about.

**They're not marketing copy bolted on top. They're the book's own questions.**

**A question does something a noun phrase can't.** *Anatomy of Money* describes.
*Who's Actually Paying?* makes you check whether you know the answer —
and you don't, which is exactly why you'd open it.

**The teen title is the strongest of the four.** A fifteen-year-old has wondered
about free games. So has the parent holding the credit card.

**And they work as a set.** Four questions, escalating: who pays → why hasn't
it been taken → it's free, so how → I started, so why not.

## The honest tradeoff

**Question titles are weaker for keyword search.** Nobody types
"who's actually paying" into Amazon.

But the title was never doing that job. **The subtitle and the seven keyword
slots do the searching** — that's what they're for. The title's job is to stop
the scroll on a category page, and a question beats a noun there.

If you want insurance, Volume 1's subtitle carries *business* and
*five questions*, and the keyword list already covers
*how businesses make money*, *business model analysis*, and the rest.

---

# Set B — The Short Set

| | Title | Subtitle |
|---|---|---|
| **Vol 1** | **Take It Apart** | How Any Business Actually Works, in Five Boxes |
| **Vol 2** | **Why It Holds** | Moats, Fault Lines, and What Lasts |
| **Teen 1** | **Take It Apart: Teen Edition** | How Money Actually Works |
| **Teen 2** | **Put It Back Together** | What To Do When It Stops Working |

**Best thumbnail performance of the three sets.** Three short words survive
at any size, and *Take It Apart* is an instruction — imperatives read as confident.

**Weakness:** *Take It Apart* alone doesn't say "business." Without the subtitle
it could be a repair manual. On a category page that's fine, because context
supplies the category. In a search result it's vaguer.

---

# Set C — The Brand Set

| | Title | Subtitle |
|---|---|---|
| **Vol 1** | **The Five Boxes** | How to Take Any Business Apart |
| **Vol 2** | **The Fourth Box** | Why Some Businesses Can't Be Taken |
| **Teen 1** | **The Five Boxes for Teens** | How Money Actually Works |
| **Teen 2** | **The Fifth Box** | Where It Breaks, and What To Do |

**This is the set that builds an asset.** If the framework ever catches on,
"the five boxes" becomes the thing people say, and you own it.

***The Fourth Box* is the best single title in this document.** It's intriguing
on its own — you want to know what the fourth one is — and it means something
specific once you've read Book 1.

**Weakness:** it's the slowest starter. *The Five Boxes* means nothing to someone
who's never heard of you. It's a bet that pays later, not now.

---

# My recommendation

**Set A, with one borrowing from Set C.**

| | Title |
|---|---|
| Vol 1 | **Who's Actually Paying?** |
| Vol 2 | **The Fourth Box** *(subtitle: Why Some Businesses Can't Be Taken)* |
| Teen 1 | **It's Free. So How Are They Rich?** |
| Teen 2 | **I Started. So Why Isn't It Working?** |

Volume 2 is the one book whose buyer **has already read Book 1.** They know
what the boxes are. For that reader *The Fourth Box* is more intriguing than
another question — and it quietly signals that this is a sequel, which is
exactly what you want on a series page.

Everywhere else, the question does more work.

---

# Before you commit

**Search each exact string on Amazon yourself.** I can search the open web,
but I can't see Amazon's catalogue directly from here, so treat my checks as
a signal, not a clearance.

Three things to look at:

1. **Exact title in quotes** — is there a book with this name already?
2. **The category page** — do your candidates stand out from what's on it,
   or blend in?
3. **Shrink the cover to 120px** and look at it on a phone. If you can't read
   it, the title is too long, no matter how good it sounds.

**Nothing is locked.** Titles live in four small files —
`tools/en_book.py`, `en_book2.py`, `en_teen.py`, `en_teen2.py`.
Changing one is a one-line edit and a rebuild, and the EPUB metadata,
the title page, and the running heads all follow automatically.

**The only real cost is changing it after publishing**, because the Amazon
listing carries reviews and ranking. So decide before the first upload,
not after.
