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
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#FFCC33] border-r border-black/20">

      {/* HEADER */}
      <div className="px-6 py-5 text-lg font-bold text-black border-b border-black/20">
        Delivery Boy Panel
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1 mt-2">
        {menuItems.map((item) => {
          const isActive = item.path && pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`relative flex items-center gap-3 px-6 py-3 text-base font-bold text-black transition
                ${
                  isActive
                    ? "bg-black/20"
                    : "hover:bg-black/10"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-black rounded-r" />
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