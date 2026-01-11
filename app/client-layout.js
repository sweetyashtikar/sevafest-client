"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import Footer from "@/components/footer/Footer";

import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Auth pages (no layout)
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // Admin pages
  const isAdminPage = pathname.startsWith("/admin");

  /* ================= ADMIN LAYOUT ================= */
  if (!isAuthPage && isAdminPage) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <AdminSidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col">
          <AdminTopBar />

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  }

  /* ================= USER / AUTH ================= */
  return (
    <>
      {/* USER WEBSITE */}
      {!isAuthPage && <TopBar />}

      {children}

      {/* USER FOOTER */}
      {!isAuthPage && <Footer />}
    </>
  );
}
