import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicPaths = ["/", "/signIn", "/signup", "/sso-callback", "/category", "/details"];

  const isPublic = publicPaths.some(path => pathname === path || pathname.startsWith("/details/") || pathname.startsWith("/api/") || pathname.startsWith("/_"));

  if (isPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};