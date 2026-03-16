"use client";

import TopBar from "@/components/seller/TopBar";
import Sidebar from "@/components/seller/SideBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <TopBar />
      <main className="ml-64 pt-16 p-6">{children}</main>
    </div>
  );
}
