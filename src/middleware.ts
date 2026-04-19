// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getAuth } from "@clerk/nextjs/server";

// export async function middleware(request: NextRequest) {
//   const { userId } = await getAuth(request);
//   const pathname = request.nextUrl.pathname;

//   const publicPaths = ["/", "/signin", "/signup", "/sso-callback", "/api"];
//   const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith("/api/") || pathname.startsWith("/_") || pathname.startsWith("/details") || pathname.startsWith("/category") || pathname.startsWith("/rent") || pathname.startsWith("/cart"));

//   if (isPublicPath) {
//     return NextResponse.next();
//   }

//   const protectedPaths = ["/admin", "/billing", "/checkout", "/ship", "/tracking"];
//   const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

//   if (!userId && isProtectedPath) {
//     const signInUrl = new URL("/signin", request.url);
//     signInUrl.searchParams.set("redirect_url", pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//   ],
// };

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const pathname = request.nextUrl.pathname;

  // Static / internal files allow
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Public routes (login pages ko allow karna zaroori hai)
  const publicRoutes = ["/", "/signIn", "/signup"];
  const isPublic = publicRoutes.includes(pathname);

  // ❌ Not logged in → redirect to signin + save original URL
  if (!userId && !isPublic) {
    const signInUrl = new URL("/signIn", request.url);

    // 👇 yahan original path store ho raha hai
    signInUrl.searchParams.set("redirect_url", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // ✅ Logged-in → allow everything
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};