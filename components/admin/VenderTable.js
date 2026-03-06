'use client'
import React from "react";
import { Eye } from "lucide-react";



export function VenderTable({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onView,
  onStatusChange,
}) {
  return (
 <div className="bg-white rounded-2xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-black text-center">
            Vender Table List
          </h2>
        </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                >
                  {col.label}
                </th>
              ))}

              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {/* DYNAMIC COLUMNS */}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-gray-900"
                  >
                    {row[col.key]}
                  </td>
                ))}

                {/* STATUS SWITCH */}
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.status}
                      onChange={() => onStatusChange(row)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </td>

                {/* ACTION */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onView(row)}
                    className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4  bg-gray-50">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>

  );
}
