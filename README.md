# 작가노트

매일 한 편씩 원고를 쌓고, 브런치스토리 · 요즘IT · 퍼블리(PUBLY)에 낼 형태로 뽑아내는 저장소.

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
| `python3 tools/donation.py` | `donations/malaysia.csv` → 날짜별 정리 md + html (합계 포함) |

의존성 없음. Python 3.8+ 만 있으면 된다.

## 디렉터리

```
writing/
  plan.md      연재 계획 + 주제 큐   ← 여기만 고치면 나오는 글이 바뀐다
  STYLE.md     글쓰기 규칙 (사람과 자동 작성기가 함께 지킴)
  posts/       원고 (마크다운, front matter 포함)
  site/        빌드된 HTML + RSS
  export/      매체별 붙여넣기용 텍스트 (git 추적 안 함)
donations/
  malaysia.csv   말레이시아지부 후원금 원장 ← 여기에만 한 줄씩 추가한다
  rates.csv      원화 환산 환율 (통화, 환율, 기준일, 출처)
  malaysia.md    날짜별 정리본 (자동 생성)
  malaysia.html  날짜별 정리본 + 총액 카드 (자동 생성)
tools/
  mdlite.py    의존성 없는 마크다운 → HTML 변환기
  build.py     정적 사이트 빌더
  new_post.py  오늘자 초고 스캐폴딩
  export.py    매체별 내보내기
  donation.py  후원금 원장 → md/html 정리
```

## 후원금 원장

`donations/malaysia.csv` 열 구성은 `date,donor,amount,currency,method,note` 다.

```csv
date,donor,amount,currency,method,note
2026-09-05,김철수,500000,KRW,계좌이체,9월 정기
2026-09-12,Ahmad,1200.50,MYR,transfer,지부 직접
```

- 날짜는 `2026-09-05` · `2026.09.05` · `20260905` 다 받는다. 순서대로 안 넣어도 빌드할 때 날짜순으로 정렬된다.
- 금액은 `1,000,000` · `1000000원` 다 받는다. `currency` 를 비우면 KRW.
- 통화가 섞이면 임의 환산하지 않고 **통화별로 따로** 합산한다.
- 빌드하면 md 와 html 양쪽에 다음 5개 절이 생긴다.

| 절 | 내용 |
|---|---|
| 1. 요약 | 총액, 건수, 후원자 수(정기/일시), 집계 기간, 월평균, 건당 평균 |
| 2. 월별 집계 | 월별 건수·금액·누계·전월 대비 증감률 (후원 없는 달도 0으로 표시) |
| 3. 날짜별 내역 | 날짜별 명세 + 소계/누계 |
| 4. 후원자별 집계 | 후원자별 합계·비중·첫 후원/최근 후원, 정기·일시 구분 |
| 5. 합계 | 통화별 최종 합계 |

- **정기 후원자** 판정 기준: 서로 다른 달에 2회 이상. 임의 판단이 아니라 이 규칙 하나로만 나눈다.
- **전월 대비**는 전월이 0원이면 증감률을 내지 않고 `-` 로 둔다 (0으로 나눈 값은 왜곡이라서).

### 원화 환산

`donations/rates.csv` 에 통화별 환율을 넣으면 원화 단일 총액이 나온다.

```csv
currency,krw_rate,asof,source
MYR,329.49,2026-09-11,Wise 중간환율
USD,1384.19,2026-09-16,Investing.com USD/KRW
```

- 외화 중 **하나라도 환율이 없으면 환산하지 않고** 통화별로 나눠 합산한다. 추정 환율은 쓰지 않는다.
- 적용 환율은 기준일·출처와 함께 보고서 맨 뒤에 남는다. 환산 근거를 못 대는 후원금 보고서는 쓸 수 없다.
- 은행 매매기준율로 확정할 때는 `rates.csv` 를 덮어쓰고 다시 빌드한다.
  일회성 확인은 `python3 tools/donation.py --rate USD=1390` 로 덮어쓸 수 있다.


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
