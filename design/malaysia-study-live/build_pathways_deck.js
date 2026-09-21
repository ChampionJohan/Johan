// 세 가지 경로(듀얼디그리 · 트위닝 · ADTP) 간단 정리 덱
const K = require('./deck_kit.js');
const D = K.createDeck('선웨이 · 테일러스 — 세 가지 해외 학위 경로');
const { slide, rect, circle, text, bullets, tableEl, title, foot, note, C, W, H, M } = D;

const PREVIEW = '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/pathways-preview.html';

/* ── 1. 표지 ───────────────────────── */
{
  slide(true);
  text({ t:'해외 학위로 가는\n세 가지 길', x:M, y:1.3, w:8.8, h:1.5, size:42, bold:true, color:C.paper, lh:1.15 });
  text({ t:'듀얼 디그리  ·  트위닝  ·  ADTP', x:M, y:2.92, w:8.8, h:0.4, size:18, bold:true, color:C.gold });
  text({ t:'선웨이대학교 · 테일러스대학교 비교 정리', x:M, y:3.4, w:8.8, h:0.32, size:13, color:C.onDarkMute });
  rect({ x:M, y:3.94, w:9.0, h:0.02, fill:C.deep });
  ['① 학위증을 두 장 받는다','② 두 나라에 나눠 다닌다','③ 학점만 들고 편입한다'].forEach((t,i)=>{
    text({ t, x:M+i*3.0, y:4.08, w:2.9, h:0.34, size:12, bold:true, color:C.onDark });
  });
  text({ t:'필리핀 해외선교본부 · 말레이시아 지부 연합   |   2026년 9월', x:M, y:H-0.6, w:W-2*M, h:0.26, size:9.5, color:C.onDarkMute });
  note('오늘은 세 가지 경로를 구분하는 것만 확실히 하고 갑니다. 이름이 비슷해 학부모들이 가장 많이 헷갈리는 지점입니다.');
}

/* ── 2. 두 대학 간단 소개 ───────────────────────── */
{
  slide(false);
  title('두 대학 — 한눈에', '둘 다 말레이시아 사립 명문이며, 해외 학위 경로를 모두 갖추고 있습니다');
  const uni = (x, nm, en, rows, badge) => {
    rect({ x, y:1.5, w:4.4, h:3.0, fill:C.sand, radius:0.07 });
    text({ t:nm, x:x+0.24, y:1.66, w:4.0, h:0.4, size:22, bold:true, color:C.ink });
    text({ t:en, x:x+0.24, y:2.06, w:4.0, h:0.24, size:10.5, color:C.muted });
    rect({ x:x+0.24, y:2.38, w:3.92, h:0.46, fill:C.deep, radius:0.05 });
    text({ t:badge, x:x+0.4, y:2.38, w:3.6, h:0.46, size:11.5, bold:true, color:C.gold, valign:'middle' });
    rows.forEach((r,i)=>{
      text({ t:r[0], x:x+0.24, y:2.96+i*0.38, w:0.92, h:0.36, size:10.5, color:C.muted, valign:'middle' });
      text({ t:r[1], x:x+1.2, y:2.96+i*0.38, w:2.96, h:0.36, size:10.5, color:C.text, valign:'middle', lh:1.15 });
    });
  };
  uni(M, '선웨이대학교', 'Sunway University · 선웨이시티(반다르선웨이)', [
    ['설립','칼리지 1987 → 대학 승격 2011'],
    ['강세','회계·금융, 계리학, 컴퓨터과학, STEM'],
    ['입지','몰·병원·경전철이 도보권, 게이티드'],
    ['대표 파트너','랭커스터(영국) · ASU(미국)'],
  ], '미국 편입 과정을 1987년부터 운영');
  uni(5.1, '테일러스대학교', "Taylor's University · 수방자야 레이크사이드", [
    ['설립','1969년 · 사립 명문'],
    ['강세','호텔·관광(세계 26위), 디자인, 마케팅'],
    ['전공 폭','12개 계열 — 공연예술·역사까지'],
    ['대표 파트너','UWE 브리스톨(영국) · QUT(호주)'],
  ], '미국 편입 과정을 1996년부터 운영');
  foot('출처: Sunway College / Sunway University 연혁 · Taylor\'s University 공식 소개');
  note('두 학교 모두 30~40년 된 학교입니다. 어느 쪽이 더 좋으냐가 아니라 강세 분야가 다르다는 점만 잡아 주십시오.');
}

/* ── 3. 세 경로 한 장 비교 ───────────────────────── */
{
  slide(false);
  title('세 가지 경로 — 무엇이 다른가', '차이는 딱 두 가지입니다. 어디서 공부하는가, 그리고 학위증을 누가 몇 장 주는가');
  tableEl({ x:M, y:1.48, w:9.0, rowH:0.5, size:11,
    colW:[1.5, 2.5, 2.5, 2.5],
    rows:[
      ['구분','① 듀얼 디그리','② 트위닝','③ ADTP'],
      ['공부하는 곳','말레이시아에서 전 과정','말레이시아 + 해외 본교','말레이시아 1~2년 + 미국'],
      ['받는 학위증','2장 (말레이시아 + 해외)','1장 (해외 본교)','1장 (편입한 미국 대학)'],
      ['해외 체류','없음 (선택 가능)','1~2년','2~3년'],
      ['비용','가장 낮음','중간','가장 높음'],
      ['주 대상 국가','영국 · 미국','영국 · 호주','미국 · 캐나다'],
    ]});
  rect({ x:M, y:4.66, w:9.0, h:0.5, fill:C.goldSoft, radius:0.06 });
  text({ t:'한 문장 요약 — 비용은 ①<②<③ 순으로 오르고, 해외 체류 기간도 같은 순서로 길어집니다.', x:M+0.22, y:4.66, w:8.6, h:0.5, size:12, bold:true, color:C.ink, valign:'middle' });
  foot('');
  note('이 표 한 장이 오늘 발표의 전부라고 해도 됩니다. 나머지 슬라이드는 이 표를 하나씩 풀어 설명하는 것입니다.');
}

/* ── 4. ① 듀얼 디그리 ───────────────────────── */
{
  slide(false);
  circle({ x:M, y:0.44, d:0.42, fill:C.deep, label:'1', labelSize:14, labelColor:C.gold });
  text({ t:'듀얼 디그리 — 학위증을 두 장 받는다', x:M+0.56, y:0.42, w:8.4, h:0.5, size:27, bold:true, color:C.ink, lh:1.1 });
  text({ t:'말레이시아에서 전 과정을 마치고, 두 대학이 각각 학위를 수여하는 구조', x:M, y:1.02, w:9.0, h:0.28, size:12.5, color:C.muted });

  rect({ x:M, y:1.48, w:2.6, h:0.72, fill:C.sand, radius:0.06 });
  text({ t:'말레이시아에서 전 과정', x:M+0.16, y:1.48, w:2.28, h:0.72, size:12, bold:true, color:C.ink, valign:'middle' });
  text({ t:'▶', x:3.2, y:1.72, w:0.3, h:0.26, size:12, color:C.gold, align:'center' });
  rect({ x:3.56, y:1.48, w:2.7, h:0.72, fill:C.deep, radius:0.06 });
  text({ t:'말레이시아 대학 학위증', x:3.72, y:1.48, w:2.38, h:0.72, size:12, bold:true, color:C.paper, valign:'middle' });
  rect({ x:6.4, y:1.48, w:3.1, h:0.72, fill:C.deep, radius:0.06 });
  text({ t:'해외 대학 학위증', x:6.56, y:1.48, w:2.78, h:0.72, size:12, bold:true, color:C.gold, valign:'middle' });

  const card = (x, head, lines, big) => {
    rect({ x, y:2.42, w:4.4, h:1.86, fill:C.sand, radius:0.07 });
    text({ t:head, x:x+0.22, y:2.56, w:4.0, h:0.28, size:13, bold:true, color:C.deep });
    if (big) text({ t:big, x:x+0.22, y:2.88, w:4.0, h:0.34, size:16, bold:true, color:C.ink });
    text({ t:lines, x:x+0.22, y:big?3.26:2.9, w:4.0, h:big?0.9:1.26, size:11, color:C.text, lh:1.4 });
  };
  card(M, '선웨이 × 랭커스터(영국)', '2006년부터 이어온 파트너십으로, 영국–말레이시아 대학 간 최대 규모입니다. 7,000명 이상이 31개 학위 과정에서 공부했습니다. 졸업 시 선웨이와 랭커스터 학위증을 각각 받습니다.', '2006년 · 31개 과정');
  card(5.1, '테일러스 × UWE 브리스톨 · QUT', '경영·컴퓨팅 분야에서 영국 UWE 브리스톨, 호주 QUT와 듀얼 어워드를 운영합니다. 과정을 마치면 테일러스와 파트너 대학 학위증을 함께 받습니다.', '경영 · 컴퓨팅 중심');
  rect({ x:M, y:4.4, w:9.0, h:0.5, fill:C.brickSoft, radius:0.06 });
  text({ t:'오해 방지 — 학위증이 두 장이어도 학비가 두 배는 아닙니다. 한 과정을 이수하고 두 기관이 각각 수여합니다.', x:M+0.22, y:4.4, w:8.6, h:0.5, size:11.5, bold:true, color:C.brick, valign:'middle' });
  foot('출처: Lancaster University — Sunway Partnership · Taylor\'s University — Dual Awards');
  note('듀얼 디그리의 핵심은 해외에 나가지 않고도 해외 학위를 받는다는 것입니다. 비용이 가장 낮고 안전해 부모가 가장 선호합니다.');
}

/* ── 5. ② 트위닝 ───────────────────────── */
{
  slide(false);
  circle({ x:M, y:0.44, d:0.42, fill:C.deep, label:'2', labelSize:14, labelColor:C.gold });
  text({ t:'트위닝 — 두 나라에 나눠 다닌다', x:M+0.56, y:0.42, w:8.4, h:0.5, size:27, bold:true, color:C.ink, lh:1.1 });
  text({ t:'같은 학위 과정을 말레이시아와 해외 본교에서 나눠 이수하고, 학위증은 본교 한 곳에서 받습니다', x:M, y:1.02, w:9.0, h:0.28, size:12.5, color:C.muted });

  const bar = (y, label, segs) => {
    text({ t:label, x:M, y, w:0.72, h:0.56, size:14, bold:true, color:C.gold, valign:'middle' });
    let x = M + 0.78;
    segs.forEach(sg=>{
      rect({ x, y, w:sg.w, h:0.56, fill:sg.my?C.sand:C.deep, radius:0.05 });
      text({ t:sg.t, x:x+0.14, y, w:sg.w-0.28, h:0.56, size:11, bold:true, color:sg.my?C.ink:C.paper, valign:'middle' });
      x += sg.w + 0.12;
    });
  };
  bar(1.46, '3+0', [{ t:'말레이시아 3년 — 전 과정', w:4.6, my:true }]);
  bar(2.14, '2+1', [{ t:'말레이시아 2년', w:3.1, my:true }, { t:'해외 본교 1년', w:1.6 }]);
  bar(2.82, '1+2', [{ t:'말레이시아 1년', w:1.6, my:true }, { t:'해외 본교 2년', w:3.1 }]);
  rect({ x:6.3, y:1.46, w:3.2, h:1.92, fill:C.goldSoft, radius:0.07 });
  text({ t:'숫자의 뜻', x:6.5, y:1.6, w:2.8, h:0.24, size:11, bold:true, color:C.gold });
  text({ t:'앞 숫자 = 말레이시아 체류 연수\n뒤 숫자 = 해외 본교 체류 연수\n\n숫자가 뒤로 갈수록 비용이 오르고, 해외 경험은 길어집니다.', x:6.5, y:1.88, w:2.8, h:1.36, size:11, color:C.text, lh:1.45 });

  const card2 = (x, head, lines) => {
    rect({ x, y:3.52, w:4.4, h:1.16, fill:C.sand, radius:0.07 });
    text({ t:head, x:x+0.22, y:3.62, w:4.0, h:0.26, size:12, bold:true, color:C.deep });
    text({ t:lines, x:x+0.22, y:3.9, w:4.0, h:0.7, size:10.5, color:C.text, lh:1.35 });
  };
  card2(M, '선웨이', '랭커스터 과정에서 1+2 이동 수학, 교환학생, 서머 프로그램을 운영합니다. 호주 빅토리아대 과정도 트위닝 형태로 제공됩니다.');
  card2(5.1, '테일러스', '호주 디킨·모나쉬·QUT·멜버른·남호주대, 영국 샐퍼드·UWE, 뉴질랜드 대학으로의 편입·트위닝 경로를 운영합니다.');
  foot('출처: Lancaster University — Mobility opportunities for Sunway students · Taylor\'s University — Overseas Transfer Options / Partner Universities');
  note('트위닝은 "같은 학위를 나눠서 듣는다"입니다. 듀얼 디그리와 달리 학위증은 한 장입니다. 이 차이를 꼭 짚어 주십시오.');
}

/* ── 6. ③ ADTP ───────────────────────── */
{
  slide(false);
  circle({ x:M, y:0.44, d:0.42, fill:C.deep, label:'3', labelSize:14, labelColor:C.gold });
  text({ t:'ADTP — 학점만 들고 편입한다', x:M+0.56, y:0.42, w:8.4, h:0.5, size:27, bold:true, color:C.ink, lh:1.1 });
  text({ t:'American Degree Transfer Program · 말레이시아에서 미국 학점을 쌓은 뒤 미국 대학 3학년으로 편입', x:M, y:1.02, w:9.0, h:0.28, size:12.5, color:C.muted });

  let x = M;
  [{ a:'말레이시아 ADTP', b:'1~2년 · 교양+기초전공', w:2.6, my:true },
   { a:'미국 대학 편입', b:'2~3년 · 전공 심화', w:2.6, my:true },
   { a:'미국 대학 학위증', b:'편입 대학 명의 1장', w:2.6 }].forEach((s,i,arr)=>{
    rect({ x, y:1.46, w:s.w, h:0.74, fill:s.my?C.sand:C.deep, radius:0.06 });
    text({ t:s.a, x:x+0.14, y:1.56, w:s.w-0.28, h:0.26, size:12, bold:true, color:s.my?C.ink:C.paper });
    text({ t:s.b, x:x+0.14, y:1.84, w:s.w-0.28, h:0.24, size:10, color:s.my?C.muted:C.gold });
    x += s.w;
    if (i < arr.length-1){ text({ t:'▶', x:x+0.02, y:1.7, w:0.3, h:0.26, size:11, color:C.gold, align:'center' }); x += 0.34; }
  });

  const yr = (px_, nm, year, age, body) => {
    rect({ x:px_, y:2.42, w:4.4, h:1.9, fill:C.sand, radius:0.07 });
    text({ t:nm, x:px_+0.22, y:2.54, w:4.0, h:0.28, size:13, bold:true, color:C.deep });
    text({ t:year, x:px_+0.22, y:2.84, w:2.0, h:0.56, size:38, bold:true, color:C.ink, lh:1 });
    text({ t:age, x:px_+2.3, y:3.04, w:1.9, h:0.3, size:13, bold:true, color:C.gold, valign:'middle' });
    text({ t:body, x:px_+0.22, y:3.46, w:4.0, h:0.74, size:10.5, color:C.text, lh:1.38 });
  };
  yr(M, '선웨이 — ADTP 개설', '1987', '올해로 39년', '미국 웨스턴미시간대와의 트위닝 프로그램으로 출발해, 2010~2012년에 여러 대학으로 편입할 수 있는 Transfer 방식으로 전환했습니다.');
  yr(5.1, "테일러스 — ADTP 개설", '1996', '올해로 30년', '개설 이래 미국·캐나다·호주 등으로 수천 명의 편입생을 배출했습니다. 전공 12개 계열로 폭이 넓습니다.');
  rect({ x:M, y:4.44, w:9.0, h:0.48, fill:C.goldSoft, radius:0.06 });
  text({ t:'주목 — 선웨이의 미국 과정은 원래 트위닝이었다가 ADTP로 바뀌었습니다. 세 경로가 서로 다른 제도가 아니라 이어진 흐름이라는 증거입니다.', x:M+0.22, y:4.44, w:8.6, h:0.48, size:11, bold:true, color:C.ink, valign:'middle' });
  foot('출처: Sunway University — Center for American Education 연혁 자료 · Taylor\'s University — ADTP 소개');
  note('선웨이가 테일러스보다 9년 앞섭니다. 그리고 선웨이 ADTP가 트위닝에서 출발했다는 사실이 오늘 세 경로를 하나로 묶어 줍니다.');
}

/* ── 7. 선택 가이드 ───────────────────────── */
{
  slide(false);
  title('그래서 우리 아이는 어느 길인가', '예산과 목표 학위 국가, 두 가지만 정하면 답이 좁혀집니다');
  const guide = [
    { q:'해외에 나가지 않고 영국 학위를 받고 싶다', a:'① 듀얼 디그리', s:'선웨이 × 랭커스터', t:C.deep },
    { q:'영국·호주 학위를 받되 현지 경험도 원한다', a:'② 트위닝 (2+1 / 1+2)', s:'테일러스 파트너 대학군', t:C.mid },
    { q:'미국 학위가 목표이고 예산을 아끼고 싶다', a:'③ ADTP (2+2)', s:'선웨이 · 테일러스 모두', t:C.gold },
  ];
  guide.forEach((g,i)=>{
    const y = 1.5 + i*1.02;
    rect({ x:M, y, w:9.0, h:0.88, fill:i%2?C.paper:C.sand, lineColor:C.line, radius:0.06 });
    text({ t:g.q, x:M+0.24, y, w:4.3, h:0.88, size:12.5, color:C.text, valign:'middle' });
    rect({ x:4.8, y:y+0.19, w:2.3, h:0.5, fill:g.t, radius:0.05 });
    text({ t:g.a, x:4.92, y:y+0.19, w:2.06, h:0.5, size:12, bold:true, color:g.t===C.gold?C.ink:C.paper, valign:'middle', align:'center' });
    text({ t:g.s, x:7.3, y, w:2.1, h:0.88, size:11, color:C.muted, valign:'middle' });
  });
  rect({ x:M, y:4.6, w:9.0, h:0.5, fill:C.brickSoft, radius:0.06 });
  text({ t:'어느 경로든 검정고시·GED 출신은 파운데이션 1년을 먼저 거치는 것이 기본값입니다.', x:M+0.22, y:4.6, w:8.6, h:0.5, size:11.5, bold:true, color:C.brick, valign:'middle' });
  foot('');
  note('세 경로 중 무엇이 좋으냐가 아니라, 예산과 목표 국가로 좁히는 것이 상담의 순서입니다.');
}

/* ── 8. 확인 항목 ───────────────────────── */
{
  slide(true);
  title('설명회 전에 확인할 것', '연혁과 파트너십은 교차 확인했고, 아래는 학교에 직접 물어야 하는 항목입니다', true);
  const items = [
    '듀얼디그리·트위닝을 운영하는 정확한 학과 목록 (전 학과가 아님)',
    '경로별 연간 학비와 총액 (연간인지 총액인지 반드시 구분)',
    '검정고시·GED로 각 경로에 진입 가능한지 (서면 회신 확보)',
    '해외 본교 이동 시 추가 비용과 장학 트랙 적용 조건',
  ];
  items.forEach((t,i)=>{
    const c0 = i % 2, r0 = Math.floor(i/2);
    const x = M + c0*4.6, y = 1.52 + r0*0.72;
    circle({ x, y:y+0.04, d:0.28, fill:C.gold, label:String(i+1), labelSize:10.5, labelColor:C.ink });
    text({ t, x:x+0.4, y, w:3.98, h:0.62, size:11, color:C.onDark, lh:1.35 });
  });
  rect({ x:M, y:3.16, w:9.0, h:1.2, fill:C.deep, radius:0.07 });
  text({ t:'출처', x:M+0.22, y:3.26, w:8.6, h:0.22, size:10, bold:true, color:C.gold, cs:1 });
  text({ t:'Sunway University — Center for American Education 연혁 / School of American Education  ·  Lancaster University — Sunway Partnership, Mobility Opportunities  ·  Taylor\'s University — Dual Awards, Overseas Transfer Options, Partner Universities, ADTP  ·  Sunway College 연혁', x:M+0.22, y:3.52, w:8.6, h:0.74, size:9.5, color:C.onDarkMute, lh:1.4 });
  text({ t:'작성 환경의 네트워크 정책상 두 학교 공식 사이트를 직접 열람하지 못했습니다. 연혁·파트너십은 복수 출처로 교차 확인했으나, 학과 목록과 학비는 학교 확인 후 확정하십시오.', x:M, y:4.5, w:9.0, h:0.4, size:9.5, color:C.onDarkMute, lh:1.3 });
  note('이 슬라이드는 내부용입니다. 학부모 배포본에서는 빼십시오.');
}

D.save('선웨이_테일러스_해외학위_세가지경로.pptx', PREVIEW);
