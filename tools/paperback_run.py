#!/usr/bin/env python3
import os, sys, json, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_paperback as P

NOVEL = "/home/user/Johan/writing/novel"
WORK  = "/tmp/claude-0/-home-user-Johan/3ed7ca12-811f-5009-aa20-bf38dc764e41/scratchpad/pb"
os.makedirs(WORK, exist_ok=True)

BLURB = {
1: (["<p class='lead'>Grandfather stopped preaching two years before he died, and never said why.</p>",
     "<p>Temel falls into a city called Loop, where an intelligence named Arche answers every question ever put to it. It has never once been wrong. It has also never been asked the only question Temel came with.</p>",
     "<p>With Mena, who writes things down, and Speon, who cannot wait, he learns what a machine can hand you and what it cannot. Somewhere in the city a man walks who answers nothing and finishes everything.</p>"],
    "Book One of the Loop Chronicles"),
2: (["<p class='lead'>In Haven, no one suffers for long. That is the problem.</p>",
     "<p>Zeteo and his sister Elpis flee the brickfields and fall into a city whose Ledger resolves every grief the moment it is filed. Nothing goes unanswered. Nothing is ever heard.</p>",
     "<p>Zeteo does not believe, and he has reasons. This book does not hurry to take them from him. It follows two children looking for a father who came out of the well without his name.</p>"],
    "Book Two of the Loop Chronicles"),
3: (["<p class='lead'>He ran because he was afraid the city would be forgiven.</p>",
     "<p>Pheugon reads sentences aloud. When he is ordered to proclaim a city's demolition in forty days, he runs — not from fear, but from arithmetic. The Scales that weighs every act has never been wrong, and it cannot weigh a turning.</p>",
     "<p>Trope believes mercy exists. She simply does not believe it is coming to her. Two children meet across the one thing neither can give the other.</p>"],
    "Book Three of the Loop Chronicles"),
4: (["<p class='lead'>The law says leave the corners of the field. The Roll keeps that law perfectly. Nothing falls.</p>",
     "<p>Xene follows her widowed mother-in-law into the Harvest knowing what it will cost. At the gate the Roll computes her standing and returns zero. Nobody drives her out. They simply give her nothing.</p>",
     "<p>Lytron has never done anything wrong, and it takes him a season to see that this and never having lost anything are the same fact from two sides.</p>"],
    "Book Four of the Loop Chronicles"),
5: (["<p class='lead'>Nobody dies in the Preserve. They also never laugh again.</p>",
     "<p>Seven years ago Anemos was outside fetching water when his mother and brother were preserved. He has come to wake them — and learns that undoing it is simple, permitted, and returns a person to a body that can die.</p>",
     "<p>To get them back is to make them losable. Eikon was preserved at fifteen and is fifteen still. She lacks nothing, and her argument is harder to answer than grief.</p>"],
    "Book Five of the Loop Chronicles"),
6: (["<p class='lead'>Nobody is ever wronged in the Equity. Nobody decided anything, either.</p>",
     "<p>Hora gets her committee seat for no reason at all: someone quit and her number came up. She has one habit — she reads things to the end — and so she reads a deliberation to its last line and understands what it will do to eleven hundred and forty people.</p>",
     "<p>Four hundred and thirty-two people were involved. Every one tells her the truth: I only passed it on. At the bottom of every document there is a box for a signature, and it has never once been filled.</p>"],
    "Book Six of the Loop Chronicles"),
7: (["<p class='lead'>Records keep arriving in Loop. Nobody asked for them.</p>",
     "<p>Mone puts things in order. Arche sorts and indexes every record that comes down the water channel from five other cities, and has never closed a single case. When she asks what condition must be met, it answers truthfully: that item is not defined.</p>",
     "<p>Histor has read all six records and knows where every passage sits. None of it has done anything to him. Then the tide records line the six calendars up, and two entries place the same nameless man in two cities on the same day.</p>"],
    "The finale of the Loop Chronicles"),
}

def main(only=None):
    out = os.path.join(NOVEL, "종이책")
    results = []
    for n, _, d, slug, cfgkey, title, subtitle in P.BOOKS:
        if only and n != only: continue
        bookdir = os.path.join(out, "%d권-%s" % (n, slug))
        os.makedirs(bookdir, exist_ok=True)
        interior = os.path.join(bookdir, "%02d-%s-본문.pdf" % (n, slug))

        # 1) 임시 여백으로 한 번 뽑아 쪽수 구간을 본 뒤, 그 구간의 규정 여백으로 다시 뽑는다
        p0 = P.build_interior(cfgkey, interior, 0.75)
        m  = P.inside_margin(p0)
        if abs(m - 0.75) > 1e-9:
            p0 = P.build_interior(cfgkey, interior, m)
            if P.inside_margin(p0) != m:
                p0 = P.build_interior(cfgkey, interior, P.inside_margin(p0))
                m = P.inside_margin(p0)

        cover_png = os.path.join(NOVEL, d, "cover", "%s-cover.png" % slug)
        cover_pdf = os.path.join(bookdir, "%02d-%s-표지.pdf" % (n, slug))
        blurb, tag = BLURB[n]
        info = P.build_cover(n, slug, title, p0, blurb, tag, cover_png, cover_pdf, WORK)
        info.update(n=n, title=title, subtitle=subtitle, slug=slug,
                    margin=m, interior=interior, cover=cover_pdf)
        results.append(info)
        print(f"{n}권 {title:<22} {p0}쪽  여백 {m}in  책등 {info['spine']}in  "
              f"표지 {info['width']} x {info['height']}in")
    json.dump(results, open(os.path.join(WORK, "results.json"), "w"), ensure_ascii=False, indent=1)
    return results

if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else None)
