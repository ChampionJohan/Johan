const { chromium } = require('playwright');
const fs = require('fs');
const FOOT = '말레이시아 원주민 청소년 컨퍼런스 · 2026.11.6–8';
const roots = `<svg class="roots" viewBox="0 0 1080 360" preserveAspectRatio="none"><g fill="none" stroke="#f2c14e" stroke-linecap="round" opacity=".35">
<path d="M540 0 C540 80 540 140 540 200 C540 260 520 300 470 340" stroke-width="14"/>
<path d="M540 120 C480 160 400 190 330 250 C290 285 250 320 200 350" stroke-width="9"/>
<path d="M540 140 C610 170 700 200 760 260 C800 300 840 330 900 350" stroke-width="9"/>
<path d="M540 200 C560 250 600 290 640 350" stroke-width="7"/>
<path d="M330 250 C300 280 300 310 270 350" stroke-width="5"/><path d="M760 260 C790 290 780 320 810 350" stroke-width="5"/></g></svg>`;
function card(n, total, inner, cls = '') {
  return `<section class="card ${cls}"><div class="glow"></div>${inner}
  <div class="foot"><span>${FOOT}</span><span>${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div></section>`;
}
const prayers = [
  ['1', '청소년들의 마음을 준비하도록', '하나님, 컨퍼런스에 참석하는 모든 청소년의 마음을 열어 주시고 예수 그리스도를 인격적으로 만나는 은혜를 주소서.'],
  ['2', '성령의 임재와 기름 부으심', '모든 예배와 찬양과 기도 가운데 성령의 강력한 임재가 나타나게 하시고 회개와 치유와 회복의 역사가 일어나게 하소서.'],
  ['3', '말씀을 통한 믿음의 뿌리', '청소년들이 세상의 가치관이 아니라 하나님의 말씀에 깊이 뿌리를 내리고 믿음 위에 굳게 서게 하소서.'],
  ['4', '다음 세대의 정체성과 비전', '청소년들이 하나님의 사랑받는 자녀임을 깨닫고 자신을 향한 하나님의 부르심과 사명을 발견하게 하소서.'],
  ['5', '죄와 어둠의 권세로부터 보호', '술, 마약, 음란, 폭력, 우상숭배와 모든 세상의 유혹으로부터 청소년들을 보호하시고 거룩한 세대로 세워 주소서.'],
  ['6', '찬양과 예배의 부흥', '청소년들의 입술에 찬양이 넘치게 하시고, 원주민 마을마다 예배의 불이 타오르게 하소서.'],
  ['7', '강사와 사역자들에게 성령의 능력을', '말씀을 전하는 강사와 선교사와 목회자들에게 성령의 기름 부으심을 더하시고, 하나님의 말씀과 사랑으로 청소년들을 섬기게 하소서.'],
  ['8', '안전과 건강을 위한 보호', '11월 6일부터 8일까지 이동과 숙박과 모든 프로그램 가운데 안전을 지켜 주시고 사고와 질병으로부터 보호하소서.'],
  ['9', '가정과 마을의 구원과 회복', '이번 컨퍼런스가 청소년들만의 은혜로 끝나지 않게 하시고 부모와 형제자매와 마을 전체가 복음을 듣고 구원받게 하소서.'],
  ['10', '말레이시아 부흥의 새로운 세대', '원주민 청소년들이 기도하는 자, 예배하는 자, 전도하는 자, 선교하는 자로 일어나 말레이시아와 열방의 부흥을 이끄는 세대가 되게 하소서.'],
];
const group = (a, b) => prayers.slice(a, b).map(([n, t, x]) => `<div class="pr"><div class="num">${n}</div><div><h3>${t}</h3><p>${x}</p></div></div>`).join('');
const T = 5;
const short = prayers.map(([n,t])=>`<div class="row"><div class="num sm">${n}</div><div class="rt">${t}</div></div>`).join('');
const cards = [
  card(1, T, `<div class="center"><div class="pill">PRAYER CARD NEWS</div>
<div class="small">말레이시아 원주민 마을</div><h1>청소년 컨퍼런스를<br>위한 기도</h1>
<div class="brush">그리스도 안에 뿌리를 내리고<br>믿음 위에 세움을 받으라</div>
<div class="date">2026년 11월 6일 – 8일</div></div>${roots}`, 'cover'),
  card(2, T, `<div class="center"><div class="label">주제 말씀 · 골로새서 2:7</div>
<p class="verse">“그 안에 뿌리를 박으며 세움을 받아<br>교훈을 받은 대로 <b>믿음에 굳게 서서</b><br>감사함을 넘치게 하라.”</p></div>
<div class="days">
<div class="day"><div class="d">11.6</div><div><h3>예수님을 만나는 날</h3><p>요한복음 3:3</p></div></div>
<div class="day"><div class="d">11.7</div><div><h3>믿음에 뿌리를 내리는 날</h3><p>골로새서 2:7</p></div></div>
<div class="day"><div class="d">11.8</div><div><h3>부르심과 사명으로 일어나는 날</h3><p>이사야 6:8</p></div></div></div>`, 'two2'),
  card(3, T, `<div class="head"><span>10가지 기도 제목</span><b>PRAY</b></div><div class="rows">${short}</div>`, 'list'),
  card(4, T, `<div class="head"><span>특별 중보기도문</span><b>다음 세대의 부흥</b></div>
<p class="body"><b>사랑과 은혜가 풍성하신 하나님 아버지!</b> 이번 컨퍼런스가 단순한 행사가 아니라 하나님의 임재를 경험하고 인생이 변화되는 <b>거룩한 만남의 자리</b>가 되게 하소서.</p>
<p class="body">모든 청소년이 예수 그리스도를 구주와 주님으로 영접하고, 그리스도 안에 깊이 뿌리를 내려 믿음 위에 굳게 서게 하소서.</p>
<p class="body">원주민 마을마다 <b>기도의 불</b>이 타오르고, <b>예배의 제단</b>이 세워지며, 말레이시아 부흥의 새로운 역사가 시작되게 하소서.</p>
<p class="amen">예수 그리스도의 이름으로 기도드립니다. 아멘!</p>`),
  card(5, T, `<div class="center"><div class="brush big">원주민 마을마다<br>기도의 불이 타오르게 하소서</div>
<div class="pill">함께 기도해 주세요</div>
<p class="body c">11월 6일 – 8일, 3일간의 은혜의 자리를 위해<br>이 카드를 나누고 기도에 동참해 주세요.</p></div>${roots}`, 'cover'),
];
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(NotoSansKR.ttf);font-weight:100 900}
@font-face{font-family:Se;src:url(NotoSerifKR.ttf);font-weight:200 900}
@font-face{font-family:B;src:url(NanumBrushScript-Regular.ttf)}
*{box-sizing:border-box;margin:0}
body{background:#222;font-family:S}
.card{width:1080px;height:1350px;position:relative;overflow:hidden;padding:110px 90px 120px;color:#fff8e7;
 background:linear-gradient(165deg,#0a1d4a 0%,#0d3b66 55%,#0e5a6b 100%);margin-bottom:20px;display:flex;flex-direction:column;justify-content:center;gap:34px}
.glow{position:absolute;top:-300px;right:-250px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(242,193,78,.28),transparent 65%)}
.card:before{content:"";position:absolute;inset:34px;border:2px solid rgba(242,193,78,.45);border-radius:28px;pointer-events:none}
.roots{position:absolute;left:0;bottom:100px;width:100%;height:300px}
.two .pr{padding:46px 44px}.two .pr h3{font-size:43px;letter-spacing:-.5px}.two .pr p{font-size:39px}.two .num{width:96px;height:96px;font-size:46px}
.foot{position:absolute;left:84px;right:84px;bottom:62px;display:flex;justify-content:space-between;font-size:24px;color:rgba(255,248,231,.65);letter-spacing:.5px;z-index:2}
.center{text-align:center;display:flex;flex-direction:column;align-items:center;gap:30px;position:relative;z-index:1}
.pill{background:#f2c14e;color:#0a1d4a;font-weight:800;font-size:28px;padding:12px 34px;border-radius:40px;letter-spacing:3px}
.small{font-size:36px;font-weight:500;color:#f2c14e}
h1{font-family:Se;font-weight:900;font-size:104px;line-height:1.2}
h1.mid{font-size:84px}
.brush{font-family:B;font-size:70px;line-height:1.3;color:#ffe29a}
.brush.big{font-size:88px}
.date{margin-top:10px;font-size:40px;font-weight:700;border-top:2px solid #f2c14e;border-bottom:2px solid #f2c14e;padding:16px 40px}
.label{font-size:34px;color:#f2c14e;font-weight:700;letter-spacing:2px}
.quote{font-family:Se;font-size:220px;line-height:.6;color:#f2c14e;height:100px}
.verse{font-family:Se;font-size:62px;line-height:1.55;font-weight:500}.verse b{color:#ffe29a;font-weight:800}
.ref{font-size:30px;color:rgba(255,248,231,.7);letter-spacing:4px}
.head{display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px solid #f2c14e;padding-bottom:20px;position:relative;z-index:1}
.head span{font-family:Se;font-weight:900;font-size:56px}.head b{font-size:40px;color:#f2c14e}
.pr{display:flex;gap:32px;align-items:flex-start;background:rgba(255,255,255,.07);border-radius:24px;padding:34px 36px;position:relative;z-index:1}
.num{flex:none;width:84px;height:84px;border-radius:50%;background:#f2c14e;color:#0a1d4a;font-weight:900;font-size:40px;display:flex;align-items:center;justify-content:center}
.pr h3{font-size:42px;font-weight:800;color:#ffe29a;margin-bottom:12px;line-height:1.3}
.pr p{font-size:34px;line-height:1.6;font-weight:400}
.sub{font-family:Se;font-size:50px;line-height:1.35;color:#ffe29a;position:relative;z-index:1}
.body{font-size:37px;line-height:1.7;position:relative;z-index:1}.body b{color:#ffe29a;font-weight:700}.body.c{text-align:center;font-size:38px}
.amen{font-family:B;font-size:62px;color:#f2c14e;text-align:center;position:relative;z-index:1;margin-top:10px}
.day{display:flex;gap:40px;align-items:center;background:rgba(255,255,255,.07);border-radius:28px;padding:44px 44px;position:relative;z-index:1}
.d{font-family:Se;font-weight:900;font-size:80px;color:#f2c14e;min-width:190px}
.day h3{font-size:42px;font-weight:800;line-height:1.35}.day p{font-size:36px;color:#ffe29a;margin-top:10px}
.days{display:flex;flex-direction:column;gap:22px;position:relative;z-index:1}.two2 .day{padding:34px 40px}.two2 .verse{font-size:56px}
.rows{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1}.row{display:flex;align-items:center;gap:28px;background:rgba(255,255,255,.07);border-radius:20px;padding:12px 28px}.num.sm{width:56px;height:56px;font-size:28px}.rt{font-size:38px;font-weight:700;color:#fff8e7}
.list{justify-content:flex-start;padding-top:100px;gap:28px}
</style><body>${cards.join('')}`;
fs.writeFileSync('cards.html', html);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + process.cwd() + '/cards.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1000);
  const els = await p.$$('.card');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `card_${String(i + 1).padStart(2, '0')}.png` });
  await b.close();
  console.log(els.length);
})();
