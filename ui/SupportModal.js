"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headset,
  X,
  MessageCircle,
  Mail,
  ChevronRight,
  Search,
  PhoneCall,
  HelpCircle,
  MessageSquare,
  FileText,
  ArrowUpRight,
} from "lucide-react";

export function SupportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("general");

  const faqs = [
    {
      q: "How to track my order?",
      a: "Go to 'My Orders' and click on the track button.",
    },
    {
      q: "What is the return policy?",
      a: "You can return products within 7 days of delivery.",
    },
    {
      q: "Payment issues?",
      a: "We support UPI, Cards, and Net Banking for all transactions.",
    },
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed inset-0 m-auto w-[90%] h-[90%] md:w-[85%] md:h-[85%] bg-white rounded-[2.5rem] shadow-2xl z-[1000] overflow-hidden flex flex-col md:flex-row border border-white/20"
          >
            <div className="w-full md:w-80 bg-[#1a1c24] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[#fdd835] mb-10">
                  <div className="p-3 bg-[#fdd835]/10 rounded-2xl border border-[#fdd835]/20">
                    <Headset size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white leading-tight">
                      Support Center
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                      Available 24/7
                    </p>
                  </div>
                </div>

                <nav className="space-y-3">
                  <SidebarItem
                    icon={<HelpCircle size={20} />}
                    label="General FAQs"
                    active={activeTab === "general"}
                    onClick={() => setActiveTab("general")}
                  />
                  <SidebarItem
                    icon={<MessageSquare size={20} />}
                    label="Live Chat"
                    active={activeTab === "chat"}
                    onClick={() => setActiveTab("chat")}
                  />
                  <SidebarItem
                    icon={<FileText size={20} />}
                    label="Policies"
                    active={activeTab === "policy"}
                    onClick={() => setActiveTab("policy")}
                  />
                </nav>
              </div>

              {/* Emergency Contact */}
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:border-[#fdd835]/50 transition-all cursor-pointer">
                <p className="text-[#fdd835] text-[10px] uppercase font-black tracking-widest mb-2 opacity-80">
                  Helpline
                </p>
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-[#fdd835] rounded-lg text-black">
                    <PhoneCall size={16} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">
                    +91 9529209142
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#fcfcfc] flex flex-col overflow-hidden">
              <div className="p-6 flex justify-end items-center bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Press ESC to close
                  </span>

                  <button
                    onClick={onClose}
                    className="group p-3 bg-gray-50 hover:bg-red-50 rounded-2xl transition-all duration-300 border
                     border-gray-100 hover:border-red-100 shadow-sm"
                  >
                    <X
                      size={20}
                      className="text-gray-400 group-hover:text-red-500 group-hover:rotate-90 transition-all duration-300"
                    />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto"
                >
                  {activeTab === "general" && (
                    <>
                      <div className="mb-10">
                        <h3 className="text-4xl font-black text-[#1a1c24] mb-3">
                          Hello, how can we help?
                        </h3>
                        <p className="text-gray-500 text-lg">
                          Search our knowledge base or contact our team.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <QuickAction
                          icon={<Mail size={22} className="text-black" />}
                          title="Email Ticket"
                          sub="Get reply in 12 hours"
                        />
                        <QuickAction
                          icon={
                            <MessageCircle size={22} className="text-black" />
                          }
                          title="WhatsApp Chat"
                          sub="Connect instantly"
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2">
                          Most Read Articles
                        </h4>
                        <div className="grid gap-3">
                          {faqs.map((faq, i) => (
                            <div
                              key={i}
                              className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#fdd835] hover:shadow-xl 
                              hover:shadow-gray-200/40 transition-all cursor-pointer flex justify-between items-center"
                            >
                              <p className="font-bold text-[#1a1c24]">
                                {faq.q}
                              </p>
                              <div
                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center
                               group-hover:bg-[#fdd835] transition-colors"
                              >
                                <ChevronRight
                                  size={16}
                                  className="text-gray-400 group-hover:text-black"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "chat" && (
                    <div className="text-center py-20 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-[#fdd835]/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12">
                          <MessageSquare
                            size={44}
                            className="text-[#fdd835] -rotate-12"
                          />
                        </div>
                        <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 border-4 border-white rounded-full" />
                      </div>
                      <h3 className="text-3xl font-black mb-3 text-[#1a1c24]">
                        Agents are Busy
                      </h3>
                      <p className="text-gray-500 max-w-xs mx-auto mb-10 font-medium">
                        Our support ninjas are currently helping other users.
                        Average wait time: 15 mins.
                      </p>
                      <button className="px-10 py-4 bg-[#fdd835] text-black rounded-2xl font-black shadow-lg shadow-[#fdd835]/30 hover:shadow-[#fdd835]/50 hover:-translate-y-1 transition-all flex items-center gap-2">
                        Start Anyway <ArrowUpRight size={20} />
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
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
        active
          ? "bg-[#fdd835] text-black shadow-lg shadow-[#fdd835]/20 scale-[1.02]"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
      }`}
    >
      <span className={active ? "text-black" : "text-[#fdd835]"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function QuickAction({ icon, title, sub }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 hover:border-[#fdd835] hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group">
      <div className="w-14 h-14 bg-[#fdd835] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="font-extrabold text-[#1a1c24] text-lg leading-tight">
          {title}
        </p>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">
          {sub}
        </p>
      </div>
    </div>
  );
}
