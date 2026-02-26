"use client";

import VendorTransactionTable from '@/components/admin/VendorTransactionTable';

export default function SellerPage() {
  // Dummy Data
  const transactionData = [
    {
      id: "1",
      sellerName: "Pratik Store",
      orderId: "ORD-9921",
      orderItemId: "ITEM-442",
      productName: "Everest Turmeric Powder",
      variation: "100g",
      flag: "Credit",
      amount: "450.00",
      remark: "Order Payment",
      date: "12/09/2025"
    },
    {
      id: "2",
      sellerName: "Chirag Store",
      orderId: "ORD-9925",
      orderItemId: "ITEM-449",
      productName: "Maggi Noodles",
      variation: "Pack of 12",
      flag: "Credit",
      amount: "1200.00",
      remark: "Bulk Sale",
      date: "12/09/2025"
    }
  ];

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <VendorTransactionTable data={transactionData} />
      
      <div className="mt-8 text-center text-[10px] text-gray-400">
        Copyright © 2025. Developed By <span className="text-[#14948c] font-bold">Appzeto - 10 Minute App</span>
      </div>
    </main>
  );
}