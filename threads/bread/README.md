# Threads 자동 게시 — "🍞 Today's Bread" (@jo.han.im)

매일 **오전 5시 47분(KST)** 에 묵상 페이지(<https://qt.swim.org/user_utf/food/user_print_web.php>)를 읽어
**영어로만** 요약한 글 1개를 Threads `jo.han.im` 계정에 올린다.

## 글 형식 (매일 동일)

```
🍞 Today's Bread

"핵심 성경 구절 (영어)"
— Book Chapter:Verse

핵심 메시지 1~3문장 (본문 번역이 아닌 요약·재구성) 🕯️

👉 Today's step: 오늘 실천할 적용점 1개 (한 문장)
```

- 적용점은 **반드시 1개**. 0개이거나 2개 이상이면 자동으로 다시 쓰게 하고, 3번 실패하면 게시하지 않는다.
- 500자(Threads 한도) 초과, 한글 섞임도 같은 방식으로 막는다.
- 원문을 문장 단위로 번역하지 않고 요약·재구성한다 (저작권 보호).
- 같은 날 두 번 올라가지 않도록 `state.json` 에 게시 날짜를 기록한다. 올린 글은 `posts/YYYY-MM-DD.txt` 로 보관된다.

## 처음 한 번만 하는 설정

1. **기본 브랜치에 머지** — 예약 실행은 기본 브랜치의 워크플로만 동작한다.
2. **Claude API 키** — <https://console.anthropic.com> → API Keys 에서 발급.
   (요약 1회 약 3~5천 토큰 → 하루 약 $0.02~0.05, 월 $1~2 수준 예상)
3. **jo.han.im 계정의 Threads 토큰** — 투자 공부 계정(`digitalnomad27mm`)과 **다른 계정**이므로 토큰도 따로 필요하다.
   `threads/README.md` 2~3단계를 그대로 하되, Threads Tester 로 **jo.han.im** 을 추가하고 그 계정으로 토큰을 만든다.
   확인: `THREADS_BREAD_ACCESS_TOKEN="토큰" python3 threads/bread/daily_bread.py --check-token` → `@jo.han.im` 이면 성공.
4. **GitHub Secrets** (Settings → Secrets and variables → Actions)
   - `ANTHROPIC_API_KEY`
   - `THREADS_BREAD_ACCESS_TOKEN`
   - `THREADS_BREAD_USER_ID` (선택)
5. **시험** — Actions → **today-bread** → Run workflow (`dry_run` 체크 유지) → 로그에서 오늘 글 확인 →
   체크 해제 후 다시 실행하면 실제 게시.

## 운영 메모

- 시각 변경: `.github/workflows/today-bread.yml` 의 `cron` (UTC 기준, KST −9시간).
- 토큰은 약 60일마다 연장 필요: `THREADS_ACCESS_TOKEN="현재토큰" python3 threads/post_threads.py --refresh-token` 후 Secrets 갱신.
- 묵상 페이지 구조가 바뀌어 본문(한글 200자 이상)을 못 찾으면 게시하지 않고 실패로 끝난다.
