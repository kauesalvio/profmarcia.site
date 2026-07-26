import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/session";
import { serializeActivity } from "@/lib/server/mongo";
import type { ActivityInput } from "@/lib/types";

const INVALID_ACTIVITY = "Informe título, ao menos uma turma e ao menos uma pergunta.";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const db = await getDatabase("escola");
    const activity = await db.collection("activities").findOne({ _id: new ObjectId(id) });

    if (!activity) {
      return Response.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    return Response.json(serializeActivity(activity as Record<string, unknown>));
  } catch {
    return Response.json({ error: "Não foi possível carregar a atividade." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  let body: Partial<ActivityInput>;
  try {
    body = (await request.json()) as Partial<ActivityInput>;
  } catch {
    return Response.json({ error: INVALID_ACTIVITY }, { status: 400 });
  }

  const title = body.title?.trim();
  const classIds = body.classIds;
  const description = body.description?.trim() ?? "";
  const config = body.config ?? { questions: [], settings: {} };

  if (!title || !classIds?.length || !config.questions?.length) {
    return Response.json({ error: INVALID_ACTIVITY }, { status: 400 });
  }

  try {
    const db = await getDatabase("escola");
    const result = await db.collection("activities").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          classIds: classIds.map((id) => new ObjectId(id)),
          config,
          updatedAt: new Date(),
        },
        // Atividades antigas guardavam o tipo no nível da atividade.
        $unset: { type: "" },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return Response.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    return Response.json(serializeActivity(result as Record<string, unknown>));
  } catch {
    return Response.json({ error: "Não foi possível atualizar a atividade." }, { status: 500 });
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

    const result = await db.collection("activities").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return Response.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    await db.collection("responses").deleteMany({ activityId: new ObjectId(id) });

    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Não foi possível excluir a atividade." }, { status: 500 });
  }
}
