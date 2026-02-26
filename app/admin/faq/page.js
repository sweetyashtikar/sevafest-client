"use client";

import { AddFAQForm, ViewFAQTable } from '@/components/admin/FAQComponents';

export default function FAQPage() {
  
  const faqData = [
    { id: 1, question: "question 1", answer: "answer 1" },
    { id: 4, question: "dgsdz", answer: "zdgzdqqqqqqqqqqqq" },
  ];

  return (
    <div className="p-6 bg-[#f4f7f6] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
       
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">FAQ</h1>
          <nav className="text-xs text-gray-400">
            <span className="hover:text-teal-600 cursor-pointer">Home</span> / 
            <span className="text-teal-600 ml-1 font-semibold">Dashboard</span>
          </nav>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <AddFAQForm />
          <ViewFAQTable data={faqData} />
        </div>

        <footer className="mt-16 text-center text-[11px] text-gray-400 border-t border-gray-200 pt-4">
          Copyright © 2026. Developed By <span className="text-[#14948c] font-bold">Seva Fast - 10 Minute App</span>
        </footer>
      </div>
    </div>
  );
}