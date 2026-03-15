"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback } from "react";
import Script from "next/script";
import { apiClient } from "@/services/apiClient";
import { Phone, MapPin, Edit3 } from "lucide-react";
// import SimpleTezPaymentButton from "@/components/tez/tezPaymentButton";
// import RazorpayButton from "@/components/razorpay/RazorpayButton";
import { useSelector } from "react-redux";
import AddressModal from "@/components/address/addressModal";
import CouponApply from "@/components/coupon/couponApply";

const CheckoutPage = () => {
  const { user } = useSelector((a) => a.auth);
  const [cartData, setCartData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [summaryDelivery, setSummaryDelivery] = useState(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);

  const fetchCheckoutData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      const [cartRes, profileRes, addressRes] = await Promise.all([
        apiClient("/viewCart"),
        apiClient("/users/profile/me"),
        apiClient(`/address/user`),
      ]);

      if (cartRes?.success) {
        setCartData(cartRes.data);
        setOrderTotal(cartRes.data.summary?.finalTotal || 0);

        // Generate order ID based on cart
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        setOrderId(`ORD_${timestamp}_${randomNum}`);
      }

      if (profileRes?.success) setProfile(profileRes.data);
      if (addressRes?.success) {
        setAddress(addressRes.data);
        if (addressRes.data?.addresses?.length > 0) {
          const defaultAddr =
            addressRes.data.addresses.find((addr) => addr.is_default === true) ||
            addressRes.data.addresses[0];
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error("Checkout fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCheckoutData();
    fetchSummaryDelivery();
  }, [fetchCheckoutData]);

  // Handle address change
  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    console.log("Selected address:", address);
    // You can update delivery charges, etc. here
  };

  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
    if (couponData) {
      setOrderTotal((cartData?.summary?.finalTotal || 0) - couponData.discount);
    } else {
      setOrderTotal(cartData?.summary?.finalTotal || 0);
    }
  };

  // ================= MEMOIZED DATA =================
  const items = useMemo(() => cartData?.items || [], [cartData]);
  const summary = useMemo(() => cartData?.summary || {}, [cartData]);

  // Remove unused getPaymentUrl

 const fetchSummaryDelivery = useCallback(async () => {
    try {
      const res = await apiClient("/viewCart/summary");
      if (res?.success) {
        setSummaryDelivery(res.data?.estimatedDelivery);
      }
    } catch (error) {
      console.error("Failed to fetch delivery summary", error);
    }
}, []); // ✅ stable reference

useEffect(() => {
    fetchCheckoutData();
    fetchSummaryDelivery();
}, [fetchCheckoutData, fetchSummaryDelivery]); // ✅ both in deps

  const handleRazorpaySuccess = async (response, appOrderId) => {
    try {
      const verifyRes = await apiClient("/payments/verify-payment", {
        method: "POST",
        body: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_id: appOrderId,
        },
      });

      if (verifyRes.success) {
        window.location.href = `/order/success/${appOrderId}`;
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Verification failed", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        address_id: selectedAddress?._id,
        items: items.map((item) => ({
          product_id: item.product?._id,
          product_variant_id: item.variant?._id,
          quantity: item.qty,
          price: item.price,
        })),
        mobile: selectedAddress?.mobile,
        address: selectedAddress?.address,
        location: selectedAddress?.location,
        payment_method: selectedPayment === "razorpay" ? "Razorpay" : "COD",
        promo_details: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discount: appliedCoupon.discount,
            }
          : null,
      };

      if (selectedPayment === "razorpay") {
        // 1. Create App Order first (status will be PENDING_PAYMENT)
        const appOrderRes = await apiClient("/order", {
          method: "POST",
          body: orderData,
        });

        if (!appOrderRes.success) {
          alert("Failed to initialize order.");
          return;
        }

        const appOrderId = appOrderRes.data.order_id;
        const appOrderNumber = appOrderRes.data.order_number;

        // 2. Create Razorpay Order
        const rzpRes = await apiClient("/payments/create-order", {
          method: "POST",
          body: {
            amount: appOrderRes.data.total,
            receipt: appOrderNumber
          }
        });

        if (!rzpRes.success) {
          alert("Failed to initialize payment gateway.");
          return;
        }

        // 3. Open Razorpay Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpRes.order.amount,
          currency: "INR",
          name: "Sevafast",
          description: "Order Checkout",
          order_id: rzpRes.order.id,
          handler: async function (response) {
            // 4. Verify Payment on Success
            handleRazorpaySuccess(response, appOrderId);
          },
          modal: {
            ondismiss: async function () {
              // 5. User Closed Modal - Mark Order as CANCELLED
              try {
                await apiClient("/payments/cancel-payment", {
                  method: "POST",
                  body: { order_id: appOrderId, reason: "Payment window closed by user" }
                });
              } catch (err) {
                console.error("Cancellation record failed", err);
              }
            }
          },
          prefill: {
            name: profile?.username,
            email: profile?.email,
            contact: profile?.mobile,
          },
          theme: {
            color: "#B12704",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        // COD logic
        const response = await apiClient("/order", {
          method: "POST",
          body: orderData,
        });

        if (response.success) {
          window.location.href = `/order/success/${response.data.order_id}`;
        }
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Order placement failed. Please verify your details and try again.");
    }
  };

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
          <Delivery
            address={address}
            selectedAddress={selectedAddress}
            onAddressChange={handleAddressChange}
            refreshCheckout={fetchCheckoutData}
          />
          <Payment
            summary={summary}
            profile={profile}
            orderId={orderId}
            onPaymentMethodChange={setSelectedPayment}
          />
          <ReviewItems items={items} />
        </div>
        <OrderPlace
          summary={summary}
          orderId={orderId}
          selectedAddress={selectedAddress}
          onPlaceOrder={handlePlaceOrder}
          appliedCoupon={appliedCoupon}
          onCouponApplied={handleCouponApplied}
          orderTotal={orderTotal}
          estimatedDelivery={summaryDelivery}
          selectedPayment={selectedPayment}
        />
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </div>
    </div>
  );
};

export default CheckoutPage;

const Delivery = React.memo(
  function Delivery({ address, selectedAddress, onAddressChange, refreshCheckout }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Get addresses array
    const addressesArray = useMemo(() => address?.addresses || [], [address]);

    const handleAddressSelect = (addr) => {
      if (onAddressChange) {
        onAddressChange(addr);
      }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
      setIsModalOpen(false);

      if (refreshCheckout) {
        refreshCheckout();
      }
    };

    if (!selectedAddress) {
      return (
        <section className="bg-white rounded-lg p-5 shadow">
          <h2 className="text-lg font-semibold mb-4 text-black pb-2">
            1. Delivery Address
          </h2>
          <div className="text-center py-6 border-2 border-dashed border-blue-400 rounded-lg">
            <MapPin size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              No delivery address found
            </p>
            <button
              onClick={openModal}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              + Add New Address
            </button>
          </div>

          {/* Address Modal */}
          <AddressModal
            isOpen={isModalOpen}
            onClose={closeModal}
            addresses={addressesArray}
            onSelectAddress={handleAddressSelect}
            selectedAddressId={selectedAddress?._id}
          />
        </section>
      );
    }

    return (
      <section className="bg-white rounded-lg p-5 shadow">
        <div className="flex items-center justify-between mb-4 ">
          <h2 className="text-lg font-semibold text-black">
            1. Delivery Address
          </h2>
          <button
            onClick={openModal}
            className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors"
          >
            <Edit3 size={14} />
            Change
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {/* Map Icon */}
            <MapPin size={20} className="text-red-500 mt-1 flex-shrink-0" />

            <div className="flex-1">
              {/* Header: Name and Type Badge */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-bold text-black">{selectedAddress.name}</p>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">
                  {selectedAddress.type || "Home"}
                </span>
                {selectedAddress.is_default && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                    DEFAULT
                  </span>
                )}
              </div>

              {/* Address Body */}
              <div className="text-sm text-gray-800 leading-relaxed">
                <p className="font-medium">{selectedAddress.address}</p>

                {selectedAddress.landmark && (
                  <p className="text-gray-600">
                    Landmark: {selectedAddress.landmark}
                  </p>
                )}

                <p>
                  {selectedAddress.area_id?.name &&
                    `${selectedAddress.area_id.name}, `}
                  {selectedAddress.city_id?.name &&
                    `${selectedAddress.city_id.name}, `}
                  {selectedAddress.state} -{" "}
                  <span className="font-semibold">
                    {selectedAddress.pincode}
                  </span>
                </p>

                <p className="text-gray-500">{selectedAddress.country}</p>

                {/* Contact Info */}
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {selectedAddress.mobile}
                  </span>
                  {selectedAddress.alternate_mobile && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> Alt:{" "}
                      {selectedAddress.alternate_mobile}
                    </span>
                  )}
                </div>
              </div>

              {/* Serviceability Badge */}
              <div className="mt-3">
                {selectedAddress.serviceable ? (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded text-green-700 text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Delivery available at this address
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded text-red-700 text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Delivery not available here
                  </div>
                )}
              </div>

              {/* Delivery Charges Info */}
              {selectedAddress.delivery_info && (
                <div className="mt-2 text-xs text-gray-500">
                  Delivery charges: ₹{selectedAddress.delivery_info.charges} •
                  Free delivery on orders above ₹
                  {selectedAddress.delivery_info.minimum_free_delivery}
                </div>
              )}
            </div>
          </div>

          {/* Other addresses quick link */}
          {addressesArray.length > 1 && (
            <div className="pt-2 ml-8">
              <button
                onClick={openModal}
                className="text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1"
              >
                <span>
                  + {addressesArray.length - 1} other address
                  {addressesArray.length - 1 > 1 ? "es" : ""}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Address Modal */}
        <AddressModal
          isOpen={isModalOpen}
          onClose={closeModal}
          addresses={addressesArray}
          onSelectAddress={handleAddressSelect}
          selectedAddressId={selectedAddress?._id}
        />
      </section>
    );
  },
);

const Payment = React.memo(
  function Payment({
    onPaymentMethodChange,
  }) {
  const [selectedPayment, setSelectedPayment] = useState("razorpay");

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
    if (onPaymentMethodChange) onPaymentMethodChange(value);
  };
  return (
    <section className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
      <h2 className="text-[18px] font-bold mb-4 text-gray-900 border-b pb-2">
        Choose a payment method
      </h2>

      <div className="space-y-0 border border-gray-200 rounded-md overflow-hidden">
        {/* Online Payment Option */}
        <div
          className={`p-4 border-b border-gray-200 ${selectedPayment === "razorpay" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <label className="flex items-start gap-4 cursor-pointer w-full">
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={selectedPayment === "razorpay"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="mt-1 h-5 w-5 accent-[#007185]"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-gray-900">
                Online Payment
              </span>
              <span className="text-[13px] text-gray-600">
                Pay securely via Razorpay (Cards, UPI, NetBanking)
              </span>
            </div>
          </label>
        </div>

        {/* COD Option */}
        <div
          className={`p-4 ${selectedPayment === "cod" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <label className="flex items-start gap-4 cursor-pointer w-full">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === "cod"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="mt-1 h-5 w-5 accent-[#007185]"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-gray-900">
                Cash on Delivery (COD)
              </span>
              <span className="text-[13px] text-gray-600">
                Pay when the product is delivered to your doorstep.
              </span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
});

const ReviewItems = React.memo(function ReviewItems({ items }) {
  return (
    <section className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
      <h2 className="text-[18px] font-bold mb-4 text-gray-900">
        3. Review items and delivery
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item._id}
            className={`flex gap-4 pb-4 ${index !== items.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <div className="w-[100px] h-[100px] flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
              <Image
                src={item.product.mainImage}
                alt={item.product.name}
                width={100}
                height={100}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-gray-900 leading-tight truncate-2-lines mb-1">
                {item.product.name}
              </p>

              <div className="space-y-0.5">
                <p className="text-[13px] text-gray-700">
                  <span className="font-semibold text-gray-900">Quantity:</span>{" "}
                  {item.qty}
                </p>

                {item.inStock ? (
                  <p className="text-[#007600] text-[12px] font-medium">
                    ✓ In Stock
                  </p>
                ) : (
                  <p className="text-[#B12704] text-[12px] font-medium">
                    Currently out of stock.
                  </p>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="text-right flex flex-col justify-between items-end min-w-[80px]">
              <p className="text-[14px] font-bold text-[#B12704]">
                ₹{item.itemTotal.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-3 border-t border-gray-100">
        <p className="text-[12px] text-gray-600">
          Choosing a faster delivery method? Check your delivery options in the
          next step.
        </p>
      </div>
    </section>
  );
});

const OrderPlace = React.memo(
  function OrderPlace({
    summary,
    selectedAddress,
    onPlaceOrder,
    appliedCoupon,
    onCouponApplied,
    estimatedDelivery,
    selectedPayment,
  }) {
    const finalTotal = appliedCoupon
      ? summary.finalTotal - appliedCoupon.discount
      : summary.finalTotal;

    const getButtonStyle = () =>
      `w-full py-2 text-[14px] font-bold rounded-lg shadow-sm border transition-colors mb-4
      ${
        !selectedAddress
          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] text-black"
      }`;

    return (
      <div className="bg-white rounded-md p-4 border border-gray-200 shadow-sm h-fit sticky top-4">
        <div className="border-gray-200 pt-3">
          <h2 className="text-[14px] font-bold mb-3 text-gray-900">
            Order Summary
          </h2>

          <div className="space-y-1.5 text-[12px] text-gray-700">
            <div className="flex justify-between">
              <span>Items ({summary.itemsCount}):</span>
              <span>₹{summary?.totalPrice?.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span>Promotion Applied:</span>
              <span className="text-[#B12704]">
                - ₹{summary.totalDiscount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>
                ₹{summary.deliveryCharge > 0 ? summary.deliveryCharge : "0.00"}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-[#007600] font-medium italic">
                <span>Coupon ({appliedCoupon.code}):</span>
                <span>- ₹{appliedCoupon.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>
        </div>

        {/* TOTAL SECTION */}
        <div className="border-t border-gray-200 mt-3 pt-3 mb-4">
          <div className="flex justify-between font-bold text-[18px] text-[#B12704]">
            <span>Order Total:</span>
            <span>₹{finalTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {estimatedDelivery && (
          <div className="text-[12px] text-green-600 font-medium mb-3 text-center">
            Estimated Delivery: {estimatedDelivery}
          </div>
        )}
        {/* PROMOTIONAL CODE SECTION */}
        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
          <p className="text-[13px] font-bold mb-2">Promotional Code</p>
          <CouponApply
            cartTotal={summary?.finalTotal || 0}
            onCouponApplied={onCouponApplied}
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <button
            className={getButtonStyle()}
            onClick={onPlaceOrder}
            disabled={!selectedAddress}
          >
            Place your order {selectedPayment === "razorpay" ? "(Online)" : "(COD)"}
          </button>
        </div>

        {!selectedAddress && (
          <p className="text-[11px] text-[#B12704] mb-3 text-center font-medium">
            Please select a delivery address to continue.
          </p>
        )}

        <p className="text-[11px] text-gray-500 text-center mb-4 leading-tight">
          By placing your order, you agree to our{" "}
          <span className="text-[#007185] hover:underline cursor-pointer">
            privacy notice
          </span>{" "}
          and{" "}
          <span className="text-[#007185] hover:underline cursor-pointer">
            conditions of use
          </span>
          .
        </p>

        <div className="mt-3 flex items-start gap-2">
          <div className="w-2 h-2 bg-[#00A8E1] rounded-full mt-1"></div>
          <p className="text-[11px] text-gray-600">
            Your order qualifies for <b>FREE Delivery</b>. Choose this option at
            checkout.
          </p>
        </div>
      </div>
    );
  },
);