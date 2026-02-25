"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryTable from "@/components/categories/categoryTable";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryFilters from "@/components/categories/CategoryFilters";
import { CATEGORY_FILTERS } from "@/components/categories/categoryTypes";
import { apiClient } from "@/services/apiClient";
import { useSelector } from "react-redux";
import {CategoryViewModal} from "@/components/categories/CategoryViewModal"

import { getCookie } from "@/utils/getCookies";

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useSelector((a) => a.auth);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [viewCategoryId, setViewCategoryId] = useState(null);

  // Pagination & Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: CATEGORY_FILTERS.ALL,
    sort: "row_order_asc",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== CATEGORY_FILTERS.ALL && {
          status: filters.status,
        }),
      }).toString();

      const data = await apiClient(`/category?`);

      console.log("response", data);

      if (!data.status === 200) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.data || []);
      setPagination({
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / filters.limit),
        hasNext: data.total > filters.page * filters.limit,
        hasPrev: filters.page > 1,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchCategories();
  }, [
    filters.page,
    filters.limit,
    filters.sort,
    filters.status,
    filters.search,
  ]);

  // Handle category creation
  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await apiClient("/category", {
        method: "POST",
        body: categoryData,
      });

      console.log("response", response);

      if (!response.status === 200) {
        throw new Error(response.message || "Failed to fetch categories");
      }

      setShowForm(false);
      fetchCategories();
      return { success: true, response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Handle category update
  const handleUpdateCategory = async (id, categoryData) => {
    try {
      const data = await apiClient(`/category/${id}`, {
        method: "PUT",
        body: categoryData,
      });

      setEditingCategory(null);
      fetchCategories(); // refresh list

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err?.message || err?.error || "Failed to update category",
      };
    }
  };
  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await apiClient(`/category/${id}`, {
        method: "DELETE",
        body: {},
      });

      fetchCategories();
      return { success: true };
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const targetStatus = currentStatus === true ? false : true;

      const data = await apiClient(`/category/${id}`, {
        method: "PATCH",
        body: {
          newStatus: targetStatus,
        },
      });

      // Update local state immediately
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, status: targetStatus } : cat,
        ),
      );

      return { success: true, data };
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedCategories.length === 0) {
      alert("Please select categories and choose an action");
      return;
    }

    if (
      bulkAction === "delete" &&
      !confirm(`Delete ${selectedCategories.length} categories?`)
    ) {
      return;
    }

    try {
      // ACTIVATE / DEACTIVATE
      if (bulkAction === "activate" || bulkAction === "deactivate") {
        const newStatus = bulkAction === "activate";

        await Promise.all(
          selectedCategories.map((id) =>
            apiClient(`/category/${id}`, {
              method: "PATCH",
              body: {
                newStatus,
              },
            }),
          ),
        );
      }

      // DELETE
      if (bulkAction === "delete") {
        await Promise.all(
          selectedCategories.map((id) =>
            apiClient(`/category/${id}`, {
              method: "DELETE",
              body: {},
            }),
          ),
        );
      }

      // clear + refresh
      setSelectedCategories([]);
      setBulkAction("");
      fetchCategories();

      alert(
        `Successfully ${bulkAction}ed ${selectedCategories.length} categories`,
      );
    } catch (err) {
      alert(`Bulk action failed: ${err.message}`);
    }
  };

  // Handle row selection
  const handleSelectCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat._id));
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-2">
                Manage your product categories
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Category
              </button>
              <button
                onClick={fetchCategories}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedCategories.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-medium text-blue-800">
                  {selectedCategories.length} category(ies) selected
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" className="text-black bg-white">
                    Select Action
                  </option>
                  <option value="activate" className="text-black bg-white">
                    Activate
                  </option>
                  <option value="deactivate" className="text-black bg-white">
                    Deactivate
                  </option>
                  <option value="delete" className="text-black bg-white">
                    Delete
                  </option>
                </select>
                <button
                  onClick={handleBulkAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <CategoryFilters
            filters={filters}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
            }
          />
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <CategoryTable
                categories={categories}
                selectedCategories={selectedCategories}
                onSelectCategory={handleSelectCategory}
                onSelectAll={handleSelectAll}
                onDelete={handleDeleteCategory}
                onToggleStatus={handleToggleStatus}
                 onEdit={setEditingCategory}
                onView={(id) => setViewCategoryId(id)}
              />

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm font-bold text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{categories.length}</span>{" "}
                      of <span className="font-medium">{pagination.total}</span>{" "}
                      categories
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={!pagination.hasPrev}
                      className={`px-3 py-1 rounded-md ${
                        pagination.hasPrev
                          ? "bg-gray-200 hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {filters.page} of {pagination.totalPages || 1}
                    </span>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={!pagination.hasNext}
                      className={`px-3 py-1 rounded-md ${
                        pagination.hasNext
                          ? "bg-gray-200 hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                    <select
                      value={filters.limit}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          limit: parseInt(e.target.value),
                          page: 1,
                        }))
                      }
                      className="ml-4 px-3 py-1 border border-gray-300 rounded-md"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="25">25 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {(showForm || editingCategory) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CategoryForm
              category={editingCategory}
              onSubmit={async (data) => {
                let result;
                if (editingCategory) {
                  result = await handleUpdateCategory(
                    editingCategory._id,
                    data,
                  );
                } else {
                  result = await handleCreateCategory(data);
                }

                if (result.success) {
                  setShowForm(false);
                  setEditingCategory(null);
                }
                return result;
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
            />
          </div>
        </div>
      )}

      {viewCategoryId && (
        <CategoryViewModal
          id={viewCategoryId}
          onClose={() => setViewCategoryId(null)}
        />
      )}
    </div>
  );
}
