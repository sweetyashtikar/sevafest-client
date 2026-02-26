"use client";

import React from "react";
import { Eye, Edit, Trash2, Menu, Dot, MoreVertical } from "lucide-react";

export function OrderTable({
  data = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onAssign
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-black text-center">
          Order Table
        </h2>
      </div>      {/* ===== TABLE ===== */}
      <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Order No
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Delivery boy
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-black">
                  {row.order_id?.order_number}
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  <div className="font-medium">
                    {row.user_id?.username}
                  </div>
                  <div className="text-xs text-gray-600">
                    {row.user_id?.email}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  <div className="font-medium">
                    {row.product_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {row.variant_name}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  {row.quantity}
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  ₹ {row.sub_total}
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  {row.order_details?.delivery_info?.boy_name || '-'}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === "processed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  {`${row.order_id.payment?.method} / ${row.order_id.payment?.status}`}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(row)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onAssign(row)}
                      className="p-2 rounded-lg text-orange-600 hover:bg-orange-50"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* <button
                      onClick={() => onDelete(row)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
        <p className="text-sm text-black">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="
              px-3 py-1.5
              border rounded-lg text-sm
              text-black
              disabled:opacity-40
              hover:bg-gray-100
            "
          >
            Previous
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="
              px-3 py-1.5
              border rounded-lg text-sm
              text-black
              disabled:opacity-40
              hover:bg-gray-100
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>

  );
}