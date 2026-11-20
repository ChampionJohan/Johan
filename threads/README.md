# Threads 자동 게시 (곰희스쿨 강의 요약)

매일 **오전 8시(KST)** 에 강의 요약을 1강씩 Threads 글타래로 올린다. **6강부터 28강까지** (23일치).
첫 글에 제목·결론·핵심, 이어지는 답글에 나머지가 붙는다. 마지막 답글에 출처와 "투자 권유 아님" 문구가 들어간다.

```
.github/workflows/threads-daily.yml   매일 23:00 UTC(=08:00 KST) 실행
threads/post_threads.py               게시 스크립트 (의존성 없음)
threads/lectures/06.md ~ 28.md        강의별 요약 (여기를 고치면 올라가는 글이 바뀐다)
threads/state.json                    다음에 올릴 강 번호 (게시 후 자동 갱신·커밋)
```

## 처음 한 번만 하는 설정

1. **기본 브랜치에 합치기**: GitHub 의 예약 실행(`schedule`)은 *기본 브랜치*에 있는 워크플로만 돈다. 이 작업 브랜치를 기본 브랜치로 머지해야 한다.
2. **Meta 개발자 앱 만들기**: <https://developers.facebook.com> → 앱 만들기 → Threads API 사용 설정
   - 권한: `threads_basic`, `threads_content_publish`
   - 본인 Threads 계정을 앱의 *Threads 테스터*로 추가하고, Threads 앱에서 초대를 수락
3. **장기 액세스 토큰 발급** (유효기간 약 60일) 과 **Threads 사용자 ID** 확인
4. 저장소 **Settings → Secrets and variables → Actions** 에 등록
   - `THREADS_ACCESS_TOKEN` : 위에서 발급한 토큰
   - `THREADS_USER_ID` : Threads 사용자 ID (모르면 비워 둬도 `me` 로 동작)
5. **Settings → Actions → General → Workflow permissions** 가 *Read and write* 인지 확인 (진행 상태 커밋용)

> 토큰은 채팅·코드·커밋에 절대 적지 말고 GitHub Secrets 에만 넣는다.

## 시험 게시 순서

1. Actions 탭 → `threads-daily` → **Run workflow** → `dry_run` 체크(기본값) → 로그에서 올라갈 내용 확인
2. 문제가 없으면 `dry_run` 을 끄고 `lecture` 에 `6` 을 넣어 한 번 게시 (이 경우 `state.json` 은 바뀌지 않음)
3. 이후 매일 08:00 에 자동으로 다음 강이 올라간다. 시작 강을 바꾸고 싶으면 `state.json` 의 `next` 를 고친다.
   - 이미 6강을 수동으로 올렸다면 `"next": 7` 로 바꿔 두면 중복되지 않는다.

## 로컬 명령

```bash
python3 threads/post_threads.py --check-all          # 전 강의 분할·글자 수 점검 (500자 초과 시 실패)
python3 threads/post_threads.py --dry-run            # 오늘 올릴 글 미리보기
python3 threads/post_threads.py --lecture 12 --dry-run
THREADS_ACCESS_TOKEN=... python3 threads/post_threads.py --check-token
```

## 운영 메모

- GitHub 예약 실행은 부하에 따라 **수 분~수십 분 늦을 수 있다.** 정각에 올라가지 않아도 정상이다.
- 토큰은 **약 60일마다 갱신**해야 한다. 만료되면 워크플로가 실패하고 Actions 탭에 빨간 표시가 뜬다. 갱신한 토큰을 Secrets 에 다시 넣는다.
- 게시 중간에 실패하면 일부 글만 올라가고 `state.json` 은 그대로라서, 다시 실행하면 같은 강이 처음부터 올라간다. 중복이 보이면 Threads 에서 지운 뒤 재실행한다.
- 28강을 올리고 나면 이후 실행은 "모두 게시했습니다" 로 끝나며 아무것도 올리지 않는다.
- Meta 의 API 사양(글자 수·한도·권한 이름)은 바뀔 수 있다. 오류가 나면 공식 문서를 먼저 확인한다.

## 공개 게시 전 확인

- 영상 요약을 공개 게시하므로 **원작자(곰희스쿨) 표기와 영상 링크**를 유지한다. (각 강의 파일의 `출처:` 줄)
- 7·9·16·17·23·24강은 영상 링크를 받지 못해 `곰희스쿨 쌩초보반 N강` 으로만 적어 두었다. 링크를 알게 되면 해당 `.md` 의 `출처:` 줄을 URL 로 바꾼다.
- 요약에는 영상 속 수치와 강연자의 주장이 포함되어 있다. "참고할 점" 문단이 사실 확인이 필요한 부분을 알려 준다.
