"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true); 

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col transition-all duration-300">

        <AdminTopBar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className={`pt-16 p-6 transition-all duration-300 ${isOpen ? "ml-80" : "ml-20"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}