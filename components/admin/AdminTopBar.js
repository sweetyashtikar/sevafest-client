"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import {
  ShieldCheck,
  LogOut,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function AdminTopBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="px-6 h-full flex items-center justify-between">

        {/* LEFT */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          <ShieldCheck className="text-orange-500" />
          <h1 className="text-lg font-semibold text-gray-800">
            Admin Panel
          </h1>
        </div>

        {/* RIGHT PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <UserCircle size={28} />
            <ChevronDown size={16} />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              
              {/* INFO */}
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">
                  admin@example.com
                </p>
              </div>

              {/* ACTIONS */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
