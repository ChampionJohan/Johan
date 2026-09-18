#!/usr/bin/env python3
"""donations/*.csv 후원금 장부를 날짜순으로 정리해 md / html 로 뽑는다.

    python3 tools/donation.py                 # donations/malaysia.csv -> .md + .html
    python3 tools/donation.py --file donations/malaysia.csv
    python3 tools/donation.py --rate MYR=330.5 --rate USD=1390   # 환율 임시 덮어쓰기

장부 CSV 열: date,donor,amount,currency,method,note
  date     2026-09-18 / 2026.09.18 / 20260918 전부 받는다
  amount   1,000,000 / 1000000 / 100,000원 전부 받는다
  currency 비우면 KRW

환율 CSV(donations/rates.csv) 열: currency,krw_rate,asof,source
  외화 전부에 환율이 있으면 원화로 환산해 단일 총액을 낸다.
  하나라도 빠지면 환산하지 않고 통화별로 나눠서 합산한다. 추정 환율은 쓰지 않는다.
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
DEFAULT_RATES = os.path.join(ROOT, "donations", "rates.csv")
DEFAULT_TITLE = "말레이시아지부 후원금 내역"
BASE = "KRW"

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
        return float(text)
    except ValueError:
        raise ValueError("%d행: 금액을 못 읽음 -> %r" % (lineno, value))


def money(amount, currency):
    prefix, suffix, digits = CURRENCY.get(currency, ("", " " + currency, 2))
    return "%s%s%s" % (prefix, format(round(amount, digits), ",.%df" % digits), suffix)


def krw(amount):
    return money(amount, BASE)


def totals_line(totals):
    """통화별 합계를 한 줄로. 통화가 하나면 그 금액만 나온다."""
    return " + ".join(money(amount, code) for code, amount in totals.items())


def read_rates(path):
    """환율표를 읽는다. 없으면 빈 dict — 환산 없이 통화별 합산으로 간다."""
    rates = {}
    if not os.path.exists(path):
        return rates
    with open(path, encoding="utf-8-sig", newline="") as handle:
        for lineno, raw in enumerate(csv.DictReader(handle), start=2):
            code = (raw.get("currency") or "").strip().upper()
            if not code:
                continue
            rates[code] = {
                "rate": parse_amount(raw.get("krw_rate"), lineno),
                "asof": (raw.get("asof") or "").strip(),
                "source": (raw.get("source") or "").strip(),
            }
    return rates


def read_rows(path):
    rows = []
    with open(path, encoding="utf-8-sig", newline="") as handle:
        for lineno, raw in enumerate(csv.DictReader(handle), start=2):
            if not any((v or "").strip() for v in raw.values()):
                continue
            rows.append({
                "date": parse_date(raw.get("date"), lineno),
                "donor": (raw.get("donor") or "").strip() or "(익명)",
                "amount": parse_amount(raw.get("amount"), lineno),
                "currency": (raw.get("currency") or "").strip().upper() or BASE,
                "method": (raw.get("method") or "").strip(),
                "note": (raw.get("note") or "").strip(),
            })
    rows.sort(key=lambda r: (r["date"], r["donor"]))
    return rows


def apply_rates(rows, rates):
    """외화 전부에 환율이 있을 때만 원화 환산값을 채운다. 반환값은 환산 가능 여부."""
    missing = {r["currency"] for r in rows if r["currency"] != BASE} - set(rates)
    if missing:
        for row in rows:
            row["krw"] = None
        return False, sorted(missing)
    for row in rows:
        rate = 1.0 if row["currency"] == BASE else rates[row["currency"]]["rate"]
        row["krw"] = row["amount"] * rate
    return True, []


def group_by_date(rows):
    groups = OrderedDict()
    for row in rows:
        groups.setdefault(row["date"], []).append(row)
    return groups


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


def group_by_donor(rows, converted):
    """후원자별로 묶어 큰 순으로 정렬한다. 환산 전이면 건수 기준."""
    groups = OrderedDict()
    for row in rows:
        groups.setdefault(row["donor"], []).append(row)
    key = ((lambda kv: (sum(r["krw"] for r in kv[1]), len(kv[1]))) if converted
           else (lambda kv: (len(kv[1]), sum(r["amount"] for r in kv[1]))))
    return OrderedDict(sorted(groups.items(), key=key, reverse=True))


def sum_by_currency(rows):
    """통화별 합계. 표기 순서가 구간마다 흔들리지 않게 통화 코드순으로 고정한다."""
    totals = {}
    for row in rows:
        totals[row["currency"]] = totals.get(row["currency"], 0.0) + row["amount"]
    return OrderedDict(sorted(totals.items()))


def sum_krw(rows):
    return sum(row["krw"] for row in rows)


def is_regular(items):
    """서로 다른 달에 2회 이상이면 정기 후원자로 본다."""
    return len({(r["date"].year, r["date"].month) for r in items}) >= 2


def change_rate(current, previous):
    """전월 대비 증감률. 전월이 0이면 판단 불가로 None."""
    if not previous:
        return None
    return (current - previous) / previous * 100


def fmt_change(rate):
    return "-" if rate is None else "%s%.1f%%" % ("+" if rate >= 0 else "", rate)


class Report(object):
    """렌더러 두 개가 같은 숫자를 쓰도록 집계를 한곳에서 끝낸다."""

    def __init__(self, rows, rates, title):
        self.rows = rows
        self.rates = rates
        self.title = title
        self.converted, self.missing = apply_rates(rows, rates)
        self.by_currency = sum_by_currency(rows)
        self.months = group_by_month(rows)
        self.days = group_by_date(rows)
        self.donors = group_by_donor(rows, self.converted) if rows else OrderedDict()
        self.regulars = [n for n, i in self.donors.items() if is_regular(i)]
        self.total_krw = sum_krw(rows) if self.converted else None

    def total_text(self):
        if not self.rows:
            return "0원"
        return krw(self.total_krw) if self.converted else totals_line(self.by_currency)

    def subtotal(self, items):
        if not items:
            return "-"
        return krw(sum_krw(items)) if self.converted else totals_line(sum_by_currency(items))

    def share(self, items):
        """전체 대비 비중. 환산이 안 되면 비중 자체가 의미가 없으므로 None."""
        if not self.converted or not self.total_krw:
            return None
        return sum_krw(items) / self.total_krw * 100

    def converted_cell(self, row):
        """원통화가 원화면 환산 열은 비워 둔다 — 같은 숫자를 두 번 쓰지 않는다."""
        if not self.converted or row["currency"] == BASE:
            return "-"
        return krw(row["krw"])

    def rate_notes(self):
        used = sorted({r["currency"] for r in self.rows} - {BASE})
        return [(code, self.rates[code]) for code in used if code in self.rates]


def render_md(report):
    rows, out = report.rows, ["# %s" % report.title, ""]
    out.append("기준일 %s · 건수 %d건 · **총액 %s**"
               % (date.today().isoformat(), len(rows), report.total_text()))
    out.append("")

    if not rows:
        out.append("아직 등록된 내역이 없다. `donations/malaysia.csv` 에 한 줄씩 채우면 여기에 쌓인다.")
        out.append("")
        return "\n".join(out)

    months, donors = report.months, report.donors

    out += ["## 1. 요약", "", "| 구분 | 값 |", "|---|---:|"]
    out.append("| 총 후원금 | **%s** |" % report.total_text())
    if report.converted and len(report.by_currency) > 1:
        out.append("| 원통화 내역 | %s |" % totals_line(report.by_currency))
    out.append("| 후원 건수 | %d건 |" % len(rows))
    out.append("| 후원자 수 | %d명 (정기 %d명 / 일시 %d명) |"
               % (len(donors), len(report.regulars), len(donors) - len(report.regulars)))
    out.append("| 집계 기간 | %s ~ %s (%d개월) |"
               % (rows[0]["date"].isoformat(), rows[-1]["date"].isoformat(), len(months)))
    if report.converted:
        out.append("| 월평균 | %s |" % krw(report.total_krw / len(months)))
        out.append("| 건당 평균 | %s |" % krw(report.total_krw / len(rows)))
    out.append("")

    out += ["## 2. 월별 집계", "", "| 월 | 건수 | 금액 | 누계 | 전월 대비 |", "|---|---:|---:|---:|---:|"]
    running, previous = 0.0, None
    running_mixed = OrderedDict()
    for label, items in months.items():
        if report.converted:
            current = sum_krw(items)
            running += current
            delta = fmt_change(change_rate(current, previous))
            previous = current
            cumulative = krw(running)
        else:
            for code, amount in sum_by_currency(items).items():
                running_mixed[code] = running_mixed.get(code, 0.0) + amount
            delta, cumulative = "-", totals_line(running_mixed) or "-"
        out.append("| %s | %d건 | %s | %s | %s |"
                   % (label, len(items), report.subtotal(items), cumulative, delta))
    out.append("")

    out += ["## 3. 날짜별 내역", ""]
    running, running_mixed = 0.0, OrderedDict()
    for day, items in report.days.items():
        if report.converted:
            running += sum_krw(items)
            cumulative = krw(running)
        else:
            for code, amount in sum_by_currency(items).items():
                running_mixed[code] = running_mixed.get(code, 0.0) + amount
            cumulative = totals_line(running_mixed)
        out += ["### %s (%s)" % (day.isoformat(), _WEEKDAYS[day.weekday()]), ""]
        out.append("| 후원자 | 금액 | 원화 환산 | 방법 | 비고 |")
        out.append("|---|---:|---:|---|---|")
        for row in items:
            out.append("| %s | %s | %s | %s | %s |"
                       % (row["donor"], money(row["amount"], row["currency"]),
                          report.converted_cell(row), row["method"] or "-", row["note"] or "-"))
        out += ["", "소계 %s · 누계 %s" % (report.subtotal(items), cumulative), ""]

    out += ["## 4. 후원자별 집계", ""]
    header = "| 후원자 | 구분 | 건수 | 합계 |"
    divider = "|---|---|---:|---:|"
    if report.converted:
        header, divider = header + " 비중 |", divider + "---:|"
    out.append(header + " 첫 후원 | 최근 후원 |")
    out.append(divider + "---|---|")
    for name, items in donors.items():
        line = "| %s | %s | %d건 | %s |" % (
            name, "정기" if is_regular(items) else "일시", len(items), report.subtotal(items))
        if report.converted:
            line += " %.1f%% |" % report.share(items)
        out.append(line + " %s | %s |" % (items[0]["date"].isoformat(), items[-1]["date"].isoformat()))
    out.append("")

    out += ["## 5. 합계", "", "| 통화 | 원통화 금액 | 원화 환산 |", "|---|---:|---:|"]
    for code, amount in report.by_currency.items():
        converted = (krw(sum_krw([r for r in rows if r["currency"] == code]))
                     if report.converted else "-")
        out.append("| %s | %s | %s |" % (code, money(amount, code), converted))
    out.append("| **합계** | | **%s** |" % report.total_text())
    out.append("")

    if report.converted and report.rate_notes():
        out += ["**적용 환율**", "", "| 통화 | 환율 (1단위당 원) | 기준일 | 출처 |", "|---|---:|---|---|"]
        for code, info in report.rate_notes():
            out.append("| %s | %s | %s | %s |"
                       % (code, format(info["rate"], ",.2f"), info["asof"] or "-", info["source"] or "-"))
        out += ["", "> 환율은 고시 시점에 따라 달라진다. 정산·보고용으로 확정하려면 "
                    "은행 매매기준율로 `donations/rates.csv` 를 덮어쓰고 다시 빌드할 것.", ""]
    elif report.missing:
        out += ["> 환율이 없는 통화(%s)가 있어 환산하지 않고 통화별로 합산했다. "
                "`donations/rates.csv` 에 환율을 넣으면 원화 단일 총액이 나온다."
                % ", ".join(report.missing), ""]
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
.total .value{font-size:2.1rem;font-weight:700;color:var(--accent);letter-spacing:-.02em;line-height:1.25;margin-top:.2rem}
.total .meta{color:var(--muted);font-size:.85rem;margin-top:.35rem}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.75rem;margin:0 0 2.5rem}
.card{background:var(--card);border:1px solid var(--line);border-radius:.5rem;padding:.9rem 1rem}
.card .k{font-size:.75rem;color:var(--muted)}
.card .v{font-size:1.1rem;font-weight:650;letter-spacing:-.01em;margin-top:.15rem;font-variant-numeric:tabular-nums}
h2{font-size:1.1rem;margin:2.75rem 0 1rem;border-bottom:1px solid var(--line);padding-bottom:.5rem}
h3{font-size:.95rem;margin:1.75rem 0 .6rem;color:var(--accent)}
table{width:100%;border-collapse:collapse;font-size:.92rem}
th,td{padding:.55rem .6rem;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{font-size:.78rem;color:var(--muted);font-weight:600;letter-spacing:.03em;white-space:nowrap}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
td.sub{color:var(--muted)}
.up{color:var(--up)}.down{color:var(--down)}
.pill{display:inline-block;font-size:.72rem;padding:.08rem .5rem;border-radius:2rem;border:1px solid var(--line)}
.pill.reg{color:var(--accent);border-color:var(--accent)}
.bar{display:block;height:3px;background:var(--accent);border-radius:2px;margin-top:.3rem;opacity:.55}
tr.sum td{border-bottom:none;color:var(--muted);font-size:.84rem;padding-top:.5rem}
tfoot td{font-weight:700;border-top:2px solid var(--line);border-bottom:none}
.note{color:var(--muted);font-size:.85rem;border-left:3px solid var(--line);padding:.2rem 0 .2rem .9rem;margin:1.25rem 0}
.empty{color:var(--muted);background:var(--code);padding:1.25rem;border-radius:.5rem}
.scroll{overflow-x:auto}
@media (max-width:32rem){.wrap{padding:1.75rem 1rem 3rem}.total .value{font-size:1.65rem}table{font-size:.85rem}}
"""


def render_html(report):
    e, rows = html.escape, report.rows
    body = ['<h1>%s</h1>' % e(report.title),
            '<p class="sub">기준일 %s</p>' % date.today().isoformat()]

    if not rows:
        body.append('<div class="total"><div class="label">총 후원금</div>'
                    '<div class="value">0원</div><div class="meta">등록된 내역 없음</div></div>')
        body.append('<p class="empty">아직 등록된 내역이 없다. '
                    '<code>donations/malaysia.csv</code> 에 한 줄씩 채우면 여기에 쌓인다.</p>')
        return _page(report.title, body)

    months, donors = report.months, report.donors
    meta = "%d건 · %s ~ %s · %d개월" % (len(rows), rows[0]["date"].isoformat(),
                                        rows[-1]["date"].isoformat(), len(months))
    if report.converted and len(report.by_currency) > 1:
        meta += " · 원통화 %s" % totals_line(report.by_currency)
    body.append('<div class="total"><div class="label">총 후원금</div>'
                '<div class="value">%s</div><div class="meta">%s</div></div>'
                % (e(report.total_text()), e(meta)))

    cards = [("후원자 수", "%d명" % len(donors)),
             ("정기 / 일시", "%d / %d명" % (len(report.regulars), len(donors) - len(report.regulars)))]
    if report.converted:
        cards.append(("월평균", krw(report.total_krw / len(months))))
        cards.append(("건당 평균", krw(report.total_krw / len(rows))))
    body.append('<div class="cards">%s</div>' % "".join(
        '<div class="card"><div class="k">%s</div><div class="v">%s</div></div>' % (e(k), e(v))
        for k, v in cards))

    body.append("<h2>1. 월별 집계</h2>")
    body.append('<div class="scroll"><table><thead><tr><th>월</th><th class="num">건수</th>'
                '<th class="num">금액</th><th class="num">누계</th>'
                '<th class="num">전월 대비</th></tr></thead><tbody>')
    peak = max((sum_krw(i) for i in months.values()), default=0.0) if report.converted else 0.0
    running, previous, running_mixed = 0.0, None, OrderedDict()
    for label, items in months.items():
        if report.converted:
            current = sum_krw(items)
            running += current
            rate = change_rate(current, previous)
            previous = current
            cls = "" if rate is None else ("up" if rate >= 0 else "down")
            delta = '<span class="%s">%s</span>' % (cls, e(fmt_change(rate)))
            bar = ('<span class="bar" style="width:%.1f%%"></span>' % (current / peak * 100)) if peak else ""
            cumulative = krw(running)
        else:
            for code, amount in sum_by_currency(items).items():
                running_mixed[code] = running_mixed.get(code, 0.0) + amount
            delta, bar, cumulative = "-", "", totals_line(running_mixed) or "-"
        body.append('<tr><td>%s%s</td><td class="num">%d건</td><td class="num">%s</td>'
                    '<td class="num">%s</td><td class="num">%s</td></tr>'
                    % (e(label), bar, len(items), e(report.subtotal(items)), e(cumulative), delta))
    body.append("</tbody></table></div>")

    body.append("<h2>2. 날짜별 내역</h2>")
    running, running_mixed = 0.0, OrderedDict()
    for day, items in report.days.items():
        if report.converted:
            running += sum_krw(items)
            cumulative = krw(running)
        else:
            for code, amount in sum_by_currency(items).items():
                running_mixed[code] = running_mixed.get(code, 0.0) + amount
            cumulative = totals_line(running_mixed)
        body.append("<h3>%s (%s)</h3>" % (day.isoformat(), _WEEKDAYS[day.weekday()]))
        body.append('<div class="scroll"><table><thead><tr><th>후원자</th><th class="num">금액</th>'
                    '<th class="num">원화 환산</th><th>방법</th><th>비고</th></tr></thead><tbody>')
        for row in items:
            body.append('<tr><td>%s</td><td class="num">%s</td><td class="num sub">%s</td>'
                        "<td>%s</td><td>%s</td></tr>"
                        % (e(row["donor"]), e(money(row["amount"], row["currency"])),
                           e(report.converted_cell(row)), e(row["method"] or "-"), e(row["note"] or "-")))
        body.append('</tbody><tbody><tr class="sum"><td colspan="5">소계 %s · 누계 %s</td></tr>'
                    "</tbody></table></div>" % (e(report.subtotal(items)), e(cumulative)))

    body.append("<h2>3. 후원자별 집계</h2>")
    share_head = '<th class="num">비중</th>' if report.converted else ""
    body.append('<div class="scroll"><table><thead><tr><th>후원자</th><th>구분</th>'
                '<th class="num">건수</th><th class="num">합계</th>%s'
                "<th>첫 후원</th><th>최근 후원</th></tr></thead><tbody>" % share_head)
    for name, items in donors.items():
        regular = is_regular(items)
        share = '<td class="num">%.1f%%</td>' % report.share(items) if report.converted else ""
        body.append('<tr><td>%s</td><td><span class="pill%s">%s</span></td>'
                    '<td class="num">%d건</td><td class="num">%s</td>%s<td>%s</td><td>%s</td></tr>'
                    % (e(name), " reg" if regular else "", "정기" if regular else "일시",
                       len(items), e(report.subtotal(items)), share,
                       items[0]["date"].isoformat(), items[-1]["date"].isoformat()))
    body.append("</tbody></table></div>")

    body.append("<h2>4. 합계</h2>")
    body.append('<div class="scroll"><table><thead><tr><th>통화</th><th class="num">원통화 금액</th>'
                '<th class="num">원화 환산</th></tr></thead><tbody>')
    for code, amount in report.by_currency.items():
        converted = (krw(sum_krw([r for r in rows if r["currency"] == code]))
                     if report.converted else "-")
        body.append('<tr><td>%s</td><td class="num">%s</td><td class="num">%s</td></tr>'
                    % (e(code), e(money(amount, code)), e(converted)))
    body.append('</tbody><tfoot><tr><td>합계</td><td class="num">%s</td><td class="num">%s</td></tr>'
                "</tfoot></table></div>"
                % (e("" if report.converted else totals_line(report.by_currency)),
                   e(report.total_text())))

    if report.converted and report.rate_notes():
        body.append("<h2>5. 적용 환율</h2>")
        body.append('<div class="scroll"><table><thead><tr><th>통화</th>'
                    '<th class="num">환율 (1단위당 원)</th><th>기준일</th><th>출처</th>'
                    "</tr></thead><tbody>")
        for code, info in report.rate_notes():
            body.append('<tr><td>%s</td><td class="num">%s</td><td>%s</td><td>%s</td></tr>'
                        % (e(code), e(format(info["rate"], ",.2f")),
                           e(info["asof"] or "-"), e(info["source"] or "-")))
        body.append("</tbody></table></div>")
        body.append('<p class="note">환율은 고시 시점에 따라 달라진다. 정산·보고용으로 확정하려면 '
                    "은행 매매기준율로 <code>donations/rates.csv</code> 를 덮어쓰고 다시 빌드할 것.</p>")
    elif report.missing:
        body.append('<p class="note">환율이 없는 통화(%s)가 있어 환산하지 않고 통화별로 합산했다. '
                    "<code>donations/rates.csv</code> 에 환율을 넣으면 원화 단일 총액이 나온다.</p>"
                    % e(", ".join(report.missing)))

    return _page(report.title, body)


def _page(title, body):
    return ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            "<title>%s</title>\n<style>%s</style>\n</head>\n<body>\n"
            '<div class="wrap">\n%s\n</div>\n</body>\n</html>\n'
            % (html.escape(title), CSS, "\n".join(body)))


def main():
    parser = argparse.ArgumentParser(description="후원금 내역을 날짜순으로 정리한다.")
    parser.add_argument("--file", default=DEFAULT_CSV, help="장부 CSV 경로")
    parser.add_argument("--rates", default=DEFAULT_RATES, help="환율 CSV 경로")
    parser.add_argument("--rate", action="append", default=[], metavar="CODE=값",
                        help="환율 덮어쓰기 (예: --rate USD=1390)")
    parser.add_argument("--title", default=DEFAULT_TITLE, help="문서 제목")
    args = parser.parse_args()

    resolve = lambda p: p if os.path.isabs(p) else os.path.join(ROOT, p)
    rates = read_rates(resolve(args.rates))
    for item in args.rate:
        code, _, value = item.partition("=")
        rates[code.strip().upper()] = {"rate": float(value), "asof": date.today().isoformat(),
                                       "source": "실행 시 지정 (--rate)"}

    path = resolve(args.file)
    report = Report(read_rows(path), rates, args.title)
    base = os.path.splitext(path)[0]

    for suffix, text in ((".md", render_md(report)), (".html", render_html(report))):
        with open(base + suffix, "w", encoding="utf-8") as handle:
            handle.write(text)
        print("wrote %s" % os.path.relpath(base + suffix, ROOT))

    print("총 %d건 / %s" % (len(report.rows), report.total_text()))
    if report.missing:
        print("환율 없음: %s (환산 생략)" % ", ".join(report.missing))


if __name__ == "__main__":
    main()
