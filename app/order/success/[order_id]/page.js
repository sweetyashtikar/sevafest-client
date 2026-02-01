"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const OrderSuccessPage = ({ order_id }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>

        <p className="text-gray-600 mb-4">Thank you for shopping with us.</p>

        <div className="border rounded p-4 mb-4 text-left text-sm">
          <p>
            <strong>Order ID:</strong> {params.order_id}
          </p>
          <p>
            <strong>Payment Method:</strong> Cash on Delivery
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-medium">Confirmed</span>
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/my-orders"
            className="flex-1 border border-gray-300 rounded py-2 font-medium hover:bg-gray-50"
          >
            View Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 rounded py-2 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
