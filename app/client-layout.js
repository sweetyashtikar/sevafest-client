"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import Footer from "@/components/footer/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  return (
    <>
      {!hideLayout && <TopBar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
