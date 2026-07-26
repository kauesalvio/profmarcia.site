"use client";

import { ApiError } from "./api";
import { removeStored, useStoredValue, writeStored } from "./browserStore";

/**
 * Sessão da professora no lado do cliente.
 *
 * Enquanto o backend não existir, guardamos apenas os dados de exibição da
 * professora autenticada. A validação real acontece em `/api/login` e, quando o
 * NextAuth.js entrar (specs/backend/backend.md), este módulo deve ser trocado
 * por `useSession()` / `signIn()` / `signOut()`.
 */
const SESSION_KEY = "professor-session";

export interface TeacherSession {
  name: string;
  email: string;
}

/** `undefined` = ainda carregando; `null` = sem sessão. */
export function useTeacherSession(): TeacherSession | null | undefined {
  const raw = useStoredValue("session", SESSION_KEY);
  if (raw === undefined) return undefined;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TeacherSession;
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<TeacherSession> {
  let res: Response;
  try {
    res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }

  if (res.status === 401) throw new ApiError("E-mail ou senha inválidos.", 401);
  if (!res.ok) throw new ApiError("Não foi possível entrar. Tente novamente.", res.status);

  const body = (await res.json()) as Partial<TeacherSession>;
  const session: TeacherSession = {
    name: body.name ?? "Professora",
    email: body.email ?? email,
  };
  writeStored("session", SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signOut() {
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
  } catch {
    // Ignora erro de rede; limpa o estado local de qualquer forma.
  }
  removeStored("session", SESSION_KEY);
}
