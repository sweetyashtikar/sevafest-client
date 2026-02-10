"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback } from "react";
import { apiClient } from "@/services/apiClient";
import { User, Mail, Phone, MapPin, Edit3 } from "lucide-react";

const CheckoutPage = () => {
  const [cartData, setCartData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= API CALLS =================
  const fetchCheckoutData = useCallback(async () => {
    try {
      setLoading(true);

      const [cartRes, profileRes] = await Promise.all([
        apiClient("/viewCart"),
        apiClient("/users/profile/me"),
      ]);

      if (cartRes?.success) {
        setCartData(cartRes.data);
      }

      if (profileRes?.success) {
        setProfile(profileRes.data);
      }
    } catch (err) {
      console.error("Checkout fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  // ================= MEMOIZED DATA =================
  const items = useMemo(() => cartData?.items || [], [cartData]);
  const summary = useMemo(() => cartData?.summary || {}, [cartData]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen py-8 bg-white text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DELIVERY ADDRESS */}
          <Delivery profile={profile} />
          {/* 2. PAYMENT */}
          <Payment />
          {/* 3. REVIEW ITEMS */}
          <ReviewItems items={items} />
        </div>
        {/* RIGHT – ORDER SUMMARY */}
        <OrderPlace summary={summary} />
      </div>
    </div>
  );
};

export default CheckoutPage;

const Delivery = React.memo(({ profile }) => {
  return (
    <section className="bg-white rounded-lg p-5 shadow">
      <h2 className="text-lg font-semibold mb-4">1. Delivery Address</h2>

      <div className="border rounded p-4 space-y-2">
        {/* Username */}
        <div className="flex items-center gap-2">
          <User size={16} className="text-blue-600" />
          <p className="font-medium text-black">
            {profile?.username || "User"}
          </p>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-600" />
          <p className="text-sm text-black">{profile?.email}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-green-600" />
          <p className="text-sm text-black">{profile?.mobile || "N/A"}</p>
        </div>

        {/* Zipcodes / Address */}
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-red-600 mt-0.5" />
          {profile?.zipcodes?.length > 0 ? (
            <p className="text-sm text-black">
              Serviceable Areas: {profile.zipcodes.join(", ")}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Address not added yet</p>
          )}
        </div>

        {/* Change button */}
        <button className="mt-3 inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
          <Edit3 size={14} />
          Change
        </button>
      </div>
    </section>
  );
});

const Payment = React.memo(() => {
  return (
    <section className="bg-white rounded-lg p-5 shadow">
      <h2 className="text-lg font-semibold mb-4">2. Payment Method</h2>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" value="cod" defaultChecked />
          <span>Cash on Delivery</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" value="upi" />
          <span>UPI (Google Pay, PhonePe, Paytm)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" value="card" />
          <span>Credit / Debit Card</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" value="netbanking" />
          <span>Net Banking</span>
        </label>
      </div>
    </section>
  );
});

const ReviewItems = React.memo(({ items }) => {
  return (
    <section className="bg-white rounded-lg p-5 shadow">
      <h2 className="text-lg font-semibold mb-4">3. Review Items</h2>

      {items.map((item) => (
        <div key={item._id} className="flex gap-4 border-b pb-4 mb-4">
          <Image
            src="https://via.placeholder.com/120"
            alt={item.product.name}
            width={120}
            height={120}
            className="rounded"
          />

          <div className="flex-1">
            <p className="font-medium">{item.product.name}</p>

            <p className="text-sm">Qty: {item.qty}</p>

            {item.inStock ? (
              <p className="text-green-600 text-sm">In Stock</p>
            ) : (
              <p className="text-red-600 text-sm">Out of Stock</p>
            )}
          </div>

          <div className="text-right">
            <p className="font-semibold">₹{item.itemTotal}</p>
          </div>
        </div>
      ))}
    </section>
  );
});

const OrderPlace = React.memo(({ summary }) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow h-fit">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Items ({summary.itemsCount})</span>
          <span>₹{summary.totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span>- ₹{summary.totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{summary.deliveryCharge}</span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{summary.finalTotal}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded">
        Place Order
      </button>
    </div>
  );
});
