import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/session";
import { serializeClass } from "@/lib/server/mongo";
import type { ClassInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

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
    const existing = await db.collection("classes").findOne({
      name,
      _id: { $ne: new ObjectId(id) },
    });
    if (existing) {
      return Response.json({ error: "Já existe uma turma com esse nome." }, { status: 400 });
    }

    const result = await db.collection("classes").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, year } },
      { returnDocument: "after" },
    );

    if (!result) {
      return Response.json({ error: "Turma não encontrada." }, { status: 404 });
    }

    return Response.json(serializeClass(result as Record<string, unknown>));
  } catch {
    return Response.json({ error: "Não foi possível atualizar a turma." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const db = await getDatabase("escola");
    const result = await db.collection("classes").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Turma não encontrada." }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Não foi possível excluir a turma." }, { status: 500 });
  }
}
