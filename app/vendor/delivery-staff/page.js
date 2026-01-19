"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function Page() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">
          Delivery Staff
        </h1>

        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600"
        >
          Add new delivery person
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name / email / mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm text-black
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* TABLE / SKELETON */}
      <div className="bg-white rounded-xl border border-blue-300 overflow-hidden">
        <div className="p-6 space-y-5">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-8 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* PAGINATION BAR */}
        <div className="flex items-center justify-between bg-slate-800 px-6 py-3">
          <div className="h-8 w-40 bg-slate-600 rounded" />
          <div className="h-8 w-40 bg-slate-600 rounded" />
        </div>
      </div>
    </div>
  );
}
