const pptxgen = require("pptxgenjs");

/* ── 팔레트 : 말레이시아 국기(남색·황금) + IM 브랜드 오렌지 ───────── */
const NAVY   = "0A2A5E";  // dominant
const NAVY2  = "16407F";  // 보조 네이비
const NAVY3  = "1E3A6B";  // 다크 슬라이드 카드
const ORANGE = "E85D1F";  // sharp accent / 테일러스
const GOLD   = "F5B301";  // 말레이시아 골드 / 선웨이
const WHITE  = "FFFFFF";
const PAPER  = "F3F6FB";  // 라이트 카드
const RULE   = "D8E1EF";
const MUTED  = "5A6B87";  // 라이트 위 보조문자
const MUTED_D= "AEC3E6";  // 다크 위 보조문자
const OK     = "18734A";
const WARN   = "A1660A";
const BAD    = "B5342B";

const KR = "맑은 고딕";

const W = 13.333, H = 7.5;
const M = 0.62;                     // 좌우 여백
const CW = W - M * 2;               // 콘텐츠 폭

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "IM 말레이시아";
pres.title  = "IM 말레이시아 입학안내문 2027";

/* ── 헬퍼 ────────────────────────────────────────────────────────── */
const sh = () => ({ type: "outer", color: "0A2A5E", blur: 10, offset: 2, angle: 90, opacity: 0.1 });

function slide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? NAVY : WHITE };
  return s;
}

// 번호 배지 + 카테고리 + 제목  (모티프: 사각 번호 칩)
function head(s, num, kicker, title, dark, accent) {
  const A = accent || (dark ? GOLD : ORANGE);
  s.addShape(pres.ShapeType.rect, { x: M, y: 0.42, w: 0.44, h: 0.32, fill: { color: A } });
  s.addText(num, {
    x: M, y: 0.42, w: 0.44, h: 0.32, isTextBox: true, margin: 0,
    align: "center", valign: "middle", fontFace: "Calibri", fontSize: 13, bold: true,
    color: num === "04" || num === "09" ? NAVY : WHITE,
  });
  s.addText(kicker, {
    x: M + 0.6, y: 0.42, w: 7.5, h: 0.32, isTextBox: true, margin: 0, valign: "middle",
    fontFace: "Calibri", fontSize: 11, bold: true, charSpacing: 2.2,
    color: dark ? MUTED_D : MUTED,
  });
  s.addText(title, {
    x: M, y: 0.88, w: CW, h: 0.72, isTextBox: true, margin: 0, valign: "top",
    fontFace: KR, fontSize: 32, bold: true, color: dark ? WHITE : NAVY,
  });
}

function lede(s, txt, dark, y) {
  s.addText(txt, {
    x: M, y: y || 1.66, w: CW - 0.4, h: 0.5, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 13, color: dark ? MUTED_D : MUTED, lineSpacing: 20,
  });
}

function card(s, x, y, w, h, fill, line) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.05,
    fill: { color: fill || PAPER },
    line: line ? { color: line, width: 1 } : { color: RULE, width: 1 },
    shadow: sh(),
  });
}

function tbl(s, rows, opts) {
  s.addTable(rows, Object.assign({
    x: M, w: CW, border: { type: "solid", color: RULE, pt: 0.75 },
    fontFace: KR, fontSize: 11.5, color: "1B2A44",
    valign: "middle", autoPage: false,
  }, opts));
}
const th = (t) => ({ text: t, options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 11 } });
const rh = (t) => ({ text: t, options: { bold: true, color: NAVY, fill: { color: PAPER } } });

function footnote(s, txt, dark) {
  s.addText(txt, {
    x: M, y: H - 0.62, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 9.5, color: dark ? MUTED_D : MUTED, italic: true,
  });
}

/* ══ 01 · 표지 ═══════════════════════════════════════════════════ */
{
  const s = slide(true);
  // 국기 모티프: 초승달 대신 골드 별 배치(장식 최소)
  s.addShape(pres.ShapeType.star5, { x: 11.35, y: 0.75, w: 1.35, h: 1.35, fill: { color: GOLD }, line: { color: GOLD } });
  s.addShape(pres.ShapeType.star5, { x: 12.35, y: 2.35, w: 0.55, h: 0.55, fill: { color: ORANGE }, line: { color: ORANGE } });

  s.addText("2027학년도 · 개정판", {
    x: M, y: 1.85, w: 6, h: 0.35, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 13, bold: true, color: GOLD, charSpacing: 1.5,
  });
  s.addText("IM 말레이시아\n입학안내문", {
    x: M, y: 2.3, w: 9.2, h: 2.1, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 52, bold: true, color: WHITE, lineSpacing: 60,
  });
  s.addText("테일러스 대학교 · 선웨이 대학교 · 입학 행정 타임라인", {
    x: M, y: 4.55, w: 9.5, h: 0.4, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 16, color: MUTED_D,
  });

  const meta = [
    ["기준 자료", "QS World University Rankings 2027"],
    ["학비 · 일정", "각 대학 2026 공식 학사일정 및 학비표"],
    ["적용 환율", "1링깃(RM) ≈ 339원 (2026.09)"],
    ["작성일", "2026년 9월 14일"],
  ];
  meta.forEach((m, i) => {
    const x = M + i * 3.05;
    s.addText(m[0], { x, y: 5.6, w: 2.9, h: 0.26, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10, bold: true, color: GOLD });
    s.addText(m[1], { x, y: 5.86, w: 2.9, h: 0.6, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11, color: MUTED_D, lineSpacing: 15 });
  });
  s.addNotes("2027학년도 말레이시아 유학 안내 개정판입니다. 원본 안내문에서 인티대학교를 빼고 테일러스·선웨이 2개교로 재편했으며, 입학 행정 타임라인과 팩트체크를 새로 넣었습니다.");
}

/* ══ 02 · 개정 요지 ══════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "01", "REVISION SUMMARY", "이번 개정에서 달라진 것", false);
  lede(s, "원본 IM 말레이시아 입학안내문의 구성은 유지하되, 추천 대학을 교체하고 행정 일정과 예산을 실측값으로 다시 계산했습니다.", false);

  const stats = [
    ["18", "개 항목 검증", "원문 표의 랭킹·일정·학위·예산 전 항목", NAVY],
    ["9", "개 항목 수정", "사실과 달라 바로잡은 항목", ORANGE],
    ["3", "개 플랜 신설", "A(1~2월) · B(4월) · C(8~9월 예비)", GOLD],
  ];
  stats.forEach((t, i) => {
    const x = M + i * 4.13, w = 3.85;
    card(s, x, 2.35, w, 1.72, PAPER);
    s.addText(t[0], { x: x + 0.28, y: 2.5, w: 1.3, h: 0.95, isTextBox: true, margin: 0, valign: "middle", fontFace: "Calibri", fontSize: 54, bold: true, color: t[3] });
    s.addText(t[1], { x: x + 1.5, y: 2.72, w: 2.2, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 14, bold: true, color: NAVY });
    s.addText(t[2], { x: x + 0.28, y: 3.42, w: w - 0.56, h: 0.5, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: MUTED, lineSpacing: 14 });
  });

  const rows = [
    [th("구분"), th("원본 안내문"), th("2027 개정판")],
    [rh("추천 대학"), "인티대학교 · 선웨이대학교", { text: "테일러스대학교 · 선웨이대학교", options: { bold: true, color: ORANGE } }],
    [rh("행정 일정"), "없음", { text: "A · B · C 3개 플랜 (검정고시 ~ 입학 전 구간)", options: { bold: true } }],
    [rh("예산 산정"), "학비 + 생활비 2개 항목", { text: "IM 입학금 · 비자 갱신비 · 6% 서비스세 · 점심/용돈 추가", options: { bold: true } }],
    [rh("근거 표기"), "없음", "전 항목 공개 출처 링크 28건 명시"],
  ];
  tbl(s, rows, { y: 4.35, rowH: 0.47, colW: [2.0, 4.0, 6.09] });
  footnote(s, "검증 기준일 2026년 9월 14일 · 대학 학비와 입학 조건은 연 단위로 개정되므로 최종 지원 전 각 대학 입학처 재확인 필요");
  s.addNotes("이번 개정의 핵심은 두 가지입니다. 첫째 추천 대학 교체, 둘째 원문 18개 항목 중 9개를 사실과 달라 수정했다는 점입니다.");
}

/* ══ 03 · 왜 말레이시아 ═══════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "02", "WHY MALAYSIA", "왜 말레이시아인가?", false);
  lede(s, "영어로 배우고, 영국·호주 학위를 본교보다 낮은 비용으로 취득하며, 한국인이 적응하기 수월한 다인종 사회라는 세 가지가 맞물립니다.", false);

  const items = [
    ["영어 환경", "말레이시아 사립대 수업은 전 과목 영어로 진행되며 공식 비즈니스 언어도 영어입니다. 영미권 교육기관과 학위 연계가 폭넓습니다.", ORANGE],
    ["경제적인 유학비용", "연간 학비가 국내 사립대와 비슷한 수준(약 900만~1,800만 원)이며, 해외 프로그램도 본교 대비 낮은 금액으로 취득할 수 있습니다.", GOLD],
    ["다양한 진로 옵션", "말레이시아 자체 학위와 해외대학 연계 프로그램(트위닝 · 트랜스퍼 · 복수 학위)을 함께 운영합니다.", NAVY2],
    ["유학생활 적응 용이", "아시아 국가이자 다인종 사회로 한국인 선호도가 높고 문화적 적응이 비교적 수월합니다.", ORANGE],
  ];
  items.forEach((it, i) => {
    const x = M + (i % 2) * 6.2, y = 2.35 + Math.floor(i / 2) * 1.62;
    card(s, x, y, 5.9, 1.4, PAPER);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.28, y: y + 0.32, w: 0.62, h: 0.62, fill: { color: it[2] } });
    s.addText(String(i + 1), { x: x + 0.28, y: y + 0.32, w: 0.62, h: 0.62, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 19, bold: true, color: it[2] === GOLD ? NAVY : WHITE });
    s.addText(it[0], { x: x + 1.08, y: y + 0.2, w: 4.6, h: 0.34, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 15, bold: true, color: NAVY });
    s.addText(it[1], { x: x + 1.08, y: y + 0.56, w: 4.62, h: 0.76, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: MUTED, lineSpacing: 14 });
  });

  ["우수한 교육 환경", "다양한 대학 프로그램", "경제적이고 효율적"].forEach((t, i) => {
    const x = M + i * 3.0;
    s.addShape(pres.ShapeType.roundRect, { x, y: 5.95, w: 2.75, h: 0.48, rectRadius: 0.24, fill: { color: NAVY } });
    s.addText(t, { x, y: 5.95, w: 2.75, h: 0.48, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: KR, fontSize: 12, bold: true, color: WHITE });
  });
  s.addNotes("말레이시아를 택하는 근거는 영어 환경, 비용, 진로 옵션, 적응 용이성 네 가지입니다.");
}

/* ══ 04 · 대학 유형 ══════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "03", "UNIVERSITY TYPES", "말레이시아 대학 유형", false);
  lede(s, "IM 말레이시아는 연 3회 입학 기회와 해외대학 연계 진로를 동시에 갖춘 사립대학교 경로를 추천합니다.", false);

  const cols = [
    ["국립대학교", "말라야 대학교 (UM)", ["연 1회 (하반기)", "약 500만 원 / 연간", "영어 수업이나 말레이어가\n필수 교양"], MUTED, false],
    ["사립대학교", "테일러스 · 선웨이", ["연 3회", "약 900만~1,800만 원 / 연간", "자체 학위 + 해외 명문대\n연계 진로 선택 가능"], ORANGE, true],
    ["해외 직영 캠퍼스", "모나쉬 · 노팅엄", ["연 1~2회", "약 1,200만~1,800만 원 / 연간", "본교 교환학생 자유,\n학비가 높은 편"], NAVY2, false],
  ];
  cols.forEach((c, i) => {
    const x = M + i * 4.13, w = 3.85;
    card(s, x, 2.3, w, 3.5, c[4] ? "FFF3EC" : PAPER, c[4] ? ORANGE : RULE);
    s.addShape(pres.ShapeType.rect, { x: x + 0.3, y: 2.58, w: 0.26, h: 0.26, fill: { color: c[3] } });
    s.addText(c[0], { x: x + 0.7, y: 2.5, w: w - 1.0, h: 0.42, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 16, bold: true, color: NAVY });
    if (c[4]) s.addText("IM 추천", { x: x + w - 1.25, y: 2.5, w: 0.95, h: 0.42, isTextBox: true, margin: 0, align: "right", valign: "middle", fontFace: KR, fontSize: 9.5, bold: true, color: ORANGE });
    s.addText(c[1], { x: x + 0.3, y: 3.0, w: w - 0.6, h: 0.32, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12, bold: true, color: c[3] === MUTED ? MUTED : c[3] });

    const labels = ["지원 시기", "평균 학비", "특징"];
    c[2].forEach((v, j) => {
      const y = 3.5 + j * 0.78;
      s.addText(labels[j], { x: x + 0.3, y, w: w - 0.6, h: 0.22, isTextBox: true, margin: 0, fontFace: KR, fontSize: 9, bold: true, color: MUTED, charSpacing: 1 });
      s.addText(v, { x: x + 0.3, y: y + 0.22, w: w - 0.6, h: 0.52, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11.5, bold: j < 2, color: "1B2A44", lineSpacing: 14 });
    });
  });
  s.addText("공통 지원 자격 : 고교 졸업 학력 + 공인 영어 성적 · 사립대는 학력 서류 개별 심사(case-by-case)", {
    x: M, y: 6.1, w: CW, h: 0.4, isTextBox: true, margin: 0, align: "center", valign: "middle",
    fontFace: KR, fontSize: 11.5, bold: true, color: NAVY,
  });
  s.addNotes("세 유형 중 사립대가 입학 기회와 진로 유연성에서 가장 유리합니다.");
}

/* ══ 05 · 학비 비교 (차트) ═══════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "04", "TUITION COMPARISON", "한국과 말레이시아 대학 학비 비교", false);
  lede(s, "말레이시아 금액은 학비만 기준입니다. IM 공동체 운영비 · 입학금 · 비자 갱신비는 마지막 예산 슬라이드에서 별도로 합산합니다.", false);

  s.addChart(pres.ChartType.bar, [{
    name: "연간 등록금",
    labels: ["한양대", "한동대", "전남대", "테일러스", "선웨이"],
    values: [900, 800, 500, 1710, 1290],
  }], {
    x: M, y: 2.3, w: 5.9, h: 3.5,
    barDir: "col", barGapWidthPct: 55,
    chartColors: [NAVY2, NAVY2, NAVY2, ORANGE, GOLD],
    showTitle: true, title: "연간 등록금 상한 비교 (만원)", titleFontFace: KR, titleFontSize: 13, titleColor: NAVY,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: "Calibri", dataLabelFontSize: 11, dataLabelColor: "1B2A44",
    showLegend: false,
    catAxisLabelFontFace: KR, catAxisLabelFontSize: 11, catAxisLabelColor: "1B2A44",
    valAxisLabelFontFace: "Calibri", valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
    valGridLine: { color: RULE, size: 0.75 }, catGridLine: { style: "none" },
    valAxisMinVal: 0, valAxisMaxVal: 2000, valAxisMajorUnit: 500,
  });

  const rows = [
    [th("항목"), th("한국 사립"), th("한국 국립"), th("테일러스"), th("선웨이")],
    [rh("등록금(1년)"), "800~900만", "500만", { text: "1,430~1,710만", options: { bold: true, color: ORANGE } }, { text: "910~1,290만", options: { bold: true, color: "8A6400" } }],
    [rh("총 학비(3~4년)"), "3,200~3,600만", "2,000만", "4,530~6,830만", "2,740~5,160만"],
    [rh("입학 조건"), "수시 1~3등급", "수시 1~2등급", "IELTS 6.0급\n개별 심사", "IELTS 6.0급\n개별 심사"],
  ];
  s.addTable(rows, {
    x: 6.78, y: 2.55, w: 5.92, colW: [1.18, 1.24, 0.85, 1.33, 1.32],
    rowH: 0.52, border: { type: "solid", color: RULE, pt: 0.75 },
    fontFace: KR, fontSize: 9.5, color: "1B2A44", valign: "middle", align: "center",
  });

  card(s, 6.78, 5.0, 5.92, 0.85, "FDF0EC", ORANGE);
  s.addText("예산 주의 · 2025년 7월 1일부터 외국인 학생 학비에 6% 서비스세(SST)가 부과됩니다. 위 금액에 약 6%를 더해 산정하십시오.", {
    x: 6.98, y: 5.12, w: 5.52, h: 0.62, isTextBox: true, margin: 0, valign: "middle",
    fontFace: KR, fontSize: 10.5, color: "7A2E12", lineSpacing: 14,
  });
  footnote(s, "환율 1링깃(RM) ≈ 339원 · 2026년 9월 기준 · 단위 만원");
  s.addNotes("말레이시아 사립대 학비는 국내 사립대와 비슷하거나 약간 높습니다. 선웨이가 테일러스보다 연 500만 원가량 저렴합니다.");
}

/* ══ 06 · 테일러스 개요 ══════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "05", "추천 대학 01", "테일러스 대학교 Taylor's University", false);
  lede(s, "1969년 설립된 말레이시아 최상위권 사립대학교입니다. 호텔·관광 분야는 7년 연속 세계 Top 20~30위권을 유지하고 있습니다.", false);

  const kpi = [["#272", "QS 2027 세계 순위"], ["2위", "말레이시아 사립대"], ["#26", "호텔경영 세계 순위"]];
  kpi.forEach((k, i) => {
    const x = M + i * 2.55;
    card(s, x, 2.32, 2.35, 1.2, "FFF3EC", ORANGE);
    s.addText(k[0], { x: x + 0.15, y: 2.45, w: 2.05, h: 0.6, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 30, bold: true, color: ORANGE });
    s.addText(k[1], { x: x + 0.15, y: 3.03, w: 2.05, h: 0.34, isTextBox: true, margin: 0, align: "center", fontFace: KR, fontSize: 10, color: MUTED });
  });
  s.addText("QS 2027 말레이시아 사립대 순서\nUTP #=261  ▸  테일러스 #272  ▸  UCSI #282  ▸  선웨이 #354", {
    x: M, y: 3.66, w: 7.25, h: 0.62, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 10.5, color: MUTED, lineSpacing: 15,
  });

  const rows = [
    [th("구분"), th("내용")],
    [rh("학사 입학 시기"), { text: "2월 · 4월 · 9월", options: { bold: true } }],
    [rh("파운데이션 입학"), { text: "1월 · 3월 · 8월", options: { bold: true } }],
    [rh("학력 조건"), "고교 졸업 또는 검정고시 — 개별 심사(case-by-case). 본과 직행은 보장되지 않음"],
    [rh("공인 영어"), "학사 IELTS 6.0 (= TOEFL iBT 60~78) / 파운데이션 IELTS 5.0~5.5"],
    [rh("직행 가능 계열"), "호텔경영·관광(세계 #26위), 경영학 계열 전체"],
    [rh("파운데이션 필수"), "BEng 공학사(기계·화학 등), BSc 이학사(약학·데이터사이언스 등)"],
    [rh("학제"), "3년제 120학점 내외 (경영·호텔) / 4년제 130~140학점 (공대·약대)"],
  ];
  tbl(s, rows, { y: 4.45, rowH: 0.31, colW: [2.2, 9.89], fontSize: 10.5 });
  s.addNotes("테일러스의 결정적 강점은 호텔·관광 세계 26위입니다. 사립대 1위라는 원문 표현은 사실과 달라 2위로 바로잡았습니다.");
}

/* ══ 07 · 테일러스 학비·학위 ═════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "06", "TAYLOR'S — 학비 및 글로벌 학위", "테일러스 학비와 진학 경로", false);

  s.addText("학비 — 국제학생 기준 (2026)", { x: M, y: 1.68, w: 6, h: 0.32, isTextBox: true, margin: 0, fontFace: KR, fontSize: 14, bold: true, color: NAVY });
  const f = [
    [th("과정"), th("총 학비 (RM)"), th("원화 환산"), th("연간")],
    [rh("파운데이션 1년"), { text: "44,044", options: { bold: true } }, { text: "약 1,490만", options: { bold: true } }, "동일"],
    [rh("학사 전체 범위"), "95,066~446,690", "3,220만~1억 5,140만", "전공별"],
    [rh("국제호텔경영 3년"), { text: "133,146", options: { bold: true } }, "약 4,510만", "약 1,500만"],
    [rh("기계공학 4년"), "연 50,184", "약 6,810만", "약 1,700만"],
    [rh("화학공학 4년"), "연 42,240", "약 5,730만", "약 1,430만"],
  ];
  s.addTable(f, {
    x: M, y: 2.08, w: 6.1, colW: [1.58, 1.42, 2.0, 1.1], rowH: 0.42,
    border: { type: "solid", color: RULE, pt: 0.75 }, fontFace: KR, fontSize: 10, color: "1B2A44", valign: "middle",
  });
  s.addText("6% SST 별도 · 학사 상단값(RM 446,690)은 의약 계열", { x: M, y: 4.8, w: 6.1, h: 0.26, isTextBox: true, margin: 0, fontFace: KR, fontSize: 9.5, color: MUTED, italic: true });
  card(s, M, 5.12, 6.1, 1.42, "FDF0EC", ORANGE);
  s.addText("파운데이션 학비 주의", { x: M + 0.22, y: 5.22, w: 5.7, h: 0.28, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11.5, bold: true, color: "A63C13" });
  s.addText("유학 정보 사이트의 \"RM 28,600~68,590\"은 파운데이션이 아니라 국제 프리유니버시티(A Level · SACE, 18~24개월)를 합친 범위입니다.\n테일러스에는 의대 파운데이션이 따로 없고 의학·약학도 FIS로 진학하므로 전공별 편차가 크지 않습니다.", { x: M + 0.22, y: 5.5, w: 5.7, h: 0.96, isTextBox: true, margin: 0, fontFace: KR, fontSize: 9.5, color: "7A2E12", lineSpacing: 13 });

  s.addText("글로벌 학위 · 편입 경로", { x: 7.05, y: 1.68, w: 6, h: 0.32, isTextBox: true, margin: 0, fontFace: KR, fontSize: 14, bold: true, color: NAVY });

  card(s, 7.05, 2.08, 5.66, 1.55, "EAF3EC", OK);
  s.addText("복수 학위 (검증됨)", { x: 7.27, y: 2.2, w: 5.2, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12, bold: true, color: OK });
  s.addText("· 경영 : UWE Bristol (영국), QUT (호주)\n· 호텔·관광 : Université Toulouse–Jean Jaurès (UT2J, 프랑스), Académie de Toulouse", {
    x: 7.27, y: 2.54, w: 5.22, h: 1.0, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "1B2A44", lineSpacing: 15,
  });

  card(s, 7.05, 3.78, 5.66, 1.32, "FDF0EC", ORANGE);
  s.addText("미국 학점 이전 (ADTP) — 주의", { x: 7.27, y: 3.9, w: 5.2, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12, bold: true, color: "A63C13" });
  s.addText("1~2년 수학 후 미국·캐나다·호주 대학으로 편입하는 학점 이전 경로입니다.\n편입 대학은 매년 개별 지원·경쟁 심사이며 합격은 보장되지 않습니다.", {
    x: 7.27, y: 4.22, w: 5.22, h: 0.8, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "7A2E12", lineSpacing: 15,
  });

  card(s, 7.05, 5.25, 5.66, 1.0, PAPER);
  s.addText("졸업 후 진로", { x: 7.27, y: 5.35, w: 5.2, h: 0.28, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11, bold: true, color: NAVY });
  s.addText("글로벌 체인 호텔 매니저, 관광·MICE, 이벤트 디렉터 / 말레이시아·싱가포르 다국적 기업", {
    x: 7.27, y: 5.63, w: 5.22, h: 0.52, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: MUTED, lineSpacing: 14,
  });
  s.addNotes("학비는 호텔경영 3년 기준 총 4,510만 원 수준입니다. 미국 편입 경로는 합격 보장이 아니라는 점을 반드시 안내해야 합니다.");
}

/* ══ 08 · 선웨이 개요 ═══════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "07", "추천 대학 02", "선웨이 대학교 Sunway University", false, GOLD);
  lede(s, "1987년 설립, Jeffrey Cheah 재단이 지원하는 사립대학교입니다. 90개국 이상의 다국적 학생이 재학 중입니다.", false);

  const kpi = [["#354", "QS 2027 세계 순위"], ["+50", "전년 대비 상승 계단"], ["$0", "랭커스터 복수학위 추가비"]];
  kpi.forEach((k, i) => {
    const x = M + i * 2.55;
    card(s, x, 2.32, 2.35, 1.2, "FEF6E2", GOLD);
    s.addText(k[0], { x: x + 0.15, y: 2.45, w: 2.05, h: 0.6, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 30, bold: true, color: "8A6400" });
    s.addText(k[1], { x: x + 0.15, y: 3.03, w: 2.05, h: 0.34, isTextBox: true, margin: 0, align: "center", fontFace: KR, fontSize: 10, color: MUTED });
  });
  s.addText("혼동 주의 · 선웨이 홈페이지의 \"Top 303\"은 QS가 아니라 THE 2026 기준입니다.\nQS 2027 기준 순위는 공동 #354위입니다.", {
    x: M, y: 3.66, w: 7.25, h: 0.62, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 10.5, color: MUTED, lineSpacing: 15,
  });

  const rows = [
    [th("구분"), th("내용")],
    [rh("학사 입학 시기"), { text: "1월 · 4월 · 9월", options: { bold: true } }],
    [rh("파운데이션 입학"), { text: "1월 · 4월 · 8월", options: { bold: true } }],
    [rh("학력 조건"), "고교 졸업 또는 검정고시 — 개별 심사. 에세이·서류 심사가 엄격"],
    [rh("공인 영어"), "학사 IELTS 6.0 (= TOEFL iBT 60 이상) / 파운데이션·디플로마 IELTS 5.0~5.5"],
    [rh("직행 가능 계열"), "BA 인문사회과학 전반, BSc 경영학 · 호텔경영학"],
    [rh("파운데이션 필수"), "BEng 공학사(전자·화학 등), BSc 컴퓨터공학 · 바이오메디컬 · 순수과학"],
    [rh("학제"), "3년제 120학점 내외 (영국식) / 4년제 130~140학점 (캡스톤 포함)"],
  ];
  tbl(s, rows, { y: 4.45, rowH: 0.31, colW: [2.2, 9.89], fontSize: 10.5 });
  s.addNotes("선웨이는 학비 가성비와 랭커스터 복수 학위가 핵심입니다. QS 354위와 THE 303위를 혼동하지 않도록 주의하십시오.");
}

/* ══ 09 · 선웨이 학비·학위 ══════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "08", "SUNWAY — 학비 및 글로벌 학위", "선웨이 학비와 진학 경로", false, GOLD);

  s.addText("학비 — 국제학생 기준 (2026)", { x: M, y: 1.68, w: 6, h: 0.32, isTextBox: true, margin: 0, fontFace: KR, fontSize: 14, bold: true, color: NAVY });
  const f = [
    [th("과정"), th("총 학비"), th("원화 환산")],
    [rh("파운데이션 1년"), "RM 17,850~29,350", { text: "약 610만~990만 원", options: { bold: true } }],
    [rh("학사 경영계열(연)"), "USD 6,820~9,091", { text: "약 910만~1,290만 원", options: { bold: true } }],
    [rh("학사 전체 범위"), "RM 15,475~500,845", "자격증·디플로마·의학 포함"],
  ];
  s.addTable(f, {
    x: M, y: 2.08, w: 6.1, colW: [1.85, 1.95, 2.3], rowH: 0.46,
    border: { type: "solid", color: RULE, pt: 0.75 }, fontFace: KR, fontSize: 10, color: "1B2A44", valign: "middle",
  });
  card(s, M, 4.05, 6.1, 1.05, "FEF6E2", GOLD);
  s.addText("신입 국제학생은 RM 18,000 또는 1학기분 중 큰 금액을 선납해야 합니다.\n6% 서비스세(SST)는 별도입니다.", {
    x: M + 0.22, y: 4.18, w: 5.7, h: 0.8, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "6B4E06", lineSpacing: 15,
  });

  s.addText("글로벌 학위 · 편입 경로", { x: 7.05, y: 1.68, w: 6, h: 0.32, isTextBox: true, margin: 0, fontFace: KR, fontSize: 14, bold: true, color: NAVY });

  card(s, 7.05, 2.08, 5.66, 1.72, "EAF3EC", OK);
  s.addText("복수 학위 — 랭커스터 대학교 (검증됨)", { x: 7.27, y: 2.2, w: 5.2, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12, bold: true, color: OK });
  s.addText("졸업 시 선웨이·랭커스터 2개 학위증 발급, 양교 동문 자격.\n추가 비용 없음 — 기본 등록금에 포함.\n단, 랭커스터 협력 프로그램(경영·컴퓨팅·심리 등)에 한합니다.", {
    x: 7.27, y: 2.54, w: 5.22, h: 1.14, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "1B2A44", lineSpacing: 15,
  });

  card(s, 7.05, 3.95, 5.66, 1.05, "EAF3EC", OK);
  s.addText("미국 공식 파트너십 — ASU (검증됨)", { x: 7.27, y: 4.05, w: 5.2, h: 0.28, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11.5, bold: true, color: OK });
  s.addText("애리조나주립대 Cintana Alliance 파트너 · 20개 이상 패스웨이 · 최대 90학점 이전", {
    x: 7.27, y: 4.33, w: 5.22, h: 0.56, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "1B2A44", lineSpacing: 14,
  });

  card(s, 7.05, 5.15, 5.66, 1.1, "FDF0EC", ORANGE);
  s.addText("ADTP 편입 대학 — 주의", { x: 7.27, y: 5.25, w: 5.2, h: 0.28, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11.5, bold: true, color: "A63C13" });
  s.addText("코넬 · NYU 등은 선배 편입 실적이며, 공식 연계나 합격 보장이 아닙니다.", {
    x: 7.27, y: 5.53, w: 5.22, h: 0.56, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "7A2E12", lineSpacing: 14,
  });
  s.addNotes("선웨이의 랭커스터 복수 학위와 ASU 파트너십은 공식 자료로 확인됩니다. 반면 코넬·NYU 연계는 과장된 표현입니다.");
}

/* ══ 10 · 두 대학 비교 (다크) ═══════════════════════════════════ */
{
  const s = slide(true);
  head(s, "09", "HEAD TO HEAD", "두 대학 한눈에 비교", true);
  lede(s, "학비만 보면 선웨이가 연 500만~600만 원 저렴합니다. 다만 결정 기준은 비용이 아니라 전공이어야 합니다.", true);

  const rows = [
    [
      { text: "비교 항목", options: { bold: true, color: MUTED_D, fill: { color: NAVY3 }, fontSize: 11 } },
      { text: "테일러스 Taylor's", options: { bold: true, color: ORANGE, fill: { color: NAVY3 }, fontSize: 12 } },
      { text: "선웨이 Sunway", options: { bold: true, color: GOLD, fill: { color: NAVY3 }, fontSize: 12 } },
    ],
    ["QS 2027 세계 랭킹", { text: "#272", options: { bold: true } }, "#=354"],
    ["말레이시아 사립대 순위", "2위", "4위"],
    ["학사 입학 시기", "2월 · 4월 · 9월", "1월 · 4월 · 9월"],
    ["파운데이션 입학 시기", "1월 · 3월 · 8월", "1월 · 4월 · 8월"],
    ["간판 전공", { text: "호텔·관광 (세계 #26위)", options: { bold: true } }, "경영·금융, 컴퓨팅"],
    ["복수 학위 파트너", "UWE Bristol · QUT · UT2J", { text: "랭커스터 (추가비용 $0)", options: { bold: true } }],
    ["미국 공식 파트너", "ADTP 학점 이전 중심", { text: "ASU (Cintana Alliance)", options: { bold: true } }],
    ["연간 학비 (학사)", "약 1,430만~1,710만 원", "약 910만~1,290만 원"],
    ["파운데이션 학비 (1년 총액)", "약 1,490만 원", { text: "약 610만~990만 원", options: { bold: true } }],
  ];
  s.addTable(rows, {
    x: M, y: 2.3, w: CW, colW: [3.4, 4.35, 4.34], rowH: 0.36,
    border: { type: "solid", color: "2C4E86", pt: 0.75 },
    fontFace: KR, fontSize: 11, color: WHITE, fill: { color: NAVY }, valign: "middle",
  });

  card(s, M, 6.15, 6.0, 0.72, NAVY3, ORANGE);
  s.addText("호텔·관광 지망이면 테일러스가 1순위", { x: M + 0.2, y: 6.15, w: 5.6, h: 0.72, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 13, bold: true, color: WHITE });
  card(s, 6.72, 6.15, 6.0, 0.72, NAVY3, GOLD);
  s.addText("학비 가성비 + 영국 학위가 목표면 선웨이가 1순위", { x: 6.92, y: 6.15, w: 5.6, h: 0.72, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 13, bold: true, color: WHITE });
  s.addNotes("두 대학 중 어디를 택할지는 전공으로 먼저 결정하십시오. 호텔·관광이면 테일러스, 금융·컴퓨팅이면 선웨이입니다.");
}

/* ══ 11 · 복수 학위 용어 정리 ═══════════════════════════════════ */
{
  const s = slide(false);
  head(s, "10", "TERMINOLOGY", "복수 학위 용어 바로잡기", false);
  lede(s, "\"듀얼 어워드(Dual Award)\"와 \"듀얼 디그리(Dual Degree)\"는 사실상 같은 것을 가리킵니다. 구분해야 할 것은 \"공동 학위(Joint Degree)\"입니다.", false);

  const types = [
    ["Dual Award\n복수 학위(인증)", "2장", "각 대학이 학위증을 1장씩 수여.\nAward는 학위·디플로마·수료증을\n모두 포괄하는 상위 개념", "테일러스 + UWE Bristol\n테일러스 + UT2J", OK, true],
    ["Dual Degree\n복수 학위(학위)", "2장", "각 대학이 학위증을 1장씩 수여.\n대상을 학위(degree)로 한정한\n표현으로, 실질은 Dual Award와 동일", "선웨이 + 랭커스터", OK, true],
    ["Joint Degree\n공동 학위", "1장", "학위증 1장에 두 대학 명의가\n함께 기재되는 방식.\n완전히 다른 제도", "해당 사례 없음", BAD, false],
  ];
  types.forEach((t, i) => {
    const x = M + i * 4.13, w = 3.85;
    card(s, x, 2.35, w, 3.35, t[5] ? "EAF3EC" : "FBECEA", t[4]);
    s.addText(t[0], { x: x + 0.25, y: 2.5, w: w - 0.5, h: 0.66, isTextBox: true, margin: 0, fontFace: KR, fontSize: 14, bold: true, color: NAVY, lineSpacing: 19 });
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.25, y: 3.26, w: 1.5, h: 0.4, rectRadius: 0.2, fill: { color: t[4] } });
    s.addText("학위증 " + t[1], { x: x + 0.25, y: 3.26, w: 1.5, h: 0.4, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: KR, fontSize: 11, bold: true, color: WHITE });
    s.addText(t[2], { x: x + 0.25, y: 3.8, w: w - 0.5, h: 1.05, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "1B2A44", lineSpacing: 15 });
    s.addText("사례", { x: x + 0.25, y: 4.95, w: w - 0.5, h: 0.22, isTextBox: true, margin: 0, fontFace: KR, fontSize: 9, bold: true, color: MUTED, charSpacing: 1 });
    s.addText(t[3], { x: x + 0.25, y: 5.17, w: w - 0.5, h: 0.45, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, bold: true, color: t[5] ? OK : BAD, lineSpacing: 14 });
  });

  card(s, M, 5.92, CW, 0.9, "FDF0EC", ORANGE);
  s.addText("발표 권고 · 원본 PDF는 \"듀얼디그리 / 공동 학위\"를 나란히 적었으나, 선웨이–랭커스터는 학위증 2장이므로 공동 학위가 아닙니다.\n슬라이드에는 \"복수 학위(Dual Award / Dual Degree)\"로 병기하고 \"공동 학위\"는 삭제하십시오.", {
    x: M + 0.22, y: 6.02, w: CW - 0.44, h: 0.7, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 11, color: "7A2E12", lineSpacing: 15,
  });
  s.addNotes("어워드와 디그리는 같은 뜻입니다. Award가 더 넓은 개념이라 테일러스처럼 디플로마 복수 인증이 있는 곳이 이 표현을 씁니다. 공동 학위는 학위증이 한 장인 전혀 다른 제도입니다.");
}

/* ══ 12 · 지원 자격 ═════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "11", "ELIGIBILITY", "IM 말레이시아 지원 자격", false);
  lede(s, "아래 네 가지 조건이 모두 준비된 학생만 지원 가능합니다.", false);

  const q = [
    ["리뉴젠 공동체 1년 이상 훈련자", "각 공동체 디렉터 추천서 제출"],
    ["고등과정 학력 이수자", "인가 고교 12학년 졸업 : 내신 평균 70점 이상\n고졸 검정고시 : 평균 70~80점 이상"],
    ["영어 공인 점수 취득자", "IELTS 5.5~6.0 이상 또는 TOEFL iBT 60점 이상\n본과 직행 목표 시 IELTS 6.0 / TOEFL iBT 70대 권장"],
    ["필아메리카존 코스 수료자", "필리핀 IM해외선교본부 과정"],
  ];
  q.forEach((t, i) => {
    const y = 2.35 + i * 1.03;
    card(s, M, y, CW, 0.88, i === 2 ? "FDF0EC" : PAPER, i === 2 ? ORANGE : RULE);
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.28, y: y + 0.19, w: 0.5, h: 0.5, fill: { color: i === 2 ? ORANGE : NAVY } });
    s.addText(String(i + 1), { x: M + 0.28, y: y + 0.19, w: 0.5, h: 0.5, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 16, bold: true, color: WHITE });
    s.addText(t[0], { x: M + 1.0, y: y + 0.13, w: 4.0, h: 0.62, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 14, bold: true, color: NAVY });
    s.addText(t[1], { x: M + 5.1, y: y + 0.13, w: 6.85, h: 0.62, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 11, color: i === 2 ? "7A2E12" : MUTED, lineSpacing: 15 });
  });
  footnote(s, "3번 항목 주의 · TOEFL iBT 60점은 IELTS 6.0의 하한선이므로 전공에 따라 미달될 수 있습니다. 본과 직행을 노린다면 70점대를 목표로 하십시오.");
  s.addNotes("영어 점수가 가장 큰 변수입니다. TOEFL 60점은 본과 직행 최저선이라 여유를 두는 편이 안전합니다.");
}

/* ══ 13 · 입학 절차 ════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "12", "ADMISSION PROCESS", "입학 절차 6단계", false);
  lede(s, "4단계 원서 접수 시점이 전체 일정을 좌우합니다. 개강 8주 전 마감이 원칙이며, 국제학생은 12~16주 전 접수를 권장합니다.", false);

  const steps = [
    ["STEP 1", "디렉터 상담 후 입학 시기 결정", "학생 개인의 학력 조건에 맞추어 지망 학교와 학과를 설정합니다."],
    ["STEP 2", "필아메리카존 유학 과정", "필리핀 IM해외선교본부 과정을 통해 유학과 어학을 준비합니다."],
    ["STEP 3", "IM말레이시아 입학 신청", "IM말레이시아에 필요한 서류를 준비하여 신청합니다."],
    ["STEP 4", "유학 서류 준비 및 원서 접수", "개강 최소 8주 전 접수. 국제학생은 12~16주 전 권장."],
    ["STEP 5", "입학허가서(Offer Letter) 수령", "사립대 기준 1~2주 심사 후 발송. 수락 서명 후 재제출합니다."],
    ["STEP 6", "비자 신청 및 입국비자 진행", "학교가 EMGS를 통해 학생 비자를 신청·대행합니다."],
  ];
  steps.forEach((t, i) => {
    const x = M + (i % 3) * 4.13, y = 2.35 + Math.floor(i / 3) * 1.95, w = 3.85;
    const hot = i === 3;
    card(s, x, y, w, 1.72, hot ? "FDF0EC" : PAPER, hot ? ORANGE : RULE);
    s.addText(t[0], { x: x + 0.28, y: y + 0.18, w: 2.0, h: 0.26, isTextBox: true, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, charSpacing: 1.5, color: hot ? ORANGE : NAVY2 });
    s.addText(t[1], { x: x + 0.28, y: y + 0.5, w: w - 0.56, h: 0.55, isTextBox: true, margin: 0, fontFace: KR, fontSize: 13, bold: true, color: NAVY, lineSpacing: 17 });
    s.addText(t[2], { x: x + 0.28, y: y + 1.05, w: w - 0.56, h: 0.58, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10, color: hot ? "7A2E12" : MUTED, lineSpacing: 13 });
  });
  s.addNotes("가장 흔한 실수가 원서를 늦게 내는 것입니다. 4단계에서 12~16주 전 접수를 못 맞추면 다음 인테이크로 밀립니다.");
}

/* ══ 14 · 비자 절차 ════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "13", "STUDENT VISA", "비자 발급 절차와 리드타임", false);

  const v = [
    ["1", "입학허가서 수령 및 서명 후 제출", ""],
    ["2", "학교가 서포팅레터 첨부 후 EMGS 비자신청서 제출 및 비용 납부", ""],
    ["3", "EMGS 비자 서류 심사", "2~4주"],
    ["4", "이민국 최종 승인 여부 결정", ""],
    ["5", "이민국 승인 후 비자허가서(VAL) 발급", "합계 4~8주"],
    ["6", "항공권 구매 후 입국 비자(SEV 혹은 eVisa) 신청", ""],
    ["7", "입국 비자 승인 후 입국", ""],
    ["8", "입국 후 1주일 이내 현지 신체검사 진행 후 여권 제출", ""],
    ["9", "비자 스티커가 붙은 여권 수령", "제출 후 2~4주"],
  ];
  v.forEach((t, i) => {
    const y = 1.72 + i * 0.42;
    s.addShape(pres.ShapeType.rect, { x: M, y: y + 0.04, w: 0.34, h: 0.28, fill: { color: t[2] ? ORANGE : NAVY2 } });
    s.addText(t[0], { x: M, y: y + 0.04, w: 0.34, h: 0.28, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 11, bold: true, color: WHITE });
    s.addText(t[1], { x: M + 0.5, y, w: 5.4, h: 0.36, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 11.5, color: "1B2A44" });
    if (t[2]) s.addText(t[2], { x: M + 5.62, y, w: 1.9, h: 0.36, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 10.5, bold: true, color: ORANGE });
  });

  card(s, 8.35, 1.72, 4.36, 1.55, "EAF3EC", OK);
  s.addText("행정 리드타임 결론", { x: 8.57, y: 1.84, w: 3.92, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12.5, bold: true, color: OK });
  s.addText("전체 비자 절차에 4~8주가 소요되므로,\n입학 예정일 3~4개월 전에 VAL 신청을\n시작해야 안전합니다.", {
    x: 8.57, y: 2.2, w: 3.92, h: 0.95, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11, color: "1B2A44", lineSpacing: 16,
  });

  card(s, 8.35, 3.42, 4.36, 2.1, "FBECEA", BAD);
  s.addText("서류 인증 방식 주의", { x: 8.57, y: 3.54, w: 3.92, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12.5, bold: true, color: BAD });
  s.addText("말레이시아는 헤이그 아포스티유 협약\n비가입국입니다.\n\n한국 발급 검정고시 합격증명서·성적증명서는\n아포스티유가 아니라 영사확인(외교부 →\n주한 말레이시아 대사관)을 밟아야 합니다.", {
    x: 8.57, y: 3.88, w: 3.92, h: 1.5, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: "6E241D", lineSpacing: 15,
  });

  card(s, 8.35, 5.67, 4.36, 1.02, PAPER);
  s.addText("한국 대학 편입 시에도 말레이시아 대학 서류는\n주말레이시아 한국대사관 영사확인이 필요합니다.", {
    x: 8.57, y: 5.79, w: 3.92, h: 0.8, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10.5, color: MUTED, lineSpacing: 15,
  });
  s.addNotes("아포스티유는 말레이시아에 통하지 않습니다. 영사확인으로 진행해야 하며, 이 절차에만 2~3주가 더 듭니다.");
}

/* ══ 15 · A플랜 타임라인 ═══════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "14", "TIMELINE A", "A플랜 · 2027년 1~2월 입학", false);
  lede(s, "선웨이 1월 / 테일러스 2월 인테이크 기준. 가장 여유 있는 최적 진입 시기입니다.", false);

  const rows = [
    [th("시기"), th("주요 활동 및 행정 절차"), th("체크포인트")],
    [rh("2026.02"), "고졸 검정고시 제1회 원서 접수", "시·도 교육청 공고 확인"],
    [rh("2026.04"), "검정고시 제1회 응시 (평균 80점 이상 목표)", "시험일 4월 초·중순"],
    [rh("2026.05 중순"), { text: "합격자 발표 → 영문 합격증명서·성적증명서 발급", options: { bold: true } }, "발표 후 영사확인 절차 착수"],
    [rh("2026.05 하순\n~ 11 초"), "필리핀 IM해외선교본부 6개월 과정", "영어 몰입 훈련"],
    [rh("2026.09"), "IELTS / TOEFL 1차 응시", "미달 시 10월 재응시 (성적 유효 2년)"],
    [rh("2026.10"), { text: "대학 원서 접수 (선웨이 1월 / 테일러스 2월)", options: { bold: true, color: ORANGE } }, "개강 12~16주 전"],
    [rh("2026.10~11"), "EMGS 비자 신청 및 심사", { text: "4~8주 소요", options: { bold: true } }],
    [rh("2026.12"), "Offer Letter · VAL 수령 → eVisa 신청, 항공권 예약", "출국 최종 점검"],
    [
      { text: "2027.01 / 02", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
      { text: "선웨이(1월) · 테일러스(2월) 정식 입학", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
      { text: "가장 여유 있는 최적 진입 시기", options: { bold: true, color: GOLD, fill: { color: NAVY } } },
    ],
  ];
  tbl(s, rows, { y: 2.3, rowH: 0.43, colW: [1.85, 6.4, 3.84], fontSize: 11 });
  s.addNotes("A플랜의 핵심은 2026년 10월 원서 접수입니다. 원안은 10~11월이었지만 비자 심사를 감안해 10월로 앞당겼습니다.");
}

/* ══ 16 · B·C플랜 ═════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "15", "TIMELINE B · C", "B플랜 · C플랜", false);

  s.addText("B플랜 · 2027년 4월 입학 (선웨이 · 테일러스 공통)", { x: M, y: 1.7, w: 8, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 14, bold: true, color: NAVY });
  const rows = [
    [th("시기"), th("주요 활동 및 행정 절차"), th("체크포인트")],
    [rh("2026.06"), "고졸 검정고시 제2회 원서 접수", "—"],
    [rh("2026.08.11"), "검정고시 제2회 응시", "08.28 합격자 발표"],
    [rh("2026.09"), "영문 증명서 발급 + 영사확인", "서류 준비 병행"],
    [rh("2026.09 ~ 2027.02"), "필리핀 IM해외선교본부 6개월 과정", "—"],
    [rh("2026.11~12"), { text: "IELTS / TOEFL 응시 — 과정 중반에 확보 필수", options: { bold: true } }, { text: "B플랜 최대 리스크 구간", options: { bold: true, color: BAD } }],
    [rh("2026.12 ~ 2027.01"), { text: "대학 원서 접수 (4월 인테이크)", options: { bold: true, color: ORANGE } }, { text: "원안의 \"2~3월 접수\"는 비자 리드타임상 불가", options: { color: BAD } }],
    [rh("2027.01~02"), "EMGS 비자 심사", "4~8주"],
    [rh("2027.03"), "VAL 수령, eVisa 신청, 항공권 예약", "—"],
    [
      { text: "2027.04", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
      { text: "선웨이 · 테일러스 4월 인테이크 정식 입학", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
      { text: "한국 학제 졸업 후 가장 빠른 입학", options: { bold: true, color: GOLD, fill: { color: NAVY } } },
    ],
  ];
  tbl(s, rows, { y: 2.0, rowH: 0.35, colW: [1.98, 6.27, 3.84], fontSize: 10 });

  card(s, M, 5.95, CW, 1.12, "FEF6E2", GOLD);
  s.addText("C플랜 (예비) · 2027년 8~9월 입학 — 가장 안전한 대안", { x: M + 0.22, y: 6.03, w: CW - 0.44, h: 0.3, isTextBox: true, margin: 0, fontFace: KR, fontSize: 12.5, bold: true, color: "6B4E06" });
  s.addText("B플랜은 어학 성적을 필리핀 과정 6개월 중 3개월차에 확보해야 하는 부담이 있습니다. 목표 점수 미달 시 8월(선웨이 파운데이션) / 9월(선웨이·테일러스 학사)로 이월하십시오.\n검정고시 2회(8월) → 필리핀 과정 완주(익년 2월) → 어학 재응시(3~4월) → 원서 접수(5월) → 비자(6~7월) → 8~9월 입학. 전 구간에 1개월 이상 여유가 확보됩니다.", {
    x: M + 0.22, y: 6.33, w: CW - 0.44, h: 0.68, isTextBox: true, margin: 0, fontFace: KR, fontSize: 10, color: "6B4E06", lineSpacing: 13,
  });
  s.addNotes("B플랜은 어학 확보 기간이 짧은 것이 최대 약점입니다. 무리하지 말고 C플랜을 예비로 준비해 두십시오.");
}

/* ══ 17 · 팩트체크 ════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "16", "FACT CHECK", "팩트체크 — 반드시 고쳐야 할 항목", false);
  lede(s, "제시된 원문 표 18개 항목을 공개 자료로 검증했습니다. 아래는 발표 자리에서 반박당할 위험이 큰 상위 7건입니다.", false);

  const stat = [["4", "사실", OK], ["5", "부분 정확 · 보완", WARN], ["9", "수정 필요", BAD]];
  stat.forEach((t, i) => {
    const x = M + i * 2.25;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.28, w: 2.1, h: 0.5, rectRadius: 0.1, fill: { color: t[2] } });
    s.addText(t[0] + "건 · " + t[1], { x, y: 2.28, w: 2.1, h: 0.5, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: KR, fontSize: 11.5, bold: true, color: WHITE });
  });

  const V = (k) => ({ text: k === 1 ? "수정" : k === 2 ? "보완" : "사실", options: { bold: true, color: WHITE, fill: { color: k === 1 ? BAD : k === 2 ? WARN : OK }, align: "center", fontSize: 10 } });
  const rows = [
    [th("원문 내용"), th("판정"), th("검증 결과 및 수정")],
    ["검정고시 80점이면 파운데이션 없이 본과 직행", V(1), "보장 불가. 말레이시아 사립대는 원칙적으로 Pre-U 자격을 요구하며 한국 고교 학력은 개별 심사. 공대·약대·컴공은 파운데이션 사실상 필수"],
    ["B플랜 2~3월 원서 접수 → 4월 입학", V(1), "일정 불가. 원서 마감 개강 8주 전 + EMGS 비자 4~8주 → 전년 12월~1월 초 접수로 수정"],
    ["코넬 · 존스홉킨스 · NYU 등 \"공식 연계\"", V(1), "과장. ADP/ADTP는 학점 이전 경로이며 대부분 선배 편입 실적. 검증된 공식 파트너십은 선웨이–ASU뿐"],
    ["한동대 \"4학기 수료 시 100% 공인 인정\"", V(1), "과장. 국외대학은 4개 학기 수료 또는 졸업이수학점의 2/4(4년제)·2/3(3년제) 이상 필요. 지원 자격일 뿐 합격 보장 아님"],
    ["테일러스 \"말레이시아 사립대 1위\"", V(1), "2위로 수정. UTP #=261 > 테일러스 #272 > UCSI #282 > 선웨이 #354"],
    ["테일러스 듀얼학위 \"영국 서식스대\"", V(1), "서식스대는 근거 없음. 실제는 UWE Bristol · QUT(경영), UT2J(호텔·관광)"],
    ["예산 — IM 입학금 · 비자 갱신비 누락", V(1), "IM 입학금 500만 원(1회), 학생비자 매년 갱신 약 US$1,000, 6% 서비스세 합산 필요"],
  ];
  tbl(s, rows, { y: 2.96, rowH: 0.46, colW: [3.5, 0.9, 7.69], fontSize: 10.5 });
  footnote(s, "나머지 11개 항목(입학 시기 · 영어 조건 · 생활비 · 환율 · 검정고시 일정 등)의 전체 검증표는 배포 문서 10장에 수록");
  s.addNotes("이 슬라이드가 이번 개정의 핵심입니다. 특히 1~4번은 학부모 설명회에서 그대로 쓰면 신뢰를 잃을 수 있는 표현입니다.");
}

/* ══ 18 · 비용 ════════════════════════════════════════════════ */
{
  const s = slide(false);
  head(s, "17", "BUDGET", "졸업까지 총 예산 — 수정판", false);
  lede(s, "누락돼 있던 IM 입학금 · 비자 갱신비 · 6% 서비스세 · 점심/용돈을 모두 반영한 금액입니다.", false);

  s.addChart(pres.ChartType.bar, [{
    name: "졸업까지 총 예산",
    labels: ["테일러스 3년제", "선웨이 3년제", "4년제 공학\n(파운데이션 포함)"],
    values: [11150, 10190, 19350],
  }], {
    x: M, y: 2.3, w: 5.5, h: 3.3,
    barDir: "col", barGapWidthPct: 70,
    chartColors: [ORANGE, GOLD, NAVY2],
    showTitle: true, title: "졸업까지 총 예산 상한 (만원)", titleFontFace: KR, titleFontSize: 12.5, titleColor: NAVY,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: "Calibri", dataLabelFontSize: 11, dataLabelColor: "1B2A44",
    showLegend: false,
    catAxisLabelFontFace: KR, catAxisLabelFontSize: 10, catAxisLabelColor: "1B2A44",
    valAxisLabelFontFace: "Calibri", valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
    valGridLine: { color: RULE, size: 0.75 }, catGridLine: { style: "none" },
    valAxisMinVal: 0, valAxisMaxVal: 22000, valAxisMajorUnit: 5000,
  });

  const rows = [
    [th("항목"), th("테일러스 3년"), th("선웨이 3년"), th("공학 5년")],
    [rh("연간 학비"), "약 1,500만", "910~1,290만", "1,430~1,710만"],
    [rh("6% 서비스세"), "약 90만", "55~77만", "86~103만"],
    [rh("학생비자 갱신"), "약 140만", "약 140만", "약 140만"],
    [rh("IM 공동체 운영비"), "1,440만", "1,440만", "1,440만"],
    [rh("점심·교통·용돈"), "260~380만", "260~380만", "260~380만"],
    [rh("연간 소계"), { text: "3,430~3,550만", options: { bold: true } }, { text: "2,810~3,230만", options: { bold: true } }, { text: "3,360~3,770만", options: { bold: true } }],
    [rh("수학 기간"), "3년", "3년", { text: "파운데이션 1년 + 본과 4년", options: { bold: true, color: BAD } }],
    [
      { text: "졸업까지 총액", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
      { text: "1억 790만~\n1억 1,150만", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
      { text: "8,930만~\n1억 190만", options: { bold: true, color: GOLD, fill: { color: NAVY } } },
      { text: "1억 7,300만~\n1억 9,350만", options: { bold: true, color: WHITE, fill: { color: NAVY } } },
    ],
  ];
  s.addTable(rows, {
    x: 6.45, y: 2.3, w: 6.27, colW: [1.62, 1.55, 1.55, 1.55], rowH: 0.37,
    border: { type: "solid", color: RULE, pt: 0.75 },
    fontFace: KR, fontSize: 10, color: "1B2A44", valign: "middle", align: "center",
  });
  s.addText("원안 대비 총액이 1,700만~2,000만 원 증가합니다. 공대·약대는 파운데이션 1년이 선행하므로 실제 소요는 5년입니다.", {
    x: 6.45, y: 5.95, w: 6.27, h: 0.6, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 11, bold: true, color: BAD, lineSpacing: 15,
  });
  footnote(s, "환율 1링깃(RM) ≈ 339원 · IM 입학금 500만 원(1회성) 포함 · 단위 만원");
  s.addNotes("예산은 원안보다 1,700만에서 2,000만 원 늘어납니다. 특히 공대 지망자는 5년 예산을 잡아야 합니다.");
}

/* ══ 19 · 결론 (다크) ═════════════════════════════════════════ */
{
  const s = slide(true);
  s.addShape(pres.ShapeType.star5, { x: 11.75, y: 5.55, w: 1.0, h: 1.0, fill: { color: GOLD }, line: { color: GOLD } });

  s.addText("결론 및 다음 단계", {
    x: M, y: 0.85, w: 9, h: 0.75, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 36, bold: true, color: WHITE,
  });
  s.addText("CONCLUSION", {
    x: M, y: 0.48, w: 6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: "Calibri", fontSize: 11, bold: true, charSpacing: 2.2, color: GOLD,
  });

  const c = [
    ["전공으로 먼저 결정하십시오", "호텔·관광이면 테일러스(세계 #26위), 금융·컴퓨팅이면 선웨이(랭커스터 복수 학위 · 학비 연 500만 원 저렴). 비용 차이는 선택 기준이 아닙니다.", ORANGE],
    ["A플랜을 기본값으로 삼으십시오", "2026년 4월 검정고시 → 5월 발표 → 10월 원서 접수 → 2027년 1~2월 입학. B플랜 4월 입학은 어학 확보 기간이 3개월뿐이라 C플랜(8~9월)을 예비로 준비하십시오.", GOLD],
    ["보장할 수 없는 표현을 삭제하십시오", "\"본과 직행 가능\" \"미국 명문대 공식 연계\" \"한동대 100% 인정\" 세 표현은 근거가 없습니다. 설명회에서 그대로 쓰면 신뢰를 잃습니다.", "FF7A5C"],
  ];
  c.forEach((t, i) => {
    const y = 2.0 + i * 1.5;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 11.6, h: 1.28, rectRadius: 0.05, fill: { color: NAVY3 }, line: { color: "2C4E86", width: 1 } });
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.32, y: y + 0.36, w: 0.56, h: 0.56, fill: { color: t[2] } });
    s.addText(String(i + 1), { x: M + 0.32, y: y + 0.36, w: 0.56, h: 0.56, isTextBox: true, margin: 0, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 18, bold: true, color: t[2] === GOLD ? NAVY : WHITE });
    s.addText(t[0], { x: M + 1.1, y: y + 0.18, w: 10.2, h: 0.36, isTextBox: true, margin: 0, valign: "middle", fontFace: KR, fontSize: 15, bold: true, color: WHITE });
    s.addText(t[1], { x: M + 1.1, y: y + 0.56, w: 10.2, h: 0.58, isTextBox: true, margin: 0, fontFace: KR, fontSize: 11, color: MUTED_D, lineSpacing: 15 });
  });

  s.addText("본 안내문은 2026년 9월 14일 기준 공개 자료로 작성되었습니다. 학비 · 입학 시기 · 입학 조건은 대학이 연 단위로 개정하므로, 최종 지원 전 각 대학 공식 입학처에 반드시 재확인하시기 바랍니다.", {
    x: M, y: 6.6, w: 10.8, h: 0.55, isTextBox: true, margin: 0,
    fontFace: KR, fontSize: 10, color: MUTED_D, italic: true, lineSpacing: 14,
  });
  s.addNotes("정리하면 세 가지입니다. 전공으로 결정할 것, A플랜을 기본으로 할 것, 보장할 수 없는 표현을 뺄 것.");
}

pres.writeFile({ fileName: "/home/user/Johan/docs/malaysia/IM말레이시아_입학안내문_2027.pptx" })
  .then((f) => console.log("saved:", f));
