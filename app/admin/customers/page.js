"use client";
import React, { useEffect, useState } from "react";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { apiClient } from "@/services/apiClient";
import { VendorViewModal } from "@/components/admin/VendorViewModal";

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

  return (
    <div className="p-6 bg-gray-50  text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          placeholder="Search name / email / phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:max-w-sm
               text-black outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-black"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-black"
          />
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setFromDate("");
            setToDate("");
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50"
        >
          Clear
        </button>
      </div>

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

      <VendorViewModal
        open={open}
        tittle="Customer"
        data={selectedCustomer}
        onClose={() => {
          setOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
}
