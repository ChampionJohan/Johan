#!/usr/bin/env python3
"""매일 묵상 페이지(qt.swim.org)를 읽어 영어 "Today's Bread" 글로 요약한 뒤 Threads(jo.han.im)에 올린다.

흐름:  묵상 페이지 가져오기 → Claude 로 영어 요약(500자 이하) → Threads 게시 → state.json · posts/날짜.txt 기록

    python3 threads/bread/daily_bread.py --dry-run              # 요약만 만들어 출력 (게시 안 함)
    python3 threads/bread/daily_bread.py                        # 실제 게시
    python3 threads/bread/daily_bread.py --source page.html --dry-run   # 저장해 둔 HTML 로 시험
    python3 threads/bread/daily_bread.py --check-token          # 토큰이 jo.han.im 계정인지 확인

환경변수
    ANTHROPIC_API_KEY             요약(영어 작성)에 필요
    THREADS_BREAD_ACCESS_TOKEN    jo.han.im 계정 토큰 (투자 공부 계정 토큰과 별개)
    THREADS_BREAD_USER_ID         선택. 기본 'me'
    BREAD_SOURCE_URL              선택. 묵상 페이지 주소
"""
import argparse
import html
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from post_threads import api, post_thread  # noqa: E402  (기존 Threads 게시 코드 재사용)

STATE = HERE / "state.json"
POSTS = HERE / "posts"
SOURCE_URL = os.environ.get("BREAD_SOURCE_URL", "https://qt.swim.org/user_utf/food/user_print_web.php")
KST = timezone(timedelta(hours=9))
LIMIT = 500          # Threads 글 1개 한도
TARGET = 470         # 여유를 두고 이 길이 이하로 쓰게 한다
MODEL = "claude-opus-5-5"
HEADER = "🍞 Today's Bread"
APPLY = "👉 Today's step:"
TAGS = "#TodaysBread #DailyDevotional"

PROMPT = """Below is today's Korean daily devotional, extracted from a web page (it may include menu text — ignore that).

Write ONE short English Threads post that sums up its message. Rules:
- Line 1 exactly: {header}
- Then a blank line, then the single key Bible verse of the devotional in a standard English translation, in double quotes, followed on the next line by "— Book Chapter:Verse".
- Then a blank line and 1–3 short sentences in your own words: the core message. Warm, plain, encouraging. Do not translate the devotional sentence by sentence and do not copy its wording; summarise and re-express it.
- Then a blank line and exactly ONE application line, starting with "{apply}" — one concrete, doable action for today drawn from this passage (one sentence). Exactly one application, never a list.
- Then a blank line and a final hashtag line: "{tags} #BookName" where BookName is the Bible book of the passage with no spaces (e.g. #Judges, #1Corinthians).
- You may end the reflection with one fitting emoji. No other hashtags, no Korean, no links, no mention of the source website.
- Total length must be under {target} characters including line breaks.
Output only the post text, nothing else.

--- DEVOTIONAL ---
{text}"""


# ---------- 상태 ----------
def load_state():
    return json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}


def save_state(state):
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


# ---------- 묵상 페이지 → 본문 텍스트 ----------
class _Text(HTMLParser):
    SKIP = {"script", "style", "noscript", "head", "button", "select", "option"}
    BLOCK = {"p", "div", "br", "tr", "li", "h1", "h2", "h3", "h4", "h5", "td", "table", "section"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts, self.skip = [], 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.skip += 1
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.skip:
            self.skip -= 1
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def decode(raw, content_type=""):
    m = re.search(r"charset=([\w-]+)", content_type, re.I) or re.search(rb'charset=["\']?([\w-]+)', raw[:4000], re.I)
    enc = m.group(1) if m else "utf-8"
    enc = enc.decode() if isinstance(enc, bytes) else enc
    for e in (enc, "utf-8", "cp949"):
        try:
            return raw.decode(e)
        except (UnicodeDecodeError, LookupError):
            continue
    return raw.decode("utf-8", "replace")


def html_to_text(page):
    p = _Text()
    p.feed(page)
    text = html.unescape("".join(p.parts)).replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in text.splitlines()]
    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()


def fetch_devotional(source=None):
    if source:
        page = decode(Path(source).read_bytes())
    else:
        req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Mozilla/5.0 (daily-bread-bot)"})
        with urllib.request.urlopen(req, timeout=30) as r:
            page = decode(r.read(), r.headers.get("Content-Type", ""))
    text = html_to_text(page)
    if len(re.findall(r"[가-힣]", text)) < 200:
        raise SystemExit(f"묵상 본문을 찾지 못했습니다 (한글 {len(re.findall(r'[가-힣]', text))}자). 페이지 구조가 바뀌었는지 확인하세요.")
    return text[:20000]


# ---------- Claude 로 영어 요약 ----------
def summarize(text):
    import anthropic

    client = anthropic.Anthropic()
    ask = PROMPT.format(header=HEADER, apply=APPLY, tags=TAGS, target=TARGET, text=text)
    messages = [{"role": "user", "content": ask}]
    for attempt in range(3):
        resp = client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",                 # 안전 필터가 거절하면 서버가 다른 모델로 자동 재시도
            output_config={"effort": "medium"},
            messages=messages,
        )
        if resp.stop_reason == "refusal":
            raise SystemExit("요약 요청이 거절되었습니다. 원문을 확인하세요.")
        post = "".join(b.text for b in resp.content if b.type == "text").strip()
        post = normalize(post)
        problems = []
        if len(post) > LIMIT - 10:
            problems.append(f"It is {len(post)} characters; keep it under {TARGET - 60}.")
        if post.count(APPLY) != 1:
            problems.append(f'It must contain exactly one line starting with "{APPLY}" (found {post.count(APPLY)}).')
        if not problems:
            return post
        print(f"  다시 작성 요청 ({attempt + 1}/3): {' '.join(problems)}")
        messages += [{"role": "assistant", "content": resp.content},
                     {"role": "user", "content": " ".join(problems) + " Rewrite it in the same format. Output only the post."}]
    raise SystemExit("형식(500자 이하, 적용점 1개)에 맞는 글을 만들지 못했습니다:\n" + post)


def normalize(post):
    post = post.strip().strip("`").strip()
    if not post.startswith(HEADER):
        post = re.sub(r"^.*Today'?s Bread.*\n?", "", post, count=1, flags=re.I).lstrip()
        post = f"{HEADER}\n\n{post}"
    if re.search(r"[가-힣]", post):
        raise SystemExit("요약에 한글이 섞여 있습니다. 영어로만 올리도록 중단합니다:\n" + post)
    return post


# ---------- 캡처 대기열 (Claude 가 캡처를 보고 쓴 글) ----------
QUEUE = HERE / "queue"
SCHEDULED = HERE / "scheduled"   # 미리 써 둔 글. 예약 시각에 queue/ 로 옮겨지면 게시된다


def validate(post):
    problems = []
    if not post.startswith(HEADER):
        problems.append(f"첫 줄이 '{HEADER}' 가 아님")
    if post.count(APPLY) != 1:
        problems.append(f"적용점('{APPLY}')이 {post.count(APPLY)}개 (1개여야 함)")
    if len(post) > LIMIT:
        problems.append(f"{len(post)}자 (500자 이하여야 함)")
    if not post.splitlines()[-1].startswith(TAGS):
        problems.append(f"마지막 줄이 해시태그('{TAGS} #책이름')가 아님")
    if re.search(r"[가-힣]", post):
        problems.append("한글 포함")
    return problems


def post_queue(dry_run, user):
    """queue/YYYY-MM-DD.txt 중 아직 안 올린 글을 날짜 순으로 게시하고 posts/ 로 옮긴다."""
    today = datetime.now(KST).strftime("%Y-%m-%d")
    files = [f for f in sorted(QUEUE.glob("*.txt")) if f.stem <= today]
    for f in sorted(QUEUE.glob("*.txt")):
        if f.stem > today:
            print(f"{f.name}: 아직 날짜가 안 되어 기다립니다 (오늘 {today}).")
    if not files:
        print("대기열이 비어 있습니다.")
        return 0
    bad = 0
    for f in files:
        post = f.read_text(encoding="utf-8").strip()
        problems = validate(post)
        print(f"\n----- {f.name} ({len(post)}자) -----\n{post}")
        if problems:
            print(f"::error::{f.name} 형식 오류: {', '.join(problems)}")
            bad += 1
            continue
        done = POSTS / f.name
        if done.exists():
            print(f"{f.name}: 이미 게시된 날짜라 대기열에서만 지웁니다.")
            if not dry_run:
                f.unlink()
            continue
        if dry_run:
            print("[DRY-RUN] 게시하지 않았습니다.")
            continue
        ids = post_thread([post], need("THREADS_BREAD_ACCESS_TOKEN"), user, pause=3.0)
        POSTS.mkdir(exist_ok=True)
        done.write_text(post + "\n", encoding="utf-8")
        f.unlink()
        state = load_state()
        state.update({"last_posted_date": f.stem, "last_post_id": ids[0],
                      "last_posted_at": datetime.now(timezone.utc).isoformat(timespec="seconds")})
        save_state(state)
        print(f"게시 완료: {f.name} id={ids[0]}")
    return 1 if bad else 0


def check_all():
    """queue/ 와 scheduled/ 의 모든 글 형식 검사 (게시 안 함)."""
    bad = 0
    for f in sorted(QUEUE.glob("*.txt")) + sorted(SCHEDULED.glob("*.txt")):
        post = f.read_text(encoding="utf-8").strip()
        problems = validate(post)
        print(f"{f.parent.name}/{f.name}: {len(post)}자 " + ("OK" if not problems else "오류: " + ", ".join(problems)))
        bad += bool(problems)
    return 1 if bad else 0


# ---------- 명령 ----------
def need(name):
    v = os.environ.get(name, "").strip()
    if not v:
        raise SystemExit(f"{name} 환경변수가 없습니다.")
    return v


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="게시하지 않고 요약만 출력")
    ap.add_argument("--source", help="URL 대신 저장된 HTML 파일 사용 (시험용)")
    ap.add_argument("--force", action="store_true", help="오늘 이미 올렸어도 다시 게시")
    ap.add_argument("--check-token", action="store_true")
    ap.add_argument("--queue", action="store_true", help="queue/ 의 캡처 기반 글을 게시")
    ap.add_argument("--check", action="store_true", help="queue/ · scheduled/ 글 형식 검사")
    args = ap.parse_args()

    user = os.environ.get("THREADS_BREAD_USER_ID", "me").strip() or "me"
    if args.check_token:
        info = api("GET", user, {"fields": "id,username"}, need("THREADS_BREAD_ACCESS_TOKEN"))
        print(f"토큰 정상: @{info.get('username')} (id={info.get('id')})")
        return 0

    if args.check:
        return check_all()
    if args.queue:
        return post_queue(args.dry_run, user)

    today = datetime.now(KST).strftime("%Y-%m-%d")
    state = load_state()
    if state.get("last_posted_date") == today and not (args.force or args.dry_run):
        print(f"오늘({today}) 이미 게시했습니다 (id={state.get('last_post_id')}). 건너뜁니다.")
        return 0

    print(f"[{today}] 묵상 가져오는 중: {args.source or SOURCE_URL}")
    text = fetch_devotional(args.source)
    print(f"  본문 {len(text)}자 추출")
    post = summarize(text)
    print(f"\n----- 게시글 ({len(post)}자) -----\n{post}\n")

    if args.dry_run:
        print("[DRY-RUN] 게시하지 않았습니다.")
        return 0

    token = need("THREADS_BREAD_ACCESS_TOKEN")
    ids = post_thread([post], token, user, pause=3.0)
    POSTS.mkdir(exist_ok=True)
    (POSTS / f"{today}.txt").write_text(post + "\n", encoding="utf-8")
    state.update({"last_posted_date": today, "last_post_id": ids[0],
                  "last_posted_at": datetime.now(timezone.utc).isoformat(timespec="seconds")})
    save_state(state)
    print(f"게시 완료: id={ids[0]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
