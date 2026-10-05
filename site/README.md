# 사업관리 템플릿 사이트

```
python3 site/build.py --drafts   # 초안 포함 미리보기 -> site/public
python3 site/build.py            # 공개용 (status: ready 만)
python3 -m http.server -d site/public 8000
```

| 하는 일 | 위치 |
|---|---|
| 사이트 이름·URL·이메일·애드센스 ID | `site/config.json` |
| 글 (`status: ready` 로 바꾸면 공개) | `site/content/posts/YYYY-MM-DD-slug.md` |
| 소개·개인정보처리방침·문의 | `site/content/pages/*.md` |
| 다운로드 양식(그대로 복사) | `site/static/` |

## 애드센스 연결

1. 도메인 구매 후 `config.json` 의 `url` 을 `https://내도메인.com`, `custom_domain` 을 `내도메인.com` 으로.
2. 승인 코드 확인 후 `adsense_client` 에 `ca-pub-XXXXXXXXXXXXXXXX` 입력 → 모든 페이지 `<head>` 에 스크립트, `ads.txt` 가 자동 생성된다.
3. 글의 `<!-- TODO -->` 를 실제 경험으로 채우고 `status: ready` 로 바꾼다.
4. 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 설정, main 에 머지하면 배포.
