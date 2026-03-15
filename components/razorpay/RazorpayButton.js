"use client";

import Script from "next/script";

export default function RazorpayButton({ 
  orderData, 
  userId,
  onSuccess,
  onFailure,
  disabled = false,
  buttonText = "Pay with Razorpay"
}) {
  const handlePayment = async () => {
    if (disabled || !orderData) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount, // Amount in paise
      currency: "INR",
      name: "Sevafast",
      description: "App Order",
      order_id: orderData.id,
      handler: function (response) {
        if (onSuccess) onSuccess(response);
      },
      prefill: {
        name: orderData.customer_name,
        email: orderData.customer_email,
        contact: orderData.customer_mobile,
      },
      theme: {
        color: "#B12704",
      },
      modal: {
        ondismiss: function() {
          if (onFailure) onFailure({ message: "Payment cancelled" });
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <button
        onClick={handlePayment}
        disabled={disabled || !orderData}
        className={`w-full py-2 text-[14px] font-bold rounded-lg shadow-sm border transition-colors mb-4
          ${
            disabled || !orderData
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] text-black"
          }`}
      >
        {buttonText}
      </button>
    </>
  );
}
