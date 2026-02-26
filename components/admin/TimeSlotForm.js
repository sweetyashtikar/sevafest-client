"use client";

import React from "react";
import { Trash2, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export const TimeSlotForm = React.memo(() => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex-1">
    <div className="bg-[#14948c] p-3">
      <h2 className="text-white font-medium text-sm">Select Time Slot</h2>
    </div>
    <div className="p-5 space-y-6 min-h-[400px]">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-600">
          Minimum Time Slot
        </label>
        <div className="relative">
          <input
            type="text"
            defaultValue="11:00"
            className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-teal-500"
          />
          <Clock className="absolute right-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-600">
          Maximum Time Slot
        </label>
        <div className="relative">
          <input
            type="text"
            defaultValue="11:00"
            className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-teal-500"
          />
          <Clock className="absolute right-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>
    </div>
    <div className="p-4">
      <button className="w-full bg-[#14948c] text-white py-2 rounded font-bold text-sm hover:bg-[#117a74] transition-colors">
        Add Time
      </button>
    </div>
  </div>
));

export const TimeSlotTable = React.memo(({ data }) => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex-[1.5]">
    <div className="bg-[#14948c] p-3">
      <h2 className="text-white font-medium text-sm">Time Slot</h2>
    </div>
    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
      <span className="text-xs text-gray-500">Show</span>
      <select className="border border-gray-300 rounded p-1 text-xs">
        <option>10</option>
      </select>
      <span className="text-xs text-gray-500">entries</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-[11px] font-bold text-gray-500 uppercase">
            <th className="px-4 py-3">ID ⇅</th>
            <th className="px-4 py-3">Minimum Time ⇅</th>
            <th className="px-4 py-3">Maximum Time ⇅</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((slot) => (
            <tr
              key={slot.id}
              className="border-b border-gray-50 hover:bg-gray-50"
            >
              <td className="px-4 py-4 text-gray-600">{slot.id}</td>
              <td className="px-4 py-4 text-gray-600">{slot.minTime}</td>
              <td className="px-4 py-4 text-gray-600">{slot.maxTime}</td>
              <td className="px-4 py-4 text-center">
                <button className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-4 flex justify-between items-center bg-white">
      <p className="text-xs text-gray-500">
        Showing 1 to {data.length} of {data.length} entries
      </p>
      <div className="flex gap-1">
        <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <button className="px-3 py-1 bg-[#14948c] text-white rounded text-sm font-medium">
          1
        </button>
        <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
));
