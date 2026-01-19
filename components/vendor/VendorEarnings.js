"use client";

import { useState } from "react";

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <p className="text-sm text-gray-800 mb-2 font-medium">
        {title}
      </p>
      <p className="text-xl font-semibold text-black">
        {value ?? "..."}
      </p>
    </div>
  );
}

export default function VendorEarnings() {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-black mt-10">
        Earnings
      </h1>

      {/* DATE FILTER */}
      <div className="flex flex-wrap gap-6">
        <div>
          <label className="block text-sm text-black mb-1 font-medium">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-black
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-1 font-medium">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-black
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value="..." />
        <StatCard title="Total Amount" value="..." />
        <StatCard title="Total Commission" value="..." />
      </div>
    </div>
  );
}
