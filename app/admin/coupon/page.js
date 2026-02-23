<<<<<<< HEAD
'use client'
export default function Page () {
    return (
        <div>
            <h1>Coupon Admin Page</h1>
        </div>
    )
=======
// app/admin/coupons/page.js
"use client";

import CouponTable from "@/components/coupon/couponTable";

export default function CouponsPage() {
  return (
    <div className="p-6">
      <CouponTable />
    </div>
  );
>>>>>>> 83ee919e76c7a582c04ebc4e7accb2b6b62fe26d
}