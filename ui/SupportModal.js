"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Headset, X, MessageCircle, Mail, 
  ChevronRight, Search, PhoneCall, HelpCircle,
  MessageSquare, FileText
} from "lucide-react";

export function SupportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("general");


  const faqs = [
    { q: "How to track my order?", a: "Go to 'My Orders' and click on the track button." },
    { q: "What is the return policy?", a: "You can return products within 7 days of delivery." },
    { q: "Payment issues?", a: "We support UPI, Cards, and Net Banking for all transactions." }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[999]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-[90%] h-[90%] bg-white rounded-[2.5rem] shadow-2xl z-[1000] overflow-hidden flex flex-col md:flex-row border border-white/20"
          >
            {/* --- LEFT SIDEBAR (Premium Dark Look) --- */}
            <div className="w-full md:w-80 bg-slate-900 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-blue-400 mb-10">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <Headset size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Help Center</h2>
                </div>

                <nav className="space-y-2">
                  <SidebarItem 
                    icon={<HelpCircle size={20}/>} 
                    label="General FAQs" 
                    active={activeTab === "general"} 
                    onClick={() => setActiveTab("general")} 
                  />
                  <SidebarItem 
                    icon={<MessageSquare size={20}/>} 
                    label="Live Chat" 
                    active={activeTab === "chat"} 
                    onClick={() => setActiveTab("chat")} 
                  />
                  <SidebarItem 
                    icon={<FileText size={20}/>} 
                    label="Privacy Policy" 
                    active={activeTab === "policy"} 
                    onClick={() => setActiveTab("policy")} 
                  />
                </nav>
              </div>

              <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700">
                <p className="text-slate-400 text-xs uppercase font-black tracking-widest mb-2">Emergency</p>
                <div className="flex items-center gap-3 text-white">
                  <PhoneCall size={18} className="text-green-400" />
                  <span className="font-bold">+91 9529209142</span>
                </div>
              </div>
            </div>

            {/* --- RIGHT CONTENT AREA --- */}
            <div className="flex-1 bg-[#f8fafc] flex flex-col">
              {/* Header */}
              <div className="p-6 flex justify-between items-center border-b border-slate-100 bg-white">
                <div className="relative w-full max-w-md hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search for help..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-3xl mx-auto"
                >
                  {activeTab === "general" && (
                    <>
                      <h3 className="text-3xl font-black text-slate-800 mb-2">How can we help?</h3>
                      <p className="text-slate-500 mb-10">Select a category or find answers to common questions below.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <QuickAction icon={<Mail className="text-blue-500" />} title="Email Support" sub="Response in 24h" />
                        <QuickAction icon={<MessageCircle className="text-green-500" />} title="WhatsApp" sub="Instant Reply" />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Popular Questions</h4>
                        {faqs.map((faq, i) => (
                          <div key={i} className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer shadow-sm">
                            <div className="flex justify-between items-center">
                              <p className="font-bold text-slate-700">{faq.q}</p>
                              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === "chat" && (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare size={40} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Live Chat is Offline</h3>
                      <p className="text-slate-500 mb-8">Our agents are available from 10 AM to 8 PM IST.</p>
                      <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                        Leave a Message
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- HELPER COMPONENTS ---

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-semibold ${
        active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function QuickAction({ icon, title, sub }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-all cursor-pointer">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 font-medium">{sub}</p>
      </div>
    </div>
  );
}