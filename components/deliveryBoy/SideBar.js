"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
} from "lucide-react";
import { useState } from "react";

export const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/delivery",
  },
  {
    label: "Orders",
    icon: Package,
    path: "/delivery/orders",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openCatalog, setOpenCatalog] = useState(true);

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#0F766E] border-r border-gray-200">

      {/* HEADER */}
      <div className="px-6 py-5 text-lg font-bold text-white">
        Delivery Boy Panel
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = item.path && pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`relative flex items-center gap-3 px-6 py-3 text-base font-bold text-white transition
                ${
                  isActive
                    ? "bg-[#115E59]"
                    : "hover:bg-[#134E4A]"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r" />
              )}
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}