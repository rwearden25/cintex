import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "cintex_session";

function getSecret() {
  const raw = process.env.APP_SESSION_SECRET;
  if (!raw) throw new Error("APP_SESSION_SECRET is not set");
  return new TextEncoder().encode(raw);
}

export type SessionPayload = {
  sub: string; // userId
  role: "admin" | "tech";
  email: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const jar = await cookies(); // ✅ Next 15: cookies() is async
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function destroySession() {
  const jar = await cookies(); // ✅
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies(); // ✅
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as any;
  } catch {
    return null;
  }
}