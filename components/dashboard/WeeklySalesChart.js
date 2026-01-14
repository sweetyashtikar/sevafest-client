'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function WeeklySalesChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 text-center">
        Weekly Sales
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split('-')[2]}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, 120]}
            ticks={[0, 20, 40, 60, 80, 100, 120]}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ fill: '#14b8a6', r: 5 }}
            name="Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
