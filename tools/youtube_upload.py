#!/usr/bin/env python3
"""완성된 영상 파일을 유튜브에 올린다. 대본에서 제목·설명·챕터·태그를 그대로 가져온다.

    python3 tools/youtube_upload.py --auth
        최초 1회. 브라우저가 열리고, 승인하면 .youtube.json 에 갱신 토큰이 저장된다.

    python3 tools/youtube_upload.py 영상.mp4 --script video/scripts/2026-08-26-....md
        비공개(private)로 올린다.

    python3 tools/youtube_upload.py 영상.mp4 --script ... --publish-at 2026-09-01T09:00:00+09:00
        비공개로 올리고 지정 시각에 자동 공개한다.

먼저 읽을 것 — 감사(audit) 를 통과하지 않은 API 프로젝트로 올린 영상은
**비공개로 잠기며 이의신청이 안 된다.** 풀려면 영상을 지우고 다시 올려야 한다.
  https://support.google.com/youtube/answer/7300965
  https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits
주 1편이라면 유튜브 스튜디오에서 직접 올리고 예약 발행을 거는 쪽이 거의 항상 낫다.
이 스크립트는 감사를 통과했거나, 비공개 업로드만으로 충분할 때 쓴다.

준비물 (한 번만):
  1. Google Cloud Console 에서 프로젝트 생성 → YouTube Data API v3 사용 설정
  2. OAuth 동의 화면 구성 → 사용자 인증 정보 → OAuth 클라이언트 ID → '데스크톱 앱'
  3. 아래 환경변수로 넣는다
       export YT_CLIENT_ID=...
       export YT_CLIENT_SECRET=...

의존성 없음. 표준 라이브러리만 쓴다. videos.insert 는 하루 할당량 10,000 중 1,600 을 쓴다.
"""

import json
import mimetypes
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import ROOT
from video_export import CHAPTER, parse, sections, clean, source_lines

TOKEN_FILE = os.path.join(ROOT, ".youtube.json")
SCOPE = "https://www.googleapis.com/auth/youtube.upload"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
CHUNK = 8 * 1024 * 1024  # 8MB. 끊겨도 이 단위로 이어 올린다.
CATEGORY_ID = "27"  # Education. 22=People & Blogs 로 바꿔도 된다.


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """이어올리기 응답 308 은 리다이렉트가 아니라 '여기까지 받았다' 는 뜻이다."""

    def redirect_request(self, *args, **kwargs):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def post_form(url, fields):
    data = urllib.parse.urlencode(fields).encode()
    request = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(request) as response:
        return json.load(response)


# ------------------------------------------------------------------ 인증

class Catcher(BaseHTTPRequestHandler):
    code = None

    def do_GET(self):
        query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        Catcher.code = (query.get("code") or [None])[0]
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write("<h2>승인됐습니다. 터미널로 돌아가세요.</h2>".encode())

    def log_message(self, *args):
        pass


def authorize(client_id, client_secret):
    server = HTTPServer(("127.0.0.1", 0), Catcher)
    redirect = "http://127.0.0.1:%d" % server.server_port
    url = AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": redirect, "response_type": "code",
        "scope": SCOPE, "access_type": "offline", "prompt": "consent",
    })
    print("브라우저에서 승인하세요. 안 열리면 이 주소를 직접 여세요:\n%s\n" % url)
    webbrowser.open(url)
    server.handle_request()
    if not Catcher.code:
        print("승인 코드를 받지 못했습니다.")
        return 1

    token = post_form(TOKEN_URL, {
        "code": Catcher.code, "client_id": client_id, "client_secret": client_secret,
        "redirect_uri": redirect, "grant_type": "authorization_code",
    })
    with open(TOKEN_FILE, "w", encoding="utf-8") as handle:
        json.dump({"refresh_token": token["refresh_token"]}, handle)
    os.chmod(TOKEN_FILE, 0o600)
    print("저장했습니다: %s  (git 에 올라가지 않습니다)" % os.path.relpath(TOKEN_FILE, ROOT))
    print("\nGitHub Actions 에서 돌리려면 이 값을 시크릿 YT_REFRESH_TOKEN 으로 넣으세요:")
    print(token["refresh_token"])
    return 0


def access_token(client_id, client_secret):
    refresh = os.environ.get("YT_REFRESH_TOKEN")
    if not refresh and os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, encoding="utf-8") as handle:
            refresh = json.load(handle).get("refresh_token")
    if not refresh:
        raise SystemExit("갱신 토큰이 없습니다. 먼저 --auth 를 실행하세요.")
    return post_form(TOKEN_URL, {
        "refresh_token": refresh, "client_id": client_id,
        "client_secret": client_secret, "grant_type": "refresh_token",
    })["access_token"]


# ------------------------------------------------------------- 대본 → 메타

def subsection(body, name):
    """`### 이름` 아래 본문만 꺼낸다."""
    match = re.search(r"^###\s+%s\s*$(.*?)(?=^##|\Z)" % re.escape(name), body, re.M | re.S)
    return clean(match.group(1)) if match else ""


def metadata(path):
    meta, body = parse(path)
    chapters = []
    for name, text in sections(body):
        if name.startswith("대본"):
            chapters = [(m.group(1), m.group(2).strip()) for m in CHAPTER.finditer(text)]
            break

    lines = [subsection(body, "설명란 요약")]
    if len(chapters) >= 3:
        lines += ["", "\n".join("%s %s" % (code, label) for code, label in chapters)]
    sources = source_lines(body)
    if sources:
        lines += ["", "출처", "\n".join(sources)]
    lines += ["", "세계의 비즈니스 모델 · 매주 한 편"]

    tags = [t.strip() for t in re.split(r"[,\n]", subsection(body, "태그")) if t.strip()]
    return {
        "snippet": {
            "title": meta["title"][:100],
            "description": "\n".join(l for l in lines if l is not None)[:5000],
            "tags": (tags or ["비즈니스모델", meta.get("category", "")])[:30],
            "categoryId": CATEGORY_ID,
            "defaultLanguage": "ko",
        },
        "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": False},
    }


# ---------------------------------------------------------------- 업로드

def upload(video_path, meta, token):
    size = os.path.getsize(video_path)
    mime = mimetypes.guess_type(video_path)[0] or "video/mp4"
    start = urllib.request.Request(
        UPLOAD_URL + "?" + urllib.parse.urlencode({"uploadType": "resumable", "part": "snippet,status"}),
        data=json.dumps(meta).encode(), method="POST",
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json; charset=utf-8",
                 "X-Upload-Content-Length": str(size), "X-Upload-Content-Type": mime})
    with urllib.request.urlopen(start) as response:
        session = response.headers["Location"]

    sent = 0
    with open(video_path, "rb") as handle:
        while sent < size:
            chunk = handle.read(CHUNK)
            request = urllib.request.Request(
                session, data=chunk, method="PUT",
                headers={"Content-Length": str(len(chunk)), "Content-Type": mime,
                         "Content-Range": "bytes %d-%d/%d" % (sent, sent + len(chunk) - 1, size)})
            try:
                with OPENER.open(request) as response:
                    print("\r올리는 중 100%", flush=True)
                    return json.load(response)
            except urllib.error.HTTPError as error:
                if error.code != 308:  # 308 = 여기까지 받았으니 다음을 달라
                    raise
                # 서버가 실제로 어디까지 받았는지가 정답이다. 없으면 보낸 만큼으로 친다.
                received = error.headers.get("Range")
                sent = int(received.split("-")[-1]) + 1 if received else sent + len(chunk)
                handle.seek(sent)
                print("\r올리는 중 %3d%%" % (100 * sent // size), end="", flush=True)
    return {}


def main():
    args = sys.argv[1:]
    client_id = os.environ.get("YT_CLIENT_ID")
    client_secret = os.environ.get("YT_CLIENT_SECRET")
    if not client_id or not client_secret:
        print("YT_CLIENT_ID 와 YT_CLIENT_SECRET 환경변수가 필요합니다. 파일 맨 위 설명을 보세요.")
        return 1

    if "--auth" in args:
        return authorize(client_id, client_secret)

    positional = [a for a in args if not a.startswith("--")]
    script = next((args[i + 1] for i, a in enumerate(args) if a == "--script"), None)
    publish_at = next((args[i + 1] for i, a in enumerate(args) if a == "--publish-at"), None)
    if not positional or not script:
        print(__doc__)
        return 1

    video_path = positional[0]
    if not os.path.exists(video_path):
        print("영상 파일이 없습니다: %s" % video_path)
        return 1

    meta = metadata(script)
    if publish_at:
        meta["status"]["publishAt"] = publish_at

    print("제목: %s" % meta["snippet"]["title"])
    print("태그: %s" % ", ".join(meta["snippet"]["tags"]))
    print("공개: private%s" % ("  →  %s 에 자동 공개" % publish_at if publish_at else ""))
    print("파일: %s (%.1f MB)\n" % (video_path, os.path.getsize(video_path) / 1e6))

    result = upload(video_path, meta, access_token(client_id, client_secret))
    print()
    if result.get("id"):
        print("올렸습니다: https://youtu.be/%s" % result["id"])
        print("감사를 통과하지 않은 프로젝트라면 비공개로 잠깁니다. 스튜디오에서 상태를 확인하세요.")
    else:
        print("업로드가 끝났지만 응답에 영상 ID 가 없습니다. 스튜디오에서 확인하세요.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
