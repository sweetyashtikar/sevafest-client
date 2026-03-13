"use client";
import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo, useCallback } from "react";
import { apiClient } from "@/services/apiClient";
import { User, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SimpleTezPaymentButton from "@/components/tez/tezPaymentButton";
import AddressModal from "@/components/address/addressModal";
import CouponApply from "@/components/coupon/couponApply";

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useSelector((a) => a.auth);
  const [cartData, setCartData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
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
      if (addressRes?.success) setAddress(addressRes.data);
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

  // const getPaymentUrl = async () => {
  //   console.log("orderId", orderId);
  //   console.log("summary?.finalTotal", summary?.finalTotal);
  //   console.log("profile?.mobile", profile?.mobile);
  //   try {
  //     if (!orderId || !summary?.finalTotal || !profile?.mobile) {
  //       console.error("Missing required data for payment");
  //       return null;
  //     }

  //     const response = await apiClient("/payments/generate-payment-url", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         order_id: orderId,
  //         amount: summary.finalTotal,
  //         customer_mobile: profile.mobile,
  //         customer_email: profile.email,
  //         customer_name: profile.username,
  //         return_url: `${window.location.origin}/payment/success`,
  //         cancel_url: `${window.location.origin}/payment/cancel`,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.success && data.data?.payment_url) {
  //       return data.data.payment_url;
  //     } else {
  //       console.error("Failed to generate payment URL:", data.message);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error generating payment URL:", error);
  //     return null;
  //   }
  // };

  const fetchSummaryDelivery = async () => {
    try {
      const res = await apiClient("/viewCart/summary");

      if (res?.success) {
        setSummaryDelivery(res.data?.estimatedDelivery);
      }
    } catch (error) {
      console.error("Failed to fetch delivery summary", error);
    }
  };

  const handlePlaceOrder = async () => {
    
    console.log("item", items);
    try {
      const orderData = {
        address_id: selectedAddress?._id,
        mobile: profile?.mobile,
        items: items.map((item) => ({
          product_id: item.product?._id,
          product_variant_id: item.variant?._id || null,
          quantity: item.qty,
          price: item.price,
        })),
        payment_method: "upi",
        promo_details: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discount: appliedCoupon.discount,
            }
          : null,
      };

      console.log("orderData", orderData);
      const response = await apiClient("/order", {
        method: "POST",
        body: orderData,
      });

      console.log("res", response);

      if (response?.success) {
        toast.success("Order placed successfully 🎉");

        const orderId = response?.data?.order_id;
        const totalAmount = response?.data?.total;

        router.push(
          `/process-payment?amount=${totalAmount}&orderId=${orderId}&mobile=${profile?.mobile}&email=${profile?.email}&name=${profile?.username}`,
        );
      } else {
        toast.error(response?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      // toast.error("Something went wrong while placing order");
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
            profile={profile}
            address={address}
            onAddressChange={handleAddressChange}
            refreshCheckout={fetchCheckoutData}
          />
          {/* <Payment
            summary={summary}
            profile={profile}
            orderId={orderId}
            selectedAddress={selectedAddress}
            getPaymentUrl={getPaymentUrl}
          /> */}
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
        />
      </div>
    </div>
  );
};

export default CheckoutPage;

const Delivery = React.memo(
  ({ profile, address, onAddressChange, refreshCheckout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Get addresses array
    const addressesArray = address?.addresses || [];

    // Initialize selected address
    useEffect(() => {
      if (!selectedAddress && addressesArray.length > 0) {
        const defaultAddr =
          addressesArray.find((addr) => addr.is_default === true) ||
          addressesArray[0];
        setSelectedAddress(defaultAddr);

        // Notify parent component
        if (onAddressChange) {
          onAddressChange(defaultAddr);
        }
      }
    }, [addressesArray, selectedAddress, onAddressChange]);

    const handleAddressSelect = (addr) => {
      setSelectedAddress(addr);
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

const Payment = React.memo(({ summary, profile, orderId, getPaymentUrl }) => {
  console.log("summary", summary);
  const [selectedPayment, setSelectedPayment] = useState("tez");
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);

  // Generate payment URL when Tez is selected
  useEffect(() => {
    const generateUrl = async () => {
      if (selectedPayment === "tez" && !paymentUrl && !isGeneratingUrl) {
        setIsGeneratingUrl(true);
        try {
          const url = await getPaymentUrl();
          setPaymentUrl(url);
        } catch (error) {
          console.error("Failed to generate payment URL:", error);
          setPaymentUrl(null);
        } finally {
          setIsGeneratingUrl(false);
        }
      }
    };

    generateUrl();
  }, [selectedPayment]); // Only depend on selectedPayment

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
    // Reset payment URL if switching away from Tez
    if (value !== "tez") {
      setPaymentUrl(null);
    }
  };
  return (
    <section className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
      <h2 className="text-[18px] font-bold mb-4 text-gray-900">
        2. Payment method
      </h2>

      <div className="space-y-0 border border-gray-200 rounded-md overflow-hidden">
        {/* UPI / Tez Option */}
        <div
          className={`p-3 border-b border-gray-200 ${selectedPayment === "tez" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <div className="flex items-start justify-between">
            <label className="flex items-start gap-3 cursor-pointer w-full">
              <input
                type="radio"
                name="payment"
                value="tez"
                checked={selectedPayment === "tez"}
                onChange={(e) => handlePaymentChange(e.target.value)}
                className="mt-1 h-4 w-4 accent-[#007185]"
              />
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-gray-900">
                  QR code (Tez)
                </span>
                <span className="text-[12px] text-gray-600">
                  Scan and pay instantly
                </span>
              </div>
            </label>
            {selectedPayment === "tez" && (
              <div className="text-[12px]">
                {isGeneratingUrl ? (
                  <span className="text-gray-500 animate-pulse italic">
                    Generating...
                  </span>
                ) : paymentUrl ? (
                  <span className="text-[#007600] font-medium">✓ Ready</span>
                ) : (
                  <span className="text-[#B12704]">Unavailable</span>
                )}
              </div>
            )}
          </div>

          {selectedPayment === "tez" && paymentUrl && (
            <div className="ml-7 mt-3 p-3 border border-gray-300 rounded-md bg-white shadow-inner">
              <p className="text-[12px] text-gray-500 mb-2">
                Order ID:{" "}
                <span className="font-bold text-gray-700">{orderId}</span>
              </p>
              <SimpleTezPaymentButton
                paymentUrl={paymentUrl}
                disabled={isGeneratingUrl}
              />
            </div>
          )}
        </div>

        {/* COD Option */}
        <div
          className={`p-3 border-b border-gray-200 ${selectedPayment === "cod" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === "cod"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="mt-1 h-4 w-4 accent-[#007185]"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-900">
                Cash on Delivery
              </span>
              <span className="text-[12px] text-gray-600">
                Pay when you receive the package
              </span>
            </div>
          </label>
        </div>

        {/* Generic UPI Option */}
        <div
          className={`p-3 border-b border-gray-200 ${selectedPayment === "upi" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={selectedPayment === "upi"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="mt-1 h-4 w-4 accent-[#007185]"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-900">
                Other UPI Apps
              </span>
              <span className="text-[12px] text-gray-600">
                Google Pay, PhonePe, Paytm
              </span>
            </div>
          </label>
        </div>

        {/* Card Option */}
        <div
          className={`p-3 border-b border-gray-200 ${selectedPayment === "card" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={selectedPayment === "card"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="mt-1 h-4 w-4 accent-[#007185]"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-900">
                Credit / Debit Card
              </span>
              <span className="text-[12px] text-gray-600">
                All major cards accepted
              </span>
            </div>
          </label>
        </div>

        {/* Net Banking Option */}
        <div
          className={`p-3 ${selectedPayment === "netbanking" ? "bg-[#FCF5EE]" : "bg-white"}`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={selectedPayment === "netbanking"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="mt-1 h-4 w-4 accent-[#007185]"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-900">
                Net Banking
              </span>
              <span className="text-[12px] text-gray-600">
                Secure payment via your bank
              </span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
});

const ReviewItems = React.memo(({ items }) => {
  return (
    <section className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
      <h2 className="text-[18px] font-bold mb-4 text-gray-900">
        2. Review items and delivery
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
  ({
    summary,
    orderId,
    selectedAddress,
    onPlaceOrder,
    appliedCoupon,
    onCouponApplied,
    orderTotal,
    estimatedDelivery,
  }) => {
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
              <span>₹{summary.totalPrice.toLocaleString("en-IN")}</span>
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
            className={`${getButtonStyle()} flex items-center justify-center gap-2`}
            onClick={onPlaceOrder}
            disabled={!selectedAddress}
          >
            <span>Proceed to Payment</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
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
