"use client";

import VendorTopBar from "@/components/vendor/VendorsTopBar";
import Sidebar from "@/components/designer/SideBar";

export default function DesignerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <VendorTopBar />
      <main className="ml-64 pt-16 p-6">{children}</main>
    </div>
  );
}
