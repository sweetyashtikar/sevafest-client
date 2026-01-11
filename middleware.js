import { NextResponse } from "next/server";

/**
 * This function name MUST be `middleware`
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;

    // Not logged in
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // Not admin
    if (!["Admin", "vendor"].includes(role)) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  return NextResponse.next();
}

/**
 * Matcher is REQUIRED
 */
export const config = {
  matcher: ["/admin/:path*"],
};
