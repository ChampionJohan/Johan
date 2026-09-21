// IM 말레이시아 입학안내문 2027 — 통합판
// 업로드 원본(14장) + 세 가지 경로 정리 + ADTP 심화·편입 사례를 하나로 합친다
const K = require('./deck_kit.js');
const D = K.createDeck('IM 말레이시아 입학안내문 2027 통합판', 'wide');
const { slide, rect, circle, text, bullets, tableEl, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/im-preview.html';
const CW = W - 2*M;                         // 본문 폭 11.93"

// 섹션 머리말 — 원본의 번호 + 영문 라벨 + 국문 제목 형식을 따른다
function head(no, en, ko, sub, dark){
  rect({ x:M, y:0.52, w:0.62, h:0.62, fill:dark?C.gold:C.deep, radius:0.06 });
  text({ t:no, x:M, y:0.52, w:0.62, h:0.62, size:17, bold:true, color:dark?C.ink:C.gold, align:'center', valign:'middle' });
  text({ t:en, x:M+0.82, y:0.5, w:CW-0.82, h:0.26, size:11, bold:true, color:dark?C.gold:C.mid, cs:2 });
  text({ t:ko, x:M+0.82, y:0.74, w:CW-0.82, h:0.56, size:30, bold:true, color:dark?C.onDark:C.ink, lh:1.1 });
  if (sub) text({ t:sub, x:M, y:1.34, w:CW, h:0.58, size:13, color:dark?C.onDarkMute:C.muted, lh:1.3 });
}
const bottom = t => text({ t, x:M, y:H-0.5, w:CW, h:0.28, size:9, color:C.muted, lh:1.2 });

/* ═══ 01 표지 ═══ */
{
  slide(true);
  text({ t:'2027학년', x:M, y:1.9, w:8, h:0.4, size:16, bold:true, color:C.gold, cs:3 });
  text({ t:'IM 말레이시아\n입학안내문', x:M, y:2.4, w:9, h:1.9, size:54, bold:true, color:C.paper, lh:1.14 });
  text({ t:'통합판 — 유학 경로 · 대학 · 입학 절차 · 비자 · 예산', x:M, y:4.5, w:9, h:0.4, size:17, color:C.onDarkMute });
  rect({ x:M, y:5.1, w:CW, h:0.02, fill:C.deep });
  ['듀얼 디그리 · 트위닝 · ADTP','테일러스 · 선웨이','학사 입학 1·2·4·9월'].forEach((t,i)=>{
    text({ t, x:M+i*4.0, y:5.3, w:3.8, h:0.34, size:13, bold:true, color:C.onDark });
  });
  text({ t:'필리핀 IM해외선교본부 · 말레이시아 지부', x:M, y:H-0.72, w:CW, h:0.3, size:11, color:C.onDarkMute });
  note('2027학년도 입학안내문 통합판입니다. 원본 14장에 해외 학위 경로 정리와 ADTP 심화·편입 사례를 더했고, 서류 인증 절차를 영사확인으로 바로잡았습니다.');
}

/* ═══ 02 WHY MALAYSIA ═══ */
{
  slide(false);
  head('01','WHY MALAYSIA','왜 말레이시아인가?','영어로 배우고, 영국·호주 학위를 본교보다 낮은 비용으로 취득하며, 한국인이 적응하기 수월한 다인종 사회라는 세 가지가 맞물립니다.');
  const cards = [
    ['영어 환경','사립대 수업은 전 과목 영어로 진행되며 공식 비즈니스 언어도 영어입니다. 영미권 교육기관과 학위 연계가 폭넓습니다.'],
    ['경제적인 유학비용','연간 학비가 국내 사립대와 비슷한 수준(약 900만~1,800만 원)이며, 해외 프로그램도 본교 대비 낮은 금액으로 취득할 수 있습니다.'],
    ['다양한 진로 옵션','말레이시아 자체 학위와 해외대학 연계 프로그램(트위닝 · 트랜스퍼 · 복수 학위)을 함께 운영합니다.'],
    ['유학생활 적응 용이','아시아 국가이자 다인종 사회로 한국인 선호도가 높고 문화적 적응이 비교적 수월합니다.'],
  ];
  cards.forEach((c,i)=>{
    const x = M + i*3.02;
    rect({ x, y:2.0, w:2.84, h:3.4, fill:C.sand, radius:0.08 });
    circle({ x:x+0.26, y:2.24, d:0.44, fill:C.deep, label:String(i+1), labelSize:15, labelColor:C.gold });
    text({ t:c[0], x:x+0.26, y:2.84, w:2.32, h:0.6, size:16, bold:true, color:C.ink, lh:1.2 });
    text({ t:c[1], x:x+0.26, y:3.5, w:2.32, h:1.7, size:11.5, color:C.text, lh:1.45 });
  });
  bottom('');
  note('말레이시아를 택하는 근거는 영어 환경, 비용, 진로 옵션, 적응 용이성 네 가지입니다.');
}

/* ═══ 03 UNIVERSITY TYPES ═══ */
{
  slide(false);
  head('02','UNIVERSITY TYPES','말레이시아 대학 유형','IM 말레이시아는 연 3회 입학 기회와 해외대학 연계 진로를 동시에 갖춘 사립대학교 경로를 추천합니다.');
  const types = [
    { nm:'국립대학교', ex:'말라야 대학교 (UM)', rec:false,
      rows:[['지원 시기','연 1회 (하반기)'],['평균 학비','약 500만 원 / 연간'],['특징','영어 수업이나 말레이어가 필수 교양']] },
    { nm:'사립대학교', ex:'테일러스 · 선웨이', rec:true,
      rows:[['지원 시기','연 3회'],['평균 학비','약 900만~1,800만 원 / 연간'],['특징','자체 학위 + 해외 명문대 연계 진로 선택 가능']] },
    { nm:'해외 직영 캠퍼스', ex:'모나쉬 · 노팅엄', rec:false,
      rows:[['지원 시기','연 1~2회'],['평균 학비','약 1,200만~1,800만 원 / 연간'],['특징','본교 교환학생 자유, 학비가 높은 편']] },
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
      text({ t:r[1], x:x+0.28, y:3.3+j*0.78, w:3.3, h:0.5, size:12, color:t.rec?C.onDark:C.text, lh:1.3 });
    });
  });
  bottom('');
  note('세 유형 중 사립대가 입학 기회와 진로 유연성에서 가장 유리합니다.');
}

/* ═══ 04 PATHWAYS (추가) ═══ */
{
  slide(false);
  head('03','PATHWAYS','해외 학위로 가는 세 가지 길','차이는 두 가지입니다 — 어디서 공부하는가, 그리고 학위증을 누가 몇 장 주는가');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.6, size:13,
    colW:[2.0, 3.31, 3.31, 3.31],
    rows:[
      ['구분','① 듀얼 디그리 (복수 학위)','② 트위닝','③ ADTP (학점 이전)'],
      ['공부하는 곳','말레이시아에서 전 과정','말레이시아 + 해외 본교','말레이시아 1~2년 + 미국'],
      ['받는 학위증','2장 (말레이시아 + 해외)','1장 (해외 본교)','1장 (편입한 미국 대학)'],
      ['해외 체류','없음 (선택 가능)','1~2년','2~3년'],
      ['경로 확정 시점','입학 시 확정','입학 시 확정','매년 새로 지원 · 합격 보장 없음'],
      ['비용','가장 낮음','중간','가장 높음'],
      ['주 대상 국가','영국 · 미국','영국 · 호주','미국 · 캐나다'],
    ]});
  rect({ x:M, y:6.35, w:CW, h:0.62, fill:C.goldSoft, radius:0.07 });
  text({ t:'가장 중요한 차이 — 트위닝은 입학 시점에 해외 본교 프로그램에 이미 등록되어 경로가 확정됩니다. ADTP는 매년 새로 지원해야 하고 합격이 보장되지 않습니다.', x:M+0.28, y:6.35, w:CW-0.56, h:0.62, size:13, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('이 표 한 장이 학부모가 가장 헷갈리는 지점을 정리합니다. 특히 경로 확정 시점 행을 강조하십시오.');
}

/* ═══ 05 TWINNING ═══ */
{
  slide(false);
  head('04','TWINNING','트위닝 제도','말레이시아 대학에서 해외 본교 학위 과정을 이수하고, 해외 본교 명의의 학위를 받는 제도입니다.');
  tableEl({ x:M, y:2.0, w:6.9, rowH:0.46, size:12,
    colW:[1.4, 2.7, 1.3, 1.5],
    rows:[
      ['유형','구조','해외 체류','받는 학위'],
      ['3+0','말레이시아 3년 + 해외 0년','없음','본교 또는 복수 학위'],
      ['2+1','말레이시아 2년 + 해외 1년','1년','해외 본교 학위'],
      ['1+2','말레이시아 1년 + 해외 2년','2년','해외 본교 학위'],
      ['2+2 · 1+3','4년제 과정 (공학 등)','2~3년','해외 본교 학위'],
      ['ADTP','1~2년 이수 후 편입','2~3년','편입 대학'],
    ]});
  text({ t:'구간별 연간 학비', x:7.9, y:2.0, w:4.73, h:0.3, size:14, bold:true, color:C.ink });
  tableEl({ x:7.9, y:2.38, w:4.73, rowH:0.46, size:12,
    colW:[1.5, 1.73, 1.5],
    rows:[
      ['구간','연간 학비','원화 환산'],
      ['말레이시아','RM 27,000~54,000','900만~1,800만'],
      ['영국','£15,000~30,000','2,670만~5,340만'],
      ['호주','A$20,000~45,000','1,900만~4,275만'],
    ]});
  rect({ x:7.9, y:4.36, w:4.73, h:1.1, fill:C.goldSoft, radius:0.07 });
  text({ t:'비용 결론', x:8.14, y:4.5, w:4.25, h:0.26, size:12, bold:true, color:C.gold });
  text({ t:'3+0 이 압도적으로 유리합니다. 해외 본교에서 보내는 1년마다 학비가 2~3배로 뜁니다.', x:8.14, y:4.78, w:4.25, h:0.58, size:12, color:C.text, lh:1.4 });
  rect({ x:M, y:5.5, w:6.9, h:0.62, fill:C.sand, radius:0.07 });
  text({ t:'환율 기준  £1 ≈ 1,780원  ·  A$1 ≈ 950원  ·  RM 1 ≈ 339원', x:M+0.28, y:5.5, w:6.34, h:0.62, size:12, bold:true, color:C.deep, valign:'middle' });
  bottom('※ 환율은 안내 시점 기준입니다. 설명 당일 환율로 다시 계산하고 기준일을 표기하십시오.');
  note('트위닝과 학점 이전을 구분하는 것이 핵심입니다. 비용은 3+0가 압도적으로 유리합니다.');
}

/* ═══ 06 DUAL DEGREE (추가) ═══ */
{
  slide(false);
  head('05','DUAL DEGREE','복수 학위 — 학위증을 두 장 받는다','말레이시아에서 전 과정을 마치고, 두 대학이 각각 학위를 수여하는 구조');
  let x = M;
  [{ t:'말레이시아에서 전 과정', w:3.4, dark:false },
   { t:'말레이시아 대학 학위증', w:3.4, dark:true },
   { t:'해외 대학 학위증', w:3.4, dark:true, gold:true }].forEach((s,i,arr)=>{
    rect({ x, y:2.0, w:s.w, h:0.9, fill:s.dark?C.deep:C.sand, radius:0.07 });
    text({ t:s.t, x:x+0.2, y:2.0, w:s.w-0.4, h:0.9, size:14, bold:true, color:s.gold?C.gold:(s.dark?C.paper:C.ink), valign:'middle' });
    x += s.w;
    if (i < arr.length-1){ text({ t:'▶', x:x+0.04, y:2.3, w:0.34, h:0.3, size:14, color:C.gold, align:'center' }); x += 0.42; }
  });
  const dc = (px_, head_, big, body) => {
    rect({ x:px_, y:3.1, w:5.86, h:2.5, fill:C.sand, radius:0.08 });
    text({ t:head_, x:px_+0.3, y:3.28, w:5.26, h:0.32, size:15, bold:true, color:C.deep });
    text({ t:big, x:px_+0.3, y:3.68, w:5.26, h:0.38, size:18, bold:true, color:C.ink });
    text({ t:body, x:px_+0.3, y:4.16, w:5.26, h:1.3, size:12, color:C.text, lh:1.45 });
  };
  dc(M, '선웨이 × 랭커스터 대학교 (영국)', '추가 비용 없음 · 기본 등록금 포함',
     '2006년부터 이어온 파트너십으로 영국–말레이시아 대학 간 최대 규모입니다. 7,000명 이상이 31개 학위 과정에서 공부했습니다. 졸업 시 선웨이·랭커스터 2개 학위증을 받고 양교 동문 자격을 갖습니다.\n단, 랭커스터 협력 프로그램(경영·컴퓨팅·심리 등)에 한합니다.');
  dc(M+6.07, "테일러스 × UWE 브리스톨(영국) · QUT(호주)", '경영 · 컴퓨팅 계열 중심',
     '영국 UWE 브리스톨, 호주 퀸즐랜드공대(QUT)와 복수 학위(Dual Award)를 운영합니다. 과정을 마치면 테일러스와 파트너 대학 학위증을 함께 받습니다.\n운영 학과가 한정되어 있으므로 지망 전공이 대상인지 반드시 확인하십시오.');
  rect({ x:M, y:5.78, w:CW, h:0.6, fill:C.brickSoft, radius:0.07 });
  text({ t:'오해 방지 — 학위증이 두 장이어도 학비가 두 배는 아닙니다. 한 과정을 이수하고 두 기관이 각각 수여합니다.', x:M+0.28, y:5.78, w:CW-0.56, h:0.6, size:13, bold:true, color:C.brick, valign:'middle' });
  bottom('출처: Lancaster University — Sunway Partnership · Taylor\'s University — Dual Awards · UWE Bristol');
  note('복수 학위는 해외에 나가지 않고도 해외 학위를 받는 구조라 비용이 가장 낮고, 부모가 가장 선호합니다.');
}

/* ═══ 07 ADTP (추가) ═══ */
{
  slide(false);
  head('06','ADTP','학점 이전 편입 — American Degree Transfer Program','말레이시아에서 미국 학점을 쌓은 뒤 미국 대학 3학년으로 편입합니다');
  let x = M;
  [{ a:'말레이시아 ADTP', b:'1~2년 · 교양 + 기초 전공', w:3.4, my:true },
   { a:'미국 대학 편입', b:'2~3년 · 전공 심화', w:3.4, my:true },
   { a:'미국 대학 학위증', b:'편입 대학 명의 1장', w:3.4 }].forEach((s,i,arr)=>{
    rect({ x, y:2.0, w:s.w, h:0.96, fill:s.my?C.sand:C.deep, radius:0.07 });
    text({ t:s.a, x:x+0.2, y:2.14, w:s.w-0.4, h:0.34, size:14, bold:true, color:s.my?C.ink:C.paper });
    text({ t:s.b, x:x+0.2, y:2.5, w:s.w-0.4, h:0.3, size:11.5, color:s.my?C.muted:C.gold });
    x += s.w;
    if (i < arr.length-1){ text({ t:'▶', x:x+0.04, y:2.34, w:0.34, h:0.3, size:14, color:C.gold, align:'center' }); x += 0.42; }
  });
  const yr = (px_, nm, year, age, body) => {
    rect({ x:px_, y:3.16, w:5.86, h:2.26, fill:C.sand, radius:0.08 });
    text({ t:nm, x:px_+0.3, y:3.32, w:5.26, h:0.3, size:14, bold:true, color:C.deep });
    text({ t:year, x:px_+0.3, y:3.66, w:2.4, h:0.7, size:44, bold:true, color:C.ink, lh:1 });
    text({ t:age, x:px_+2.9, y:3.9, w:2.66, h:0.34, size:15, bold:true, color:C.gold, valign:'middle' });
    text({ t:body, x:px_+0.3, y:4.48, w:5.26, h:0.84, size:12, color:C.text, lh:1.42 });
  };
  yr(M, '선웨이 — 미국 과정 개설', '1987', '올해로 39년', '미국 웨스턴미시간대와의 트위닝으로 출발해, 2010~2012년에 여러 대학으로 편입할 수 있는 Transfer 방식으로 전환했습니다.');
  yr(M+6.07, '테일러스 — ADTP 개설', '1996', '올해로 30년', '개설 이래 5,000명 이상이 미국 상위권 대학으로 편입했다고 학교는 밝히고 있습니다. 전공 12개 계열로 폭이 넓습니다.');
  rect({ x:M, y:5.56, w:CW, h:0.9, fill:C.brickSoft, radius:0.07 });
  text({ t:'반드시 함께 안내할 것 — ADTP는 합격 보장이 아닙니다', x:M+0.28, y:5.66, w:CW-0.56, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'트위닝과 달리 매년 미국 대학에 새로 지원해야 하며, 과목 실라버스가 목표 대학과 맞지 않으면 학점이 인정되지 않아 미국에서 다시 들어야 합니다. 입학 초기부터 전담 어드바이저와 과목 매핑을 문서로 확인하십시오.', x:M+0.28, y:5.96, w:CW-0.56, h:0.44, size:11.5, color:C.text, lh:1.3 });
  bottom('출처: Sunway University — Center for American Education 연혁 · Taylor\'s University — ADTP');
  note('선웨이가 테일러스보다 9년 앞섭니다. 그리고 선웨이 미국 과정이 트위닝에서 출발했다는 사실이 세 경로를 하나로 묶어 줍니다.');
}

/* ═══ 08 ADTP 편입 사례 (요청) ═══ */
{
  slide(false);
  head('07','ADTP PLACEMENTS','ADTP 편입 사례','학교가 공개한 실제 편입 기록입니다. 출처 성격을 함께 밝혀 주십시오.');
  text({ t:'선웨이 — 학교 공개 동문 사례', x:M, y:2.0, w:5.86, h:0.3, size:14, bold:true, color:C.deep });
  const su = [
    ['Aaron Arul A/L Patrick','애리조나주립대 (ASU)','공학'],
    ['Ho Xiang Ting','미시간대 앤아버','커뮤니케이션'],
    ['Christian Trey Jackson','드레이크대학교','마케팅경영'],
  ];
  su.forEach((r,i)=>{
    const y = 2.4 + i*0.72;
    rect({ x:M, y, w:5.86, h:0.62, fill:i%2?C.paper:C.sand, lineColor:C.line, radius:0.05 });
    text({ t:r[0], x:M+0.24, y, w:2.3, h:0.62, size:12, color:C.text, valign:'middle' });
    text({ t:r[1], x:M+2.6, y, w:2.2, h:0.62, size:12.5, bold:true, color:C.ink, valign:'middle' });
    text({ t:r[2], x:M+4.84, y, w:0.9, h:0.62, size:11, color:C.muted, valign:'middle' });
  });
  text({ t:'테일러스 — 학교 공개 편입 대학', x:M+6.07, y:2.0, w:5.86, h:0.3, size:14, bold:true, color:C.deep });
  const ta = ['퍼듀대학교 웨스트라피엣','미시간대 앤아버','일리노이대 어배너-섐페인','미네소타대 트윈시티'];
  ta.forEach((t,i)=>{
    const y = 2.4 + i*0.54;
    circle({ x:M+6.07, y:y+0.06, d:0.3, fill:C.deep, label:String(i+1), labelSize:11, labelColor:C.gold });
    text({ t, x:M+6.49, y, w:5.44, h:0.42, size:13, color:C.text, valign:'middle' });
  });
  rect({ x:M+6.07, y:4.66, w:5.86, h:0.68, fill:C.deep, radius:0.07 });
  text({ t:'5,000명+', x:M+6.31, y:4.72, w:1.9, h:0.56, size:22, bold:true, color:C.gold, valign:'middle' });
  text({ t:'테일러스가 밝힌 미국 상위권 대학 누적 편입 인원', x:M+8.3, y:4.66, w:3.4, h:0.68, size:11.5, color:C.onDark, valign:'middle', lh:1.3 });
  rect({ x:M, y:5.56, w:CW, h:1.0, fill:C.brickSoft, radius:0.07 });
  text({ t:'표현에 주의 — "편입 실적"과 "공식 연계"는 다릅니다', x:M+0.28, y:5.66, w:CW-0.56, h:0.3, size:13, bold:true, color:C.brick });
  text({ t:'선웨이 학생이 코넬·NYU·보스턴대·펜스테이트·위스콘신·퍼듀로 편입한 기록은 있으나, 이는 개별 학생의 합격 결과이지 학교 간 공식 연계나 편입 보장 협약이 아닙니다. "코넬·NYU 편입 가능"이라는 식의 안내는 과장이므로 쓰지 마시고, "편입 실적이 보고된 대학"으로 표현하십시오.', x:M+0.28, y:5.96, w:CW-0.56, h:0.5, size:11.5, color:C.text, lh:1.4 });
  bottom('출처: Sunway University ADTP 동문 페이지 · Taylor\'s University — Successful University Placements / University Transfers');
  note('사례는 학교가 스스로 공개한 것만 썼습니다. 커뮤니티에서 도는 이름은 넣지 않았습니다. 마지막 경고 문구를 꼭 읽어 주십시오.');
}

/* ═══ 09 학사 입학 시기 (요청) ═══ */
{
  slide(false);
  head('08','INTAKE','학사 입학 시기','입학 시기가 전체 일정을 결정합니다. 원서는 개강 12~16주 전에 접수해야 합니다.');
  rect({ x:W-M-1.86, y:0.6, w:1.86, h:0.36, fill:C.deep, radius:0.05 });
  text({ t:'학교 확인 완료', x:W-M-1.86, y:0.6, w:1.86, h:0.36, size:11, bold:true, color:C.gold, align:'center', valign:'middle' });
  const sch = [
    { nm:'선웨이 대학교', ug:['1월','4월','9월'], fd:'FIA · FIST  1월 · 4월 · 8월\nMUFY  1월 · 7월 · 8월' },
    { nm:'테일러스 대학교', ug:['2월','4월','9월'], fd:'2월 · 4월 · 8월' },
  ];
  sch.forEach((s,i)=>{
    const x = M + i*6.07;
    rect({ x, y:2.0, w:5.86, h:2.7, fill:C.sand, radius:0.08 });
    text({ t:s.nm, x:x+0.3, y:2.18, w:5.26, h:0.36, size:18, bold:true, color:C.ink });
    text({ t:'학사 (본과) 입학', x:x+0.3, y:2.6, w:5.26, h:0.26, size:11, bold:true, color:C.deep, cs:1 });
    s.ug.forEach((m,j)=>{
      rect({ x:x+0.3+j*1.78, y:2.92, w:1.62, h:0.78, fill:C.deep, radius:0.06 });
      text({ t:m, x:x+0.3+j*1.78, y:2.92, w:1.62, h:0.78, size:22, bold:true, color:C.gold, align:'center', valign:'middle' });
    });
    text({ t:'파운데이션 입학', x:x+0.3, y:3.84, w:5.26, h:0.26, size:11, bold:true, color:C.deep, cs:1 });
    text({ t:s.fd, x:x+0.3, y:4.12, w:5.26, h:0.5, size:12.5, color:C.text, lh:1.35 });
  });
  rect({ x:M, y:4.9, w:5.86, h:1.5, fill:C.goldSoft, radius:0.08 });
  text({ t:'A플랜이 1~2월인 이유', x:M+0.3, y:5.04, w:5.26, h:0.28, size:13, bold:true, color:C.gold });
  text({ t:'선웨이 1월, 테일러스 2월 입학이 가장 여유 있는 진입 시기입니다. 검정고시 1회(4월) → 영사확인 → 어학 → 10월 원서 순으로 무리 없이 이어집니다.', x:M+0.3, y:5.34, w:5.26, h:0.94, size:12, color:C.text, lh:1.45 });
  rect({ x:M+6.07, y:4.9, w:5.86, h:1.5, fill:C.brickSoft, radius:0.08 });
  text({ t:'9월 입학을 택할 때 주의', x:M+6.37, y:5.04, w:5.26, h:0.28, size:13, bold:true, color:C.brick });
  text({ t:'9월은 두 학교 공통 인테이크지만 전 세계 지원이 몰리는 피크입니다. 인기 학과는 외국인 정원이 먼저 차고 EMGS 심사도 밀립니다. 최소 16주 전 접수를 권합니다.', x:M+6.37, y:5.34, w:5.26, h:0.94, size:12, color:C.text, lh:1.45 });
  bottom('※ 학사·파운데이션 입학 시기는 두 학교에 직접 문의해 확인한 내용입니다.');
  note('학부모가 가장 먼저 묻는 것이 "언제 들어가느냐"입니다. 선웨이 1월, 테일러스 2월. 이 두 숫자만 기억하시면 됩니다.');
}

/* ═══ 10 테일러스 개요 ═══ */
{
  slide(false);
  head('09','추천 대학 01',"테일러스 대학교  Taylor's University",'1969년 설립된 말레이시아 최상위권 사립대학교입니다. 호텔·관광 분야는 7년 연속 세계 Top 20~30위권을 유지하고 있으며, 80~90개국 다국적 학생이 재학 중입니다.');
  [['#272','QS 2027 세계 순위'],['2위','말레이시아 사립대'],['#26','호텔경영 세계 순위']].forEach((s,i)=>{
    const x = M + i*2.6;
    rect({ x, y:2.0, w:2.42, h:1.18, fill:C.deep, radius:0.08 });
    text({ t:s[0], x:x+0.22, y:2.14, w:2.0, h:0.56, size:28, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.22, y:2.74, w:2.0, h:0.3, size:11, color:C.onDark });
  });
  tableEl({ x:M, y:3.4, w:CW, rowH:0.42, size:12,
    colW:[2.6, 9.33],
    rows:[
      ['구분','내용'],
      ['학사 입학 시기','2월 · 4월 · 9월'],
      ['파운데이션 입학','2월 · 4월 · 8월'],
      ['학력 조건','고교 졸업 또는 검정고시'],
      ['공인 영어','학사 IELTS 6.0 (= TOEFL iBT 60~78) / 파운데이션 IELTS 5.0~5.5'],
      ['직행 가능 계열','호텔경영·관광(세계 #26위), 경영학 계열 전체'],
      ['파운데이션 필수','BEng 공학사(기계·화학 등), BSc 이학사(약학·데이터사이언스 등)'],
      ['학제','3년제 120학점 내외 (경영·호텔) / 4년제 130~140학점 (공대·약대)'],
    ]});
  bottom('※ 원문의 "말레이시아 사립대 1위" 표현은 사실과 달라 2위로 바로잡았습니다.');
  note('테일러스의 결정적 강점은 호텔·관광 세계 26위입니다.');
}

/* ═══ 11 테일러스 학비·경로 ═══ */
{
  slide(false);
  head('10',"TAYLOR'S — 학비 및 글로벌 학위",'테일러스 학비와 진학 경로','국제학생 기준 (2026)');
  tableEl({ x:M, y:2.0, w:6.9, rowH:0.5, size:12.5,
    colW:[2.2, 1.7, 1.6, 1.4],
    rows:[
      ['과정','총 학비 (RM)','원화 환산','연간'],
      ['파운데이션 1년','44,044','약 1,490만','—'],
      ['국제호텔경영 3년','133,146','약 4,510만','약 1,500만'],
      ['기계공학 4년','연 50,184','약 6,810만','약 1,700만'],
      ['화학공학 4년','연 42,240','약 5,730만','약 1,430만'],
    ]});
  text({ t:'글로벌 학위 · 편입 경로', x:7.9, y:2.0, w:4.73, h:0.3, size:14, bold:true, color:C.ink });
  const tp = [
    ['복수 학위 (Dual Award)','UWE 브리스톨(영국) · QUT(호주) — 경영·컴퓨팅 계열'],
    ['트위닝 · 편입','호주 디킨·모나쉬·QUT·멜버른·남호주대, 영국 샐퍼드·UWE, 뉴질랜드'],
    ['ADTP (학점 이전)','1996년 개설 · 미국 상위권 편입. 합격 보장 아님'],
  ];
  tp.forEach((r,i)=>{
    const y = 2.4 + i*1.06;
    rect({ x:7.9, y, w:4.73, h:0.94, fill:C.sand, radius:0.06 });
    text({ t:r[0], x:8.14, y:y+0.12, w:4.25, h:0.28, size:12.5, bold:true, color:C.deep });
    text({ t:r[1], x:8.14, y:y+0.42, w:4.25, h:0.44, size:11, color:C.text, lh:1.35 });
  });
  rect({ x:M, y:4.7, w:6.9, h:1.1, fill:C.brickSoft, radius:0.07 });
  text({ t:'학비 읽는 법', x:M+0.28, y:4.82, w:6.34, h:0.28, size:12.5, bold:true, color:C.brick });
  text({ t:'호텔경영 3년은 총액 4,510만 원, 공학 4년은 연간 표기입니다. 총액인지 연간인지 반드시 구분해 안내하십시오.', x:M+0.28, y:5.12, w:6.34, h:0.56, size:12, color:C.text, lh:1.4 });
  bottom('');
  note('학비는 호텔경영 3년 기준 총 4,510만 원 수준입니다. 미국 편입 경로는 합격 보장이 아니라는 점을 반드시 안내해야 합니다.');
}

/* ═══ 12 선웨이 개요 ═══ */
{
  slide(false);
  head('11','추천 대학 02','선웨이 대학교  Sunway University','1987년 설립, Jeffrey Cheah 재단이 지원하는 사립대학교입니다. 90개국 이상의 다국적 학생이 재학 중입니다.');
  [['#354','QS 2027 세계 순위'],['+50','전년 대비 상승'],['$0','랭커스터 복수학위 추가비']].forEach((s,i)=>{
    const x = M + i*2.6;
    rect({ x, y:2.0, w:2.42, h:1.18, fill:C.deep, radius:0.08 });
    text({ t:s[0], x:x+0.22, y:2.14, w:2.0, h:0.56, size:28, bold:true, color:C.gold, lh:1 });
    text({ t:s[1], x:x+0.22, y:2.74, w:2.0, h:0.3, size:11, color:C.onDark });
  });
  tableEl({ x:M, y:3.4, w:CW, rowH:0.42, size:12,
    colW:[2.6, 9.33],
    rows:[
      ['구분','내용'],
      ['학사 입학 시기','1월 · 4월 · 9월'],
      ['파운데이션 입학','FIA · FIST (1·4·8월, 3학기 / 평가 출석·에세이·발표 50% + 시험 50%) · MUFY (1·7·8월, 2학기 / 70% + 30%)'],
      ['학력 조건','고교 졸업 또는 검정고시'],
      ['공인 영어','학사 IELTS 6.0 (= TOEFL iBT 60 이상) / 파운데이션·디플로마 IELTS 5.0~5.5'],
      ['직행 가능 계열','BA 인문사회과학 전반, BSc 경영학 · 호텔경영학'],
      ['파운데이션 필수','BEng 공학사(전자·화학 등), BSc 컴퓨터공학 · 바이오메디컬 · 순수과학'],
      ['학제','3년제 120학점 내외 (영국식) / 4년제 130~140학점'],
    ]});
  bottom('※ QS 354위와 THE 303위를 혼동하지 마십시오. 위 수치는 QS 2027 기준입니다.');
  note('선웨이는 학비 가성비와 랭커스터 복수 학위가 핵심입니다.');
}

/* ═══ 13 선웨이 학비·경로 ═══ */
{
  slide(false);
  head('12','SUNWAY — 학비 및 글로벌 학위','선웨이 학비와 진학 경로','국제학생 기준 (2026)');
  tableEl({ x:M, y:2.0, w:6.9, rowH:0.52, size:12.5,
    colW:[2.5, 2.3, 2.1],
    rows:[
      ['과정','총 학비','원화 환산'],
      ['파운데이션 1년','RM 17,850~29,350','약 610만~990만 원'],
      ['학사 경영계열 1년','USD 6,820~9,091','약 910만~1,290만 원'],
      ['학사 공학계열 1년','RM 38,392','약 1,300만~1,400만 원'],
    ]});
  text({ t:'글로벌 학위 · 편입 경로', x:7.9, y:2.0, w:4.73, h:0.3, size:14, bold:true, color:C.ink });
  const sp = [
    ['복수 학위 — 랭커스터 대학교','졸업 시 2개 학위증 · 양교 동문 자격. 추가 비용 없이 기본 등록금에 포함. 단 협력 프로그램(경영·컴퓨팅·심리 등)에 한함'],
    ['미국 공식 파트너십 — ASU','Cintana Alliance 파트너 · 20개 이상 패스웨이 · 최대 90학점 이전'],
    ['ADTP (학점 이전)','1987년 개설 · 2,000개 이상 대학 중 선택 가능. 합격 보장 아님'],
  ];
  sp.forEach((r,i)=>{
    const y = 2.4 + i*1.14;
    rect({ x:7.9, y, w:4.73, h:1.02, fill:C.sand, radius:0.06 });
    text({ t:r[0], x:8.14, y:y+0.1, w:4.25, h:0.28, size:12.5, bold:true, color:C.deep });
    text({ t:r[1], x:8.14, y:y+0.4, w:4.25, h:0.54, size:10.5, color:C.text, lh:1.35 });
  });
  rect({ x:M, y:4.3, w:6.9, h:1.5, fill:C.goldSoft, radius:0.07 });
  text({ t:'선웨이의 결정적 장점', x:M+0.28, y:4.44, w:6.34, h:0.3, size:13, bold:true, color:C.gold });
  text({ t:'랭커스터 복수 학위에 추가 비용이 없습니다. 영국 학위를 받기 위해 영국에 가지 않아도 되고, 등록금도 더 내지 않습니다. 세 경로 가운데 비용 대비 효율이 가장 높은 선택입니다.', x:M+0.28, y:4.78, w:6.34, h:0.92, size:12.5, color:C.text, lh:1.45 });
  bottom('');
  note('선웨이의 랭커스터 복수 학위와 ASU 파트너십은 공식 자료로 확인됩니다.');
}

/* ═══ 14 지원 자격 ═══ */
{
  slide(false);
  head('13','ELIGIBILITY','IM 말레이시아 지원 자격','아래 네 가지 조건이 모두 준비된 학생만 지원 가능합니다.');
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
  text({ t:'TOEFL iBT 60점은 IELTS 6.0의 하한선이므로 전공에 따라 미달될 수 있습니다. 본과 직행을 노린다면 70점대를 목표로 하십시오. 성적 유효기간은 2년입니다.', x:M+0.28, y:5.52, w:CW-0.56, h:0.48, size:12, color:C.text, lh:1.4 });
  bottom('');
  note('영어 점수가 가장 큰 변수입니다. TOEFL 60점은 본과 직행 최저선이라 여유를 두는 편이 안전합니다.');
}

/* ═══ 15 입학 절차 ═══ */
{
  slide(false);
  head('14','ADMISSION PROCESS','입학 절차 6단계','4단계 원서 접수 시점이 전체 일정을 좌우합니다. 개강 8주 전 마감이 원칙이며, 국제학생은 12~16주 전 접수를 권장합니다.');
  const st = [
    ['디렉터 상담 후 입학 시기 결정','학생 개인의 학력 조건에 맞추어 지망 학교와 학과를 설정합니다.'],
    ['필말레이시아존 유학 과정','필리핀 IM해외선교본부 과정을 통해 유학과 어학을 준비합니다.'],
    ['IM말레이시아 입학 신청','IM말레이시아에 필요한 서류를 준비하여 신청합니다.'],
    ['유학 서류 준비 및 원서 접수','개강 최소 3개월 전 권장. 이 단계가 전체 일정을 결정합니다.'],
    ['입학허가서(Offer Letter) 수령','사립대 기준 1~2주 심사 후 발송. 수락 서명 후 재제출합니다.'],
    ['비자 신청 및 입국비자 진행','학교가 EMGS를 통해 학생 비자를 신청·대행합니다.'],
  ];
  st.forEach((s,i)=>{
    const x = M + (i%3)*4.04, y = 2.0 + Math.floor(i/3)*2.0;
    const hot = i === 3;
    rect({ x, y, w:3.86, h:1.8, fill:hot?C.deep:C.sand, radius:0.08 });
    text({ t:'STEP '+(i+1), x:x+0.28, y:y+0.18, w:3.3, h:0.26, size:10.5, bold:true, color:hot?C.gold:C.mid, cs:1.5 });
    text({ t:s[0], x:x+0.28, y:y+0.5, w:3.3, h:0.6, size:14, bold:true, color:hot?C.paper:C.ink, lh:1.25 });
    text({ t:s[1], x:x+0.28, y:y+1.12, w:3.3, h:0.56, size:11, color:hot?C.onDarkMute:C.text, lh:1.4 });
  });
  bottom('');
  note('가장 흔한 실수가 원서를 늦게 내는 것입니다. 4단계에서 12~16주 전 접수를 못 맞추면 다음 인테이크로 밀립니다.');
}

/* ═══ 16 비자 + 서류 인증 정정 ═══ */
{
  slide(false);
  head('15','STUDENT VISA','비자 발급 절차와 리드타임','전체 비자 절차에 4~8주가 소요되므로, 입학 예정일 3~4개월 전에 시작해야 안전합니다.');
  const vs = [
    '입학허가서 수령 및 서명 후 제출',
    '학교가 서포팅레터 첨부 후 EMGS 비자신청서 제출 및 비용 납부',
    'EMGS 비자 서류 심사  (2~4주)',
    '이민국 최종 승인 여부 결정',
    '이민국 승인 후 비자허가서(VAL) 발급  — 합계 4~8주',
    '항공권 구매 후 입국 비자(SEV 또는 eVisa) 신청',
    '입국 비자 승인 후 입국',
    '입국 후 1주일 이내 현지 신체검사 진행 후 여권 제출',
    '비자 스티커가 붙은 여권 수령  (제출 후 2~4주)',
  ];
  vs.forEach((t,i)=>{
    const y = 2.0 + i*0.44;
    circle({ x:M, y:y+0.06, d:0.3, fill:C.deep, label:String(i+1), labelSize:11, labelColor:C.gold });
    text({ t, x:M+0.42, y, w:6.2, h:0.42, size:12, color:C.text, valign:'middle' });
  });
  rect({ x:7.3, y:2.0, w:5.33, h:2.04, fill:C.brickSoft, radius:0.08 });
  text({ t:'⚠ 서류 인증 — 아포스티유가 아닙니다', x:7.56, y:2.14, w:4.81, h:0.3, size:14, bold:true, color:C.brick });
  text({ t:'말레이시아는 헤이그 아포스티유 협약 비가입국입니다.\n\n한국에서 발급한 검정고시 합격증명서·성적증명서는 아포스티유가 아니라 영사확인(외교부 → 주한 말레이시아 대사관)을 밟아야 합니다.', x:7.56, y:2.5, w:4.81, h:1.4, size:12, color:C.text, lh:1.45 });
  rect({ x:7.3, y:4.22, w:5.33, h:1.0, fill:C.sand, radius:0.08 });
  text({ t:'귀국·편입 시에도 동일', x:7.56, y:4.34, w:4.81, h:0.28, size:12.5, bold:true, color:C.deep });
  text({ t:'한국 대학 편입 시에도 말레이시아 대학 서류는 주말레이시아 한국대사관 영사확인이 필요합니다.', x:7.56, y:4.64, w:4.81, h:0.48, size:11.5, color:C.text, lh:1.4 });
  rect({ x:7.3, y:5.4, w:5.33, h:0.86, fill:C.goldSoft, radius:0.08 });
  text({ t:'일정에 2~3주를 더 잡으십시오', x:7.56, y:5.52, w:4.81, h:0.28, size:12.5, bold:true, color:C.gold });
  text({ t:'영사확인 절차에만 2~3주가 추가로 듭니다. 검정고시 합격 발표 직후 착수해야 합니다.', x:7.56, y:5.8, w:4.81, h:0.38, size:11.5, color:C.text });
  bottom('출처: 말레이시아는 헤이그 아포스티유 협약 비가입국 — 영사 인증(consular legalisation) 체계를 유지합니다.');
  note('아포스티유는 말레이시아에 통하지 않습니다. 영사확인으로 진행해야 하며, 이 절차에만 2~3주가 더 듭니다. 이전 안내문에 아포스티유로 적힌 부분이 있다면 모두 정정하십시오.');
}

/* ═══ 17 타임라인 A ═══ */
{
  slide(false);
  head('16','TIMELINE A','A플랜 · 1~2월 입학','선웨이 1월 · 테일러스 2월 — 가장 여유 있는 최적 진입 시기');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.46, size:12,
    colW:[1.3, 7.33, 3.3],
    rows:[
      ['시기','주요 활동 및 행정 절차','체크포인트'],
      ['02','고졸 검정고시 제1회 원서 접수','시·도 교육청 공고 확인'],
      ['04','검정고시 제1회 응시 (평균 80점 이상 목표)','시험일 4월 초·중순'],
      ['05 중순','합격자 발표 → 영문 합격증명서·성적증명서 발급','발표 후 영사확인 절차 착수'],
      ['05~10','필리핀 IM해외선교본부 6개월 과정','영어 몰입 훈련'],
      ['09','IELTS / TOEFL 1차 응시','미달 시 10월 재응시 (성적 유효 2년)'],
      ['10','대학 원서 접수 (선웨이 1월 / 테일러스 2월)','개강 12~16주 전'],
      ['10~11','EMGS 비자 신청 및 심사','4~8주 소요'],
      ['12','Offer Letter · VAL 수령 → eVisa 신청, 항공권 예약','출국 최종 점검'],
      ['01 / 02','선웨이(1월) · 테일러스(2월) 정식 입학','가장 여유 있는 최적 진입 시기'],
    ]});
  bottom('');
  note('A플랜의 핵심은 10월 원서 접수입니다. 비자 심사를 감안해 앞당겼습니다.');
}

/* ═══ 18 타임라인 B ═══ */
{
  slide(false);
  head('17','TIMELINE B','B플랜 · 4월 입학','선웨이 · 테일러스 공통 — 한국 학제 졸업 후 가장 빠른 입학');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.46, size:12,
    colW:[1.3, 7.33, 3.3],
    rows:[
      ['시기','주요 활동 및 행정 절차','체크포인트'],
      ['06','고졸 검정고시 제2회 원서 접수','시·도 교육청 공고 확인'],
      ['08','검정고시 제2회 응시','시험일 8월 초·중순'],
      ['09','영문 증명서 발급 + 영사확인','발표 후 영사확인 절차 착수'],
      ['09~02','필리핀 IM해외선교본부 6개월 과정','영어 몰입 훈련'],
      ['11~12','IELTS / TOEFL 1차 응시','미달 시 12월 재응시 (성적 유효 2년)'],
      ['12~01','대학 원서 접수 (4월 개강)','개강 12~16주 전'],
      ['01~02','EMGS 비자 심사','4~8주'],
      ['03','Offer Letter · VAL 수령 → eVisa 신청, 항공권 예약','출국 최종 점검'],
      ['04','선웨이 · 테일러스 4월 정식 입학','한국 학제 졸업 후 가장 빠른 입학'],
    ]});
  rect({ x:M, y:6.52, w:CW, h:0.5, fill:C.brickSoft, radius:0.06 });
  text({ t:'B플랜의 최대 약점은 어학 확보 기간이 짧다는 것입니다. 무리하지 말고 C플랜(9월 입학)을 예비로 준비해 두십시오.', x:M+0.28, y:6.52, w:CW-0.56, h:0.5, size:12, bold:true, color:C.brick, valign:'middle' });
  bottom('');
  note('B플랜은 어학 확보 기간이 짧은 것이 최대 약점입니다.');
}

/* ═══ 19 예산 ═══ */
{
  slide(false);
  head('18','BUDGET','졸업까지 총 예산','장학금을 하나도 넣지 않은 금액입니다. 성적우수자 장학 혜택이 별도로 있습니다.');
  tableEl({ x:M, y:2.0, w:CW, rowH:0.54, size:12,
    colW:[2.6, 3.11, 3.11, 3.11],
    rows:[
      ['항목','테일러스 3년','선웨이 3년','공학 5년'],
      ['연간 학비','약 1,500만','910만~1,290만','1,430만~1,710만'],
      ['학생비자 갱신','약 140만','약 140만','약 140만'],
      ['IM 공동체 운영비','1,440만 (120×12)','1,440만 (120×12)','1,440만 (120×12)'],
      ['입학비 (1회)','500만','500만','500만'],
      ['연간 소계','1년 3,500만~3,600만\n2·3년 3,000만~3,100만','1년 3,000만~3,300만\n2·3년 2,500만~2,800만','1년 3,500만~3,900만\n이후 3,000만~3,400만'],
      ['수학 기간','3년','3년','파운데이션 1년 + 본과 4년'],
      ['졸업까지 총액','9,500만~9,800만','8,000만~8,900만','1억 5,500만~1억 7,500만'],
    ]});
  rect({ x:M, y:6.5, w:CW, h:0.5, fill:C.goldSoft, radius:0.06 });
  text({ t:'입학비는 이전 공동체 입학금을 최대 200만 원까지 인정합니다. 공대 지망자는 반드시 5년 예산으로 잡으십시오.', x:M+0.28, y:6.5, w:CW-0.56, h:0.5, size:12, bold:true, color:C.ink, valign:'middle' });
  bottom('');
  note('공대 지망자는 파운데이션 1년이 붙어 5년 예산이 됩니다. 총액이 두 배 가까이 차이 납니다.');
}

/* ═══ 20 확인 항목 · 출처 ═══ */
{
  slide(true);
  head('19','CHECKLIST','설명회 전에 확인할 것','아래는 학교·기관에 직접 확인해 확정해야 하는 항목입니다', true);
  const items = [
    ['학과별 지원 마감일','입학 시기는 확인 완료. 학과별 원서 마감일만 추가 확인'],
    ['검정고시로 본과 직행 가능 여부','두 학교 입학처 서면 회신 확보'],
    ['복수 학위·트위닝 운영 학과 목록','전 학과가 아니므로 지망 전공 포함 여부 확인'],
    ['학비 — 연간인지 총액인지','공식 Fees Schedule 원본으로 대조'],
    ['영사확인 절차와 소요 기간','외교부 → 주한 말레이시아 대사관 최신 안내'],
    ['환율 기준일','설명 당일 환율로 원화 환산표 재작성'],
  ];
  items.forEach((it,i)=>{
    const x = M + (i%2)*6.07, y = 2.0 + Math.floor(i/2)*0.92;
    circle({ x, y:y+0.08, d:0.32, fill:C.gold, label:String(i+1), labelSize:12, labelColor:C.ink });
    text({ t:it[0], x:x+0.46, y:y, w:5.4, h:0.32, size:13, bold:true, color:C.onDark });
    text({ t:it[1], x:x+0.46, y:y+0.34, w:5.4, h:0.4, size:11, color:C.onDarkMute, lh:1.3 });
  });
  rect({ x:M, y:4.96, w:CW, h:1.4, fill:C.deep, radius:0.08 });
  text({ t:'출처', x:M+0.3, y:5.08, w:CW-0.6, h:0.24, size:10.5, bold:true, color:C.gold, cs:1.5 });
  text({ t:'IM 말레이시아 입학안내문 2027 원본  ·  Sunway University — School of American Education / Center for American Education 연혁 / ADTP 동문  ·  Lancaster University — Sunway Partnership  ·  Taylor\'s University — ADTP, Successful University Placements, University Transfers, Dual Awards  ·  UWE Bristol  ·  헤이그 아포스티유 협약 가입국 현황', x:M+0.3, y:5.36, w:CW-0.6, h:0.9, size:11, color:C.onDarkMute, lh:1.45 });
  text({ t:'학사·파운데이션 입학 시기와 과정 구성은 학교 문의로 확인된 내용입니다. 학비·순위 등 나머지 수치는 원본 안내문과 3자 집계 자료 기준이므로, 대외 배포 전 위 6개 항목을 확정하십시오.', x:M, y:6.44, w:CW, h:0.48, size:11, color:C.onDarkMute, lh:1.3 });
  note('이 슬라이드는 내부용입니다. 학부모 배포본에서는 빼십시오.');
}

D.save('IM말레이시아_입학안내문_2027_통합판.pptx', PREVIEW);
