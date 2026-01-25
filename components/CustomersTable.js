import React, { useState } from 'react';
import { Eye, Trash2, X } from 'lucide-react';

/* ================= MOCK DATA ================= */

const customers = [
  {
    id: "3b9001",
    date: "2026-01-25",
    name: "User",
    email: "user@email.com",
    phone: "9876543210",
  },
  {
    id: "3b6027",
    date: "2026-01-25",
    name: "SAMEER",
    email: "sameer@email.com",
    phone: "9999999999",
  },
];

/* ================= COMPONENT ================= */

export function CustomersTable() {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (customerId) => {
    console.log("Delete customer:", customerId);
    // Add your delete logic here
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col mt-5 mb-6 gap-6">
        <h1 className="text-3xl font-bold text-black">Customers</h1>
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search customer-name / email / contact-number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full
              px-4
              py-2.5
              border
              border-gray-300
              rounded-lg
              text-sm
              text-black          
              placeholder-gray-400
              outline-none
              focus:ring-2
              focus:ring-orange-400
              focus:border-orange-400
              transition
            "
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewClick(row)}
                      className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:bg-green-50 rounded-lg transition-colors mr-2"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-0"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Details
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {selectedCustomer && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Customer ID
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {selectedCustomer.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Name
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {selectedCustomer.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Email Address
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {selectedCustomer.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Phone Number
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {selectedCustomer.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Joining Date
                    </label>
                    <p className="text-base font-medium text-gray-900">
                      {selectedCustomer.date}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}