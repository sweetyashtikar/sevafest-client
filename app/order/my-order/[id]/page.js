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
  User,
  FileText,
  Download,
  Share2,
  AlertCircle,
  Home,
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
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "awaiting":
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case "received":
        return <Package className="w-6 h-6 text-blue-600" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-orange-600" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'awaiting': 'Order Placed',
      'received': 'Order Received',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'awaiting': 'bg-yellow-50 text-yellow-800 border-yellow-300',
      'received': 'bg-blue-50 text-blue-800 border-blue-300',
      'shipped': 'bg-orange-50 text-orange-800 border-orange-300',
      'delivered': 'bg-green-50 text-green-800 border-green-300',
      'cancelled': 'bg-red-50 text-red-800 border-red-300'
    };
    return colorMap[status] || 'bg-yellow-50 text-yellow-800 border-yellow-300';
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold border border-yellow-300">
          Payment Pending
        </span>
      );
    } else if (status === 'completed') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold border border-green-300">
          Payment Completed
        </span>
      );
    } else if (status === 'failed') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold border border-red-300">
          Payment Failed
        </span>
      );
    }
    return null;
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-slate-800">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border-2 border-red-200">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Order</h2>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pb-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-500" />
                Order Status
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                {getStatusIcon(order.status)}
                <div className="flex-grow">
                  <div className={`inline-flex px-4 py-2 rounded-xl text-base font-bold border-2 ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              {order.items[0]?.status_history && order.items[0].status_history.length > 0 && (
                <div className="space-y-4 mt-6 border-l-4 border-orange-300 pl-6">
                  {order.items[0].status_history.map((history, index) => (
                    <div key={history._id} className="relative">
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-orange-500 border-4 border-white"></div>
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <p className="font-bold text-slate-900 capitalize mb-1">
                          {getStatusText(history.status)}
                        </p>
                        <p className="text-orange-700 font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(history.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Order Items ({order.items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-orange-100">
                {order.items.map((item, index) => (
                  <div key={item._id} className="p-6 hover:bg-orange-50/50 transition-colors">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-blue-100 rounded-xl flex items-center justify-center shadow-md border-2 border-orange-200">
                        <Package className="w-16 h-16 text-orange-500" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {item.product_name}
                            </h3>
                            <p className="text-blue-600 font-semibold mb-1">
                              Variant: {item.variant_name}
                            </p>
                            <p className="text-orange-600 font-medium">
                              Seller: {item.seller_id?.email || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">
                              ₹{item.sub_total}
                            </p>
                          </div>
                        </div>

                        {/* Item Status Badge */}
                        <div className="mb-4">
                          <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(item.active_status)}`}>
                            {getStatusText(item.active_status)}
                          </span>
                        </div>

                        {/* Price Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <div>
                            <p className="text-slate-900 font-semibold mb-1">Quantity</p>
                            <p className="text-xl font-bold text-orange-600">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-slate-900 font-semibold mb-1">Unit Price</p>
                            <p className="text-xl font-bold text-blue-600">₹{item.price}</p>
                          </div>
                          <div>
                            <p className="text-slate-900 font-semibold mb-1">Discount</p>
                            <p className="text-xl font-bold text-green-600">₹{item.discount}</p>
                          </div>
                          <div>
                            <p className="text-slate-900 font-semibold mb-1">Tax</p>
                            <p className="text-xl font-bold text-purple-600">₹{item.tax_amount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                Delivery Address
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3 mb-3">
                  <Home className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="text-lg font-bold text-slate-900 mb-2">{order.address}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <p className="text-blue-700 font-semibold">{order.mobile}</p>
                    </div>
                  </div>
                </div>
                {order.delivery_info && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-5 h-5 ${order.delivery_info.otp_verified ? 'text-green-600' : 'text-orange-500'}`} />
                        <span className="font-semibold text-slate-900">
                          OTP {order.delivery_info.otp_verified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          Delivery Attempts: {order.delivery_info.delivery_attempts}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="space-y-6">
            
            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-orange-500" />
                Payment Details
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-4 border-2 border-orange-200">
                  <p className="text-slate-900 font-semibold mb-2">Payment Method</p>
                  <p className="text-2xl font-bold text-orange-600 uppercase">{order.payment.method}</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-slate-900 font-semibold mb-2">Payment Status</p>
                  <div>
                    {getPaymentStatusBadge(order.payment.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                  <span className="text-slate-900 font-semibold">Subtotal</span>
                  <span className="text-lg font-bold text-slate-900">₹{order.total}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                  <span className="text-slate-900 font-semibold">Delivery Charge</span>
                  <span className="text-lg font-bold text-orange-600">₹{order.delivery_charge}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                    <span className="text-slate-900 font-semibold">Discount</span>
                    <span className="text-lg font-bold text-green-600">-₹{order.discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                  <span className="text-slate-900 font-semibold">Tax</span>
                  <span className="text-lg font-bold text-purple-600">₹{order.tax_amount}</span>
                </div>
                
                {order.wallet_balance_used > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                    <span className="text-slate-900 font-semibold">Wallet Used</span>
                    <span className="text-lg font-bold text-blue-600">-₹{order.wallet_balance_used}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 bg-gradient-to-r from-orange-100 to-blue-100 rounded-xl p-4 border-2 border-orange-300">
                  <span className="text-xl font-bold text-slate-900">Total Payable</span>
                  <span className="text-3xl font-bold text-orange-600">₹{order.final_total}</span>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Order Timeline
              </h2>
              
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-slate-900 font-semibold mb-2">Order Placed</p>
                  <p className="text-blue-700 font-bold">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-slate-900 font-semibold mb-2">Last Updated</p>
                  <p className="text-orange-700 font-bold">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}