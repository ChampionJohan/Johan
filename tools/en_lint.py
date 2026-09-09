#!/usr/bin/env python3
"""영어판 원고의 문장 부호와 남은 한국어 흔적을 잡아낸다.

    python3 tools/en_lint.py en-teen
    python3 tools/en_lint.py en-teen en-book

영어 원고가 십만 낱말을 넘어가면 눈으로는 못 잡는다. 잡는 것은 네 가지다.

  1. 마침표가 빠진 문단 — 영어는 한국어와 달리 종결 부호를 반드시 찍는다
  2. 물음표를 찍어야 하는데 마침표로 끝난 문장
  3. 느낌표 남용 — 이 시리즈는 느낌표를 아껴 쓴다
  4. 번역이 안 된 한국어가 남아 있는지
"""

import glob
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HANGUL = re.compile(r"[가-힣]")
# 원서 제목을 밝히는 자리(『...』)의 한국어는 남아 있어야 한다
CITED = re.compile(r"『[^』]*』")
# 의문문으로 확실히 판정할 수 있는 두 가지 어순만 본다.
#   1) 의문사 + 조동사 도치 — "Why is ...", "How do ..."
#   2) 조동사로 시작하는 도치 — "Is it ...", "Can you ..."
# "Why that app is free." 같은 수사적 조각은 의도한 것이므로 건드리지 않는다.
AUX = (r"(?:is|are|was|were|do|does|did|can|could|will|would|should|shall|"
       r"have|has|had|am|isn't|aren't|don't|doesn't|didn't|can't|won't)")
SUBJ = r"(?:i|you|we|they|it|he|she|this|that|there|those|these)"
ASK = re.compile(r"^(?:(?:who|what|when|where|why|how|which|whose)\s+%s\b|%s\s+%s\b)"
                 % (AUX, AUX, SUBJ), re.I)
# 수 일치가 안 맞으면 의문문이 아니라 명령문이다.
# "Do it long enough..." 는 명령문이고, 의문문이라면 "Does it ..." 이 된다.
MISMATCH = re.compile(r"^(?:do|don't|have|haven't|are|aren't|were|weren't)\s+"
                      r"(?:it|he|she|this|that)\b", re.I)
# 명령문 "Do these three in order..." — 명령형 do 뒤에는 인칭 주어만 올 수 있다.
IMPERATIVE_DO = re.compile(r"^(?:do|don't)\s+(?!you\b|we\b|they\b|i\b)", re.I)
# "Which is why ..." 처럼 관계사로 이어 붙인 조각은 직접 의문문이 아니다.
RELATIVE = re.compile(r"^(?:which|that)\s+\w+\s+(?:why|how|means)\b", re.I)


def is_question(sentence):
    if not ASK.match(sentence):
        return False
    return not (MISMATCH.match(sentence) or IMPERATIVE_DO.match(sentence)
                or RELATIVE.match(sentence))
# 각주 번호는 마침표 뒤에 붙으므로 종결 문자로 함께 인정한다
ENDS = ".!?:—…\"')" + "¹²³⁴⁵⁶⁷⁸⁹⁰"


def strip_md(line):
    line = re.sub(r"^[>\-*]\s+|^\d+\.\s+", "", line)
    return re.sub(r"[*_`]", "", line).strip()


def paragraphs(path):
    """문단 단위로 묶는다.

    영어 원고는 한 문장이 여러 줄로 접혀 있다. 줄마다 종결 부호를 따지면
    접힌 줄이 전부 걸린다. 빈 줄로 끊어지는 덩어리를 한 문단으로 본다.
    """
    text = io.open(path, encoding="utf-8").read()
    if text.startswith("---"):
        head, text = text.split("---", 2)[1], text.split("---", 2)[-1]
        if re.search(r"(?m)^lint:\s*skip\b", head):
            return
    buf, kind = [], "prose"

    def flush():
        if buf:
            return buf[0][0], " ".join(strip_md(b[1]) for b in buf), kind
        return None

    for n, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        skip = (not line) or line.startswith(("#", "|", "```", "<!--", "---"))
        listish = re.match(r"^(?:[>\-*]\s|\d+\.\s)", line)
        if skip or listish:
            out = flush()
            if out:
                yield out
            buf = []
            # 목록 항목은 다음 줄로 접힐 수 있다. 접힌 줄까지 한 항목으로 묶는다.
            kind = "fragment" if listish else "prose"
            if not skip:
                buf = [(n, line)]
            continue
        if not buf:
            kind = "prose"
        buf.append((n, line))
    out = flush()
    if out:
        yield out


def check(path):
    found = []
    for n, text, kind in paragraphs(path):
        bare = CITED.sub("", text)
        if not text:
            continue
        if HANGUL.search(bare):
            found.append((n, "한국어가 남아 있음", bare[:60]))
            continue
        if kind == "prose" and text[-1] not in ENDS:
            found.append((n, "종결 부호 없음", text[-52:]))
        for sentence in re.split(r"(?<=[.!?])\s+", text):
            s = sentence.strip()
            if s.endswith(".") and is_question(s):
                found.append((n, "물음표여야 한다", s[:60]))
        if text.count("!") > 2:
            found.append((n, "느낌표가 한 문단에 셋 이상", text[:60]))
    return found


def main(argv):
    if not argv:
        print(__doc__)
        return 1
    total = 0
    for which in argv:
        base = os.path.join(ROOT, which, "manuscript")
        for path in sorted(glob.glob(os.path.join(base, "*.md"))):
            hits = check(path)
            if not hits:
                continue
            print("\n%s" % os.path.relpath(path, ROOT))
            for n, why, snippet in hits:
                print("  %4d  %-22s %s" % (n, why, snippet))
                total += 1
    print("\n%s" % ("잡힌 것 %d건." % total if total else "문제 없음."))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
