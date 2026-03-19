"use client";

import React, { useState, useEffect } from "react";
import { cityService } from "@/API/CityAPI";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Model";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
import { Pencil, Trash2 } from "lucide-react";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchCities();
  }, [pagination.currentPage, searchTerm]);

  // ─── Data Fetching ───────────────────────────────────────────────────────────

  const fetchCities = async () => {
    setLoading(true);
    try {
      // GET /cities?page=1&limit=10&search=...
      const response = await cityService.getCities(
        pagination.currentPage,
        10,
        searchTerm
      );
      setCities(response?.cities || []);
      setPagination((prev) => ({
        ...prev,
        ...(response?.pagination || {}),
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCity) {
        // PUT /cities/:id
        await cityService.updateCity(editingCity._id, formData);
      } else {
        // POST /cities
        await cityService.createCity(formData);
      }
      fetchCities();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving city:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        // DELETE /cities/:id
        await cityService.deleteCity(id);
        fetchCities();
      } catch (error) {
        console.error("Error deleting city:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Delete ${selectedRows.length} cities?`)) {
      try {
        // Individual DELETE calls (no bulk delete route in backend)
        await cityService.bulkDeleteCities(selectedRows);
        setSelectedRows([]);
        fetchCities();
      } catch (error) {
        console.error("Error bulk deleting cities:", error);
      }
    }
  };

  const handleBulkUpload = async (citiesList) => {
    try {
      // POST /cities/bulk-city  →  body: { cities: [...] }
      await cityService.bulkUploadCities(citiesList);
      setShowBulkModal(false);
      fetchCities();
    } catch (error) {
      console.error("Error bulk uploading cities:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingCity(null);
  };

  const handleSearchChange = (e) => {
    // Reset to page 1 when searching
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSearchTerm(e.target.value);
  };

  // ─── Table Columns ───────────────────────────────────────────────────────────

  const columns = [
    { key: "name", label: "City Name", sortable: true },
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
            onClick={() => {
              setEditingCity(row);
              setFormData({ name: row.name });
              setShowModal(true);
            }}
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
        <h1 className="text-2xl font-bold text-gray-800">Cities Management</h1>
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
            + Add City
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cities..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={cities}
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
        title={editingCity ? "Edit City" : "Add New City"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              City Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city name"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
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
              {editingCity ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onUpload={handleBulkUpload}
        template={[{ name: "Mumbai" }, { name: "Pune" }]}
        entityName="Cities"
      />
    </div>
  );
};

export default Cities;