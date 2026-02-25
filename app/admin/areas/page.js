"use client";

import React, { useState, useEffect } from "react";
import { areaService } from "@/API/areaAPI";
import { cityService } from "@/API/CityAPI";
import { zipcodeService } from "@/API/zipcodeAPI";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Model";
import BulkUploadModal from "@/components/admin/BulkUploadModal";
// import { PencilIcon, TrashIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [zipcodes, setZipcodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
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
    active: true,
  });
  const [filters, setFilters] = useState({
    city_id: "",
    active: "",
    pincode: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchAreas();
    fetchCities();
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    if (formData.city_id) {
      fetchZipcodesByCity(formData.city_id);
    }
  }, [formData.city_id]);

 const fetchAreas = async () => {
  setLoading(true);
  try {
    const response = await areaService.getAreas(
      pagination.currentPage,
      10,
      filters
    );

    console.log("Areas Response", response);

    setAreas(response?.data?.areas || []);
    setPagination(
      response?.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    );

  } catch (error) {
    console.error("Error fetching areas:", error);
    setAreas([]); // safety
  } finally {
    setLoading(false);
  }
};

  const fetchCities = async () => {
    try {
      const response = await cityService.getCities(
        pagination.currentPage,
        10,
        searchTerm,
      );
      console.log("response cities", response);
      setCities(response.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchZipcodesByCity = async (cityId) => {
    try {
      const response = await zipcodeService.getZipcodesByCity(cityId);
      console.log("Zipcode", response)
      setZipcodes(response.data);
    } catch (error) {
      console.error("Error fetching zipcodes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArea) {
        await areaService.updateArea(editingArea._id, formData);
      } else {
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
        await areaService.deleteArea(id);
        fetchAreas();
      } catch (error) {
        console.error("Error deleting area:", error);
      }
    }
  };

  const handleBulkUpload = async (areas) => {
    try {
      await areaService.bulkUploadAreas(areas);
      setShowBulkModal(false);
      fetchAreas();
    } catch (error) {
      console.error("Error bulk uploading areas:", error);
    }
  };

  const toggleActive = async (id, currentStatus) => {
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
      active: true,
    });
    setEditingArea(null);
    setZipcodes([]);
  };

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
      render: (amount) => `₹${amount}`,
    },
    {
      key: "delivery_charges",
      label: "Delivery Charges",
      render: (charges) => `₹${charges}`,
    },
    {
      key: "estimated_delivery_days",
      label: "Delivery Days",
      render: (days) => `${days} day${days > 1 ? "s" : ""}`,
    },
    {
      key: "is_cod_available",
      label: "COD",
      render: (cod) => (cod ? "✅ Yes" : "❌ No"),
    },
    {
      key: "active",
      label: "Status",
      render: (active, row) => (
        <button
          onClick={() => toggleActive(row._id, active)}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            active
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingArea(row);
              setFormData({
                name: row.name,
                city_id: row.city_id?._id,
                zipcode_id: row.zipcode_id?._id,
                pincode: row.pincode,
                minimum_free_delivery_order_amount:
                  row.minimum_free_delivery_order_amount,
                delivery_charges: row.delivery_charges,
                estimated_delivery_days: row.estimated_delivery_days,
                is_cod_available: row.is_cod_available,
                is_deliverable: row.is_deliverable,
                active: row.active,
              });
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
        <h1 className="text-2xl font-bold text-gray-800">Areas Management</h1>
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
            Add Area
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={filters.city_id}
          onChange={(e) => setFilters({ ...filters, city_id: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          value={filters.active}
          onChange={(e) => setFilters({ ...filters, active: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <input
          type="text"
          placeholder="Filter by PIN Code"
          value={filters.pincode}
          onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={areas}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) =>
          setPagination({ ...pagination, currentPage: page })
        }
        onRowSelect={setSelectedRows}
        selectedRows={selectedRows}
      />

      {/* Create/Edit Modal */}
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
            <div>
              <label className="block text-gray-700 mb-2">Area Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">City</label>
              <select
                value={formData.city_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city_id: e.target.value,
                    zipcode_id: "",
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div>
              <label className="block text-gray-700 mb-2">PIN Code</label>
              <select
                value={formData.zipcode_id}
                onChange={(e) => {
                  const selectedZipcode = zipcodes.find(
                    (z) => z._id === e.target.value,
                  );
                  setFormData({
                    ...formData,
                    zipcode_id: e.target.value,
                    pincode: selectedZipcode?.zipcode || "",
                  });
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.city_id}
              >
                <option value="">Select PIN Code</option>
                {zipcodes.map((zipcode) => (
                  <option key={zipcode._id} value={zipcode._id}>
                    {zipcode.zipcode}{" "}
                    {zipcode.is_deliverable ? "" : "(Not Deliverable)"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_cod_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_cod_available: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-gray-700">COD Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_deliverable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_deliverable: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-gray-700">Deliverable</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
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
            city_id: "city_id_here",
            zipcode_id: "zipcode_id_here",
            pincode: "400001",
            minimum_free_delivery_order_amount: 200,
            delivery_charges: 40,
            estimated_delivery_days: 2,
            is_cod_available: true,
            is_deliverable: true,
            active: true,
          },
        ]}
        entityName="areas"
      />
    </div>
  );
};

export default Areas;
