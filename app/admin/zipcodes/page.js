// "use client";

// import React, { useState, useEffect } from "react";
// import { zipcodeService } from "@/API/zipcodeAPI";
// import { cityService } from "@/API/CityAPI";
// import DataTable from "@/components/admin/DataTable";
// import Modal from "@/components/admin/Model";
// import BulkUploadModal from "@/components/admin/BulkUploadModal";


// const Zipcodes = () => {
//   const [zipcodes, setZipcodes] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [editingZipcode, setEditingZipcode] = useState(null);
//   const [formData, setFormData] = useState({
//     zipcode: "",
//     city_id: "",
//     is_deliverable: true,
//   });
//   const [filters, setFilters] = useState({
//     city_id: "",
//     is_deliverable: "",
//   });
//   const [selectedRows, setSelectedRows] = useState([]);

//   useEffect(() => {
//     fetchZipcodes();
//     fetchCities();
//   }, [pagination.currentPage, filters]);

//   const fetchZipcodes = async () => {
//     setLoading(true);
//     try {
//       const response = await zipcodeService.getZipcodes(
//         pagination.currentPage,
//         10,
//         filters,
//       );

//       console.log("resposne", response);
//       setZipcodes(response?.zipcodes);
//       setPagination(response?.pagination);
//     } catch (error) {
//       console.error("Error fetching zipcodes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCities = async () => {
//     try {
//       const response = await cityService.getCities(1, 100);
//       setCities(response.cities);
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingZipcode) {
//         await zipcodeService.updateZipcode(editingZipcode._id, formData);
//       } else {
//         await zipcodeService.createZipcode(formData);
//       }
//       fetchZipcodes();
//       setShowModal(false);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving zipcode:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this zipcode?")) {
//       try {
//         await zipcodeService.deleteZipcode(id);
//         fetchZipcodes();
//       } catch (error) {
//         console.error("Error deleting zipcode:", error);
//       }
//     }
//   };

//   const handleBulkUpload = async (zipcodes) => {
//     try {
//       await zipcodeService.bulkUploadZipcodes(zipcodes);
//       setShowBulkModal(false);
//       fetchZipcodes();
//     } catch (error) {
//       console.error("Error bulk uploading zipcodes:", error);
//     }
//   };

//   const toggleDeliverable = async (id, currentStatus) => {
//     try {
//       await zipcodeService.updateZipcode(id, {
//         is_deliverable: !currentStatus,
//       });
//       fetchZipcodes();
//     } catch (error) {
//       console.error("Error toggling deliverable status:", error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       zipcode: "",
//       city_id: "",
//       is_deliverable: true,
//     });
//     setEditingZipcode(null);
//   };

//   const columns = [
//     { key: "zipcode", label: "PIN Code", sortable: true },
//     {
//       key: "city_id",
//       label: "City",
//       render: (city_id) => city_id?.name || "N/A",
//     },
//     {
//       key: "is_deliverable",
//       label: "Status",
//       render: (value, row) => (
//         <button
//           onClick={() => toggleDeliverable(row._id, value)}
//           className={`px-2 py-1 rounded-full text-xs font-semibold ${
//             value
//               ? "bg-green-100 text-green-800 hover:bg-green-200"
//               : "bg-red-100 text-red-800 hover:bg-red-200"
//           }`}
//         >
//           {value ? "Deliverable" : "Not Deliverable"}
//         </button>
//       ),
//     },
//     {
//       key: "createdAt",
//       label: "Created At",
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button
//             onClick={() => {
//               setEditingZipcode(row);
//               setFormData({
//                 zipcode: row.zipcode,
//                 city_id: row.city_id?._id,
//                 is_deliverable: row.is_deliverable,
//               });
//               setShowModal(true);
//             }}
//             className="text-blue-600 hover:text-blue-900"
//           >
//             {/* <PencilIcon className="w-5 h-5" /> */}
//           </button>
//           <button
//             onClick={() => handleDelete(row._id)}
//             className="text-red-600 hover:text-red-900"
//           >
//             {/* <TrashIcon className="w-5 h-5" /> */}
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 -ml-12 pt-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           PIN Codes Management
//         </h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setShowBulkModal(true)}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
//           >
//             {/* <PlusIcon className="w-5 h-5 mr-2" /> */}
//             Bulk Upload
//           </button>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowModal(true);
//             }}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
//           >
//             {/* <PlusIcon className="w-5 h-5 mr-2" /> */}
//             Add PIN Code
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

//   {/* City Filter */}
//   <select
//     value={filters.city_id}
//     onChange={(e) => setFilters({ ...filters, city_id: e.target.value })}
//     className="px-4 py-2 border border-gray-700 rounded-lg text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   >
//     <option value="" className="text-gray-700">All Cities</option>

//     {cities.map((city) => (
//       <option key={city._id} value={city._id}>
//         {city.name}
//       </option>
//     ))}
//   </select>

//   {/* Deliverable Filter */}
//   <select
//     value={filters.is_deliverable}
//     onChange={(e) =>
//       setFilters({ ...filters, is_deliverable: e.target.value })
//     }
//     className="px-4 py-2 border border-gray-700 rounded-lg text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//   >
//     <option value="" className="text-gray-700">All Status</option>
//     <option value="true">Deliverable</option>
//     <option value="false">Not Deliverable</option>
//   </select>

// </div>

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={zipcodes}
//         loading={loading}
//         pagination={pagination}
//         onPageChange={(page) =>
//           setPagination({ ...pagination, currentPage: page })
//         }
//         onRowSelect={setSelectedRows}
//         selectedRows={selectedRows}
//       />

//       {/* Create/Edit Modal */}
      
//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           resetForm();
//         }}
//         title={editingZipcode ? "Edit PIN Code" : "Add New PIN Code"}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
// <label className="block text-gray-700 mb-2 font-bold">
//   PIN Code
// </label>              <input
//                 type="text"
//                 value={formData.zipcode}
//                 onChange={(e) =>
//                   setFormData({ ...formData, zipcode: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 pattern="\d{6}"
//                 title="Please enter a valid 6-digit PIN code"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">City</label>
//               <select
//                 value={formData.city_id}
//                 onChange={(e) =>
//                   setFormData({ ...formData, city_id: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="">Select City</option>
//                 {cities.map((city) => (
//                   <option key={city._id} value={city._id}>
//                     {city.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={formData.is_deliverable}
//                 onChange={(e) =>
//                   setFormData({ ...formData, is_deliverable: e.target.checked })
//                 }
//                 className="mr-2"
//               />
//               <label className="text-gray-700">Deliverable</label>
//             </div>
//           </div>
//           <div className="flex justify-end space-x-2 mt-6">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowModal(false);
//                 resetForm();
//               }}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               {editingZipcode ? "Update" : "Create"}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {/* Bulk Upload Modal */}
//       <BulkUploadModal
//         isOpen={showBulkModal}
//         onClose={() => setShowBulkModal(false)}
//         onUpload={handleBulkUpload}
//         template={[
//           { zipcode: "400001", city_id: "city_id_here", is_deliverable: true },
//           { zipcode: "400002", city_id: "city_id_here", is_deliverable: true },
//         ]}
//         entityName="zipcodes"
//       />
//     </div>
//   );
// };

// export default Zipcodes;


"use client";

import React, { useState, useEffect } from "react";
import { zipcodeService } from "@/API/zipcodeAPI";
import { cityService } from "@/API/CityAPI";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Model";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
import { Pencil, Trash2 } from "lucide-react";

const Zipcodes = () => {
  const [zipcodes, setZipcodes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingZipcode, setEditingZipcode] = useState(null);
  const [formData, setFormData] = useState({
    zipcode: "",
    city_id: "",
    is_deliverable: true,
  });
  const [filters, setFilters] = useState({
    city_id: "",
    is_deliverable: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  // Re-fetch whenever page or filters change
  useEffect(() => {
    fetchZipcodes();
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    fetchCities();
  }, []);

  // ─── Data Fetching ───────────────────────────────────────────────────────────

  const fetchZipcodes = async () => {
    setLoading(true);
    try {
      const response = await zipcodeService.getZipcodes(
        pagination.currentPage,
        10,
        filters
      );
      setZipcodes(response?.zipcodes || []);
      if (response?.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching zipcodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await cityService.getCities(1, 100);
      setCities(response?.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // ─── CRUD Handlers ───────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingZipcode) {
        // PUT /zipCode/:id
        await zipcodeService.updateZipcode(editingZipcode._id, formData);
      } else {
        // POST /zipCode
        await zipcodeService.createZipcode(formData);
      }
      fetchZipcodes();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving zipcode:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this PIN code?")) {
      try {
        // DELETE /zipCode/:id
        await zipcodeService.deleteZipcode(id);
        fetchZipcodes();
      } catch (error) {
        console.error("Error deleting zipcode:", error);
      }
    }
  };

  const handleBulkUpload = async (zipcodeList) => {
    try {
      // POST /zipCode/bulk  — sends { zipcodes: [...] }
      await zipcodeService.bulkUploadZipcodes(zipcodeList);
      setShowBulkModal(false);
      fetchZipcodes();
    } catch (error) {
      console.error("Error bulk uploading zipcodes:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.length} PIN code(s)?`
      )
    ) {
      try {
        // DELETE /zipCode/bulk/delete  — sends { zipcode: [ids] }
        await zipcodeService.bulkDeleteZipcodes(selectedRows);
        setSelectedRows([]);
        fetchZipcodes();
      } catch (error) {
        console.error("Error bulk deleting zipcodes:", error);
      }
    }
  };

  // Toggle deliverable via PUT /zipCode/:id
  const toggleDeliverable = async (id, currentStatus) => {
    try {
      await zipcodeService.updateZipcode(id, {
        is_deliverable: !currentStatus,
      });
      fetchZipcodes();
    } catch (error) {
      console.error("Error toggling deliverable status:", error);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({ zipcode: "", city_id: "", is_deliverable: true });
    setEditingZipcode(null);
  };

  const openEditModal = (row) => {
    setEditingZipcode(row);
    setFormData({
      zipcode: row.zipcode,
      city_id: row.city_id?._id || row.city_id,
      is_deliverable: row.is_deliverable,
    });
    setShowModal(true);
  };

  const handleFilterChange = (key, value) => {
    // Reset to page 1 on filter change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Table Columns ───────────────────────────────────────────────────────────

  const columns = [
    {
      key: "zipcode",
      label: "PIN Code",
      sortable: true,
    },
    {
      key: "city_id",
      label: "City",
      render: (city_id) => city_id?.name || "N/A",
    },
    {
      key: "is_deliverable",
      label: "Status",
      render: (value, row) => (
        <button
          onClick={() => toggleDeliverable(row._id, value)}
          className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
            value
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {value ? "Deliverable" : "Not Deliverable"}
        </button>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">PIN Codes Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Bulk Upload
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Add PIN Code
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* City Filter */}
        <select
          value={filters.city_id}
          onChange={(e) => handleFilterChange("city_id", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>

        {/* Deliverable Filter */}
        <select
          value={filters.is_deliverable}
          onChange={(e) => handleFilterChange("is_deliverable", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Deliverable</option>
          <option value="false">Not Deliverable</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={zipcodes}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        onRowSelect={setSelectedRows}
        selectedRows={selectedRows}
        onBulkDelete={selectedRows.length > 0 ? handleBulkDelete : undefined}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingZipcode ? "Edit PIN Code" : "Add New PIN Code"}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* PIN Code Input */}
            <div>
              <label className="block text-gray-700 mb-1 font-semibold text-sm">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.zipcode}
                onChange={(e) =>
                  setFormData({ ...formData, zipcode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                pattern="\d{6}"
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
                title="Please enter a valid 6-digit PIN code"
              />
            </div>

            {/* City Select */}
            <div>
              <label className="block text-gray-700 mb-1 font-semibold text-sm">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city_id}
                onChange={(e) =>
                  setFormData({ ...formData, city_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deliverable Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_deliverable"
                checked={formData.is_deliverable}
                onChange={(e) =>
                  setFormData({ ...formData, is_deliverable: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_deliverable" className="text-gray-700 text-sm">
                Deliverable
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              {editingZipcode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onUpload={handleBulkUpload}
        template={[
          { zipcode: "400001", city_id: "PASTE_CITY_ID_HERE", is_deliverable: true },
          { zipcode: "400002", city_id: "PASTE_CITY_ID_HERE", is_deliverable: true },
        ]}
        entityName="Zipcodes"
      />
    </div>
  );
};

export default Zipcodes;