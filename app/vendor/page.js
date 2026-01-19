"use client";

import { StatCard } from "@/components/vendor/StatCard";
import { IndianRupee, ClipboardList, Package } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-900 mt-10">Vendor Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value="₹0.00"
          icon={IndianRupee}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Orders"
          value="0"
          icon={ClipboardList}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Products for Sale"
          value="245"
          icon={Package}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Your Total</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
