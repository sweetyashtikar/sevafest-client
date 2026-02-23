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
        console.log("rescategory", res)

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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-xl shadow-xl
                   w-[80vw] h-[60vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Category Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="py-10 text-center text-gray-600">
              Loading category...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {category && (
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ViewField label="Category Name" value={category.name} />

                  <ViewField
                    label="Status"
                    value={category.status ? "Active" : "Inactive"}
                    badge
                  />

                  <ViewField
                    label="URL Slug"
                    value={`/categories/${category.slug}`}
                    full
                  />

                  <ViewField
                    label="Display Order"
                    value={category.row_order}
                  />
                </div>
              </div>

              {/* Sub Categories */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Sub-Categories
                </h3>

                <div className="flex flex-wrap gap-2">
                  {category.sub_category?.length > 0 ? (
                    category.sub_category.map((sub, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1
                                   rounded-full text-sm
                                   bg-blue-100 text-blue-800"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No sub-categories
                    </p>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Images
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImagePreview
                    label="Category Image"
                    src={category.image}
                  />

                  <ImagePreview
                    label="Banner Image"
                    src={category.banner}
                    wide
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Meta Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ViewField
                    label="Total Clicks"
                    value={category.clicks}
                  />

                  <ViewField
                    label="Created At"
                    value={new Date(category.createdAt).toLocaleString()}
                  />

                  <ViewField
                    label="Last Updated"
                    value={new Date(category.updatedAt).toLocaleString()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md
                       text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- reusable components ---------------- */

function ViewField({ label, value, full = false, badge = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </p>
      {badge ? (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium
            ${
              value === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {value}
        </span>
      ) : (
        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
          {value || "-"}
        </div>
      )}
    </div>
  );
}

function ImagePreview({ label, src, wide = false }) {
  return (
    <div>
      <p className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </p>

      {src ? (
        <img
          src={src}  // Just use the src directly since it's already a full URL
          alt={label}
          className={`rounded border object-cover
            ${wide ? "h-24 w-full" : "h-20 w-20"}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300?text=Image+Error';
          }}
        />
      ) : (
        <div className={`rounded border bg-gray-100 flex items-center justify-center
          ${wide ? "h-24 w-full" : "h-20 w-20"}`}>
          <p className="text-gray-500 text-sm">No image</p>
        </div>
      )}
    </div>
  );
}
