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
    const router = useRouter()
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
      case "awaiting":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "received":
        return <Package className="w-5 h-5 text-blue-600" />;
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
    const statusMap = {
      awaiting: "Order Placed",
      received: "Order Received",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      awaiting: "bg-yellow-50 text-yellow-800 border-yellow-200",
      received: "bg-blue-50 text-blue-800 border-blue-200",
      shipped: "bg-orange-50 text-orange-800 border-orange-200",
      delivered: "bg-green-50 text-green-800 border-green-200",
      cancelled: "bg-red-50 text-red-800 border-red-200",
    };
    return colorMap[status] || "bg-gray-50 text-gray-800 border-gray-200";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filters = [
    { id: "all", label: "All Orders" },
    { id: "received", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Orders</h1>
            <form
              onSubmit={handleSearch}
              className="relative w-96 hidden md:block"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all orders"
                className="w-full px-4 py-2 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>
          </div>
        </div>
      </header>

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

        {/* Orders Summary */}
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

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Order Header */}
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
                          {getStatusIcon(item.active_status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.active_status)}`}
                          >
                            {getStatusText(item.active_status)}
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
          // Empty State
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium">
              Start Shopping
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
