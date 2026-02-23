"use client";

import React, { useState, useEffect } from "react";
import { cityService } from "@/API/CityAPI";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Model";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
// import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

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

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await cityService.getCities(
        pagination.currentPage,
        10,
        searchTerm,
      );

      setCities(response?.cities || []);

      setPagination((prev) => ({
        ...prev,
        ...response?.pagination,
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCity) {
        await cityService.updateCity(editingCity._id, formData);
      } else {
       const creatCirty =  await cityService.createCity(formData);

       console.log("creatCirty", creatCirty)
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
        await cityService.bulkDeleteCities(selectedRows);
        setSelectedRows([]);
        fetchCities();
      } catch (error) {
        console.error("Error bulk deleting cities:", error);
      }
    }
  };

  const handleBulkUpload = async (cities) => {
    try {
      await cityService.bulkUploadCities(cities);
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

  const columns = [
    { key: "name", label: "City Name", sortable: true },
    {
      key: "createdAt",
      label: "Created At",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingCity(row);
              setFormData({ name: row.name });
              setShowModal(true);
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            {/* <PencilIcon className="w-5 h-5" /> */}
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-900"
          >
            {/* <TrashIcon className="w-5 h-5" /> */}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cities Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            {/* <PlusIcon className="w-5 h-5 mr-2" /> */}
            Bulk Upload
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            {/* <PlusIcon className="w-5 h-5 mr-2" /> */}
            Add City
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={cities}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) =>
          setPagination({ ...pagination, currentPage: page })
        }
        onRowSelect={setSelectedRows}
        selectedRows={selectedRows}
        onBulkDelete={handleBulkDelete}
      />

      {/* Create/Edit Modal */}
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
            <label className="block text-gray-700 mb-2">City Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        entityName="cities"
      />
    </div>
  );
};

export default Cities;
