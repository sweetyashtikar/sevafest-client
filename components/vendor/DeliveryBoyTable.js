// components/vendor/DeliveryBoyTable.js
"use client";
import React from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Truck,
  Star,
  Phone,
  Mail,
  User,
} from "lucide-react";

const DeliveryBoyTable = ({
  deliveryBoys,
  loading,
  onStatusToggle,
  onDelete,
  pagination,
  onPageChange,
}) => {
  const [openMenuId, setOpenMenuId] = React.useState(null);
  console.log("deliveery_boys", deliveryBoys);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveryBoys.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <User className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm">
                      No delivery boys found
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Click "Add Delivery Boy" to create one
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              deliveryBoys.map((boy) => (
                <tr key={boy._id} className="hover:bg-gray-50">
                  {/* Employee ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-mono font-medium text-gray-600">
                          {boy.employment?.employee_id?.slice(-4) || "DB"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <span className="text-sm font-mono text-gray-700">
                          {boy.employment?.employee_id || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {boy.personal_details?.full_name ||
                            boy.user_id?.username ||
                            "Not set"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {boy.personal_details?.email ||
                          boy.user_id?.email ||
                          "Email not set"}
                      </span>
                    </div>
                  </td>

                  {/* Mobile Number */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {boy.personal_details?.mobile ||
                          boy.user_id?.mobile ||
                          "N/A"}
                      </span>
                    </div>
                    {boy.personal_details?.alternate_mobile && (
                      <div className="text-xs text-gray-500 mt-1 ml-6">
                        Alt: {boy.personal_details.alternate_mobile}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Toggle Switch */}
                      <button
                        onClick={() =>
                          onStatusToggle(boy._id, boy.employment?.status)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          boy.employment?.status
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                            boy.employment?.status
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>

                      {/* Status Text */}
                      <span
                        className={`text-sm font-medium ${
                          boy.employment?.status
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {boy.employment?.status ? "Active" : "Inactive"}
                      </span>

                      {/* Available Badge */}
                      {boy.availability?.is_available && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Available
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* <Calendar className="w-4 h-4 text-gray-400" /> */}
                      <span className="text-sm text-gray-700">
                        {formatDate(boy.employment?.joining_date)}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === boy._id ? null : boy._id)
                        }
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>

                      {openMenuId === boy._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                window.location.href = `/vendor/delivery-staff/${boy._id}`;
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                // Open edit modal
                                console.log("Edit delivery boy:", boy._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Profile
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete(boy._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Deactivate
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {(pagination.current_page - 1) * pagination.items_per_page + 1} to{" "}
            {Math.min(
              pagination.current_page * pagination.items_per_page,
              pagination.total_items,
            )}{" "}
            of {pagination.total_items} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(pagination.total_pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  pagination.current_page === i + 1
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyTable;
