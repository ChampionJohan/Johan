#!/usr/bin/env python3
"""donations/*.csv 후원금 장부를 날짜순으로 정리해 md / html 로 뽑는다.

    python3 tools/donation.py                 # donations/malaysia.csv -> .md + .html
    python3 tools/donation.py --file donations/malaysia.csv
    python3 tools/donation.py --title "말레이시아지부 후원금 내역"

CSV 열: date,donor,amount,currency,method,note
  date     2026-09-18 / 2026.09.18 / 26-09-18 전부 받는다
  amount   1,000,000 / 1000000 / 100,000원 전부 받는다
  currency 비우면 KRW. 통화가 섞여 있으면 통화별로 따로 합산한다.
"""

import argparse
import csv
import html
import os
import re
from collections import OrderedDict
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CSV = os.path.join(ROOT, "donations", "malaysia.csv")
DEFAULT_TITLE = "말레이시아지부 후원금 내역"

# 통화별 표기: (기호, 접미사, 소수 자릿수)
CURRENCY = {
    "KRW": ("", "원", 0),
    "MYR": ("RM ", "", 2),
    "USD": ("$", "", 2),
    "PHP": ("₱", "", 2),
    "THB": ("฿", "", 2),
}

_DATE_FORMATS = ("%Y-%m-%d", "%Y.%m.%d", "%Y/%m/%d", "%y-%m-%d", "%y.%m.%d", "%Y%m%d")
_WEEKDAYS = ("월", "화", "수", "목", "금", "토", "일")


def parse_date(value, lineno):
    text = (value or "").strip()
    for fmt in _DATE_FORMATS:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    raise ValueError("%d행: 날짜를 못 읽음 -> %r" % (lineno, value))


def parse_amount(value, lineno):
    text = re.sub(r"[^0-9.\-]", "", (value or ""))
    if not text:
        raise ValueError("%d행: 금액이 비어 있음" % lineno)
    try:
        number = float(text)
    except ValueError:
        raise ValueError("%d행: 금액을 못 읽음 -> %r" % (lineno, value))
    return number


def money(amount, currency):
    prefix, suffix, digits = CURRENCY.get(currency, ("", " " + currency, 2))
    return "%s%s%s" % (prefix, format(round(amount, digits), ",.%df" % digits), suffix)


def totals_line(totals):
    """통화별 합계를 한 줄로. 통화가 하나면 그 금액만 나온다."""
    return " + ".join(money(amount, code) for code, amount in totals.items())


def read_rows(path):
    rows = []
    with open(path, encoding="utf-8-sig", newline="") as handle:
        for lineno, raw in enumerate(csv.DictReader(handle), start=2):
            if not any((v or "").strip() for v in raw.values()):
                continue
            currency = (raw.get("currency") or "").strip().upper() or "KRW"
            rows.append({
                "date": parse_date(raw.get("date"), lineno),
                "donor": (raw.get("donor") or "").strip() or "(익명)",
                "amount": parse_amount(raw.get("amount"), lineno),
                "currency": currency,
                "method": (raw.get("method") or "").strip(),
                "note": (raw.get("note") or "").strip(),
            })
    rows.sort(key=lambda r: (r["date"], r["donor"]))
    return rows


def group_by_date(rows):
    groups = OrderedDict()
    for row in rows:
        groups.setdefault(row["date"], []).append(row)
    return groups


def sum_by_currency(rows):
    totals = OrderedDict()
    for row in rows:
        totals[row["currency"]] = totals.get(row["currency"], 0.0) + row["amount"]
    return totals


def render_md(rows, title):
    groups = group_by_date(rows)
    grand = sum_by_currency(rows)
    running = OrderedDict()

    out = ["# %s" % title, ""]
    out.append("기준일 %s · 건수 %d건 · **총액 %s**"
               % (date.today().isoformat(), len(rows), totals_line(grand) or "0원"))
    out.append("")

    if not rows:
        out.append("아직 등록된 내역이 없다. `donations/malaysia.csv` 에 한 줄씩 채우면 여기에 쌓인다.")
        out.append("")
        return "\n".join(out)

    out.append("## 날짜별 내역")
    out.append("")
    for day, items in groups.items():
        day_total = sum_by_currency(items)
        for code, amount in day_total.items():
            running[code] = running.get(code, 0.0) + amount
        out.append("### %s (%s)" % (day.isoformat(), _WEEKDAYS[day.weekday()]))
        out.append("")
        out.append("| 후원자 | 금액 | 방법 | 비고 |")
        out.append("|---|---:|---|---|")
        for row in items:
            out.append("| %s | %s | %s | %s |" % (
                row["donor"], money(row["amount"], row["currency"]),
                row["method"] or "-", row["note"] or "-"))
        out.append("")
        out.append("소계 %s · 누계 %s" % (totals_line(day_total), totals_line(running)))
        out.append("")

    out.append("## 합계")
    out.append("")
    out.append("| 구분 | 값 |")
    out.append("|---|---:|")
    out.append("| 후원 건수 | %d건 |" % len(rows))
    out.append("| 후원자 수 | %d명 |" % len({r["donor"] for r in rows}))
    out.append("| 기간 | %s ~ %s |" % (rows[0]["date"].isoformat(), rows[-1]["date"].isoformat()))
    for code, amount in grand.items():
        out.append("| 합계 (%s) | **%s** |" % (code, money(amount, code)))
    out.append("")
    return "\n".join(out)


CSS = """
:root{--bg:#fbfaf8;--fg:#1c1b19;--muted:#6b6862;--line:#e3dfd8;--accent:#8a5a2b;--card:#fff;--code:#f2efe9}
@media (prefers-color-scheme:dark){:root{--bg:#16151a;--fg:#e8e5df;--muted:#9a958c;--line:#2e2c33;--accent:#d9a978;--card:#1d1c22;--code:#232228}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
  font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;
  line-height:1.7;-webkit-text-size-adjust:100%}
.wrap{max-width:46rem;margin:0 auto;padding:2.5rem 1.25rem 4rem}
h1{font-size:1.5rem;letter-spacing:-.02em;margin:0 0 .5rem}
.sub{color:var(--muted);font-size:.88rem;margin:0}
.total{margin:1.5rem 0 2.5rem;padding:1.25rem 1.4rem;background:var(--card);border:1px solid var(--line);border-radius:.6rem}
.total .label{font-size:.78rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
.total .value{font-size:2rem;font-weight:700;color:var(--accent);letter-spacing:-.02em;line-height:1.25;margin-top:.2rem}
.total .meta{color:var(--muted);font-size:.85rem;margin-top:.35rem}
h2{font-size:1.1rem;margin:2.5rem 0 1rem;border-bottom:1px solid var(--line);padding-bottom:.5rem}
h3{font-size:.95rem;margin:2rem 0 .6rem;color:var(--accent)}
table{width:100%;border-collapse:collapse;font-size:.92rem}
th,td{padding:.55rem .6rem;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{font-size:.78rem;color:var(--muted);font-weight:600;letter-spacing:.03em}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tr.sum td{border-bottom:none;color:var(--muted);font-size:.84rem;padding-top:.5rem}
tfoot td{font-weight:700;border-top:2px solid var(--line);border-bottom:none}
.empty{color:var(--muted);background:var(--code);padding:1.25rem;border-radius:.5rem}
@media (max-width:30rem){.wrap{padding:1.75rem 1rem 3rem}.total .value{font-size:1.6rem}table{font-size:.85rem}}
"""


def render_html(rows, title):
    e = html.escape
    groups = group_by_date(rows)
    grand = sum_by_currency(rows)
    running = OrderedDict()

    body = []
    body.append('<h1>%s</h1>' % e(title))
    body.append('<p class="sub">기준일 %s</p>' % date.today().isoformat())
    body.append('<div class="total"><div class="label">총 후원금</div>'
                '<div class="value">%s</div>'
                '<div class="meta">%s</div></div>'
                % (e(totals_line(grand) or "0원"),
                   e("%d건 · %s ~ %s" % (len(rows), rows[0]["date"].isoformat(),
                                         rows[-1]["date"].isoformat())) if rows else "등록된 내역 없음"))

    if not rows:
        body.append('<p class="empty">아직 등록된 내역이 없다. '
                    '<code>donations/malaysia.csv</code> 에 한 줄씩 채우면 여기에 쌓인다.</p>')
    else:
        body.append("<h2>날짜별 내역</h2>")
        for day, items in groups.items():
            day_total = sum_by_currency(items)
            for code, amount in day_total.items():
                running[code] = running.get(code, 0.0) + amount
            body.append("<h3>%s (%s)</h3>" % (day.isoformat(), _WEEKDAYS[day.weekday()]))
            body.append('<table><thead><tr><th>후원자</th><th class="num">금액</th>'
                        "<th>방법</th><th>비고</th></tr></thead><tbody>")
            for row in items:
                body.append('<tr><td>%s</td><td class="num">%s</td><td>%s</td><td>%s</td></tr>'
                            % (e(row["donor"]), e(money(row["amount"], row["currency"])),
                               e(row["method"] or "-"), e(row["note"] or "-")))
            body.append('</tbody><tbody><tr class="sum"><td colspan="4">소계 %s · 누계 %s</td></tr>'
                        "</tbody></table>"
                        % (e(totals_line(day_total)), e(totals_line(running))))

        body.append("<h2>합계</h2>")
        body.append("<table><tbody>")
        body.append('<tr><td>후원 건수</td><td class="num">%d건</td></tr>' % len(rows))
        body.append('<tr><td>후원자 수</td><td class="num">%d명</td></tr>'
                    % len({r["donor"] for r in rows}))
        body.append("</tbody><tfoot>")
        for code, amount in grand.items():
            body.append('<tr><td>합계 (%s)</td><td class="num">%s</td></tr>'
                        % (e(code), e(money(amount, code))))
        body.append("</tfoot></table>")

    return ("<!doctype html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n"
            "<title>%s</title>\n<style>%s</style>\n</head>\n<body>\n<div class=\"wrap\">\n%s\n</div>\n"
            "</body>\n</html>\n" % (e(title), CSS, "\n".join(body)))


def main():
    parser = argparse.ArgumentParser(description="후원금 내역을 날짜순으로 정리한다.")
    parser.add_argument("--file", default=DEFAULT_CSV, help="장부 CSV 경로")
    parser.add_argument("--title", default=DEFAULT_TITLE, help="문서 제목")
    args = parser.parse_args()

    path = args.file if os.path.isabs(args.file) else os.path.join(ROOT, args.file)
    rows = read_rows(path)
    base = os.path.splitext(path)[0]

    for suffix, text in ((".md", render_md(rows, args.title)),
                         (".html", render_html(rows, args.title))):
        with open(base + suffix, "w", encoding="utf-8") as handle:
            handle.write(text)
        print("wrote %s" % os.path.relpath(base + suffix, ROOT))

    print("총 %d건 / %s" % (len(rows), totals_line(sum_by_currency(rows)) or "0원"))


if __name__ == "__main__":
    main()
