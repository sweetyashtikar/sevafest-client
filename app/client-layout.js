"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import Footer from "@/components/footer/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // ===== AUTH PAGES (NO TOPBAR / FOOTER) =====
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // ===== ADMIN & VENDOR (THEIR OWN LAYOUTS) =====
  const isAdminPage = pathname.startsWith("/admin");
  const isVendorPage = pathname.startsWith("/vendor");

  // 👉 Admin & Vendor layouts already handle UI
  if (isAdminPage || isVendorPage) {
    return <>{children}</>;
  }

  // ===== USER + AUTH =====
  return (
    <>
      {!isAuthPage && <TopBar />}

      {children}

      {!isAuthPage && <Footer />}
    </>
  );
}
