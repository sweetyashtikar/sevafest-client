"use client";

import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* TopBar */}
      <AdminTopBar />

      {/* Main Content */}
      <main className="ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
}
