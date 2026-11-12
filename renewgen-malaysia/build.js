// ReNewGen Malaysia introduction deck — builds KO / EN / ZH versions.
// Usage: node build.js <path-to-apply_theme.js>
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.argv[2]);
const CONTENT = require("./content.js");

const W = 13.33;
const MX = 0.6;
const CW = W - 2 * MX;

const LANGS = {
  ko: { idx: 0, font: "Malgun Gothic", file: "ReNewGen_Malaysia_KO.pptx" },
  en: { idx: 1, font: "Arial", file: "ReNewGen_Malaysia_EN.pptx" },
  zh: { idx: 2, font: "Microsoft YaHei", file: "ReNewGen_Malaysia_ZH.pptx" },
};

async function build(lang) {
  const L = LANGS[lang];
  const T = (a) => (Array.isArray(a) ? a[L.idx] : a);
  const D = CONTENT;

  const THEME = {
    name: "ReNewGen Malaysia",
    headFontFace: L.font,
    bodyFontFace: L.font,
    colors: {
      dk1: "1B2333", lt1: "FFFFFF", dk2: "0A2A66", lt2: "F1F4F8",
      accent1: "00A859", accent2: "0047AB", accent3: "F25C12",
      accent4: "FFB84D", accent5: "5B6578", accent6: "DDF3E8",
      hlink: "0047AB", folHlink: "5B6578",
    },
  };

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = T(D.deckTitle);
  pres.author = "ReNewGen";
  const C = pres.SchemeColor;
  const GREEN = C.accent1, BLUE = C.accent2, ORANGE = C.accent3, AMBER = C.accent4;
  const NAVY = C.text2, INK = C.text1, MUTED = C.accent5, TINT = C.background2, WHITE = C.background1;
  const STAGE = [BLUE, GREEN, AMBER, ORANGE];

  pres.defineSlideMaster({
    title: "COVER",
    background: { color: NAVY },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: MX, y: 2.35, w: 8.2, h: 1.9, fontSize: 54, bold: true, color: WHITE, align: "left", valign: "top", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: MX, y: 4.45, w: 8.2, h: 1.2, fontSize: 22, color: WHITE, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: WHITE },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.4, w: CW, h: 0.85, fontSize: 32, bold: true, color: NAVY, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { text: { text: "ReNewGen Malaysia", options: { x: MX, y: 6.98, w: 4, h: 0.3, fontSize: 10, color: MUTED, margin: 0 } } },
    ],
    slideNumber: { x: W - MX - 0.6, y: 6.98, w: 0.6, h: 0.3, fontSize: 10, color: MUTED, align: "right" },
  });
  pres.defineSlideMaster({
    title: "CLOSING",
    background: { color: NAVY },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: MX, y: 1.2, w: CW, h: 1.5, fontSize: 40, bold: true, color: WHITE, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });

  // ---------- helpers ----------
  let section = "";
  const newSection = (title) => { section = T(title); pres.addSection({ title: section }); };
  const content = (title) => {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
    s.addText(T(title), { placeholder: "title" });
    return s;
  };
  const txt = (s, text, o) => s.addText(Array.isArray(text) && typeof text[0] === "string" ? T(text) : text,
    Object.assign({ isTextBox: true, margin: 0, color: INK, fontSize: 14, valign: "top", align: "left" }, o));
  const card = (s, x, y, w, h, color, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: color || TINT }, line: { type: "none" }, objectName: name || "Card" });
  const badge = (s, x, y, d, label, color, fs) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: "none" }, objectName: "Badge" });
    s.addText(String(label), { isTextBox: true, x, y, w: d, h: d, margin: 0, align: "center", valign: "middle", bold: true, color: WHITE, fontSize: fs || 16 });
  };
  const bullets = (s, items, o) => s.addText(
    items.map((it, i) => ({ text: T(it), options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, paraSpaceAfter: 5 } })),
    Object.assign({ isTextBox: true, margin: 0, color: INK, fontSize: 14, valign: "top", align: "left" }, o));

  // ---------- 1. Cover ----------
  newSection(D.sections[0]);
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: section });
    txt(s, "REVIVAL NEW GENERATION", { x: MX, y: 1.75, w: 8, h: 0.4, fontSize: 14, bold: true, color: AMBER, charSpacing: 4 });
    s.addText(T(D.cover.title), { placeholder: "title" });
    s.addText(T(D.cover.sub), { placeholder: "body" });
    // journey motif: six dots, last one highlighted
    const x0 = 9.6, y0 = 1.5, gap = 0.82;
    s.addShape(pres.shapes.LINE, { x: x0 + 0.21, y: y0 + 0.2, w: 0, h: gap * 5, line: { color: WHITE, width: 1.5, transparency: 60 } });
    D.countries.forEach((c, i) => {
      const last = i === 5;
      const d = last ? 0.56 : 0.42;
      s.addShape(pres.shapes.OVAL, { x: x0 + (0.42 - d) / 2, y: y0 + gap * i - (d - 0.42) / 2, w: d, h: d, fill: { color: last ? ORANGE : GREEN }, line: { type: "none" }, objectName: "Journey dot" });
      txt(s, c, { x: x0 + 0.75, y: y0 + gap * i - 0.04, w: 2.4, h: 0.5, fontSize: last ? 22 : 16, bold: last, color: WHITE, valign: "middle" });
    });
  }

  // ---------- 2. Contents ----------
  {
    const s = content(D.contents.title);
    D.contents.items.forEach((it, i) => {
      const y = 1.6 + i * 1.02;
      card(s, MX, y, CW, 0.86);
      txt(s, String(i + 1).padStart(2, "0"), { x: MX + 0.3, y, w: 0.9, h: 0.86, fontSize: 28, bold: true, color: i >= 2 ? ORANGE : GREEN, valign: "middle" });
      txt(s, it[0], { x: MX + 1.3, y, w: 4.6, h: 0.86, fontSize: 20, bold: true, color: NAVY, valign: "middle" });
      txt(s, it[1], { x: MX + 6.0, y, w: 5.9, h: 0.86, fontSize: 14, color: MUTED, valign: "middle" });
    });
  }

  // ---------- 3. What is ReNewGen ----------
  {
    const s = content(D.what.title);
    s.addText([
      { text: "Re", options: { color: GREEN } }, { text: "New", options: { color: BLUE } }, { text: "Gen", options: { color: ORANGE } },
    ], { isTextBox: true, x: MX, y: 1.5, w: 7.3, h: 0.95, fontSize: 60, bold: true, margin: 0, valign: "middle" });
    txt(s, "Revival New Generation", { x: MX, y: 2.5, w: 7.3, h: 0.4, fontSize: 18, bold: true, color: MUTED });
    txt(s, D.what.hope, { x: MX, y: 3.05, w: 7.3, h: 1.15, fontSize: 15 });
    D.what.cards.forEach((c, i) => {
      const w = 2.3, x = MX + i * (w + 0.2), y = 4.4;
      card(s, x, y, w, 2.35);
      txt(s, c[0], { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.4, fontSize: 15, bold: true, color: [GREEN, BLUE, ORANGE][i] });
      txt(s, c[1], { x: x + 0.2, y: y + 0.7, w: w - 0.4, h: 1.55, fontSize: 14 });
    });
    const x = 8.3, w = W - MX - 8.3;
    card(s, x, 1.5, w, 5.25, NAVY, "Vision card");
    txt(s, D.what.visionLabel, { x: x + 0.35, y: 1.8, w: w - 0.7, h: 0.35, fontSize: 12, bold: true, color: AMBER, charSpacing: 2 });
    txt(s, D.verse, { x: x + 0.35, y: 2.2, w: w - 0.7, h: 1.7, fontSize: 16, italic: true, color: WHITE });
    txt(s, D.verseRef, { x: x + 0.35, y: 3.95, w: w - 0.7, h: 0.3, fontSize: 12, bold: true, color: WHITE });
    txt(s, D.what.missionLabel, { x: x + 0.35, y: 4.6, w: w - 0.7, h: 0.35, fontSize: 12, bold: true, color: AMBER, charSpacing: 2 });
    txt(s, D.what.mission, { x: x + 0.35, y: 5.0, w: w - 0.7, h: 1.5, fontSize: 14, color: WHITE });
  }

  // ---------- 4. Global journey ----------
  {
    const s = content(D.journey.title);
    txt(s, D.journey.lead, { x: MX, y: 1.5, w: CW, h: 0.7, fontSize: 16, color: MUTED });
    const y = 3.55, step = CW / 6;
    s.addShape(pres.shapes.LINE, { x: MX + step / 2, y, w: step * 5, h: 0, line: { color: "C9D2DF", width: 3 } });
    D.countries.forEach((c, i) => {
      const last = i === 5, d = last ? 1.3 : 0.9, cx = MX + step * i + step / 2;
      badge(s, cx - d / 2, y - d / 2, d, i + 1, last ? ORANGE : i % 2 ? BLUE : GREEN, last ? 32 : 22);
      txt(s, c, { x: cx - step / 2, y: y + 0.85, w: step, h: 0.45, fontSize: last ? 20 : 16, bold: true, color: last ? ORANGE : NAVY, align: "center" });
      if (last) txt(s, D.journey.next, { x: cx - step / 2, y: y - 1.25, w: step, h: 0.35, fontSize: 12, bold: true, color: ORANGE, align: "center", charSpacing: 2 });
    });
    card(s, MX, 5.25, CW, 1.4);
    txt(s, "6", { x: MX + 0.4, y: 5.25, w: 1.0, h: 1.4, fontSize: 60, bold: true, color: ORANGE, valign: "middle" });
    txt(s, D.journey.note, { x: MX + 1.5, y: 5.25, w: CW - 1.9, h: 1.4, fontSize: 16, valign: "middle" });
  }

  // ---------- Why the next generation ----------
  {
    const s = content(D.ng.title);
    const wL = 5.0;
    card(s, MX, 1.5, wL, 5.24, NAVY, "Verse card");
    txt(s, D.ng.verseLabel, { x: MX + 0.4, y: 1.85, w: wL - 0.8, h: 0.35, fontSize: 12, bold: true, color: AMBER, charSpacing: 2 });
    txt(s, D.ng.verse, { x: MX + 0.4, y: 2.35, w: wL - 0.8, h: 3.0, fontSize: 18, italic: true, color: WHITE });
    txt(s, D.ng.verseRef, { x: MX + 0.4, y: 5.95, w: wL - 0.8, h: 0.4, fontSize: 13, bold: true, color: WHITE });
    const xR = MX + wL + 0.3, wR = W - MX - xR, cw = (wR - 0.7) / 2;
    D.ng.cards.forEach((c, i) => {
      const x = xR + i * (cw + 0.7);
      card(s, x, 1.5, cw, 3.3, i ? C.accent6 : TINT);
      txt(s, c[0], { x: x + 0.3, y: 1.75, w: cw - 0.6, h: 0.35, fontSize: 12, bold: true, color: i ? GREEN : MUTED, charSpacing: 2 });
      txt(s, c[1], { x: x + 0.3, y: 2.15, w: cw - 0.6, h: 0.85, fontSize: 20, bold: true, color: NAVY });
      txt(s, c[2], { x: x + 0.3, y: 3.1, w: cw - 0.6, h: 1.55, fontSize: 14 });
    });
    s.addShape(pres.shapes.CHEVRON, { x: xR + cw + 0.2, y: 2.95, w: 0.3, h: 0.45, fill: { color: ORANGE }, line: { type: "none" }, objectName: "Arrow" });
    txt(s, D.ng.howLabel, { x: xR, y: 5.05, w: wR, h: 0.35, fontSize: 14, bold: true, color: NAVY });
    const hw = (wR - 0.4) / 3;
    D.ng.how.forEach((h, i) => {
      const x = xR + i * (hw + 0.2);
      badge(s, x, 5.55, 0.5, i + 1, [ORANGE, GREEN, BLUE][i], 14);
      txt(s, h[0], { x: x + 0.62, y: 5.55, w: hw - 0.62, h: 0.5, fontSize: 15, bold: true, color: NAVY, valign: "middle" });
      txt(s, h[1], { x, y: 6.15, w: hw, h: 0.6, fontSize: 12 });
    });
  }

  // ---------- 5. Four core ministries ----------
  newSection(D.sections[1]);
  {
    const s = content(D.core.title);
    const w = 3.55, h = 2.52, cols = [GREEN, ORANGE, BLUE, AMBER];
    D.core.cards.forEach((c, i) => {
      const x = MX + (i % 2) * (w + 0.2), y = 1.5 + Math.floor(i / 2) * (h + 0.2);
      card(s, x, y, w, h);
      badge(s, x + 0.25, y + 0.25, 0.55, "0" + (i + 1), cols[i], 13);
      txt(s, c[0], { x: x + 0.95, y: y + 0.25, w: w - 1.15, h: 0.55, fontSize: 17, bold: true, color: NAVY, valign: "middle" });
      txt(s, c[1], { x: x + 0.25, y: y + 1.0, w: w - 0.5, h: h - 1.15, fontSize: 14 });
    });
    const x = 8.3, wR = W - MX - 8.3, cx = x + wR / 2, cy = 3.35;
    card(s, x, 1.5, wR, 5.24, NAVY, "Hub card");
    s.addShape(pres.shapes.OVAL, { x: cx - 1.55, y: cy - 1.55, w: 3.1, h: 3.1, fill: { type: "none" }, line: { color: WHITE, width: 1.5, transparency: 55 }, objectName: "Hub ring" });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: cy - 0.95, w: 1.9, h: 1.9, fill: { color: WHITE }, line: { type: "none" }, objectName: "Hub center" });
    txt(s, D.triple.name, { x: cx - 0.85, y: cy - 0.5, w: 1.7, h: 1.0, fontSize: 15, bold: true, color: NAVY, align: "center", valign: "middle" });
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach((d, i) => badge(s, cx + d[0] * 1.55 - 0.3, cy + d[1] * 1.55 - 0.3, 0.6, "0" + (i + 1), cols[i], 13));
    txt(s, D.core.centerLabel, { x: x + 0.3, y: 5.3, w: wR - 0.6, h: 0.35, fontSize: 15, bold: true, color: AMBER });
    txt(s, D.core.center, { x: x + 0.3, y: 5.7, w: wR - 0.6, h: 0.95, fontSize: 13, color: WHITE });
  }

  // ---------- 6. Triple School ----------
  {
    const s = content(D.triple.title);
    const wR = 4.95, xR = W - MX - wR;
    const w = xR - MX - 0.3, h = 1.6, cols = [ORANGE, AMBER, GREEN];
    D.triple.rows.forEach((r, i) => {
      const y = 1.5 + i * (h + 0.22);
      card(s, MX, y, w, h);
      badge(s, MX + 0.25, y + 0.3, 1.0, i + 1, cols[i], 30);
      txt(s, r[0], { x: MX + 1.5, y: y + 0.18, w: w - 1.7, h: 0.4, fontSize: 18, bold: true, color: NAVY });
      txt(s, r[1], { x: MX + 1.5, y: y + 0.62, w: w - 1.7, h: 0.35, fontSize: 14, bold: true, color: MUTED });
      txt(s, r[2], { x: MX + 1.5, y: y + 1.02, w: w - 1.7, h: 0.5, fontSize: 14 });
    });
    // staircase: three steps rising to the fullness of Christ
    card(s, xR, 1.5, wR, 5.24, NAVY, "Staircase card");
    txt(s, D.triple.goalLabel, { x: xR + 0.35, y: 1.75, w: wR - 0.7, h: 0.3, fontSize: 12, bold: true, color: AMBER, charSpacing: 2 });
    txt(s, D.triple.goal, { x: xR + 0.35, y: 2.1, w: wR - 0.7, h: 0.75, fontSize: 18, bold: true, color: WHITE });
    const sw = (wR - 0.7) / 3, base = 6.4;
    D.triple.steps.forEach((st, i) => {
      const sh = 0.95 + i * 0.85, x = xR + 0.35 + i * sw;
      s.addShape(pres.shapes.RECTANGLE, { x, y: base - sh, w: sw, h: sh, fill: { color: cols[i] }, line: { type: "none" }, objectName: "Step " + (i + 1) });
      txt(s, "STEP " + (i + 1), { x, y: base - sh + 0.12, w: sw, h: 0.3, fontSize: 11, bold: true, color: i === 1 ? INK : WHITE, align: "center" });
      txt(s, st, { x: x + 0.05, y: base - sh + 0.42, w: sw - 0.1, h: 0.5, fontSize: 13, bold: true, color: i === 1 ? INK : WHITE, align: "center" });
    });
  }

  // ---------- 7. Training system ----------
  {
    const s = content(D.train.title);
    const wL = 5.4;
    txt(s, D.train.mechLabel, { x: MX, y: 1.5, w: wL, h: 0.4, fontSize: 18, bold: true, color: GREEN });
    D.train.mech.forEach((m, i) => {
      const y = 2.05 + i * 1.2;
      badge(s, MX, y, 0.6, i + 1, GREEN, 16);
      txt(s, m[0], { x: MX + 0.8, y, w: wL - 0.8, h: 0.6, fontSize: 16, bold: true, color: NAVY, valign: "middle" });
      txt(s, m[1], { x: MX + 0.8, y: y + 0.62, w: wL - 0.8, h: 0.8, fontSize: 14 });
    });
    card(s, MX, 5.7, wL, 1.04, NAVY, "Modes card");
    txt(s, D.train.modesLabel, { x: MX + 0.3, y: 5.78, w: wL - 0.6, h: 0.35, fontSize: 14, bold: true, color: AMBER });
    txt(s, D.train.modes, { x: MX + 0.3, y: 6.15, w: wL - 0.6, h: 0.5, fontSize: 12, color: WHITE });
    const xR = 6.5, wR = W - MX - xR, w = (wR - 0.2) / 2, h = 2.26;
    txt(s, D.train.areaLabel, { x: xR, y: 1.5, w: wR, h: 0.4, fontSize: 18, bold: true, color: BLUE });
    D.train.areas.forEach((a, i) => {
      const x = xR + (i % 2) * (w + 0.2), y = 2.1 + Math.floor(i / 2) * (h + 0.2);
      card(s, x, y, w, h);
      txt(s, a[0], { x: x + 0.25, y: y + 0.2, w: 1.1, h: 0.7, fontSize: 32, bold: true, color: [ORANGE, GREEN, BLUE, AMBER][i], valign: "middle" });
      txt(s, a[1], { x: x + 1.35, y: y + 0.2, w: w - 1.55, h: 0.7, fontSize: 16, bold: true, color: NAVY, valign: "middle" });
      txt(s, a[2], { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: h - 1.2, fontSize: 14 });
    });
  }

  // ---------- Faith community (house) ----------
  {
    const s = content(D.house.title);
    const hx = MX, hw = 5.6;
    card(s, hx, 1.5, hw, 5.24, TINT, "House card");
    const bx = hx + 0.6, bw = hw - 1.2;
    s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x: bx - 0.25, y: 1.75, w: bw + 0.5, h: 1.45, fill: { color: ORANGE }, line: { type: "none" }, objectName: "Roof" });
    txt(s, D.house.roof, { x: bx + 0.9, y: 2.45, w: bw - 1.8, h: 0.7, fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle" });
    [0, 1].forEach((k) => s.addShape(pres.shapes.RECTANGLE, { x: bx + k * (bw - 0.75), y: 3.3, w: 0.75, h: 2.15, fill: { color: GREEN }, line: { type: "none" }, objectName: "Pillar" }));
    txt(s, D.house.pillar, { x: bx + 0.9, y: 3.4, w: bw - 1.8, h: 0.4, fontSize: 13, bold: true, color: GREEN, align: "center", valign: "middle" });
    const iw = (bw - 1.9) / 2;
    D.house.inside.forEach((t, i) => {
      const x = bx + 0.95 + (i % 2) * (iw + 0.1), y = 3.9 + Math.floor(i / 2) * 0.75;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: iw, h: 0.65, rectRadius: 0.08, fill: { color: WHITE }, line: { type: "none" }, objectName: "Room" });
      txt(s, t, { x, y, w: iw, h: 0.65, fontSize: 14, bold: true, color: NAVY, align: "center", valign: "middle" });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: bx - 0.25, y: 5.55, w: bw + 0.5, h: 0.8, fill: { color: AMBER }, line: { type: "none" }, objectName: "Foundation" });
    txt(s, D.house.base, { x: bx - 0.25, y: 5.55, w: bw + 0.5, h: 0.8, fontSize: 14, bold: true, color: INK, align: "center", valign: "middle" });
    const xR = hx + hw + 0.3, wR = W - MX - xR, cw = (wR - 0.2) / 2;
    D.house.modes.forEach((m, i) => {
      const x = xR + i * (cw + 0.2);
      card(s, x, 1.5, cw, 2.5, i ? NAVY : TINT);
      txt(s, m[0], { x: x + 0.3, y: 1.7, w: cw - 0.6, h: 0.5, fontSize: 22, bold: true, color: i ? AMBER : BLUE, valign: "middle" });
      txt(s, m[1], { x: x + 0.3, y: 2.3, w: cw - 0.6, h: 1.6, fontSize: 14, color: i ? WHITE : INK });
    });
    txt(s, D.house.fruitLabel, { x: xR, y: 4.3, w: wR, h: 0.4, fontSize: 16, bold: true, color: NAVY });
    D.house.fruit.forEach((f, i) => {
      const x = xR + (i % 2) * (cw + 0.2), y = 4.85 + Math.floor(i / 2) * 0.98;
      card(s, x, y, cw, 0.85);
      badge(s, x + 0.18, y + 0.17, 0.5, i + 1, [GREEN, BLUE, ORANGE, GREEN][i], 14);
      txt(s, f, { x: x + 0.85, y, w: cw - 1.0, h: 0.85, fontSize: 14, bold: true, color: NAVY, valign: "middle" });
    });
  }

  // ---------- Missionary identity ----------
  {
    const s = content(D.idn.title);
    txt(s, D.idn.lead, { x: MX, y: 1.5, w: CW, h: 0.6, fontSize: 16, color: MUTED });
    const w = (CW - 0.6) / 4, cols = [GREEN, BLUE, AMBER, ORANGE];
    D.idn.cards.forEach((c, i) => {
      const x = MX + i * (w + 0.2), y = 2.3, h = 3.0;
      card(s, x, y, w, h);
      badge(s, x + 0.25, y + 0.25, 0.8, i + 1, cols[i], 24);
      txt(s, c[0], { x: x + 0.25, y: y + 1.2, w: w - 0.5, h: 0.7, fontSize: 17, bold: true, color: NAVY, valign: "middle" });
      txt(s, c[1], { x: x + 0.25, y: y + 2.0, w: w - 0.5, h: 0.9, fontSize: 13 });
    });
    card(s, MX, 5.55, CW, 1.19, NAVY, "True Christian band");
    txt(s, D.idn.bandLabel, { x: MX + 0.35, y: 5.55, w: 3.0, h: 1.19, fontSize: 16, bold: true, color: AMBER, valign: "middle" });
    txt(s, D.idn.band, { x: MX + 3.4, y: 5.55, w: CW - 3.75, h: 1.19, fontSize: 14, color: WHITE, valign: "middle" });
  }

  // ---------- 8. Camp ministry ----------
  {
    const s = content(D.camp.title);
    const w = (CW - 0.6) / 4, h = 3.05, cols = [GREEN, BLUE, ORANGE, NAVY];
    const cxs = D.camp.cards.map((c, i) => MX + i * (w + 0.2) + w / 2);
    D.camp.cards.forEach((c, i) => {
      const x = MX + i * (w + 0.2), y = 1.5;
      card(s, x, y, w, h);
      txt(s, c[0], { x: x + 0.22, y: y + 0.18, w: w - 0.44, h: 0.6, fontSize: 26, bold: true, color: cols[i], valign: "middle" });
      txt(s, c[1], { x: x + 0.22, y: y + 0.82, w: w - 0.44, h: 0.35, fontSize: 16, bold: true, color: NAVY });
      txt(s, c[3], { x: x + 0.22, y: y + 1.17, w: w - 0.44, h: 0.3, fontSize: 11, bold: true, color: MUTED });
      txt(s, c[2], { x: x + 0.22, y: y + 1.6, w: w - 0.44, h: h - 1.7, fontSize: 14 });
    });
    // depth pathway: circles grow with the length of the camp
    const ly = 5.55;
    s.addShape(pres.shapes.LINE, { x: cxs[0], y: ly, w: cxs[3] - cxs[0], h: 0, line: { color: "C9D2DF", width: 3 } });
    [0.55, 0.55, 0.9, 1.35].forEach((d, i) => {
      s.addShape(pres.shapes.OVAL, { x: cxs[i] - d / 2, y: ly - d / 2, w: d, h: d, fill: { color: cols[i] }, line: { type: "none" }, objectName: "Depth dot" });
      txt(s, D.camp.path[i], { x: cxs[i] - w / 2, y: 6.3, w, h: 0.4, fontSize: 14, bold: true, color: NAVY, align: "center", valign: "middle" });
    });
  }

  // ---------- 9. Five principles ----------
  {
    const s = content(D.five.title);
    D.five.rows.forEach((r, i) => {
      const y = 1.5 + i * 1.06, h = 0.92;
      card(s, MX, y, CW, h);
      badge(s, MX + 0.22, y + 0.17, 0.58, i + 1, [GREEN, BLUE, ORANGE, GREEN, BLUE][i], 16);
      txt(s, r[0], { x: MX + 1.05, y, w: 2.75, h, fontSize: 16, bold: true, color: NAVY, valign: "middle" });
      txt(s, r[1], { x: MX + 3.9, y, w: CW - 4.15, h, fontSize: 14, valign: "middle" });
    });
  }

  // ---------- 10. Why Malaysia ----------
  newSection(D.sections[2]);
  {
    const s = content(D.why.title);
    const w = (CW - 0.4) / 3;
    D.why.stats.forEach((st, i) => {
      const x = MX + i * (w + 0.2);
      card(s, x, 1.5, w, 2.2, i === 2 ? NAVY : TINT);
      txt(s, st[0], { x: x + 0.3, y: 1.62, w: w - 0.6, h: 1.0, fontSize: 54, bold: true, color: i === 2 ? AMBER : [BLUE, GREEN][i], valign: "middle" });
      txt(s, st[1], { x: x + 0.3, y: 2.7, w: w - 0.6, h: 0.9, fontSize: 14, color: i === 2 ? WHITE : INK });
    });
    txt(s, D.why.approachLabel, { x: MX, y: 4.0, w: CW, h: 0.4, fontSize: 18, bold: true, color: NAVY });
    const w4 = (CW - 0.6) / 4;
    D.why.approach.forEach((a, i) => {
      const x = MX + i * (w4 + 0.2), y = 4.6;
      badge(s, x, y, 0.5, i + 1, [GREEN, BLUE, ORANGE, GREEN][i], 14);
      txt(s, a[0], { x: x + 0.65, y, w: w4 - 0.65, h: 0.5, fontSize: 14, bold: true, color: NAVY, valign: "middle" });
      txt(s, a[1], { x, y: y + 0.65, w: w4, h: 1.1, fontSize: 13 });
    });
    txt(s, D.why.source, { x: MX, y: 6.5, w: CW, h: 0.3, fontSize: 10, color: MUTED });
  }

  // ---------- 11. Four-stage plan ----------
  {
    const s = content(D.plan.title);
    const w = (CW - 0.9) / 4, h = 4.0, y = 1.5;
    D.stages.forEach((st, i) => {
      const x = MX + i * (w + 0.3);
      card(s, x, y, w, h);
      badge(s, x + 0.25, y + 0.25, 0.7, i + 1, STAGE[i], 20);
      txt(s, st.name, { x: x + 1.1, y: y + 0.25, w: w - 1.3, h: 0.7, fontSize: 18, bold: true, color: NAVY, valign: "middle" });
      txt(s, st.tag, { x: x + 0.25, y: y + 1.1, w: w - 0.5, h: 0.55, fontSize: 12, bold: true, color: MUTED });
      bullets(s, st.short, { x: x + 0.25, y: y + 1.75, w: w - 0.5, h: h - 1.9, fontSize: 13 });
      if (i < 3) s.addShape(pres.shapes.CHEVRON, { x: x + w + 0.04, y: y + h / 2 - 0.18, w: 0.22, h: 0.36, fill: { color: MUTED }, line: { type: "none" }, objectName: "Arrow" });
    });
    card(s, MX, 5.75, CW, 1.0, NAVY, "Throughout band");
    txt(s, D.plan.bandLabel, { x: MX + 0.35, y: 5.75, w: 2.6, h: 1.0, fontSize: 14, bold: true, color: AMBER, valign: "middle" });
    txt(s, D.plan.band, { x: MX + 3.0, y: 5.75, w: CW - 3.35, h: 1.0, fontSize: 14, color: WHITE, valign: "middle" });
  }

  // ---------- 12-13. Stage details ----------
  const detail = (title, idxs) => {
    const s = content(title);
    const w = (CW - 0.3) / 2;
    idxs.forEach((si, k) => {
      const st = D.stages[si], x = MX + k * (w + 0.3), y = 1.5, h = 5.25;
      card(s, x, y, w, h);
      badge(s, x + 0.3, y + 0.25, 0.75, si + 1, STAGE[si], 22);
      txt(s, st.name, { x: x + 1.25, y: y + 0.25, w: w - 1.5, h: 0.42, fontSize: 20, bold: true, color: NAVY, valign: "middle" });
      txt(s, st.tag, { x: x + 1.25, y: y + 0.68, w: w - 1.5, h: 0.35, fontSize: 12, color: MUTED, valign: "middle" });
      const rows = [[D.labels.who, st.who, 0.85], [D.labels.what, st.what, 1.85], [D.labels.out, st.out, 0.85]];
      let yy = y + 1.25;
      rows.forEach((r, ri) => {
        txt(s, r[0], { x: x + 0.3, y: yy, w: 1.2, h: 0.3, fontSize: 12, bold: true, color: STAGE[si] === AMBER ? ORANGE : STAGE[si] });
        if (ri === 1) bullets(s, r[1], { x: x + 1.55, y: yy, w: w - 1.85, h: r[2], fontSize: 14 });
        else txt(s, r[1], { x: x + 1.55, y: yy, w: w - 1.85, h: r[2], fontSize: 14 });
        yy += r[2] + 0.2;
      });
    });
    return s;
  };
  detail(D.detail.t1, [0, 1]);
  detail(D.detail.t2, [2, 3]);

  // ---------- 14. Milestones ----------
  {
    const s = content(D.ms.title);
    txt(s, D.ms.lead, { x: MX, y: 1.3, w: CW, h: 0.35, fontSize: 12, color: MUTED });
    const w = (CW - 0.6) / 4;
    D.stages.forEach((st, i) => {
      const x = MX + i * (w + 0.2);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.8, w, h: 0.95, rectRadius: 0.12, fill: { color: STAGE[i] }, line: { type: "none" }, objectName: "Stage header" });
      txt(s, T(D.labels.stage) + " " + (i + 1), { x: x + 0.2, y: 1.88, w: w - 0.4, h: 0.3, fontSize: 11, bold: true, color: i === 2 ? INK : WHITE, valign: "middle" });
      txt(s, st.name, { x: x + 0.2, y: 2.18, w: w - 0.4, h: 0.48, fontSize: 20, bold: true, color: i === 2 ? INK : WHITE, valign: "middle" });
      D.ms.items[i].forEach((m, k) => {
        const y = 2.95 + k * 1.93, n = i * 2 + k + 1;
        card(s, x, y, w, 1.78);
        txt(s, "M" + n, { x: x + 0.2, y: y + 0.15, w: 1.0, h: 0.45, fontSize: 20, bold: true, color: STAGE[i] === AMBER ? ORANGE : STAGE[i] });
        txt(s, m, { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: 1.0, fontSize: 14 });
      });
    });
  }

  // ---------- 15. Community blueprint ----------
  {
    const s = content(D.bp.title);
    txt(s, D.bp.lead, { x: MX, y: 1.3, w: CW, h: 0.35, fontSize: 12, color: MUTED });
    const w = (CW - 0.4) / 3, h = 1.42;
    D.bp.groups.forEach((g, gi) => {
      const x = MX + gi * (w + 0.2);
      txt(s, g, { x, y: 1.8, w, h: 0.35, fontSize: 14, bold: true, color: [GREEN, BLUE, ORANGE][gi] });
    });
    D.bp.steps.forEach((st, i) => {
      const gi = Math.floor(i / 3), k = i % 3;
      const x = MX + gi * (w + 0.2), y = 2.2 + k * (h + 0.12);
      card(s, x, y, w, h);
      badge(s, x + 0.2, y + 0.2, 0.55, i + 1, [GREEN, BLUE, ORANGE][gi], 15);
      txt(s, st[0], { x: x + 0.95, y: y + 0.15, w: w - 1.15, h: 0.6, fontSize: 15, bold: true, color: NAVY, valign: "middle" });
      txt(s, st[1], { x: x + 0.95, y: y + 0.78, w: w - 1.15, h: 0.58, fontSize: 13 });
    });
  }

  // ---------- 16. Partnership ----------
  {
    const s = content(D.pt.title);
    const w = (CW - 0.4) / 3, h = 3.55;
    D.pt.cols.forEach((c, i) => {
      const x = MX + i * (w + 0.2), y = 1.5;
      card(s, x, y, w, h);
      txt(s, c[0], { x: x + 0.3, y: y + 0.22, w: w - 0.6, h: 0.3, fontSize: 11, bold: true, color: [GREEN, BLUE, ORANGE][i], charSpacing: 2 });
      txt(s, c[1], { x: x + 0.3, y: y + 0.55, w: w - 0.6, h: 0.65, fontSize: 16, bold: true, color: NAVY });
      bullets(s, c[2], { x: x + 0.3, y: y + 1.3, w: w - 0.6, h: h - 1.45, fontSize: 14 });
    });
    card(s, MX, 5.25, CW, 1.5, NAVY, "MOU band");
    txt(s, "MOU", { x: MX + 0.35, y: 5.25, w: 1.5, h: 1.5, fontSize: 32, bold: true, color: AMBER, valign: "middle" });
    const mw = (CW - 2.2) / 4;
    D.pt.mou.forEach((m, i) => {
      const x = MX + 1.95 + i * mw;
      txt(s, String(i + 1), { x, y: 5.45, w: 0.3, h: 1.1, fontSize: 18, bold: true, color: AMBER });
      txt(s, m, { x: x + 0.32, y: 5.48, w: mw - 0.5, h: 1.1, fontSize: 14, color: WHITE });
    });
  }

  // ---------- 17. Closing ----------
  {
    const s = pres.addSlide({ masterName: "CLOSING", sectionTitle: section });
    s.addText(T(D.close.title), { placeholder: "title" });
    txt(s, D.verse, { x: MX, y: 2.95, w: 8.2, h: 1.3, fontSize: 18, italic: true, color: WHITE });
    txt(s, D.verseRef, { x: MX, y: 4.3, w: 8.2, h: 0.35, fontSize: 14, bold: true, color: AMBER });
    txt(s, D.close.nextLabel, { x: MX, y: 5.2, w: 8.2, h: 0.35, fontSize: 12, bold: true, color: AMBER, charSpacing: 2 });
    txt(s, D.close.next, { x: MX, y: 5.6, w: 8.2, h: 1.1, fontSize: 16, color: WHITE });
    s.addText([
      { text: "Re", options: { color: GREEN } }, { text: "New", options: { color: WHITE } }, { text: "Gen", options: { color: ORANGE } },
    ], { isTextBox: true, x: 9.2, y: 5.5, w: W - MX - 9.2, h: 0.8, fontSize: 40, bold: true, margin: 0, align: "right", valign: "middle" });
    txt(s, "MALAYSIA", { x: 9.2, y: 6.3, w: W - MX - 9.2, h: 0.4, fontSize: 14, bold: true, color: WHITE, align: "right", charSpacing: 6 });
  }

  const out = path.join(__dirname, L.file);
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("built", L.file);
}

(async () => {
  const only = process.argv[3];
  for (const lang of Object.keys(LANGS)) if (!only || only === lang) await build(lang);
})();
