'use client';

import React from 'react';
import Image from 'next/image';

const CheckoutPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Address */}
          <section className="bg-white rounded-lg p-5 shadow">
            <h2 className="text-lg font-semibold mb-4">1. Delivery Address</h2>
            <div className="border rounded p-4">
              <p className="font-medium">Vaibhav Dhake</p>
              <p className="text-sm text-gray-600">
                123, Main Street, Bangalore, Karnataka - 560001
              </p>
              <p className="text-sm text-gray-600">📞 +91 9876543210</p>
              <button className="mt-2 text-blue-600 text-sm font-medium">
                Change
              </button>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-lg p-5 shadow">
            <h2 className="text-lg font-semibold mb-4">2. Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="radio" name="payment" defaultChecked />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 opacity-50">
                <input type="radio" name="payment" disabled />
                <span>UPI / Card (Coming Soon)</span>
              </label>
            </div>
          </section>

          {/* Items */}
          <section className="bg-white rounded-lg p-5 shadow">
            <h2 className="text-lg font-semibold mb-4">3. Review Items</h2>

            <div className="flex gap-4 border-b pb-4">
              <Image
                src="https://via.placeholder.com/120"
                alt="product"
                width={120}
                height={120}
                className="rounded"
              />
              <div className="flex-1">
                <p className="font-medium">Premium Cotton T-Shirt</p>
                <p className="text-sm text-gray-600">Color: Red | Size: L</p>
                <p className="text-green-600 text-sm">In Stock</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹749</p>
                <p className="text-sm text-gray-500">Qty: 1</p>
              </div>
            </div>

          </section>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="bg-white rounded-lg p-5 shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items</span>
              <span>₹749</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹0</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹749</span>
            </div>
          </div>

          <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
