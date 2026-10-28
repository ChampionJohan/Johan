#!/usr/bin/env python3
"""
KDP 종이책(페이퍼백) 빌드 — 루프 연대기 영어판.

만드는 것 두 가지:
  1) 본문 PDF   6 x 9 in, 도련 없음(텍스트 전용), KDP 여백 규정 충족
  2) 표지 PDF   뒤표지 + 책등 + 앞표지가 이어진 한 장

표지 크기 식 (인치):
    폭   = 0.125 + 6 + 책등 + 6 + 0.125
    높이 = 0.125 + 9 + 0.125
    책등 = 본문 쪽수 x 종이 두께(미색 0.0025)

쪽수가 바뀌면 책등이 바뀌고 표지 폭이 틀려진다. 그래서 이 스크립트는
본문을 먼저 만들고, 만들어진 PDF에서 쪽수를 직접 읽어 표지를 만든다.
사람이 적어 둔 숫자를 쓰지 않는다.
"""
import os, re, sys, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_ebook as B
from PIL import Image

TRIM_W, TRIM_H = 6.0, 9.0
BLEED         = 0.125
PAPER_CREAM   = 0.0025      # 쪽당 인치
SAFE          = 0.25        # 재단선에서 글자까지
BARCODE_W, BARCODE_H = 2.0, 1.2
BARCODE_OFF   = 0.25        # 책등 쪽 / 아래 재단선에서 띄우는 값
DPI           = 300

OUT = "/home/user/Johan/writing/novel/종이책"

BOOKS = [
    (1, "ko,en 공통", "루프-연대기",   "loop-chronicles",      "en",
     "Loop Chronicles", "A Novel of Daniel's Prophecy and the Machine That Answers Everything"),
    (2, "", "울음-장부",     "the-weeping-ledger",   "en2",
     "The Weeping Ledger", "A Novel of a Father Who Forgot His Name"),
    (3, "", "사십일-조항",   "the-forty-day-clause", "en3",
     "The Forty-Day Clause", "A Novel of a City Given Forty Days"),
    (4, "", "이삭-줍는-자리", "the-gleaning-ground",  "en4",
     "The Gleaning Ground", "A Novel of a Field Where Nothing Falls"),
    (5, "", "마른-골짜기",   "the-dry-valley",       "en5",
     "The Dry Valley", "A Novel of a City Where No One Dies"),
    (6, "", "저자-없는-책",  "the-unsigned-book",    "en6",
     "The Unsigned Book", "A Novel of a City Where Nobody Decides"),
    (7, "", "마지막-방",     "the-last-room",        "en7",
     "The Last Room", "The Final Novel of the Loop Chronicles"),
]

AUTHOR = "Jaehyuk Choi"
SERIES = "LOOP CHRONICLES"


def inside_margin(pages):
    """KDP 내부(책등 쪽) 최소 여백."""
    if pages <= 150:  return 0.375
    if pages <= 300:  return 0.50
    if pages <= 500:  return 0.625
    if pages <= 700:  return 0.75
    return 0.875


def pdf_pages(path):
    d = open(path, "rb").read()
    return int(re.findall(rb"/Count\s+(\d+)", d)[-1])


# ---------------------------------------------------------------- 본문

def build_interior(cfg_key, out_pdf, margin_in):
    """전자책과 같은 본문 HTML을 쓰되 종이책 여백으로 PDF를 뽑는다."""
    cfg = B.CONFIGS[cfg_key]
    chapters = B.load_chapters(cfg)

    cover = ('<section class="cover"><p class="kicker">%s</p>'
             '<h1>%s</h1><p class="subtitle">%s</p>'
             '<p class="author">%s</p></section>'
             % (html.escape(cfg["cover_kicker"]), html.escape(cfg["title"]),
                html.escape(cfg["subtitle"]), html.escape(cfg["author"])))

    toc_items, current = [], None
    for c in chapters:
        if c["part"] and c["part"] != current:
            toc_items.append('<div class="part">%s</div>' % html.escape(c["series"]))
            current = c["part"]
        toc_items.append('<div class="chap">%s</div>' % html.escape(c["title"]))
    toc = '<section class="toc"><h2>%s</h2>%s</section>' % (
        html.escape(cfg["toc_label"]), "".join(toc_items))

    parts, current = [cover, toc], None
    for c in chapters:
        if c["part"] and c["part"] != current:
            parts.append('<section class="part-divider"><p class="num">%s</p><h2>%s</h2></section>'
                         % (html.escape(c["part"]), html.escape(c["part_title"])))
            current = c["part"]
        parts.append('<article class="chapter">%s</article>' % B.mdlite.render(c["body"]))
    parts.append('<section class="colophon"><p>%s</p><p>%s</p></section>'
                 % (html.escape(cfg["title"]), html.escape(cfg["author"])))

    page = B.PDF_PAGE.format(lang=cfg["lang"], css=B.BOOK_CSS, body="\n".join(parts))
    html_path = out_pdf.replace(".pdf", ".html")
    open(html_path, "w", encoding="utf-8").write(page)

    from playwright.sync_api import sync_playwright
    footer = ('<div style="width:100%;font-size:8.5px;color:#8a8072;'
              'font-family:Georgia,serif;text-align:center;padding-top:2px;">'
              '<span class="pageNumber"></span></div>')
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        pg = br.new_page()
        pg.goto("file://" + os.path.abspath(html_path))
        pg.pdf(path=out_pdf, print_background=True,
               width="%gin" % TRIM_W, height="%gin" % TRIM_H,
               margin={"top": "0.75in", "bottom": "0.85in",
                       "left": "%gin" % margin_in, "right": "%gin" % margin_in},
               display_header_footer=True, header_template="<span></span>",
               footer_template=footer)
        br.close()
    os.remove(html_path)
    pad_even(out_pdf)
    return pdf_pages(out_pdf)


def pad_even(pdf_path):
    """쪽수가 홀수면 끝에 빈 쪽을 한 장 붙여 짝수로 맞춘다.
    홀수로 올리면 KDP가 알아서 빈 쪽을 붙이는데, 그러면 실제 쪽수가
    우리가 책등을 계산한 숫자와 어긋난다. 여기서 미리 맞춰 둔다."""
    import pikepdf
    with pikepdf.open(pdf_path, allow_overwriting_input=True) as pdf:
        if len(pdf.pages) % 2 == 0:
            return False
        box = pdf.pages[0].obj.get("/MediaBox")
        blank = pdf.add_blank_page(page_size=(float(box[2]) - float(box[0]),
                                              float(box[3]) - float(box[1])))
        pdf.save(pdf_path)
    return True


# ---------------------------------------------------------------- 표지

def front_panel_image(cover_png, out_png):
    """전자책 표지 그림을 앞표지 칸(6.125 x 9.25in)에 맞춘다.
    높이를 맞춰 줄이고, 남는 좌우는 가장자리 색을 늘려 채운다.
    그림이 잘리지 않으므로 전자책 표지와 구도가 같다."""
    pw = int(round((TRIM_W + BLEED) * DPI))
    ph = int(round((TRIM_H + 2 * BLEED) * DPI))
    src = Image.open(cover_png).convert("RGB")
    w = int(round(src.width * ph / src.height))
    src = src.resize((w, ph), Image.LANCZOS)
    if w >= pw:
        x = (w - pw) // 2
        src.crop((x, 0, x + pw, ph)).save(out_png)
        return
    canvas = Image.new("RGB", (pw, ph))
    x0 = (pw - w) // 2
    canvas.paste(src, (x0, 0))
    left  = src.crop((0, 0, 1, ph)).resize((x0, ph))
    right = src.crop((w - 1, 0, w, ph)).resize((pw - x0 - w, ph))
    canvas.paste(left, (0, 0))
    canvas.paste(right, (x0 + w, 0))
    canvas.save(out_png)


WRAP_HTML = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,500&display=swap">
<style>
@page {{ size: {W}in {H}in; margin: 0; }}
html,body{{margin:0;padding:0;width:{W}in;height:{H}in;background:#070d15;
  font-family:"EB Garamond",Georgia,serif;color:#f2ecd9;overflow:hidden}}
.wrap{{position:relative;width:{W}in;height:{H}in}}
.front{{position:absolute;left:{front_x}in;top:0;width:{panel_w}in;height:{H}in}}
.front img{{display:block;width:100%;height:100%}}
.spine{{position:absolute;left:{spine_x}in;top:0;width:{spine}in;height:{H}in;
  background:#070d15}}
.spine .txt{{position:absolute;left:50%;top:50%;
  transform:translate(-50%,-50%) rotate(90deg);transform-origin:center;
  white-space:nowrap;font-family:"Cormorant Garamond",serif;font-weight:600;
  font-size:{spine_fs}pt;letter-spacing:.06em;color:#f6efdd}}
.spine .txt .au{{font-family:"EB Garamond",serif;font-weight:400;
  font-size:{spine_au}pt;letter-spacing:.14em;color:#d8bd85}}
.back{{position:absolute;left:0;top:0;width:{panel_w}in;height:{H}in;
  background:radial-gradient(900px 900px at 50% 40%, #16293c 0%, #0d1a28 55%, #070d15 100%)}}
.bk{{position:absolute;left:{bk_l}in;right:{bk_r}in;top:{bk_t}in;bottom:{bk_b}in;
  display:flex;flex-direction:column;justify-content:center}}
.bk .ser{{text-align:center;font-family:"Cormorant Garamond",serif;font-weight:600;
  font-size:11pt;letter-spacing:.34em;color:#d8bd85;margin:0 0 .10in}}
.bk .bno{{text-align:center;font-size:7.5pt;letter-spacing:.42em;color:#8a95a3;
  text-transform:uppercase;margin:0 0 .30in}}
.bk h2{{text-align:center;font-family:"Cormorant Garamond",serif;font-weight:600;
  font-size:21pt;line-height:1.16;margin:0 0 .26in;color:#f6efdd}}
.bk p{{font-size:10.2pt;line-height:1.56;margin:0 0 .13in;color:#ded7c6}}
.bk p.lead{{font-style:italic;color:#c9bfa0}}
.bk .rule{{width:1.1in;height:1px;margin:.26in auto;
  background:linear-gradient(90deg,transparent,#d8bd85,transparent)}}
.bk .tag{{text-align:center;font-size:8.6pt;letter-spacing:.055em;color:#9aa4b0;margin:0}}
.barcode{{position:absolute;left:{bc_x}in;top:{bc_y}in;
  width:{bc_w}in;height:{bc_h}in;background:#ffffff}}
</style></head><body><div class="wrap">
  <div class="back">
    <div class="bk">
      <p class="ser">{series}</p>
      <p class="bno">{book_word}</p>
      <h2>{title}</h2>
      {blurb}
      <div class="rule"></div>
      <p class="tag">{tagline}</p>
    </div>
  </div>
  <div class="spine"><div class="txt">{title_upper} &nbsp;·&nbsp; <span class="au">{author}</span></div></div>
  <div class="front"><img src="{front_png}"></div>
  <div class="barcode"></div>
</div></body></html>
"""

WORDS = {1:"BOOK ONE",2:"BOOK TWO",3:"BOOK THREE",4:"BOOK FOUR",
         5:"BOOK FIVE",6:"BOOK SIX",7:"BOOK SEVEN · THE FINALE"}


def build_cover(n, slug, title, pages, blurb_paras, tagline, cover_png, out_pdf, workdir):
    spine = round(pages * PAPER_CREAM, 4)
    W = round(2 * BLEED + 2 * TRIM_W + spine, 4)
    H = round(TRIM_H + 2 * BLEED, 4)
    panel_w = TRIM_W + BLEED

    front_png = os.path.join(workdir, "%s-front.png" % slug)
    front_panel_image(cover_png, front_png)

    # 바코드 흰 자리: 뒤표지의 책등 쪽에서 0.25, 아래 재단선에서 0.25
    spine_x = panel_w
    bc_x = spine_x - BARCODE_OFF - BARCODE_W
    bc_y = (BLEED + TRIM_H) - BARCODE_OFF - BARCODE_H

    # 뒷글 영역: 재단선에서 0.25 안쪽 + 바코드 자리 위까지
    bk_l = BLEED + 0.45
    bk_r = 0.45
    bk_t = BLEED + 0.80
    bk_b = (H - bc_y) + 0.30

    page = WRAP_HTML.format(
        W=W, H=H, panel_w=panel_w, spine=spine,
        front_x=spine_x + spine, spine_x=spine_x,
        spine_fs=round(min(22.0, max(11.0, spine * 72 * 0.22)), 1),
        spine_au=round(min(14.0, max(7.5, spine * 72 * 0.137)), 1),
        bc_x=bc_x, bc_y=bc_y, bc_w=BARCODE_W, bc_h=BARCODE_H,
        bk_l=bk_l, bk_r=bk_r, bk_t=bk_t, bk_b=round(bk_b, 4),
        series=SERIES, book_word=WORDS[n], title=html.escape(title),
        title_upper=html.escape(title.upper()), author=html.escape(AUTHOR),
        blurb="\n      ".join(blurb_paras), tagline=html.escape(tagline),
        front_png="file://" + os.path.abspath(front_png))

    html_path = os.path.join(workdir, "%s-wrap.html" % slug)
    open(html_path, "w", encoding="utf-8").write(page)

    # Chromium 의 page.pdf 는 페이지 크기를 반올림한다(최대 0.014in 오차).
    # 쪽수에서 계산한 폭이 정확해야 하므로, 그림으로 먼저 뽑고
    # 페이지 상자를 직접 지정해 PDF 로 감싼다.
    png = os.path.join(workdir, "%s-wrap.png" % slug)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        pg = br.new_page(viewport={"width": int(round(W * 96)),
                                   "height": int(round(H * 96))},
                         device_scale_factor=DPI / 96.0)
        pg.goto("file://" + os.path.abspath(html_path))
        pg.wait_for_timeout(3500)
        pg.screenshot(path=png, clip={"x": 0, "y": 0, "width": W * 96, "height": H * 96})
        br.close()

    jpg = os.path.join(workdir, "%s-wrap.jpg" % slug)
    Image.open(png).convert("RGB").save(jpg, quality=95, subsampling=0, dpi=(DPI, DPI))

    import img2pdf
    layout = img2pdf.get_layout_fun((img2pdf.in_to_pt(W), img2pdf.in_to_pt(H)))
    with open(out_pdf, "wb") as fh:
        fh.write(img2pdf.convert(jpg, layout_fun=layout))

    return dict(pages=pages, spine=spine, width=W, height=H,
                barcode=dict(x=bc_x, y=bc_y, w=BARCODE_W, h=BARCODE_H))
