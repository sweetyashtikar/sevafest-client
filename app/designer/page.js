"use client";

import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Info,
  RefreshCw,
} from "lucide-react";

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/banners/stats");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Banner Insights
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Real-time performance metrics
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="p-2 hover:bg-gray-100 rounded-full transition-all active:rotate-180 duration-500"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <StatCard
          title="Total Banners"
          value={data?.totalBanners}
          icon={<Info className="w-5 h-5 text-blue-600" />}
          borderColor="border-blue-100"
          accent="bg-blue-600"
        />
        <StatCard
          title="Active Now"
          value={data?.totalActive}
          icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
          borderColor="border-green-100"
          accent="bg-green-500"
        />
        <StatCard
          title="Inactive"
          value={data?.totalInactive}
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          borderColor="border-red-100"
          accent="bg-red-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-1000">
        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg">
            Detailed Breakdown
          </h2>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
            Live Stats
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-8 py-4">Category Name</th>
                <th className="px-6 py-4 text-center">Total Count</th>
                <th className="px-6 py-4 text-center">Active Status</th>
                <th className="px-6 py-4 text-center">Inactive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.breakdownByType?.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blue-50/20 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <span className="font-semibold text-gray-700 capitalize group-hover:text-blue-600 transition-colors">
                      {item.bannerType}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-medium text-gray-600">
                    {item.count}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm inline-block min-w-[40px]">
                      {item.activeCount}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center text-gray-400 italic">
                    {item.inactiveCount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, borderColor, accent }) => (
  <div
    className={`relative p-8 rounded-2xl border ${borderColor} bg-white shadow-sm overflow-hidden group hover:shadow-md 
    hover:-translate-y-1 transition-all duration-300`}
  >
    <div className={`absolute top-0 left-0 w-1.5 h-full ${accent}`}></div>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-tight">
          {title}
        </p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
          {value || 0}
        </h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-inner transition-all duration-300">
        {icon}
      </div>
    </div>
  </div>
);

export default Page;
