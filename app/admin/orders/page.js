// "use client";

// import { OrderViewModal } from "@/components/admin/OrderViewModal";
// import { OrderTable } from "@/components/admin/OrderTable";
// import { apiClient } from "@/services/apiClient";
// import { useEffect, useState } from "react";
// import { Search } from "lucide-react";

// export default function Page() {
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [pagination, setPagination] = useState(null);
//   const [page, setPage] = useState(1);

//   const [open, setOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const [editOpen, setEditOpen] = useState(false);
//   const [editOrder, setEditOrder] = useState(null);

//   const fetchOrders = async (pageNo = 1) => {
//     try {
//       setLoading(true);
//       const res = await apiClient(`/order?page=${pageNo}`);

//       if (res?.success) {
//         setOrders(res.data.order_items);
//         setSummary(res.data.summary);
//         setPagination(res.data.pagination);
//       }
//     } catch (error) {
//       console.error("Failed to fetch orders", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders(page);
//   }, [page]);

//   /* ===== SEARCH + FILTER ===== */
//   const filteredOrders = orders.filter((o) => {
//     const searchMatch =
//       o.order_id?.order_number?.toLowerCase().includes(search.toLowerCase()) ||
//       o.user_id?.username?.toLowerCase().includes(search.toLowerCase()) ||
//       o.user_id?.email?.toLowerCase().includes(search.toLowerCase()) ||
//       o.product_name?.toLowerCase().includes(search.toLowerCase());

//     const statusMatch =
//       statusFilter === "all" ? true : o.active_status === statusFilter;

//     return searchMatch && statusMatch;
//   });

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden -ml-20">
//       <div className="p-4 md:p-6 space-y-6 flex-none w-full max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold text-black">Orders</h1>

//         {/* ===== SEARCH + FILTER ===== */}
//         <div className="flex items-center justify-between gap-4">
//           {/* SEARCH */}
//           <div className="relative w-full max-w-md">
//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
//             />
//             <input
//               placeholder="Search order / customer / product"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="
//                 w-full
//                 pl-10 pr-4 py-2.5
//                 border border-gray-500
//                 rounded-lg
//                 text-sm
//                 text-black
//                 placeholder-black
//                 outline-none
//                 focus:ring-2
//                 focus:ring-blue-500
//                 focus:border-blue-500
//               "
//             />
//           </div>

//           {/* FILTER */}
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="
//       w-40
//       px-4 py-2.5
//       -pr-12
//       border border-gray-300
//       rounded-lg
//       text-sm
//       text-black
//       bg-white
//       outline-none
//       focus:ring-2
//       focus:ring-blue-500
//       focus:border-blue-500
//     "
//           >
//             <option value="all">All Status</option>
//             <option value="awaiting">Awaiting</option>
//             <option value="processed">Processed</option>
//           </select>
//         </div>

//         {/* ===== SUMMARY ===== */}
//         {summary && (
//           <div className="max-w-4xl">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <SummaryCard title="Total Orders" value={summary.total_items} />

//               <SummaryCard
//                 title="Total Quantity"
//                 value={summary.total_quantity}
//               />

//               <SummaryCard
//                 title="Total Revenue"
//                 value={`₹ ${summary.total_revenue}`}
//               />
//             </div>
//           </div>
//         )}

//         {/* ===== TABLE ===== */}
//         <div className="w-full overflow-hidden">
//           <OrderTable
//             data={filteredOrders}
//             currentPage={pagination?.current_page ?? 1}
//             totalPages={pagination?.total_pages ?? 1}
//             onPageChange={(p) => setPage(p)}
//             onView={(row) => {
//               setSelectedOrder(row);
//               setOpen(true);
//             }}
//             onEdit={(row) => {
//               setEditOrder(row);
//               setEditOpen(true);
//             }}
//             onDelete={(row) => console.log("Delete:", row._id)}
//           />
//         </div>

//         {loading && <p className="text-sm text-black">Loading orders...</p>}

//         <OrderViewModal
//           open={open}
//           data={selectedOrder}
//           onClose={() => {
//             setOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// /* ===== SUMMARY CARD ===== */
// function SummaryCard({ title, value }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm p-5 border">
//       <p className="text-sm text-gray-600">{title}</p>
//       <p className="text-2xl font-bold text-black mt-1">{value}</p>
//     </div>
//   );
// }


"use client";

import { OrderViewModal } from "@/components/admin/OrderViewModal";
import { OrderTable } from "@/components/admin/OrderTable";
import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Order Placed", value: "Order%20placed" },
  { label: "Processed", value: "processed" },
  { label: "Assigned", value: "assigned" },
  { label: "Picked Up", value: "picked_up" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

export default function Page({ endPoint }) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");

  // Derive initial statusFilter from endPoint prop
  // e.g. endPoint="active_status=cancelled" → "cancelled"
  const getInitialStatus = () => {
    if (!endPoint) return "all";
    const match = endPoint.match(/active_status=(.+)/);
    return match ? match[1] : "all";
  };

  const [statusFilter, setStatusFilter] = useState(getInitialStatus);

  const fetchOrders = async (pageNo = 1) => {
    try {
      setLoading(true);

      let url;

      if (statusFilter === "all") {
        url = `/order?page=${pageNo}`;
      } else {
        url = `/order/status/${statusFilter}?page=${pageNo}`;
      }

      const res = await apiClient(url);

      if (res?.success) {
        setOrders(res.data.order_items);
        setSummary(res.data.summary);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders(page);
  }, [page, statusFilter]);

  const filteredOrders = orders.filter(
    (o) =>
      o.order_id?.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_id?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_id?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden -ml-20">
      <div className="p-4 md:p-6 space-y-6 flex-none w-full max-w-7xl mx-auto">
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
                border border-gray-500
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

          {/* STATUS FILTER — shows on ALL pages */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              w-44
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
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ===== SUMMARY ===== */}
        {summary && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard title="Total Orders" value={summary.total_items} />
              <SummaryCard title="Total Quantity" value={summary.total_quantity} />
              <SummaryCard title="Total Revenue" value={`₹ ${summary.total_revenue}`} />
            </div>
          </div>
        )}

        {/* ===== TABLE ===== */}
        <div className="w-full overflow-hidden">
          <OrderTable
            data={filteredOrders}
            currentPage={pagination?.current_page ?? 1}
            totalPages={pagination?.total_pages ?? 1}
            onPageChange={(p) => setPage(p)}
            onView={(row) => {
              setSelectedOrder(row);
              setOpen(true);
            }}
            onEdit={(row) => console.log("Edit:", row)}
            onDelete={(row) => console.log("Delete:", row._id)}
          />
        </div>

        {loading && <p className="text-sm text-black">Loading orders...</p>}

        <OrderViewModal
          open={open}
          data={selectedOrder}
          onClose={() => {
            setOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
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