// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth(); // Await for auth() to resolve
  
//   if (!userId && req.nextUrl.pathname !== "/login") {
//     // return RedirectToSignIn(`/login`);
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
//   return NextResponse.next();
// });

// export const config = {
//   matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
// };














// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { clerkClient } from "@clerk/clerk-sdk-node"; // Correct import

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   // Allow access to the login page without forcing a redirect loop
//   if (!userId) {
//     if (req.nextUrl.pathname === "/login") {
//       return NextResponse.next(); // Allow user to stay on login page
//     }
//     return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not authenticated
//   }

//   try {
//     // Fetch user details using ClerkClient instance
//     const user = await clerkClient.users.getUser(userId);

//     // If user has no email, redirect to login
//     if (!user.primaryEmailAddress) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // Set userId and email in cookies
//     const res = NextResponse.next();
//     res.cookies.set("userId", userId, { path: "/", httpOnly: true });
//     res.cookies.set("userEmail", user.primaryEmailAddress.emailAddress, { path: "/", httpOnly: true });

//     return res;
//   } catch (error) {
//     console.error("Clerk Middleware Error:", error);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// });

// export const config = {
//   matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
// };

















import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId) {
    if (req.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    if (!user.primaryEmailAddress) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const res = NextResponse.next();
    res.cookies.set("userId", userId, { path: "/", httpOnly: true });
    res.cookies.set("userEmail", user.primaryEmailAddress.emailAddress, { path: "/", httpOnly: true });

    return res;
  } catch (error) {
    console.error("Clerk Middleware Error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};