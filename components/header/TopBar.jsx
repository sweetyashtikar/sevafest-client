"use client";

import Image from "next/image";
import Logo from "../../assets/images/logo.png";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  User,
  Menu,
  X,
  ShoppingCart,
  Search,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { apiClient } from "@/services/apiClient";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const { user } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  return (
    <>
      <TopStrick />
      <div className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">

            {/* LEFT NAV */}
            <nav className="hidden lg:flex items-center gap-8">
              <img src={Logo} alt="" className="w-28 cursor-pointer" />

              <button className="group flex items-center gap-1 text-gray-800 font-semibold hover:text-[#F7931E] transition">
                Browse Category
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition" />
              </button>

              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Coupons", href: "/coupons" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative font-medium text-gray-700 hover:text-[#F7931E]
            after:absolute after:left-0 after:-bottom-1 after:h-[2px]
            after:w-0 after:bg-[#F7931E] after:transition-all hover:after:w-full"
                >
                  {item.name}
                </a>
              ))}

              {/* Pages Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsPagesOpen(true)}
                  className="group flex items-center gap-1 text-gray-700 font-medium hover:text-[#F7931E]"
                >
                  Pages
                  <ChevronDown className={`w-4 h-4 transition ${isPagesOpen ? "rotate-180" : ""}`} />
                </button>

                {isPagesOpen && (
                  <div
                    onMouseLeave={() => setIsPagesOpen(false)}
                    className="absolute top-full mt-3 w-52 bg-white rounded-xl shadow-xl border overflow-hidden"
                  >
                    {[
                      { name: "About Us", href: "/about" },
                      { name: "Contact Us", href: "/contact" },
                      { name: "Blogs", href: "/blog" },
                      { name: "Terms & Conditions", href: "/terms-condition" },
                    ].map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">

              {/* Search */}
              <div
                className={`transition-all duration-500 ${isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                  }`}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Cart */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-[#F7931E] text-white text-[10px]
            w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </button>

                {isProfileOpen &&
                  (user ? (
                    <ProfileModel user={user} setIsProfileOpen={setIsProfileOpen} />
                  ) : (
                    <AuthDropdown setIsProfileOpen={setIsProfileOpen} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
}

const AuthDropdown = ({ setIsProfileOpen }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    setIsProfileOpen(false);
    router.push(path);
  };

  return (
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
        <p className="text-sm text-gray-600 text-center">Welcome to SEVAFAST</p>
        <p className="text-xs text-gray-500 text-center mt-1">
          Login or Register to continue
        </p>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={() => handleNavigation("/login")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all active:scale-95 shadow-md"
        >
          <LogIn className="w-4 h-4" />
          Login
        </button>

        <button
          onClick={() => handleNavigation("/register")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-green-600 text-green-600 font-medium hover:bg-green-50 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Register
        </button>
      </div>

      <div className="border-t p-4 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          New to SEVAFAST? Create an account to enjoy exclusive offers!
        </p>
      </div>
    </div>
  );
};

const ProfileModel = ({ user, setIsProfileOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await apiClient("/logout", { method: "POST", body: {} });

      if (res.success) {
        dispatch(logout());
        setIsProfileOpen(false);
        router.push("/login");
        alert("Logged out successfully");

        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Hello,</p>
          <h3 className="font-semibold text-gray-800">{user?.username}</h3>
          <p className="text-xs text-gray-500">{user?.mobile}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition text-sm font-medium text-gray-700">
          <ShoppingCart className="w-4 h-4 text-green-600" />
          My Orders
        </button>

        <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition text-sm font-medium text-gray-700">
          <MapPin className="w-4 h-4 text-green-600" />
          Addresses
        </button>

        <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition text-sm font-medium text-gray-700">
          <Mail className="w-4 h-4 text-green-600" />
          Support
        </button>

        <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition text-sm font-medium text-gray-700">
          <Phone className="w-4 h-4 text-green-600" />
          Contact Us
        </button>
      </div>

      <div className="border-t px-4 py-3 space-y-1">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
          My Account
          <span className="text-gray-400">›</span>
        </button>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
          Wallet & Payments
          <span className="text-gray-400">›</span>
        </button>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
          Coupons
          <span className="text-gray-400">›</span>
        </button>
      </div>

      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const TopStrick = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-800 to-purple-900 text-white py-2 px-4 overflow-hidden">
      <div className="absolute inset-0 shine-effect"></div>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs md:text-sm gap-2">
        <div className="flex items-center gap-1 overflow-hidden">
          <span className="font-medium whitespace-nowrap animate-slide-in-left">
            Welcome to SEVAFAST
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <a
            href="mailto:info@sevafast.in"
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors animate-slide-in-right animation-delay-200"
          >
            <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline whitespace-nowrap">
              info@sevafast.in
            </span>
          </a>
          <div className="flex items-center gap-1.5 animate-slide-in-right animation-delay-400">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline text-xs whitespace-nowrap">
              Shop No. Gvhsns raod New Mondha Parbhani, Parbhani, MH, 431401
            </span>
            <span className="md:hidden text-xs whitespace-nowrap">
              Parbhani, MH
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .shine-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 60%,
            transparent 100%
          );
          animation: shine 3s infinite;
          pointer-events: none;
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};