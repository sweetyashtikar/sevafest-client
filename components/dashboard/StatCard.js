import React from "react";

export default function StatCard({ title, count, value, icon: Icon, bgColor, iconBg }) {
  return (
    <div className={`p-6 rounded-lg shadow flex flex-col items-center text-center ${bgColor}`}>
      {/* Icon at top */}
      <div className={`p-4 rounded-full mb-4 ${iconBg}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Title + count */}
      <div className="text-gray-700 font-medium text-lg">
        {title} <span className="text-gray-500">{count}</span>
      </div>

      {/* Value */}
      <div className="mt-2 text-2xl font-bold text-black">
        {value}
      </div>
    </div>
  );
}