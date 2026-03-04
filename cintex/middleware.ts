import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public pages
  if (pathname === "/" || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Public API routes (must be reachable before a session exists)
  if (pathname.startsWith("/api/health")) return NextResponse.next();
  if (pathname.startsWith("/api/auth/login")) return NextResponse.next();
  if (pathname.startsWith("/api/auth/logout")) return NextResponse.next();

  // Everything under /app requires auth
  if (pathname.startsWith("/app")) {
    const token = req.cookies.get("cintex_session")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Other API routes require auth (example: /api/ai/*)
  if (pathname.startsWith("/api")) {
    const token = req.cookies.get("cintex_session")?.value;
    if (!token) return new NextResponse("Unauthorized", { status: 401 });
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};