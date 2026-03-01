"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tags,
  Store,
  ClipboardList,
  Users,
  UserCog,
  UserPlus,
  User,
  Bell,
  HelpCircle,
  ShoppingCart,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  BarChart3,
  Megaphone,
  Image,
  Home,
  Settings,
  CreditCard,
  ShieldCheck,
  FileText,
  Percent,
  ChevronDown,
  ChevronRight,
  Upload,
  RefreshCcw,
  Warehouse,
  Building2,
  MapPin,
  Map,
  Clock,
  Banknote,
  Wallet,
  List,
  Landmark,
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
      { label: "Add Product", path: "/admin/product/create", icon: Package },
      { label: "Product List", path: "/admin/product", icon: List },
      { label: "Bulk Import", path: "/admin/product/bulkimport", icon: Upload },
      {
        label: "Bulk Update",
        path: "/admin/product/bulkupdate",
        icon: RefreshCcw,
      },
    ],
  },
  {
    label: "Categories",
    icon: Layers,
    children: [
      { label: "Add category", path: "/admin/category/create", icon: Layers },
      { label: "List category", path: "/admin/category", icon: List },
      { label: "Attribute", path: "/admin/attributes", icon: Tags },
    ],
  },

  {
    label: "Banner",
    icon: Image,
    children: [
      { label: "Add banner", path: "/admin/banner/create", icon: Image },
      { label: "List banner", path: "/admin/banner", icon: List },
    ],
  },

  {
    label: "Brand",
    icon: Store,
    children: [
      { label: "Add brand", path: "/admin/brands/create", icon: Store },
      { label: "List brand", path: "/admin/brands", icon: List },
    ],
  },

  {
    label: "Stock management",
    icon: Warehouse,
    path: "/admin/stock-management",
  },

  {
    label: "Manger Vender",
    icon: Building2,
    children: [
      { label: "Add vender", path: "/admin/vendors/create", icon: UserPlus },
      { label: "Vender list", path: "/admin/vendors", icon: Users },
      {
        label: "Vendor transaction",
        path: "/admin/vendors/transaction",
        icon: Landmark,
      },
    ],
  },

  {
    label: "Mange Location",
    icon: MapPin,
    children: [
      { label: "Manage city", path: "/admin/zipcodes", icon: Building2 },
      { label: "Deliverable area", path: "/admin/areas", icon: Map },
      { label: "Deliverable area list", path: "/admin/cities", icon: List },
    ],
  },

  {
    label: "Coupon",
    icon: Percent,
    path: "/admin/coupon",
  },

  {
    label: "Time slot",
    icon: Clock,
    path: "/admin/timesolt",
  },

  {
    label: "Delivery boy",
    icon: Truck,
    children: [
      { label: "Add delivery boy", path: "/admin/category", icon: UserPlus },
      { label: "Manage delivery boy", path: "/admin/category", icon: Users },
      { label: "Fund transfer", path: "/admin/category", icon: Banknote },
      { label: "Cash collection", path: "/admin/category", icon: Wallet },
    ],
  },

  {
    label: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },

  {
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
  {
    label: "Stock management",
    icon: Users,
    path: "/admin/stock-management",
  },
  {
    label: "Orders",
    icon: ClipboardList,
    path: "/admin/orders",
  },
  {
    label: "Staff",
    icon: UserCog,
    path: "/admin/staff",
  },

  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Notification",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    label: "FAQ",
    icon: HelpCircle,
    path: "/admin/faq",
  },

  // ===== Order Section =====
  {
    label: "Order Section",
    icon: ShoppingCart,
    children: [
      { label: "All Order", path: "/admin/orders", icon: ClipboardList },
      {
        label: "Pending Order",
        path: "/admin/orders/pending",
        icon: ClipboardList,
      },
      {
        label: "Received Order",
        path: "/admin/orders/received",
        icon: ClipboardList,
      },
      {
        label: "Processed Order",
        path: "/admin/orders/processed",
        icon: ClipboardList,
      },
      { label: "Shipped Order", path: "/admin/orders/shipped", icon: Truck },
      {
        label: "Out for Delivery",
        path: "/admin/orders/out-for-delivery",
        icon: Truck,
      },
      {
        label: "Delivered Order",
        path: "/admin/orders/delivered",
        icon: CheckCircle,
      },
      {
        label: "Cancelled Order",
        path: "/admin/orders/cancelled",
        icon: XCircle,
      },
      { label: "Return", path: "/admin/orders/return", icon: RotateCcw },
      {
        label: "AI Insight Report",
        path: "/admin/orders/ai-report",
        icon: BarChart3,
      },
    ],
  },

  // ===== Promotion =====
  {
    label: "Promotion",
    icon: Megaphone,
    children: [
      {
        label: "Highlights",
        path: "/admin/promotion/highlights",
        icon: Megaphone,
      },
      { label: "Banner", path: "/admin/promotion/banner", icon: Image },
      { label: "Home Section", path: "/admin/promotion/home", icon: Home },
    ],
  },

  // ===== Setting =====
  {
    label: "Setting",
    icon: Settings,
    children: [
      {
        label: "Payment Setting",
        path: "/admin/settings/payment",
        icon: CreditCard,
      },
      {
        label: "Manage Roles",
        path: "/admin/settings/roles",
        icon: ShieldCheck,
      },
      {
        label: "Customer App Policy",
        path: "/admin/settings/customer-policy",
        icon: FileText,
      },
      {
        label: "Delivery App Policy",
        path: "/admin/settings/delivery-policy",
        icon: FileText,
      },
      { label: "System User", path: "/admin/settings/system-user", icon: User },
    ],
  },
];

export default function AdminSidebar({ isOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenus, setOpenMenus] = useState({
    Products: true,
    Catalog: false,
    Categories: false,
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
  ${isOpen ? "w-64" : "w-20"} overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent`}
    >
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 mb-2 border-b border-white/10 overflow-hidden">
        <h1
          className={`font-black tracking-tighter transition-all duration-300 ${
            isOpen ? "text-2xl opacity-100" : "text-xs opacity-0"
          }`}
        >
          ADMIN<span className="text-teal-300">PANEL</span>
        </h1>

        {!isOpen && <span className="text-teal-400 font-bold ml-1">AP</span>}
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col px-3 gap-2 pb-12">
        {menuItems.map((item, index) => {
          const isActive = item.path && pathname === item.path;
          const hasChildren = !!item.children;
          const menuOpen = openMenus[item.label];

          if (hasChildren) {
            return (
              <div
                key={item.path || `${item.label}-${index}`}
                className="flex flex-col"
              >
                {/* PARENT */}
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all
              ${menuOpen ? "bg-white/10" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={22} />
                    {isOpen && (
                      <span className="text-base font-bold tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {isOpen &&
                    (menuOpen ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    ))}
                </button>

                {/* CHILDREN */}
                {menuOpen && isOpen && (
                  <div className="ml-8 mt-2 flex flex-col gap-1 border-l-2 border-teal-500/30 pl-3">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;

                      return (
                        <button
                          key={child.label}
                          onClick={() => router.push(child.path)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all
                      ${
                        isChildActive
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
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

          /* SINGLE MENU */
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
          ${
            isActive
              ? "bg-white/20 text-white translate-x-1"
              : "text-white/80 hover:bg-white/10 hover:translate-x-1"
          }`}
            >
              <item.icon size={22} />
              {isOpen && (
                <span className="text-base font-bold tracking-wide">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
