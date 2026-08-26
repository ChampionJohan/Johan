# 작가노트

매일 한 편씩 원고를 쌓고, 브런치스토리 · 요즘IT · 퍼블리(PUBLY)에 낼 형태로 뽑아내는 저장소.
주 1회 유튜브 영상(`세계의 비즈니스 모델`) 대본도 같은 방식으로 굴린다.

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
  export/      녹음용·업로드용 텍스트 (git 추적 안 함)
tools/
  mdlite.py    의존성 없는 마크다운 → HTML 변환기
  build.py     정적 사이트 빌더
  new_post.py  오늘자 초고 스캐폴딩
  export.py    매체별 내보내기
  new_video.py 주간 영상 대본 스캐폴딩
  video_export.py  나레이션 · 업로드 세트 내보내기
  video_assets.py  썸네일 · 5칸 · 구간 카드 SVG 생성
  youtube_upload.py  유튜브 업로드 (표준 라이브러리만, 선택 사항)
```

## 유튜브 시리즈 — 세계의 비즈니스 모델

주 1회, 10분. 9개 카테고리(IT · 음식 · 금융 · 숙박 · 마케팅 · 스포츠 · 경제 · 농업 · 어업)를
순서대로 돌면서, 매 편 같은 **BM 5칸**(고객 · 가치 · 과금 · 해자 · 균열)으로 해부한다.
1~4주차는 숏폼만, 5~8주차는 3분, 9주차부터 10분 롱폼. 자세한 내용은 `video/plan.md`.

```
[자동] 매주 월 09:00  편성 큐 → 대본 뼈대 + 그래픽 → 커밋 → '이번 주 영상' 이슈
[사람] 리서치 · 대본 · 녹음 · 편집          ← 여기는 자동화하지 않는다
[반자동] status: ready  →  video_export.py + video_assets.py  →  업로드
```

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
