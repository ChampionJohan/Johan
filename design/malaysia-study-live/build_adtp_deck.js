// ADTP 설명회 덱 — 공통 키트(deck_kit.js) 위에 내용만 정의한다
const K = require('./deck_kit.js');
const D = K.createDeck('ADTP 미국 편입 과정 안내');
const { slide, rect, circle, text, bullets, tableEl, title, foot, note, C, W, H, M } = D;

/* ══ 1. 표지 ══════════════════════════ */
{
  const c = slide(true);
  circle({ x:M, y:0.95, d:0.56, fill:C.gold, label:'US', labelSize:13, labelColor:C.ink });
  text({ t:'ADTP', x:M, y:1.72, w:6.2, h:1.0, size:62, bold:true, color:C.paper, lh:1, cs:-1 });
  text({ t:'American Degree Transfer Program', x:M, y:2.72, w:6.4, h:0.3, size:13, color:C.gold, cs:1.2 });
  text({ t:'말레이시아에서 미국 대학으로', x:M, y:3.16, w:6.4, h:0.45, size:24, bold:true, color:C.onDark, lh:1.15 });
  text({ t:'선웨이대학교 · 테일러스대학교 편입 과정 안내', x:M, y:3.74, w:6.4, h:0.3, size:12.5, color:C.onDarkMute });
  const chips = ['2+2 · 1+3 구조','미국 · 캐나다 편입','학점 이전 방식'];
  chips.forEach((t,i)=>{
    rect({ x:6.9, y:1.75+i*0.62, w:2.6, h:0.48, fill:C.deep, radius:0.06 });
    text({ t, x:7.05, y:1.75+i*0.62, w:2.3, h:0.48, size:11.5, color:C.onDark, valign:'middle', bold:true });
  });
  text({ t:'필리핀 해외선교본부 · 말레이시아 지부 연합   |   2026년 9월', x:M, y:H-0.62, w:W-2*M, h:0.26, size:9.5, color:C.onDarkMute });
  note('ADTP는 미국 학위를 목표로 하되, 처음 1~2년을 말레이시아에서 이수해 비용을 크게 줄이는 경로입니다. 오늘은 선웨이와 테일러스 두 곳을 비교합니다.');
}

/* ══ 2. ADTP란 ══════════════════════════ */
{
  slide(false);
  title('ADTP는 무엇인가', '미국 대학 1~2학년 과정을 말레이시아에서 이수하고, 학점을 이전해 미국 대학 3학년으로 편입하는 과정');
  const stats = [
    { n:'1996', k:'테일러스 ADTP 개설', d:'올해로 30년째 운영' },
    { n:'12~24', k:'선웨이 체류 개월', d:'비즈니스 전공은 최대 36개월' },
    { n:'20+', k:'선웨이 × ASU 학위 옵션', d:'비즈니스 · 컴퓨팅 중심' },
  ];
  stats.forEach((s,i)=>{
    const x = M + i*3.07;
    rect({ x, y:1.55, w:2.87, h:1.62, fill:C.sand, radius:0.07 });
    text({ t:s.n, x:x+0.22, y:1.72, w:2.45, h:0.62, size:40, bold:true, color:C.deep, lh:1 });
    text({ t:s.k, x:x+0.22, y:2.42, w:2.45, h:0.28, size:12, bold:true, color:C.ink });
    text({ t:s.d, x:x+0.22, y:2.72, w:2.45, h:0.28, size:10.5, color:C.muted });
  });
  text({ t:'핵심은 "학점 이전"입니다', x:M, y:3.42, w:4.4, h:0.3, size:15, bold:true, color:C.ink });
  bullets({ x:M, y:3.76, w:4.3, h:1.28, size:12, items:[
    '말레이시아에서 딴 학점이 미국 대학에서 그대로 인정됩니다',
    '따라서 미국에서 보내는 기간이 4년이 아니라 2년으로 줄어듭니다',
    '학위는 편입한 미국 대학이 수여합니다',
  ]});
  rect({ x:5.3, y:3.42, w:4.2, h:1.5, fill:C.goldSoft, radius:0.07 });
  text({ t:'편입 가능 국가', x:5.52, y:3.58, w:3.8, h:0.26, size:11, bold:true, color:C.gold });
  text({ t:'미국 · 캐나다 · 호주 · 뉴질랜드', x:5.52, y:3.88, w:3.8, h:0.3, size:15, bold:true, color:C.ink });
  text({ t:'두 학교 모두 미국이 주 목적지이며, 캐나다·호주로의 편입 경로도 함께 운영합니다.', x:5.52, y:4.24, w:3.8, h:0.52, size:10.5, color:C.text, lh:1.3 });
  foot('출처: Sunway University School of American Education · Taylor\'s University ADTP 공식 페이지');
  note('ADTP의 본질은 학점 이전입니다. 파운데이션이 "입학 자격"을 만드는 과정이라면, ADTP는 "학위 학점"을 미리 쌓는 과정입니다. 이 차이를 먼저 이해시켜야 합니다.');
}

/* ══ 3. 구조 ══════════════════════════ */
{
  slide(false);
  title('구조 — 2+2 와 1+3', '말레이시아 체류 기간을 얼마로 잡느냐에 따라 두 형태로 나뉩니다');
  const flow = (y, label, steps, tone) => {
    circle({ x:M, y:y+0.12, d:0.44, fill:tone, label:label, labelSize:12, labelColor:C.paper });
    let x = M + 0.66;
    steps.forEach((st,i)=>{
      rect({ x, y, w:st.w, h:0.72, fill:i===steps.length-1?C.deep:C.sand, radius:0.06 });
      text({ t:st.a, x:x+0.14, y:y+0.1, w:st.w-0.28, h:0.26, size:12, bold:true, color:i===steps.length-1?C.paper:C.ink });
      text({ t:st.b, x:x+0.14, y:y+0.38, w:st.w-0.28, h:0.24, size:10, color:i===steps.length-1?C.onDarkMute:C.muted });
      x += st.w;
      if (i < steps.length-1){
        text({ t:'▶', x:x+0.02, y:y+0.24, w:0.3, h:0.26, size:11, color:C.gold, align:'center' });
        x += 0.34;
      }
    });
  };
  flow(1.6, '2+2', [
    { a:'말레이시아 ADTP', b:'2년 · 교양 + 기초 전공', w:2.5 },
    { a:'미국 대학 3·4학년', b:'2년 · 전공 심화', w:2.5 },
    { a:'미국 학위', b:'편입 대학 명의', w:2.1 },
  ], C.mid);
  flow(2.72, '1+3', [
    { a:'말레이시아 ADTP', b:'1년 · 교양 중심', w:2.5 },
    { a:'미국 대학 2~4학년', b:'3년', w:2.5 },
    { a:'미국 학위', b:'편입 대학 명의', w:2.1 },
  ], C.gold);
  rect({ x:M, y:3.9, w:4.4, h:1.0, fill:C.sand, radius:0.07 });
  text({ t:'선웨이 — 체류 기간', x:M+0.2, y:4.04, w:4.0, h:0.24, size:11, bold:true, color:C.deep });
  text({ t:'대부분 12~24개월. 비즈니스 전공은 최대 36개월까지 말레이시아에 머문 뒤 편입할 수 있습니다.', x:M+0.2, y:4.32, w:4.0, h:0.5, size:11, color:C.text, lh:1.3 });
  rect({ x:5.1, y:3.9, w:4.4, h:1.0, fill:C.brickSoft, radius:0.07 });
  text({ t:'기간이 길수록 유리한가?', x:5.3, y:4.04, w:4.0, h:0.24, size:11, bold:true, color:C.brick });
  text({ t:'아닙니다. 목표 대학이 인정하는 학점 상한이 정해져 있어, 초과 이수 학점은 버려집니다.', x:5.3, y:4.32, w:4.0, h:0.5, size:11, color:C.text, lh:1.3 });
  foot('출처: Sunway University — American Degree Transfer Program (프로그램 기간 안내)');
  note('2+2가 표준입니다. 1+3은 미국 대학 적응을 빨리 시작하고 싶을 때 택하지만 비용이 올라갑니다. 기간을 늘린다고 유리하지 않다는 점을 반드시 말해야 합니다.');
}

/* ══ 4. 왜 ADTP인가 ══════════════════════════ */
{
  slide(false);
  title('왜 ADTP인가 — 비용 구조', '미국에서 보내는 4년 중 2년을 말레이시아 비용으로 대체하는 것이 전부입니다');
  const col = (x, head, tone, rows, textColor) => {
    rect({ x, y:1.6, w:4.4, h:0.52, fill:tone, radius:0.06 });
    text({ t:head, x:x+0.2, y:1.6, w:4.0, h:0.52, size:14, bold:true, color:textColor, valign:'middle' });
    rows.forEach((r,i)=>{
      rect({ x, y:2.16+i*0.56, w:4.4, h:0.52, fill:i%2?C.paper:C.sand, lineColor:C.line, radius:0.04 });
      text({ t:r[0], x:x+0.2, y:2.16+i*0.56, w:2.5, h:0.52, size:11.5, color:C.text, valign:'middle' });
      text({ t:r[1], x:x+2.6, y:2.16+i*0.56, w:1.6, h:0.52, size:11.5, bold:true, color:C.deep, valign:'middle', align:'right' });
    });
  };
  col(M, '미국 대학 4년 직행', C.brick, [
    ['1~2학년', '미국 비용'],
    ['3~4학년', '미국 비용'],
    ['미국 체류', '4년'],
  ], C.paper);
  col(5.1, 'ADTP 2+2', C.deep, [
    ['1~2학년', '말레이시아 비용'],
    ['3~4학년', '미국 비용'],
    ['미국 체류', '2년'],
  ], C.paper);
  rect({ x:M, y:4.0, w:9.0, h:0.92, fill:C.goldSoft, radius:0.07 });
  text({ t:'절감의 크기는 "목표 미국 대학의 2년치 비용"이 결정합니다', x:M+0.22, y:4.12, w:8.6, h:0.26, size:12.5, bold:true, color:C.ink });
  text({ t:'따라서 설명회에서는 절감액을 일반화하지 마시고, 학생이 목표하는 미국 대학의 연간 학비·생활비를 넣어 개별 계산해 주십시오. 주립대와 사립대의 차이가 절감액을 두 배 이상 벌립니다.', x:M+0.22, y:4.42, w:8.6, h:0.44, size:10.5, color:C.text, lh:1.3 });
  foot('※ 미국 측 비용은 목표 대학·주내외 구분에 따라 편차가 커 이 자료에서 단일 수치로 제시하지 않습니다.');
  note('여기서 구체적 절감액을 말하고 싶은 유혹이 크지만, 미국 대학마다 학비가 3~4배 차이 납니다. 개별 상담에서 계산해 준다고 하는 편이 정직하고 상담 전환에도 낫습니다.');
}

/* ══ 5. 선웨이 개요 ══════════════════════════ */
{
  slide(false);
  title('선웨이대학교 ADTP', 'School of American Education — 비즈니스 · 컴퓨터과학 · STEM 강세');
  bullets({ x:M, y:1.6, w:4.6, h:2.2, size:12.5, gap:9, items:[
    '미국 교양 및 기초 전공 학점을 말레이시아에서 이수',
    '기간 12~24개월, 비즈니스 전공은 최대 36개월',
    '미국 · 캐나다 · 호주 · 뉴질랜드 대학으로 편입',
    '전담 어드바이저가 과목 계획부터 편입 지원·비자까지 관리',
    '선웨이시티 캠퍼스 — 몰 · 병원 · 경전철이 도보권',
  ]});
  rect({ x:5.3, y:1.55, w:4.2, h:2.3, fill:C.sand, radius:0.07 });
  text({ t:'강세 분야', x:5.52, y:1.72, w:3.8, h:0.26, size:11, bold:true, color:C.deep });
  const fields = ['비즈니스','컴퓨터과학 (CS)','공학 · STEM','예술 계열'];
  fields.forEach((f,i)=>{
    circle({ x:5.52, y:2.06+i*0.42, d:0.26, fill:C.deep, label:String(i+1), labelSize:9.5, labelColor:C.paper });
    text({ t:f, x:5.9, y:2.06+i*0.42, w:3.4, h:0.26, size:12, color:C.text, valign:'middle' });
  });
  rect({ x:M, y:4.02, w:9.0, h:0.88, fill:C.brickSoft, radius:0.07 });
  text({ t:'전공별로 편입 성과가 다릅니다', x:M+0.22, y:4.14, w:8.6, h:0.26, size:12, bold:true, color:C.brick });
  text({ t:'선웨이는 비즈니스·CS·STEM에서 실적이 두텁습니다. 인문·사회 계열을 목표한다면 테일러스의 전공 폭을 함께 비교하십시오.', x:M+0.22, y:4.44, w:8.6, h:0.4, size:10.5, color:C.text, lh:1.3 });
  foot('출처: Sunway University — School of American Education / American Degree Transfer Program');
  note('선웨이 ADTP의 성격은 명확합니다. 비즈니스와 컴퓨터과학입니다. 아이가 인문계라면 테일러스를 먼저 보라고 말해도 됩니다.');
}

/* ══ 6. 선웨이 × ASU ══════════════════════════ */
{
  slide(false);
  title('선웨이 × 애리조나주립대(ASU)', '미국 대학과 공동 커리큘럼을 운영하는 파트너십');
  rect({ x:M, y:1.58, w:4.3, h:1.5, fill:C.deep, radius:0.07 });
  text({ t:'20+', x:M+0.24, y:1.72, w:3.8, h:0.62, size:40, bold:true, color:C.gold, lh:1 });
  text({ t:'ASU 연계 학부 학위 옵션', x:M+0.24, y:2.42, w:3.8, h:0.26, size:12.5, bold:true, color:C.paper });
  text({ t:'비즈니스 · 컴퓨팅 등 분야에 걸쳐 제공', x:M+0.24, y:2.72, w:3.8, h:0.26, size:10.5, color:C.onDarkMute });
  bullets({ x:5.1, y:1.62, w:4.4, h:1.5, size:12, gap:8, items:[
    'ASU는 미국에서 가장 혁신적인 대학으로 꼽히는 주립대',
    '선웨이와 ASU가 커리큘럼을 함께 설계해 학점 호환성이 높음',
    '재학 중 ASU 마스터 클래스 등 연계 프로그램 참여 기회',
  ]});
  rect({ x:M, y:3.26, w:9.0, h:1.16, fill:C.brickSoft, radius:0.07 });
  text({ t:'학교 공표 수치 — 그대로 인용하지 마십시오', x:M+0.22, y:3.4, w:8.6, h:0.26, size:12, bold:true, color:C.brick });
  text({ t:'선웨이는 홍보 자료에서 "졸업생의 75~80% 이상이 미국 상위(Tier 1) 대학으로 편입한다"고 밝히고 있습니다. 다만 Tier 1의 정의, 집계 시점, 응답률이 공개되어 있지 않습니다. 설명회에서는 "학교 공표 기준으로는"을 반드시 붙이고, 아래 확인 절차를 거친 뒤 확정 수치로 바꾸십시오.', x:M+0.22, y:3.7, w:8.6, h:0.62, size:10.5, color:C.text, lh:1.35 });
  foot('출처: Sunway University ADTP 브로슈어 및 프로그램 페이지 (학교 공표 자료)');
  note('ASU 파트너십은 검증된 사실입니다. 75~80%라는 편입률은 학교 홍보 수치이므로 단정하지 말고 출처를 밝히십시오.');
}

/* ══ 7. 선웨이 편입 실적 ══════════════════════════ */
{
  slide(false);
  title('선웨이 — 편입 실적과 동문', '확인 수준이 다른 두 종류의 정보를 구분해 제시합니다');
  rect({ x:M, y:1.58, w:4.3, h:1.72, fill:C.sand, radius:0.07 });
  circle({ x:M+0.22, y:1.74, d:0.3, fill:C.deep, label:'A', labelSize:11, labelColor:C.paper });
  text({ t:'공개 인물 사례', x:M+0.62, y:1.74, w:3.4, h:0.3, size:11.5, bold:true, color:C.deep, valign:'middle' });
  text({ t:'싱어송라이터 겸 배우 Cheryl K', x:M+0.22, y:2.2, w:3.86, h:0.3, size:14, bold:true, color:C.ink });
  text({ t:'선웨이 ADTP를 거쳐 미국 대학에 편입·졸업한 뒤, 영화 「크레이지 리치 아시안」 사운드트랙으로 알려졌습니다.', x:M+0.22, y:2.54, w:3.86, h:0.64, size:10.5, color:C.text, lh:1.35 });
  rect({ x:5.1, y:1.58, w:4.4, h:1.72, fill:C.brickSoft, radius:0.07 });
  circle({ x:5.32, y:1.74, d:0.3, fill:C.brick, label:'B', labelSize:11, labelColor:C.paper });
  text({ t:'커뮤니티 보고 — 확인 필요', x:5.72, y:1.74, w:3.5, h:0.3, size:11.5, bold:true, color:C.brick, valign:'middle' });
  text({ t:'카네기멜런 · 코넬 · 미시간 등', x:5.32, y:2.2, w:3.96, h:0.3, size:14, bold:true, color:C.ink });
  text({ t:'재학생·동문 커뮤니티(Reddit, Instagram)에 보고된 편입처입니다. 학교 공식 명단이 아니므로 설명회 자료에 넣으려면 학교에 확인하십시오.', x:5.32, y:2.54, w:3.96, h:0.64, size:10.5, color:C.text, lh:1.35 });
  text({ t:'커뮤니티에서 공통으로 나오는 조언', x:M, y:3.5, w:9.0, h:0.28, size:13, bold:true, color:C.ink });
  bullets({ x:M, y:3.84, w:9.0, h:1.0, size:11.5, gap:6, items:[
    'CS 전공은 과목 실라버스 매핑을 학기 단위로 점검해야 학점 손실이 없다',
    '상위권 편입과 장학금을 노린다면 GPA 3.6~3.9 구간을 유지해야 한다',
  ]});
  foot('※ B 항목은 소셜 미디어 기반 정보입니다. 대외 배포 자료에는 학교 공식 편입 명단만 사용하십시오.');
  note('A와 B를 나눈 이유가 있습니다. 공개 인물은 인용해도 되지만, 커뮤니티에 올라온 개인 사례는 확인 없이 설명회 자료에 넣으면 안 됩니다.');
}

/* ══ 8. 테일러스 개요 ══════════════════════════ */
{
  slide(false);
  title('테일러스대학교 ADTP', '1996년 개설 — 말레이시아에서 가장 오래된 미국 편입 과정 중 하나');
  rect({ x:M, y:1.56, w:2.0, h:1.1, fill:C.deep, radius:0.07 });
  text({ t:'30년', x:M+0.16, y:1.7, w:1.7, h:0.5, size:30, bold:true, color:C.gold, lh:1 });
  text({ t:'1996년 개설', x:M+0.16, y:2.24, w:1.7, h:0.26, size:10.5, color:C.onDarkMute });
  bullets({ x:2.72, y:1.6, w:6.78, h:1.1, size:12, gap:7, items:[
    '미국 · 캐나다 · 호주 등으로 수천 명의 편입생을 배출',
    '북미 대학 생활에 맞춘 교양·기초 전공 커리큘럼 운영',
  ]});
  text({ t:'전공 폭이 넓습니다', x:M, y:2.86, w:9.0, h:0.28, size:13, bold:true, color:C.ink });
  const majors = ['비즈니스','계리학','수학','컴퓨팅','자연과학','응용과학','공학','어문·문학','커뮤니케이션','역사','공연예술','사회과학'];
  majors.forEach((m,i)=>{
    const c0 = i % 4, r0 = Math.floor(i/4);
    const x = M + c0*2.27, y = 3.22 + r0*0.46;
    rect({ x, y, w:2.14, h:0.38, fill:C.sand, radius:0.05 });
    text({ t:m, x:x+0.12, y, w:1.9, h:0.38, size:11, color:C.text, valign:'middle' });
  });
  foot('출처: Taylor\'s University — American Degree Transfer Program (전공 목록 및 개설 연혁)');
  note('테일러스의 강점은 전공 폭입니다. 선웨이가 비즈니스·CS에 집중한다면, 테일러스는 공연예술·역사·어문까지 열려 있습니다. 진로가 아직 넓은 학생에게 유리합니다.');
}

/* ══ 9. 테일러스 편입 실적 ══════════════════════════ */
{
  slide(false);
  title('테일러스 — 편입 네트워크와 실적', '학교 공표 수치와 합격 사례');
  const stats = [
    { n:'300+', k:'미국 · 캐나다 협력 대학', d:'학교 공표' },
    { n:'87%', k:'상위 200위권 대학 진학', d:'학교 공표' },
  ];
  stats.forEach((s,i)=>{
    const x = M + i*2.3;
    rect({ x, y:1.56, w:2.14, h:1.34, fill:C.deep, radius:0.07 });
    text({ t:s.n, x:x+0.16, y:1.7, w:1.84, h:0.56, size:34, bold:true, color:C.gold, lh:1 });
    text({ t:s.k, x:x+0.16, y:2.3, w:1.84, h:0.4, size:10.5, bold:true, color:C.paper, lh:1.25 });
    text({ t:s.d, x:x+0.16, y:2.68, w:1.84, h:0.2, size:9, color:C.onDarkMute });
  });
  rect({ x:5.24, y:1.56, w:4.26, h:1.34, fill:C.sand, radius:0.07 });
  text({ t:'공식 편입 명단에 오른 대학', x:5.44, y:1.7, w:3.9, h:0.24, size:11, bold:true, color:C.deep });
  text({ t:'스탠퍼드 · 브라운 · 펜실베이니아 · 코넬\n컬럼비아 · 퍼듀 · 일리노이(UIUC)\n미네소타 트윈시티', x:5.44, y:1.98, w:3.9, h:0.84, size:12, bold:true, color:C.ink, lh:1.35 });
  text({ t:'프로그램의 실제 운영 방식', x:M, y:3.08, w:9.0, h:0.28, size:13, bold:true, color:C.ink });
  bullets({ x:M, y:3.42, w:4.4, h:1.0, size:11.5, gap:6, items:[
    '미국 대학과 직접 연계한 캠퍼스 내 프로그램 운영',
    'CliftonStrengths 역량 워크숍, STEM 챌린지 등',
  ]});
  rect({ x:5.24, y:3.38, w:4.26, h:1.08, fill:C.brickSoft, radius:0.07 });
  text({ t:'수치의 성격을 밝히십시오', x:5.44, y:3.5, w:3.9, h:0.24, size:11, bold:true, color:C.brick });
  text({ t:'300+ 와 87% 는 모두 학교 공표 수치이며 독립 검증 자료를 찾지 못했습니다. "학교 공표 기준으로는"을 붙여 말씀하십시오.', x:5.44, y:3.76, w:3.9, h:0.6, size:10.5, color:C.text, lh:1.3 });
  foot('출처: Taylor\'s University — Successful University Placements / University Transfers 페이지 (학교 공표 자료)');
  note('아이비리그 합격 사례는 학교 공식 페이지에 올라와 있으니 인용해도 됩니다. 다만 87%와 300+는 산정 기준이 공개돼 있지 않습니다.');
}

/* ══ 10. 두 학교 비교 ══════════════════════════ */
{
  slide(false);
  title('선웨이 vs 테일러스', '어느 쪽이 좋은 학교인가가 아니라, 어느 쪽이 이 학생에게 맞는가');
  tableEl({ x:M, y:1.5, w:9.0, rowH:0.44, size:11,
    colW:[1.6, 3.7, 3.7],
    rows:[
      ['기준','선웨이 ADTP','테일러스 ADTP'],
      ['개설·연혁','School of American Education 운영','1996년 개설 · 30년'],
      ['강세 분야','비즈니스 · 컴퓨터과학 · STEM','전공 폭이 넓음 (12개 계열)'],
      ['대표 파트너','애리조나주립대(ASU) 20+ 학위 옵션','미국·캐나다 300+ 협력대 (공표)'],
      ['체류 기간','12~24개월 (비즈니스 최대 36개월)','과정·전공별 상이'],
      ['공표 편입 실적','Tier 1 편입 75~80% (공표)','상위 200위권 87% (공표)'],
      ['이런 학생에게','전공이 경영·CS·공학으로 정해진 학생','전공이 아직 넓게 열려 있는 학생'],
    ]});
  foot('※ 공표 실적은 두 학교 모두 산정 기준이 공개되지 않았습니다. 부록의 확인 절차를 거친 뒤 확정하십시오.');
  note('이 표를 화면에 띄우고, 마지막 행부터 읽으십시오. 학부모가 가장 알고 싶은 것은 "우리 아이는 어디냐"입니다.');
}

/* ══ 11. 입학 요건 ══════════════════════════ */
{
  slide(false);
  title('입학 요건', '두 학교 모두 SPM(말레이시아 고교 졸업시험) 또는 동등 학력을 기준으로 합니다');
  const box = (x, y, w, h, head, tone, lines) => {
    rect({ x, y, w, h, fill:C.sand, radius:0.07 });
    text({ t:head, x:x+0.2, y:y+0.14, w:w-0.4, h:0.24, size:11, bold:true, color:tone });
    text({ t:lines, x:x+0.2, y:y+0.42, w:w-0.4, h:h-0.56, size:11, color:C.text, lh:1.4 });
  };
  box(M, 1.52, 4.4, 1.34, '선웨이 — 과학 · 공학 계열', C.deep,
    'SPM / O-Level 5개 과목 크레딧 이상\n(영어 + 수학 또는 과학 1과목 포함)\nUEC 는 5과목 B 이상');
  box(5.1, 1.52, 4.4, 1.34, '선웨이 — 예술 계열', C.deep,
    'SPM 5C (영어 포함) / IGCSE 5C (영어 포함)\nUEC 5B (영어 포함)');
  box(M, 2.98, 4.4, 1.1, '테일러스', C.deep,
    'SPM 또는 동등 학력 5개 과목 크레딧 이상\n(수학 + 과학 1과목 포함)');
  rect({ x:5.1, y:2.98, w:4.4, h:1.1, fill:C.brickSoft, radius:0.07 });
  text({ t:'검정고시 · GED 는?', x:5.3, y:3.12, w:4.0, h:0.24, size:11, bold:true, color:C.brick });
  text({ t:'두 학교 모두 GED 소지자를 받아들이는 사례가 있으나, ADTP 직접 입학 가능 여부와 요구 점수는 공개 요건에 명시돼 있지 않습니다.', x:5.3, y:3.4, w:4.0, h:0.6, size:10.5, color:C.text, lh:1.32 });
  rect({ x:M, y:4.2, w:9.0, h:0.72, fill:C.goldSoft, radius:0.07 });
  text({ t:'한국 검정고시 지원자는 반드시 학교에 서면으로 확인하십시오', x:M+0.22, y:4.3, w:8.6, h:0.26, size:12, bold:true, color:C.ink });
  text({ t:'"ADTP 직접 입학이 가능한가, 아니면 파운데이션을 먼저 이수해야 하는가" — 이 한 문장을 이메일로 묻고 회신을 보관하십시오.', x:M+0.22, y:4.58, w:8.6, h:0.28, size:10.5, color:C.text });
  foot('출처: Sunway University ADTP 입학 요건 · Taylor\'s University ADTP 입학 요건');
  note('한국 학생에게 가장 중요한 슬라이드입니다. SPM 기준만 공개돼 있어 검정고시 환산이 불명확합니다. 반드시 서면 확인을 권하십시오.');
}

/* ══ 12. 비용 ══════════════════════════ */
{
  slide(false);
  title('비용 — 말레이시아 구간', '선웨이가 공개한 ADTP 과정 기준 예시입니다');
  tableEl({ x:M, y:1.5, w:5.5, rowH:0.38, size:11,
    colW:[2.6, 1.5, 1.4],
    rows:[
      ['항목','금액 (RM)','원화 환산'],
      ['수업료 (과정 전체)','52,700','약 1,580만 원'],
      ['시설·자원비','7,500','약 225만 원'],
      ['MOHE 필수 과목','2,800','약 84만 원'],
      ['보증금','1,000','약 30만 원'],
      ['지원비','700','약 21만 원'],
      ['합계 (말레이시아 구간)','64,700','약 1,940만 원'],
    ]});
  rect({ x:6.24, y:1.5, w:3.26, h:1.34, fill:C.goldSoft, radius:0.07 });
  text({ t:'여기에 더해야 할 것', x:6.44, y:1.64, w:2.9, h:0.24, size:11, bold:true, color:C.gold });
  text({ t:'생활비 월 RM 1,600~3,000\n(약 50만~90만 원)\n비자·보험·항공 별도', x:6.44, y:1.92, w:2.9, h:0.8, size:11, color:C.text, lh:1.4 });
  rect({ x:6.24, y:2.96, w:3.26, h:1.3, fill:C.brickSoft, radius:0.07 });
  text({ t:'테일러스 ADTP 학비', x:6.44, y:3.1, w:2.9, h:0.24, size:11, bold:true, color:C.brick });
  text({ t:'공식 요금표가 전공별·통화별로 나뉘어 있어 이 자료에서 단일 수치로 제시하지 않습니다. 학교 Fees Schedule에서 해당 전공 표를 확인하십시오.', x:6.44, y:3.38, w:2.9, h:0.8, size:10, color:C.text, lh:1.32 });
  foot('※ RM 1 ≈ 300원 기준. 설명 당일 환율로 다시 계산하고 "○월 ○일 환율 기준"을 표기하십시오. 금액은 학교 안내 기준 예시이며 연도·전공에 따라 달라집니다.');
  note('이 표는 말레이시아 구간만입니다. 미국 구간 2년 비용은 목표 대학에 따라 달라 별도 계산이 필요하다는 점을 반드시 덧붙이십시오.');
}

/* ══ 13. 성공 조건 ① 과목 매핑 ══════════════════════════ */
{
  slide(false);
  title('성공 조건 ① — 과목 매핑', 'ADTP에서 가장 많은 돈이 새는 지점입니다');
  text({ t:'미국 대학마다 인정해 주는 학점 기준이 다릅니다', x:M, y:1.5, w:9.0, h:0.3, size:15, bold:true, color:C.ink });
  text({ t:'말레이시아에서 이수한 과목이 목표 대학의 어떤 과목과 대응하는지(실라버스 매핑)를 맞추지 못하면, 그 학점은 인정되지 않고 미국에서 다시 들어야 합니다. 한 학기를 다시 듣는 비용이 말레이시아 1년 학비를 넘습니다.', x:M, y:1.86, w:9.0, h:0.6, size:12, color:C.text, lh:1.4 });
  const steps = [
    { n:'1', t:'입학 초기에 목표 대학 3곳을 정한다', d:'막연히 "미국"이 아니라 학교 이름으로' },
    { n:'2', t:'전담 어드바이저와 실라버스를 대조한다', d:'과목별 100% 호환 여부를 문서로 확인' },
    { n:'3', t:'매 학기 수강 전에 다시 점검한다', d:'목표 대학이 바뀌면 매핑도 바뀐다' },
  ];
  steps.forEach((s,i)=>{
    const x = M + i*3.07;
    rect({ x, y:2.62, w:2.87, h:1.46, fill:C.sand, radius:0.07 });
    circle({ x:x+0.2, y:2.78, d:0.36, fill:C.deep, label:s.n, labelSize:13, labelColor:C.gold });
    text({ t:s.t, x:x+0.2, y:3.2, w:2.47, h:0.46, size:12, bold:true, color:C.ink, lh:1.25 });
    text({ t:s.d, x:x+0.2, y:3.64, w:2.47, h:0.4, size:10.5, color:C.muted, lh:1.3 });
  });
  rect({ x:M, y:4.22, w:9.0, h:0.7, fill:C.goldSoft, radius:0.07 });
  text({ t:'매핑이 맞으면 2+2, 어긋나면 2+3이 됩니다. 1년치 미국 학비가 여기서 갈립니다.', x:M+0.22, y:4.22, w:8.6, h:0.7, size:12.5, bold:true, color:C.ink, valign:'middle' });
  foot('※ 편입 경험자들이 공통으로 지적하는 항목입니다.');
  note('이 슬라이드가 이 발표에서 가장 실용적입니다. 학부모가 ADTP를 선택한 뒤 실제로 손해를 보는 지점이 여기입니다.');
}

/* ══ 14. 성공 조건 ② GPA·활동 ══════════════════════════ */
{
  slide(false);
  title('성공 조건 ② — GPA와 대외활동', '상위권 편입과 장학금은 성적만으로 결정되지 않습니다');
  rect({ x:M, y:1.52, w:4.3, h:1.7, fill:C.deep, radius:0.07 });
  text({ t:'GPA 3.6+', x:M+0.24, y:1.68, w:3.8, h:0.56, size:34, bold:true, color:C.gold, lh:1 });
  text({ t:'상위권 편입 권장 구간', x:M+0.24, y:2.28, w:3.8, h:0.26, size:12, bold:true, color:C.paper });
  text({ t:'장학금까지 노린다면 3.8~3.9 구간을 목표로 잡으라는 것이 편입 경험자들의 공통된 조언입니다.', x:M+0.24, y:2.58, w:3.8, h:0.54, size:10.5, color:C.onDarkMute, lh:1.35 });
  text({ t:'성적 외에 쌓아야 할 것', x:5.1, y:1.52, w:4.4, h:0.28, size:13, bold:true, color:C.ink });
  bullets({ x:5.1, y:1.86, w:4.4, h:1.4, size:11.5, gap:7, items:[
    '대학 내 동아리 · 학생회 활동 기록',
    'STEM 챌린지 등 교내 경진 프로그램 참여',
    '미국 대학 연계 워크숍 이수 기록',
    '전공 관련 프로젝트 · 인턴 경험',
  ]});
  rect({ x:M, y:3.4, w:9.0, h:1.5, fill:C.sand, radius:0.07 });
  text({ t:'권장 타임라인', x:M+0.22, y:3.54, w:8.6, h:0.26, size:12, bold:true, color:C.deep });
  const tl = [
    ['1학기','목표 대학 3곳 선정 · 어드바이저 배정'],
    ['2학기','실라버스 매핑 1차 확정 · 교내 활동 시작'],
    ['3학기','편입 원서 준비 · 추천서 요청 · 장학금 조사'],
    ['4학기','원서 제출 · 학점 이전 확정 · 비자 준비'],
  ];
  tl.forEach((r,i)=>{
    const x = M + 0.22 + i*2.19;
    circle({ x, y:3.88, d:0.3, fill:C.gold, label:String(i+1), labelSize:11, labelColor:C.ink });
    text({ t:r[0], x:x+0.38, y:3.88, w:1.7, h:0.3, size:11.5, bold:true, color:C.ink, valign:'middle' });
    text({ t:r[1], x, y:4.26, w:2.05, h:0.52, size:10, color:C.text, lh:1.3 });
  });
  foot('※ 학기 구분은 2+2 기준입니다. 1+3 을 택하면 일정이 한 학기씩 앞당겨집니다.');
  note('GPA 3.6은 편입 경험자들의 조언이지 학교 공표 커트라인이 아닙니다. 그렇게 말씀하십시오.');
}

/* ══ 15. 확인 항목 · 출처 ══════════════════════════ */
{
  slide(true);
  title('설명회 전에 확인할 것', '이 자료의 수치 중 학교 공표에 의존한 항목', true);
  const items = [
    '한국 검정고시·GED로 ADTP 직접 입학이 가능한가 (두 학교 서면 회신)',
    '선웨이 Tier 1 편입률 75~80% 의 산정 기준과 최신 수치',
    '테일러스 87% · 협력대 300+ 의 산정 기준과 최신 수치',
    '테일러스 ADTP 전공별 공식 학비 (Fees Schedule)',
    '두 학교의 다음 인테이크 날짜와 지원 마감일',
    '커뮤니티 보고 편입처(카네기멜런·코넬·미시간)의 학교 공식 확인',
  ];
  items.forEach((t,i)=>{
    const c0 = i % 2, r0 = Math.floor(i/2);
    const x = M + c0*4.6, y = 1.5 + r0*0.62;
    circle({ x, y:y+0.04, d:0.26, fill:C.gold, label:String(i+1), labelSize:10, labelColor:C.ink });
    text({ t, x:x+0.38, y, w:4.0, h:0.54, size:10.5, color:C.onDark, lh:1.3 });
  });
  rect({ x:M, y:3.46, w:9.0, h:1.0, fill:C.deep, radius:0.07 });
  text({ t:'출처', x:M+0.22, y:3.56, w:8.6, h:0.22, size:10, bold:true, color:C.gold, cs:1 });
  text({ t:'Sunway University — School of American Education / ADTP 프로그램 페이지 및 브로슈어  ·  Taylor\'s University — American Degree Transfer Program / Successful University Placements / University Transfers  ·  각 학교 입학 요건 및 요금 안내', x:M+0.22, y:3.82, w:8.6, h:0.56, size:9.5, color:C.onDarkMute, lh:1.35 });
  text({ t:'작성 환경의 네트워크 정책상 두 학교 공식 사이트를 직접 열람하지 못했습니다. 대외 배포 전 위 6개 항목을 확인하십시오.', x:M, y:4.58, w:9.0, h:0.3, size:9.5, color:C.onDarkMute });
  note('마지막 슬라이드는 내부용입니다. 학부모 배포본에서는 빼거나, 확인을 마친 뒤 확정 수치로 바꿔 넣으십시오.');
}

/* ══ 출력 ══════════════════════════ */
D.save('ADTP_미국편입과정_안내.pptx',
  '/tmp/claude-0/-home-user-Johan/eb00403c-5e26-5422-a421-25c490e75ccf/scratchpad/adtp-preview.html');
