'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">

        {/* LEFT: CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white rounded-lg shadow p-5">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

            {/* CART ITEM */}
            <div className="flex gap-4 border-b pb-4">
              <Image
                src="https://via.placeholder.com/140"
                alt="product"
                width={140}
                height={140}
                className="rounded"
              />

              <div className="flex-1">
                <p className="font-medium text-lg">
                  Premium Cotton T-Shirt
                </p>
                <p className="text-sm text-gray-600">
                  Color: Red | Size: L
                </p>

                <p className="text-green-600 text-sm mt-1">
                  In Stock
                </p>

                {/* Quantity + Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>Qty: 1</option>
                    <option>Qty: 2</option>
                    <option>Qty: 3</option>
                  </select>

                  <button className="text-sm text-blue-600 hover:underline">
                    Save for later
                  </button>

                  <button className="flex items-center gap-1 text-sm text-red-600 hover:underline">
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>

              {/* PRICE */}
              <div className="text-right">
                <p className="font-semibold text-lg">₹749</p>
              </div>
            </div>

            {/* DIGITAL PRODUCT EXAMPLE */}
            <div className="flex gap-4 pt-4">
              <Image
                src="https://via.placeholder.com/140"
                alt="digital"
                width={140}
                height={140}
                className="rounded"
              />

              <div className="flex-1">
                <p className="font-medium text-lg">
                  Premium E-Book Guide
                </p>
                <p className="text-sm text-gray-600">
                  Digital Product
                </p>

                <p className="text-blue-600 text-sm mt-1">
                  Instant delivery after payment
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-gray-500">
                    Qty: 1
                  </span>

                  <button className="flex items-center gap-1 text-sm text-red-600 hover:underline">
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">₹899</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white rounded-lg shadow p-5 h-fit">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal (2 items)</span>
              <span>₹1648</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹1648</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block text-center mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded"
          >
            Proceed to Checkout
          </Link>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Secure transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
