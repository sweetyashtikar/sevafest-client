"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "@/services/apiClient";
import {
  Plus,
  Upload,
  User,
  Phone,
  Mail,
  FileText,
  Database,
} from "lucide-react";

export default function Page() {
  const [tab, setTab] = useState("single");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    status: "new",
  });

  const [bulkJson, setBulkJson] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleSubmit = async () => {
    if (!form.name || !form.mobile) {
      toast.error("Name and mobile are required");
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient("/lead", {
        method: "POST",
        body: form,
      });

      if (res.success) {
        toast.success("Lead created successfully");

        setForm({
          name: "",
          mobile: "",
          email: "",
          status: "new",
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to create lead";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    try {
      setLoading(true);

      const parsed = JSON.parse(bulkJson);

      const res = await apiClient("/lead/bulk", {
        method: "POST",
        body: parsed,
      });

      if (res.success) {
        toast.success("Bulk leads created successfully");
        setBulkJson("");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid JSON format or API error";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1a1c24] tracking-tight">
            Lead Management
          </h1>
          <p className="text-gray-500 mt-1">
            Add new prospects to your pipeline
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex p-1 bg-gray-200/50 rounded-xl w-fit mb-8">
          <button
            onClick={() => setTab("single")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all duration-200 ${
              tab === "single"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={18} />
            Single Lead
          </button>
          <button
            onClick={() => setTab("bulk")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all duration-200 ${
              tab === "bulk"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Database size={18} />
            Bulk Import
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* SINGLE LEAD FORM */}
          {tab === "single" && (
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <User size={14} className="text-gray-400" /> Customer Name
                    </label>
                    <input
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#fdd835] focus:bg-white outline-none transition-all text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" /> Mobile
                      Number
                    </label>
                    <input
                      name="mobile"
                      placeholder="+91 00000 00000"
                      value={form.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#fdd835] focus:bg-white outline-none transition-all text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" /> Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#fdd835] focus:bg-white outline-none transition-all text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" /> Lead
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#fdd835] focus:bg-white outline-none transition-all text-black appearance-none"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="meeting_scheduled">
                        Meeting Scheduled
                      </option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <button
                    onClick={handleSingleSubmit}
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#fdd835] hover:bg-[#ebc72e] text-black font-bold rounded-xl shadow-lg shadow-[#fdd835]/30 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <Plus size={20} /> Save Lead Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BULK LEAD FORM */}
          {tab === "bulk" && (
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all">
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700">
                      Paste JSON Configuration
                    </label>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      JSON Format Required
                    </span>
                  </div>

                  <textarea
                    rows={12}
                    value={bulkJson}
                    onChange={(e) => setBulkJson(e.target.value)}
                    placeholder={`{\n  "leads": [\n    {\n      "name": "Example Lead",\n      "mobile": "9876543210",\n      "status": "new"\n    }\n  ]\n}`}
                    className="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-xl text-green-400 font-mono text-sm focus:ring-2 focus:ring-[#fdd835] outline-none transition-all shadow-inner"
                  />

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Ensure your JSON follows the exact
                      schema to avoid import errors.
                    </p>
                  </div>

                  <button
                    onClick={handleBulkSubmit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-[#fdd835] hover:bg-[#ebc72e] text-black font-bold rounded-xl shadow-lg shadow-[#fdd835]/30 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <Upload size={20} /> Import Bulk Leads
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
