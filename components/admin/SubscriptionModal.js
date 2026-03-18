// components/admin/SubscriptionModal.js
"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { subscriptionService } from "@/API/subscriptionAPI";
import { toast } from "react-toastify";

export default function SubscriptionModal({ onClose, initialData, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "customer",
    duration: "monthly",
    price: "",
    description: "",
    features: [],
    benefits: {
      freeDeliveryThreshold: 0,
      freeDeliveriesPerMonth: 0,
    },
    isActive: true,
  });

  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        benefits: {
            freeDeliveryThreshold: initialData.benefits?.freeDeliveryThreshold || 0,
            freeDeliveriesPerMonth: initialData.benefits?.freeDeliveriesPerMonth || 0,
        }
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
      };

      if (initialData) {
        await subscriptionService.updateSubscription(initialData._id, dataToSubmit);
        toast.success("Subscription plan updated successfully");
      } else {
        await subscriptionService.createSubscription(dataToSubmit);
        toast.success("Subscription plan created successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error(error.message || "Failed to save subscription plan");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {initialData ? "Edit Subscription Plan" : "Create New Plan"}
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Configure details and benefits for the subscription tier
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
          {/* Scrollable Content */}
          <div className="p-8 overflow-y-auto no-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Plan Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Premium Plus"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Target Audience
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({ 
                      ...formData, 
                      type: newType,
                      duration: newType === 'vendor' ? 'yearly' : 'monthly'
                    });
                  }}
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Billing Cycle
                </label>
                <select
                  disabled
                  required
                  value={formData.duration}
                  className="w-full px-5 py-3.5 bg-slate-200 border-2 border-slate-200 rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed opacity-75"
                >
                  <option value="monthly">Monthly Only (Customer)</option>
                  <option value="yearly">Yearly Only (Vendor)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">
                  {formData.type === 'vendor' ? '* Vendors are restricted to yearly plans' : '* Customers are restricted to monthly plans'}
                </p>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Price (₹)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-4 px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl mt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-black text-slate-500 uppercase tracking-wider cursor-pointer">
                  Set as Active
                </label>
              </div>

              {/* Benefits */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-700">Benefits & Logic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Free Delivery Min. Order</label>
                    <input
                      type="number"
                      value={formData.benefits.freeDeliveryThreshold}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: { ...formData.benefits, freeDeliveryThreshold: Number(e.target.value) }
                      })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Free Deliveries / Month</label>
                    <input
                      type="number"
                      value={formData.benefits.freeDeliveriesPerMonth}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: { ...formData.benefits, freeDeliveriesPerMonth: Number(e.target.value) }
                      })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Plan Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Priority Support"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-black transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feat, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-100">
                      {feat}
                      <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Public Description
                </label>
                <textarea
                  placeholder="Describe the plan to users..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700 h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-8 border-t border-slate-100 bg-white flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : initialData ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
