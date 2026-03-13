"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Phone,
  TrendingUp,
  CheckCircle,
  BarChart3,
  ArrowUpRight,
  Clock,
  Target,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";

export default function Page() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient("/lead/stats/dashboard");
      if (res.success) {
        setStatsData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Leads",
      value: statsData?.total ?? 0,
      icon: Users,
      color: "bg-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "New Leads",
      value: statsData?.newLeads ?? 0,
      icon: Clock,
      color: "bg-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Converted",
      value: statsData?.converted ?? 0,
      icon: CheckCircle,
      color: "bg-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Conversion Rate",
      value: `${statsData?.conversion_rate ?? 0}%`,
      icon: Target,
      color: "bg-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const breakdown = statsData?.breakdown || {};

  // Status mapping for better naming & icons
  const statusConfig = {
    new: { label: "New", color: "bg-blue-100 text-blue-700" },
    contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
    meeting_scheduled: {
      label: "Meeting",
      color: "bg-purple-100 text-purple-700",
    },
    proposal_sent: {
      label: "Proposal",
      color: "bg-indigo-100 text-indigo-700",
    },
    negotiation: {
      label: "Negotiating",
      color: "bg-orange-100 text-orange-700",
    },
    converted: { label: "Won", color: "bg-green-100 text-green-700" },
    lost: { label: "Lost", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1c24] tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 font-medium">
              Real-time performance metrics for your leads.
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#fdd835] text-black border border-[#fdd835] rounded-xl font-extrabold text-sm shadow-md hover:bg-[#ebc72e] hover:shadow-lg transition-all active:scale-95"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* MAIN STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 group transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    {item.title}
                  </p>
                  <h3 className="text-3xl font-black text-[#1a1c24] mt-1">
                    {loading ? "..." : item.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl bg-[#fdd835] text-black shadow-lg shadow-[#fdd835]/20`}
                >
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md">
                <ArrowUpRight size={12} className="mr-1" /> LIVE UPDATES
              </div>
            </div>
          ))}
        </div>

        {/* BREAKDOWN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* VISUAL BREAKDOWN CARD */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                  <BarChart3 size={20} />
                </div>
                <h2 className="font-extrabold text-[#1a1c24] text-lg">
                  Lead Status Pipeline
                </h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(breakdown).map(([status, count]) => (
                  <div
                    key={status}
                    className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-[#fdd835] hover:bg-white transition-all group"
                  >
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-2 px-2 py-0.5 rounded-full w-fit ${statusConfig[status]?.color || "bg-gray-100 text-gray-600"}`}
                    >
                      {statusConfig[status]?.label || status}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-black text-[#1a1c24]">
                        {count}
                      </p>
                      <p className="text-xs font-bold text-gray-400">leads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK SUMMARY CARD */}
          <div className="bg-[#1a1c24] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={120} />
            </div>

            <h2 className="text-xl font-bold mb-6 relative z-10">
              Performance Summary
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-gray-400 font-medium">
                  Avg. Conversion
                </span>
                <span className="text-[#fdd835] font-black text-xl">
                  {statsData?.conversion_rate}%
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-gray-400 font-medium">Lost Leads</span>
                <span className="text-red-400 font-black text-xl">
                  {statsData?.lostLeads ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-gray-400 font-medium">Contacted</span>
                <span className="text-blue-400 font-black text-xl">
                  {statsData?.contactedLeads ?? 0}
                </span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "Success is not final, failure is not fatal: it is the courage
                to continue that counts."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
