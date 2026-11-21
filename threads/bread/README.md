# Threads 자동 게시 — "🍞 Today's Bread" (@jo.han.im)

## 매일 하는 일: 캡처 1장 올리기

```
묵상 화면 캡처 → Claude 대화창에 붙여 넣기
      │  Claude 가 영어 글 작성 (적용점 1개) → threads/bread/queue/날짜.txt 로 push
      ▼
GitHub Actions(today-bread) 가 push 를 감지해 즉시 Threads(@jo.han.im)에 게시 → posts/날짜.txt 로 보관
```

- **미리 올리기:** 내일 이후 묵상 캡처를 미리 올리면 `scheduled/날짜.txt` 로 예약되고, 그날 **미국 동부 07:53 (KST 21:53, 서머타임 중 20:53)** 에 게시된다.
  (예약 알림이 이 대화로 와서 Claude 가 `queue/` 로 옮겨 push 한다. GitHub 예약 실행은 기본 브랜치에서만 돌기 때문)
- 대화창에는 캡처만 올리면 된다. 처리 규칙은 저장소의 `CLAUDE.md` 에 있어 새 대화에서도 같은 방식으로 동작한다.
- 이 방식은 **Claude API 키가 필요 없다.** (글은 대화 중인 Claude 가 직접 쓴다)
- 참고: 사이트를 직접 읽어 요약하는 `auto` 모드도 남아 있다 (Actions → Run workflow → mode=auto, `ANTHROPIC_API_KEY` 필요).

## 글 형식 (매일 동일)

```
🍞 Today's Bread

"핵심 성경 구절 (영어)"
— Book Chapter:Verse

핵심 메시지 1~3문장 (본문 번역이 아닌 요약·재구성) 🕯️

👉 Today's step: 오늘 실천할 적용점 1개 (한 문장)

#TodaysBread #DailyDevotional #책이름
```

- 적용점은 **반드시 1개**. 0개이거나 2개 이상이면 자동으로 다시 쓰게 하고, 3번 실패하면 게시하지 않는다.
- 500자(Threads 한도) 초과, 한글 섞임도 같은 방식으로 막는다.
- 원문을 문장 단위로 번역하지 않고 요약·재구성한다 (저작권 보호).
- 같은 날 두 번 올라가지 않도록 `state.json` 에 게시 날짜를 기록한다. 올린 글은 `posts/YYYY-MM-DD.txt` 로 보관된다.

## 처음 한 번만 하는 설정

1. **기본 브랜치에 머지** — 예약 실행은 기본 브랜치의 워크플로만 동작한다.
2. (선택, auto 모드만) **Claude API 키** — <https://console.anthropic.com> → API Keys.
3. **jo.han.im 계정의 Threads 토큰** — 투자 공부 계정(`digitalnomad27mm`)과 **다른 계정**이므로 토큰도 따로 필요하다.
   `threads/README.md` 2~3단계를 그대로 하되, Threads Tester 로 **jo.han.im** 을 추가하고 그 계정으로 토큰을 만든다.
   확인: `THREADS_BREAD_ACCESS_TOKEN="토큰" python3 threads/bread/daily_bread.py --check-token` → `@jo.han.im` 이면 성공.
4. **GitHub Secrets** (Settings → Secrets and variables → Actions)
   - `ANTHROPIC_API_KEY` (auto 모드를 쓸 때만)
   - `THREADS_BREAD_ACCESS_TOKEN`
   - `THREADS_BREAD_USER_ID` (선택)
5. **시험** — 캡처를 한 장 올려 보고, Actions → **today-bread** 실행 결과와 Threads 게시를 확인한다.
   토큰이 없으면 실행이 빨간 X(실패)로 끝나고 글은 대기열에 남는다. 토큰 등록 후 Run workflow(mode=queue, dry_run 해제)로 올리면 된다.

## 운영 메모

- 토큰은 약 60일마다 연장 필요: `THREADS_ACCESS_TOKEN="현재토큰" python3 threads/post_threads.py --refresh-token` 후 Secrets 갱신.
- 묵상 페이지 구조가 바뀌어 본문(한글 200자 이상)을 못 찾으면 게시하지 않고 실패로 끝난다.
