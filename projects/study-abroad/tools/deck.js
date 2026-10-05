const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/70e34ac1-700f-4b78-b9d2-397208412402_e9f8740d-29ab-4473-9d7e-2d8fff3eb332/pptx/scripts/apply_theme.js");

const THEME = {
  name: "Study Malaysia",
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  colors: {
    dk1: "16221F", lt1: "FFFFFF", dk2: "0F6457", lt2: "EAF0EE",
    accent1: "0F6457", accent2: "8A6A1E", accent3: "1B3A6B", accent4: "45B49E",
    accent5: "9E3F23", accent6: "66756F", hlink: "0F6457", folHlink: "66756F"
  }
};
const TEAL = "0F6457", GOLD = "8A6A1E", NAVY = "1B3A6B", INK = "16221F",
      MUTED = "66756F", LIGHT = "EAF0EE", WHITE = "FFFFFF", LINE = "D7DEDA", WARN = "9E3F23";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13.3 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "유학지원센터";
pres.title = "말레이시아 유학 설명회";
const C = pres.SchemeColor;

/* ---------------- layouts ---------------- */
pres.defineSlideMaster({
  title: "TITLE_DARK", background: { color: TEAL },
  objects: [
    { text: { text: "STUDY IN MALAYSIA", options: { x: 0.9, y: 1.5, w: 8, h: 0.35, fontSize: 12,
      color: WHITE, charSpacing: 4, transparency: 25, isTextBox: true } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 1.95, w: 11.5, h: 1.3,
      fontSize: 44, bold: true, color: WHITE }, text: " " } },
    { placeholder: { options: { name: "body", type: "body", x: 0.9, y: 3.35, w: 9.5, h: 0.9,
      fontSize: 20, color: WHITE, align: "left" }, text: " " } }
  ]
});
pres.defineSlideMaster({
  title: "SECTION_DARK", background: { color: NAVY },
  objects: [
    { placeholder: { options: { name: "body", type: "body", x: 0.9, y: 2.75, w: 3, h: 0.5,
      fontSize: 14, color: WHITE, charSpacing: 3 }, text: " " } },
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 3.25, w: 11.5, h: 1.1,
      fontSize: 40, bold: true, color: WHITE }, text: " " } }
  ]
});
pres.defineSlideMaster({
  title: "CONTENT", background: { color: WHITE },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.75, y: 0.45, w: 11.8, h: 0.85,
      fontSize: 34, bold: true, color: INK, align: "left" }, text: " " } },
    { text: { text: "말레이시아 유학 설명회", options: { x: 0.75, y: 6.85, w: 5, h: 0.3, fontSize: 10,
      color: MUTED, isTextBox: true } } }
  ],
  slideNumber: { x: 12.4, y: 6.85, fontSize: 10, color: MUTED }
});
pres.defineSlideMaster({
  title: "CLOSING_DARK", background: { color: TEAL },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 1.6, w: 11.5, h: 1.1,
      fontSize: 40, bold: true, color: WHITE }, text: " " } }
  ]
});

/* ---------------- helpers ---------------- */
const slide = (master, section) => pres.addSlide({ masterName: master, sectionTitle: section });

function card(s, { x, y, w, h, fill, line, name }) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06, fill: { color: fill || LIGHT },
    line: line ? { color: line, width: 1 } : { color: LINE, width: 1 }, objectName: name
  });
}
function numCircle(s, { x, y, n, color }) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: 0.42, h: 0.42, fill: { color: color || TEAL } });
  s.addText(String(n), { x, y, w: 0.42, h: 0.42, fontSize: 14, bold: true, color: WHITE,
    align: "center", valign: "middle", margin: 0, isTextBox: true });
}

/* ================= 1. 표지 ================= */
pres.addSection({ title: "표지" });
let s = slide("TITLE_DARK", "표지");
s.addText("말레이시아 유학 설명회", { placeholder: "title" });
s.addText("영어와 중국어를 함께, 한국 비용의 절반으로", { placeholder: "body" });
s.addText("2026년 ____월 ____일 ____시   ·   장소 ____________   ·   주최 ____________",
  { x: 0.9, y: 5.6, w: 11.5, h: 0.4, fontSize: 14, color: WHITE, transparency: 20, isTextBox: true });
s.addNotes("인사 1분. 오늘 90분 동안 무엇을 다루는지 먼저 말하고 시작한다. 숫자는 뒤에서 자세히 다룬다고 예고.");

/* ================= 2. 아젠다 ================= */
s = slide("CONTENT", "표지");
s.addText("오늘 말씀드릴 것", { placeholder: "title" });
const agenda = [
  ["왜 말레이시아인가", "장점과 단점을 함께"],
  ["학교 종류", "국제학교 · IB · 현지 사립"],
  ["학년과 가는 시기", "언제 보내는 것이 좋은가"],
  ["비용 구조", "학비 외에 무엇이 더 드는가"],
  ["비자와 준비 절차", "D-4개월이 기준입니다"],
  ["상담 신청", "오늘 신청서를 받습니다"]
];
agenda.forEach((a, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.75 + col * 6.1, y = 1.6 + row * 1.55;
  card(s, { x, y, w: 5.6, h: 1.25, fill: LIGHT, name: `agenda-${i}` });
  numCircle(s, { x: x + 0.3, y: y + 0.42, n: i + 1 });
  s.addText(a[0], { x: x + 0.95, y: y + 0.26, w: 4.4, h: 0.4, fontSize: 18, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(a[1], { x: x + 0.95, y: y + 0.68, w: 4.4, h: 0.35, fontSize: 13, color: MUTED, margin: 0, isTextBox: true });
});
s.addNotes("6개를 다 말하지 말고 '비용과 비자' 두 가지가 오늘의 핵심이라고 짚어 준다.");

/* ================= 3. 섹션 1 ================= */
pres.addSection({ title: "왜 말레이시아인가" });
s = slide("SECTION_DARK", "왜 말레이시아인가");
s.addText("01", { placeholder: "body" });
s.addText("왜 말레이시아인가", { placeholder: "title" });

/* ================= 4. 5가지 이유 ================= */
s = slide("CONTENT", "왜 말레이시아인가");
s.addText("다섯 가지 이유", { placeholder: "title" });
const reasons = [
  ["영어 + 중국어를 함께", "수업은 영어, 생활에서 중국어와 말레이어를 듣습니다"],
  ["비용", "같은 커리큘럼(IGCSE · A-Level · IB)을 더 적은 비용으로"],
  ["해외 대학 분교", "모나쉬(호주) · 노팅엄(영국) 본교 학위를 현지에서"],
  ["거리와 시차", "직항 6시간 30분, 시차 1시간 — 부모가 자주 갈 수 있습니다"],
  ["생활 환경", "한인 커뮤니티 · 한국 식료품 · 의료 인프라"]
];
reasons.forEach((r, i) => {
  const y = 1.55 + i * 1.0;
  numCircle(s, { x: 0.8, y: y + 0.12, n: i + 1, color: i === 2 ? GOLD : TEAL });
  s.addText(r[0], { x: 1.45, y: y, w: 3.5, h: 0.45, fontSize: 18, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(r[1], { x: 5.1, y: y + 0.03, w: 7.4, h: 0.5, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
  if (i < 4) s.addShape(pres.ShapeType.line, { x: 0.8, y: y + 0.82, w: 11.7, h: 0, line: { color: LINE, width: 1 } });
});
s.addNotes("3번(분교)을 가장 강조한다. 모르는 학부모가 많다. 영국·호주 본교 학위를 현지 비용으로 받는다는 점.");

/* ================= 5. 숫자 ================= */
s = slide("CONTENT", "왜 말레이시아인가");
s.addText("숫자로 보는 말레이시아", { placeholder: "title" });
const stats = [
  ["6시간 30분", "인천 → 쿠알라룸푸르 직항"],
  ["1시간", "한국과의 시차"],
  ["3개 언어", "영어 · 중국어 · 말레이어 환경"],
  ["2곳", "모나쉬 · 노팅엄 분교"]
];
stats.forEach((st, i) => {
  const x = 0.75 + i * 3.05;
  card(s, { x, y: 1.9, w: 2.8, h: 2.5, fill: i === 0 ? LIGHT : WHITE, line: i === 0 ? TEAL : LINE, name: `stat-${i}` });
  s.addText(st[0], { x: x + 0.2, y: 2.4, w: 2.4, h: 0.9, fontSize: 30, bold: true, color: TEAL,
    align: "center", margin: 0, isTextBox: true });
  s.addText(st[1], { x: x + 0.2, y: 3.4, w: 2.4, h: 0.7, fontSize: 13, color: MUTED,
    align: "center", margin: 0, isTextBox: true });
});
card(s, { x: 0.75, y: 4.75, w: 11.8, h: 1.1, fill: LIGHT, name: "stat-note" });
s.addText("부모가 주말에 다녀올 수 있는 거리입니다. 이것이 미국 · 캐나다 유학과 가장 다른 점입니다.",
  { x: 1.1, y: 5.05, w: 11.1, h: 0.5, fontSize: 16, color: TEAL, bold: true, margin: 0, isTextBox: true });
s.addNotes("거리와 시차를 체감으로 설명. 금요일 저녁에 출발해 일요일에 돌아올 수 있다.");

/* ================= 6. 솔직하게 ================= */
s = slide("CONTENT", "왜 말레이시아인가");
s.addText("솔직하게 말씀드릴 것", { placeholder: "title" });
const honest = [
  ["영어 원어민 국가가 아닙니다", "학교 밖에서는 말레이어 · 중국어가 더 많이 들립니다"],
  ["학교 편차가 큽니다", "“말레이시아 유학”이 아니라 “어느 학교냐”가 전부입니다"],
  ["한국 학적은 가정마다 다릅니다", "교육청과 재학 학교에 직접 확인하셔야 합니다"]
];
honest.forEach((h, i) => {
  const y = 1.75 + i * 1.6;
  card(s, { x: 0.75, y, w: 11.8, h: 1.35, fill: WHITE, line: WARN, name: `honest-${i}` });
  s.addShape(pres.ShapeType.ellipse, { x: 1.1, y: y + 0.47, w: 0.4, h: 0.4, fill: { color: WARN } });
  s.addText("!", { x: 1.1, y: y + 0.47, w: 0.4, h: 0.4, fontSize: 16, bold: true, color: WHITE,
    align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText(h[0], { x: 1.75, y: y + 0.25, w: 10.4, h: 0.45, fontSize: 19, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(h[1], { x: 1.75, y: y + 0.72, w: 10.4, h: 0.45, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
});
s.addNotes("이 장이 설명회의 신뢰를 만든다. 단점을 먼저 말하는 쪽이 믿음을 얻는다. 어차피 검색하면 나온다.");

/* ================= 7. 섹션 2 ================= */
pres.addSection({ title: "학교와 학년" });
s = slide("SECTION_DARK", "학교와 학년");
s.addText("02", { placeholder: "body" });
s.addText("학교 종류와 가는 시기", { placeholder: "title" });

/* ================= 8. 학교 종류 ================= */
s = slide("CONTENT", "학교와 학년");
s.addText("학교는 네 가지로 나뉩니다", { placeholder: "title" });
const schools = [
  ["영국식 국제학교", "IGCSE → A-Level", "학교 수가 가장 많고 선택지가 넓다", TEAL],
  ["미국식 국제학교", "AP · 미국 고교", "미국 대학 목표에 유리", NAVY],
  ["IB 학교", "IB Diploma", "학비가 높고 학업 강도가 세다", GOLD],
  ["현지 사립학교", "말레이시아 과정 + 영어", "학비가 낮다", MUTED]
];
schools.forEach((sc, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.75 + col * 6.1, y = 1.6 + row * 2.35;
  card(s, { x, y, w: 5.6, h: 2.05, fill: WHITE, line: sc[3], name: `school-${i}` });
  s.addText(sc[0], { x: x + 0.35, y: y + 0.25, w: 4.9, h: 0.4, fontSize: 19, bold: true, color: sc[3], margin: 0, isTextBox: true });
  s.addText(sc[1], { x: x + 0.35, y: y + 0.78, w: 4.9, h: 0.35, fontSize: 14, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(sc[2], { x: x + 0.35, y: y + 1.22, w: 4.9, h: 0.6, fontSize: 13, color: MUTED, margin: 0, isTextBox: true });
});
s.addText("학교를 고를 때 보는 것 — 한국 학생 비율 · ESL 프로그램 · 학급당 인원 · 최근 3년 진학 실적 · 통학 거리",
  { x: 0.75, y: 6.3, w: 11.8, h: 0.4, fontSize: 13, color: TEAL, bold: true, margin: 0, isTextBox: true });
s.addNotes("학부모가 가장 많이 묻는 것은 '어느 학교가 좋나'. 좋은 학교가 아니라 '우리 아이에게 맞는 학교'로 돌려 말한다.");

/* ================= 9. 학년 매칭 ================= */
s = slide("CONTENT", "학교와 학년");
s.addText("학년 매칭과 가는 시기", { placeholder: "title" });
const rows = [
  [{ text: "한국", options: { bold: true } }, { text: "영국식 (Year)", options: { bold: true } },
   { text: "미국식 (Grade)", options: { bold: true } }, { text: "비고", options: { bold: true } }],
  ["초등 1~3", "Year 2~4", "Grade 1~3", ""],
  ["초등 4~6", "Year 5~7", "Grade 4~6", "입학 적기 구간 시작"],
  ["중학 1", "Year 8", "Grade 7", ""],
  ["중학 2", "Year 9", "Grade 8", "IGCSE 직전 — 늦어도 이때까지"],
  ["중학 3 ~ 고등 1", "Year 10~11", "Grade 9~10", "IGCSE 과정"],
  ["고등 2~3", "Year 12~13", "Grade 11~12", "A-Level 과정"]
];
s.addTable(rows, {
  x: 0.75, y: 1.55, w: 11.8, colW: [2.6, 2.6, 2.6, 4.0], fontSize: 14, color: INK,
  border: { type: "solid", color: LINE, pt: 1 }, align: "left", valign: "middle",
  rowH: 0.42, fill: { color: WHITE },
  fontFace: "Malgun Gothic"
});
card(s, { x: 0.75, y: 5.1, w: 11.8, h: 1.15, fill: LIGHT, name: "year-note" });
s.addText([
  { text: "한국 학년을 그대로 가져가지 않습니다. ", options: { bold: true, color: INK } },
  { text: "학교가 영어 수준을 보고 한 학년 아래로 배정하는 경우가 흔합니다.", options: { color: MUTED } }
], { x: 1.1, y: 5.3, w: 11.1, h: 0.4, fontSize: 15, margin: 0, isTextBox: true });
s.addText("가장 권하는 시기 — 중학 1~2학년. IGCSE 시작 전 2년의 준비 기간이 생깁니다.",
  { x: 1.1, y: 5.72, w: 11.1, h: 0.4, fontSize: 15, bold: true, color: TEAL, margin: 0, isTextBox: true });
s.addNotes("학년이 내려갈 수 있다는 점을 미리 말해 두면 나중에 불만이 없다.");

/* ================= 10. 섹션 3 ================= */
pres.addSection({ title: "비용과 비자" });
s = slide("SECTION_DARK", "비용과 비자");
s.addText("03", { placeholder: "body" });
s.addText("비용 구조와 비자 절차", { placeholder: "title" });

/* ================= 11. 비용 ================= */
s = slide("CONTENT", "비용과 비자");
s.addText("학비 외에 무엇이 더 드는가", { placeholder: "title" });
const costRows = [
  [{ text: "항목", options: { bold: true } }, { text: "주기", options: { bold: true } },
   { text: "일반 범위 (RM)", options: { bold: true } }, { text: "확인 금액", options: { bold: true } }],
  ["학비 — 보급형 / 중급 / 프리미엄", "연", "20,000 ~ 130,000", ""],
  ["입학금 (환급 없음)", "1회", "5,000 ~ 20,000", ""],
  ["교복 · 교재 · 활동비", "연", "2,000 ~ 6,000", ""],
  ["통학버스", "연", "3,000 ~ 6,000", ""],
  ["주거 (콘도 2~3룸)", "월", "2,500 ~ 5,000", ""],
  ["생활비 (보호자 1 + 학생 1)", "월", "3,000 ~ 5,000", ""],
  ["보험 · 비자 · 항공", "연", "가정별 상이", ""]
];
s.addTable(costRows, {
  x: 0.75, y: 1.5, w: 11.8, colW: [5.0, 1.3, 3.0, 2.5], fontSize: 13.5, color: INK,
  border: { type: "solid", color: LINE, pt: 1 }, align: "left", valign: "middle",
  rowH: 0.4, fill: { color: WHITE }, fontFace: "Malgun Gothic"
});
card(s, { x: 0.75, y: 5.3, w: 11.8, h: 1.0, fill: WHITE, line: WARN, name: "cost-warn" });
s.addText([
  { text: "위 금액은 공개 자료 기준의 일반 범위입니다. ", options: { bold: true, color: WARN } },
  { text: "오늘 안내드리는 학교의 공식 자료 기준 금액은 자료집 5쪽에 적어 드립니다.", options: { color: INK } }
], { x: 1.1, y: 5.55, w: 11.1, h: 0.5, fontSize: 14.5, margin: 0, isTextBox: true });
s.addNotes("절대 '대략 얼마'라고 말하지 않는다. '○○학교 2026학년도 공식 자료 기준, 확인 날짜 ○월 ○일'로 말한다.");

/* ================= 12. 비자 ================= */
s = slide("CONTENT", "비용과 비자");
s.addText("학생비자는 학교가 대행합니다", { placeholder: "title" });
const visa = [
  ["01", "학교 지원", "입학 허가\n2~4주"],
  ["02", "EMGS 신청", "학교 대행\n접수"],
  ["03", "서류 심사", "건강검진 서류\n4~8주"],
  ["04", "VAL 발급", "비자 승인서\n승인 후"],
  ["05", "입국 · 부착", "Student Pass\n2~4주"]
];
visa.forEach((v, i) => {
  const x = 0.75 + i * 2.44;
  card(s, { x, y: 1.75, w: 2.2, h: 2.5, fill: i === 3 ? LIGHT : WHITE, line: i === 3 ? TEAL : LINE, name: `visa-${i}` });
  s.addText(v[0], { x: x + 0.25, y: 1.95, w: 1.7, h: 0.35, fontSize: 13, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText(v[1], { x: x + 0.25, y: 2.4, w: 1.7, h: 0.5, fontSize: 16, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(v[2], { x: x + 0.25, y: 3.0, w: 1.7, h: 1.0, fontSize: 12, color: MUTED, margin: 0, isTextBox: true });
  if (i < 4) s.addShape(pres.ShapeType.rightArrow, { x: x + 2.26, y: 2.85, w: 0.16, h: 0.3, fill: { color: TEAL } });
});
card(s, { x: 0.75, y: 4.6, w: 11.8, h: 1.7, fill: WHITE, line: WARN, name: "visa-warn" });
s.addText("가장 흔한 실수 — 비자 신청을 늦게 시작합니다", { x: 1.1, y: 4.85, w: 11.1, h: 0.45,
  fontSize: 19, bold: true, color: WARN, margin: 0, isTextBox: true });
s.addText("학기 시작에 못 맞춰 한 학기를 늦추는 경우가 매년 나옵니다. 입학 희망일 4~6개월 전에 시작하십시오.\n미성년자의 보호자 · 가디언 요건은 학교와 이민국 기준이 다를 수 있어 개별 확인이 필요합니다.",
  { x: 1.1, y: 5.35, w: 11.1, h: 0.85, fontSize: 14, color: INK, margin: 0, isTextBox: true });
s.addNotes("D-4개월만 기억하시라고 반복한다. 이 숫자 하나가 설명회에서 가장 실용적인 정보다.");

/* ================= 13. 섹션 4 ================= */
pres.addSection({ title: "준비와 상담" });
s = slide("SECTION_DARK", "준비와 상담");
s.addText("04", { placeholder: "body" });
s.addText("준비 일정과 저희가 하는 일", { placeholder: "title" });

/* ================= 14. 체크리스트 ================= */
s = slide("CONTENT", "준비와 상담");
s.addText("준비는 6개월 전부터", { placeholder: "title" });
const tl = [
  ["D-6개월", "학교 후보 3~5곳 선정 · 공식 학비표 받기 · 가족 회의"],
  ["D-5개월", "현지 학교 탐방 (3박4일) · 영문 서류 준비 시작"],
  ["D-4개월", "학교 지원 · 레벨 테스트 · 입학 허가 · 학생비자 신청"],
  ["D-3개월", "주거 탐색 · 건강검진 · 예방접종 기록"],
  ["D-2개월", "보험 · 항공 · 한국 학교 처리"],
  ["D-1개월 ~ 출국", "주거 계약 · 통신 · 은행 · 교복 · VAL 원본 지참"]
];
s.addShape(pres.ShapeType.line, { x: 1.55, y: 1.75, w: 0, h: 4.4, line: { color: LINE, width: 2 } });
tl.forEach((t, i) => {
  const y = 1.6 + i * 0.78;
  const hot = i === 2;
  s.addShape(pres.ShapeType.ellipse, { x: 1.37, y: y + 0.1, w: 0.36, h: 0.36,
    fill: { color: hot ? WARN : TEAL } });
  s.addText(t[0], { x: 1.95, y: y, w: 2.1, h: 0.45, fontSize: 16, bold: true,
    color: hot ? WARN : INK, margin: 0, isTextBox: true });
  s.addText(t[1], { x: 4.2, y: y + 0.03, w: 8.3, h: 0.45, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
});
s.addText("붉은 점이 비자 신청 시점입니다 — 여기가 밀리면 전부 밀립니다",
  { x: 1.95, y: 6.35, w: 10.5, h: 0.4, fontSize: 14, bold: true, color: WARN, margin: 0, isTextBox: true });
s.addNotes("자료집 8쪽에 체크박스 형태로 들어 있다고 안내한다.");

/* ================= 15. 저희가 하는 일 ================= */
s = slide("CONTENT", "준비와 상담");
s.addText("저희가 하는 일", { placeholder: "title" });
const svc = ["사전 상담", "학교 탐방 투어", "입학 상담 동행", "서류 지원",
             "학생비자 동행", "정착 지원", "사후 관리"];
svc.forEach((v, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = 0.75 + col * 3.05, y = 1.65 + row * 1.5;
  card(s, { x, y, w: 2.8, h: 1.2, fill: i === 1 || i === 4 ? LIGHT : WHITE,
    line: i === 1 || i === 4 ? TEAL : LINE, name: `svc-${i}` });
  s.addText(String(i + 1).padStart(2, "0"), { x: x + 0.25, y: y + 0.18, w: 2.3, h: 0.3,
    fontSize: 12, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText(v, { x: x + 0.25, y: y + 0.55, w: 2.3, h: 0.5, fontSize: 15, bold: true, color: INK, margin: 0, isTextBox: true });
});
card(s, { x: 0.75, y: 4.75, w: 11.8, h: 1.55, fill: LIGHT, name: "camp-note" });
s.addText("먼저 경험해 보고 싶으시다면 — 방학 어학캠프 4주", { x: 1.1, y: 5.0, w: 11.1, h: 0.45,
  fontSize: 19, bold: true, color: TEAL, margin: 0, isTextBox: true });
s.addText("아이가 적응하는지, 가족이 감당할 수 있는지를 적은 비용으로 미리 확인할 수 있습니다.\n학교로부터 소개 수수료를 받는 경우 사전에 밝힙니다. 숨기지 않는 것이 저희 원칙입니다.",
  { x: 1.1, y: 5.5, w: 11.1, h: 0.7, fontSize: 14, color: INK, margin: 0, isTextBox: true });
s.addNotes("캠프를 먼저 권하는 것이 신뢰를 만든다. 당장 유학을 결정하라고 하지 않는다.");

/* ================= 16. 마무리 ================= */
s = slide("CLOSING_DARK", "준비와 상담");
s.addText("오늘 하실 일은 하나입니다", { placeholder: "title" });
s.addText("자료집 10쪽의 상담 신청서를 작성해 주십시오", { x: 0.9, y: 2.85, w: 11.5, h: 0.5,
  fontSize: 20, color: WHITE, transparency: 10, isTextBox: true });
[["개별 상담", "전화 · 온라인 · 현지 방문"],
 ["학교 탐방 투어", "____월 ____일 출발 · 정원 ____가족"],
 ["어학캠프", "방학 4주 · 먼저 경험해 보기"]].forEach((cta, i) => {
  const x = 0.9 + i * 3.9;
  s.addShape(pres.ShapeType.roundRect, { x, y: 3.9, w: 3.6, h: 1.3, rectRadius: 0.06,
    fill: { color: WHITE }, line: { color: WHITE, width: 1 }, objectName: `cta-${i}` });
  s.addText(cta[0], { x: x + 0.3, y: 4.15, w: 3.0, h: 0.4, fontSize: 17, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText(cta[1], { x: x + 0.3, y: 4.6, w: 3.0, h: 0.5, fontSize: 12.5, color: MUTED, margin: 0, isTextBox: true });
});
s.addText("문의 ______________   ·   ______________", { x: 0.9, y: 5.7, w: 11.5, h: 0.4,
  fontSize: 15, color: WHITE, transparency: 20, isTextBox: true });
s.addNotes("신청서는 그 자리에서 걷는다. 집에 가져가면 돌아오지 않는다.");

(async () => {
  await pres.writeFile({ fileName: "유학설명회.pptx" });
  await applyTheme("유학설명회.pptx", THEME);
  console.log("written");
})();
