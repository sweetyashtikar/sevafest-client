"use client";

import { AssignDeliveryBoyModal } from "@/components/vendor/AssignDeliveryBoyModal";
import { OrderViewModal } from "@/components/admin/OrderViewModal";
import { OrderTable } from "@/components/admin/OrderTable";
import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";
import { Search, PackageX } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignOrder, setAssignOrder] = useState(null);

  const fetchOrders = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await apiClient(`/order/get/sellerOrders?page=${pageNo}`);
      console.log("res", res);
      if (res?.success) {
        setOrders(res.data);
        setSummary(res.data.summary);
        setPagination(res.data.pagination);
      } else {
        // Handle unsuccessful response
        setOrders([]);
        setSummary(null);
        setPagination(null);
        setError(res?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      console.error("Failed to fetch orders", error);
      setOrders([]);
      setSummary(null);
      setPagination(null);
      setError(error?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  /* ===== SEARCH + FILTER ===== */
  const filteredOrders = orders.filter((o) => {
    const searchMatch =
      o.order_id?.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_id?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_id?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name?.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" ? true : o.active_status === statusFilter;

    return searchMatch && statusMatch;
  });

  const hasNoOrders = !loading && !error && (!orders || orders.length === 0);

  return (
    <div className="p-6 space-y-6 ">
      {/* ===== HEADING ===== */}
      <h1 className="text-2xl font-bold text-black">Orders</h1>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="flex items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
          />
          <input
            placeholder="Search order / customer / product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-10 pr-4 py-2.5
              border border-gray-300
              rounded-lg
              text-sm
              text-black
              placeholder-black
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
            "
          />
        </div>

        {/* FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            w-48
            px-4 py-2.5
            border border-gray-300
            rounded-lg
            text-sm
            text-black
            bg-white
            outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
          "
        >
          <option value="all">All Status</option>
          <option value="awaiting">Awaiting</option>
          <option value="processed">Processed</option>
        </select>
      </div>

      {/* ===== ERROR MESSAGE ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchOrders(page)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* ===== SUMMARY ===== */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Total Orders" value={summary.total_items} />
          <SummaryCard title="Total Quantity" value={summary.total_quantity} />
          <SummaryCard
            title="Total Revenue"
            value={`₹ ${summary.total_revenue}`}
          />
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {hasNoOrders && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-200">
          <PackageX size={64} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-black mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            There are no orders in the system at the moment. New orders will
            appear here once customers place them.
          </p>
          <button
            onClick={() => fetchOrders(1)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* ===== TABLE ===== */}
      {!hasNoOrders && !error && (
        <OrderTable
          data={filteredOrders}
          currentPage={pagination?.current_page ?? 1}
          totalPages={pagination?.total_pages ?? 1}
          onPageChange={(p) => setPage(p)}
          onView={(row) => {
            setSelectedOrder(row);
            setOpen(true);
          }}
          onDelete={(row) => console.log("Delete:", row._id)}
          onAssign={(row) => {
            setAssignOrder(row);
            setAssignOpen(true);
          }}
        />
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-sm text-black">Loading orders...</p>
        </div>
      )}

      {/* ===== SHOW FILTERED RESULTS COUNT ===== */}
      {!loading &&
        !error &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No orders match your search criteria.{" "}
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </p>
          </div>
        )}

      {loading && <p className="text-sm text-black">Loading orders...</p>}

      <OrderViewModal
        open={open}
        data={selectedOrder}
        onClose={() => {
          setOpen(false);
          setSelectedOrder(null);
        }}
      />

      <AssignDeliveryBoyModal
        open={assignOpen}
        data={assignOrder}
        onClose={() => {
          setAssignOpen(false);
          setAssignOrder(null);
        }}
      />
    </div>
  );
}

/* ===== SUMMARY CARD ===== */
function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-black mt-1">{value}</p>
    </div>
  );
}
