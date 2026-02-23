"use client";

import {
  Truck,
  Package,
  IndianRupee,
  CheckCircle
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { day: "Mon", earnings: 400 },
  { day: "Tue", earnings: 700 },
  { day: "Wed", earnings: 500 },
  { day: "Thu", earnings: 900 },
  { day: "Fri", earnings: 750 },
  { day: "Sat", earnings: 1100 },
  { day: "Sun", earnings: 650 },
];

export default function Page() {
  return (
    <div className="p-0 min-h-screen">
      
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mt-5 mb-6">
        Delivery Boy Dashboard
      </h1>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Total Deliveries */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Deliveries</p>
              <h2 className="text-2xl font-bold text-gray-900">128</h2>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Orders</p>
              <h2 className="text-2xl font-bold text-green-600">112</h2>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <h2 className="text-2xl font-bold text-orange-500">16</h2>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h2 className="text-2xl font-bold text-purple-600">₹18,450</h2>
            </div>
            <IndianRupee className="w-8 h-8 text-purple-600" />
          </div>
        </div>

      </div>

      {/* Earnings Graph */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Earnings
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
