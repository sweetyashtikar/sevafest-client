"use client";

import React from "react";
import { Eye, Trash2 } from "lucide-react";

export function CustomersTable({
  customers = [],
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onDelete,
  loading = false,
}) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden text-black">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="h-10 w-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-black text-center">
            Product Table List
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Joining Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {customers.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-black">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-black">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-black">
                      {row.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-black">
                      {row.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-black">
                      {row.balance}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onView(row)}
                        className="w-8 h-8 text-blue-600 hover:bg-green-50 rounded-lg mr-2"
                      >
                        <Eye size={18} />
                      </button>
                      {/* <button
                      onClick={() => onDelete(row.id)}
                      className="w-8 h-8 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          </div>
        )}
      </div>
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 text-black">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "border text-black"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
