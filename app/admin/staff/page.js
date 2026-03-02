"use client";

import { toast } from "react-toastify";
import { apiClient } from "@/services/apiClient";
import { useEffect, useState, useMemo } from "react";
import UsersTable from "@/components/admin/UsersTable";
import UserViewModal from "@/components/admin/UserViewModal";
import { Search } from "lucide-react";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const updateStatus = async (id, newStatus) => {
    try {
      console.log("id", id);
      console.log("inewStatusd", newStatus);

      await apiClient(`/users/status/${id}`, {
        method: "PATCH",
        body: { newStatus: newStatus },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user,
        ),
      );
      toast.success(
        `User ${newStatus ? "Activated" : "Deactivated "} successfully`,
      );
    } catch (err) {
      console.log("Status update failed:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update user status ";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient("/users");
        setUsers(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const uniqueRoles = useMemo(() => {
    const roleSet = new Set();

    users.forEach((user) => {
      if (user.role?.role && user.role.role !== "admin") {
        roleSet.add(user.role.role);
      }
    });

    return Array.from(roleSet);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (user.role?.role === "admin") return false;

      const matchesSearch =
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.mobile?.includes(search);

      const matchesRole =
        roleFilter === "all" || user.role?.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.status) ||
        (statusFilter === "inactive" && !user.status);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">OurStaff</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-72 rounded-lg border border-blue-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 bg-white shadow-sm text-black"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-indigo-300 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            bg-indigo-50 text-indigo-700 font-medium shadow-sm"
        >
          <option value="all">All Roles</option>

          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-emerald-300 
               focus:outline-none focus:ring-2 focus:ring-emerald-500 
               bg-emerald-50 text-emerald-700 font-medium shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <UsersTable
        users={filteredUsers}
        onView={setSelectedUser}
        onStatusChange={updateStatus}
      />

      <UserViewModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
