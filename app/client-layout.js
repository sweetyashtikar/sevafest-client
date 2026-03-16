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
  const isDeliveryBoyPage = pathname.startsWith("/delivery");
  const isDesigner = pathname.startsWith("/designer");
  const isSeller = pathname.startsWith("/seller");

  if (
    isAdminPage ||
    isVendorPage ||
    isDeliveryBoyPage ||
    isDesigner ||
    isSeller
  ) {
    return <>{children}</>;
  }

  return (
    <>
      {!isAuthPage && <TopBar />}

      {children}

      {!isAuthPage && <Footer />}
    </>
  );
}
// /////////////////