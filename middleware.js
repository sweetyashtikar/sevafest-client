import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  /* ================= AUTH PAGES ================= */
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token && role) {
      return redirectByRole(role, request);
    }
    return NextResponse.next();
  }

  /* ================= PROTECTED ROUTES ================= */
  const protectedRoutes = {
    "/admin": ["admin"],
    "/vendor": ["vendor"],
    "/manager": ["manager"],
    "/distributor": ["distributor"],
    "/sub_distributor": ["sub_distributor"],
    "/designer-portal": ["web designer", "webdesigner"],
    "/worker": ["worker"],
    "/courier": ["courier"],
  };

  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      // ❌ not logged in
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // ❌ role not allowed
      if (!protectedRoutes[route].includes(role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

/* ================= ROLE BASED REDIRECT ================= */
function redirectByRole(role, request) {
  switch (role) {
    case "admin":
      return NextResponse.redirect(new URL("/admin", request.url));
    case "vendor":
      return NextResponse.redirect(new URL("/vendor", request.url));
    case "manager":
      return NextResponse.redirect(new URL("/manager", request.url));
    case "distributor":
      return NextResponse.redirect(new URL("/distributor", request.url));
    case "sub_distributor":
      return NextResponse.redirect(new URL("/sub_distributor", request.url));
    case "web designer":
    case "webdesigner":
      return NextResponse.redirect(new URL("/designer-portal", request.url));
    case "worker":
      return NextResponse.redirect(new URL("/worker", request.url));
    case "courier":
      return NextResponse.redirect(new URL("/courier", request.url));
    default:
      return NextResponse.redirect(new URL("/", request.url));
  }
}

/* ================= MATCHER ================= */
export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/manager/:path*",
    "/distributor/:path*",
    "/sub_distributor/:path*",
    "/designer-portal/:path*",
    "/worker/:path*",
    "/courier/:path*",
  ],
};
