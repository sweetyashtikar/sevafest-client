"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";

export function CategoryViewModal({ id, onClose }) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  // ESC close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await apiClient(`/category/${id}`);
        console.log("rescategory", res);

        if (!res?.success) {
          throw new Error(res?.message || "Failed to load category");
        }

        setCategory(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-xl shadow-2xl w-[780px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900">Category Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 space-y-6">
          {loading && (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading category...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {category && (
            <div className="space-y-6">

              {/* Category Name */}
              <ViewField label="Category Name *" value={category.name} />

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  URL Slug
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <span className="px-4 py-3 bg-gray-50 text-sm text-gray-500 border-r border-gray-300 whitespace-nowrap">
                    /categories/
                  </span>
                  <div className="flex-1 px-4 py-3 bg-gray-50 text-sm text-gray-800">
                    {category.slug || "-"}
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  This slug will be auto-generated from the category name
                </p>
              </div>

              {/* Display Order + Status */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Display Order
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800">
                    {category.row_order ?? "-"}
                  </div>
                  <p className="text-xs text-gray-400">Lower numbers appear first</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800">
                    {category.status ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Sub Categories */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Sub-Categories
                </label>
                <div className="flex flex-wrap gap-2 min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {category.sub_category?.length > 0 ? (
                    category.sub_category.map((sub, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No sub-categories</p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Images */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <div className="grid grid-cols-2 gap-5">
                  <ImagePreview label="Category Image" src={category.image} />
                  <ImagePreview label="Banner Image" src={category.banner} wide />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Meta Info */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Information
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Total Clicks</p>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800">
                      {category.clicks ?? "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Created At</p>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800">
                      {new Date(category.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800">
                      {new Date(category.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- reusable components ---------------- */

function ViewField({ label, value }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800">
        {value || "-"}
      </div>
    </div>
  );
}

function ImagePreview({ label, src, wide = false }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {src ? (
        <img
          src={src}
          alt={label}
          className={`rounded-lg border border-gray-300 object-cover ${
            wide ? "h-28 w-full" : "h-24 w-24"
          }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300?text=Image+Error";
          }}
        />
      ) : (
        <div
          className={`rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center ${
            wide ? "h-28 w-full" : "h-24 w-24"
          }`}
        >
          <p className="text-xs text-gray-400">No image</p>
        </div>
      )}
    </div>
  );
}