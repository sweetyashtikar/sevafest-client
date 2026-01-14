'use client';
import React from 'react';

export default function StatCard({ title, count, value, icon: Icon, bgColor, iconBg }) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            {title} {count}
          </h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>

        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
