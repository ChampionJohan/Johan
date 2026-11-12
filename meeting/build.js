const { chromium } = require('playwright');
const fs = require('fs');
const FOOT = '포커스 에듀케이션 김문교 대표와의 만남';
function card(n, T, photo, pos, inner, cls = '') {
  return `<section class="card ${cls}"><div class="ph" style="background-image:url(${photo});background-position:${pos}"></div><div class="fade"></div>
  <div class="body">${inner}</div><div class="foot"><span>${FOOT}</span><span>${String(n).padStart(2, '0')} / ${String(T).padStart(2, '0')}</span></div></section>`;
}
const T = 4;
const cards = [
  card(1, T, 'photo1.jpg', '35% 50%', `<div class="pill">MEETING NEWS</div>
<h1>포커스 에듀케이션<br>김문교 대표와의 만남</h1>
<div class="brush">함께 비전을 나누는 아름다운 동역</div>`, 'cover'),
  card(2, T, 'photo2.jpg', '30% 50%', `<div class="label">이번 만남에서 나눈 협의</div>
<div class="item"><div class="n">1</div><div class="t">말레이시아 유학</div></div>
<div class="item"><div class="n">2</div><div class="t">캠프</div></div>
<div class="item"><div class="n">3</div><div class="t">말레이시아 학생의 한국 유학 등</div></div>`, 'list'),
  card(3, T, 'photo1.jpg', '70% 50%', `<div class="label">협의 내용</div>
<p class="big">함께 <b>비전</b>을 나누고<br><b>아름답게 동역</b>하는 것에<br>협의했습니다.</p>`, 'quote'),
  card(4, T, 'photo2.jpg', '75% 50%', `<div class="pill">함께 기도해 주세요</div>
<div class="brush big">이 아름다운 동역 위에<br>하나님의 인도하심이<br>함께하시기를</div>
<p class="sm">말레이시아와 한국의 학생들에게<br>좋은 길이 열리도록 기도로 함께해 주세요.</p>`, 'quote'),
];
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(NotoSansKR.ttf);font-weight:100 900}
@font-face{font-family:Se;src:url(NotoSerifKR.ttf);font-weight:200 900}
@font-face{font-family:B;src:url(NanumBrushScript-Regular.ttf)}
*{box-sizing:border-box;margin:0}
body{background:#222;font-family:S}
.card{width:1080px;height:1350px;position:relative;overflow:hidden;color:#fff8e7;background:#0a1d4a;margin-bottom:20px}
.ph{position:absolute;left:0;top:0;width:100%;height:760px;background-size:cover}
.fade{position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(180deg,rgba(10,29,74,0) 0,rgba(10,29,74,0) 38%,#0a1d4a 58%,#0d3b66 100%)}
.card:before{content:"";position:absolute;inset:34px;border:2px solid rgba(242,193,78,.5);border-radius:28px;z-index:3}
.body{position:absolute;left:90px;right:90px;top:690px;bottom:130px;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:26px}
.pill{align-self:flex-start;background:#f2c14e;color:#0a1d4a;font:800 26px S;padding:10px 30px;border-radius:40px;letter-spacing:3px}
h1{font:900 70px/1.25 Se}
.brush{font:400 62px/1.3 B;color:#ffe29a}.brush.big{font-size:68px}
.label{font:700 36px S;color:#f2c14e;letter-spacing:2px}
.item{display:flex;align-items:center;gap:30px;background:rgba(255,255,255,.08);border-radius:22px;padding:24px 34px}
.n{flex:none;width:68px;height:68px;border-radius:50%;background:#f2c14e;color:#0a1d4a;font:900 36px S;display:flex;align-items:center;justify-content:center}
.t{font:800 44px/1.3 S}
.big{font:500 56px/1.5 Se}.big b{color:#ffe29a;font-weight:900}
.sm{font:400 34px/1.7 Se;word-break:keep-all}
.foot{position:absolute;left:84px;right:84px;bottom:62px;z-index:3;display:flex;justify-content:space-between;font:400 24px S;color:rgba(255,248,231,.7)}
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
})();
