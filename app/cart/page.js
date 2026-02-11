"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CART =================
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient("/viewCart");
      if (res?.success) {
        setCartData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
        fetchCart();
      } catch (err) {
        console.error("Qty update failed", err);
      }
    },
    [fetchCart],
  );

  const removeItem = useCallback(
    async (productId, variantId = null) => {
      try {
        await apiClient("/cart", {
          method: "DELETE",
          data: {
            productId,
            variantId, 
          },
        });

        fetchCart();
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
  const items = useMemo(() => cartData?.items || [], [cartData]);

  const summary = useMemo(
    () =>
      cartData?.summary || {
        totalItems: 0,
        totalPrice: 0,
        totalDiscount: 0,
        deliveryCharge: 0,
        finalTotal: 0,
        itemsCount: 0,
      },
    [cartData],
  );

  // ================= UI STATES =================
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
  console.log("Items", items);
  return (
    <>
      {items.map((item) => (
        <div
          key={item._id}
          className="flex gap-4 border-b last:border-b-0 pb-4 mb-4"
        >
          <Image
            src={item.product.mainImages}
            alt={item.product.name}
            width={140}
            height={140}
            className="rounded"
          />

          <div className="flex-1">
            <p className="font-medium text-lg text-black">
              {item.product.name}
            </p>

            <p className="text-sm text-black">{item.product.productType}</p>

            {item.inStock ? (
              <p className="text-green-600 text-sm mt-1">In Stock</p>
            ) : (
              <p className="text-red-600 text-sm mt-1">Out of Stock</p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <select
                value={item.qty}
                disabled={!item.inStock}
                onChange={(e) =>
                  onQtyChange(item?.product?._id, Number(e.target.value))
                }
                className="border rounded px-2 py-1 text-sm text-black"
              >
                {Array.from(
                  { length: Math.min(5, item.maxQty) },
                  (_, i) => i + 1,
                ).map((q) => (
                  <option key={q} value={q}>
                    Qty: {q}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  onRemove(item.product._id, item.variant?._id || null)
                }
                className="flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="font-semibold text-lg text-black">
              ₹{item.itemTotal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              ₹{item.price} × {item.qty}
            </p>
          </div>
        </div>
      ))}
    </>
  );
});

const OrderSummary = React.memo(({ summary }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 h-fit">
      <h2 className="text-lg font-semibold mb-4 text-black">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-black">
          <span>Items ({summary.itemsCount})</span>
          <span>₹{summary.totalPrice}</span>
        </div>

        <div className="flex justify-between text-black">
          <span>Discount</span>
          <span>- ₹{summary.totalDiscount}</span>
        </div>

        <div className="flex justify-between text-black">
          <span>Delivery</span>
          <span>₹{summary.deliveryCharge}</span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg text-black">
          <span>Total</span>
          <span>₹{summary.finalTotal}</span>
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
  );
});
