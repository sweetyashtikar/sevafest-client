"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import Footer from "@/components/footer/Footer";
import AuthHydrator from "@/components/AuthHydrator";

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
<<<<<<< HEAD
  const isDeliveryBoyPage = pathname.startsWith("/delivery-boy");

  if (isAdminPage || isVendorPage || isDeliveryBoyPage) {
=======
  const isDeliveryBoyPage = pathname.startsWith("/delivery");
  const isDesigner = pathname.startsWith("/designer");

  if (isAdminPage || isVendorPage || isDeliveryBoyPage || isDesigner) {
>>>>>>> 83ee919e76c7a582c04ebc4e7accb2b6b62fe26d
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
