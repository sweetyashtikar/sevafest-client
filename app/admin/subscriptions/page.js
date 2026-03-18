"use client";

import { useState } from "react";
import SubscriptionTable from "@/components/admin/SubscriptionTable";
import VendorLevelTable from "@/components/admin/VendorLevelTable";

export default function AdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex gap-4 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-8 py-3 rounded-xl font-black transition-all ${
              activeTab === "plans" 
                ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10 scale-100" 
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50 scale-95"
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab("levels")}
            className={`px-8 py-3 rounded-xl font-black transition-all ${
              activeTab === "levels" 
                ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10 scale-100" 
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50 scale-95"
            }`}
          >
            Vendor Levels
          </button>
        </div>

        {activeTab === "plans" ? <SubscriptionTable /> : <VendorLevelTable />}
      </div>
    </div>
  );
}
