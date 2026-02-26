"use client";

import { X, User, Shield, MapPin, Wallet, Calendar, Mail, Phone, Globe } from "lucide-react";

export default function UserViewModal({ user, onClose }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 sm:p-6">
      {/* Prime Modal Container */}
      <div className="bg-white w-[90%] h-[90%] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        {/* Header: Gradient Touch */}
        <div className="relative px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black tracking-tight">{user.username}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                  {user.role?.role || "Member"}
                </span>
                <span className={`h-2 w-2 rounded-full ${user.status ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-xs text-gray-500 font-medium">{user.status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfc] p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Quick Stats & Financials */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Wallet size={14} /> Financial Summary
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Available Balance</p>
                    <p className="text-3xl font-black text-black">₹{user.balance.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Total Cash Received</p>
                    <p className="text-xl font-bold text-gray-800">₹{user.cash_received.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   System Info
                </h3>
                <div className="space-y-3">
                  <InfoRow icon={<Globe size={14}/>} label="IP Address" value={user.ip_address} />
                  <InfoRow icon={<Shield size={14}/>} label="Permissions" value={user.role?.can_manage_products ? "Full Access" : "Restricted"} />
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Info Sections */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Contact & Personal */}
              <section>
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                   Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ContactCard icon={<Mail className="text-blue-500"/>} label="Email Address" value={user.email} />
                  <ContactCard icon={<Phone className="text-green-500"/>} label="Mobile Number" value={user.mobile || "Not Linked"} />
                </div>
              </section>

              {/* Logistics & Location */}
              <section className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" /> Service & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailBox label="Coordinates" value={`${user.location?.coordinates[1]}° N, ${user.location?.coordinates[0]}° E`} />
                  <DetailBox label="Zipcodes" value={user.serviceable_zipcodes?.length > 0 ? user.serviceable_zipcodes.join(', ') : "Global Access"} />
                </div>
              </section>

              {/* Activity & Timestamps */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Member Since</p>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatDate(user.createdAt)}</p>
                 </div>
                 <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <p className="text-[10px] font-bold text-purple-400 uppercase">Last Seen</p>
                    <p className="text-sm font-bold text-purple-900 mt-1">{formatDate(user.last_login)}</p>
                 </div>
              </section>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-gray-100 flex justify-end items-center gap-4">
           <p className="text-xs text-gray-400 font-medium mr-auto italic">Data is encrypted and secure.</p>
           <button
            onClick={onClose}
            className="px-8 py-3 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components for a cleaner code structure
function ContactCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</p>
        <p className="text-sm font-bold text-black">{value}</p>
      </div>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 flex items-center gap-2">{icon} {label}</span>
      <span className="font-bold text-black">{value}</span>
    </div>
  );
}