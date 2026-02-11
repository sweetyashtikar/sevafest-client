// components/tez/tezPaymentButton.js
"use client";

import { useState, useEffect } from "react";

export default function SimpleTezPaymentButton({ 
  paymentUrl, 
  disabled = false,
  buttonText = "Pay with Tez"
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if script is loaded
    const checkTezGateway = () => {
      if (typeof window !== "undefined" && window.openDialog) {
        setIsReady(true);
        return true;
      }
      return false;
    };

    // Initial check
    checkTezGateway();

    // If not loaded, check every 500ms
    const interval = setInterval(() => {
      if (checkTezGateway()) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (!isReady) {
      alert("Payment system is loading, please wait...");
      return;
    }

    if (!paymentUrl) {
      alert("Payment URL is not available. Please try again.");
      return;
    }

    // Open TezGateway dialog
    window.openDialog(paymentUrl, "TezGateway Payment");

    // Setup callback for when payment is done
    window.closeDialogFromIframe = function() {
      alert("Payment completed! Redirecting...");
      // You can redirect to success page or update order status
      window.location.href = "/payment/success";
    };
  };

  const isButtonDisabled = !isReady || disabled || !paymentUrl;

  return (
    <button
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all ${
        isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700"
      }`}
    >
      {isReady ? buttonText : "Loading payment..."}
    </button>
  );
}