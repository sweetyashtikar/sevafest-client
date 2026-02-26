// app/admin/coupons/page.js
"use client";

import CouponTable from "@/components/coupon/couponTable";

export default function CouponsPage() {
  return (
   <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <CouponTable />
      </div>
    </div>
  );
}
