import { ObjectId } from "mongodb";

export function toObjectId(value: string | ObjectId): ObjectId {
  return typeof value === "string" ? new ObjectId(value) : value;
}

export function toIdString(value: string | ObjectId): string {
  return typeof value === "string" ? value : value.toHexString();
}

export function serializeClass(doc: Record<string, unknown>) {
  return {
    _id: toIdString(doc._id as string | ObjectId),
    name: doc.name as string,
    year: doc.year as number,
    createdAt: (doc.createdAt as Date | undefined)?.toISOString(),
  };
}

/**
 * Converte perguntas gravadas antes da mudança de schema: o tipo ficava na
 * atividade e as alternativas usavam `single`/`multiple` (specs/tech-spec.md).
 */
function normalizeQuestion(raw: Record<string, unknown>) {
  const type = raw.type as string;
  const label = (raw.label as string) ?? "";

  if (type === "single" || type === "multiple" || type === "quiz") {
    return {
      label,
      type: "quiz",
      options: (raw.options as string[] | undefined) ?? [],
      correctAnswer: (raw.correctAnswer as string | null | undefined) ?? null,
    };
  }

  if (type === "crossword" || type === "wordsearch") {
    return {
      label,
      type,
      words: (raw.words as unknown[] | undefined) ?? [],
      ...(raw.gridSize ? { gridSize: raw.gridSize } : {}),
    };
  }

  return { label, type: type === "textarea" ? "textarea" : "text" };
}

function normalizeConfig(raw: unknown) {
  const config = (raw as Record<string, unknown> | undefined) ?? {};
  const questions = (config.questions as Record<string, unknown>[] | undefined) ?? [];
  return {
    questions: questions.map(normalizeQuestion),
    settings: (config.settings as Record<string, unknown>) ?? {},
  };
}

export function serializeActivity(doc: Record<string, unknown>) {
  return {
    _id: toIdString(doc._id as string | ObjectId),
    title: doc.title as string,
    description: doc.description as string,
    classIds: ((doc.classIds as (string | ObjectId)[] | undefined) ?? []).map(toIdString),
    config: normalizeConfig(doc.config),
    createdAt: (doc.createdAt as Date | undefined)?.toISOString(),
    updatedAt: (doc.updatedAt as Date | undefined)?.toISOString(),
  };
}

export function serializeResponse(doc: Record<string, unknown>) {
  return {
    _id: toIdString(doc._id as string | ObjectId),
    activityId: toIdString(doc.activityId as string | ObjectId),
    classIds: ((doc.classIds as (string | ObjectId)[] | undefined) ?? []).map(toIdString),
    answers: doc.answers as unknown[],
    submittedAt: (doc.submittedAt as Date | undefined)?.toISOString(),
  };
}

export function serializeTeacher(doc: Record<string, unknown>) {
  return {
    _id: toIdString(doc._id as string | ObjectId),
    email: doc.email as string,
    name: doc.name as string,
    createdAt: (doc.createdAt as Date | undefined)?.toISOString(),
  };
}
