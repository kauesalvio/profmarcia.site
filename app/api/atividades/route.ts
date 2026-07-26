import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/session";
import { serializeActivity } from "@/lib/server/mongo";
import type { ActivityInput } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  try {
    const db = await getDatabase("escola");
    const filter = classId ? { classIds: { $in: [new ObjectId(classId)] } } : {};
    const activities = await db
      .collection("activities")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    return Response.json(activities.map((doc) => serializeActivity(doc as Record<string, unknown>)));
  } catch {
    return Response.json({ error: "Não foi possível carregar as atividades." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: Partial<ActivityInput>;
  try {
    body = (await request.json()) as Partial<ActivityInput>;
  } catch {
    return Response.json({ error: "Informe título, tipo e ao menos uma turma." }, { status: 400 });
  }

  const title = body.title?.trim();
  const type = body.type;
  const classIds = body.classIds;
  const description = body.description?.trim() ?? "";

  if (!title || !type || !classIds?.length) {
    return Response.json(
      { error: "Informe título, tipo e ao menos uma turma." },
      { status: 400 },
    );
  }

  try {
    const db = await getDatabase("escola");
    const inserted = await db.collection("activities").insertOne({
      title,
      description,
      type,
      classIds: classIds.map((id) => new ObjectId(id)),
      config: body.config ?? { questions: [], settings: {} },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json(
      serializeActivity({
        _id: inserted.insertedId,
        title,
        description,
        type,
        classIds: classIds.map((id) => new ObjectId(id)),
        config: body.config ?? { questions: [], settings: {} },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      { status: 201 },
    );
  } catch {
    return Response.json({ error: "Não foi possível criar a atividade." }, { status: 500 });
  }
}
