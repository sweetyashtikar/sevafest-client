"use client";

import React from "react";
import { Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";

export const NotificationForm = React.memo(() => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex-1 self-start">
    <div className="bg-[#e65100] p-3">
      <h2 className="text-white font-medium text-sm">Send Notification</h2>
    </div>
    <div className="p-5 space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Select User Type
        </label>
        <select className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white">
          <option>For All User</option>
          <option>For Specific User</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Title"
          className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          Description
        </label>
        <textarea
          rows="6"
          placeholder="Enter Description"
          className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none"
        ></textarea>
      </div>
    </div>
    <div className="p-4">
      <button className="w-full bg-[#e65100] text-white py-2 rounded font-bold text-sm hover:bg-[#bf4300] transition-colors uppercase tracking-wider">
        Send Notification
      </button>
    </div>
  </div>
));

export const NotificationTable = React.memo(({ data }) => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex-[1.8]">
    <div className="p-4 border-b border-gray-100">
      <h2 className="text-gray-700 font-bold text-base mb-4">
        View Notification
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Show System Generated
          </span>
          <select className="border border-gray-300 rounded p-1 text-xs">
            <option>No</option>
            <option>Yes</option>
          </select>
          <select className="border border-gray-300 rounded p-1 text-xs ml-2">
            <option>10</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#e65100] text-white px-3 py-1.5 rounded flex items-center gap-1 text-xs font-medium hover:bg-[#bf4300]">
            Export <span className="text-[10px]">▼</span>
          </button>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded px-2 py-1">
            <span className="text-xs text-gray-400 mr-2">Search:</span>
            <input
              type="text"
              className="bg-transparent outline-none text-xs w-24"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-[11px] font-bold text-gray-500 uppercase">
            <th className="px-4 py-3">Sr No ⇅</th>
            <th className="px-4 py-3">Users ⇅</th>
            <th className="px-4 py-3">Title ⇅</th>
            <th className="px-4 py-3">Description ⇅</th>
            <th className="px-4 py-3">Date ⇅</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-4 text-gray-600">{index + 1}</td>
              <td className="px-4 py-4 text-gray-600 font-medium">
                {item.users}
              </td>
              <td className="px-4 py-4 text-gray-600">{item.title}</td>
              <td className="px-4 py-4 text-gray-500 text-xs max-w-xs truncate">
                {item.description}
              </td>
              <td className="px-4 py-4 text-gray-500 text-[11px] leading-tight">
                {item.date}
              </td>
              <td className="px-4 py-4 text-center">
                <button className="bg-[#e65100] p-1.5 rounded text-white hover:bg-[#bf4300] transition-all shadow-sm">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
      <p className="text-xs text-gray-500 italic">
        Showing 1 to {data.length} of {data.length} entries
      </p>
      <div className="flex gap-1 items-center">
        <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <button className="px-3 py-1 bg-[#e65100] text-white rounded text-sm font-bold shadow-sm">
          1
        </button>
        <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
));
