"use client";

import React from "react";
import {
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

export const AddFAQForm = React.memo(() => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex-1 self-start">
    <div className="bg-[#14948c] p-3">
      <h2 className="text-white font-medium text-sm">Add FAQ</h2>
    </div>
    <div className="p-5 space-y-4 min-h-[350px]">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          FAQ Question
        </label>
        <input
          type="text"
          placeholder="Enter FAQ Question"
          className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-teal-500 bg-white"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">
          FAQ Answer
        </label>
        <textarea
          rows="8"
          placeholder="Enter FAQ Answer"
          className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-teal-500 resize-none"
        ></textarea>
      </div>
    </div>
    <div className="p-4">
      <button className="w-full bg-[#14948c] text-white py-2 rounded font-bold text-sm hover:bg-[#117a74] transition-colors">
        Add FAQ
      </button>
    </div>
  </div>
));

export const ViewFAQTable = React.memo(({ data }) => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex-[1.5]">
    <div className="bg-[#14948c] p-3">
      <h2 className="text-white font-medium text-sm">View FAQ</h2>
    </div>

    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Show</span>
        <select className="border border-gray-300 rounded p-1 text-xs outline-none">
          <option>10</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button className="bg-[#14948c] text-white px-3 py-1.5 rounded flex items-center gap-1 text-xs hover:bg-[#117a74]">
          Export <span className="text-[10px]">▼</span>
        </button>
        <div className="flex items-center border border-gray-200 bg-gray-50 rounded px-2 py-1">
          <span className="text-xs text-gray-400 mr-2">Search:</span>
          <input
            type="text"
            className="bg-transparent outline-none text-xs w-28"
          />
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-[11px] font-bold text-gray-500 uppercase">
            <th className="px-4 py-3 border-r border-gray-100">ID ⇅</th>
            <th className="px-4 py-3 border-r border-gray-100">
              FAQ Question ⇅
            </th>
            <th className="px-4 py-3 border-r border-gray-100">FAQ Answer ⇅</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((faq) => (
            <tr
              key={faq.id}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-4 text-gray-600">{faq.id}</td>
              <td className="px-4 py-4 text-gray-700">{faq.question}</td>
              <td className="px-4 py-4 text-gray-500 text-xs">{faq.answer}</td>
              <td className="px-4 py-4">
                <div className="flex justify-center gap-2">
                  <button className="bg-orange-500 p-1.5 rounded text-white hover:bg-orange-600 shadow-sm">
                    <Edit3 size={14} />
                  </button>
                  <button className="bg-red-500 p-1.5 rounded text-white hover:bg-red-600 shadow-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
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
        <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 cursor-not-allowed">
          <ChevronLeft size={16} />
        </button>
        <button className="px-3 py-1 bg-[#14948c] text-white rounded text-sm font-bold">
          1
        </button>
        <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 cursor-not-allowed">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
));
