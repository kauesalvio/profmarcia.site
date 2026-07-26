import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/session";
import { serializeResponse } from "@/lib/server/mongo";
import type { ResponseInput } from "@/lib/types";

export async function GET(request: Request) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const activityId = searchParams.get("activityId");

  try {
    const db = await getDatabase("escola");
    const filter = activityId ? { activityId: new ObjectId(activityId) } : {};
    const responses = await db
      .collection("responses")
      .find(filter)
      .sort({ submittedAt: -1 })
      .toArray();
    return Response.json(responses.map((doc) => serializeResponse(doc as Record<string, unknown>)));
  } catch {
    return Response.json({ error: "Não foi possível carregar as respostas." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: Partial<ResponseInput>;
  try {
    body = (await request.json()) as Partial<ResponseInput>;
  } catch {
    return Response.json({ error: "Informe as respostas da atividade." }, { status: 400 });
  }

  const activityId = body.activityId?.trim();
  const answers = body.answers;
  const classIds = body.classIds ?? [];

  if (!activityId || !answers?.length) {
    return Response.json({ error: "Informe as respostas da atividade." }, { status: 400 });
  }

  try {
    const db = await getDatabase("escola");

    const activity = await db.collection("activities").findOne({ _id: new ObjectId(activityId) });
    if (!activity) {
      return Response.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    const document = {
      activityId: new ObjectId(activityId),
      classIds: classIds.map((id) => new ObjectId(id)),
      answers,
      submittedAt: new Date(),
    };
    const inserted = await db.collection("responses").insertOne(document);

    return Response.json(serializeResponse({ ...document, _id: inserted.insertedId }), {
      status: 201,
    });
  } catch {
    return Response.json({ error: "Não foi possível enviar a resposta." }, { status: 500 });
  }
}
