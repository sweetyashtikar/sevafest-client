"use client";

import Image from "next/image";
import Logo from "../../assets/images/image.png";
import { useEffect, useState } from "react";
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
  Sparkles,
  Info,
  FileText,
  BookOpen,
  PartyPopper,
} from "lucide-react";
import { useSelector } from "react-redux";
import { apiClient } from "@/services/apiClient";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { fetchCart } from "@/redux/slices/cartSlice";
import { SupportModal } from "@/ui/SupportModal";
import { AddressModal } from "@/ui/AddressModal";
import { CategoryDropdown } from "@/components/header/CategoryDropdown";

export default function TopBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((c) => c.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <>
      <header className="w-full font-sans">
        <div className="bg-[#1a1c24] text-white py-2 px-4 border-b border-gray-700">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[13px] font-medium">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#fcc221]" />
                <span>
                  Location set to: <span className="font-bold">Parbhani</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#fcc221]" />
                <span>
                  Mail us: <span className="font-bold">info@sevafast.in</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-90">
              <Sparkles className="w-4 h-4 text-[#fcc221]" />
              <span> Welcome to SEVAFAST</span>
            </div>
          </div>
        </div>

        <div className="bg-[#ffcc33] py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-5 text-[#1a1c24] text-[12px] font-bold uppercase tracking-wide">
              <a
                href="/about"
                className="flex items-center gap-1 hover:opacity-70"
              >
                <Info className="w-3.5 h-3.5" /> ABOUT US
              </a>
              <a
                href="/contact"
                className="flex items-center gap-1 hover:opacity-70"
              >
                <Phone className="w-3.5 h-3.5" /> CONTACT
              </a>
              <a
                href="/terms-condition"
                className="flex items-center gap-1 hover:opacity-70"
              >
                <FileText className="w-3.5 h-3.5" />
                TERMS AND CONDITIONS
              </a>
              <a
                href="/blog"
                className="flex items-center gap-1 hover:opacity-70"
              >
                <BookOpen className="w-3.5 h-3.5" /> BLOGS
              </a>
            </div>
          </div>
        </div>

        <div className="bg-[#fdd835] px-4 py-1 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <div className="flex-shrink-0 cursor-pointer h-full flex items-cente ">
              <img
                src="/logo.png"
                alt="SevaFast Logo"
                className="h-15 w-auto object-contain"
              />
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-[#1a1c24] font-extrabold text-[15px] uppercase">
              <div
                className="relative"
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  className="flex items-center gap-1 cursor-pointer hover:text-black group"
                >
                  Browse Category
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <CategoryDropdown
                  isOpen={isCategoryOpen}
                  onClose={() => setIsCategoryOpen(false)}
                />
              </div>

              <a href="/" className="hover:text-black">
                Home
              </a>
              <a
                href="/products"
                className="flex items-center gap-1 cursor-pointer hover:text-black group"
              >
                PRODUCTS
              </a>
              <a
                href="/coupons"
                className="flex items-center gap-1 cursor-pointer hover:text-black"
              >
                <PartyPopper className="w-4 h-4" /> COUPONS
              </a>
            </nav>

            <div className="flex-grow max-w-xl relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(
                      `/search?q=${encodeURIComponent(searchQuery.trim())}`,
                    );
                    setSearchQuery("");
                  }
                }}
                placeholder="Search for products..."
                className="w-full bg-[#f3f4f7] text-black rounded-full py-3 pl-12 pr-4 text-sm 
                outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>

            <button
              onClick={() => router.push("/cart")}
              className="relative text-black   bg-gray-200/50 p-2 rounded-full transition-all group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />

              {items?.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center 
                    justify-center font-bold "
                >
                  {items.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-1.5 bg-gray-200/50 rounded-full group-hover:bg-gray-200"
                >
                  <User className="w-6 h-6 text-[#1a1c24]" />
                </div>

                {isProfileOpen &&
                  (user ? (
                    <ProfileModel
                      user={user}
                      setIsProfileOpen={setIsProfileOpen}
                      setIsSupportOpen={setIsSupportOpen}
                      setIsAddressOpen={setIsAddressOpen}
                    />
                  ) : (
                    <AuthDropdown setIsProfileOpen={setIsProfileOpen} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <AddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
      />

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
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden">
      <div className="p-4 border-b bg-[#1a1c24] text-white">
        <p className="text-sm text-center font-semibold">Welcome to SEVAFAST</p>
        <p className="text-xs text-center mt-1 text-gray-300">
          Login or Register to continue
        </p>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={() => handleNavigation("/login")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
        rounded-lg bg-[#fdd835] text-[#1a1c24] font-semibold 
        hover:bg-[#fcc221] transition-all active:scale-95 shadow-md"
        >
          <LogIn className="w-4 h-4" />
          Login
        </button>

        <button
          onClick={() => handleNavigation("/register")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
        rounded-lg border-2 border-[#1a1c24] text-[#1a1c24] font-semibold
        hover:bg-[#fdd835] transition-all active:scale-95"
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

const ProfileModel = ({
  user,
  setIsProfileOpen,
  setIsSupportOpen,
  setIsAddressOpen,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSupportClick = () => {
    setIsProfileOpen(false);
    setIsSupportOpen(true);
  };

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
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden">
    
      <div className="flex items-center gap-4 p-4 border-b bg-[#1a1c24] text-white">
        <div className="w-12 h-12 bg-[#fdd835] rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-[#1a1c24]" />
        </div>
        <div>
          <p className="text-sm text-gray-300">Hello,</p>
          <h3 className="font-semibold">{user?.username}</h3>
          <p className="text-xs text-gray-300">{user?.mobile}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        <button
          onClick={() => router.push("/order/my-order")}
          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 
        hover:bg-[#fdd835] transition text-sm font-medium text-[#1a1c24]"
        >
          <ShoppingCart className="w-4 h-4 text-[#1a1c24]" />
          My Orders
        </button>

        <button
          onClick={() => {
            setIsProfileOpen(false);
            setIsAddressOpen(true);
          }}
          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 
        hover:bg-[#fdd835] transition text-sm font-medium text-[#1a1c24]"
        >
          <MapPin className="w-4 h-4 text-[#1a1c24]" />
          Addresses
        </button>

        <button
          onClick={handleSupportClick}
          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 
        hover:bg-[#fdd835] transition text-sm font-medium text-[#1a1c24]"
        >
          <Mail className="w-4 h-4 text-[#1a1c24]" />
          Support
        </button>

        <button
          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 
        hover:bg-[#fdd835] transition text-sm font-medium text-[#1a1c24]"
        >
          <Phone className="w-4 h-4 text-[#1a1c24]" />
          Contact Us
        </button>
      </div>

     
      <div className="border-t px-4 py-3 space-y-1">
        <button
          onClick={() => router.push("/profile")}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md 
        hover:bg-[#fdd835] text-sm text-[#1a1c24]"
        >
          My Account
          <span>›</span>
        </button>

        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-md 
        hover:bg-[#fdd835] text-sm text-[#1a1c24]"
        >
          Wallet & Payments
          <span>›</span>
        </button>

        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-md 
        hover:bg-[#fdd835] text-sm text-[#1a1c24]"
        >
          Coupons
          <span>›</span>
        </button>
      </div>

     
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg bg-[#fdd835] text-[#1a1c24] 
        font-semibold hover:bg-[#fcc221] transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
