"use client";

import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Download, Plus, Search, Upload } from "lucide-react";
import { VenderTable } from "@/components/admin/VenderTable";
import { VendorViewModal } from "@/components/admin/VendorViewModal";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "balance", label: "Balance" },
];

export default function Page() {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient("/users/vendors");

        const mappedData = res.data.map((item) => ({
          id: item._id,
          name: item.username,
          email: item.email,
          balance: item.balance || "-",
          status: item.status,
          raw: item,
        }));

        setVendors(mappedData);
      } catch (err) {
        console.error("Vendor fetch failed", err);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (row) => {
    try {
      const newStatus = !row.status;

      setVendors((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: newStatus } : item,
        ),
      );

      const data = await apiClient(`/updateStatus/User/${row.id}`, {
        method: "PATCH",
        body: {
          newStatus: newStatus,
        },
      });

      if (newStatus === true) {
        toast.success(
          "Vendor verified successfully. Email notification sent to the user.",
        );
      } else {
        toast.info("Vendor verification removed successfully.");
      }

      console.log("Status updated:", row.id, newStatus);
    } catch (error) {
      console.error("Status update failed", error);

      // rollback UI
      setVendors((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: row.status } : item,
        ),
      );

      toast.error("Failed to update vendor status. Please try again.");
    }
  };

  const filteredData = vendors.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "verified"
          ? user.status === true
          : user.status === false;

    return searchMatch && statusMatch;
  });

  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) {
      toast.error("No data available to export!");
      return;
    }

<<<<<<< HEAD
      {/* SEARCH + FILTER */}
      <div className="flex items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-full max-w-md -ml-24 mr-8">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
    w-full pl-10 pr-4 py-2.5
    border border-[#0F766E]
    rounded-lg
    text-sm text-black
    outline-none
    bg-gray-50
    focus:bg-white
    focus:ring-2
    focus:ring-[#0F766E]/30
    transition-all
  "
=======
    const formatDate = (date) => {
      if (!date) return "N/A";
      const d = new Date(date);

      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const dataToExport = filteredData.map((v, index) => {
      const fullData = v.raw;

      return {
        "Sr No": index + 1,
        "Vendor Name": fullData.username || "N/A",
        Email: fullData.email || "N/A",
        Role: fullData.role?.name || "Vendor",
        Balance: fullData.balance ?? 0,
        "Cash Received": fullData.cash_received ?? 0,
        "Bonus Type": fullData.bonus_type || "N/A",
        Status: fullData.status ? "Verified" : "Pending",
        "Created Date": formatDate(fullData.createdAt || fullData.created_on),
        "Last Login": formatDate(fullData.last_login),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors List");

    worksheet["!cols"] = [
      { wch: 8 }, // Sr No
      { wch: 25 }, // Vendor Name
      { wch: 30 }, // Email
      { wch: 15 }, // Role
      { wch: 12 }, // Balance
      { wch: 15 }, // Cash Received
      { wch: 20 }, // Bonus Type
      { wch: 12 }, // Status
      { wch: 22 }, // Created Date
      { wch: 22 }, // Last Login
    ];

    XLSX.writeFile(
      workbook,
      `Vendors_List_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );

    toast.success("Vendor data exported successfully!");
  };
  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-6 -ml-20">
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Vendors
            </h1>
            <p className="text-sm text-gray-500">
              Manage your supplier network and verification status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
             hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={18} />
              Export
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F766E] rounded-lg
             hover:bg-[#0D5E58] transition-all shadow-md"
            >
              <Upload size={18} />
              Import
            </button>

            <button
              onClick={() => router.push("/admin/vendors/create")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white 
              bg-green-600 rounded-lg hover:bg-green-700 transition-all shadow-md"
            >
              <Plus size={18} />
              Add Vendor
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 ">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#0F766E] rounded-lg text-black text-sm outline-none focus:ring-2
               focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all"
            />
          </div>
          \
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none text-black
              focus:ring-2 focus:ring-[#0F766E]/20"
            >
              <option value="all">All Vendors</option>
              <option value="verified">Verified Only</option>
              <option value="not_verified">Pending Verification</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <VenderTable
            columns={columns}
            data={filteredData}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            onView={(row) => {
              setSelectedVendor(row.raw);
              setOpen(true);
            }}
            onStatusChange={handleStatusChange}
>>>>>>> d1840cb8ef3dc1271b5c3207b57c4776ac305a20
          />
        </div>

        {/* MODAL */}
        <VendorViewModal
          open={open}
          data={selectedVendor}
          onClose={() => {
            setOpen(false);
            setSelectedVendor(null);
          }}
        />
      </div>
    </div>
  );
}
