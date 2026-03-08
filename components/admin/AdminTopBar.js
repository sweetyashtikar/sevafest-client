"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import {
  ShieldCheck,
  LogOut,
  UserCircle,
  ChevronDown,
  Menu,
  Clock,
  Wallet,
  Phone,
} from "lucide-react";
import { useState } from "react";

export default function AdminTopBar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  console.log("user", user);

  const handleLogout = () => {
    dispatch(logout());

    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";

    router.replace("/login");
  };

  const roleName = user?.role?.role;

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300
      ${isOpen ? "left-60" : "left-20"}`}
    >
      <div className="px-6 h-full flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          <ShieldCheck className="text-orange-500" />
          <h1 className="text-lg font-semibold text-gray-800">
            {roleName} Panel
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
          {open && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
              {/* USER HEADER - Gradient Background */}
              <div className="bg-gradient-to-br from-[#0F766E] to-[#134E4A] px-5 py-6 text-white relative">
                <div className="relative z-10">
                  <p className="text-base font-bold truncate">
                    {user?.username || "User Profile"}
                  </p>
                  <p className="text-xs opacity-90 truncate font-medium">
                    {user?.email || "No Email Provided"}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                      {user?.role || "user"}
                    </span>
                    {user?.status && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-emerald-400/20 text-emerald-300 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>
                {/* Decorative Circle */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
              </div>

              {/* USER DETAILS SECTION */}
              <div className="p-4 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Account Summary
                </p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                        <Phone size={14} />
                      </div>
                      <span className="text-xs font-medium">Mobile</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {user?.mobile || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                        <Wallet size={14} />
                      </div>
                      <span className="text-xs font-medium">
                        Wallet Balance
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#0F766E]">
                      ₹{user?.balance?.toLocaleString() ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                        <Clock size={14} />
                      </div>
                      <span className="text-xs font-medium">
                        Recent Activity
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {user?.last_login
                        ? new Date(user.last_login).toLocaleDateString(
                            undefined,
                            { day: "numeric", month: "short" },
                          )
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <div className="p-3 bg-gray-50/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-500 bg-white border border-red-100 rounded-xl hover:bg-red-50 hover:text-red-600 shadow-sm transition-all active:scale-95"
                >
                  <LogOut size={16} />
                  Sign Out Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
