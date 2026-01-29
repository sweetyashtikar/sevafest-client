"use client";

import { X, User, Package, IndianRupee, Clock, Shield, MapPin, FileText, CreditCard } from "lucide-react";
import {formatDate, formatNumber} from "@/utils/date"

export function OrderViewModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      returned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Order Details
            </h2>
            <p className="text-orange-100 text-sm mt-1">
              Order #{data.order_id?.order_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-6">

            {/* STATUS BADGE */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(data.order_id?.status)}`}>
                    {data.order_id?.status?.toUpperCase() || "N/A"}
                  </div>
                  <div className="h-8 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${data.active_status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {data.active_status || "Inactive"}
                    </span>
                  </div>
                </div>
                {data.otp && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg px-4 py-2">
                    <p className="text-xs text-orange-600 font-semibold mb-1">DELIVERY OTP</p>
                    <p className="text-2xl font-bold text-orange-600 tracking-wider">{data.otp}</p>
                  </div>
                )}
              </div>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                
                {/* PRODUCT DETAILS */}
                <Section title="Product Information" icon={Package}>
                  <div className="col-span-2">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{data.product_name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{data.variant_name}</p>
                  </div>
                  <Info label="Quantity" value={data.quantity} highlight />
                  <Info label="Unit Price" value={`₹${formatNumber(data.price)}`} />
                  <Info label="Discounted Price" value={`₹${formatNumber(data.discounted_price)}`} highlight />
                  <Info label="Subtotal" value={`₹${formatNumber(data.sub_total)}`} />
                </Section>

                {/* CUSTOMER DETAILS */}
                <Section title="Customer Information" icon={User}>
                  <Info label="Name" value={data.user_id?.username} highlight />
                  <Info label="Email" value={data.user_id?.email} />
                  {data.user_id?.phone && (
                    <Info label="Phone" value={data.user_id.phone} />
                  )}
                </Section>

                {/* SELLER DETAILS */}
                <Section title="Seller Information" icon={Shield}>
                  <Info label="Seller Name" value={data.seller_id?.username} highlight />
                  <Info label="Seller Email" value={data.seller_id?.email} />
                  {data.seller_id?.phone && (
                    <Info label="Phone" value={data.seller_id.phone} />
                  )}
                </Section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                
                {/* PAYMENT SUMMARY */}
                <Section title="Payment Summary" icon={CreditCard}>
                  <Info label="Subtotal" value={`₹${formatNumber(data.sub_total)}`} />
                  <Info label="Tax Rate" value={`${data.tax_percent}%`} />
                  <Info label="Tax Amount" value={`₹${formatNumber(data.tax_amount)}`} />
                  <Info label="Discount" value={`-₹${formatNumber(data.discount)}`} highlight />
                  <div className="col-span-2 border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{formatNumber((data.sub_total || 0) + (data.tax_amount || 0) - (data.discount || 0))}
                      </span>
                    </div>
                  </div>
                </Section>

                {/* COMMISSION */}
                <Section title="Commission Details" icon={IndianRupee}>
                  <Info label="Admin Commission" value={`₹${formatNumber(data.admin_commission_amount)}`} />
                  <Info label="Seller Commission" value={`₹${formatNumber(data.seller_commission_amount)}`} />
                  <Info 
                    label="Payment Status" 
                    value={
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        data.is_credited 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {data.is_credited ? "Credited" : "Pending"}
                      </span>
                    } 
                  />
                </Section>

                {/* ORDER TIMELINE */}
                <Section title="Order Timeline" icon={Clock}>
                  <Info label="Order Placed" value={formatDate(data.date_added)} />
                  <Info label="Last Updated" value={formatDate(data.updated_at)} />
                </Section>
              </div>
            </div>

            {/* STATUS HISTORY - FULL WIDTH */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-orange-500" />
                <h3 className="text-lg font-bold text-gray-800">Status History</h3>
              </div>
              {data.status_history?.length ? (
                <div className="space-y-3">
                  {data.status_history.map((s, index) => (
                    <div
                      key={s._id || index}
                      className="flex items-center justify-between border-l-4 border-orange-400 bg-gray-50 rounded-r-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{s.status}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(s.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(s.status)}`}>
                        {s.status?.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No status history available</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-white px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-mono font-semibold text-gray-700">{data.order_id?.order_number}</span>
          </p>
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}



function Section({ title, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon size={20} className="text-orange-500" />}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Info({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500 mb-1.5 tracking-wide">
        {label}
      </p>
      <p className={`text-sm font-medium ${highlight ? 'text-orange-600 font-semibold' : 'text-gray-800'}`}>
        {value ?? "-"}
      </p>
    </div>
  );
}


