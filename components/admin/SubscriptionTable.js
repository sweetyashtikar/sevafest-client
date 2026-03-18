// components/admin/SubscriptionTable.js
"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Plus,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Users,
} from "lucide-react";
import { subscriptionService } from "@/API/subscriptionAPI";
import SubscriptionModal from "./SubscriptionModal";
import { toast } from "react-toastify";

export default function SubscriptionTable() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.adminGetAllSubscriptions();
      setSubscriptions(response.data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await subscriptionService.updateSubscription(id, { isActive: !currentStatus });
      toast.success(`Plan ${!currentStatus ? "activated" : "deactivated"} successfully`);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription plan?")) {
      try {
        await subscriptionService.deleteSubscription(id);
        toast.success("Subscription plan deleted successfully");
        fetchSubscriptions();
      } catch (error) {
        toast.error(error.message || "Failed to delete plan");
      }
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl mt-5 shadow-sm border border-slate-100 overflow-hidden w-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-black">Subscription Management</h2>
            <p className="text-sm text-black/40 mt-1">
              Create and manage subscription plans for customers and vendors
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSubscription(null);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Add New Plan
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
          />
          <input
            type="text"
            placeholder="Search plans by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-black placeholder:text-black/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50 border-y border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Duration</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Benefits</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-black/40">Loading plans...</p>
                  </div>
                </td>
              </tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <CreditCard size={48} className="text-black/20 mb-3" />
                    <p className="text-black/60 font-medium">No subscription plans found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{sub.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      sub.type === "customer" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {sub.type === "customer" ? <Users size={12} /> : <Briefcase size={12} />}
                      {sub.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {sub.duration.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">₹{sub.price}</td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] space-y-1">
                      {sub.type === "vendor" ? (
                        <p className="text-emerald-600 font-black uppercase tracking-tight">Unlimited Free Delivery</p>
                      ) : (
                        <>
                          {sub.benefits?.freeDeliveryThreshold > 0 && (
                            <p className="text-green-600 font-bold">Free delivery over ₹{sub.benefits.freeDeliveryThreshold}</p>
                          )}
                          {sub.benefits?.freeDeliveriesPerMonth > 0 && (
                            <p className="text-blue-600 font-bold">{sub.benefits.freeDeliveriesPerMonth} free deliveries/mo</p>
                          )}
                          {!sub.benefits?.freeDeliveryThreshold && !sub.benefits?.freeDeliveriesPerMonth && (
                            <p className="text-slate-400">No special benefits</p>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(sub._id, sub.isActive)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        sub.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {sub.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      {sub.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSubscription(sub);
                          setShowModal(true);
                        }}
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title="Edit plan"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Delete plan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SubscriptionModal
          onClose={() => {
            setShowModal(false);
            setEditingSubscription(null);
          }}
          initialData={editingSubscription}
          onSuccess={() => {
            fetchSubscriptions();
            setShowModal(false);
            setEditingSubscription(null);
          }}
        />
      )}
    </div>
  );
}
