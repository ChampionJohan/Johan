// index.html → PDF 변환 (Playwright). 실행: node build.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  await page.pdf({
    path: path.join(__dirname, 'IM말레이시아_입학안내문.pdf'),
    width: '1123px',
    height: '794px',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
})();
