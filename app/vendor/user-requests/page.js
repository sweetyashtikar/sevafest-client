"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function Page() {
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState("all");

  const handleReset = () => {
    setSearch("");
    setDate(today);
    setStatus("all");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-black mt-10">
          User Requests
        </h1>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by user name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border rounded-lg text-sm text-black
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* DATE */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm text-black
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* STATUS */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm text-black
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="processed">Processed</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* RESET */}
          <button
            onClick={handleReset}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      <div className="bg-white rounded-xl shadow-sm py-16 text-center">
        <p className="text-gray-600">
          No requests found for this pincode.
        </p>
      </div>
    </div>
  );
}
