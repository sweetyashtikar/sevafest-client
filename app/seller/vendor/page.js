"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Page() {
  const { user } = useSelector((a) => a.auth);
  const fieldManagerId = user?.id;

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const res = await apiClient(
        `/vendor/field-manager/${fieldManagerId}?page=${page}&search=${search}`,
      );

      if (res.success) {
        setVendors(res.data.vendors);
        setPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page, search]);

  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1c24]">
          Vendors Management
        </h1>

        <p className="text-sm text-gray-500">
          Vendors assigned to this field manager
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-black
            focus:ring-2 focus:ring-[#fdd835] focus:border-[#fdd835]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1c24]">Vendors List</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading vendors...
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No vendors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Mobile</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-[#1a1c24]">
                      {vendor.username}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {vendor.mobile || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {vendor.email || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          vendor.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {vendor.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 px-2 gap-4">
        {/* Left Side: Summary Info */}
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#fdd835] animate-pulse" />
          Page <span className="text-black">{page}</span> of{" "}
          <span className="text-black">{pages}</span>
        </div>

        {/* Right Side: Navigation */}
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-all 
      hover:border-[#fdd835] hover:text-black hover:shadow-md active:scale-95 
      disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
          >
            <ChevronLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Prev
          </button>

          {/* Current Page Circle */}
          <div className="flex h-10 w-10 items-center justify-center bg-[#fdd835] text-black font-black rounded-xl shadow-lg shadow-[#fdd835]/40 ring-2 ring-white transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
            {page}
          </div>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-all 
      hover:border-[#fdd835] hover:text-black hover:shadow-md active:scale-95 
      disabled:opacity-30 disabled:pointer-events-none disabled:grayscale"
          >
            Next
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
