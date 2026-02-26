"use client";
import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Wallet,
  Clock,
  Activity,
  Globe,
  Hash,
  Zap,
  CreditCard,
} from "lucide-react";

export default function ProfilePage() {
    
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        {/* --- HERO SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 mb-8 z-10"
        >
          {/* Decorative background icon */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <User size={250} />
          </div>

          <div className="relative z-20 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar / Profile Icon */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-3xl flex items-center justify-center text-white shadow-lg">
                <User size={60} className="-rotate-3" />
              </div>
              {/* Active Status Indicator */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full shadow-md"></div>
            </div>

            {/* User Details */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 capitalize leading-tight">
                  {profile.username}
                </h1>
                <div className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-blue-100">
                  {profile.role?.role || "User"}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} className="text-blue-400" /> {profile.email}
                </p>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <Phone size={16} className="text-blue-400" /> {profile.mobile}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-8 border-t border-slate-50 pt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">
                    Account Status
                  </span>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                    <ShieldCheck size={14} />{" "}
                    {profile.status ? "Verified Active" : "Pending"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">
                    Registration Date
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- GRID BODY --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Financial Overview */}
          <motion.div
            variants={itemVars}
            className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Wallet className="text-blue-600" size={22} /> Wallet Assets
              </h3>
              <Zap size={18} className="text-yellow-400 fill-yellow-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                <p className="text-sm text-slate-500 mb-1 group-hover:text-blue-600 transition-colors">
                  Available Balance
                </p>
                <h4 className="text-3xl font-black text-slate-800">
                  ₹{profile.balance.toLocaleString()}
                </h4>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">
                  Total Cash Received
                </p>
                <h4 className="text-3xl font-black text-slate-800">
                  ₹{profile.cash_received.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <CreditCard size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-blue-400">
                  Reward Tier
                </p>
                <p className="text-sm font-bold text-blue-900 capitalize">
                  {profile.bonus_type.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact & Tech Details */}
          <motion.div
            variants={itemVars}
            className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl"
          >
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Activity size={22} className="text-blue-400" /> Secure Details
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Phone size={18} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    Mobile
                  </p>
                  <p className="text-sm font-medium">{profile.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Globe size={18} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    Network IP
                  </p>
                  <p className="text-sm font-mono">{profile.ip_address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Hash size={18} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    Role ID
                  </p>
                  <p className="text-[11px] font-mono break-all text-slate-300">
                    {profile.role?._id}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div
            variants={itemVars}
            className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="text-purple-600" size={22} /> System History
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-400 font-medium italic">
                  Last Activity
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {new Date(profile.last_login).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-400 font-medium italic">
                  Account Created
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-400 font-medium italic">
                  Data Version
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                  V{profile.__v}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Regional Settings */}
          <motion.div
            variants={itemVars}
            className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-red-500" size={22} /> Regional & Logistics
            </h3>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                  Geolocation (Point)
                </p>
                <div className="flex gap-2">
                  {profile.location.coordinates.map((coord, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-50 rounded-xl font-mono text-sm text-slate-600 border border-slate-100"
                    >
                      {coord.toFixed(4)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                  Serviceable Zipcodes
                </p>
                {profile.zipcodes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.zipcodes.map((zip, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100"
                      >
                        {zip}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                    Global Service Access
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <motion.div
          variants={itemVars}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4"
        >
          <div className="text-left">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Registry ID
            </p>
            <p className="text-[12px] font-mono text-slate-500">
              {profile._id}
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
              Edit Profile
            </button>
            <button className="flex-1 sm:flex-none px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95">
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
