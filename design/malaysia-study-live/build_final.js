// IM 말레이시아 입학안내문 2027 — 완성본 (1편 + 2편 통합)
const K = require('./deck_kit.js');
const D = K.createDeck('IM 말레이시아 입학안내문 2027 완성본', 'wide');
const { slide, rect, circle, text, bullets, tableEl, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/final-preview.html';
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
const chapter = (no, en, ko, items) => {
  slide(true);
  text({ t:'PART '+no, x:M, y:2.5, w:9, h:0.4, size:15, bold:true, color:C.gold, cs:3 });
  text({ t:en, x:M, y:3.0, w:9, h:0.34, size:13, bold:true, color:C.onDarkMute, cs:2 });
  text({ t:ko, x:M, y:3.4, w:10, h:0.9, size:44, bold:true, color:C.paper, lh:1.12 });
  rect({ x:M, y:4.6, w:CW, h:0.02, fill:C.deep });
  items.forEach((t,i)=> text({ t, x:M+i*4.0, y:4.8, w:3.8, h:0.34, size:13, color:C.onDark }));
};

/* ═══ 표지 ═══ */
{
  slide(true);
  text({ t:'2027학년', x:M, y:1.8, w:9, h:0.4, size:16, bold:true, color:C.gold, cs:3 });
  text({ t:'IM 말레이시아\n입학안내문', x:M, y:2.3, w:9, h:1.9, size:52, bold:true, color:C.paper, lh:1.14 });
  text({ t:'완성본 — 사립 명문 2개교 · 해외 직영 캠퍼스 2개교', x:M, y:4.4, w:9, h:0.4, size:18, color:C.onDarkMute });
  rect({ x:M, y:5.0, w:CW, h:0.02, fill:C.deep });
  [['테일러스 · 선웨이','말레이시아 사립 명문'],['모나쉬 · 노팅엄','호주 · 영국 직영 캠퍼스'],['검정고시 · GED','입학 경로 총정리']].forEach((c,i)=>{
    text({ t:c[0], x:M+i*4.0, y:5.2, w:3.8, h:0.3, size:14, bold:true, color:C.onDark });
    text({ t:c[1], x:M+i*4.0, y:5.54, w:3.8, h:0.28, size:11, color:C.onDarkMute });
  });
  text({ t:'필리핀 IM해외선교본부 · 말레이시아 지부   |   2026년 10월', x:M, y:H-0.72, w:CW, h:0.3, size:11, color:C.onDarkMute });
  note('1편(사립 명문)과 2편(해외 직영 캠퍼스)을 하나로 합친 완성본입니다. 전체 설명회는 90~120분, 개별 상담은 필요한 파트만 쓰십시오.');
}

/* ═══ 00 이 자료의 구성 ═══ */
{
  slide(false);
  head('HOW TO USE','이 자료의 구성','필요한 파트만 떼어 쓰셔도 됩니다');
  const parts = [
    ['PART 1','왜 말레이시아인가','국가 · 대학 유형 · 세 가지 학위 경로'],
    ['PART 2','네 개 대학','테일러스 · 선웨이 · 모나쉬 · 노팅엄'],
    ['PART 3','검정고시와 GED','학교별 인정 여부와 우회 경로'],
    ['PART 4','돈과 일정','학비 · 총 예산 · 입학 시기'],
    ['PART 5','실행','지원 자격 · 절차 · 비자 · 타임라인'],
    ['PART 6','선택','학교 선택 가이드 · 확인 항목'],
  ];
  parts.forEach((p,i)=>{
    const x = M + (i%3)*4.04, y = 2.0 + Math.floor(i/3)*1.9;
    rect({ x, y, w:3.86, h:1.7, fill:C.sand, radius:0.08 });
    text({ t:p[0], x:x+0.28, y:y+0.2, w:3.3, h:0.26, size:11, bold:true, color:C.mid, cs:1.5 });
    text({ t:p[1], x:x+0.28, y:y+0.52, w:3.3, h:0.4, size:17, bold:true, color:C.ink });
    text({ t:p[2], x:x+0.28, y:y+1.0, w:3.3, h:0.56, size:11.5, color:C.text, lh:1.4 });
  });
  rect({ x:M, y:5.9, w:CW, h:0.48, fill:C.goldSoft, radius:0.06 });
  text({ t:'전체 설명회 90~120분  ·  개별 상담 30분이면 PART 3 → 4 → 6만 보셔도 됩니다', x:M+0.28, y:5.9, w:CW-0.56, h:0.48, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('이 장은 진행자용입니다. 학부모에게는 "오늘 이 순서로 갑니다" 정도로 짧게 넘기십시오.');
}

/* ═══ PART 1 ═══ */
chapter('1','WHY MALAYSIA','왜 말레이시아인가', ['국가 개요와 유학 시장','대학 유형 세 가지','해외 학위 경로 세 가지']);

{
  slide(false);
  head('WHY MALAYSIA','왜 말레이시아인가?','영어로 배우고, 영국·호주 학위를 본교보다 낮은 비용으로 취득하며, 한국인이 적응하기 수월한 다인종 사회입니다');
  const cards = [
    ['영어 환경','사립대 수업은 전 과목 영어로 진행되며 공식 비즈니스 언어도 영어입니다. 영미권 교육기관과 학위 연계가 폭넓습니다.'],
    ['경제적인 유학비용','연간 학비가 국내 사립대와 비슷한 수준이며, 해외 학위도 본교 대비 낮은 금액으로 취득할 수 있습니다.'],
    ['다양한 진로 옵션','자체 학위와 해외대학 연계(복수 학위 · 트위닝 · 학점 이전)를 함께 운영합니다.'],
    ['유학생활 적응 용이','아시아 국가이자 다인종 사회로 문화적 적응이 비교적 수월하고, 인천에서 6시간 30분 · 시차 1시간입니다.'],
  ];
  cards.forEach((c,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:3.5, fill:C.sand, radius:0.08 });
    circle({ x:x+0.26, y:2.24, d:0.44, fill:C.deep, label:String(i+1), labelSize:15, labelColor:C.gold });
    text({ t:c[0], x:x+0.26, y:2.84, w:2.32, h:0.6, size:16, bold:true, color:C.ink, lh:1.2 });
    text({ t:c[1], x:x+0.26, y:3.5, w:2.32, h:1.8, size:11.5, color:C.text, lh:1.45 });
  });
  rect({ x:M, y:5.68, w:CW, h:0.68, fill:C.goldSoft, radius:0.07 });
  text({ t:'유학생 25만 명 목표에 이미 15만 명 돌파 — 2년이 채 안 되는 기간에 63% 증가했습니다. 중국 학생만 연 3만 명이 갑니다.', x:M+0.28, y:5.68, w:CW-0.56, h:0.68, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('출처: Malay Mail · ICEF Monitor · EMGS International Student Data');
  note('아시아의 학부모들은 이미 이 답을 찾았습니다. 한국이 늦은 편이라는 점을 말씀하십시오.');
}

{
  slide(false);
  head('UNIVERSITY TYPES','말레이시아 대학 유형','IM 말레이시아는 사립 명문과 해외 직영 캠퍼스 두 갈래를 추천합니다');
  const types = [
    { nm:'국립대학교', ex:'말라야 대학교 (UM)', rec:false,
      rows:[['지원 시기','연 1회 (하반기)'],['평균 학비','약 500만 원 / 연간'],['특징','영어 수업이나 말레이어가 필수 교양']] },
    { nm:'사립 명문', ex:'테일러스 · 선웨이', rec:true,
      rows:[['지원 시기','연 3회'],['평균 학비','약 900만~1,800만 원 / 연간'],['특징','자체 학위 + 해외대 연계 (복수 학위 · 트위닝 · ADTP)']] },
    { nm:'해외 직영 캠퍼스', ex:'모나쉬 · 노팅엄', rec:true,
      rows:[['지원 시기','모나쉬 연 3회 / 노팅엄 9월 중심'],['평균 학비','약 1,700만~2,300만 원 / 연간'],['특징','호주·영국 본교 학위가 그대로 나옴']] },
  ];
  types.forEach((t,i)=>{
    const x = M + i*4.04;
    rect({ x, y:2.0, w:3.86, h:3.5, fill:t.rec?C.deep:C.sand, radius:0.08 });
    text({ t:t.nm, x:x+0.28, y:2.2, w:2.6, h:0.36, size:17, bold:true, color:t.rec?C.paper:C.ink });
    if (t.rec){ rect({ x:x+2.92, y:2.22, w:0.72, h:0.32, fill:C.gold, radius:0.04 });
                text({ t:'IM 추천', x:x+2.92, y:2.22, w:0.72, h:0.32, size:10, bold:true, color:C.ink, align:'center', valign:'middle' }); }
    text({ t:t.ex, x:x+0.28, y:2.6, w:3.3, h:0.3, size:13, bold:true, color:t.rec?C.gold:C.deep });
    t.rows.forEach((r,j)=>{
      text({ t:r[0], x:x+0.28, y:3.06+j*0.78, w:3.3, h:0.24, size:10, color:t.rec?C.onDarkMute:C.muted });
      text({ t:r[1], x:x+0.28, y:3.3+j*0.78, w:3.3, h:0.5, size:11.5, color:t.rec?C.onDark:C.text, lh:1.3 });
    });
  });
  rect({ x:M, y:5.68, w:CW, h:0.68, fill:C.goldSoft, radius:0.07 });
  text({ t:'사립 명문은 "말레이시아 학위 + 해외 학위"를 설계하는 구조이고, 직영 캠퍼스는 처음부터 해외 본교 학위 하나입니다.', x:M+0.28, y:5.68, w:CW-0.56, h:0.68, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('이 한 장이 1편과 2편을 가르는 기준입니다.');
}

{
  slide(false);
  head('PATHWAYS','해외 학위로 가는 세 가지 길','차이는 두 가지 — 어디서 공부하는가, 학위증을 누가 몇 장 주는가');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.6, size:13,
    colW:[2.0, 3.31, 3.31, 3.31],
    rows:[
      ['구분','① 복수 학위 (듀얼디그리)','② 트위닝','③ 학점 이전 (ADTP)'],
      ['공부하는 곳','말레이시아에서 전 과정','말레이시아 + 해외 본교','말레이시아 1~2년 + 미국'],
      ['받는 학위증','2장 (말레이시아 + 해외)','1장 (해외 본교)','1장 (편입한 미국 대학)'],
      ['해외 체류','없음 (선택 가능)','1~2년','2~3년'],
      ['경로 확정 시점','입학 시 확정','입학 시 확정','매년 새로 지원 · 합격 보장 없음'],
      ['비용','가장 낮음','중간','가장 높음'],
      ['대표 사례','선웨이 × 랭커스터 (추가비 없음)','3+0 · 2+1 · 1+2','선웨이 1987 · 테일러스 1996'],
    ]});
  rect({ x:M, y:6.35, w:CW, h:0.62, fill:C.brickSoft, radius:0.07 });
  text({ t:'가장 중요한 차이 — 트위닝은 입학 시점에 해외 본교 프로그램에 등록되어 경로가 확정됩니다. ADTP는 매년 새로 지원해야 하고 합격이 보장되지 않습니다.', x:M+0.28, y:6.35, w:CW-0.56, h:0.62, size:12.5, bold:true, color:C.brick, valign:'middle' });
  bottom('※ 직영 캠퍼스(모나쉬·노팅엄)는 입학 순간부터 본교 학위 과정이므로 이 세 경로가 적용되지 않습니다.');
  note('학부모가 가장 헷갈리는 지점입니다. 경로 확정 시점 행을 강조하십시오.');
}

/* ═══ PART 2 ═══ */
chapter('2','FOUR UNIVERSITIES','네 개 대학', ['사립 명문 — 테일러스 · 선웨이','직영 캠퍼스 — 모나쉬 · 노팅엄','개요 · 학비 · 진학 경로']);

{
  slide(false);
  head('AT A GLANCE','네 개 대학 한눈에','2026~2027 공식 자료 기준');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.52, size:11.5,
    colW:[2.0, 2.48, 2.48, 2.48, 2.483],
    rows:[
      ['','테일러스','선웨이','모나쉬 말레이시아','노팅엄 말레이시아'],
      ['성격','말레이시아 사립 명문','말레이시아 사립 명문','호주 모나쉬대 직영','영국 노팅엄대 직영'],
      ['설립','1969','칼리지 1987 → 대학 2011','1998','—'],
      ['캠퍼스','수방자야 레이크사이드','선웨이시티','반다르선웨이','스므니 · 48ha 열대우림'],
      ['순위','QS 2027 세계 #272','QS 2027 세계 #354','QS 2027 세계 #31','QS 2027 영국 #16 · 세계 #97'],
      ['강세','호텔·관광 세계 26위, 디자인','회계·금융, 계리학, CS','공학, 의학, 경영, 이학','공학, 약학, 경영'],
      ['학제','3년 (공학 4년)','3년 (공학 4년)','3년 (공학 4년)','3년 (일부 4년)'],
      ['해외 학위','ADTP · UWE · QUT','랭커스터 복수학위 · ASU','호주 본교 학위','영국 본교 학위 · 2+1'],
    ]});
  bottom('※ 모나쉬·노팅엄 순위는 본교 기준입니다. 직영 캠퍼스라 본교 학위가 나오므로 과장은 아니지만 캠퍼스 자체의 순위는 아닙니다.');
  note('이 표를 띄우고 "우리 아이 전공이 뭐냐"부터 물으십시오. 강세 행에서 답이 좁혀집니다.');
}

{
  slide(false);
  head("TAYLOR'S",'테일러스 대학교','1969년 설립 · 80~90개국 다국적 학생 · 호텔·관광 7년 연속 세계 Top 20~30위권');
  [['#272','QS 2027 세계'],['2위','말레이시아 사립대'],['#26','호텔경영 세계'],['1996','ADTP 개설']].forEach((s,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:1.1, fill:C.deep, radius:0.07 });
    text({ t:s[0], x:x+0.2, y:2.14, w:2.44, h:0.44, size:22, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.2, y:2.62, w:2.44, h:0.28, size:10.5, color:C.onDarkMute });
  });
  tableEl({ x:M, y:3.3, w:CW, rowH:0.44, size:12,
    colW:[2.6, 9.33],
    rows:[
      ['구분','내용'],
      ['학사 입학 시기','2월 · 4월 · 9월'],
      ['파운데이션 입학','2월 · 4월 · 8월'],
      ['공인 영어','학사 IELTS 6.0 (= TOEFL iBT 60~78) / 파운데이션 IELTS 5.0~5.5'],
      ['직행 가능 계열','호텔경영·관광(세계 26위), 경영학 계열 전체'],
      ['파운데이션 필수','BEng 공학사(기계·화학 등), BSc 이학사(약학·데이터사이언스 등)'],
      ['해외 학위 경로','ADTP(미국 편입, 1996년 개설) · UWE 브리스톨·QUT 복수 학위'],
    ]});
  bottom('※ 원문의 "말레이시아 사립대 1위" 표현은 사실과 달라 2위로 바로잡았습니다.');
  note('테일러스의 결정적 강점은 호텔·관광 세계 26위입니다. 이 분야면 아시아에서 더 나은 선택지가 거의 없습니다.');
}

{
  slide(false);
  head("SUNWAY",'선웨이 대학교','선웨이 칼리지 1987 → 2011년 대학 승격 · 90개국 이상 · 몰·병원·경전철이 도보권');
  [['#354','QS 2027 세계'],['+50','전년 대비 상승'],['RM 0','랭커스터 복수학위 추가비'],['1987','미국 과정 개설']].forEach((s,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:1.1, fill:C.deep, radius:0.07 });
    text({ t:s[0], x:x+0.2, y:2.14, w:2.44, h:0.44, size:22, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.2, y:2.62, w:2.44, h:0.28, size:10.5, color:C.onDarkMute });
  });
  tableEl({ x:M, y:3.3, w:CW, rowH:0.44, size:12,
    colW:[2.6, 9.33],
    rows:[
      ['구분','내용'],
      ['학사 입학 시기','1월 · 4월 · 9월'],
      ['파운데이션 입학','FIA · FIST 1·4·8월  |  MUFY 1·7·8월 (모나쉬 진학용)'],
      ['공인 영어','학사 IELTS 6.0 (= TOEFL iBT 60 이상) / 파운데이션·디플로마 IELTS 5.0~5.5'],
      ['직행 가능 계열','BA 인문사회과학 전반, BSc 경영학 · 호텔경영학'],
      ['파운데이션 필수','BEng 공학사(전자·화학 등), BSc 컴퓨터공학 · 바이오메디컬 · 순수과학'],
      ['해외 학위 경로','랭커스터 복수 학위(추가비 없음) · ASU Cintana · ADTP(1987년 개설)'],
    ]});
  rect({ x:M, y:6.24, w:CW, h:0.5, fill:C.goldSoft, radius:0.06 });
  text({ t:'선웨이 칼리지는 모나쉬의 MUFY도 운영합니다 — 선웨이에서 공부하다 모나쉬로 가는 경로가 여기서 열립니다.', x:M+0.28, y:6.24, w:CW-0.56, h:0.5, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('선웨이의 결정적 장점은 랭커스터 복수 학위에 추가 비용이 없다는 점입니다. 그리고 MUFY를 선웨이가 운영한다는 사실도 꼭 짚으십시오.');
}

{
  slide(false);
  head('MONASH','모나쉬 말레이시아','호주 모나쉬대 직영 캠퍼스 · 8개 캠퍼스 4개국 · 92개국 출신 학생');
  badge('프로스펙터스 p.10', 1.9);
  const lane = (y, tier, qual, mid, dest, tone) => {
    rect({ x:M, y, w:2.5, h:0.86, fill:tone, radius:0.06 });
    text({ t:tier, x:M+0.18, y:y+0.1, w:2.14, h:0.3, size:12.5, bold:true, color:C.paper });
    text({ t:qual, x:M+0.18, y:y+0.42, w:2.14, h:0.34, size:9.5, color:C.gold, lh:1.2 });
    text({ t:'▶', x:2.9, y:y+0.28, w:0.34, h:0.3, size:14, color:C.gold, align:'center' });
    rect({ x:3.34, y, w:4.3, h:0.86, fill:C.sand, radius:0.06 });
    text({ t:mid, x:3.52, y, w:3.94, h:0.86, size:12, color:C.text, valign:'middle', lh:1.3 });
    text({ t:'▶', x:7.78, y:y+0.28, w:0.34, h:0.3, size:14, color:C.gold, align:'center' });
    rect({ x:8.22, y, w:4.41, h:0.86, fill:C.deep, radius:0.06 });
    text({ t:dest, x:8.4, y, w:4.05, h:0.86, size:12, bold:true, color:C.paper, valign:'middle', lh:1.3 });
  };
  lane(2.0, '호주 12학년 수준', 'A-Level · IB · STPM · UEC · 캐나다 12학년', '추가 과정 없음', '학부 1학년 직행', C.mid);
  lane(3.0, '호주 11학년 수준', 'SPM · O-Level · 한국 검정고시', 'MUFY 1년 (선웨이 칼리지)\n또는 Diploma of Business 2년', '학부 1학년\n(디플로마는 2학년)', C.brick);
  lane(4.0, '성적 미달 시', '정규 입학 요건에 못 미치는 경우', 'DHES 1년 (모나쉬 운영)', '학부 2학년 + Graduate Certificate', C.gold);
  rect({ x:M, y:5.1, w:5.86, h:1.26, fill:C.goldSoft, radius:0.07 });
  text({ t:'DHES — 기간 손해가 없습니다', x:M+0.3, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'1년 이수 후 Graduate Certificate를 받고 학부 2학년 진입. 학사와 같은 총 3년에 자격 두 개를 받습니다. 진급 조건은 WAM 50 (정보기술 60).', x:M+0.3, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.1, w:5.86, h:1.26, fill:C.brickSoft, radius:0.07 });
  text({ t:'공학 지망자 주의', x:M+6.37, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'DHES로는 공학 2학년 진입이 안 됩니다 (각주 4: Monash College Diploma Part 2 이수자만). 말레이시아에서 공학은 MUFY → 공학 1학년(4년) 경로입니다.', x:M+6.37, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  bottom('출처: Monash University Malaysia Undergraduate Prospectus 2027, p.10');
  note('두 번째 줄이 검정고시 학생의 자리입니다. MUFY는 선웨이 칼리지에서 합니다.');
}

{
  slide(false);
  head('NOTTINGHAM','노팅엄 말레이시아','영국 노팅엄대 직영 캠퍼스 · 러셀그룹 창립 멤버 · 재학생 4,000명 · 74개국');
  [['#16','QS 2027 영국'],['4,000+','재학생'],['2+1','영국 본교 이동'],['고정','학비 인상 없음']].forEach((s,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:1.1, fill:C.deep, radius:0.07 });
    text({ t:s[0], x:x+0.2, y:2.14, w:2.44, h:0.44, size:22, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.2, y:2.62, w:2.44, h:0.28, size:10.5, color:C.onDarkMute });
  });
  text({ t:'Nottingham Foundation Programme — 1년 (2학기) · 4월·9월 · RM 38,000 (과정 전체) · 150학점', x:M, y:3.3, w:CW, h:0.3, size:14, bold:true, color:C.ink });
  tableEl({ x:M, y:3.68, w:5.86, rowH:0.44, size:11,
    colW:[1.6, 2.13, 2.13],
    rows:[
      ['파운데이션 영어','In-Sessional 포함','In-Sessional 없이'],
      ['IELTS (Academic)','5.5 (각 5.0↑)','6.0 (각 5.5↑)'],
      ['TOEFL iBT','72','80'],
      ['PTE (Academic)','59 (각 53↑)','65 (각 59↑)'],
    ]});
  tableEl({ x:M+6.07, y:3.68, w:5.86, rowH:0.44, size:11,
    colW:[1.6, 4.26],
    rows:[
      ['학부 영어 (경영 예시)','요구 점수'],
      ['IELTS (Academic)','6.5 (각 영역 6.0 이상)'],
      ['TOEFL iBT','90 (W·L 19, R 20, S 22)'],
      ['PTE (Academic)','71 (각 영역 65 이상)'],
    ]});
  rect({ x:M, y:5.6, w:CW, h:0.76, fill:C.brickSoft, radius:0.07 });
  text({ t:'영어 성적 — 반드시 확인할 세 가지', x:M+0.28, y:5.7, w:CW-0.56, h:0.26, size:12.5, bold:true, color:C.brick });
  text({ t:'① 유효기간 2년   ② IELTS One Skill Retake 인정   ③ 온라인 시험 불인정 — IELTS Academic Online · TOEFL iBT Home Edition · PTE Academic Online 모두 불가', x:M+0.28, y:5.98, w:CW-0.56, h:0.3, size:11.5, color:C.text });
  bottom('출처: UNM 브로셔 p.5 · p.9 · p.18  |  Pre-Sessional English 10주 RM 8,000 / 20주 RM 13,000 / 30주 RM 20,000 (국제학생)');
  note('③번이 실무에서 자주 걸립니다. 집에서 보는 온라인 시험 점수는 받지 않습니다.');
}

/* ═══ PART 3 ═══ */
chapter('3','KOREAN QUALIFICATIONS','검정고시와 GED', ['학교별 인정 여부','원문 확인 결과','GED 우회 경로']);

{
  slide(false);
  head('KOREAN EXAM','검정고시 — 네 개 학교 총정리','결론부터 — 네 곳 모두 계열과 무관하게 파운데이션을 거칩니다');
  badge('원문 확인 완료', 1.8);
  tableEl({ x:M, y:2.0, w:CW, rowH:0.62, size:12,
    colW:[2.2, 3.24, 3.24, 3.253],
    rows:[
      ['학교','공식 자료의 검정고시 취급','확인 수준','현실적 경로'],
      ['테일러스','학력 조건 "고교 졸업 또는 검정고시"로 명시','학교 안내문 기준','파운데이션 또는 디플로마 경유'],
      ['선웨이','학력 조건 "고교 졸업 또는 검정고시"로 명시','학교 안내문 기준','파운데이션 또는 디플로마 경유'],
      ['모나쉬','"SOUTH KOREA High School Graduation Equivalency Examination — 60%"','프로스펙터스 p.55 원문','MUFY 또는 디플로마 경유 (입학처 안내와 일치)'],
      ['노팅엄','인정 학력 목록에 한국 항목 없음 (Korea 0회)','브로셔 p.9 · p.18 원문','노팅엄 파운데이션 또는 타기관 파운데이션'],
    ]});
  rect({ x:M, y:5.46, w:CW, h:0.98, fill:C.goldSoft, radius:0.07 });
  text({ t:'모나쉬 입학처 안내가 맞았습니다', x:M+0.28, y:5.56, w:CW-0.56, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'"검정고시는 계열 상관없이 무조건 파운데이션"이라는 안내는 프로스펙터스와 일치합니다. 검정고시가 호주 12학년이 아니라 11학년 수준으로 분류되기 때문입니다. 같은 표에 말레이시아 SPM, O-Level, 캐나다 OSSD가 함께 있습니다.', x:M+0.28, y:5.86, w:CW-0.56, h:0.5, size:12, color:C.text, lh:1.3 });
  bottom('출처: Monash UG Prospectus 2027 p.10 · p.55  |  UNM 브로셔 p.9 · p.18  |  IM 말레이시아 입학안내문 2027');
  note('모나쉬만 국가명과 커트라인(60%)을 명시했습니다. 상담에서 바로 인용하실 수 있습니다.');
}

{
  slide(false);
  head('GED','GED — 검정고시와 같지 않습니다','학교마다 답이 다르고, 공식 자료에는 거의 나오지 않습니다');
  const g = [
    { nm:'노팅엄', st:'불가', d:'입학처가 GED로는 입학 불가로 회신했습니다. 브로셔 파운데이션 입학 요건(p.9)에도 GED가 없어 자료와 일치합니다.', tone:C.brick },
    { nm:'모나쉬', st:'미확인', d:'학부·대학원 프로스펙터스 112쪽 전체에서 GED가 0회 등장합니다. 심사 기준이 공개돼 있지 않으므로 입학처 확인이 필요합니다.', tone:C.gold },
    { nm:'테일러스 · 선웨이', st:'사례 있음', d:'GED 소지자를 파운데이션·디플로마로 받아들인 사례가 보고됩니다. 다만 공식 요건에 점수 기준이 명시돼 있지 않아 확인이 필요합니다.', tone:C.mid },
  ];
  g.forEach((r,i)=>{
    const x = M + i*4.04;
    rect({ x, y:2.0, w:3.86, h:2.0, fill:C.sand, radius:0.08 });
    text({ t:r.nm, x:x+0.28, y:2.18, w:2.4, h:0.34, size:16, bold:true, color:C.ink });
    rect({ x:x+2.56, y:2.2, w:1.06, h:0.32, fill:r.tone, radius:0.04 });
    text({ t:r.st, x:x+2.56, y:2.2, w:1.06, h:0.32, size:10.5, bold:true, color:r.tone===C.gold?C.ink:C.paper, align:'center', valign:'middle' });
    text({ t:r.d, x:x+0.28, y:2.66, w:3.3, h:1.2, size:11.5, color:C.text, lh:1.45 });
  });
  text({ t:'GED로 노팅엄에 가려면 — 네 가지 길', x:M, y:4.2, w:CW, h:0.3, size:15, bold:true, color:C.ink });
  const routes = [
    ['A','타기관 파운데이션 경유','선웨이·테일러스에서 파운데이션을 이수하고 노팅엄 학부 1학년 지원. 브로셔에 "Foundation — Other Institutions: 학교 재량, GPA 3.0/4.0 이상"으로 명시된 경로','가장 현실적'],
    ['B','타기관 디플로마 경유','디플로마(2~2.5년) 이수 후 학부 2학년 진입, 케이스별 심사. GPA 3.0/4.0 이상','2학년 진입'],
    ['C','A-Level 또는 IB 취득','A Level DDD 이상 또는 IB 24점 이상이면 노팅엄 파운데이션 직행. 성적이 높으면 학부 직행도 가능','정공법'],
    ['D','모나쉬로 방향 전환','검정고시는 60% 기준으로 명시. 다만 GED는 모나쉬 자료에도 없어 먼저 확인 필요','학교 변경'],
  ];
  routes.forEach((r,i)=>{
    const x = M + (i%2)*6.07, y = 4.54 + Math.floor(i/2)*0.98;
    circle({ x, y:y+0.1, d:0.32, fill:C.deep, label:r[0], labelSize:12, labelColor:C.gold });
    text({ t:r[1], x:x+0.44, y:y, w:2.5, h:0.3, size:12.5, bold:true, color:C.ink });
    text({ t:r[3], x:x+2.98, y:y+0.02, w:1.2, h:0.26, size:9.5, bold:true, color:C.mid });
    text({ t:r[2], x:x+0.44, y:y+0.3, w:5.18, h:0.6, size:10, color:C.text, lh:1.32 });
  });
  bottom('입학처 문의 문안: Is the US GED accepted for entry into your Foundation / pathway programmes, and if so what minimum score? Is it treated the same as the Korean High School Graduation Equivalency Examination?');
  note('A안이 핵심입니다. 1편의 선웨이·테일러스 파운데이션이 노팅엄으로 가는 디딤돌이 됩니다.');
}

/* ═══ PART 4 ═══ */
chapter('4','MONEY & TIMING','돈과 일정', ['입학 시기 총정리','학비 총정리','졸업까지 총 예산']);

{
  slide(false);
  head('INTAKES','입학 시기 총정리','입학 시기가 전체 일정을 결정합니다 — 원서는 개강 12~16주 전');
  badge('학교 확인 완료', 1.8);
  tableEl({ x:M, y:2.0, w:CW, rowH:0.56, size:12.5,
    colW:[2.6, 4.666, 4.666],
    rows:[
      ['학교','학사 (본과) 입학','파운데이션 입학'],
      ['테일러스','2월 · 4월 · 9월','2월 · 4월 · 8월'],
      ['선웨이','1월 · 4월 · 9월','FIA · FIST 1·4·8월  |  MUFY 1·7·8월'],
      ['모나쉬','2월 · 7월 · 10월','MUFY 1·7·8월 (선웨이)  |  DHES · 디플로마 2·7·10월'],
      ['노팅엄','9월 중심 (일부 2월)','4월 · 9월'],
    ]});
  rect({ x:M, y:5.1, w:5.86, h:1.26, fill:C.goldSoft, radius:0.08 });
  text({ t:'선택지가 가장 넓은 쪽 — 모나쉬', x:M+0.3, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'MUFY 1·7·8월과 DHES 2·7·10월을 합치면 사실상 연 5~6회 진입 기회가 있습니다. 한 번 놓쳐도 두세 달 뒤가 있습니다.', x:M+0.3, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.1, w:5.86, h:1.26, fill:C.brickSoft, radius:0.08 });
  text({ t:'가장 빡빡한 쪽 — 노팅엄', x:M+6.37, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'파운데이션이 4·9월 연 2회뿐입니다. 노팅엄을 목표로 한다면 검정고시 1회(4월)를 반드시 잡아야 그해 9월 입학이 가능합니다.', x:M+6.37, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  bottom('');
  note('학부모가 가장 먼저 묻는 것이 "언제 들어가느냐"입니다. 이 표 한 장으로 답하십시오.');
}

{
  slide(false);
  head('TUITION','학비 총정리','국제학생 기준 · 링깃과 원화로 통일 · 환율 RM 1 ≈ 339원');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.56, size:12,
    colW:[2.3, 3.5, 3.1, 3.033],
    rows:[
      ['학교','파운데이션','학부 (연간, RM)','학부 (연간, 원화)'],
      ['테일러스','RM 44,044 (1년)','34,000 ~ 71,000','1,150만 ~ 2,400만'],
      ['선웨이','RM 17,850 ~ 29,350 (1년)','30,000 ~ 55,000','1,020만 ~ 1,860만'],
      ['모나쉬','MUFY 17,850~29,350  |  DHES 49,440~55,680','51,360 ~ 74,400 (공학 68,160)','1,740만 ~ 2,520만'],
      ['노팅엄','RM 38,000 (과정 전체)','52,000 ~ 57,000','1,760만 ~ 1,930만'],
    ]});
  rect({ x:M, y:5.1, w:5.86, h:1.26, fill:C.sand, radius:0.08 });
  text({ t:'학비 표 읽는 법 — 네 가지', x:M+0.3, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.deep });
  text({ t:'① 총액인가 연간인가  ② 몇 년 과정인가  ③ 어느 통화인가 (달러 표기는 참고용, 납부는 링깃)  ④ 세금이 붙는가', x:M+0.3, y:5.54, w:5.26, h:0.7, size:12, color:C.text, lh:1.4 });
  rect({ x:M+6.07, y:5.1, w:5.86, h:1.26, fill:C.brickSoft, radius:0.08 });
  text({ t:'2025년 7월부터 6% 서비스세', x:M+6.37, y:5.22, w:5.26, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'외국인 학비에 별도 부과됩니다. 위 금액에 포함돼 있지 않습니다. 5년 과정이면 350만~500만 원, 3년이면 165만~270만 원이 추가됩니다. 국제학생 보증금·EMGS 수수료는 제외.', x:M+6.37, y:5.54, w:5.26, h:0.7, size:11.5, color:C.text, lh:1.4 });
  bottom('※ MUFY는 선웨이 칼리지 운영이므로 선웨이 파운데이션 학비를 적용했습니다. 선웨이 경영계열은 입학처가 달러로 안내한 금액을 환산한 값입니다.');
  note('금액부터 말하면 학부모가 혼란스러워합니다. 왼쪽 네 가지를 먼저 맞추고 표로 들어가십시오.');
}

{
  slide(false);
  head('TOTAL TUITION','졸업까지 총 학비','검정고시 출신 기준 · 파운데이션 포함 · 낮은 순');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.46, size:12,
    colW:[4.6, 1.3, 3.0, 3.033],
    rows:[
      ['경로','총 기간','총 학비 (RM)','총 학비 (원화)'],
      ['선웨이 — 파운데이션 + 경영 3년','4년','98,250 ~ 143,500','3,331만 ~ 4,865만'],
      ['모나쉬 — DHES 1년 + 학부 2년','3년','152,160','5,158만'],
      ['선웨이 — 파운데이션 + 공학 4년','5년','171,418 ~ 182,918','5,811만 ~ 6,201만'],
      ['모나쉬 — MUFY 1년 + 학부 3년','4년','171,930 ~ 183,430','5,828만 ~ 6,218만'],
      ['테일러스 — 파운데이션 + 호텔경영 3년','4년','177,190','6,007만'],
      ['노팅엄 — 파운데이션 + 공학·과학 3년','4년','194,000','6,577만'],
      ['노팅엄 — 파운데이션 + 경영 3년','4년','209,000','7,085만'],
      ['테일러스 — 파운데이션 + 기계공학 4년','5년','244,780','8,298만'],
      ['모나쉬 — MUFY 1년 + 공학 4년','5년','290,490 ~ 301,990','9,848만 ~ 1억 237만'],
    ]});
  bottom('※ 학비만 비교한 표입니다. 6% 서비스세 · 생활비(월 RM 1,600~3,000) · 비자·보험·항공 · IM 공동체 운영비는 별도입니다.');
  note('가장 짧고 저렴한 조합은 모나쉬 DHES 3년입니다. 다만 공학은 DHES가 안 되므로 MUFY 경로로 5년이 됩니다.');
}

{
  slide(false);
  head('TOTAL BUDGET','졸업까지 총 예산','학비 외에 공동체 운영비·비자 갱신·입학비가 함께 듭니다 · 장학금 미반영');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.48, size:11.5,
    colW:[2.8, 2.28, 2.28, 2.28, 2.293],
    rows:[
      ['항목','선웨이 경영 4년','모나쉬 DHES 3년','노팅엄 공학·과학 4년','모나쉬 MUFY+공학 5년'],
      ['1년차 학비 (파운데이션)','약 800만','DHES 약 1,676만','약 1,288만','MUFY 약 800만'],
      ['2년차 이후 학비 (학부)','약 910만~1,290만','약 1,741만','약 1,763만','약 2,311만'],
      ['학생비자 갱신','약 140만 / 년','약 140만 / 년','약 140만 / 년','약 140만 / 년'],
      ['IM 공동체 운영비','1,440만 / 년','1,440만 / 년','1,440만 / 년','1,440만 / 년'],
      ['입학비 — 입회 시 1회','500만','500만','500만','500만'],
      ['1년차 소계','약 2,880만','약 3,756만','약 3,368만','약 2,880만'],
      ['2년차 이후 (연)','2,490만~2,870만','약 3,321만','약 3,343만','약 3,891만'],
      ['졸업까지 총액','약 1억 350만~1억 1,490만','약 1억 398만','약 1억 3,397만','약 1억 8,444만'],
    ]});
  rect({ x:M, y:6.1, w:CW, h:0.5, fill:C.goldSoft, radius:0.06 });
  text({ t:'입학비는 공동체 입회 시 1회만 납부합니다 — 3년이든 5년이든 같습니다. 이전 공동체 입학금은 최대 200만 원까지 인정됩니다.', x:M+0.28, y:6.1, w:CW-0.56, h:0.5, size:12.5, bold:true, color:C.ink, valign:'middle' });
  bottom('※ 6% 서비스세와 생활비는 별도입니다. 파운데이션 연도와 학부 연도의 학비가 크게 달라 분리해 표기했습니다.');
  note('학부모가 실제로 알고 싶은 숫자는 마지막 행입니다. 여기부터 읽으셔도 됩니다. 입학비가 1회라는 점을 꼭 짚으십시오.');
}

/* ═══ PART 5 ═══ */
chapter('5','HOW TO APPLY','실행', ['지원 자격','입학 절차와 비자','타임라인 A · B']);

{
  slide(false);
  head('ELIGIBILITY','IM 말레이시아 지원 자격','아래 네 가지 조건이 모두 준비된 학생만 지원 가능합니다');
  const el = [
    ['리뉴젠 공동체 6개월 이상 훈련자','각 공동체 디렉터 추천서 제출'],
    ['고등과정 학력 이수자','인가 고교 12학년 졸업 : 내신 평균 70점 이상\n고졸 검정고시 : 평균 80점 이상'],
    ['영어 공인 점수 취득자','IELTS 5.5~6.0 이상 또는 TOEFL iBT 60점 이상\n본과 직행 목표 시 IELTS 6.0 / TOEFL iBT 70점대 권장'],
    ['필말레이시아존 코스 수료자','필리핀 IM해외선교본부 과정'],
  ];
  el.forEach((e,i)=>{
    const x = M + (i%2)*6.07, y = 2.0 + Math.floor(i/2)*1.5;
    rect({ x, y, w:5.86, h:1.32, fill:C.sand, radius:0.08 });
    circle({ x:x+0.28, y:y+0.24, d:0.44, fill:C.deep, label:String(i+1), labelSize:15, labelColor:C.gold });
    text({ t:e[0], x:x+0.86, y:y+0.2, w:4.76, h:0.34, size:14, bold:true, color:C.ink });
    text({ t:e[1], x:x+0.86, y:y+0.58, w:4.76, h:0.62, size:11.5, color:C.text, lh:1.4 });
  });
  rect({ x:M, y:5.1, w:CW, h:1.0, fill:C.brickSoft, radius:0.07 });
  text({ t:'3번 항목 주의 — 영어 점수가 가장 큰 변수입니다', x:M+0.28, y:5.2, w:CW-0.56, h:0.3, size:13, bold:true, color:C.brick });
  text({ t:'TOEFL iBT 60점은 IELTS 6.0의 하한선이므로 전공에 따라 미달될 수 있습니다. 본과 직행을 노린다면 70점대를 목표로 하십시오. 성적 유효기간은 2년이며, 노팅엄은 온라인 시험을 인정하지 않습니다.', x:M+0.28, y:5.52, w:CW-0.56, h:0.48, size:12, color:C.text, lh:1.4 });
  bottom('');
  note('영어 점수가 가장 큰 변수입니다. 여유를 두는 편이 안전합니다.');
}

{
  slide(false);
  head('ADMISSION & VISA','입학 절차와 비자','원서 접수 시점이 전체 일정을 좌우합니다 — 개강 12~16주 전 권장');
  const st = ['디렉터 상담 후 입학 시기 결정','필말레이시아존 유학 과정','IM말레이시아 입학 신청','유학 서류 준비 및 원서 접수','입학허가서(Offer Letter) 수령','비자 신청 및 입국비자 진행'];
  st.forEach((t,i)=>{
    const x = M + i*2.02;
    rect({ x, y:2.0, w:1.84, h:1.3, fill:i===3?C.deep:C.sand, radius:0.07 });
    text({ t:'STEP '+(i+1), x:x+0.18, y:2.14, w:1.48, h:0.24, size:9.5, bold:true, color:i===3?C.gold:C.mid, cs:1 });
    text({ t, x:x+0.18, y:2.44, w:1.48, h:0.74, size:11, bold:true, color:i===3?C.paper:C.ink, lh:1.25 });
  });
  const vs = ['오퍼레터 수령·서명 후 제출','학교가 EMGS에 신청 (학생 직접 불가)','EMGS 서류 심사 2~4주','이민국 승인 → eVAL 발급 (합계 4~8주)','주한 말레이시아 대사관 SEV 발급','입국 → 7영업일 내 건강검진','이민국 Student Pass 스티커 (2~4주)'];
  vs.forEach((t,i)=>{
    const y = 3.56 + i*0.42;
    circle({ x:M, y:y+0.05, d:0.28, fill:C.deep, label:String(i+1), labelSize:10.5, labelColor:C.gold });
    text({ t, x:M+0.4, y, w:5.5, h:0.38, size:11.5, color:C.text, valign:'middle' });
  });
  rect({ x:M+6.3, y:3.5, w:5.63, h:1.8, fill:C.brickSoft, radius:0.08 });
  text({ t:'⚠ 서류 인증 — 아포스티유가 아닙니다', x:M+6.56, y:3.64, w:5.11, h:0.3, size:14, bold:true, color:C.brick });
  text({ t:'말레이시아는 헤이그 아포스티유 협약 비가입국입니다.\n\n검정고시 합격증명서·성적증명서는 아포스티유가 아니라 영사확인(외교부 → 주한 말레이시아 대사관)을 밟아야 합니다. 이 절차에만 2~3주가 추가로 듭니다.', x:M+6.56, y:4.0, w:5.11, h:1.2, size:11.5, color:C.text, lh:1.45 });
  rect({ x:M+6.3, y:5.44, w:5.63, h:0.9, fill:C.sand, radius:0.08 });
  text({ t:'학교 선택이 곧 비자 대행사 선택', x:M+6.56, y:5.56, w:5.11, h:0.26, size:12.5, bold:true, color:C.deep });
  text({ t:'EMGS 신청은 학교가 대행합니다. 검정고시 학생을 처리해 본 경험이 있는 국제입학처가 훨씬 빠릅니다.', x:M+6.56, y:5.84, w:5.11, h:0.44, size:11.5, color:C.text, lh:1.4 });
  bottom('※ 귀국 후 한국 대학 편입 시에도 말레이시아 대학 서류는 주말레이시아 한국대사관 영사확인이 필요합니다.');
  note('아포스티유는 말레이시아에 통하지 않습니다. 이전 안내문에 아포스티유로 적힌 부분이 있다면 모두 정정하십시오.');
}

{
  slide(false);
  head('TIMELINE','타임라인 A · B','검정고시 1회(4월)냐 2회(8월)냐가 입학 시기를 가릅니다');
  text({ t:'A플랜 — 1~2월 입학 (가장 여유 있는 최적 진입)', x:M, y:2.0, w:CW, h:0.3, size:14, bold:true, color:C.deep });
  tableEl({ x:M, y:2.38, w:CW, rowH:0.4, size:11,
    colW:[1.2, 7.43, 3.3],
    rows:[
      ['시기','주요 활동 및 행정 절차','체크포인트'],
      ['02 ~ 04','검정고시 제1회 원서 접수 → 응시 (평균 80점 이상 목표)','시험일 4월 초·중순'],
      ['05 중순','합격 발표 → 영문 증명서 발급 → 영사확인 착수','아포스티유 아님'],
      ['05 ~ 10','필리핀 IM해외선교본부 6개월 과정','영어 몰입 훈련'],
      ['09 ~ 10','IELTS / TOEFL 응시 → 대학 원서 접수','개강 12~16주 전'],
      ['10 ~ 12','EMGS 비자 심사 → Offer Letter · VAL 수령 → eVisa','4~8주 소요'],
      ['01 / 02','선웨이(1월) · 테일러스(2월) 정식 입학','모나쉬는 2월'],
    ]});
  text({ t:'B플랜 — 4월 입학 (한국 학제 졸업 후 가장 빠른 입학)', x:M, y:5.1, w:CW, h:0.3, size:14, bold:true, color:C.deep });
  rect({ x:M, y:5.44, w:CW, h:0.96, fill:C.sand, radius:0.07 });
  text({ t:'06~08 검정고시 2회 응시  →  09 영문 증명서 + 영사확인  →  09~02 IM 과정  →  11~01 어학·원서  →  01~02 EMGS 심사  →  04 입학', x:M+0.28, y:5.58, w:CW-0.56, h:0.3, size:11.5, color:C.text });
  text({ t:'B플랜의 최대 약점은 어학 확보 기간이 짧다는 것입니다. 무리하지 말고 C플랜(9월 입학)을 예비로 준비해 두십시오. 노팅엄을 목표로 한다면 1회(4월)가 사실상 필수입니다.', x:M+0.28, y:5.88, w:CW-0.56, h:0.46, size:11.5, bold:true, color:C.brick, lh:1.3 });
  bottom('');
  note('가장 흔한 실수가 원서를 늦게 내는 것입니다. 12~16주 전 접수를 못 맞추면 다음 인테이크로 밀립니다.');
}

/* ═══ PART 6 ═══ */
chapter('6','CHOOSING','선택', ['학교 선택 가이드','확인해야 할 것','출처']);

{
  slide(false);
  head('WHICH SCHOOL','그래서 우리 아이는 어디인가','전공과 목표 학위 국가, 두 가지만 정하면 답이 좁혀집니다');
  const guide = [
    ['호텔·관광·디자인·마케팅이 목표','테일러스','호텔경영 세계 26위 · 전공 12개 계열','1편'],
    ['회계·금융·계리·컴퓨터과학이 목표','선웨이','랭커스터 복수 학위 추가비 없음 · 학비 최저','1편'],
    ['영국 학위를 받되 비용을 아끼고 싶다','선웨이 복수 학위','해외에 나가지 않고 영국 학위 2장','1편'],
    ['미국 학위가 목표다','테일러스·선웨이 ADTP','단 합격 보장이 아님 · 과목 매핑 필수','1편'],
    ['기간이 급하다 (최단 3년)','모나쉬 DHES','1년 + 학부 2년 · 자격 두 개','2편'],
    ['공학·의약학이 목표다','모나쉬 또는 노팅엄','모나쉬는 MUFY 경유 5년 · 노팅엄 3~4년','2편'],
    ['영국 본교 경험을 원한다','노팅엄 2+1','3학년을 영국에서 · 학비 고정','2편'],
    ['GED 소지자다','선웨이·테일러스 파운데이션 먼저','노팅엄은 GED 불가 · GPA 3.0으로 편입','2편'],
  ];
  guide.forEach((g,i)=>{
    const x = M + (i%2)*6.07, y = 2.0 + Math.floor(i/2)*1.1;
    rect({ x, y, w:5.86, h:0.96, fill:i%2?C.paper:C.sand, lineColor:C.line, radius:0.06 });
    text({ t:g[0], x:x+0.24, y:y+0.1, w:3.3, h:0.4, size:12, color:C.text, lh:1.25 });
    text({ t:g[1], x:x+0.24, y:y+0.54, w:3.3, h:0.3, size:12.5, bold:true, color:C.deep });
    text({ t:g[2], x:x+3.66, y:y+0.1, w:1.96, h:0.74, size:10, color:C.muted, lh:1.35 });
  });
  rect({ x:M, y:6.44, w:CW, h:0.0, fill:C.sand });
  bottom('어느 경로든 검정고시·GED 출신은 파운데이션 1년을 먼저 거치는 것이 기본값입니다.  |  "어디가 더 좋은 학교인가요?"에 순위로 답하지 마시고 "무엇을 할 것인가에 따라 답이 바뀐다"로 되돌리십시오.');
  note('상담의 순서는 전공 → 목표 학위 국가 → 예산입니다. 학교 이름부터 꺼내지 마십시오.');
}

{
  slide(true);
  head('CHECKLIST','확인해야 할 것','원문으로 확인된 것과, 학교에 물어야 할 것을 나눴습니다', true);
  text({ t:'확인 완료 — 원문 근거 있음', x:M, y:2.0, w:5.86, h:0.3, size:13, bold:true, color:C.gold });
  const done = ['검정고시 = 호주 11학년 수준 (모나쉬 p.55, 60%)','MUFY는 선웨이 칼리지 운영 · 인테이크 1·7·8월','DHES로는 공학 2학년 진입 불가 (각주 4)','노팅엄 GED 불가 — 입학처 + 브로셔 p.9 일치','노팅엄 영어 요건 · 2+1 영국 이동 조건','학사·파운데이션 입학 시기 (학교 문의 확인)','말레이시아는 아포스티유 비가입국 — 영사확인'];
  done.forEach((t,i)=>{
    const y = 2.36 + i*0.46;
    circle({ x:M, y:y+0.04, d:0.24, fill:C.mid, label:'✓', labelSize:9.5, labelColor:C.paper });
    text({ t, x:M+0.36, y, w:5.5, h:0.38, size:10.5, color:C.onDark, valign:'middle' });
  });
  text({ t:'학교 확인 필요', x:M+6.07, y:2.0, w:5.86, h:0.3, size:13, bold:true, color:C.brick });
  const todo = ['모나쉬의 GED 인정 여부와 최소 점수','MUFY 학비 — 선웨이 칼리지 공식 금액','테일러스·선웨이의 GED 공식 기준','지망 학과별 학비와 원서 마감일','선웨이 경영계열 적용 환율 (입학처 달러 안내)','장학금 적용 조건과 감면 폭','서비스세 과세 범위 (청구서 기준)'];
  todo.forEach((t,i)=>{
    const y = 2.36 + i*0.46;
    circle({ x:M+6.07, y:y+0.04, d:0.24, fill:C.gold, label:String(i+1), labelSize:9.5, labelColor:C.ink });
    text({ t, x:M+6.43, y, w:5.5, h:0.38, size:10.5, color:C.onDark, valign:'middle' });
  });
  rect({ x:M, y:5.68, w:CW, h:0.94, fill:C.deep, radius:0.08 });
  text({ t:'출처', x:M+0.3, y:5.78, w:CW-0.6, h:0.24, size:10.5, bold:true, color:C.gold, cs:1.5 });
  text({ t:'IM 말레이시아 입학안내문 2027  ·  Monash University Malaysia Undergraduate / Postgraduate Prospectus 2027  ·  University of Nottingham Malaysia 브로셔  ·  테일러스 · 선웨이 공식 안내  ·  EMGS · 말레이시아 이민국  ·  헤이그 아포스티유 협약 가입국 현황', x:M+0.3, y:6.04, w:CW-0.6, h:0.5, size:10.5, color:C.onDarkMute, lh:1.4 });
  bottom('');
  note('이 슬라이드는 내부용입니다. 학부모 배포본에서는 빼십시오.');
}

D.save('IM말레이시아_입학안내문_2027_완성본.pptx', PREVIEW);
