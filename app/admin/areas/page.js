"use client";

import React, { useState, useEffect } from "react";
import { areaService } from "@/API/areaAPI";
import { cityService } from "@/API/CityAPI";
import { zipcodeService } from "@/API/zipcodeAPI";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Model";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
import { Pencil, Trash2 } from "lucide-react";

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [zipcodes, setZipcodes] = useState([]);
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
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city_id: "",
    zipcode_id: "",
    pincode: "",
    minimum_free_delivery_order_amount: 100,
    delivery_charges: 0,
    estimated_delivery_days: 2,
    is_cod_available: true,
    is_deliverable: true,
    // ⚠️ Backend model uses "status" not "active"
    status: true,
  });
  const [filters, setFilters] = useState({
    city_id: "",
    active: "", // maps to "status" in backend query
    pincode: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchAreas();
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch zipcodes when city changes in form
  useEffect(() => {
    if (formData.city_id) {
      fetchZipcodesByCity(formData.city_id);
    } else {
      setZipcodes([]);
    }
  }, [formData.city_id]);

  // ─── Data Fetching ───────────────────────────────────────────────────────────

  const fetchAreas = async () => {
    setLoading(true);
    try {
      // GET /areas?page=1&limit=10&city_id=...&status=true
      const response = await areaService.getAreas(
        pagination.currentPage,
        10,
        filters
      );
      // Backend returns: { success, data: { areas, pagination, summary } }
      setAreas(response?.data?.areas || []);
      if (response?.data?.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      // GET /cities?page=1&limit=100
      const response = await cityService.getCities(1, 100);
      setCities(response?.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchZipcodesByCity = async (cityId) => {
    try {
      // GET /zipCode/:cityId  — returns deliverable zipcodes for a city
      const response = await zipcodeService.getZipcodesByCity(cityId);
      // Backend returns array directly under response.data
      setZipcodes(response?.data || []);
    } catch (error) {
      console.error("Error fetching zipcodes:", error);
      setZipcodes([]);
    }
  };

  // ─── CRUD Handlers ───────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArea) {
        // PUT /areas/:id
        await areaService.updateArea(editingArea._id, formData);
      } else {
        // POST /areas
        await areaService.createArea(formData);
      }
      fetchAreas();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving area:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this area?")) {
      try {
        // DELETE /areas/:id
        await areaService.deleteArea(id);
        fetchAreas();
      } catch (error) {
        console.error("Error deleting area:", error);
      }
    }
  };

  const handleBulkUpload = async (areasList) => {
    try {
      // Individual POSTs (no bulk route in backend)
      await areaService.bulkUploadAreas(areasList);
      setShowBulkModal(false);
      fetchAreas();
    } catch (error) {
      console.error("Error bulk uploading areas:", error);
    }
  };

  // PATCH /areas/:id/toggle-status
  const toggleActive = async (id) => {
    try {
      await areaService.toggleAreaStatus(id);
      fetchAreas();
    } catch (error) {
      console.error("Error toggling area status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      city_id: "",
      zipcode_id: "",
      pincode: "",
      minimum_free_delivery_order_amount: 100,
      delivery_charges: 0,
      estimated_delivery_days: 2,
      is_cod_available: true,
      is_deliverable: true,
      status: true,
    });
    setEditingArea(null);
    setZipcodes([]);
  };

  const openEditModal = (row) => {
    setEditingArea(row);
    setFormData({
      name: row.name,
      city_id: row.city_id?._id || row.city_id,
      zipcode_id: row.zipcode_id?._id || row.zipcode_id || "",
      pincode: row.pincode || "",
      minimum_free_delivery_order_amount: row.minimum_free_delivery_order_amount,
      delivery_charges: row.delivery_charges,
      estimated_delivery_days: row.estimated_delivery_days,
      is_cod_available: row.is_cod_available ?? true,
      is_deliverable: row.is_deliverable ?? true,
      // ⚠️ Backend field is "status" not "active"
      status: row.status ?? true,
    });
    setShowModal(true);
  };

  const handleFilterChange = (key, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Table Columns ───────────────────────────────────────────────────────────

  const columns = [
    { key: "name", label: "Area Name", sortable: true },
    {
      key: "city_id",
      label: "City",
      render: (city) => city?.name || "N/A",
    },
    {
      key: "pincode",
      label: "PIN Code",
      render: (pincode, row) => pincode || row.zipcode_id?.zipcode || "N/A",
    },
    {
      key: "minimum_free_delivery_order_amount",
      label: "Min Free Amount",
      render: (amount) => `₹${amount ?? 0}`,
    },
    {
      key: "delivery_charges",
      label: "Delivery Charges",
      render: (charges) => `₹${charges ?? 0}`,
    },
    {
      key: "estimated_delivery_days",
      label: "Delivery Days",
      render: (days) => (days ? `${days} day${days > 1 ? "s" : ""}` : "—"),
    },
    {
      key: "is_cod_available",
      label: "COD",
      render: (cod) => (cod ? "✅ Yes" : "❌ No"),
    },
    {
      // ⚠️ Backend uses "status" not "active"
      key: "status",
      label: "Status",
      render: (status, row) => (
        <button
          onClick={() => toggleActive(row._id)}
          className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
            status
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </button>
      ),
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
        <h1 className="text-2xl font-bold text-gray-800">Areas Management</h1>
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
            + Add Area
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

        {/* Status Filter */}
        <select
          value={filters.active}
          onChange={(e) => handleFilterChange("active", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* PIN Code Search */}
        <input
          type="text"
          placeholder="Search by Area Name / PIN Code"
          value={filters.pincode}
          onChange={(e) => handleFilterChange("pincode", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={areas}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        onRowSelect={setSelectedRows}
        selectedRows={selectedRows}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingArea ? "Edit Area" : "Add New Area"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Area Name */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                Area Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Colaba"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city_id: e.target.value,
                    zipcode_id: "",
                    pincode: "",
                  })
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

            {/* PIN Code (zipcode dropdown — loads after city selected) */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                PIN Code
              </label>
              <select
                value={formData.zipcode_id}
                onChange={(e) => {
                  const selectedZipcode = zipcodes.find(
                    (z) => z._id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    zipcode_id: e.target.value,
                    pincode: selectedZipcode?.zipcode || "",
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                disabled={!formData.city_id}
              >
                <option value="">
                  {formData.city_id ? "Select PIN Code" : "Select City first"}
                </option>
                {zipcodes.map((zipcode) => (
                  <option key={zipcode._id} value={zipcode._id}>
                    {zipcode.zipcode}{" "}
                    {!zipcode.is_deliverable ? "(Not Deliverable)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Free Delivery Amount */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                Min Free Delivery Amount (₹)
              </label>
              <input
                type="number"
                value={formData.minimum_free_delivery_order_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimum_free_delivery_order_amount: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            {/* Delivery Charges */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                Delivery Charges (₹)
              </label>
              <input
                type="number"
                value={formData.delivery_charges}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    delivery_charges: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            {/* Estimated Delivery Days */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                Estimated Delivery Days
              </label>
              <input
                type="number"
                value={formData.estimated_delivery_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_delivery_days: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_cod_available}
                  onChange={(e) =>
                    setFormData({ ...formData, is_cod_available: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">COD Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_deliverable}
                  onChange={(e) =>
                    setFormData({ ...formData, is_deliverable: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Deliverable</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  // ⚠️ Backend field is "status" not "active"
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Active</span>
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
              {editingArea ? "Update" : "Create"}
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
          {
            name: "Colaba",
            city_id: "PASTE_CITY_ID_HERE",
            zipcode_id: "PASTE_ZIPCODE_ID_HERE",
            pincode: "400001",
            minimum_free_delivery_order_amount: 200,
            delivery_charges: 40,
            estimated_delivery_days: 2,
            is_cod_available: true,
            is_deliverable: true,
            status: true,
          },
        ]}
        entityName="Areas"
      />
    </div>
  );
};

export default Areas;