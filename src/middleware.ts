  // @param {NextRequest} request - The incoming request object.
  // @returns {Promise<NextResponse>} - A promise that resolves to the appropriate NextResponse.

// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
import   { clerkMiddleware }  from '@clerk/nextjs/server'
// import { request } from "http";

// const isProtectedRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/details(.*)"])

// const publicRoutes = ["/"]


// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//     if (isProtectedRoute(req)) await auth.protect()
//   })





// export const middleware = async (request: NextRequest) => {
//     if (isProtectedRoute(request)) await auth.protect()
//     }
    // const cookiesStore = await cookies()
    // const isLoggedIn = cookiesStore.get("isLoggedIn")

//     if (isLoggedIn?.value === "0"){
//         return NextResponse.redirect(new URL('/sign-in', request.url))
//     }
//     else if (
//         isLoggedIn?.value === "1" && 
//         request.nextUrl.pathname==="/sign-in"
//     ){
//         return NextResponse.redirect(new URL('/', request.url))
//     }
//   }
// export const config = {
//     matcher: ["/", "/sign-in"],
// }

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|)).*)',
    // Always run for API routes
    // '/(api|trpc)(.*)',
  ],
}