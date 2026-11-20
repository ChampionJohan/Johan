#!/usr/bin/env python3
"""곰희스쿨 강의 요약을 하루 1강씩 Threads 에 글타래로 게시한다. 외부 의존성 없음 (Python 3.8+).

    python3 threads/post_threads.py --dry-run            # 오늘 올릴 글 미리 보기 (게시 안 함)
    python3 threads/post_threads.py                      # 실제 게시 후 state.json 을 다음 강으로 진행
    python3 threads/post_threads.py --lecture 12 --dry-run   # 특정 강 미리 보기
    python3 threads/post_threads.py --lecture 12         # 특정 강만 게시 (state.json 은 그대로)
    python3 threads/post_threads.py --check-all          # 전 강의 분할 결과 / 글자 수 점검
    python3 threads/post_threads.py --check-token        # 토큰 · 계정 확인

환경변수
    THREADS_ACCESS_TOKEN   필수 (게시·토큰확인 시). 절대 코드나 저장소에 적지 말 것.
    THREADS_USER_ID        선택. 기본값 'me'.
    THREADS_API_BASE       선택. 테스트용 (기본 https://graph.threads.net/v1.0).
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
LECTURES = HERE / "lectures"
STATE = HERE / "state.json"
API = os.environ.get("THREADS_API_BASE", "https://graph.threads.net/v1.0")

FIRST, LAST = 6, 28
HARD_LIMIT = 500          # Threads 글 1개 한도
LIMIT = 480               # 쪽수 표기 "(3/5)" 를 붙일 여유 20자
WARN_POSTS = 10           # 글타래가 이보다 길면 경고
FOOTER = "※ 곰희스쿨 영상을 개인이 정리한 요약이며, 투자 권유가 아닙니다. 투자 판단과 책임은 본인에게 있습니다."


# ---------- 상태 ----------
def load_state():
    if STATE.exists():
        return json.loads(STATE.read_text(encoding="utf-8"))
    return {"next": FIRST}


def save_state(state):
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


# ---------- 마크다운 → Threads 평문 ----------
def to_plain(md):
    out = []
    for line in md.strip().splitlines():
        s = line.rstrip()
        if s.startswith("# "):
            s = s[2:].strip()
            m = re.match(r"(\d+강)\s*·\s*(.+)", s)
            s = f"【곰희스쿨 {m.group(1)}】 {m.group(2)}" if m else s
        else:
            s = re.sub(r"^\*\*(.+?)\*\*\s*$", r"■ \1", s)   # 단독 줄 소제목
            s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
            s = re.sub(r"^\s*[-*]\s+", "• ", s)
        out.append(s)
    return "\n".join(out)


# ---------- 500자 단위 분할 ----------
def break_unit(unit, limit):
    """limit 보다 긴 덩어리를 줄 → 문장 → 글자 순으로 쪼갠다."""
    if "\n" in unit:
        return pack(unit.split("\n"), limit, "\n")
    sentences = re.split(r"(?<=[.!?。])\s+", unit)
    if len(sentences) > 1:
        return pack(sentences, limit, " ")
    return [unit[i:i + limit] for i in range(0, len(unit), limit)]


def pack(units, limit, sep):
    chunks, cur = [], ""
    for u in units:
        if len(u) > limit:
            if cur:
                chunks.append(cur)
                cur = ""
            chunks.extend(break_unit(u, limit))
            continue
        cand = u if not cur else cur + sep + u
        if len(cand) <= limit:
            cur = cand
        else:
            chunks.append(cur)
            cur = u
    if cur:
        chunks.append(cur)
    return chunks


def lecture_chunks(n):
    path = LECTURES / f"{n:02d}.md"
    if not path.exists():
        raise SystemExit(f"강의 파일이 없습니다: {path}")
    text = to_plain(path.read_text(encoding="utf-8"))
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()] + [FOOTER]
    chunks = pack(paragraphs, LIMIT, "\n\n")
    total = len(chunks)
    if total > 1:
        chunks = [f"{c}\n\n({i}/{total})" for i, c in enumerate(chunks, 1)]
    return chunks


# ---------- Threads API ----------
def api(method, path, params, token, retries=3):
    params = dict(params, access_token=token)
    data = urllib.parse.urlencode(params)
    if method == "GET":
        req = urllib.request.Request(f"{API}/{path}?{data}")
    else:
        req = urllib.request.Request(f"{API}/{path}", data=data.encode(), method="POST")
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            if e.code >= 500 and attempt < retries:
                time.sleep(2 ** attempt)
                continue
            raise SystemExit(f"Threads API 오류 {e.code} ({path}): {body}")
        except urllib.error.URLError as e:
            if attempt < retries:
                time.sleep(2 ** attempt)
                continue
            raise SystemExit(f"네트워크 오류 ({path}): {e}")


def post_thread(chunks, token, user, pause):
    prev, ids = None, []
    for i, text in enumerate(chunks, 1):
        params = {"media_type": "TEXT", "text": text}
        if prev:
            params["reply_to_id"] = prev
        container = api("POST", f"{user}/threads", params, token)
        time.sleep(pause)
        # 게시 호출은 재시도하지 않는다 (중복 게시 방지)
        published = api("POST", f"{user}/threads_publish", {"creation_id": container["id"]}, token, retries=1)
        prev = published["id"]
        ids.append(prev)
        print(f"  게시 {i}/{len(chunks)} 완료 (id={prev})")
        time.sleep(pause)
    return ids


# ---------- 명령 ----------
def need_token():
    token = os.environ.get("THREADS_ACCESS_TOKEN", "").strip()
    if not token:
        raise SystemExit("THREADS_ACCESS_TOKEN 환경변수가 없습니다.")
    return token


def cmd_check_all():
    bad = 0
    for n in range(FIRST, LAST + 1):
        chunks = lecture_chunks(n)
        longest = max(len(c) for c in chunks)
        flag = ""
        if longest > HARD_LIMIT:
            flag, bad = "  ← 500자 초과!", bad + 1
        elif len(chunks) > WARN_POSTS:
            flag = f"  ← 글타래가 {WARN_POSTS}개를 넘음"
        print(f"{n:>2}강: 글 {len(chunks)}개, 최장 {longest}자{flag}")
    return 1 if bad else 0


def cmd_check_token():
    token = need_token()
    user = os.environ.get("THREADS_USER_ID", "me").strip() or "me"
    info = api("GET", user, {"fields": "id,username"}, token)
    print(f"토큰 정상: @{info.get('username')} (id={info.get('id')})")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="게시하지 않고 내용만 출력")
    ap.add_argument("--lecture", type=int, help="특정 강만 처리 (state.json 은 바꾸지 않음)")
    ap.add_argument("--check-all", action="store_true", help="전 강의 분할 점검")
    ap.add_argument("--check-token", action="store_true", help="토큰 확인")
    ap.add_argument("--pause", type=float, default=3.0, help="API 호출 사이 대기 초 (기본 3)")
    args = ap.parse_args()

    if args.check_all:
        return cmd_check_all()
    if args.check_token:
        return cmd_check_token()

    state = load_state()
    n = args.lecture or state["next"]
    if n > LAST:
        print(f"{LAST}강까지 모두 게시했습니다. 할 일이 없습니다.")
        return 0

    chunks = lecture_chunks(n)
    if len(chunks) > WARN_POSTS:
        print(f"경고: 글타래가 {len(chunks)}개로 깁니다.", file=sys.stderr)

    if args.dry_run:
        print(f"[DRY-RUN] {n}강 — 글 {len(chunks)}개")
        for i, c in enumerate(chunks, 1):
            print(f"\n----- {i}/{len(chunks)} ({len(c)}자) -----\n{c}")
        return 0

    token = need_token()
    user = os.environ.get("THREADS_USER_ID", "me").strip() or "me"
    print(f"{n}강 게시 시작 — 글 {len(chunks)}개")
    ids = post_thread(chunks, token, user, args.pause)

    if not args.lecture:
        state.update({
            "next": n + 1,
            "last_posted": n,
            "last_posted_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "last_root_post_id": ids[0],
        })
        save_state(state)
        print(f"state.json 갱신: 다음 게시는 {n + 1}강")
    return 0


if __name__ == "__main__":
    sys.exit(main())
