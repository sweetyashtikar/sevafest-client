"use client";

import { TimeSlotForm, TimeSlotTable } from "@/components/admin/TimeSlotForm";

export default function TimeslotPage() {
  
  const slotsData = [
    { id: 1, minTime: "11:00", maxTime: "12:00" },
    { id: 2, minTime: "13:00", maxTime: "15:00" },
    { id: 3, minTime: "15:00", maxTime: "18:00" },
    { id: 4, minTime: "19:00", maxTime: "22:00" },
  ];

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Timeslot</h1>
          <nav className="text-xs text-gray-400">
            <span className="hover:text-teal-600 cursor-pointer">Home</span> /
            <span className="text-teal-600 ml-1 font-semibold">Timeslot</span>
          </nav>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          <TimeSlotForm />
          <TimeSlotTable data={slotsData} />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-[10px] text-gray-400">
          Copyright © 2026. Developed By{" "}
          <span className="text-[#14948c] font-bold">
            Appzeto - 10 Minute App
          </span>
        </footer>
      </div>
    </div>
  );
}
