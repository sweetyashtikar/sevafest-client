"use client";

import React from 'react';

const StockTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["Variation Id", "Name", "Seller", "Image", "Variation", "Stock", "Status"].map((header) => (
              <th key={header} className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer">
                  {header}
                  <span className="text-[10px] text-gray-400">⇅</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 text-sm text-gray-700">{item.id}</td>
              <td className="px-4 py-4 text-sm text-gray-700 font-medium">{item.name}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{item.seller}</td>
              <td className="px-4 py-4">
                <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                   <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">{item.variation}</td>
              <td className="px-4 py-4">
                {item.stock === "Unlimited" ? (
                  <span className="px-2 py-1 text-[10px] font-bold bg-teal-50 text-teal-600 rounded-full border border-teal-100 uppercase">
                    Unlimited
                  </span>
                ) : (
                  <span className="text-sm text-gray-700">{item.stock}</span>
                )}
              </td>
              <td className="px-4 py-4">
                <span className="px-2 py-1 text-[10px] font-bold bg-teal-50 text-teal-600 rounded-full border border-teal-100 uppercase">
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;