import { getDatabase } from "@/lib/mongodb";
import { serializeTeacher } from "@/lib/server/mongo";
import { setSessionCookie, verifyPassword } from "@/lib/session";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return Response.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }

  const { email, password } = body;
  if (!email?.trim() || !password) {
    return Response.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }

  try {
    const db = await getDatabase("escola");
    const teacher = await db.collection("teachers").findOne({ email: email.trim().toLowerCase() });

    if (!teacher || !(await verifyPassword(password, teacher.passwordHash as string))) {
      return Response.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }

    const session = {
      email: teacher.email as string,
      name: teacher.name as string,
    };

    await setSessionCookie(session);

    return Response.json(serializeTeacher(teacher as Record<string, unknown>));
  } catch {
    return Response.json({ error: "Não foi possível entrar. Tente novamente." }, { status: 500 });
  }
}
