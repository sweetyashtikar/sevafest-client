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
       <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center text-center">
  <Truck className="w-10 h-10 text-blue-600 mb-4" />
  <p className="text-sm text-gray-500">Total Deliveries</p>
  <h2 className="text-2xl font-bold text-gray-900">128</h2>
</div>

        {/* Completed Orders */}
       <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center text-center">
  <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
  <p className="text-sm text-gray-500">Completed Orders</p>
  <h2 className="text-2xl font-bold text-gray-900">112</h2>
</div>

        {/* Pending Orders */}
       <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center text-center">
  <Package className="w-10 h-10 text-orange-500 mb-4" />
  <p className="text-sm text-gray-500">Pending Orders</p>
  <h2 className="text-2xl font-bold text-gray-900">16</h2>
</div>

        {/* Total Earnings */}
       <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center text-center">
  <IndianRupee className="w-10 h-10 text-purple-600 mb-4" />
  <p className="text-sm text-gray-500">Total Earnings</p>
  <h2 className="text-2xl font-bold text-gray-900">₹18,450</h2>
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
