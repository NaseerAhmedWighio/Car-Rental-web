import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Homepage ko allow karo bina login ke
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Agar user login nahi hai, to signup page pr bhejo
  if (!userId) {
    if (pathname === "/signup" || pathname === "/signIn") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    if (!user.primaryEmailAddress) {
      return NextResponse.redirect(new URL("/signup", req.url));
    }

    const res = NextResponse.next();
    res.cookies.set("userId", userId, { path: "/", httpOnly: true });
    res.cookies.set("userEmail", user.primaryEmailAddress.emailAddress, { path: "/", httpOnly: true });

    return res;
  } catch (error) {
    console.error("Clerk Middleware Error:", error);
    return NextResponse.redirect(new URL("/signup", req.url));
  }
});

// Static files ko ignore karo
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
