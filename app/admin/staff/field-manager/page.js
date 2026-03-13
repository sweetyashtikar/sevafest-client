"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { Search, Eye, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await apiClient("/users");

      if (res.success) {
        const fieldManagers = res.data.filter(
          (u) => u.role?.role === "field_manager",
        );

        setUsers(fieldManagers);
        setFiltered(fieldManagers);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(result);
    setPage(1);
  }, [search, users]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  const pages = Math.ceil(filtered.length / limit);

  return (
    <div className="p-6 -ml-10">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1c24]">Field Managers</h1>
      </div>

      {/* SEARCH */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search field manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-black
            focus:ring-2 focus:ring-[#fdd835] focus:border-[#fdd835]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1c24]">Field Managers List</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading field managers...
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No field managers found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Mobile</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Leads</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-[#1a1c24]">
                      {user.username}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.email || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.mobile || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          user.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* LEADS ICON */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/staff/field-manager/leads?field_manager=${user._id}`,
                          )
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-8 px-2">
          {/* Page Counter (Desktop) */}
          <div className="hidden sm:block text-sm font-bold text-gray-500 uppercase tracking-wider">
            Page <span className="text-[#1a1c24]">{page}</span> of{" "}
            <span className="text-[#1a1c24]">{pages}</span>
          </div>

          {/* Buttons Group */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-700 shadow-sm transition-all
        hover:border-[#fdd835] hover:bg-gray-50 active:scale-95
        disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
            >
              <ChevronLeft size={18} />
              Prev
            </button>

            {/* Current Page Indicator (Mobile & Tablet) */}
            <div className="flex h-10 w-10 items-center justify-center bg-[#fdd835] text-black font-black rounded-xl shadow-lg shadow-[#fdd835]/30 ring-2 ring-white">
              {page}
            </div>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-700 shadow-sm transition-all
        hover:border-[#fdd835] hover:bg-gray-50 active:scale-95
        disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
