import { request } from "http";

const base = "http://localhost:3000";

function fetchJson(path, opts = {}) {
  const url = new URL(path, base);
  const body = opts.body ? JSON.stringify(opts.body) : undefined;
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (opts.cookie) headers.Cookie = opts.cookie;

  return new Promise((resolve, reject) => {
    const req = request(url, { method: opts.method || "GET", headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const setCookie = res.headers["set-cookie"];
        const cookie = setCookie ? setCookie.find((c) => c.startsWith("session=")) : undefined;
        resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null, cookie });
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const login = await fetchJson("/api/login", {
    method: "POST",
    body: { username: "marcia", password: "Meleka@2430" },
  });
  const cookie = login.cookie;
  console.log("login", login.status);

  const created = await fetchJson("/api/classes", {
    method: "POST",
    cookie,
    body: { name: "Turma Teste", year: 3 },
  });
  console.log("create class", created.status, created.body);

  const updated = await fetchJson(`/api/classes/${created.body._id}`, {
    method: "PUT",
    cookie,
    body: { name: "Turma Teste Editada", year: 3 },
  });
  console.log("update class", updated.status, updated.body);

  const deleted = await fetchJson(`/api/classes/${created.body._id}`, {
    method: "DELETE",
    cookie,
  });
  console.log("delete class", deleted.status);

  const activity = await fetchJson("/api/atividades", {
    method: "POST",
    cookie,
    body: {
      title: "Atividade Delete",
      description: "",
      type: "form",
      classIds: ["6a657f5760ddcbfecca268a3"],
      config: { questions: [{ label: "Pergunta", type: "text", options: [], correctAnswer: null }], settings: {} },
    },
  });
  console.log("create activity", activity.status, activity.body);

  const updAct = await fetchJson(`/api/atividades/${activity.body._id}`, {
    method: "PUT",
    cookie,
    body: {
      title: "Atividade Delete Editada",
      description: "",
      type: "form",
      classIds: ["6a657f5760ddcbfecca268a3"],
      config: { questions: [{ label: "Pergunta", type: "text", options: [], correctAnswer: null }], settings: {} },
    },
  });
  console.log("update activity", updAct.status, updAct.body);

  const delAct = await fetchJson(`/api/atividades/${activity.body._id}`, {
    method: "DELETE",
    cookie,
  });
  console.log("delete activity", delAct.status);
}

main().catch(console.error);
