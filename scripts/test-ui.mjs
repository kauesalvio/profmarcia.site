import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
page.on('request', req => {
  if (req.url().includes('/api/')) console.log('REQUEST:', req.method(), req.url());
});
page.on('response', res => {
  if (res.url().includes('/api/')) console.log('RESPONSE:', res.status(), res.url());
});

try {
  await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
  await page.type('input#email', 'professora@escola.com');
  await page.type('input#password', 'senha123');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]'),
  ]);

  await page.goto('http://localhost:3000/professor/atividades/nova', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.type('input#title', 'Quiz Puppeteer');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => l.textContent.includes('4º Ano A'));
    if (label) {
      const checkbox = label.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) checkbox.click();
    }
  });

  // Preencher enunciado
  await page.type('input[id^="quiz-label-"]', 'Qual a capital do Brasil?');

  // Preencher alternativas
  const optionInputs = await page.$$('input[placeholder^="Alternativa"]');
  if (optionInputs.length >= 2) {
    await optionInputs[0].type('São Paulo');
    await optionInputs[1].type('Brasília');
  }
  await new Promise(r => setTimeout(r, 500));

  // Clicar no radio da segunda alternativa
  await page.evaluate(() => {
    const radios = document.querySelectorAll('input[type="radio"][name^="correct-"]');
    if (radios[1]) radios[1].click();
  });
  await new Promise(r => setTimeout(r, 500));

  console.log('Clicando no submit...');
  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();

  await new Promise(r => setTimeout(r, 5000));
  console.log('URL apos click:', page.url());
} catch (err) {
  console.error('Erro:', err.message);
  await page.screenshot({ path: 'erro.png' });
} finally {
  await browser.close();
}
