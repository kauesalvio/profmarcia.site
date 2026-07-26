import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/session";
import { serializeClass } from "@/lib/server/mongo";
import type { ClassInput } from "@/lib/types";

export async function GET() {
  try {
    const db = await getDatabase("escola");
    const classes = await db
      .collection("classes")
      .find()
      .sort({ year: 1, name: 1 })
      .toArray();
    return Response.json(classes.map((doc) => serializeClass(doc as Record<string, unknown>)));
  } catch {
    return Response.json({ error: "Não foi possível carregar as turmas." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: Partial<ClassInput>;
  try {
    body = (await request.json()) as Partial<ClassInput>;
  } catch {
    return Response.json({ error: "Informe nome e ano da turma." }, { status: 400 });
  }

  const name = body.name?.trim();
  const year = body.year ? Number(body.year) : 0;

  if (!name || !year || year < 1 || year > 9) {
    return Response.json({ error: "Informe nome e ano válidos da turma." }, { status: 400 });
  }

  try {
    const db = await getDatabase("escola");
    const existing = await db.collection("classes").findOne({ name });
    if (existing) {
      return Response.json({ error: "Já existe uma turma com esse nome." }, { status: 400 });
    }

    const inserted = await db.collection("classes").insertOne({
      name,
      year,
      createdAt: new Date(),
    });

    return Response.json(
      serializeClass({
        _id: inserted.insertedId,
        name,
        year,
        createdAt: new Date(),
      }),
      { status: 201 },
    );
  } catch {
    return Response.json({ error: "Não foi possível criar a turma." }, { status: 500 });
  }
}
