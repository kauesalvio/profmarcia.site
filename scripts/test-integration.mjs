import { request } from "http";

const base = "http://localhost:3000";

function fetchJson(path, opts = {}) {
  const url = new URL(path, base);
  const body = opts.body ? JSON.stringify(opts.body) : undefined;
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (opts.cookie) headers.Cookie = opts.cookie;

  return new Promise((resolve, reject) => {
    const req = request(
      url,
      { method: opts.method || "GET", headers },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const setCookie = res.headers["set-cookie"];
          const cookie = setCookie ? setCookie.find((c) => c.startsWith("session=")) : undefined;
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, body: parsed, cookie });
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  console.log("Login...");
  const login = await fetchJson("/api/login", {
    method: "POST",
    body: { email: "professora@escola.com", password: "senha123" },
  });
  console.log("status", login.status, login.body);
  const cookie = login.cookie;

  console.log("\nClasses...");
  const classes = await fetchJson("/api/classes", { cookie });
  const c4 = classes.body.find((c) => c.year === 4)._id;
  console.log("4o ano id:", c4);

  console.log("\nCriando atividade...");
  const activity = await fetchJson("/api/atividades", {
    method: "POST",
    cookie,
    body: {
      title: "Atividade Integração",
      description: "Teste",
      classIds: [c4],
      config: {
        questions: [
          { label: "2+2?", type: "quiz", options: ["3", "4", "5"], correctAnswer: "4" },
          { label: "O que você aprendeu?", type: "text" },
          {
            label: "Caça-palavras",
            type: "wordsearch",
            words: [{ word: "MOUSE" }, { word: "TECLADO", clue: "Serve para digitar" }],
            gridSize: 10,
          },
        ],
        settings: {},
      },
    },
  });
  console.log("status", activity.status, activity.body);

  console.log("\nAtividades do 4o ano (publico)...");
  const publicActivities = await fetchJson(`/api/atividades?classId=${c4}`);
  console.log("status", publicActivities.status, publicActivities.body);

  console.log("\nEnviando resposta...");
  const response = await fetchJson("/api/respostas", {
    method: "POST",
    body: {
      activityId: activity.body._id,
      classIds: [c4],
      answers: [
        { question: "2+2?", answer: "4" },
        { question: "O que você aprendeu?", answer: "Sobre o teclado" },
        { question: "Caça-palavras", answer: "MOUSE, TECLADO" },
      ],
    },
  });
  console.log("status", response.status, response.body);

  console.log("\nRespostas da professora...");
  const responses = await fetchJson(`/api/respostas?activityId=${activity.body._id}`, { cookie });
  console.log("status", responses.status, responses.body);

  console.log("\nTeste de protecao: GET /api/respostas sem cookie...");
  const unauthorized = await fetchJson(`/api/respostas?activityId=${activity.body._id}`);
  console.log("status", unauthorized.status, unauthorized.body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
