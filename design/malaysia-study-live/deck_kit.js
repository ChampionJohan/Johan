// 설명회 덱 공통 키트 — .pptx 와 동일 좌표의 HTML 프리뷰를 함께 만든다
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');


const SIZES = { standard:{ W:10, H:5.625, M:0.5, layout:'LAYOUT_16x9' },
                wide:{ W:13.333, H:7.5, M:0.7, layout:'LAYOUT_WIDE' } };
let W = SIZES.standard.W, H = SIZES.standard.H, M = SIZES.standard.M;
const C = {
  ink:'0C2E2C', deep:'134744', mid:'1F6B66',
  gold:'C08A2E', goldSoft:'F5EEDC',
  brick:'A8412C', brickSoft:'F7EBE6',
  paper:'FFFFFF', sand:'F1EDE4', line:'DCD6C9',
  text:'1B2426', muted:'6E7C7A', onDark:'EFEDE6', onDarkMute:'9DB3B0',
};
const F = '맑은 고딕';


function createDeck(title, size){
  const dim = SIZES[size || 'standard'];
  W = dim.W; H = dim.H; M = dim.M;
  const pres = new PptxGenJS();
  pres.layout = dim.layout;
  pres.author = '필리핀 해외선교본부 · 말레이시아 지부';
  pres.title = title;

  const html = [];
  let cur = null;

  function slide(dark){
    const s = pres.addSlide();
    s.background = { color: dark ? C.ink : C.paper };
    const h = { dark, els: [] };
    html.push(h); cur = { s, h };
    return cur;
  }
  const px = v => (v * 96).toFixed(1) + 'px';
  const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  function rect(o){
    const opt = { x:o.x, y:o.y, w:o.w, h:o.h, fill:{ color:o.fill } };
    if (o.lineColor) opt.line = { color:o.lineColor, width:o.lineW || 1 };
    if (o.radius){ opt.rectRadius = o.radius; cur.s.addShape(pres.ShapeType.roundRect, opt); }
    else cur.s.addShape(pres.ShapeType.rect, opt);
    cur.h.els.push(`<div style="position:absolute;left:${px(o.x)};top:${px(o.y)};width:${px(o.w)};height:${px(o.h)};background:#${o.fill};${o.lineColor?`border:${(o.lineW||1)}px solid #${o.lineColor};`:''}${o.radius?`border-radius:${px(o.radius)};`:''}box-sizing:border-box"></div>`);
  }
  function circle(o){
    cur.s.addShape(pres.ShapeType.ellipse, { x:o.x, y:o.y, w:o.d, h:o.d, fill:{ color:o.fill } });
    cur.h.els.push(`<div style="position:absolute;left:${px(o.x)};top:${px(o.y)};width:${px(o.d)};height:${px(o.d)};background:#${o.fill};border-radius:50%"></div>`);
    if (o.label !== undefined){
      text({ t:o.label, x:o.x, y:o.y + o.d/2 - 0.13, w:o.d, h:0.26, size:o.labelSize||12, bold:true,
             color:o.labelColor||C.ink, align:'center', margin:0, lh:1 });
    }
  }
  function text(o){
    const opt = {
      x:o.x, y:o.y, w:o.w, h:o.h, isTextBox:true,
      fontFace:F, fontSize:o.size, bold:!!o.bold, italic:!!o.italic,
      color:o.color || C.text, align:o.align || 'left', valign:o.valign || 'top',
      margin:o.margin === undefined ? 0 : o.margin,
      lineSpacingMultiple:o.lh === undefined ? 1.22 : o.lh,
      charSpacing:o.cs || 0, wrap:true,
    };
    cur.s.addText(o.t, opt);
    const jc = o.align === 'center' ? 'center' : o.align === 'right' ? 'flex-end' : 'flex-start';
    const ai = o.valign === 'middle' ? 'center' : o.valign === 'bottom' ? 'flex-end' : 'flex-start';
    const body = Array.isArray(o.t)
      ? o.t.map(r => `<span style="${r.options&&r.options.bold?'font-weight:700;':''}${r.options&&r.options.color?`color:#${r.options.color};`:''}">${esc(r.text)}</span>${r.options&&r.options.breakLine?'<br>':''}`).join('')
      : esc(o.t).replace(/\n/g,'<br>');
    cur.h.els.push(`<div data-tb style="position:absolute;left:${px(o.x)};top:${px(o.y)};width:${px(o.w)};height:${px(o.h)};display:flex;flex-direction:column;justify-content:${ai};align-items:stretch;box-sizing:border-box"><div style="text-align:${o.align||'left'};font-size:${(o.size*96/72).toFixed(1)}px;line-height:${o.lh===undefined?1.22:o.lh};font-weight:${o.bold?700:400};${o.italic?'font-style:italic;':''}color:#${o.color||C.text};${o.cs?`letter-spacing:${(o.cs*96/72).toFixed(2)}px;`:''}display:flex;justify-content:${jc}"><div style="max-width:100%">${body}</div></div></div>`);
  }
  function bullets(o){
    const runs = o.items.map((it,i) => ({
      text: it, options: { bullet:{ code:'2022' }, breakLine: i < o.items.length-1, paraSpaceAfter: o.gap === undefined ? 7 : o.gap }
    }));
    cur.s.addText(runs, { x:o.x, y:o.y, w:o.w, h:o.h, isTextBox:true, fontFace:F, fontSize:o.size||13,
      color:o.color||C.text, margin:0, lineSpacingMultiple:1.2, wrap:true });
    cur.h.els.push(`<div data-tb style="position:absolute;left:${px(o.x)};top:${px(o.y)};width:${px(o.w)};height:${px(o.h)};box-sizing:border-box"><ul style="margin:0;padding-left:${px(0.17)};font-size:${((o.size||13)*96/72).toFixed(1)}px;line-height:1.2;color:#${o.color||C.text}">${o.items.map(i=>`<li style="margin-bottom:${(o.gap===undefined?7:o.gap)}px">${esc(i)}</li>`).join('')}</ul></div>`);
  }
  function tableEl(o){
    const rows = o.rows.map((r,ri) => r.map(cell => ({
      text: String(cell),
      options: { fontFace:F, fontSize:o.size||11.5, bold: ri===0, color: ri===0 ? C.paper : C.text,
        fill: { color: ri===0 ? C.deep : (ri%2 ? C.paper : C.sand) }, valign:'middle', margin:[4,7,4,7] }
    })));
    cur.s.addTable(rows, { x:o.x, y:o.y, w:o.w, colW:o.colW, rowH:o.rowH || 0.32,
      border:{ type:'solid', color:C.line, pt:0.5 }, autoPage:false });
    const tw = o.colW.reduce((a,b)=>a+b,0);
    cur.h.els.push(`<table data-tb style="position:absolute;left:${px(o.x)};top:${px(o.y)};width:${px(tw)};border-collapse:collapse;font-size:${((o.size||11.5)*96/72).toFixed(1)}px;table-layout:fixed">${o.rows.map((r,ri)=>`<tr>${r.map((c,ci)=>`<td style="width:${px(o.colW[ci])};height:${px(o.rowH||0.32)};border:0.5px solid #${C.line};padding:4px 7px;background:#${ri===0?C.deep:(ri%2?C.paper:C.sand)};color:#${ri===0?C.paper:C.text};font-weight:${ri===0?700:400};vertical-align:middle;box-sizing:border-box">${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`);
  }
  function title_(t, sub, dark){
    text({ t, x:M, y:0.42, w:W-2*M, h:0.55, size:29, bold:true, color:dark?C.onDark:C.ink, lh:1.1 });
    if (sub) text({ t:sub, x:M, y:1.03, w:W-2*M, h:0.3, size:12.5, color:dark?C.onDarkMute:C.muted, lh:1.2 });
  }
  function foot(t){
    text({ t, x:M, y:H-0.42, w:W-2*M, h:0.24, size:8.5, color:C.muted, lh:1.1 });
  }
  function note(txt){ cur.s.addNotes(txt); }

  function save(fileName, previewPath){
    return pres.writeFile({ fileName }).then(() => {
      const pages = html.map((h,i) => `<div class="slide ${h.dark?'dark':''}"><div class="no">${i+1}</div>${h.els.join('')}</div>`).join('');
      fs.writeFileSync(previewPath,
`<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#555;font-family:'WenQuanYi Zen Hei','Malgun Gothic',sans-serif}
.slide{position:relative;width:${W*96}px;height:${H*96}px;background:#fff;margin:0 auto 16px;overflow:hidden}
.slide.dark{background:#${C.ink}}
.no{position:absolute;right:4px;bottom:2px;font-size:11px;color:#999;z-index:99}
div{box-sizing:border-box}
</style>${pages}`);
      console.log('wrote', fileName, '—', html.length, 'slides');
    });
  }

  return { pres, slide, rect, circle, text, bullets, tableEl, title:title_, foot, note, save, C, F, W, H, M };
}

module.exports = { createDeck, C, F, W, H, M };
