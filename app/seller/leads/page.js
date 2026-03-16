"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LeadViewEditModal from "@/components/seller/LeadViewEditModal";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const query = statusFilter
        ? `/lead?page=${page}&status=${statusFilter}`
        : `/lead?page=${page}`;

      const res = await apiClient(query);

      if (res.success) {
        setLeads(res.data.leads);
        setPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await apiClient(`/lead/${id}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Lead deleted successfully");
        fetchLeads();
      }
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1c24]">Leads Management</h1>

        <button
          onClick={() => router.push("/seller/leads/create")}
          className="flex items-center gap-2 px-5 py-3 bg-[#fdd835] text-[#1a1c24] font-semibold rounded-lg hover:bg-[#fcc221] transition"
        >
          <Plus size={18} />
          Add New Lead
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        {/* SEARCH */}
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

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-black outline-none
          focus:ring-2 focus:ring-[#fdd835] focus:border-[#fdd835]"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="meeting_scheduled">Meeting Scheduled</option>
          <option value="proposal_sent">Proposal Sent</option>
          <option value="negotiation">Negotiation</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1c24]">All Leads</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading leads...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Mobile</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-[#1a1c24]">
                        {lead.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">{lead.mobile}</td>

                      <td className="px-6 py-4 text-gray-600">{lead.email}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold
                        ${
                          lead.status === "new"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.status === "contacted"
                              ? "bg-blue-100 text-blue-700"
                              : lead.status === "meeting_scheduled"
                                ? "bg-purple-100 text-purple-700"
                                : lead.status === "proposal_sent"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : lead.status === "negotiation"
                                    ? "bg-orange-100 text-orange-700"
                                    : lead.status === "converted"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                        }`}
                        >
                          {lead.status
                            .replaceAll("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </td>

                      <td className="px-6 py-4 flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 px-2 gap-4">
        <div className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          Showing <span className="text-black">Page {page}</span> of{" "}
          <span className="text-black">{pages}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-700 shadow-sm
             hover:border-[#fdd835] hover:text-black transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
          >
            <ChevronLeft size={18} />
            Prev
          </button>

          <div className="hidden md:flex h-9 w-9 items-center justify-center bg-[#fdd835] text-black font-black rounded-xl shadow-lg shadow-[#fdd835]/30 ring-2 ring-white">
            {page}
          </div>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-700 shadow-sm hover:border-[#fdd835]
             hover:text-black transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <LeadViewEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        refresh={fetchLeads}
      />
    </div>
  );
}
