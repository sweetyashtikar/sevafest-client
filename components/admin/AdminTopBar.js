"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminTopBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT: LOGO / TITLE */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          <ShieldCheck className="text-green-400" />
          <h1 className="text-lg font-bold tracking-wide">
            Admin Panel
          </h1>
        </div>

        {/* CENTER: NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-sm hover:text-green-400 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/admin/users")}
            className="flex items-center gap-2 text-sm hover:text-green-400 transition"
          >
            <Users size={18} />
            Users
          </button>
        </nav>

        {/* RIGHT: LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
