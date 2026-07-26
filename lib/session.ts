import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";
const JWT_ALGORITHM = "HS256";

function getSecret() {
  const secret = process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET ou NEXTAUTH_SECRET não está definido.");
  }
  return new TextEncoder().encode(secret);
}

export interface TeacherSession {
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

export async function signToken(payload: TeacherSession): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TeacherSession> {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret, { algorithms: [JWT_ALGORITHM] });
  return payload as unknown as TeacherSession;
}

export async function setSessionCookie(session: TeacherSession): Promise<void> {
  const token = await signToken(session);
  const isProd = process.env.NODE_ENV === "production";
  const cookie = await cookies();
  cookie.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookie = await cookies();
  cookie.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<TeacherSession | null> {
  const cookie = await cookies();
  const token = cookie.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<TeacherSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Não autorizado.");
  }
  return session;
}
