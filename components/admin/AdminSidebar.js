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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

/* ================= MENU ================= */

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },

  {
    label: "Catalog",
    icon: ShoppingBag,
    children: [
      { label: "Products", path: "/admin/product", icon: Package },
      { label: "Categories", path: "/admin/category", icon: Layers },
      { label: "Attributes", path: "/admin/attributes", icon: Tags },
      { label: "Coupons", path: "/admin/coupon", icon: Percent },
      { label: "Brands", path: "/admin/brands", icon: Store },
    ],
  },

  { label: "Orders", icon: ClipboardList, path: "/admin/orders" },
  { label: "Customers", icon: Users, path: "/admin/customers" },
  { label: "Staff", icon: UserCog, path: "/admin/staff" },
];

/* ================= COMPONENT ================= */

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (label) => {
    setOpenGroup(openGroup === label ? null : label);
  };

  const navigate = (path) => {
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ===== MOBILE HEADER ===== */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>

        <h2 className="font-bold">Admin Panel</h2>
      </div>

      {/* ===== OVERLAY ===== */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50
        transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h1 className="font-bold text-lg">Admin Panel</h1>

          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* MENU */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;

            /* GROUP */
            if (item.children) {
              const open = openGroup === item.label;

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-lg hover:bg-white/10"
                  >
                    <div className="flex gap-3 items-center">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                    {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {open && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm
                          ${
                            pathname === child.path
                              ? "bg-orange-500"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <child.icon size={15} />
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            /* NORMAL */
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg
                ${
                  active ? "bg-orange-500" : "hover:bg-white/10"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}