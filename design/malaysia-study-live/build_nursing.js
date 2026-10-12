// 말레이시아 유학 — 간호학편 (선웨이 · IMU)
// 2편과 동일한 구조: 입학 조건 → 경로 → 학비 → 예산 → 일정 → 확인 사항
const K = require('./deck_kit.js');
const D = K.createDeck('말레이시아 유학 — 간호학편 (선웨이 · IMU)', 'wide');
const { slide, rect, circle, text, bullets, tableEl, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/nursing-preview.html';
const CW = W - 2*M;

let SEC = 0;
function head(en, ko, sub, dark){
  const no = String(++SEC).padStart(2,'0');
  rect({ x:M, y:0.52, w:0.62, h:0.62, fill:dark?C.gold:C.deep, radius:0.06 });
  text({ t:no, x:M, y:0.52, w:0.62, h:0.62, size:17, bold:true, color:dark?C.ink:C.gold, align:'center', valign:'middle' });
  text({ t:en, x:M+0.82, y:0.5, w:CW-0.82, h:0.26, size:11, bold:true, color:dark?C.gold:C.mid, cs:2 });
  text({ t:ko, x:M+0.82, y:0.74, w:CW-0.82, h:0.56, size:30, bold:true, color:dark?C.onDark:C.ink, lh:1.1 });
  if (sub) text({ t:sub, x:M, y:1.34, w:CW, h:0.58, size:13, color:dark?C.onDarkMute:C.muted, lh:1.3 });
}
const bottom = t => text({ t, x:M, y:H-0.5, w:CW, h:0.34, size:9, color:C.muted, lh:1.25 });
const badge = (t, w) => { rect({ x:W-M-w, y:0.6, w, h:0.36, fill:C.deep, radius:0.05 });
  text({ t, x:W-M-w, y:0.6, w, h:0.36, size:11, bold:true, color:C.gold, align:'center', valign:'middle' }); };

/* ── 1. 표지 ── */
{
  slide(true);
  text({ t:'말레이시아 유학', x:M, y:1.9, w:9, h:0.4, size:16, bold:true, color:C.gold, cs:3 });
  text({ t:'간호학\n학사 진학편', x:M, y:2.4, w:9, h:1.9, size:54, bold:true, color:C.paper, lh:1.14 });
  text({ t:'선웨이 대학교  ·  IMU (International Medical University)', x:M, y:4.5, w:10, h:0.4, size:19, color:C.onDarkMute });
  rect({ x:M, y:5.1, w:CW, h:0.02, fill:C.deep });
  [['파운데이션은 필수','학사 직행이 안 됩니다'],['과학 미이수 학생','인문 예과(FIA) 경로'],['총 5년','예과 1년 + 학사 4년']].forEach((c,i)=>{
    text({ t:c[0], x:M+i*4.0, y:5.3, w:3.8, h:0.3, size:14, bold:true, color:C.onDark });
    text({ t:c[1], x:M+i*4.0, y:5.64, w:3.8, h:0.28, size:11, color:C.onDarkMute });
  });
  text({ t:'필리핀 IM해외선교본부 · 말레이시아 지부   |   기준일 2026.9.25 · 환율 RM 1 ≈ 365원', x:M, y:H-0.72, w:CW, h:0.3, size:11, color:C.onDarkMute });
  note('간호학은 1편·2편과 경로가 다릅니다. 과학 과목 이수 여부가 모든 것을 가릅니다.');
}

/* ── 2. 핵심 요약 ── */
{
  slide(false);
  head('KEY POINTS','핵심 요약 — 네 가지','학생 조건: 고교 과학 미이수 · 수학 95점 · TOEFL iBT 80');
  const card = (i, t1, t2) => {
    const x = M + (i%2)*6.07, y = 2.0 + Math.floor(i/2)*1.52;
    rect({ x, y, w:5.86, h:1.34, fill:C.sand, radius:0.08 });
    circle({ x:x+0.28, y:y+0.26, d:0.44, fill:C.deep, label:String(i+1), labelSize:15, labelColor:C.gold });
    text({ t:t1, x:x+0.88, y:y+0.2, w:4.7, h:0.34, size:14.5, bold:true, color:C.ink });
    text({ t:t2, x:x+0.88, y:y+0.58, w:4.7, h:0.66, size:11.5, color:C.text, lh:1.4 });
  };
  card(0,'파운데이션은 필수입니다','한국 고교 졸업생은 두 학교 모두 간호학 학사로 바로 입학할 수 없습니다. 1년 파운데이션(예과)을 반드시 거쳐야 합니다.');
  card(1,'과학 예과(FIST · FIS)는 입학 불가','선웨이 FIST와 IMU FIS 모두 고교 과학 과목 이수를 입학 조건으로 요구합니다. 과학 미이수라면 두 학교 다 인문 예과(FIA)가 유일한 문입니다.');
  card(2,'IMU FIA가 가장 확실합니다','IMU는 FIA → 간호학 진학 시 고교 과학 이수를 요구하지 않습니다. 선웨이는 과학 1과목 크레딧을 추가로 요구합니다.');
  card(3,'총 5년, 2032년 졸업','예과 1년 + 학사 4년입니다. 지금 준비하면 2027년 예과 입학 → 2028년 학사 입학 → 2032년 졸업이 현실적입니다.');
  rect({ x:M, y:5.1, w:CW, h:0.72, fill:C.goldSoft, radius:0.07 });
  text({ t:'TOEFL iBT 80점은 이미 충분합니다 — 학사 기준 iBT 46, FIA 기준 iBT 40입니다. 영어는 변수가 아니고, 과학 과목이 변수입니다.', x:M+0.28, y:5.1, w:CW-0.56, h:0.72, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('※ 이 자료는 "고교에서 과학을 이수하지 않은 학생"을 전제로 작성했습니다. 이과 계열 졸업생은 FIST · FIS 경로가 더 짧고 저렴합니다.');
  note('네 번째 카드부터 읽으셔도 됩니다. 학부모가 궁금한 것은 "몇 년이냐"입니다.');
}

/* ── 3. 두 대학 한눈에 ── */
{
  slide(false);
  head('AT A GLANCE','두 대학 한눈에','간호학 학사(Bachelor of Nursing) 기준');
  const uni = (x, nm, en, stats, rows) => {
    rect({ x, y:2.0, w:5.86, h:4.1, fill:C.sand, radius:0.08 });
    text({ t:nm, x:x+0.3, y:2.18, w:5.26, h:0.4, size:21, bold:true, color:C.ink });
    text({ t:en, x:x+0.3, y:2.6, w:5.26, h:0.26, size:11, color:C.muted });
    stats.forEach((s,i)=>{
      const sx = x+0.3+i*1.78;
      rect({ x:sx, y:2.94, w:1.62, h:0.84, fill:C.deep, radius:0.06 });
      text({ t:s[0], x:sx, y:3.02, w:1.62, h:0.4, size:17, bold:true, color:C.gold, align:'center' });
      text({ t:s[1], x:sx, y:3.44, w:1.62, h:0.28, size:9, color:C.onDarkMute, align:'center' });
    });
    rows.forEach((r,i)=>{
      text({ t:r[0], x:x+0.3, y:3.96+i*0.52, w:1.6, h:0.28, size:10.5, color:C.muted });
      text({ t:r[1], x:x+2.0, y:3.96+i*0.52, w:3.56, h:0.44, size:11.5, color:C.text, lh:1.3 });
    });
  };
  uni(M, 'IMU  (추천)', 'International Medical University · 쿠알라룸푸르 부킷자릴', 
    [['의·보건','특화 대학'],['9월','학사 입학'],['4·7·9월','FIA 입학']],
    [['학위','Bachelor of Nursing'],['학제','예과 1년 + 학사 4년'],['FIA → 간호학','고교 과학 요구 없음'],['총 학비','약 5,637만 원 (부대비 포함)']]);
  uni(M+6.07, '선웨이', 'Sunway University · 선웨이시티(반다르선웨이)',
    [['#354','QS 2027 세계'],['10월','학사 입학'],['1·4·8월','FIA 입학']],
    [['학위','Bachelor of Nursing (Hons)'],['학제','예과 1년 + 학사 4년'],['FIA → 간호학','고교 과학 1과목 크레딧 필요'],['총 학비','약 4,296만 원 (조건 충족 시)']]);
  bottom('※ 선웨이가 학비는 약 1,340만 원 낮지만, 과학 조건을 충족해야 진학이 가능합니다. 이 조건이 이번 선택의 핵심입니다.');
  note('학비만 보면 선웨이, 확실성으로 보면 IMU입니다. 과학 조건 확인이 먼저입니다.');
}

/* ── 4. 파운데이션 종류 확인 ── */
{
  slide(false);
  head('FOUNDATION TYPES','파운데이션 종류 확인 — FIA vs FIST · FIS','과학 예과와 인문 예과는 입학 조건부터 다릅니다');
  badge('이 자료의 핵심', 1.7);
  tableEl({ x:M, y:2.0, w:CW, rowH:0.74, size:11,
    colW:[1.5, 2.3, 3.0, 3.3, 1.833],
    rows:[
      ['학교','파운데이션','예과 입학 조건','예과 → 간호학 진학 조건','이 학생'],
      ['선웨이','FIST\n(과학기술 예과)','고교 이과 계열, 수학 포함 5과목 크레딧\n(과학 2과목 포함)','예과 CGPA 2.50','✕ 입학 불가\n(과학 미이수)'],
      ['선웨이','FIA\n(인문 예과)','고교 5과목 크레딧','예과 CGPA 2.50 + 고교 수학·과학 각 1과목 크레딧 + 면접·건강검진','△ 조건부\n(통합과학 인정 시)'],
      ['IMU','FIS\n(과학 예과)','수학·영어·과학 2과목(생물/화학/물리) 포함 5과목 C 이상','예과 cGPA 2.50 + 고교 수학·과학 2과목','✕ 입학 불가\n(과학 미이수)'],
      ['IMU','FIA\n(인문 예과)','고교 5과목 C 이상\n(유학생은 MQA 동등성 기준)','예과 cGPA 2.50 + 고교 5과목 C 이상\n(과학 요구 없음)','○ 가능\n(추천)'],
    ]});
  rect({ x:M, y:5.84, w:CW, h:0.56, fill:C.goldSoft, radius:0.07 });
  text({ t:'IMU FIA는 2학기 선택과목으로 General Science를 운영하므로 본과 전 과학 기초를 보완할 수 있습니다. IMU 간호학과 재학생 중 FIA 출신 사례가 공식 홈페이지에 소개되어 있습니다.', x:M+0.28, y:5.84, w:CW-0.56, h:0.56, size:11.5, bold:true, color:C.ink, valign:'middle' });
  bottom('출처: 선웨이 FIA 2026 Student Guide · 선웨이 FIST 2025 Guide · IMU Foundation in Arts · IMU Foundation in Science (각 학교 공식 홈페이지)');
  note('이 표가 전부입니다. 과학을 안 들었으면 FIA 두 줄만 보시면 됩니다. 그중 IMU만 추가 조건이 없습니다.');
}

/* ── 5. 왜 IMU FIA인가 ── */
{
  slide(false);
  head('WHY IMU','왜 IMU FIA가 가장 확실한가','같은 FIA라도 간호학으로 올라가는 조건이 다릅니다');
  rect({ x:M, y:2.0, w:5.86, h:2.6, fill:C.deep, radius:0.08 });
  text({ t:'IMU FIA', x:M+0.3, y:2.16, w:5.26, h:0.34, size:19, bold:true, color:C.paper });
  text({ t:'과학 조건이 없습니다', x:M+0.3, y:2.56, w:5.26, h:0.32, size:15, bold:true, color:C.gold });
  text({ t:'FIA 수료 후 간호학 진학 조건은 예과 cGPA 2.50과 고교 5과목 C 이상뿐입니다. 고교에서 과학을 듣지 않아도 진학이 막히지 않습니다.\n\n2학기 선택과목으로 General Science를 들을 수 있어 본과 전에 과학 기초를 보완할 수 있습니다.', x:M+0.3, y:2.96, w:5.26, h:1.44, size:12, color:C.onDark, lh:1.45 });
  rect({ x:M+6.07, y:2.0, w:5.86, h:2.6, fill:C.brickSoft, radius:0.08 });
  text({ t:'선웨이 FIA', x:M+6.37, y:2.16, w:5.26, h:0.34, size:19, bold:true, color:C.ink });
  text({ t:'과학 1과목 크레딧이 추가로 필요합니다', x:M+6.37, y:2.56, w:5.26, h:0.32, size:15, bold:true, color:C.brick });
  text({ t:'FIA 입학 자체는 고교 5과목 크레딧이면 됩니다. 문제는 간호학으로 올라갈 때입니다 — 예과 CGPA 2.50에 더해 고교 수학·과학 각 1과목 크레딧과 면접·건강검진을 요구합니다.\n\n한국 고교 "통합과학"이 이 과학 1과목으로 인정되는지가 관건입니다.', x:M+6.37, y:2.96, w:5.26, h:1.44, size:12, color:C.text, lh:1.45 });
  rect({ x:M, y:4.74, w:CW, h:0.9, fill:C.sand, radius:0.08 });
  text({ t:'영어는 이미 충족했습니다', x:M+0.3, y:4.82, w:CW-0.6, h:0.26, size:13, bold:true, color:C.deep });
  text({ t:'학사 기준 TOEFL iBT 46 · FIA 기준 iBT 40입니다. 보유 중인 iBT 80점은 두 기준을 모두 여유 있게 넘습니다. 수학 95점도 어느 경로에서든 문제가 되지 않습니다.', x:M+0.3, y:5.1, w:CW-0.6, h:0.48, size:12, color:C.text, lh:1.4 });
  rect({ x:M, y:5.74, w:CW, h:0.66, fill:C.goldSoft, radius:0.07 });
  text({ t:'결론 — 선웨이는 "통합과학 인정" 서면 회신을 받기 전까지 확정할 수 없습니다. IMU FIA는 지금 조건으로 바로 지원할 수 있습니다.', x:M+0.28, y:5.74, w:CW-0.56, h:0.66, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('선웨이가 더 싸지만 조건부입니다. 회신을 못 받으면 1년을 날립니다. IMU를 기본안, 선웨이를 대안으로 두십시오.');
}

/* ── 6. 5년 로드맵 ── */
{
  slide(false);
  head('ROADMAP','5년 로드맵 — 입학부터 졸업까지','예과 1년 + 학사 4년 · 두 학교 모두 동일한 구조입니다');
  const road = (y, nm, tone, cells) => {
    rect({ x:M, y, w:2.3, h:1.0, fill:tone, radius:0.06 });
    text({ t:nm, x:M+0.18, y, w:1.94, h:1.0, size:13, bold:true, color:tone===C.gold?C.ink:C.paper, valign:'middle', lh:1.25 });
    cells.forEach((c,i)=>{
      const x = 3.2 + i*2.37;
      rect({ x, y, w:2.2, h:1.0, fill:C.sand, radius:0.06 });
      text({ t:c[0], x:x+0.16, y:y+0.12, w:1.88, h:0.26, size:10, bold:true, color:C.mid, cs:1 });
      text({ t:c[1], x:x+0.16, y:y+0.38, w:1.88, h:0.5, size:11.5, color:C.text, lh:1.25 });
    });
  };
  text({ t:'단계', x:M, y:1.96, w:2.3, h:0.24, size:10, color:C.muted });
  ['① 예과 입학','② 예과 수료','③ 학사 입학','④ 졸업'].forEach((t,i)=>{
    text({ t, x:3.2+i*2.37, y:1.96, w:2.2, h:0.24, size:10, bold:true, color:C.muted });
  });
  road(2.24, 'IMU\n(추천)', C.deep, [
    ['2027년 7월','FIA 1년 (3학기)\n연 3회 4·7·9월'],
    ['2028년 중','cGPA 2.50 이상'],
    ['2028년 9월','간호학 4년\n매년 9월 개강'],
    ['2032년 여름','Bachelor of Nursing'],
  ]);
  road(3.44, '선웨이', C.brick, [
    ['2027년 8월','FIA 1년 (3학기)\n연 3회 1·4·8월'],
    ['2028년 중','CGPA 2.50 + 과학 조건'],
    ['2028년 10월','간호학 4년\n매년 10월 개강'],
    ['2032년 가을','Bachelor of Nursing (Hons)'],
  ]);
  rect({ x:M, y:4.76, w:5.86, h:1.0, fill:C.goldSoft, radius:0.08 });
  text({ t:'1년을 앞당길 수 있습니다', x:M+0.3, y:4.86, w:5.26, h:0.26, size:12.5, bold:true, color:C.gold });
  text({ t:'2026년 9월 IMU FIA 학기에 추가 등록이 가능하면 학사 입학이 2027년 9월로 1년 당겨집니다. 즉시 문의할 가치가 있습니다.', x:M+0.3, y:5.14, w:5.26, h:0.52, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:4.76, w:5.86, h:1.0, fill:C.brickSoft, radius:0.08 });
  text({ t:'선웨이는 8월 입학이 공백이 가장 짧습니다', x:M+6.37, y:4.86, w:5.26, h:0.26, size:12.5, bold:true, color:C.brick });
  text({ t:'FIA는 1·4·8월에 들어갈 수 있지만 학사가 10월에만 개강합니다. 1월·4월에 들어가면 수료 후 대기 기간이 생깁니다.', x:M+6.37, y:5.14, w:5.26, h:0.52, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M, y:5.88, w:CW, h:0.52, fill:C.sand, radius:0.07 });
  text({ t:'학사 개강이 IMU는 9월, 선웨이는 10월로 연 1회뿐입니다 — 예과 수료 시점을 여기에 맞춰 역산하십시오.', x:M+0.28, y:5.88, w:CW-0.56, h:0.52, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('학사가 연 1회라는 점이 일정의 전부입니다. 예과 입학 시기를 잘못 잡으면 몇 달을 그냥 기다립니다.');
}

/* ── 7. IMU 학비 상세 ── */
{
  slide(false);
  head('IMU FEES','IMU — 학비 상세','FIA → 간호학 학사 · 환율 RM 1 ≈ 365원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.54, size:12.5,
    colW:[4.0, 2.2, 2.4, 3.333],
    rows:[
      ['항목','MYR','원화','비고'],
      ['FIA 수업료 (3학기)','34,344','약 1,254만 원','RM 10,800/학기 + SST 6%'],
      ['간호학 학사 수업료 (8학기)','110,240','약 4,024만 원','RM 13,000/학기 + SST 6%'],
      ['수업료 소계','144,584','약 5,277만 원','—'],
      ['부대비 (지원·등록·유학생 행정비)','약 9,860','약 360만 원','학사 지원비는 FIA 수료생 면제'],
      ['총계 (예치금 제외)','약 154,444','약 5,637만 원','환불 예치금 RM 2,000 별도'],
    ]});
  rect({ x:M, y:5.42, w:5.86, h:0.96, fill:C.goldSoft, radius:0.08 });
  text({ t:'장학금 — IMU 간호학 bursary', x:M+0.3, y:5.52, w:5.26, h:0.26, size:12.5, bold:true, color:C.gold });
  text({ t:'적격자에게 RM 10,000 (약 365만 원)이 감면됩니다. 오퍼레터 단계에서 적용 여부를 확인하십시오.', x:M+0.3, y:5.8, w:5.26, h:0.48, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.42, w:5.86, h:0.96, fill:C.sand, radius:0.08 });
  text({ t:'학사 지원비가 면제됩니다', x:M+6.37, y:5.52, w:5.26, h:0.26, size:12.5, bold:true, color:C.deep });
  text({ t:'FIA를 IMU에서 수료하면 학사 과정 지원비를 다시 내지 않습니다. 같은 학교에서 올라가는 이점입니다.', x:M+6.37, y:5.8, w:5.26, h:0.48, size:11.5, color:C.text, lh:1.4 });
  bottom('출처: IMU 공식 홈페이지 (Foundation in Arts · Bachelor of Nursing)  |  모든 학비는 매년 인상될 수 있으며 오퍼레터로 최종 확인이 필요합니다.');
  note('IMU는 금액이 공식 자료로 확정돼 있습니다. 선웨이보다 비싸지만 숫자가 확실합니다.');
}

/* ── 8. 선웨이 학비 상세 ── */
{
  slide(false);
  head('SUNWAY FEES','선웨이 — 학비 상세','FIA → 간호학 학사 · 환율 RM 1 ≈ 365원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.56, size:12.5,
    colW:[4.0, 2.2, 2.4, 3.333],
    rows:[
      ['항목','MYR','원화','비고'],
      ['FIA 1년','약 27,450','약 1,002만 원','중개사이트 기준 추정 — 학교 확인 필요'],
      ['간호학 학사 4년','약 90,000','약 3,294만 원','공식 연 USD 5,756 × 4년 (USD 1 ≈ RM 3.92)'],
      ['총계','약 117,450','약 4,296만 원','SST·유학생 행정비 포함 여부 확인 필요'],
    ]});
  rect({ x:M, y:4.42, w:CW, h:0.96, fill:C.brickSoft, radius:0.08 });
  text({ t:'이 금액은 확정액이 아닙니다', x:M+0.3, y:4.52, w:CW-0.6, h:0.26, size:13, bold:true, color:C.brick });
  text({ t:'FIA 유학생 학비는 중개사이트 기준 추정치이고, 학사 학비는 학교가 달러로 안내한 금액을 링깃으로 환산한 값입니다. 여기에 6% 서비스세와 유학생 행정비가 포함돼 있는지도 확인되지 않았습니다. 학교 견적서를 받기 전에는 예산의 기준으로 쓰시면 안 됩니다.', x:M+0.3, y:4.8, w:CW-0.6, h:0.48, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M, y:5.5, w:CW, h:0.9, fill:C.sand, radius:0.08 });
  text({ t:'그래도 선웨이가 약 1,340만 원 저렴합니다', x:M+0.3, y:5.6, w:CW-0.6, h:0.26, size:13, bold:true, color:C.deep });
  text({ t:'IMU 약 4,296만 원 대비 선웨이 약 5,637만 원 — 추정치 기준 차액은 약 1,340만 원입니다. 다만 이 금액을 얻으려면 "통합과학 인정"이라는 조건을 먼저 통과해야 합니다.', x:M+0.3, y:5.88, w:CW-0.6, h:0.44, size:11.5, color:C.text, lh:1.4 });
  bottom('출처: 선웨이 Bachelor of Nursing (Honours) 공식 페이지 · 선웨이 FIA 2026 Student Guide  |  달러 표기는 참고용이며 실제 납부는 링깃입니다.');
  note('금액을 말할 때 "추정"이라는 단어를 꼭 붙이십시오. 나중에 견적서가 다르게 나오면 신뢰를 잃습니다.');
}

/* ── 9. 졸업까지 총 예산 ── */
{
  slide(false);
  head('TOTAL BUDGET','졸업까지 총 예산','5년 기준 · 두 가지 기준으로 나눠 보셔야 합니다');
  text({ t:'기준 A — 학비 + 생활비 (개인 유학)', x:M, y:1.98, w:5.86, h:0.3, size:14, bold:true, color:C.ink });
  tableEl({ x:M, y:2.34, w:5.86, rowH:0.48, size:11.5,
    colW:[2.26, 1.8, 1.8],
    rows:[
      ['항목','IMU','선웨이'],
      ['학비 총액 (5년)','약 5,637만','약 4,296만'],
      ['생활비 (5년)','4,380 ~ 5,256만','4,380 ~ 5,256만'],
      ['졸업까지 총액','1억 17만 ~\n1억 893만','8,676 ~\n9,552만'],
    ]});
  text({ t:'기준 B — IM 공동체 과정으로 들어갈 경우', x:M+6.07, y:1.98, w:5.86, h:0.3, size:14, bold:true, color:C.ink });
  tableEl({ x:M+6.07, y:2.34, w:5.86, rowH:0.48, size:11.5,
    colW:[2.26, 1.8, 1.8],
    rows:[
      ['항목','IMU','선웨이'],
      ['학비 총액 (5년)','약 5,637만','약 4,296만'],
      ['공동체 운영비 · 비자 · 입학비','약 8,400만','약 8,400만'],
      ['졸업까지 총액','약 1억 4,037만','약 1억 2,696만'],
    ]});
  rect({ x:M, y:4.5, w:5.86, h:1.24, fill:C.sand, radius:0.08 });
  text({ t:'생활비 — 월 RM 2,000 ~ 2,400', x:M+0.3, y:4.6, w:5.26, h:0.26, size:12.5, bold:true, color:C.deep });
  text({ t:'IMU 인근 기준 연 약 876만 ~ 1,051만 원입니다. 5년이면 4,380만 ~ 5,256만 원입니다. 별도로 유학생 비자 행정비가 최대 RM 3,500 들고 매년 갱신비가 붙습니다.', x:M+0.3, y:4.88, w:5.26, h:0.76, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:4.5, w:5.86, h:1.24, fill:C.goldSoft, radius:0.08 });
  text({ t:'기준 B의 내역', x:M+6.37, y:4.6, w:5.26, h:0.26, size:12.5, bold:true, color:C.gold });
  text({ t:'IM 공동체 운영비 1,440만/년 × 5년 = 7,200만, 학생비자 갱신 140만/년 × 5년 = 700만, 입학비 500만 (입회 시 1회)을 더한 금액입니다. 공동체 운영비에 숙식이 포함되므로 기준 A의 생활비와 중복 계산하지 마십시오.', x:M+6.37, y:4.88, w:5.26, h:0.76, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M, y:5.86, w:CW, h:0.54, fill:C.brickSoft, radius:0.07 });
  text({ t:'환율 민감도 — RM 1이 10원 오르면 IMU 총 학비가 약 150만 원 늘어납니다. 1·2편은 RM 1 = 339원 기준이고 이 자료는 365원 기준이라 직접 비교하지 마십시오.', x:M+0.28, y:5.86, w:CW-0.56, h:0.54, size:12, bold:true, color:C.brick, valign:'middle' });
  bottom('※ 장학금(IMU 간호학 bursary RM 10,000 · 약 365만 원)은 반영하지 않았습니다 · 환불 예치금 RM 2,000 별도 · 항공·보험 별도');
  note('기준 A와 B를 섞어 말하면 학부모가 혼란스러워합니다. 공동체로 들어오는 학생은 B만 보시면 됩니다.');
}

/* ── 10. 학교에 서면 확인할 것 ── */
{
  slide(false);
  head('TO CONFIRM','학교에 서면으로 확인할 것','다섯 가지입니다 · 선웨이 두 건이 가장 급합니다');
  const item = (i, tag, tone, t1, t2) => {
    const y = 2.0 + i*0.88;
    rect({ x:M, y, w:1.5, h:0.76, fill:tone, radius:0.05 });
    text({ t:tag, x:M, y, w:1.5, h:0.76, size:11.5, bold:true, color:tone===C.gold?C.ink:C.paper, align:'center', valign:'middle' });
    rect({ x:M+1.62, y, w:CW-1.62, h:0.76, fill:C.sand, radius:0.05 });
    text({ t:t1, x:M+1.84, y:y+0.1, w:CW-2.1, h:0.28, size:13, bold:true, color:C.ink });
    text({ t:t2, x:M+1.84, y:y+0.4, w:CW-2.1, h:0.28, size:11, color:C.text });
  };
  item(0,'선웨이', C.brick, '한국 고교 "통합과학"이 간호학 진학 조건의 과학 1과목 크레딧으로 인정되는가',
    '이 답 하나로 선웨이 경로의 가부가 결정됩니다. 가장 먼저 물으셔야 합니다.');
  item(1,'선웨이', C.brick, 'FIA 유학생 학비 확정액과 학사 과정의 SST · 유학생 행정비 포함 여부',
    '현재 금액은 중개사이트 추정치입니다. 견적서를 받아야 예산이 확정됩니다.');
  item(2,'IMU', C.mid, '2026년 9월 FIA 학기 추가 등록이 가능한가',
    '가능하면 학사 입학이 2027년 9월로 당겨져 전체 일정이 1년 짧아집니다.');
  item(3,'IMU', C.mid, '한국 고교 성적의 MQA 동등성 인정 — FIA 입학 및 간호학 조건부 오퍼 발급',
    '유학생은 MQA 동등성 기준을 적용받습니다. 조건부 오퍼를 미리 확보하십시오.');
  item(4,'공통', C.gold, '영어 요건 재확인 — 학사 TOEFL iBT 46 · FIA iBT 40',
    '보유 iBT 80점으로 충족됩니다. 성적 유효기간만 확인하면 됩니다.');
  rect({ x:M, y:6.44, w:CW, h:0.48, fill:C.goldSoft, radius:0.06 });
  text({ t:'1·2번 답이 오기 전까지는 IMU를 기본안으로 두고 준비하십시오 — 기다리다 인테이크를 놓치는 것이 가장 큰 손해입니다.', x:M+0.28, y:6.44, w:CW-0.56, h:0.48, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('이메일 한 통이 1년을 좌우합니다. 오늘 보내십시오.');
}

/* ── 11. 출처 ── */
{
  slide(true);
  head('SOURCES','출처와 전제','공식 홈페이지를 우선 확인했습니다', true);
  text({ t:'공식 자료', x:M, y:2.0, w:5.86, h:0.3, size:13, bold:true, color:C.gold });
  const src = ['선웨이 간호학 학사 — Bachelor of Nursing (Honours) 공식 페이지','선웨이 FIA 2026 Student Guide (PDF)','선웨이 FIST 2025 Student Guide (PDF)','IMU 간호학 학사 — Bachelor of Nursing 공식 페이지','IMU Foundation in Arts (FIA) · Foundation in Science (FIS)'];
  src.forEach((t,i)=>{
    const y = 2.38 + i*0.52;
    circle({ x:M, y:y+0.06, d:0.26, fill:C.mid, label:'✓', labelSize:10, labelColor:C.paper });
    text({ t, x:M+0.38, y, w:5.48, h:0.44, size:11, color:C.onDark, valign:'middle', lh:1.3 });
  });
  text({ t:'이 자료의 전제', x:M+6.07, y:2.0, w:5.86, h:0.3, size:13, bold:true, color:C.brick });
  const pre = ['학생 조건 — 고교 과학 미이수 · 수학 95점 · TOEFL iBT 80','환율 RM 1 ≈ 365원 (1·2편은 339원 기준)','기준일 2026년 9월 25일','선웨이 금액은 추정치 — 견적서로 확정 필요','학비는 매년 인상될 수 있음'];
  pre.forEach((t,i)=>{
    const y = 2.38 + i*0.52;
    circle({ x:M+6.07, y:y+0.06, d:0.26, fill:C.gold, label:String(i+1), labelSize:10, labelColor:C.ink });
    text({ t, x:M+6.45, y, w:5.48, h:0.44, size:11, color:C.onDark, valign:'middle', lh:1.3 });
  });
  rect({ x:M, y:5.2, w:CW, h:1.2, fill:C.deep, radius:0.08 });
  text({ t:'마지막으로', x:M+0.3, y:5.32, w:CW-0.6, h:0.26, size:11, bold:true, color:C.gold, cs:1.5 });
  text({ t:'모든 학비는 입학 전 학교 공식 견적서(Offer Letter)로 최종 확인해야 합니다. 특히 선웨이는 유학생 학비가 공개돼 있지 않아 이 자료의 금액이 바뀔 수 있습니다.\n이 자료는 간호학 단일 전공 기준입니다. 1편(테일러스·선웨이)·2편(모나쉬·노팅엄)과 환율 기준이 다르므로 총액을 직접 비교하지 마십시오.', x:M+0.3, y:5.6, w:CW-0.6, h:0.72, size:11.5, color:C.onDarkMute, lh:1.45 });
  note('이 슬라이드는 내부용입니다. 학부모 배포본에서는 빼셔도 됩니다.');
}

D.save('말레이시아유학_간호학편_선웨이_IMU.pptx', PREVIEW);
