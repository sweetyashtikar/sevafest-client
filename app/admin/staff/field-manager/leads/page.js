"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const fieldManager = searchParams.get("field_manager");

  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await apiClient(`/lead/admin?field_manager=${fieldManager}`);

      if (res.success) {
        setLeads(res.data.leads);
        setFiltered(res.data.leads);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fieldManager) fetchLeads();
  }, [fieldManager]);

  // SEARCH
  useEffect(() => {
    const result = leads.filter((lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(result);
    setPage(1);
  }, [search, leads]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  const pages = Math.ceil(filtered.length / limit);

  const statusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-700";
      case "contacted":
        return "bg-blue-100 text-blue-700";
      case "meeting_scheduled":
        return "bg-purple-100 text-purple-700";
      case "proposal_sent":
        return "bg-indigo-100 text-indigo-700";
      case "negotiation":
        return "bg-orange-100 text-orange-700";
      case "converted":
        return "bg-green-100 text-green-700";
      case "lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 -ml-15">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-[#1a1c24] mb-6">
        Field Manager Leads
      </h1>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Total Leads</p>
            <h2 className="text-2xl font-bold text-[#1a1c24]">
              {stats.totalLeads}
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Unique Managers</p>
            <h2 className="text-2xl font-bold text-[#1a1c24]">
              {stats.uniqueFieldManagers}
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">New Leads</p>
            <h2 className="text-2xl font-bold text-[#1a1c24]">
              {stats.statusBreakdown?.new || 0}
            </h2>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-black
            focus:ring-2 focus:ring-[#fdd835] focus:border-[#fdd835]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1c24]">Leads List</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading leads...</div>
        ) : paginated.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Mobile</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-[#1a1c24]">
                      {lead.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{lead.mobile}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {lead.email || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${statusColor(
                          lead.status,
                        )}`}
                      >
                        {lead.status.replaceAll("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-8 px-2">
          <div className="hidden sm:block text-sm font-bold text-gray-500 uppercase tracking-wider">
            Page <span className="text-[#1a1c24]">{page}</span> of{" "}
            <span className="text-[#1a1c24]">{pages}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-700 shadow-sm transition-all
        hover:border-[#fdd835] hover:bg-gray-50 active:scale-95
        disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
            >
              <ChevronLeft size={18} />
              Prev
            </button>

            <div className="flex h-10 w-10 items-center justify-center bg-[#fdd835] text-black font-black rounded-xl shadow-lg shadow-[#fdd835]/30 ring-2 ring-white">
              {page}
            </div>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-700 shadow-sm transition-all
        hover:border-[#fdd835] hover:bg-gray-50 active:scale-95
        disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
