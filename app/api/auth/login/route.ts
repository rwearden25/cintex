import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email || "").toLowerCase().trim();
  const password = String(body?.password || "");

  if (!email || !password) return Response.json({ error: "Missing credentials" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.disabled) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  await createSession({ sub: user.id, role: user.role, email: user.email });
  return Response.json({ ok: true });
}
