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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] h-[80%] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Product Details
              </h2>
              <p className="text-blue-100 text-sm">View complete product information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              {/* Basic Information */}
              <Section title="Basic Information" icon={<Package className="w-5 h-5" />}>
                <Row label="Product Name" value={product.name || "N/A"} />
                <Row
                  label="Category"
                  value={product.categoryId?.name || "N/A"}
                  icon={<Tag className="w-4 h-4" />}
                />
                <Row label="Brand" value={product.brand || "N/A"} />
                <Row label="SKU" value={product.sku || "N/A"} mono />
              </Section>

              {/* Pricing & Status */}
              <Section title="Pricing & Status" icon={<DollarSign className="w-5 h-5" />}>
                <Row
                  label="Price"
                  value={`₹${(product.price || 0).toFixed(2)}`}
                  highlight
                />
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Out of Stock"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status || "Unknown"}
                  </span>
                </div>
                <Row
                  label="Stock"
                  value={`${product.stock || 0} units`}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </Section>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* Additional Details */}
              <Section title="Additional Details" icon={<FileText className="w-5 h-5" />}>
                <Row
                  label="Product Type"
                  value={product.productType || "N/A"}
                />
                <Row
                  label="Vendor"
                  value={
                    product.vendorId?.username ||
                    product.vendorId?.company ||
                    "N/A"
                  }
                  icon={<User className="w-4 h-4" />}
                />
                <Row
                  label="Created Date"
                  value={
                    product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                  icon={<Calendar className="w-4 h-4" />}
                />
                {product.taxId && (
                  <Row
                    label="Tax"
                    value={`${product.taxId.title} (${product.taxId.percentage}%)`}
                  />
                )}
              </Section>

              {/* Description */}
              <Section title="Description" icon={<FileText className="w-5 h-5" />}>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description || "No description available"}
                  </p>
                </div>
              </Section>

            </div>
          </div>

          {/* Product Image Section (if available) */}
          {product.image && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Image
              </h3>
              <div className="flex justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-64 rounded-lg shadow-md object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
          >
            Edit Product
          </button>
        </div>

      </div>
    </div>
  );
}

/* ===== SMALL REUSABLE UI ===== */

function Section({ title, icon, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
        {icon}
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value, mono, highlight, icon }) {
  return (
    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="text-gray-600 font-medium flex items-center gap-2">
        {icon}
        {label}:
      </span>
      <span
        className={`font-medium ${
          mono ? "font-mono text-sm" : ""
        } ${highlight ? "text-blue-600 font-bold text-lg" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}