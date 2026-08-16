import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userRole = request.cookies.get("userRole")?.value;
  const token = request.cookies.get("token")?.value;

  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect based on role
  if (userRole === "peternak" && pathname.startsWith("/transfer-sapi")) {
    return NextResponse.redirect(new URL("/request-sapi", request.url));
  }

  if (userRole === "reseller" && pathname.startsWith("/request-sapi")) {
    return NextResponse.redirect(new URL("/transfer-sapi", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
