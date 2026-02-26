"use client";
import React from "react";
import { ShoppingCart, RefreshCw, Truck, CheckCircle } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import WeeklySalesChart from "@/components/dashboard/WeeklySalesChart";
import BestSellingChart from "@/components/dashboard/BestSellingChart";
import { useSelector } from "react-redux";

export default function DashboardOverview() {
  const { user, token } = useSelector((a) => a.auth);

  console.log("user", user);
  console.log("token", token);

  const weeklyData = [
    { date: "2026-01-10", sales: 0 },
    { date: "2026-01-11", sales: 0 },
    { date: "2026-01-12", sales: 120 },
    { date: "2026-01-13", sales: 0 },
    { date: "2026-01-14", sales: 0 },
  ];

  const pieData = [
    { name: "GUSTO Sliced Calabre...", value: 45, color: "#10b981" },
    { name: "Fresh Organic Grape ...", value: 30, color: "#f97316" },
    { name: "SANTOOR SOAP", value: 20, color: "#fbbf24" },
    { name: "PARACHUTE COCONUT HA...", value: 5, color: "#3b82f6" },
  ];

  const stats = [
    {
      title: "Total Order",
      count: "(40)",
      value: "12282.00",
      icon: ShoppingCart,
      bgColor: "bg-blue-200",
      iconBg: "bg-blue-400",
    },
    {
      title: "Order Pending",
      count: "(4)",
      value: "397.00",
      icon: RefreshCw,
      bgColor: "bg-amber-100",
      iconBg: "bg-amber-600",
    },
    {
      title: "Order Processing",
      count: "(1)",
      value: "82.00",
      icon: Truck,
      bgColor: "bg-green-100",
      iconBg: "bg-green-300",
    },
    {
      title: "Order Delivered",
      count: "(22)",
      value: "7611.00",
      icon: CheckCircle,
      bgColor: "bg-teal-200",
      iconBg: "bg-teal-600",
    },
  ];

  return (
    <div className="p-6 space-y-8">
<h1 className="text-2xl font-bold text-black text-center">Dashboard Overview</h1>
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklySalesChart data={weeklyData} />
        <BestSellingChart data={pieData} />
      </div>
    </div>
  );
}