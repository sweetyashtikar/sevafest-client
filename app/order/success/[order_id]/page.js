"use client";

import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

const OrderSuccessPage = ({ params }) => {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.order_id;

  useEffect(() => {
    // Fire confetti!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl  font-bold mb-2">Order Placed Successfully!</h1>

        <p className="text-gray-600 mb-4">Thank you for shopping with us.</p>

        <div className="border rounded p-4 mb-4 text-left text-sm">
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-medium">Confirmed</span>
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/order/my-order"
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
