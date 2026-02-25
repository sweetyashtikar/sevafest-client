"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  UserCheck,
  ShoppingCart,
  IndianRupee,
  Settings,
} from "lucide-react";

export const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/vendor" },
  { label: "Delivery Staff", icon: Users, path: "/vendor/delivery-staff" },
  { label: "Products", icon: Package, path: "/vendor/products" },
  { label: "User Requests", icon: UserCheck, path: "/vendor/user-requests" },
  { label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { label: "Earnings", icon: IndianRupee, path: "/vendor/earnings" },
  { label: "Settings", icon: Settings, path: "/vendor/settings" },
];

export default function VendorsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#0F766E] border-r border-white/10">
      {/* LOGO */}
      <div className="px-6 py-5 text-lg font-bold text-white border-b border-white/10">
        Vendor Panel
      </div>

      {/* MENU */}
      <nav className="flex flex-col mt-3 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-4 py-3 text-base text-white font-bold rounded-md
                ${isActive ? "bg-white/20" : ""}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}