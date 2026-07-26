import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_ALGORITHM = "HS256";

function getSecret() {
  const secret = process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET ou NEXTAUTH_SECRET não está definido.");
  }
  return new TextEncoder().encode(secret);
}

function isPublicApi(pathname: string, method: string) {
  if (pathname === "/api/login" && method === "POST") return true;
  if (pathname === "/api/classes" && method === "GET") return true;
  if (pathname === "/api/atividades" && method === "GET") return true;
  if (pathname.startsWith("/api/atividades/") && method === "GET") return true;
  if (pathname === "/api/respostas" && method === "POST") return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  // Alunos não precisam de autenticação.
  if (pathname === "/aluno" || pathname.startsWith("/atividade/")) {
    return NextResponse.next();
  }

  // APIs públicas (leitura de turmas/atividades e envio de respostas/login).
  if (pathname.startsWith("/api/") && isPublicApi(pathname, method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const secret = getSecret();
    await jwtVerify(token, secret, { algorithms: [JWT_ALGORITHM] });
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/professor/:path*", "/api/:path*"],
};
