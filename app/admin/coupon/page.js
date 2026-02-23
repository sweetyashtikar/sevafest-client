// app/admin/coupons/page.js
"use client";

import CouponTable from "@/components/coupon/couponTable";

export default function CouponsPage() {
  return (
    <div className="p-6">
      <CouponTable />
    </div>
  );
}