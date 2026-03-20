"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Search,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

export default function OrdersPageWithAPI() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await apiClient(`/order/User/my-orders`);

      console.log("resposne", response);

      if (response.success === true) {
        setOrders(response.data || []);
        setSummary(response.summary || null);
        setPagination(response.pagination || null);
      } else {
        throw new Error(data.message || "Failed to load orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order placed":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "processed":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "assigned":
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case "picked_up":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-orange-600" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };
  const getStatusText = (status) => {
    const map = {
      "Order placed": "Order Placed",
      processed: "Processing",
      assigned: "Assigned",
      picked_up: "Picked Up",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      returned: "Returned",
      pending: "Pending",
    };

    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      "Order placed": "bg-yellow-50 text-yellow-800 border-yellow-200",
      processed: "bg-blue-50 text-blue-800 border-blue-200",
      assigned: "bg-indigo-50 text-indigo-800 border-indigo-200",
      picked_up: "bg-purple-50 text-purple-800 border-purple-200",
      shipped: "bg-orange-50 text-orange-800 border-orange-200",
      delivered: "bg-green-50 text-green-800 border-green-200",
      cancelled: "bg-red-50 text-red-800 border-red-200",
      returned: "bg-gray-200 text-gray-800 border-gray-300",
    };

    return map[status] || "bg-gray-50 text-gray-800 border-gray-200";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filters = [
    { id: "all", label: "All Orders" },
    { id: "Order placed", label: "Order Placed" },
    // { id: "processed", label: "Processing" },
    // { id: "assigned", label: "Assigned" },
    // { id: "picked_up", label: "Picked Up" },
    { id: "shipped", label: "Shipped" },

    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
    { id: "returned", label: "Returned" },
  ];
  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900">
                {summary.total_orders}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Total Spent</div>
              <div className="text-3xl font-bold text-gray-900">
                ₹{summary.total_amount}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Processing</div>
              <div className="text-3xl font-bold text-blue-600">
                {summary.status_counts?.received || 0}
              </div>
            </div>
          </div>
        )}

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 uppercase mb-1">
                        Order Placed
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 uppercase mb-1">
                        Total
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.final_total}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 uppercase mb-1">
                        Payment
                      </div>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <span className="uppercase">
                          {order.payment.method}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            order.payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.payment.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 uppercase mb-1">
                        Order #
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {order.order_number}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0 mb-6 last:mb-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-12 h-12 text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Variant: {item.variant_name}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Seller: {item.seller_id?.username || "N/A"}
                        </p>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 mb-4">
                          {getStatusIcon(item.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity: </span>
                            <span className="font-medium text-gray-900">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Price: </span>
                            <span className="font-medium text-gray-900">
                              ₹{item.discounted_price}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Subtotal: </span>
                            <span className="font-bold text-gray-900">
                              ₹{item.sub_total}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex flex-col gap-2">
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium">
                          Track Package
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                          <Star className="w-4 h-4" />
                          Write Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="bg-gray-50 px-6 py-3 border-t border-gray-200"
                  onClick={() => router.push(`/order/my-order/${order._id}`)}
                >
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    View Order Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeFilter !== "all" ? activeFilter : ""} orders found
            </h3>

            <p className="text-gray-600 mb-6">
              {activeFilter === "all"
                ? "You haven't placed any orders yet."
                : `You have no ${activeFilter} orders at the moment.`}
            </p>

            <button
              onClick={() => setActiveFilter("all")}
              className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
            >
              View All Orders
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_prev}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(pagination.has_next)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    i + 1 === pagination.page
                      ? "bg-orange-500 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
