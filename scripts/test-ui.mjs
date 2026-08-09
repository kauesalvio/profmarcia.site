import assert from "node:assert/strict";
import puppeteer from "puppeteer";

try {
  process.loadEnvFile?.(".env.local");
} catch {
  // O teste também funciona com variáveis fornecidas diretamente pelo ambiente.
}

const base = process.env.BASE_URL || "http://localhost:3000";
const teacherEmail = process.env.TEACHER_EMAIL || "professora@escola.com";
const teacherPassword = process.env.TEACHER_PASSWORD || "senha123";
const title = `Experiência E2E ${Date.now()}`;
const kahootUrl = process.env.TEST_KAHOOT_URL ?? "https://kahoot.it/challenge/123456";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
let activityId;

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function clickButton(text) {
  const clicked = await page.evaluate((label) => {
    const button = [...document.querySelectorAll("button")].find(
      (item) => item.textContent?.trim() === label,
    );
    button?.click();
    return !!button;
  }, text);
  assert.equal(clicked, true, `Botão não encontrado: ${text}`);
}

async function configurePuzzle(index, type, label, words) {
  await clickButton("Adicionar pergunta");
  await page.select(`#question-type-${index}`, type);
  await page.type(`#question-label-${index}`, label);
  await page.type(`#word-${index}-0`, words[0]);
  const added = await page.$eval(`#word-${index}-0`, (input) => {
    const button = [...(input.closest("fieldset")?.querySelectorAll("button") ?? [])].find(
      (item) => item.textContent?.trim() === "Adicionar palavra",
    );
    button?.click();
    return !!button;
  });
  assert.equal(added, true, `Não foi possível adicionar a segunda palavra da pergunta ${index + 1}.`);
  await page.type(`#word-${index}-1`, words[1]);
  if (type === "wordsearch") {
    await page.click(`#grid-size-${index}`, { clickCount: 3 });
    await page.type(`#grid-size-${index}`, "20");
  }
}

async function chooseImageAlternative(questionIndex, optionIndex, resultIndex) {
  const pickerId = `${questionIndex}-option-${optionIndex}`;
  await page.click(`[aria-controls="image-picker-${pickerId}"]`);
  await page.type(`#image-query-${pickerId}`, "animais");
  const searched = await page.$eval(`#image-picker-${pickerId}`, (picker) => {
    const button = [...picker.querySelectorAll("button")].find(
      (item) => item.textContent?.trim() === "Buscar",
    );
    button?.click();
    return !!button;
  });
  assert.equal(searched, true, `Busca da alternativa ${optionIndex + 1} não abriu.`);
  const selector = `#image-picker-${pickerId} [aria-label="Resultados da busca"] button`;
  await page.waitForSelector(selector, { timeout: 15000 });
  const results = await page.$$(selector);
  assert.ok(results[resultIndex], `Imagem ${resultIndex + 1} não encontrada na busca.`);
  await results[resultIndex].click();
}

async function configureImageQuiz(index) {
  await clickButton("Adicionar pergunta");
  await page.select(`#question-type-${index}`, "image-quiz");
  await page.type(`#question-label-${index}`, "Qual imagem mostra um animal?");
  await chooseImageAlternative(index, 0, 0);
  await chooseImageAlternative(index, 1, 1);
  await page.click(`input[type="radio"][name="correct-image-${index}"]`);
}

try {
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: "networkidle0" });
  await page.type("#email", teacherEmail);
  await page.type("#password", teacherPassword);
  const loginRequest = page.waitForResponse((response) => response.url().endsWith("/api/login"));
  await page.click('button[type="submit"]');
  const loginResponse = await loginRequest;
  assert.equal(
    loginResponse.status(),
    200,
    `Login de teste falhou (${loginResponse.status()}): ${await loginResponse.text()}`,
  );
  await page.waitForFunction(() => window.location.pathname === "/professor");
  assert.match(page.url(), /\/professor/);

  const newActivityResponse = await page.goto(`${base}/professor/atividades/nova`, {
    waitUntil: "networkidle0",
  });
  assert.equal(
    newActivityResponse?.status(),
    200,
    `A página de nova atividade respondeu ${newActivityResponse?.status()}.`,
  );
  assert.equal(page.url(), `${base}/professor/atividades/nova`);
  await clickButton("Próxima etapa");
  assert.match(
    await page.$eval('[role="alert"]', (alert) => alert.textContent ?? ""),
    /título da atividade/i,
  );
  await page.type("#title", title);
  await page.type("#description", "Teste completo com imagem, jogos grandes e Kahoot.");
  await clickButton("Próxima etapa");

  await page.waitForSelector('input[type="checkbox"]');
  await clickButton("Próxima etapa");
  assert.match(
    await page.$eval('[role="alert"]', (alert) => alert.textContent ?? ""),
    /ano\/turma/i,
  );
  await page.click('input[type="checkbox"]');
  await clickButton("Próxima etapa");

  await page.type("#question-label-0", "Qual equipamento usamos para digitar?");
  await clickButton("Próxima etapa");
  assert.ok(await page.$("#kahoot-url"), "A etapa do Kahoot não abriu após configurar a pergunta.");
  await clickButton("Voltar");
  const optionInputs = await page.$$('input[placeholder^="Alternativa"]');
  assert.equal(optionInputs.length >= 2, true);
  await optionInputs[0].type("Monitor");
  await optionInputs[1].type("Teclado");
  await page.evaluate(() => document.querySelectorAll('input[type="radio"][name="correct-0"]')[1]?.click());

  await clickButton("Buscar imagem");
  await page.type("#image-query-0", "computador educação");
  await clickButton("Buscar");
  await page.waitForSelector('[aria-label="Resultados da busca"] button', { timeout: 15000 });
  await page.click('[aria-label="Resultados da busca"] button');
  await clickButton("Fechar busca");
  assert.equal(await page.$("#image-query-0"), null);

  await configurePuzzle(1, "wordsearch", "Encontre palavras de informática", ["COMPUTADOR", "TECLADO"]);
  await configurePuzzle(2, "crossword", "Complete a cruzadinha", ["MOUSE", "MONITOR"]);
  await configureImageQuiz(3);
  await clickButton("Próxima etapa");

  const kahootFieldIsVisible = await page.$eval("#kahoot-url", (input) => {
    const bounds = input.getBoundingClientRect();
    return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
  });
  assert.equal(
    kahootFieldIsVisible,
    true,
    "A etapa do Kahoot abriu fora da área visível, parecendo que o formulário fechou.",
  );

  await page.type("#kahoot-url", kahootUrl);
  await clickButton("Salvar atividade");
  await page.waitForFunction(() => window.location.pathname === "/professor/atividades");
  assert.match(page.url(), /\/professor\/atividades$/);

  activityId = await page.evaluate(async (activityTitle) => {
    const response = await fetch("/api/atividades");
    const activities = await response.json();
    return activities.find((activity) => activity.title === activityTitle)?._id;
  }, title);
  assert.ok(activityId, "A atividade criada não apareceu na API.");

  const activityPayloads = await page.evaluate(async (id) => {
    const publicResponse = await fetch(`/api/atividades/${id}`);
    const protectedResponse = await fetch(`/api/atividades/${id}?includeAnswers=true`);
    return {
      public: { status: publicResponse.status, body: await publicResponse.json() },
      protected: { status: protectedResponse.status, body: await protectedResponse.json() },
    };
  }, activityId);
  assert.equal(activityPayloads.public.status, 200);
  assert.equal(
    activityPayloads.public.body.config.questions.some((question) => "correctAnswer" in question),
    false,
    "O GET público expôs o gabarito da atividade.",
  );
  assert.equal(activityPayloads.protected.status, 200);
  assert.equal(
    activityPayloads.protected.body.config.questions.some((question) => "correctAnswer" in question),
    true,
    "O GET autenticado da professora não retornou o gabarito.",
  );

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
  await page.goto(`${base}/atividade/${activityId}`, { waitUntil: "networkidle0" });
  await page.waitForSelector('input[type="radio"][name="question-0"]');

  const responsive = await page.evaluate(() => {
    const wordGrid = document.querySelector('[aria-label^="Grade do caça-palavra"]');
    const crosswordGrid = document.querySelector('[aria-label^="Grade da cruzadinha"]');
    const wordCell = wordGrid?.querySelector("button")?.getBoundingClientRect();
    const crosswordCell = crosswordGrid?.querySelector("input")?.getBoundingClientRect();
    const scrollHost = wordGrid?.parentElement;
    return {
      pageFits: document.documentElement.scrollWidth <= window.innerWidth,
      wordCell: wordCell ? [wordCell.width, wordCell.height] : null,
      crosswordCell: crosswordCell ? [crosswordCell.width, crosswordCell.height] : null,
      puzzleScrollsInside: !!scrollHost && scrollHost.scrollWidth > scrollHost.clientWidth,
      instructionsVisible: document.body.innerText.includes("Toque na primeira letra"),
    };
  });
  assert.equal(responsive.pageFits, true, "A página criou rolagem horizontal global no celular.");
  assert.deepEqual(responsive.wordCell, [44, 44]);
  assert.deepEqual(responsive.crosswordCell, [44, 44]);
  assert.equal(responsive.puzzleScrollsInside, true, "A grade grande não rolou dentro do próprio painel.");
  assert.equal(responsive.instructionsVisible, true);

  await page.evaluate(() => document.querySelector('input[type="radio"][name="question-0"]')?.click());
  await page.evaluate(() => document.querySelector('input[type="radio"][name="question-3"]')?.click());
  assert.equal(
    await page.$eval('input[type="radio"][name="question-3"]', (input) => input.checked),
    true,
    "A alternativa em imagem não foi selecionada.",
  );
  const submitRequest = page
    .waitForResponse(
      (response) => response.url().endsWith("/api/respostas") && response.request().method() === "POST",
      { timeout: 5000 },
    )
    .catch(() => null);
  await clickButton("Enviar resposta");
  const submitResponse = await submitRequest;
  assert.ok(
    submitResponse,
    `O envio não chegou à API: ${await page.$eval('[role="alert"]', (alert) => alert.textContent ?? "sem mensagem").catch(() => "sem mensagem")}`,
  );
  assert.equal(submitResponse.status(), 201, await submitResponse.text());
  await page.waitForFunction(() =>
    document.body.innerText.toLowerCase().includes("resposta enviada!"),
  );
  if (kahootUrl) {
    const finalLink = await page.$eval(`a[href="${kahootUrl}"]`, (link) => link.textContent?.trim());
    assert.equal(finalLink, kahootUrl);
  } else {
    assert.equal(await page.$('a[href*="kahoot"]'), null);
  }

  console.log("E2E aprovado: criação, quiz com imagens, puzzles, envio e Kahoot.");
} finally {
  if (activityId) {
    await page.evaluate(async (id) => {
      await fetch(`/api/atividades/${id}`, { method: "DELETE" });
    }, activityId).catch(() => undefined);
  }
  await sleep(100);
  await browser.close();
}
