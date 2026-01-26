"use client";

import React from "react";
import {
  X,
  Mail,
  User,
  Shield,
  Activity,
  MapPin,
  Wallet,
  Clock,
  Globe,
  Gift,
  Calendar,
  TrendingUp,
} from "lucide-react";

export function VendorViewModal({ open, onClose, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all">
        {/* HEADER with gradient */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Vendor Details</h2>
            <p className="text-orange-100 text-sm mt-0.5">
              Complete vendor information and metrics
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-orange-50/30">
          {/* Profile Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {data.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">
                  {data.username}
                </h3>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail size={16} />
                  {data.email}
                </p>
                <div className="flex gap-3 mt-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      data.status
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {data.status ? "✓ Verified" : "✗ Not Verified"}
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                    {data.role?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Financial Stats */}
            <StatCard
              icon={Wallet}
              label="Current Balance"
              value={`₹ ${parseFloat(data.balance || 0).toLocaleString()}`}
              gradient="from-green-500 to-emerald-600"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Cash Received"
              value={`₹ ${parseFloat(data.cash_received || 0).toLocaleString()}`}
              gradient="from-blue-500 to-cyan-600"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              icon={Gift}
              label="Bonus Type"
              value={data.bonus_type || "N/A"}
              gradient="from-purple-500 to-pink-600"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />

            {/* Activity Info */}
            <InfoCard
              icon={Clock}
              label="Last Login"
              value={formatDate(data.last_login)}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />
            <InfoCard
              icon={Calendar}
              label="Account Created"
              value={formatDate(data.createdAt)}
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
            />
            <InfoCard
              icon={Activity}
              label="Account Status"
              value={data.status ? "Active & Verified" : "Pending Verification"}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />

            {/* System Info */}
            <InfoCard
              icon={Globe}
              label="IP Address"
              value={data.ip_address || "Not Available"}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
            />
            <InfoCard
              icon={Shield}
              label="User Role"
              value={data.role?.role || "Vendor"}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <InfoCard
              icon={MapPin}
              label="Location"
              value={
                data.location?.coordinates
                  ? `${data.location.coordinates[0].toFixed(4)}, ${data.location.coordinates[1].toFixed(4)}`
                  : "Not Set"
              }
              iconBg="bg-rose-100"
              iconColor="text-rose-600"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD (for financial/key metrics) ================= */
function StatCard({ icon: Icon, label, value, gradient, iconBg, iconColor }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconBg} p-3 rounded-lg ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

/* ================= INFO CARD (for general info) ================= */
function InfoCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div
          className={`${iconBg} p-2.5 rounded-lg ${iconColor} flex-shrink-0`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1.5">
            {label}
          </p>
          <p className="text-sm font-semibold text-gray-800 break-words">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */
function formatDate(date) {
  if (!date) return "Not Available";
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
