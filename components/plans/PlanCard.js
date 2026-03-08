"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

export default function PlanCard() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    setPlans([
      {
        title: "Starter",
        users: 1,
        stores: 1,
        warehouses: 0,
        validity: "1 Year Validity",
        originalPrice: 999,
      },
      {
        title: "Business",
        users: 5,
        stores: 2,
        warehouses: 1,
        validity: "1 Year Validity",
        originalPrice: 2499,
      },
      {
        title: "Enterprise",
        users: 20,
        stores: 5,
        warehouses: 3,
        validity: "1 Year Validity",
        originalPrice: 4999,
      },
    ]);
  }, []);

  return (
    <section className="py-8 w-full">
      <h2 className="text-3xl font-bold text-center text-[#1a1c24] mb-12">
        Pricing Plans
      </h2>

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-6 lg:px-16 flex flex-col md:flex-row gap-14 justify-center">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex-1 max-w-sm bg-white rounded-2xl shadow-lg 
                       border border-gray-200 hover:shadow-2xl 
                       transition duration-300 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1a1c24] text-white text-center py-5">
              <h3 className="text-xl font-bold tracking-wide">
                {plan.title}
              </h3>
            </div>

            {/* Price */}
            <div className="text-center py-6 bg-[#fdd835]">
              <p className="text-3xl font-bold text-[#1a1c24]">
                ₹{plan.originalPrice}
              </p>
              <p className="text-xs text-[#1a1c24] font-medium">
                {plan.validity}
              </p>
            </div>

            {/* Features */}
            <div className="p-6 space-y-4 text-sm text-gray-700">
              <Feature label={`${plan.users} Users`} />
              <Feature label={`${plan.stores} Store`} />
              <Feature label={`${plan.warehouses} Warehouse`} />
              <Feature label="Unlimited Invoices" />
              <Feature label={plan.validity} />
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex flex-col gap-3">
              <button
                className="bg-[#1a1c24] text-white py-2.5 rounded-lg 
                           font-semibold hover:bg-black transition"
              >
                Buy Now
              </button>

              <button
                className="border border-[#1a1c24] py-2.5 rounded-lg 
                           text-sm font-medium text-[#1a1c24]
                           hover:bg-[#fdd835] transition"
              >
                Share Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No plans available
        </p>
      )}
    </section>
  );
}

const Feature = ({ label }) => (
  <div className="flex items-center gap-3">
    <Check className="w-4 h-4 text-[#fcc221]" />
    <span>{label}</span>
  </div>
);