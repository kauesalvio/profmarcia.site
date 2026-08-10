import { getDatabase } from "@/lib/mongodb";
import { serializeTeacher } from "@/lib/server/mongo";
import { setSessionCookie, verifyPassword } from "@/lib/session";

export async function POST(request: Request) {
  let body: { username?: string; email?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; email?: string; password?: string };
  } catch {
    return Response.json({ error: "Informe usuário e senha." }, { status: 400 });
  }

  const identifier = (body.username ?? body.email)?.trim().toLowerCase();
  if (!identifier || !body.password) {
    return Response.json({ error: "Informe usuário e senha." }, { status: 400 });
  }

  try {
    const db = await getDatabase("escola");
    const teacher = await db.collection("teachers").findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!teacher || !(await verifyPassword(body.password, teacher.passwordHash as string))) {
      return Response.json({ error: "Usuário ou senha inválidos." }, { status: 401 });
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
