"use client";

import { toast } from "react-toastify";
import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Wallet,
  ShoppingBag,
  Star,
  Clock,
  MapPin,
  LogOut,
  Settings,
} from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await apiClient("/logout", { method: "POST", body: {} });

      if (res.success) {
        dispatch(logout());
        router.push("/login");
        toast.success("Logged out successfully");
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        document.cookie = "user=; path=/; max-age=0";
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient("/users/profile/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 font-medium">
        No profile data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1c24] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* --- PROFILE HEADER (E-COMMERCE STYLE) --- */}
        <motion.div
          variants={itemVars}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-28 h-28 bg-[#fdd835] rounded-full flex items-center justify-center text-black shadow-inner">
                <User size={48} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 border-4 border-white w-7 h-7 rounded-full"></div>
            </div>

            {/* User Primary Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-[#1a1c24]">
                  {profile.username}
                </h1>
                <span className="px-3 py-1 bg-[#fdd835]/20 text-[#1a1c24] text-xs font-bold rounded-lg border border-[#fdd835]/30">
                  {profile.role?.role || "Member"}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" /> {profile.email}
                </p>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" /> {profile.mobile}
                </p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="hidden lg:flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck size={28} className="text-green-500 mb-1" />
              <span className="text-[10px] font-bold text-gray-400">
                Account Verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- STATS & ASSETS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Wallet Card */}
          <motion.div
            variants={itemVars}
            className="bg-[#1a1c24] rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg shadow-gray-200"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#fdd835] mb-4">
                <Wallet size={20} />
                <span className="text-sm font-semibold">Available Balance</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 italic tracking-tight">
                ₹{profile.balance.toLocaleString()}
              </h2>
              <button className="w-full py-3 bg-[#fdd835] text-black rounded-xl font-bold text-sm hover:bg-[#ebc72e] transition-colors active:scale-95">
                Add Money
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag size={150} />
            </div>
          </motion.div>

          {/* Reward Tier Card */}
          <motion.div
            variants={itemVars}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1">
                  Loyalty Tier
                </p>
                <h3 className="text-xl font-bold capitalize text-[#1a1c24]">
                  {profile.bonus_type.replace(/_/g, " ")} Member
                </h3>
              </div>
              <div className="p-2 bg-yellow-50 rounded-xl text-[#fdd835]">
                <Star size={24} fill="currentColor" />
              </div>
            </div>

            <div className="mt-6">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#fdd835] w-[70%] rounded-full" />
              </div>
              <p className="text-[11px] text-gray-400 mt-2 font-medium">
                300 more points to reach Platinum
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- INFORMATION LISTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary Section */}
          <motion.div
            variants={itemVars}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-gray-400" /> Account Summary
            </h3>
            <div className="space-y-4">
              <InfoRow
                label="Joined on"
                value={new Date(profile.createdAt).toLocaleDateString()}
              />
              <InfoRow
                label="Last login"
                value={new Date(profile.last_login).toLocaleDateString()}
              />
              <InfoRow
                label="Total cash received"
                value={`₹${profile.cash_received.toLocaleString()}`}
              />
            </div>
          </motion.div>

          {/* Service Area Section */}
          <motion.div
            variants={itemVars}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-gray-400" /> Service Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.zipcodes.length > 0 ? (
                profile.zipcodes.map((zip, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100"
                  >
                    {zip}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Global service access enabled
                </p>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50">
              <button className="text-sm font-bold text-[#1a1c24] hover:underline flex items-center gap-1">
                View all locations <Star size={12} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <motion.div
          variants={itemVars}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- HELPER COMPONENT ---
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-[#1a1c24]">{value}</span>
    </div>
  );
}
