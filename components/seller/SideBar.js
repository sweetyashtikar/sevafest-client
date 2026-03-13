"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, List, PlusCircle, Users } from "lucide-react";

export const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/seller" },
  { label: "Add Vendor", icon: PlusCircle, path: "/seller/vendor/create" },
  { label: "Vendor List", icon: Users, path: "/seller/vendor" },
  { label: "Add Leads", icon: PlusCircle, path: "/seller/leads/create" },
  { label: "Recent Leads", icon: List, path: "/seller/leads" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#fdd835] border-r border-[#fcc221] flex flex-col">
      <div className="px-6 py-5 text-lg font-bold text-[#1a1c24] border-b border-[#fcc221] tracking-wide">
        Seller Panel
      </div>

      <nav className="flex flex-col mt-3 px-2 gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200
              
              ${
                isActive
                  ? "bg-[#1a1c24] text-white shadow-md"
                  : "text-[#1a1c24] hover:bg-[#fcc221]"
              }
              
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto px-6 py-4 text-xs text-[#1a1c24]/70 border-t border-[#fcc221]">
        SEVAFAST Seller Panel
      </div>
    </aside>
  );
}
