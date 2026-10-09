// 말레이시아 유학 2편 — 해외 직영 캠퍼스편 (수정판 2차)
// 입학 조건을 한 페이지로 통합 · 지원 일정을 파운데이션 입학 기준으로 재작성
const K = require('./deck_kit.js');
const D = K.createDeck('말레이시아 유학 2편 — 해외 직영 캠퍼스', 'wide');
const { slide, rect, circle, text, bullets, tableEl, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/part2v2-preview.html';
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
  text({ t:'말레이시아 유학  2편', x:M, y:1.9, w:9, h:0.4, size:16, bold:true, color:C.gold, cs:3 });
  text({ t:'해외 직영\n캠퍼스편', x:M, y:2.4, w:9, h:1.9, size:54, bold:true, color:C.paper, lh:1.14 });
  text({ t:'모나쉬 말레이시아  ·  노팅엄 말레이시아', x:M, y:4.5, w:9, h:0.4, size:19, color:C.onDarkMute });
  rect({ x:M, y:5.1, w:CW, h:0.02, fill:C.deep });
  [['호주·영국 본교 학위','분교가 아니라 직영 캠퍼스'],['입학 조건','검정고시 · 공인 영어'],['학비','링깃·원화 기준']].forEach((c,i)=>{
    text({ t:c[0], x:M+i*4.0, y:5.3, w:3.8, h:0.3, size:14, bold:true, color:C.onDark });
    text({ t:c[1], x:M+i*4.0, y:5.64, w:3.8, h:0.28, size:11, color:C.onDarkMute });
  });
  text({ t:'필리핀 IM해외선교본부 · 말레이시아 지부', x:M, y:H-0.72, w:CW, h:0.3, size:11, color:C.onDarkMute });
  note('1편은 말레이시아 사립 명문 테일러스·선웨이였고, 오늘은 호주·영국 대학이 직접 운영하는 캠퍼스입니다. 성격이 완전히 다릅니다.');
}

/* ── 2. 1편과 무엇이 다른가? ── */
{
  slide(false);
  head('WHAT IS DIFFERENT','1편과 무엇이 다른가?','같은 말레이시아 안에 있지만, 학위를 주는 주체가 다릅니다');
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
    ['학위 주체','호주 모나쉬 · 영국 노팅엄 본교'],
    ['해외 학위','입학 순간부터 본교 학위 과정'],
    ['성격','해외 대학이 말레이시아에 캠퍼스를 둔 구조'],
  ]);
  rect({ x:M, y:5.68, w:CW, h:0.68, fill:C.goldSoft, radius:0.07 });
  text({ t:'핵심 차이 — 1편은 "말레이시아 학위 + 해외 학위"를 설계하는 것이고, 2편은 처음부터 해외 본교 학위 하나입니다!', x:M+0.28, y:5.68, w:CW-0.56, h:0.68, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('분교라는 말보다 "직영 캠퍼스"가 정확합니다. 졸업장에 말레이시아 이야기가 없습니다.');
}

/* ── 3. 두 대학 한눈에 ── */
{
  slide(false);
  head('AT A GLANCE','두 대학 한눈에','2027 프로스펙터스 · 브로셔 기준');
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
    [['#31','QS 2027 세계'],['9,000+','재학생'],['92','출신 국가']],
    [['학위','호주 모나쉬대 본교 학위'],['학제','3년제 · 공학 4년 (호주식)'],['인테이크','2월 · 7월 · 10월'],['파운데이션','MUFY (선웨이) · DHES']]);
  uni(M+6.07, '노팅엄 말레이시아', 'University of Nottingham Malaysia · 스므니', C.deep,
    [['#97','QS 2027 세계'],['4,000+','재학생'],['74','출신 국가']],
    [['학위','영국 노팅엄대 본교 학위'],['학제','3년제 · 공학(MEng) 4년'],['인테이크','9월'],['파운데이션','Nottingham Foundation']]);
  bottom('');
  note('두 학교 모두 공학은 4년입니다. 노팅엄 공학은 MEng(석사통합) 학위라 4년입니다.');
}

/* ── 4. 입학 조건 — 검정고시 · 공인 영어 (통합) ── */
{
  slide(false);
  head('ENTRY REQUIREMENTS','입학 조건 — 검정고시 · 공인 영어','두 학교 모두 문과·이공계 구분 없이 파운데이션을 거칩니다');
  rect({ x:M, y:1.98, w:CW, h:1.0, fill:C.deep, radius:0.08 });
  text({ t:'검정고시 평균 90점 이상', x:M+0.34, y:2.12, w:5.2, h:0.44, size:26, bold:true, color:C.gold, lh:1 });
  text({ t:'모나쉬 · 노팅엄 공통 지원 기준', x:M+0.34, y:2.6, w:5.2, h:0.28, size:12, color:C.onDarkMute });
  text({ t:'검정고시는 호주 12학년이 아니라 11학년 수준으로 분류됩니다.\n그래서 계열과 무관하게 파운데이션 1년을 먼저 거칩니다.', x:M+5.9, y:2.14, w:6.0, h:0.72, size:13, color:C.onDark, lh:1.45 });

  text({ t:'공인 영어 — 파운데이션 입학', x:M, y:3.2, w:5.86, h:0.32, size:15, bold:true, color:C.ink });
  tableEl({ x:M, y:3.58, w:5.86, rowH:0.52, size:12.5,
    colW:[1.9, 1.98, 1.98],
    rows:[
      ['시험','모나쉬','노팅엄'],
      ['IELTS (Academic)','5.5 (각 5.0 이상)','6.0 (각 5.5 이상)'],
      ['TOEFL iBT','60 이상 권장','80 이상 권장'],
    ]});
  text({ t:'공인 영어 — 학사 (본과) 입학', x:M+6.07, y:3.2, w:5.86, h:0.32, size:15, bold:true, color:C.ink });
  tableEl({ x:M+6.07, y:3.58, w:5.86, rowH:0.52, size:12.5,
    colW:[1.9, 1.98, 1.98],
    rows:[
      ['시험','모나쉬','노팅엄'],
      ['IELTS (Academic)','6.5 (각 6.0 이상)','6.5 (각 6.0 이상)'],
      ['TOEFL iBT','80 이상 권장','90 이상 권장'],
    ]});

  rect({ x:M, y:5.38, w:5.86, h:1.0, fill:C.brickSoft, radius:0.08 });
  text({ t:'온라인 시험은 받지 않습니다', x:M+0.3, y:5.5, w:5.26, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'집에서 보는 TOEFL Home Edition, IELTS Online, PTE Online은 두 학교 모두 불인정입니다. 반드시 시험장 응시로 준비하십시오.', x:M+0.3, y:5.8, w:5.26, h:0.5, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.38, w:5.86, h:1.0, fill:C.goldSoft, radius:0.08 });
  text({ t:'미달해도 길이 있습니다', x:M+6.37, y:5.5, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'모나쉬는 Monash English(ME), 노팅엄은 Pre-Sessional English(10 · 20 · 30주)를 먼저 이수하면 됩니다. 성적 유효기간은 2년입니다.', x:M+6.37, y:5.8, w:5.26, h:0.5, size:11.5, color:C.text, lh:1.4 });
  bottom('※ 위 영어 점수는 합격선을 고려한 권장치입니다. 프로스펙터스에 공시된 최저 기준은 모나쉬 파운데이션 TOEFL iBT 46 · 학사 79입니다 (Monash UG Prospectus 2027 p.53 · p.55, UNM 브로셔 p.9 · p.18).');
  note('검정고시 90점, 영어 권장 점수 — 이 두 가지가 상담에서 가장 먼저 나오는 질문입니다. 공시 최저로 안내하면 나중에 탈락합니다.');
}

/* ── 5. 모나쉬 — 입학 경로 ── */
{
  slide(false);
  head('WAYS INTO MONASH','모나쉬 — 입학 경로','학력 수준에 따라 들어가는 문이 다릅니다 · 프로스펙터스 10쪽 경로도');
  badge('프로스펙터스 p.10', 1.9);
  const lane = (y, tier, qual, mid_, dest, tone) => {
    const on = tone === C.gold ? C.ink : C.paper;
    const sub = tone === C.gold ? C.ink : C.gold;
    rect({ x:M, y, w:2.2, h:0.9, fill:tone, radius:0.06 });
    text({ t:tier, x:M+0.16, y:y+0.1, w:1.88, h:0.3, size:12, bold:true, color:on });
    text({ t:qual, x:M+0.16, y:y+0.42, w:1.88, h:0.38, size:9, color:sub, lh:1.2 });
    text({ t:'▶', x:2.96, y:y+0.3, w:0.34, h:0.3, size:14, color:C.gold, align:'center' });
    rect({ x:3.34, y, w:4.3, h:0.9, fill:C.sand, radius:0.06 });
    text({ t:mid_, x:3.52, y, w:3.94, h:0.9, size:12, color:C.text, valign:'middle', lh:1.3 });
    text({ t:'▶', x:7.78, y:y+0.3, w:0.34, h:0.3, size:14, color:C.gold, align:'center' });
    rect({ x:8.22, y, w:4.41, h:0.9, fill:C.deep, radius:0.06 });
    text({ t:dest, x:8.4, y, w:4.05, h:0.9, size:12, bold:true, color:C.paper, valign:'middle', lh:1.3 });
  };
  lane(2.0, '호주 12학년 수준', 'A-Level · IB · STPM · UEC · 캐나다 12학년', '추가 과정 없음', '학부 1학년 직행', C.mid);
  lane(3.06, '호주 11학년 수준', 'SPM · O-Level · 한국 검정고시', 'MUFY — 파운데이션 1년\n(선웨이 칼리지에서 이수)', '학부 1학년', C.brick);
  lane(4.12, 'DHES 대안', '검정고시 & 영어 성적이 탁월한 경우', 'DHES — Diploma of Higher\nEducation Studies 1년', '학부 2학년 편입\n+ Graduate Certificate', C.gold);
  rect({ x:M, y:5.28, w:CW, h:1.1, fill:C.goldSoft, radius:0.07 });
  text({ t:'DHES (Diploma of Higher Education Studies)', x:M+0.28, y:5.4, w:CW-0.56, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'1년을 이수하면 Graduate Certificate를 받고 학부 2학년으로 들어갑니다. 즉 학사 과정과 같은 총 3년 안에 졸업을 하게 됩니다!\n파운데이션(MUFY)을 거치면 총 4년이 되는데, DHES는 그 1년을 쓰지 않습니다.', x:M+0.28, y:5.7, w:CW-0.56, h:0.56, size:12, color:C.text, lh:1.4 });
  bottom('출처: Monash University Malaysia Undergraduate Prospectus 2027, p.10 (WAYS INTO MONASH)');
  note('검정고시 학생은 두 번째 줄이 기본, 성적과 영어가 좋으면 세 번째 줄입니다. DHES는 기간 손해가 없다는 점을 꼭 말해 주십시오.');
}

/* ── 6. 모나쉬 — 파운데이션 두 가지 ── */
{
  slide(false);
  head('MONASH PATHWAYS','모나쉬 — 파운데이션 두 가지','MUFY와 DHES입니다 · 운영 기관과 인테이크가 서로 다릅니다');
  badge('프로스펙터스 p.10', 1.9);
  tableEl({ x:M, y:2.0, w:CW, rowH:0.62, size:12,
    colW:[3.0, 2.6, 1.1, 1.9, 2.1, 1.233],
    rows:[
      ['과정','운영 기관','기간','인테이크','국제학생 학비','진입'],
      ['MUFY\n(Monash University Foundation Year)','선웨이 칼리지','1년','1 · 7 · 8월','RM 17,850 ~ 29,350\n약 605만 ~ 995만 원','학부 1학년'],
      ['DHES\n(Diploma of Higher Education Studies)','모나쉬 말레이시아','1년','2 · 7 · 10월','비과학 RM 49,440 · 약 1,676만 원\n과학 RM 55,680 · 약 1,888만 원','학부 2학년'],
    ]});
  rect({ x:M, y:4.0, w:5.86, h:1.36, fill:C.goldSoft, radius:0.08 });
  text({ t:'MUFY는 모나쉬가 아니라 선웨이에서 합니다', x:M+0.3, y:4.12, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'말레이시아에서 MUFY는 선웨이 칼리지에서만 운영합니다. 모나쉬 캠퍼스에서 하는 과정이 아닙니다. 호주 12학년 상당으로 인정되어 호주·뉴질랜드·영국 대학에도 통용됩니다.', x:M+0.3, y:4.44, w:5.26, h:0.8, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:4.0, w:5.86, h:1.36, fill:C.sand, radius:0.08 });
  text({ t:'DHES 진급 조건 — WAM', x:M+6.37, y:4.12, w:5.26, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'전 과목 통과 + 가중평균(WAM) 50 이상으로 문학·사회과학·경영·이학 진급, 정보기술은 WAM 60. 영어는 IELTS 5.5(각 5.0 이상)이며 미달 시 Monash English를 선이수합니다.', x:M+6.37, y:4.44, w:5.26, h:0.8, size:11.5, color:C.text, lh:1.4 });
  rect({ x:M, y:5.5, w:CW, h:0.72, fill:C.brickSoft, radius:0.07 });
  text({ t:'공학 지망자 주의', x:M+0.28, y:5.58, w:CW-0.56, h:0.26, size:12.5, bold:true, color:C.brick });
  text({ t:'DHES로는 공학 2학년 진입이 안 됩니다. 공학을 하려면 MUFY → 공학 1학년 경로이며, 공학이 4년이므로 총 5년이 됩니다.', x:M+0.28, y:5.86, w:CW-0.56, h:0.3, size:11.5, color:C.text, lh:1.4 });
  bottom('출처: Monash UG Prospectus 2027, p.10 (MUFY AT A GLANCE) · p.55 · p.58  |  MUFY 학비는 선웨이 칼리지 파운데이션 기준 · 환율 RM 1 ≈ 339원 · 6% 서비스세(SST) 별도');
  note('MUFY를 모나쉬에서 하는 줄 아는 분이 많습니다. 선웨이 칼리지에서 합니다. 인테이크도 1·7·8월로 DHES(2·7·10월)와 다릅니다.');
}

/* ── 7. 모나쉬 — 학부 과정과 학비 ── */
{
  slide(false);
  head('MONASH UNDERGRADUATE','모나쉬 — 학부 과정과 학비','*국제학생 기준 · 2027 fees · 환율 RM 1 ≈ 339원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.52, size:12.5,
    colW:[4.2, 1.3, 2.4, 2.2, 1.833],
    rows:[
      ['계열','기간','연간 학비 (RM)','연간 (원화)','인테이크'],
      ['문학·사회과학, 디지털미디어','3년','51,360 ~ 54,240','1,741만 ~ 1,839만','2 · 7 · 10월'],
      ['경영·상학, 응용데이터과학','3년','53,280 ~ 63,360','1,806만 ~ 2,148만','2 · 7 · 10월'],
      ['컴퓨터과학·정보기술','3년','53,760 ~ 62,880','1,822만 ~ 2,132만','2 · 7 · 10월'],
      ['공학 (화학·토목·전기·기계·소프트웨어 등)','4년','68,160','2,311만','2 · 7 · 10월'],
    ]});
  rect({ x:M, y:4.76, w:CW, h:1.6, fill:C.sand, radius:0.08 });
  text({ t:'검정고시 출신 대표 경로 — 졸업까지 학비 총액', x:M+0.3, y:4.88, w:CW-0.6, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'① DHES 1년 (RM 49,440) → 학부 2·3학년 (RM 51,360 × 2)   =   총 3년 · RM 152,160 · 약 5,158만 원      ← 시간, 비용 절약!', x:M+0.3, y:5.2, w:CW-0.6, h:0.3, size:12.5, bold:true, color:C.ink });
  text({ t:'② MUFY 1년 (RM 17,850~29,350) → 학부 1~3학년 (RM 51,360 × 3)   =   총 4년 · RM 171,930~183,430 · 약 5,828만~6,218만 원', x:M+0.3, y:5.54, w:CW-0.6, h:0.3, size:12.5, color:C.text });
  text({ t:'③ MUFY 1년 → 공학 1~4학년 (RM 68,160 × 4)   =   총 5년 · RM 290,490~301,990 · 약 9,848만~1억 237만 원', x:M+0.3, y:5.88, w:CW-0.6, h:0.3, size:12.5, color:C.text });
  bottom('*모든 학비에 6% 서비스세(SST) 별도  |  출처: Monash University Malaysia Undergraduate Prospectus 2027, p.56 · p.58 · p.60');
  note('DHES 경로가 1년을 아낍니다. 같은 3년에 졸업합니다. 공학은 4년이라 총 5년이 된다는 점을 분명히 하십시오.');
}

/* ── 8. 노팅엄 — 파운데이션 ── */
{
  slide(false);
  head('NOTTINGHAM','노팅엄 — 파운데이션','48헥타르 열대우림 캠퍼스 · 영국 러셀그룹 창립 멤버');
  const f = [['1년','2학기 구성'],['4월 · 9월','연 2회 인테이크'],['RM 38,000','약 1,288만 원 · 과정 전체'],['150학점','핵심 4 + 선택 7']];
  f.forEach((s,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:1.1, fill:C.deep, radius:0.07 });
    text({ t:s[0], x:x+0.2, y:2.14, w:2.44, h:0.44, size:20, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.2, y:2.62, w:2.44, h:0.28, size:10.5, color:C.onDarkMute });
  });
  text({ t:'Nottingham Foundation Programme', x:M, y:3.26, w:CW, h:0.3, size:15, bold:true, color:C.ink });
  bullets({ x:M, y:3.62, w:5.86, h:1.5, size:12, gap:7, items:[
    '핵심 과목 — 영어 1·2, 비판적 사고, 지속가능성',
    '선택 과목 — 생물·화학·물리·수학·경영·경제·회계·심리·IT·프로그래밍',
    '이수 후 노팅엄 학부로 진학하며, 영국 본교 직접 진학 경로도 운영',
  ]});
  rect({ x:M+6.07, y:3.56, w:5.86, h:1.56, fill:C.goldSoft, radius:0.08 });
  text({ t:'* 노팅엄의 장점', x:M+6.37, y:3.68, w:5.26, h:0.28, size:12.5, bold:true, color:C.gold });
  text({ t:'① 학비 고정 — 과정 전체 기간 동안 학비가 오르지 않습니다 (지원비 제외).\n② 장학금 — 고득점자 15~25% 감면, 파운데이션 10~25% 감면이 자동 적용됩니다.', x:M+6.37, y:4.0, w:5.26, h:1.0, size:12, color:C.text, lh:1.45 });
  rect({ x:M, y:5.3, w:CW, h:1.06, fill:C.sand, radius:0.07 });
  text({ t:'* 영국 본교로 이동할 수 있습니다', x:M+0.3, y:5.42, w:CW-0.6, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'학부 과정은 2+1로 3학년을 영국에서 이수할 수 있고, 공학(MEng)은 2+2 또는 3+1로 영국 캠퍼스로 이동합니다. 성적과 비자 승인이 조건이며 중국 닝보 캠퍼스 옵션도 있습니다.', x:M+0.3, y:5.74, w:CW-0.6, h:0.5, size:12, color:C.text, lh:1.4 });
  bottom('출처: University of Nottingham Malaysia 브로셔 p.1 · p.3 · p.5  |  환율 RM 1 ≈ 339원 · 6% 서비스세(SST) 별도');
  note('학비 고정은 다른 학교에 없는 장점입니다. 공학 5년 과정에서 체감이 큽니다.');
}

/* ── 9. 노팅엄 — 학부 과정과 학비 ── */
{
  slide(false);
  head('NOTTINGHAM UNDERGRADUATE','노팅엄 — 학부 과정과 학비','국제학생 기준 · 연간 · 환율 RM 1 ≈ 339원');
  badge('공학은 4년', 1.5);
  tableEl({ x:M, y:2.0, w:CW, rowH:0.52, size:12.5,
    colW:[4.2, 1.3, 2.4, 2.2, 1.833],
    rows:[
      ['계열','기간','연간 학비 (RM)','연간 (원화)','영국 이동'],
      ['파운데이션 (과정 전체)','1년','38,000','1,288만','—'],
      ['경영·경제·금융 계열','3년','57,000','1,932만','2+1 가능'],
      ['인문·사회과학, 심리','3년','55,000','1,865만','2+1 가능'],
      ['이학 BSc (생명과학·컴퓨터과학 등)','3년','52,000','1,763만','2+1 가능'],
      ['공학 MEng (화학·토목·전기전자·기계·메카트로닉)','4년','67,000','2,271만','2+2 또는 3+1'],
    ]});
  rect({ x:M, y:5.3, w:5.86, h:1.06, fill:C.sand, radius:0.08 });
  text({ t:'검정고시 출신 대표 경로 — 학비 총액', x:M+0.3, y:5.4, w:5.26, h:0.26, size:12.5, bold:true, color:C.deep });
  text({ t:'파운데이션 + 인문·사회 3년 = 총 4년 · RM 203,000 · 약 6,882만 원\n파운데이션 + 공학 MEng 4년 = 총 5년 · RM 306,000 · 약 1억 374만 원', x:M+0.3, y:5.68, w:5.26, h:0.56, size:12, color:C.text, lh:1.45 });
  rect({ x:M+6.07, y:5.3, w:5.86, h:1.06, fill:C.goldSoft, radius:0.08 });
  text({ t:'공학은 MEng 학사 + 석사 통합 학위라 4년입니다!', x:M+6.37, y:5.4, w:5.26, h:0.26, size:12.5, bold:true, color:C.gold });
  text({ t:'학사(BEng)가 아니라 석사통합(MEng) 과정입니다. 9월 인테이크 단일이며 IET·BEM·IChemE 인정, 화학공학은 영국 9위(Guardian 2026)입니다.', x:M+6.37, y:5.68, w:5.26, h:0.62, size:11.5, color:C.text, lh:1.4 });
  bottom('*모든 학비에 6% 서비스세(SST) 별도 · 학비 고정 적용  |  출처: UNM 브로셔 p.5 · 공학 학과 페이지 (국제학생 RM 67,000 / 말레이시아 학생 RM 56,500)');
  note('파운데이션부터 공학까지 학비가 올라가는 순서로 읽으십시오. 공학이 4년이라는 점이 1차 자료에서 확인됐습니다.');
}

/* ── 10. 모나쉬 vs 노팅엄 ── */
{
  slide(false);
  head('SIDE BY SIDE','모나쉬 vs 노팅엄','어느 쪽이 좋은 학교인가가 아니라, 어느 쪽이 이 학생에게 맞는가');
  tableEl({ x:M, y:1.98, w:CW, rowH:0.47, size:12,
    colW:[2.6, 4.6665, 4.6665],
    rows:[
      ['기준','모나쉬 말레이시아','노팅엄 말레이시아'],
      ['본교 학위','호주 모나쉬대','영국 노팅엄대 (러셀그룹 창립 멤버)'],
      ['학제','3년제 · 공학 4년','3년제 · 공학(MEng) 4년'],
      ['인테이크','2월 · 7월 · 10월 (연 3회)','9월 (파운데이션은 4월 · 9월)'],
      ['검정고시','90점 이상 권장','90점 이상 권장'],
      ['파운데이션','MUFY (선웨이) · DHES (모나쉬)','Nottingham Foundation (단일)'],
      ['최단 경로','DHES 1년 + 학부 2년 = 총 3년','파운데이션 1년 + 학부 3년 = 총 4년'],
      ['공학 총 기간','MUFY 1년 + 공학 4년 = 총 5년','파운데이션 1년 + MEng 4년 = 총 5년'],
      ['해외 본교 이동','공학 일부는 호주 이동 필수','2+1 · 공학 2+2 / 3+1 (영국 · 중국 닝보)'],
      ['학비 특징','계열별 편차 큼 (RM 51,360 ~ 68,160)','학비 고정 · 장학금 자동 적용'],
    ]});
  bottom('기간이 급하면 모나쉬 DHES, 영국 학위와 비용 예측 가능성이 중요하면 노팅엄입니다.  |  공학은 두 학교 모두 총 5년입니다.');
  note('마지막 두 행부터 읽으십시오. 학부모가 알고 싶은 것은 "우리 아이는 어디냐"입니다.');
}

/* ── 11. 졸업까지 총 예산 ── */
{
  slide(false);
  head('TOTAL BUDGET','졸업까지 총 예산','입학비는 공동체 입회 시 1회만 납부합니다 — 3년이든 5년이든 동일합니다');
  tableEl({ x:M, y:1.94, w:CW, rowH:0.42, size:10.5,
    colW:[2.9, 2.26, 2.26, 2.26, 2.253],
    rows:[
      ['항목','모나쉬 DHES 3년','노팅엄 문과 계열 4년','모나쉬 MUFY + 공학 5년','노팅엄 MEng 공학 5년'],
      ['1년차 학비 (파운데이션)','DHES 약 1,676만','파운데이션 약 1,288만','MUFY 약 800만','파운데이션 약 1,288만'],
      ['2년차 이후 학비 (학부)','약 1,741만 / 년','약 1,865만 / 년','약 2,311만 / 년','약 2,271만 / 년'],
      ['학생비자 갱신','약 140만 / 년','약 140만 / 년','약 140만 / 년','약 140만 / 년'],
      ['IM 공동체 운영비','1,440만 / 년 (120×12)','1,440만 / 년 (120×12)','1,440만 / 년 (120×12)','1,440만 / 년 (120×12)'],
      ['입학비 — 입회 시 1회','500만','500만','500만','500만'],
      ['1년차 소계 (입학비 제외)','약 3,256만','약 2,868만','약 2,380만','약 2,868만'],
      ['1년차 소계 (입학비 포함)','약 3,756만','약 3,368만','약 2,880만','약 3,368만'],
      ['2년차 이후 (연)','약 3,321만','약 3,445만','약 3,891만','약 3,851만'],
      ['졸업까지 총액','약 1억 398만','약 1억 3,702만','약 1억 8,444만','약 1억 8,773만'],
    ]});
  rect({ x:M, y:6.06, w:CW, h:0.86, fill:C.goldSoft, radius:0.07 });
  text({ t:'"2년차가 1년차보다 비싼데 맞나요?" — 맞습니다', x:M+0.28, y:6.12, w:CW-0.56, h:0.26, size:12.5, bold:true, color:C.gold });
  text({ t:'1년차는 학비가 싼 파운데이션, 2년차부터는 학비가 비싼 학부입니다. 입학비 500만 원을 더해도 파운데이션 1년이 학부 1년보다 쌀 수 있습니다.', x:M+0.28, y:6.4, w:CW-0.56, h:0.22, size:10.5, color:C.text, lh:1.2 });
  text({ t:'차액 — 2년차가 더 많음: 노팅엄 문과 77만 · 공학 483만 · 모나쉬 공학 1,011만  |  모나쉬 DHES만 1년차가 435만 더 많습니다.', x:M+0.28, y:6.64, w:CW-0.56, h:0.22, size:10.5, color:C.text, lh:1.2 });
  bottom('※ 입학비 500만 원은 1년차에만 포함했고 이전 공동체 입학금을 최대 200만 원까지 인정합니다 · MUFY는 선웨이 파운데이션 학비 평균 적용 · 환율 RM 1 ≈ 339원 · 6% 서비스세와 생활비 별도');
  note('질문이 가장 많이 나오는 표입니다. 1년차는 파운데이션, 2년차부터는 학부라서 금액이 뛴다 — 이 한 문장으로 정리하십시오.');
}

/* ── 12. 지원 일정 (파운데이션 입학 기준) ── */
{
  slide(false);
  head('TIMELINE','지원 일정 — 파운데이션 입학 기준','우리 학생은 대부분 검정고시 출신이므로 학사 직행이 아니라 파운데이션으로 들어갑니다');
  [['MUFY (선웨이 칼리지)','1월 · 7월 · 8월'],['모나쉬 DHES','2월 · 7월 · 10월'],['노팅엄 파운데이션','4월 · 9월']].forEach((c,i)=>{
    const x = M + i*4.02;
    rect({ x, y:1.98, w:3.86, h:0.72, fill:C.deep, radius:0.06 });
    text({ t:c[0], x:x+0.22, y:2.06, w:3.42, h:0.28, size:11.5, bold:true, color:C.onDark });
    text({ t:c[1], x:x+0.22, y:2.34, w:3.42, h:0.3, size:14, bold:true, color:C.gold });
  });
  const plan = (x, nm, tone, chip, rows, result) => {
    rect({ x, y:2.86, w:5.86, h:3.4, fill:C.sand, radius:0.08 });
    text({ t:nm, x:x+0.3, y:2.98, w:5.26, h:0.32, size:15, bold:true, color:C.ink });
    rect({ x:x+0.3, y:3.36, w:5.26, h:0.4, fill:tone, radius:0.05 });
    text({ t:chip, x:x+0.46, y:3.36, w:4.94, h:0.4, size:11.5, bold:true, color:C.gold, valign:'middle' });
    rows.forEach((r,i)=>{
      const y = 3.9 + i*0.4;
      circle({ x:x+0.3, y:y+0.04, d:0.26, fill:C.deep, label:String(i+1), labelSize:10, labelColor:C.gold });
      text({ t:r, x:x+0.66, y, w:4.9, h:0.34, size:11, color:C.text, valign:'middle', lh:1.25 });
    });
    rect({ x:x+0.3, y:5.86, w:5.26, h:0.015, fill:C.line });
    text({ t:result, x:x+0.3, y:5.9, w:5.26, h:0.3, size:11.5, bold:true, color:C.deep, valign:'middle' });
  };
  plan(M, 'A안 — 검정고시 1회 (4월 응시)', C.deep, '그해 안에 입학합니다 · 권장',
    ['2~3월  검정고시 1회 원서 접수 · 시험 대비',
     '4월 초  응시 → 5월 중 합격 발표',
     '5~6월  영문 증명서 + 번역공증 + 영사확인 (2~3주)',
     '5~7월  IELTS 확보 (모나쉬 5.5 · 노팅엄 6.0)',
     '6~7월  원서 접수 → EMGS 비자 심사 4~8주'],
    '입학 — MUFY 8월 · 노팅엄 9월 · DHES 10월');
  plan(M+6.07, 'B안 — 검정고시 2회 (8월 응시)', C.brick, '이듬해 입학이 됩니다 · 일정 여유 있음',
    ['6~7월  검정고시 2회 원서 접수 · 시험 대비',
     '8월  응시 → 9월 초 합격 발표',
     '9~10월  영문 증명서 + 번역공증 + 영사확인 (2~3주)',
     '9~11월  IELTS 확보 (모나쉬 5.5 · 노팅엄 6.0)',
     '10~11월  원서 접수 → EMGS 비자 심사 4~8주'],
    '입학 — MUFY 이듬해 1월 · DHES 2월 · 노팅엄 4월');
  rect({ x:M, y:6.36, w:CW, h:0.56, fill:C.brickSoft, radius:0.07 });
  text({ t:'서류 인증은 아포스티유가 아니라 영사확인입니다 — 말레이시아는 헤이그 아포스티유 협약 비가입국이며, 영문 번역공증 후 외교부 → 주한 말레이시아 대사관 순으로 밟습니다.', x:M+0.28, y:6.36, w:CW-0.56, h:0.56, size:11.5, bold:true, color:C.brick, valign:'middle' });
  bottom('※ 파운데이션 입학 기준 일정입니다. 학사 직행은 A-Level · IB 등 호주 12학년 수준 자격을 갖춘 경우에만 해당합니다.');
  note('검정고시 1회(4월)를 잡으면 그해에 들어갑니다. 2회(8월)면 이듬해입니다. 이 한 가지가 1년을 가릅니다.');
}

D.save('말레이시아유학_2편_해외직영캠퍼스.pptx', PREVIEW);
