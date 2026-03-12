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
  onAssign,
  isActiveStatus = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border w-full max-w-full overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-black text-center">
          Order Table List
        </h2>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Order No</th>
              <th className="px-6 py-4 text-left font-bold">Customer</th>
              <th className="px-6 py-4 text-left font-bold">Product</th>
              <th className="px-6 py-4 text-left font-bold">Qty</th>
              <th className="px-6 py-4 text-left font-bold">Price</th>
              <th className="px-6 py-4 text-left font-bold">Delivery boy</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold">Payment Status</th>
              <th className="px-6 py-4 text-left font-bold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {row.order_id?.order_number}
                </td>

                <td className="px-6 py-4 text-black">
                  <div className="font-medium">{row.user_id?.username}</div>
                  <div className="text-xs text-gray-600 break-all">
                    {row.user_id?.email}
                  </div>
                </td>

                <td className="px-6 py-4 text-black">
                  <div className="font-medium break-words">
                    {row.product_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {row.variant_name}
                  </div>
                </td>

                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {row.quantity}
                </td>

                <td className="px-6 py-4 text-black whitespace-nowrap">
                  ₹ {row.sub_total}
                </td>

                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {row.order_details?.delivery_info?.boy_name || "-"}
                </td>

                <td className="px-6 py-4">
                  {isActiveStatus ? (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        row.status === "processed"
                          ? "bg-green-100 text-green-700"
                          : row.status === "assigned"
                            ? "bg-purple-100 text-purple-700"
                            : row.status === "picked_up"
                              ? "bg-indigo-100 text-indigo-700"
                              : row.status === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : row.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : row.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : row.status === "returned"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status
                        ?.replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
    ${
      row.active_status === "processed"
        ? "bg-blue-100 text-blue-700"
        : row.active_status === "assigned"
          ? "bg-purple-100 text-purple-700"
          : row.active_status === "picked_up"
            ? "bg-indigo-100 text-indigo-700"
            : row.active_status === "shipped"
              ? "bg-yellow-100 text-yellow-700"
              : row.active_status === "delivered"
                ? "bg-green-100 text-green-700"
                : row.active_status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : row.active_status === "returned"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
    }
  `}
                    >
                      {row.active_status?.replace("_", " ")}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {`${row.order_id.payment?.method} / ${row.order_id.payment?.status}`}
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
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
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={9}
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
