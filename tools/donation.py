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
    """통화별 합계. 표기 순서가 구간마다 흔들리지 않게 통화 코드순으로 고정한다."""
    totals = {}
    for row in rows:
        totals[row["currency"]] = totals.get(row["currency"], 0.0) + row["amount"]
    return OrderedDict(sorted(totals.items()))




def group_by_month(rows):
    """YYYY-MM 키로 묶는다. 후원이 없던 달은 0으로 채워 추이가 끊기지 않게 한다."""
    groups = OrderedDict()
    if not rows:
        return groups
    year, month = rows[0]["date"].year, rows[0]["date"].month
    last = (rows[-1]["date"].year, rows[-1]["date"].month)
    while (year, month) <= last:
        groups["%04d-%02d" % (year, month)] = []
        year, month = (year + 1, 1) if month == 12 else (year, month + 1)
    for row in rows:
        groups["%04d-%02d" % (row["date"].year, row["date"].month)].append(row)
    return groups


def group_by_donor(rows):
    """후원자별로 묶어 합계 큰 순으로 정렬한다. 통화가 섞이면 건수 순."""
    groups = OrderedDict()
    for row in rows:
        groups.setdefault(row["donor"], []).append(row)
    ordered = sorted(groups.items(),
                     key=lambda kv: (sum(r["amount"] for r in kv[1]), len(kv[1])),
                     reverse=True)
    return OrderedDict(ordered)


def is_regular(items):
    """서로 다른 달에 2회 이상이면 정기 후원자로 본다."""
    return len({(r["date"].year, r["date"].month) for r in items}) >= 2


def change_rate(current, previous):
    """전월 대비 증감률. 전월이 0이면 판단 불가로 None."""
    if not previous:
        return None
    return (current - previous) / previous * 100


def fmt_change(rate):
    if rate is None:
        return "-"
    return "%s%.1f%%" % ("+" if rate >= 0 else "", rate)


def monthly_average(rows, months):
    """월평균. 후원이 없던 달도 분모에 넣어야 실제 유입 속도가 나온다."""
    totals = sum_by_currency(rows)
    if not months:
        return totals
    return OrderedDict((code, amount / months) for code, amount in totals.items())


def render_md(rows, title):
    grand = sum_by_currency(rows)
    single = list(grand.keys())[0] if len(grand) == 1 else None

    out = ["# %s" % title, ""]
    out.append("기준일 %s · 건수 %d건 · **총액 %s**"
               % (date.today().isoformat(), len(rows), totals_line(grand) or "0원"))
    out.append("")

    if not rows:
        out.append("아직 등록된 내역이 없다. `donations/malaysia.csv` 에 한 줄씩 채우면 여기에 쌓인다.")
        out.append("")
        return "\n".join(out)

    months = group_by_month(rows)
    donors = group_by_donor(rows)
    regulars = [name for name, items in donors.items() if is_regular(items)]

    # 1. 요약
    out.append("## 1. 요약")
    out.append("")
    out.append("| 구분 | 값 |")
    out.append("|---|---:|")
    out.append("| 총 후원금 | **%s** |" % totals_line(grand))
    out.append("| 후원 건수 | %d건 |" % len(rows))
    out.append("| 후원자 수 | %d명 (정기 %d명 / 일시 %d명) |"
               % (len(donors), len(regulars), len(donors) - len(regulars)))
    out.append("| 집계 기간 | %s ~ %s (%d개월) |"
               % (rows[0]["date"].isoformat(), rows[-1]["date"].isoformat(), len(months)))
    out.append("| 월평균 | %s |" % totals_line(monthly_average(rows, len(months))))
    out.append("| 건당 평균 | %s |"
               % totals_line(OrderedDict((c, a / len([r for r in rows if r["currency"] == c]))
                                         for c, a in grand.items())))
    out.append("")

    # 2. 월별 집계
    out.append("## 2. 월별 집계")
    out.append("")
    out.append("| 월 | 건수 | 금액 | 누계 | 전월 대비 |")
    out.append("|---|---:|---:|---:|---:|")
    running, previous = OrderedDict(), None
    for label, items in months.items():
        month_total = sum_by_currency(items)
        for code, amount in month_total.items():
            running[code] = running.get(code, 0.0) + amount
        if single:
            current = month_total.get(single, 0.0)
            delta = fmt_change(change_rate(current, previous))
            previous = current
        else:
            delta = "-"
        out.append("| %s | %d건 | %s | %s | %s |"
                   % (label, len(items), totals_line(month_total) or "-",
                      totals_line(running) or "-", delta))
    out.append("")

    # 3. 날짜별 내역
    out.append("## 3. 날짜별 내역")
    out.append("")
    running = OrderedDict()
    for day, items in group_by_date(rows).items():
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

    # 4. 후원자별 집계
    out.append("## 4. 후원자별 집계")
    out.append("")
    header = "| 후원자 | 구분 | 건수 | 합계 |"
    divider = "|---|---|---:|---:|"
    if single:
        header += " 비중 |"
        divider += "---:|"
    out.append(header + " 첫 후원 | 최근 후원 |")
    out.append(divider + "---|---|")
    for name, items in donors.items():
        donor_total = sum_by_currency(items)
        line = "| %s | %s | %d건 | %s |" % (
            name, "정기" if is_regular(items) else "일시", len(items), totals_line(donor_total))
        if single:
            line += " %.1f%% |" % (donor_total.get(single, 0.0) / grand[single] * 100)
        line += " %s | %s |" % (items[0]["date"].isoformat(), items[-1]["date"].isoformat())
        out.append(line)
    out.append("")

    # 5. 합계
    out.append("## 5. 합계")
    out.append("")
    out.append("| 통화 | 금액 |")
    out.append("|---|---:|")
    for code, amount in grand.items():
        out.append("| %s | **%s** |" % (code, money(amount, code)))
    out.append("")
    if len(grand) > 1:
        out.append("> 통화가 섞여 있어 임의 환산 없이 통화별로 분리 합산했다. "
                   "단일 통화 환산이 필요하면 적용 환율과 기준일을 지정할 것.")
        out.append("")
    return "\n".join(out)


CSS = """
:root{--bg:#fbfaf8;--fg:#1c1b19;--muted:#6b6862;--line:#e3dfd8;--accent:#8a5a2b;--card:#fff;--code:#f2efe9;
  --up:#1f7a4d;--down:#a33a3a}
@media (prefers-color-scheme:dark){:root{--bg:#16151a;--fg:#e8e5df;--muted:#9a958c;--line:#2e2c33;--accent:#d9a978;
  --card:#1d1c22;--code:#232228;--up:#5fbf8a;--down:#e08585}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
  font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;
  line-height:1.7;-webkit-text-size-adjust:100%}
.wrap{max-width:52rem;margin:0 auto;padding:2.5rem 1.25rem 4rem}
h1{font-size:1.5rem;letter-spacing:-.02em;margin:0 0 .5rem}
.sub{color:var(--muted);font-size:.88rem;margin:0}
.total{margin:1.5rem 0 2rem;padding:1.25rem 1.4rem;background:var(--card);border:1px solid var(--line);border-radius:.6rem}
.total .label{font-size:.78rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
.total .value{font-size:2rem;font-weight:700;color:var(--accent);letter-spacing:-.02em;line-height:1.25;margin-top:.2rem}
.total .meta{color:var(--muted);font-size:.85rem;margin-top:.35rem}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.75rem;margin:0 0 2.5rem}
.card{background:var(--card);border:1px solid var(--line);border-radius:.5rem;padding:.9rem 1rem}
.card .k{font-size:.75rem;color:var(--muted)}
.card .v{font-size:1.15rem;font-weight:650;letter-spacing:-.01em;margin-top:.15rem;
  font-variant-numeric:tabular-nums}
h2{font-size:1.1rem;margin:2.75rem 0 1rem;border-bottom:1px solid var(--line);padding-bottom:.5rem}
h3{font-size:.95rem;margin:1.75rem 0 .6rem;color:var(--accent)}
table{width:100%;border-collapse:collapse;font-size:.92rem}
th,td{padding:.55rem .6rem;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{font-size:.78rem;color:var(--muted);font-weight:600;letter-spacing:.03em;white-space:nowrap}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.up{color:var(--up)}.down{color:var(--down)}
.pill{display:inline-block;font-size:.72rem;padding:.08rem .5rem;border-radius:2rem;border:1px solid var(--line)}
.pill.reg{color:var(--accent);border-color:var(--accent)}
.bar{display:block;height:3px;background:var(--accent);border-radius:2px;margin-top:.3rem;opacity:.55}
tr.sum td{border-bottom:none;color:var(--muted);font-size:.84rem;padding-top:.5rem}
tfoot td{font-weight:700;border-top:2px solid var(--line);border-bottom:none}
.note{color:var(--muted);font-size:.85rem;border-left:3px solid var(--line);padding:.2rem 0 .2rem .9rem;margin:1rem 0}
.empty{color:var(--muted);background:var(--code);padding:1.25rem;border-radius:.5rem}
.scroll{overflow-x:auto}
@media (max-width:32rem){.wrap{padding:1.75rem 1rem 3rem}.total .value{font-size:1.6rem}table{font-size:.85rem}}
"""


def render_html(rows, title):
    e = html.escape
    grand = sum_by_currency(rows)
    single = list(grand.keys())[0] if len(grand) == 1 else None

    body = ['<h1>%s</h1>' % e(title),
            '<p class="sub">기준일 %s</p>' % date.today().isoformat()]

    if not rows:
        body.append('<div class="total"><div class="label">총 후원금</div>'
                    '<div class="value">0원</div>'
                    '<div class="meta">등록된 내역 없음</div></div>')
        body.append('<p class="empty">아직 등록된 내역이 없다. '
                    '<code>donations/malaysia.csv</code> 에 한 줄씩 채우면 여기에 쌓인다.</p>')
        return _page(title, body)

    months = group_by_month(rows)
    donors = group_by_donor(rows)
    regulars = [name for name, items in donors.items() if is_regular(items)]

    body.append('<div class="total"><div class="label">총 후원금</div>'
                '<div class="value">%s</div><div class="meta">%s</div></div>'
                % (e(totals_line(grand)),
                   e("%d건 · %s ~ %s · %d개월"
                     % (len(rows), rows[0]["date"].isoformat(),
                        rows[-1]["date"].isoformat(), len(months)))))

    cards = [("후원자 수", "%d명" % len(donors)),
             ("정기 / 일시", "%d / %d명" % (len(regulars), len(donors) - len(regulars))),
             ("월평균", totals_line(monthly_average(rows, len(months)))),
             ("건당 평균", totals_line(OrderedDict(
                 (c, a / len([r for r in rows if r["currency"] == c])) for c, a in grand.items())))]
    body.append('<div class="cards">%s</div>' % "".join(
        '<div class="card"><div class="k">%s</div><div class="v">%s</div></div>' % (e(k), e(v))
        for k, v in cards))

    # 월별 집계
    body.append("<h2>1. 월별 집계</h2>")
    body.append('<div class="scroll"><table><thead><tr><th>월</th><th class="num">건수</th>'
                '<th class="num">금액</th><th class="num">누계</th>'
                '<th class="num">전월 대비</th></tr></thead><tbody>')
    peak = max((sum_by_currency(i).get(single, 0.0) for i in months.values()), default=0.0) if single else 0.0
    running, previous = OrderedDict(), None
    for label, items in months.items():
        month_total = sum_by_currency(items)
        for code, amount in month_total.items():
            running[code] = running.get(code, 0.0) + amount
        if single:
            current = month_total.get(single, 0.0)
            rate = change_rate(current, previous)
            previous = current
            cls = "" if rate is None else (" up" if rate >= 0 else " down")
            delta = '<span class="%s">%s</span>' % (cls.strip(), e(fmt_change(rate)))
            bar = ('<span class="bar" style="width:%.1f%%"></span>' % (current / peak * 100)) if peak else ""
        else:
            delta, bar = "-", ""
        body.append('<tr><td>%s%s</td><td class="num">%d건</td><td class="num">%s</td>'
                    '<td class="num">%s</td><td class="num">%s</td></tr>'
                    % (e(label), bar, len(items), e(totals_line(month_total) or "-"),
                       e(totals_line(running) or "-"), delta))
    body.append("</tbody></table></div>")

    # 날짜별 내역
    body.append("<h2>2. 날짜별 내역</h2>")
    running = OrderedDict()
    for day, items in group_by_date(rows).items():
        day_total = sum_by_currency(items)
        for code, amount in day_total.items():
            running[code] = running.get(code, 0.0) + amount
        body.append("<h3>%s (%s)</h3>" % (day.isoformat(), _WEEKDAYS[day.weekday()]))
        body.append('<div class="scroll"><table><thead><tr><th>후원자</th><th class="num">금액</th>'
                    "<th>방법</th><th>비고</th></tr></thead><tbody>")
        for row in items:
            body.append('<tr><td>%s</td><td class="num">%s</td><td>%s</td><td>%s</td></tr>'
                        % (e(row["donor"]), e(money(row["amount"], row["currency"])),
                           e(row["method"] or "-"), e(row["note"] or "-")))
        body.append('</tbody><tbody><tr class="sum"><td colspan="4">소계 %s · 누계 %s</td></tr>'
                    "</tbody></table></div>"
                    % (e(totals_line(day_total)), e(totals_line(running))))

    # 후원자별 집계
    body.append("<h2>3. 후원자별 집계</h2>")
    share_head = '<th class="num">비중</th>' if single else ""
    body.append('<div class="scroll"><table><thead><tr><th>후원자</th><th>구분</th>'
                '<th class="num">건수</th><th class="num">합계</th>%s'
                "<th>첫 후원</th><th>최근 후원</th></tr></thead><tbody>" % share_head)
    for name, items in donors.items():
        donor_total = sum_by_currency(items)
        regular = is_regular(items)
        share = ('<td class="num">%.1f%%</td>'
                 % (donor_total.get(single, 0.0) / grand[single] * 100)) if single else ""
        body.append('<tr><td>%s</td><td><span class="pill%s">%s</span></td>'
                    '<td class="num">%d건</td><td class="num">%s</td>%s<td>%s</td><td>%s</td></tr>'
                    % (e(name), " reg" if regular else "", "정기" if regular else "일시",
                       len(items), e(totals_line(donor_total)), share,
                       items[0]["date"].isoformat(), items[-1]["date"].isoformat()))
    body.append("</tbody></table></div>")

    # 합계
    body.append("<h2>4. 합계</h2>")
    body.append("<table><tbody>")
    body.append('<tr><td>후원 건수</td><td class="num">%d건</td></tr>' % len(rows))
    body.append('<tr><td>후원자 수</td><td class="num">%d명</td></tr>' % len(donors))
    body.append("</tbody><tfoot>")
    for code, amount in grand.items():
        body.append('<tr><td>합계 (%s)</td><td class="num">%s</td></tr>'
                    % (e(code), e(money(amount, code))))
    body.append("</tfoot></table>")
    if len(grand) > 1:
        body.append('<p class="note">통화가 섞여 있어 임의 환산 없이 통화별로 분리 합산했다. '
                    "단일 통화 환산이 필요하면 적용 환율과 기준일을 지정할 것.</p>")

    return _page(title, body)


def _page(title, body):
    return ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            "<title>%s</title>\n<style>%s</style>\n</head>\n<body>\n"
            '<div class="wrap">\n%s\n</div>\n</body>\n</html>\n'
            % (html.escape(title), CSS, "\n".join(body)))


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
