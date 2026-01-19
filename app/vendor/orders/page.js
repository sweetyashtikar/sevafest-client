"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setMethod("");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-black mt-10">
        My Orders
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4">
        {/* SEARCH */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by customer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-64 border rounded-lg text-sm text-black
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm text-black
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="cancelled">Cancelled</option>
          <option value="delivered">Delivered</option>
        </select>

        {/* METHOD */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm text-black
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Method</option>
          <option value="cod">Cash on Delivery</option>
          <option value="online">Online Payment</option>
        </select>

        {/* RESET */}
        <button
          onClick={handleReset}
          className="ml-auto bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          Reset filtering
        </button>
      </div>

      {/* TABLE / SKELETON */}
      <div className="bg-white rounded-xl border border-blue-300 overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* PAGINATION BAR */}
        <div className="flex items-center justify-between bg-slate-800 px-6 py-3">
          <div className="h-8 w-32 bg-slate-600 rounded" />
          <div className="h-8 w-32 bg-slate-600 rounded" />
        </div>
      </div>
    </div>
  );
}
