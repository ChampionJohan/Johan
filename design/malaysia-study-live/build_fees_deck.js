// 학비와 예산 — 설명회용 소형 덱
const K = require('./deck_kit.js');
const D = K.createDeck('말레이시아 유학 학비와 예산', 'wide');
const { slide, rect, circle, text, tableEl, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/fees-preview.html';
const CW = W - 2*M;

function head(no, en, ko, sub, dark){
  rect({ x:M, y:0.52, w:0.62, h:0.62, fill:dark?C.gold:C.deep, radius:0.06 });
  text({ t:no, x:M, y:0.52, w:0.62, h:0.62, size:17, bold:true, color:dark?C.ink:C.gold, align:'center', valign:'middle' });
  text({ t:en, x:M+0.82, y:0.5, w:CW-0.82, h:0.26, size:11, bold:true, color:dark?C.gold:C.mid, cs:2 });
  text({ t:ko, x:M+0.82, y:0.74, w:CW-0.82, h:0.56, size:30, bold:true, color:dark?C.onDark:C.ink, lh:1.1 });
  if (sub) text({ t:sub, x:M, y:1.34, w:CW, h:0.58, size:13, color:dark?C.onDarkMute:C.muted, lh:1.3 });
}
const bottom = t => text({ t, x:M, y:H-0.5, w:CW, h:0.32, size:9, color:C.muted, lh:1.25 });

/* ── 1. 표지 ── */
{
  slide(true);
  text({ t:'학비와 예산', x:M, y:2.3, w:9, h:1.0, size:52, bold:true, color:C.paper, lh:1.1 });
  text({ t:'테일러스 · 선웨이  |  링깃(RM)과 원화 기준으로 통일', x:M, y:3.5, w:9, h:0.4, size:17, color:C.gold });
  rect({ x:M, y:4.2, w:CW, h:0.02, fill:C.deep });
  [['RM 1 ≈ 339원','환율 기준'],['+6%','외국인 서비스세'],['5년','공학 실제 기간']].forEach((c,i)=>{
    text({ t:c[0], x:M+i*4.0, y:4.44, w:3.8, h:0.5, size:26, bold:true, color:C.gold, lh:1 });
    text({ t:c[1], x:M+i*4.0, y:5.0, w:3.8, h:0.3, size:12, color:C.onDarkMute });
  });
  text({ t:'필리핀 IM해외선교본부 · 말레이시아 지부', x:M, y:H-0.72, w:CW, h:0.3, size:11, color:C.onDarkMute });
  note('학비 슬라이드만 따로 뽑은 덱입니다. 상담에서 예산 질문이 나올 때 이것만 띄우면 됩니다.');
}

/* ── 2. 표 읽는 법 ── */
{
  slide(false);
  head('01','HOW TO READ','학비 표 읽는 법','금액을 말하기 전에 이 네 가지를 먼저 맞춰야 오해가 없습니다');
  const rules = [
    ['총액인가, 연간인가','학교 자료는 둘을 섞어 표기합니다. 이 자료는 총액과 연간을 각각 다른 열로 분리했습니다.'],
    ['몇 년 과정인가','호텔·경영은 3년, 공학은 4년입니다. 파운데이션이 필요하면 여기에 1년이 더 붙습니다.'],
    ['어느 통화인가','선웨이 경영계열은 학교가 달러로 표기합니다. 이 자료는 전부 링깃으로 환산해 통일했습니다.'],
    ['세금이 붙는가','2025년 7월부터 외국인 학비에 6% 서비스세가 별도로 붙습니다. 표의 금액에는 포함돼 있지 않습니다.'],
  ];
  rules.forEach((r,i)=>{
    const x = M + (i%2)*6.07, y = 2.0 + Math.floor(i/2)*1.56;
    rect({ x, y, w:5.86, h:1.38, fill:C.sand, radius:0.08 });
    circle({ x:x+0.28, y:y+0.24, d:0.44, fill:C.deep, label:String(i+1), labelSize:15, labelColor:C.gold });
    text({ t:r[0], x:x+0.86, y:y+0.2, w:4.76, h:0.34, size:15, bold:true, color:C.ink });
    text({ t:r[1], x:x+0.86, y:y+0.58, w:4.76, h:0.68, size:11.5, color:C.text, lh:1.42 });
  });
  rect({ x:M, y:5.2, w:CW, h:0.8, fill:C.goldSoft, radius:0.07 });
  text({ t:'상담에서 쓸 한 문장', x:M+0.28, y:5.3, w:CW-0.56, h:0.26, size:12, bold:true, color:C.gold });
  text({ t:'"학비는 3년이냐 4년이냐, 파운데이션이 붙느냐에 따라 두 배까지 벌어집니다. 아이 전공을 먼저 정하고 나서 금액을 보십시오."', x:M+0.28, y:5.58, w:CW-0.56, h:0.34, size:13, bold:true, color:C.ink });
  bottom('');
  note('금액부터 말하면 학부모가 혼란스러워합니다. 이 네 가지를 먼저 맞추고 표로 들어가십시오.');
}

/* ── 3. 테일러스 학비 ── */
{
  slide(false);
  head('02',"TAYLOR'S FEES",'테일러스 학비','국제학생 기준 · 총 학비는 과정 전체 금액입니다');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.52, size:13,
    colW:[2.9, 1.1, 2.5, 2.7, 2.733],
    rows:[
      ['과정','기간','총 학비 (RM)','총 학비 (원화)','연간 (원화)'],
      ['파운데이션','1년','44,044','약 1,490만','약 1,490만'],
      ['국제호텔경영','3년','133,146','약 4,510만','약 1,500만'],
      ['기계공학','4년','200,736','약 6,810만','약 1,700만'],
      ['파운데이션 + 기계공학','5년','244,780','약 8,300만','약 1,660만'],
    ]});
  rect({ x:M, y:5.34, w:5.86, h:1.0, fill:C.sand, radius:0.07 });
  text({ t:'파운데이션이 필요한 계열', x:M+0.28, y:5.46, w:5.3, h:0.26, size:12, bold:true, color:C.deep });
  text({ t:'BEng 공학사(기계·화학 등), BSc 이학사(약학·데이터사이언스 등)는 파운데이션 1년을 먼저 이수해야 합니다.', x:M+0.28, y:5.74, w:5.3, h:0.5, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.34, w:5.86, h:1.0, fill:C.brickSoft, radius:0.07 });
  text({ t:'직행 가능 계열', x:M+6.35, y:5.46, w:5.3, h:0.26, size:12, bold:true, color:C.brick });
  text({ t:'호텔경영·관광(세계 26위), 경영학 계열 전체는 파운데이션 없이 본과로 바로 들어갑니다. 1년치 학비와 시간을 아낍니다.', x:M+6.35, y:5.74, w:5.3, h:0.5, size:11.5, color:C.text, lh:1.4 });
  bottom('환율 RM 1 ≈ 339원 기준 · 6% 서비스세 별도 · 금액은 대표 과정 기준이며 전공별 편차가 큽니다');
  note('공대 지망자는 5년 행을 보여 주십시오. 파운데이션이 붙어 총액이 크게 올라갑니다.');
}

/* ── 4. 선웨이 학비 ── */
{
  slide(false);
  head('03','SUNWAY FEES','선웨이 학비','국제학생 기준 · 달러 표기를 링깃으로 환산해 통일했습니다');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.52, size:13,
    colW:[2.9, 1.1, 2.5, 2.7, 2.733],
    rows:[
      ['과정','기간','총 학비 (RM)','총 학비 (원화)','연간 (원화)'],
      ['파운데이션','1년','17,850~29,350','약 610만~990만','약 610만~990만'],
      ['경영계열','3년','80,400~114,150','약 2,730만~3,870만','약 910만~1,290만'],
      ['공학계열','4년','153,568','약 5,210만','약 1,300만'],
      ['파운데이션 + 공학','5년','171,418~182,918','약 5,810만~6,200만','약 1,160만~1,240만'],
    ]});
  rect({ x:M, y:4.82, w:5.86, h:1.0, fill:C.sand, radius:0.07 });
  text({ t:'파운데이션이 필요한 계열', x:M+0.28, y:4.94, w:5.3, h:0.26, size:12, bold:true, color:C.deep });
  text({ t:'BEng 공학사(전자·화학 등), BSc 컴퓨터공학·바이오메디컬·순수과학은 파운데이션을 먼저 이수합니다.', x:M+0.28, y:5.22, w:5.3, h:0.5, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:4.82, w:5.86, h:1.0, fill:C.brickSoft, radius:0.07 });
  text({ t:'직행 가능 계열', x:M+6.35, y:4.94, w:5.3, h:0.26, size:12, bold:true, color:C.brick });
  text({ t:'BA 인문사회과학 전반, BSc 경영학·호텔경영학은 파운데이션 없이 본과로 바로 들어갑니다.', x:M+6.35, y:5.22, w:5.3, h:0.5, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M, y:5.94, w:CW, h:0.62, fill:C.goldSoft, radius:0.07 });
  text({ t:'랭커스터(영국) 복수 학위는 추가 비용이 없습니다 — 위 금액 그대로 영국 학위증을 함께 받습니다.', x:M+0.28, y:5.94, w:CW-0.56, h:0.62, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('환율 RM 1 ≈ 339원 기준 · 6% 서비스세 별도 · 경영계열은 학교가 달러로 표기한 금액을 환산한 값입니다');
  note('선웨이 경영계열만 달러 표기라 환산값임을 밝혀 두었습니다.');
}

/* ── 5. 같은 조건 비교 ── */
{
  slide(false);
  head('04','SIDE BY SIDE','같은 조건에서 비교하면','학비만 놓고 보면 선웨이가 낮습니다. 다만 강세 전공이 다릅니다.');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.56, size:13,
    colW:[3.2, 2.4, 3.1, 3.233],
    rows:[
      ['조건','기간','테일러스','선웨이'],
      ['파운데이션','1년','약 1,490만','약 610만~990만'],
      ['본과 직행 (호텔 / 경영)','3년','약 4,510만','약 2,730만~3,870만'],
      ['공학 본과','4년','약 6,810만','약 5,210만'],
      ['파운데이션 + 공학','5년','약 8,300만','약 5,810만~6,200만'],
    ]});
  rect({ x:M, y:5.06, w:5.86, h:1.3, fill:C.sand, radius:0.08 });
  text({ t:'그래도 테일러스를 택하는 이유', x:M+0.28, y:5.18, w:5.3, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'호텔·관광 세계 26위, 디자인·마케팅 세계 100위권. 이 분야가 목표라면 학비 차이를 상쇄합니다. 전공 폭도 12개 계열로 넓습니다.', x:M+0.28, y:5.5, w:5.3, h:0.7, size:12, color:C.text, lh:1.45 });
  rect({ x:M+6.07, y:5.06, w:5.86, h:1.3, fill:C.goldSoft, radius:0.08 });
  text({ t:'선웨이가 유리한 경우', x:M+6.35, y:5.18, w:5.3, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'회계·금융·계리·컴퓨터과학이 목표이거나, 추가 비용 없이 영국(랭커스터) 학위를 함께 받고 싶은 경우입니다.', x:M+6.35, y:5.5, w:5.3, h:0.7, size:12, color:C.text, lh:1.45 });
  bottom('※ 학비는 전공별 편차가 큽니다. 위 금액은 대표 과정 기준이며, 지망 학과 기준으로 다시 확인해야 합니다.');
  note('"어디가 싸냐"로 끝내지 마십시오. 전공이 정해지면 답이 바뀝니다.');
}

/* ── 6. 졸업까지 총 예산 ── */
{
  slide(false);
  head('05','TOTAL BUDGET','졸업까지 총 예산','학비 외에 공동체 운영비·비자 갱신·입학비가 함께 듭니다. 장학금은 반영하지 않았습니다.');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.5, size:12.5,
    colW:[2.9, 3.011, 3.011, 3.011],
    rows:[
      ['항목','테일러스 3년','선웨이 3년','공학 5년'],
      ['연간 학비','약 1,500만','910만~1,290만','1,430만~1,710만'],
      ['학생비자 갱신','약 140만','약 140만','약 140만'],
      ['IM 공동체 운영비','1,440만 (120×12)','1,440만 (120×12)','1,440만 (120×12)'],
      ['입학비 (1회)','500만','500만','500만'],
      ['연간 소계 (1년차)','3,500만~3,600만','3,000만~3,300만','3,500만~3,900만'],
      ['연간 소계 (2년차~)','3,000만~3,100만','2,500만~2,800만','3,000만~3,400만'],
      ['졸업까지 총액','9,500만~9,800만','8,000만~8,900만','1억 5,500만~1억 7,500만'],
    ]});
  rect({ x:M, y:6.2, w:CW, h:0.56, fill:C.brickSoft, radius:0.07 });
  text({ t:'공대·약대 지망자는 반드시 5년 예산으로 잡으십시오. 3년 과정과 총액이 두 배 가까이 차이 납니다.', x:M+0.28, y:6.2, w:CW-0.56, h:0.56, size:12.5, bold:true, color:C.brick, valign:'middle' });
  bottom('※ 입학비는 이전 공동체 입학금을 최대 200만 원까지 인정합니다. 성적우수자 장학 혜택은 별도입니다.');
  note('학부모가 실제로 알고 싶은 숫자는 마지막 행입니다. 여기부터 읽으셔도 됩니다.');
}

/* ── 7. 서비스세 ── */
{
  slide(false);
  head('06','SERVICE TAX','2025년 7월부터 붙는 6% 서비스세','외국인 학생의 학비에 부과됩니다. 앞의 표 금액에는 포함돼 있지 않습니다.');
  rect({ x:M, y:2.0, w:5.4, h:1.5, fill:C.deep, radius:0.08 });
  text({ t:'6%', x:M+0.34, y:2.16, w:2.0, h:0.8, size:48, bold:true, color:C.gold, lh:1 });
  text({ t:'비말레이시아 국적자 대상\n2025년 7월 1일 시행', x:M+2.5, y:2.34, w:2.6, h:0.8, size:13, bold:true, color:C.onDark, lh:1.4 });
  text({ t:'과정별 추가 부담 (학비 기준 추산)', x:M+5.8, y:2.0, w:6.13, h:0.3, size:14, bold:true, color:C.ink });
  const sst = [
    ['테일러스 호텔경영 3년','4,510만','약 270만'],
    ['테일러스 공학 5년','8,300만','약 500만'],
    ['선웨이 경영 3년','2,730만~3,870만','165만~230만'],
    ['선웨이 공학 5년','5,810만~6,200만','350만~370만'],
  ];
  sst.forEach((r,i)=>{
    const y = 2.4 + i*0.6;
    rect({ x:M+5.8, y, w:6.13, h:0.52, fill:i%2?C.paper:C.sand, lineColor:C.line, radius:0.05 });
    text({ t:r[0], x:M+6.02, y, w:2.6, h:0.52, size:11.5, color:C.text, valign:'middle' });
    text({ t:r[1], x:M+8.5, y, w:1.5, h:0.52, size:11, color:C.muted, valign:'middle', align:'right' });
    text({ t:r[2], x:M+10.1, y, w:1.6, h:0.52, size:12.5, bold:true, color:C.brick, valign:'middle', align:'right' });
  });
  rect({ x:M, y:3.7, w:5.4, h:1.62, fill:C.sand, radius:0.08 });
  text({ t:'제외되는 항목', x:M+0.34, y:3.84, w:4.72, h:0.26, size:12, bold:true, color:C.deep });
  text({ t:'국제학생 보증금(International Security Deposit)\nEMGS 신청 수수료', x:M+0.34, y:4.14, w:4.72, h:0.6, size:12, color:C.text, lh:1.45 });
  text({ t:'그 외 학비·부대비용 전반에 부과됩니다.', x:M+0.34, y:4.82, w:4.72, h:0.3, size:11.5, color:C.muted });
  rect({ x:M, y:5.52, w:CW, h:0.8, fill:C.goldSoft, radius:0.07 });
  text({ t:'예산을 세울 때', x:M+0.28, y:5.62, w:CW-0.56, h:0.26, size:12, bold:true, color:C.gold });
  text({ t:'앞 장의 졸업까지 총액에 학비의 6%를 더해 잡으십시오. 5년 과정이면 350만~500만 원, 3년 과정이면 165만~270만 원 수준이 추가됩니다.', x:M+0.28, y:5.9, w:CW-0.56, h:0.34, size:12.5, color:C.text });
  bottom('※ 추산치입니다. 실제 과세 범위와 금액은 학교 청구서 기준으로 확인하십시오.');
  note('작년에 새로 생긴 항목이라 기존 안내문에 빠져 있습니다. 예산 상담에서 빼먹으면 나중에 문제가 됩니다.');
}

/* ── 8. 확인 항목 ── */
{
  slide(true);
  head('07','CHECKLIST','확정해야 할 금액','아래 항목은 학교 공식 요금표로 확인해 확정하십시오', true);
  const items = [
    ['지망 학과별 학비','위 금액은 대표 과정 기준. 전공별 편차가 큼'],
    ['선웨이 경영계열 링깃 금액','학교가 달러로 표기 — 링깃 원표기 확인'],
    ['서비스세 과세 범위','학비 외 어떤 항목에 붙는지 청구서 기준 확인'],
    ['설명 당일 환율','RM 1 = 339원은 안내문 기준. 당일 환율로 재계산'],
    ['장학금 적용 여부','성적우수자 감면 폭을 오퍼레터 단계에서 확인'],
  ];
  items.forEach((it,i)=>{
    const x = M + (i%2)*6.07, y = 2.0 + Math.floor(i/2)*0.94;
    circle({ x, y:y+0.08, d:0.32, fill:C.gold, label:String(i+1), labelSize:12, labelColor:C.ink });
    text({ t:it[0], x:x+0.46, y:y, w:5.4, h:0.32, size:13, bold:true, color:C.onDark });
    text({ t:it[1], x:x+0.46, y:y+0.34, w:5.4, h:0.4, size:11, color:C.onDarkMute, lh:1.3 });
  });
  rect({ x:M, y:5.0, w:CW, h:1.1, fill:C.deep, radius:0.08 });
  text({ t:'산식 기준', x:M+0.3, y:5.12, w:CW-0.6, h:0.24, size:10.5, bold:true, color:C.gold, cs:1.5 });
  text({ t:'모든 원화 금액은 RM 1 = 339원으로 환산했습니다. 총 학비(RM) × 339 ÷ 10,000 = 원화(만 원). 연간 금액은 총액을 수학 기간으로 나눈 값입니다. 선웨이 경영계열은 학교가 달러로 표기한 금액을 원화로 환산한 뒤 링깃으로 역산했습니다.', x:M+0.3, y:5.38, w:CW-0.6, h:0.62, size:11, color:C.onDarkMute, lh:1.45 });
  text({ t:'출처: IM 말레이시아 입학안내문 2027 · 두 학교 공식 학비 안내 · 말레이시아 서비스세(SST) 개정 안내', x:M, y:6.3, w:CW, h:0.3, size:10.5, color:C.onDarkMute });
  note('이 슬라이드는 내부용입니다. 학부모 배포본에서는 빼십시오.');
}

D.save('말레이시아유학_학비와예산.pptx', PREVIEW);
