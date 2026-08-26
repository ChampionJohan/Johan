# 작가노트

매일 한 편씩 원고를 쌓고, 브런치스토리 · 요즘IT · 퍼블리(PUBLY)에 낼 형태로 뽑아내는 저장소.
주 1회 유튜브 영상(`세계의 비즈니스 모델`) 대본도 같은 방식으로 굴린다.
대본을 쓰면 롱폼 1 · 중폼 1 · 숏폼 3 = 주 5편이 mp4 로 나온다.

## 하루 흐름

```
plan.md 주제 큐  →  자동으로 오늘자 초고 생성  →  내가 TODO 채우기  →  status: ready  →  export
```

## 명령어

| 명령 | 하는 일 |
|---|---|
| `python3 tools/new_post.py` | 큐에서 다음 주제를 꺼내 오늘자 초고 파일 생성 |
| `python3 tools/new_post.py --peek` | 다음 주제만 확인 |
| `python3 tools/new_post.py "제목"` | 주제를 직접 지정 |
| `python3 tools/build.py` | `writing/posts/*.md` → `writing/site/` (index + 글 + RSS) |
| `python3 tools/export.py` | 완성본을 매체별 붙여넣기용 텍스트로 내보내기 |
| `python3 tools/export.py --all` | 초고까지 전부 내보내기 |
| `python3 tools/new_video.py` | 편성 큐에서 다음 편을 꺼내 영상 대본 뼈대 생성 |
| `python3 tools/new_video.py --peek` | 다음 편만 확인 |
| `python3 tools/new_video.py --short` | 숏폼 전용 뼈대 (큐를 소비하지 않음) |
| `python3 tools/video_export.py` | 완성 대본 → 녹음용 나레이션 + 유튜브 업로드 세트 |
| `python3 tools/video_assets.py --latest` | 대본 → 썸네일 · BM 5칸 · 구간 카드 SVG 자동 생성 |
| `python3 tools/video_render.py --check` | 렌더에 필요한 도구(ffmpeg · 크롬 · TTS) 확인 |
| `python3 tools/video_render.py <대본> --all` | **대본 → 영상 파일.** 롱폼 1 · 중폼 1 · 숏폼 3 = 주 5편 |
| `python3 tools/youtube_upload.py --auth` | (선택) 유튜브 업로드 최초 인증 — 아래 주의사항 참고 |

의존성 없음. Python 3.8+ 만 있으면 된다.

## 디렉터리

```
writing/
  plan.md      연재 계획 + 주제 큐   ← 여기만 고치면 나오는 글이 바뀐다
  STYLE.md     글쓰기 규칙 (사람과 자동 작성기가 함께 지킴)
  posts/       원고 (마크다운, front matter 포함)
  site/        빌드된 HTML + RSS
  export/      매체별 붙여넣기용 텍스트 (git 추적 안 함)
video/
  plan.md      시리즈 기획 + 54편 편성 큐   ← 여기만 고치면 다음 영상이 바뀐다
  STYLE.md     대본 규칙 + 자료·저작권 원칙
  scripts/     영상 대본 (마크다운, front matter 포함)
  assets/      자동 생성된 그래픽 (썸네일 · 5칸 · 구간 카드 · 장면 보드)
  voice/       직접 녹음한 나레이션 (git 추적 안 함)
  render/      완성된 mp4 와 srt (git 추적 안 함)
  export/      녹음용·업로드용 텍스트 (git 추적 안 함)
tools/
  mdlite.py    의존성 없는 마크다운 → HTML 변환기
  build.py     정적 사이트 빌더
  new_post.py  오늘자 초고 스캐폴딩
  export.py    매체별 내보내기
  new_video.py 주간 영상 대본 스캐폴딩
  video_export.py  나레이션 · 업로드 세트 내보내기
  video_assets.py  썸네일 · 5칸 · 구간 카드 SVG 생성
  video_render.py  대본 + 나레이션 → mp4 + srt (롱폼/중폼/숏폼3)
  youtube_upload.py  유튜브 업로드 (표준 라이브러리만, 선택 사항)
```

## 유튜브 시리즈 — 세계의 비즈니스 모델

9개 카테고리(IT · 음식 · 금융 · 숙박 · 마케팅 · 스포츠 · 경제 · 농업 · 어업)를 순서대로 돌면서,
매 편 같은 **BM 5칸**(고객 · 가치 · 과금 · 해자 · 균열)으로 해부한다. 자세한 내용은 `video/plan.md`.

**주 5편, 주제는 하나.** 리서치를 한 번 하고 거기서 다섯 개를 잘라낸다.

| 산출물 | 길이 | 화면비 | 발행 | 편집 |
|---|---|---|---|---|
| 숏폼 1 훅형 | 50초 | 9:16 | 화 | 렌더 그대로 |
| 중폼 | 3분 | 16:9 | 수 | 렌더 그대로 |
| 숏폼 2 뜻밖형 | 50초 | 9:16 | 목 | 렌더 그대로 |
| 숏폼 3 요약형 | 40초 | 9:16 | 토 | 렌더 그대로 |
| **롱폼** | 10분 | 16:9 | **일 19:00** | 사람이 B롤 얹음 |

편집기를 여는 건 롱폼 하나뿐이다. 나머지 넷은 `video_render.py` 가 뽑은 mp4 를 그대로 올린다.

```
[자동]  매주 월 09:00  편성 큐 → 대본 뼈대 + 그래픽 → 커밋 → '이번 주 영상' 이슈
[사람]  리서치 · 대본 문장 · 나레이션        ← 여기만 사람이 한다
[자동]  video_render.py --all  →  mp4 5개 + srt 5개
[사람]  롱폼만 B롤 얹기  →  5편 예약 업로드
```

### 영상을 만들려면 (처음 한 번)

```
python3 tools/video_render.py --check
```

`ffmpeg` 과 크롬 계열 브라우저가 필요하다. 크롬은 이미 깔려 있으면 자동으로 찾고,
없으면 `CHROME_BIN` 으로 직접 지정한다. 나레이션은 운영체제 내장 TTS 를 쓰거나
(`macOS say` · `Windows SAPI` · `espeak-ng`), `video/voice/<슬러그>/<이름>/01.wav` 에
직접 녹음한 파일을 넣고 `--voice` 로 쓴다. **본인 목소리를 권한다** —
유튜브 재사용 콘텐츠 심사에도, 신뢰도에도 유리하다.

`.github/workflows/weekly-video.yml` 이 매주 월요일 09:00 KST 에 돈다.
큐가 8편 아래로 내려가면 따로 이슈로 알린다.

### 자동화하지 않는 것

리서치와 숫자는 자동으로 만들지 않는다. 실존하는 회사의 매출과 구조를 다루는 채널이라
틀린 숫자 하나가 채널 전체의 신뢰를 깎고, 유튜브도 그런 영상을 저품질로 분류한다.
글쓰기 파이프라인과 같은 원칙이다 — **자동 작성기는 구조까지만 만든다.**

### 업로드에 대해

주 1편이라면 **유튜브 스튜디오에서 직접 올리고 예약 발행**을 거는 쪽이 낫다.
감사(audit)를 통과하지 않은 API 프로젝트로 올린 영상은 비공개로 잠기고 이의신청이 안 되며,
풀려면 지우고 다시 올려야 한다. `tools/youtube_upload.py` 는 감사를 통과했거나
비공개 업로드로 충분할 때 쓰는 선택 사항이다. 자세한 내용은 그 파일 맨 위 설명에 있다.

## 책 — 『돈의 해부학』

세계의 사업을 다섯 칸(고객 · 가치 · 과금 · 해자 · 균열)으로 해부하는 단행본.
`다섯 칸 시리즈` 첫째 권이고, 둘째 권은 『돈의 해부학 2 — 왜 아직 안 뺏겼는가』다.

| 명령 | 하는 일 |
|---|---|
| `python3 tools/book.py` | 원고 → `book/site/index.html` (브라우저용 한 권) |
| `python3 tools/book.py --artifact` | 아티팩트용 조각 HTML |
| `python3 tools/book.py --md` | 번호가 매겨진 원고 한 파일 |
| `python3 tools/book.py --plain` | 투고·편집용 평문 |
| `python3 tools/book.py --stat` | 장별 분량 · 남은 확인 항목 (독자용 아님) |

```
book/
  plan.md        출간 기획 + 편집 규칙
  manuscript/    원고. 파일 이름 앞 숫자가 곧 차례
  site/          빌드 결과 (git 추적 안 함)
```

실존 기업의 숫자는 지어내지 않는다. 확인이 필요한 자리에는
`<!-- 확인: … 출처 -->` 를 남기고, `--stat` 이 남은 건수를 센다.
**확인과 TODO 가 둘 다 0 이어야 발행할 수 있다.**

## 매체별 내보내기 규칙

| 매체 | front matter `target` | 형식 |
|---|---|---|
| 브런치스토리 | `brunch` | 마크다운 기호를 걷어낸 평문 (브런치 에디터가 마크다운을 못 받음) |
| 요즘IT | `yozm` | 마크다운 원본 |
| 퍼블리 | `publy` | 마크다운 원본 |

`target` 은 시리즈 이름으로 자동 결정된다 (`요즘…` → yozm, `퍼블리…` → publy, 그 외 → brunch).

## 원칙 하나

자동 작성기는 **구조까지만** 만든다. 실제 경험·숫자·사례는 `<!-- TODO: 실제 사례 -->` 로 비워 두고
사람이 채운다. 자동 생성 글은 전부 `status: draft` 로 시작하며,
TODO 를 채우고 `status: ready` 로 바꿔야 내보내기 대상이 된다. 자세한 이유는 `writing/STYLE.md`.
