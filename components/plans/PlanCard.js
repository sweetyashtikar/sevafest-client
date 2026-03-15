"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export default function PlanCard() {
  const [plans] = useState([
    {
      title: "Premium Customer",
      validity: "1 Year Validity",
      originalPrice: 100,
      features: ["Priority Support", "Special Discounts", "Exclusive Coupons", "Free Home Delivery"],
    },
    {
      title: "Gold Vendor",
      users: 5,
      stores: 2,
      warehouses: 1,
      validity: "1 Year Validity",
      originalPrice: 2499,
      features: ["5 Users", "2 Stores", "1 Warehouse", "Unlimited Invoices"],
    },
    {
      title: "Diamond Vendor",
      users: 20,
      stores: 5,
      warehouses: 3,
      validity: "1 Year Validity",
      originalPrice: 4999,
      features: ["20 Users", "5 Stores", "3 Warehouses", "Unlimited Invoices", "Dedicated Account Manager"],
    },
  ]);

  return (
    <section className="py-8 w-full bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#1a1c24] mb-12 uppercase tracking-widest">
          Choose Your Membership
        </h2>

        <div className="flex flex-col xl:flex-row gap-12 items-start justify-center">
          {/* CUSTOMER SECTION */}
          <div className="w-full xl:w-1/3">
            <div className="mb-6 text-center xl:text-left">
              <span className="bg-orange-100 text-[#C7511F] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                For Customers
              </span>
              <p className="text-sm text-gray-500 mt-2 italic">Special perks for our shoppers</p>
            </div>
            <div className="flex justify-center xl:justify-start">
              <PlanItem plan={plans[0]} index={0} />
            </div>
          </div>

          {/* VENDOR SECTION */}
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
              <PlanItem plan={plans[1]} index={1} />
              <PlanItem plan={plans[2]} index={2} />
            </div>
          </div>
        </div>
      </div>

      {plans.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No plans available</p>
      )}
    </section>
  );
}

const PlanItem = ({ plan, index }) => (
  <div
    className={`flex-1 w-full max-w-sm bg-white rounded-2xl shadow-lg 
               transition duration-300 overflow-hidden flex flex-col border
               ${index > 0 ? "border-[#fdd835]/30 hover:shadow-2xl hover:-translate-y-1" : "border-gray-200 hover:shadow-2xl"}`}
  >
    {/* Header */}
    <div className={`${index === 0 ? "bg-[#C7511F]" : "bg-[#1a1c24]"} text-white text-center py-5`}>
      <h3 className="text-xl font-bold tracking-wide">
        {plan.title}
      </h3>
    </div>

    {/* Price */}
    <div className={`text-center py-6 ${index === 0 ? "bg-orange-50" : "bg-yellow-50"}`}>
      <p className="text-3xl font-bold text-[#1a1c24]">
        ₹{plan.originalPrice}
      </p>
      <p className="text-xs text-[#1a1c24] font-medium opacity-70">
        {plan.validity}
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
        className={`${index === 0 ? "bg-[#C7511F]" : "bg-[#1a1c24]"} text-white py-2.5 rounded-lg 
                   font-semibold hover:opacity-90 transition shadow-md`}
      >
        Buy Now
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

const Feature = ({ label }) => (
  <div className="flex items-center gap-3">
    <Check className="w-4 h-4 text-[#fcc221]" />
    <span>{label}</span>
  </div>
);