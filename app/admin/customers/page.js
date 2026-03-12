"use client";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { apiClient } from "@/services/apiClient";
import { VendorViewModal } from "@/components/admin/VendorViewModal";
import { Search, Download, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await apiClient("/users");

      if (res?.success) {
        const onlyCustomers = res.data.filter(
          (user) => user.role?.role === "customer",
        );

        const mappedCustomers = onlyCustomers.map((user) => ({
          id: user._id,
          name: user.username || "-",
          email: user.email || "-",
          phone: user.mobile || "-",
          balance: user.balance || "-",
          date: user.created_on
            ? new Date(user.created_on).toLocaleDateString()
            : "-",
          status: user.status ?? false,
          raw: user,
        }));

        setCustomers(mappedCustomers);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const itemsPerPage = 20;

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    const createdDate = c.raw?.created_on ? new Date(c.raw.created_on) : null;

    const matchFromDate = fromDate ? createdDate >= new Date(fromDate) : true;

    const matchToDate = toDate
      ? createdDate <= new Date(toDate + "T23:59:59")
      : true;

    return matchSearch && matchFromDate && matchToDate;
  });

  const totalPages = Math.ceil(filtered?.length / itemsPerPage);

  const paginated = filtered?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleExport = () => {
    if (!paginated || paginated.length === 0) {
      toast.error("No data available to export!");
      return;
    }

    try {
      const dataToExport = paginated.map((c, index) => {
        const item = c.raw || c;

        return {
          "Sr No": index + 1,
          "Customer Name": item.username || "N/A",
          Email: item.email || "N/A",
          Phone: item.mobile || "N/A",
          Role: item.role?.role || "N/A",
          Balance: item.balance ?? 0,
          "Cash Received": item.cash_received ?? 0,
          "Bonus Type": item.bonus_type?.replace(/_/g, " ") || "N/A",
          Status: item.status ? "Active" : "Inactive",
          "Joined Date": item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-GB")
            : "N/A",
          "Last Login": item.last_login
            ? new Date(item.last_login).toLocaleString("en-GB")
            : "N/A",
          "IP Address": item.ip_address || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers List");

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
      ];

      XLSX.writeFile(
        workbook,
        `Customers_Detailed_Report_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("An error occurred during export!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 -ml-20">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Customers
            </h1>
            <p className="text-sm text-gray-500">
              View and manage your registered customer database
            </p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0F766E] text-white font-semibold rounded-lg
             hover:bg-[#0D5E58] transition-all shadow-md active:scale-95"
          >
            <Download size={20} />
            Export to Excel
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search name / email / phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-black outline-none focus:ring-2
               focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all"
            />
          </div>

          {/* DATE RANGE */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent px-2 py-1.5 text-sm text-black outline-none"
            />
            <span className="text-gray-400 font-bold">→</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent px-2 py-1.5 text-sm text-black outline-none"
            />
          </div>

          {/* CLEAR BUTTON */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFromDate("");
              setToDate("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600
             hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <CustomersTable
            customers={paginated}
            currentPage={currentPage}
            loading={loading}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onView={(row) => {
              setSelectedCustomer(row.raw);
              setOpen(true);
            }}
            onDelete={(id) => console.log("Delete", id)}
          />
        </div>

        {/* MODAL */}
        <VendorViewModal
          open={open}
          tittle="Customer Details"
          data={selectedCustomer}
          onClose={() => {
            setOpen(false);
            setSelectedCustomer(null);
          }}
        />
      </div>
    </div>
  );
}
