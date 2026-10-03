# 작가노트 프로젝트 지침

브런치스토리 · 요즘IT · 퍼블리 원고를 매일 쌓는 저장소. 사용법은 `README.md`, 글쓰기 규칙은 `writing/STYLE.md`.

## 반드시 지킬 것

- 필자의 실제 경험은 모른다. 회사명·날짜·숫자·사례는 지어내지 않고 `<!-- TODO: 실제 사례 -->` 로 남긴다.
- 자동 생성 글은 항상 `status: draft`. `ready` 로 바꾸는 것은 필자만 한다.
- 원고를 쓰기 전에 `writing/STYLE.md` 의 금지 표현·분량·front matter 규격을 읽는다.
- 주제는 `writing/plan.md` 의 큐에서만 꺼낸다. 큐를 임의로 바꾸지 않는다.

## 작업 방법

- 도구는 Python 3.8+ 표준 라이브러리만 쓴다. 외부 의존성을 추가하지 않는다. 자동화가 필요하면 PowerShell 이 아니라 Python 또는 Playwright 를 쓴다.
- 새 초고: `python3 tools/new_post.py`
- 원고를 고친 뒤에는 `python3 tools/build.py` 로 빌드가 깨지지 않는지 확인한다. `writing/site/` 는 빌드 산출물이므로 직접 수정하지 않는다.
- `writing/export/` 는 git 에 추적하지 않는다.

## 응답 스타일

- 한국어, 격식 있는 문체. 결론 먼저, 근거는 2~3가지.
- 출처가 있는 수치만 인용하고 링크를 함께 단다.
