import type {
  Activity,
  ActivityInput,
  ActivityResponse,
  ClassInput,
  ResponseInput,
  SchoolClass,
} from "./types";

/**
 * Cliente HTTP do frontend. As rotas seguem o contrato de specs/backend/backend.md.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      credentials: "include",
      headers: init?.body
        ? { "Content-Type": "application/json", ...init?.headers }
        : init?.headers,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }

  if (!res.ok) {
    const message = await res
      .json()
      .then((body) => (body as { error?: string }).error)
      .catch(() => undefined);
    throw new ApiError(message ?? "Não foi possível completar a operação.", res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const classesApi = {
  list: () => request<SchoolClass[]>("/api/classes"),
  create: (data: ClassInput) =>
    request<SchoolClass>("/api/classes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  get: (id: string) => request<SchoolClass>(`/api/classes/${id}`),
  update: (id: string, data: ClassInput) =>
    request<SchoolClass>(`/api/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) => request<void>(`/api/classes/${id}`, { method: "DELETE" }),
};

export const activitiesApi = {
  list: (classId?: string, includeAnswers = false) => {
    const params = new URLSearchParams();
    if (classId) params.set("classId", classId);
    if (includeAnswers) params.set("includeAnswers", "true");
    const query = params.toString();
    return request<Activity[]>(`/api/atividades${query ? `?${query}` : ""}`);
  },
  create: (data: ActivityInput) =>
    request<Activity>("/api/atividades", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  get: (id: string, includeAnswers = false) =>
    request<Activity>(
      `/api/atividades/${id}${includeAnswers ? "?includeAnswers=true" : ""}`,
    ),
  update: (id: string, data: ActivityInput) =>
    request<Activity>(`/api/atividades/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) => request<void>(`/api/atividades/${id}`, { method: "DELETE" }),
};

export const responsesApi = {
  list: (activityId?: string) =>
    request<ActivityResponse[]>(
      activityId
        ? `/api/respostas?activityId=${encodeURIComponent(activityId)}`
        : "/api/respostas",
    ),
  create: (data: ResponseInput) =>
    request<ActivityResponse>("/api/respostas", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
