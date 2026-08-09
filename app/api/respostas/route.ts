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

  if (
    !activityId ||
    !ObjectId.isValid(activityId) ||
    !answers?.length ||
    answers.length > 50 ||
    classIds.length > 30 ||
    classIds.some((id) => !ObjectId.isValid(id))
  ) {
    return Response.json({ error: "Informe as respostas da atividade." }, { status: 400 });
  }

  try {
    const db = await getDatabase("escola");

    const activity = await db.collection("activities").findOne({ _id: new ObjectId(activityId) });
    if (!activity) {
      return Response.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    const activityClassIds = new Set(
      ((activity.classIds as ObjectId[] | undefined) ?? []).map((id) => id.toHexString()),
    );
    const questions =
      ((activity.config as { questions?: { label?: unknown }[] } | undefined)?.questions ?? []);
    const allowedLabels = new Set(
      questions.flatMap((question) =>
        typeof question.label === "string" ? [question.label] : [],
      ),
    );
    const sanitizedAnswers = answers.map((answer) => ({
      question: typeof answer.question === "string" ? answer.question.trim() : "",
      answer: typeof answer.answer === "string" ? answer.answer.trim() : "",
    }));
    const totalAnswerLength = sanitizedAnswers.reduce(
      (total, answer) => total + answer.answer.length,
      0,
    );

    if (
      classIds.some((id) => !activityClassIds.has(id)) ||
      sanitizedAnswers.some(
        (answer) =>
          !allowedLabels.has(answer.question) ||
          answer.question.length > 300 ||
          answer.answer.length > 5000,
      ) ||
      totalAnswerLength > 25000
    ) {
      return Response.json(
        { error: "As respostas enviadas não correspondem a esta atividade." },
        { status: 400 },
      );
    }

    const document = {
      activityId: new ObjectId(activityId),
      classIds: classIds.map((id) => new ObjectId(id)),
      answers: sanitizedAnswers,
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
