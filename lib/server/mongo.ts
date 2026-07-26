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

export function serializeActivity(doc: Record<string, unknown>) {
  return {
    _id: toIdString(doc._id as string | ObjectId),
    title: doc.title as string,
    description: doc.description as string,
    type: doc.type as string,
    classIds: ((doc.classIds as (string | ObjectId)[] | undefined) ?? []).map(toIdString),
    config: doc.config as Record<string, unknown>,
    createdAt: (doc.createdAt as Date | undefined)?.toISOString(),
    updatedAt: (doc.updatedAt as Date | undefined)?.toISOString(),
  };
}

export function serializeResponse(doc: Record<string, unknown>) {
  return {
    _id: toIdString(doc._id as string | ObjectId),
    activityId: toIdString(doc.activityId as string | ObjectId),
    classIds: ((doc.classIds as (string | ObjectId)[] | undefined) ?? []).map(toIdString),
    studentName: doc.studentName as string,
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
