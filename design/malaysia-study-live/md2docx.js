// 마크다운 구성안 -> Word(.docx) 변환기
// 지원: 제목(#~####), 표, 인용, 코드블록, 목록/체크리스트, 순서목록,
//       수평선, 인라인(굵게/기울임/코드/링크)
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  ExternalHyperlink, LevelFormat, Footer, PageNumber, convertInchesToTwip,
} = require('docx');

const BODY_FONT = '맑은 고딕';
const MONO_FONT = '굴림체';
const INK = '1D2320';
const MUTED = '6B6156';
const ACCENT = '9C2B24';
const RULE = 'D9D2C6';
const HEADBG = 'F0EADF';

const PAGE_W = 11906, MARGIN = 1134;
const CONTENT_W = PAGE_W - MARGIN * 2;

// 한글은 2폭으로 계산해 열 너비를 배분한다
const vwidth = (s) => [...s].reduce((n, c) => n + (c.charCodeAt(0) > 0x2e7f ? 2 : 1), 0);

function inline(text, opts = {}) {
  const base = { font: BODY_FONT, size: opts.size || 20, color: opts.color || INK, bold: !!opts.bold };
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;
  let last = 0, m;
  const push = (t, extra = {}) => { if (t) runs.push(new TextRun({ ...base, ...extra, text: t })); };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith('`')) push(tok.slice(1, -1), { font: MONO_FONT, size: base.size - 2, color: ACCENT });
    else if (tok.startsWith('[')) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      runs.push(new ExternalHyperlink({
        link: mm[2],
        children: [new TextRun({ ...base, text: mm[1], color: '1155CC', underline: {} })],
      }));
    } else push(tok.slice(1, -1), { italics: true });
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return runs.length ? runs : [new TextRun({ ...base, text: '' })];
}

const para = (text, o = {}) => new Paragraph({
  children: inline(text, o),
  spacing: { before: o.before ?? 60, after: o.after ?? 60, line: o.line ?? 288 },
  alignment: o.alignment,
  indent: o.indent,
  border: o.border,
  shading: o.shading,
});

const heading = (text, level) => new Paragraph({
  children: inline(text.replace(/^#+\s*/, ''), {
    size: [32, 26, 22, 20][level - 1],
    bold: true,
    color: level <= 2 ? INK : ACCENT,
  }),
  heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][level - 1],
  spacing: { before: level === 1 ? 0 : [360, 320, 240, 180][level - 1], after: [180, 140, 100, 80][level - 1] },
  border: level <= 2 ? { bottom: { style: BorderStyle.SINGLE, size: level === 1 ? 12 : 6, color: level === 1 ? ACCENT : RULE, space: 6 } } : undefined,
});

const hr = () => new Paragraph({
  children: [new TextRun({ text: '', size: 2 })],
  spacing: { before: 200, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 1 } },
});

function codeBlock(lines) {
  return lines.map((l, i) => new Paragraph({
    children: [new TextRun({ text: l || ' ', font: MONO_FONT, size: 17, color: INK })],
    spacing: { before: i === 0 ? 120 : 0, after: i === lines.length - 1 ? 120 : 0, line: 240 },
    indent: { left: 240 },
    shading: { type: ShadingType.CLEAR, fill: 'F5F2EC', color: 'auto' },
  }));
}

function quoteBlock(lines) {
  return lines.map((l, i) => {
    const bullet = /^[-*]\s+/.test(l);
    const num = /^\d+\.\s+/.exec(l);
    const isHead = /^\*\*/.test(l) || /^#{1,6}\s/.test(l);
    const body = l.replace(/^#{1,6}\s*/, '').replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
    return new Paragraph({
      children: inline((bullet ? '· ' : num ? num[0] : '') + body, { size: 19, color: isHead ? INK : MUTED, bold: isHead }),
      spacing: { before: i === 0 ? 140 : 40, after: i === lines.length - 1 ? 140 : 40, line: 276 },
      indent: { left: 340, hanging: bullet || num ? 0 : 0 },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 10 } },
    });
  });
}

function buildTable(rows) {
  const cells = rows.map((r) => r.slice(1, -1).split('|').map((c) => c.trim()));
  const header = cells[0];
  const body = cells.slice(2);
  const n = header.length;
  const weights = new Array(n).fill(1);
  for (let c = 0; c < n; c++) {
    let mx = vwidth(header[c]);
    for (const r of body) mx = Math.max(mx, Math.min(vwidth(r[c] || ''), 60));
    weights[c] = Math.max(mx, 6);
  }
  const total = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.max(900, Math.round((w / total) * CONTENT_W)));
  const drift = CONTENT_W - widths.reduce((a, b) => a + b, 0);
  widths[widths.indexOf(Math.max(...widths))] += drift;

  const mk = (txt, c, isHead) => new TableCell({
    width: { size: widths[c], type: WidthType.DXA },
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    shading: isHead ? { type: ShadingType.CLEAR, fill: HEADBG, color: 'auto' } : undefined,
    children: [new Paragraph({
      children: inline(txt, { size: 18, bold: isHead, color: isHead ? INK : INK }),
      spacing: { before: 0, after: 0, line: 264 },
    })],
  });

  return new Table({
    columnWidths: widths,
    width: { size: CONTENT_W, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      left: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      right: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: RULE },
    },
    rows: [
      new TableRow({ tableHeader: true, children: header.map((t, c) => mk(t, c, true)) }),
      ...body.map((r) => new TableRow({ children: header.map((_, c) => mk(r[c] || '', c, false)) })),
    ],
  });
}

function convert(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      out.push(...codeBlock(buf));
      continue;
    }
    if (/^\s*$/.test(line)) { i++; continue; }
    if (/^(---+|\*\*\*+)\s*$/.test(line)) { out.push(hr()); i++; continue; }

    const h = /^(#{1,4})\s+/.exec(line);
    if (h) { out.push(heading(line, h[1].length)); i++; continue; }

    if (line.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(...quoteBlock(buf.filter((l) => l.trim() !== '')));
      continue;
    }

    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const buf = [];
      while (i < lines.length && /^\|/.test(lines[i])) buf.push(lines[i++].trim());
      out.push(buildTable(buf));
      out.push(new Paragraph({ children: [new TextRun({ text: '', size: 8 })], spacing: { after: 120 } }));
      continue;
    }

    const chk = /^-\s+\[( |x|X)\]\s+(.*)$/.exec(line);
    if (chk) {
      out.push(new Paragraph({
        children: [new TextRun({ text: (chk[1] === ' ' ? '☐' : '☑') + '  ', font: BODY_FONT, size: 20 }), ...inline(chk[2])],
        spacing: { before: 40, after: 40, line: 276 },
        indent: { left: 340, hanging: 260 },
      }));
      i++; continue;
    }

    const ul = /^[-*]\s+(.*)$/.exec(line);
    if (ul) {
      out.push(new Paragraph({
        children: inline(ul[1]),
        numbering: { reference: 'md-bullet', level: 0 },
        spacing: { before: 40, after: 40, line: 276 },
      }));
      i++; continue;
    }

    const ol = /^(\d+)\.\s+(.*)$/.exec(line);
    if (ol) {
      out.push(new Paragraph({
        children: [new TextRun({ text: ol[1] + '. ', font: BODY_FONT, size: 20, bold: true, color: ACCENT }), ...inline(ol[2])],
        spacing: { before: 40, after: 40, line: 276 },
        indent: { left: 340, hanging: 340 },
      }));
      i++; continue;
    }

    out.push(para(line));
    i++;
  }
  return out;
}

function build(mdPath, outPath, footerText) {
  const md = fs.readFileSync(mdPath, 'utf8');
  const doc = new Document({
    styles: {
      default: { document: { run: { font: BODY_FONT, size: 20, color: INK } } },
      paragraphStyles: [{
        id: 'Normal', name: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: BODY_FONT, size: 20, color: INK },
        paragraph: { spacing: { line: 288 } },
      }],
    },
    numbering: {
      config: [{
        reference: 'md-bullet',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 340, hanging: 260 } }, run: { color: ACCENT } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1134, bottom: 1134, left: MARGIN, right: MARGIN } },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120 },
            children: [
              new TextRun({ text: footerText + '   ·   ', font: BODY_FONT, size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], font: BODY_FONT, size: 16, color: MUTED }),
            ],
          })],
        }),
      },
      children: convert(md),
    }],
  });
  return Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(outPath, buf); console.log('wrote', path.basename(outPath), buf.length, 'bytes'); });
}

const [, , mdPath, outPath, footer] = process.argv;
build(mdPath, outPath, footer || '말레이시아 유학 라이브').catch((e) => { console.error(e); process.exit(1); });
