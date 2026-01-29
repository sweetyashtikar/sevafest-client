"use client";

import { X, Package, Edit3, DollarSign, Box, FileText, AlertCircle, Settings } from "lucide-react";
import { PRODUCT_TYPES } from "@/components/products/productTypes";

export function EditProductModal({
  open,
  product,
  formData,
  loading,
  error,
  onClose,
  onSubmit,
  onChange,
  onNestedChange,
}) {
  if (!open || !product || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] h-[80%] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit3 className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Edit Product
              </h2>
              <p className="text-blue-100 text-sm">{product.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 flex flex-col overflow-hidden">
          
          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* ERROR */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                
                {/* Basic Information */}
                <Section title="Basic Information" icon={<Package className="w-5 h-5" />}>
                  <Input
                    label="Product Name *"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    icon={<Package className="w-4 h-4" />}
                    placeholder="Enter product name"
                  />

                  <Textarea
                    label="Short Description"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={onChange}
                    rows={3}
                    placeholder="Brief product description..."
                  />

                  <Input
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={onChange}
                    placeholder="Enter brand name"
                  />
                </Section>

                {/* SIMPLE PRODUCT PRICING */}
                {formData.productType === PRODUCT_TYPES.SIMPLE && (
                  <Section title="Pricing & Stock" icon={<DollarSign className="w-5 h-5" />}>
                    <Input
                      label="Price *"
                      type="number"
                      step="0.01"
                      value={formData.simpleProduct?.sp_price || 0}
                      onChange={(e) =>
                        onNestedChange(
                          "simpleProduct",
                          "sp_price",
                          parseFloat(e.target.value),
                        )
                      }
                      required
                      icon={<DollarSign className="w-4 h-4" />}
                      placeholder="0.00"
                    />

                    <Input
                      label="Special Price"
                      type="number"
                      step="0.01"
                      value={formData.simpleProduct?.sp_specialPrice || 0}
                      onChange={(e) =>
                        onNestedChange(
                          "simpleProduct",
                          "sp_specialPrice",
                          parseFloat(e.target.value),
                        )
                      }
                      icon={<DollarSign className="w-4 h-4" />}
                      placeholder="0.00"
                    />

                    <Input
                      label="Stock Quantity"
                      type="number"
                      value={formData.simpleProduct?.sp_totalStock || 0}
                      onChange={(e) =>
                        onNestedChange(
                          "simpleProduct",
                          "sp_totalStock",
                          parseInt(e.target.value),
                        )
                      }
                      icon={<Box className="w-4 h-4" />}
                      placeholder="0"
                    />
                  </Section>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                
                {/* Product Settings */}
                <Section title="Product Settings" icon={<Settings className="w-5 h-5" />}>
                  <Select
                    label="Product Type *"
                    name="productType"
                    value={formData.productType}
                    onChange={onChange}
                    options={[
                      { value: PRODUCT_TYPES.SIMPLE, label: "Simple Product" },
                      { value: PRODUCT_TYPES.VARIABLE, label: "Variable Product" },
                      { value: PRODUCT_TYPES.DIGITAL, label: "Digital Product" },
                      { value: PRODUCT_TYPES.SERVICE, label: "Service" },
                    ]}
                  />

                  <div className="space-y-3 pt-2">
                    <Checkbox
                      label="Active Status"
                      name="status"
                      checked={formData.status}
                      onChange={onChange}
                      description="Make this product visible to customers"
                    />

                    <Checkbox
                      label="Cash on Delivery"
                      name="codAllowed"
                      checked={formData.codAllowed}
                      onChange={onChange}
                      description="Allow COD payment method"
                    />

                    <Checkbox
                      label="Returnable"
                      name="isReturnable"
                      checked={formData.isReturnable}
                      onChange={onChange}
                      description="Product can be returned"
                    />

                    <Checkbox
                      label="Cancelable"
                      name="isCancelable"
                      checked={formData.isCancelable}
                      onChange={onChange}
                      description="Order can be canceled"
                    />
                  </div>
                </Section>
              </div>

              {/* FULL WIDTH - DESCRIPTION */}
              <div className="md:col-span-2">
                <Section title="Product Description" icon={<FileText className="w-5 h-5" />}>
                  <Textarea
                    label="Full Description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows={6}
                    placeholder="Enter detailed product description..."
                  />
                </Section>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

/* ===== SECTION COMPONENT ===== */
function Section({ title, icon, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
        {icon}
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ===== INPUT COMPONENT ===== */
function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full border border-gray-300 rounded-lg py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            icon ? 'pl-10 pr-4' : 'px-4'
          }`}
        />
      </div>
    </div>
  );
}

/* ===== TEXTAREA COMPONENT ===== */
function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
      />
    </div>
  );
}

/* ===== SELECT COMPONENT ===== */
function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ===== CHECKBOX COMPONENT ===== */
function Checkbox({ label, description, ...props }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <input 
        type="checkbox" 
        {...props}
        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}