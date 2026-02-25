"use client";

import { StatCard } from "@/components/vendor/StatCard";
import {
  Users,
  ClipboardList,
  Package,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
} from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-8 p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-black text-center">
        Vendor Dashboard
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value="734"
          icon={Users}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Total Categories"
          value="7"
          icon={ClipboardList}
          color="bg-yellow-100 text-yellow-600"
        />

        <StatCard
          title="Total Products"
          value="25"
          icon={Package}
          color="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Total Orders"
          value="521"
          icon={ShoppingCart}
          color="bg-indigo-100 text-indigo-600"
        />

        <StatCard
          title="Completed Orders"
          value="1"
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Pending Orders"
          value="1"
          icon={Clock}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Cancelled Orders"
          value="1"
          icon={XCircle}
          color="bg-red-100 text-red-600"
        />

        <StatCard
          title="Revenue"
          value="₹0"
          icon={IndianRupee}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-black text-center">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
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
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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