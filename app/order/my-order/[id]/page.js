"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  ShoppingBag,
  FileText,
  AlertCircle,
  Home,
  ChevronRight,
  ShieldCheck,
  ReceiptText,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient(`/order/${id}`);
      if (response.success) {
        setOrder(response.data);
      } else {
        throw new Error(response.message || "Failed to load order");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExpectedDeliveryDate = (createdAt) => {
    const date = new Date(createdAt);

    date.setDate(date.getDate() + 7);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const statusConfig = {
    awaiting: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: Clock,
      label: "Order Placed",
    },
    received: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Package,
      label: "Processing",
    },
    shipped: {
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: Truck,
      label: "On The Way",
    },
    delivered: {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "Delivered",
    },
    cancelled: {
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  if (loading) {
    return (
      <div className="h-[90vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-500 font-medium">Fetching Order Details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="h-[90vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "The order you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            Go Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderStatus =
    order.items && order.items.length > 0 ? order.items[0].status : "awaiting";

  const currentStatus = statusConfig[orderStatus];

  const shippingMethod =
    order.delivery_info?.ship_type?.shipping_method || "standard";

  const shippingStyles = {
    standard: "bg-blue-50 border-blue-100 text-blue-800 text-blue-600",
    express: "bg-orange-50 border-orange-100 text-orange-800 text-orange-600",
    "same-day":
      "bg-emerald-50 border-emerald-100 text-emerald-800 text-emerald-600",
  };

  const style = shippingStyles[shippingMethod] || shippingStyles.standard;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Order #{order.order_number}
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Placed on {formatDate(order.status_timestamps?.placed)}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <ReceiptText className="w-4 h-4" />
            Download Invoice
          </button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Content Area (8 Columns) */}
          <div className="xl:col-span-8 space-y-8">
            {/* Delivery Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${currentStatus.bg} ${currentStatus.color}`}
                  >
                    <currentStatus.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Current Status
                    </p>
                    <h2
                      className={`text-xl font-extrabold ${currentStatus.color}`}
                    >
                      {currentStatus.label}
                    </h2>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Expected Delivery
                  </p>
                  <p className="text-gray-900 font-bold italic">
                    By {getExpectedDeliveryDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="p-8">
                <div className="relative flex justify-between">
                  <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                  <div
                    className="absolute top-5 left-0 h-1 bg-orange-500 transition-all duration-1000 -z-0"
                    style={{
                      width:
                        orderStatus === "delivered"
                          ? "100%"
                          : orderStatus === "shipped"
                            ? "66%"
                            : "33%",
                    }}
                  ></div>

                  {["awaiting", "shipped", "delivered"].map((step, idx) => {
                    const isCompleted =
                      idx <=
                      (orderStatus === "delivered"
                        ? 2
                        : orderStatus === "shipped"
                          ? 1
                          : 0);
                    return (
                      <div
                        key={step}
                        className="relative z-10 flex flex-col items-center"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${isCompleted ? "bg-orange-500 border-orange-100 text-white" : "bg-white border-gray-100 text-gray-300"}`}
                        >
                          {isCompleted ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <p
                          className={`mt-3 text-xs font-bold uppercase tracking-tighter ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h3 className="text-lg font-extrabold text-gray-900">
                  Order Items
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="p-8 flex flex-col sm:flex-row gap-8 hover:bg-slate-50/50 transition-all"
                  >
                    <div className="w-32 h-32 bg-gray-50 rounded-2xl border flex-shrink-0 p-2 overflow-hidden group">
                      <img
                        src={
                          item.product_id?.image || "https://placehold.co/400"
                        }
                        alt={item.product_name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            {item.product_name}
                          </h4>
                          <p className="text-sm text-gray-500 font-medium">
                            Variant:{" "}
                            <span className="text-gray-900">
                              {item.variant_name}
                            </span>
                          </p>

                          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Sold by:{" "}
                            <span className="text-orange-600 underline cursor-pointer">
                              {item.seller_id?.email || "Admin"}
                            </span>
                          </div>
                        </div>
                        <div className="text-left md:text-right flex flex-row md:flex-col items-baseline md:items-end gap-2">
                          <p className="text-2xl font-black text-gray-900">
                            ₹{item.sub_total}
                          </p>
                          <p className="text-sm font-bold text-gray-400 line-through">
                            ₹{item.price * item.quantity}
                          </p>

                          <p className="text-xs text-gray-400 mt-2">
                            Updated:{" "}
                            {formatDate(item.status_history?.[0]?.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4">
                        <button className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">
                          Review Product
                        </button>
                        <button className="px-5 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all">
                          Help with Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <MapPin className="w-24 h-24" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" /> Shipping
                  Address
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-900 font-bold leading-relaxed">
                    {order?.address}
                  </p>
                  <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="font-bold">{order?.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" /> Delivery Updates
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-sm font-bold text-emerald-800">
                      OTP Verification
                    </span>
                    <span className="text-xs font-black uppercase text-emerald-600 bg-white px-2 py-1 rounded">
                      {order.delivery_info?.otp_verified
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-bold text-blue-800">
                      Delivery Attempts
                    </span>
                    <span className="text-lg font-black text-blue-600">
                      {order.delivery_info?.delivery_attempts || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <span className="text-sm font-bold text-orange-800">
                      Shipping Method
                    </span>
                    <span className="text-sm font-bold text-orange-600 capitalize">
                      {order.delivery_info?.ship_type?.shipping_method}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-8 bg-gray-900 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Payment Summary
                </h3>
                <p className="text-gray-400 text-xs mt-1 font-medium tracking-widest uppercase">
                  Via {order.payment.method}
                </p>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{order.total}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-orange-600 font-bold">
                    ₹{order.delivery_charge}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Tax (GST)</span>
                  <span className="text-gray-900">₹{order.tax_amount}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <span>Coupon Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}

                <div className="h-px bg-gray-100 my-4"></div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase">
                      Total Amount
                    </p>
                    <p className="text-3xl font-black text-gray-900">
                      ₹{order.final_total}
                    </p>
                  </div>
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    {order.payment.status}
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-orange-500 text-white rounded-xl font-black text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95">
                  Need Help?
                </button>
              </div>

              <div className="bg-gray-50 p-6 flex items-center gap-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 italic">
                    Buyer Protection Active
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Your purchase is secure and verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
