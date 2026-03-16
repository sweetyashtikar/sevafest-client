"use client";

import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wallet,
  ShoppingBag,
  Star,
  Clock,
  Activity,
  Globe,
  Hash,
  Zap,
  CreditCard,
  Check,
  Copy,
  Gift
} from "lucide-react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [coupons, setCoupons] = useState([]);
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
    const fetchData = async () => {
      try {
        const [profileRes, subRes, couponRes] = await Promise.all([
          apiClient("/users/profile/me"),
          apiClient("/subscriptions/active-subscription"),
          apiClient("/coupons/active")
        ]);
        
        if (profileRes.success) setProfile(profileRes.data);
        if (subRes.success) setSubscription(subRes.data);
        if (couponRes.success) setCoupons(couponRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Referral code copied to clipboard!");
  };

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

  const daysRemaining = subscription ? calculateDaysRemaining(subscription.endDate) : 0;
  const progressPercent = subscription ? Math.max(0, Math.min(100, (daysRemaining / (subscription.subscriptionId?.duration === 'monthly' ? 30 : 365)) * 100)) : 0;

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

        {/* --- GRID BODY --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Subscription Card - Light Mode */}
          <motion.div
            variants={itemVars}
            className="md:col-span-3 overflow-hidden rounded-[2.5rem] bg-white p-8 border border-blue-100 shadow-xl shadow-blue-900/5 relative transition-all duration-500 hover:border-blue-200"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none -mr-20 -mt-20 rounded-full blur-3xl bg-blue-600" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-slate-800">Membership Overview</h3>
                </div>

                {subscription ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-5xl font-black text-blue-600 mb-1">{subscription.subscriptionId?.name}</h4>
                      <p className="text-slate-500 font-medium">Active until {new Date(subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">Validity Progress</span>
                        <span className="text-2xl font-black text-slate-800">{daysRemaining} <span className="text-sm font-medium text-slate-500 text-slate-400">days left</span></span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-500 font-medium text-lg">You don&apos;t have an active membership yet.</p>
                    <Link 
                      href="/#planCard" 
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 inline-block text-center"
                    >
                      View Plans
                    </Link>
                  </div>
                )}
              </div>

              {subscription && (
                <div className="lg:w-1/4 p-6 bg-slate-50/50 backdrop-blur-sm rounded-3xl border border-blue-50">
                  <p className="text-[10px] uppercase font-bold text-blue-500 tracking-[0.2em] mb-4">Included Benefits</p>
                  <div className="space-y-3">
                    {subscription.subscriptionId?.features?.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="text-green-500 mt-1 shrink-0" size={14} />
                        <span className="text-sm font-semibold text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Financial Overview */}
          <motion.div
            variants={itemVars}
            className="bg-[#1a1c24] rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg shadow-gray-200"
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
                  ₹{profile.balance?.toLocaleString()}
                </h4>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">
                  Total Cash Received
                </p>
                <h4 className="text-3xl font-black text-slate-800">
                  ₹{profile.cash_received?.toLocaleString()}
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
                  {profile.bonus_type?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Referral Program Card - ONLY FOR VENDORS */}
          {profile.role?.role?.toLowerCase().includes("vendor") && (
            <div className="md:col-span-1 space-y-6">
              <motion.div
                variants={itemVars}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all"
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Gift className="text-blue-600" size={22} /> Referral Program
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Invite other vendors and earn <span className="text-blue-600 font-bold">50% OFF</span> coupons!
                    </p>
                    
                    <div className="relative mt-4">
                      <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                        <span className="font-mono font-black text-xl text-slate-800 tracking-wider">
                          {profile.referral_code || "VF-CODE"}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(profile.referral_code)}
                          className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90"
                          title="Copy Code"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-2">
                      Your Personal Invitation Code
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Earned Rewards List */}
              {coupons.length > 0 && (
                <motion.div
                  variants={itemVars}
                  className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={80} />
                  </div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Zap className="text-yellow-400" size={22} /> My Rewards  ({coupons.length})
                  </h3>
                  <div className="space-y-4 max-h-[280px] no-scrollbar overflow-y-auto pr-2 custom-scrollbar">
                    {coupons.map((coupon) => (
                      <div key={coupon._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">{coupon.title}</p>
                            <p className="text-xl font-black">{coupon.couponCode}</p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(coupon.couponCode)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-blue-100/70">{coupon.description}</p>
                        <div className="mt-3 text-[10px] font-bold bg-white/20 inline-block px-2 py-1 rounded">
                          EXPIRES: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Referral Program Card - ONLY FOR VENDORS */}
          {profile.role?.role?.toLowerCase().includes("vendor") && (
            <div className="md:col-span-1 space-y-6">
              <motion.div
                variants={itemVars}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all"
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Gift className="text-blue-600" size={22} /> Referral Program
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Invite other vendors and earn <span className="text-blue-600 font-bold">50% OFF</span> coupons!
                    </p>
                    
                    <div className="relative mt-4">
                      <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                        <span className="font-mono font-black text-xl text-slate-800 tracking-wider">
                          {profile.referral_code || "VF-CODE"}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(profile.referral_code)}
                          className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90"
                          title="Copy Code"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-2">
                      Your Personal Invitation Code
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Earned Rewards List */}
              {coupons.length > 0 && (
                <motion.div
                  variants={itemVars}
                  className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={80} />
                  </div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Zap className="text-yellow-400" size={22} /> My Rewards  ({coupons.length})
                  </h3>
                  <div className="space-y-4 max-h-[280px] no-scrollbar overflow-y-auto pr-2 custom-scrollbar">
                    {coupons.map((coupon) => (
                      <div key={coupon._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">{coupon.title}</p>
                            <p className="text-xl font-black">{coupon.couponCode}</p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(coupon.couponCode)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-blue-100/70">{coupon.description}</p>
                        <div className="mt-3 text-[10px] font-bold bg-white/20 inline-block px-2 py-1 rounded">
                          EXPIRES: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

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
            className="md:col-span-1 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-gray-400" /> Service Areas
            </h3>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                  Geolocation (Point)
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.location?.coordinates?.map((coord, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-slate-50 rounded-xl font-mono text-xs text-slate-600 border border-slate-100"
                    >
                      {coord.toFixed(4)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                  Serviceable Zipcodes
                </p>
                {profile.zipcodes?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.zipcodes.map((zip, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100"
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
