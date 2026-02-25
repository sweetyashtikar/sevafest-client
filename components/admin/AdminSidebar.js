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
  Search,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },

  {
    label: "Products",
    icon: Package,
    children: [
      { label: "New Product", path: "/admin/category", icon: Layers },
      { label: "Product List", path: "/admin/attributes", icon: Tags },
      { label: "Bulk Import", path: "/admin/brands", icon: Store },
      { label: "Bulk Update", path: "/admin/banner", icon: Store },
      { label: "Taxes", path: "/admin/areas", icon: Store },
    ],
  },

  {
    label: "Categories",
    icon: Layers,
    children: [
      { label: "New Categories", path: "/admin/category", icon: Layers },
      { label: "Categories List", path: "/admin/attributes", icon: Tags },
      { label: "Bulk Import", path: "/admin/brands", icon: Store },
      { label: "Bulk Update", path: "/admin/banner", icon: Store },
      { label: "Taxes", path: "/admin/areas", icon: Store },
    ],
  },

  {
    label: "Catalog",
    icon: ShoppingBag,
    children: [
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

export default function AdminSidebar({ isOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenus, setOpenMenus] = useState({
    Products: true,
    Catalog: false,
  });

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0F766E] text-white transition-all duration-300 z-50
      ${isOpen ? "w-80" : "w-20"} overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent`}
    >
      {/* --- LOGO --- */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 overflow-hidden">
        <h1
          className={`font-black tracking-tighter transition-all duration-300 ${isOpen ? "text-2xl opacity-100" : "text-xs opacity-0"}`}
        >
          ADMIN<span className="text-teal-400"> PANNEL</span>
        </h1>
        {!isOpen && <span className="text-teal-400 font-bold ml-1">AP</span>}
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex flex-col px-4 gap-2 pb-12">
        {menuItems.map((item) => {
          const isActive = item.path && pathname === item.path;
          const hasChildren = !!item.children;
          const isOpen = openMenus[item.label];

          if (hasChildren) {
            return (
              <div key={item.label} className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                  ${isOpen ? "bg-white/10" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      size={24}
                      className={isOpen ? "bg-white/20" : "text-white/70"}
                    />
                    <span className="text-lg font-extrabold tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>

                {/* Dropdown Content */}
                {isOpen && (
                  <div className="ml-9 mt-2 flex flex-col gap-1 border-l-2 border-teal-500/30 pl-4">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;
                      return (
                        <button
                          key={child.label}
                          onClick={() => router.push(child.path)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-bold transition-all
                          ${
                            isChildActive
                              ? "bg-white/20 text-white "
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <child.icon size={18} />
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          {
            /* Single Link Item */
          }
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white/20 text-white translate-x-1"
                  : "text-white/80 hover:bg-white/10 hover:translate-x-1"
              }`}
            >
              <item.icon size={24} className="text-white" />
              <span className="text-lg font-extrabold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
