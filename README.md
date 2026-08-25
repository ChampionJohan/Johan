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

의존성 없음. Python 3.8+ 만 있으면 된다.

## 디렉터리

```
writing/
  plan.md      연재 계획 + 주제 큐   ← 여기만 고치면 나오는 글이 바뀐다
  STYLE.md     글쓰기 규칙 (사람과 자동 작성기가 함께 지킴)
  posts/       원고 (마크다운, front matter 포함)
  site/        빌드된 HTML + RSS
  export/      매체별 붙여넣기용 텍스트 (git 추적 안 함)
tools/
  mdlite.py    의존성 없는 마크다운 → HTML 변환기
  build.py     정적 사이트 빌더
  new_post.py  오늘자 초고 스캐폴딩
  export.py    매체별 내보내기
```

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
