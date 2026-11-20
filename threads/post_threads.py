#!/usr/bin/env python3
"""threads/posts/*.txt 를 이름 순서대로 하루 1개씩 Threads 에 게시한다. 외부 의존성 없음 (Python 3.8+).

글을 더 올리고 싶으면 posts 폴더에 다음 번호의 .txt 파일(예: 024.txt)을 추가하면 된다.
이미 올린 글 다음 번호부터 자동으로 이어서 올라간다.

    python3 threads/post_threads.py --list              # 대기열 확인 (다음 글, 남은 개수)
    python3 threads/post_threads.py --dry-run           # 오늘 올릴 글 미리 보기 (게시 안 함)
    python3 threads/post_threads.py                     # 실제 게시 후 state.json 갱신
    python3 threads/post_threads.py --file 005 --dry-run   # 특정 글 미리 보기 (--file 만 쓰면 그 글만 게시, state 불변)
    python3 threads/post_threads.py --check-all         # 전체 글 글자 수 점검
    python3 threads/post_threads.py --check-token       # 토큰 · 계정 확인
    python3 threads/post_threads.py --exchange-token    # 단기 토큰 → 장기(약 60일) 토큰 (THREADS_APP_SECRET 필요)
    python3 threads/post_threads.py --refresh-token     # 장기 토큰 연장 (만료 전에)

환경변수
    THREADS_ACCESS_TOKEN   필수 (게시·토큰 확인 시). 코드나 저장소에 절대 적지 말 것.
    THREADS_USER_ID        선택. 기본값 'me'.
    THREADS_APP_SECRET     --exchange-token 할 때만 필요.
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
POSTS = HERE / "posts"
STATE = HERE / "state.json"
API = os.environ.get("THREADS_API_BASE", "https://graph.threads.net/v1.0").rstrip("/")
API_ROOT = API.rsplit("/v", 1)[0] if re.search(r"/v\d+(\.\d+)?$", API) else API  # 토큰 교환/연장은 버전 없는 주소

HARD_LIMIT = 500          # Threads 글 1개 한도
LIMIT = 480               # 긴 글을 나눌 때 쪽수 표기 "(3/5)" 를 붙일 여유
WARN_POSTS = 5            # 한 글이 이보다 많은 조각으로 나뉘면 경고
LOW_QUEUE = 3             # 남은 글이 이 이하이면 경고
NUM_RESERVE = 6           # 글타래 번호 "\n(1/2)" 를 붙일 여유 글자 수
FOOTER_KO = "※ 정보 제공 목적이며 투자 권유가 아닙니다."
FOOTER_EN = "※ Not investment advice."
SECTION_SPLIT = re.compile(r"^[ \t]*---[ \t]*$", re.M)   # 글 파일 안의 "---" 줄 = 글타래를 나누는 경계


# ---------- 대기열 / 상태 ----------
def all_posts():
    return sorted(POSTS.glob("*.txt"))


def load_state():
    if STATE.exists():
        return json.loads(STATE.read_text(encoding="utf-8"))
    return {"last_posted": ""}


def save_state(state):
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def pending(state):
    last = state.get("last_posted", "")
    return [p for p in all_posts() if p.stem > last]


def find_post(name):
    stem = Path(name).stem
    for p in all_posts():
        if p.stem == stem:
            return p
    raise SystemExit(f"글 파일이 없습니다: {POSTS / (stem + '.txt')}")


# ---------- 본문 만들기 / 500자 분할 ----------
def break_unit(unit, limit):
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


def section_chunks(text):
    """한 구간(한국어 또는 영어)을 글 조각 목록으로 만든다. 안내 문구는 언어에 맞게 자동 부착."""
    text = text.strip()
    if "※" not in text:
        text += "\n\n" + (FOOTER_KO if re.search(r"[가-힣]", text) else FOOTER_EN)
    if len(text) <= HARD_LIMIT - NUM_RESERVE:
        return [text]
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    return pack(paragraphs, LIMIT, "\n\n")


def build_chunks(path):
    """파일을 '---' 줄 기준으로 구간별로 나눠, 각 구간을 글타래의 글로 만든다.
    예) 한국어 구간 → 첫 글, 영어 구간 → 그 글에 대한 답글."""
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        raise SystemExit(f"빈 글입니다: {path.name}")
    sections = [s.strip() for s in SECTION_SPLIT.split(raw) if s.strip()]
    chunks = []
    for s in sections:
        chunks.extend(section_chunks(s))
    total = len(chunks)
    if total > 1:   # 글타래 전체에 (1/2), (2/2) 번호를 붙인다
        chunks = [f"{c}\n({i}/{total})" for i, c in enumerate(chunks, 1)]
    return chunks


# ---------- Threads API ----------
def http(method, url, params, retries=3, label=""):
    data = urllib.parse.urlencode(params)
    if method == "GET":
        req = urllib.request.Request(f"{url}?{data}")
    else:
        req = urllib.request.Request(url, data=data.encode(), method="POST")
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            if e.code >= 500 and attempt < retries:
                time.sleep(2 ** attempt)
                continue
            raise SystemExit(f"Threads API 오류 {e.code} ({label}): {body}")
        except urllib.error.URLError as e:
            if attempt < retries:
                time.sleep(2 ** attempt)
                continue
            raise SystemExit(f"네트워크 오류 ({label}): {e}")


def api(method, path, params, token, retries=3):
    return http(method, f"{API}/{path}", dict(params, access_token=token), retries, label=path)


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


def need_env(name):
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"{name} 환경변수가 없습니다.")
    return value


# ---------- 명령 ----------
def cmd_list():
    state = load_state()
    posts, queue = all_posts(), pending(state)
    print(f"전체 {len(posts)}개 / 게시 완료 {len(posts) - len(queue)}개 / 대기 {len(queue)}개")
    if queue:
        print(f"다음에 올라갈 글: {queue[0].name}")
        for p in queue[:5]:
            lines = [ln for ln in p.read_text(encoding="utf-8").splitlines() if ln.strip()]
            print(f"  - {p.name}: {lines[0] if lines else '(빈 글)'}")
    return 0


def cmd_check_all():
    bad = 0
    for p in all_posts():
        chunks = build_chunks(p)
        longest = max(len(c) for c in chunks)
        flag = ""
        if longest > HARD_LIMIT:
            flag, bad = "  ← 500자 초과!", bad + 1
        elif len(chunks) > WARN_POSTS:
            flag = f"  ← 조각이 {len(chunks)}개 (너무 길어요)"
        elif len(chunks) > 1:
            flag = f"  (글타래 {len(chunks)}개로 나뉨)"
        print(f"{p.name}: {sum(len(c) for c in chunks)}자{flag}")
    return 1 if bad else 0


def cmd_check_token():
    token = need_env("THREADS_ACCESS_TOKEN")
    user = os.environ.get("THREADS_USER_ID", "me").strip() or "me"
    info = api("GET", user, {"fields": "id,username"}, token)
    print(f"토큰 정상: @{info.get('username')} (id={info.get('id')})")
    return 0


def cmd_exchange_token():
    short = need_env("THREADS_ACCESS_TOKEN")
    secret = need_env("THREADS_APP_SECRET")
    res = http("GET", f"{API_ROOT}/access_token",
               {"grant_type": "th_exchange_token", "client_secret": secret, "access_token": short},
               label="access_token")
    if "access_token" not in res:
        raise SystemExit(f"응답에 access_token 이 없습니다: {list(res)}")
    days = int(res.get("expires_in", 0)) // 86400
    print(f"장기 토큰 발급 완료 (유효 약 {days}일). 아래 값을 GitHub Secrets 의 THREADS_ACCESS_TOKEN 에 넣으세요.")
    print(res["access_token"])
    return 0


def cmd_refresh_token():
    token = need_env("THREADS_ACCESS_TOKEN")
    res = http("GET", f"{API_ROOT}/refresh_access_token",
               {"grant_type": "th_refresh_token", "access_token": token}, label="refresh_access_token")
    if "access_token" not in res:
        raise SystemExit(f"응답에 access_token 이 없습니다: {list(res)}")
    days = int(res.get("expires_in", 0)) // 86400
    print(f"토큰 연장 완료 (유효 약 {days}일). 아래 값을 GitHub Secrets 의 THREADS_ACCESS_TOKEN 에 다시 넣으세요.")
    print(res["access_token"])
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="게시하지 않고 내용만 출력")
    ap.add_argument("--file", help="특정 글만 처리 (예: 005). state.json 은 바꾸지 않음")
    ap.add_argument("--list", action="store_true", help="대기열 확인")
    ap.add_argument("--check-all", action="store_true", help="전체 글 점검")
    ap.add_argument("--check-token", action="store_true", help="토큰 확인")
    ap.add_argument("--exchange-token", action="store_true", help="단기 토큰을 장기 토큰으로 교환")
    ap.add_argument("--refresh-token", action="store_true", help="장기 토큰 연장")
    ap.add_argument("--pause", type=float, default=3.0, help="API 호출 사이 대기 초 (기본 3)")
    args = ap.parse_args()

    if args.list:
        return cmd_list()
    if args.check_all:
        return cmd_check_all()
    if args.check_token:
        return cmd_check_token()
    if args.exchange_token:
        return cmd_exchange_token()
    if args.refresh_token:
        return cmd_refresh_token()

    state = load_state()
    if args.file:
        post = find_post(args.file)
    else:
        queue = pending(state)
        if not queue:
            print("올릴 글이 없습니다. threads/posts/ 에 다음 번호의 .txt 파일을 추가하세요.")
            print("::warning::Threads 대기열이 비어 있습니다. 새 글을 추가해 주세요.")
            return 0
        post = queue[0]

    chunks = build_chunks(post)

    if args.dry_run:
        print(f"[DRY-RUN] {post.name} — 글 {len(chunks)}개")
        for i, c in enumerate(chunks, 1):
            print(f"\n----- {i}/{len(chunks)} ({len(c)}자) -----\n{c}")
        return 0

    token = need_env("THREADS_ACCESS_TOKEN")
    user = os.environ.get("THREADS_USER_ID", "me").strip() or "me"
    print(f"{post.name} 게시 시작 — 글 {len(chunks)}개")
    ids = post_thread(chunks, token, user, args.pause)

    if not args.file:
        state.update({
            "last_posted": post.stem,
            "last_posted_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "last_root_post_id": ids[0],
        })
        save_state(state)
        remaining = len(pending(state))
        print(f"state.json 갱신: 마지막 게시 {post.stem}, 남은 글 {remaining}개")
        if remaining <= LOW_QUEUE:
            print(f"::warning::남은 글이 {remaining}개입니다. 새 글을 추가해 주세요.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
