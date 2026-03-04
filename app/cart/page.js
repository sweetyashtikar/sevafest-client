"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/redux/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  console.log("item", items);

  const updateQty = useCallback(
    async (cartItemId, qty) => {
      try {
        await apiClient("/cart", {
          method: "PUT",
          body: {
            productId: cartItemId,
            newQty: Number(qty),
          },
        });
        dispatch(fetchCart());
      } catch (err) {
        console.error("Qty update failed", err);
      }
    },
    [fetchCart],
  );

  const removeItem = useCallback(
    async (productId, variantId) => {
      console.log("variantId", variantId);
      console.log("productId", productId);
      try {
        await apiClient("/cart", {
          method: "DELETE",
          body: {
            productId,
            variantId,
          },
        });

        dispatch(fetchCart());
      } catch (err) {
        console.error(
          "Remove item failed",
          err?.response?.data?.message || err.message,
        );
      }
    },
    [fetchCart],
  );

  // ================= MEMOIZED VALUES =================
  const summary = useMemo(() => {
    if (!items.length) {
      return {
        itemsCount: 0,
        totalPrice: 0,
        totalDiscount: 0,
        deliveryCharge: 0,
        finalTotal: 0,
      };
    }

    const totalPrice = items.reduce((acc, item) => acc + item.itemTotal, 0);

    return {
      itemsCount: items.length,
      totalPrice,
      totalDiscount: 0,
      deliveryCharge: 0,
      finalTotal: totalPrice,
    };
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-lg text-black mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-black text-white rounded"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
          <h1 className="text-2xl font-semibold mb-4 text-black">
            Shopping Cart
          </h1>
          <Carts items={items} onQtyChange={updateQty} onRemove={removeItem} />
        </div>
        <OrderSummary summary={summary} />
      </div>
    </div>
  );
};

export default CartPage;

const Carts = React.memo(({ items, onQtyChange, onRemove }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item._id}
          className={`flex gap-4 pb-4 ${
            index !== items.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          {/* Product Image */}
          <div className="w-[120px] sm:w-[150px] flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border
           border-gray-100 p-1 flex items-center justify-center">
            <Image
              src={item.product.mainImage}
              alt={item.product.name}
              width={140}
              height={140}
              className="object-contain mix-blend-multiply h-full w-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[16px] sm:text-[18px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer
             leading-snug truncate-2-lines">
              {item.product.name}
            </p>

            {item.inStock ? (
              <p className="text-[#007600] text-[12px] font-medium mt-1">
                In Stock
              </p>
            ) : (
              <p className="text-[#B12704] text-[12px] font-medium mt-1">
                Out of Stock
              </p>
            )}

            <p className="text-[11px] text-gray-500 mt-1">
              Eligible for{" "}
              <span className="font-bold text-[#00A8E1]">FREE Shipping</span>
            </p>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="relative inline-block">
                <select
                  value={item.qty}
                  disabled={!item.inStock}
                  onChange={(e) =>
                    onQtyChange(item?.product?._id, Number(e.target.value))
                  }
                  className="bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-lg px-2 py-1
                   text-[13px] text-gray-800 shadow-sm focus:border-[#007185] outline-none cursor-pointer appearance-none pr-7 min-w-[70px]"
                >
                  {Array.from(
                    { length: Math.min(5, item.maxQty || 5) },
                    (_, i) => i + 1,
                  ).map((q) => (
                    <option key={q} value={q}>
                      Qty: {q}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={14} className="text-gray-500" />
                </div>
              </div>

              <div className="w-[1px] h-4 bg-gray-300 hidden sm:block"></div>

              <button
                onClick={() =>
                  onRemove(item.product._id, item.variant?._id || null)
                }
                className="flex items-center gap-1 text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline transition-colors group"
              >
                <Trash2
                  size={14}
                  className="text-red-500 group-hover:text-[#C7511F] transition-colors"
                />
              </button>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="text-right flex flex-col items-end min-w-[100px]">
            <p className="font-bold text-[18px] text-gray-900">
              ₹{item.itemTotal.toLocaleString("en-IN")}
            </p>
            {item.qty > 1 && (
              <p className="text-[11px] text-gray-500">
                (₹{item.price.toLocaleString("en-IN")} each)
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

const OrderSummary = React.memo(({ summary }) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm p-4 h-fit sticky top-4">
      <h2 className="text-[18px] font-bold mb-3 text-gray-900 leading-tight">
        Order Summary
      </h2>

      <div className="space-y-2 pb-3">
        {/* Items Count & Price */}
        <div className="flex justify-between text-[13px] text-gray-700">
          <span>Items ({summary.itemsCount}):</span>
          <span>₹{summary.totalPrice.toLocaleString("en-IN")}</span>
        </div>

        {/* Discount Section */}
        <div className="flex justify-between text-[13px] text-gray-700">
          <span>Promotion Applied:</span>
          <span className="text-[#B12704]">
            - ₹{summary.totalDiscount.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Delivery Section */}
        <div className="flex justify-between text-[13px] text-gray-700">
          <span>Delivery:</span>
          <span className="text-gray-900">
            {summary.deliveryCharge > 0 ? (
              `₹${summary.deliveryCharge.toLocaleString("en-IN")}`
            ) : (
              <span className="text-[#007600] font-medium italic">FREE</span>
            )}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 mb-4">
        <div className="flex justify-between font-bold text-[18px] text-[#B12704]">
          <span>Order Total:</span>
          <span>₹{summary.finalTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block text-center w-full bg-[#FFD814] hover:bg-[#F7CA00] border
         border-[#FCD200] text-black text-[14px] font-bold py-2
         rounded-lg shadow-sm transition-all"
      >
        Proceed to Checkout
      </Link>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-gray-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path
              d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1
             0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />
          </svg>
          <span className="text-[12px]">Secure transaction</span>
        </div>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          Choose a payment method to continue checking out. You will still have
          a chance to review your order before it's final.
        </p>
      </div>
    </div>
  );
});
