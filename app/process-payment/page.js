"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  ChevronLeft,
  QrCode,
  Building2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import SimpleTezPaymentButton from "@/components/tez/tezPaymentButton";

const PaymentPage = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");
  const transaction_id = searchParams.get("transaction_id");
  const mobile = searchParams.get("mobile");
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  console.log("orderId from payment page", orderId)

  const [selectedMethod, setSelectedMethod] = useState("tez");
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
   const [paymentStatus, setPaymentStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Function to verify payment status
  const verifyPayment = async (orderId) => {
    try {
      setIsVerifying(true);
      const response = await apiClient(`/payments/verify-payment/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
         body: {
          trans_id: transaction_id
        },
      });

      const data = await response;
      
      if (data.success) {
        setPaymentStatus(data.data);
        
        // Check if payment was successful
        if (data.data.status === true) {
          alert("payment done")
          // Redirect to success page or show success message
          // router.push(`/payment/success?orderId=${orderId}`);
        } else {
          alert('payment failed')
          // Payment failed - show failure message
          setVerificationComplete(true);
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentStatus({ status: false, message: "Verification failed" });
      setVerificationComplete(true);
    } finally {
      setIsVerifying(false);
    }
  };


  const getPaymentUrl = async () => {
    try {
      if (!orderId || !amount || !mobile) {
        console.error("Missing required data for payment");
        return null;
      }

      console.log()
      const response = await apiClient(`/payments/generate-payment-url/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          trans_id: transaction_id,
          amount: amount,
          customer_mobile: mobile,
          customer_email: email,
          customer_name: name,
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
        },
      });

      const data = await response;

      if (data.success && data.data?.payment_url) {
        return data.data.payment_url;
      } else {
        console.error("Failed to generate payment URL:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error generating payment URL:", error);
      return null;
    }
  };

  useEffect(() => {
    const generateUrl = async () => {
      if (selectedMethod === "tez" && !paymentUrl && !isGeneratingUrl) {
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
  }, [selectedMethod]);

  const handlePaymentChange = (id) => {
    setSelectedMethod(id);
    if (id !== "tez") {
      setPaymentUrl(null);
    }
  };

  const paymentMethods = [
    {
      id: "tez",
      title: "QR code (Tez)",
      subtitle: "Scan and pay instantly",
      icon: <QrCode className="w-6 h-6" />,
    },
    {
      id: "upi",
      title: "Other UPI Apps",
      subtitle: "Google Pay, PhonePe, Paytm",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      subtitle: "All major cards accepted",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: "netbanking",
      title: "Net Banking",
      subtitle: "Secure payment via your bank",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      subtitle: "Pay when you receive the package",
      icon: <Banknote className="w-6 h-6" />,
    },
  ];

  const Header = () => {
    return (
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Payment Method</h1>
          <div className="w-10" />
        </div>
      </div>
    );
  };

  const ConfirmOrderButton = () => {
    return (
      <div className="mt-6 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <p className="text-gray-500 font-medium">Final Payable Amount</p>
            <p className="text-[#1a1c24] font-black text-2xl">
              ₹{amount || "0.00"}
            </p>
          </div>

          <button
            disabled={selectedMethod === "tez" && !paymentUrl}
            className={`w-full bg-[#fdd835] hover:bg-[#fcc221] text-[#1a1c24] active:scale-[0.95] transition-all 
             py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 ${
               selectedMethod === "tez" && !paymentUrl
                 ? "opacity-50 cursor-not-allowed"
                 : "hover:shadow-blue-200"
             }`}
          >
            {selectedMethod === "cod"
              ? "Confirm Order"
              : `Pay ₹${amount || "0.00"}`}
          </button>

          <p className="text-center text-[11px] text-[#1a1c24]">
            By clicking, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    );
  };

  const ShowAmount = () => {
    return (
      <div
        className="bg-[#fdd835] rounded-3xl p-6 mb-8 text-[#1a1c24] shadow-xl shadow-yellow-100 flex justify-between 
      items-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <p className="text-[#1a1c24] text-sm font-medium mb-1">
            Total Payable
          </p>
          <h2 className="text-4xl font-bold italic">₹{amount || "0.00"}</h2>
        </div>
        <ShieldCheck className="w-16 h-16 text-[#1a1c24] opacity-60 relative z-10" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#fcc221] rounded-full opacity-30" />
      </div>
    );
  };

  const PaymentOptions = () => {
    return (
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex flex-col">
            <div
              onClick={() => handlePaymentChange(method.id)}
              className={`cursor-pointer flex items-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                selectedMethod === method.id
                  ? "border-[#fdd835] bg-yellow-50"
                  : "border-white bg-white hover:border-gray-200 shadow-sm"
              }`}
            >
              <div
                className={`p-3 rounded-xl ${selectedMethod === method.id ? "bg-[#fdd835] text-[#1a1c24]" : "bg-gray-100 text-gray-500"}`}
              >
                {method.icon}
              </div>

              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-bold text-lg ${selectedMethod === method.id ? "text-[#1a1c24]" : "text-gray-800"}`}
                  >
                    {method.title}
                  </p>
                  {method.id === "tez" && isGeneratingUrl && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  {method.id === "tez" && paymentUrl && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-gray-500 text-sm">{method.subtitle}</p>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedMethod === method.id
                    ? "border-[#fdd835] bg-[#fdd835]"
                    : "border-gray-300"
                }`}
              >
                {selectedMethod === method.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {method.id === "tez" && selectedMethod === "tez" && paymentUrl && (
              <div className="mx-4 -mt-2 p-5 bg-white border-x-2 border-b-2 border-blue-600 rounded-b-2xl shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col items-center py-2">
                  <p className="text-[12px] text-gray-400 mb-4 bg-gray-50 px-3 py-1 rounded-full uppercase font-bold tracking-tighter">
                    Order ID: <span className="text-gray-700">{orderId}</span>
                  </p>

                  <SimpleTezPaymentButton
                    paymentUrl={paymentUrl}
                    disabled={isGeneratingUrl}
                  />

                  <p className="text-[11px] text-gray-400 mt-4 text-center">
                    Scan this QR code using any UPI app to pay
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header />
      <main className="max-w-2xl mx-auto p-4 mt-4">
        <ShowAmount />
        <h3 className="text-gray-600 font-bold mb-4 px-1 text-sm uppercase tracking-wider">
          Select Method
        </h3>
        <PaymentOptions />
        <ConfirmOrderButton />
      </main>
    </div>
  );
};

export default PaymentPage;
