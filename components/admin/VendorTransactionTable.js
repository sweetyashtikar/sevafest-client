"use client";

import React from 'react';
import { Download, Plus, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const VendorTransactionTable = ({ data }) => {
  return (
    <div className="w-full bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden font-sans -ml-12">
      {/* Header Section */}
      <div className="bg-[#14948c] p-3 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg">View Seller List</h2>
        <button className="bg-white text-[#14948c] px-4 py-1.5 rounded flex items-center gap-2 text-sm font-bold hover:bg-gray-100 transition-all">
          <Plus size={18} strokeWidth={3} /> Add Fund Transfer
        </button>
      </div>

      {/* Filters Section */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-end text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">From - To Date:</span>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white">
            <Calendar size={14} className="mr-2 text-gray-400" />
            <input type="text" defaultValue="12/09/2025" className="outline-none text-xs w-20" />
          </div>
          <span className="text-gray-400">-</span>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white">
            <Calendar size={14} className="mr-2 text-gray-400" />
            <input type="text" defaultValue="12/09/2025" className="outline-none text-xs w-20" />
          </div>
          <button className="bg-[#333] text-white px-3 py-1 rounded text-xs ml-1 hover:bg-black transition-all">Clear</button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-gray-400">Filter by Seller:</label>
          <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none min-w-[120px]">
            <option>All Seller</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-gray-400">Filter by Method:</label>
          <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none min-w-[100px]">
            <option>All</option>
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs">Per Page:</span>
          <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
            <option>10</option>
            <option>25</option>
          </select>
          <button className="bg-[#14948c] text-white px-3 py-1.5 rounded flex items-center gap-2 text-xs hover:bg-[#117a74]">
            <Download size={14} /> Export ▾
          </button>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white">
            <span className="text-xs text-gray-400 mr-2">Search:</span>
            <input type="text" className="outline-none text-xs" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              {["ID", "Seller Name", "Order ID", "Order Item ID", "Product Name", "Variation", "Flag", "Amount", "Remark", "Date"].map((col) => (
                <th key={col} className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-r border-gray-50 last:border-r-0">
                  <div className="flex items-center gap-1">
                    {col} <span className="text-[8px] text-gray-300">⇅</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {data && data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.sellerName}</td>
                  <td className="px-4 py-3 text-gray-600">{row.orderId}</td>
                  <td className="px-4 py-3 text-gray-600">{row.orderItemId}</td>
                  <td className="px-4 py-3 text-gray-600">{row.productName}</td>
                  <td className="px-4 py-3 text-gray-600">{row.variation}</td>
                  <td className="px-4 py-3 text-gray-600">{row.flag}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{row.amount}</td>
                  <td className="px-4 py-3 text-gray-600 italic">{row.remark}</td>
                  <td className="px-4 py-3 text-gray-600">{row.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-10 text-center text-gray-400 italic">
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
        <p className="text-xs text-gray-500">Showing {data.length > 0 ? `1 to ${data.length}` : '0'} of {data.length} entries</p>
        <div className="flex gap-1">
          <button className="p-1.5 border border-gray-200 rounded text-gray-400 hover:bg-gray-50"><ChevronLeft size={16} /></button>
          <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default VendorTransactionTable;