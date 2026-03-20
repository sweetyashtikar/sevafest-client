"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  X,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  Truck,
  Clock,
  ChevronDown,
  Search,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";

// ===================== API CALLS =====================

const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDeliveryOrders(params = {}) {
  try {
    const data = await apiClient("/delivery/orders", {
      method: "GET",
      params, 
    });

    return data;
  } catch (err) {
    console.log("fetchDeliveryOrders error:", err);
    throw err;
  }
}

/* =========================
   🔄 UPDATE ORDER STATUS
========================= */
export async function updateOrderStatus(orderId, status, image = null) {
  try {
    const data = await apiClient(`/delivery/orders/${orderId}/status`, {
      method: "PATCH",
      body: { status, image },
    });

    return data;
  } catch (err) {
    console.log("updateOrderStatus error:", err);
    throw err;
  }
}

export async function uploadDeliveryImage(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const data = await apiClient("/delivery/upload-image", {
      method: "POST",
      body: formData,
      // apiClient should handle FormData by not setting Content-Type to application/json
    });

    return data;
  } catch (err) {
    console.log("uploadDeliveryImage error:", err);
    throw err;
  }
}

// ===================== STATUS CONFIG =====================

const STATUS_CONFIG = {
  awaiting: {
    label: "Awaiting",
    color: "bg-yellow-100 text-yellow-700",
    next: "shipped",
    nextLabel: "Mark as Shipped",
    nextColor: "bg-blue-600 hover:bg-blue-700",
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-700",
    next: "delivered",
    nextLabel: "Mark as Delivered",
    nextColor: "bg-green-600 hover:bg-green-700",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    next: null,
    nextLabel: null,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    next: null,
    nextLabel: null,
  },
};

// ===================== ORDER DETAIL MODAL =====================

function OrderDetailModal({ order, onClose, onStatusUpdate }) {
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");

  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG["awaiting"];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      const res = await uploadDeliveryImage(file);
      if (res.success) {
        setImage(res.url);
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusInfo.next) return;

    // Image is required for delivered status
    if (statusInfo.next === "delivered" && !image) {
      setError("Please provide a delivery confirmation image");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      await updateOrderStatus(order._id, statusInfo.next, image);
      onStatusUpdate();
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-yellow-400">
          <div>
            <h2 className="text-lg font-black text-black">Order Details</h2>
            <p className="text-xs text-black/60 font-medium">
              {order.order_id?.order_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-yellow-500 transition-colors"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Current Status
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Customer
            </p>
            <p className="font-bold text-black">{order.user_id?.username}</p>
            <p className="text-sm text-gray-600">{order.user_id?.email}</p>
            {order.user_id?.phone && (
              <a
                href={`tel:${order.user_id.phone}`}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium"
              >
                <Phone size={14} />
                {order.user_id.phone}
              </a>
            )}
          </div>

          {/* Delivery Address */}
          {order.order_id?.delivery_address && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Delivery Address
              </p>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-black">
                  {[
                    order.order_id.delivery_address.street,
                    order.order_id.delivery_address.city,
                    order.order_id.delivery_address.state,
                    order.order_id.delivery_address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Product
            </p>
            <p className="font-bold text-black">{order.product_name}</p>
            {order.variant_name && (
              <p className="text-sm text-gray-600">{order.variant_name}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                Qty: {order.quantity}
              </span>
              <span className="font-bold text-black">₹{order.sub_total}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Payment
              </p>
              <p className="font-medium text-black capitalize mt-1">
                {order.order_id?.payment?.method}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.order_id?.payment?.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.order_id?.payment?.status}
            </span>
          </div>

          {/* Image Upload for Delivery Confirmation */}
          {statusInfo.next === "delivered" && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border-2 border-dashed border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Delivery Confirmation
                </p>
                {uploading && (
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden group">
                  <img
                    src={image}
                    alt="Delivery confirmation"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setImage("")}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                  <Truck size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 font-medium">
                    Click to upload proof of delivery
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}

              <p className="text-[10px] text-gray-400 italic">
                * Real-time image of the package at delivery location is required.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Status Update Button */}
          {statusInfo.next && (
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 ${statusInfo.nextColor}`}
            >
              {updating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                statusInfo.nextLabel
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================

export default function DeliveryOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page: currentPage,
        limit: LIMIT,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      };
      const res = await fetchDeliveryOrders(params);

      console.log("res", res);
      setOrders(res.data || []);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total_items || 0);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, search]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Search debounce
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "awaiting", label: "Awaiting" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-black">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalItems} orders assigned to you
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search order / customer / product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-black outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full sm:w-48 border border-gray-200 px-4 py-2.5 pr-10 rounded-xl text-black outline-none focus:border-yellow-400 bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-black text-center">
            Order Table List
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Order No",
                  "Customer",
                  "Product",
                  "Qty",
                  "Price",
                  "Status",
                  "Payment",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-400 text-sm">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package size={48} className="text-gray-200" />
                      <p className="text-gray-500 font-medium">
                        No orders found
                      </p>
                      <p className="text-sm text-gray-400">
                        You have no assigned orders yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG["awaiting"];
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-black text-xs">
                        {order.order_id?.order_number}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-black text-sm">
                          {order.user_id?.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user_id?.email}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-black text-sm">
                          {order.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.variant_name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-black">
                        {order.quantity}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-black">
                        ₹{order.sub_total}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-black capitalize">
                        <span>{order.order_id?.payment?.method}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                            order.order_id?.payment?.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.order_id?.payment?.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View & Update"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-black">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 border rounded-lg text-sm text-black disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-lg text-sm text-black disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={loadOrders}
        />
      )}
    </div>
  );
}
