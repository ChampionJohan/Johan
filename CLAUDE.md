# 작업 규칙 (Claude 용)

## 🍞 Today's Bread — 묵상 캡처가 올라오면

사용자가 묵상 화면 캡처(이미지)를 올리면 **묻지 말고** 아래를 바로 진행한다.

1. 캡처에서 날짜·본문 구절·묵상 내용을 읽는다. 날짜가 안 보이면 오늘 날짜(KST)를 쓴다.
2. 아래 형식으로 **영어로만** 글을 쓴다. 원문을 문장 단위로 번역하지 말고 요약·재구성한다.
   ```
   🍞 Today's Bread

   "핵심 구절 1개 (NIV 등 표준 영어 번역)"
   — Book Chapter:Verse

   핵심 메시지 1~3문장, 따뜻하고 쉬운 말 🕯️

   👉 Today's step: 오늘 실천할 적용점 딱 1개 (한 문장)

   #TodaysBread #DailyDevotional #책이름
   ```
   - 적용점은 정확히 1개. 링크·한글·출처 사이트 언급 없음. 전체 470자 이하.
   - 마지막 줄 해시태그는 3개: `#TodaysBread #DailyDevotional` 고정 + 본문 성경 책 이름 1개 (예: `#Judges`, `#Matthew`, 띄어쓰기 없이 `#1Corinthians`).
3. 저장 위치는 날짜로 정한다 (날짜는 캡처의 묵상 날짜, KST 기준).
   - 게시 시각: 매일 **미국 동부 07:53** (KST 21:53, 서머타임 기간 20:53) — 미국 아침 시간대
   - **오늘(KST) 날짜이고 그날 게시 시각이 이미 지났으면** → `threads/bread/queue/YYYY-MM-DD.txt` (push 즉시 게시)
   - **그 외(미래 날짜, 또는 오늘이지만 게시 시각 전)** → `threads/bread/scheduled/YYYY-MM-DD.txt` (예약)
   - 매일 게시 시각에 이 대화로 예약 알림이 오면: `git pull --no-edit` 후 `scheduled/` 에서 오늘 이하 날짜 파일을
     `git mv` 로 `queue/` 에 옮겨 push → 게시 → Actions 결과 확인 후 보고. 옮길 파일이 없으면 "오늘 예약 글 없음"만 짧게 알린다.
4. `python3 threads/bread/daily_bread.py --check` 로 형식 검사 통과를 확인한다.
5. 이 대화의 작업 브랜치(`claude/tender-dijkstra-kskir8`)에 commit 후 push 한다. 사용자는 기본 브랜치 머지 없이 이 대화에서만 쓴다 (push 전 `git pull --no-edit` 로 봇 커밋을 먼저 받는다).
   push 되면 `today-bread` 워크플로가 Threads(@jo.han.im)에 바로 게시한다.
6. 몇 분 뒤 GitHub Actions 실행 결과(성공/실패)를 확인해 사용자에게 글 전문과 함께 알린다.
