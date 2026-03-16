"use client";

import React, { useState, useEffect } from "react";
import { Check, PartyPopper } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import Script from "next/script";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";

export default function PlanCard() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiClient("subscriptions");
        if (res.success) {
          setPlans(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchActiveSub = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await apiClient("subscriptions/active-subscription");
        if (res.success && res.data) {
          setActiveSubscription(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch active subscription", err);
      }
    };

    fetchPlans();
    fetchActiveSub();
  }, [isAuthenticated]);

  // Handle anchor scroll after loading
  useEffect(() => {
    if (!loading && window.location.hash === "#planCard") {
      const element = document.getElementById("planCard");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [loading]);

  const handleBuyNow = async (planId) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Normalized Role Check (handles both object and string role formats)
    const normalizedUserRole = typeof user?.role === "string" 
      ? user.role 
      : user?.role?.role;

    const plan = plans.find((p) => p._id === planId);

    // Allow only 'customer' role for 'customer' type plans
    const isCustomerRole = normalizedUserRole === "customer";
    const isPlanForCustomers = plan?.type === "customer";
    const isPlanForVendors = plan?.type === "vendor";

    if (normalizedUserRole && plan) {
      if (isPlanForCustomers && !isCustomerRole) {
        toast.error("This plan is for customers only!");
        return;
      }
      if (isPlanForVendors && normalizedUserRole !== "vendor") {
        toast.error("This plan is for vendors only!");
        return;
      }
    }

    setPurchasingId(planId);
    try {
      // 1. Create Order on Backend
      const res = await apiClient("subscriptions/create-order", {
        method: "POST",
        body: { subscriptionId: planId },
      });

      if (!res.success) throw new Error(res.message);

      const { order, subscription } = res;

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Sevafast",
        description: `Subscription: ${subscription.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await apiClient("subscriptions/verify", {
              method: "POST",
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (verifyRes.success) {
              triggerConfetti();
              setShowSuccess(true);
              toast.success("Subscription activated successfully!");
              setTimeout(() => setShowSuccess(false), 5000);
            }
          } catch (err) {
            console.error("Verification failed", err);
            toast.error(err.message || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: async function () {
            setPurchasingId(null);
            // Log cancellation
            try {
              await apiClient("subscriptions/cancel", {
                method: "POST",
                body: { razorpay_order_id: order.id },
              });
            } catch (e) {
              console.error("Cancel log failed", e);
            }
          },
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
        },
        theme: {
          color: subscription.type === "customer" ? "#C7511F" : "#1a1c24",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Purchase error", err);
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setPurchasingId(null);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  if (loading) return null;

  // If user has active subscription, hide the plans section completely
  if (activeSubscription && activeSubscription.status === "active") {
    return null;
  }

  // Split plans into Customer and Vendor
  const customerPlans = plans.filter((p) => p.type === "customer");
  const vendorPlans = plans.filter((p) => p.type === "vendor");

    // Role extraction for UI (handles both object and string role formats)
    const normalizedUserRoleForUI = typeof user?.role === "string" 
      ? user.role 
      : user?.role?.role;

  return (
    <section className="py-8 w-full bg-gray-50/50 relative">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-md animate-in fade-in zoom-in duration-300">
          <div className="bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 mx-4 border-2 border-green-400">
            <div className="bg-white/20 p-2 rounded-full">
              <PartyPopper className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Subscription Activated!</h4>
              <p className="text-sm opacity-90">Welcome to your new membership perks.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <h2 id="planCard" className="text-3xl font-bold text-center text-[#1a1c24] mb-12 uppercase tracking-widest scroll-mt-24">
          Choose Your Membership
        </h2>

        <div className="flex flex-col xl:flex-row gap-12 items-start justify-center">
          {/* CUSTOMER SECTION - Visible if guest or customer */}
          {customerPlans.length > 0 && (!isAuthenticated || normalizedUserRoleForUI === "customer") && (
            <div className="w-full xl:w-1/3 bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-[#C7511F]/30 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C7511F] text-white px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md whitespace-nowrap">
                Customer Membership
              </div>
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500 mt-2 pb-6 italic">Special perks for our shoppers</p>
              </div>
              <div className="flex justify-center">
                <PlanItem 
                  plan={customerPlans[0]} 
                  isPurchasing={purchasingId === customerPlans[0]._id}
                  userRole={normalizedUserRoleForUI}
                  index={0} 
                  onBuy={() => handleBuyNow(customerPlans[0]._id)}
                />
              </div>
            </div>
          )}

          {/* VENDOR SECTION - Visible if guest or vendor */}
          {vendorPlans.length > 0 && (!isAuthenticated || normalizedUserRoleForUI === "vendor") && (
            <div className="w-full xl:w-2/3 bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-[#fdd835]/50 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fdd835] text-[#1a1c24] px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md">
                Vendor Business Plans
              </div>
              
              <div className="mt-4 mb-8 text-center">
                <p className="text-sm text-gray-600 font-medium italic underline decoration-[#fdd835] decoration-2 underline-offset-4">
                  Grow your business with our professional vendor tools
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                {vendorPlans.map((plan, idx) => (
                  <PlanItem 
                    key={plan._id}
                    plan={plan} 
                    isPurchasing={purchasingId === plan._id}
                    userRole={normalizedUserRoleForUI}
                    index={idx + 1} 
                    onBuy={() => handleBuyNow(plan._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {plans.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-10">No plans available</p>
      )}
    </section>
  );
}

const PlanItem = ({ plan, index, onBuy, isPurchasing, userRole }) => {
  const isCustomerRole = userRole === "customer";
  const isPlanForCustomers = plan?.type === "customer";
  const isPlanForVendors = plan?.type === "vendor";

  let isMismatchedRole = false;
  if (userRole) {
    if (isPlanForCustomers && !isCustomerRole) isMismatchedRole = true;
    if (isPlanForVendors && userRole !== "vendor") isMismatchedRole = true;
  }
  
  return (
    <div
      className={`flex-1 w-full max-w-sm bg-white rounded-2xl shadow-lg 
                 transition duration-300 overflow-hidden flex flex-col border
                 ${index > 0 ? "border-[#fdd835]/30 hover:shadow-2xl hover:-translate-y-1" : "border-gray-200 hover:shadow-2xl"}
                 ${isMismatchedRole ? "opacity-75 grayscale-[0.5]" : ""}`}
    >
      {/* Header */}
      <div className={`${index === 0 ? "bg-[#C7511F]" : "bg-[#1a1c24]"} text-white text-center py-5`}>
        <h3 className="text-xl font-bold tracking-wide">
          {plan.name}
        </h3>
      </div>

      {/* Price */}
      <div className={`text-center py-6 ${index === 0 ? "bg-orange-50" : "bg-yellow-50"}`}>
        <p className="text-3xl font-bold text-[#1a1c24]">
          ₹{plan.price}
        </p>
        <p className="text-xs text-[#1a1c24] font-medium opacity-70 uppercase">
          {plan.duration} Validity
        </p>
      </div>

      {/* Features */}
      <div className="p-6 space-y-4 text-sm text-gray-700 flex-1 bg-white">
        {plan.features.map((feature, fIndex) => (
          <Feature key={fIndex} label={feature} />
        ))}
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 flex flex-col gap-3 bg-white">
        <button
          onClick={onBuy}
          disabled={isPurchasing || isMismatchedRole}
          className={`${index === 0 ? "bg-[#C7511F]" : "bg-[#1a1c24]"} text-white py-2.5 rounded-lg 
                     font-semibold hover:opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPurchasing ? "Processing..." : isMismatchedRole ? "Restricted" : "Buy Now"}
        </button>

        <button
          className="border border-gray-300 py-2.5 rounded-lg 
                     text-sm font-medium text-gray-600
                     hover:bg-gray-50 transition"
        >
          Share Plan
        </button>
      </div>
    </div>
  );
};

const Feature = ({ label }) => (
  <div className="flex items-center gap-3">
    <Check className="w-4 h-4 text-[#fcc221]" />
    <span>{label}</span>
  </div>
);
