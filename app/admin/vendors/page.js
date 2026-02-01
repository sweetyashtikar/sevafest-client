"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { VenderTable } from "@/components/admin/VenderTable";
import { VendorViewModal } from "@/components/admin/VendorViewModal";
import { apiClient } from "@/services/apiClient";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

export default function Page() {
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
          role: item.role?.role ?? "-",
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
      const newStatus = !row.status; // toggle

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
      if(newStatus === true){
        alert("Status updated successfully and Email is sent to the user.");
      }
      alert("Status updated successfully");
      console.log("Status updated:", row.id, newStatus);
    } catch (error) {
      console.error("Status update failed", error);

      setVendors((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: row.status } : item,
        ),
      );
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

  return (
    <div className="p-6 space-y-5 text-black">
      {/* HEADING */}
      <h1 className="text-2xl font-bold">Vendors</h1>

      {/* SEARCH + FILTER */}
      <div className="flex items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
          />
          <input
            type="text"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5
              border border-gray-300 rounded-lg
              text-sm text-black
              outline-none
            "
          />
        </div>

        {/* FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            w-48 px-4 py-2.5
            border border-gray-300 rounded-lg
            text-sm text-black bg-white
          "
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="not_verified">Not Verified</option>
        </select>
      </div>

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
      />
      <VendorViewModal
        open={open}
        data={selectedVendor}
        onClose={() => {
          setOpen(false);
          setSelectedVendor(null);
        }}
      />
    </div>
  );
}
