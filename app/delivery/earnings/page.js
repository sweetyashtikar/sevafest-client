"use client";

import { useState, useEffect } from "react";
import { IndianRupee, TrendingUp, Calendar, Package } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetchEarnings(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API}/delivery/earnings?${query}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    // Mock data
    return {
      data: {
        totalEarnings: 12500,
        thisMonthEarnings: 3200,
        thisWeekEarnings: 900,
        todayEarnings: 450,
        totalDeliveries: 87,
        recentTransactions: [
          {
            _id: "1",
            order_number: "ORD001",
            amount: 150,
            date: new Date().toISOString(),
            status: "delivered",
          },
          {
            _id: "2",
            order_number: "ORD002",
            amount: 200,
            date: new Date().toISOString(),
            status: "delivered",
          },
        ],
      },
    };
  }
}

export default function DeliveryEarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchEarnings({ period }).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [period]);

  const stats = [
    {
      label: "Today",
      value: `₹${data?.todayEarnings ?? 0}`,
      icon: IndianRupee,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-700",
    },
    {
      label: "This Week",
      value: `₹${data?.thisWeekEarnings ?? 0}`,
      icon: Calendar,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: "This Month",
      value: `₹${data?.thisMonthEarnings ?? 0}`,
      icon: TrendingUp,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      label: "Total Deliveries",
      value: data?.totalDeliveries ?? 0,
      icon: Package,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">Earnings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your delivery earnings
        </p>
      </div>

      {/* Total Banner */}
      <div className="bg-yellow-400 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-black/60 uppercase tracking-wider">
            Total Earnings
          </p>
          <p className="text-5xl font-black text-black mt-1">
            ₹{data?.totalEarnings ?? 0}
          </p>
        </div>
        <div className="p-4 bg-black/10 rounded-2xl">
          <TrendingUp size={44} className="text-black" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, bg, iconBg, iconColor }) => (
          <div key={label} className={`${bg} rounded-2xl p-5`}>
            <div
              className={`${iconBg} ${iconColor} p-2.5 rounded-xl w-fit mb-3`}
            >
              <Icon size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {label}
            </p>
            <p className="text-2xl font-black text-black mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-bold text-black">Recent Transactions</h2>
        </div>

        {data?.recentTransactions?.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y">
            {data?.recentTransactions?.map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-black text-sm">
                      {txn.order_number}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+₹{txn.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
