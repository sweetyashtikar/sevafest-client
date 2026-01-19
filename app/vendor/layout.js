"use client";

import VendorTopBar from "@/components/vendor/VendorsTopBar";
import VendorSidebar from "@/components/vendor/VendorsSidebar";

export default function VendorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <VendorSidebar />

      {/* TopBar */}
      <VendorTopBar />

      {/* Content */}
      <main className="ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
}
