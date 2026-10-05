# PPT 생성 스크립트

`deck.js` — 설명회 발표용 16장 덱을 생성한다. 내용을 고치려면 이 파일을 고치고 다시 돌린다.

```bash
npm install pptxgenjs jszip
NODE_PATH=$PWD/node_modules node deck.js
```

- 레이아웃 4종: `TITLE_DARK` / `SECTION_DARK` / `CONTENT` / `CLOSING_DARK`
- 테마 색: 틸 `0F6457` · 네이비 `1B3A6B` · 골드 `8A6A1E` · 경고 `9E3F23`
- 글꼴: Malgun Gothic (윈도우 기본 한글 글꼴)
- 모든 장에 발표자 노트(`addNotes`)가 들어 있다

생성 후 확인:

```bash
python3 <pptx-skill>/scripts/office/validate.py 말레이시아-유학설명회.pptx
```
