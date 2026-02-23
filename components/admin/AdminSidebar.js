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
  ChevronRight, // ✅ FIXED
} from "lucide-react";
import { useState } from "react";

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
           { label: "Area", path: "/admin/areas", icon: Store },
             { label: "City", path: "/admin/cities", icon: Store },
           { label: "Zipcodes", path: "/admin/zipcodes", icon: Store },
    ],
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

  // ✅ RETURN WAS MISSING
  return (
   <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200">
      {/* LOGO */}
      <div className="px-6 py-5 text-lg font-semibold text-gray-800">
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
                  className="w-full flex items-center justify-between px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
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
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded transition
                            ${
                              childActive
                                ? "text-orange-500 font-medium"
                                : "text-gray-500 hover:text-gray-800"
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
              className={`relative flex items-center gap-3 px-6 py-3 text-base transition
                ${
                  isActive
                    ? "text-orange-500 font-medium"
                    : "text-gray-600 hover:text-gray-900"
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
