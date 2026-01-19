import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  /* ================= AUTH PAGES ================= */
  // Logged in user should not access login/register
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    if (token && role) {
      if (role === "Admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (role === "vendor") {
        return NextResponse.redirect(new URL("/vendor", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /* ================= ADMIN ROUTES ================= */
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /* ================= VENDOR ROUTES ================= */
  if (pathname.startsWith("/vendor")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "vendor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */
export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/login",
    "/register",
  ],
};
