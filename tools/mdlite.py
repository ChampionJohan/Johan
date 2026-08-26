"""의존성 없는 마크다운 -> HTML 변환기.

글쓰기에 실제로 쓰는 문법만 지원한다:
front matter, 제목, 문단, 굵게/기울임/인라인코드, 링크, 이미지,
목록(중첩 1단계), 인용, 코드블록, 구분선, 파이프 표, 각주 없음.
"""

import html
import re

_FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n?", re.DOTALL)


def split_front_matter(text):
    """맨 앞 `--- ... ---` 블록을 dict로 떼어낸다. 값은 전부 문자열."""
    match = _FRONT_MATTER.match(text)
    if not match:
        return {}, text
    meta = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip().strip('"').strip("'")
        key = key.strip()
        if key == "tags":
            meta[key] = [t.strip() for t in value.strip("[]").split(",") if t.strip()]
        else:
            meta[key] = value
    return meta, text[match.end():]


def _inline(text):
    """한 줄 안의 인라인 문법을 처리한다. 코드 스팬을 먼저 빼둔다."""
    spans = []

    def stash(match):
        spans.append(match.group(1))
        return "\x00%d\x00" % (len(spans) - 1)

    text = re.sub(r"`([^`]+)`", stash, text)
    text = html.escape(text, quote=False)

    text = re.sub(
        r"!\[([^\]]*)\]\(([^)\s]+)\)",
        lambda m: '<img src="%s" alt="%s">' % (html.escape(m.group(2), True), html.escape(m.group(1), True)),
        text,
    )
    text = re.sub(
        r"\[([^\]]+)\]\(([^)\s]+)\)",
        lambda m: '<a href="%s">%s</a>' % (html.escape(m.group(2), True), m.group(1)),
        text,
    )
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![*\w])\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"~~([^~]+)~~", r"<del>\1</del>", text)

    for index, code in enumerate(spans):
        text = text.replace("\x00%d\x00" % index, "<code>%s</code>" % html.escape(code, False))
    return text


def _table(rows):
    """구분선(---)이 두 번째 줄에 있는 파이프 표만 표로 본다."""
    def cells(row):
        return [c.strip() for c in row.strip().strip("|").split("|")]

    head = cells(rows[0])
    body = [cells(r) for r in rows[2:]]
    out = ['<div class="table-wrap"><table><thead><tr>']
    out += ["<th>%s</th>" % _inline(c) for c in head]
    out.append("</tr></thead><tbody>")
    for row in body:
        out.append("<tr>" + "".join("<td>%s</td>" % _inline(c) for c in row) + "</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)


def _is_table_start(lines, i):
    return (
        "|" in lines[i]
        and i + 1 < len(lines)
        and re.fullmatch(r"\s*\|?[\s:|-]+\|[\s:|-]*", lines[i + 1] or "")
        and "-" in lines[i + 1]
    )


def render(text):
    """마크다운 본문을 HTML 조각으로 바꾼다."""
    lines = text.replace("\r\n", "\n").split("\n")
    out = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            cls = ' class="language-%s"' % html.escape(lang, True) if lang else ""
            out.append("<pre><code%s>%s</code></pre>" % (cls, html.escape("\n".join(buf), False)))
            continue

        if re.fullmatch(r"(-{3,}|\*{3,}|_{3,})", stripped):
            out.append("<hr>")
            i += 1
            continue

        heading = re.match(r"(#{1,6})\s+(.*)", stripped)
        if heading:
            level = len(heading.group(1))
            out.append("<h%d>%s</h%d>" % (level, _inline(heading.group(2).strip()), level))
            i += 1
            continue

        if _is_table_start(lines, i):
            rows = []
            while i < n and "|" in lines[i] and lines[i].strip():
                rows.append(lines[i])
                i += 1
            out.append(_table(rows))
            continue

        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip().lstrip(">").strip())
                i += 1
            out.append("<blockquote>%s</blockquote>" % render("\n".join(buf)))
            continue

        bullet = re.match(r"([-*+]|\d+\.)\s+", stripped)
        if bullet:
            ordered = bool(re.match(r"\d+\.", stripped))
            tag = "ol" if ordered else "ul"
            checklist = bool(re.match(r"[-*+]\s+\[[ xX]\]\s", stripped))
            items = []
            while i < n and lines[i].strip():
                m = re.match(r"\s*([-*+]|\d+\.)\s+(.*)", lines[i])
                if m:
                    items.append(_inline(m.group(2).strip()))
                elif items:
                    items[-1] += " " + _inline(lines[i].strip())
                else:
                    break
                i += 1
            cls = ' class="checklist"' if checklist else ""
            rendered = []
            for item in items:
                box = re.match(r"\[([ xX])\]\s*(.*)", item, re.DOTALL)
                if box:
                    done = box.group(1).lower() == "x"
                    item = '<input type="checkbox" disabled%s> %s' % (
                        " checked" if done else "", box.group(2))
                rendered.append("<li>%s</li>" % item)
            out.append("<%s%s>%s</%s>" % (tag, cls, "".join(rendered), tag))
            continue

        buf = []
        while i < n and lines[i].strip() and not re.match(r"\s*(#{1,6}\s|```|>|[-*+]\s|\d+\.\s)", lines[i]):
            buf.append(lines[i].strip())
            i += 1
        if buf:
            out.append("<p>%s</p>" % _inline(" ".join(buf)))
        else:
            i += 1

    return "\n".join(out)


def to_plain(text):
    """브런치 에디터에 붙여넣기 좋은 순수 텍스트로 되돌린다."""
    text = re.sub(r"```.*?\n(.*?)```", r"\1", text, flags=re.DOTALL)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"[이미지: \1]", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1(\2)", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"^(\s*)[-*+]\s+\[ \]\s+", r"\1□ ", text, flags=re.MULTILINE)
    text = re.sub(r"^(\s*)[-*+]\s+\[[xX]\]\s+", r"\1☑ ", text, flags=re.MULTILINE)
    text = re.sub(r"^>\s?", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
