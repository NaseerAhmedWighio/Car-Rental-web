import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Allow homepage without login
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Allow SSO callback and auth routes
  if (pathname === "/sso-callback" || pathname === "/signup" || pathname === "/signIn") {
    return NextResponse.next();
  }

  // Redirect to signup if not logged in
  if (!userId) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // User is authenticated - set cookies using auth data
  // Note: User details should be fetched client-side or in API routes, not in middleware
  const res = NextResponse.next();
  res.cookies.set("userId", userId, { path: "/", httpOnly: true });

  return res;
});

// Exclude static files, images, and API routes from middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
