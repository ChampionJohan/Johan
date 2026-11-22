# Threads 자동 게시 — "오늘의 투자 공부"

매일 **오전 8시 7분(KST)** 무렵에 `threads/posts/` 의 글을 번호 순서대로 1개씩 Threads 계정에 올린다.
글은 모두 첫 줄이 `오늘의 투자 공부 | 주제` 로 시작하고, **한국어 글 + 영어 답글** 2개로 올라가며, 글타래 끝에 **(1/2), (2/2)** 번호와 짧은 안내 문구가 붙는다.

## 어떻게 돌아가나 (한 장 요약)

```
[GitHub 서버]  매일 08:00 에 저절로 깨어남  (내 컴퓨터를 켜 둘 필요 없음)
     │
     ▼
posts/ 에서 "아직 안 올린 가장 앞 번호" 글을 고름   ← state.json 에 마지막으로 올린 번호가 적혀 있음
     │
     ▼
Threads 공식 API 로 내 계정에 게시  (토큰 = 내 계정에 글 올릴 수 있는 열쇠)
     │
     ▼
state.json 을 "방금 올린 번호"로 고쳐 저장  → 내일은 다음 번호
```

```
.github/workflows/threads-daily.yml   "매일 08:07 부터 09:37 까지 30분 간격으로 4번 시도해라" 라는 예약표
threads/post_threads.py               글을 골라 Threads 에 올리는 프로그램
threads/posts/001.txt, 002.txt …      올릴 글 (그냥 글 내용을 그대로 적은 텍스트 파일)
threads/state.json                    어디까지 올렸는지 기록
```

## 새 글을 추가하는 방법 (29강 이후 계속 올리기)

6~28강은 이미 `001~023` 번 글로 들어 있다. **파일 번호는 "올라가는 순서"이고 강의 번호와 다르다.** 29강 요약은 `024.txt`, 30강은 `025.txt` … 로 이어서 쌓인다.

1. **가장 쉬운 방법**: Claude 에게 요약(또는 영상 자막)과 함께 **"29강 Threads 대기열에 추가해 줘"** 라고 말한다. 한국어 + 영어 글로 다음 번호 파일을 만들어 저장소에 반영해 준다.
2. **글 형식** (직접 쓸 때)
   ```
   오늘의 투자 공부 | 주제

   한국어 본문…

   ※ 정보 제공 목적이며 투자 권유가 아닙니다.

   ---
   Daily Investing Study | Topic

   English body…
   ```
   - 파일 안의 **`---` 줄이 글타래의 경계**다. 앞쪽(한국어)은 첫 글, 뒤쪽(영어)은 그 글에 달리는 답글로 올라간다.
   - **글이 길어도 된다.** 한 구간이 약 494자를 넘으면 문단 단위로 끊어서 **댓글(답글)로 이어서** 올라가고, 글타래 전체에 `(1/5)` 같은 번호가 붙는다. 한국어 글이 모두 올라간 뒤 영어 글이 이어진다. 글타래는 10개 이하를 권한다. `--check-all` 로 몇 개로 나뉘는지 미리 본다.
   - 올리는 도중 실패해도 이미 올라간 글은 건너뛰고 **실패한 지점부터 이어서** 올린다. (`state.json` 의 `partial` 에 기록)
   - 안내 문구가 없으면 자동으로 붙는다. (한국어 `※ 정보 제공 목적이며 투자 권유가 아닙니다.` / 영어 `※ Not investment advice.`)
   - `---` 가 없으면 한 개짜리 글(한국어만)로 올라간다.
   - **해시태그**: 각 구간(한국어 / 영어)의 **제목 바로 아래 둘째 줄에 `#태그` 1개**를 적는다. Threads 는 글 하나에 **주제 태그를 1개만** 인식하므로 여러 개를 달아도 첫 번째만 작동한다. 태그에는 공백·마침표(.)·`&` 를 쓸 수 없다. (예: `#연금저축`, `#PensionSavings`) 태그도 글자 수에 포함된다.
3. **대기열 확인**: `python3 threads/post_threads.py --list` 로 남은 글 수를 본다. 남은 글이 **3개 이하**이면 게시할 때마다 노란 경고가 뜨고, **비면 그날은 건너뛴다.** 새 글을 넣으면 다음 날부터 이어서 올라간다.
4. 이미 올라간 글(`001`)은 한국어만 올라가 있다. 영어를 보태려면 Threads 에서 직접 답글로 달면 된다.

## 처음 한 번만 하는 설정 (사람이 직접 해야 하는 부분)

> 이 부분은 본인 계정 로그인이 필요해서 Claude 가 대신 할 수 없다. 아래 순서대로 따라 하면 된다.

### 1단계 · 이 코드를 "기본 브랜치"에 합치기
GitHub 의 예약 실행은 저장소의 **기본 브랜치**에 있는 파일만 실행한다. 이 작업 브랜치를 기본 브랜치로 머지(Pull Request → Merge)해야 한다. 머지를 해 달라고 Claude 에게 말해도 된다.

### 2단계 · Meta 개발자 앱 만들기 (Threads API 사용 허가)
1. <https://developers.facebook.com> 에 접속해 Threads 와 연결된 Meta(인스타그램/페이스북) 계정으로 로그인 → 개발자 등록
2. **My Apps → Create app** → 이름을 아무거나 정하고, 사용 사례(Use case)에서 **"Access the Threads API"** 선택
3. 앱 대시보드의 **Use cases → Threads API → 권한(Permissions)** 에서 아래 두 개를 추가
   - `threads_basic`
   - `threads_content_publish`
4. **App roles → Roles → Add people** 에서 **Threads Tester** 로 본인 계정(`digitalnomad27mm`)을 추가
5. Threads 앱(또는 웹)에서 **설정 → 계정 → 웹사이트 권한(Website permissions) → 초대(Invites)** 로 들어가 초대를 **수락**

### 3단계 · 토큰(열쇠) 발급
1. 앱 대시보드의 Threads API 설정에서 **User Token Generator(사용자 토큰 생성)** 로 본인 계정용 토큰을 만든다.
2. 이때 나오는 토큰은 **1시간짜리 단기 토큰**일 수 있다. 이 경우 로컬에서 아래 명령으로 약 60일짜리로 바꾼다. (App Secret 은 앱 **Settings → Basic** 에 있음)
   ```bash
   THREADS_ACCESS_TOKEN="단기토큰" THREADS_APP_SECRET="앱시크릿" python3 threads/post_threads.py --exchange-token
   ```
   명령이 어렵다면 이 부분은 Claude 에게 "토큰 교환 도와줘"라고 요청한다. (토큰·시크릿 값은 채팅에 붙여 넣지 말고, 본인 터미널에서만 실행한다.)
3. 계정이 맞는지 확인
   ```bash
   THREADS_ACCESS_TOKEN="토큰" python3 threads/post_threads.py --check-token
   ```
   `토큰 정상: @digitalnomad27mm` 이 나오면 성공.

### 4단계 · GitHub 에 열쇠 보관하기
저장소 **Settings → Secrets and variables → Actions → New repository secret**
- `THREADS_ACCESS_TOKEN` = 3단계에서 만든 토큰
- `THREADS_USER_ID` = (선택) Threads 사용자 ID. 비워 두면 `me` 로 동작
- **Settings → Actions → General → Workflow permissions** 가 **Read and write permissions** 인지 확인

> 토큰은 비밀번호와 같다. 채팅·코드·스크린샷에 절대 노출하지 말고 GitHub Secrets 에만 넣는다.

### 5단계 · 시험 게시
1. 저장소 **Actions** 탭 → **threads-daily** → **Run workflow** → `dry_run` 체크를 *그대로 둔 채* 실행 → 로그에 오늘 올라갈 글이 보이면 정상
2. `dry_run` 체크를 *끄고* `post` 칸에 `001` 입력 후 실행 → Threads 에 실제로 올라가는지 확인 (이 방식은 `state.json` 을 바꾸지 않는다)
3. 이후 매일 08:00 에 자동으로 `001` 부터 올라간다. 1번을 이미 수동으로 올렸다면 `state.json` 을 `{"last_posted": "001"}` 로 바꿔 두면 중복되지 않는다.

## 로컬 명령 (선택)

```bash
python3 threads/post_threads.py --list         # 대기열: 다음 글, 남은 개수
python3 threads/post_threads.py --dry-run      # 오늘 올릴 글 미리 보기
python3 threads/post_threads.py --check-all    # 전체 글자 수 점검 (500자 초과 시 실패)
python3 threads/post_threads.py --refresh-token   # 토큰 연장 (만료 전에)
```

## 운영 메모

- GitHub 예약 실행은 부하에 따라 **수 분~수십 분 늦을 수 있다.** 정각에 안 올라가도 정상이다.
- 토큰은 **약 60일마다 갱신**해야 한다. 만료되면 실행이 실패(빨간 X)한다. `--refresh-token` 으로 연장한 값을 Secrets 에 다시 넣는다.
- 게시 도중 실패하면 일부만 올라가고 `state.json` 은 그대로라서, 다시 실행하면 같은 글이 처음부터 올라간다. 중복이 보이면 Threads 에서 지운 뒤 재실행한다.
- Meta 의 API 사양(글자 수·권한 이름·화면 메뉴)은 바뀔 수 있다. 오류가 나면 공식 문서를 먼저 확인한다.

## 글 내용에 대하여

- 글은 영상 속 개인 경험담·주장은 빼고, 일반적으로 확인되는 개념과 계산 위주로 다시 쓴 것이다.
- 세제·한도·세율 수치는 `(2024년 기준)` 처럼 기준 시점을 적어 두었다. 제도는 자주 바뀌므로 **올리기 전 최신 기준을 한 번 확인**하는 것이 좋다.
- 투자 권유로 읽히지 않도록 모든 글 끝에 안내 문구가 붙는다.
