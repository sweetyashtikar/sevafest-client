// "use client";

// import * as XLSX from "xlsx";
// import { toast } from "react-toastify";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { CATEGORY_FILTERS } from "@/components/categories/categoryTypes";
// import { apiClient } from "@/services/apiClient";
// import { useSelector } from "react-redux";
// import { CategoryViewModal } from "@/components/categories/CategoryViewModal";

// import CategoryTable from "@/components/categories/categoryTable";
// import CategoryForm from "@/components/categories/CategoryForm";
// import CategoryFilters from "@/components/categories/CategoryFilters";

// export default function CategoriesPage() {
//   const router = useRouter();
//   const { user } = useSelector((a) => a.auth);

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [bulkAction, setBulkAction] = useState("");
//   const [viewCategoryId, setViewCategoryId] = useState(null);

//   // Pagination & Filter states
//   const [filters, setFilters] = useState({
//     search: "",
//     status: CATEGORY_FILTERS.ALL,
//     sort: "createdAt_desc",   // नवीन सर्वात वर
//     page: 1,
//     limit: 10,
//   });

//   const [pagination, setPagination] = useState({
//     total: 0,
//     totalPages: 0,
//     hasNext: false,
//     hasPrev: false,
//   });

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams({
//         page: filters.page,
//         limit: filters.limit,
//         sort: filters.sort,
//         ...(filters.search && { search: filters.search }),
//         ...(filters.status !== CATEGORY_FILTERS.ALL && {
//           status: filters.status,
//         }),
//       }).toString();

//       const data = await apiClient(`/category?`);

//       console.log("response", data);

//       if (!data.status === 200) {
//         throw new Error(data.message || "Failed to fetch categories");
//       }

//       const sortedData = (data.data || []).sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setCategories(sortedData);


//       setPagination({
//         total: data.total || 0,
//         totalPages: Math.ceil((data.total || 0) / filters.limit),
//         hasNext: data.total > filters.page * filters.limit,
//         hasPrev: filters.page > 1,
//       });
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching categories:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch and refetch when filters change
//   useEffect(() => {
//     fetchCategories();
//   }, [
//     filters.page,
//     filters.limit,
//     filters.sort,
//     filters.status,
//     filters.search,
//   ]);

//   // Handle category creation
//   const handleCreateCategory = async (categoryData) => {
//     try {
//       const response = await apiClient("/category", {
//         method: "POST",
//         body: categoryData,
//       });

//       console.log("response", response);

//       if (!response.status === 200) {
//         throw new Error(response.message || "Failed to fetch categories");
//       }

//       setShowForm(false);
//       fetchCategories();
//       return { success: true, response };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   };

//   // Handle category update
//   const handleUpdateCategory = async (id, categoryData) => {


//     console.log("categoryData", categoryData);

//     try {
//       const data = await apiClient(`/category/${id}`, {
//         method: "PUT",
//         body: categoryData,
//       });

//       console.log("data", data);
//       setEditingCategory(null);
//       fetchCategories();

//       return { success: true, data };
//     } catch (err) {
//       return {
//         success: false,
//         error: err?.message || err?.error || "Failed to update category",
//       };
//     }
//   };
//   // Handle category deletion
//   const handleDeleteCategory = async (id) => {
//     if (!confirm("Are you sure you want to delete this category?")) return;

//     try {
//       const response = await apiClient(`/category/${id}`, {
//         method: "DELETE",
//         body: {},
//       });

//       fetchCategories();
//       return { success: true };
//     } catch (err) {
//       alert(`Failed to delete category: ${err.message}`);
//       return { success: false, error: err.message };
//     }
//   };

//   // Handle status toggle
//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       const targetStatus = currentStatus === true ? false : true;

//       const data = await apiClient(`/category/${id}`, {
//         method: "PATCH",
//         body: {
//           newStatus: targetStatus,
//         },
//       });

//       // Update local state immediately
//       setCategories((prev) =>
//         prev.map((cat) =>
//           cat._id === id ? { ...cat, status: targetStatus } : cat,
//         ),
//       );

//       return { success: true, data };
//     } catch (err) {
//       alert(`Failed to update status: ${err.message}`);
//       return { success: false, error: err.message };
//     }
//   };

//   const handleBulkAction = async () => {
//     if (!bulkAction || selectedCategories.length === 0) {
//       alert("Please select categories and choose an action");
//       return;
//     }

//     if (
//       bulkAction === "delete" &&
//       !confirm(`Delete ${selectedCategories.length} categories?`)
//     ) {
//       return;
//     }

//     try {
//       // ACTIVATE / DEACTIVATE
//       if (bulkAction === "activate" || bulkAction === "deactivate") {
//         const newStatus = bulkAction === "activate";

//         await Promise.all(
//           selectedCategories.map((id) =>
//             apiClient(`/category/${id}`, {
//               method: "PATCH",
//               body: {
//                 newStatus,
//               },
//             }),
//           ),
//         );
//       }

//       // DELETE
//       if (bulkAction === "delete") {
//         await Promise.all(
//           selectedCategories.map((id) =>
//             apiClient(`/category/${id}`, {
//               method: "DELETE",
//               body: {},
//             }),
//           ),
//         );
//       }

//       // clear + refresh
//       setSelectedCategories([]);
//       setBulkAction("");
//       fetchCategories();

//       alert(
//         `Successfully ${bulkAction}ed ${selectedCategories.length} categories`,
//       );
//     } catch (err) {
//       alert(`Bulk action failed: ${err.message}`);
//     }
//   };

//   // Handle row selection
//   const handleSelectCategory = (id) => {
//     setSelectedCategories((prev) =>
//       prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
//     );
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectedCategories.length === categories.length) {
//       setSelectedCategories([]);
//     } else {
//       setSelectedCategories(categories.map((cat) => cat._id));
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setFilters((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleExportXLS = () => {
//     if (!categories || categories.length === 0) {
//       toast.error("No categories available to export!");
//       return;
//     }

//     const excelData = categories.map((cat, index) => ({
//       "Sr. No.": index + 1,
//       "Category ID": cat._id,
//       Name: cat.name || "N/A",
//       Slug: cat.slug || "N/A",
//       Status: cat.status ? "Active" : "Inactive",
//       "Row Order": cat.row_order || 0,
//       Clicks: cat.clicks || 0,
//       "Sub Categories": Array.isArray(cat.sub_category)
//         ? cat.sub_category.join(", ")
//         : "None",
//       "Image URL": cat.image || "No Image",
//       "Created At": cat.createdAt
//         ? new Date(cat.createdAt).toLocaleString()
//         : "N/A",
//       "Updated At": cat.updatedAt
//         ? new Date(cat.updatedAt).toLocaleString()
//         : "N/A",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

//     worksheet["!cols"] = [
//       { wch: 8 },
//       { wch: 25 },
//       { wch: 25 },
//       { wch: 25 },
//       { wch: 10 },
//       { wch: 10 },
//       { wch: 10 },
//       { wch: 30 },
//       { wch: 40 },
//       { wch: 20 },
//       { wch: 20 },
//     ];

//     const fileName = `Categories_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
//     XLSX.writeFile(workbook, fileName);
//     toast.success("Categories exported successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 -ml-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
//               <p className="text-gray-600 mt-2">
//                 Manage your product categories
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={handleExportXLS}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
//                  text-white bg-green-600 hover:bg-green-700"
//               >
//                 <svg
//                   className="mr-2 -ml-1 w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                   />
//                 </svg>
//                 Export XLS
//               </button>

//               <button
//                 onClick={() => router.push("/admin/category/bulkimport")}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
//                  text-white bg-orange-500 hover:bg-orange-600"
//               >
//                 <svg
//                   className="mr-2 -ml-1 w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
//                   />
//                 </svg>
//                 Import
//               </button>

//               <button
//                 onClick={() => router.push("/admin/category/create")}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 <svg
//                   className="mr-2 -ml-1 w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//                 Add Category
//               </button>
//               <button
//                 onClick={fetchCategories}
//                 className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 <svg
//                   className="mr-2 -ml-1 w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="h-5 w-5 text-red-400"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">Error</h3>
//                 <div className="mt-2 text-sm text-red-700">
//                   <p>{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bulk Actions Bar */}
//         {selectedCategories.length > 0 && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div>
//                 <span className="font-medium text-blue-800">
//                   {selectedCategories.length} category(ies) selected
//                 </span>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <select
//                   value={bulkAction}
//                   onChange={(e) => setBulkAction(e.target.value)}
//                   className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="" className="text-black bg-white">
//                     Select Action
//                   </option>
//                   <option value="activate" className="text-black bg-white">
//                     Activate
//                   </option>
//                   <option value="deactivate" className="text-black bg-white">
//                     Deactivate
//                   </option>
//                   <option value="delete" className="text-black bg-white">
//                     Delete
//                   </option>
//                 </select>
//                 <button
//                   onClick={handleBulkAction}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Apply
//                 </button>
//                 <button
//                   onClick={() => setSelectedCategories([])}
//                   className="px-4 py-2 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="mb-6">
//           <CategoryFilters
//             filters={filters}
//             onFilterChange={(newFilters) =>
//               setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
//             }
//           />
//         </div>

//         {/* Categories Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <>
//               <CategoryTable
//                 categories={categories}
//                 selectedCategories={selectedCategories}
//                 onSelectCategory={handleSelectCategory}
//                 onSelectAll={handleSelectAll}
//                 onDelete={handleDeleteCategory}
//                 onToggleStatus={handleToggleStatus}
//                 onEdit={setEditingCategory}
//                 onView={(id) => setViewCategoryId(id)}
//               />

//               {/* Pagination */}
//               <div className="px-6 py-4 border-t border-gray-200 text-gray-700">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between">
//                   {/* LEFT TEXT */}
//                   <div className="mb-4 md:mb-0">
//                     <p className="text-sm font-bold text-gray-700">
//                       Showing{" "}
//                       <span className="font-medium">{categories.length}</span>{" "}
//                       of <span className="font-medium">{pagination.total}</span>{" "}
//                       categories
//                     </p>
//                   </div>

//                   {/* PAGINATION */}
//                   <div className="flex items-center space-x-2">
//                     {/* PREVIOUS */}
//                     <button
//                       onClick={() => handlePageChange(filters.page - 1)}
//                       disabled={!pagination.hasPrev}
//                       className={`px-3 py-1 rounded-md transition ${pagination.hasPrev
//                           ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
//                           : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
//                         }`}
//                     >
//                       Previous
//                     </button>

//                     {/* PAGE INFO ⭐ FIXED */}
//                     <span className="px-3 py-1 text-sm font-medium text-gray-700 opacity-100">
//                       Page {filters.page} of {pagination.totalPages || 1}
//                     </span>

//                     {/* NEXT */}
//                     <button
//                       onClick={() => handlePageChange(filters.page + 1)}
//                       disabled={!pagination.hasNext}
//                       className={`px-3 py-1 rounded-md transition ${pagination.hasNext
//                           ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
//                           : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
//                         }`}
//                     >
//                       Next
//                     </button>

//                     {/* LIMIT */}
//                     <select
//                       value={filters.limit}
//                       onChange={(e) =>
//                         setFilters((prev) => ({
//                           ...prev,
//                           limit: parseInt(e.target.value),
//                           page: 1,
//                         }))
//                       }
//                       className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="5">5 per page</option>
//                       <option value="10">10 per page</option>
//                       <option value="25">25 per page</option>
//                       <option value="50">50 per page</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Category Form Modal */}
//       {(showForm || editingCategory) && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <CategoryForm
//               category={editingCategory}
//               onSubmit={async (data) => {
//                 let result;
//                 if (editingCategory) {
//                   result = await handleUpdateCategory(
//                     editingCategory._id,
//                     data,
//                   );
//                 } else {
//                   result = await handleCreateCategory(data);
//                 }

//                 if (result.success) {
//                   setShowForm(false);
//                   setEditingCategory(null);
//                 }
//                 return result;
//               }}
//               onCancel={() => {
//                 setShowForm(false);
//                 setEditingCategory(null);
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {viewCategoryId && (
//         <CategoryViewModal
//           id={viewCategoryId}
//           onClose={() => setViewCategoryId(null)}
//         />
//       )}
//     </div>
//   );
// }


"use client";

import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_FILTERS } from "@/components/categories/categoryTypes";
import { apiClient } from "@/services/apiClient";
import { useSelector } from "react-redux";
import { CategoryViewModal } from "@/components/categories/CategoryViewModal";

import CategoryTable from "@/components/categories/categoryTable";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryFilters from "@/components/categories/CategoryFilters";

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useSelector((a) => a.auth);

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // raw data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [viewCategoryId, setViewCategoryId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: CATEGORY_FILTERS.ALL,
    sort: "createdAt_desc",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // ✅ Frontend filter + sort + paginate on allCategories
  const applyFilters = useCallback((data, currentFilters) => {
    let result = [...data];

    // 1. Search filter
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(q) ||
          cat.slug?.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (currentFilters.status !== CATEGORY_FILTERS.ALL) {
      const isActive = currentFilters.status === CATEGORY_FILTERS.ACTIVE;
      result = result.filter((cat) => cat.status === isActive);
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (currentFilters.sort) {
        case "createdAt_desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "createdAt_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "row_order_asc":
          return (a.row_order || 0) - (b.row_order || 0);
        case "row_order_desc":
          return (b.row_order || 0) - (a.row_order || 0);
        case "clicks_desc":
          return (b.clicks || 0) - (a.clicks || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // 4. Pagination
    const total = result.length;
    const totalPages = Math.ceil(total / currentFilters.limit);
    const start = (currentFilters.page - 1) * currentFilters.limit;
    const paginated = result.slice(start, start + currentFilters.limit);

    setCategories(paginated);
    setPagination({
      total,
      totalPages,
      hasNext: currentFilters.page < totalPages,
      hasPrev: currentFilters.page > 1,
    });
  }, []);

  // ✅ Fetch all data once from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiClient(`/category`);

      if (!data || !data.data) {
        throw new Error(data?.message || "Failed to fetch categories");
      }

      setAllCategories(data.data);
      applyFilters(data.data, filters);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-apply filters whenever filters change (no API call needed)
  useEffect(() => {
    if (allCategories.length > 0) {
      applyFilters(allCategories, filters);
    }
  }, [filters, allCategories, applyFilters]);

  // ✅ Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await apiClient("/category", {
        method: "POST",
        body: categoryData,
      });

      if (!response || response.error) {
        throw new Error(response?.message || "Failed to create category");
      }

      setShowForm(false);
      await fetchCategories();
      toast.success("Category created successfully!");
      return { success: true, response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleUpdateCategory = async (id, categoryData) => {
    try {
      const data = await apiClient(`/category/${id}`, {
        method: "PUT",
        body: categoryData,
      });

      setEditingCategory(null);
      await fetchCategories();
      toast.success("Category updated successfully!");
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err?.message || err?.error || "Failed to update category",
      };
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await apiClient(`/category/${id}`, {
        method: "DELETE",
        body: {},
      });

      await fetchCategories();
      toast.success("Category deleted!");
      return { success: true };
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const targetStatus = currentStatus === true ? false : true;

      await apiClient(`/category/${id}`, {
        method: "PATCH",
        body: { newStatus: targetStatus },
      });

      // ✅ Update both allCategories and displayed categories
      const updater = (prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, status: targetStatus } : cat
        );

      setAllCategories(updater);
      setCategories(updater);

      return { success: true };
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
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
      if (bulkAction === "activate" || bulkAction === "deactivate") {
        const newStatus = bulkAction === "activate";
        await Promise.all(
          selectedCategories.map((id) =>
            apiClient(`/category/${id}`, {
              method: "PATCH",
              body: { newStatus },
            })
          )
        );
      }

      if (bulkAction === "delete") {
        await Promise.all(
          selectedCategories.map((id) =>
            apiClient(`/category/${id}`, {
              method: "DELETE",
              body: {},
            })
          )
        );
      }

      setSelectedCategories([]);
      setBulkAction("");
      await fetchCategories();
      toast.success(
        `Successfully ${bulkAction}d ${selectedCategories.length} categories`
      );
    } catch (err) {
      toast.error(`Bulk action failed: ${err.message}`);
    }
  };

  const handleSelectCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat._id));
    }
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleExportXLS = () => {
    if (!allCategories || allCategories.length === 0) {
      toast.error("No categories available to export!");
      return;
    }

    const excelData = allCategories.map((cat, index) => ({
      "Sr. No.": index + 1,
      "Category ID": cat._id,
      Name: cat.name || "N/A",
      Slug: cat.slug || "N/A",
      Status: cat.status ? "Active" : "Inactive",
      "Row Order": cat.row_order || 0,
      Clicks: cat.clicks || 0,
      "Sub Categories": Array.isArray(cat.sub_category)
        ? cat.sub_category.join(", ")
        : cat.sub_category || "None",
      "Image URL": cat.image || "No Image",
      "Created At": cat.createdAt
        ? new Date(cat.createdAt).toLocaleString()
        : "N/A",
      "Updated At": cat.updatedAt
        ? new Date(cat.updatedAt).toLocaleString()
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

    worksheet["!cols"] = [
      { wch: 8 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 30 },
      { wch: 40 }, { wch: 20 }, { wch: 20 },
    ];

    const fileName = `Categories_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success("Categories exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 -ml-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-2">Manage your product categories</p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleExportXLS}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export XLS
              </button>

              <button onClick={() => router.push("/admin/category/bulkimport")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
                <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </button>

              <button onClick={() => router.push("/admin/category/create")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>

              <button onClick={fetchCategories}
                className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="font-medium text-blue-800">
                {selectedCategories.length} category(ies) selected
              </span>
              <div className="flex items-center space-x-4">
                <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Action</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="delete">Delete</option>
                </select>
                <button onClick={handleBulkAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
                <button onClick={() => setSelectedCategories([])}
                  className="px-4 py-2 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50">Clear</button>
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

        {/* Table */}
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
              <div className="px-6 py-4 border-t border-gray-200 text-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm font-bold text-gray-700">
                      Showing <span className="font-medium">{categories.length}</span>{" "}
                      of <span className="font-medium">{pagination.total}</span> categories
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={!pagination.hasPrev}
                      className={`px-3 py-1 rounded-md transition ${pagination.hasPrev
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"}`}>
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-700">
                      Page {filters.page} of {pagination.totalPages || 1}
                    </span>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={!pagination.hasNext}
                      className={`px-3 py-1 rounded-md transition ${pagination.hasNext
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"}`}>
                      Next
                    </button>
                    <select
                      value={filters.limit}
                      onChange={(e) => setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                      className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
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

      {/* Edit Modal */}
      {(showForm || editingCategory) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CategoryForm
              category={editingCategory}
              onSubmit={async (data) => {
                let result;
                if (editingCategory) {
                  result = await handleUpdateCategory(editingCategory._id, data);
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
        <CategoryViewModal id={viewCategoryId} onClose={() => setViewCategoryId(null)} />
      )}
    </div>
  );
}