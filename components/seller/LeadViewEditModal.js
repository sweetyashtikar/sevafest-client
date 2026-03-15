"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  BadgeCheck,
  Pencil,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "@/services/apiClient";

export default function LeadViewEditModal({ isOpen, onClose, lead, refresh }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        mobile: lead.mobile || "",
        email: lead.email || "",
        status: lead.status || "",
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  const handleUpdate = async () => {
    try {
      if (form.status !== lead.status) {
        const res = await apiClient(`/lead/${lead._id}/status`, {
          method: "PATCH",
          body: {
            status: form.status,
          },
        });

        if (res.success) {
          toast.success("Lead status updated successfully");
        }
      }

      if (
        form.name !== lead.name ||
        form.mobile !== lead.mobile ||
        form.email !== lead.email
      ) {
        const res = await apiClient(`/lead/${lead._id}`, {
          method: "PUT",
          body: {
            name: form.name,
            mobile: form.mobile,
            email: form.email,
          },
        });

        if (res.success) {
          toast.success("Lead details updated successfully");
        }
      }

      setEditMode(false);
      refresh();
      onClose();
    } catch (err) {
      toast.error("Failed to update lead");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative bg-white w-full h-full md:h-auto md:max-w-xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all transform animate-in slide-in-from-bottom-10 duration-500">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#1a1c24] tracking-tight">
                {editMode ? "Edit Profile" : "Lead Profile"}
              </h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Lead ID: #88291
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="hidden md:block p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
          >
            <X className="text-gray-600" size={18} />
          </button>
        </div>

        {/* BODY - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* NAME FIELD */}
          <div className="relative group">
            <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-bold text-gray-500 uppercase tracking-widest transition-all group-focus-within:text-[#fcc221]">
              Full Name
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 border-2 border-gray-100 rounded-2xl group-focus-within:border-[#fdd835] transition-all bg-gray-50/30">
              <User
                size={18}
                className="text-gray-400 group-focus-within:text-[#fcc221]"
              />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Enter customer name"
                className="w-full bg-transparent text-black font-semibold outline-none disabled:text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MOBILE FIELD */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-bold text-gray-500 uppercase tracking-widest transition-all group-focus-within:text-[#fcc221]">
                Mobile
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 border-2 border-gray-100 rounded-2xl group-focus-within:border-[#fdd835] transition-all bg-gray-50/30">
                <Phone
                  size={18}
                  className="text-gray-400 group-focus-within:text-[#fcc221]"
                />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-transparent text-black font-semibold outline-none"
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-bold text-gray-500 uppercase tracking-widest transition-all group-focus-within:text-[#fcc221]">
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 border-2 border-gray-100 rounded-2xl group-focus-within:border-[#fdd835] transition-all bg-gray-50/30">
                <Mail
                  size={18}
                  className="text-gray-400 group-focus-within:text-[#fcc221]"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-transparent text-black font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* STATUS FIELD */}
          <div className="relative group">
            <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-bold text-gray-500 uppercase tracking-widest transition-all group-focus-within:text-[#fcc221]">
              Lead Status
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 border-2 border-gray-100 rounded-2xl group-focus-within:border-[#fdd835] transition-all bg-gray-50/30">
              <BadgeCheck
                size={18}
                className="text-gray-400 group-focus-within:text-[#fcc221]"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full bg-transparent text-black font-semibold outline-none appearance-none cursor-pointer"
              >
                <option value="new">New Inquiry</option>
                <option value="contacted">Contacted</option>
                <option value="meeting_scheduled">Meeting Scheduled</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50/50">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#fdd835] hover:bg-[#ebc72e] text-black font-bold rounded-2xl shadow-xl shadow-[#fdd835]/30 transition-all active:scale-[0.98]"
            >
              <Pencil size={18} />
              Edit This Lead
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-bold rounded-2xl shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
