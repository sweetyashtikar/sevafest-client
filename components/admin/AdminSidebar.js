"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tags,
  Percent,
  Store,
  Users,
  ClipboardList,
  UserCog,
  Truck,
  MessageCircle,
  FileText,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import path from "path";

export const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Catalog",
    icon: ShoppingBag,
    children: [
      { label: "Products", path: "/admin/product", icon: Package },
      { label: "Categories", path: "/admin/category", icon: Layers },
      { label: "Attributes", path: "/admin/attributes", icon: Tags },
      { label: "Coupons", path: "/admin/coupon", icon: Percent },
      { label: "Brands", path: "/admin/brands", icon: Store },
         { label: "Banner", path: "/admin/banner", icon: Store },
    ],
  },
  {
    label: "Stock Mangement",
    icon: Package,
    path: "/admin/stock",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
  {
    label: "Orders",
    icon: ClipboardList,
    path: "/admin/orders",
  },
  {
    label: "OurStaff",
    icon: UserCog,
    path: "/admin/staff",
  },

  {
    label: "Vendors",
    icon: Truck,
    children: [
      { label: "Vendor Add", path: "/admin/-add", icon: Truck },
      { label: "Vendor List", path: "/admin/vendors", icon: MessageCircle },
      {
        label: "Vedor Transactions", path: "/admin/vendor-transactions", icon: FileText
      }
    ],
  },
  {
    label: "Vendors",
    icon: Truck,
    path: "/admin/vendors",
  },
  {
    label: "User Requests",
    icon: MessageCircle,
    path: "/admin/user-requests",
  },
  {
    label: "Blogs",
    icon: FileText,
    path: "/admin/blogs",
  },
  {
    label: "OnlineStore",
    icon: Globe,
    path: "/admin/online-store",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openCatalog, setOpenCatalog] = useState(true);

  return (
   <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200">
      {/* LOGO */}
      <div className="px-6 py-5 text-lg font-bold text-black">
        Admin Panel
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = item.path && pathname === item.path;

          /* ---------- CATALOG ---------- */
          if (item.children) {
            return (
              <div key={item.label} className="mt-3">
                <button
                  onClick={() => setOpenCatalog(!openCatalog)}
                  className="w-full flex items-center justify-between px-6 py-3 text-base font-bold text-black hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    {item.label}
                  </div>

                  {openCatalog ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {openCatalog && (
                  <div className="ml-10 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => {
                      const childActive = pathname === child.path;

                      return (
                        <button
                          key={child.path}
                          onClick={() => router.push(child.path)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-bold rounded transition
                            ${childActive
                              ? "text-orange-500"
                              : "text-black hover:text-gray-700"
                            }`}
                        >
                          <child.icon size={16} />
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          /* ---------- NORMAL ITEM ---------- */
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`relative flex items-center gap-3 px-6 py-3 text-base font-bold transition
                ${isActive
                  ? "text-orange-500"
                  : "text-black hover:text-gray-700"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 rounded-r" />
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