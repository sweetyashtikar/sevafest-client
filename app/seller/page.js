"use client";

import {
  Users,
  Phone,
  TrendingUp,
  CheckCircle,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Total Leads",
    value: "1,248",
    icon: Users,
  },
  {
    title: "New Leads",
    value: "86",
    icon: Phone,
  },
  {
    title: "Converted",
    value: "312",
    icon: CheckCircle,
  },
  {
    title: "Conversion Rate",
    value: "25%",
    icon: TrendingUp,
  },
];

const recentLeads = [
  {
    name: "Rahul Sharma",
    mobile: "9876543210",
    product: "Water Purifier",
    status: "New",
  },
  {
    name: "Anjali Patil",
    mobile: "9876543211",
    product: "RO Service",
    status: "Contacted",
  },
  {
    name: "Vikram Singh",
    mobile: "9876543212",
    product: "Water Filter",
    status: "Converted",
  },
];

export default function Page() {
  return (
    <div className="min-h-scree  p-6">

      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1c24]">
          Seller Lead Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage and track your customer leads
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-[#1a1c24]">
                {item.value}
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-[#fdd835] text-[#1a1c24]">
              <item.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTION */}
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-5 py-3 bg-[#fdd835] text-[#1a1c24] font-semibold rounded-lg hover:bg-[#fcc221] transition">
          <Plus size={18} />
          Add New Lead
        </button>
      </div>

      {/* RECENT LEADS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1c24]">
            Recent Leads
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Mobile</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentLeads.map((lead, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-[#1a1c24]">
                    {lead.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {lead.mobile}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {lead.product}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold
                        ${
                          lead.status === "New"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.status === "Contacted"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}