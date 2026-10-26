// Ensaio da demonstração produzida pelo motor conectado.
const { chromium } = require('playwright');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const file = resolve(__dirname, '../exportacoes/projetos/demonstracao-slides/revealjs/index.html');
    await page.goto(pathToFileURL(file).href);
    await page.waitForFunction(() => window.Reveal && Reveal.isReady());
    const count = await page.evaluate(() => Reveal.getTotalSlides());
    if (count !== 9) throw new Error(`Esperados 9 slides, recebidos ${count}`);
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => Reveal.getIndices().h === 1);
    for (let i = 0; i < count; i++) {
      await page.evaluate(index => Reveal.slide(index), i);
      await page.waitForFunction(index => Reveal.getIndices().h === index, i);
      const overflow = await page.evaluate(() => {
        const slide = Reveal.getCurrentSlide();
        const box = slide.getBoundingClientRect();
        return Array.from(slide.querySelectorAll('h1,h2,p,table')).some(el => {
          const r = el.getBoundingClientRect();
          return r.right > box.right + 3 || r.bottom > box.bottom + 3;
        });
      });
      if (overflow) throw new Error(`Conteúdo fora do slide ${i + 1}`);
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('SLIDES_OK: nove telas, navegação por teclado e conteúdo dentro dos limites.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
