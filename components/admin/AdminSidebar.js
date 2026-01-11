"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white shadow-lg">

      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <ShieldCheck className="text-green-400" />
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </div>

      {/* MENU */}
      <nav className="mt-4 flex flex-col">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition
                ${
                  isActive
                    ? "bg-gray-800 text-green-400 border-l-4 border-green-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
