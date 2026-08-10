import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI ?? "mongodb://admin:admin123@localhost:27017/escola?authSource=admin";

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("escola");

    const teachers = db.collection("teachers");
    const classes = db.collection("classes");
    const activities = db.collection("activities");
    const responses = db.collection("responses");

    await teachers.createIndex({ email: 1 }, { unique: true });
    await teachers.createIndex(
      { username: 1 },
      { unique: true, partialFilterExpression: { username: { $type: "string" } } },
    );
    await classes.createIndex({ year: 1 });
    await classes.createIndex({ name: 1 }, { unique: true });
    await activities.createIndex({ classIds: 1 });
    await activities.createIndex({ createdAt: -1 });
    await responses.createIndex({ activityId: 1 });
    await responses.createIndex({ submittedAt: -1 });

    const username = process.env.TEACHER_USERNAME ?? "marcia";
    const email = process.env.TEACHER_EMAIL ?? "professora@escola.com";
    const password = process.env.TEACHER_PASSWORD ?? "Meleka@2430";
    const name = process.env.TEACHER_NAME ?? "Professora Márcia";
    const existing = await teachers.findOne({ $or: [{ username }, { email }] });
    if (!existing) {
      await teachers.insertOne({
        username,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        name,
        createdAt: new Date(),
      });
      console.log("Professora criada:", email);
    } else {
      await teachers.updateOne(
        { _id: existing._id },
        { $set: { username, email, passwordHash: await bcrypt.hash(password, 10), name } },
      );
      console.log("Professora atualizada:", username);
    }

    const classNames = [
      "1º Ano A",
      "2º Ano A",
      "3º Ano A",
      "4º Ano A",
      "5º Ano A",
      "6º Ano A",
      "7º Ano A",
      "8º Ano A",
      "9º Ano A",
    ];

    for (const [index, name] of classNames.entries()) {
      await classes.updateOne(
        { name },
        { $setOnInsert: { year: index + 1, createdAt: new Date() } },
        { upsert: true },
      );
    }
    console.log("Turmas criadas/atualizadas.");

    await activities.deleteMany({});
    await responses.deleteMany({});
    console.log("Atividades e respostas anteriores removidas (seed).");

    console.log("Seed concluído.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
