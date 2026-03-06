"use client";

import { X, Package, Tag, DollarSign, Calendar, User, FileText, TrendingUp } from "lucide-react";

export function ProductViewModal({
  open,
  product,
  onClose,
  onEdit,
}) {
  if (!open || !product) return null;

  return (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-3xl h-[85%] flex flex-col overflow-hidden border border-gray-200">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Product Details</h2>
              <p className="text-xs text-gray-500">View complete product information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* LEFT COLUMN */}
            <div className="space-y-5">

              {/* Basic Information */}
              <Section title="Basic Information" icon={<Package className="w-4 h-4" />}>
                <Field label="Product Name" value={product.name || "N/A"} />
                <Field label="Category" value={product.categoryId?.name || "N/A"} icon={<Tag className="w-3.5 h-3.5" />} />
                <Field label="Brand" value={product.brand || "N/A"} />
                <Field label="SKU" value={product.sku || "N/A"} mono />
              </Section>

              {/* Pricing & Status */}
              <Section title="Pricing & Status" icon={<DollarSign className="w-4 h-4" />}>
                <Field label="Price" value={`₹${(product.price || 0).toFixed(2)}`} highlight />
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-500 font-medium">Status</label>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : product.status === "Out of Stock"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.status || "Unknown"}
                  </span>
                </div>
                <Field label="Stock" value={`${product.stock || 0} units`} icon={<TrendingUp className="w-3.5 h-3.5" />} />
              </Section>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">

              {/* Additional Details */}
              <Section title="Additional Details" icon={<FileText className="w-4 h-4" />}>
                <Field label="Product Type" value={product.productType || "N/A"} />
                <Field
                  label="Vendor"
                  value={product.vendorId?.username || product.vendorId?.company || "N/A"}
                  icon={<User className="w-3.5 h-3.5" />}
                />
                <Field
                  label="Created Date"
                  value={product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                {product.taxId && (
                  <Field label="Tax" value={`${product.taxId.title} (${product.taxId.percentage}%)`} />
                )}
              </Section>

              {/* Description */}
              <Section title="Description" icon={<FileText className="w-4 h-4" />}>
                <p className="text-xs text-gray-600 leading-relaxed border border-gray-200 rounded-lg p-3 bg-gray-50 min-h-[72px]">
                  {product.description || "No description available"}
                </p>
              </Section>

            </div>
          </div>

          {/* Product Image */}
          {product.image && (
            <div className="mt-5 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                Product Image
              </h3>
              <div className="flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-56 rounded-lg shadow-sm object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-4 py-2 text-xs rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Product
          </button>
        </div>

      </div>
    </div>
  );
}

/* ===== REUSABLE UI ===== */

function Section({ title, icon, children }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5 pb-2 border-b border-gray-100">
        {icon}
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ label, value, mono, highlight, icon }) {
  return (
    <div className="flex justify-between items-center">
      <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
        {icon}
        {label}
      </label>
      <span
        className={`text-xs font-medium text-right ${
          mono ? "font-mono text-gray-700" : ""
        } ${highlight ? "text-blue-600 font-semibold text-sm" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}