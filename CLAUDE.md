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
   ```
   - 적용점은 정확히 1개. 해시태그·링크·한글·출처 사이트 언급 없음. 전체 470자 이하.
3. `threads/bread/queue/YYYY-MM-DD.txt` 로 저장한다.
4. `python3 threads/bread/daily_bread.py --queue --dry-run` 으로 형식 검사 통과를 확인한다.
5. 작업 브랜치에 commit 후 push 한다 (push 전 `git pull --no-edit` 로 봇 커밋을 먼저 받는다).
   push 되면 `today-bread` 워크플로가 Threads(@jo.han.im)에 바로 게시한다.
6. 몇 분 뒤 GitHub Actions 실행 결과(성공/실패)를 확인해 사용자에게 글 전문과 함께 알린다.
