// 말레이시아 유학 2편 — 해외 직영 캠퍼스편 (모나쉬 · 노팅엄)
const K = require('./deck_kit.js');
const D = K.createDeck('말레이시아 유학 2편 — 해외 직영 캠퍼스', 'wide');
const { slide, rect, circle, text, bullets, tableEl, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/part2-preview.html';
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

/* ═══ 01 표지 ═══ */
{
  slide(true);
  text({ t:'말레이시아 유학  2편', x:M, y:1.9, w:9, h:0.4, size:16, bold:true, color:C.gold, cs:3 });
  text({ t:'해외 직영\n캠퍼스편', x:M, y:2.4, w:9, h:1.9, size:54, bold:true, color:C.paper, lh:1.14 });
  text({ t:'모나쉬 말레이시아  ·  노팅엄 말레이시아', x:M, y:4.5, w:9, h:0.4, size:19, color:C.onDarkMute });
  rect({ x:M, y:5.1, w:CW, h:0.02, fill:C.deep });
  [['호주·영국 본교 학위','분교가 아니라 직영 캠퍼스'],['검정고시 경로','프로스펙터스 원문 확인'],['2027 학비','링깃·원화 기준']].forEach((c,i)=>{
    text({ t:c[0], x:M+i*4.0, y:5.3, w:3.8, h:0.3, size:14, bold:true, color:C.onDark });
    text({ t:c[1], x:M+i*4.0, y:5.64, w:3.8, h:0.28, size:11, color:C.onDarkMute });
  });
  text({ t:'필리핀 IM해외선교본부 · 말레이시아 지부   |   2026년 10월', x:M, y:H-0.72, w:CW, h:0.3, size:11, color:C.onDarkMute });
  note('1편이 말레이시아 사립 명문(테일러스·선웨이)이었다면, 2편은 호주·영국 대학이 직접 운영하는 캠퍼스입니다. 성격이 완전히 다릅니다.');
}

/* ═══ 02 1편과 무엇이 다른가 ═══ */
{
  slide(false);
  head('WHAT IS DIFFERENT','1편과 무엇이 다른가','같은 말레이시아 안에 있지만, 학위를 주는 주체가 다릅니다');
  const col = (x, tag, nm, tone, rows) => {
    rect({ x, y:2.0, w:5.86, h:3.5, fill:tone === 'dark' ? C.deep : C.sand, radius:0.08 });
    const on = tone === 'dark';
    text({ t:tag, x:x+0.3, y:2.18, w:5.26, h:0.26, size:11, bold:true, color:on?C.gold:C.mid, cs:1.5 });
    text({ t:nm, x:x+0.3, y:2.46, w:5.26, h:0.4, size:20, bold:true, color:on?C.paper:C.ink });
    rows.forEach((r,i)=>{
      text({ t:r[0], x:x+0.3, y:3.0+i*0.62, w:1.5, h:0.28, size:10.5, color:on?C.onDarkMute:C.muted });
      text({ t:r[1], x:x+1.9, y:3.0+i*0.62, w:3.66, h:0.52, size:12, color:on?C.onDark:C.text, lh:1.35 });
    });
  };
  col(M, '1편', '말레이시아 사립 명문', 'light', [
    ['해당 학교','테일러스 · 선웨이'],
    ['학위 주체','자체 학위 + 해외대 연계'],
    ['해외 학위','복수 학위 · 트위닝 · ADTP로 취득'],
    ['성격','말레이시아 대학이 해외와 손잡는 구조'],
  ]);
  col(M+6.07, '2편', '해외 직영 캠퍼스', 'dark', [
    ['해당 학교','모나쉬 말레이시아 · 노팅엄 말레이시아'],
    ['학위 주체','호주 모나쉬대 · 영국 노팅엄대 본교'],
    ['해외 학위','입학 순간부터 본교 학위 과정'],
    ['성격','해외 대학이 말레이시아에 캠퍼스를 둔 구조'],
  ]);
  rect({ x:M, y:5.68, w:CW, h:0.68, fill:C.goldSoft, radius:0.07 });
  text({ t:'핵심 차이 — 1편은 "말레이시아 학위 + 해외 학위"를 설계하는 문제이고, 2편은 처음부터 해외 본교 학위 하나입니다.', x:M+0.28, y:5.68, w:CW-0.56, h:0.68, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('학부모가 가장 헷갈리는 지점입니다. 분교라는 말보다 "직영 캠퍼스"가 정확합니다. 졸업장에 말레이시아 이야기가 없습니다.');
}

/* ═══ 03 두 대학 한눈에 ═══ */
{
  slide(false);
  head('AT A GLANCE','두 대학 한눈에','2027 프로스펙터스 기준');
  const uni = (x, nm, en, tone, stats, rows) => {
    rect({ x, y:2.0, w:5.86, h:4.1, fill:C.sand, radius:0.08 });
    text({ t:nm, x:x+0.3, y:2.18, w:5.26, h:0.4, size:21, bold:true, color:C.ink });
    text({ t:en, x:x+0.3, y:2.6, w:5.26, h:0.26, size:11, color:C.muted });
    stats.forEach((s,i)=>{
      const sx = x+0.3+i*1.78;
      rect({ x:sx, y:2.94, w:1.62, h:0.84, fill:tone, radius:0.06 });
      text({ t:s[0], x:sx, y:3.02, w:1.62, h:0.4, size:19, bold:true, color:C.gold, align:'center' });
      text({ t:s[1], x:sx, y:3.44, w:1.62, h:0.28, size:9, color:C.onDarkMute, align:'center' });
    });
    rows.forEach((r,i)=>{
      text({ t:r[0], x:x+0.3, y:3.96+i*0.52, w:1.5, h:0.28, size:10.5, color:C.muted });
      text({ t:r[1], x:x+1.9, y:3.96+i*0.52, w:3.66, h:0.44, size:11.5, color:C.text, lh:1.3 });
    });
  };
  uni(M, '모나쉬 말레이시아', 'Monash University Malaysia · 반다르선웨이', C.deep,
    [['#31','QS 2027 세계'],['8','캠퍼스(4개국)'],['92','출신 국가']],
    [['학위','호주 모나쉬대 본교 학위'],['학제','3~4년제 (호주식)'],['인테이크','2월 · 7월 · 10월'],['파운데이션','MUFY · DHES · 디플로마']]);
  uni(M+6.07, '노팅엄 말레이시아', 'University of Nottingham Malaysia · 스므니', C.deep,
    [['#16','QS 2027 영국'],['4,000+','재학생'],['74','출신 국가']],
    [['학위','영국 노팅엄대 본교 학위'],['학제','3년제 (영국식)'],['인테이크','9월 중심 (일부 2월)'],['파운데이션','Nottingham Foundation']]);
  bottom('※ 순위는 본교(모나쉬대·노팅엄대) 기준입니다. 노팅엄은 영국 러셀그룹 창립 멤버이며 QS 2027 세계 97위로 함께 표기합니다.');
  note('두 학교 모두 본교 순위를 내세웁니다. 직영 캠퍼스라 본교 학위가 나오므로 과장은 아니지만, 캠퍼스 자체의 순위는 아니라는 점은 말해 두십시오.');
}

/* ═══ 04 모나쉬 입학 경로 ═══ */
{
  slide(false);
  head('WAYS INTO MONASH','모나쉬 — 입학 경로','학력 수준에 따라 들어가는 문이 다릅니다. 프로스펙터스 10쪽 경로도입니다.');
  badge('프로스펙터스 p.10', 1.9);
  const lane = (y, tier, qual, arrow, dest, tone) => {
    rect({ x:M, y, w:2.5, h:0.9, fill:tone, radius:0.06 });
    text({ t:tier, x:M+0.18, y:y+0.12, w:2.14, h:0.3, size:12.5, bold:true, color:C.paper });
    text({ t:qual, x:M+0.18, y:y+0.44, w:2.14, h:0.34, size:9.5, color:C.gold, lh:1.2 });
    text({ t:'▶', x:2.9, y:y+0.3, w:0.34, h:0.3, size:14, color:C.gold, align:'center' });
    rect({ x:3.34, y, w:4.3, h:0.9, fill:C.sand, radius:0.06 });
    text({ t:arrow, x:3.52, y, w:3.94, h:0.9, size:12, color:C.text, valign:'middle', lh:1.3 });
    text({ t:'▶', x:7.78, y:y+0.3, w:0.34, h:0.3, size:14, color:C.gold, align:'center' });
    rect({ x:8.22, y, w:4.41, h:0.9, fill:C.deep, radius:0.06 });
    text({ t:dest, x:8.4, y, w:4.05, h:0.9, size:12, bold:true, color:C.paper, valign:'middle', lh:1.3 });
  };
  lane(2.0, '호주 12학년 수준', 'A-Level · IB · STPM · UEC · 캐나다 12학년', '추가 과정 없음', '모나쉬 말레이시아 학부 1학년\n(직행)', C.mid);
  lane(3.06, '호주 11학년 수준', 'SPM · O-Level · 한국 검정고시', 'MUFY (파운데이션 1년)\n또는 Diploma of Business (2년)', '학부 1학년\n(디플로마는 2학년)', C.brick);
  lane(4.12, '성적 미달 시', '정규 입학 요건에 못 미치는 경우', 'Diploma of Higher Education Studies\n(1년)', '학부 2학년 편입\n+ Graduate Certificate', C.gold);
  rect({ x:M, y:5.28, w:CW, h:1.1, fill:C.goldSoft, radius:0.07 });
  text({ t:'DHES가 숨은 카드입니다', x:M+0.28, y:5.4, w:CW-0.56, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'1년을 이수하면 Graduate Certificate를 받고 학부 2학년으로 들어갑니다. 즉 학사 과정과 같은 총 기간(3년) 안에 자격 두 개를 받습니다. 파운데이션을 거치면 보통 1년이 늘어나는데, DHES는 그 1년을 쓰지 않습니다.', x:M+0.28, y:5.7, w:CW-0.56, h:0.56, size:12, color:C.text, lh:1.4 });
  bottom('출처: Monash University Malaysia Undergraduate Prospectus 2027, p.10');
  note('이 슬라이드가 2편에서 가장 실용적입니다. 검정고시 학생은 두 번째 줄, 성적이 아쉬우면 세 번째 줄입니다. DHES는 기간 손해가 없다는 점을 꼭 말해 주십시오.');
}

/* ═══ 05 모나쉬 파운데이션·학비 ═══ */
{
  slide(false);
  head('MONASH PATHWAYS','모나쉬 — 파운데이션 세 가지','가장 중요한 사실부터 — MUFY는 모나쉬 캠퍼스가 아니라 선웨이 칼리지에서 합니다');
  badge('프로스펙터스 p.10', 1.9);
  tableEl({ x:M, y:2.0, w:CW, rowH:0.58, size:12,
    colW:[3.0, 2.6, 1.1, 1.9, 2.1, 1.233],
    rows:[
      ['과정','운영 기관','기간','인테이크','국제학생 학비','진입'],
      ['MUFY (Monash University Foundation Year)','선웨이 칼리지\n쿠알라룸푸르 · 조호바루','1년','1 · 7 · 8월','RM 17,850 ~ 29,350\n약 605만 ~ 995만 원','학부 1학년'],
      ['Diploma of Higher Education Studies','모나쉬 말레이시아','1년','2 · 7 · 10월','비과학 RM 49,440\n과학 RM 55,680','학부 2학년'],
      ['Diploma of Business','모나쉬 말레이시아','2년','2 · 7 · 10월','RM 42,240 (연간)','경영 2학년'],
    ]});
  rect({ x:M, y:4.5, w:5.86, h:1.32, fill:C.goldSoft, radius:0.08 });
  text({ t:'MUFY = 선웨이 칼리지 운영', x:M+0.3, y:4.62, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'말레이시아에서 MUFY는 선웨이 칼리지(쿠알라룸푸르·조호바루)에서만 운영합니다. 모나쉬 캠퍼스에서 하는 과정이 아닙니다. 호주 12학년 상당으로 인정되며, 호주·뉴질랜드·영국 대학에서도 통용됩니다.', x:M+0.3, y:4.94, w:5.26, h:0.76, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:4.5, w:5.86, h:1.32, fill:C.sand, radius:0.08 });
  text({ t:'DHES 진급 조건 — WAM', x:M+6.37, y:4.62, w:5.26, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'전 과목 통과 + 가중평균(WAM) 50 이상으로 문학·사회과학·경영·이학 진급, 정보기술은 WAM 60. 영어는 IELTS 5.5(각 5.0 이상), 미달 시 Monash English 선이수.', x:M+6.37, y:4.94, w:5.26, h:0.76, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M, y:5.94, w:CW, h:0.46, fill:C.brickSoft, radius:0.06 });
  text({ t:'공학 지망자 주의 — DHES로는 공학 2학년 진입이 안 됩니다 (프로스펙터스 각주 4: Monash College Diploma Part 2 이수자만 가능). 말레이시아에서 공학을 하려면 MUFY → 공학 1학년(4년) 경로입니다.', x:M+0.28, y:5.94, w:CW-0.56, h:0.46, size:11, bold:true, color:C.brick, valign:'middle' });
  bottom('출처: Monash University Malaysia Undergraduate Prospectus 2027, p.10 (MUFY AT A GLANCE) · p.55');
  note('MUFY를 모나쉬에서 하는 줄 아는 분이 많습니다. 선웨이 칼리지에서 합니다. 인테이크도 모나쉬 디플로마(2·7·10월)와 달라 1·7·8월입니다.');
}

/* ═══ 05b 파운데이션 인테이크 한눈에 ═══ */
{
  slide(false);
  head('FOUNDATION INTAKES','파운데이션 인테이크 한눈에','과정마다 입학 시기가 다릅니다. 이 표가 일정 설계의 출발점입니다.');
  const cal = [
    { nm:'MUFY (선웨이 칼리지)', months:[1,7,8], tone:C.gold },
    { nm:'모나쉬 DHES · Diploma of Business', months:[2,7,10], tone:C.deep },
    { nm:'노팅엄 Foundation Programme', months:[4,9], tone:C.mid },
  ];
  text({ t:'월', x:M+4.3, y:2.0, w:0.4, h:0.3, size:10, color:C.muted });
  for (let m=1; m<=12; m++){
    text({ t:String(m), x:M+4.5+(m-1)*0.62, y:2.0, w:0.56, h:0.3, size:10, color:C.muted, align:'center' });
  }
  cal.forEach((c,i)=>{
    const y = 2.4 + i*0.86;
    rect({ x:M, y, w:4.2, h:0.68, fill:C.sand, radius:0.06 });
    text({ t:c.nm, x:M+0.2, y, w:3.8, h:0.68, size:12, bold:true, color:C.ink, valign:'middle', lh:1.25 });
    for (let m=1; m<=12; m++){
      const x = M+4.5+(m-1)*0.62;
      const on = c.months.includes(m);
      rect({ x, y, w:0.56, h:0.68, fill:on?c.tone:C.line, radius:0.05 });
      if (on) text({ t:'●', x, y, w:0.56, h:0.68, size:13, color:c.tone===C.gold?C.ink:C.gold, align:'center', valign:'middle' });
    }
  });
  rect({ x:M, y:5.1, w:5.86, h:1.26, fill:C.goldSoft, radius:0.08 });
  text({ t:'모나쉬를 노린다면 선택지가 넓습니다', x:M+0.3, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'MUFY 1·7·8월과 DHES 2·7·10월을 합치면 사실상 연 5~6회 진입 기회가 있습니다. 한 번 놓쳐도 두세 달 뒤가 있습니다.', x:M+0.3, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.1, w:5.86, h:1.26, fill:C.brickSoft, radius:0.08 });
  text({ t:'노팅엄은 연 2회뿐입니다', x:M+6.37, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'4월과 9월만 있습니다. 검정고시 1회(4월) 합격 후 영사확인·어학을 마치면 그해 9월이 현실적인 목표입니다. 놓치면 이듬해 4월까지 기다립니다.', x:M+6.37, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  bottom('출처: Monash UG Prospectus 2027 p.10  |  UNM 브로셔 p.5');
  note('인테이크 횟수가 실제 일정에서 가장 큰 변수입니다. 모나쉬는 여유가 있고 노팅엄은 빡빡합니다.');
}

/* ═══ 06 모나쉬 학부·학비 ═══ */
{
  slide(false);
  head('MONASH UNDERGRADUATE','모나쉬 — 학부 과정과 학비','국제학생 기준 · 2027 fees · 환율 RM 1 ≈ 339원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.5, size:12.5,
    colW:[4.2, 1.3, 2.4, 2.2, 1.833],
    rows:[
      ['계열','기간','연간 학비 (RM)','연간 (원화)','인테이크'],
      ['문학·사회과학, 디지털미디어','3년','51,360 ~ 54,240','1,741만 ~ 1,839만','2 · 7 · 10월'],
      ['경영·상학, 응용데이터과학','3년','53,280 ~ 63,360','1,806만 ~ 2,148만','2 · 7 · 10월'],
      ['컴퓨터과학·정보기술','3년','53,760 ~ 62,880','1,822만 ~ 2,132만','2 · 7 · 10월'],
      ['공학 (화학·토목·전기·기계·소프트웨어 등)','4년','68,160','2,311만','2 · 7 · 10월'],
      ['약학·의학 계열','4~5년','최대 74,400 이상','2,522만 이상','2월'],
    ]});
  rect({ x:M, y:5.1, w:CW, h:1.26, fill:C.sand, radius:0.08 });
  text({ t:'검정고시 출신 대표 경로 — 총액 계산', x:M+0.3, y:5.22, w:CW-0.6, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'① DHES 1년 (RM 49,440) → 학부 2·3학년 (RM 51,360 × 2)  =  총 3년 · RM 152,160 · 약 5,158만 원   ← 가장 짧고 저렴', x:M+0.3, y:5.54, w:CW-0.6, h:0.3, size:12.5, color:C.text });
  text({ t:'② MUFY 1년 (RM 17,850~29,350) → 학부 1~3학년 (RM 51,360 × 3)  =  총 4년 · RM 171,930~183,430 · 약 5,828만~6,218만 원', x:M+0.3, y:5.86, w:CW-0.6, h:0.3, size:12.5, color:C.text });
  bottom('출처: Monash University Malaysia Undergraduate Prospectus 2027, p.56 · p.58 · p.60 ·  모든 학비에 6% 서비스세(SST) 별도');
  note('DHES 경로가 1년을 아낍니다. 같은 3년에 자격이 두 개 나옵니다. 이 계산을 꼭 보여 주십시오.');
}

/* ═══ 07 노팅엄 개요·파운데이션 ═══ */
{
  slide(false);
  head('NOTTINGHAM','노팅엄 — 캠퍼스와 파운데이션','48헥타르 열대우림 캠퍼스 · 영국 러셀그룹 창립 멤버');
  const f = [['1년','2학기 구성'],['4월 · 9월','연 2회 인테이크'],['RM 38,000','국제학생 · 과정 전체'],['150학점','핵심 4 + 선택 7']];
  f.forEach((s,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:1.1, fill:C.deep, radius:0.07 });
    text({ t:s[0], x:x+0.2, y:2.14, w:2.44, h:0.44, size:20, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.2, y:2.62, w:2.44, h:0.28, size:10.5, color:C.onDarkMute });
  });
  text({ t:'Nottingham Foundation Programme', x:M, y:3.26, w:CW, h:0.3, size:15, bold:true, color:C.ink });
  bullets({ x:M, y:3.6, w:5.86, h:1.5, size:12, gap:7, items:[
    '핵심 과목 — 영어 1·2, 비판적 사고, 지속가능성',
    '선택 과목 — 생물·화학·물리·수학·경영·경제·회계·심리·IT·프로그래밍 등',
    '이수 후 노팅엄 학부로 진학, 영국 본교 직접 진학 경로도 운영',
  ]});
  rect({ x:M+6.07, y:3.56, w:5.86, h:1.56, fill:C.goldSoft, radius:0.08 });
  text({ t:'노팅엄의 두 가지 차별점', x:M+6.37, y:3.68, w:5.26, h:0.28, size:12.5, bold:true, color:C.gold });
  text({ t:'① 학비 고정 — 과정 전체 기간 동안 학비가 오르지 않습니다 (지원비 제외).\n② 장학금 — 고득점자 15~25% 감면, 파운데이션 10~25% 감면이 자동 적용됩니다.', x:M+6.37, y:4.0, w:5.26, h:1.0, size:12, color:C.text, lh:1.45 });
  rect({ x:M, y:5.3, w:CW, h:1.06, fill:C.sand, radius:0.07 });
  text({ t:'2+1 — 3학년을 영국에서', x:M+0.3, y:5.42, w:CW-0.6, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'다수 학부 과정에서 3학년에 영국 본교의 동일 과정으로 이동할 수 있습니다. 성적과 비자 승인이 조건입니다. 중국 닝보 캠퍼스 이동 옵션도 있습니다.', x:M+0.3, y:5.74, w:CW-0.6, h:0.5, size:12, color:C.text, lh:1.4 });
  bottom('출처: University of Nottingham Malaysia 브로셔 p.1 · p.3 · p.5 ·  모든 학비에 6% 서비스세(SST) 별도');
  note('학비 고정은 다른 학교에 없는 장점입니다. 4~5년 과정에서는 체감이 큽니다.');
}

/* ═══ 08 노팅엄 학부·학비 ═══ */
{
  slide(false);
  head('NOTTINGHAM UNDERGRADUATE','노팅엄 — 학부 과정과 학비','국제학생 기준 · 연간 · 환율 RM 1 ≈ 339원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.5, size:12.5,
    colW:[4.2, 1.3, 2.4, 2.2, 1.833],
    rows:[
      ['계열','기간','연간 학비 (RM)','연간 (원화)','영국 이동'],
      ['공학 · 과학 계열','3년','52,000','1,763만','2+1 가능'],
      ['공학 일부 · 교육','4년','52,000 ~ 58,000','1,763만 ~ 1,966만','—'],
      ['인문·사회과학, 심리','3년','55,000','1,865만','2+1 가능'],
      ['경영·경제·금융 계열','3년','57,000','1,932만','2+1 가능'],
      ['파운데이션 (과정 전체)','1년','38,000','1,288만','—'],
    ]});
  rect({ x:M, y:5.1, w:CW, h:1.26, fill:C.sand, radius:0.08 });
  text({ t:'검정고시 출신 대표 경로 — 총액 계산', x:M+0.3, y:5.22, w:CW-0.6, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'파운데이션 1년 (RM 38,000) → 학부 1~3학년 3년  =  총 4년', x:M+0.3, y:5.54, w:CW-0.6, h:0.3, size:12.5, color:C.text });
  text({ t:'공학·과학 RM 194,000 (약 6,577만 원)   |   경영 RM 209,000 (약 7,085만 원)', x:M+0.3, y:5.86, w:CW-0.6, h:0.3, size:12.5, bold:true, color:C.ink });
  bottom('출처: University of Nottingham Malaysia 브로셔 p.5 · p.13~62 ·  6% 서비스세(SST) 별도 · 학비 고정 적용');
  note('노팅엄은 3년제라 학부 기간이 짧지만, 파운데이션이 1년 붙어 총 4년이 됩니다. 모나쉬 DHES 경로(3년)와 비교해 주십시오.');
}

/* ═══ 08b 노팅엄 영어 요건 ═══ */
{
  slide(false);
  head('NOTTINGHAM ENGLISH','노팅엄 — 영어 요건','In-Sessional English(교내 무료 영어과정)를 함께 듣느냐에 따라 기준이 달라집니다');
  badge('브로셔 p.9 · p.18', 2.0);
  text({ t:'파운데이션 입학 기준', x:M, y:2.0, w:5.86, h:0.3, size:14, bold:true, color:C.ink });
  tableEl({ x:M, y:2.38, w:5.86, rowH:0.46, size:11,
    colW:[1.6, 2.13, 2.13],
    rows:[
      ['시험','In-Sessional 포함','In-Sessional 없이'],
      ['IELTS (Academic)','5.5 (각 영역 5.0↑)','6.0 (각 영역 5.5↑)'],
      ['TOEFL iBT','72 (W16·L15·R14·S19)','80 (W·L17·R18·S20)'],
      ['PTE (Academic)','59 (각 53↑)','65 (각 59↑)'],
      ['MUET','—','Band 4'],
    ]});
  text({ t:'학부 입학 기준 (경영계열 예시)', x:M+6.07, y:2.0, w:5.86, h:0.3, size:14, bold:true, color:C.ink });
  tableEl({ x:M+6.07, y:2.38, w:5.86, rowH:0.46, size:11,
    colW:[1.6, 4.26],
    rows:[
      ['시험','요구 점수'],
      ['IELTS (Academic)','6.5 (각 영역 6.0 이상)'],
      ['TOEFL iBT','90 (W·L 19, R 20, S 22)'],
      ['PTE (Academic)','71 (각 영역 65 이상)'],
      ['MUET','Band 4.5'],
    ]});
  rect({ x:M, y:4.74, w:5.86, h:1.62, fill:C.sand, radius:0.08 });
  text({ t:'Pre-Sessional English — 조건부 합격자용', x:M+0.3, y:4.86, w:5.26, h:0.28, size:12.5, bold:true, color:C.deep });
  text({ t:'10주  IELTS 5.5~6.0 → +0.5밴드   RM 8,000\n20주  IELTS 5.0~5.5 → +1.0밴드   RM 13,000\n30주  IELTS 4.5~5.0 → +1.5밴드   RM 20,000', x:M+0.3, y:5.18, w:5.26, h:0.8, size:12, color:C.text, lh:1.5 });
  text({ t:'국제학생 기준 · IELTS 응시료 별도', x:M+0.3, y:6.0, w:5.26, h:0.26, size:10, color:C.muted });
  rect({ x:M+6.07, y:4.74, w:5.86, h:1.62, fill:C.brickSoft, radius:0.08 });
  text({ t:'반드시 확인할 세 가지', x:M+6.37, y:4.86, w:5.26, h:0.28, size:12.5, bold:true, color:C.brick });
  text({ t:'① 성적 유효기간은 2년입니다.\n② IELTS One Skill Retake는 인정됩니다.\n③ 온라인 시험은 불인정 — IELTS Academic Online, TOEFL iBT Home Edition, PTE Academic Online 모두 받지 않습니다.', x:M+6.37, y:5.18, w:5.26, h:1.0, size:11.5, color:C.text, lh:1.45 });
  bottom('※ 학부 요구 점수는 계열별로 다릅니다. 위는 경영계열 기준이며 지망 학과 기준으로 재확인하십시오.');
  note('③번이 실무에서 자주 걸립니다. 집에서 보는 온라인 시험 점수는 받지 않습니다. 반드시 시험장 응시로 안내하십시오.');
}

/* ═══ 09 검정고시 ═══ */
{
  slide(false);
  head('KOREAN QUALIFICATION','검정고시로 갈 수 있는가','프로스펙터스 원문을 직접 확인한 결과입니다');
  badge('원문 확인 완료', 1.8);
  rect({ x:M, y:2.0, w:5.86, h:2.5, fill:C.deep, radius:0.08 });
  text({ t:'모나쉬 — 명시되어 있습니다', x:M+0.3, y:2.16, w:5.26, h:0.3, size:14, bold:true, color:C.gold });
  rect({ x:M+0.3, y:2.54, w:5.26, h:0.72, fill:C.mid, radius:0.05 });
  text({ t:'SOUTH KOREA\nHigh School Graduation Equivalency Examination — 60%', x:M+0.46, y:2.54, w:4.94, h:0.72, size:11.5, bold:true, color:C.paper, valign:'middle', lh:1.3 });
  text({ t:'학부 프로스펙터스 2027, 55쪽 「MONASH PATHWAY PROGRAMS — ENTRY REQUIREMENTS」 표에 있습니다. 같은 표에 말레이시아 SPM, O-Level, 온타리오 고교 졸업장 등 호주 11학년 수준 자격이 함께 들어 있습니다.', x:M+0.3, y:3.36, w:5.26, h:0.9, size:11.5, color:C.onDark, lh:1.4 });
  rect({ x:M+6.07, y:2.0, w:5.86, h:2.5, fill:C.brickSoft, radius:0.08 });
  text({ t:'노팅엄 — 목록에 없습니다', x:M+6.37, y:2.16, w:5.26, h:0.3, size:14, bold:true, color:C.brick });
  text({ t:'학부 입학 자격표의 인정 학력', x:M+6.37, y:2.54, w:5.26, h:0.26, size:11, bold:true, color:C.deep });
  text({ t:'A Level · IB · STPM · UEC · Gaokao 및 중국 고교졸업장 · 인도 CBSE/CISCE · 호주 12학년 · 캐나다 OSSD · AP · 타기관 디플로마 · 타기관 파운데이션 · 노팅엄 파운데이션', x:M+6.37, y:2.82, w:5.26, h:0.78, size:11, color:C.text, lh:1.35 });
  text({ t:'한국 항목이 아예 없습니다. 브로셔 전체에서 "Korea"는 0회 등장합니다.', x:M+6.37, y:3.66, w:5.26, h:0.5, size:11.5, bold:true, color:C.brick, lh:1.35 });
  rect({ x:M, y:4.66, w:CW, h:1.7, fill:C.sand, radius:0.08 });
  text({ t:'결론 — 두 학교 모두 문과·이공계 구분 없이 파운데이션을 거칩니다', x:M+0.3, y:4.8, w:CW-0.6, h:0.3, size:14, bold:true, color:C.ink });
  text({ t:'모나쉬 입학처가 "검정고시는 계열 상관없이 무조건 파운데이션"이라고 안내한 것은 프로스펙터스와 일치합니다. 검정고시가 호주 12학년이 아니라 11학년 수준으로 분류되기 때문입니다.', x:M+0.3, y:5.14, w:CW-0.6, h:0.5, size:12, color:C.text, lh:1.4 });
  text({ t:'노팅엄은 한국 학력을 명시하지 않으므로, 노팅엄 파운데이션 또는 타기관 파운데이션(GPA 3.0/4.0 이상, 학교 재량) 경유가 현실적 경로입니다.', x:M+0.3, y:5.7, w:CW-0.6, h:0.5, size:12, color:C.text, lh:1.4 });
  bottom('출처: Monash UG Prospectus 2027 p.10 · p.55  |  UNM 브로셔 p.18 입학 자격표');
  note('입학처 안내가 맞았다는 것을 문서로 확인했습니다. 60%라는 구체적 커트라인까지 있으니 상담에서 바로 쓰실 수 있습니다.');
}

/* ═══ 10 GED ═══ */
{
  slide(false);
  head('GED','GED는 검정고시와 같은가','결론부터 — 같지 않습니다. 노팅엄은 입학처가 불가로 회신했습니다.');
  rect({ x:M, y:2.0, w:CW, h:1.2, fill:C.brickSoft, radius:0.08 });
  text({ t:'두 학교 자료 전체를 검색한 결과', x:M+0.3, y:2.14, w:CW-0.6, h:0.3, size:14, bold:true, color:C.brick });
  const g = [['모나쉬 학부 프로스펙터스','64쪽','GED 0회'],['모나쉬 대학원 프로스펙터스','48쪽','GED 0회'],['노팅엄 브로셔','157쪽','GED 0회']];
  g.forEach((r,i)=>{
    const x = M + 0.3 + i*3.9;
    text({ t:r[0], x, y:2.5, w:3.6, h:0.28, size:12, color:C.text });
    text({ t:r[1], x, y:2.78, w:1.2, h:0.28, size:11, color:C.muted });
    text({ t:r[2], x:x+1.3, y:2.78, w:2.3, h:0.28, size:12.5, bold:true, color:C.brick });
  });
  text({ t:'왜 이것이 중요한가', x:M, y:3.44, w:CW, h:0.3, size:14, bold:true, color:C.ink });
  bullets({ x:M, y:3.78, w:5.86, h:1.4, size:12, gap:7, items:[
    '모나쉬는 한국 검정고시를 국가명과 함께 명시했습니다 — 즉 심사 기준이 서 있습니다',
    'GED는 어느 자료에도 없습니다 — 기준이 공개돼 있지 않다는 뜻입니다',
    '노팅엄은 담당자가 불가로 회신 — 모나쉬는 아직 미확인',
  ]});
  rect({ x:M+6.07, y:3.74, w:5.86, h:1.48, fill:C.brickSoft, radius:0.08 });
  text({ t:'노팅엄 — 입학처 회신 확보', x:M+6.37, y:3.86, w:5.26, h:0.28, size:12.5, bold:true, color:C.brick });
  text({ t:'노팅엄 담당자는 GED로는 입학이 불가하다고 안내했습니다. 브로셔 파운데이션 입학 요건(p.9)에도 GED가 없어 자료와 일치합니다. 우회 경로는 다음 장에서 다룹니다.', x:M+6.37, y:4.18, w:5.26, h:0.9, size:12, color:C.text, lh:1.45 });
  rect({ x:M, y:5.34, w:CW, h:1.02, fill:C.deep, radius:0.08 });
  text({ t:'입학처 문의 문안', x:M+0.3, y:5.44, w:CW-0.6, h:0.24, size:11, bold:true, color:C.gold, cs:1 });
  text({ t:'Is the US GED (General Educational Development) accepted for entry into your Foundation / pathway programmes, and if so what minimum score? Is it treated the same as the Korean High School Graduation Equivalency Examination, which your prospectus lists at 60%?', x:M+0.3, y:5.7, w:CW-0.6, h:0.56, size:11, color:C.onDarkMute, lh:1.4 });
  bottom('');
  note('노팅엄은 불가가 확인됐습니다. 모나쉬는 아직입니다. 문안 그대로 보내 회신을 받아 두십시오.');
}

/* ═══ 10b GED 경로 ═══ */
{
  slide(false);
  head('GED ROUTE','GED로는 어떻게 들어가는가','노팅엄 담당자가 GED 불가라고 안내했다면, 우회 경로를 설계해야 합니다');
  rect({ x:M, y:2.0, w:CW, h:0.92, fill:C.brickSoft, radius:0.07 });
  text({ t:'노팅엄 파운데이션 입학 요건 (브로셔 p.9) — 여기에 GED도 검정고시도 없습니다', x:M+0.28, y:2.1, w:CW-0.56, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'만 16세 이상  ·  SPM/GCSE/IGCSE 최소 5C  ·  A Level DDD  ·  STPM C+C+C+  ·  UEC 5 B6s  ·  IB Diploma 24점  ·  호주 12학년 ATAR 56  ·  캐나다 OSSD 67%', x:M+0.28, y:2.42, w:CW-0.56, h:0.4, size:11.5, color:C.text, lh:1.4 });
  text({ t:'그렇다면 들어갈 수 있는 길은 네 가지입니다', x:M, y:3.1, w:CW, h:0.3, size:15, bold:true, color:C.ink });
  const routes = [
    { n:'A', t:'타기관 파운데이션 경유', d:'선웨이·테일러스 등에서 파운데이션을 이수하고 노팅엄 학부 1학년으로 지원합니다. 브로셔에 "Foundation — Other Institutions: 학교 재량, GPA 3.0/4.0 이상"으로 명시된 경로입니다.', tag:'가장 현실적', tone:C.deep },
    { n:'B', t:'타기관 디플로마 경유', d:'디플로마(2~2.5년)를 마치면 학부 2학년 진입을 케이스별로 심사합니다. 역시 GPA 3.0/4.0 이상과 관련 과목 우수 성적이 조건입니다.', tag:'2학년 진입', tone:C.mid },
    { n:'C', t:'A-Level 또는 IB 취득', d:'A Level DDD 이상 또는 IB 24점 이상이면 노팅엄 파운데이션에 바로 들어갑니다. 성적이 높으면 학부 직행도 가능합니다. 시간은 더 걸립니다.', tag:'정공법', tone:C.gold },
    { n:'D', t:'모나쉬로 방향 전환', d:'모나쉬는 한국 검정고시를 60% 기준으로 명시했습니다. 다만 GED는 모나쉬 자료에도 없으므로, GED 소지자라면 모나쉬에도 먼저 확인해야 합니다.', tag:'학교 변경', tone:C.brick },
  ];
  routes.forEach((r,i)=>{
    const x = M + (i%2)*6.07, y = 3.5 + Math.floor(i/2)*1.44;
    rect({ x, y, w:5.86, h:1.3, fill:C.sand, radius:0.08 });
    const lc = r.tone === C.gold ? C.ink : C.gold;
    circle({ x:x+0.26, y:y+0.2, d:0.4, fill:r.tone, label:r.n, labelSize:14, labelColor:lc });
    text({ t:r.t, x:x+0.78, y:y+0.16, w:3.4, h:0.3, size:13.5, bold:true, color:C.ink });
    rect({ x:x+4.3, y:y+0.18, w:1.32, h:0.3, fill:r.tone, radius:0.04 });
    text({ t:r.tag, x:x+4.3, y:y+0.18, w:1.32, h:0.3, size:9.5, bold:true, color:r.tone === C.brick ? C.paper : lc, align:'center', valign:'middle' });
    text({ t:r.d, x:x+0.78, y:y+0.52, w:4.84, h:0.68, size:11, color:C.text, lh:1.4 });
  });
  rect({ x:M, y:6.42, w:CW, h:0.0, fill:C.sand });
  bottom('출처: UNM 브로셔 p.9 (파운데이션 입학 요건) · p.18~19 (Diploma/Foundation — Other Institutions 조건)  |  A안을 택하면 1편의 선웨이·테일러스 파운데이션이 그대로 디딤돌이 됩니다.');
  note('A안이 가장 현실적입니다. 1편에서 다룬 선웨이·테일러스 파운데이션을 먼저 하고 GPA 3.0을 넘기면 노팅엄 학부로 올라갑니다. 1편과 2편이 여기서 이어집니다.');
}

/* ═══ 11 두 대학 비교 ═══ */
{
  slide(false);
  head('SIDE BY SIDE','모나쉬 vs 노팅엄','어느 쪽이 좋은 학교인가가 아니라, 어느 쪽이 이 학생에게 맞는가');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.5, size:12,
    colW:[2.6, 4.666, 4.666],
    rows:[
      ['기준','모나쉬 말레이시아','노팅엄 말레이시아'],
      ['본교 학위','호주 모나쉬대','영국 노팅엄대 (러셀그룹 창립 멤버)'],
      ['학제','3년제 (공학 4년)','3년제 (일부 4년)'],
      ['인테이크','2월 · 7월 · 10월 (연 3회)','9월 중심 (일부 2월)'],
      ['검정고시','프로스펙터스에 60% 명시','명시 없음 — 파운데이션 경유'],
      ['파운데이션','MUFY · DHES · 디플로마 (선택지 3개)','Nottingham Foundation (단일)'],
      ['최단 경로','DHES 1년 + 학부 2년 = 총 3년','파운데이션 1년 + 학부 3년 = 총 4년'],
      ['해외 본교 이동','공학 일부는 호주 이동 필수','2+1 선택 (영국 · 중국 닝보)'],
      ['학비 특징','계열별 편차 큼 (RM 51,360~74,400)','학비 고정 · 장학금 자동 적용'],
    ]});
  rect({ x:M, y:6.1, w:CW, h:0.5, fill:C.goldSoft, radius:0.06 });
  text({ t:'기간이 급하면 모나쉬 DHES, 영국 학위와 비용 예측 가능성이 중요하면 노팅엄입니다.', x:M+0.28, y:6.1, w:CW-0.56, h:0.5, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('마지막 행부터 읽으십시오. 학부모가 알고 싶은 것은 "우리 아이는 어디냐"입니다.');
}

/* ═══ 12 학비 비교 ═══ */
{
  slide(false);
  head('COST COMPARISON','졸업까지 학비 비교','검정고시 출신 기준 · 링깃과 원화로 통일 · 환율 RM 1 ≈ 339원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.54, size:12.5,
    colW:[4.0, 1.5, 2.5, 2.4, 1.533],
    rows:[
      ['경로','총 기간','총 학비 (RM)','총 학비 (원화)','연평균'],
      ['모나쉬 — DHES 1년 + 학부 2년','3년','152,160','약 5,158만','약 1,719만'],
      ['모나쉬 — MUFY 1년 + 학부 3년','4년','171,930 ~ 183,430','약 5,828만 ~ 6,218만','약 1,512만'],
      ['모나쉬 — MUFY + 공학 4년','5년','290,490 ~ 301,990','약 9,848만 ~ 1억 237만','약 2,009만'],
      ['노팅엄 — 파운데이션 + 공학·과학 3년','4년','38,000 + 156,000 = 194,000','약 6,577만','약 1,644만'],
      ['노팅엄 — 파운데이션 + 경영 3년','4년','38,000 + 171,000 = 209,000','약 7,085만','약 1,771만'],
    ]});
  rect({ x:M, y:5.34, w:5.86, h:1.02, fill:C.sand, radius:0.07 });
  text({ t:'1편(사립대)과 비교하면', x:M+0.3, y:5.46, w:5.26, h:0.26, size:12.5, bold:true, color:C.deep });
  text({ t:'선웨이 파운데이션+공학 5년이 약 5,810만~6,200만 원이었습니다. 직영 캠퍼스가 전반적으로 높지만, 받는 학위가 호주·영국 본교 명의입니다.', x:M+0.3, y:5.74, w:5.26, h:0.5, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.34, w:5.86, h:1.02, fill:C.brickSoft, radius:0.07 });
  text({ t:'여기에 더해야 할 것', x:M+6.37, y:5.46, w:5.26, h:0.26, size:12.5, bold:true, color:C.brick });
  text({ t:'6% 서비스세 · 생활비 월 RM 1,600~3,000 · 비자·보험·항공 · IM 공동체 운영비. 학비만으로 예산을 잡으면 안 됩니다.', x:M+6.37, y:5.74, w:5.26, h:0.5, size:11.5, color:C.text, lh:1.4 });
  bottom('※ 학비만 비교한 표입니다. MUFY 학비는 선웨이 칼리지 파운데이션 기준(RM 17,850~29,350)을 적용했습니다 · 6% 서비스세 별도.');
  note('모나쉬 DHES 3년 경로가 총액·기간 모두 가장 효율적입니다. 다만 성적 요건을 확인해야 합니다.');
}

/* ═══ 13 예산 — 입학비 1회 ═══ */
{
  slide(false);
  head('TOTAL BUDGET','졸업까지 총 예산','입학비는 공동체 입회 시 1회만 납부합니다 — 3년이든 5년이든 동일합니다');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.48, size:12,
    colW:[3.0, 2.98, 2.98, 2.973],
    rows:[
      ['항목','모나쉬 DHES 3년','노팅엄 4년 (공학·과학)','모나쉬 MUFY + 공학 5년'],
      ['1년차 학비 (파운데이션)','DHES 약 1,676만','파운데이션 약 1,288만','MUFY 약 800만'],
      ['2년차 이후 학비 (학부)','약 1,741만 / 년','약 1,763만 / 년','약 2,311만 / 년'],
      ['학생비자 갱신','약 140만 / 년','약 140만 / 년','약 140만 / 년'],
      ['IM 공동체 운영비','1,440만 / 년 (120×12)','1,440만 / 년 (120×12)','1,440만 / 년 (120×12)'],
      ['입학비 — 입회 시 1회','500만','500만','500만'],
      ['1년차 소계','약 3,756만','약 3,368만','약 2,880만'],
      ['2년차 이후 (연)','약 3,321만','약 3,343만','약 3,891만'],
      ['졸업까지 총액','약 1억 398만','약 1억 3,397만','약 1억 8,444만'],
    ]});
  rect({ x:M, y:5.9, w:CW, h:0.5, fill:C.goldSoft, radius:0.06 });
  text({ t:'입학비는 이전 공동체 입학금을 최대 200만 원까지 인정합니다.', x:M+0.28, y:5.9, w:CW-0.56, h:0.5, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('※ 입학비 500만 원은 1년차에만 포함했습니다. 수학 기간이 길어져도 늘지 않습니다 · MUFY는 선웨이 파운데이션 학비(RM 17,850~29,350) 평균 적용 · 6% 서비스세와 생활비 별도.');
  note('입학비는 공동체에 들어올 때 한 번만 냅니다. 3년이든 5년이든 같습니다. 표에서 1년차 소계에만 들어가 있는 이유입니다.');
}

/* ═══ 14 지원 일정 ═══ */
{
  slide(false);
  head('TIMELINE','지원 일정','인테이크가 다르므로 역산 시점도 다릅니다');
  const tl = (x, nm, tone, intake, rows) => {
    rect({ x, y:2.0, w:5.86, h:3.6, fill:C.sand, radius:0.08 });
    text({ t:nm, x:x+0.3, y:2.16, w:5.26, h:0.34, size:16, bold:true, color:C.ink });
    rect({ x:x+0.3, y:2.56, w:5.26, h:0.46, fill:tone, radius:0.05 });
    text({ t:intake, x:x+0.46, y:2.56, w:4.94, h:0.46, size:12, bold:true, color:C.gold, valign:'middle' });
    rows.forEach((r,i)=>{
      const y = 3.16 + i*0.58;
      circle({ x:x+0.3, y:y+0.06, d:0.3, fill:C.deep, label:String(i+1), labelSize:11, labelColor:C.gold });
      text({ t:r, x:x+0.72, y, w:4.84, h:0.46, size:11.5, color:C.text, valign:'middle', lh:1.3 });
    });
  };
  tl(M, '모나쉬 — 연 3회 (유리)', C.deep, '2월 · 7월 · 10월 인테이크',
    ['개강 12~16주 전 원서 접수','검정고시 합격 후 영사확인 2~3주','IELTS 5.5 확보 (파운데이션 기준)','EMGS 비자 심사 4~8주','놓쳐도 4개월 뒤 다음 인테이크']);
  tl(M+6.07, '노팅엄 — 9월 중심 (주의)', C.brick, '9월 중심 · 파운데이션은 4월 · 9월',
    ['9월 개강 기준 5월까지 원서 접수','검정고시 1회(4월) 합격 후 바로 착수','영사확인·어학 일정이 빡빡함','EMGS 비자 심사 4~8주','놓치면 파운데이션은 4월까지 대기']);
  rect({ x:M, y:5.74, w:CW, h:0.62, fill:C.brickSoft, radius:0.07 });
  text({ t:'노팅엄을 목표로 한다면 검정고시 1회(4월)를 반드시 잡으셔야 합니다. 2회(8월)로는 그해 9월 입학이 사실상 불가능합니다.', x:M+0.28, y:5.74, w:CW-0.56, h:0.62, size:12.5, bold:true, color:C.brick, valign:'middle' });
  bottom('※ 서류 인증은 아포스티유가 아니라 영사확인(외교부 → 주한 말레이시아 대사관)입니다. 말레이시아는 헤이그 아포스티유 협약 비가입국입니다.');
  note('인테이크 횟수가 실제로는 큰 차이입니다. 모나쉬는 연 3회라 한 번 놓쳐도 4개월 뒤가 있습니다.');
}

/* ═══ 15 확인 항목 ═══ */
{
  slide(true);
  head('CHECKLIST','확인해야 할 것','프로스펙터스로 확인된 것과, 입학처에 물어야 할 것을 나눴습니다', true);
  text({ t:'확인 완료 — 원문 근거 있음', x:M, y:2.0, w:5.86, h:0.3, size:13, bold:true, color:C.gold });
  const done = ['검정고시 = 호주 11학년 수준, 파운데이션 필수 (모나쉬 p.55, 60%)','MUFY는 선웨이 칼리지 운영 · 인테이크 1·7·8월','DHES로는 공학 2학년 진입 불가 (각주 4)','노팅엄 영어 요건 및 2+1 영국 이동 조건','노팅엄 GED 불가 — 입학처 회신 + 브로셔 p.9 일치'];
  done.forEach((t,i)=>{
    const y = 2.38 + i*0.56;
    circle({ x:M, y:y+0.06, d:0.26, fill:C.mid, label:'✓', labelSize:10, labelColor:C.paper });
    text({ t, x:M+0.38, y, w:5.48, h:0.46, size:11, color:C.onDark, valign:'middle', lh:1.3 });
  });
  text({ t:'입학처 확인 필요', x:M+6.07, y:2.0, w:5.86, h:0.3, size:13, bold:true, color:C.brick });
  const todo = ['모나쉬의 GED 인정 여부와 최소 점수 (자료에 없음)','MUFY 학비 — 선웨이 칼리지 공식 금액 재확인','노팅엄의 한국 검정고시 취급 기준','지망 학과별 원서 마감일','장학금 적용 조건과 감면 폭'];
  todo.forEach((t,i)=>{
    const y = 2.38 + i*0.56;
    circle({ x:M+6.07, y:y+0.06, d:0.26, fill:C.gold, label:String(i+1), labelSize:10, labelColor:C.ink });
    text({ t, x:M+6.45, y, w:5.48, h:0.46, size:11, color:C.onDark, valign:'middle', lh:1.3 });
  });
  rect({ x:M, y:5.3, w:CW, h:1.06, fill:C.deep, radius:0.08 });
  text({ t:'출처', x:M+0.3, y:5.4, w:CW-0.6, h:0.24, size:10.5, bold:true, color:C.gold, cs:1.5 });
  text({ t:'Monash University Malaysia — Undergraduate Prospectus 2027 (64쪽) · Postgraduate Prospectus 2027 (48쪽)  ·  University of Nottingham Malaysia 브로셔 (65쪽 + 92쪽)  ·  IM 말레이시아 입학안내문 2027', x:M+0.3, y:5.66, w:CW-0.6, h:0.6, size:11, color:C.onDarkMute, lh:1.4 });
  note('이 슬라이드는 내부용입니다. 학부모 배포본에서는 빼십시오.');
}

D.save('말레이시아유학_2편_해외직영캠퍼스.pptx', PREVIEW);
