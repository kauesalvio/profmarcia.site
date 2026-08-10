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
function normalizeDecoration(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const image = raw as Record<string, unknown>;
  if (
    typeof image.id !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(image.id) ||
    typeof image.title !== "string" ||
    typeof image.license !== "string" ||
    typeof image.sourceUrl !== "string"
  ) {
    return undefined;
  }
  return {
    id: image.id,
    title: image.title,
    ...(typeof image.creator === "string" ? { creator: image.creator } : {}),
    license: image.license,
    sourceUrl: image.sourceUrl,
  };
}

function normalizeQuestion(raw: Record<string, unknown>) {
  const type = raw.type as string;
  const label = (raw.label as string) ?? "";
  const decoration = normalizeDecoration(raw.decoration);
  const base = { label, ...(decoration ? { decoration } : {}) };

  if (type === "single" || type === "multiple" || type === "quiz") {
    return {
      ...base,
      type: "quiz",
      options: (raw.options as string[] | undefined) ?? [],
      correctAnswer: (raw.correctAnswer as string | null | undefined) ?? null,
    };
  }

  if (type === "image-quiz") {
    return {
      ...base,
      type,
      options: ((raw.options as unknown[] | undefined) ?? [])
        .map(normalizeDecoration)
        .filter((option) => option !== undefined),
      correctAnswer: (raw.correctAnswer as string | null | undefined) ?? null,
    };
  }

  if (type === "crossword" || type === "wordsearch") {
    return {
      ...base,
      type,
      words: (raw.words as unknown[] | undefined) ?? [],
      ...(raw.gridSize ? { gridSize: raw.gridSize } : {}),
    };
  }

  return { ...base, type: type === "textarea" ? "textarea" : "text" };
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

export function serializePublicActivity(doc: Record<string, unknown>) {
  const activity = serializeActivity(doc);

  return {
    ...activity,
    config: {
      ...activity.config,
      questions: activity.config.questions.map((question) => {
        if (!("correctAnswer" in question)) return question;

        return Object.fromEntries(
          Object.entries(question).filter(([key]) => key !== "correctAnswer"),
        );
      }),
    },
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
    ...(typeof doc.username === "string" ? { username: doc.username } : {}),
    email: doc.email as string,
    name: doc.name as string,
    createdAt: (doc.createdAt as Date | undefined)?.toISOString(),
  };
}
