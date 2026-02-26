"use client";

import React from 'react';
import StockTable from '@/components/admin/StockTable'; 

const ViewStockManagement = () => {
  
  const dummyStockData = [
    { id: 1, name: "Everest Turmeric Powder/Haldi abcde", seller: "Pratik Store", image: "https://via.placeholder.com/40", variation: "100g", stock: "14", status: "Published" },
    { id: 2, name: "Everest Turmeric Powder/Haldi abcde", seller: "Pratik Store", image: "https://via.placeholder.com/40", variation: "200g", stock: "156", status: "Published" },
    { id: 3, name: "Maggi 2 - Minute Instant Noodles (Pack of 12)", seller: "Chirag store", image: "https://via.placeholder.com/40", variation: "840 g (12 x 70 g)", stock: "134", status: "Published" },
    { id: 4, name: "Everest Tikhalal Red Chilli Powder", seller: "Pratik Store", image: "https://via.placeholder.com/40", variation: "100g", stock: "Unlimited", status: "Published" },
    { id: 5, name: "Everest Tikhalal Red Chilli Powder", seller: "Pratik Store", image: "https://via.placeholder.com/40", variation: "200g", stock: "Unlimited", status: "Published" },
    { id: 6, name: "Everest Tikhalal Red Chilli Powder", seller: "Pratik Store", image: "https://via.placeholder.com/40", variation: "500g", stock: "Unlimited", status: "Published" },
  ];

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-[1400px] mx-auto bg-white rounded shadow-sm border border-gray-200">
        
        {/* Header */}
        <div className="bg-teal-600 p-3 rounded-t">
          <h2 className="text-white font-semibold text-sm uppercase">View Stock Management</h2>
        </div>

        {/* Filters Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {["Category", "Sellers", "Status", "Stock"].map((label) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Filter By {label}</label>
                <select className="border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-teal-500 outline-none">
                  <option>All {label}</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Show</span>
              <select className="border border-gray-300 rounded p-1 text-xs">
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-teal-600 text-white text-xs px-3 py-1.5 rounded hover:bg-teal-700 transition-colors">
                Export ▾
              </button>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">Search:</span>
                <input type="text" className="border border-gray-200 bg-gray-50 rounded px-2 py-1 text-xs outline-none focus:border-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Component Calling */}
        <StockTable data={dummyStockData} />

        {/* Pagination Footer */}
        <div className="p-4 flex justify-between items-center border-t border-gray-100 text-[12px] text-gray-500">
          <p>Showing 1 to 6 of 6 entries</p>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">&lt;</button>
            <button className="px-3 py-1 bg-teal-600 text-white rounded">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewStockManagement;