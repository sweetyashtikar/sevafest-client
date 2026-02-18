"use client";

import { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"; // Icons install kara: npm install lucide-react

export default function UsersTable({ users, onView, onStatusChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full bg-white p-4 shadow-sm rounded-xl border border-gray-100">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 px-2 py-1.5 rounded-lg text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            {[5, 10, 20, 50].map(val => <option key={val} value={val}>{val}</option>)}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Mobile", "Role", "Status", "Action"].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.mobile || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {user.role?.role || "User"}
                    </span>
                </td>
                
                {/* Status Switch */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={user.status}
                      onChange={() => onStatusChange?.(user._id, !user.status)} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-3 text-sm font-medium text-black">
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </label>
                </td>

                {/* View Action Icon */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onView(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors group"
                    title="View Details"
                  >
                    <Eye size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-black">{indexOfFirstRow + 1}</span> to <span className="font-bold text-black">{Math.min(indexOfLastRow, users.length)}</span> of {users.length} users
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}